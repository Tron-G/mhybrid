/*
 * @Author: tron
 * @Date: 2022-08-10 20:51:03
 * @LastEditTime: 2022-08-10 21:09:52
 * @FilePath: \mhybrid\src\components\common\loading\index.js
 */
import Loading from "./Loading";
import { createApp } from "vue";

const load = {};

load.install = function (app) {
	//1、实例化并绑定组件
	const loading = createApp(Loading);
	const instance = loading.mount(document.createElement("div"));

	//2.将挂载的Node添加到body中
	document.body.appendChild(instance.$el);

	//3、定义全局
	app.config.globalProperties.$loading = instance;
};

export default load;
