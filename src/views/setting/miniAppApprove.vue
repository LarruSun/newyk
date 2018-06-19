<template>
  <div class="contain">
    <div class="authentication authentication-warning" v-if="data.authStatu == 'fail'">
      <i class="el-icon-warning"></i>
      <span>您的账户尚未绑定小程序 !</span>
    </div>
    <div class="authentication authentication-success" v-if="data.authStatu == 'success'">
      <i class="el-icon-success"></i>
      <span>您已经绑定小程序 !</span>
    </div>
    <div v-if="!isValid">
      <el-card class="box-card" v-if="data.authStatu == 'fail'">
        <p class="card-header">第一步：请先授权小程序</p>
        <p class="text-center" style="margin-top: 80px;">
          <a :href="data.wxAuthUrl" target="_Blank">
            <el-button type="primary">立即授权</el-button>
          </a>
        </p>
      </el-card>
      <el-card class="box-card" v-if="data.authStatu == 'success'">
        <p class="card-header">第一步：请先授权小程序</p>
        <div class="mini-app-info">
          <div class="mini-app">
            <img :src="data.wxThirdPartyPlatUser.wxThirdPartyPlatform.headImg" alt="">
            <div>
              <p>{{ data.wxThirdPartyPlatUser.wxThirdPartyPlatform.nickName }}</p>
              <p>
                <i class="el-icon-success" style="color:#67C23A"></i>
                <span>已成功授权</span>
              </p>
            </div>
          </div>
          <div class="mini-app-btn">
            <!-- <el-button type="warning" size="small">重新授权</el-button><span></span> -->
            <el-button @click="remove" type="danger" size="small">解除授权</el-button>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <p class="card-header">第二步：请填写小程序APPID及密钥</p>
        <el-form :model="formData" label-position="left" label-width="150px">
          <el-form-item label="小程序ID：">
            <el-input v-model="formData.appId" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="小程序密钥：">
            <el-input v-model="formData.appSecret" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="data.authStatu == 'fail'" @click="save" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <p class="card-header">第三步：微信支付设置</p>
        <el-form label-position="left" label-width="150px">
          <el-form-item label="选择商户类型：">
            <el-select v-model="payData.isContributing" placeholder="请选择">
              <el-option v-for="(item,index) in ['普通用户','签约用户']" :label="item" :value="index" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="payData.isContributing == 0">
            <el-form-item label="微信商户ID：">
              <el-input v-model="payData.mchId" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="微信商户APP秘钥：">
              <el-input v-model="payData.apikey" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="P12证书上传：">
              <el-upload :http-request="uploadRequest" accept="application/x-pkcs12" action="" class="upload-demo" :on-change="handleChange" :file-list="fileList" style="width:300px">
                <el-button :disabled="data.authStatu == 'fail'" size="small" type="primary">{{ isCert == 'true' ? '已上传' : '上传证书' }}</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button @click="savePay" :disabled="data.authStatu == 'fail'" type="primary">保存</el-button>
              <el-button @click="testPay" :disabled="data.authStatu == 'fail'" type="primary">测试</el-button>
            </el-form-item>
          </div>
          <div v-if="payData.isContributing == 1">
            <el-form-item>
              <p>请发送文件照片到xxx@qq.com邮箱 《食品经营许可证》，《营业执照》，法人身份证照片，对公账户照片，门店地址 邮件标题：XXX-开通签约商户</p>
            </el-form-item>
            <el-form-item>
              <el-button @click="sendMail" :disabled="data.authStatu == 'fail'" type="primary">确认已发邮件</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <div v-if="isValid">
      <el-card class="box-card">
        <p class="card-header">小程序基本信息</p>
        <ul class="mini-app-detail">
          <li>
            <span>小程序名称: </span>
            <span>{{ data.pageName }}</span>
          </li>
          <li>
            <span>小程序头像: </span>
            <img :src="data.wxThirdPartyPlatUser.wxThirdPartyPlatform.headImg" alt="">
          </li>
          <li>
            <span>小程序模版: </span>
            <span>餐饮小程序通用模版</span>
          </li>
          <li>
            <span>线上版本号: </span>
            <span>{{ data.wxUserSmallRoutine.version }}</span>
          </li>
          <li>
            <span>更新时间：</span>
            <span>{{ data.wxUserSmallRoutine.checkTime }}</span>
          </li>
          <li>
            <span>更新状态: </span>
            <span>{{ getCheckStatu(data.wxUserSmallRoutine.checkStatu) }}</span>
            <span v-if="data.wxUserSmallRoutine.checkStatu == 1">({{ data.auditStatus.reason }})</span>
          </li>
        </ul>
      </el-card>
      <el-card class="box-card">
        <p class="card-header">小程序开发ID
          <el-button type="primary" size="small" class="fr" @click="showModal">开发设置</el-button>
        </p>
        <ul class="mini-app-detail">
          <li>
            <span>小程序ID: </span>
            <span>{{ data.wxConfig.appId }}</span>
          </li>
          <li>
            <span>小程序密钥：</span>
            <span>{{ data.wxConfig.appSecret }}</span>
          </li>
        </ul>
      </el-card>
      <el-dialog title="小程序开发ID配置" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
        <el-form :model="formData" label-position="left">
          <el-form-item label="小程序ID: " label-width="100px">
            <el-input v-model="formData.appId" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="小程序密钥: " label-width="100px">
            <el-input v-model="formData.appSecret" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    this.$http.post('pay/pay/expay/selWxPay').then(res => {
      if(!res.data.data) {
        this.payData.isContributing = '';
        this.isValid = false;
      }else {
        this.isValid = true;
        this.$set(this.payData,'appid',res.data.data.appid);
        this.$set(this.payData,'mchId',res.data.data.mch_id);
        this.$set(this.payData,'apikey',res.data.data.paykey);
        this.$set(this.payData,'isContributing',res.data.data.contributing ? 1 : 0);
        this.isCert = res.data.data.certStreamSrc;
      }
      this.getDetail();
    })
  },
  data(){
    return {
      formData: {},
      dialogVisible: false,
      data: {
        auditStatus: {},
        wxConfig: {},
        wxThirdPartyPlatUser: {
          wxThirdPartyPlatform:{}
        },
        wxUserSmallRoutine: {},
        users:{}
      },
      payData:{
        isContributing: 0,
        mchId: '',
        apikey: '',
      },
      fileList: [],
      isValid: true,
      isCert: false
    }
  },
  methods: {
    showModal(){
      this.dialogVisible = true;
      this.formData = {};
    },
    handleChange(val){
      this.fileList = [val.raw];
    },
    getDetail(){
      this.$http.post('wx/smallRoutine/checkSmallroutineAuth',{
        platform: 'ykyf'
      }).then(res => {
        this.data = res.data.data;
        if(this.data.wxConfig){
          this.$set(this.formData,'appId',this.data.wxConfig.appId);
          this.$set(this.formData,'appSecret',this.data.wxConfig.appSecret);
        }
        let data = res.data.data;
        if(data.wxConfig && data.wxUserSmallRoutine && this.isValid){
          this.isValid = true;
        }else{
          this.isValid = false;
        }
      })
    },
    getCheckStatu(val){
      let list = {
        '0': '线上版本是最新版本',
        '1': '审核失败',
        '2': '微信审核中',
        '-1': '接口调用失败'
      };
      return list[val]
    },
    save(){
      let formData = Object.assign({},this.formData);
      if(!formData.appId){
        this.yfAlert("请输入小程序ID",'warning');
        return
      }
      if(!formData.appSecret){
        this.yfAlert("请输入小程序密钥",'warning');
        return
      }
      formData.userId = this.data.users.id;
      this.$http.post('smallroutine/smallRoutineSet/add/saveWxConfig',formData).then(res => {
        this.yfAlert(res.data.message,'success');
        this.dialogVisible = false;
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    savePay(){
      let payData = Object.assign({},this.payData);
      if(payData.isContributing != 0 && payData.isContributing != 1){
        this.yfAlert('请选择商户类型','warning');
        return
      }
      if(!payData.mchId){
        this.yfAlert('请输入微信商户ID','warning');
        return
      }
      if(!payData.apikey){
        this.yfAlert('请输入微信商户APP秘钥','warning');
        return
      }
      if(this.fileList.length <= 0 && this.isCert != true){
        this.yfAlert('请上传P12证书','warning');
        return
      }else{
        payData.certUrl = this.fileList[0];
      }
      if(!payData.appid){
        payData.addid = this.formData.appId;
      }
      let formData = new FormData();
      for (let i in payData){
        formData.append(i, payData[i]);
      }
      this.$http.post('pay/pay/expay/saveWxPay',formData,{
        type: 'formData'
      }).then(res => {
        this.yfAlert(res.data.message,'success');
        this.create();
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    sendMail(){
      this.$http.post('pay/pay/expay/saveWxPay',{
        isContributing: 1
      }).then(res => {
        this.yfAlert(res.data.message,'success');
        this.create();
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    remove(){
      this.$confirm('是否解除授权？','提示',{
        'type' : 'warning'
      }).then(res => {
        this.$confirm('再次确认是否解除授权？','提示',{
          'type' : 'warning'
        }).then(res => {
          this.$http.post('wx/smallRoutine/delWxThirdPartyPlatform',{
            'userId' : this.data.users.id,
          }).then(res => {
            this.yfAlert(res.data.message,'success');
            this.getList();
          },(err) => {
            this.yfAlert(err.data.message,'error')
          })
        })
      })
    },
    testPay(){
      this.$http.post('pay/pay/expay/saveWxPay').then(res => {
        this.yfAlert(res.data.message,'success');
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    uploadRequest(){
      return false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.box-card{
  padding: 20px;
  margin-bottom: 10px;
  .card-header{
    font-size: 16px;
    margin-bottom: 20px;
  }
}
.mini-app-info{
  display: flex;
  justify-content: space-between;
  .mini-app{
    flex: 1;
    display: flex;
    >img{
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    >div{
      flex: 1;
      line-height: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      p:first-child{
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  .mini-app-btn{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.mini-app-detail{
  padding-top: 20px;
  li{
    display: flex;
    margin-bottom: 10px;
    >span{
      color: #606266;
      &:first-child{
        display: inline-block;
        width: 150px;
      }
    }
    >img{
      width: 80px;
      height: 80px;
    }
  }
}
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
</style>
