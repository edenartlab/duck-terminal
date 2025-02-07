const eden = require('../init_eden.js')

const generatorName = 'txt2img'

async function run() {
  try {
    const result = await eden.generators.getV2({ generatorName });
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

run()