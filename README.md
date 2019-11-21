# TypeScript-Axios
使用typeScript封装一个axios 从需求到实现

## 需求分析
> 本项目通过使用typeScript来重构axios框架，下面是重构需要实现的需求
- Features
    - 在浏览器端使用XMLHttpRequest对象与服务器通信
    - 支持Promise Api
    - 支持请求、响应拦截
    - 支持请求数据和响应数据的转换
    - 支持请求的取消
    - JSON数据的自动转换
    - 客户端XSRF预防
> 项目重构过程还会支持一些axios库所支持的其他一些feature，会在下面更新！！！

## 使用TypeScript Library Starter初始化一个Ts项目
`git clone https://github.com/alexjoverm/typescript-library-starter.git`
- 关联到自己的git Repositories


## 编写基础请求代码
```
实现axios最基本的操作：通过传入一个对象发送请求

axios({
    method:'get',
    url:'/simple/get',
    params:{
        a:1,
        b:2
    }
})
```
#### 创建入口文件
****
删除`src`目录下的文件，创建一个`index.ts`文件，作为整个库的入口文件，然后我们定义一个axios方法，并导出
```
function axios(config){
    //  TODO
}
export default axios 
```
这里由于Ts的严格规范，config的声明会有一个隐含的`any`报错，以及代码块为空，第一个错误是由于我们在`tsconfig.json`中`strict`设置为`true`导致的
```
解决第一个问题，可以去定义一个接口类型（在src下新建types文件夹并创建index.ts用于存放公共类型定义）

# src/types/index.ts

export type METHOD = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' 

export interface AxiosRequestConfig{
    url: string,
    method?: METHOD,
    data?: any,
    params?: any
}

# src/index.ts
import { AxiosRequestConfig } from './types'

function axios(config: AxiosRequestConfig){
    //  ToDo
}
export default axios 
```
#### 实现请求逻辑（使用模块化编程），利用XMLHttpRequest发送请求
****
在src下新建一个`logic（逻辑）`文件夹并创建`xhr.ts`文件
```
# src/logic/xhr.ts

import { AxiosRequestConfig } from '../types'

export default function xhr(config: AxiosRequestConfig):void {
    // data默认为null，methods默认为get
    const { data = null, url, method = 'get' } = config

    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
    request.send(data)

}


# src/index.ts

import { AxiosRequestConfig } from './types'
import xhr from './logic/xhr'

function axios(config: AxiosRequestConfig):void {
    // ToDo
    xhr(config)
}

export default axios
```
#### 编写Demo
****
```
安装相关依赖
webpack     # 打包构建工具
webpack-dev-middleware      # express web中间件
webpack-hot-middleware      # express webpack中间件
ts-loader       # webpack 需要的相关ts的loader
tslint-loader       # webpack 需要的相关ts的loader
express     # nodeJs服务端框架
body-parser     # 中间件


examples文件 -> 多入口模式
```

## 基础功能实现
#### 处理请求url参数
****
##### 需求分析
我们希望最终请求的url后面带上我们请求是的params，例如`/xxx/xxx?a=?&b=?`,这样服务端就能通过请求的url解析到我们传来的参数数据了，实际上就是把params对象的key和value拼接到`url`上
```
参数值为数组
axios({
    method:'get',
    url:'/base/get',
    params:{
        foo:['bar','baz']
    }
})
最终请求的url是：`/base/get?foo[]=bar&foo[]=baz`
```
同时我们也要支持参数是对象、Date、特殊字符的情况，以及空格忽略，丢弃url中的hash标记，保留url中已存在的参数

> 在scr下建立helper文件夹，存放我们所有辅助函数，工具方法（url.ts、utils.ts)
src/helper/url.ts存放url相关辅助函数，在里面对url进行处理
src/helper/utils.ts存放工具辅助函数，例如类型判断等···

具体代码实现可浏览文件

