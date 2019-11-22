import axios from '../../src/index'
import { AxiosError } from '../../src/helper/error'

// 404
axios({
  method: 'get',
  url: '/error/get1'
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log('~~~~',e)
})

// 随机500
axios({
  method: 'get',
  url: '/error/get'
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log('----',e)
})

// 随机500
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  }).then((res) => {
    console.log(res)
  }).catch((e) => {
    console.log('@@@@@',e)
  })
}, 5000)

// 2s后不返回 则报错
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
}).then((res) => {
  console.log(res)
}).catch((e:AxiosError) => {
  console.log(e.message)
  console.log(e.config)
  console.log(e.code)
  console.log(e.request)
  console.log(e.isAxiosError)
})
