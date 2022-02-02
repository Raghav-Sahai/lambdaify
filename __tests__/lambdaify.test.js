const lambdaify = require('../src/lambdaify')
const router = require('../src/Router')

describe("lambdaify()", () => {
    const app = lambdaify();
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
            it("Then the put function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
        describe("post()", () => {
            it("Then the post function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
        describe("delete()", () => {
            it("Then the delete function exists", () => {
                expect(typeof app.put).toBe('function');
            })
        })
    })

})