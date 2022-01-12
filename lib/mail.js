const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendMail (aps, body, recipientList) {
  const message = {
    from: process.env.SMTP_USER,
    to: recipientList, // ['a@b.com', 'c@d.com'],
    subject: `Parkbot Mailer - ${aps}`,
    html: '<div>' + body + '</div>',
    text: body
  }
  const info = await sgMail.send(message)
  return info
}

module.exports = sendMail
