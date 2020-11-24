const nodemailer = require('nodemailer');

const mailOptions = {
  from: 'anuraggupta93.iitdhn@gmail.com',
  to: '2893ag@gmail.com', // Enter your mail
  subject: 'Search Dashboard Profile',
  html:
    '<h3>Thank you for using LinkedIn Scrapper</h3><p>To visit your search board, visit the link given below</p><a href="http://localhost:3000">Click Here</a>',
};

const USER_NAME = process.env.GMAIL_USER_NAME;
const PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: USER_NAME,
    pass: PASSWORD,
  },
});

module.exports = {
  transporter,
  mailOptions,
};
