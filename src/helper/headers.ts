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


export function transHeaders(headers: string): any{
    let result = Object.create(null)
    if(!headers){
        return result
    }
    // 以回车符换行符隔开每一个header行
    headers.split('\r\n').forEach( header => {
        // 以':'作为key和value的分割符
        let [key, value] = header.split(':') 
        key = key.trim().toLocaleLowerCase()
        if(!key){
            // 若key是空的 直接进行下一次循环，否则再去判断value
            return
        }
        if(value){
            value = value.trim()
        }
        // 赋给result
        result[key] = value
    })

    return result
}