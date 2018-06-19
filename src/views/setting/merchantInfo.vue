<template>
  <div class="contain">
		<div class="common-title">
			<div>
				<img src="@/assets/images/message.png" alt="">
				<span>商家设置</span>
				<i class="el-icon-arrow-right"></i>
				<span class="active-title">商家信息</span>
			</div>
		</div>
		<p class="sub-header">
			<span><i class="el-icon-info"></i>基本信息</span>
		</p>
		<div class="merchant-info">
      <el-form label-position="left" label-width="150px">
        <el-form-item label="商家简称">
          <el-input v-model="nickName"></el-input>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button @click="save1" type="primary">保存</el-button>
        </el-form-item>
        <el-form-item label="商家logo:">
          <input-upload @weiUpload="uploadSuccess" :imgUrl="businessLogo" :inputWidth="150"></input-upload>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button @click="save2" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
		</div>
  </div>
</template>

<script>
import inputUpload from '@/components/inputUpload'
export default {
	components: {
    inputUpload,
  },
  created(){
    this.businessLogo = this.$store.getters.userInfo.businessLogo;
    this.nickName = this.$store.getters.userInfo.nickName;
  },
	data(){
		return{
      nickName: '',
      businessLogo: '',
      businessLogoFile: '',
		}
  },
  methods: {
    uploadSuccess(val,url){
      this.businessLogo = url;
      this.businessLogoFile = val;
    },
    save1(){
      if(!this.nickName){
        this.yfAlert('请输入商家简称','warning');
        return
      }
      this.$http.post('web/userData/updateNickName',{
        nickName: this.nickName
      }).then(res => {
        this.yfAlert('保存成功','success');
        this.getUserInfo();
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    save2(){
      if(this.businessLogo == this.$store.getters.userInfo.businessLogo){
        this.yfAlert('未做修改','warning');
        return
      }
      if(!this.businessLogoFile){
        this.yfAlert('请上传商家logo','warning');
        return
      }
      let formData = new FormData();
      formData.append('businessLogoFile',this.businessLogoFile,this.businessLogoFile.name)
      this.$http.post('web/userData/updateLogo',formData,{
        type: 'formData'
      }).then(res => {
        this.yfAlert('保存成功','success');
        this.getUserInfo();
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    getUserInfo(){
      this.$http.get('web/open/index/get/userInfo').then(res => {
        this.$store.commit('SET_USERINFO',res.data.data);
      });
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
.merchant-info{
  background-color: #fff;
  padding: 0 40px 20px;
  border-radius: 4px;
  .el-input{
    width:300px;
  }
	.btn-item{
		margin: 20px 0;
	}
}
</style>
