<template>
	<div>
		<div id="route_panel">
			<div class="bartooltip"></div>
			<div v-for="(item, index) in route_attr" :key="index" class="route_item">
				<div class="route_attr_chart" :id="getViewId(index)"></div>
				<div class="info">route index: {{ index }}</div>
				<div class="btn_area">
					<div
						class="route_bt"
						:id="getChooseId(index)"
						@click="choseRoute(index)"
						:class="isActive(index)"
					>
						show
					</div>
					<div class="route_bt" :id="getCarbonId(index)">carbon</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as d3drawer from "assets/js/drawD3";

// 展示候选路线的详细信息以及提供选择交互
export default {
	name: "routepanel",
	components: {},
	props: {
		route_attr: Object,
	},
	data() {
		return {
			show_index: 0,
		};
	},
	computed: {},
	methods: {
		//计算各个路线板块下的按钮id
		getViewId(index) {
			return "route_view" + index;
		},
		getChooseId(index) {
			return "choose_bt" + index;
		},
		getCarbonId(index) {
			return "carbon_bt" + index;
		},
		isActive(index) {
			return { active: index == this.show_index };
		},
		show() {
			let route = document.getElementById("route_panel");
			if (
				route.classList.contains("hide_window") ||
				route.classList.length == 0
			) {
				route.classList.add("show_window");
				route.classList.remove("hide_window");
			}
			this.drawBar();
		},
		hide() {
			let route = document.getElementById("route_panel");
			if (route.classList.contains("show_window")) {
				route.classList.remove("show_window");
				route.classList.add("hide_window");
				d3drawer.removeAllSvg();
				this.show_index = 0;
			}
		},

		drawBar() {
			let data = this.dataTransfer();
			for (let i = 0; i < data[0].length; i++)
				d3drawer.drawBar(this.getViewId(i), data[0][i], data[1]);
		},

		choseRoute(index) {
			if (index == this.show_index) return;
			this.$emit("choose-route", index);
			this.show_index = index;
		},

		//转换数据格式
		dataTransfer() {
			let res = [];
			let time = [],
				cost = [],
				transfer = [],
				carbon = [];

			for (let i = 0; i < this.route_attr.length; i++) {
				time.push(this.route_attr[i].cost_time);
				cost.push(this.route_attr[i].cost_money);
				transfer.push(this.route_attr[i].transfer_time);
				carbon.push(this.route_attr[i].route_carbon);
			}
			let max_data = [
				Math.max(...time),
				Math.max(...cost),
				Math.max(...transfer),
				Math.max(...carbon),
			];
			for (let i = 0; i < time.length; i++)
				res.push([time[i], cost[i], transfer[i], carbon[i]]);
			return [res, max_data];
		},
	},
};
</script>

<style scoped lang="scss">
$div_height: 250px;

#route_panel {
	position: absolute;
	left: 700px;
	bottom: -$div_height;
	width: 1100px;
	height: $div_height;
	background-color: white;
	box-shadow: 0 0 10px #888888;
	z-index: 9;
	display: flex;
	justify-content: space-around;
	align-items: center;
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
		bottom: -$div_height;
	}

	100% {
		bottom: 10px;
	}
}

@keyframes leave {
	0% {
		bottom: 10px;
	}

	100% {
		bottom: -$div_height;
	}
}

.bartooltip {
	position: fixed;
	opacity: 0;
	z-index: 10;
	width: 80px;
	height: 25px;
	background-color: white;
	border: 1px solid #e8e8e8;
	font-size: 15px;
	border-radius: 4px;
	color: rgb(85, 85, 85);
	box-shadow: 0 0 5px #888888;
	line-height: 25px;
	user-select: none;
	text-align: center;
}

.route_item {
	position: relative;
	width: 200px;
	height: 90%;
	padding: 5px;
	background-color: aliceblue;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.route_attr_chart {
	position: relative;
	top: 0%;
	width: 100%;
	height: 55%;
	// background-color: bisque;
}

.info {
	position: relative;
	height: 13%;
	width: 90%;
	background-color: #cddeff;
	font-size: 18px;
	font-family: Georgia, serif;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
}

.btn_area {
	position: relative;
	/* left: 5%; */
	width: 100%;
	height: 15%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	// background-color: rgb(86, 223, 143);
}

.route_bt {
	width: 80px;
	height: 30px;
	background-color: #74afce;
	text-align: center;
	line-height: 30px;
	font-size: 19px;
	font-family: Georgia, serif;
	cursor: pointer;
	border-radius: 5px;
	color: white;
	box-shadow: 0 0 5px #888888;
}

.active {
	cursor: not-allowed;
	/* pointer-events: none; */
	background-color: gray;
}
</style>
