/**
 * 工具辅助方法
*/

const toString = Object.prototype.toString

// 类型判断工具
export function isDate(val: any): val is Date{
    return toString.call(val) === '[object Date]'
}
// export function isObject(val: any): val is Object{
//     return val !== null && typeof val === 'object'
// }
export function isPlainObject(val: any): val is Object {
    // 判断普通对象
    return toString.call(val) === '[object Object]'
}