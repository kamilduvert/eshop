const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY
  })
);

const sendConfirmationEmail = (user, url) => {
  transport.sendMail({
    from: 'kduvert@gmail.com',
    to: `${user.name} <${user.email}>`,
    subject: 'Confirmation Email',
    html: `confirmation Email <a href=${url}>${url}</a>`
  }).then( () => {
    console.log("Email sent");
  }).catch(error => {
    // Log friendly error
    console.error(error);

    if (error.response) {
      // Extract error msg
      const {message, code, response} = error;
      // Extract response msg
      const {headers, body} = response;
      console.error(body);
    }
  });
}

exports.sendConfirmationEmail = sendConfirmationEmail;
