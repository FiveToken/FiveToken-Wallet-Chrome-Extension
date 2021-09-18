import axios from 'axios'
const headers = {
  'Content-Type': 'application/json'
}
const request = axios.create({
  // baseURL: '', // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})
request.interceptors.request.use(
  config => {
    config.headers = headers
    const { data } = config
    if (typeof data === 'undefined') {
      config.data = {}
    }
    return config
  },
  error => {
    console.error('network error' + error) // for debug
    return Promise.reject(error)
  }
)
// respone
request.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status && response.status !== 200) {
      console.log('network error1' + JSON.stringify(res)) // for debug
      return Promise.reject(response || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('network error2' + JSON.stringify(error)) // for debug
    return Promise.reject(error)
  }
)

export default request
