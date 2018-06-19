import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import index from '@/views/index'
import register from '@/views/login/register'
import editpassword from '@/views/login/editpassword'
import store from "../stores/store";
import indexRouter from '@/router/indexRouter'

import { MessageBox } from 'element-ui';

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path:'/editpassword',
      name:'editpassword',
      component:editpassword
    },
    {
      path: '/index',
      redirect: '/index/survey',
      name: 'index',
      component: index,
      children: indexRouter
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.parent) {
    if(to.meta.parent != store.getters.navIndex){
      store.commit('SET_NAV', to);
    }
  }
  if(to.meta.parent == 'storeManagement'){
    if(store.getters.storeTime <= 0) {
      MessageBox({
        'title': '提示',
        'type': 'warning',
        'message': '请先购买服务',
        'showClose': false,
        'closeOnClickModal': false,
      }).then((res) => {
        router.go(-1);
      });
    }
  }
  if(to.path == '/register' || to.path == '/editpassword') {
    next();
    return
  }
  if(!store.getters.userId) {
    if(to.name != 'login'){
      next('/');
    }else {
      next();
    }
  }else {
    next();
  }
})

export default router
