import { getStatusDescription } from './utils/statusCodes';
import { encodeBase64 } from './utils/base64';

const RESPONSE_ALREADY_SENT = new Error(
    'Response Error: Response was already sent'
);
const CODE_ERROR = new Error('Lambdaify Error: Invalid status code');
const SERIALIZER_MUST_BE_FUNCTION = new Error(
    'Response Error: Serializer must be of type function'
);
const COOKIE_MUST_BE_STRING = new Error(
    'Response Error: Cookie must be of type string'
);
const INVALID_HEADER_PARAMS = new Error(
    'Response Error: req.header must be called with two params, key and value'
);

function Response(_event, context) {
    this.event = _event;
    this.context = context;
    this.isResponseSent = false;
    this.isBase64Encoded = false;
    this.body = null;
    this.serializer = null;
    this.headers = {};
    this.statusCode = 200;
    this.cookies = [];
    this.createResponse = () => {
        return {
            isBase64Encoded: this.isBase64Encoded,
            statusCode: this.statusCode,
            headers: this.headers,
            body: serialize(this.body, this.serializer, this.isBase64Encoded),
            statusDescription: getStatusDescription(this.statusCode),
        };
    };
}

Response.prototype.send = function (body) {
    if (this.isResponseSent) throw RESPONSE_ALREADY_SENT;
    this.body = body;
    this.isResponseSent = true;

    return this;
};

Response.prototype.cookie = function (cookie: string) {
    if (typeof cookie !== 'string') throw COOKIE_MUST_BE_STRING;
    this.cookies.push(cookie);

    return this;
};

Response.prototype.header = function (key: string, value: string) {
    if (!key || !value) {
        throw INVALID_HEADER_PARAMS;
    }
    const _key = key.toLowerCase();
    this.headers[_key] = value;

    return this;
};
Response.prototype.setHeader = Response.prototype.header;

Response.prototype.setSerializer = function (fn) {
    if (typeof fn !== 'function') throw SERIALIZER_MUST_BE_FUNCTION;
    this.serializer = fn;

    return this;
};

Response.prototype.code = function (code) {
    const intValue = parseInt(code);
    if (isNaN(intValue) || intValue < 100 || intValue > 600) {
        throw CODE_ERROR;
    }
    this.statusCode = intValue;

    return this;
};
Response.prototype.status = Response.prototype.code;

Response.prototype.encodeBase64 = function () {
    this.isBase64Encoded = true;

    return this;
};

const serialize = (body, serializer, isBase64Encoded) => {
    let serializedBody;
    if (typeof body === 'object') {
        const encoding =
            typeof serializer === 'function' ? serializer : JSON.stringify;
        serializedBody = encoding(body);
    } else {
        serializedBody = body.toString();
    }

    if (isBase64Encoded) {
        return encodeBase64(serializedBody);
    }
    return serializedBody;
};

export { Response };
