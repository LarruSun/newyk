<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <div class="header">
      <router-link to="/storeManagement/newStoreMerchant"><el-button type="warning">新建门店</el-button></router-link>
      <!-- <el-cascader :options="options" v-model="province" @change="handleProvince" class="region"></el-cascader> -->
      <el-input v-model="branch_name" placeholder="请输入分店名称" style="width:150px;margin:0 5px 0 30px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getStore">搜索</el-button>
    </div>
    <ul class="store-list" v-loading="loading" element-loading-text="加载中">
      <li v-for="(item,index) in list" :key="index">
        <div>
          <div class="store-item">
            <i class="icon-store"></i>
            <div class="store-info">
              <p class="store-name">
                <span :title="item.business_name + item.branch_name">{{item.business_name}}({{item.branch_name}})</span>
                <span :title="item.categories">{{item.categories}}</span>
              </p>
              <p class="store-phone">
                <i class="fa fa-phone"></i>
                <span :title="item.telephone">电话: {{item.telephone}}</span>
              </p>
            </div>
          </div>
          <div class="store-address">
            <i class="el-icon-location"></i>
            <p :title="item.province + item.city + item.district + item.address">地址: {{item.province}}{{item.city}}{{item.district}}{{item.address}}</p>
          </div>
          <div class="store-btn">
            <el-button type="warning" size="mini" @click="update(item.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="remove(item.id)">删除</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { regionData,CodeToText,TextToCode } from 'element-china-area-data'
export default {
  name: 'storeManagement',
  created() {
    this.getStore();
  },
  data() {
    return {
      title: this.$router.currentRoute.name,
      options: regionData,
      branch_name: '',
      list: [],
      loading: true,
    }
  },
  methods: {
    getStore(){
      this.$http.get('web/system/shop/storesManage').then(res => {
        if(res.data.type == 'success'){
          this.list = res.data.data;
        }
      }, msg => {
        this.yfAlert(res.data.message,'error');
      }).finally(()=>{
        this.loading = false;
      })
    },
    update(id) {
      this.$router.push('/storeManagement/newStoreMerchant?id=' + id);
    },
    remove(id) {
      this.$confirm('确认删除门店吗','提示',{
        'type' : 'warning'
      }).then(()=> {
        this.$http.post('web/system/shop/deleteBranchShop',{'shopId': id}).then((res)=>{
          if(res.body.type=='success') {
            this.yfAlert('删除成功','success');
            this.getStore();
          }else {
            this.yfAlert(res.data.errorMsg,'error');
          }
        })
      })
    },
    handleProvince() {
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
.header{
  display: flex;
  align-items: center;
  margin: 20px 0 10px;
}
ul.store-list{
  display: flex;
    flex-wrap: wrap;
  li{
    display: flex;
    width: 33.3%;
    >div{
      width: 100%;
      padding: 15px;
      margin: 15px;
      border: $border;
      .store-item{
        display: flex;
        .store-info{
          flex: 1;
          width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          .store-name{
            >span{
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:first-child{
                width: 125px;
              }
              &:last-child{
                width: 70px;
                text-align: center;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 12px;
                padding: 2px;
                border: 1px solid #d47878;
                color: #d47878;
              }
            }
          }
          .store-phone{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child{
              color: #999;
              font-size: 14px;
            }
          }
        }
      }
      .store-address{
        display: flex;
        align-items: center;
        color: #999;
        margin: 10px 0;
        font-size: 14px;
        p{
          width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .store-btn{
        display: flex;
        justify-content: space-around;
        border-top: $border;
        padding-top: 10px;
      }
    }
  }
}
.icon-store{
  display: inline-block;
  width: 44px;
  height: 50px;
  background: url('../../assets/images/icon-store.png') no-repeat center / 44px 40px;
  margin-right: 10px;
}
</style>
