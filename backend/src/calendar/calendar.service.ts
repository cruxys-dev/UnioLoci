import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { TransferOwnershipDto } from './dto/transfer-ownership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { CalendarMember } from './entities/calendar-members.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(CalendarMember)
    private readonly calendarMemberRepository: Repository<CalendarMember>,
  ) {}

  async create(
    userId: string,
    createCalendarDto: CreateCalendarDto,
  ): Promise<Calendar> {
    const calendar = this.calendarRepository.create({
      ...createCalendarDto,
      creator: { id: userId } as User,
    });

    const savedCalendar = await this.calendarRepository.save(calendar);

    const member = this.calendarMemberRepository.create({
      calendarId: savedCalendar.id,
      userId: userId,
    });

    await this.calendarMemberRepository.save(member);

    return savedCalendar;
  }

  async findAll(userId: string): Promise<Calendar[]> {
    const memberships = await this.calendarMemberRepository.find({
      where: { userId },
      relations: ['calendar', 'calendar.creator'],
    });

    return memberships.map((membership) => membership.calendar);
  }

  async findOne(id: string, userId: string): Promise<Calendar> {
    const membership = await this.calendarMemberRepository.findOne({
      where: { calendarId: id, userId },
      relations: ['calendar', 'calendar.creator'],
    });

    if (!membership) {
      throw new NotFoundException('Calendar not found or you are not a member');
    }

    return membership.calendar;
  }

  async update(
    id: string,
    userId: string,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    const calendar = await this.findOne(id, userId);

    if (calendar.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can edit the calendar');
    }

    Object.assign(calendar, updateCalendarDto);
    return this.calendarRepository.save(calendar);
  }

  async remove(id: string, userId: string): Promise<void> {
    const calendar = await this.findOne(id, userId);

    if (calendar.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can delete the calendar');
    }

    await this.calendarRepository.softDelete(id);
  }

  async join(id: string, userId: string): Promise<Calendar> {
    const calendar = await this.calendarRepository.findOne({ where: { id } });

    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    const membership = await this.calendarMemberRepository.findOne({
      where: { calendarId: id, userId },
    });

    if (membership) {
      throw new BadRequestException(
        'You are already a member of this calendar',
      );
    }

    const newMember = this.calendarMemberRepository.create({
      calendarId: id,
      userId,
    });

    await this.calendarMemberRepository.save(newMember);
    return calendar;
  }

  async leave(id: string, userId: string): Promise<void> {
    const calendar = await this.findOne(id, userId);

    if (calendar.creator.id === userId) {
      throw new ForbiddenException(
        'Creator cannot leave, transfer ownership first or delete calendar',
      );
    }

    await this.calendarMemberRepository.delete({ calendarId: id, userId });
  }

  async transferOwnership(
    id: string,
    userId: string,
    transferOwnershipDto: TransferOwnershipDto,
  ): Promise<Calendar> {
    const calendar = await this.findOne(id, userId);

    if (calendar.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can transfer ownership');
    }

    const targetMembership = await this.calendarMemberRepository.findOne({
      where: { calendarId: id, userId: transferOwnershipDto.newOwnerId },
    });

    if (!targetMembership) {
      throw new BadRequestException(
        'The new owner must be a member of the calendar',
      );
    }

    calendar.creator = { id: transferOwnershipDto.newOwnerId } as User;
    return this.calendarRepository.save(calendar);
  }
}
