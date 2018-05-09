<template>
<div id="app" class="app">
  <div class="my-top">
    基于Vue的表格与图表组件的设计与实现
  </div>
  <div class="my-content" v-if="ready">
    <my-table-chart :myData="myData" :fixedNum="3" :yAxisData="yAxisData" @updateData="updateData"></my-table-chart>
  </div>
</div>
</template>
<script>
import myTableChart from './components/myTableChart.vue'
export default {
  components: {
    myTableChart
  },
  data() {
    return {
      ready:false,
      yAxisData:{
        barData:['num_score_1','num_score_2','num_score_3','num_score_4','num_score_5','num_score_6'],
        lineData:['num_ave_score'],
      },
      myData: {
        columns: [{
          field: "isselect",
          title: "多选"
        }, {
          field: "class",
          title: "班级"
        }, {
          field: "name",
          title: "姓名"
        }, {
          field: "student_id",
          title: "学号"
        }, {
          field: "num_score_1",
          title: "科目一"
        }, {
          field: "num_score_2",
          title: "科目二"
        }, {
          field: "num_score_3",
          title: "科目三"
        },
        {
          field: "num_score_4",
          title: "科目四"
        },{
          field: "num_score_5",
          title: "科目五"
        },{
          field: "num_score_6",
          title: "科目六"
        },{
          field: "num_ave_score",
          title: "平均成绩"
        }],
        data: [{
          name: '李小双',
          student_id: '00001',
          class: '计算机141',
          num_score_1: 100,
          num_score_2: 80,
          num_score_3: 90,
          num_score_4:90,
          num_score_5:90,
          num_score_6:90,
          num_ave_score: 90,
          isselect: false,
        }, {
          name: '艾萨克',
          student_id: '00002',
          class: '计算机141',
          num_score_1: 90,
          num_score_2: 90,
          num_score_3: 90,
          num_score_4:90,
          num_score_5:90,
          num_score_6:90,
          num_ave_score: 90,
          isselect: false,
        }, {
          name: '安安',
          student_id: '00003',
          class: '计算机141',
          num_score_1: 70,
          num_score_2: 80,
          num_score_3: 90,
          num_score_4:80,
          num_score_5:80,
          num_score_6:80,
          num_ave_score: 80,
          isselect: false,
        }, {
          name: '手东方',
          student_id: '00004',
          class: '计算机141',
          num_score_1: 100,
          num_score_2: 80,
          num_score_3: 90,
          num_score_4:90,
          num_score_5:90,
          num_score_6:90,
          num_ave_score: 90,
          isselect: false,
        }, {
          name: '奥森',
          student_id: '00005',
          class: '计算机141',
          num_score_1: 70,
          num_score_2: 70,
          num_score_3: 70,
          num_score_4:70,
          num_score_5:70,
          num_score_6:70,
          num_ave_score: 70,
          isselect: false,
        }, {
          name: '西尼',
          student_id: '00006',
          class: '计算机141',
          num_score_1: 70,
          num_score_2: 70,
          num_score_3: 70,
          num_score_4:70,
          num_score_5:70,
          num_score_6:70,
          num_ave_score: 70,
          isselect: false,
        }]
      }
    }
  },
  mounted(){
    if(localStorage.getItem('tableData')){
      let tmpData = JSON.parse(localStorage.getItem('tableData'));
      tmpData.data.forEach(value=>{
         value.isselect = false;
      })
      this.myData = tmpData;
      this.ready = true;
    }else{
      localStorage.setItem('tableData',JSON.stringify(this.myData));
      this.ready = true;
    }
  },
  methods:{
    updateData(data){
      localStorage.removeItem('tableData');
      localStorage.setItem('tableData',JSON.stringify(data));
      this.myData = data;
    }
  }
}
</script>

<style lang="scss">
.app {
    background: #fff;
    position: relative;
    width: 100%;
    height: 100%;
    .my-top {
        // margin-left: 0.2rem;
        // margin-right: 0.2rem;
        padding: 0.2rem;
        font-size: 0.24rem;
        text-align: center;
        color: #333333;
        background: #f8f8f8;
        margin-bottom: 0.2rem;
    }
    .my-content {
        // margin-left: 0.2rem;
        // margin-right: 0.2rem;
        background: #f8f8f8;
        min-height: 2rem;
    }
}
</style>
