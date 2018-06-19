<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/storeManagement.png" alt="">
        <span>门店管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">门店列表</span>
      </div>
    </div>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible = true" style="margin: 20px">新建门店</el-button>
    <div>
      <ul class="store-list">
        <li v-for="(item,index) in list" :key="index">
          <img :src="getFirstImg(item.imgUrl)"  @click="goStore(item.id)" style="cursor:pointer">
          <p @click="goStore(item.id)" style="cursor:pointer">{{ item.branch_name }}</p>
          <p class="address">地址: {{ item.province + item.city + item.district + item.address}}</p>
          <div class="btn-wrap">
            <el-button size="mini" type="warning" @click="showModal(item.id)">修改</el-button>
            <el-button size="mini" type="danger" v-if="item.isEnable == '1'" @click="stop(item.id,item.branch_name,item.isEnable)">停用</el-button>
            <el-button size="mini" type="success" v-if="item.isEnable == '0'" @click="stop(item.id,item.branch_name,item.isEnable)">启用</el-button>
            <el-button size="mini" type="danger" @click="remove(item.id,item.branch_name)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>
    <div class="empty-store"  hidden>
      您目前还没有门店，点击此处快速
      <router-link to="/storeManagement/list/addStore">建店<i class="el-icon-arrow-right"></i></router-link>
    </div>
    <el-dialog title="新建门店" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" v-loading="loading" element-loading-text="拼命加载中">
      <el-form :model="formData" label-position="left" label-width="120px">
        <el-form-item label="门店名称: ">
          <el-input v-model="formData.branch_name" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="门店电话: ">
          <el-input v-model="formData.telephone" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="门店地址: ">
          <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange" class="form-input" placeholder="请选择地区"></el-cascader>
          <p><el-input v-model="formData.address" class="form-input" placeholder="详细地址" style="margin-top:10px"></el-input></p>
        </el-form-item>
        <el-form-item>
          <div slot="label">
            <p>门店照片: </p>
            <p>(最多上传3张)</p>
          </div>
          <div class="img-list-wrap">
            <div class="img-list" v-for="(item,index) in imgList" :key="index">
              <img :src="item" alt="">
              <i class="fa fa-close pointer" @click="deleteImg(index)"></i>
            </div>
            
            <div class="upload-img" v-if="imgList.length < 3">
              <i class="el-icon-plus"></i>
              <input type="file" multiple="multiple" accept="image/png,image/jpg,image/jpeg,image/bmp" @change="uploadImg">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" :loading="btnLoading">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CONFIG from '@/utils/config'
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import inputUpload from '@/components/inputUpload'
export default {
  components: {
    inputUpload
  },
  created(){
    this.getList();
  },
  data(){
    return{
      dialogVisible: false,
      formData: {
      },
      options: regionData,
      selectedOptions: [],
      imgList: [],
      imgFileList: [],
      isAdd: true,
      list: [],
      shopId: '',
      idAdd: false,
      loading: false,
      btnLoading: false,
    }
  },
  methods: {
    showModal(id){
      this.dialogVisible = true;
      if(id){
        this.shopId = id;
        this.isAdd = false;
        this.loading = true;
        this.imgList = [];
        this.imgFileList = [];
        this.$http.post('web/system/shop/selectBranchShopById',{
          shopId: id
        }).then(res => {
          this.loading = false;
          let data = res.data.data.shop;
          this.$set(this.formData,'branch_name',data.branch_name);
          this.$set(this.formData,'telephone',data.telephone);
          this.$set(this.formData,'address',data.address);
          this.$set(this.formData,'province',data.province);
          this.$set(this.formData,'city',data.city);
          this.$set(this.formData,'district',data.district);
          this.selectedOptions.push(TextToCode[data.province].code);
          this.selectedOptions.push(TextToCode[data.province][data.city].code);
          this.selectedOptions.push(TextToCode[data.province][data.city][data.district].code);
        
          if(data.imgUrl) {
            this.imgList = data.imgUrl.split(',');
            for (let k in this.imgList) {
              this.imgFileList.push(this.imgList[k]);
            }
          }
        },(err) => {
          this.yfAlert(err.data.message,'error');
          this.loading = false;
        })
      }else {
        this.isAdd = true;
      }
    },
    save(){
      let form = Object.assign({},this.formData);
      if(!form.branch_name){
        this.yfAlert('请输入门店名称','warning');
        return
      }
      if(!form.telephone){
        this.yfAlert('请输入门店电话','warning');
        return
      }
      if(!form.province || !form.city || !form.district){
        this.yfAlert('请选择门店地址','warning');
        return
      }
      if(!form.address){
        this.yfAlert('请输入详细地址','warning');
        return
      }
      if(this.imgList.length <= 0){
        this.yfAlert('请上传门店图片','warning');
        return
      }
      if(this.isAdd){
        delete form.id;
      }else {
        form.id = this.shopId;
      }
      let formData = new FormData();
      for(let k in form) {
        formData.append(k, form[k]);
      }
      for(let j in this.imgFileList){
        if(typeof(this.imgFileList[j]) == 'object') {
          formData.append('imgUrl',this.imgFileList[j],this.imgFileList[j].name);
        }else {
          formData.append('oldimg',this.imgFileList[j]);
        }
      }
      this.btnLoading = true;
      this.$http.post('web/system/shop/addBranchShop',formData,{type: 'formData'}).then(res => {
        this.yfAlert(res.data.message,'success');
        this.btnLoading = false;
        this.dialogVisible = false;
        this.getList();
      },(err) => {
        this.yfAlert(err.data.message,'error');
        this.btnLoading = false;
      })
    },

    uploadImg(val) {
      console.log(val.target.files);
      let files = val.target.files;

      if(files.length + this.imgList.length > 3) {
        this.yfAlert('门店照片最多上传3张','error');
        return
      }
      if(files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.imgFileList.push(files[i]);
          // console.log(files[i])
          let reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = ()=> {
            this.imgList.push(reader.result)
          };
        }
        console.log(this.imgFileList)
      }
    },

    deleteImg(index) {
      this.imgList.splice(index,1);
      this.imgFileList.splice(index,1);
    },
    getList(){
      this.$http.post('web/system/shop/storesManage').then(res => {
        this.list = res.data.data;
      })
    },
    getFirstImg(val){
      let list = val.split(',');
      return list[0];
    },
    handleChange(val){
      this.formData.province = CodeToText[val[0]];
      this.formData.city = CodeToText[val[1]];
      this.formData.district = CodeToText[val[2]];
    },
    stop(id,name,isEnable){
      this.$confirm(`是否${isEnable == '0' ? '启用' : '停用'}${name}？`,'提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('web/system/shop/isEnableShop',{
          shopId: id,
          isEnable: isEnable == '0' ? '1' : '0'
        }).then(res => {
          this.yfAlert(res.data.message,'success');
          this.getList();
        },(err) => {
          this.yfAlert(err.data.message,'error')
        })
      })
    },
    remove(id,name){
      this.$confirm(`是否删除${name}？`,'提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('web/system/shop/deleteBranchShop',{
          shopId: id,
        }).then(res => {
          this.yfAlert(res.data.message,'success');
          this.getList();
        },(err) => {
          this.yfAlert(err.data.message,'error')
        })
      })
    },
    goStore(id){
      window.open(CONFIG.pathApi.yfPath + 'ykcy/ykcy_html/foodList.html?shopId=' + id);
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
.store-list{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px 20px;
  li{
    width: 250px;
    height: 330px;
    padding: 30px 20px;
    border: $el-border2;
    box-sizing: border-box;
    text-align: center;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    >img{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
    p{
      color: #606266;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .address{
      font-size: 14px;
      padding-top: 10px;
      margin-bottom: 0;
    }
    .btn-wrap{
      width: 210px;
      position: absolute;
      left: 20px;
      bottom: 30px;
      display: flex;
      justify-content: space-around;
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
    height: 150px;
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
  width: 150px;
  height: 150px;
  line-height: 150px;
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
.form-input{
  width: 300px;
}
.empty-store{
  height: 500px;
  line-height: 500px;
  margin-top: 20px;
  font-size: 16px;
  background-color: #fff;
  text-align: center;
  border-radius: 4px;
  >a{
    font-size: 16px;
    margin-left: 3px;
    color: #409EFF;
    cursor: pointer;
  }
}
</style>
