import axios from 'axios'
import qs from 'qs'
import CONFIG from "../utils/config";
import router from "../router";
import store from "../stores/store";
import { Loading, Message } from 'element-ui'

axios.defaults.baseURL = CONFIG.pathApi.yf;
axios.defaults.timeout = 5000;
/* var loadinginstace; */
axios.interceptors.request.use((config) => {
  /* loadinginstace = Loading.service({ fullscreen: true }); */
  config.withCredentials = true;
  if(config.type == 'formData'){
    return config
  }
  config.data = qs.stringify(config.data);
  return config
}, (err) =>{
  /* loadinginstace.close(); */
  Message.error({
    message: '加载超时'
  });
  return Promise.reject(err);
})

axios.interceptors.response.use((res) => {
  /* setTimeout(()=>{
    loadinginstace.close();
  },300) */
  if(res.data.type == 'success'){
    return res;
  }
  if(res.data.type == 'fail'){
    /* store.commit('CLEAR_INFO');
    yfAlert('登录身份已失效','warning');
    router.replace('/'); */
    return Promise.reject(res);
  }
}, (err) =>{
  /* loadinginstace.close(); */
  console.log(err)
  Message.error({
    message: '加载失败'
  });
  return Promise.reject(err)
})

export default axios
