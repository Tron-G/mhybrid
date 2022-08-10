<!--
 * @Author: tron
 * @Date: 2022-02-27 20:27:21
 * @LastEditTime: 2022-08-10 21:21:52
 * @FilePath: \mhybrid\src\App.vue
-->
<template>
	<main-title></main-title>
	<!-- <div id="nav">
		<router-link to="/" custom v-slot="{ navigate }">
			<button @click="navigate" @keypress.enter="navigate" id="home_page">
				Home
			</button>
		</router-link>
	</div> -->
	<div id="main_view">
		<HomeView></HomeView>
	</div>
</template>

<script>
import MainTitle from "@/components/content/mainTitle/MainTitle";
import HomeView from "@/views/HomeView";
export default {
	components: {
		MainTitle,
		HomeView,
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

/* #home_page {
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
} */

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
