<template>
  <div class="contain">
    <div class="authentication authentication-warning" v-if="miniAppData.isAuth != 'true'">
      <i class="el-icon-warning"></i>
      <span>您的账户尚未绑定小程序 !</span>
    </div>
    <el-card class="box-card" v-if="miniAppData.isAuth == 'true'">
      <div class="miniApp-info">
        <img :src="userInfo.businessLogo" alt="">
        <div class="miniApp-info-left">
          <p>小程序主页: <span>{{ miniAppData.pageName }}</span></p>
          <p>绑定时间: <span>{{ miniAppData.bindTime }}</span></p>
        </div>
        <div class="miniApp-info-center">
          <p>审核状态: <span>{{ getCheckStatu(miniAppData.checkStatu) }}</span></p>
        </div>
        <div class="miniApp-info-right">
          <el-button @click="dialogVisible = true" type="primary" size="small">访问小程序</el-button>
        </div>
      </div>
    </el-card>
    <div class="table-wrap">
      <p>
        <el-button type="primary" size="small" @click="$router.push('/setting/miniAppTempList')">创建新模板</el-button>
      </p>
      <el-table :data="tableData" border>
        <el-table-column prop="pageName" label="主页名称" align="center"></el-table-column>
        <el-table-column label="使用模板" align="center">
          <template slot-scope="scope">
            <span>{{ `${scope.row.typeName || ''}  ${scope.row.template_name || ''}` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bindStatu == 0 ? '未绑定' : '已绑定' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="pageView" label="浏览量" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-button :disabled="miniAppData.isAuth == 'fail'" @click="$router.push('/setting/miniAppTempList/edit?id=' + scope.row.templateId + '&pageId=' + scope.row.pageId)" type="warning" size="mini">编辑</el-button>
            <el-button :disabled="miniAppData.isAuth == 'fail'" @click="bindMiniApp(scope.row.id,scope.row.wxTemplateId)" type="primary" size="mini">{{ scope.row.bindStatu == 0 ? '绑定' : '重新绑定'}}</el-button>
            <el-button :disabled="miniAppData.isAuth == 'fail'" v-if="scope.row.bindStatu == 0" @click="remove(scope.row.pageId)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :total="Number(pageTotal)" :page-count="Number(pageCount)" :current-page.sync="params.page" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog title="小程序二维码" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="true">
      <div class="text-center">
        <p>请用微信扫一扫，查看此小程序</p>
        <img :src="miniAppData.qrCode" alt="" width="250" style="padding:20px 0">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  created(){
    this.getDetail();
    this.getList();
  },
  computed: {
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  data(){
    return{
      miniAppData: {},
      tableData: [],
      pageCount: '',
      pageTotal: '',
      params: {
        page: 1,
        pageSize: 10,
      },
      dialogVisible: false
    }
  },
  methods: {
    getDetail(){
      this.$http.post('web/smallRoutine/get/getSmallRoutineInfo').then(res => {
        this.miniAppData = res.data.data;
      })
    },
    getList(){
      this.$http.post('web/smallRoutine/get/getTemplateList',this.filterParams(this.params)).then(res => {
        this.tableData = res.data.data.list;
        this.pageCount = res.data.data.pageAll;
        this.pageTotal = res.data.data.countAll;
      })
    },
    getCheckStatu(val){
      let list = {
        '0': '审核成功',
        '1': '审核失败',
        '2': '微信审核中',
        '-1': '接口调用失败'
      }
      return list[val]
    },
    bindMiniApp(id,templateId){
      this.$confirm('确认绑定该模板？','提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('smallroutine/smallRoutine/edit/submitCheck',{
          wxUserSmallroutineId: id,
          wxTemplateId: templateId,
        }).then(res => {
          this.yfAlert(res.data.message,'success');
          this.getList();
        },(err) => {
          this.yfAlert(err.data.message,'error')
        })
      })
    },
    remove(id){
      this.$confirm('确认删除该模板？','提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('web/smallRoutineWeb/delete/deleteHomePage',{
          pageId: id,
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
.miniApp-info{
  display: flex;
  padding: 20px;
  >img{
    width: 70px;
    height: 70px;
    border-radius: 4px;
  }
  *{
    font-size: 16px;
  }
  .miniApp-info-left{
    margin-left: 20px;
    line-height: 35px;
    >p{
      >span{
        margin-left: 10px;
      }
    }
  }
  .miniApp-info-center{
    margin-left: 250px;
    line-height: 70px;
  }
  .miniApp-info-right{
    flex: 1;
    line-height: 70px;
    text-align: right;
  }
}
.table-wrap{
  margin-top: 10px;
  padding: 20px 20px 0;
  background-color: #fff;
  .el-table{
    margin-top: 10px;
  }
}
.authentication{
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.authentication>i{
  margin-right: 10px;
}
.authentication-success{
  color:#55bf20;
  background-color: #dffbcf;
  border: 1px solid #e1f3e8;
}
.authentication-warning{
  color: #f99e17;
  background-color: #ffecd2;
  border: 1px solid #faecd8;
}
</style>
