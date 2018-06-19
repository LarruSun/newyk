<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/recharge.png" alt="">
        <span>储值管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">储值记录</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>操作日期: </span>
         <el-date-picker @change="selectDate" v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
      <div class="filter-item">
        <span>订单类型: </span>
        <el-select v-model="params.tradeTypeCode" placeholder="请选择" @change="getList">
          <el-option v-for="(item,index) in orderStatus" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <span>交易场景: </span>
        <el-select v-model="params.tradeType" placeholder="请选择" @change="getList">
          <el-option v-for="(item,index) in dealStatus" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <span>卡号: </span>
        <el-input placeholder="请输入卡号" v-model="params.userName"></el-input>
      </div>
      <div class="filter-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column label="操作时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeTime | formartDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNO" label="卡号" align="center"></el-table-column>
        <el-table-column prop="userName" label="会员名称" align="center"></el-table-column>
        <el-table-column label="交易金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount | formartAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.accountAmount | formartAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeTypeCode" label="订单类型" align="center"></el-table-column>
        <el-table-column prop="tradeType" label="交易场景" align="center"></el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
import filters from '@/utils/filters'
export default {
  mixins: [mixin],
  filters: filters,
  created(){
    this.getList();
  },
  data(){
    return{
      tableData: [],
      orderStatus: filters.ORDERSTATUS,
      dealStatus: filters.DEALSTATUS,
      tableHeight: window.innerHeight - 280,
      tableLoading: false,
      dateRange: [],
      pageCount: '',
      params:{
        pageNum: 1,
        pageSize: 20,
        tradeTypeCode: 'all',
        tradeType: 'all',
        startTime: '',
        endTime: '',
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
    getList(){
      this.tableLoading = true;
      this.$http.post('web/member/listBalancByCarNoList',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pageCount;
        this.tableData = res.data.data.list;
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
