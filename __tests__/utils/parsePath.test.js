import { getPathArray, getParams } from '../../src/utils/parsePath';

describe('parsePath', () => {
    describe('getPathArray()', () => {
        describe('When getPathArray is called with nothing', () => {
            it('Then a parsed path is returned', () => {
                expect(getPathArray()).toStrictEqual([]);
            });
        });
        describe('When getPathArray is called with /', () => {
            it('Then a parsed path is returned', () => {
                expect(getPathArray('/')).toStrictEqual(['']);
            });
        });
        describe('When getPathArray is called with a raw path', () => {
            it('Then a parsed path is returned', () => {
                const path = '/test/path';
                const expected = ['test', 'path'];
                expect(getPathArray(path)).toStrictEqual(expected);
            });
        });
        describe('When getPathArray is called with a raw path that has a param', () => {
            it('Then a parsed path is returned', () => {
                const path = '/test/path/:param';
                const expected = ['test', 'path', ':param'];
                expect(getPathArray(path)).toStrictEqual(expected);
            });
        });
        describe('When getPathArray is called with a raw path that has a param', () => {
            it('Then a parsed path is returned', () => {
                const path = '/test/path/:param';
                const expected = ['test', 'path', ':param'];
                expect(getPathArray(path)).toStrictEqual(expected);
            });
        });
        describe('When getPathArray is called with a raw path that is not prefixed with a /', () => {
            it('Then a parsed path is returned', () => {
                const path = 'test/path';
                const expected = ['test', 'path'];
                expect(getPathArray(path)).toStrictEqual(expected);
            });
        });
        describe('When getPathArray is called with a raw path that has a trailing /', () => {
            it('Then a parsed path is returned', () => {
                const path = 'test/path/';
                const expected = ['test', 'path', ''];
                expect(getPathArray(path)).toStrictEqual(expected);
            });
        });
    });
    describe('getParams()', () => {
        describe('When getParams is called with an empty array', () => {
            it('Then an empty object is returned', () => {
                expect(getParams([])).toStrictEqual([]);
            });
        });
        describe('When getParams is called with an array of an empty string', () => {
            it('Then an empty object is returned', () => {
                expect(getParams([''])).toStrictEqual([]);
            });
        });
        describe('When getParams is called with a valid path array', () => {
            describe('When there are no params in the path array', () => {
                it('Then an empty object is returned', () => {
                    const pathArray = ['test', 'path'];
                    expect(getParams(pathArray)).toStrictEqual([]);
                });
            });
            describe('When there is one param in the path array', () => {
                it('Then an empty object is returned', () => {
                    const pathArray = ['test', 'path', ':id'];
                    const expected = [
                        {
                            index: 2,
                            key: 'id',
                        },
                    ];
                    expect(getParams(pathArray)).toStrictEqual(expected);
                });
            });
            describe('When there are two params in the path array', () => {
                it('Then an empty object is returned', () => {
                    const pathArray = [':test', 'path', ':id'];
                    const expected = [
                        {
                            index: 0,
                            key: 'test',
                        },
                        {
                            index: 2,
                            key: 'id',
                        },
                    ];
                    expect(getParams(pathArray)).toStrictEqual(expected);
                });
            });
        });
    });
});
