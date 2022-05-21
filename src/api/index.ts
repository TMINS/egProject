import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// import  from 'qs'
// import { baseURL } from '@/config';
import { StatusMessage } from './status'



const baseURL = ''
axios.defaults.timeout = 2500;
const axiosInstance: AxiosInstance  = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  transformRequest: [
    (data) => {
      // data = qs.stringify(data);
      return data
    }
  ]
})
// 响应拦截
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 设置token以及定义请求的token参数，本地化存储
    if(response.headers.authorization){
      localStorage.setItem('app_token', response.headers.authorization)
    }else {
      if(response.data && response.data.token) {
        localStorage.setItem('app_token', response.data.token)
      }
    }

    if(response.status === 200) {
      return response
    }else {
      StatusMessage(response.status)
      return response
    }
  },
  (error: AxiosError) => {
    const { response } = error;
    if(response) {
      StatusMessage(response.status)
      return Promise.reject(response.data)
    } else {
      // message.error(`${error}`)
    }
  }
)
// 请求拦截
axiosInstance.interceptors.request.use(
  (config:AxiosRequestConfig) => {
    // const { user } = store.state
    // 设置请求头token，加密操作
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (config: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    axios(config).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}