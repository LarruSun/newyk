<template>
  <div class="contain">
    <authentication :status="userState" :authenticationContent="authenticationContent" :remark="remark"></authentication>
    <div class="merchant-info">
      <el-form :model="formData" label-position="left" label-width="150px">
        <el-form-item label="企业全称">
          <el-input v-model="formData.fullName" :disabled="!isSubmit"></el-input>
          <p class="form-content">*只支持中国大陆工商局或市场监督管理局登记的企业。请填写工商营业执照上的企业全称</p>
        </el-form-item>
        <el-form-item label="企业工商营业执照:">
          <input-upload :isUpload="isSubmit" @weiUpload="uploadSuccess1" :imgUrl="businessLicenseScan" :inputWidth="230"></input-upload>
        </el-form-item>
        <el-form-item label="工商营业执照号:">
          <el-input v-model="formData.businessLicenseNum" :disabled="!isSubmit"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证姓名:">
          <el-input v-model="formData.legalPersonName" :disabled="!isSubmit"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证证件:">
          <div style="display:flex">
            <input-upload :isUpload="isSubmit" @weiUpload="uploadSuccess2" :imgUrl="contactCardImgSrc" :inputWidth="230">
              <p slot="label" class="form-font">法人身份证（正面）</p>
            </input-upload>
            <input-upload :isUpload="isSubmit" @weiUpload="uploadSuccess3" :imgUrl="contactBackCardImgSrc" :inputWidth="230">
              <p slot="label" class="form-font">法人身份证（反面）</p>
            </input-upload>
          </div>
        </el-form-item>
        <el-form-item v-if="isSubmit">
          <el-button type="primary" @click="save" :loading="btnLoading">提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import filters from '@/utils/filters'
import inputUpload from '@/components/inputUpload'
import authentication from '@/components/authentication'
export default {
  filters: filters,
  components: {
    inputUpload,
    authentication
  },
  computed: {
    userState(){
      return this.$store.getters.userState
    },
    authenticationContent(){
      var content = ['您的店铺尚未认证','您的店铺尚未认证','您的店铺认证中','您的账户已认证','您的店铺认证被驳回'];
      return content[this.$store.getters.userState]
    },
    isSubmit(){
      if(this.$store.getters.userState == '3' || this.$store.getters.userState == '2'){
        return false
      }else {
        return true
      }
    },
  },
  created(){
    this.getMerchant();
  },
  data(){
    return{
      formData:{},
      businessLicenseScanFile: '',
      businessLicenseScan: '',
      contactCardImgSrcFile: '',
      contactCardImgSrc: '',
      contactBackCardImgSrcFile: '',
      contactBackCardImgSrc: '',
      btnLoading: false,
      remark: ''
    }
  },
  methods: {
    save() {
      let form = Object.assign({},this.formData);
      if(!form.fullName) {
        this.yfAlert('请输入企业全称','error');
        return
      }
      if(!this.businessLicenseScan) {
        this.yfAlert('请上传工商执照','error');
        return
      }
      if(!form.businessLicenseNum) {
        this.yfAlert('请输入工商营业执照号','error');
        return
      }
      if(!form.legalPersonName) {
        this.yfAlert('请输入法人身份证姓名','error');
        return
      }
      if(!this.contactCardImgSrc) {
        this.yfAlert('请上传身份证正面照','error');
        return
      }
      if(!this.contactBackCardImgSrc) {
        this.yfAlert('请上传身份证反面照','error');
        return
      }
      let formData = new FormData();
      for (let k in form) {
        formData.append(k, form[k]);
      }
      if(typeof this.businessLicenseScanFile == 'object'){
        formData.append('businessLicenseScanFile',this.businessLicenseScanFile,this.businessLicenseScanFile.name);
      }
      if(typeof this.contactCardImgSrcFile == 'object'){
        formData.append('contactCardImgSrcFile',this.contactCardImgSrcFile,this.contactCardImgSrcFile.name);
      }
      if(typeof this.contactBackCardImgSrcFile == 'object'){
        formData.append('contactBackCardImgSrcFile',this.contactBackCardImgSrcFile,this.contactBackCardImgSrcFile.name);
      }
      this.btnLoading = true;
      this.$http.post('web/userData/updateVerifyInfo',formData,{type:'formData'}).then(res => {
        this.btnLoading = false;
        this.yfAlert('提交成功','success');
        this.getMerchant();
      },(err) => {
        this.btnLoading = false;
        this.yfAlert(err.data.message,'error');
      })
    },
    uploadSuccess1(val,url) {
      this.businessLicenseScan = url;
      this.businessLicenseScanFile = val;
    },
    uploadSuccess2(val,url) {
      this.contactCardImgSrc = url;
      this.contactCardImgSrcFile = val;
    },
    uploadSuccess3(val,url) {
      this.contactBackCardImgSrc = url;
      this.contactBackCardImgSrcFile = val;
    },
    getMerchant(){
      this.$http.post('web/userData/getUserVerifyInfo').then(res => {
        let data = res.data.data;
        this.$set(this.formData,'fullName',data.fullName);
        this.$set(this.formData,'businessLicenseNum',data.businessLicenseNum);
        this.$set(this.formData,'legalPersonName',data.legalPersonName);
        this.businessLicenseScan = data.businessLicenseScan;
        this.contactCardImgSrc = data.contactCardImgSrc;
        this.contactBackCardImgSrc = data.contactBackCardImgSrc;
        this.$store.commit('SET_USERSTATE',data.userState);
        if(data.userState == '4'){
          this.remark = `(${res.data.data.remark})`;
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.contain{
  border-radius: 4px;
  box-sizing: border-box;
}
.merchant-info{
  background-color: #fff;
  padding: 20px 40px;
  border-radius: 4px;
  .el-input{
    width:300px;
  }
}
.title{
  padding-bottom: 15px;
  border-bottom: $el-border2;
}
.form-font{
  font-size: 14px;
  color: #606266;
  margin-bottom: -5px;
  text-align: center;
}
.form-content{
  line-height: initial;
  font-size: 13px;
  color: #666;
  margin-top: 10px;
}
.save-footer{
  margin-top: 20px;
}
</style>
