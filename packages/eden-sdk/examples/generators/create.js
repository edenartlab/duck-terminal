const eden = require('../init_eden.js')

const config = {
  text_input: "Garden of Eden"
}

const input = {
  generatorName: "create",
  config
}

async function createTask() {
  try {
    const result = await eden.create(input);
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('finally');
  }
}

createTask();