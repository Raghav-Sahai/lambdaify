import { lambdaify } from '../src/lambdaify';

describe('lambdaify()', () => {
    const app = lambdaify({});
    describe('When lambdaify is initialized', () => {
        describe('run()', () => {
            it('Then the run function exists', () => {
                expect(typeof app.run).toBe('function');
            });
        });
        describe('When the helper http methods are initialized', () => {
            describe('get()', () => {
                it('Then the get function exists', () => {
                    expect(typeof app.get).toBe('function');
                });
                it('Then calls the registerRoute function on the router and properly registers the route', () => {
                    const app = lambdaify({});
                    const response = app.get('/test/path', () => 'callback');
                    expect(response).toEqual([
                        {
                            callback: expect.any(Function),
                            method: 'GET',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        },
                    ]);
                });
            });
            describe('put()', () => {
                it('Then the put function exists', () => {
                    expect(typeof app.put).toBe('function');
                });
                it('Then calls the registerRoute function on the router and properly registers the route', () => {
                    const app = lambdaify({});
                    const response = app.put('/test/path', () => 'callback');
                    expect(response).toEqual([
                        {
                            callback: expect.any(Function),
                            method: 'PUT',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        },
                    ]);
                });
            });
            describe('post()', () => {
                it('Then the post function exists', () => {
                    expect(typeof app.put).toBe('function');
                });
                it('Then calls the registerRoute function on the router and properly registers the route', () => {
                    const app = lambdaify({});
                    const response = app.post('/test/path', () => 'callback');
                    expect(response).toEqual([
                        {
                            callback: expect.any(Function),
                            method: 'POST',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        },
                    ]);
                });
            });
            describe('delete()', () => {
                it('Then the delete function exists', () => {
                    expect(typeof app.put).toBe('function');
                });
                it('Then calls the registerRoute function on the router and properly registers the route', () => {
                    const app = lambdaify({});
                    const response = app.delete('/test/path', () => 'callback');
                    expect(response).toEqual([
                        {
                            callback: expect.any(Function),
                            method: 'DELETE',
                            params: [],
                            path: '/test/path',
                            pathArray: ['test', 'path'],
                        },
                    ]);
                });
            });
        });
    });
});
