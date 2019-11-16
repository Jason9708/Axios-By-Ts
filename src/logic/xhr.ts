/**
 *  实现请求逻辑
*/

import { AxiosRequestConfig } from '../types'

export default function xhr(config: AxiosRequestConfig):void {
    // data默认为null，methods默认为get
    const { data = null, url, method = 'get', headers } = config

    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)

    // 设置headers
    Object.keys(headers).forEach( name => {
        // data是空的话，contentType是没有意义的
        if(data === null && name.toLowerCase() === 'content-type'){
            delete headers[name]
        }else{
            request.setRequestHeader(name,headers[name])
        }
    })

    request.send(data)

}