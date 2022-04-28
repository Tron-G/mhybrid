const echarts = require("echarts");
/**
 * 使用echarts绘制遗传算法计算结果的质量分布k线图
 *@param {String} container 视图div的id
 *@param {Object} data 二维数组
 */
function drawBoxplot(container, data) {
  //标题字体大小
  const FONT_SIZE = 9

  let chart = echarts.init(document.getElementById(container));
  chart.clear()
  let avg_data = calc_avg(data);

  let option = {
    // title: [{
    //   text: 'Genetic algorithm all history Y',
    //   left: 'center'
    // }],
    dataset: [{
        source: data
      },
      {
        transform: {
          type: 'boxplot',
          // config: {
          //   itemNameFormatter: 'index {value}'
          // }
        }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1
      }
    ],

    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: "1%",
      left: "20%",
      itemGap: 15,
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: FONT_SIZE,
        fontWeight: "bold"
      },
      data: ['adaptation distribution', 'adaptation average']
    },
    grid: {
      top: "10%",
      left: '10%',
      right: '5%',
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      nameGap: 30,
      axisLabel: {
        fontSize: FONT_SIZE
      },
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: 'Adaptation',
      axisLabel: {
        fontSize: FONT_SIZE
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "gray",
          opacity: "0.3"
        }
      },
      min: "800",
      nameTextStyle: {
        fontSize: FONT_SIZE,
        fontWeight: "bold"
      }
      // splitArea: {
      //   show: true
      // }
    },
    series: [{
        name: 'adaptation distribution',
        type: 'boxplot',
        color: "black",
        datasetIndex: 1,
        boxWidth: ["7%", "50%"],
        tooltip: {
          formatter: function(param) {
            return [
              'Experiment ' + param.name + ': ',
              'upper: ' + param.data[5],
              'Q3: ' + param.data[4],
              'median: ' + param.data[3],
              'Q1: ' + param.data[2],
              'lower: ' + param.data[1]
            ].join('<br/>');
          }
        },
        itemStyle: {
          color: "black",
          borderWidth: 0.5,
          normal: {}
        }
      },
      {
        name: 'adaptation average',
        type: 'line',
        data: avg_data,
        symbol: "none",
        itemStyle: {
          normal: {
            // color: '#1A34C7',
            color: '#E04646',
            lineStyle: {
              color: '#E04646'
            }
          }
        },
      }
    ]
  };
  if (option && typeof option === 'object') {
    chart.setOption(option);
  }
  // return chart;
}

/**
 * 计算二维数组中每个数组的平均值，返回一维平均数数组
 */
function calc_avg(arrs) {
  let result = []
  for (let i = 0; i < arrs.length; i++) {
    result.push(avg(arrs[i]))
  }
  return result;

  function avg(arr) {
    let total = arr.reduce(function(prev, next) {
      return prev + next
    }, 0)
    return parseInt(total / arr.length)
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
  myChart.clear()
  let option;
  let chart_title = "traffic flow of " + title
  option = {
    title: {
      text: chart_title,
      left: "center",
      bottom: "2%",
      textStyle: {
        fontSize: 15
      },
    },
    // legend: {
    //   show: false,
    //   top: 'bottom'
    // },
    tooltip: {
      trigger: 'item',
      // formatter: '{a}<br /> {b} -> {c}'
    },
    series: [{
      name: 'traffic flow',
      type: 'pie',
      radius: ["20%", "90%"],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      itemStyle: {
        color: '#5B98D1',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 8
      },
      label: {
        formatter: '{b}',
        position: 'inside',
        color: "#000000"
      },
      data: data
    }]
  };
  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }
}



export {
  drawBoxplot,
  drawPieChart
}