const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const sendEmail = async options => {
  /*
    1) Create a transporter
    2) Define the email options
    3) Actually send the email
    */

  // const transporter =nodemailer.createTransport({
  // service: 'Gmail',
  // auth: {
  //     user: keys.emailUsername,
  //     pass: keys.emailPassword
  // }

  // Activate in gmail "less secure app" option

  const transporter = nodemailer.createTransport({
    host: keys.emailHost,
    port: keys.emailPost,
    auth: {
      user: keys.emailUsername,
      pass: keys.emailPassword
    }
  });

  const mailOptions = {
    from: 'Vuthy Suon <vuthy@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
