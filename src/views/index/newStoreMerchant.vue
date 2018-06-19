<template>
  <div class="container">
    <p class="title">
      <router-link to="/storeManagement">门店管理</router-link>
      <i class="el-icon-arrow-right" style="font-size:14px"></i>
      <span>{{ title }}</span>
    </p>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="门店名称:">
        <el-input class="width380" v-model='form.branch_name'></el-input>
      </el-form-item>

      <el-form-item label="门店电话:">
        <el-input class="width380" v-model='form.telephone'></el-input>
      </el-form-item>

      <el-form-item label="类   目:">
        <el-select v-model="form.categories[0]" placeholder="请选择" class="width187" @change="selectCategories">
          <el-option v-for="(item,index) in seloptions1" :key="index" :label="item.class_type" :value="item.class_type"> </el-option>
        </el-select>
        <el-select v-model="form.categories[1]" placeholder="请选择" class="width187">
          <el-option v-for="(item,index) in seloptions2" :key="index" :label="item.class_type" :value="item.class_type"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="门店照片:">
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

      <el-form-item label="省/市/区:">
        <el-cascader v-model="province" placeholder="请输入省/市/区" :options="options"  @change="choseCitys"  class="width380"></el-cascader>               
      </el-form-item>
      
      <el-form-item label="详细地址:">
        <el-amap-search-box class="search-box width380" :search-option="searchOption" :on-search-result="onSearchResult" ref="searchInput"></el-amap-search-box>                    
      </el-form-item>
  
      <el-amap vid="amapDemo" :zoom="zoom" :center="mapCenter" class="height360" ref='map' :amap-manager="amapManager" :events="events">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker" :key="index"></el-amap-marker>
      </el-amap>
      
      <el-form-item class="mar-T20">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>
   </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();
