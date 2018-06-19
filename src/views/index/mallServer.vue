<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <div class="server-list">
      <p class="server-title">你可以添加下列需要的服务，让你的店铺更智能，提高用户体验</p>
      <ul>
        <li v-for="(item,index) in serverList" :key="index">
          <div>
            <img :src="item.serviceImg" alt="">
            <div class="server-info">
              <p>{{ item.serviceName }}</p>
              <p>{{ item.serviceDesc }}</p>
            </div>
            <div class="server-price">
              <div>价格：</div>
              <div>
                <p v-for="(price,idx) in item.priceMonth" :key="idx"><span class="fr"> {{ price.price }}元/{{ price.month }}月</span></p>
              </div>
            </div>
            <i class="fa fa-angle-right"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mallServer',
  created() {
    this.$http.get('web/service/mallServiceList').then(res => {
      if(res.data.type == 'success'){
        let serverList = res.data.data.yyServices;
        for (let k  in serverList) {
          serverList[k].priceMonth = JSON.parse(serverList[k].priceMonth);
        }
        this.serverList = serverList;
      }
    })
  },
  data() {
    return {
      title: this.$router.currentRoute.name,
      serverList: []
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
      width: 50%;
      box-sizing: border-box;
      >div{
        display: flex;
        padding: 10px;
        margin: 10px;
        border: $border;
        box-sizing: border-box;
        cursor: pointer;
        img{
          width: 65px;
          height: 65px;
        }
        .server-info{
          flex: 1;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p:first-child{
            font-size: 14px;
            font-weight: 600;
            span{
              font-weight: 500;
              float: right;
              font-size: 14px;
              color: #999;
            }
          }
          p:last-child{
            font-size: 14px;
            color: #999;
          }
        }
        .server-price{
          display: flex;
          padding: 10px 15px;
          font-size: 12px;
          color: #999;
        }
        i{
          margin: auto 0;
          padding-left: 10px;
          font-size: 30px;
          color: #999;
        }
      }
    }
  }
}
</style>
