const serialize = (body: any, serializer: any): any => {
    const encoding = typeof serializer === 'function' ? serializer : JSON.stringify;
    if (typeof body === "object") {
        return encoding(body)
    } else if (typeof body !== "string") {
        return body.toString()
    }
    return body
}

export { serialize }