<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
}
ul {
  list-style: none;
}
::-webkit-scrollbar {
  /* display: none; */
  width: 0px;
  height: 8px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #FFF;
}
::-webkit-scrollbar-thumb{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #eee;
}
a {
  text-decoration: none;
  color: #000;
}
.text-center{
  text-align: center;
}
.text-right{
  text-align: right;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.font-red{
  color: #ff0000;
}
.common-title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #E4E7ED;
  box-sizing: border-box;
}
.common-title img{
  width: initial;
  height: initial;
  vertical-align: sub;
  margin-right: 15px;
}
.common-title>div>span{
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.common-title>div>span:nth-child(2){
  cursor: default;
}
.common-title .active-title{
  color: #409EFF;
}
.common-title i{
  margin: 0 5px;
}
.table-wrap{
  padding: 20px 20px 0;
}
.sub-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  padding: 5px 20px;
  border: 1px solid #ebeef5;
  background-color: #edf2fc;
  color: #606266;
  border-radius: 4px;
}
.sub-header>span{
  font-size: 16px;
}
.sub-header>span>i{
  padding-right: 10px;
}
button,input[type='button']{
  outline: none;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.dialog-agreement{
  width: 1100px;
}
/* element样式修改 */
.el-message-box{
  vertical-align: initial;
}
.el-dialog__body{
  padding: 0 20px;
}
.el-card__body{
  padding: 0;
}
.el-progress-bar__innerText{
  margin: 0 5px 5px 0;
}
.el-pagination{
  padding: 15px 20px;
}
.el-form-item{
  margin-bottom: 10px;
}
.el-dialog{
  border-radius: 4px;
}
.el-tabs__nav-wrap::after{
  background-color: transparent;
}
.el-dialog__header{
  border-bottom: 1px solid #E4E7ED;
  margin-bottom: 20px;
}
.el-table td{
  padding: 8px 0;
}
.el-table th{
  background: #f5f7fa;
}
.el-transfer-panel{
  width: 300px;
}
.el-transfer-panel__body{
  height: 346px;
}
.el-dropdown-menu__item{
  text-align: center;
}
.el-message{
  top: 30px;
}
/* 地图样式 */
.search-tips{
  border: none !important;
}
.search-btn{
  display: none !important;;
}
.el-vue-search-box-container .search-tips ul li{
  box-shadow: none !important;
  height: 35px !important;
  line-height: 35px !important;
  border-bottom: 1px solid #ebeef5 !important;
}
</style>
