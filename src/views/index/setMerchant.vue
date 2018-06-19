<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" active-text-color="#fdb912">
      <el-menu-item index="0">基本信息</el-menu-item>
      <el-menu-item index="1">基本设置</el-menu-item>
      <el-menu-item index="2">支付/收款</el-menu-item>
    </el-menu>
    <div class="pane-wrap">
      <ul class="pane-info" v-if="activeIndex == '0'">
        <li>
          <div class="pane-left">商家简称</div>
          <div class="pane-center">{{ info.nickName }}</div>
          <div class="pane-right">
            <el-button size="mini" type="warning" plain @click="showDialog(0)">修改</el-button>
          </div>
        </li>
        <li>
          <div class="pane-left">认证状态</div>
          <div class="pane-center">{{ info.userState | userState }}</div>
          <div class="pane-right">
            <el-button size="mini" type="warning" plain v-if="info.userState == '1'" @click="$router.push('/setMerchant/merchantApprove')">去认证</el-button>
            <el-button size="mini" type="warning" plain v-if="info.userState == '4'" @click="failDialog = true">查看</el-button>
            <el-button size="mini" type="success" plain v-else @click="dialogVisible1 = true">查看</el-button>
          </div>
        </li>
        <li>
          <div class="pane-left">商家logo</div>
          <div class="pane-center">
            <img :src="info.businessLogo" v-if="info.businessLogo">
            <p v-else>图片建议尺寸：120像素*120像素，大小不超过5M</p>
          </div>
          <div class="pane-right">
            <el-button size="mini" type="warning" plain @click="showDialog(1)">修改</el-button>
          </div>
        </li>
        <li>
          <div class="pane-left">联系人</div>
          <div class="pane-center">{{ info.contactName }}</div>
        </li>
        <li>
          <div class="pane-left">绑定手机</div>
          <div class="pane-center">{{ info.contactPhone }}</div>
          <div class="pane-right">
            <el-button size="mini" type="warning" plain>解绑</el-button>
          </div>
        </li>
        <li>
          <div class="pane-left">省市区</div>
          <div class="pane-center">{{ info.addressProvince }}-{{ info.addressCity }}-{{ info.addressArea }}</div>
          <div class="pane-right">
            <el-button size="mini" type="warning" plain @click="showDialog(3)">修改</el-button>
          </div>
        </li>
      </ul>
      <div v-if="activeIndex == '1'">
        <ul class="pane-setting">
          <li>
            <div class="pane-title">
              <span>微信公众号</span>
              <el-button size="mini" type="warning" plain>设置</el-button>
            </div>
            <div class="pane-item">
              <span>公众号头像：</span>
              <img class="avatar" src="https://img.xinzhibang168.com/FlP2KNg8boYh5JL4NBSaEm9tOE_i.jpg" alt="">
            </div>
            <div class="pane-item">
              <span>公众号名称：</span>
              <p>食北针</p>
            </div>
          </li>
          <li>
            <div class="pane-title">
              <span>微信小程序</span>
              <el-button size="mini" type="warning" plain>设置</el-button>
            </div>
            <div class="pane-item">
              <span>小程序头像：</span>
              <img class="avatar" src="https://img.xinzhibang168.com/FlP2KNg8boYh5JL4NBSaEm9tOE_i.jpg" alt="">
            </div>
            <div class="pane-item">
              <span>小程序名称：</span>
              <p>亿灵思</p>
            </div>
          </li>
          <li>
            <div class="pane-title">
              <span>短信设置</span>
              <el-button size="mini" type="warning" plain>设置</el-button>
            </div>
            <div class="pane-item">
              <span>短信签名：</span>
              <p>创意烤鸭</p>
            </div>
            <div class="pane-item">
              <span>短信余额：</span>
              <p>179</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="activeIndex == '2'">
        <ul class="pane-setting">
          <li>
            <div class="pane-title">
              <span>微信支付</span>
              <el-button size="mini" type="warning" plain>设置</el-button>
            </div>
            <div class="pane-item">
              <span>状态：</span>
              <p>已开通</p>
            </div>
            <div class="pane-item">
              <span>收款账户：</span>
              <p>62558929299178林冲</p>
            </div>
          </li>
          <li>
            <div class="pane-title">
              <span>支付宝</span>
              <el-button size="mini" type="warning" plain>设置</el-button>
            </div>
            <div class="pane-item">
              <span>状态：</span>
              <p>已开通</p>
            </div>
            <div class="pane-item">
              <span>收款账户：</span>
              <p>无</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span slot="title">{{ dialogTitle }}</span>
      <el-form :model="formData" label-position="left">
        <el-form-item label="商家简称" v-if="formIndex == '0'">
          <el-input v-model="formData.nickName"></el-input>
        </el-form-item>
        <div v-if="formIndex == '1'">
          <input-upload @weiUpload="uploadSuccess" :imgUrl="imgUrl || info.businessLogo">
            <p slot="label">上传logo</p>
            <p slot="tips">图片建议：120*120，大小不超过5M</p>
          </input-upload>
        </div>
        <el-form-item v-if="formIndex == '3'">
          <div>商家地区</div>
          <el-cascader :options="options" v-model="province" @change="handleProvince" class="region"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" >取 消</el-button>
        <el-button type="warning" @click="save">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="商家认证信息" :visible.sync="dialogVisible1" top="4%">
      <ul class="pane-info">
        <li>
          <div class="pane-left">企业全称：</div>
          <div class="pane-center">{{ info.fullName }}</div>
        </li>
        <li>
          <div class="pane-left">企业全称：</div>
          <div class="pane-center">{{ info.fullName }}</div>
        </li>
        <li>
          <div class="pane-left">营业执照编号：</div>
          <div class="pane-center">{{ info.businessLicenseNum }}</div>
        </li>
        <li>
          <div class="pane-left">营业执照：</div>
          <div class="pane-center">
            <img :src="info.businessLicenseScan"  class="authentication-img">
          </div>
        </li>
        <li>
          <div class="pane-left">真实姓名：</div>
          <div class="pane-center">{{ info.legalPersonName }}</div>
        </li>
        <li>
          <div class="pane-left">法人身份证：</div>
          <div class="pane-center">
            <img :src="info.contactCardImgSrc" class="authentication-img">
            <img :src="info.contactBackCardImgSrc" class="authentication-img">
          </div>
        </li>
      </ul>
      <div style="height:20px"></div>
    </el-dialog>
    <el-dialog title="商家认证" :visible.sync="failDialog" width="30%">
      <p>aaa</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="$router.push('/setMerchant/merchantApprove')">重新提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filters from '@/utils/filters'
