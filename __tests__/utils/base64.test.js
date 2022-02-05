const base64 = require('../../src/utils/base64')
const encode = base64.encodeBase64
const decode = base64.decodeBase64

const string = 'Base64 Encoding in Node.js'
const encodedString = 'QmFzZTY0IEVuY29kaW5nIGluIE5vZGUuanM='

describe('base64', () => {
    describe('encodeBase64()', () => {
        describe('When encodeBase64 is called with a string', () => {
            it('Then the resulting base64 encoded string is returned', () => {
                expect(encode(string)).toBe(encodedString)
            })
        })
        describe('When encodeBase64 is called with nothing', () => {
            it('Then an empty string is returned', () => {
                expect(encode()).toBe('')
            })
        })
    })
    describe('decodeBase64()', () => {
        describe('When decodeBase64 is called with a base64 encoded string', () => {
            it('Then the resulting string is returned', () => {
                expect(decode(encodedString)).toBe(string)
            })
        })
        describe('When decodeBase64 is called with nothing', () => {
            it('Then an empty string is returned', () => {
                expect(decode()).toBe('')
            })
        })
    })
})
