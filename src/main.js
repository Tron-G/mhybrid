/*
 * @Author: tron
 * @Date: 2022-02-27 20:27:21
 * @LastEditTime: 2022-08-10 21:10:35
 * @FilePath: \mhybrid\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import loading from "./components/common/loading";

const app = createApp(App).use(store).use(router).use(loading).mount("#app");
export default app;
