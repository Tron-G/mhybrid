<template>
	<div>
		<div id="search_panel">
			<div id="from">From:</div>
			<input type="text" id="origin_win" placeholder="Origin" name="origin" />
			<div id="to">To:</div>
			<input
				type="text"
				id="destination_win"
				placeholder="Destination"
				name="destination"
			/>
			<div id="search_btn" @click="searchClick()">search</div>
			<div id="insert_btn" @click="insertClick()">add station</div>
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
		insertClick() {
			this.$emit("insert-click");
		},
		show() {
			let search_panel = document.getElementById("search_panel");
			if (
				search_panel.classList.contains("hide_window") ||
				search_panel.classList.length == 0
			) {
				search_panel.classList.add("show_window");
				search_panel.classList.remove("hide_window");
			}
		},
		hide() {
			let search_panel = document.getElementById("search_panel");
			if (search_panel.classList.contains("show_window")) {
				search_panel.classList.add("hide_window");
				search_panel.classList.remove("show_window");
			}
		},
	},
};
</script>

<style scoped>
#search_panel {
	position: absolute;
	top: -90px;
	left: 15%;
	width: 280px;
	height: 90px;
	background-color: #f2f2f2;
	box-shadow: 0 0 10px #888888;
	border-radius: 5px;
	z-index: 9;
}

#from {
	position: absolute;
	top: 15px;
	left: 0;
	width: 55px;
	height: 20px;
	font-size: 15px;
	text-align: center;
	font-weight: bold;
}

#origin_win {
	position: absolute;
	top: 12px;
	left: 55px;
	width: 80px;
	height: 20px;
}

#to {
	position: absolute;
	top: 55px;
	left: 0;
	width: 55px;
	height: 20px;
	font-size: 15px;
	text-align: center;
	font-weight: bold;
}

#destination_win {
	position: absolute;
	top: 50px;
	left: 55px;
	width: 80px;
	height: 20px;
}
#search_btn {
	position: absolute;
	top: 15px;
	left: 170px;
	width: 90px;
	height: 25px;
	background-color: rgb(194, 80, 80);
	color: white;
	box-shadow: 0 0 6px #888888;
	border-radius: 5px;
	cursor: pointer;
	text-align: center;
	line-height: 25px;
	user-select: none;
}

#insert_btn {
	position: absolute;
	top: 50px;
	left: 170px;
	width: 90px;
	height: 25px;
	background-color: rgb(231, 162, 71);
	color: white;
	box-shadow: 0 0 6px #888888;
	border-radius: 5px;
	cursor: pointer;
	text-align: center;
	line-height: 25px;
	user-select: none;
}
@keyframes enter {
	0% {
		top: -90px;
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
		top: -90px;
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
