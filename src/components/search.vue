<template>
	<div>
		<div id="search_panel">
			<div id="from" class="tips">From:</div>
			<input
				type="text"
				id="origin_win"
				class="input_win"
				placeholder="Origin..."
				name="origin"
			/>
			<div id="to" class="tips">To:</div>
			<input
				type="text"
				id="destination_win"
				class="input_win"
				placeholder="Destination..."
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
	top: -100px;
	left: 20px;
	width: 400px;
	height: 90px;
	background-color: #f2f2f2;
	box-shadow: 0 0 10px #888888;
	border-radius: 5px;
	z-index: 9;
	font-family: MS Reference Sans Serif;
}

.tips {
	position: absolute;
	left: 15px;
	width: 55px;
	height: 20px;
	font-size: 15px;
	text-align: center;
	font-weight: bold;
}

.input_win {
	position: absolute;
	left: 85px;
	width: 170px;
	height: 20px;
}

#from {
	top: 15px;
}

#origin_win {
	top: 12px;
}

#to {
	top: 55px;
}

#destination_win {
	top: 50px;
}

#search_btn {
	position: absolute;
	top: 15px;
	right: 20px;
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
	right: 20px;
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
		top: -100px;
	}

	100% {
		top: 10px;
	}
}

@keyframes leave {
	0% {
		top: 10px;
	}

	100% {
		top: -100px;
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
