<template>
	<div>
		<div id="route_info">
			<div>
				<div id="head">
					<table id="tb">
						<tr>
							<td>
								<img :src="timeImg" class="imgs" />
								<p class="items">time :</p>
								<p class="sum" v-if="info != null">{{ getTime }}</p>
							</td>
							<td>
								<img :src="disImg" alt="" class="imgs" />
								<p class="items">distance :</p>
								<p class="sum" v-if="info != null">{{ getDistance }}</p>
							</td>
						</tr>
						<tr>
							<td>
								<img :src="costImg" alt="" class="imgs" />
								<p class="items">cost :</p>
								<p class="sum" v-if="info != null">{{ getCost }}</p>
							</td>
							<td>
								<img :src="transImg" alt="" class="imgs" />
								<p class="items">transfer :</p>
								<p class="sum" v-if="info != null">{{ getTransfer }}</p>
							</td>
						</tr>
					</table>
				</div>
				<div id="detail"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { drawRouteInfo, removeSvg } from "assets/js/drawD3";

export default {
	name: "routeInfo",
	components: {},
	data() {
		return {
			timeImg: require("../assets/img/time.svg"),
			disImg: require("../assets/img/distance.svg"),
			costImg: require("../assets/img/cost.svg"),
			transImg: require("../assets/img/trans.svg"),
			info: null,
		};
	},
	computed: {
		getTime() {
			return Math.round(this.info["cost_time"] / 60) + " min";
		},
		getDistance() {
			let v = (this.info["total_distance"] / 1000).toFixed(2);
			return v + " km";
		},
		getCost() {
			return "￥ " + this.info["cost_money"];
		},
		getTransfer() {
			return this.info["transfer_time"];
		},
	},
	methods: {
		show(data) {
			this.info = data;
			// console.log(data);
			let info_panel = document.getElementById("route_info");
			if (
				info_panel.classList.contains("hide_window") ||
				info_panel.classList.length == 0
			) {
				info_panel.classList.add("show_window");
				info_panel.classList.remove("hide_window");
				this.drawInfo(data);
			}
		},
		hide() {
			let info_panel = document.getElementById("route_info");
			if (info_panel.classList.contains("show_window")) {
				info_panel.classList.add("hide_window");
				info_panel.classList.remove("show_window");
				removeSvg();
			}
		},
		drawInfo(data) {
			drawRouteInfo(data, "detail");
		},
	},
};
</script>

<style scoped lang="scss">
$div_width: 400px;

#route_info {
	position: absolute;
	width: $div_width;
	height: 600px;
	background-color: white;
	box-shadow: 0 0 10px #888888;
	border-radius: 5px;
	z-index: 9;
	top: 15%;
	left: -$div_width;
}

#head {
	position: absolute;
	top: 0;
	right: 0;
	width: $div_width;
	height: 80px;
	background-color: rgb(184, 219, 173);
	box-shadow: 0 5px 5px #d3d2d2;
	z-index: 10;
	border-radius: 5px;
	border-style: solid;
	border-color: rgb(177, 177, 177);
	border-width: 1px;
	// background-color: antiquewhite;
	// margin: 4px;
}

#tb {
	position: absolute;
	top: 5px;
	left: 0;
	width: 98%;
	overflow: hidden;
	margin: 0 4px;
}
#tb td {
	width: 50%;
	height: 30px;
	text-align: left;
}

#tb .imgs {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	top: 0px;
	left: 10px;
	height: 19px;
	width: 19px;
}

#tb p {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	margin: 0;
	left: 20px;
	font-size: 16px;
}

.items {
	font-weight: bold;
}

#detail {
	position: absolute;
	width: 100%;
	height: 520px;
	background-color: white;
	top: 80px;
	left: 0;
	border-radius: 5px;
}

.show_window {
	animation-name: enter;
	animation-duration: 1s;
	animation-fill-mode: forwards;
}

.hide_window {
	animation-name: leave;
	animation-duration: 1s;
	animation-fill-mode: forwards;
}

@keyframes enter {
	0% {
		left: -$div_width;
	}

	100% {
		left: 20px;
	}
}

@keyframes leave {
	0% {
		left: 20px;
	}

	100% {
		left: -$div_width;
	}
}
</style>
