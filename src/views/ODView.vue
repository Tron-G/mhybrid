<template>
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
</template>

<script>
import * as mapdrawer from "../assets/js/drawMapFigure";
import { request } from "../network/request.js";

export default {
	name: "ODView",
	components: {},
	data() {
		return {
			map: null,
			show_status: "get_on",
			get_on_data: null,
			get_off_data: null,
		};
	},
	mounted() {
		this.map = mapdrawer.initMap("main_view");
		this.requestData("get_on")
			.then((res) => {
				mapdrawer.drawPoint(this.map, res, "get_on");
			})
			.catch((err) => console.log(err));
	},
	beforeRouteLeave(to, from, next) {
		this.map.remove();
		next();
	},
	computed: {},
	methods: {
		// drawGeton() {
		// 	console.log("**************draw get on");
		// 	if (this.show_status !== "geton") {
		// 		this.show_status = "geton";
		// 		// mapdrawer.removeLayerByID(this.map, "get_off");
		// 		this.map.remove();
		// 		this.map = mapdrawer.initMap("main_view");

		// 		this.requestData("get_on").then((res) => {
		// 			console.log("get on data", res);
		// 			mapdrawer.drawPoint(this.map, res, "get_on");
		// 		});
		// 	}
		// },
		// // xxxxxxxxxxxxxxxxxxxxxxxxxx
		// drawGetoff() {
		// 	console.log("**************draw get off");
		// 	if (this.show_status !== "getoff") {
		// 		this.show_status = "getoff";
		// 		// this.map = mapdrawer.removeLayerByID(this.map, "get_on");
		// 		this.map.remove();
		// 		this.map = mapdrawer.initMap("main_view");
		// 		// console.log("okk", this.show_status);
		// 		this.requestData("get_off").then((res) => {
		// 			console.log("get off data", res);
		// 			mapdrawer.drawPoint(this.map, res, "get_off");
		// 		});
		// 	}
		// },
		/**
		 * g根据点击按钮切换绘图类型，上车，下车，不显示
		 *@param {string} data_type "get_on"|| "get_off"|| "hidden"
		 *@return {promise}
		 */
		switchDrawType(draw_type) {
			if (this.show_status == draw_type) return;
			this.map.remove();
			this.map = mapdrawer.initMap("main_view");
			if (draw_type == "hidden") {
				this.show_status = "hidden";
			} else {
				this.show_status = draw_type;
				this.requestData(draw_type).then((res) => {
					console.log(draw_type + " data", res);
					mapdrawer.drawPoint(this.map, res, draw_type);
				});
			}
		},
		/**
		 * 数据请求
		 *@param {string} data_type "get_on"|| "get_off"
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
			}
			if (datas == null) {
				return request({ url: urls });
			} else {
				return new Promise((resolve, reject) => {
					resolve(datas);
				});
			}
		},
	},
};
</script>

<style scoped>
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
