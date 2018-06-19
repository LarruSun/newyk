<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/marketing/center/coupon')">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">积分兑券</span>
      </div>
    </div>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>优惠券兑换条件</span>
    </p>
    <div class="form-wrap">
      <el-form :model="formData" label-position="left" label-width="150px">
        <el-form-item label="兑换所需积分：">
          <el-input v-model="formData.integer" type="number" placeholder="请输入积分数"></el-input>
          <span class="form-unit">分</span>
          <p class="form-tips">兑换优惠券所需的积分数量</p>
        </el-form-item>
        <el-form-item label="兑换时间：">
          <p><el-radio v-model="formData.exchangeLimit" label="1">无限期</el-radio></p>
          <p>
            <el-radio v-model="formData.exchangeLimit" label="2" style="margin-right:40px">限期</el-radio>
            <el-date-picker v-if="formData.exchangeLimit == '2'" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </p>
          <p class="form-tips">在兑换时间内，红包才能正常兑换，否则红包不可兑换</p>
        </el-form-item>
        <el-form-item style="padding-bottom:20px">
          <el-button type="primary" @click="save">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    if(this.$route.query.id){
      this.couponId = this.$route.query.id;
    }
  },
  data(){
    return{
      couponId: '',
      formData: {
        exchangeLimit: '1',
      },
      dateRange: [],
    }
  },
  methods: {
    save(){
      let formData = Object.assign({},this.formData);
      if(!formData.integer){
        this.yfAlert('请输入兑换所需积分','warning');
        return
      }
      if(formData.exchangeLimit == '1'){
        delete formData.startDate;
        delete formData.endDate;
      }else if(formData.exchangeLimit == '2'){
        if(!this.dateRange || this.dateRange.length <= 0){
          this.yfAlert('请选择时间','warning');
          return
        }else {
          formData.startDate = this.dateRange[0];
          formData.endDate = this.dateRange[1];
        }
      }
      this.$http.post('web/newcouponWeb/putCouponByIntegral',formData).then(res => {
        this.yfAlert(res.data.message,'success');
        setTimeout(()=>{
          this.$router.go(-1);
        },500)
      },(err) => {
        this.yfAlert(err.data.message,'error');
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
.form-wrap{
  padding: 0 20px;
  .el-input{
    width: 200px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .form-unit{
    font-size: 16px;
    margin-left: 10px;
    color: #606266;
  }
  .form-tips{
    line-height: initial;
    font-size: 13px;
    color: #909399;
    margin-top: 5px;
  }
}
</style>
