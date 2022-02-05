# Lambdaify (WIP)

Create lambda apis easily

- inspired by [Fastify](https://github.com/fastify/fastify) and [lambda-api](https://github.com/jeremydaly/lambda-api)

## Example Project setup

```js
const lambdaify = require('lambdaify')()

lambdaify.get('/get/:id', (req, res) => {
    return res
            .code(200)
            .header("key", "value")
            .send('hello from lambdaify!')
})

const handler = (event, context) => {
    return lambdaify.run(event, context);
};
```
