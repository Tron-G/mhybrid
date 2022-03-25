<template>
	<div></div>
</template>

<script>
import * as mapdrawer from "../assets/js/drawMapFigure";

export default {
	name: "getoffView",
	components: {},
	data() {
		return {
			map: null,
		};
	},
	created() {
		this.$store.dispatch("getGetOffData");
	},
	mounted() {
		this.map = mapdrawer.initMap("main_view");
		mapdrawer.drawPoint(this.map, this.$store.state.get_off_data);
	},
	beforeUnmount() {
		this.map.remove();
	},
	computed: {},
	methods: {},
};
</script>

<style scoped></style>
