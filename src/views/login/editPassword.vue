<template>
   <div class="editPassword">
       <div class="dialog">
            <div class="reg-tit"><section>忘记密码</section></div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="手机号码:">
                    <el-input v-model="form.loginName" placeholder="请输入手机号码"></el-input>
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

                <el-form-item label="设置密码:">
                    <el-input v-model="form.passWord" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>

                <el-form-item label="确认密码:">
                    <el-input v-model="conpwd" type="password" placeholder="请确认密码"></el-input>
                </el-form-item>

                <el-button type="primary" @click="submit" class="wid100" >确认</el-button>
                <div class="dis_fb">
                    <router-link to="/" class="colorblue">已有账号</router-link>
                    <span>没有账号<router-link to="/register" class="colorblue">立即注册</router-link></span>
                </div>

            </el-form>
       </div>
   </div>
</template>
<script>
import CONFIG from '@/utils/config'
import mix from '@/utils/mixin'
export default{
    name:'editpassword',
    mixins:[mix],
    created(){
        this.getVerifyCode();
    },
    data(){
       return {
           form:{  //需要提交的数据
                loginName:'',  //手机号
                passWord:'',   //密码
                veryCode:'', //验证码
                smsCode:''     //短信验证码
           },
           conpwd:'',  //确认密码
           text:'获取验证码',
           sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
           auth_time: 60, /*倒计时 计数器*/
           timer:null,
       }
    },
    methods:{
         submit(){  //提交数据
            if(this.checkForm()){
                this.$http.post("web/open/user/updatePassWord",this.form).then(res => {
                  this.yfAlert(res.data.message,'success');
                  setTimeout(()=> {
                    this.$router.push("/");
                  },500);
                }, (err) => {
                    this.yfAlert(err.data.message,'error');
                })
            }
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
                    this.$http.post('web/open/user/getYzm',{phone:this.form.loginName,code:'14'}).then(res => {
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
        },
        checkForm(){
            if(this.form.loginName!=''&&CONFIG.myReg.mobile.test(this.form.loginName)&&this.form.verifyCode!=''&&this.form.smsgCode!=''&&
              CONFIG.myReg.pwd.test(this.form.passWord)&&this.form.passWord==this.conpwd){
                return true;
            }else{
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
                if(!CONFIG.myReg.pwd.test(this.form.password)){
                    this.yfAlert("登录密码6-12个有效字符,以字母开头",'error');
                    return false;
                }
                if(!(this.form.passWord==this.conpwd)){
                    this.yfAlert("两次密码不一致",'error');
                    return false;
                }

            }
        }
    }
}
</script>
<style scoped lang="scss">
$border: 1px solid #ebeef5;
.wid100{
   width:100%;
}
.wid50{
   width:50%;
}
.code-wrap{
    display: flex;
}
.mar-L10{
   margin-left:10px;
}
.dis_fb{
     display: flex;
     justify-content: space-between;
     font-size:12px;
     margin-top:10px;
}
.colorblue{
  color: #337ab7;
}
.editPassword {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/bg.png");
  animation: slideIn 0.5s ease;
}
.editPassword .dialog {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  padding: 20px;
}
.reg-tit{
    position: relative;
    border-bottom: $border;
    padding-bottom: 20px;
    margin-bottom: 20px;
    color:#666;
    font-size:16px;
}
.verify-code{
    display: block;
    width: 120px;
    height: 38px;
    margin-left:10px;
}
</style>
