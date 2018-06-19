<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/vipManage.png" alt="">
        <span>会员管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">客户列表</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>关键字: </span>
        <el-input placeholder="手机号码或名称" v-model="params.phone"></el-input>
      </div>
      <div class="filter-item">
        <span>会员等级: </span>
        <el-select @change="getList" v-model="params.level" placeholder="请选择">
          <el-option label="全部" value="all"></el-option>
          <el-option v-for="(item,index) in levelList" :label="item.name" :value="item.level" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <span>最后交易时间: </span>
         <el-date-picker @change="selectDate" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>交易额: </span>
        <el-input style=";margin-right:5px" placeholder="不限" v-model="params.totalConsumeStart"></el-input>至
        <el-input placeholder="不限" v-model="params.totalConsumeEnd"></el-input>
      </div>
      <div class="filter-item">
        <span>交易笔数: </span>
        <el-input style="margin-right:5px" placeholder="不限" v-model="params.totalCountStart"></el-input>至
        <el-input placeholder="不限" v-model="params.totalCountEnd"></el-input>
      </div>
      <div class="filter-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column label="会员信息" width="200" align="center">
          <template slot-scope="scope">
            <div class="table-td">
              <img :src="scope.row.backImg">
              <div>
                <p><i class="fa fa-user-o"></i><span>{{ scope.row.memberDocumentName }}</span></p>
                <p><i class="fa fa-mobile" style="font-size:20px"></i><span>{{ scope.row.phone }}</span></p>
                <p><i class="fa fa-credit-card"></i><span>{{ scope.row.cardNo }}</span></p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.cardName + '(VIP' + scope.row.level + ') ' }}</p>
            <p>{{ '折扣: ' + scope.row.discount + '折' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="余额" align="center">
          <template slot-scope="scope">
            <span>{{ (scope.row.account * 0.01).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="integral" label="积分" align="center"></el-table-column>
        <el-table-column label="交易总额" align="center">
          <template slot-scope="scope">
            <span>{{ (scope.row.totalConsume * 0.01).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="交易笔数" align="center"></el-table-column>
        <el-table-column prop="consumeTime" label="最后交易时间" align="center" width="180"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="$router.push('/vip/list/detail/' + scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :total="Number(pageTotal)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>

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
      levelList: [],
      tableData: [],
      tableHeight: window.innerHeight - 340,
      tableLoading: false,
      dateRange: [],
      pageTotal: '',
      pageCount: '',
      params:{
        phone: '',
        level: 'all',
        consumeTimeStart: '',
        consumeTimeEnd: '',
        totalConsumeStart: '',
        totalConsumeEnd: '',
        totalCountStart: '',
        totalCountEnd: '',
        pageNum: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    selectDate(){
      if(this.dateRange && this.dateRange.length > 0){
        this.params.consumeTimeStart = this.dateRange[0];
        this.params.consumeTimeEnd = this.dateRange[1];
      }else{
        this.params.consumeTimeStart = "";
        this.params.consumeTimeEnd = "";
      }
      this.getList();
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('web/member/getMemberCustomerList',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200)
        this.levelList = res.data.data.MemberCardDefinedList;
        this.pageCount = res.data.data.page;
        this.pageTotal = res.data.data.count;
        this.tableData = res.data.data.memberCustomerList;
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
.table-td{
  display: flex;
  align-items: center;
  >img{
    width: 50px;
    height: 50px;
  }
  >div{
    padding-left: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex: 1;
    width: 0;
    p{
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: left;
      >span{
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
}
</style>
