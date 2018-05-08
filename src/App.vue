<template>
<div id="app" class="app">
  <div class="my-top">
    欢迎检查我的毕设成果
  </div>
  <div class="my-content" v-if="ready">
    <my-table-chart :myData="myData" :fixedNum="3" @updateData="updateData"></my-table-chart>
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
          field: "num",
          title: "学号"
        }, {
          field: "score_1",
          title: "科目一"
        }, {
          field: "score_2",
          title: "科目二"
        }, {
          field: "score_3",
          title: "科目三"
        },
        {
          field: "score_4",
          title: "科目四"
        },{
          field: "score_5",
          title: "科目五"
        },{
          field: "score_6",
          title: "科目六"
        },{
          field: "ave_score",
          title: "平均成绩"
        }],
        data: [{
          name: '李小双',
          num: '00001',
          class: '计算机141',
          score_1: 100,
          score_2: 80,
          score_3: 90,
          score_4:90,
          score_5:90,
          score_6:90,
          ave_score: 90,
          isselect: false,
        }, {
          name: '艾萨克',
          num: '00002',
          class: '计算机141',
          score_1: 90,
          score_2: 90,
          score_3: 90,
          score_4:90,
          score_5:90,
          score_6:90,
          ave_score: 90,
          isselect: false,
        }, {
          name: '安安',
          num: '00003',
          class: '计算机141',
          score_1: 70,
          score_2: 80,
          score_3: 90,
          score_4:80,
          score_5:80,
          score_6:80,
          ave_score: 80,
          isselect: false,
        }, {
          name: '手东方',
          num: '00004',
          class: '计算机141',
          score_1: 100,
          score_2: 80,
          score_3: 90,
          score_4:90,
          score_5:90,
          score_6:90,
          ave_score: 90,
          isselect: false,
        }, {
          name: '奥森',
          num: '00005',
          class: '计算机141',
          score_1: 70,
          score_2: 70,
          score_3: 70,
          score_4:70,
          score_5:70,
          score_6:70,
          ave_score: 70,
          isselect: false,
        }, {
          name: '西尼',
          num: '00006',
          class: '计算机141',
          score_1: 70,
          score_2: 70,
          score_3: 70,
          score_4:70,
          score_5:70,
          score_6:70,
          ave_score: 70,
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
