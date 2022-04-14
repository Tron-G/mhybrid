<template>
	<div>
		<div id="search_panel">
			<input type="text" id="origin_win" placeholder="Origin" name="origin" />
			<input
				type="text"
				id="destination_win"
				placeholder="Destination"
				name="destination"
			/>
			<div id="search_btn" @click="searchClick()">search</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "search",
	components: {},
	data() {
		return {};
	},
	methods: {
		searchClick() {
			const origin_site = document.getElementById("origin_win").value,
				destination_site = document.getElementById("destination_win").value;
			this.$emit("search-click", { origin_site, destination_site });
		},
		show() {
			let search_panel = document.getElementById("search_panel");
			search_panel.classList.add("show_window");
			search_panel.classList.remove("hide_window");
		},
		hide() {
			let search_panel = document.getElementById("search_panel");
			search_panel.classList.add("hide_window");
			search_panel.classList.remove("show_window");
		},
	},
};
</script>

<style scoped>
#search_panel {
	position: absolute;
	top: -80px;
	left: 15%;
	width: 280px;
	height: 50px;
	background-color: white;
	box-shadow: 0 0 10px #888888;
	z-index: 9;
}

#origin_win {
	position: absolute;
	top: 15px;
	left: 20px;
	width: 55px;
	height: 20px;
}

#destination_win {
	position: absolute;
	top: 15px;
	left: 100px;
	width: 55px;
	height: 20px;
}
#search_btn {
	position: absolute;
	top: 15px;
	left: 180px;
	width: 60px;
	height: 25px;
	background-color: rgb(194, 80, 80);
	color: white;
	cursor: pointer;
}

@keyframes enter {
	0% {
		top: -80px;
	}

	100% {
		top: 20px;
	}
}

@keyframes leave {
	0% {
		top: 20px;
	}

	100% {
		top: -80px;
	}
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
</style>
