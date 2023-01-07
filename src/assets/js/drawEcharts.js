const echarts = require("echarts");
/**
 * 使用echarts绘制遗传算法计算结果的质量分布k线图
 *@param {String} container 视图div的id
 *@param {Object} data 二维数组
 */
function drawBoxplot(container, data) {
  //标题字体大小
  const FONT_SIZE = 9;

  let chart = echarts.init(document.getElementById(container));
  chart.clear();
  let avg_data = calc_avg(data);

  let option = {
    // title: [{
    //   text: 'Genetic algorithm all history Y',
    //   left: 'center'
    // }],
    dataset: [
      {
        source: data,
      },
      {
        transform: {
          type: "boxplot",
          // config: {
          //   itemNameFormatter: 'index {value}'
          // }
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],

    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: "1%",
      left: "20%",
      itemGap: 15,
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: FONT_SIZE,
        fontWeight: "bold",
      },
      data: ["adaptation distribution", "adaptation average"],
    },
    grid: {
      top: "10%",
      left: "10%",
      right: "5%",
      bottom: "10%",
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        nameGap: 30,
        axisLabel: {
          fontSize: FONT_SIZE,
        },
        splitArea: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: "category",
        show: false,
      },
    ],
    yAxis: {
      type: "value",
      name: "Adaptation",
      axisLabel: {
        fontSize: FONT_SIZE,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "gray",
          opacity: "0.3",
        },
      },
      min: "800",
      nameTextStyle: {
        fontSize: FONT_SIZE,
        fontWeight: "bold",
      },
      // splitArea: {
      //   show: true
      // }
    },
    series: [
      {
        name: "adaptation distribution",
        type: "boxplot",
        color: "black",
        datasetIndex: 1,
        boxWidth: ["7%", "50%"],
        tooltip: {
          formatter: function (param) {
            return [
              "Experiment " + param.name + ": ",
              "upper: " + param.data[5],
              "Q3: " + param.data[4],
              "median: " + param.data[3],
              "Q1: " + param.data[2],
              "lower: " + param.data[1],
            ].join("<br/>");
          },
        },
        itemStyle: {
          color: "black",
          borderWidth: 0.5,
          normal: {},
        },
      },
      {
        name: "adaptation average",
        type: "line",
        data: avg_data,
        xAxisIndex: 1,
        symbol: "none",
        itemStyle: {
          normal: {
            // color: '#1A34C7',
            color: "#E04646",
            lineStyle: {
              color: "#E04646",
            },
          },
        },
      },
    ],
  };
  if (option && typeof option === "object") {
    chart.setOption(option);
  }
  // return chart;
}

/**
 * 计算二维数组中每个数组的平均值，返回一维平均数数组
 */
function calc_avg(arrs) {
  let result = [];
  for (let i = 0; i < arrs.length; i++) {
    result.push(avg(arrs[i]));
  }
  return result;

  function avg(arr) {
    let total = arr.reduce(function (prev, next) {
      return prev + next;
    }, 0);
    return parseInt(total / arr.length);
  }
}

/**
 * 绘制街道24小时流量图
 */
function drawPieChart(container, title, data) {
  //数据格式：[{
  //   'value': 4403, 流量
  //   'name': 0 时间
  // },]
  let dom = document.getElementById(container);
  let myChart = echarts.init(dom);
  myChart.clear();
  let option;
  let chart_title = "traffic flow of " + title;
  option = {
    title: {
      text: chart_title,
      left: "center",
      bottom: "2%",
      textStyle: {
        fontSize: 15,
      },
    },
    // legend: {
    //   show: false,
    //   top: 'bottom'
    // },
    tooltip: {
      trigger: "item",
      // formatter: '{a}<br /> {b} -> {c}'
    },
    series: [
      {
        name: "traffic flow",
        type: "pie",
        radius: ["20%", "90%"],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        itemStyle: {
          color: "#5B98D1",
          borderColor: "#FFFFFF",
          borderWidth: 2,
          borderRadius: 8,
        },
        label: {
          formatter: "{b}",
          position: "inside",
          color: "#000000",
        },
        data: data,
      },
    ],
  };
  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}

/**
 * 绘制多个街道24小时流量图
 *@param {String} container 视图div的id
 *@param {Object} title 街道名称数组
 *@param {Object} data 街道流量数组
 *@param {function} clear_func 清除绘图数据的回调函数
 */
