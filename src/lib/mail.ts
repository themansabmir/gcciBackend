// lib/mailer.service.ts
import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from '../config/env';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class MailerService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(options: { host: string; port: number; user: string; pass: string; from: string }) {
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
    return this.transporter.sendMail({
      from: from || this.defaultFrom,
      to,
      subject,
      html,
    });
  }
}

export const mailer = new MailerService({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  user: EMAIL_USER,
  pass: EMAIL_PASS,
  from: EMAIL_USER || 'no-reply@gcci.com',
});
