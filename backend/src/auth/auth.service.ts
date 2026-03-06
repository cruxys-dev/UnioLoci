import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { MagicLink } from './entities/magic-link.entity';
import { Session } from './entities/session.entity';
import crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOB, MAIL_QUEUE } from '../mail/mail.constants';
import { responser } from './responser.helper';
import { hash } from './hash.helper';
import type { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MagicLink)
    private readonly magicLinkRepository: Repository<MagicLink>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly configService: ConfigService,
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async magicLink({ email }: LoginDto) {
    let user = await this.userRepository.findOneBy({ email });
    let actionType: MagicLink['actionType'] = 'login';

    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
      actionType = 'register';
    }
    const token = crypto.randomBytes(64).toString('hex');
    const tokenHash = hash(token);

    const magicLink = this.magicLinkRepository.create({
      tokenHash,
      actionType,
      user,
    });

    await this.magicLinkRepository.save(magicLink);

    await this.sendMagicLink(user.email, token, user.name);

    return responser();
  }

  async callback(magicLinkToken: string, req: FastifyRequest) {
    const tokenHash = hash(magicLinkToken);
    const magicLink = await this.magicLinkRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!magicLink) {
      throw new BadRequestException('Magic link not found');
    }

    if (magicLink.expiresAt! < new Date()) {
      throw new BadRequestException('Magic link expired');
    }

    if (magicLink.usedAt) {
      throw new BadRequestException('Magic link already used');
    }

    magicLink.usedAt = new Date();
    await this.magicLinkRepository.save(magicLink);

    await this.sendLoginNotification(
      magicLink.user.email,
      {
        time: new Date().toISOString(),
        browser: req.headers['user-agent'] || 'Unknown',
        ip: req.ip || 'Unknown',
      },
      magicLink.user.name,
    );

    const sessionToken = crypto.randomBytes(64).toString('hex');

    const session = this.sessionRepository.create({
      tokenHash: hash(sessionToken),
      user: magicLink.user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await this.sessionRepository.save(session);

    const payload = {
      sessionId: session.id,
      token: sessionToken,
      user: this.userService.getMe(magicLink.user),
    };
    const jwt = await this.jwtService.signAsync(payload);

    return responser(jwt);
  }

  private async sendMagicLink(to: string, token: string, name: string = '') {
    const url =
      this.configService.get<string>('FRONT_URL') + '/callback?token=' + token;

    await this.mailQueue.add(
      JOB.SEND_EMAIL,
      {
        to,
        subject: 'Magic Link',
        template: 'magic-link',
        context: { url, name },
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );
  }

  private async sendLoginNotification(
    to: string,
    context: { time: string; browser: string; ip: string },
    name: string = '',
  ) {
    await this.mailQueue.add(
      JOB.SEND_EMAIL,
      {
        to,
        subject: 'Login Notification',
        template: 'login-notification',
        context: { ...context, name },
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );
  }

  async logout(sessionId: string) {
    await this.sessionRepository.delete(sessionId);
    return responser();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredSessions() {
    await this.sessionRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
