<template>
	<div>
		<div id="route_panel"></div>
	</div>
</template>

<script>
export default {
	name: "routepanel",
	components: {},
	data() {
		return {};
	},
	computed: {},
	methods: {},
};
</script>

<style scoped>
#route_panel {
	position: absolute;
	left: 450px;
	bottom: -350px;
	width: 280px;
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
		bottom: -300px;
	}

	100% {
		bottom: 5px;
	}
}

@keyframes leave {
	0% {
		bottom: 5px;
	}

	100% {
		bottom: -300px;
	}
}
</style>
