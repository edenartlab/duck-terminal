const eden = require('../init_eden.js')

const config = {
  // taskId: '0b74fb4091aa9ec9fcb9039d6e9de30c5b1e97b9863225ad'
  // status: ['running'],
  tool: 'xhibit/vton'
}

async function run() {
  try {
    const result = await eden.tasks.listV2(config);
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

run()