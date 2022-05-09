import Minimap from "./mapboxgl-control-minimap"

const mapboxgl = require("mapbox-gl");
mapboxgl.Minimap = Minimap;

// 展示的推荐路线数量
const SHOW_ROUTE_NUM = 5;


/**
 * 初始化地图实例对象
 *@param {string} container 地图绑定的div，id
 *@param {object} opt 可选地图初始化配置
 *@return {object}  地图实例对象
 */
function initMap(container, opt = {}) {

  mapboxgl.accessToken =
    "pk.eyJ1IjoieGlhb2JpZSIsImEiOiJja2pndjRhMzQ1d2JvMnltMDE2dnlkMGhrIn0.bCKzSCs5tHTIYk4xQ65doA";

  // 地图默认配置，会被opt里的配置覆盖
  let map_option = {
    container: container,
    style: "mapbox://styles/xiaobie/cl06pkagg005i14p82d999k9w",
    center: [118.127193, 24.491097],
    zoom: 12.5,
    dragRotate: false,
    doubleClickZoom: false
  }
  Object.assign(map_option, opt);
  // 注册地图组件
  let map = new mapboxgl.Map(map_option);
  const navigation_control = new mapboxgl.NavigationControl();
  map.addControl(navigation_control, "top-left");
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: "metric",
  });
  map.addControl(scale, "bottom-left");
  //设置显示边界
  const bounds = [
    [117.882223, 24.366902],
    [118.373857, 24.60727],
  ];
  map.setMaxBounds(bounds);
  // 绑定小地图
  let min_map = initMapAndMinMap(map);
  map.min_map = min_map._miniMap;
  return map;
}

/**
 * 初始化小地图
 */
function initMapAndMinMap(map) {
  let m_map = new mapboxgl.Minimap({
    center: [118.127193, 24.491097],
    zoom: 10.6,
    style: "mapbox://styles/xiaobie/cl06pkagg005i14p82d999k9w",
    zoomLevels: [],
  })
  map.addControl(m_map, 'bottom-right');
  return m_map;
  // map.on("load", () => {
  //   map.addControl(cont, 'bottom-right');
  //   resolve(cont)
  //   //console.log(min_map);
  // });
}

/**
 * 地图上绘制散点图
 *@param {object} map mapbox实例对象
 *@param {object} data 格式化的geo类型json数据
 *@param {string} draw_type 绘制的图层id
 *@return {类型} 返回说明
 */
function drawPoint(map, data, draw_type) {
  if (map.loaded()) {
    console.log("is loaded");
    ondraw();
  } else {
    map.on("load", function() {
      console.log("not loaded");
      ondraw();
    })
  }
  // 实时输出地图缩放等级
  // map.on("wheel", function() {
  //   console.log("A wheel event occurred.");
  //   var range = map.getZoom();
  //   console.log(range);
  // });

  function ondraw() {
    //  Add a source and layer displaying a point which will be animated in a circle.
    map.addSource(draw_type + "_point", {
      type: "geojson",
      data: data,
    });
    let point_color = "#BA135D"
    if (draw_type == "get_off") {
      point_color = "#2940D3"
    }

    map.addLayer({
      "id": draw_type + "_heatmap",
      "type": "heatmap",
      "source": draw_type + "_point",
      "maxzoom": 16,
      "paint": {
        // Increase the heatmap weight based on frequency and property magnitude
        // "heatmap-weight": [
        //   "interpolate",
        //   ["linear"],
        //   ["get", "mag"],
        //   0, 0,
        //   6, 1
        // ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 1,
          15, 3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 5,
          15, 30
        ],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10.5, 0.8,
          16, 0
        ],
      }
    });

    map.addLayer({
      id: draw_type,
      source: draw_type + "_point",
      type: "circle",
      minzoom: 6,
      paint: {
        // 圆圈半径动态更改，根据缩放等级从9到16，将数据中的radius属性，线性映射[20, 50] -> [2,5] ->[20,50]
        "circle-radius": ["interpolate", ["linear"],
          ["zoom"],
          9, 0.5,
          16, 5
        ],
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14.2, 0,
          17, 1
        ],
        "circle-color": point_color
      },
    });
  }
}


/**
 * 绘制聚类社区网络
 *@param {object} map 地图实例对象
 *@param {object} net_data
 *@param {boolean} is_minmap 区分小地图, true表示小地图
 */
