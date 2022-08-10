/*
 * @Author: tron
 * @Date: 2022-03-19 16:32:17
 * @LastEditTime: 2022-08-10 21:33:09
 * @FilePath: \mhybrid\src\network\request.js
 */
import axios from "axios";
import app from "../main";

export function request(config) {
	const instance = axios.create({
		baseURL: "http://127.0.0.1:5000/",
		timeout: 5000,
	});
	//响应拦截器
	instance.interceptors.response.use(
		(res) => {
			// console.log(res);
			return res.data;
		},
		(err) => {
			console.log(err);
		}
	);
	return instance(config);
}

/**
 * 附带加载动画的网络请求器
 */
export function requestAnimation(config) {
	const instance = axios.create({
		baseURL: "http://127.0.0.1:5000/",
		timeout: 180000,
	});

	//请求拦截
	instance.interceptors.request.use(
		(config) => {
			// store.commit("showLoading");
			app.$loading.show("Calculating...");
			return config;
		},
		(err) => {
			console.log(err);
		}
	);

	//响应拦截器
	instance.interceptors.response.use(
		(res) => {
			// store.commit("hideLoading");
			app.$loading.close();
			return res.data;
		},
		(err) => {
			console.log(err);
		}
	);

	return instance(config);
}
