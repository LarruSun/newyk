<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/integral.png" alt="">
        <span>积分管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">积分设置</span>
      </div>
    </div>
    <div class="setting-wrap">
      <el-tabs v-model="value">
        <el-tab-pane label="全局配置" name="global">
          <div class="setting-item">
            <span>积分有效期: </span>
            <el-radio v-model="radio" :label="true">无限期</el-radio>
          </div>
          <div class="setting-item">
            <span>消费送积分: </span>
            <el-input type="number" style="width:100px" size="small" v-model="formData.amount"></el-input>
            <span>元 = 1积分</span>
          </div>
          <div class="setting-item tips">
            <p>(比如：设置1元=1积分，则会员消费101元，确认收货后则赠送101积分</p>
            <p>按消费金额中的整数部分进行赠送积分，不考虑四舍五入)</p>
          </div>
          <div class="setting-item">
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="配置" name="a">
          <p>配置</p>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    this.getDetail();
  },
  data(){
    return{
      value: 'global',
      radio: true,
      formData: {}
    }
  },
  methods: {
    getDetail(){
      this.$http.post('web/member/getMemberIntegralSettingByUserId').then(res => {
        let data = res.data.data.memberIntegralSetting;
        this.$set(this.formData,'amount',data.amount * 0.01);
        this.$set(this.formData,'id',data.id);
      })
    },
    save(){
      let formData = Object.assign({},this.formData);
      this.$http.post('web/member/upMemberIntegralSettingById',formData).then(res => {
        this.yfAlert(res.data.message,'success');
      },(err) => {
        this.yfAlert(err.data.message,'success');
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
.setting-wrap{
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
.setting-item{
  margin-top: 20px;
  color: #606266;
  &:first-child{
    margin-top: 10px;
  }
  >span{
    display: inline-block;
    width: 100px;
    margin-right: 20px;
  }
}
.tips{
  color: #909399;
}
</style>
