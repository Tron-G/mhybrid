<template>
	<div>
		<div id="pie_view"></div>
	</div>
</template>

<script>
import { drawPieChart } from "assets/js/drawEcharts";
export default {
	name: "trafficpie",
	components: {},
	data() {
		return {};
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

				drawPieChart("pie_view", title, data);
			}
		},
		hide() {
			let pie_view = document.getElementById("pie_view");
			if (pie_view.classList.contains("show_window")) {
				pie_view.classList.remove("show_window");
				pie_view.classList.add("hide_window");
			}
		},
	},
};
</script>

<style scoped>
#pie_view {
	position: absolute;
	width: 300px;
	height: 300px;
	bottom: 450px;
	right: -300px;
	background-color: white;
	box-shadow: 0 0 10px #888888;
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
		right: -300px;
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
		right: -300px;
	}
}
</style>
