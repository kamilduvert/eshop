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
    html: 
      `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%; text-align: center; ">
      <h2 style="text-transform: uppercase;color: teal;">Welcome to the E-SHOP</h2>
      <p style="text-align: left;">Congratulations! You're almost set to start using our services.
          Just click the button below to validate your email address.
      </p>
      
      <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Confirmer</a>

      <p>See you soon !</p>
      </div>`
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
