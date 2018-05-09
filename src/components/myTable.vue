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
                  <span  v-if="handleFlag != 1">{{item[col.field]}}</span>
                  <template v-if="handleFlag == 1">
                    <template v-for="selectkey in selectIndexData">
                      <input v-if="selectkey == indexs" type="text" v-model="item[col.field]" @blur="saveEditing(indexs)" @key.up="saveEditing(indexs)"/>
                    </template>
      <span v-if="hasIndex(indexs)">{{item[col.field]}}</span>
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
                <input type="text" v-model="newdata[col.field]" @keyup.enter="saveAdding" @blur="saveAdding"/>
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
                  <span  v-if="handleFlag != 1">{{item[col.field]}}</span>
                  <template v-if="handleFlag == 1">
                    <template v-for="selectkey in selectIndexData">
                      <input v-if="selectkey == indexs" type="text" v-model="item[col.field]" @blur="saveEditing(indexs)" @key.up="saveEditing(indexs)"/>
                    </template>
        <span v-if="hasIndex(indexs)">{{item[col.field]}}</span>
        </template>
        </td>
        </template>
        </tr>
        </template>
        <template v-if="handleFlag==2">
        <tr>
          <template v-for="(col,index) in tableData.columns" v-if="index >= fixedNum">
              <td>
                  <input type="text" v-model="newdata[col.field]" @keyup.up="saveAdding" @blur="saveAdding"/>
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
      value: null,
      newdata: {
        'isselect': false
      },
      selectIndexData: [],
      newTableData:null,
    }
  },
  mounted() {
    this._refreshData();
  },
  computed:{
    getTableData:function(){
      return this.tableData;
    },
    tableVal:function(){
      this.newTableData = this.getTableData();
      console.log('2333SDA');
      return this.tableData;
    }
  },
  watch: {
    tableData: {
      handler(newValue, oldValue) {
        // if (oldValue.data.length != newValue.data.length) {
        //   for (let i = 0; i < newValue.data.length; i++) {　　　　　　　　　　　　
        //     this.selectIndexData = [];
        //     this.all_select = false;
        //     newValue.data[i].isselect = false;　　　　　　　　　　
        //   }
        // }　　　　　　
        // for (let i = 0; i < newValue.data.length; i++) {　　　　　　　　
        //   if (oldValue.data[i] != newValue.data[i]) {　　　　　　　　　
        //     this.selectIndexData = [];
        //     this.all_select = false;
        //     for(let k = 0 ; k < newValue.data.length; k++){
        //       newValue.data[k].isselect = false;　　
        //     }　
        //     break;　　
        //   }　　　　　　
        // }　　
        let tmp = [];
        this.all_select = true;
        for (let i = 0; i < newValue.data.length; i++) {　
          if(newValue.data[i].isselect == false){
            this.all_select = false;
          }else{
            tmp.push(i);
          }
        }　
        this.selectIndexData = tmp;
        this.$emit('callFunc',0,this.selectIndexData);
      },
      　deep: true
    }
  },
  methods: {
    _refreshData() {
      let tmp = [];
      let flag = false;
      this.tableData.data.forEach((value, index) => {
        if (value.isselect == true) {
          flag = true;
          tmp.push(index);
        }
      })
      if (flag == true) {
        // localStorage.removeItem('selectIndexData');
        // localStorage.setItem('selectIndexData', JSON.stringify(tmp));
        this.selectIndexData = tmp;
        this.$emit('callFunc', 0, this.selectIndexData);
      }
    },
    slectAll() {
      if (this.handleFlag > 0) {
        alert('正在进行其他操作，请稍后再试。');
        return;
      }
      this.all_select = !this.all_select;
      if (this.all_select) { //全选
        let tmp = [];
        this.tableData.data.forEach((value, m) => {
          value.isselect = true;
          tmp.push(m);
        })
        // localStorage.removeItem('selectIndexData');
        // localStorage.setItem('selectIndexData', JSON.stringify(tmp));
        this.selectIndexData = tmp;
        this.$emit('callFunc', 0, this.selectIndexData);
      } else { //取消全选
        this.tableData.data.forEach(value => {
          value.isselect = false;
        })
        this.selectIndexData = [];
        this.$emit('callFunc', 0, this.selectIndexData);
        // localStorage.removeItem('selectIndexData');
        this.selectIndexData = [];

      }
    },
    selectOne(index) {
      let flag = true; //true为全部选中
      if (this.handleFlag > 0) {
        alert('正在进行其他操作，请稍后再试。');
        return;
      }
      this.tableData.data.forEach((value, i) => {
        if (i == index) {
          value.isselect = !value.isselect;
          if (value.isselect) { //选中
            let tmp = [];
            if (this.selectIndexData.length > 0) {
              tmp = this.selectIndexData;
              tmp.push(index);
            } else {
              tmp = [];
              tmp.push(index);
            }
            // localStorage.removeItem('selectIndexData');
            // localStorage.setItem('selectIndexData', JSON.stringify(tmp));
            this.selectIndexData = tmp;
            this.$emit('callFunc', 0, this.selectIndexData);
          } else {
            if (this.selectIndexData.length > 0) {
              let tmp = this.selectIndexData;
              let k = tmp;
              tmp.forEach((value, i) => {
                if (value == index) {
                  k.splice(i, 1);
                }
              })
              tmp = k;
              // localStorage.removeItem('selectIndexData');
              this.selectIndexData = [];
              if (tmp.length >= 1) {
                // localStorage.setItem('selectIndexData', JSON.stringify(tmp));
                this.selectIndexData = tmp;
                this.$emit('callFunc', 0, this.selectIndexData);
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
    saveEditing(index) {
      // localStorage.removeItem('editData');
      let obj_list = this.tableData.data[index];
      let result = [];
      this.tableData.columns.forEach(value => {
        if (value.field != 'isselect' && value.field.indexOf('score') > -1) {
          let key = obj_list[value.field];
          key = parseFloat(key);
          obj_list[value.field] = null;
          if (!isNaN(key)) {
            obj_list[value.field] = key;
          }
        }
      })
      this.tableData.data.forEach((value, i) => {
        if (i == index) {
          result.push(obj_list);
        } else {
          result.push(value);
        }
      })
      // localStorage.setItem('editData',JSON.stringify(result));
      this.$emit('callFunc', 1, result);
    },
    saveAdding() {
      // localStorage.removeItem('newdata');
      this.tableData.columns.forEach(value => {
        if (value.field != 'isselect' && value.field.indexOf('score') > -1) {
          let key = this.newdata[value.field];
          key = parseFloat(key);
          this.newdata[value.field] = null;
          if (!isNaN(key)) {
            this.newdata[value.field] = key;
          }
        }
      })
      // localStorage.setItem('newdata',JSON.stringify(this.newdata));
      this.$emit('callFunc', 2, this.newdata);
    },
    OrderData(data, key) { //0为升序，1为降序
      this.$emit('ordertable', data, key);
    },
    hasIndex(index) {
      let flag = true;
      this.selectIndexData.forEach(value => {
        if (value == index) {
          flag = false;
        }
      })
      return flag;
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
                    input {
                        width: 1.2rem;
                        border: 0.01rem solid #e5e5e5;
                        -webkit-user-select:auto;
                        font-size: 0.16rem;
                        &:focus{
                            border: 0.01rem solid rgb(134, 122, 228);
                            outline: none;
                          }
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
