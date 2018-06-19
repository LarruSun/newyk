<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/message.png" alt="">
        <span>短信设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">发送设置</span>
      </div>
    </div>
    <div class="sub-header">
      <span><i class="el-icon-info"></i>短信签名设置</span>
    </div>
    <div class="setting-wrap">
      <div class="message-setting">
        <div class="message-setting-left">
          <div>
            <div>
              <img src="@/assets/images/icon-message.png" alt="">
              <span>短信签名: </span>
              <span :class="messageSettingData.signText ? '' : 'font-red'">{{ messageSettingData.signText || '未设置' }}</span>
            </div>
            <el-button v-if="messageSettingData.signStatu != 'CHECKING' && messageSettingNum != 5" @click="dialogVisible = true" type="primary" size="mini">设置</el-button>
          </div>
          <div v-if="!messageSettingData.signText">
            <span>短信签名未设置,</span>
          </div>
          <div v-if="messageSettingData.signStatu == 'SUCCESS'">
            <i class="el-icon-success font-success"></i>
            <span>签名已修改{{ messageSettingNum }}次，</span>还能修改
            <span class="font-red">{{ 5 - messageSettingNum }}</span>次
          </div>
          <div v-if="messageSettingData.signStatu == 'CHECKING'">
            <i class="el-icon-warning font-warning"></i>
            <span>签名审核中</span>
          </div>
          <div v-if="messageSettingData.signStatu == 'FAIL'">
            <i class="el-icon-error font-error"></i>
            <span>审核失败,您还不能正常使用此签名</span>
          </div>
        </div>
        <div class="message-setting-right">
          <h2>签名设置</h2>
          <p>1、自定义签名字数限制为3-8个字，必须含中文，可以包含数字、英文</p>
          <p>2、建议使用你的『店铺名』或『品牌名』，使用其他签名可能短信审核不会通过！</p>
          <p>3、短信签名不宜频繁修改，最多可修改3次，请谨慎设置</p>
          <p>4、若签名内容侵犯到第三方权益必须获得第三方真实授权</p>
        </div>
      </div>
    </div>
    <div class="sub-header">
      <span><i class="el-icon-info"></i>交易物流短信提醒</span>
    </div>
    <ul class="remind-list">
      <li v-for="(item,index) in messageSettingList[0]" :key="index">
        <div>
          <p>{{ item.setName }}</p>
          <el-button type="primary" size="mini" plain round @click="messageAlert(item.text)">预览</el-button>
        </div>
        <el-switch @change="changeActive($event,item.id)" v-model="item.active" :active-value="1" :inactive-value="0"></el-switch>
      </li>
    </ul>
    <div class="sub-header">
      <span><i class="el-icon-info"></i>会员账户变动提醒</span>
    </div>
    <ul class="remind-list">
      <li v-for="(item,index) in messageSettingList[1]" :key="index">
        <div>
          <p>{{ item.setName }}</p>
          <el-button @click="messageAlert(item.text)" type="primary" size="mini" plain round>预览</el-button>
        </div>
        <el-switch @change="changeActive($event,item.id)" v-model="item.active" :active-value="1" :inactive-value="0"></el-switch>
      </li>
    </ul>
    <el-dialog title="签名设置" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="formData" label-position="left">
        <el-form-item label="原签名: " label-width="100px">
          <span>{{ messageSettingData.signText || '未设置' }}</span>
        </el-form-item>
        <el-form-item label="签名: " label-width="100px">
          <el-input placeholder="请输入签名" v-model="formData.signText" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <p class="sign-text"><span class="font-red">*</span>审核等待时间：普通通道-系统签名 30分钟(工作时间：9:00-23:00)</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
    this.getMessageSetting();
  },
  data(){
    return{
      messageSettingData: {},
      messageSettingList: [],
      messageSettingNum: '',
      value:'',
      dialogVisible: false,
      formData: {},
    }
  },
  methods: {
    save(){
      let formData = Object.assign({},this.formData);
      if(!formData.signText){
        this.yfAlert('请输入签名','warning');
        return
      }
      this.$http.post('web/sms/add/addSign',formData).then(res => {
        this.yfAlert(res.data.message,'success');
        this.dialogVisible = false;
        this.$http.post('web/index/getSmsDataByUserId').then(res => {
          this.messageSettingData = res.data.data.messageSignature;
        })
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    getMessageSetting(){
      this.$http.post('web/sms/get/smsSendSet').then(res => {
        this.messageSettingList = res.data.data;
      });
      this.$http.post('web/index/getSmsDataByUserId').then(res => {
        this.messageSettingData = res.data.data.messageSignature;
      })
      this.$http.post('web/sms/get/getReviseCount').then(res => {
        this.messageSettingNum = res.data.data.reviseCount;
      })
    },
    messageAlert(text){
      this.$alert(text,'提醒内容')
    },
    changeActive(val,id){
      this.$http.post('web/sms/edit/saveSet',{
        setId: id,
        active: val,
        sendTime: 0
      }).then(res => {
        this.yfAlert(res.data.message,'success');
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    }
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
.setting-wrap{
  padding: 0 20px;
}
.message-setting{
  display: flex;
  justify-content: space-between;
  .message-setting-left{
    padding: 10px;
    width: 280px;
    border: $el-border2;
    border-radius: 4px;
    >div{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      &:first-child{
        justify-content: space-between;
        margin-top: 0;
        >div{
          flex: 1;
          display: flex;
          align-items: center;
          >span{
            padding-right: 10px;
          }
        }
      }
    }
    img{
      width: 50px;
      margin-right: 10px;
    }
    i{
      margin-right: 10px;
    }
  }
  .message-setting-right{
    flex: 1;
    padding: 10px;
    margin-left: 50px;
    border: $el-border2;
    border-radius: 4px;
    >p{
      font-size: 13px;
      color: #606266;
    }
    >h2{
      margin-bottom: 10px;
      font-size: 16px;
    }
  }
}
.remind-list{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  >li{
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    border: $el-border2;
    border-radius: 4px;
    box-shadow: 0 0 10px #F5F5F5;
    margin-right: 20px;
    margin-bottom: 20px;
    >div:first-child{
      flex: 1;
      p{
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
  }
}
.sign-text{
  padding: 10px 0 10px 100px;
}
.font-warning{
  color: $el-warning;
}
.font-error{
  color: $el-danger;
}
.font-success{
  color: $el-success;
}
</style>
