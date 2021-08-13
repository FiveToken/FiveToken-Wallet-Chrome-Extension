import axios from 'axios'
import { Message } from 'element-ui';
// import { baseApi } from '@/config'
const headers = {
    'Content-Type':'application/json'
}
const request = axios.create({
  //baseURL: '', // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})
request.interceptors.request.use(
  config => {
    config.headers = headers
    const { data, url } = config
    // const mToken = localStorage.getItem('mToken')
    if (typeof data === 'undefined') {
      config.data = {}
    } 
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone
request.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status && response.status !== 200) {
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err2' + error) // for debug
    Message.error('network error')
    return Promise.reject(error)
  }
)

export default request
