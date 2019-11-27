/**
 *  公共类型定义文件
 */


export type METHOD = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' 

export interface AxiosRequestConfig{
    url?: string,
    method?: METHOD,
    headers?: any,
    data?: any,
    params?: any,
    responseType?: XMLHttpRequestResponseType,
    timeout?: number // 超时时间
}


// 响应数据类型
export interface AxiosResponse<T=any>  {
    data:T,
    status:number,
    statusText:string,
    headers:any,
    config:AxiosRequestConfig,
    request:any
}

// 返回一个Promise对象  继承于泛型接口
export interface AxiosPromise<T=any> extends Promise<AxiosResponse<T>>{}

// 异常请求类型
export interface AxiosError extends Error {
    config: AxiosRequestConfig
    code?: string
    request?: any
    response?: AxiosResponse
    isAxiosError: boolean
}

// 描述Axios类中的公共方法
export interface Axios {
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }

    request<T=any>(config: AxiosRequestConfig): AxiosPromise<T>

    get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    post<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    put<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios{
    <T=any>(config: AxiosRequestConfig): AxiosPromise<T>

    <T=any>(url:string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器管理类
export interface AxiosInterceptorManager<T> {
    // 添加
    use(resolved: ResolvedFun<T>,rejected?: RejectedFun): number
    // 删除
    eject(id: number): void
}
// 类型接口
export interface ResolvedFun<T> {
    (val: T): T | Promise<T>
}
export interface RejectedFun {
    (error: any): any
}