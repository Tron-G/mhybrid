<!--
 * @Author: tron
 * @Date: 2022-08-10 21:15:05
 * @LastEditTime: 2022-08-10 21:31:10
 * @FilePath: \mhybrid\src\components\content\mainTitle\MainTitle.vue
-->
<template>
	<div class="main-title">
		<nav-title :title="title" class="nav-title"></nav-title>
	</div>
</template>

<script>
import NavTitle from "@/components/common/navTitle/NavTitle";
export default {
	name: "MainTitle",
	components: { NavTitle },
	data() {
		return {
			title: "Hybrid Traffic Route Recommendation System",
		};
	},
	computed: {},
	methods: {},
};
</script>

<style scoped>
.nav-title {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 2%;
	background-color: rgb(180, 180, 180);
}
</style>
