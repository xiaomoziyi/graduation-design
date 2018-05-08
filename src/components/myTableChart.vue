<template>
<div class="myTableChart">
  <div class="my-table" v-if="tableData">
    <div class="table-top">
       <div class="top-left">
         <div class="left-top" @click="openSelectFun" :style="{'border-bottom':openselect?'none':'0.01rem solid #e5e5e5'}">
           <h3>记录数：{{select_num}}</h3>
           <span :class="{'up':openselect,'down':!openselect}"></span>
         </div>
         <transition>
           <div v-if="openselect" class="left-bottom">
              <li v-for='list in selectNumData' :class="{'selected':list == select_num}" @click="selectNumFun(list)">{{list}}<span v-show="list == select_num"></span></li>
           </div>
        </transition>
       </div>
       <div class="top-right">
         <div class="right-find">
                <span class="img"></span>
                <input v-model="search_text" placeholder="输入关键字进行查询" @keyup.enter="serchItem(search_text)" :style="{'color':search_text ? '#333':'#ddd'}"/>
         </div>
         <div class="right-order" v-if="ordering" @click="startOrderTableData">
            <span>排序</span>
         </div>
         <div class="right-order" v-if="!ordering" style="background:#CECEFF" @click="endOrderTableData">
            <span>取消</span>
         </div>
         <div class="right-botton" @click="editTableData">
             编辑
         </div>
         <div class="right-botton" @click="addTableData">
             增加
         </div>
         <div class="right-botton" @click="removeTableData">
             删除
         </div>
       </div>
    </div>
    <my-table :tableData="tableData" :fixedNum="last_fixedNumber" :orderFlag="orderFlag" :handleFlag="handleFlag" @ordertable="orderTableData"></my-table>
    <div class="table-bottom">
      <div class="bottom-left" v-show="ishandle">
        <div class="left-botton" style="background:#73BF00;" @click="saveEditing">
          保存
        </div>
        <div class="left-botton" style="background:#FF0000;" @click="endEditing">
          取消
        </div>
      </div>
      <div class="bottom-right">
        <div class="botton-before" @click="jumpBefore">上一页</div>
        <div class="botton-between">
          <span v-for="item in pageData" @click="jumpTo(item)" :style="{'color':item == page_num ?'rgb(134, 122, 228)':'#333'}">{{item}}</span>
          <span v-show="pageData[pageData.length-1] < table_data_len">...</span>
        </div>
        <div class="botton-next" @click="jumpNext">下一页</div>
      </div>
    </div>
  </div>
  <div class="my-chart">
    <!-- <my-chart></my-chart> -->
  </div>
</div>
</template>

