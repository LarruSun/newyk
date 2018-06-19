<template>
  <div>
    <p class="title">商家基本信息 / 商家认证</p>
    <el-form :model="formData" label-position="left">
      <el-form-item label="企业全称">
        <el-input v-model="formData.baseFullName"></el-input>
        <p class="form-content">*只支持中国大陆工商局或市场监督管理局登记的企业。请填写工商营业执照上的企业全称</p>
      </el-form-item>
      <el-form-item label="法人身份证姓名:">
        <el-input v-model="formData.baseRealName" ></el-input>
        <p class="form-content">*如果属于分公司则填写工商营业执照上明确的负责人，个体工商户请填写 经营者姓名，合伙企业请填写合伙人姓名，个人独资企业请填写投资人姓名，企业法人的非法人分支机构填写负责人姓名，均按照营业执照上填写。</p>
      </el-form-item>
      <el-form-item label="工商营业执照号:">
        <el-input v-model="formData.baseLicenseNum" ></el-input>
      </el-form-item>
      <div>
        <!-- <p class="form-font" style="margin-bottom:10px">法人身份证件:</p> -->
        <div style="display:flex">
          <input-upload @weiUpload="uploadSuccess1" :imgUrl="businessLicenseImg" :inputWidth="230">
            <p slot="label" class="form-font">企业工商营业执照:</p>
          </input-upload>
          <input-upload @weiUpload="uploadSuccess2" :imgUrl="contactCardImg" :inputWidth="230">
            <p slot="label" class="form-font">法人身份证（正面）</p>
          </input-upload>
          <input-upload @weiUpload="uploadSuccess3" :imgUrl="contactBackCardImg" :inputWidth="230">
            <p slot="label" class="form-font">法人身份证（反面）</p>
          </input-upload>
        </div>
      </div>
    </el-form>
    <div class="save-footer">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="warning" @click="save">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import inputUpload from '@/components/inputUpload'
export default {
  name: 'merchantApprove',
  components: {
    inputUpload
  },
  data() {
    return {
      formData:{},
      businessLicenseScanFile: {},
      businessLicenseImg: '',
      contactCardImgSrcFile: {},
      contactCardImg: '',
      contactBackCardImgSrcFile: {},
      contactBackCardImg: '',
    }
  },
  methods: {
    save() {
      let form = Object.assign({},this.formData);
      if(!form.baseFullName) {
        this.yfAlert('请输入企业全称','error');
        return
      }
      if(!form.baseLicenseNum) {
        this.yfAlert('请输入营业执照号','error');
        return
      }
      if(!form.baseRealName) {
        this.yfAlert('请输入法人身份证姓名','error');
        return
      }
      if(!this.businessLicenseImg) {
        this.yfAlert('请上传工商执照','error');
        return
      }
      if(!form.baseRealName) {
        this.yfAlert('请输入法人身份证姓名','error');
        return
      }
      if(!this.contactCardImg) {
        this.yfAlert('请上传身份证正面照','error');
        return
      }
      if(!this.contactBackCardImg) {
        this.yfAlert('请上传身份证反面照','error');
        return
      }
      let formData = new FormData();
      for (let k in form) {
        formData.append(k, form[k]);
      }
      formData.append('businessLicenseScanFile',this.businessLicenseScanFile,this.businessLicenseScanFile.name);
      formData.append('contactCardImgSrcFile',this.contactCardImgSrcFile,this.contactCardImgSrcFile.name);
      formData.append('contactBackCardImgSrcFile',this.contactBackCardImgSrcFile,this.contactBackCardImgSrcFile.name);
      this.$http.post('web/main/edit/attestation',formData).then(res => {
        if(res.data.errorCode == 'success'){
          this.yfAlert('提交成功','success');
          setTimeout(()=>{
            this.$router.push('/setMerchant');
          },1000)
        }else {
          this.yfAlert(res.data.errorMsg,'error');
        }
      })
    },
    uploadSuccess1(val,url) {
      this.businessLicenseImg = url;
      this.businessLicenseScanFile = val;
    },
    uploadSuccess2(val,url) {
      console.log(val)
      this.contactCardImg = url;
      this.contactCardImgSrcFile = val;
    },
    uploadSuccess3(val,url) {
      this.contactBackCardImg = url;
      this.contactBackCardImgSrcFile = val;
    },
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #ebeef5;
.title{
  padding-bottom: 15px;
  border-bottom: $border;
}
.form-font{
  font-size: 14px;
  color: #606266;
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
