/**
 *  公共类型定义文件
 */


export type METHOD = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' 

export interface AxiosRequestConfig{
    url: string,
    method?: METHOD,
    headers?: any,
    data?: any,
    params?: any,
    responseType?: XMLHttpRequestResponseType
}


// 响应数据类型
export interface AxiosResponse {
    data:any,
    status:number,
    statusText:string,
    headers:any,
    config:AxiosRequestConfig,
    request:any
}

// 返回一个Promise对象  继承于泛型接口
export interface AxiosPromise extends Promise<AxiosResponse>{}