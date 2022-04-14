<template>
	<div id="map_view">
		<div id="od_panel" class="panel">
			<div
				@click="switchDrawType('get_on')"
				id="geton_bt"
				class="btn"
				:class="{ active: show_status == 'get_on' }"
			>
				geton
			</div>
			<div
				@click="switchDrawType('get_off')"
				id="getoff_bt"
				class="btn"
				:class="{ active: show_status == 'get_off' }"
			>
				getoff
			</div>
			<div
				@click="switchDrawType('hidden')"
				id="hidden_bt"
				class="btn"
				:class="{ active: show_status == 'hidden' }"
			>
				hidden
			</div>
		</div>
		<div id="overview_panel" class="panel">
			<div
				@click="switchOverview('overview')"
				id="overview_bt"
				class="btn enlarge"
				:class="{ active: is_overview == true }"
			>
				overview
			</div>
			<div
				@click="switchOverview('detail')"
				id="detail_bt"
				class="btn enlarge"
				:class="{ active: is_overview == false }"
			>
				detail
			</div>
		</div>
		<div id="test_btn">
			<button @click="drawRoute">draw</button>
			<button @click="redraw">redraw</button>
		</div>
		<search ref="cp_search" @search-click="computeMultiRoute"></search>
	</div>
</template>

<script>
// @ is an alias to /src

import * as mapdrawer from "assets/js/drawMapFigure";
import { request, requestAnimation } from "../network/request.js";
import search from "@/components/search";

