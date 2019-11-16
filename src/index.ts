import { AxiosRequestConfig } from './types'
import xhr from './logic/xhr'
import { bulidURL } from './helper/url'
import { transRequest } from './helper/data'
import { processHeaders } from './helper/headers'

function axios(config: AxiosRequestConfig):void {
    processConfig(config)
    xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transURL(config)
    config.headers = transHeaders(config) // headers的处理必须在data之前，先处理data的话，处理headers会异常
    config.data = transRequestData(config)
}


// 对config.url做处理
function transURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return bulidURL(url,params)
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


export default axios