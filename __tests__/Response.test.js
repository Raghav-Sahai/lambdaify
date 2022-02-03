const Response = require("../src/Response")

const albEvent = require('./fixtures/albEvent.json')

const standardize = require('../src/utils/standardize')
const standardizeEvent = standardize.standardizeEvent
const standardizeContext = standardize.standardizeContext

const standardContext = standardizeContext({})
const standardEvent = standardizeEvent(albEvent)

describe("Response()", () => {
    describe("When a response is created", () => {
        const _response = new Response(standardEvent, standardContext)
        it("Then the default _request.event is the standardEvent", () => {
            expect(_response.event).toStrictEqual(standardEvent)
        })
        it("Then default _request.context is the standardContext", () => {
            expect(_response.context).toStrictEqual(standardContext)
        })
        it("Then default _request.isResponseSent is false", () => {
            expect(_response.isResponseSent).toBe(false)
        })
        it("Then default _request.multiValueHeaders is {}", () => {
            expect(_response.multiValueHeaders).toStrictEqual({})
        })
        it("Then default _request.cookies is []", () => {
            expect(_response.cookies).toStrictEqual([])
        })
        it("Then default _request.isBase64Encoded is false", () => {
            expect(_response.isBase64Encoded).toBe(false)
        })
        it("Then default _request.statusCode is 200", () => {
            expect(_response.statusCode).toBe(200)
        })
        it("Then default _request.headers is {}", () => {
            expect(_response.headers).toStrictEqual({})
        })
        it("Then default _request.body is null", () => {
            expect(_response.body).toBe(null)
        })
        it("Then default _request.serializer is null", () => {
            expect(_response.serializer).toBe(null)
        })
    })
})