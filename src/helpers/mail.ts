import config from "config";
import { compileFile } from "pug";
///<reference types="../typings/nodemailer-stub" />
import { stubTransport } from "nodemailer-stub";
import {
  Transporter,
  TestAccount,
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  TransportOptions
} from "nodemailer";

import { User } from "../models/user";
import env from "./env";

let mailer: Transporter | null = null;
let testAccount: TestAccount | null;

async function getMailer(): Promise<Transporter> {
  if (mailer === null) {
    const defaults = { from: config.get("smtp.from") as string };

    if(env.isProd){
      mailer = createTransport({
        host: config.get("smtp.host"),
        port: config.get("smtp.port"),
        auth: {
          user: config.get("smtp.user"),
          pass: config.get("smtp.pass"),
        }
      } as TransportOptions,defaults);

    } else if (env.isTest) {
      mailer = createTransport(stubTransport, defaults);

    } else {
      testAccount = await createTestAccount();
      mailer = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        }
      }, defaults);
    }
  }
  return mailer;
}

export async function mail(
  options: {
    from?: string;
    to: string;
    subject: string;
    html: string;
  }
): Promise<void> {
  const mailer = await getMailer();
  const info = await mailer.sendMail(options);
  console.log("Message sent: %s", info.messageId);
  if (testAccount) {
    console.log("Preview URL: %s", getTestMessageUrl(info));
  }
}

const confirmationTemplate = compileFile(__dirname + "/../../views/mail/emailConfirmation.pug");
export async function sendEmailConfirmation(user: User, baseUrl: string): Promise<void> {
  const html = confirmationTemplate({
    user: user,
    url: `${ baseUrl }/auth/email/confirm/${user.emailToken}`
  });
  return mail({ to: user.email, subject: "[Kaabee] Bevestig je email", html });
}

