/**
 *  实现请求逻辑
*/

import { AxiosRequestConfig } from '../types'

export default function xhr(config: AxiosRequestConfig):void {
    // data默认为null，methods默认为get
    const { data = null, url, method = 'get' } = config

    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
    request.send(data)

}