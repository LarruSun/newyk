<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span @click="$router.go(-1)">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">优惠券列表</span>
      </div>
    </div>
    <div>
      <el-radio-group v-model="tabPosition" style="padding: 20px;">
        <el-radio-button label="left">优惠券列表</el-radio-button>
        <el-radio-button label="center">券投放列表</el-radio-button>
        <el-radio-button label="right">领用记录</el-radio-button>
      </el-radio-group>
      <el-button type="primary" class="fr" style="margin-top:20px;margin-right:20px" v-if="tabPosition == 'left'" @click="$router.push('/marketing/center/coupon/add')">新建优惠券</el-button>
    </div>
    <div v-if="tabPosition == 'left'">
      <el-steps :active="3" :space="400" style="justify-content:center;margin: 10px 0" align-center>
        <el-step title="制券">
          <img src="@/assets/images/coupon-step-1.png" alt="" slot="icon">
        </el-step>
        <el-step title="投放">
          <img src="@/assets/images/coupon-step-2.png" alt="" slot="icon">
        </el-step>
        <el-step title="核销">
          <img src="@/assets/images/coupon-step-3.png" alt="" slot="icon">
        </el-step>
      </el-steps>
      <div class="filter-wrap">
        <div class="filter-item">
          <span>有效期: </span>
          <el-date-picker @change="selectDate" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </div>
        <div class="filter-item">
          <span>投放状态: </span>
          <el-select v-model="params.putStatu" placeholder="请选择" @change="getList">
            <el-option v-for="(item,index) in putStatusList" :label="item" :value="index" :key="index"></el-option>
          </el-select>
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
          <el-input placeholder="请输入优惠券名称" v-model="params.couponsName"></el-input>
        </div>
        <div class="filter-item">
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </div>
      </div>
      <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
        <el-table :data="tableData" border :height="tableHeight" class="table" key="table1">
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
          <el-table-column label="投放状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.putStatu | getPutStatus }}</span>
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
          <el-table-column label="操作" align="center" width="350">
            <template slot-scope="scope">
              <el-button size="mini" @click="showModal('detail','优惠券详情',scope.row.id)">详情</el-button>
              <el-button size="mini" v-if="scope.row.putStatu == '1'">已投放</el-button>
              <el-button size="mini" type="primary" v-if="scope.row.statu == '1'" @click="showModal('issue','选择投放方式',scope.row.id)">投放</el-button>
              <el-button size="mini" type="warning" v-if="scope.row.statu == '1' && scope.row.putStatu == '2'" @click="$router.push('/marketing/center/coupon/add?id=' + scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" @click="remove(scope.row.id,'2')">作废</el-button>
              <el-button size="mini" type="danger" v-if="scope.row.statu == '2'" @click="remove(scope.row.id,'3')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <div v-if="tabPosition == 'center'">
      <ul class="coupon-list">
        <li v-for="(item,index) in couponList" :key="index">
          <div class="coupon-item">
            <div>
              <img :src="item.icon" alt="">
              <p>
                <el-button size="mini" style="width: 70px" @click="$router.push(item.path)">查看</el-button>
              </p>
            </div>
            <div>
              <p>{{ item.title }}</p>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="tabPosition == 'right'">
      <div class="filter-wrap">
        <div class="filter-item margin0">
          <span>关键字: </span>
          <el-input v-model="params1.sequence" placeholder="优惠券序列码"></el-input>
        </div>
        <div class="filter-item margin0">
          <span>券类型: </span>
          <el-select @change="getList1" v-model="params1.couponsType" placeholder="请选择">
            <el-option v-for="(item,index) in couponTypeList" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </div>
        <div class="filter-item margin0">
          <span>领取渠道: </span>
          <el-select @change="getList1" v-model="params1.putMethod" placeholder="请选择">
            <el-option v-for="(item,index) in putMethodsList" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </div>
        <div class="filter-item margin0">
          <el-button type="primary" @click="getList1" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
        <el-table :data="tableData1" border :height="tableHeight1" class="table" key="table2">
          <el-table-column prop="sequence" label="优惠券序列码" align="center"></el-table-column>
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
          <el-table-column label="领取渠道" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.putMethod | getPutMethods}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cardNO" label="会员卡号" align="center"></el-table-column>
          <el-table-column prop="receiveDate" label="领取时间" align="center"></el-table-column>
          <el-table-column label="使用时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useDate || '未使用' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="loadMore1" :page-count="Number(pageCount1)" :current-page.sync="params1.pageNum" :page-size="params1.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="mark == 'detail'? '40%' : '50%'" :close-on-click-modal="true">
      <div v-if="mark == 'detail'">
        <coupon-detail :couponData="couponDetail"></coupon-detail>
      </div>
      <div v-if="mark == 'issue'">
        <ul class="coupon-list">
          <li v-for="(item,index) in couponList" :key="index" style="width:50%">
            <div class="coupon-item">
              <div>
                <img :src="item.icon" alt="">
                <p>
                  <el-button size="mini" @click="couponSubmit(item.putPath)">立即发布</el-button>
                </p>
              </div>
              <div>
                <p>{{ item.title }}</p>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
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
    this.getList1();
  },
  data(){
    return{
      tabPosition: 'left',
      tableData: [],
      tableData1: [],
      tableHeight: window.innerHeight - 340,
      tableHeight1: window.innerHeight - 340,
      couponList: [
        {
          icon: require('@/assets/images/coupon-icon-1.png'),
          title: '到店领券',
          path: '/marketing/center/coupon/storeCoupon',
          putPath: '',
          content: '用户主动领取，领取场景：通过微信小程序领券入口领取'
        },
        {
          icon: require('@/assets/images/coupon-icon-2.png'),
          title: '会员送券',
          path: '/marketing/center/coupon/vipCoupon',
          putPath: '/marketing/center/coupon/putVipCoupon',
          content: '卖家主动派发，系统提醒用户获得优惠券'
        },
        {
          icon: require('@/assets/images/coupon-icon-3.png'),
          title: '积分兑券',
          path: '/marketing/center/coupon/integralCoupon',
          putPath: '/marketing/center/coupon/putIntervalCoupon',
          content: '积分商城使用积分兑换优惠券'
        },
        {
          icon: require('@/assets/images/coupon-icon-4.png'),
          title: '海报领券',
          path: '/marketing/center/coupon/posterCoupon',
          putPath: '/marketing/center/coupon/putPosterCoupon',
          content: '用户主动领取，领取场景：用户通过微信宣传海报，主动领取优惠券'
        },
      ],
      dialogVisible: false,
      mark: '',
      dialogTitle: '',
      couponTypeList: filters.COUPONTYPE,
      putStatusList: filters.PUTSTATUS,
      couponStatusList: filters.COUPONSTATUS,
      putMethodsList: filters.PUTMETHODS,
      dateRange: [],
      pageCount: '',
      pageTotal: '',
      params: {
        startDate: '',
        endDate: '',
        pageNum: 1,
        pageSize: 10,
        couponsType: 'all',
        putStatu: 'all',
        statu: 'all',
      },
      pageCount1: '',
      pageTotal1: '',
      params1: {
        couponsType: 'all',
        putMethod: 'all',
        pageNum: 1,
        pageSize: 15,
        sequence: ''
      },
      couponDetail: {},
      couponId: '',
    }
  },
  methods: {
    couponSubmit(path){
      if(!path){
        this.$http.post('web/newcouponWeb/putCouponByInshop',{
          couponId: this.id
        }).then(res => {
          this.$alert('成功加入【到店领券】券列表！','提示',{type: 'success'});
          this.dialogVisible = false;
        },(err) => {
          this.yfAlert(err.data.message,'error');
        })
      }else {
        this.$router.push(path + '?id=' + this.couponId);
      }
    },
    showModal(mark, title, id){
      this.dialogVisible = true;
      this.mark = mark;
      this.dialogTitle = title;
      this.couponId = id;
      if(mark == 'detail'){
        this.$http.post('newcoupon/newcouponSev/get/getCouponById',{couponId: id}).then(res => {
          this.couponDetail = res.data.data;
        },(err) => {
          this.yfAlert(err.data.message,'error');
        })
      }
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('newcoupon/newcouponSev/get/getCouponListByCondition',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pages;
        this.pageTotal = res.data.data.total;
        this.tableData = res.data.data.list;
      })
    },
    getList1(){
      this.tableLoading = true;
      this.$http.post('newcoupon/newcouponSev/get/getCouponReceiveuseListByCondition',this.filterParams(this.params1)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount1 = res.data.data.pages;
        this.pageTotal1 = res.data.data.total;
        this.tableData1 = res.data.data.list;
      })
    },
    loadMore1(val){
      this.params1.pageNum = val;
      this.getList1();
    },
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
    remove(id,status){
      var content;
      if(status == '2'){
        content = '确认作废该优惠券吗？作废后优惠券将失效，并不可恢复？'
      }else if(status == '3'){
        content = '确定删除此优惠券数据吗？';
      }
      this.$confirm(content,'提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('newcoupon/newcouponSev/edit/updateCouponStatu',{
          couponId: id,
          statu: status
        }).then(res => {
          this.yfAlert(res.data.message,'success');
          this.getList();
        },(err) => {
          this.yfAlert(err.data.message,'error')
        })
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
.coupon-list{
  padding: 0 10px 20px;
  display: flex;
  flex-wrap: wrap;
  li{
    width: 25%;
    padding: 10px;
    box-sizing: border-box;
    .coupon-item{
      display: flex;
      padding: 10px;
      border: $el-border2;
      border-radius: 4px;
      >div:first-child{
        width: 100px;
        text-align: center;
        >img{
          width: 50px;
          margin-bottom: 5px;
        }
      }
      >div:last-child{
        flex: 1;
        color: $el-font2;
        padding-left: 10px;
        p{
          font-size: 13px;
          color: $el-font3;
          margin-top: 8px;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
          &:first-child{
            font-size: 16px;
            font-weight: 600;
            color: $el-font2;
          }
        }
      }
    }
  }
}
.margin0{
  margin-top: 0 !important;
}
.info-item{
  display: flex;
  flex-wrap: wrap;
  padding: 0 40px;
  &:last-child{
    padding-bottom: 20px;
  }
  >li{
    width: 100%;
    margin-bottom: 15px;
    >span:first-child{
      display: inline-block;
      width: 150px;
    }
  }
}
</style>
