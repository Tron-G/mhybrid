<template>
	<div id="sys_title">Hybrid Traffic Route Recommendation System</div>
	<!-- <div id="nav">
		<router-link to="/" custom v-slot="{ navigate }">
			<button @click="navigate" @keypress.enter="navigate" id="home_page">
				Home
			</button>
		</router-link>
	</div> -->

	<loader :title="msg"></loader>
	<div id="main_view">
		<HomeView></HomeView>
	</div>
</template>

<script>
import loader from "components/loader.vue";
import HomeView from "@/views/HomeView";
export default {
	components: {
		loader,
		HomeView,
	},
	data() {
		return {
			msg: "Calculating...",
		};
	},
};
</script>
<style>
@import "assets/css/base.css";

#app {
	/* font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale; */
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: rgb(203, 207, 211);
	overflow: hidden;
	text-align: center;
}

#home_page {
	text-align: center;
	border: none;
	color: white;
	display: inline-block;
	cursor: pointer;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 4%;
	background-color: #29b6f6;
	font-size: 18px;
	font-weight: bold;
}

.mapboxgl-popup .mapboxgl-popup-content {
	max-width: 400px;
	font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
	font-size: 30px;
	font-weight: bold;
	color: #535353;
	line-height: 35px;
	/* font: 20px/26px 'Helvetica Neue', Arial, Helvetica, sans-serif; */
}
.mapboxgl-ctrl-minimap {
	border: 1px solid black;
	box-shadow: 0 0 10px #888888;
}

.mapboxgl-ctrl-logo {
	display: none !important;
}
</style>