function drawClusterNet(map, net_data, is_minmap = false) {
  if (map.loaded()) {
    drawLink();
    drawNode();
  } else {
    map.on("load", function() {
      drawLink();
      drawNode();
    })
  }

  //画节点
  function drawNode() {
    let layer_id = "cluster_node",
      source_id = "cluster_node_data";
    if (is_minmap) {
      layer_id = "cluster_node_minmap"
      source_id = "cluster_node_data_minmap"
    }

    map.addSource(source_id, {
      type: "geojson",
      data: net_data.node,
    });

    map.addLayer({
      id: layer_id,
      source: source_id,
      type: "circle",
      minzoom: 6,
      paint: {
        "circle-radius": ["interpolate", ["linear"],
          ["zoom"],
          11, 8,
          18, 55
        ],
        "circle-color": ["get", "color"],
      },
    });

    if (!is_minmap) {
      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      //鼠标悬浮显示节点名称
      map.on('mouseenter', layer_id, function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        // console.log(e.features[0]);
        let coordinates = e.features[0].geometry.coordinates.slice();
        let street_name = e.features[0].properties.center_street;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup.setLngLat(coordinates)
          .setText(street_name)
          .addTo(map);
      });
      map.on('mouseleave', layer_id, function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      // 实现点击地图节点实时变色
      map.on('click', layer_id, function(e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        const original_color = e.features[0].properties.original_color;
        const now_color = e.features[0].properties.color;
        const now_id = e.features[0].properties.cluster_center;
        const highlight_color = "#362222";

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        for (let i = 0; i < net_data.node.features.length; i++) {
          const item_id = net_data.node.features[i]["properties"]["cluster_center"];
          if (item_id == now_id) {
            if (now_color != original_color) {
              // 恢复原本的颜色
              net_data.node.features[i]["properties"]["color"] = net_data.node.features[i]["properties"]["original_color"]
            } else {
              // 点击变色
              net_data.node.features[i]["properties"]["color"] = highlight_color
            }
          }
        }
        // 更新地图节点颜色数据
        map.getSource(source_id).setData(net_data.node)
      });
    }

  }

  //画边
  function drawLink() {
    // 根据地图是否小地图进行边的缩放
    let link_scale = 1,
      layer_id = "cluster_link",
      source_id = "cluster_link_data";
    if (is_minmap) {
      link_scale = 0.3
      layer_id = "cluster_link_minmap"
      source_id = "cluster_link_data_minmap"
    }

    map.addSource(source_id, {
      type: "geojson",
      data: net_data.link,
    });

    map.addLayer({
      id: layer_id,
      type: "line",
      source: source_id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": ["*", ["get", "link_width"], link_scale],
        "line-opacity": 0.5
      },
    });
  }
}


/**
 * 绘制详细网络图
 *@param {object} map 地图实例对象
 *@param {object} net_data 街道网络数据，点和线的geo数据
 *@param {object} station_data 自行车站点数据
 *@param {object} call_back 点击节点展示街道流量图的回调函数
 */
function drawNetwork(map, net_data, station_data, call_back = null) {

  if (map.loaded())
    ondraw();
  else
    map.on("load", () => {
      ondraw();
    })

  function ondraw() {
    drawBike();
    drawLinkByType(map, net_data.link, "community_link_data", "community_link");
    drawNodeByType(map, net_data.node, "community_node_data", "community_node", true, "default", call_back);
  }

  function drawBike() {
    // 添加自行车站点图标
    let src = require('../img/bike.png');
    if (!map.hasImage("arrowIcon")) {
      map.loadImage(src, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage('bike', image);
      });
    }
    // 添加标记图标
    let mark_icon = require('../img/mark.png');
    if (!map.hasImage("markIcon")) {
      map.loadImage(mark_icon, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage('mark', image);
      });
    }

    map.addSource('station_places', {
      "type": "geojson",
      "data": station_data
    });
    map.addLayer({
      "id": "station_layer",
      "type": "symbol",
      "source": "station_places",
      "minzoom": 13.5,
      "layout": {
        "icon-image": "bike",
        "icon-allow-overlap": true,
        'icon-size': 0.11,
        // "text-field": "bike",
        // "text-allow-overlap": true,
        // "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        // "text-size": 9,
        // "text-transform": "uppercase",
        // "text-letter-spacing": 0.05,
        // "text-offset": [0, 1.5]
      },
      "paint": {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2
      }
    });
  }
}

