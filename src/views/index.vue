<template>
  <div class="index">
    <header class="header">
      <div class="header-wrap">
          <div class="logo"></div>
          <div class="header-nav">
            <router-link class="nav-item" active-class="active" v-for="(item,index) in headerNav" :key="index" :to="item.path">{{ item.name }}</router-link>
          </div>
          <div class="header-user">
            <img :src="userInfo.businessLogo" v-if="userInfo.businessLogo">
            <img src="../assets/images/admin.png" v-else>
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ userInfo.nickName }}
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><i :class="stateIconList[userState]" class="state-icon" :style="{'color': stateIconColorList[userState]}"></i>{{ userState | getUserState }}</el-dropdown-item>
                <el-dropdown-item><el-button type="danger" size="mini" style="width:100%" @click="loginOut">退出</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
      </div>
    </header>
    <div class="main" :style="{ 'height' : mainHeigth + 'px'}">
      <router-view></router-view>
      <!-- <transition name="fade">
      </transition> -->
    </div>
    <!-- <footer class="footer">
      <p>Copyright@2016.Shen Zhen eaqul technology co.,ltd.All Rights Reserved.</p>
      <p>粤ICP备16098581号-1</p>
    </footer> -->
  </div>
</template>

<script>
import headerNav from '@/router/indexRouter'
import nav from '@/router/indexNav'
import filters from '@/utils/filters'
export default {
  name: 'index',
  filters: filters,
  data() {
    return {
      headerNav: headerNav,
      nav: nav,
      mainHeigth: window.innerHeight - 60,
      stateIconList: ['el-icon-info','el-icon-warning','el-icon-question','el-icon-success','el-icon-error'],
      stateIconColorList: ['#909399','#E6A23C','#409EFF','#67C23A','#F56C6C'],
    }
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
    userState(){
      return this.$store.getters.userState
    }
  },
  created(){
    this.$http.get('web/open/index/get/userInfo').then(res => {
      this.$store.commit('SET_USERINFO',res.data.data);
      this.$store.commit('SET_USERSTATE',res.data.data.userState);
    });
  },
  methods: {
      loginOut(){
        this.$confirm('确认退出吗','提示',{
          'type' : 'warning'
        }).then(()=>{
          this.$http.get('signOut').then(res => {
            if(res.data.type == 'success'){
              this.yfAlert('退出成功','success');
              this.$store.commit('CLEAR_INFO');
              this.$router.replace('/');
            }else {
              this.yfAlert(res.data.errorMsg,'error');
            }
          },(msg) => {
            this.yfAlert(res.data.errorMsg,'error');
          })
        })
      },
    }
  }
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.index {
  min-width: 1000px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #F4F5FA;
}
.header {
  background-color: #fff;
}
.header-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 30px;
  border-bottom: $el-border2;
  box-sizing: border-box;
}
.logo {
  width: 147px;
  height: 43px;
  background: url("../assets/images/logo.png") no-repeat center;
  background-size: 100% 100%;
}
.header-nav{
  flex: 1;
  display: flex;
  height: 100%;
  padding-left: 73px;
  .nav-item{
    width: 100px;
    height: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    &:hover{
      transition: all 0.3s;
      background-color: #D9EAFE;
    }
  }
}
.header-user{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 2px solid #e5e5e5;
  padding-left: 20px;
  img{
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.el-dropdown{
  height: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  .el-icon-caret-bottom{
    color: #999;
  }
}
.state-icon{
  margin-right: 10px;
}
.main {
  min-width: 1000px;
  box-sizing: border-box;
  display: flex;
  border-radius: 4px;
}
.active {
  color: #fff;
  background-color: $el-blue;
  transition: all 0.3s;
  &:hover{
    background-color: $el-blue !important;
  }
}
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #000;
  padding-top: 15px;
  z-index: 100;
  p{
    color: #ccc;
    text-align: center;
    font-size: 12px;
    margin-bottom: 15px;
  }
}
.text-center{
  padding: 20px 10px;
  font-size: 16px;
  text-align: left;
}
</style>
