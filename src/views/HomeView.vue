<template>
	<div id="map_view">
		<div id="od_panel">
			<div
				@click="switchDrawType('get_on')"
				id="geton_bt"
				class="btn"
				:class="{ active: show_status == 'get_on' }"
			>
				geton
			</div>
			<div
				@click="switchDrawType('get_off')"
				id="getoff_bt"
				class="btn"
				:class="{ active: show_status == 'get_off' }"
			>
				getoff
			</div>
			<div
				@click="switchDrawType('hidden')"
				id="hidden_bt"
				class="btn"
				:class="{ active: show_status == 'hidden' }"
			>
				hidden
			</div>
		</div>
		<div id="test_btn">
			<button @click="drawRoute">draw</button>
			<button @click="redraw">redraw</button>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

import * as mapdrawer from "../assets/js/drawMapFigure";
import { request } from "../network/request.js";
export default {
	name: "HomeView",
	components: {
		// HelloWorld,
	},
	data() {
		return {
			map: null,
			//追踪页面的上下车显示状态
			show_status: "hidden",
			get_on_data: null,
			get_off_data: null,
			cluster_net: null,
			temp: null,
		};
	},
	created() {
		this.$store.dispatch("getRouteData");
	},
	mounted() {
		this.map = mapdrawer.initMap("map_view");
		this.listenPage();
		this.requestData("cluster_net").then((res) => {
			mapdrawer.drawClusterNet(this.map, res);
			// this.cluster_net = res;
			this.cachedData("cluster_net", res);
		});
	},
	beforeRouteLeave(to, from, next) {
		this.map.remove();
		next();
	},
	methods: {
		drawRoute() {
			// mapdrawer.drawRoute(this.map, this.$store.state.route_data);
			// mapdrawer.drawTestLink(this.map);
			// this.map.remove();
			// console.log(this.map);
		},
		redraw() {
			// this.map = mapdrawer.initMap("map_view");
		},

		/**
		 * g根据点击按钮切换绘图类型，上车，下车，不显示
		 *@param {string} draw_type "get_on"|| "get_off"|| "hidden"
		 */
		switchDrawType(draw_type) {
			if (this.show_status == draw_type) return;
			if (this.show_status != "hidden") {
				this.map.remove();
				this.map = mapdrawer.initMap("map_view");
				mapdrawer.drawClusterNet(this.map, this.cluster_net);
			}
			if (draw_type == "hidden") {
				this.show_status = "hidden";
			} else {
				this.show_status = draw_type;
				this.requestData(draw_type).then((res) => {
					// console.log(draw_type + " data", res);
					mapdrawer.drawPoint(this.map, res, draw_type);
					this.cachedData(draw_type, res);
				});
			}
		},

		/**
		 * 数据请求
		 *@param {string} data_type "get_on"|| "get_off" || "cluster_net"
		 *@return {promise}
		 */
		requestData(data_type) {
			let datas = null,
				urls = "";
			if (data_type == "get_on") {
				datas = this.get_on_data;
				urls = "/get_on_data";
			} else if (data_type == "get_off") {
				datas = this.get_off_data;
				urls = "/get_off_data";
			} else if (data_type == "cluster_net") {
				datas = this.cluster_net;
				urls = "/get_cluster_network";
			}
			if (datas == null) {
				return request({ url: urls });
			} else {
				return new Promise((resolve, reject) => {
					resolve(datas);
				});
			}
		},

		/**
		 * 缓存数据
		 *@param {string} data_type
		 @param {object} requested_data 后台返回的数据
		 */
		cachedData(data_type, requested_data) {
			switch (data_type) {
				case "get_on":
					if (!this.get_on_data) this.get_on_data = requested_data;
					break;
				case "get_off":
					if (!this.get_off_data) this.get_off_data = requested_data;
					break;
				case "cluster_net":
					if (!this.cluster_net) this.cluster_net = requested_data;
					break;
				default:
					break;
			}
		},
		//监听页面刷新
		listenPage() {
			window.onbeforeunload = function (e) {
				this.map.remove();
				// e = e || window.event;
				// if (e) {
				// 	e.returnValue = "关闭提示";
				// }
				// return "关闭提示";
			};
		},
		//////////////////////////////////////////////////
	},
};
</script>

<style lang="scss" scoped>
@import "assets/css/mapboxgl.css";
@import "assets/css/mapboxgl2.css";

#map_view {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 0;
}

#test_btn {
	position: absolute;
	top: 5%;
	left: 5%;
	width: 100px;
	height: 100px;
	background-color: rgb(243, 224, 232);
	z-index: 9;
}

#od_panel {
	position: absolute;
	top: 1%;
	left: 45%;
	width: 280px;
	height: 50px;
	background-color: rgba(193, 193, 193, 0.3);
	box-shadow: 0 0 10px #888888;
	z-index: 9;
}

#geton_bt {
	position: absolute;
	top: 10px;
	left: 10px;
}
#getoff_bt {
	position: absolute;
	top: 10px;
	left: 100px;
}
#hidden_bt {
	position: absolute;
	top: 10px;
	left: 190px;
}

.btn {
	width: 80px;
	height: 30px;
	cursor: pointer;
	border-radius: 2px;
	text-align: center;
	color: white;
	display: inline;
	font-weight: bold;
	font-size: 18px;
	line-height: 30px;
	background-color: rgb(76, 159, 238);
}
.active {
	cursor: not-allowed;
	/* pointer-events: none; */
	background-color: gray;
}
</style>
