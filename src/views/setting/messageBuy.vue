<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/message.png" alt="">
        <span>短信设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">购买记录</span>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column prop="buyDate" label="购买时间" align="center"></el-table-column>
        <el-table-column prop="buySum" label="数量" align="center"></el-table-column>
        <el-table-column prop="buyAmount" label="金额" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作员" align="center"></el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :current-page.sync="params.page" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <p class="sub-header order-header">
        <span><i class="el-icon-info"></i>商品信息确认</span>
      </p>
      <el-table :data="tableData" border show-summary sum-text="订单总额">
        <el-table-column prop="date" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="date" label="单价" align="center"></el-table-column>
        <el-table-column prop="date" label="数量" align="center"></el-table-column>
        <el-table-column prop="date" label="小计" align="center"></el-table-column>
      </el-table>
      <p class="sub-header pay-header">
        <span><i class="el-icon-info"></i>选择付款方式</span>
      </p>
      <ul class="pay-type">
        <li v-for="(item,index) in payTypeList" :key="index" @click="selectPayType(index)">
          <div class="icon-wrap" :class="payType == index ? 'bg-blue' : ''">
            <img :src="payType == index ? item.icon[0] : item.icon[1]" alt="">
          </div>
          <p :class="payType == index ? 'pay-active' : ''">{{ item.content }}</p>
        </li>
      </ul>
      <div class="pay-code" v-if="payType == 'balance'">
        <p class="sub-header pay-header">
          <span><i class="el-icon-info"></i>输入余额支付短信校验码</span>
        </p>
        <span>短信校验码：</span>
        <el-input size="small"></el-input>
        <el-button type="primary" size="small">获取短信验证码</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">立即支付</el-button>
      </span>
    </el-dialog>
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
      payStatusList: filters.PAYSTATUS,
      tableData: [],
      tableHeight: window.innerHeight - 220,
      pageCount: '',
      pageTotal: '',
      params: {
        page: 1,
        pageSize: 15,
        status: ''
      },
      dialogVisible: false,
      payType: 'balance',
      payTypeList: {
        balance:{
          icon: [
            require('@/assets/images/icon-money-white.png'),
            require('@/assets/images/icon-money-gray.png')
          ],
          content: '余额支付'
        },
        wechat:{
          icon: [
            require('@/assets/images/icon-wechat-white.png'),
            require('@/assets/images/icon-wechat-gray.png')
          ],
          content: '微信支付'
        },
        alipay:{
          icon: [
            require('@/assets/images/icon-alipay-white.png'),
            require('@/assets/images/icon-alipay-gray.png')
          ],
          content: '支付宝支付'
        }
      }
    }
  },
  methods: {
    getList(){
      this.tableLoading = true;
      this.$http.post('web/sms/get/rechargeRecord',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pageAll;
        this.pageTotal = res.data.data.countAll;
        this.tableData = res.data.data.list;
      })
    },
    selectPayType(val) {
      this.payType = val;
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
.order-header{
  margin: 20px 0 0 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.pay-header{
  margin: 20px 0;
}
.pay-type{
  display: flex;
  margin-bottom: 10px;
  li{
    text-align: center;
    margin-right: 20px;
    color: $el-font3;
    cursor: pointer;
    .icon-wrap{
      width: 140px;
      height: 70px;
      border: $el-border2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      >img{
        width: 40px;
      }
    }
  }
}
.bg-blue{
  background-color: $el-blue;
  border-color: $el-blue !important;
}
.pay-active{
  color: $el-font1;
}
.pay-code{
  margin-bottom: 20px;
  .el-input{
    width: 150px;
    margin: 0 20px;
  }
}
</style>