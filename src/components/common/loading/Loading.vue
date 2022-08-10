<!--
 * @Author: tron
 * @Date: 2022-08-10 20:36:13
 * @LastEditTime: 2022-08-10 20:50:48
 * @FilePath: \mhybrid\src\components\common\loading\Loading.vue
-->
<template>
	<div>
		<div id="cover" v-show="isShow">
			<div id="loading_window">
				<div id="loader"></div>
				<p id="load_txt">{{ message }}</p>
				<div id="close" @click="close()">x</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Loading",
	data() {
		return {
			message: "",
			isShow: false,
		};
	},
	computed: {},
	methods: {
		show(message) {
			this.isShow = true;
			this.message = message;
		},
		close() {
			this.isShow = false;
			this.message = "";
		},
	},
};
</script>

<style scoped>
#cover {
	position: fixed;
	right: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
	background-color: rgba(0, 0, 0, 0.3);
}
#loading_window {
	position: absolute;
	left: 48%;
	top: 40%;
	width: 200px;
	height: 130px;
	background-color: white;
	border-radius: 5px;
}

#load_txt {
	position: absolute;
	bottom: 10px;
	left: 57px;
	color: rgb(85, 85, 85);
	font-size: 18px;
	text-align: center;
	font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
	margin: 0;
}
#loader {
	position: absolute;
	top: 20px;
	left: 68px;
	border: 8px solid #f3f3f3;
	border-radius: 50%;
	border-top: 8px solid rgb(33, 150, 243);
	width: 50px;
	height: 50px;
	animation-name: load;
	animation: load 2s linear infinite;
}
@keyframes load {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
#close {
	position: absolute;
	top: 2px;
	right: 5px;
	width: 15px;
	height: 15px;
	cursor: pointer;
	font-weight: bold;
	font-size: 17px;
}
</style>
