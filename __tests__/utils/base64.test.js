import { encodeBase64, decodeBase64 } from '../../src/utils/base64'

const string = 'Base64 Encoding in Node.js'
const encodedString = 'QmFzZTY0IEVuY29kaW5nIGluIE5vZGUuanM='

describe('base64', () => {
    describe('encodeBase64()', () => {
        describe('When encodeBase64 is called with a string', () => {
            it('Then the resulting base64 encoded string is returned', () => {
                expect(encodeBase64(string)).toBe(encodedString)
            })
        })
        describe('When encodeBase64 is called with nothing', () => {
            it('Then an empty string is returned', () => {
                expect(encodeBase64(null)).toBe('')
            })
        })
    })
    describe('decodeBase64()', () => {
        describe('When decodeBase64 is called with a base64 encoded string', () => {
            it('Then the resulting string is returned', () => {
                expect(decodeBase64(encodedString)).toBe(string)
            })
        })
        describe('When decodeBase64 is called with nothing', () => {
            it('Then an empty string is returned', () => {
                expect(decodeBase64(null)).toBe('')
            })
        })
    })
})
