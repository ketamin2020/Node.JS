const nodemailer = require("nodemailer");

async function emailVerificationSender(acceptingMail, token) {
  const transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: acceptingMail,
    subject: "Hello from GOIT",
    html: `<a href='http://localhost:3000/api/auth/verify/${token}'>Click to verify</a>`,
  });
}

module.exports = emailVerificationSender;
