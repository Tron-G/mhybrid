<template>
	<div>
		<div id="pie_view"></div>
	</div>
</template>

<script>
import { drawPie } from "assets/js/drawEcharts";
export default {
	name: "trafficpie",
	components: {},
	data() {
		return {
			traffic_title: [],
			traffic_data: [],
		};
	},
	computed: {},
	methods: {
		show(title, data) {
			let pie_view = document.getElementById("pie_view");
			if (
				pie_view.classList.contains("hide_window") ||
				pie_view.classList.length == 0
			) {
				pie_view.classList.add("show_window");
				pie_view.classList.remove("hide_window");
			}
			if (this.traffic_title.indexOf(title) != -1) return;

			this.traffic_title.push(title);
			this.traffic_data.push(data);

			drawPie(
				"pie_view",
				this.traffic_title,
				this.traffic_data,
				this.clearData
			);
		},
		hide() {
			let pie_view = document.getElementById("pie_view");
			if (pie_view.classList.contains("show_window")) {
				pie_view.classList.remove("show_window");
				pie_view.classList.add("hide_window");
			}
		},
		clearData() {
			this.traffic_title = [];
			this.traffic_data = [];
			this.hide();
		},
	},
};
</script>

<style scoped lang="scss">
$div_width: 370px;
#pie_view {
	position: absolute;
	width: $div_width;
	height: 370px;
	bottom: 450px;
	right: -$div_width;
	background-color: #fcfcfc;
	box-shadow: 0 0 10px #888888;
	border-radius: 5px;
	z-index: 9;
}

.show_window {
	animation-name: enter;
	animation-duration: 0.5s;
	animation-fill-mode: forwards;
}

.hide_window {
	animation-name: leave;
	animation-duration: 0.5s;
	animation-fill-mode: forwards;
}
@keyframes enter {
	0% {
		right: -$div_width;
	}

	100% {
		right: 10px;
	}
}

@keyframes leave {
	0% {
		right: 10px;
	}

	100% {
		right: -$div_width;
	}
}
</style>
