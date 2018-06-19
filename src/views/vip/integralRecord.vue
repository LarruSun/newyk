<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/integral.png" alt="">
        <span>积分管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">积分记录</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>卡号: </span>
        <el-input placeholder="请输入卡号" v-model="params.cardNo"></el-input>
      </div>
      <div class="filter-item">
        <span>操作日期: </span>
         <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @change="selectDate"></el-date-picker>
      </div>
      <div class="filter-item">
        <span>操作人: </span>
        <el-select v-model="params.userId" placeholder="请选择" @change="getList">
          <el-option value="all" label="全部"></el-option>
          <el-option v-for="(item,index) in userList" :label="item.userName" :value="item.userId" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="userName" label="会员名称" align="center"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" align="center"></el-table-column>
        <el-table-column prop="integralChange" label="积分数" align="center"></el-table-column>
        <el-table-column prop="total" label="剩余积分数" align="center"></el-table-column>
        <el-table-column prop="ruleName" label="操作说明" align="center"></el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <span>{{ filterUser(scope.row.userId) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" :total="Number(pageTotal)" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  created(){
    this.getList();
  },
  data(){
    return{
      tableData: [],
      userList: [],
      tableHeight: window.innerHeight - 280,
      dateRange: [],
      pageCount: '',
      pageTotal: '',
      params:{
        pageNum: 1,
        pageSize: 20,
        userId: 'all'
      }
    }
  },
  methods: {
    selectDate(){
      if(this.dateRange && this.dateRange.length > 0){
        this.params.startTime = this.dateRange[0];
        this.params.endTime = this.dateRange[1];
      }else{
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.getList();
    },
    filterUser(val){
      for (let key in this.userList) {
        if(val == this.userList[key].userId){
          return this.userList[key].userName;
        }
      }
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('web/member/getIntegralRecordList',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200)
        this.pageCount = res.data.data.page;
        this.pageTotal = res.data.data.count;
        this.tableData = res.data.data.memberIntegralRecordList;
        this.userList = res.data.data.userIdUserNameList;
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.contain{
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(26,26,26,.1);
  box-sizing: border-box;
}
.filter-wrap{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  font-size: 14px;
  .filter-item{
    margin-right: 30px;
    margin-top: 20px;
    .el-input, .el-select{
      width: 150px;
    }
    >span:first-child{
      margin-right: 20px;
    }
  }
}
</style>
