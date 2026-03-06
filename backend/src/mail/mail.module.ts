import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BrevoProvider } from './providers/brevo.provider';
import { MAIL_PROVIDER, MAIL_QUEUE } from './mail.constants';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { MailProcessor } from './providers/mail-processor.provider';

@Module({
  imports: [ConfigModule, BullModule.registerQueue({ name: MAIL_QUEUE })],
  providers: [
    MailService,
    MailProcessor,
    {
      provide: MAIL_PROVIDER,
      useClass: BrevoProvider, // Change this to use different providers
    },
  ],
  exports: [MailService, BullModule],
})
export class MailModule {}
