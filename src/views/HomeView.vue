<template>
	<div id="sys_window">
		<div id="nav">
			<div id="menu">
				<img :src="menuImg" class="menu_img" />
			</div>

			<div id="overview_panel" class="panel">
				<div
					@click="switchOverview('overview')"
					id="overview_bt"
					class="btn enlarge"
					:class="{ active: is_overview == true }"
				>
					<img :src="overviewImg" class="bt_img" />
					<div class="bt_name" id="overview_btn">overview</div>
				</div>
				<div
					@click="switchOverview('detail')"
					id="detail_bt"
					class="btn enlarge"
					:class="{ active: is_overview == false }"
				>
					<img :src="detailImg" class="bt_img" />
					<div class="bt_name">detail</div>
				</div>
			</div>

			<div id="od_panel" class="panel">
				<div
					@click="switchDrawType('get_on')"
					id="geton_bt"
					class="btn"
					:class="{ active: show_status == 'get_on' }"
				>
					<img :src="getonImg" class="bt_img" />
					<div class="bt_name">geton</div>
				</div>
				<div
					@click="switchDrawType('get_off')"
					id="getoff_bt"
					class="btn"
					:class="{ active: show_status == 'get_off' }"
				>
					<img :src="getoffImg" class="bt_img" />
					<div class="bt_name">getoff</div>
				</div>

				<div
					@click="switchDrawType('carbon')"
					id="all_carbon"
					class="btn"
					:class="{ active: show_status == 'carbon' }"
				>
					<img :src="coImg" class="bt_img" />
					<div class="bt_name">carbon</div>
				</div>
				<div
					@click="switchDrawType('hidden')"
					id="hidden_bt"
					class="btn"
					:class="{ active: show_status == 'hidden' }"
				>
					<img :src="hideImg" class="bt_img" />
					<div class="bt_name">hidden</div>
				</div>
			</div>
		</div>
		<div id="map_view">
			<!-- <div id="test_btn">
			<button @click="drawRoute">draw</button>
			<button @click="redraw">redraw</button>
		</div> -->
			<search
				ref="cp_search"
				@search-click="computeMultiRoute"
				@insert-click="addMarker"
			></search>
			<boxplot ref="cp_boxplot"></boxplot>
			<trafficpie ref="cp_trafficpie"></trafficpie>
			<routepanel
				ref="cp_routepanel"
				@choose-route="switchRoute"
				:route_attr="get_route_attr"
				v-if="judge_route_data"
			></routepanel>
			<routeinfo ref="cp_routeinfo" v-if="judge_route_data"></routeinfo>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src

import * as mapdrawer from "assets/js/drawMapFigure";
import { request, requestAnimation } from "../network/request.js";
import search from "@/components/search";
import boxplot from "@/components/boxplot";
import routepanel from "@/components/routepanel.vue";
import trafficpie from "@/components/trafficpie";

import routeinfo from "@/components/routeinfo";

