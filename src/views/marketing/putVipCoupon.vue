<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/marketing/center/coupon')">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">会员送券</span>
      </div>
    </div>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>按指定会员等级批量派发优惠券</span>
    </p>
    <div class="put-wrap">
      <div class="put-item">
        <span>会员等级: </span>
        <el-select v-model="lever">
          <el-option value="-1" label="全部"></el-option>
          <el-option v-for="(item,index) in levelList" :value="item.id" :label="item.name" :key="index"></el-option>
        </el-select>
        <el-button type="primary" class="put-btn" @click="putCoupon('level')">确认发放优惠券</el-button>
      </div>
    </div>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>按指定会员批量派发优惠券</span>
    </p>
    <div class="put-wrap">
      <div class="put-item">
        <span>卡号: </span>
        <el-input v-model="cardNo" style="width:200px"></el-input>
        <el-button type="primary" class="put-btn" @click="searchVip">搜索</el-button>
      </div>
      <div class="put-item">
        <el-transfer v-model="cardNoList" :data="vipList" :titles="['卡号列表','发放列表']"></el-transfer>
      </div>
      <div class="put-item" style="padding: 20px 280px">
        <el-button type="primary" :disabled="cardNoList.length <= 0" @click="putCoupon('cardNo')">确认派发优惠券</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  created(){
    this.getLevel();
    if(this.$route.query.id){
      this.couponId = this.$route.query.id;
    }
  },
  data(){
    return{
      couponId: '',
      vipList: [],
      levelList: [],
      lever: '',
      cardNo: '',
      cardNoList: []
    }
  },
  methods: {
    getLevel(){
      this.$http.post('web/newcouponWeb/getMemberCardLeverList').then(res => {
        this.levelList = res.data.data.list;
      })
    },
    putCoupon(mark){
      let formData = {}
      if(mark == 'level'){
        if(!this.lever){
          this.yfAlert('请选择会员等级','warning');
          return
        }
        formData.lever = this.lever;
      }else if(mark == 'cardNo'){
        formData.cardNOs = this.cardNoList.join(',');
      }
      this.$http.post('web/newcouponWeb/putCouponByMember',formData).then(res => {
        this.yfAlert('派发成功','success');
        this.cardNoList = [];
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    searchVip(){
      if(!this.cardNo){
        this.yfAlert('请输入卡号','warning');
        return
      }
      this.$http.post('web/newcouponWeb/getCardNoList',{
        cardNo: this.cardNo
      }).then(res => {
        let data = res.data.data;
        if(data && data.length > 0){
          this.vipList = [];
          data.forEach(item => {
            this.vipList.push({key: item.cardNO, label: item.cardNO});
          });
        }else {
          this.yfAlert(res.data.message,'warning');
        }
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
.put-wrap{
  padding: 0 20px;
  .put-item{
    margin-bottom: 20px;
    >span{
      display: inline-block;
      width: 120px;
    }
    .put-btn{
      margin-left: 20px;
      vertical-align: top;
    }
  }
}
.el-transfer-panel{
  width: 300px;
}
</style>
