require('dotenv').config()
const http = require('http')
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const sendMail = require('./lib/mail')
// const { sms, smsMultipack } = require('./lib/sms')

const port = process.env.HTTP_PORT || 5000

const server = http.createServer(async (req, res) => {
  try {
    await i18next.use(Backend).init({
      lng: 'en',
      fallbackLng: 'en',
      ns: ['alarms'],
      defaultNS: 'alarms',
      backend: { loadPath: './locales/{{lng}}/{{ns}}.json' }
    })

    const buffers = []

    for await (const chunk of req) {
      buffers.push(chunk)
    }

    const json = Buffer.concat(buffers).toString()
    const data = JSON.parse(json)
    const { aps, alarm, date, device, locale, recipientList } = data

    const t = await i18next.changeLanguage(locale || 'en')
    const body = `${date}: ${device.key} AL${alarm.id} ${t(alarm.key, {
      ns: 'alarms',
      ...alarm.query
    })}`

    const info = await sendMail(aps, body, recipientList)

    // await sms(body, '+393401030746')

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(info))
  } catch (err) {
    throw new Error(err)
  }
})

server.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
