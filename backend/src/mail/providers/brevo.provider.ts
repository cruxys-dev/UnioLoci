import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Brevo from '@getbrevo/brevo';
import { MailProvider } from './mail.provider';

@Injectable()
export class BrevoProvider implements MailProvider {
  private api = new Brevo.TransactionalEmailsApi();

  constructor(private configService: ConfigService) {
    this.api.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('BREVO_API_KEY')!,
    );
  }

  async send({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.api.sendTransacEmail({
      to: [{ email: to }],
      subject,
      htmlContent: html,
      sender: {
        email:
          this.configService.get<string>('MAIL_FROM_EMAIL') ||
          'no-reply@unioloci.com',
        name: this.configService.get<string>('MAIL_FROM_NAME') || 'Unioloci',
      },
    });
  }
}
