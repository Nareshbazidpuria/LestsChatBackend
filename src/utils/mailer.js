import { createTransport } from 'nodemailer'

export const sendEmail = (payload) => {
  const transporter = createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: payload.to,
    subject: payload.subject,
    text: payload.text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
