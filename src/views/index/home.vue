<template>
  <div class="contain">
    <!-- <div class="user-wrap">
      <div class="user">
        <div class="user-top">
          <img :src="userInfo.businessLogo" v-if="userInfo.businessLogo">
          <img src="../../assets/images/admin.png" v-else>
          <div>
            <p>
              <b>{{ userInfo.nickName }}</b>
              <span>{{ userInfo.contactPhone }}</span>
            </p>
            <p>
              <i class="fa fa-times" v-if="userInfo.userState == ('1' || '4')" style="color:#ff0000"></i>
              <i class="fa fa-repeat" v-if="userInfo.userState == '2'" style="color:#fdb912"></i>
              <i class="fa fa-check-circle"  v-if="userInfo.userState == '3'"></i>
              <span>企业{{ userInfo.userState | userState }}</span>
            </p>
          </div>
          <span><span>V{{ userInfo.level }}</span></span>
        </div>
        <div class="user-bottom">
          <div>
            <i class="fa fa-wrench"></i>
            <span>开通服务:</span>
            <span>{{ userInfo.serverNum }}</span>
          </div>
          <div>
            <i class="fa fa-television"></i>
            <span>设备数量:</span>
            <span>{{ userInfo.deviceNum }}</span>
          </div>
          <div>
            <i class="fa fa-university"></i>
            <span>线下门店:</span>
            <span>{{ userInfo.shopNum }}</span>
          </div>
        </div>
      </div>
      <div class="server-wrap">
        <div class="server-top">
          <span>热门服务</span>
          <router-link to="">
            <span>更多</span>
            <i class="fa fa-angle-right"></i>
          </router-link>
        </div>
        <ul class="server-bottom">
          <li>
            <img src="../../assets/images/server_cy.png" alt="">
            <p>餐饮管理</p>
          </li>
          <li>
            <img src="../../assets/images/server_zf.png" alt="">
            <p>支付管理</p>
          </li>
          <li>
            <img src="../../assets/images/server_hy.png" alt="">
            <p>会员管理</p>
          </li>
          <li>
            <img src="../../assets/images/server_dx.png" alt="">
            <p>短信管理</p>
          </li>
        </ul>
      </div>
    </div>
    <ul class="info-list">
      <li v-for="(item,index) in infoList" :key="index">
        <p>{{ item.money }}</p>
        <p>{{ item.text }}</p>
      </li>
    </ul>
    <div class="message-wrap">
      <div class="message-left">
        <p class="message-title">
            <span>公告消息</span>
        </p>
        <div class="message-list">
          <router-link to="" v-for="(item,index) in messageList" :key="index">
            <span>{{item.title}}</span>
            <span>{{item.time}}</span>
          </router-link>
        </div>
      </div>
      <div class="message-right">
        <ul>
          <li v-for="(item,index) in activityList" :key="index">
            <img :src="item.src" alt="">
            <p>{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </div> -->
  </div>
</template>

<script>
import filters from '@/utils/filters'
import nav from '@/router/indexNav'
export default {
  filters: filters,
  created() {
  },
  computed: {
    userInfo(){
      return this.$store.getters.userInfo
    },
  },
  data(){
    return {
      defaultRouter: this.$route.path,
      nav: nav,
      infoList: [
        {'money' : '¥ 20','text' : '待提现余额'},
        {'money' : '20','text' : '待发货订单'},
        {'money' : '1','text' : '维权订单'},
        {'money' : '5','text' : '我的关注'},
        {'money' : '100','text' : '关注我'}
      ],
      activityList: [
        {'src' : require('../../assets/images/activity_list1.png'), 'text' : '如何更好的使用易快平台！'},
        {'src' : require('../../assets/images/activity_list2.png'), 'text' : '小伙伴们都喜欢他们！'},
        {'src' : require('../../assets/images/activity_list3.png'), 'text' : '看看其他小伙伴们都在做啥！'}
      ],
      messageList: [
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
        {'url' : 'https://www.baidu.com', 'title':'【微店经验谈】微店小白成长记' , 'time' : '2016/11/21 19：00'},
      ]
    }
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #ebeef5;
.contain{
  display: flex;
  height: 100%;
}
.nav{
  flex-shrink: 0;
  width: 220px;
  height: 100%;
  border-right: $border;
  box-sizing: border-box;
}
.el-menu{
  border: none;
}
.el-menu-item.is-active{
  background-color: #409EFF;
  color: #fff;
}
.user-wrap{
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.user{
  width: 49%;
  padding: 0 15px;
  box-sizing: border-box;
  border: $border;
  border-radius: 4px;
  .user-top{
    display: flex;
    padding: 15px 0;
    border-bottom: $border;
    >img{
      width: 80px;
      height: 80px;
      border-radius: 4px;
    }
    >div{
      flex: 1;
      padding: 15px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      >p{
        font-size: 14px;
        >span:last-child{
          margin-left: 10px;
          color: #999;
          font-size: 12px;
        }
        i{
          color: #00c700;
          font-size: 18px;
          transform: translateY(1px);
        }
      }
    }
    >span span{
      display: block;
      color: rgb(10, 178, 247);
      border:$border;
      padding: 5px 10px;
      font-size: 18px;
      border-radius: 4px;
    }
  }
  .user-bottom {
    display: flex;
    justify-content: space-around;
    padding: 15px 30px;
    font-size: 12px;
    color: #999;
    >div i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
}
.server-wrap{
  width: 49%;
  padding: 0 15px;
  box-sizing: border-box;
  border: $border;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .server-top{
    padding: 10px 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    border-bottom: $border;
    >a{
      color: rgb(10, 178, 247);
    }
  }
  .server-bottom{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    li{
      text-align: center;
      img{
        display: inline-block;
        width: 56px;
        height: 56px;
      }
      p{
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
}
.info-list{
  margin: 20px 0;
  padding: 40px 0;
  border: $border;
  border-radius: 4px;
  display: flex;
  align-items: center;
  li{
    flex: 1;
    text-align: center;
    position: relative;
    &::after{
      content: "";
      height: 10px;
      width: 0;
      border-left: 1px solid #999;
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -5px;
    }
    &:last-child::after{
      display: none;
    }
    p:first-child{
      color: #50a0ff;
      font-size: 30px;
    }
    p:last-child{
      font-size: 14px;
      margin-top: 20px;
    }
  }
}
.message-wrap{
  display: flex;
  .message-left{
    flex: 1;
    padding: 0 15px;
    border: $border;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .message-title{
      padding: 10px 0;
      font-size: 14px;
      border-bottom: $border;
    }
    .message-list{
      flex: 1;
      padding: 15px 0;
      box-sizing: border-box;
      height: 300px;
      overflow-y: scroll;
      &::-webkit-scrollbar{
        display: none
      }
      a{
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        &:hover{
          text-decoration: underline;
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
  .message-right{
    margin-left: 40px;
    ul{
      display: flex;
      width: 240px;
      flex-direction: column;
      li{
        text-align: center;
        img{
          width: 100%;
          display: block;
        }
        p{
          margin: 10px 0;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
