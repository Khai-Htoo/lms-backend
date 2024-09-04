import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import ejs from "ejs";
export const sendMsg = async (email, html, data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    service: "gmail",
    auth: {
      user: "yme9891@gmail.com",
      pass: "qtusatfqllcxoppq",
    },
  });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const template = await ejs.renderFile(
    path.join(__dirname, `../mail/${html}`),
    data
  );
  await transporter.sendMail({
    from: '"Kdemy 👻" <yme9891@gmail.com>', // sender address
    to: email,
    subject: "Hello I am from Kdemy ✔",
    text: "Hello " + data.user.name,
    html: template,
  });
};
