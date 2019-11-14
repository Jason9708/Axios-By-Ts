import { AxiosRequestConfig } from './types'
import xhr from './logic/xhr'

function axios(config: AxiosRequestConfig):void {
    xhr(config)
}

export default axios