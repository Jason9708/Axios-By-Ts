/**
 * 工具辅助方法
*/

const toString = Object.prototype.toString

// 类型判断工具
export function isDate(val: any): val is Date{
    return toString.call(val) === '[Object Date]'
}
export function isObject(val: any): val is Object{
    return val !== null && typeof val === 'object'
}