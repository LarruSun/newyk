import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  state: {
    userId: localStorage.getItem('userId') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    userState: null,
    navIndex: null,
    navDefault: null,
    storeTime: JSON.parse(localStorage.getItem('storeTime')) || '',
  },
  getters: {
    userId: state => state.userId,
    userInfo: state => state.userInfo,
    userState: state => state.userState,
    navIndex: state => state.navIndex,
    navDefault: state => state.navDefault,
    storeTime: state => state.storeTime,
  },
  mutations: {
    SET_USERID(state, userId) {
      localStorage.setItem('userId',userId);
      state.userId = userId;
    },
    SET_USERINFO(state, userInfo){
      var userInfo = userInfo;
      delete userInfo.RMFW;
      localStorage.setItem('userInfo',JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    CLEAR_INFO(state){
      localStorage.removeItem('userId');
      localStorage.removeItem('userInfo');
      state.userId = '';
      state.userInfo = {};
    },
    SET_NAV(state, nav){
      state.navIndex = nav.meta.parent;
      state.navDefault = nav.path;
    },
    SET_STORETIME(state, time){
      localStorage.setItem('storeTime',time);
      state.storeTime = time;
    },
    SET_USERSTATE(state,userState){
      state.userState = userState;
    }
  },
  actions: {
  }
})