import { APIGatewayEventRequestContextV2 } from 'aws-lambda';
import { StandardizedEvent } from './utils/standardizeEvent'
import { RouteParams } from './types/router.types'
import { getPathArray } from './utils/parsePath'

function Request (event: StandardizedEvent, context: APIGatewayEventRequestContextV2, paramsMap: RouteParams) {
    this.event = event,
    this.context = context,
    this.paramsMap = paramsMap
}

Object.defineProperties(Request.prototype, {
    req: {
        get() {
            return this.event
        }
    },
    version: {
        get() {
            return this.event.payloadVersion
        }
    },
    body: {
        get() {
            return this.event.body
        }
    },
    headers: {
        get() {
            return this.event.headers
        }
    },
    path: {
        get() {
            return this.event.path
        }
    },
    method: {
        get() {
            return this.event.method
        }
    },
    isBase64Encoded: {
        get() {
            return this.event.isBase64Encoded
        }
    },
    querystringParameters: {
        get() {
            return this.event.querystringParameters
        }
    },
    params: {
        get() {
            return parseParams(this.event.path, this.paramsMap)
        }
    }
})

const parseParams = (path: string, params: RouteParams): any => {
    if (!params) return {}
    
    let _params: any = {}
    const pathArray = getPathArray(path)

    params.forEach((param) =>  _params[param.key] = pathArray[param.index])

    return _params
}

export { Request }
