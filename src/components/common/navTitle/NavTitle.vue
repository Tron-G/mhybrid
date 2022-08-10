<template>
	<div class="nav-title">
		{{ title }}
	</div>
</template>

<script>
export default {
	name: "NavTitle",
	components: {},
	props: {
		title: {
			type: String,
			default: "",
		},
	},
};
</script>

<style scoped>
.nav-title {
	line-height: 25px;
	color: white;
	font-size: 16px;
	/* word-spacing: 5px; */
	font-weight: bold;
	font-family: MS Reference Sans Serif;
}
</style>
