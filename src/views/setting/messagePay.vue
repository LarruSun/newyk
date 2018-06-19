<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/message.png" alt="">
        <span>短信设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">短信充值</span>
      </div>
    </div>
    <div class="pay-setting">
      <div class="pay-item">
        <p class="pay-title">服务购买</p>
        <p class="pay-tips">请选择需要购买的套餐</p>
        <ul>
          <li @click="selectMessage(item.id,index)" v-for="(item,index) in messageList" :key="index">
            <div :class="formData.priceId == item.id ? 'message-active' : ''">
              <p>{{ item.num }}条短信</p>
              <p>￥{{ item.total }}元（{{ item.price }}元/条）</p>
            </div>
          </li>
        </ul>
        <!-- <p class="pay-tips">请选择需要购买的套餐包数量</p>
        <el-input-number v-model="num1" :min="1" label="描述文字"></el-input-number> -->
      </div>
      <div class="pay-item">
        <p class="pay-title">合计</p>
        <div class="pay-list">
          <p>
            <span>购买的商品</span>
            <span v-if="tableData.length > 0">短信{{ tableData[0].num }}标准包</span>
          </p>
          <!-- <p>
            <span>购买的数量</span>
            <span>1</span>
          </p> -->
        </div>
        <div class="pay-sum">
          <span>小计</span>
          <span v-if="tableData.length > 0">¥{{ tableData[0].total }}</span>
        </div>
        <div class="text-center">
          <el-button @click="showModal" type="primary">立即购买</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <p class="sub-header order-header">
        <span><i class="el-icon-info"></i>商品信息确认</span>
      </p>
      <el-table :data="tableData" border key="table">
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span>短信{{ scope.row.num }}标准包</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="单价" align="center"></el-table-column>
        <el-table-column property="num" label="数量" align="center"></el-table-column>
        <el-table-column property="total" label="小计" align="center">
          <template slot-scope="scope">
            <span>¥{{ scope.row.total }}</span>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pay">立即支付</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单支付" :visible.sync="payDialogVisible" width="30%" :close-on-click-modal="false">
      <div class="text-center">
        <p style="font-size:16px">扫一扫付款(元)</p>
        <p class="pay-amount" v-if="tableData.length > 0">¥{{ tableData[0].total }}</p>
        <p class="pay-methods">
          <img :src="payTypeList[payType].icon[1]" alt="">
          <span>{{ payTypeList[payType].content }}</span>
        </p>
        <div class="text-center">
          <qrcode :value="codeUrl" :options="{ size: 170 }"></qrcode>
        </div>
        <p style="padding-bottom:20px">
          <el-button  @click="payDialogVisible = false" type="primary">取消</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Qrcode from '@xkeshi/vue-qrcode'
export default {
  created(){
    this.$http.post('web/sms/get/getSmsPrice').then(res => {
      this.messageList = res.data.data;
    })
  },
  components:{
    qrcode: Qrcode
  },
  data(){
    return{
      messageList: [],
      tableData: [],
      formData: {
        rechargeType: 0,
      },
      dialogVisible: false,
      payDialogVisible: false,
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
      codeUrl: ''
    }
  },
  methods: {
    selectMessage(id,index){
      this.formData.priceId = id;
      this.tableData = [],
      this.tableData.push(this.messageList[index]);
    },
    selectPayType(val,id) {
      if(id == 2){
        return
      }
      this.payType = val;
      this.formData.rechargeType = id;
    },
    showModal(){
      if(this.tableData.length <= 0){
        this.yfAlert('请选择购买套餐','warning');
        return
      }
      this.dialogVisible = true;
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
    pay(){
      let formData = Object.assign({},this.formData);
      if(formData.rechargeType == 0){
          if(!formData.smsCode){
          this.yfAlert('请输入验证码','warning');
          return
        }
      }else {
        formData.smsCode = -1;
      }
      this.$http.post('web/sms/add/rechargeSms',formData).then(res => {
        this.dialogVisible = false;
        if(res.data.data.code_url){
          this.codeUrl = res.data.data.code_url;
          this.payDialogVisible = true;
        }else{
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
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(26,26,26,.1);
  box-sizing: border-box;
}
.pay-setting{
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .pay-item{
    width: 48%;
    border: $el-border2;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    &:last-child{
      height: max-content;
    }
    .pay-title{
      font-size: 16px;
      color: #303133;
      padding-bottom: 10px;
      border-bottom: $el-border2;
      font-weight: 600;
    }
    .pay-tips{
      margin: 20px 0;
      font-size: 14px;
      color: #303133;
    }
    >ul{
      display: flex;
      flex-wrap: wrap;
      >li{
        width: 33.3%;
        padding: 10px;
        box-sizing: border-box;
        >div{
          line-height: 20px;
          text-align: center;
          padding: 10px;
          border: $el-border2;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
    .pay-list{
      margin: 20px 0;
      p{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    .pay-sum{
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-top: $el-border2;
      >span{
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
.message-active{
  background-color: $el-blue;
  color: #fff;
  border: 1px solid #fff !important;
}
.order-header{
  margin: 20px 0 0 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
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