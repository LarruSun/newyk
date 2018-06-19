<template>
  <div class="contain">
    <div class="balance-top">
      <div class="balance-top-item">
        <span>账户余额：{{ data.bamount | formartAmount }}元（冻结：{{ data.frozenAmount | formartAmount }}元）</span>
        <div>
          <el-button type="primary" disabled>充值</el-button>
          <el-button type="primary" disabled>提现</el-button>
        </div>
      </div>
      <div class="balance-top-item">
        <span>账户短信剩余：{{ data.messageSurplus }}条</span>
        <div>
          <el-button type="primary" @click="$router.push('/setting/messagePay')">充值</el-button>
        </div>
      </div>
    </div>
    <div class="deal">
      <p>交易记录</p>
      <div class="select-btn">
        <span>最近交易记录:</span>
        <el-button size="small" type="primary" :plain="params.tradeTypeCode != 'DEPOSIT'" @click="getList('DEPOSIT')">充值</el-button>
        <el-button size="small" type="primary" :plain="params.tradeTypeCode != 'WITHDRAW'" @click="getList('WITHDRAW')">提现</el-button>
        <el-button size="small" type="primary" :plain="params.tradeTypeCode != 'DEDUCT'" @click="getList('DEDUCT')">开支</el-button>
        <el-button size="small" type="primary" :plain="params.tradeTypeCode != 'FROZEN'" @click="getList('FROZEN')">冻结</el-button>
        <el-button size="small" type="primary" :plain="params.tradeTypeCode != 'all'" @click="getList('all')">全部</el-button>
        <!-- <span>*冻结资金：{{ data.frozenAmount | formartAmount }}元</span> -->
      </div>
      <div v-loading="tableLoading" element-loading-text="拼命加载中">
        <el-table :data="tableData" border :height="tableHeight" class="table">
          <el-table-column label="账户变动时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTime | formartDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="明细" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeType | getTradeType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.amount | formartAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTypeCode | getTradeType }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="140">
            <template slot-scope="scope">
              <el-button @click="scope.row.id" size="mini">详情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination @current-change="loadMore" :total="Number(pageTotal)" :page-count="Number(pageCount)" :current-page.sync="params.page" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
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
    this.$http.post('web/index/getAccountByUserId').then(res => {
      this.data = res.data.data;
    })
  },
  data(){
    return{
      tableHeight: window.innerHeight - 340,
      tableData: [],
      tableLoading: false,
      pageCount: '',
      pageTotal: '',
      params: {
        page: 1,
        pageSize: 15,
      },
      data:{}
    }
  },
  methods: {
    getList(val){
      if(val){
        this.params.tradeTypeCode = val;
      }
      this.tableLoading = true;
      this.$http.post('web/index/getAccountlistBalancForUserByUserId',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.balanceList.pages;
        this.pageTotal = res.data.data.balanceList.total;
        this.tableData = res.data.data.balanceList.records;
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.balance-top{
  display: flex;
  justify-content: space-between;
  .balance-top-item{
    width: 49%;
    border: $el-border2;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
  }
}
.deal{
  background-color: #fff;
  padding: 20px 20px 0;
  box-sizing: border-box;
  margin-top: 10px;
  border-radius: 4px;
  border: $el-border2;
  >p{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .select-btn{
    color: #606266;
    font-size: 14px;
    button{
      margin-left: 10px;
    }
    >span:last-child{
      color: #409EFF;
      text-decoration: underline;
      margin-left: 20px
    }
  }
}
.table{
  margin-top: 20px;
}
</style>
