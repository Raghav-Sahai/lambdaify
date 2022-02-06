import { router } from '../src/Router'

describe('Router()', () => {
    let Router

    beforeEach(() => {
        Router = router({})
    })
    describe('When lambdaify is initialized', () => {
        describe('registerRoute()', () => {
            it('Then the registerRoute function exists', () => {
                expect(typeof Router.registerRoute).toBe('function')
            })
            describe('When registerRoute is called with a valid method, path, and callback', () => {
                describe('When the path has no path params', () => {
                    it('Then the router is updated with the new route', () => {
                        const cb = () => 'test'
                        const _router = Router.registerRoute(
                            'GET',
                            '/test/path',
                            cb
                        )
                        const expected = [
                            {
                                callback: cb,
                                method: 'GET',
                                params: [],
                                path: '/test/path',
                                pathArray: ['test', 'path'],
                            },
                        ]
                        expect(_router).toStrictEqual(expected)
                    })
                })
                describe('When the path has one path param', () => {
                    it('Then the router is updated with the new route', () => {
                        const cb = () => 'test'
                        const _router = Router.registerRoute(
                            'GET',
                            '/test/path/:id',
                            cb
                        )
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
                        ]
                        expect(_router).toStrictEqual(expected)
                    })
                })
            })
        })
        describe('matchedRoute()', () => {
            it('Then the matchedRoute function exists', () => {
                expect(typeof Router.matchedRoute).toBe('function')
            })
            describe('When matchedRoute is called with a valid method and path', () => {
                describe('When there are no routes in the router', () => {
                    it('Then an empty route object is returned', () => {
                        const expected = {}
                        const matchedRoute = Router.matchedRoute(
                            'GET',
                            '/test/path'
                        )
                        expect(matchedRoute).toStrictEqual(expected)
                    })
                })
                describe('When no matching route exists in the router', () => {
                    it('Then an empty route object is returned', () => {
                        const cb = () => 'test'
                        Router.registerRoute('GET', '/test/path', cb)
                        const expected = {}
                        const matchedRoute = Router.matchedRoute(
                            'POST',
                            '/test/path'
                        )
                        expect(matchedRoute).toStrictEqual(expected)
                    })
                })
                describe('When no matching route exists in the router and the path has a param', () => {
                    it('Then an empty route object is returned', () => {
                        const cb = () => 'test'
                        Router.registerRoute('GET', '/test/path/:id', cb)
                        const expected = {}
                        const matchedRoute = Router.matchedRoute(
                            'POST',
                            '/test/path/:id'
                        )
                        expect(matchedRoute).toStrictEqual(expected)
                    })
                })
                describe('When a matching route has no params and exists in the router', () => {
                    it('Then the matched route is returned', () => {
                        const cb = () => 'test'
                        Router.registerRoute('GET', '/test/path', cb)
                        const expected = {
                            callback: cb,
                            method: 'GET',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        }
                        const matchedRoute = Router.matchedRoute(
                            'GET',
                            '/test/path'
                        )
                        expect(matchedRoute).toStrictEqual(expected)
                    })
                })
                describe('When a matching route has one param and exists in the router', () => {
                    it('Then the matched route is returned', () => {
                        const cb = () => 'test'
                        Router.registerRoute('GET', '/test/path/:id', cb)
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
                        }
                        const matchedRoute = Router.matchedRoute(
                            'GET',
                            '/test/path'
                        )
                        expect(matchedRoute).toStrictEqual(expected)
                    })
                })
            })
        })
        describe('getRouter()', () => {
            it('Then the getRouter function exists', () => {
                expect(typeof Router.getRouter).toBe('function')
            })
            describe('When getRouter is called', () => {
                it('Then the router is returned', () => {
                    const cb = () => 'test'
                    Router.registerRoute('GET', '/test/path/:id', cb)
                    Router.registerRoute('POST', '/test/path/:id', cb)

                    const expected = [
                        {
                            callback: cb,
                            method: 'GET',
                            params: [{ index: 2, key: 'id' }],
                            path: '/test/path/:id',
                            pathArray: ['test', 'path', ':id'],
                        },
                        {
                            callback: cb,
                            method: 'POST',
                            params: [{ index: 2, key: 'id' }],
                            path: '/test/path/:id',
                            pathArray: ['test', 'path', ':id'],
                        },
                    ]
                    const _router = Router.getRouter()
                    expect(_router).toStrictEqual(expected)
                })
            })
        })
    })
})
