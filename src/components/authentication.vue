<template>
  <div>
    <div class="authentication authentication-warning" v-if="status == '1' || status == '0'">
      <i class="el-icon-warning"></i>
      <span>{{ authenticationContent }}</span>
    </div>
    <div class="authentication authentication-question" v-if="status == '2'">
      <i class="el-icon-question"></i>
      <span>{{ authenticationContent }}</span>
    </div>
    <div class="authentication authentication-success" v-if="status == '3'">
      <i class="el-icon-success"></i>
      <span>{{ authenticationContent }}</span>
    </div>
    <div class="authentication authentication-error" v-if="status == '4'">
      <i class="el-icon-error"></i>
      <span>{{ authenticationContent }} {{ remark }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    status: '',
    authenticationContent: '',
    remark: ''
  }
}
</script>

<style>
.authentication{
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.authentication>i{
  margin-right: 10px;
}
.authentication-success{
  color:#55bf20;
  background-color: #dffbcf;
  border: 1px solid #e1f3e8;
}
.authentication-warning{
  color: #f99e17;
  background-color: #ffecd2;
  border: 1px solid #faecd8;
}
.authentication-error{
  color: #f56c6c;
  background-color: #ffe3e3;
  border: 1px solid #fef0f0;
}
.authentication-question{
  color: #409EFF;
  background-color: #ddedff;
  border: 1px solid #ddedff;
}
</style>
