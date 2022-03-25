import {
  request
} from "../network/request.js";

export default {
  //请求上车热点数据并缓存，避免重复请求
  // getGetOnData(context) {
  //   if (context.state.get_on_data == null) {
  //     //包装一层Promise控制数据加载完成后再进行绘图
  //     return new Promise((resolve, reject) => {
  //       request({
  //           url: "/get_on_data",
  //         })
  //         .then((res) => {
  //           console.log("get_on_data success");
  //           context.commit("saveGetOnData", res)
  //           resolve(res)
  //         })
  //         .catch((err) => {
  //           reject(err)
  //           console.log(err);
  //         });
  //     })
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       resolve(context.state.get_on_data)
  //     })
  //   }

  // },
  // //请求下车热点数据并缓存，避免重复请求
  // getGetOffData(context) {
  //   if (context.state.get_off_data == null) {
  //     return new Promise((resolve, reject) => {
  //       request({
  //           url: "/get_off_data",
  //         })
  //         .then((res) => {
  //           console.log("get_off_data success");
  //           context.commit("saveGetOffData", res)
  //           resolve(res)
  //         })
  //         .catch((err) => {
  //           reject(err)
  //           console.log(err);
  //         });
  //     })
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       resolve(context.state.get_off_data)
  //     })
  //   }
  // },
  // 路线绘制测试
  getRouteData(context) {
    if (context.state.route_data == null) {
      request({
          url: "/home_route",
        })
        .then((res) => {
          console.log("get_route_data success");
          context.commit("saveRouteData", res)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
}