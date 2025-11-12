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

  constructor(options: { host: string; port: number; secure: boolean; user: string; pass: string; from: string }) {
    this.defaultFrom = options.from;

    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure, // true for SSL (465), false for TLS (587)
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

// 🟢 Updated mailer instance to use Gmail credentials
export const mailer = new MailerService({
  host: 'smtp.gmail.com',
  port: 465, // SSL port
  secure: true,
  user: 'mayowareuben@gmail.com',
  pass: 'dpya ulzk bsvn cevz', // your Gmail App Password
  from: 'FreightDex <mayowareuben@gmail.com>',
});
