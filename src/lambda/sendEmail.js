require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
}

// connect to mailgun API
const formData = require("form-data")
const Mailgun = require("mailgun.js")
const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY })

console.log(process.env.MAILGUN_API_KEY)
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

  try {
    await mg.messages().send(mailOptions)

    return {
      statusCode: 202,
      body: "Message sent",
    }
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500

    return {
      statusCode,
      body: error.message,
    }
  }
}