<script>
import myTable from './myTable.vue'
import myChart from './myChart.vue'
export default {
  props:['myData','fixedNum'],
  components:{ myTable , myChart},
  data () {
    return {
      tableData:null,
      last_fixedNumber:0,
      selectNumData:[1,5,10,15],
      select_num:5,
      openselect:false,
      page_num:1,
      pageData:[],
      table_data_len:null,
      search_text:null,
      tmpData:null,
      ordering:true,
      ishandle:false,
      orderFlag:false,
      handleFlag:0,
      ishandling:false,
    }
  },
  created(){
  },
  mounted(){
    // this.tableData = this.myData;
    localStorage.removeItem('newdata');
    localStorage.removeItem('selectIndexData');
    localStorage.removeItem('editData');
    this.tmpData = this.myData.data;
    this._refreshData();
    if(this.fixedNum){
        this.last_fixedNumber = this.fixedNum;
    }
  },
  updated(){
        if(this.fixedNum){
            this.last_fixedNumber = this.fixedNum;
        }
    },
    methods:{
      _refreshData(){
        console.log('1111');
        console.log(this.tmpData);
        this.table_data_len = Math.ceil(this.tmpData.length/this.select_num);
        if(this.table_data_len > 1){
          let t = this.page_num;
          let tmp = [];
          let data = this.pageData;
          for(let i = 1 ; i <= 3 && t <= this.table_data_len ; i++){
            tmp.push(t++);
          };
          this.pageData = tmp;
          if(this.page_num >= data[0] && this.page_num <= data[data.length-1]){
            this.pageData = data;
          }
        }else{
            this.pageData = [];
        }
        let result = [];
        let num = this.select_num * this.page_num;
        let len = this.tmpData.length <= num ? this.tmpData.length : num;
        let k = this.page_num;
        for(let i = this.select_num * (this.page_num - 1 ); i < len; i++){
          result.push(this.tmpData[i]);
        }
        this.tableData = {
          columns:this.myData.columns,
          data:result
        };
      },
      selectNumFun(data){
        if(this.ishandling == true && this.ordering == true){
          alert('正在进行其他操作，请稍后再试');
          return;
         }
          this.select_num = data;
          this.openselect = false;
          this.page_num = 1;
          localStorage.removeItem('selectIndexData');
          this._refreshData();
      },
      openSelectFun(){
        this.openselect = !this.openselect
      },
      jumpBefore(){
        if(this.ishandling == true && this.ordering == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        if(this.page_num == 1){
          alert('已经是首页了');
        }else{
          this.page_num = this.page_num - 1;
          localStorage.removeItem('selectIndexData');
          this._refreshData();
        }
      },
      jumpTo(data){
        if(this.ishandling == true && this.ordering == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
          this.page_num = data;
          localStorage.removeItem('selectIndexData');
          this._refreshData();
      },
      jumpNext(){
        if(this.ishandling == true && this.ordering == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        if(this.page_num == this.table_data_len){
          alert('已经是尾页了');
        }else{
          this.page_num = this.page_num + 1;
          localStorage.removeItem('selectIndexData');
          this._refreshData();
        }
      },
      serchItem(data){
        let result = [];
        let tmp = this.myData.data;
        for(let value of this.myData.data){
          for(let key of this.myData.columns){
            if(key.field != 'isselect'){
              let str = value[key.field].toString();
               if(str.indexOf(data) > -1){
                 result.push(value)
                 break;
               }
            }
          }
        }
        if(result.length < 1){
          alert('没有该记录');
          return;
        }
        this.tmpData = result;
        this.page_num = 1;
        this._refreshData();
      },
      startOrderTableData(){
        if(this.ishandling == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        this.ordering = false;
        this.orderFlag = true;
        this.ishandling = true;
      },
      endOrderTableData(){
        this.ordering = true;
        this.orderFlag = false;
        this.ishandling = false;
      },
      orderTableData(data,key){
        let tmp=this.tmpData;
        tmp.sort((val1,val2)=>{
          if(data == 0 ){//升序
            return val1[key] >= val2[key];
          }else{
            return val1[key] <= val2[key];
          }
        })
        this.tmpData = tmp;
        this._refreshData();
      },
      editTableData(){
        if(this.ishandling == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        if(localStorage.getItem('selectIndexData')){
          let tmp = JSON.parse(localStorage.getItem('selectIndexData'));
          console.log(tmp);
          if(tmp.length > 0){
            this.ishandle = true;
            this.ishandling = true;
            this.handleFlag = 1;
            return;
          }
        }
        alert('请选择至少一条记录');
      },
      addTableData(){
        if(this.ishandling == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        this.ishandle = true;
        this.ishandling = true;
        this.handleFlag = 2;
        this.page_num = this.table_data_len;
        this._refreshData();
      },
      removeTableData(){
        if(this.ishandling == true){
          alert('正在进行其他操作，请稍后再试');
          return;
        }
        if(localStorage.getItem('selectIndexData')){
          let tmp = JSON.parse(localStorage.getItem('selectIndexData'));
          let result = this.tmpData;
          let data=[];
          tmp.forEach(value=>{
             delete result[value + (this.page_num-1) * this.select_num];
          })
          result.forEach(value=>{
            if(value){
              data.push(value);
            }
          })
          this.tmpData = data;
          this.page_num = 1;
          this.pageData=[];
          this._refreshData();
          alert('删除成功');
          localStorage.removeItem('selectIndexData')
        }else{
          alert('请选择至少一条数据！')
        }
        let nowData={
          columns:this.myData.columns,
          data:this.tmpData
        }
        this.$emit('updateData',nowData);
      },
      saveEditing(){
        let nowData={
          columns:this.myData.columns,
          data:this.tmpData
        }
        let flag = true;
        if(this.handleFlag == 1){//编辑状态
          if(localStorage.getItem('editData')){
            let tmp = JSON.parse(localStorage.getItem('editData'));
            tmp.forEach(value=>{
              this.myData.columns.forEach(key=>{
                if( key.field != 'isselect' && !value[key.field]){
                  flag = false;
                }
              })
            })
            if(flag == true){
              nowData.data = tmp;
              localStorage.removeItem('editData');
              this.$emit('updateData',nowData);
              this.ishandle = false;
              this.ishandling = false;
              this.handleFlag = 0;
              this._refreshData();
            }else{
              alert('请填写完整')
            }
          }else{
            alert('请编辑内容，否则取消')
          }
        }else if(this.handleFlag == 2){//增加状态
          if(localStorage.getItem('newdata')){
            let tmp = JSON.parse(localStorage.getItem('newdata'));
            this.myData.columns.forEach(key=>{
              if( key.field != 'isselect' && !tmp[key.field]){
                flag = false;
              }
            })
            if(flag == true){
              nowData.data.push(tmp);
              localStorage.removeItem('newdata');
              this.$emit('updateData',nowData);
              this.ishandle = false;
              this.ishandling = false;
              this.handleFlag = 0;
              this._refreshData();
            }else{
              alert('请填写完整')
            }
          }else{
            alert('请填写完整')
          }
        }
      },
      endEditing(){
        console.log('1111');
        console.log(this.tmpData);
          this.ishandle = false;
          this.ishandling = false;
          this.handleFlag = 0;
          localStorage.removeItem('newdata');
          localStorage.removeItem('editData');

          this._refreshData();
      }
    }
}
</script>
<style lang="scss">
.myTableChart{
  width: 100%;
  height: 100%;
  position:relative;
  // display: flex;
  // justify-content: space-between;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  .my-table{
    width: 100%;
    .table-top{
      width: 100%;
      min-height:0.4rem;
      display: flex;
      justify-content:space-between;
      padding-top: 0.1rem;
      margin-bottom: 0.1rem;
      line-height: 0.4rem;
      .top-left{
         height:0.4rem;
         font-size: 0.16rem;
         color:#333333;
         .left-top{
           width: 1.4rem;
           border: 1px solid #e5e5e5;
           padding-left: 0.1rem;
           display: flex;
           h3{
             font-size: 0.16rem;
             color:#333333;
             margin-right: 0.2rem;
           }
           .up{
             display: inline-block;
             background: url('../assets/upselect.png') no-repeat center;
             background-size: 0.18rem 0.12rem;
             width: 0.18rem;
             height: 0.12rem;
             margin-top: 0.15rem;
           }
           .down{
             display: inline-block;
             background: url('../assets/downselect.png') no-repeat center;
             background-size: 0.18rem 0.12rem;
             width: 0.18rem;
             height: 0.12rem;
             margin-top: 0.15rem;
           }
         }
         .left-bottom{
           width: 1.4rem;
           background: #fff;
           border-left: 0.01rem solid #e5e5e5;
           border-right: 0.01rem solid #e5e5e5;
           z-index: 999;
           position: absolute;
           li{
                text-align: left;
                // width: 1.4rem;
                height: 0.38rem;
                font-size: 0.16rem;
                line-height: 0.38rem;
                border-bottom: 0.01rem solid #ddd;
                list-style: none;
                padding-left: 0.1rem;
                color: #666;
                &.selected{
                    color: rgb(134, 122, 228);
                }
                span{
                  background: url('../assets/yes.png') no-repeat center;
                  background-size: 0.16rem 0.14rem;
                  width: 0.16rem;
                  height: 0.14rem;
                  display: inline-block;
                  float: right;
                  margin-right: 0.18rem;
                  margin-top: 0.1rem;
                }
            }
         }
      }
      .top-right{
            height: 0.4rem;
            display: flex;
            min-width: 5.5rem;
            .right-find{
              height: 0.4rem;
              display: flex;
              flex: 1;
              margin-right: 0.2rem;
              margin-left: 0.1rem;
              span{
                display: inline-block;
                background: url('../assets/search.png') no-repeat center;
                background-size: 0.18rem 0.18rem;
                width: 0.18rem;
                height: 0.18rem;
                margin-top: 0.1rem;
                margin-right: 0.1rem;
              }
              input{
                width: 2.6rem;
                height: 0.4rem;
                border: 0.01rem solid #e5e5e5;
                padding-left: 0.1rem;
                -webkit-user-select:auto;
                &:focus{
                  border: 0.01rem solid rgb(134, 122, 228);
                  outline: none;
                }
              }
            }
            .right-order{
              width: 0.8rem;
              height: 0.4rem;
              border: 0.01rem solid #e5e5e5;
              font-size: 0.16rem;
              float: right;
              color:	#4D0000;
              margin-right: 0.2rem;
              line-height: 0.4rem;
              text-align: center;
              background: #E6E6F2;
            }
            .right-botton{
              width: 0.8rem;
              height: 0.4rem;
              border: 0.01rem solid #e5e5e5;
              font-size: 0.16rem;
              float: right;
              color:	#4D0000;
              margin-right: 0.2rem;
              line-height: 0.4rem;
              text-align: center;
              background: #E6E6F2;
            }
      }
    }
    .table-bottom{
      width: 100%;
      min-height: 0.2rem;
      // background: red;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
      .bottom-left{
        float: left;
        display: flex;
        height: 0.3rem;
        .left-botton{
          width: 0.8rem;
          height: 0.35rem;
          border: 0.01rem solid #e5e5e5;
          font-size: 0.15rem;
          float: right;
          color:	#fff;
          margin-left: 0.2rem;
          line-height: 0.3rem;
          text-align: center;
        }
      }
      .bottom-right{
        width: auto;
        height: 0.3rem;
        display: flex;
        float: right;
        .botton-before{
          width: 0.8rem;
          height: 0.35rem;
          border: 0.01rem solid #e5e5e5;
          font-size: 0.14rem;
          color:#fff;
          margin-right: 0.2rem;
          line-height: 0.3rem;
          text-align: center;
          background: rgb(134, 122, 228);
        }
        .botton-between{
          height: 0.35rem;
          font-size: 0.16rem;
          color:#333;
          margin-right: 0.2rem;
          line-height: 0.35rem;
          span{
            display: inline-flex;
            margin: 0 0.05rem;

          }
        }
        .botton-next{
          width: 0.8rem;
          height: 0.35rem;
          border: 0.01rem solid #e5e5e5;
          font-size: 0.14rem;
          color:#fff;
          margin-right: 0.2rem;
          line-height: 0.3rem;
          text-align: center;
          background: rgb(134, 122, 228);
        }
      }
    }
  }
}
.slide-enter-active {
     transition: all .2s ease;
   }
   .slide-leave-active {
     transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
   }
   .slide-enter, .slide-leave-to
   /* .slide-fade-leave-active for <2.1.8 */ {
     transform: translateY(-0.5rem);
     opacity: 0;
   }
</style>
