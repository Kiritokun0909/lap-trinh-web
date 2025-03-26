const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `Manga Website ${EMAIL_USER}`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendMail };
