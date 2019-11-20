/**
 *  实现请求逻辑
*/

import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { transHeaders } from '../helper/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise( (resolve) => {
        // data默认为null，methods默认为get
        const { data = null, url, method = 'get', headers, responseType } = config

        const request = new XMLHttpRequest()

        if(responseType){
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = function handleRequest(){
            if(request.readyState !== 4){
                return
            }
            const responseHeaders = transHeaders(request.getAllResponseHeaders())
            const responseData = responseType !== 'text' ? request.response : request.responseType
            const response: AxiosResponse = {
                data:responseData,
                status:request.status,
                statusText:request.statusText,
                headers:responseHeaders,
                config,
                request
            }
            resolve(response)
        }

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
    })
}