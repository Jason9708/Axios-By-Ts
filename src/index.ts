import { AxiosRequestConfig } from './types'
import xhr from './logic/xhr'
import { bulidURL } from './helper/url'

function axios(config: AxiosRequestConfig):void {
    processConfig(config)
    xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transURL(config)
}
// 对config.url做处理
function transURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return bulidURL(url,params)
}

export default axios