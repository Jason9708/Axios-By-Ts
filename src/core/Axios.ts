import { AxiosPromise, AxiosRequestConfig, METHOD, ResolvedFun, RejectedFun } from "../types";
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'
// interceptors 类型
interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosPromise>
}

interface PromiseChain<T> {
    resolved: ResolvedFun<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFun
}

export default class Axios {
    interceptors: Interceptors

    constructor(){
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosPromise>()
        }
    }

    // 支持重载
    request(url: any,config?: any): AxiosPromise {
        if(typeof url === 'string'){
            if(!config){
                config = {}
            }
            config.url = url
        }else{
            config = url
        }

        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)

        while(chain.length){
            const { resolved,rejected } = chain.shift()!
            promise = promise.then(resolved,rejected)
        }

        return promise
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithoutData('get',url,config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithoutData('delete',url,config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithoutData('head',url,config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithoutData('options',url,config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithData('post',url,data,config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithData('put',url,data,config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise{
        return this._requestMethodWithData('patch',url,data,config)
    }

    // 辅助函数
    _requestMethodWithoutData(method: METHOD, url: string, config?: AxiosRequestConfig){
        return this.request(Object.assign(config || {},{
            method,
            url
        }))
    }
    _requestMethodWithData(method: METHOD, url: string, data?: any, config?: AxiosRequestConfig){
        return this.request(Object.assign(config || {},{
            method,
            url,
            data
        }))
    }
}