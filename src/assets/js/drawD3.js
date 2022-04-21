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
 */
function sortItem(data, now_sort, last_sort) {
  console.log(data);
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
}





export {
  drawBar,
  removeAllSvg,
  sortItem
}