/**
 * 切换到街道视图后更新小地图上选中的节点颜色
 *@param {object} map 地图实例对象
 *@param {object} data 节点数据
 */
function updateMinMap(map, data) {
  map.min_map.getSource("cluster_node_data_minmap").setData(data.node)
}


/**
 * 绘制多模式路线
 *@param {object} map 地图实例对象
 *@param {object} route_data 
 *@param {number} show_index 需要高亮展示的路线
 */
function drawMultiRoute(map, route_data, show_index = 0) {
  // console.log(route_data);
  //防止总路线数量小于SHOW_ROUTE_NUM
  const route_num = Math.min(route_data.length, SHOW_ROUTE_NUM);

  // 判断是否显示碳轨迹
  let show_carbon = false;
  if (show_index >= 10) {
    show_carbon = true;
    show_index -= 10;
  }

  // 更新地图，隐藏边，更改节点透明度
  removeLayerByType(map, "community_link");
  map.setPaintProperty("community_node", "circle-opacity", 0.3)

  // 尝试清除上次绘制的路线
  removeLayerByType(map, "multi_route");

  let data_copy = JSON.parse(JSON.stringify(route_data));
  // 将需要高亮的路线交换到数组首位
  [data_copy[0], data_copy[show_index]] = [data_copy[show_index], data_copy[0]];

  // 防止候选路线覆盖在上层，先绘制候选路线
  for (let i = route_num - 1; i >= 0; i--) {
    let draw_type = "candidate"
    if (i == 0 && show_carbon == false)
      draw_type = "target"
    else if (i == 0 && show_carbon == true)
      draw_type = "carbon"
    drawLinkByType(map, data_copy[i].link, "multi_route_link_data" + i, "multi_route_link" + i, draw_type)
    drawNodeByType(map, data_copy[i].node, "multi_route_node_data" + i, "multi_route_node" + i, false, draw_type)
  }

  // 添加标记站点
  if (map.getSource("mark_pos") != undefined) {
    map.addLayer({
      'id': "mark",
      'type': 'symbol',
      'source': "mark_pos",
      'layout': {
        'icon-image': 'mark',
        'icon-size': 0.3,
        'icon-offset': [0, -100],
      }
    });
  }


}

/**
 * 绘制普通网络节点
 *@param {object} map 地图实例对象
 *@param {object} data 
 *@param {String} source_id 图层数据id
 *@param {String} layer_id 图层id
 *@param {Boolean} map_event 是否添加鼠标事件，防止重复触发
 *@param {String} node_type 节点样式，路线展示节点，候选路线节点，街道网络节点 "target"||"candidate"||"carbon"||"default"
 *@param {function} call_back 回调函数，触发鼠标点击事件之后的绘制
 */
