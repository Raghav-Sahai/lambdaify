const lambdaify = require('../../src/lambdaify')

describe("lambdaify()", () => {
    let app;

    beforeEach(() => {
        app = lambdaify()
    });
    describe("When lambdaify is initialized", () => {
        describe("run()", () => {
            it("Then the run function exists", () => {
                expect(typeof app.run).toBe('function');
            })
        })
        describe("get()", () => {
            it("Then the get function exists", () => {
                expect(typeof app.get).toBe('function');
            })
        })
        describe("put()", () => {
            it("Then the get function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
        describe("post()", () => {
            it("Then the get function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
        describe("delete()", () => {
            it("Then the get function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
    })

})