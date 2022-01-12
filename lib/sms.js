// require('dotenv').config()
// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// const number = process.env.TWILIO_NUMBER

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// const message = 'Parkbot SMS alert'

async function sms (body, number) {
  client.messages
    .create({
      from: process.env.TWILIO_NUMBER,
      to: number,
      body
    })
    .then(message => console.log(message))
    .catch(error => console.log(error))
}

// sms('Parkbot SMS alert', '+393401030746')

async function smsMultipack (body, numbers) {
  Promise.all(
    numbers.map(number => {
      return client.messages.create({
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        to: number,
        body
      })
    })
  )
    .then(messages => console.log(messages))
    .catch(err => console.error(err))
}

// smsMultipack('Parkbot SMS alert', ['+393401030746', '+393342034752'])

module.exports = {
  sms,
  smsMultipack
}
