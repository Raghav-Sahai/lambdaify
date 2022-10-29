import { Response } from '../src/Response';
import albEvent from './fixtures/albEvent.json';

const context = {};
const event = albEvent;

describe('Response()', () => {
    const _response = new Response(event, context);
    describe('When a response is created', () => {
        describe('When the initial response values are set', () => {
            it('Then the default _request.event is the event', () => {
                expect(_response.event).toStrictEqual(event);
            });
            it('Then default _request.context is the context', () => {
                expect(_response.context).toStrictEqual(context);
            });
            it('Then default _request.isResponseSent is false', () => {
                expect(_response.isResponseSent).toBe(false);
            });
            it('Then default _request.cookies is []', () => {
                expect(_response.cookies).toStrictEqual([]);
            });
            it('Then default _request.isBase64Encoded is false', () => {
                expect(_response.isBase64Encoded).toBe(false);
            });
            it('Then default _request.statusCode is 200', () => {
                expect(_response.statusCode).toBe(200);
            });
            it('Then default _request.headers is {}', () => {
                expect(_response.headers).toStrictEqual({});
            });
            it('Then default _request.body is null', () => {
                expect(_response.body).toBe(null);
            });
            it('Then default _request.serializer is null', () => {
                expect(_response.serializer).toBe(null);
            });
        });
        describe('createResponse', () => {
            describe('When _response.createResponse() is called with default parameters', () => {
                it('Then the correctly formatted response is returned', () => {
                    const _response = new Response(event, context);
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: 'null',
                        isBase64Encoded: false,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
                it('When _response.createResponse() is called after a object body has been set', () => {
                    const _response = new Response(event, context);
                    _response.send({ test: 'body' });
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: '{"test":"body"}',
                        isBase64Encoded: false,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
                it('When _response.createResponse() is called after an array body has been set', () => {
                    const _response = new Response(event, context);
                    _response.send(['body']);
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: '["body"]',
                        isBase64Encoded: false,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
                it('When _response.createResponse() is called after a string body has been set', () => {
                    const _response = new Response(event, context);
                    _response.send('body');
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: 'body',
                        isBase64Encoded: false,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
                it('When _response.createResponse() is called after a serializer function has been set', () => {
                    const _response = new Response(event, context);
                    _response.setSerializer(() => 'serializer');
                    _response.send({ test: 'body' });
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: 'serializer',
                        isBase64Encoded: false,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
                it('When _response.createResponse is called after isBase64Encoded is set to true', () => {
                    const _response = new Response(event, context);
                    _response.encodeBase64();
                    _response.send('Hello world');
                    const formattedResponse = _response.createResponse();
                    expect(formattedResponse).toEqual({
                        headers: {},
                        body: 'SGVsbG8gd29ybGQ=',
                        isBase64Encoded: true,
                        statusCode: 200,
                        statusDescription: 'OK',
                    });
                });
            });
        });
        describe('encodeBase64()', () => {
            const _response = new Response(event, context);
            describe('When _response.encodeBase64() is called', () => {
                _response.encodeBase64();
                it('Then _response.isBase64Encoded is set to true', () => {
                    expect(_response.isBase64Encoded).toBe(true);
                });
            });
        });
        describe('send()', () => {
            const _response = new Response(event, context);
            describe('When _response.send() is called with a body', () => {
                _response.send('Send this body!');
                it('Then _response.body is the body', () => {
                    expect(_response.body).toBe('Send this body!');
                });
                it('Then _response.isResponseSent is true', () => {
                    expect(_response.isResponseSent).toBe(true);
                });
            });
            describe('When _response.send() is called when isResponseSent is already true', () => {
                const _response = new Response(event, context);
                _response.send('send once');
                it('Then an error is thrown', () => {
                    expect(() => _response.send('send twice')).toThrow(
                        'Response was already sent'
                    );
                });
            });
        });
        describe('cookie()', () => {
            const _response = new Response(event, context);
            describe('When _response.cookie() is called with a cookie', () => {
                _response.cookie('Set this cookie!');
                it('Then _response.cookie is the cookie', () => {
                    expect(_response.cookies).toStrictEqual([
                        'Set this cookie!',
                    ]);
                });
            });
            describe('When _response.cookie() is called with a non string cookie', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.cookie(true)).toThrow(
                        'Cookie must be of type string'
                    );
                });
            });
        });
        describe('header()', () => {
            describe('When _response.header is called with a valid key/value pair', () => {
                const _response = new Response(event, context);
                _response.header('set-key', 'set-value');
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'set-key': 'set-value',
                    });
                });
            });
            describe('When _response.header is called with a valid upper case key/value pair', () => {
                const _response = new Response(event, context);
                _response.header('UPPER-VALUE-KEY', 'UPPER-VALUE');
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'upper-value-key': 'UPPER-VALUE',
                    });
                });
            });
            describe('When _response.header is called without a key', () => {
                const _response = new Response(event, context);
                it('Then _response.headers has the new header', () => {
                    expect(() => _response.header(null, 'UPPER-VALUE')).toThrow(
                        'Response Error: req.header must be called with two params, key and value'
                    );
                });
            });
            describe('When _response.header is called without a value', () => {
                const _response = new Response(event, context);
                it('Then _response.headers has the new header', () => {
                    expect(() => _response.header('key', null)).toThrow(
                        'Response Error: req.header must be called with two params, key and value'
                    );
                });
            });
        });
        describe('setHeader()', () => {
            describe('When _response.setHeader is called with a valid key/value pair', () => {
                const _response = new Response(event, context);
                _response.setHeader('set-key', 'set-value');
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'set-key': 'set-value',
                    });
                });
            });
            describe('When _response.setHeader is called with a valid upper case key/value pair', () => {
                const _response = new Response(event, context);
                _response.setHeader('UPPER-VALUE-KEY', 'UPPER-VALUE');
                it('Then _response.headers has the new header', () => {
                    expect(_response.headers).toStrictEqual({
                        'upper-value-key': 'UPPER-VALUE',
                    });
                });
            });
            describe('When _response.setHeader is called without a key', () => {
                const _response = new Response(event, context);
                it('Then _response.headers has the new header', () => {
                    expect(() => _response.setHeader(null, 'UPPER-VALUE')).toThrow(
                        'Response Error: req.header must be called with two params, key and value'
                    );
                });
            });
            describe('When _response.setHeader is called without a value', () => {
                const _response = new Response(event, context);
                it('Then _response.headers has the new header', () => {
                    expect(() => _response.setHeader('key', null)).toThrow(
                        'Response Error: req.header must be called with two params, key and value'
                    );
                });
            });
        });
        describe('code()', () => {
            const _response = new Response(event, context);
            describe('When _response.code() is called with a status code', () => {
                _response.code(300);
                it('Then _response.statusCode is the set code', () => {
                    expect(_response.statusCode).toBe(300);
                });
            });
            describe(' _response.code() is called with an invalid status code', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.code(4)).toThrow(
                        'Invalid status code'
                    );
                });
            });
        });
        describe('status()', () => {
            const _response = new Response(event, context);
            describe('When _response.status() is called with a status code', () => {
                _response.status(300);
                it('Then _response.statusCode is the set code', () => {
                    expect(_response.statusCode).toBe(300);
                });
            });
            describe(' _response.status() is called with an invalid status code', () => {
                it('Then an error is thrown', () => {
                    expect(() => _response.status(4)).toThrow(
                        'Invalid status code'
                    );
                });
            });
        });
        describe('Serializer()', () => {
            const _response = new Response(event, context);
            describe('When _response.serializer() is called with a function', () => {
                _response.setSerializer(() => 'serializer');
                it('Then the _response.serializer is the set to the function', () => {
                    const serializerFunction = _response.serializer;
                    expect(serializerFunction()).toStrictEqual('serializer');
                });
            });
            describe('When _response.serializer() is called with a something other than a function', () => {
                it('Then the _response.serializer is the set to the function', () => {
                    expect(() => _response.setSerializer('serializer')).toThrow(
                        'Response Error: Serializer must be of type function'
                    );
                });
            });
        });
    });
});
