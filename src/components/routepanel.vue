<template>
	<div>
		<div id="route_panel">
			<div class="bartooltip"></div>
			<div id="sort_tip">sort by:</div>
			<div id="sort_panel">
				<div
					id="time_bt"
					class="btns sort_bt"
					@click="sortResult('time')"
					:class="{ active: now_sort == 'time' }"
				>
					time
				</div>
				<div
					id="cost_bt"
					class="btns sort_bt"
					@click="sortResult('cost')"
					:class="{ active: now_sort == 'cost' }"
				>
					cost
				</div>
				<div
					id="distance_bt"
					class="btns sort_bt"
					@click="sortResult('distance')"
					:class="{ active: now_sort == 'distance' }"
				>
					distance
				</div>
				<div
					id="corbon_bt"
					class="btns sort_bt"
					@click="sortResult('carbon')"
					:class="{ active: now_sort == 'carbon' }"
				>
					carbon
				</div>
			</div>
			<div id="result_view">
				<div
					v-for="(item, index) in route_attr"
					:key="index"
					class="route_item"
					:id="getItemId(index)"
				>
					<div class="route_attr_chart" :id="getViewId(index)"></div>
					<div class="info">route index: {{ index + 1 }}</div>
					<div class="btn_area">
						<div
							class="route_bt btns"
							:id="getChooseId(index)"
							@click="chooseRoute(index)"
							:class="isActive(index)"
						>
							show
						</div>
						<div
							class="route_bt btns"
							:id="getCarbonId(index)"
							@click="showRouteCarbon(index)"
							:class="isCarbonActive(index)"
						>
							carbon
						</div>
					</div>
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
			// 当前显示的路线id
			show_index: 0,
			// 当前显示的碳轨迹id，默认不显示
			show_carbon: -1,
			// 当前的排序条件
			now_sort: "time",
		};
	},
	computed: {},
	methods: {
		//计算各个路线板块下的按钮id
		getItemId(index) {
			return "result_item" + index;
		},
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
		isCarbonActive(index) {
			return { active: index == this.show_carbon };
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
				// 隐藏窗口的同时初始化各个选项
				this.show_index = 0;
				this.now_sort = "time";
				this.show_carbon = -1;
				d3drawer.resetItemPos();
			}
		},

		drawBar() {
			let data = this.dataTransfer();
			for (let i = 0; i < data[0].length; i++)
				d3drawer.drawBar(this.getViewId(i), data[0][i], data[1], data[2]);
		},
		// 监听选择的路线, 只展示多模式路线，只能返回0到4
		chooseRoute(index) {
			if (index == this.show_index) return;
			this.$emit("choose-route", index);
			this.show_index = index;
			this.show_carbon = -1;
		},
		// 监听选择路线的碳排放轨迹，同时展示多模式路线和碳排放，返回的状态码加10
		showRouteCarbon(index) {
			if (index == this.show_carbon) return;
			//展示碳排放轨迹之前切换选择路线
			if (index != this.show_index) this.show_index = index;
			this.show_carbon = index;
			this.$emit("choose-route", index + 10);
		},
		// 点击按钮进行排序
		sortResult(sort_type) {
			if (sort_type == this.now_sort) return;
			let new_index = d3drawer.sortItem(
				this.route_attr,
				sort_type,
				this.now_sort
			);
			this.now_sort = sort_type;
			this.show_carbon = -1;
			this.chooseRoute(new_index);
		},

		//转换数据格式
		dataTransfer() {
			let res = [];
			let time = [],
				cost = [],
				distance = [],
				carbon = [];

			for (let i = 0; i < this.route_attr.length; i++) {
				time.push(this.route_attr[i].cost_time);
				cost.push(this.route_attr[i].cost_money);
				distance.push(this.route_attr[i].total_distance);
				carbon.push(this.route_attr[i].route_carbon);
			}
			let max_data = [
				Math.max(...time),
				Math.max(...cost),
				Math.max(...distance),
				Math.max(...carbon),
			];
			let min_data = [
				Math.min(...time),
				Math.min(...cost),
				Math.min(...distance),
				Math.min(...carbon),
			];
			for (let i = 0; i < time.length; i++)
				res.push([time[i], cost[i], distance[i], carbon[i]]);
			return [res, max_data, min_data];
		},
	},
};
</script>

<style scoped lang="scss">
$div_height: 250px;

#route_panel {
	position: absolute;
	left: 25%;
	bottom: -$div_height;
	width: 1250px;
	height: $div_height;
	background-color: #fcfcfc;
	box-shadow: 0 0 10px #888888;
	border-radius: 5px;
	z-index: 9;
}
#sort_tip {
	position: absolute;
	top: 10px;
	left: 15px;
	width: 100px;
	height: 10%;
	// background-color: #e8e8e8;
	font-family: Georgia, serif;
	font-size: 20px;
	font-weight: bold;
}
#sort_panel {
	position: absolute;
	top: 15%;
	left: 10px;
	width: 100px;
	height: 70%;
	// background-color: #ece8e8;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.sort_bt {
	background-color: #ffb085;
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

#result_view {
	position: absolute;
	top: 0;
	left: 110px;
	width: 1140px;
	height: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.bartooltip {
	position: fixed;
	opacity: 0;
	z-index: 10;
	width: 120px;
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

.btns {
	width: 80px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	font-size: 19px;
	font-family: Georgia, serif;
	cursor: pointer;
	border-radius: 5px;
	box-shadow: 0 0 5px #888888;
}

.route_bt {
	background-color: #74afce;
	color: white;
}

.active {
	cursor: not-allowed;
	/* pointer-events: none; */
	background-color: gray;
	box-shadow: 0 0 0px white;
}
</style>
