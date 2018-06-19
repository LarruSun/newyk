<template>
  <div class="container">

      <div class="container-left">
        <el-menu :default-active="defaultRouter" :router="true" :unique-opened="false" ref="menu">
          <div v-for="(item,index) in nav[navIndex]" :key="index">
            
            <el-submenu :index="String(index)" v-if="item.child">
              <template slot="title">
                <span class="menu-icon"><img :src="item.icon"></span>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item :class="($route.path.indexOf(child.path) >= 0)  ? 'is-active' : 'not-active' " v-for="(child,idx) in item.child" :key="idx" :index="child.path">{{ child.name }}</el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.path" v-else :class="($route.path.indexOf(item.path) >= 0) ? 'is-active' : '' ">
              <span class="menu-icon"><img :src="item.icon"></span>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>

          </div>
        </el-menu>
      </div>


      <div class="container-right">
        <!-- <router-view></router-view> -->
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
      
  </div>  
</template>

<script>
import nav from '@/router/indexNav'
export default {
  name: 'home',
  created(){
    console.log(this.nav);
  },
  mounted(){
  },
  computed: {
    navIndex(){
      return this.$store.getters.navIndex
    },
    defaultRouter() {
      return String(this.$store.getters.navDefault)
    },
  },
  data() {
    return{
      nav: nav,
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/css/common';
.container{
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  /* box-shadow: 0px 0px 3px rgba(26,26,26,.1); */
}
.container-left{
  flex-shrink: 0;
  width: 220px;
  border-right: $el-border2;
  box-sizing: border-box;
  background-color: #fff;
  overflow: auto;
}
.el-menu{
  border: none;
}
.menu-icon{
  display: inline-block;
  width: 40px;
  >img{
    width: initial;
    height: initial;
    transform: translateY(-1px);
  }
}
.el-menu-item.is-active{
  background-color: #ddedff;
  color: #409EFF;
}
.el-menu-item.not-active{
  background-color: #fff;
  color: #303133;
}
.el-menu-item:hover{
  background-color: #ddedff;
}
.container-center{
  width:30px;
  background-color:#F4F5FA;
}
.container-right{
  flex: 1;
  padding: 10px;
  background-color: #F4F5FA;
  box-sizing: border-box;
  overflow: auto;
}
.fade-enter-active{
  transition: all .3s ease-in-out .3s;
}
 .fade-leave-active {
   transition: all .3s ease-in-out
 }
.fade-enter, .fade-leave-to{
  opacity: 0;
  transform: translateY(+30px);
}
</style>
