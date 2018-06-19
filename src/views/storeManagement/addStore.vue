<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/storeManagement.png" alt="">
        <span>门店</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/storeManagement/list')">门店列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">快速建店</span>
      </div>
    </div>
    <el-steps :space="200" :active="1" align-center finish-status="success" class="step">
      <el-step title="小程序授权"></el-step>
      <el-step title="小程序设置"></el-step>
      <el-step title="短信设置"></el-step>
      <el-step title="创建店铺"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.contain{
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(26,26,26,.1);
  box-sizing: border-box;
}
.step{
  justify-content: center;
  padding:20px 40px;
}
</style>
