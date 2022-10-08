import { Request } from '../src/Request';
import albEvent from './fixtures/albEvent.json';

const context = {};
const event = albEvent;

describe('Request()', () => {
    describe('When a request is created', () => {
        describe('When there are no params to be passed in', () => {
            const paramsMap = [];
            const _request = new Request(event, context, paramsMap);
            it('Then _request.req returns the event', () => {
                expect(_request.req).toStrictEqual(event);
            });
            it('Then _request.raw returns the raw event', () => {
                expect(_request.raw).toStrictEqual(albEvent);
            });
            it('Then _request.body returns the body', () => {
                expect(_request.body).toBe('Hello from alb!');
            });
            it('Then _request.headers returns the headers', () => {
                expect(_request.headers).toStrictEqual({
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'accept-encoding': 'gzip',
                    'accept-language': 'en-US,en;q=0.9',
                    connection: 'keep-alive',
                    host: 'lambda-alb-123578498.us-east-2.elb.amazonaws.com',
                    'upgrade-insecure-requests': '1',
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                    'x-amzn-trace-id':
                        'Root=1-5c536348-3d683b8b04734faae651f476',
                    'x-forwarded-for': '72.12.164.125',
                    'x-forwarded-port': '80',
                    'x-forwarded-proto': 'http',
                    'x-imforwards': '20',
                });
            });
            it('Then _request.path returns the path', () => {
                expect(_request.path).toBe('/lambda');
            });
            it('Then _request.method returns the method', () => {
                expect(_request.method).toBe('GET');
            });
            it('Then _request.isBase64Encoded returns boolean if base64 encoded', () => {
                expect(_request.isBase64Encoded).toBe(false);
            });
            it('Then _request.queryStringParameters returns the query string params', () => {
                expect(_request.queryStringParameters).toStrictEqual({
                    query: '1234ABCD',
                });
            });
            it('Then _request.params returns an empty object', () => {
                expect(_request.params).toStrictEqual({});
            });
        });
        describe('When there are params passed into the request', () => {
            const paramsMap = [{ key: 'testKey', index: 0 }];
            const _request = new Request(event, context, paramsMap);
            it('Then _request.params returns the params', () => {
                expect(_request.params).toStrictEqual({ testKey: 'lambda' });
            });
        });
    });
});