export default {
	name: "HomeView",
	components: {
		search,
	},
	data() {
		return {
			map: null,
			//追踪页面的上下车显示状态
			show_status: "hidden",
			// 页面的缩放状态
			is_overview: true,
			//缓存od数据
			get_on_data: null,
			get_off_data: null,
			// 社区聚类网络原始数据
			cluster_net_origin: null,
			// 社区网络数据拷贝，用于保存颜色状态
			cluster_net: null,
			// 保存社区详情视图的地图中心等配置
			detail_map_opt: null,
			// 社区街道详细网络原始数据
			detail_net: null,
		};
	},
	created() {
		this.$store.dispatch("getRouteData");
	},
	mounted() {
		this.map = mapdrawer.initMap("map_view");
		this.listenPage();
		// 缓存聚类网络图数据
		this.requestData("cluster_net")
			.then((res) => {
				// 确保地图绑定的数据是data缓存的数据而不是后台直接传来的
				this.cachedData("cluster_net", res);
				return this.cluster_net;
			})
			.then((res) => {
				mapdrawer.drawClusterNet(this.map, res);
				mapdrawer.drawClusterNet(this.map.min_map, res, true);
			});

		// 预先缓存街道网络数据
		this.requestData("detail_net").then((res) => {
			this.cachedData("detail_net", res);
		});
	},
	beforeRouteLeave(to, from, next) {
		this.map.remove();
		next();
	},
	methods: {
		drawRoute() {
			// mapdrawer.drawRoute(this.map, this.$store.state.route_data);
			// mapdrawer.drawTestLink(this.map);
			// this.map.remove();
			console.log(this.map.loaded());
		},
		redraw() {
			// this.map = mapdrawer.initMap("map_view");
		},

		/**
		 * g根据点击按钮切换绘图类型，上车，下车，不显示
		 *@param {string} draw_type "get_on"|| "get_off"|| "hidden"
		 */
		switchDrawType(draw_type) {
			if (this.show_status == draw_type) return;
			// 概览视图下切换上下车热点
			if (this.show_status != "hidden") this.resetMap();
			if (this.show_status != "hidden" && !this.is_overview) {
				// 详细视图下切换上下车热点
				this.requestData("detail_net").then((res) => {
					this.cachedData("detail_net", res);
					mapdrawer.drawNetwork(this.map, res);
				});
			}
			if (draw_type == "hidden") {
				this.show_status = "hidden";
			} else {
				this.show_status = draw_type;
				this.requestData(draw_type).then((res) => {
					console.log(draw_type + " data", res);
					mapdrawer.drawPoint(this.map, res, draw_type);
					this.cachedData(draw_type, res);
				});
			}
		},
		/**
		 * 切换概览和详情视图
		 *@param {string} show_type "overview"|| "detail"
		 */
		switchOverview(show_type) {
			if (
				(this.is_overview && show_type == "overview") ||
				(!this.is_overview && show_type == "detail")
			)
				return;
			// 跳转到概览视图
			if (show_type == "overview") {
				this.is_overview = true;
				this.show_status = "hidden";
				this.resetMap();
			} else {
				// 跳转到社区详细视图,同时更新小地图上选中节点的颜色
				this.is_overview = false;
				mapdrawer.removeLayerByType(this.map, "cluster_net");
				mapdrawer.updateMinMap(this.map, this.cluster_net);

				//此处应该动态计算中心坐标
				if (!this.detail_map_opt)
					this.detail_map_opt = {
						center: [118.097573, 24.473172],
						zoom: 14.2,
						speed: 2.5,
						curve: 1,
						easing(t) {
							//t 为0-1的飞行进度，可用于监听及触发事件
							return t;
						},
					};
				this.map.flyTo(this.detail_map_opt);
				// 添加标志防止重复绘制
				let is_draw = false;
				this.map.on("idle", () => {
					if (!is_draw) {
						this.requestData("detail_net").then((res) => {
							this.cachedData("detail_net", res);
							mapdrawer.drawNetwork(this.map, res);
						});
						is_draw = true;
					}
				});
			}
			this.searchWindow();
		},
		/**
		 * 重置社区网络数据
		 */
		resetClusterData() {
			this.cluster_net = JSON.parse(JSON.stringify(this.cluster_net_origin));
		},
		/**
		 * 重置地图和小地图
		 */
		resetMap() {
			this.map.remove();
			if (this.is_overview) {
				this.resetClusterData();
				this.map = mapdrawer.initMap("map_view");
				mapdrawer.drawClusterNet(this.map, this.cluster_net);
				mapdrawer.drawClusterNet(this.map.min_map, this.cluster_net, true);
			} else {
				this.map = mapdrawer.initMap("map_view", {
					center: this.detail_map_opt.center,
					zoom: this.detail_map_opt.zoom,
				});
				mapdrawer.drawClusterNet(this.map.min_map, this.cluster_net, true);
			}
		},

		/**
		 * 数据请求
		 *@param {string} data_type "get_on"|| "get_off" || "cluster_net"||"detail_net"
		 *@return {promise}
		 */
		requestData(data_type) {
			let datas = null,
				urls = "";
			if (data_type == "get_on") {
				datas = this.get_on_data;
				urls = "/get_on_data";
			} else if (data_type == "get_off") {
				datas = this.get_off_data;
				urls = "/get_off_data";
			} else if (data_type == "cluster_net") {
				datas = this.cluster_net;
				urls = "/get_cluster_network";
			} else if (data_type == "detail_net") {
				datas = this.detail_net;
				urls = "/get_community_network";
			}
			if (datas == null) {
				return request({ url: urls });
			} else {
				return new Promise((resolve, reject) => {
					resolve(datas);
				});
			}
		},

		/**
		 * 缓存数据
		 *@param {string} data_type
		 @param {object} requested_data 后台返回的数据
		 */
		cachedData(data_type, requested_data) {
			switch (data_type) {
				case "get_on":
					if (!this.get_on_data) this.get_on_data = requested_data;
					break;
				case "get_off":
					if (!this.get_off_data) this.get_off_data = requested_data;
					break;
				case "cluster_net":
					if (!this.cluster_net) {
						this.cluster_net_origin = JSON.parse(
							JSON.stringify(requested_data)
						);
						this.cluster_net = JSON.parse(JSON.stringify(requested_data));
					}
					break;
				case "detail_net":
					if (!this.detail_net) this.detail_net = requested_data;
					break;
				default:
					break;
			}
		},
		/**
		 *监听页面刷新
		 */
		listenPage() {
			window.onbeforeunload = function (e) {
				this.map.remove();
				// e = e || window.event;
				// if (e) {
				// 	e.returnValue = "关闭提示";
				// }
				// return "关闭提示";
			};
		},

		/**
		 *搜索窗口
		 */
		searchWindow() {
			if (this.is_overview) this.$refs.cp_search.hide();
			else this.$refs.cp_search.show();
		},

		computeMultiRoute(od_info) {
			console.log(od_info);

			const origin_site = od_info["origin_site"],
				destination_site = od_info["destination_site"];

			let that = this;
			requestAnimation({
				url: "/calc_multi_route",
				method: "post",
				data: { origin_site, destination_site },
			}).then((res) => {
				mapdrawer.drawMultiRoute(that.map, res);
			});
			// mapdrawer.drawMultiRoute(that.map, that.detail_net, {});
			// requestAnimation({
			// 	url: "/calc_multi_route",
			// 	method: "post",
			// 	data: { origin_site, destination_site },
			// 	loadStart() {
			// 		that.$refs.cp_load.show();
			// 	},
			// 	loadEnd() {
			// 		that.$refs.cp_load.close();
			// 	},
			// }).then((res) => {
			// 	console.log("routes", res);
			// });
		},

		//////////////////////////////////////////////////
	},
};
</script>

<style lang="scss" scoped>
@import "assets/css/mapboxgl.css";
@import "assets/css/mapboxgl2.css";
@import "assets/css/homePage.css";
</style>
