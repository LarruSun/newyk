<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <div class="server-list">
      <p class="server-title">基础服务</p>
      <ul>
        <li v-for="(item,index) in yyServices" :key="index" @click="goServer(item.url)">
          <div>
            <img :src="item.serviceImg" alt="">
            <div>
              <p>{{ item.serviceName }}</p>
              <p>有效日期 : {{ item.date || '永久' }}</p>
            </div>
          </div>
        </li>
      </ul>
      <p class="server-title">增值服务</p>
      <ul v-if="serviceBuys.length > 0">
        <li v-for="(item,index) in serviceBuys" :key="index" @click="goBuyServer(item.serviceName)">
          <div>
            <img :src="item.serviceImg" alt="">
            <div>
              <p>{{ item.serviceName }}</p>
              <p>有效日期 : {{ item.date || '永久' }}</p>
            </div>
          </div>
        </li>
      </ul>
      <p class="tips" v-else>
        您还没有任何增值服务，您可以添加增值服务让你的店铺更智能，提高效益。
        <router-link to="/mallServer">去开通<i class="fa fa-angle-right"></i></router-link>
      </p>
    </div>
  </div>
</template>

<script>
import CONFIG from '@/utils/config'
export default {
  name: 'myServer',
  created() {
    this.$http.get('web/service/myServiceList').then(res => {
      if(res.data.type == 'success'){
        this.yyServices = res.data.data.yyServices;
        this.serviceBuys = res.data.data.serviceBuys;
      }
    })
  },
  data() {
    return {
      title: this.$router.currentRoute.name,
      yyServices: [],
      serviceBuys: [],
    }
  },
  methods: {
    goServer(url) {
      let path1 = 'https://yun.eaqul.com';
      let path2 = 'https://yun.eaqul.com/api';
      if(url.indexOf('.html') >= 0) {
        window.open(path1 + url);
      }else {
        window.open(path2 + url);
      }
    },
    goBuyServer(val) {
      let path = 'https://yun.eaqul.com/api';
      if(val == '微信公众号') {
        window.open(path + '/wx/weChat/toWeChatMain?userId=' + this.$store.getters.userId + '&platform=ykyf');
      }else if(val == '微信小程序'){
        window.open(path + '/wx/smallRoutine/toSmallRoutine?userId=' + this.$store.getters.userId + '&platform=ykyf');
      }
    }
  }
}
</script>
<style scoped lang="scss">
$border: 1px solid #ebeef5;
.title{
  padding-bottom: 15px;
  border-bottom: $border;
}
.server-list{
  >p.server-title{
    font-size: 14px;
    padding: 10px 0;
    color: #666;
  }
  ul{
    display: flex;
    flex-wrap: wrap;
    li{
      width: 33.3%;
      box-sizing: border-box;
      >div{
        display: flex;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
        border: $border;
        box-sizing: border-box;
        img{
          width: 65px;
          height: 65px;
          border-radius: 50%;
        }
        >div{
          flex: 1;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p:first-child{
            font-size: 14px;
            font-weight: 600;
          }
          p:last-child{
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
.tips{
  font-size: 14px;
  margin-top: 10px;
  a{
    color: #0ab2f7;
  }
  i{
    margin-left: 5px;
  }
}
</style>
