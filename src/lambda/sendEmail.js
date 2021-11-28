require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
}

const successCode = 200
const errorCode = 400

// connect to mailgun API
const formData = require("form-data")
const Mailgun = require("mailgun.js")
const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY })

// Netlify function
exports.handler = async event => {
  const data = JSON.parse(event.body)
  const { name, email, message } = data
  const mailOptions = {
    from: `${name} <${email}>`,
    to: "ayan@hotmail.com",
    replyTo: email,
    text: `${message}`,
  }

  // Our Mailgun code
  mg.messages().send(mailOptions, function (error, body) {
    if (error) {
      callback(null, {
        errorCode,
        headers,
        body: JSON.stringify(error),
      })
    } else {
      callback(null, {
        successCode,
        headers,
        body: JSON.stringify(body),
      })
    }
  })
}
