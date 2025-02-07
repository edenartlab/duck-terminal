const eden = require('../init_eden.js')
const fs = require('fs')
// const { fileURLToPath } = require('url')
// const { dirname } = require('path')
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

async function run() {
  try {
    const filepath = `${__dirname}/images/test.jpeg`
    const media = await fs.readFileSync(filepath)
    const result = await eden.media.upload({ media })
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

run()