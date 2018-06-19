<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/message.png" alt="">
        <span>短信设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">短信测试</span>
      </div>
    </div>
    <p class="test-tips">短信剩余: {{ messageData.messageSurplus }}条</p>
    <div class="test-wrap">
      <div class="test-item">
        <p class="test-title">发送对象</p>
        <div class="test-info">
          <p>
            <span>短信签名：</span>
            <span>{{ messageData.messageSignature.signText }}</span>
            <!-- <el-button type="primary" size="mini" style="margin-left:20px" @click="dialogVisible = true">设置</el-button> -->
          </p>
          <p>
            <span>手机号码：</span>
            <el-input v-model="formData.phone" size="small"></el-input>
          </p>
        </div>
        <div class="test-btn">
          <el-button :disabled="isValid" @click="sendMessage" type="primary">发送测试短信</el-button>
        </div>
      </div>
      <div class="test-item">
        <p class="test-title">短信效果</p>
        <div class="test-info" style="padding: 30px 0">
          <p>
            <span>测试模板：</span>
            <el-select v-model="formData.code" placeholder="请选择" size="small" style="width:150px" @change="getContent" clearable @clear="templateContent = ''">
              <el-option v-for="(item,index) in templateList" :label="item.templateName" :value="item.id" :key="index"></el-option>
            </el-select>
          </p>
          <div class="message-template">
            <p>{{ templateContent }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="签名设置" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="formData" label-position="left">
        <el-form-item label="原签名: " label-width="100px">
          <span>未设置</span>
        </el-form-item>
        <el-form-item label="签名: " label-width="100px">
          <el-input placeholder="请输入签名" v-model="formData.textarea" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <p class="sign-text"><span class="font-red">*</span>审核等待时间：普通通道-系统签名 30分钟(工作时间：9:00-23:00)</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  created(){
    this.$http.post('web/index/getSmsDataByUserId').then(res => {
      this.messageData = res.data.data;
    })
    this.$http.post('web/sms/get/smsSendTempletList').then(res => {
      this.templateList = res.data.data.list;
    })
  },
  computed: {
    isValid(){
      if(this.messageData.messageSignature.signStatu == "SUCCESS"){
        return false
      }
      return true
    }
  },
  data(){
    return{
      dialogVisible: false,
      templateList: [],
      formData: {},
      messageData: {
        messageSignature: {}
      },
      params: {},
      templateContent: '',
    }
  },
  methods: {
    getContent(val){
      if(val){
        this.templateList.forEach((item)=> {
          if(item.id == val){
            this.templateContent = item.text;
            return
          }
        })
      }
    },
    sendMessage(){
      let formData = Object.assign({},this.formData);
      if(!formData.phone){
        this.yfAlert('请输入手机号','warning');
        return
      }
      this.$http.post('web/sms/add/testSend',this.filterParams(formData)).then(res => {
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
.test-tips{
  padding: 20px 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: $el-font1;
}
.test-wrap{
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  .test-item{
    width: 400px;
    border: $el-border2;
    border-radius: 4px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding: 20px;
    .test-title{
      font-size: 16px;
      color: #303133;
      padding-bottom: 10px;
      border-bottom: $el-border2;
      font-weight: 600;
    }
    .test-info{
      width: 300px;
      margin: 0 auto;
      padding-top: 40px;
      >p{
        margin-bottom: 40px;
        >span:first-child{
          display: inline-block;
          width: 100px;
        }
        .el-input{
          width: 150px;
        }
      }
    }
    .test-btn{
      text-align: center;
    }
    .message-template{
      width: 300px;
      min-height: 90px;
      border-radius: 10px;
      margin: 0 auto;
      background-color: #ECF5FF;
      padding: 20px;
      box-sizing: border-box;
      position: relative;
      &::after{
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        position: absolute;
        left: -20px;
        top: 15px;
        border: 10px solid #ECF5FF;
        border-left-color: transparent;
        border-top-color: transparent;
        border-bottom-color: transparent;
      }
      >p{
        color: $el-blue;
      }
    }
  }
}
.sign-text{
  padding: 10px 0 10px 100px;
}
</style>