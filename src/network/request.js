import axios from "axios";
import store from '../store'


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

/**
 * 附带加载动画的网络请求器
 */
export function requestAnimation(config) {

  const instance = axios.create({
    baseURL: "http://127.0.0.1:5000/",
    timeout: 180000
  })

  //请求拦截
  instance.interceptors.request.use(config => {
    store.commit("showLoading");
    return config;
  }, err => {
    console.log(err);
  })

  //响应拦截器
  instance.interceptors.response.use(res => {


    store.commit("hideLoading");
    return res.data;
  }, err => {
    console.log(err);
  })

  return instance(config)
}