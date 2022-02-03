const getStatusCodeDescription = require('../../src/utils/statusCodes')

describe("getStatusDescription()", () => {
    describe("When getStatusDescription is called with a numeric status code", () => {
        it("Then the correct status description is returned", () => {
            const statusDescription = getStatusCodeDescription(200)
            expect(statusDescription).toBe('OK')
        })
    })
    describe("When getStatusDescription is called with a string status code", () => {
        it("Then the correct status description is returned", () => {
            const statusDescription = getStatusCodeDescription("200")
            expect(statusDescription).toBe('OK')
        })
    })
    describe("When getStatusDescription is called with an unknown numeric status code", () => {
        it("Then the correct status description is returned", () => {
            const statusDescription = getStatusCodeDescription(10)
            expect(statusDescription).toBe('Unknown')
        })
    })
    describe("When getStatusDescription is called with an unknown string status code", () => {
        it("Then the correct status description is returned", () => {
            const statusDescription = getStatusCodeDescription("10")
            expect(statusDescription).toBe('Unknown')
        })
    })
})