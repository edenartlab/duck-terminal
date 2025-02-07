const eden = require('../init_eden.js')

async function run() {
  try {
    const result = await eden.generators.listV2();
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

run()