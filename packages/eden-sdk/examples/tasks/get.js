import eden from '../init_eden.js'

const config = {
  taskId: '0b74fb4091aa9ec9fcb9039d6e9de30c5b1e97b9863225ad'
}

const result = await eden.tasks.get(config);

console.log(result)