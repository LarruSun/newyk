<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/vipManage.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.go(-1)">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">【会员送券】券列表</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>有效期：</span>
        <el-date-picker @change="selectDate" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
      <div class="filter-item">
        <span>券类型: </span>
        <el-select v-model="params.couponsType" placeholder="请选择" @change="getList">
          <el-option v-for="(item,index) in couponTypeList" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <span>券状态: </span>
        <el-select v-model="params.statu" placeholder="请选择" @change="getList">
          <el-option v-for="(item,index) in couponStatusList" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <span>关键字: </span>
        <el-input v-model="params.couponsName" placeholder="优惠券名称"></el-input>
      </div>
      <div class="filter-item">
        <el-button @click="getList" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column prop="couponsName" label="名称" align="center"></el-table-column>
        <el-table-column label="券类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponsType | getCouponType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="面额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.couponsType == '1'">¥{{ scope.row.vouchers | formartAmount }}</span>
            <span v-if="scope.row.couponsType == '2'">{{ scope.row.discount + '折' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" width="230">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate + ' 至 ' + scope.row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放数/领取数/使用数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.countNum + '/' + scope.row.receiveNum + '/' + scope.row.useNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="券状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.statu | getCouponStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" @click="showModal(scope.row.id)">详情</el-button>
            <el-button size="small" @click="$router.push('/marketing/center/coupon/putVipCoupon?id=' + scope.row.id)" type="primary">再次派送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :total="Number(pageTotal)" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog title="优惠券详情" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="true">
      <coupon-detail :couponData="couponDetail"></coupon-detail>
    </el-dialog>
  </div>
</template>

<script>
import couponDetail from "@/components/couponDetail"
import mixin from '@/utils/mixin'
import filters from '@/utils/filters'
export default {
  mixins: [mixin],
  filters: filters,
  components: {
    couponDetail
  },
  created(){
    this.getList();
  },
  data(){
    return{
      couponTypeList: filters.COUPONTYPE,
      putStatusList: filters.PUTSTATUS,
      couponStatusList: filters.COUPONSTATUS,
      tableData: [],
      tableHeight: window.innerHeight - 280,
      dialogVisible: false,
      dateRange: [],
      pageCount: '',
      pageTotal: '',
      params: {
        startDate: '',
        endDate: '',
        pageNum: 1,
        pageSize: 10,
        couponsType: 'all',
        statu: 'all',
        putMethod: 'HUIYUANSONGQUAN'
      },
      couponDetail: {},
    }
  },
  methods: {
    showModal(id){
      this.dialogVisible = true;
      this.$http.post('newcoupon/newcouponSev/get/getCouponById',{couponId: id}).then(res => {
        this.couponDetail = res.data.data;
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    selectDate(){
      if(this.dateRange && this.dateRange.length > 0){
        this.params.startDate = this.dateRange[0];
        this.params.endDate = this.dateRange[1];
      }else{
        this.params.startDate = "";
        this.params.endDate = "";
      }
      this.getList();
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('newcoupon/newcouponSev/get/getCouponPutList',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pages;
        this.pageTotal = res.data.data.total;
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
