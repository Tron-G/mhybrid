const d3 = require("d3");

/**
 * 绘制柱状图
 *@param {string} container div id
 *@param {Object} data [time, cost, transfer, carbon]
 *@param {Object} max_data max[time, cost, transfer, carbon]
 */
function drawBar(container, data, max_data) {

  // console.log(container, data, max_data);
  const draw_map = document.getElementById(container)
  const map_width = draw_map.offsetWidth,
    map_height = draw_map.offsetHeight;

  const bar_title = ["TI", "M", "TR", "CO"]
  const full_name = ["time", "cost", "transfer", "CO2"]
  const bck_rect_color = "#EBEBEB",
    rect_color = "#61B0DF";

  let svg = d3.select("#" + container)
    .append("svg")
    .attr("height", map_height)
    .attr("width", map_width)

  const rect_margin = 8,
    rect_top = 25,
    rect_side = 10;
  const rect_width = (map_width - rect_side * 2 - rect_margin * 3) / 4,
    rect_height = map_height - 10 - rect_top;

  let popup = d3.select(".bartooltip");

  for (let i = 0; i < 4; i++) {

    let yScale = d3.scale.linear() //创建一个线性比例尺
      .domain([0, max_data[i]]) //设定定义域
      .range([0, rect_height])

    const value_rect_height = yScale(data[i])

    //绘制背景矩形
    svg.append("rect")
      .attr("fill", bck_rect_color)
      .attr("x", rect_side + i * (rect_width + rect_margin))
      .attr("y", rect_top + 5)
      .attr("width", rect_width)
      .attr("height", rect_height)

    //绘制条形
    svg.append("rect")
      .attr("fill", rect_color)
      .attr("x", rect_side + i * (rect_width + rect_margin))
      .attr("y", rect_top + 5 + (rect_height - value_rect_height))
      .attr("width", rect_width)
      .attr("height", value_rect_height)
      .on("mouseover", () => {
        // popup.transition().duration(100).style("opacity", 1).style("display", "inline-block").style("z-index", 10);
        popup.style("opacity", 1).style("display", "inline-block").style("z-index", 10);
        popup.html(full_name[i] + ": " + Math.floor(data[i] * 100) / 100);
      })
      .on("mousemove", function(d, i) {
        // console.log(event.pageX, event.pageY);
        popup.style('top', (event.pageY - 30) + 'px').style('left', (event.pageX + 10) + 'px')
      })
      .on("mouseout", () => {
        // popup.transition().duration(100).style("opacity", 0).style("z-index", 0);
        popup.style("opacity", 0).style("z-index", 0);
      })

    svg.append("text")
      .attr("fill", "gray")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("x", rect_side + i * (rect_width + rect_margin) + rect_width / 2)
      .attr("y", 20)
      .text(bar_title[i])
  }
}

function removeAllSvg() {
  d3.selectAll("svg").remove();
}
/**
 * 按照条件对结果面板排序并绘制交换动画
 *@param {Object} data [time, cost, transfer, carbon]
 *@param {string} now_sort 当前点击的排序条件
 *@param {string} last_sort 上一次的排序条件
 *@returns {Number} 排序后的首位路线id
 */
function sortItem(data, now_sort, last_sort) {
  // console.log(data);
  // 首先获取各个小面板的横坐标，便于计算交换位置
  let item_pos = [];
  // console.log(last_sort, now_sort);
  // 查询原始数据中的键名表
  const alias = {
    "time": "cost_time",
    "cost": "cost_money",
    "transfer": "transfer_time",
    "carbon": "route_carbon",
  }

  for (let i = 0; i < 5; i++) {
    let items = document.getElementById("result_item" + i)
    let parent = items.offsetParent;
    item_pos.push(items.getBoundingClientRect().left - parent.getBoundingClientRect().left)
  }

  item_pos = item_pos.sort((a, b) => {
    return a - b;
  });

  let key = alias[last_sort];
  // 自定义排序函数
  function rule(a, b) {
    return a[key] - b[key]
  }

  let last_sort_list = JSON.parse(JSON.stringify(data)).sort(rule);
  key = alias[now_sort];
  let now_sort_list = JSON.parse(JSON.stringify(data)).sort(rule);

  // console.log(last_sort_list, now_sort_list);
  let last_index = [],
    now_index = [];
  last_sort_list.forEach(element => {
    last_index.push(element["route_id"])
  });
  now_sort_list.forEach(element => {
    now_index.push(element["route_id"])
  })

  for (let i = 0; i < now_index.length; i++) {
    if (now_index[i] != last_index[i]) {
      let move = item_pos[i] - item_pos[now_index[i]]
      d3.select("#result_item" + now_index[i]).transition().duration(500).style('left', move + 'px')
    }
  }
  return now_index[0];
}

