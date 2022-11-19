import { router } from '../src/Router';

describe('Router()', () => {
    let Router;

    describe('When router is initialized', () => {
        beforeEach(() => {
            Router = router({});
        });
        describe('registerRoute()', () => {
            it('Then the registerRoute function exists', () => {
                expect(typeof Router.registerRoute).toBe('function');
            });
            describe('When registerRoute is called with a valid method, path, and callback', () => {
                describe('When registerRoute is called and the route already exists', () => {
                    it('Then an error is thrown', () => {
                        const cb = () => 'test';
                        expect(() => {
                            Router.registerRoute('GET', '/test/path', cb);
                            Router.registerRoute('GET', '/test/path', cb);
                        }).toThrow(
                            'GET /test/path already exists and cannot be registered again.'
                        );
                    });
                });
                describe('When the path has no path params', () => {
                    it('Then the router is updated with the new route', () => {
                        const cb = () => 'test';
                        const _router = Router.registerRoute(
                            'GET',
                            '/test/path',
                            cb
                        );
                        const expected = [
                            {
                                callback: cb,
                                method: 'GET',
                                params: [],
                                path: '/test/path',
                                pathArray: ['test', 'path'],
                            },
                        ];
                        expect(_router).toStrictEqual(expected);
                    });
                });
                describe('When the path has one path param', () => {
                    it('Then the router is updated with the new route', () => {
                        const cb = () => 'test';
                        const _router = Router.registerRoute(
                            'GET',
                            '/test/path/:id',
                            cb
                        );
                        const expected = [
                            {
                                callback: cb,
                                method: 'GET',
                                params: [
                                    {
                                        index: 2,
                                        key: 'id',
                                    },
                                ],
                                path: '/test/path/:id',
                                pathArray: ['test', 'path', ':id'],
                            },
                        ];
                        expect(_router).toStrictEqual(expected);
                    });
                });
            });
        });
        describe('matchedRoute()', () => {
            it('Then the matchedRoute function exists', () => {
                expect(typeof Router.matchedRoute).toBe('function');
            });
            describe('When matchedRoute is called with a valid method and path', () => {
                describe('When there are no routes in the router', () => {
                    it('Then an empty route object is returned', () => {
                        const expected = {};
                        const event = {
                            httpMethod: 'GET',
                            path: '/test/path',
                        };
                        const matchedRoute = Router.matchedRoute(event);
                        expect(matchedRoute).toStrictEqual(expected);
                    });
                });
                describe('When no matching route exists in the router', () => {
                    it('Then an empty route object is returned', () => {
                        const cb = () => 'test';
                        const event = {
                            httpMethod: 'POST',
                            path: '/test/path',
                        };
                        Router.registerRoute('GET', '/test/path', cb);
                        const expected = {};
                        const matchedRoute = Router.matchedRoute(event);
                        expect(matchedRoute).toStrictEqual(expected);
                    });
                });
                describe('When no matching route exists in the router and the path has a param', () => {
                    it('Then an empty route object is returned', () => {
                        const cb = () => 'test';
                        const event = {
                            httpMethod: 'POST',
                            path: '/test/path/:id',
                        };
                        Router.registerRoute('GET', '/test/path/:id', cb);
                        const expected = {};
                        const matchedRoute = Router.matchedRoute(event);
                        expect(matchedRoute).toStrictEqual(expected);
                    });
                });
                describe('When a matching route has no params and exists in the router', () => {
                    it('Then the matched route is returned', () => {
                        const cb = () => 'test';
                        const event = {
                            httpMethod: 'GET',
                            path: '/test/path',
                        };
                        Router.registerRoute('GET', '/test/path', cb);
                        const expected = {
                            callback: cb,
                            method: 'GET',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        };
                        const matchedRoute = Router.matchedRoute(event);
                        expect(matchedRoute).toStrictEqual(expected);
                    });
                });
                describe('When a matching route has one param and exists in the router', () => {
                    it('Then the matched route is returned', () => {
                        const cb = () => 'test';
                        const event = {
                            httpMethod: 'GET',
                            path: '/test/path',
                        };
                        Router.registerRoute('GET', '/test/path/:id', cb);
                        const expected = {
                            callback: cb,
                            method: 'GET',
                            params: [
                                {
                                    index: 2,
                                    key: 'id',
                                },
                            ],
                            path: '/test/path/:id',
                            pathArray: ['test', 'path', ':id'],
                        };
                        const matchedRoute = Router.matchedRoute(event);
                        expect(matchedRoute).toStrictEqual(expected);
                    });
                });
            });
            describe('When matchedRoute is called and fails to extract the method or path from the event', () => {
                describe('When there is no path in the event', () => {
                    it('Then throws an error', () => {
                        const expected =
                            'Failed to parse event for method and path. Make sure your eventSource is set application load balancer';
                        const event = {
                            httpMethod: 'GET',
                        };
                        expect(() => Router.matchedRoute(event)).toThrow(
                            expected
                        );
                    });
                });
                describe('When there is no method in the event', () => {
                    it('Then throws an error', () => {
                        const expected =
                            'Failed to parse event for method and path. Make sure your eventSource is set application load balancer';
                        const event = {
                            path: 'test/path',
                        };
                        expect(() => Router.matchedRoute(event)).toThrow(
                            expected
                        );
                    });
                });
            });
        });
        describe('registerMiddleware()', () => {
            it('Then the registerMiddleware function exists', () => {
                expect(typeof Router.registerMiddleware).toBe('function');
            });
            describe('When registerMiddleware is called with the correct params', () => {
                describe('When registerMiddleware is called with a valid function as the first parameter', () => {
                    it('Then the middleware is successfully added', () => {
                        const mw = (req, res, next) => {};
                        const _middleware = Router.registerMiddleware(mw);
                        const expected = {
                            errorMiddleware: [],
                            middleware: [
                                {
                                    middleware: mw,
                                    path: '/*',
                                },
                            ],
                        };
                        expect(_middleware).toStrictEqual(expected);
                    });
                });
                describe('When registerMiddleware is called with a valid string as the first parameter and function as the second', () => {
                    it('Then the middleware is successfully added', () => {
                        const mw = (req, res, next) => {};
                        const _middleware = Router.registerMiddleware(
                            '/path',
                            mw
                        );
                        const expected = {
                            errorMiddleware: [],
                            middleware: [
                                {
                                    middleware: mw,
                                    path: '/path',
                                },
                            ],
                        };
                        expect(_middleware).toStrictEqual(expected);
                    });
                });
                describe('When registerMiddleware is called with a valid function as the first parameter and its an error middleware', () => {
                    it('Then the middleware is successfully added', () => {
                        const mw = (error, req, res, next) => {};
                        const _middleware = Router.registerMiddleware(mw);
                        const expected = {
                            errorMiddleware: [
                                {
                                    middleware: mw,
                                    path: '/*',
                                },
                            ],
                            middleware: [],
                        };
                        expect(_middleware).toStrictEqual(expected);
                    });
                });
                describe('When registerMiddleware is called with a valid string as the first parameter and function as the second and its an error middleware', () => {
                    it('Then the middleware is successfully added', () => {
                        const mw = (error, req, res, next) => {};
                        const _middleware = Router.registerMiddleware(
                            '/path',
                            mw
                        );
                        const expected = {
                            errorMiddleware: [
                                {
                                    middleware: mw,
                                    path: '/path',
                                },
                            ],
                            middleware: [],
                        };
                        expect(_middleware).toStrictEqual(expected);
                    });
                });
            });
            describe('When registerMiddleware is called with an incorrect set of params', () => {
                describe('When register middleware is called with an unrecognized first parameter type', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware(1);
                        }).toThrow(
                            'Failed to register middleware: first param must be of type string or function, received number'
                        );
                    });
                });
                describe('When register middleware is called with a function as the fist param and extra params after', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware((req, res, next) => {},
                            'extra stuff');
                        }).toThrow(
                            'Failed to register middleware: expected 1 params, received 2'
                        );
                    });
                });
                describe('When register middleware is called with a function that does not have 3 or 4 params', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware((req, res) => {});
                        }).toThrow(
                            'Failed to register middleware: function must contain either 3 or 4 parameters, received 2'
                        );
                    });
                });
                describe('When register middleware is called with a string first param and no second param', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware('/path');
                        }).toThrow(
                            'Failed to register middleware: second param must be of type function, received undefined'
                        );
                    });
                });
                describe('When register middleware is called with a string first param, a valid function second param, and an extra param', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware(
                                '/path',
                                (req, res, next) => {},
                                'extra stuff'
                            );
                        }).toThrow(
                            'Failed to register middleware: expected 2 params, received 3'
                        );
                    });
                });
                describe('When register middleware is called with a string first param and an invalid second param type', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware('/path', 'not function');
                        }).toThrow(
                            'Failed to register middleware: second param must be of type function, received string'
                        );
                    });
                });
                describe('When register middleware is called with a string first param and an invalid second function param that does not have 3 or 4 params', () => {
                    it('Then an error is thrown', () => {
                        expect(() => {
                            Router.registerMiddleware(
                                '/path',
                                (req, res) => {}
                            );
                        }).toThrow(
                            'Failed to register middleware: function must contain either 3 or 4 parameters, received 2'
                        );
                    });
                });
            });
        });
    });
});
