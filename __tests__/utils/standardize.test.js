import {
    standardizeEvent,
    standardizeContext,
} from '../../src/utils/standardize';
import apiGatewayV1Event from '../fixtures/apiGatewayV1Event.json';
import apiGatewayV2Event from '../fixtures/apiGatewayV2Event.json';
import albEvent from '../fixtures/albEvent.json';

describe('Standardize', () => {
    describe('StandardizeEvent()', () => {
        describe('When standardizeEvent is called with an unrecognized event', () => {
            it('Then an error is thrown', () => {
                const nonStandardEvent = {
                    ...apiGatewayV1Event,
                    version: 'not standard',
                };
                expect(() => standardizeEvent(nonStandardEvent)).toThrow(
                    'Unrecognized event type'
                );
            });
        });
        describe('When standardizeEvent is called with a valid apiGatewayV1 event', () => {
            it('Then a standardized event is returned', () => {
                const standardEvent = standardizeEvent(apiGatewayV1Event);
                const expected = {
                    body: 'Hello from Lambda!',
                    headers: {
                        header1: ['value1'],
                        header2: ['value1', 'value2'],
                    },
                    isBase64Encoded: false,
                    method: 'GET',
                    path: '/my/path',
                    payloadVersion: 'gatewayV1.0',
                    querystringParameters: {
                        parameter1: ['value1', 'value2'],
                        parameter2: ['value'],
                    },
                    raw: apiGatewayV1Event,
                };
                expect(standardEvent).toStrictEqual(expected);
            });
        });
        describe('When standardizeEvent is called with a valid apiGatewayV2 event', () => {
            it('Then a standardized event is returned', () => {
                const standardEvent = standardizeEvent(apiGatewayV2Event);
                const expected = {
                    body: 'Hello from Lambda',
                    headers: {
                        header1: 'value1',
                        header2: 'value1,value2',
                    },
                    isBase64Encoded: false,
                    method: 'POST',
                    path: '/my/path',
                    payloadVersion: 'gatewayV2.0',
                    querystringParameters: {
                        parameter1: 'value1,value2',
                        parameter2: 'value',
                    },
                    raw: apiGatewayV2Event,
                };
                expect(standardEvent).toStrictEqual(expected);
            });
        });
        describe('When standardizeEvent is called with a valid alb event', () => {
            it('Then a standardized event is returned', () => {
                const standardEvent = standardizeEvent(albEvent);
                const expected = {
                    body: 'Hello from alb!',
                    headers: {
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
                    },
                    isBase64Encoded: false,
                    method: 'GET',
                    path: '/lambda',
                    payloadVersion: 'alb',
                    querystringParameters: { query: '1234ABCD' },
                    raw: albEvent,
                };
                expect(standardEvent).toStrictEqual(expected);
            });
        });
    });
    describe('standardizeContext()', () => {
        describe('When standardize context is called with a valid context', () => {
            it('Then the context is returned', () => {
                const standardContext = standardizeContext({});
                expect(standardContext).toStrictEqual({});
            });
        });
    });
});
