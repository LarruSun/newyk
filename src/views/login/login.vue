<template>
  <div class="login">
    <div class="dialog">
      <div class="logo"></div>
        <p>易快智能云服务平台</p>
        <el-input v-model="phone" placeholder="手机号" @keyup.enter.native="login"></el-input>
        <el-input type="password" v-model="password" placeholder="密码" @keyup.enter.native="login"></el-input>
        <div class="code-wrap">
          <el-input placeholder="验证码" v-model="code" @keyup.enter.native="login"></el-input>
          <img class="verify-code" :src="verifyCode" alt="验证码" @click="getVerifyCode">
        </div>
        <div class="remember-id">
          <el-checkbox v-model="remember">记住账号</el-checkbox>
          <router-link to="/editpassword" class="fr">忘记密码？</router-link>
        </div>
        <el-button type="primary" @click="login">登录</el-button>
        <router-link to="/register"><el-button style="margin-bottom:15px">注册</el-button></router-link>
      </div> 
  </div>
</template>

<script>
import CONFIG from '@/utils/config'
import mix from '@/utils/mixin'
export default {
  name: "login",
  mixins:[mix],
  created() {
    this.getVerifyCode();
    this.phone = localStorage.getItem('login');
  },
  data() {
    return {
      phone: '',
      password: '',
      verifyCode: '',
      pathCode: '',
      remember: true,
      code: ''
    };
  },
  methods: {
    login() {
      if(CONFIG.develop){
        this.$router.push("/index");
        return
      }
      if(!CONFIG.myReg.mobile.test(this.phone)) {
        this.yfAlert('请输入正确的手机号','error');
        return
      }
      if(!CONFIG.myReg.pwd.test(this.password)) {
        this.yfAlert('登录密码6-12个有效字符,以字母开头','error');
        return
      }
      if(!this.code) {
        this.yfAlert('验证码不能为空','error');
        return
      }
      this.$http.post('oauth2/login',{
        'username' : this.phone,
        'password' : this.password,
        'veryCode' : this.code,
        "remember-me":this.remember
      }).then(res=> {
        this.yfAlert('登录成功','success');
        this.$store.commit('SET_USERID',res.data.data.principal.user.id);
        this.$router.push("/index");
        if(this.remember){
          localStorage.setItem('login',this.phone);
        }
      }, (err) => {
        this.getVerifyCode();
        this.yfAlert(err.data.message,'error');
      })
    }
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/bg.png");
  animation: slideIn 0.5s ease;
}
.login .dialog {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  padding: 20px;
}
.dialog .logo {
  width: 147px;
  height: 43px;
  background: url("../../assets/images/logo.png") no-repeat center;
  background-size: 100% 100%;
  margin: 0 auto;
}
.dialog p {
  margin: 10px 0;
  font-size: 18px;
  color: #666;
}
.dialog .el-input {
  margin-top: 15px;
}
.dialog .el-button {
  width: 100%;
  margin: 15px 0 0 0;
}
.dialog a {
  color: #409eff;
  font-size: 14px;
}
.code-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  .el-input{
    flex: 1;
    padding-right: 15px;
    margin: 0;
  }
  img{
    display: block;
    width: 140px;
    height: 38px;
  }
}
.remember-id{
  margin-top: 10px;
  text-align: left;
}
</style>
