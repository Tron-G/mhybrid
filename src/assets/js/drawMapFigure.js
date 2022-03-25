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
          ["zoom"], 9, 0.5, 16, 5
        ],
        "circle-color": [
          "match",
          ["get", "label"],
          "-1",
          "#E2DEDE",
          // "0",
          // "#e55e5e",
          // "1",
          // "#3EDBF0",
          // "2",
          // "#fbb03b",
          // "3",
          // "#0F7220",
          // "4",
          // "#B35EE5",
          // "5",
          // "#2BC516",
          // "6",
          // "#3F3697",
          // "7",
          // "#BA135D",
          // "8",
          // "#FF7A00",
          // "9",
          // "#2940D3",
          point_color,
        ],
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14, 0,
          15, 1
        ]
        // "circle-color": TYPE_POINT_COLOR[type_name]
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
  map.on('load', function() {
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
  })
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


export {
  initMap,
  drawPoint,
  drawRoute,
  removeLayerByID
}