/**
 * 初始化地图实例对象
 *@param {string} container 地图绑定的div，id
 *@return {object}  地图实例对象
 */
// export const mapboxgl = require("mapbox-gl");

function initMap(container) {
  const mapboxgl = require("mapbox-gl");
  mapboxgl.accessToken =
    "pk.eyJ1IjoieGlhb2JpZSIsImEiOiJja2pndjRhMzQ1d2JvMnltMDE2dnlkMGhrIn0.bCKzSCs5tHTIYk4xQ65doA";

  let map = new mapboxgl.Map({
    container: container,
    style: "mapbox://styles/xiaobie/cl06pkagg005i14p82d999k9w",
    center: [118.127193, 24.491097],
    zoom: 12.5,
    dragRotate: false,
    doubleClickZoom: false
  });
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
    [118.373857, 24.80727],
  ];
  map.setMaxBounds(bounds);
  return map
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
          10, 3,
          15, 20
        ],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 1,
          14.5, 0
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
 */
function drawClusterNet(map, net_data) {

  const mapboxgl = require("mapbox-gl");
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
    // console.log("draw111", net_data);
    map.addSource("cluster_point", {
      type: "geojson",
      data: net_data.node,
    });

    map.addLayer({
      id: "cluster_node",
      source: "cluster_point",
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

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', "cluster_node", function(e) {
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

    map.on('mouseleave', 'cluster_node', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on('click', 'cluster_node', function(e) {
      let coordinates = e.features[0].geometry.coordinates.slice();
      const original_color = e.features[0].properties.original_color;
      const now_color = e.features[0].properties.color;
      e.features[0].properties.color = "#000";
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      console.log(e.features[0]);

    });

  }

  //画边
  function drawLink() {
    map.addSource("cluster_link_data", {
      type: "geojson",
      data: net_data.link,
    });
    map.addLayer({
      id: "cluster_link",
      type: "line",
      source: "cluster_link_data",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": ["get", "link_width"],
        "line-opacity": 0.5
      },
    });
  }
}



/**
 * 绘制地图上的路线
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
 * 根据id移除地图上的图层和数据源
 *@param {object} map 地图实例对象
 *@param {string} layer_id 
 */
function removeLayerByID(map, layer_id) {
  map.removeLayer(layer_id);
  map = map.removeSource(layer_id + "_point");
  return map;
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
  removeLayerByID,
  drawClusterNet,
  drawTestLink
}