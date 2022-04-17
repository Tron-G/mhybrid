const echarts = require("echarts");
/**
 * 使用echarts绘制遗传算法计算结果的质量分布k线图
 *@param {String} container 视图div的id
 *@param {Object} data 二维数组
 */
function drawBoxplot(container, data) {
  //标题字体大小
  const FONT_SIZE = 8

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

//计算二维数组中每个数组的平均值，返回一维平均数数组
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

export {
  drawBoxplot
}