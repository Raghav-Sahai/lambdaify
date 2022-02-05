const Response = require('../src/Response')

const albEvent = require('./fixtures/albEvent.json')

const standardize = require('../src/utils/standardize')
const standardizeEvent = standardize.standardizeEvent
const standardizeContext = standardize.standardizeContext

const standardContext = standardizeContext({})
const standardEvent = standardizeEvent(albEvent)

describe('Response()', () => {
    const _response = new Response(standardEvent, standardContext)
    describe('When a response is created', () => {
        it('Then the default _request.event is the standardEvent', () => {
            expect(_response.event).toStrictEqual(standardEvent)
        })
        it('Then default _request.context is the standardContext', () => {
            expect(_response.context).toStrictEqual(standardContext)
        })
        it('Then default _request.isResponseSent is false', () => {
            expect(_response.isResponseSent).toBe(false)
        })
        it('Then default _request.multiValueHeaders is {}', () => {
            expect(_response.multiValueHeaders).toStrictEqual({})
        })
        it('Then default _request.cookies is []', () => {
            expect(_response.cookies).toStrictEqual([])
        })
        it('Then default _request.isBase64Encoded is false', () => {
            expect(_response.isBase64Encoded).toBe(false)
        })
        it('Then default _request.statusCode is 200', () => {
            expect(_response.statusCode).toBe(200)
        })
        it('Then default _request.headers is {}', () => {
            expect(_response.headers).toStrictEqual({})
        })
        it('Then default _request.body is null', () => {
            expect(_response.body).toBe(null)
        })
        it('Then default _request.serializer is null', () => {
            expect(_response.serializer).toBe(null)
        })
        describe('send()', () => {
            const _response = new Response(standardEvent, standardContext)
            describe('When _response.send() is called with a body', () => {
                _response.send('Send this body!')
                it('Then _response.body is the body', () => {
                    expect(_response.body).toBe('Send this body!')
                })
                it('Then _response.isResponseSent is true', () => {
                    expect(_response.isResponseSent).toBe(true)
                })
            })
            describe('When _response.send() is called when isResponseSent is already true', () => {
                const _response = new Response(standardEvent, standardContext)
                _response.send('send once')
                it('Then an error is thrown', () => {
                    expect(() => _response.send('send twice')).toThrow(
                        'Response was already sent'
                    )
                })
            })
        })
        describe('cookie()', () => {
            const _response = new Response(standardEvent, standardContext)
            describe('When _response.cookie() is called with a cookie', () => {
                _response.cookie('Set this cookie!')
                it('Then _response.cookie is the cookie', () => {
                    expect(_response.cookies).toStrictEqual([
                        'Set this cookie!',
                    ])
                })
            })
            describe('When _response.cookie() is called with a non string cookie', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.cookie(true)).toThrow(
                        'Cookie must be of type string'
                    )
                })
            })
        })
        describe('header()', () => {
            describe('When _response.header is called with a valid key/value pair', () => {
                const _response = new Response(standardEvent, standardContext)
                _response.header('set-key', 'set-value')
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'set-key': 'set-value',
                    })
                })
                it('Then _response.multiValueHeaders is still an empty object', () => {
                    expect(_response.multiValueHeaders).toStrictEqual({})
                })
            })
            describe('When _response.header is called with a valid upper case key/value pair', () => {
                const _response = new Response(standardEvent, standardContext)
                _response.header('UPPER-VALUE-KEY', 'UPPER-VALUE')
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'upper-value-key': 'UPPER-VALUE',
                    })
                })
                it('Then _response.multiValueHeaders is still an empty object', () => {
                    expect(_response.multiValueHeaders).toStrictEqual({})
                })
            })
            describe('When _response.header is called with a multiValueHeader', () => {
                const _response = new Response(standardEvent, standardContext)
                _response.header('set-key', ['value1', 'value2'])
                it('Then _response.headers to be an empty object', () => {
                    expect(_response.headers).toStrictEqual({})
                })
                it('Then _response.multiValueHeaders has the new header', () => {
                    expect(_response.multiValueHeaders).toStrictEqual({
                        'set-key': ['value1', 'value2'],
                    })
                })
            })
        })
        describe('serializer()', () => {})
        describe('code()', () => {
            const _response = new Response(standardEvent, standardContext)
            describe('When _response.code() is called with a status code', () => {
                _response.code(300)
                it('Then _response.statusCode is the set code', () => {
                    expect(_response.statusCode).toBe(300)
                })
            })
            describe(' _response.code() is called with an invalid status code', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.code(4)).toThrow(
                        'Invalid status code'
                    )
                })
            })
        })
        describe('status()', () => {
            const _response = new Response(standardEvent, standardContext)
            describe('When _response.status() is called with a status code', () => {
                _response.status(300)
                it('Then _response.statusCode is the set code', () => {
                    expect(_response.statusCode).toBe(300)
                })
            })
            describe(' _response.status() is called with an invalid status code', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.status(4)).toThrow(
                        'Invalid status code'
                    )
                })
            })
        })
    })
})