export default {
	name: "HomeView",
	components: {
		search,
		boxplot,
		routepanel,
		trafficpie,
		routeinfo,
	},
	data() {
		return {
			///////////////////////// imgs //////////////////////////
			menuImg: require("@/assets/img/nav/menu.svg"),
			overviewImg: require("@/assets/img/nav/overview.svg"),
			detailImg: require("@/assets/img/nav/detail.svg"),
			getonImg: require("@/assets/img/nav/geton.svg"),
			getoffImg: require("@/assets/img/nav/getoff.svg"),
			coImg: require("@/assets/img/nav/co2.svg"),
			hideImg: require("@/assets/img/nav/hide.svg"),
			///////////////////////// imgs //////////////////////////
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
			// 缓存推荐路线数据
			route_data: null,
			// 全岛碳排放数据
			carbon_data: null,
			// 是否添加了标记点击监听事件
			add_status: false,
			// 新添加的站点坐标
			new_station: null,
			// 选择的路线id
			choose_index: -1,
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
		// 预先缓存碳排放数据
		this.requestData("carbon").then((res) => {
			this.cachedData("carbon", res);
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
	computed: {
		get_route_attr() {
			if (this.route_data != null) return this.route_data.route_attr;
			else return null;
		},
		judge_route_data() {
			return this.route_data != null;
		},
	},
	methods: {
		/**
		 * 绘制全岛碳排放热力图
		 */
		drawCarbonHeat() {
			this.map.remove();
			this.map = mapdrawer.initMap("map_view");
			mapdrawer.carbonHeat(this.map, this.carbon_data);
			this.show_status = "carbon";
		},

		drawRoute() {
			// console.log("aaaasd", this.map.add_station);
			// mapdrawer.drawRoute(this.map, this.$store.state.route_data);
			// mapdrawer.drawTestLink(this.map);
			// this.map.remove();
			// console.log(this.map.loaded());
		},
		redraw() {
			// this.map = mapdrawer.initMap("map_view");
		},

		/**
		 * 根据点击按钮切换绘图类型，上车，下车，不显示
		 *@param {string} draw_type "get_on"|| "get_off"|| "hidden" || carbon
		 */
		switchDrawType(draw_type) {
			if (this.show_status == draw_type) return;
			// 无论是概览还是详细，当前不是hidden状态就重置地图
			if (this.show_status != "hidden") this.resetMap();
			if (this.show_status != "hidden" && !this.is_overview) {
				// 详细视图下先绘制网络图
				this.requestData("detail_net").then((res) => {
					this.cachedData("detail_net", res);
					mapdrawer.drawNetwork(
						this.map,
						res.network,
						res.station,
						this.showPie
					);
				});
			}
			if (draw_type == "hidden") {
				this.show_status = "hidden";
			} else {
				this.show_status = draw_type;
				if (draw_type == "carbon") {
					// console.log("fuc nfc", this.carbon_data);
					mapdrawer.carbonHeat(this.map, this.carbon_data);
				} else {
					this.requestData(draw_type).then((res) => {
						console.log(draw_type + " data", res);
						mapdrawer.drawPoint(this.map, res, draw_type);
						this.cachedData(draw_type, res);
					});
				}
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
				this.closePanelByName(["All"]);
				this.resetMap();
				this.resetStatus();
			} else {
				// 跳转到社区详细视图,同时更新小地图上选中节点的颜色
				this.is_overview = false;
				if (this.show_status != "carbon") {
					mapdrawer.removeLayerByType(this.map, "cluster_net");
					mapdrawer.updateMinMap(this.map, this.cluster_net);
				} else {
					mapdrawer.removeLayerByType(this.map, "cluster_net");
					// mapdrawer.drawClusterNet(this.map.min_map, this.cluster_net, true);
				}

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
							mapdrawer.drawNetwork(
								this.map,
								res.network,
								res.station,
								this.showPie
							);
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
				// 详细街道视图下重置地图
				this.map = mapdrawer.initMap("map_view", {
					center: this.detail_map_opt.center,
					zoom: this.detail_map_opt.zoom,
				});
				mapdrawer.drawClusterNet(this.map.min_map, this.cluster_net, true);
			}
		},
		/**
		 * 清除缓存数据和状态
		 */
		resetStatus() {
			this.route_data = null;
			this.add_status = false;
			this.new_station = null;
			this.choose_index = -1;
		},

		/**
		 * 数据请求
		 *@param {string} data_type "get_on"|| "get_off" || "cluster_net"||"detail_net" || carbon
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
			} else if (data_type == "carbon") {
				datas = this.carbon_data;
				urls = "/get_carbon_data";
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
			let copy_data = JSON.parse(JSON.stringify(requested_data));
			switch (data_type) {
				case "get_on":
					if (!this.get_on_data) this.get_on_data = copy_data;
					break;
				case "get_off":
					if (!this.get_off_data) this.get_off_data = copy_data;
					break;
				case "cluster_net":
					if (!this.cluster_net) {
						this.cluster_net_origin = JSON.parse(
							JSON.stringify(requested_data)
						);
						this.cluster_net = copy_data;
					}
					break;
				case "detail_net":
					if (!this.detail_net) this.detail_net = copy_data;
					break;
				case "multi_route":
					this.route_data = copy_data;
					break;
				case "carbon":
					if (!this.carbon_data) this.carbon_data = copy_data;
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
			};
		},

		/**
		 *搜索窗口
		 */
		searchWindow() {
			if (this.is_overview) this.closePanelByName(["cp_search"]);
			else this.$refs.cp_search.show();
		},

		/**
		 * 监听搜索按钮，绘制多模式路线和相关的视图
		 * @param {object} od_info 搜索框输入的od信息
		 */
		computeMultiRoute(od_info) {
			const origin_site = od_info["origin_site"],
				destination_site = od_info["destination_site"];

			if (this.map.add_station != undefined) {
				this.new_station = this.map.add_station;
			}
			// 向后台传递手动添加的站点坐标
			let add_station = null;
			if (this.new_station != null) add_station = this.new_station;

			// 重新请求后隐藏k线图面板和路线属性面板
			this.closePanelByName(["cp_boxplot", "cp_routepanel"]);

			let that = this;
			requestAnimation({
				url: "/calc_multi_route",
				method: "post",
				data: { origin_site, destination_site, add_station },
			})
				.then((res) => {
					that.cachedData("multi_route", res);
					return res;
				})
				.then((res) => {
					// console.log(res);
					that.choose_index = 0;
					mapdrawer.drawMultiRoute(that.map, res.route);
					that.$refs.cp_boxplot.show(res.all_history_Y);
					that.$refs.cp_routepanel.show();
					that.$refs.cp_routeinfo.show(res.route_attr[that.choose_index]);
				});
		},

		/**
		 * 根据输入的名称数组隐藏相关面板
		 * @param {Array} panel_name 需要关闭的面板名称，All表示关闭所有
		 */
		closePanelByName(panel_name) {
			for (let i = 0; i < panel_name.length; i++) {
				switch (panel_name[i]) {
					case "All":
						this.$refs.cp_boxplot.hide();
						this.$refs.cp_trafficpie.hide();
						if (this.judge_route_data) {
							this.$refs.cp_routepanel.hide();
							this.$refs.cp_routeinfo.hide();
						}
						break;
					case "cp_boxplot":
						this.$refs.cp_boxplot.hide();
						break;
					case "cp_trafficpie":
						this.$refs.cp_trafficpie.hide();
						break;
					case "cp_routepanel":
						if (this.judge_route_data) this.$refs.cp_routepanel.hide();
						break;
					case "cp_search":
						this.$refs.cp_search.hide();
						break;
					case "cp_routeinfo":
						if (this.judge_route_data) this.$refs.cp_routeinfo.hide();
						break;
					default:
						break;
				}
			}
		},

		/**
		 * 监听添加站点按钮，添加或者移除点击事件
		 */
		addMarker() {
			if (!this.add_status) {
				mapdrawer.addMarkerByClick(this.map);
				this.add_status = true;
			} else {
				mapdrawer.removeMarkerClick(this.map);
				this.add_status = false;
				this.new_station = null;
			}
		},

		/**
		 * 监听推荐路线展示界面按钮，切换展示的当前路线
		 * @param {number} index 子组件传出来的当前选择框id
		 */
		switchRoute(index) {
			this.choose_index = index;
			mapdrawer.drawMultiRoute(this.map, this.route_data.route, index);
			this.closePanelByName(["cp_routeinfo"]);
			setTimeout(() => {
				this.$refs.cp_routeinfo.show(
					this.route_data["route_attr"][this.choose_index]
				);
			}, 1000);
		},
		/**
		 * 展示被点击的街道流量信息
		 * @param {string} street_name 需要展示流量信息的街道名称
		 */
		showPie(street_name) {
			let flow_data = this.detail_net.traffic_flow;
			this.$refs.cp_trafficpie.show(street_name, flow_data[street_name]);
			// setTimeout(() => {
			// 	this.$refs.cp_trafficpie.show(street_name, flow_data[street_name]);
			// }, 500);
		},
		/////////////////////////////////////////////////////////////////////////
	},
};
</script>

<style lang="scss" scoped>
@import "assets/css/mapboxgl.css";
@import "assets/css/mapboxgl2.css";
@import "assets/css/homePage.css";
</style>
