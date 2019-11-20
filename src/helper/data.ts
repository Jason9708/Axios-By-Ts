/**
 *  存放数据转换的文件
*/

import { isPlainObject } from './utils'

export function transRequest(data: any): any {
    // 判断普通对象（不包含Blob，formData之类） 对普通对象进行转换
    if(isPlainObject(data)) {
        return JSON.stringify(data)
    }else{
        return data
    }
}

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