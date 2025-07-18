import nodemailer from 'nodemailer';

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '5f1d9a0a20dc05',
    pass: '9ae638291f44b5',
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
