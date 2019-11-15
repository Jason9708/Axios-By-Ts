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

