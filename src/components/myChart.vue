<template>
<div class="myChart">
   <!-- 这里是图表区域 -->
   <div id="chart_1" class="chart_1"></div>
</div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/component/title');
require('echarts/lib/component/grid');
require("zrender/lib/svg/svg");
export default {
  props:['chartData','yAxisData'],
  data () {
    return {
       invocNameArray:[],
       colorArray: ['#3f7aab', '#5ebab2', '#fda948', '#f2cb2a', '#d5927d',
      '#aa86ab', '#f54953', '#ba76a3', '#a3745b'],
      lineColorArray: ['#FF0000', '#FF359A', '#E800E8', '#000093', '#005757',
     '#548C00', '#FF9224', '#9AFF02', '#484891'],
    }
  },
  mounted(){
    this.renderChartData('chart_1', this.chartData, this.yAxisData)
  },
  watch:{
    chartData:{
      handler(newValue,oldValue){
        this.renderChartData('chart_1', this.chartData, this.yAxisData)
      },
      deep:true
    }
  },
  methods:{
    getData(name, value, keysdata) {
    let result = null;
    let id = null;
    keysdata.forEach(data=>{
      if(data.title == name){
         id = data.field;
      }
    })
    result = Number(value[id]);
    return result;
  },
    transformChartData(data,dealData) {
    let result = [];
    let keys1 = {};
    let keys2 = {};
    let tmp = data;
    dealData.barData.forEach(key=>{
        tmp.columns.forEach(value=>{
        if(value.field == key){
          keys1[value.title] = null;
        }
      })
    })
    dealData.lineData.forEach(key=>{
        tmp.columns.forEach(value=>{
        if(value.field == key){
          keys2[value.title] = null;
        }
      })
    })
    this.invocNameArray = Object.keys(keys1);
    this.invocNameArray = this.invocNameArray.concat(Object.keys(keys2))
    let keysArray = Object.keys(keys1)
    let colors = this.colorArray;
    for (let i = 0; i < keysArray.length; i++) {
      let obj = {
        name: keysArray[i],
        type: 'bar',
        barWidth: 12,
        // barGap: '220%',
        yAxisIndex: 1,
        // stack: '各科成绩',
        animation: false,
        data: [],
        itemStyle: {
          normal: {
            color: colors[i]
          }
        },
      }
      for (let j = 0; j < tmp.data.length; j++) {
        obj.data.push(this.getData(keysArray[i],tmp.data[j], tmp.columns))
      }
      result.push(obj)
    }
    colors = this.lineColorArray;
    keysArray = Object.keys(keys2)
    for (let i = 0; i < keysArray.length; i++) {
      let obj = {
        name: keysArray[i],
        type: 'line',
        animation: false,
        symbolSize: 5,
        symbol: 'circle',
        lineStyle: {
          normal: {
            width: 1,
            color: colors[i]
          }
        },
        data: [],
      }
      for (let j = 0; j < tmp.data.length; j++) {
        obj.data.push(this.getData(keysArray[i],tmp.data[j], tmp.columns))
      }
      result.push(obj)
    }
    return result;
  },
  getxAxisData(data){
    let result = [];
    let tmp = data;
    let keys = {};
      for (let i = 0; i < tmp.data.length; i++) {
        keys[tmp.data[i].name] = null;
      }
      result= Object.keys(keys);
      return result;
  },
    renderChartData(id, data, dealData) { //体验区统计图表渲染函数
    let chart = echarts.getInstanceByDom(document.getElementById(id));
    if (chart && !chart.isDisposed()) {
      chart.clear();
      chart.dispose();
    }
    const seriesData = this.transformChartData(data,dealData)
    let xAxisData = this.getxAxisData(data)
    chart = echarts.init(document.getElementById(id), null, {
      renderer: 'svg'
    })
    let legendData = this.invocNameArray;
    chart.setOption({
      title: {
        text: '成绩统计',
        show: false,
        bottom: -4,
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        hideDelay: 0,
        formatter: (params) => {
          let content = [];
          for (let i = 0; i < params.length; i++) {
            let marker = params[i].marker;
            let name = params[i].seriesName;
            let value = params[i].value;
            if(value == 'undefined' || value == null || isNaN(value)){
              continue;
            }
            content.push(marker + name + ': ' +value + '<br>')
          }
          return content.join('');
        }
      },
      legend: {
        show: true,
        left: '12%',
        top:'82%',
        itemWidth: 10,
        itemHeight: 10,
        data: legendData,
        textStyle:{
          fontSize:12,
        }
      },
      grid: {
        left: '12%',
        right: '12%',
        top: '8%',
        height: '60%',
      },
      yAxis: [{
        type: 'value',
        position: 'right',
        axisLabel: {
          // formatter: (value) => {
          //   if (value == 0) return 0
          //   return Math.ceil(value / 1000) + 'k'
          // },
          show: true,
          textStyle: {
            color: '#333333',
            fontSize: 14,
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#666666',
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5',
            type: 'dashed'
          }
        },
      }, {
        type: 'value',
        position: 'left',
        axisLabel: {
          show: true,
          // formatter: (value) => {
          //   if (value == 0) return 0
          //   return value;
          // },
          textStyle: {
            color: '#333333',
            fontSize: 14,
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#666666'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5',
          }
        },
      }],
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: {
          //show:false,
        },
        axisLabel: {
          show: true,
          margin: 10,
          fontSize: 14,
          color: '#666666',
          // formatter: (value) => {
          //   let str = value.substring(6, 8);
          //   let a = parseInt(str);
          //   return a.toString() + '日'
          // },
        }
      },
      series: seriesData

    })
  },
  }
}
</script>
<style lang="scss">
.myChart{
  width: 100%;
  height: 100%;
  position:relative;
  .chart_1{
    width: 100%;
    height: 4.5rem;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
