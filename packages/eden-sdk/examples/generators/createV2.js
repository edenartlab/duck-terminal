const eden = require('../init_eden.js')

const args = {
  prompt: "Garden of Eden V2 FFF",
  // width: 128000,
  // 'images': [
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/e3863a3d1737a7ddb7f8868a46446c42839b042e977af76e755acd21e2a8e4b9.jpeg',
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/fbf80e93ee79fa46049ef62b2a2135e6ee1777b3621ac74e999b126b98d12b32.jpeg',
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/f1fe2141276e22bd7ac991cb6497ffd2f0e49849e667f352d26448a416bc1673.jpeg',
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/2320c5bed84b9d3937da7bc88788c1e7ef3b4306969d8bb1ce3ebc62281d94e3.jpeg',
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/ba50a85456b62c060de3ce7db09945b89b6ccf9338767b048714257ea4a463c1.jpeg',
  //   'https://edenartlab-stage-data.s3-accelerate.amazonaws.com/71c4a2daf18c34294b03b319842aa3fd60d770e8265a719ef1ac4e1d856b12c2.jpeg',
  // ],
  // 'prompt': '4k, sharp details, uhd, sharp focus, high quality, masterpiece',
  // 'negative_prompt': 'nsfw, nude, text, watermark, low resolution, ugly, blurry, out of focus, worst quality, low quality',
  // 'n_frames': 128,
  // 'n_style_images': 6,
  // 'motion_mode': 'concentric_circles',
  // 'motion_scale': 1.05,
  // 'invert_motion': false,
  // 'width': 512,
  // 'height': 512,
}

const input = {
  tool: "flux_dev",
  args: {
     prompt: "Garden of Eden V2 n",
  }
}

async function createTask() {
  try {
    console.log({input});
    const result = await eden.createV2(input);
    console.log({result});
  } catch (error) {
    console.error({error});
  } finally {
    console.log('finally');
  }
}

createTask().then(() => {
  console.log('done')
  process.exit(0)
});