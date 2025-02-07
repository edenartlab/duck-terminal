const { EdenClient } = require('@edenlabs/eden-sdk')
const dotenv = require('dotenv')
dotenv.config()

// Now you can use the environment variables from your .env file
const apiKey = process.env.EDEN_API_KEY

const eden = new EdenClient({
  edenApiUrl: 'http://localhost:5050',
  apiKey,
})

module.exports = eden
