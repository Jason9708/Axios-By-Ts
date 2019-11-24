import { AxiosRequestConfig,AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { bulidURL } from '../helper/url'
import { transRequest, transData } from '../helper/data'
import { processHeaders } from '../helper/headers'

export default function dispatchRequest(config: AxiosRequestConfig):AxiosPromise {
    processConfig(config)
    return xhr(config).then((res)=>{
        return transResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transURL(config)
    config.headers = transHeaders(config) // headers的处理必须在data之前，先处理data的话，处理headers会异常
    config.data = transRequestData(config)
}


// 对config.url做处理
function transURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return bulidURL(url!,params)
}
// 对config.data做处理
function transRequestData(config: AxiosRequestConfig): any {
    return transRequest(config.data)
}
// 对config.headers做处理
function transHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers,data)
}
// 对响应数据data做处理
function transResponseData( response: AxiosResponse): AxiosResponse{
    response.data = transData(response.data)
    return response
}
