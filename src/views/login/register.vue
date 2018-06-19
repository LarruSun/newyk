<template>
<div class="register">
  <div class="dialog">
   <div class="reg-tit"><section>免费注册</section><router-link to="/" class="toLogin">已有账号</router-link></div>
   <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="企业简称:">
        <el-input v-model="form.nickName" placeholder="请输入企业简称"></el-input>
      </el-form-item>

      <el-form-item label="省/市/区:">
        <!-- <el-input v-model="citys" placeholder="请输入省/市/区"></el-input> -->
        <el-cascader placeholder="请输入省/市/区" :options="options"  @change="choseCitys" style="width:100%;"></el-cascader>
      </el-form-item>

      <el-form-item label="手机号:">
        <el-input v-model="form.loginName" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="" >
        <div class="code-wrap">
          <el-input v-model="form.veryCode" class="wid50" placeholder="验证码"></el-input>
          <img class="verify-code" :src="verifyCode" alt="验证码" @click="getVerifyCode">
        </div>
      </el-form-item>

      <el-form-item label="短信验证:">
        <div class="code-wrap">
          <el-input v-model="form.smsCode" placeholder="短信验证码"></el-input>
          <el-button :disabled="!sendAuthCode" size="small" type="primary" class="wid50 mar-L10" @click="getSmsCode">{{text}}</el-button>
        </div>
      </el-form-item>

      <el-form-item label="联系人:">
        <el-input v-model="form.contactName" placeholder="请输入联系人"></el-input>
      </el-form-item>

      <el-form-item label="设置密码:">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label="确认密码:">
        <el-input v-model="conpwd" type="password" placeholder="请输入确认密码"></el-input>
      </el-form-item>

      <el-form-item label="" >
          <el-checkbox label="我已阅读并接受" name="type" v-model="checked"></el-checkbox>
          <span @click="dialogVisible = true"><router-link to="" class="colorblue">《易快云服注册协议》</router-link></span>
      </el-form-item>

      <el-button type="primary" @click="regisetr" class="wid80" v-bind:disabled="!checked">注册</el-button>

    </el-form>
  </div>
  <el-dialog title="易快协议" top="4%" custom-class="dialog-agreement" :visible.sync="dialogVisible" :close-on-click-modal="true">
    <img src="@/assets/images/agreement.png" alt="" style="margin: 0 auto;display:block">
  </el-dialog>
</div>
</template>

<script>
import CONFIG from '@/utils/config'
import mix from '@/utils/mixin'
import { regionData,CodeToText } from 'element-china-area-data'
export default {
 name:'regisetr',
 mixins:[mix],
 created(){
    this.getVerifyCode();
 },
  data() {
    return {
      form: {
        nickName: '',    //企业简称
        loginName: '',   //登录名(手机号)
        veryCode: '',  //验证码
        smsCode: '',     //短信验证码
        contactName:'',  //联系人
        password:'',    //密码
        addressProvince: '', //地址(省)
        addressCity: '',  //地址(市)
        addressArea:''    //地址(区)
      },
      conpwd:'',   //确认密码
      checked:true,  //同意云服注册协议
      //citys:'',     //省市区
      options:regionData,  //地域数据
      sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
      auth_time: 60, /*倒计时 计数器*/
      timer:null,
      text:'获取验证码',
      dialogVisible: false,
    }
  },
  methods: {
    regisetr() { //注册
      if(this.checkForm()){
          this.$http.post("web/open/user/register",this.form).then(res =>{
            this.yfAlert(res.data.message,'success');
            setTimeout(()=> {
              this.$router.push("/");
            },500);
          }, (err) => {
            this.yfAlert(err.data.message,'error');
          })
      };
    },
    checkForm(){
           if(this.form.nickName!=''&&this.form.addressProvince&&CONFIG.myReg.mobile.test(this.form.loginName)&&this.form.veryCode!=''&&this.form.smsgCode!=''&&
              this.form.contactName!=''&&CONFIG.myReg.pwd.test(this.form.password)&&this.form.password==this.conpwd){
                return true;
            }else{
                if(!this.form.nickName!=''){
                    this.yfAlert("企业简称不能为空",'error');
                    return false;
                }
                if(!this.form.addressProvince!=''){
                    this.yfAlert("请填写省市区",'error');
                    return false;
                }
                if(!CONFIG.myReg.mobile.test(this.form.loginName)){//手机号码不正确
                    this.yfAlert("请输入正确的手机格式",'error');
                    return false;
                }
                if(!this.form.veryCode!=''){
                    this.yfAlert("请输入验证码",'error');
                    return false;
                }
                if(!this.form.smsCode!=''){
                    this.yfAlert("请输入短信验证码",'error');
                    return false;
                }
                if(!this.form.contactName!=''){
                    this.yfAlert("请输入联系人",'error');
                    return false;
                }
                if(!CONFIG.myReg.pwd.test(this.form.password)){
                    this.yfAlert("登录密码6-12个有效字符,以字母开头",'error');
                    return false;
                }
                if(!(this.form.password==this.conpwd)){
                    this.yfAlert("两次密码不一致",'error');
                    return false;
                }
            }
    },
    choseCitys(val){
      this.form.addressProvince=CodeToText[val[0]];
      this.form.addressCity=CodeToText[val[1]];
      this.form.addressArea=CodeToText[val[2]];
    },
    getSmsCode(){ //获取短信验证码
      var that=this;
      if(that.timer){
         return ;
      }else{
          if(this.checkPhone()){
              that.sendAuthCode = false;
              that.auth_time = 60;
              that.timer=setInterval(()=>{
                  that.auth_time--;
                  that.text=that.auth_time+'S后重新获取';
                  if(that.auth_time<=0){
                      that.sendAuthCode = true;
                      clearInterval(that.timer);
                      that.timer=null;
                      that.text='再次获取'
                  }
              }, 1000);
              this.$http.post('web/open/user/getYzm',{phone:this.form.loginName,code:'17'}).then(res => {
                this.yfAlert(res.data.message,'success');
                }, (err) => {
                this.yfAlert(err.data.message,'error');
              });
          }
      }
    },
    checkPhone(){  //手机号码检验(为获取短信验证码服务的)
        if(CONFIG.myReg.mobile.test(this.form.loginName)){
           return true;
        }
        if(!CONFIG.myReg.mobile.test(this.form.loginName)){
          this.yfAlert("请输入正确的手机格式",'error');
          return false;
        }
    }
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #ebeef5;
.wid80{
   width:80%;
}
.wid50{
   width:50%;
}
.mar-L10{
   margin-left:10px;
}
.colorblue{
  color: #337ab7;
}
.register {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/bg.png");
  animation: slideIn 0.5s ease;
  .dialog{
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 360px;
    border-radius: 10px;
    background: #fff;
    text-align: center;
    padding: 20px;
      .reg-tit{
         position: relative;
         border-bottom: $border;
         padding-bottom: 20px;
         margin-bottom: 20px;
         color:#666;
         font-size:16px;
         .toLogin{
            position: absolute;
            right:10px;
            bottom: 20px;
            color: #428bca;
            font-size:14px;
         }
      }
      .code-wrap{
         display: flex;
      }
      .verify-code{
          display: block;
          width: 120px;
          height: 38px;
          margin-left:10px;
      }
    }
}
</style>
