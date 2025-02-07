const eden = require('../init_eden.js')

const taskId = '665eab82c4dc04af3d0c5c9b' //stg
// const taskId = '66d1c47704836400aad2ab30' //prod

async function run() {
  try {
    const result = await eden.tasks.getV2({ taskId });
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

run()