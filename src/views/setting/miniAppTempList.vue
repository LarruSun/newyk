<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/miniApp.png" alt="">
        <span>小程序设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">小程序模板</span>
      </div>
    </div>
    <ul class="template-list">
      <li v-for="(item,index) in list" :key="index">
        <img :src="item.showImg" alt="">
        <p>
          <span>{{ item.template_name }}</span>
          <el-button @click="$router.push('/setting/miniAppTempList/edit?id=' + item.id)" type="primary" size="mini">使用</el-button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import filters from '@/utils/filters'
export default {
  filters: filters,
  created(){
    this.getList();
  },
  data(){
    return{
      list: [],
    }
  },
  methods: {
    getList(){
      this.$http.post('smallroutine/smallRoutine/getTemplatesListByTypeNameAndTypeId').then(res => {
        this.list = res.data.data.templateList;
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
.template-list{
  display: flex;
  flex-wrap: wrap;
  padding: 20px 20px 40px;
  li{
    position: relative;
    border: $el-border1;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    padding: 20px 40px 70px;
    margin-right: 20px;
    margin-bottom: 20px;
    >img{
      display: block;
      width: 250px;
    }
    >p{
      position: absolute;
      width: calc(100% - 80px);
      bottom: 20px;
      left: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      >span{
        flex: 1;
        width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>