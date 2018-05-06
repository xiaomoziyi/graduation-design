<template>
<div class="myTable">
  <table class="fixed-table">
    <thead>
      <tr>
        <template v-for="(item, index) in tableData.columns" v-if="index < fixedNum">
              <th v-if="index == 0"  @click="slectAll">
                <span class="circle">
                  <span :class="{'select':all_select,'no-select':!all_select}"></span>
                </span>
              </th>
              <th v-else>
                <span v-show="orderFlag">
                  <span class="up" @click="OrderData(0,item.field)"></span>
                  <span class="down" @click="OrderData(1,item.field)"></span>
                </span>
                {{item.title}}
              </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item,indexs) in tableData.data">
        <tr>
          <template v-for="(col,index) in tableData.columns" v-if="index < fixedNum">
              <td v-if="index == 0" @click="selectOne(indexs)">
                <span  class="circle">
                  <span :class="{'select':item[col.field],'no-select':!item[col.field]}"></span>
                </span>
              </td>
              <td v-else>
                  <span  v-if="handleFlag == 0">{{item[col.field]}}</span>
                  <template v-if="handleFlag == 1">
                    <input v-if="editing[indexs][col.field]" type="text" v-model="item[col.field]" @blur="saveEditing" @key.up="saveEditing"/>
                  </template>
              </td>
         </template>
      </tr>
      </template>
      <template v-if="handleFlag==2">
      <tr>
        <template v-for="(col,index) in tableData.columns" v-if="index < fixedNum">
          <td v-if="index == 0">
            <span  class="circle">
              <span class="no-select"></span>
            </span>
          </td>
            <td v-else>
                <input type="text" v-model="newdata[col.field]" @keyup.enter="saveAdding"/>
            </td>
       </template>
      </tr>
      </template>
    </tbody>
  </table>
  <div class="scoll-table">
    <table>
      <thead>
        <tr>
          <template v-for="(item, index) in tableData.columns" v-if="index >= fixedNum">
                <th>
                  <span v-show="orderFlag">
                    <span class="up" @click="OrderData(0,item.field)"></span>
                    <span class="down" @click="OrderData(1,item.field)"></span>
                  </span>
                  {{item.title}}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item,indexs) in tableData.data">
          <tr>
            <template v-for="(col,index) in tableData.columns" v-if="index >= fixedNum">
                <td>
                    <span>{{item[col.field]}}</span>
                </td>
           </template>
        </tr>
        </template>
        <template v-if="handleFlag==2">
        <tr>
          <template v-for="(col,index) in tableData.columns" v-if="index >= fixedNum">
              <td>
                  <input type="text" v-model="newdata[col.field]" @keyup.enter="saveEditing"/>
              </td>
         </template>
        </tr>
        </template>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  props: ['tableData', 'fixedNum', 'orderFlag', 'handleFlag'],
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      all_select: false,
      editing: null,
      value: null,
      newdata: {'isselect':false},
    }
  },
  mounted() {
    this._refreshData();
  },
  methods: {
    _refreshData() {
      this.all_select = false;
      let result = [];
      for (let i = 0; i < this.tableData.data.length; i++) {
        let tmp = [];
        for (let j = 0; j < this.tableData.columns.length; j++) {
          let key = this.tableData.columns[j].field;
          tmp[key] = false;
        }
        result.push(tmp);
      }
      this.editing = result;
    },
    slectAll() {
      this.all_select = !this.all_select;
      if (this.all_select) { //全选
        let tmp = [];
        this.tableData.data.forEach((value, m) => {
          value.isselect = true;
          tmp.push(m);
        })
        localStorage.removeItem('selectIndexData');
        localStorage.setItem('selectIndexData', JSON.stringify(tmp));
      } else { //取消全选
        this.tableData.data.forEach(value => {
          value.isselect = false;
        })
        localStorage.removeItem('selectIndexData');
      }
    },
    selectOne(index) {
      let flag = true; //true为全部选中
      this.tableData.data.forEach((value, i) => {
        if (i == index) {
          value.isselect = !value.isselect;
          if (value.isselect) { //选中
            let tmp = [];
            if (localStorage.getItem('selectIndexData')) {
              tmp = JSON.parse(localStorage.getItem('selectIndexData'));
              tmp.push(index);
            } else {
              tmp = [];
              tmp.push(index);
            }
            localStorage.removeItem('selectIndexData', tmp);
            localStorage.setItem('selectIndexData', JSON.stringify(tmp));
          } else {
            if (localStorage.getItem('selectIndexData')) {
              let tmp = JSON.parse(localStorage.getItem('selectIndexData'));
              let k = tmp;
              tmp.forEach((value, i) => {
                if (value == index) {
                  k.splice(i, 1);
                }
              })
              tmp = k;
              localStorage.removeItem('selectIndexData', tmp);
              if (tmp.length >= 1) {
                localStorage.setItem('selectIndexData', JSON.stringify(tmp));
              }
            }
          }
        }
        if (!value.isselect) { //有一个没选中
          flag = false;
        }
      })
      if (flag == true) {
        this.all_select = true;
      } else {
        this.all_select = false;
      }
    },
    saveEditing(){

    },
    saveAdding() {
      localStorage.removeItem('newdata');
      this.tableData.columns.forEach(value=>{
        if(value.field != 'isselect' && value.field.indexOf('score')>-1){
          let key = this.newdata[value.field];
          key = parseFloat(key);
          console.log(this.newdata);
          if(!isNaN(key)){
             this.newdata[value.field] = key;
          }
        }
      })
      localStorage.setItem('newdata',JSON.stringify(this.newdata));
    },
    OrderData(data, key) { //0为升序，1为降序
      this.$emit('ordertable', data, key);
    }
  }
}
</script>
<style lang="scss">
.myTable {
    height: 100%;
    position: relative;
    width: 100%;
    display: flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    .scoll-table {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        // min-width: 3rem;
    }
    .fixed-table {
        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.16);
    }
    table {
        // float: left;
        thead {
            tr {
                height: 0.4rem;
                th {
                    font-size: 0.18rem;
                    color: #999999;
                    min-width: 0.8rem;
                    padding: 0 0.1rem;
                    text-align: right;
                    white-space: nowrap;
                    background: #f8f8f8;
                    border: 1px solid #e5e5e5;
                    &:first-child {
                        text-align: center;
                    }
                    .circle {
                        display: inline-flex;
                        .select {
                            background: url('../assets/select.png') no-repeat center;
                            width: 0.17rem;
                            height: 0.17rem;
                            background-size: 0.17rem 0.17rem;
                            display: inline-block;
                            margin-top: 0.03rem;
                            margin-bottom: 0.03rem;
                        }
                        .no-select {
                            background: url('../assets/noselect.png') no-repeat center;
                            width: 0.17rem;
                            height: 0.17rem;
                            background-size: 0.17rem 0.17rem;
                            display: inline-block;
                            margin-top: 0.03rem;
                            margin-bottom: 0.03rem;
                        }
                    }
                    .up {
                        display: inline-block;
                        background: url('../assets/r_up.png') no-repeat center;
                        background-size: 0.18rem 0.2rem;
                        width: 0.18rem;
                        height: 0.2rem;
                    }
                    .down {
                        display: inline-block;
                        background: url('../assets/g_down.png') no-repeat center;
                        background-size: 0.18rem 0.2rem;
                        width: 0.18rem;
                        height: 0.2rem;
                        z-index: 100;
                    }
                }
            }
        }
        tbody {
            tr {
                height: 0.4rem;
                td {
                    font-size: 0.16rem;
                    color: #999999;
                    min-width: 0.8rem;
                    padding: 0 0.1rem;
                    text-align: right;
                    white-space: nowrap;
                    background: #fff;
                    border: 1px solid #e5e5e5;
                    input{
                      width: 1.2rem;
                    }
                    &:first-child {
                        text-align: center;
                    }
                    .circle {
                        display: inline-flex;
                        .select {
                            background: url('../assets/select.png') no-repeat center;
                            width: 0.17rem;
                            height: 0.17rem;
                            background-size: 0.17rem 0.17rem;
                            display: inline-block;
                            margin-top: 0.03rem;
                            margin-bottom: 0.03rem;
                        }
                        .no-select {
                            background: url('../assets/noselect.png') no-repeat center;
                            width: 0.17rem;
                            height: 0.17rem;
                            background-size: 0.17rem 0.17rem;
                            display: inline-block;
                            margin-top: 0.03rem;
                            margin-bottom: 0.03rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