/**
 * 重置子面板的相对位置
 */
function resetItemPos() {
  for (let i = 0; i < 5; i++) {
    d3.select("#result_item" + i).style('left', 0 + 'px')
  }
}



/**
 * 绘制路线详细信息
 *@param {string} container div id
 *@param {Object} data 路线数据
 */
function drawRouteInfo(data, container) {
  // console.log(data, container);
  const draw_map = document.getElementById(container)
  const map_width = draw_map.offsetWidth,
    map_height = draw_map.offsetHeight;

  let bike_src = require('../img/bike-dark.svg'),
    car_src = require('../img/car.svg');

  let svg = d3.select("#" + container)
    .append("svg")
    .attr("height", map_height)
    .attr("width", map_width)
    .attr("id", "info_svg")

  const rect_height = map_height / data["route_street"].length,
    circle_left = 40,
    text_left = 80

  for (let i = 0; i < data["route_street"].length; i++) {
    let node_color = "#D5EAFC",
      line_color = "#185ADB"
    if (i % 2 == 0) node_color = "#F1F1F1"
    if (i < data["route_street"].length - 1 && data["route_mode"][i] == 0) line_color = "#F7FD04"

    // 换乘路段提醒
    let tips = "";
    if (i == 0) {
      tips = "get on a "
      if (data["route_mode"][i] == 0)
        tips += "bike"
      else
        tips += "taxi"
    } else if (i < data["route_street"].length - 1 && data["route_mode"][i] != data["route_mode"][i - 1]) {
      tips = "transfer to a "
      if (data["route_mode"][i] == 0)
        tips += "bike"
      else
        tips += "taxi"
    }

    // 路段交通工具图标
    let mode_img = car_src
    if (i < data["route_street"].length - 1 && data["route_mode"][i] == 0)
      mode_img = bike_src

    //调试展示
    // svg.append("rect")
    //   .attr("width", map_width)
    //   .attr("height", rect_height)
    //   .attr("x", 0)
    //   .attr("y", i * rect_height)
    //   .attr("fill", node_color)
    //   .style("opacity", "0.3")

    svg.append("text")
      .attr("x", text_left)
      .attr("y", i * rect_height + rect_height / 2 + 6)
      .attr("fill", "#000000")
      .style("font-size", 16)
      .text(data["route_street"][i])

    if (tips != "") {
      svg.append("text")
        .attr("x", text_left + 150)
        .attr("y", i * rect_height + rect_height / 2 + 6)
        // .attr("fill", "#E02C2C")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .text(tips)
    }
    // 绘制路线颜色线段，交通图标，路程和时间
    if (i < data["route_street"].length - 1) {
      let path_info = data["route_distance"][i] + "m" + " , " + data["route_time"][i] + "s"
      svg.append("line")
        .attr("x1", circle_left)
        .attr("y1", i * rect_height + rect_height / 2)
        .attr("x2", circle_left)
        .attr("y2", (i + 1) * rect_height + rect_height / 2)
        .attr("stroke", line_color)
        .attr("stroke-width", "7px");
      svg.append("svg:image")
        .attr("xlink:href", mode_img)
        .attr("x", text_left + 10)
        .attr("y", i * rect_height + rect_height - 12)
        .attr("height", 25)
        .attr("width", 25)
      svg.append("text")
        .attr("x", text_left + 200)
        .attr("y", i * rect_height + rect_height + 5)
        .attr("fill", "#505050")
        .style("font-size", 14)
        .style("font-style", "italic")
        .text(path_info)
    }

    svg.append("circle")
      // .attr("stroke", "green")
      .attr("fill", data["street_color"][i])
      .attr("cx", circle_left)
      .attr("cy", i * rect_height + rect_height / 2)
      .attr("r", 10)
  }
}


/**
 * 移除svg
 */
function removeSvg() {
  let svg_id = "info_svg"
  let svg = document.getElementById(svg_id);
  console.log(svg);
  if (svg != null) {
    svg.parentNode.removeChild(svg);
  }

}





export {
  drawBar,
  removeAllSvg,
  sortItem,
  resetItemPos,
  drawRouteInfo,
  removeSvg
}