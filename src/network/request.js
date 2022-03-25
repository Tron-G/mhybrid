import axios from "axios";

export function request(config) {

  const instance = axios.create({
    baseURL: "http://127.0.0.1:5000/",
    timeout: 5000
  })
  //响应拦截器
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data
  }, err => {
    console.log(err);
  })
  return instance(config)
}