function drawNodeByType(map, data, source_id, layer_id, map_event, node_type = "default", call_back = null) {
  let paint_opt = {}
  if (node_type == "target" || node_type == "carbon") {
    paint_opt = {
      "circle-radius": ["interpolate", ["linear"],
        ["zoom"],
        13, 8,
        17, 18
      ],
      "circle-color": ["get", "color"],
    }
  } else if (node_type == "candidate") {
    paint_opt = {
      "circle-radius": ["interpolate", ["linear"],
        ["zoom"],
        13, 4,
        17, 11
      ],
      "circle-color": ["get", "color"],
      "circle-opacity": 0.5,
    }
  } else {
    paint_opt = {
      "circle-radius": ["interpolate", ["linear"],
        ["zoom"],
        13, 4,
        17, 11
      ],
      "circle-color": ["get", "color"],
    }
  }

  map.addSource(source_id, {
    type: "geojson",
    data: data,
  });
  map.addLayer({
    id: layer_id,
    source: source_id,
    type: "circle",
    paint: paint_opt,
  });

  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  if (map_event) {

    //鼠标悬浮显示节点名称
    map.on('mouseenter', layer_id, function(e) {
      map.getCanvas().style.cursor = 'pointer';
      let coordinates = e.features[0].geometry.coordinates.slice();
      const street_name = e.features[0].properties.name;
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      popup.setLngLat(coordinates)
        .setText(street_name)
        .addTo(map);
    });
    map.on('mouseleave', layer_id, function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on("click", layer_id, function(e) {
      // console.log(e.features[0].properties.name);
      const street_name = e.features[0].properties.name
      call_back(street_name);
    })
  }


}

/**
 * 绘制普通网络边
 *@param {object} map 地图实例对象
 *@param {object} data 
 *@param {String} source_id 图层数据id
 *@param {String} layer_id 图层id
 *@param {String} link_type 边样式，路线展示边，候选路线边，碳轨迹，街道网络边 "target"||"candidate"||"carbon"||"default"
 */
function drawLinkByType(map, data, source_id, layer_id, link_type = "default") {

  map.addSource(source_id, {
    type: "geojson",
    data: data,
  });

  let paint_opt = {}
  if (link_type == "target") {
    paint_opt = {
      "line-color": [
        'match',
        ['get', 'transport_mode'],
        "bike", "#F7FD04",
        "car", "#185ADB",
        "#6E7788",
      ],
      "line-width": 10,
      "line-opacity": 1
    }

  } else if (link_type == "candidate") {
    paint_opt = {
      "line-color": "#888",
      "line-width": 5,
      "line-opacity": 0.4
    }
  } else if (link_type == "carbon") {
    // 碳排放轨迹
    paint_opt = {
      "line-color": ['get', 'carbon_heat_color'],
      "line-width": 10,
      "line-opacity": 1
    }
  } else {
    paint_opt = {
      "line-color": "#888",
      "line-width": 1,
      "line-opacity": 0.3
    }
  }
  map.addLayer({
    id: layer_id,
    type: "line",
    source: source_id,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: paint_opt,
  });

  // 添加箭头图层
  if (link_type == "target" || link_type == "carbon") {
    if (map.hasImage("arrowIcon") != true) {
      let svgXML =
        `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"> 
              <path d="M529.6128 512L239.9232 222.4128 384.7168 77.5168 819.2 512 384.7168 946.4832 239.9232 801.5872z" p-id="9085" fill="#D7D5D5"></path> 
          </svg>
          `
      let svgBase64 = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXML)));
      let arrowIcon = new Image(20, 20);
      arrowIcon.src = svgBase64;
      arrowIcon.onload = function() {
        map.addImage('arrowIcon', arrowIcon)
      }
    }
    map.addLayer({
      'id': 'arrowLayer',
      'type': 'symbol',
      'source': source_id,
      'layout': {
        'symbol-placement': 'line',
        'symbol-spacing': 50, // 图标间隔，默认为250
        'icon-image': 'arrowIcon', //箭头图标
        'icon-size': 0.5
      }
    });
  }
}



/**
 * 绘制地图上的路线-测试
 *@param {object} map 地图实例对象
 *@param {object} route_data 后端传来的路线数据
 */
function drawRoute(map, route_data) {
  // map.on('load', function() {
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: route_data,
    },
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#888",
      "line-width": 8,
    },
  });
  // })
}

/**
 * 根据type移除地图上的图层和数据源
 *@param {object} map 地图实例对象
 *@param {string} layer_type 
 */
function removeLayerByType(map, layer_type) {
  // 移除社区网络
  if (layer_type == "cluster_net") {
    map.removeLayer("cluster_node");
    map.removeLayer("cluster_link");
    map.removeSource("cluster_node_data");
    map.removeSource("cluster_link_data");
  }
  if (layer_type == "community_link") {
    if (map.getLayer("community_link") != undefined) {
      map.removeLayer("community_link");
      map.removeSource("community_link_data");
    }
  }
  if (layer_type == "carbon") {
    map.removeLayer("carbon_layer");
    map.removeSource("carbon_data");
  }
  // 移除推荐路线
  if (layer_type == "multi_route") {
    let arrow_removed = false;
    for (let i = 0; i < SHOW_ROUTE_NUM; i++) {
      if (map.getLayer("multi_route_link" + i) != undefined) {
        if (!arrow_removed) {
          map.removeLayer("arrowLayer");
          arrow_removed = true;
        }

        map.removeLayer("multi_route_link" + i);
        map.removeSource("multi_route_link_data" + i);
      }
      if (map.getLayer("multi_route_node" + i) != undefined) {
        map.removeLayer("multi_route_node" + i);
        map.removeSource("multi_route_node_data" + i);
      }
    }
    // 尝试移除添加单车站点
    if (map.getLayer("mark") != undefined) {
      map.removeLayer("mark");
    }
  }
}

/**
 * 绘制岛上碳排放热力图
 */
