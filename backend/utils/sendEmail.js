// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer')


const sendEmail = async (options) => {

  // 1) create transporter 
  const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  // 2) Define email options 
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  // 3) send email
  await transporter.sendMail(mailOptions)

}




module.exports = sendEmail;
