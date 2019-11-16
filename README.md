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