##### url参数处理逻辑
```
修改src/index.ts

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
```
##### exampls - base 编写

用于测试我们需求是否实现的DEMO

#### 处理请求body
****
##### 需求分析
我们通过执行`XMLHttpRequest`对象实例的`send`方法来发送请求，并通过该方法的参数设置请求`body`数据
`send`方法的参数支持`Document`和`BodyInit`类型，`BodyInit`类型包含了`Blob`,`BufferSource`,`FormData`,`URLSearchParams`,`ReadableStream`,`USVString`,当没有数据的时候，我们还可以传入`null`

```
axios({
    method:'post',
    url:'/base/post',
    data:{
        a:1,
        b:2
    }
})
```
上面我们最常用的常见，传一个普通对象给服务端，但由于send函数不能直接接受这样普通对象的参数，所以我们需要把它**转换成JSON数据** （src/helper/data.ts)

##### data转换成JSON数据
我们要明确一点，send()接受哪一些参数，不接受哪一些参数，Blob、FormData等一些特殊对象是被send所接受的，所以我们不应该去处理所有的对象，我们只需要对普通对象进行转换
```
修改src/helper/utils.ts

const toString = Object.prototype.toString

// 类型判断工具
export function isDate(val: any): val is Date{
    return toString.call(val) === '[object Date]'
}
export function isObject(val: any): val is Object{
    return val !== null && typeof val === 'object'
}
export function isPlainObject(val: any): val is Object {
    // 判断普通对象
    return toString.call(val) === '[object Object]'
}
```
```
src/helper/data.ts

import { isPlainObject} from './utils'

export function transRequest(data: any): any {
    // 判断普通对象（不包含Blob，formData之类） 对普通对象进行转换
    if(isPlainObject(data)) {
        return JSON.stringify(data)
    }else{
        return data
    }
}
```
```
修改src/index.ts

import { AxiosRequestConfig } from './types'
import xhr from './logic/xhr'
import { bulidURL } from './helper/url'
import { transRequest } from './helper/data'

function axios(config: AxiosRequestConfig):void {
    processConfig(config)
    xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transURL(config)
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

export default axios
```
#### 处理请求header
****
axios发生请求的时候可以传入headers对象，多数情况用于规定请求的contentType，如下
```
axios({
    method:'post',
    url:'/base/post',
    headers:{
        'content-Type':'application/json;charset=utf-8'
    },
    data:{
        a:1,
        b:2
    }
})
```
既然如此，我们就需要扩展我们之前`types/index.ts`以及`logic/xhr.ts`

##### 实现processHeaders函数实现，对headers做加工
```
/**
 *  对headers进行加工
*/

import { isPlainObject } from './utils'

// 防止 content-type 与 Content-Type 不匹配
function normalizeHeaderName(headers: any,normalizedName: string): void {
    if(!headers){
        return
    }
    Object.keys(headers).forEach( name => {
        if(name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()){
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any,data: any): any {
    normalizeHeaderName(headers,'Content-Type')

    //当data是普通对象时，添加contentType
    if(isPlainObject(data)){
        if(headers && !headers['Content-Type']){
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}
```

#### 获取响应数据
****
##### 需求分析
处理服务端响应的数据，并支持Promise链式调用的方式，如下
```
axios({
    methods:'post',
    url:'/base/post',
    data:{
        a:1,
        b:2
    }
}).then(res => {
    console.log(res)
})
```
我们可以拿到`res`对象，并且我们希望该对象包括：服务端返回的数据`data`，HTTP状态码`status`，状态消息`statusText`，响应头`headers`，请求配置对象`config`以及请求`XMLHttpRequest`对象实例`request`

