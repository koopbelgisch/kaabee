import config from "config";
import { compileFile } from "pug";
import { Transporter, TestAccount, createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";

import { User } from "../models/user";
import env from "./env";

let mailer: Transporter | null = null;
let testAccount: TestAccount | null;

async function getMailer(): Promise<Transporter> {
  if (mailer === null) {
    let options;
    if (!config.has("smtp.user")) {
      if(env.isProd) throw new Error("smpt credentials not available");
      testAccount = await createTestAccount();
      options = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        }
      };
    } else {
      options = {
        host: config.get("smtp.host") as string,
        port: config.get("smtp.port") as number,
        auth: {
          user: config.get("smtp.user") as string,
          pass: config.get("smtp.pass") as string,
        }
      };
    }
    mailer = createTransport(options, { from: config.get("smtp.from") });
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
export async function sendEmailConfirmation(user: User): Promise<void> {
  const html = confirmationTemplate({
    user: user,
    url: `${config.get("app.defaultURL")}/auth/email/confirm/${user.emailToken}`
  });
  return mail({ to: user.email, subject: "[Kaabee] Bevestig je email", html });
}

