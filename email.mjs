import nodemailer from 'nodemailer';

// Looking to send emails in production? Check out our Email API/SMTP product!
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '782f1d4b9c38ff',
    pass: '3cacd5b7ee2573',
  },
});

const sendEmail = async (to, subject, body) => {
  const info = await transport.sendMail({
    from: 'Apple Server <a@apple.com>',
    to,
    subject,
    html: body,
  });
};

export { sendEmail };
