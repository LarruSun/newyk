<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/vipManage.png" alt="">
        <span>会员管理</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">会员等级</span>
      </div>
      <el-button type="primary" size="small" @click="$router.push('/vip/level/card')">添加会员等级</el-button>
    </div>
    <div class="tips">
      <p><span class="font-red">*</span>温馨提示</p>
      <p>会员等级按照商家设置的最低消费金额自动升级</p>
      <p>用户的累计消费达到最低消费值就会改变会员等级</p>
      <p>若删除会员卡等级，等级下绑定的用户的等级会重新计算，<span class="font-red">请谨慎操作</span></p>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column prop="level" label="等级" align="center"></el-table-column>
        <el-table-column prop="name" label="等级名称" align="center"></el-table-column>
        <el-table-column label="最低消费" align="center">
          <template slot-scope="scope">
            {{ (scope.row.minConsumeAmount * 0.01).toFixed(0 ) }}
          </template>
        </el-table-column>
        <el-table-column label="会员折扣" align="center">
          <template slot-scope="scope">
            {{ scope.row.discount + '折' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="$router.push('/vip/level/card?id=' + scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
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
      tableHeight: window.innerHeight - 316,
      pageCount: '',
      params:{
        pageNum: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    loadMore(){

    },
    getList(){
      this.tableLoading = true;
      this.$http.post('web/member/MemberCardDefinedList',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.page;
        this.tableData = res.data.data.list;
      })
    },
    remove(id){
      this.$confirm('若删除该会员卡等级，已绑定该等级的用户，将重新计算会员卡等级','提示',{
        'type' : 'warning'
      }).then(res => {
        this.$http.post('web/member/delMemberCardDefinedById',{cardDefinedId: id}).then(res => {
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
  padding: 20px 20px 10px;
  font-size: 14px;
  .filter-item{
    margin-right: 30px;
    margin-bottom: 10px;
    .el-input, .el-select{
      width: 150px;
    }
    >span:first-child{
      margin-right: 20px;
    }
  }
}
.tips{
  padding: 20px;
  color: #606266;
}
.table-wrap{
  padding: 0 20px;
}
</style>
