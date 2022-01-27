const decodeBase64 = (message: string | null | undefined): string => Buffer.from(message || '', 'base64').toString('utf-8')
const encodeBase64 = (message: string | null | undefined): string => Buffer.from(message || '', 'utf-8').toString('base64')

export {
    decodeBase64,
    encodeBase64
}