##### 定义接口类型
```
修改 types/index.ts

export type METHOD = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' 

export interface AxiosRequestConfig{
    url: string,
    method?: METHOD,
    headers?: any,
    data?: any,
    params?: any,
+   responseType?: XMLHttpRequestResponseType
}


// 响应数据类型
+ export interface AxiosResponse {
+    data:any,
+    status:number,
+    statusText:string,
+    headers:any,
+    config:AxiosRequestConfig,
+    request:any
+ }

// 返回一个Promise对象  继承于泛型接口
+ export interface AxiosPromise extends Promise<AxiosResponse>{}
```
```
修改xhr.ts


import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'

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
            const responseHeaders = request.getAllResponseHeaders()
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
```
```
修改 src/index.ts 添加

import { AxiosRequestConfig,AxiosPromise } from './types'

function axios(config: AxiosRequestConfig):AxiosPromise {
    processConfig(config)
    return xhr(config)
}

```
##### 处理响应Header
由于通过`getAllResponseHeaders`获取到的值是字符串形式，并且每一行会以回车符、换行符去隔开每一个`header`，所以我们需要把它转化为对象结构

###### 实现一个transHeaders函数
```
修改 helper/headers 中添加

export function transHeaders(headers: string): any{
    let result = Object.create(null)
    if(!headers){
        return result
    }
    // 以回车符换行符隔开每一个header行
    headers.split('\r\n').forEach( header => {
        // 以':'作为key和value的分割符
        let [key, value] = header.split(':') 
        key = key.trim().toLocaleLowerCase()
        if(!key){
            // 若key是空的 直接进行下一次循环，否则再去判断value
            return
        }
        if(value){
            value = value.trim()
        }
        // 赋给result
        result[key] = value
    })

    return result
}
```
##### 处理响应的data
当服务器端返回给我们的数据是字符串对象类型，我们需要将它转换为JSON对象

###### 实现一个transData函数
```
修改 helper/data.ts

export function transData(data: any): any{
    if(typeof data === 'string'){
        try{
            data = JSON.parse(data)
        }catch(e){
            console.log('转化失败 இ௰இ',e)
        }
    }

    return data
}
```
```
修改 src/index.ts

function axios(config: AxiosRequestConfig):AxiosPromise {
    processConfig(config)
    return xhr(config).then((res)=>{
        return transResponseData(res)
    })
}

// 对响应数据data做处理
function transResponseData( response: AxiosResponse): AxiosResponse{
    response.data = transData(response.data)
    return response
}
```
### 错误处理
****
#### 处理网络异常错误
```
修改 logic/xhr.ts

// 网络错误处理
request.onerror = function handleError(){
    reject(new Error('网络错误'))
}
```

#### 处理超时错误
```
修改 types/index.ts

export interface AxiosRequestConfig{
    url: string,
    method?: METHOD,
    headers?: any,
    data?: any,
    params?: any,
    responseType?: XMLHttpRequestResponseType,
+   timeout?: number // 超时时间
}
```
```
修改 logic/xhr.ts

if(timeout){
    request.timeout = timeout
}
request.ontimeout = function handleTimeout(){
    reject(new Error(`${timeout}ms, request is timeout`))
}
```

#### 非200处理
```

resolve(response)  → handleResponse(response)

function handleResponse(response: AxiosResponse): void{
    if(response.status >= 200 && response.status < 300){
        resolve(response)
    }else{
        reject(new Error(`STATUS: ${response.status} ,request is failed`))
    }
}
```

### 错误信息细化
****
```
修改 types/index.ts

export interface AxiosError extends Error {
    config: AxiosRequestConfig
    code?: string
    request?: any
    response?: AxiosResponse
    isAxiosError: boolean
}
```
```
新增 helper/error.ts

import { AxiosRequestConfig,AxiosResponse } from "../types"

export class AxiosError extends Error {
    isAxiosError:boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse

    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
      ) {
        super(message)
    
        this.config = config
        this.code = code
        this.request = request
        this.response = response
        this.isAxiosError = true
    
        Object.setPrototypeOf(this, AxiosError.prototype)
      }
}

// 工厂函数
export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    const error = new AxiosError(message, config, code, request, response)
    return error
}
```