# Lambdaify (WIP)

Create lambda apis easily

- inspired by [Fastify](https://github.com/fastify/fastify) and [lambda-api](https://github.com/jeremydaly/lambda-api)

## Project setup

```js
const lambdaify = require('lambdaify')()

lambdaify.get('/get/:id', (req, res) => {
    return res.send('lambdaify!').code(201)
})

const handler = async (event, context) => {
    return await lambdaify.run(event, context);
};
```
