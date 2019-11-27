import { ResolvedFun, RejectedFun } from '../types'

interface Interceptor<T> {
    resolved: ResolvedFun<T>
    rejected?: RejectedFun
}

export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = []
    }

    use(resolved: ResolvedFun<T>, rejected?: RejectedFun): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1   // id
    }

    // 遍历拦截器
    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach( interceptor => {
            if(interceptor !== null){
                fn(interceptor)
            }
        })
    }

    eject(id: number): void {
        if(this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}