function drawPie(container, title, data, clear_func) {
  let dom = document.getElementById(container);
  let myChart = echarts.init(dom);
  myChart.clear();
  let option;
  let series_data = [];

  for (let i = 0; i < title.length; i++) {
    let tmp = {
      type: "bar",
      data: data[i],
      coordinateSystem: "polar",
      name: title[i],
      stack: "a",
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        opacity: 0.8,
      },
    };
    series_data.push(tmp);
  }

  option = {
    angleAxis: {
      type: "category",
      data: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
    },
    radiusAxis: {
      // type: 'log',
      // logBase: 10,
      // min: 0,
    },
    polar: {
      center: ["50%", "52%"],
      radius: "70%",
    },
    series: series_data,
    legend: {
      show: true,
      data: title,
    },
    title: {
      text: "24-hour taxi traffic statistics for streets",
      left: "center",
      bottom: "1px",
      textStyle: {
        fontSize: 16,
      },
    },

    toolbox: {
      feature: {
        myTool1: {
          show: true,
          title: "清除",
          icon: "path://M861.184 192.512q30.72 0 50.688 10.24t31.744 25.6 16.384 33.28 4.608 33.28q0 7.168-0.512 11.264t-0.512 7.168l0 6.144-67.584 0 0 537.6q0 20.48-8.192 39.424t-23.552 33.28-37.376 23.04-50.688 8.704l-456.704 0q-26.624 0-50.176-8.192t-40.448-23.04-26.624-35.84-9.728-47.616l0-527.36-63.488 0q-1.024-1.024-1.024-5.12-1.024-5.12-1.024-31.744 0-13.312 6.144-29.696t18.432-30.208 31.744-23.04 46.08-9.216l91.136 0 0-62.464q0-26.624 18.432-45.568t45.056-18.944l320.512 0q35.84 0 49.664 18.944t13.824 45.568l0 63.488q21.504 1.024 46.08 1.024l47.104 0zM384 192.512l320.512 0 0-64.512-320.512 0 0 64.512zM352.256 840.704q32.768 0 32.768-41.984l0-475.136-63.488 0 0 475.136q0 21.504 6.656 31.744t24.064 10.24zM545.792 839.68q17.408 0 23.552-9.728t6.144-31.232l0-475.136-63.488 0 0 475.136q0 40.96 33.792 40.96zM738.304 837.632q18.432 0 24.576-9.728t6.144-31.232l0-473.088-64.512 0 0 473.088q0 40.96 33.792 40.96z",
          onclick: function () {
            clear_func();
            myChart.clear();
          },
        },
      },
    },
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}

/**
 * 绘制5个路线的总览折柱图
 *@param {String} container 视图div的id
 *@param {Object} data
 */
function drawLineBar(container, data) {
  //数据归一化
  function normalization(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    let res = [];
    if (max !== min)
      res = arr.map((item) => {
        //缩放规则与柱状图一致，稍微调整了比例
        // let value = ((item - min) / (max - min)) * 0.7 + 0.2;
        let value = (item - min) / (max - min);
        return parseInt(value * 10) / 10;
      });
    else res = arr.map((v) => 0.5);
    return res;
  }
  //计算折线坐标数据
  function transform2line(arr, index) {
    return arr.map((x, i) => [20 * (index + 1) + i * 100, x]);
  }

  const route_attr = ["time", "cost", "distance", "carbon"];
  const route_color = ["#61B0DF", "#b8dbad", "#fad278", "#f08484"];

  const tmp_time = [],
    tmp_cost = [],
    tmp_distance = [],
    tmp_carbon = [];
  for (let item of data) {
    tmp_time.push(item["cost_time"]);
    tmp_cost.push(item["cost_money"]);
    tmp_distance.push(item["total_distance"]);
    tmp_carbon.push(item["route_carbon"]);
  }
  const route_attr_data = {
    time: tmp_time,
    cost: tmp_cost,
    distance: tmp_distance,
    carbon: tmp_carbon,
  };

  //柱状图数据和配置项
  const series_bar_data = route_attr.map((item, index) => ({
    name: item,
    type: "bar",
    itemStyle: {
      color: route_color[index],
      opacity: 0.7,
    },
    data: normalization(route_attr_data[item]),
  }));
  //折线图数据和配置项
  const series_line_data = route_attr.map((item, index) => ({
    name: item + " line",
    type: "line",
    xAxisIndex: 1,
    // smooth: true,
    tooltip: {
      show: false,
    },
    itemStyle: {
      normal: {
        color: "gray",
        lineStyle: {
          color: route_color[index],
          type: "solid",
        },
      },
    },
    data: transform2line(
      // normalization(route_attr_data[item]).map((v) => v + 0.01),
      normalization(route_attr_data[item]),
      index
    ),
  }));

  ///////////////////////////////////////////////////////
  let dom = document.getElementById(container);
  let myChart = echarts.init(dom);
  myChart.clear();
  // var dom = document.getElementById(container);
  // var myChart = echarts.init(dom, null, {
  //   renderer: "canvas",
  //   useDirtyRect: false,
  // });

  const option = {
    grid: {
      x: 40,
      y: 50,
      x2: 40,
      y2: 40,
    },

    tooltip: {
      show: false,
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    legend: {
      top: 10,
      data: route_attr,
    },
    //为了实现折线平移，使用了一个隐藏的数值型x轴
    xAxis: [
      {
        type: "category",
        data: data.map((item) => "route index: " + item.route_id),
        axisPointer: {
          type: "shadow",
        },
        axisTick: {
          interval: 0,
        },
        axisLabel: {
          interval: 0,
        },
      },
      {
        type: "value",
        max: 5 * 100,
        show: false,
        axisPointer: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "proportion",
        min: 0,
        max: 1,
        axisLine: {
          show: false,
        },
        axisPointer: {
          show: false,
        },
      },
    ],
    series: [...series_bar_data, ...series_line_data],
  };
  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
}
export {
  drawBoxplot,
  // drawPieChart,
  drawPie,
  drawLineBar,
};
