<template>
	<div id="nav">
		<router-link to="/" custom v-slot="{ navigate }">
			<button @click="navigate" @keypress.enter="navigate" id="home_page">
				Home
			</button>
		</router-link>
		<!-- <router-link to="/odView" custom v-slot="{ navigate }">
			<button @click="navigate" @keypress.enter="navigate" id="od_page">
				OD
			</button>
		</router-link> -->
	</div>

	<div id="main_view">
		<router-view />
	</div>
</template>

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
}

#nav {
	/* padding: 30px; */
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 3%;
	background-color: white;
	/* padding: 1px;*/
	border: 1px solid rgb(105, 105, 105);
	z-index: 9;
}
#main_view {
	position: absolute;
	left: 3%;
	top: 0;
	width: 97%;
	height: 100%;
	background-color: #bfd5df;
	z-index: 0;
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
	/* font: 20px/26px 'Helvetica Neue', Arial, Helvetica, sans-serif; */
}
.mapboxgl-ctrl-minimap {
	border: 1px solid black;
	box-shadow: 0 0 10px #888888;
}

.mapboxgl-ctrl-logo {
	display: none !important;
}
#od_page {
	/* text-align: center;
	border: none;
	color: #2c3e50;
	display: inline-block;
	cursor: pointer;
	position: absolute;
	top: 6%;
	left: 0;
	width: 95%;
	height: 5%;
	background-color: #dddddd;
	font-size: 18px;
	margin: 1px;
	border-radius: 5px; */
}
/* nav a {
	font-weight: bold;
	color: #2c3e50;
} */

/* nav a.router-link-exact-active {
	color: #42b983;
} */
</style>
