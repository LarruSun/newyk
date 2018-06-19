<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.go(-1)">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">{{ commonTitle }}</span>
      </div>
    </div>
    <div class="form-wrap">
      <p class="sub-header">
        <span><i class="el-icon-info"></i>优惠券基本信息</span>
      </p>
      <el-form :model="formData" label-position="left" :label-width="formLabelWidth">
        <el-form-item :model="formData" label="优惠券名称: ">
          <el-input v-model="formData.couponsName" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="券类型: " >
          <el-radio v-model="formData.couponsType" :label="index" v-for="(item,index) in couponsTypeList" :key="index">{{ item }}</el-radio>
        </el-form-item>
        <el-form-item label="面额: " v-if="formData.couponsType == '1'">
          <el-input v-model="formData.vouchers" type="number" style="width:150px"></el-input>
          <span class="form-unit">元</span>
        </el-form-item>
        <el-form-item label="折扣: " v-if="formData.couponsType == '2'">
          <el-input v-model="formData.discount" type="number" style="width:150px"></el-input>
          <span class="form-unit">折</span>
        </el-form-item>
        <el-form-item label="优惠券发放数量: " >
          <el-input v-model="formData.countNum" type="number" style="width:150px"></el-input>
          <span class="form-unit">张</span>
        </el-form-item>
        <el-form-item label="每人限领数量: " >
          <el-input v-model="formData.receiveLimit" type="number" style="width:150px"></el-input>
          <span class="form-unit">张</span>
        </el-form-item>
        <el-form-item label="使用有效期：" >
          <el-date-picker @change="selectDate" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <p class="sub-header">
          <span><i class="el-icon-info"></i>优惠券应用范围</span>
        </p>
        <el-form-item label="适用门店: " >
          <el-radio v-model="formData.adaptShop" label="0">全部门店</el-radio>
        </el-form-item>
        <el-form-item label="菜品范围: " >
          <el-radio v-model="formData.foodRange" label="0">全部菜品</el-radio>
        </el-form-item>
        <p class="sub-header">
          <span><i class="el-icon-info"></i>优惠券使用条件</span>
        </p>
        <el-form-item label="使用限制: " >
          <el-radio v-model="formData.useLimit" label="1">不可与其他优惠同享</el-radio>
        </el-form-item>
        <el-form-item label="最小订单金额限制：" >
          <el-radio v-model="isMiniMum" :label="true">不限制</el-radio>
          <el-radio v-model="isMiniMum" :label="false">
            购物满<el-input v-model="formData.lowestConsume" :disabled="isMiniMum" type="number" size="mini" style="margin-left:5px;width: 100px"></el-input>
            <span>元可用</span>
          </el-radio>
        </el-form-item>
        <el-form-item  style="padding:20px 0">
          <el-button type="primary" @click="save" :loading="saveLoading">确认发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import filters from '@/utils/filters'
export default {
  filters: filters,
  created(){
    this.$delete(this.couponsTypeList,'all');
    if(this.$route.query.id){
      this.id = this.$route.query.id;
      this.commonTitle = '编辑优惠券';
      this.$http.post('newcoupon/newcouponSev/get/getCouponById',{
        couponId: this.id,
      }).then(res => {
        let data = res.data.data;
        this.$set(this.formData,'couponsName',data.couponsName);
        this.$set(this.formData,'couponsType',data.couponsType);
        if(data.couponsType == '1'){
          this.$set(this.formData,'vouchers',data.vouchers);
        }else if(data.couponsType == '2'){
          this.$set(this.formData,'discount',data.discount);
        }
        this.$set(this.formData,'countNum',data.countNum);
        this.$set(this.formData,'receiveLimit',data.receiveLimit);
        this.$set(this.formData,'startDate',data.startDate);
        this.$set(this.formData,'endDate',data.endDate);
        this.dateRange.push(data.startDate);
        this.dateRange.push(data.endDate);
        if(data.lowestConsume == 0){
          this.isMiniMum = true;
        }else{
          this.isMiniMum = false;
        }
        this.$set(this.formData,'lowestConsume',data.lowestConsume);
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    }else {
      this.commonTitle = '添加优惠券';
    }
  },
  data(){
    return{
      id: '',
      commonTitle: '添加优惠券',
      formData: {
        couponsType: '1',
        startDate: '',
        endDate: '',
        adaptShop: '0',
        foodRange: '0',
        useLimit: '1'
      },
      formLabelWidth: '150px',
      couponsTypeList: filters.COUPONTYPE,
      useLimitList: filters.USELIMIT,
      dateRange: [],
      isMiniMum: true,
      saveLoading: false,
    }
  },
  methods: {
    save(){
      let formData = Object.assign({},this.formData);
      if(!formData.couponsName){
        this.yfAlert('请输入优惠券名称','warning');
        return
      }
      if(formData.couponsType == '1'){
        if(!formData.vouchers){
          this.yfAlert('请输入面额','warning');
          return
        }else {
          formData.vouchers = formData.vouchers * 100;
        }
      }else {
        delete formData.vouchers
      }
      if(formData.couponsType == '2'){
        if(!formData.discount){
          this.yfAlert('请输入折扣','warning');
          return
        }else if(formData.discount < 0 || formData.discount > 10){
          this.yfAlert('请输入正确的折扣','warning');
          return
        }
      }else {
        delete formData.discount
      }
      if(!formData.countNum){
        this.yfAlert('请输入优惠券发放数量','warning');
        return
      }
      if(!formData.receiveLimit){
        this.yfAlert('请输入优惠券限领数量','warning');
        return
      }else if(formData.receiveLimit <= 0){
        this.yfAlert('优惠券限领数量不小于1','warning');
        return
      }
      if(!formData.startDate || !formData.endDate){
        this.yfAlert('请输入优惠券有效期','warning');
        return
      }
      if(!this.isMiniMum){
        if(!formData.lowestConsume){
          this.yfAlert('请输入优惠券限制金额','warning');
          return
        }else {
          formData.lowestConsume = formData.lowestConsume * 100;
        }
      }else {
        formData.lowestConsume = 0;
      }
      if(this.id){
        formData.id = this.id;
      }
      this.saveLoading = true;
      this.$http.post('newcoupon/newcouponSev/edit/saveCoupon',formData).then(res => {
        this.yfAlert(res.data.message,'success');
        setTimeout(() => {
          this.$router.go(-1);
        }, 500);
      },(err) => {
        this.yfAlert(err.data.message,'error');
      }).finally(()=>{
        this.saveLoading = false;
      })
    },
    selectDate(){
      if(this.dateRange && this.dateRange.length > 0){
        this.formData.startDate = this.dateRange[0];
        this.formData.endDate = this.dateRange[1];
      }else{
        this.$delete(this.formData,'startDate');
        this.$delete(this.formData,'endDate');
      }
    },
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
  .el-input{
    width: 300px;
  }
  .form-unit{
    font-size: 16px;
    margin-left: 10px;
    color: #606266;
  }
  .el-form-item{
    padding-left: 40px;
  }
}
</style>