export default {
  name: "newStoreMerchant",
  data() {
    return {
      amapManager,
      title: this.$router.currentRoute.name,
      dialogImageUrl: "", //图片上传
      dialogVisible: false, //图片上传
      options: regionData, //地域数据
      province:[],
      form: {
        //需要提交给后台的数据
        branch_name: "", //门店名称
        business_name: this.$store.getters.userInfo.nickName, //用户名
        province: "", //省
        city: "", //市
        district: "", //区
        address: "", //详细地址
        telephone: "", //电话
        categories: ["", ""], //类目(菜类,浙江菜)
        offset_type: 7, //7代表高德地图
        longitude: "", //坐标
        latitude: "",
      },
      seloptions1: [],
      seloptions2: [],
      zoom: 12,
      markers: [],
      searchOption: {
        city: '全部',
        citylimit: true
      },
      mapCenter: [114.085947,22.547],
      events: {
        init(o) {
          this.o=o; 
          o.setCity('深圳');
          return o;
        }
      },
      imgList: [],
      imgFileList: [],
      isAdd: true,
    };
  },
  created() {
    this.$http.get('web/system/shop/toAddBranchShop').then(res => {
      if(res.data.type == 'success') {
        let list = res.data.data.classTypes;
        for (let i = 0; i < list.length; i++) {
          if(list[i].parent_id == null) {
            this.seloptions1.push(list[i]);
          }
        }
        if(this.$route.query.id) {
          this.isAdd = false;
          this.$http.get('web/system/shop/selectBranchShopById?shopId=' + this.$route.query.id).then(res => {
            if(res.data.type == 'success'){
              let data = res.data.data.shop;
              this.form.branch_name = data.branch_name;
              this.form.telephone = data.telephone;
              if(data.categories) {
                this.form.categories = data.categories.split(',');
                this.selectCategories(this.form.categories[0]);
              }
              if(data.imgUrl) {
                this.imgList = data.imgUrl.split(',');
                for (let k in this.imgList) {
                  this.imgFileList.push(this.imgList[k]);
                }
              }
              this.province.push(TextToCode[data.province].code);
              this.province.push(TextToCode[data.province][data.city].code);
              this.province.push(TextToCode[data.province][data.city][data.district].code);
              this.events.o.setCity(data.district);
              this.form.province = data.province;
              this.form.city = data.city;
              this.form.district = data.district;
              this.form.latitude = data.latitude;
              this.form.longitude = data.longitude;
              this.form.address = data.address;
              document.querySelector('.search-box-wrapper input').value = data.address;
            }
          })
        }
      }
    })
  },
  mounted() {


  },
  methods: {
    uploadImg(val) {
      let files = val.target.files;
      if(files.length + this.imgList.length > 3) {
        this.yfAlert('门店照片最多上传3张','error');
        return
      }
      if(files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.imgFileList.push(files[i]);
          let reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = ()=> {
            this.imgList.push(reader.result)
          };
        }
      }
    },
    deleteImg(index) {
      this.imgList.splice(index,1);
      this.imgFileList.splice(index,1);
    },
    selectCategories(val) {
      this.$http.get('web/system/shop/findShopClassTypeByParent?parent=' + val).then(res => {
        if(res.data.type == 'success') {
          this.seloptions2 = res.data.data;
        }else {
          this.yfAlert(res.data.errorMsg,'error');
        }
      }, msg => {
        this.yfAlert(msg,'error');
      })
    },
    choseCitys(val) {
      this.form.province = CodeToText[val[0]]; //获取省市区
      this.form.city = CodeToText[val[1]];
      this.form.district = CodeToText[val[2]];
      this.events.o.setCity(CodeToText[val[2]]); //设置地图当前城市
      this.form.address = '';
      document.querySelector('.search-box-wrapper input').value = '';
      if(this.form.city == ('市辖区' || '县' || '')) {
        this.searchOption.city = this.form.province; //设置当前搜索城市
      }else {
        this.searchOption.city = this.form.city; //设置当前搜索城市
      }
    },
    onSearchResult(pois) {
      //地图搜索
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
      }
      this.form.longitude = pois[0].lng;
      this.form.latitude = pois[0].lat;
      this.form.address = pois[0].name;
    },
    onSubmit() {
      if(!this.form.branch_name) {
        this.yfAlert('门店名称不能为空','error');
        return;
      }
      if(!this.form.telephone) {
        this.yfAlert('门店电话不能为空','error');
        return;
      }
      if(!this.form.categories[0] || !this.form.categories[1]) {
        this.yfAlert('门店类目不能为空','error');
        return;
      }
      if(this.imgList.length <= 0) {
        this.yfAlert('门店图片不能为空','error');
        return;
      }
      if(!this.form.province || !this.form.city || !this.form.district) {
        this.yfAlert('省市区不能为空','error');
        return;
      }
      if(!this.form.address) {
        this.yfAlert('详细地址不能为空','error');
        return;
      }
      let formData = new FormData();
      let form = Object.assign({},this.form)
      for (let k in form) {
        formData.append(k,form[k]);
      }
      for (let j in this.imgFileList) {
        if(typeof(this.imgFileList[j]) == 'object') {
          formData.append('imgUrl',this.imgFileList[j]);
        }else {
          formData.append('oldimg',this.imgFileList[j]);
        }
      }
      if(!this.isAdd) {
        formData.append('id',this.$route.query.id);
      }
      this.$http.post('web/system/shop/addBranchShop',formData).then(res => {
        if(res.data.type == 'success') {
          this.yfAlert('操作成功','success');
          setTimeout(()=>{
            this.$router.push('/storeManagement');
          },1000)
        }else {
          this.yfAlert(res.data.errorMsg,'error');
        }
      })
    },
    cancel(){
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped lang="scss">
$border: 1px solid #ebeef5;
.title {
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}
.img-list-wrap{
  display: flex;
  flex-wrap: wrap;
}
.img-list{
  display: inline-block;
  position: relative;
  img {
    display: block;
    width: 120px;
    height: initial;
    margin-right: 20px;
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
  &:hover{
    border-color: #e6a23c;
  }
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
.width380 {
  width: 380px;
}
.width187 {
  width: 187px;
}
.height360 {
  height: 360px;
}
.mar-T20 {
  margin-top: 20px;
}
.el-vue-search-box-container {
  height: 40px;
  line-height: 40px;
  box-shadow: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.mar-T20{
   margin-top:20px;  
}
</style>
