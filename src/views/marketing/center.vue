<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span class="active-title">营销中心</span>
      </div>
    </div>
    <p class="sub-header">
      <span>促销工具</span>
    </p>
    <ul class="marketing-list">
      <li @click="$router.push('/marketing/center/coupon')">
        <img src="@/assets/images/admin.png" alt="">
        <div>
          <p>优惠券</p>
          <p>向用户发送优惠券</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

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
.marketing-label{
  padding: 20px;
  font-size: 16px;
  font-weight: 600;
}
.marketing-list{
  display: flex;
  flex-wrap:wrap;
  padding: 0 20px 10px;
  >li{
    flex-shrink: 0;
    width: 250px;
    display: flex;
    padding: 15px 10px;
    border: $el-border2;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
    >img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    >div{
      flex: 1;
      line-height: 25px;
      p{
        width: 190px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:first-child{
          font-size: 16px;
          font-weight: 600;
        }
        &:last-child{
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }
}
</style>