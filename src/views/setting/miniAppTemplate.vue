<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/miniApp.png" alt="">
        <span>小程序设置</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.go(-1)">小程序模板</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">{{ commonTitle }}</span>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-left">
        <p class="template-title" :style="{'background-color' : formData.themeColor ? formData.themeColor : '#333'}">
          <img src="@/assets/images/template-icon-1.png" alt="">
          <span>{{ formData.pageName || '易快小程序' }}</span>
          <img src="@/assets/images/template-icon-2.png" alt="">
        </p>
        <div style="padding: 0 12px;">
          <el-carousel trigger="click" :interval="5000" height="369px" class="template-banner">
            <el-carousel-item v-if="bannerList.length > 0" v-for="(item,index) in bannerList" :key="index" class="banner-item">
              <img :src="item" alt="">
            </el-carousel-item>
            <el-carousel-item v-if="bannerList.length <= 0" class="empty-banner">
              <img src="@/assets/images/icon-upload.png">
              <p>未上传轮播图</p>
            </el-carousel-item>
          </el-carousel>
          <div class="template-btn">
            <el-button :style="{'background-color': formData.btnColor,'color': formData.btnFontColor}" type="primary"><span>外卖点餐</span></el-button>
            <el-button :style="{'background-color': formData.btnColor,'color': formData.btnFontColor}" type="primary"><span>堂食点餐</span></el-button>
          </div>
          <div class="template-icon" :style="{'background-color': formData.areaColor}">
            <div class="template-icon-item">
              <img :src="areaIconImg1" alt="">
              <p>{{ formData.areaName1 || '文字1' }}</p>
            </div>
            <div class="template-icon-item">
              <img :src="areaIconImg2" alt="">
              <p>{{ formData.areaName2 || '文字2' }}</p>
            </div>
            <div class="template-icon-item">
              <img :src="areaIconImg3" alt="">
              <p>{{ formData.areaName3 || '文字3' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-right">
        <p class="sub-header">
          <span><i class="el-icon-info"></i>首页基本信息</span>
        </p>
        <el-form :model="formData" label-position="left" label-width="150px">
          <el-form-item label="主页名称: ">
            <el-input v-model="formData.pageName" placeholder="请输入主页名称"></el-input>
          </el-form-item>
          <el-form-item label="标题背景色: ">
            <el-color-picker v-model="formData.themeColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="轮播图: ">
            <div class="img-list-wrap">
              <div class="img-list" v-for="(item,index) in bannerList" :key="index">
                <img :src="item" alt="">
                <i class="fa fa-close pointer" @click="deleteImg(index)"></i>
              </div>
              <div class="upload-img" v-if="bannerList.length < 3">
                <i class="el-icon-plus"></i>
                <input type="file" multiple="multiple" accept="image/png,image/jpg,image/jpeg,image/bmp" @change="uploadImg">
              </div>
            </div>
            <p class="form-tips">最多3张尺寸400 * 400图片</p>
          </el-form-item>
          <el-form-item label="按钮: ">
            <div class="btn-color-setting">
              <span>背景颜色: </span>
              <el-color-picker v-model="formData.btnColor"></el-color-picker>
            </div>
            <div class="btn-color-setting">
              <span>字体颜色: </span>
              <el-color-picker v-model="formData.btnFontColor"></el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="特色区域: ">
            <div class="btn-color-setting">
              <span>背景颜色: </span>
              <el-color-picker v-model="formData.areaColor"></el-color-picker>
            </div>
            <div class="btn-color-setting">
              <input-upload :imgUrl="areaIconImg1" @weiUpload="uploadSuccess1" :inputWidth="50" :inputHeight="50">
                <el-input v-model="formData.areaName1" slot="tips" placeholder="请输入图标描述" style="width:150px"></el-input>
              </input-upload>
              <input-upload :imgUrl="areaIconImg2" @weiUpload="uploadSuccess2" :inputWidth="50" :inputHeight="50">
                <el-input v-model="formData.areaName2" slot="tips" placeholder="请输入图标描述" style="width:150px"></el-input>
              </input-upload>
              <input-upload :imgUrl="areaIconImg3" @weiUpload="uploadSuccess3" :inputWidth="50" :inputHeight="50">
                <el-input v-model="formData.areaName3" slot="tips" placeholder="请输入图标描述" style="width:150px"></el-input>
              </input-upload>
            </div>
          </el-form-item>
          <el-form-item label="选择门店: " prop="level">
            <el-checkbox-group v-model="checkShopList">
              <el-checkbox :label="item.shopId" v-for="(item,index) in shopList" :key="index">{{ item.branch_name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="padding-top:20px">
            <el-button :loading="btnLoading" type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import inputUpload from '@/components/inputUpload'
export default {
  components: {
    inputUpload,
  },
  data(){
    return{
      commonTitle: '新增',
      shopList: [],
      pageId: '',
      isAdd: true,
      formData: {
        pageName: '首页',
        themeColor: '#333',
        btnColor: '#DFA143',
        btnFontColor: '#fff',
        areaColor: '#333',
        areaIconFile1: '',
        areaName1: '快速到达',
        areaIconFile2: '',
        areaName2: '会员折扣',
        areaIconFile3: '',
        areaName3: '优惠多多',
      },
      areaIconImg1: require('@/assets/images/s1.png'),
      areaIconImg2: require('@/assets/images/H2.png'),
      areaIconImg3: require('@/assets/images/D3.png'),
      bannerList: [],
      bannerFileList: [],
      iconList: [],
      checkShopList: [],
      btnLoading: false,
    }
  },
  created() {
    if(this.$route.query.id){
      this.formData.templateId = this.$route.query.id;
      this.isAdd = true;
      this.commonTitle = '新增';
      this.getShopList();
      if(this.$route.query.pageId){
        this.pageId = this.$route.query.pageId;
        this.commonTitle = '编辑';
        this.isAdd = false;
        this.getDetail();
      }
    }
  },
  methods: {
    save(){
      let form = Object.assign({},this.formData);
      if(!form.pageName){
        this.yfAlert('请输入主页名称','warning');
        return
      }
      if(this.bannerList.length <= 0){
        this.yfAlert('请上传轮播图','warning');
        return
      }
      if(this.checkShopList.length <= 0){
        this.yfAlert('请选择门店','warning');
        return
      }else {
        form.shopId = this.checkShopList.join(',');
      }
      if(!this.isAdd){
        form.pageId = this.pageId;
        if(typeof form.areaIconFile1 != 'object'){
          form.areaIcon1 = this.areaIconImg1;
        }else if(typeof form.areaIconFile2 != 'object'){
          form.areaIcon2 = this.areaIconImg2;
        }else if(typeof form.areaIconFile3 != 'object'){
          form.areaIcon3 = this.areaIconImg3;
        }
        let imgUrl = [];
        for (let i in this.bannerFileList) {
          if(typeof this.bannerFileList[i] == 'object'){
            form[`slideImg${Number(i) + 1}`] = this.bannerFileList[i];
          }else{
            imgUrl.push(this.bannerFileList[i]);
          }
        }
        if(imgUrl.length > 0){
          form.imgUrl = imgUrl.join(',');
        }
      }else{
        for (let i in this.bannerFileList) {
          form[`slideImg${Number(i) + 1}`] = this.bannerFileList[i];
        }
      }
      console.log(form)
      let formData = new FormData();
      for(let k in form) {
        if(form[k]){
          if(typeof form[k] == 'object'){
            formData.append(k, form[k], form[k].name);
          }else {
            formData.append(k, form[k]);
          }
        }
      }
      let save = (url,formData) =>{
        this.btnLoading = true;
        this.$http.post(url,formData,{
          type: 'formData'
        }).then(res => {
          this.btnLoading = false;
          this.yfAlert(res.data.message,'success');
          setTimeout(()=>{
            this.$router.go(-1);
          },1000)
        },(err) => {
          this.btnLoading = false;
          this.yfAlert(err.data.message,'error');
        })
      }
      if(this.isAdd){
        save('web/smallRoutineWeb/add/addHomePage',formData);
      }else {
        save('web/smallRoutineWeb/edit/editHomePage',formData);
      }
    },
    uploadImg(val){
      let files = val.target.files;
      if(files.length + this.bannerList.length > 3) {
        this.yfAlert('轮播图最多上传3张','error');
        return
      }
      if(files.length > 0){
        for (let i = 0; i < files.length; i++) {
          if(files[i].size > 5 * 1024 *1024){
            this.yfAlert('请上传小于5M的图片','error');
          }else {
            this.bannerFileList.push(files[i]);
            let reader = new FileReader();
            reader.readAsDataURL(files[i]);
            reader.onload = ()=> {
              this.bannerList.push(reader.result)
            };
          }
        }
      }
    },
    deleteImg(index){
      this.bannerList.splice(index,1);
      this.bannerFileList.splice(index,1);
    },
    uploadSuccess1(val,url){
      this.areaIconImg1 = url;
      this.formData.areaIconFile1 = val;
    },
    uploadSuccess2(val,url){
      this.areaIconImg2 = url;
      this.formData.areaIconFile2 = val;
    },
    uploadSuccess3(val,url){
      this.areaIconImg3 = url;
      this.formData.areaIconFile3 = val;
    },
    getShopList(){
      this.$http.post('web/smallRoutineWeb/get/getAddPageData',{
        'templateId': this.id
      }).then(res => {
        this.shopList = res.data.data.shopList;
      })
    },
    getDetail(){
      this.$http.post('web/smallRoutineWeb/get/getEditPageData',{
        templateId: this.formData.templateId,
        pageId: this.pageId
      }).then(res => {
        let data = res.data.data.tmepPageVal;
        this.$set(this.formData,'pageName',data.pageName);
        this.$set(this.formData,'themeColor',data.themeColor);
        if(data.imgUrl){
          this.bannerList = data.imgUrl.split(',');
          this.bannerFileList = data.imgUrl.split(',');
        }
        if(data.shopId){
          this.checkShopList = data.shopId.split(',');
        }
        this.$set(this.formData,'btnColor',data.btnColor);
        this.$set(this.formData,'btnFontColor',data.btnFontColor);
        this.$set(this.formData,'areaColor',data.areaColor);
        this.$set(this.formData,'areaName1',data.areaName1);
        this.$set(this.formData,'areaName2',data.areaName2);
        this.$set(this.formData,'areaName3',data.areaName3);
        if(data.areaIcon1){
          this.areaIconImg1 = data.areaIcon1;
        }
        if(data.areaIcon2){
          this.areaIconImg2 = data.areaIcon2;
        }
        if(data.areaIcon3){
          this.areaIconImg3 = data.areaIcon3;
        }
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
.detail-info{
  display: flex;
  padding: 20px;
  .detail-left{
    width: 375px;
    height: 667px;
    min-width: 375px;
    min-height: 667px;
    background: url('../../assets/images/template-bg.png') no-repeat center / 100% 100%;
    box-sizing: border-box;
    border-left: $el-border2;
    border-right: $el-border2;
    .template-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 43px;
      color: #fff;
      text-align: center;
      margin-top: 20px;
      >img:first-child{
        height: 18px;
        margin-left: 12px;
      }
      >img:last-child{
        height: 5px;
        margin-right: 12px;
      }
      >span{
        font-size: 16px;
        font-weight: 600;
      }
    }
    .template-banner{
      margin: 30px 0 10px;
      text-align: center;
      .banner-item{
        line-height: 369px;
      }
      img{
        max-height: 100%;
      }
    }
    .template-btn{
      display: flex;
      justify-content: space-between;
      >button{
        width: 48%;
        height: 50px;
        border-color: transparent;
        span{
          font-size: 16px;
        }
      }
    }
    .template-icon{
      display: flex;
      align-items: center;
      height: 80px;
      border-radius: 4px;
      background-color: #464646;
      margin-top: 8px;
      .template-icon-item{
        flex: 1;
        text-align: center;
        img{
          height: 38px;
        }
        p{
          width: 117px;
          color: #dab578;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .empty-banner{
      >img{
        margin-top: 120px;
        height: 60px;
      }
      p{
        margin-top: 10px;
        color: $el-font3;
      }
    }
  }
  .detail-right{
    flex: 1;
    padding-left: 100px;
  }
}
.sub-header{
  margin: 0;
}
.el-form{
  padding: 20px;
  .el-input{
    width: 300px;
  }
  .form-unit{
    font-size: 16px;
    margin-left: 10px;
    color: #606266;
  }
  .form-tips{
    line-height: initial;
    font-size: 13px;
    color: #909399;
    margin-top: 5px;
  }
  .btn-color-setting{
    >span{
      vertical-align: top;
      margin-right: 15px;
      color: $el-font2;
    }
  }
}
.img-list-wrap{
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
}
.img-list{
  display: inline-block;
  position: relative;
  img {
    display: block;
    width: initial;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  i{
    position: absolute;
    top: -10px;
    right: 10px;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #eee;
    background: #f05b47;
    cursor: pointer;
  }
}
.upload-img{
  display: inline-block;
  position: relative;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 4px;
  border: 1px dashed rgb(217, 217, 217);
  i {
    font-size: 24px;
    color: #8c939d;
  }
  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height:100%;
    left: 0;
    top: 0;
    cursor: pointer;
  }
}
</style>