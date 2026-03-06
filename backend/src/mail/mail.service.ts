import { Inject, Injectable } from '@nestjs/common';
import type { MailProvider } from './providers/mail.provider';
import { compileMJML } from './helpers/compile-mjml';
import { renderTemplate } from './helpers/render-hbs';
import { MAIL_PROVIDER } from './mail.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly provider: MailProvider,
    private readonly configService: ConfigService,
  ) {}

  async sendTemplate(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
    layout: string | false = 'base',
  ) {
    const html = renderTemplate(compileMJML(template, layout), {
      year: new Date().getFullYear(),
      termsUrl: this.configService.get<string>('FRONT_URL') + '/terms',
      privacyUrl: this.configService.get<string>('FRONT_URL') + '/privacy',
      ...context,
    });

    await this.provider.send({ to, subject, html });
  }
}
