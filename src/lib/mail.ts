// lib/mailer.service.ts
import nodemailer, { Transporter } from 'nodemailer';
import { Logger } from '@lib/logger';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class MailerService {
  private transporter?: Transporter;
  private defaultFrom?: string;
  private enabled: boolean;

  constructor(options?: { host: string; port: number; user: string; pass: string; from: string }) {
    if (!options || !options.host || !options.port || !options.user || !options.pass || !options.from) {
      this.enabled = false;
      Logger.info('MailerService initialized in disabled mode: SMTP configuration is missing');
      return;
    }

    this.enabled = true;
    this.defaultFrom = options.from;

    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.port === 465, // true for SSL
      auth: {
        user: options.user,
        pass: options.pass,
      },
    });
  }

  async sendMail({ to, subject, html, from }: MailOptions) {
    if (!this.enabled || !this.transporter || !this.defaultFrom) {
      Logger.info('Email not sent because MailerService is disabled or not configured', {
        to,
        subject,
      });
      return;
    }

    try {
      return await this.transporter.sendMail({
        from: from || this.defaultFrom,
        to,
        subject,
        html,
      });
    } catch (error: any) {
      Logger.error('Error sending email', {
        message: error.message,
      });
    }
  }
}

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

export const mailer = new MailerService(
  SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM
    ? {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        user: SMTP_USER,
        pass: SMTP_PASS,
        from: SMTP_FROM,
      }
    : undefined
);
