// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueMap from 'vue-amap';
import store from './stores/store'
import GLOBAL from './utils/global'
import axios from './service'
import App from './App'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(GLOBAL)
Vue.use(VueMap)

// axios
Vue.prototype.$http = axios

/* // 初始化vue-amap
VueMap.initAMapApiLoader({
  // 申请的高德key
  key: '63978296d871c4802ddacc979d52a37d',
  // 插件集合
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor']
}); */


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
