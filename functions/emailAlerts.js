// const nodemailer = require('nodemailer');
// const logger = require('./logger');

// // Nodemailer transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'galacticwebstore@gmail.com',
//     pass: 'Godbidoof333'
//   }
// });

// // Function to send an email alert when an error occurs
// function sendErrorEmail(error) {
//   let mailOptions = {
//     from: 'galacticwebstore@gmail.com',
//     to: 'galacticwebstore@gmail.com',
//     subject: 'API Endpoint Error',
//     text: `An error occurred: ${error.message}`
//   };

//   transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//       logger.error('Error sending email:', error);
//     } else {
//       logger.info('Email sent:', info.response);
//     }
//   });
// }

// module.exports = { sendErrorEmail };
