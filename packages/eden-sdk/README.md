# Eden SDK

A thin wrapper around the Eden REST API. Inspect methods.ts for all available methods.

### Creating an Eden instance

```js
import { EdenClient } from "@edenlabs/eden-sdk";

const apiKey = 'YOUR_API_KEY';

const eden = new EdenClient({ apiKey });
```

### Making a creation

Submit a task and await creation result

```js
const input = {
  tool: "flux_dev",
  args: {
    prompt: "Garden of Eden"
  }
}

const result = await eden.createV2(input);
```

Submit a task and return task data immediately, without waiting for creation result

```js
const input = {
  tool: "flux_dev",
  args: {
    prompt: "Garden of Eden"
  }
}

const result = await eden.createV2(input, false);
```

### Creations 

Get a single creation by id

```js
const creation = await eden.creations.getV2({creationId: '1234567890'})
```


### Tasks 

Get a single task by id

```js
const task = await eden.tasks.getV2({taskId: '1234567890'})
```

Get paginated list of tasks

```js
const tasks = await eden.tasks.listV2();
```

Get paginated list of tasks filterd by tool and status 

```js
const tasks = await eden.tasks.listV2({ tool: 'flux_dev', status: 'pending' });
```


### Tools 

To get a list of all the tools available:

```js
const tools = await eden.tools.list();
```

Get a single tool by key

```js
const tool = await eden.tools.get({key: 'flux_dev});
```


### Uploading an image

```js
import fs from 'fs'

const filepath = `${__dirname}/test.png`
const media = await fs.readFileSync(filepath)

const result = await eden.media.upload({ media })
```


### Examples

See examples/ for more (*V2.js)