import inputUpload from '@/components/inputUpload'
import { regionData,CodeToText,TextToCode } from 'element-china-area-data'
export default {
  name: 'setMerchant',
  filters: filters,
  components: {
    inputUpload
  },
  created() {
    this.getUserInfo();
  },
  data() {
    return {
      title: this.$router.currentRoute.name,
      activeIndex: '0',
      info: {},
      dialogVisible: false,
      dialogTitle: '',
      titleList: ['更改简称','更改Logo','更改手机','更改地区'],
      resource: ['updateNickName','updateLogo','','updateAddress'],
      formData: {},
      formIndex: '',
      province: [],
      imgUrl: '',
      fileImg: {
        file: {},
        name: ''
      },
      options: regionData,
      dialogVisible1: false,
      failDialog: false,
    }
  },
  methods: {
    showDialog(idx){
      this.formIndex = idx;
      this.dialogTitle = this.titleList[idx];
      this.dialogVisible = true;
      
      if(idx == '0'){
        this.formData.nickName = this.info.nickName;
        return;
      }
      if(idx == '1'){
        this.fileImg = {file: {},name: ''};
        return;
      }
      if(idx == '3') {
        this.province.push(TextToCode[this.info.addressProvince].code);
        this.province.push(TextToCode[this.info.addressProvince][this.info.addressCity].code);
        this.province.push(TextToCode[this.info.addressProvince][this.info.addressCity][this.info.addressArea].code);
        this.formData.addressProvince = this.info.addressProvince;
        this.formData.addressCity = this.info.addressCity;
        this.formData.addressArea = this.info.addressArea;
        return;
      }
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    uploadSuccess(val,url){
      this.imgUrl = url;
      this.fileImg.file = val;
      this.fileImg.name = val.name;
    },
    handleProvince(val) {
      this.formData.addressProvince = CodeToText[val[0]];
      this.formData.addressCity = CodeToText[val[1]];
      this.formData.addressArea = CodeToText[val[2]];
    },
    handleSelect(val){
      this.activeIndex = val;
    },
    save() {
      if(this.formIndex == '0') {
        if(!this.formData.nickName) {
          this.yfAlert('请填写商家简称','warning');
          return
        }else if(this.formData.nickName == this.info.nickName){
          this.yfAlert('未作修改','warning');
          return
        }else {
          var formData = Object.assign({},this.formData);
        }
      }
      if(this.formIndex == '1') {
        if(!this.fileImg.name) {
          this.yfAlert('未上传图片','warning');
          return
        }
        var formData = new FormData();
        formData.append('businessLogoFile',this.fileImg.file,this.fileImg.name);
      }
      if(this.formIndex == '3'){
        if(!this.formData.addressProvince) {
          this.yfAlert('请选择地区 ','warning');
          return
        }else if(this.formData.addressProvince == this.info.addressProvince && this.formData.addressCity == this.info.addressCity && this.formData.addressArea == this.info.addressArea){
          this.yfAlert('未作修改','warning');
          return
        }else {
          var formData = Object.assign({},this.formData);
        }
      }
      this.$http.post('web/main/edit/' + this.resource[this.formIndex],formData).then(res => {
        if(res.data.errorCode == 'success'){
          this.yfAlert('操作成功','success');
          this.getUserInfo();
          this.dialogVisible = false;
        }else {
          this.yfAlert(res.data.errorMsg,'error');
        }
      })
    },
    getUserInfo() {
      this.$http.post('web/open/user/getUserById',{
        'userId' : this.$store.getters.userId
      }).then(res => {
        if(res.data.errorCode == 'success') {
          this.info = res.data.data;
        }
      })
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
.el-menu{
  margin-top: 10px;
  border-bottom: $border;
}
.el-menu--horizontal>.el-menu-item{
  color: #666;
  height: 40px;
  line-height: 40px;
}
.pane-wrap{
  margin-top: 20px;
}
ul.pane-info{
  border: $border;
  li{
    display: flex;
    color: #666;
    font-size: 14px;
    border-bottom: $border;
    &:last-child{
      border-bottom: none;
    }
    >div{
      padding: 15px 20px;
      display: flex;
      align-items: center;
    }
    .pane-left{
      width: 13%;
    }
    .pane-right{
      width: 10%;
      justify-content: center;
    }
    .pane-center{
      flex: 1;
      img{
        display: block;
        width: 150px;
        height: inherit;
        margin-right: 20px;
      }
    }
  }
}
.pane-setting{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li{
    width: 48%;
    border: $border;
    color: #666;
    font-size: 14px;
    margin-bottom: 30px;
    >div{
      border-bottom: $border;
      &:last-child{
        border-bottom: none;
      }
    }
    .pane-title{
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f4f5f9;
    }
    .pane-item{
      padding: 15px 20px;
      display: flex;
      span{
        width: 40%;
      }
    }
  }
}
.region{
  width: 250px;
}
.avatar{
  display: block;
  width: 50px;
  height: 50px;
}
.authentication-img{
  width: 150px;
  height: inherit;
  margin-right: 20px;
}
.form-content{
  line-height: initial;
  font-size: 13px;
  color: #888;
  margin-top: 10px;
}
</style>
