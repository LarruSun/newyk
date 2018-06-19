<template>
  <div class="contain" v-if="isActive">
    <div class="survey-top">
      <div class="survey-top-item">
        <p>{{ data.indexServiceVO.serviceName }}</p>
        <p>已使用: {{ data.indexServiceVO.hasUsed }}天</p>
        <p>{{ data.indexServiceVO.expiryTime }}到期（剩余{{ data.indexServiceVO.remainingTime }}天）</p>
        <el-progress :text-inside="true" :stroke-width="15" :percentage="Number(progress)" status="success"></el-progress>
        <el-button @click="showModal(data.indexServiceVO.id)" type="primary">立即订阅</el-button>
      </div>
      <div class="survey-top-item survey-top-right">
        <p>公告</p>
        <ul>
          <li v-for="(item,index) in data.indexNoticeVOList" :key="index">
            <span>{{ item.title }} {{ item.content }}</span>
            <span>{{ item.createTime }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="survey-center">
      <p>
        <span>经营数据</span>
        <span>数据每小时更新</span>
      </p>
      <ul>
        <li>
          <p>{{ data.indexManagementVO.todayOrderNum }}</p>
          <p>今日订单量</p>
        </li>
        <li>
          <p>¥{{ data.indexManagementVO.todayTurnover | formartAmount }}</p>
          <p>今日营业额</p>
        </li>
        <li>
          <p>{{ data.indexManagementVO.todayAddMember }}</p>
          <p>今日新增会员</p>
        </li>
        <li>
          <p>{{ data.indexManagementVO.todayPrepaid | formartAmount }}</p>
          <p>今日新增储值</p>
        </li>
      </ul>
    </div>
    <div class="survey-bottom">
      <p>昨日排行榜</p>
      <div class="survey-bottom-item">
        <p>会员消费额（元）</p>
        <div>
          <p>
            <span>卡号</span>
            <span class="fr">消费额</span>
          </p>
          <ul>
            <li v-for="(item,index) in data.indexRankingListVO.consumptionAmountVOList" :key="index">
              <span>{{ item.cardNo }}</span>
              <span>¥{{ item.consumptionAmount | formartAmount }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="survey-bottom-item">
        <p>会员储值额（元）</p>
        <div>
          <p>
            <span>卡号</span>
            <span class="fr">储值额</span>
          </p>
          <ul>
            <li v-for="(item,index) in data.indexRankingListVO.prepaidAmountVOList" :key="index">
              <span>{{ item.cardNo }}</span>
              <span>¥{{ item.prepaidAmount | formartAmount }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog title="服务续费" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-steps :active="payActive" :space="400" style="justify-content:center;margin: 10px 0" align-center>
        <el-step title="提交订单"></el-step>
        <el-step title="等待支付"></el-step>
        <el-step title="完成付款"></el-step>
      </el-steps>
      <div v-if="payActive == 1">
        <ul class="renew">
          <li>
            <span>购买产品：</span>
            <span>{{ renewData.serviceName }}</span>
          </li>
          <li>
            <span>购买帐号：</span>
            <span>{{ renewData.phone }}</span>
          </li>
          <li>
            <span>过期时间：</span>
            <span>{{ renewData.expiryTime }}</span>
          </li>
          <li>
            <span>购买年限：</span>
            <span class="pay-year">
              <span @click="checkPay(index)" :class="payIndex == index ? 'pay-active' : '' " v-for="(item,index) in renewData.priceMonth" :key="index">
                <span>{{`${item.price}元/${item.month}月`}}</span>
              </span>
            </span>
          </li>
        </ul>
        <p class="text-center" style="padding: 20px 0">
          <el-button @click="next" type="primary">下一步</el-button>
        </p>
      </div>
      <div v-if="payActive == 2">
        <el-table :data="tableData" border key="table">
          <el-table-column label="服务" align="center">
            <template slot-scope="scope">
              <span>{{ renewData.serviceName }}</span>
            </template>
          </el-table-column>
          <el-table-column property="price" label="规格" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.price}元/${scope.row.month}月`}}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="sub-header pay-header">
          <span><i class="el-icon-info"></i>选择付款方式</span>
        </p>
        <ul class="pay-type">
          <li v-for="(item,index) in payTypeList" :key="index" @click="selectPayType(index,item.id)">
            <div class="icon-wrap" :class="payType == index ? 'bg-blue' : ''">
              <img :src="payType == index ? item.icon[0] : item.icon[1]" alt="">
            </div>
            <p :class="payType == index ? 'pay-active' : ''">{{ item.content }}</p>
          </li>
        </ul>
        <div class="pay-code" v-if="payType == 'balance'">
          <p class="sub-header pay-header">
            <span><i class="el-icon-info"></i>输入余额支付短信校验码</span>
          </p>
          <span>短信校验码：</span>
          <el-input v-model="formData.smsCode" size="small" type="number"></el-input>
          <el-button type="primary" size="small" @click="sendCode" :disabled="isSend" style="vertical-align: bottom">{{ isSend ? `再次发送(${sendCount}s)` : '获取短信验证码' }}</el-button>
        </div>
        <p class="text-center" style="padding: 20px 0">
          <el-button @click="payActive = 1" type="primary">上一步</el-button>
          <el-button @click="pay" type="primary">立即支付</el-button>
        </p>
      </div>
      <div class="text-center" v-if="payActive == 3">
        <p style="font-size:16px">扫一扫付款(元)</p>
        <p class="pay-amount" v-if="tableData.length > 0">¥{{ tableData[0].price }}</p>
        <p class="pay-methods">
          <img :src="payTypeList[payType].icon[1]" alt="">
          <span>{{ payTypeList[payType].content }}</span>
        </p>
        <div class="text-center">
          <qrcode :value="codeUrl" :options="{ size: 170 }"></qrcode>
        </div>
        <p style="padding-bottom:20px">
          <el-button  @click="dialogVisible = false;" type="primary">完成</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
  <div class="contain text-center" v-else style="min-height:400px">
    <p class="remind-title">尊敬的用户，您的帐号还未激活，请通过以下渠道激活帐号，谢谢！</p>
    <p class="remind-sub-title">联系服务提供商购买服务</p>
    <p class="remind-info">客服电话：9999999999</p>
    <p class="remind-info">QQ客服：234567890</p>
    <p class="remind-info">微信号：234567890</p>
  </div>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'
import filters from '@/utils/filters'
export default {
  filters: filters,
  components: {
    Qrcode
  },
  data() {
    return{
      isActive: true,
      data: {
        indexServiceVO: {},
        indexManagementVO: {},
        indexRankingListVO: {},
      },
      progress: '',
      dialogVisible: false,
      renewData: {},
      payIndex: 0,
      payActive: 1,
      tableData: [],
      payType: 'balance',
      payTypeList: {
        balance:{
          icon: [
            require('@/assets/images/icon-money-white.png'),
            require('@/assets/images/icon-money-gray.png')
          ],
          id: 0,
          content: '余额支付'
        },
        wechat:{
          icon: [
            require('@/assets/images/icon-wechat-white.png'),
            require('@/assets/images/icon-wechat-gray.png')
          ],
          id: 1,
          content: '微信支付'
        },
        alipay:{
          icon: [
            require('@/assets/images/icon-alipay-white.png'),
            require('@/assets/images/icon-alipay-gray.png')
          ],
          id: 2,
          content: '支付宝支付(暂不支持)'
        }
      },
      isSend: false,
      sendCount: 180,
      codeUrl: '',
      formData: {
        rechargeType: 0,
      },
      serviceId: ''
    }
  },
  created() {
    this.$http.post('web/index/index').then(res => {
      let data = res.data.data.indexData;
      this.data = data;
      this.progress = (data.indexServiceVO.remainingTime / (Number(data.indexServiceVO.remainingTime) + Number(data.indexServiceVO.hasUsed)) * 100).toFixed(2);
      this.$store.commit('SET_STORETIME',data.indexServiceVO.remainingSecondTime);
      if(Number(data.indexServiceVO.remainingSecondTime) <= 0) {
        this.isActive = false;
      }
    })
  },
  methods: {
    showModal(id){
      this.dialogVisible = true;
      this.formData.serviceId = id;
      this.$http.post('web/service/initBuyService',{
        serviceId: id
      }).then(res => {
        this.renewData = res.data.data;
      })
    },
    checkPay(index){
      this.payIndex = index;
    },
    selectPayType(val,id) {
      if(id == 2){
        return
      }
      this.payType = val;
      this.formData.rechargeType = id;
    },
    sendCode(){
      this.$http.post('web/service/buyServiceGetSmsCode').then(res => {
        this.yfAlert('发送成功','success');
        this.isSend = true;
        let timer = setInterval(() => {
          if(this.sendCount > 0){
            this.sendCount --
          }else {
            this.isSend = false;
            this.sendCount = 180;
            clearInterval(timer);
          }
        },1000);
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    next(){
      this.payActive = 2;
      this.tableData = [this.renewData.priceMonth[this.payIndex]];
      this.formData.price = this.renewData.priceMonth[this.payIndex].price;
      this.formData.month = this.renewData.priceMonth[this.payIndex].month;
    },
    pay(){
      let formData = Object.assign({},this.formData);
      if(formData.rechargeType == 0){
          if(!formData.smsCode){
          this.yfAlert('请输入验证码','warning');
          return
        }
      }
      formData.price = formData.price * 100;
      this.$http.post('web/service/rechargeService',formData).then(res => {
        if(res.data.data && res.data.data.code_url){
          this.codeUrl = res.data.data.code_url;
          this.payActive = 3;
        }else{
          this.formData = {rechargeType: 0},
          this.dialogVisible = false;
          this.yfAlert(res.data.message,'success');
        }
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/common';
.contain{
  border-radius: 4px;
  box-sizing: border-box;
}
.survey-top{
  display: flex;
  justify-content: space-between;
  .survey-top-item{
    width: 420px;
    padding: 20px;
    box-sizing: border-box;
    border: $el-border2;
    background-color: #fff;
    border-radius: 4px;
    p{
      color: #606266;
      margin-bottom: 5px;
      font-size: 14px;
      &:first-child{
        font-size: 16px;
        font-weight: 600;
        color: #000;
      }
    }
    button{
      width: 100%;
      margin-top: 10px
    }
  }
  .survey-top-right{
    flex: 1;
    margin-left: 20px;
    ul{
      margin-top: 10px;
      height: 111px;
      overflow: auto;
      li{
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        &:hover{
          text-decoration: underline;
          cursor: pointer;
        }
        &:last-child{
          margin-bottom: 0;
        }
        >span{
          color: #606266;
          font-size: 14px;
          &:first-child{
            flex: 1;
            width: 0;
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
.survey-center{
  border: $el-border2;
  padding: 20px;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
  >p{
    color: #909399;
    font-size: 14px;
    >span:first-child{
      color: #000;
      font-size: 16px;
      font-weight: 600;
      margin-right: 20px;
    }
  }
  >ul{
    padding: 20px 50px 0;
    display: flex;
    >li{
      flex: 1;
      text-align: center;
      >p:first-child{
        color: #409EFF;
        font-size: 32px;
        margin-bottom: 10px;
      }
    }
  }
}
.survey-bottom{
  padding: 20px;
  box-sizing: border-box;
  border: $el-border2;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
  >p{
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }
  .survey-bottom-item{
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
    >p{
      color: #303133;
      margin: 10px 0;
    }
    >div{
      width: 300px;
      height: 300px;
      border: $el-border2;
      padding: 10px;
      box-sizing: border-box;
      color: #606266;
      >p{
        padding-bottom: 10px;
        border-bottom: $el-border2;
      }
      ul{
        margin-top: 10px;
        height: 135px;
        overflow: auto;
        li{
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          &:last-child{
          margin-bottom: 0;
        }
        >span{
          color: #606266;
          font-size: 14px;
          &:first-child{
            flex: 1;
            width: 0;
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
.remind-title{
  font-size: 18px;
  color: #ff0000;
  padding: 30px 0;
}
.remind-sub-title{
  font-size: 16px;
  padding-bottom: 20px;
}
.remind-info{
  padding-bottom: 10px;
  color: $el-font2;
}
.renew{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  margin-top: 20px;
  &:last-child{
    padding-bottom: 20px;
  }
  >li{
    width: 100%;
    margin-bottom: 15px;
    >span{
      font-size: 16px;
      &:first-child{
        display: inline-block;
        width: 100px;
      }
    }
    .pay-year{
      >span{
        display: inline-block;
        padding: 7px 15px;
        border: 1px solid $el-blue;
        color: $el-blue;
        cursor: pointer;
        border-radius: 4px;
        margin-right: 10px;
      }
    }
    .pay-active{
      background-color: $el-blue;
      color: #fff !important;
    }
  }
}
.pay-header{
  margin: 20px 0;
}
.pay-type{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  li{
    text-align: center;
    margin-right: 20px;
    color: $el-font3;
    cursor: pointer;
    .icon-wrap{
      width: 140px;
      height: 70px;
      border: $el-border2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      >img{
        width: 40px;
      }
    }
  }
}
.bg-blue{
  background-color: $el-blue;
  border-color: $el-blue !important;
}
.pay-active{
  color: $el-font1;
}
.pay-code{
  margin-bottom: 20px;
  .el-input{
    width: 150px;
    margin: 0 20px;
  }
}
.pay-amount{
  color: $el-blue;
  font-size: 32px;
  padding: 20px 0;
}
.pay-methods{
  padding-bottom: 10px;
  >img{
    width: 25px;
    vertical-align: middle;
    margin-right: 10px;
  }
  >span{
    font-size: 16px;
  }
}
.qr-code{
  width: 300px;
}
</style>
