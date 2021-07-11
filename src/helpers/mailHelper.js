const nodemailer = require('nodemailer')
const Mailgen = require('mailgen');

require('dotenv').config()

const mailTemplateCreate = (verificationToken) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Contacts Book',
      link: `http://localhost:${process.env.PORT}`
    }
  });

  const emailTemplate = {
    body: {
      name: 'Guest',
      intro: 'Welcome to Contacts Book! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with Contacts Book, please click here:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link: `http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}`
        }
      },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };

  const emailBody = mailGenerator.generate(emailTemplate)
  return emailBody
}

const sendEmail = async(verificationToken, email) => {
  const emailBody = mailTemplateCreate(verificationToken)
  const config = {
    host: 'i.ua',
    port: 995,
    auth: {
      user: process.env.SENDER_EMAIL_FROM,
      pass: '5661956'

    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  }
  const transporter = nodemailer.createTransport(config)

  const emailOptions = {
    from: 'noreply@contactsbook.com',
    to: email,
    subject: 'Account verification',
    html: emailBody
  }

  transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err))
}

module.exports = { sendEmail }
