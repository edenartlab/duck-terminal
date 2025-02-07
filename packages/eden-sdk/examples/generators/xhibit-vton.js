const eden = require('../init_eden.js')

// const task = {
//   workflow: 'xhibit/vton',
//   args: {
//     prompt: 'a professional photo of Vanessa as a fashion model',
//     look_image: 'https://www.refinery29.com/images/11118508.jpg',
//     lora: 'https://edenartlab-stage-data.s3.amazonaws.com/1190777f9d3337e2202fd0a27fc9e1c048a094d90e86f7d135bb21e09c9a2e15.tar',
//   },
// }

const task = {
  tool: 'xhibit/vton',
  args: {
    prompt: 'a professional photo of <concept> as a fashion model, runway, cat walk',
    look_image: 'https://i.pinimg.com/236x/e4/af/3f/e4af3fefdf4777cef1d584e379b12791.jpg',
    lora: '665fc0371b2e7f3691aaac24',

    // look_image: 'https://www.refinery29.com/images/11118508.jpg',
    // lora: 'https://edenartlab-stage-data.s3.amazonaws.com/1190777f9d3337e2202fd0a27fc9e1c048a094d90e86f7d135bb21e09c9a2e15.tar',
  },
}

async function createTask() {
  try {
    const result = await eden.createV2(task)
    console.log(result)
  } catch (error) {
    console.error(error)
  } finally {
    console.log('Done')
  }
}

createTask()