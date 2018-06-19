<template>
  <div>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>优惠券基本信息</span>
    </p>
    <ul class="info-item-coupon">
      <li>
        <span>优惠券名称：</span>
        <span>{{ couponData.couponsName }}</span>
      </li>
      <li>
        <span>优惠券类型：</span>
        <span>{{ couponData.couponsType | getCouponType }}</span>
      </li>
      <li>
        <span>面额：</span>
         <span v-if="couponData.couponsType == '1'">¥{{ couponData.vouchers | formartAmount }}</span>
          <span v-if="couponData.couponsType == '2'">{{ couponData.discount + '折' }}</span>
      </li>
      <li>
        <span>优惠券发放数量：</span>
        <span>{{ couponData.countNum }}</span>
      </li>
      <li>
        <span>每人限领数量：</span>
        <span>{{ couponData.receiveLimit }}</span>
      </li>
      <li>
        <span>使用有效期：</span>
        <span>{{ couponData.startDate + ' 至 ' + couponData.endDate }}</span>
      </li>
    </ul>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>优惠券应用范围</span>
    </p>
    <ul class="info-item-coupon">
      <li>
        <span>适用门店：</span>
        <span>{{ couponData.adaptShop | getStoreRange }}</span>
      </li>
      <li>
        <span>菜品范围：</span>
        <span>{{ couponData.foodRange | getFoodRange }}</span>
      </li>
    </ul>
    <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>优惠券使用条件</span>
    </p>
    <ul class="info-item-coupon">
      <li>
        <span>使用限制：</span>
        <span>{{ couponData.useLimit | getUseLimit }}</span>
      </li>
      <li>
        <span>最小订单金额限制：</span>
        <span>¥{{ couponData.lowestConsume | formartAmount }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import filters from '@/utils/filters'
export default {
  filters: filters,
  props:{
    couponData: {}
  }
}
</script>

<style lang="scss">
.coupon-header{
  margin: 20px 0;
}
.info-item-coupon{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
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
