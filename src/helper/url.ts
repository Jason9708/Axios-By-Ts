/**
 *  存放url相关的辅助函数
*/


// 编码
function encode(val: string): string {
    return encodeURIComponent(val).replace(/%40/g,'@').replace(/%3A/ig,':')
        .replace(/%24/g,'$').replace(/%2C/ig,',').replace(/%20/g,'+')
        .replace(/%5B/ig,'[').replace(/%5D/ig,']')
}


import { isDate, isObject} from './utils'

export function bulidURL(url: string, params?: any){
    if(!params) return url
    
    
    // params存在 则遍历params，拼接params到url上
    const bulitArr: string[] = []

    Object.keys(params).forEach(( key: any) => {
        const value = params[key]
        if(value === null || typeof value === 'undefined'){
            return
        }

        // 由于value类型可以能是数组也可以不是数组，所以需要先统一
        let values = []  // 临时变量
        // 如果在key的value是数组
        if(Array.isArray(value[key])) {
            values = value
            key += '[]' // 在key后面拼接上[]
        }else{
            values = [value] // 统一成数组
        }

        values.forEach( (val:any) => {
            // 判断val类型
            if(isDate(val)){
                val = val.toISOString()
            }else if(isObject(val)){
                val = JSON.stringify(val)
            }
            bulitArr.push(`${encode(key)}=${encode(val)}`)
        })
    })

    let processedParams = bulitArr.join('&')

    if(processedParams){
        // 若url上带有哈希标识，则要去掉
        const hashIndex = url.indexOf('#')
        if(hashIndex !== -1){
            url = url.slice(0,hashIndex)
        }
        // 判断url上是否已经带有'?',若有'?'说明已经带上了参数，则要拼接上'&'来拼接下个参数
        url += (url.indexOf('?') === -1 ? '?' : '&') + processedParams
    }

    return url
}