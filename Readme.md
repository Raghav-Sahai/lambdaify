# Lambdaify (WIP)

Create lambda apis easily

- inspired by [Fastify](https://github.com/fastify/fastify) and [lambda-api](https://github.com/jeremydaly/lambda-api)

## Usage

```js
// Initialize app
const lambdaify = require('lambdaify')()

// Register route
lambdaify.get('/get/:id', (req, res) => {
    return res
        .code(200)
        .header("key", "value")
        .send('hello from lambdaify!')
})

// Execute event
exports.handler = (event, context) => {
    return lambdaify.run(event, context);
};
```

## Registering Routes

GET, PUT, POST, and DELETE methods can be registered by invoking the convenience methods on the app.  

To add a route, simply provide a path and callback.  The path must be a string.  To indicate a path parameter, prefix the ontology with a `:`.  The callback must be a function that accepts two params, req and res.

Example usage is below

```js
const lambdaify = require('lambdaify')()

lambdaify.get('/get', (req, res) => {
    return res.send('get example')
})

lambdaify.post('/post', (req, res) => {
    return res.send('post example')
})

// 'id' is a path param whose value can be accessed using req.id
lambdaify.put('/put/:id', (req, res) => {
    return res.send('put example')
})

// 'id' and 'index' are path params whose values can be accessed using req.params.id and req.params.index
lambdaify.put('/delete/:id/:index', (req, res) => {
    return res.send('put example')
})
```

## Request Interface

- `req.raw`: (object) Returns the raw alb event 
- `req.method`: (string) Returns the http verb of the event
- `req.path`: (string) Returns the raw path of the event
- `req.queryStringParameters`: (object) Returns the query path params of the event
- `req.headers`: (object) Returns the headers of the event
- `req.body`: (string) Returns the body of the event
- `req.isBase64Encoded`: (boolean) Returns a boolean detailing the base64Encoded status of the event
- `req.params`: (object) Returns the path params of the event

## Response Interface

- `res.send()`: Sets the response body.  This should only be called once.  If `send` is called in the context of middleware, the execution stack will break and the response will be returned immediately.
  ```js
  res.send({ test: 'response' })
  ```

- `res.header() | res.setHeader()`: Sets a header key value pair.  NOTE: Header keys will be converted to lowercase.
  ```js
  res.header('key', 'value')
  ```

- `res.setSerializer()`: Sets a serializer function that will be used to parse the response before it is sent.  If no serializer is defined, body will be stringified.  NOTE: If base64Encoding is defined, encoding will happen after body has been serialized
  ```js
  res.setSerializer(() => 'serializer')
  ```

- `res.code() | res.status()`: Sets status code for the response.  Status codes must be an integer between 100-600
  ```js
  res.code(200) | res.status(200)
  ```

- `res.encodeBase64`: base64 encodes response body
  ```js
  res.encodeBase64()
  ```

## Middlewares

Currently, you can only add global middleware.  Method based and error middleware is to come soon!

To add global middleware

```js
const lambdaify = require('lambdaify')()

const middleware = (req, res, next) => {
    res.send('Middleware')
}

lambdaify.use(middleware)
```

Global middleware will be executed before route handlers and will be executed in the order they were added.