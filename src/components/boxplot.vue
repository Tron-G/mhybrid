<template>
	<div>
		<div id="boxplot"></div>
	</div>
</template>

<script>
import { drawBoxplot } from "assets/js/drawEcharts";
//主要绘制路线种群的质量分布
export default {
	name: "boxplot",
	components: {},
	data() {
		return {};
	},
	computed: {},
	methods: {
		show(data) {
			let boxplot = document.getElementById("boxplot");
			if (
				boxplot.classList.contains("hide_window") ||
				boxplot.classList.length == 0
			) {
				boxplot.classList.add("show_window");
				boxplot.classList.remove("hide_window");

				drawBoxplot("boxplot", data);
			}
		},
		hide() {
			let boxplot = document.getElementById("boxplot");
			if (boxplot.classList.contains("show_window")) {
				boxplot.classList.remove("show_window");
				boxplot.classList.add("hide_window");
			}
		},
	},
};
</script>

<style scoped>
#boxplot {
	position: absolute;
	bottom: -350px;
	left: 50px;
	width: 400px;
	height: 350px;
	background-color: white;
	box-shadow: 0 0 10px #888888;
	z-index: 9;
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
		bottom: -350px;
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
		bottom: -350px;
	}
}
</style>
