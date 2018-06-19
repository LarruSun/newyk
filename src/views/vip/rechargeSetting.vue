<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/recharge.png" alt="">
        <span>储值管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">储值设置</span>
      </div>
    </div>
    <p class="sub-header">
      <span><i class="el-icon-info"></i>充值面额设置</span>
    </p>
    <p class="recharge-tips">最多只能设置6个充值面额</p>
    <ul class="recharge-list">
      <li v-for="(item,index) in list" :key="index" @click="showModal(item)">{{ item.rechargeDenomination }}元</li>
    </ul>
    <el-dialog title="储值设置" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <span style="display:inline-block;width:100px">面额:</span>
      <el-input v-model="formData.rechargeDenomination" placeholder="输入金额" type="number" style="width:150px;margin-bottom:10px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
    this.getList();
  },
  data(){
    return{
      list: [],
      dialogVisible: false,
      formData: {},
      defaultNum: '',
    }
  },
  methods: {
    getList(){
      this.$http.post('web/member/getMemberRechargeDenominationSettings').then(res => {
        this.list = res.data.data;
      })
    },
    showModal(data){
      this.dialogVisible = true;
      this.defaultNum = data.rechargeDenomination;
      this.$set(this.formData,'id',data.id);
      this.$set(this.formData,'rechargeDenomination',Number(data.rechargeDenomination));
    },
    save(){
      if(!this.formData.rechargeDenomination){
        this.yfAlert('请输入面值','warning');
        return
      }
      if(this.defaultNum == this.formData.rechargeDenomination){
        this.yfAlert('未做修改','warning');
        return
      }
      let formData = Object.assign({},this.formData);
      this.$http.post('web/member/editMemberRechargeDenominationSettings',formData).then(res => {
        this.dialogVisible = false;
        this.yfAlert(res.data.message,'success');
        this.getList();
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
.recharge-tips{
  font-size: 15px;
  color: $el-font1;
  padding: 0 20px 20px 40px;
}
.recharge-list{
  display: flex;
  padding: 0 20px 0 40px;
  li{
    width: 120px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    color: $el-font2;
    border: $el-border2;
    border-radius: 4px;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover{
      background-color: #ddedff;
      border-color: #ddedff;
    }
  }
}
</style>
