import CONFIG from '@/utils/config'
export default {
  data(){
    return {
       verifyCode:'',
       tableData: [],
       tableLoading: false,
       params: {},
    }
  },
  methods:{
    getVerifyCode() {
       this.verifyCode = CONFIG.pathApi.yf + 'verifyCode.jpeg?timestamp=' + new Date().getTime();
    },
    filterParams(param){
      let params = JSON.parse(JSON.stringify(param));
      for (let key in params) {
        //if(params[key] !== 0 && params[key] !== '0'){
          if(!params[key] || params[key] == 'all'){
            delete params[key];
          }
        }
      //}
      return params;
    },
    loadMore(val){
      this.getList();
    },
    getList(){
    }
  }
}
