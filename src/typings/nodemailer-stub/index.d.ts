declare module "nodemailer-stub" {
  import { Transport } from "nodemailer";

  interface NewMail {
    from: string;
    to: string[];
    subject?: string;
    text: string;
  }

  interface LastMail {
    from: string;
    response: Buffer;
    to: string[];
    subject: string;
    contents: string[];
    content: string;
    contentType: string;
    messageId: string;
  }

  export const stubTransport: Transport;
  export namespace interactsWithMail {
    function newMail(mail: NewMail): void;
    function lastMail(): LastMail;
    function flushMails(): void;
    function sentMailsCount(): number;
  }
}
