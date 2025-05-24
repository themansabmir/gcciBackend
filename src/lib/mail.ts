// lib/mailer.service.ts
import nodemailer, { Transporter } from 'nodemailer';

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
  host: 'smtp-relay.brevo.com',
  port: 587,
  user: 'your-smtp-user',
  pass: 'your-smtp-password',
  from: 'Your App <no-reply@yourapp.com>',
});