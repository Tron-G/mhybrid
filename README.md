<!--
 * @Author: tron 1285771266@qq.com
 * @Date: 2022-02-27 20:27:24
 * @LastEditors: tron 1285771266@qq.com
 * @LastEditTime: 2022-08-07 13:26:58
 * @FilePath: \mhybrid\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# Mhybrid - Low-carbon mixed traffic route recommendation for community residents based on multilayer complex traffic network

We propose a low-carbon mixed route recommendation method based on a multilayer complex traffic network and define a trip chain-level carbon emission estimation model. These methods are integrated into a visual analytics system to support the multilevel exploration of urban traffic patterns, mixed traffic route recommendations for inter-community commuting, and optimization of low-carbon recommended routes by adjusting bike stations. By extracting real traffic flow data from taxi and bikesharing trajectory data, the method performs carbon emission estimation of urban streets and constructs a multilayer complex traffic network capable of visualizing urban traffic patterns. Based on this network low-carbon mixed traffic routes containing taxis and bike-sharing are then generated using a genetic algorithm modified by the A* algorithm, and the carbon emission is visualized.

[sys](https://github.com/Tron-G/mhybrid/blob/dev/sys.png)

***

## Project Dependencies
* "d3": "^3.5.17"
* "echarts": "^5.3.2"
* "mapbox-gl": "^2.7.0"
* "axios": "^0.26.1"
* "vue-router": "^4.0.3"

## Algorithm Support

*  Douglas-Peucker algorithm
*  Earth spherical distance

$$ D(v_{i},v_{i+1})=2*R*arcsin\sqrt{sin^{2}\left ( \frac{y_{i+1}-y_{i}}{2} \right )+cosy_{i}*cosy_{i+1}*sin^{2}\left ( \frac{x_{i+1}-x_{i}}{2} \right )} $$

* PageRank

$$ PR(p_{i}) = \frac{1-d}{N}+d\sum_{p_{j}\in M(p_{i})}^{}\frac{PR(p_{j})}{L(p_{j})} $$

* Data field clustering algorithm

$$ \varphi(p_{i}) = \max \limits_{j\in \left [ 1,n \right ]} m_{ c_{j}}e^{- ( \frac{D(p_{i}, c_{j})}{\sigma } )^{2}} $$

* Improved genetic algorithm based on A* algorithm

* Carbon emission estimation model

$$ E(trip)=K_{c}*(0.3T+0.028D+0.056\sum_{i=1}^{n-1}\delta_{i} *(v_{i+1}^{2}-v_{i}^{2})) $$

## System Paper
>Related paper is being submitted, stay tuned. ^_^


## System Showcase

1. Overview of urban traffic conditions and carbon emission



2. Mixed traffic route recommendation and personalized selection


3. Modify bicycle stops to update recommended routes


## More
Please refer to my csdn blog for some technical details：

[Tron_future’s CSDN blog](https://blog.csdn.net/Tron_future/article/details/123806812?spm=1001.2014.3001.5501)
