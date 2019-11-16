/**
 *  对headers进行加工
*/

import { isPlainObject } from './utils'

// 防止 content-type 与 Content-Type 不匹配
function normalizeHeaderName(headers: any,normalizedName: string): void {
    if(!headers){
        return
    }
    Object.keys(headers).forEach( name => {
        if(name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()){
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any,data: any): any {
    normalizeHeaderName(headers,'Content-Type')

    //当data是普通对象时，添加contentType
    if(isPlainObject(data)){
        if(headers && !headers['Content-Type']){
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}