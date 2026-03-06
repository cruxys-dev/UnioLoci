// mail.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail.service';
import { JOB, MAIL_QUEUE } from '../mail.constants';

export type SendEmailOptions = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
  layout?: string;
};
@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job) {
    if (job.name === JOB.SEND_EMAIL) {
      const {
        to,
        subject,
        template,
        context,
        layout = 'base',
      } = job.data as SendEmailOptions;

      // enviar email aquí
      await this.mailService.sendTemplate(
        to,
        subject,
        template,
        context,
        layout,
      );
    }
  }
}
