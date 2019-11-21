/**
 *  实现请求逻辑
*/

import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { transHeaders } from '../helper/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise( (resolve,reject) => {
        // data默认为null，methods默认为get
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        if(responseType){
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = function handleRequest(){
            if(request.readyState !== 4){
                return
            }
            // 网络错误或超时等错误
            if(request.status === 0){
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
            // 对正常情况以及异常请求做处理
            handleResponse(response)
        }

        // 网络错误处理
        request.onerror = function handleError(){
            reject(new Error('网络错误'))
        }
        // 请求超时处理 如果有规定超时时间，不传时XMLHttpRequest默认是0，意味着没有超时
        if(timeout){
            request.timeout = timeout
        }
        request.ontimeout = function handleTimeout(){
            reject(new Error(`${timeout}ms, request is timeout`))
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

        function handleResponse(response: AxiosResponse): void{
            if(response.status >= 200 && response.status < 300){
                resolve(response)
            }else{
                reject(new Error(`STATUS: ${response.status} ,request is failed`))
            }
        }
    })
}