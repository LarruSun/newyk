<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <ul class="nav-wrap">
      <li v-for="(item,index) in nav" :key="index" ref="navNode" @click="switchTab(index)">
        <img :src="item.src" alt="">
        <p>{{ item.text }} {{ item.num }}</p>
      </li>
      <div class="nav-active" :style="{'width' : navWidth + 'px', 'transform' : 'translateX(' + (navWidth * navActive) + 'px)'}"></div>
    </ul>
    <el-table :data="tableData" border class="table" :height="tableHeight">
      <el-table-column prop="date" label="序号" align="center"></el-table-column>
      <el-table-column prop="date" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="date" label="终端号" align="center"></el-table-column>
      <el-table-column prop="date" label="设备型号" align="center"></el-table-column>
      <el-table-column prop="date" label="设备类型" align="center"></el-table-column>
      <el-table-column prop="date" label="设备状态" align="center"></el-table-column>
      <el-table-column prop="date" label="操作" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'myEquipment',
  created() {
    
  },
  mounted(){
    this.navWidth = this.$refs.navNode[0].offsetWidth;
  },
  data() {
    return {
      title: this.$router.currentRoute.name,
      nav: [
        {'src' : 'https://www.eaqul.com:443/resources/images/equipment/equment1.png' ,'num' : '1','text' : '总数'},
        {'src' : 'https://www.eaqul.com:443/resources/images/equipment/equment2.png' ,'num' : '2','text' : '在线'},
        {'src' : 'https://www.eaqul.com:443/resources/images/equipment/equment3.png' ,'num' : '3','text' : '离线'},
        {'src' : 'https://www.eaqul.com:443/resources/images/equipment/equment4.png' ,'num' : '4','text' : '无源'},
      ],
      navWidth: 0,
      navActive: '',
      tableData: [
      ],
      tableHeight: window.innerHeight - 400,
    }
  },
  methods: {
    switchTab(val) {
      this.navActive = val;
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
ul.nav-wrap{
  display: flex;
  align-items: center;
  background-color: #ebeef5;
  position: relative;
  margin-top: 15px;
  li{
    flex: 1;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 50px;
      height: 50px;
    }
    p{
      margin-left: 10px;
    }
  }
  .nav-active{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 25%;
    height: 2px;
    background-color: #fdb912;
    transform: translateX(0);
    transition: transform .3s cubic-bezier(.645,.045,.355,1);
  }
}
.table{
  margin-top: 15px;
}
</style>
