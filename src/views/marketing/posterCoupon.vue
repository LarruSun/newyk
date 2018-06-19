<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/vipManage.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/marketing/center/coupon')">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">【海报领券】券列表</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>关键字: </span>
        <el-input v-model="params.posterName" placeholder="海报名称"></el-input>
      </div>
      <div class="filter-item">
        <el-button @click="getList" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column prop="posterName" label="海报名称" align="center"></el-table-column>
        <el-table-column prop="quanNum" label="券数量" align="center"></el-table-column>
        <el-table-column prop="pageView" label="浏览数" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="海报状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.statu == '1' ? '上线' : '下线' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="二维码" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.smallroutineQrcode" target="_blank">
              <img :src="scope.row.smallroutineQrcode" width="50" alt="" style="display:block;margin: 0 auto">
            </a>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="showModal(scope.row.id)">查看</el-button>
            <el-button size="mini" v-if="scope.row.statu == '1'" @click="remove(scope.row.id,'2')" type="warning">下线</el-button>
            <el-button size="mini" v-if="scope.row.statu == '2'" @click="remove(scope.row.id,'1')" type="warning">上线</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.id,'3')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :total="Number(pageTotal)" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>



    <el-dialog title="海报详情" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="true">
      <p class="sub-header coupon-header">
      <span><i class="el-icon-info"></i>优惠券基本信息</span>
      </p>
      <ul class="info-item-coupon">
        <li>
          <span>海报名称：</span>
          <span>{{ posterData.posterName }}</span>
        </li>
        <li>
          <span>封面简介：</span>
          <span>{{ posterData.introduction }}</span>
        </li>
        <li>
          <span>海报文案：</span>
          <span>{{ posterData.copywrite }}</span>
        </li>
        <li>
          <span>海报图：</span>
          <img :src="posterData.smallroutineQrcode" alt="" style="width: 150px;height:150px">
        </li>
        <li>
          <span>优惠券列表：</span>
          <span>
            <el-tag v-for="(item,index) in posterData.couponList" :key="index" style="margin-right: 10px;margin-bottom:10px">{{ item.couponsName }}</el-tag>
          </span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  created(){
    this.getList();
  },
  data(){
    return{
      tableData: [],
      tableHeight: window.innerHeight - 280,
      dialogVisible: false,
      pageCount: '',
      pageTotal: '',
      params: {
        posterName: '',
        pageNum: 1,
        pageSize: 10,
      },
      posterData: {}
    }
  },
  methods: {
    showModal(id){
      this.dialogVisible = true;
      this.$http.post('newcoupon/newcouponSev/open/get/getPosterById',{
        posterId: id
      }).then(res => {
        this.posterData = res.data.data;
      },(err) => {
        this.yfAlert(err.data.message,'error');
      })
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('newcoupon/newcouponSev/get/getPosterListByCondition',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pages;
        this.pageTotal = res.data.data.total;
        this.tableData = res.data.data.list;
        console.log(this.tableData);
      })
    },
    remove(id,status){
      var content;
      if(status == '1'){
        content = '确认上线该海报吗？';
      }else if(status == '2'){
        content = '确认下线该海报吗？';
      }else if(status == '3'){
        content = '确定要删除此海报吗？';
      }
      this.$confirm(content,'提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('newcoupon/newcouponSev/edit/editPosterStatu',{
          posterId: id,
          statu: status
        }).then(res => {
          this.yfAlert(res.data.message,'success');
          this.getList();
        },(err) => {
          this.yfAlert(err.data.message,'error')
        })
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
.filter-wrap{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  font-size: 14px;
  .filter-item{
    margin-right: 30px;
    margin-top: 20px;
    .el-input, .el-select{
      width: 150px;
    }
    >span:first-child{
      margin-right: 20px;
    }
  }
}
.coupon-header{
  margin: 20px 0;
}
.info-item-coupon{
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  &:last-child{
    padding-bottom: 20px;
  }
  >li{
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    >span:first-child{
      flex-shrink: 0;
      width: 150px;
    }
  }
}
</style>