import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helper/utils'
// 工厂类型， 创建一个axios实例，混合类型
function createInstance(): AxiosInstance{
    const context = new Axios()
    const instance = Axios.prototype.request.bind(context)

    extend(instance, context)

    return instance as AxiosInstance
}

const axios = createInstance()

export default axios