function carbonHeat(map, data) {
  const source_id = "carbon_data",
    layer_id = "carbon_layer"

  map.on("load", () => {
    map.addSource(source_id, {
      type: "geojson",
      data: data,
    });
    map.addLayer({
      "id": layer_id,
      "type": "heatmap",
      "source": source_id,
      "maxzoom": 16,
      "paint": {
        // Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "carbon"],
          0, 0,
          2.4, 2
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 1,
          15, 3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "#64e600",
          0.4, "#fae600",
          0.6, "#e69000",
          0.8, "#e64800",
          1, "#e60000"
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 15,
          15, 30
        ],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10.5, 1,
          16, 0
        ],
      }
    });

  })
  // map.addLayer({
  //   id: draw_type,
  //   source: draw_type + "_point",
  //   type: "circle",
  //   minzoom: 6,
  //   paint: {
  //     // 圆圈半径动态更改，根据缩放等级从9到16，将数据中的radius属性，线性映射[20, 50] -> [2,5] ->[20,50]
  //     "circle-radius": ["interpolate", ["linear"],
  //       ["zoom"],
  //       9, 0.5,
  //       16, 5
  //     ],
  //     "circle-opacity": [
  //       "interpolate",
  //       ["linear"],
  //       ["zoom"],
  //       14.2, 0,
  //       17, 1
  //     ],
  //     "circle-color": point_color
  //   },
  // });
}


/**
 * 添加点击事件标记站点
 */
function addMarkerByClick(map) {
  map.on("click", "community_node", markerEvent)
}

function markerEvent(e) {
  let map = this;
  let choose_node_id = e.features[0].properties.id;
  console.log(e.features[0].properties);
  let coord = [e.lngLat.lng, e.lngLat.lat]
  drawMarker(map, choose_node_id, coord)
}
/**
 * 移除点击标记事件和所有标记
 */
function removeMarkerClick(map) {
  map.off("click", "community_node", markerEvent)
  if (map.getLayer("mark") != undefined) {
    map.removeLayer("mark");
    map.removeSource("mark_pos");
  }
}



/**
 * 绘制多个添加单车站点图标，同时确认是否重复站点，删除重复站点
 *
 */
function drawMarker(map, node_id, node_coord) {
  const source_id = "mark_pos",
    layer_id = "mark";

  // 首次点击
  if (map.add_station == undefined) {
    map.add_station = [node_id]
    let data = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        "properties": {
          "id": node_id,
        },
        'geometry': {
          'type': 'Point',
          'coordinates': node_coord
        }
      }]
    }
    if (map.getLayer(layer_id) == undefined) {
      map.addSource(source_id, {
        'type': 'geojson',
        'data': data
      });

      map.addLayer({
        'id': layer_id,
        'type': 'symbol',
        'source': source_id,
        'layout': {
          'icon-image': 'mark',
          'icon-size': 0.3,
          'icon-offset': [0, -100],
        }
      });
    }
  } else {
    // 检查输入点是否与已有重复，重复删除该点，否则新增
    let index = -1;
    for (let i = 0; i < map.add_station.length; i++)
      if (map.add_station[i] == node_id) {
        index = i;
        break;
      }
    let old_data = map.getSource(source_id)["_data"];
    let new_data = null;
    //重复删除
    if (index != -1) {
      map.add_station.splice(index, 1)
      new_data = {
        'type': 'FeatureCollection',
        'features': []
      };
      for (let i = 0; i < old_data["features"].length; i++)
        if (i != index)
          new_data["features"].push(old_data["features"][i])
    }
    // 不重复新增
    else {
      map.add_station.push(node_id)
      let tmp = {
        'type': 'Feature',
        "properties": {
          "id": node_id,
        },
        'geometry': {
          'type': 'Point',
          'coordinates': node_coord
        }
      }
      old_data["features"].push(tmp)
      new_data = JSON.parse(JSON.stringify(old_data));
    }
    // 无论重复与否都要更新数据
    map.getSource(source_id).setData(new_data);
  }
}


function drawTestLink(map) {
  map.addLayer({
    id: "testlink",
    type: "line",
    source: {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [118.088195, 24.499088],
            [118.136676, 24.48238],
          ]
        }
      }
    },
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#888",
      "line-width": 8,
      "line-opacity": 0.5
    },

  });
}



export {
  initMap,
  drawPoint,
  drawRoute,
  removeLayerByType,
  drawClusterNet,
  drawTestLink,
  drawNetwork,
  updateMinMap,
  drawMultiRoute,
  carbonHeat,
  addMarkerByClick,
  removeMarkerClick
}