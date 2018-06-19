<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/message.png" alt="">
        <span>短信设置</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">短信记录</span>
      </div>
    </div>
    <div class="filter-wrap">
      <div class="filter-item">
        <span>发送时间: </span>
        <el-date-picker @change="selectDate" v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
      <div class="filter-item">
        <span>手机号: </span>
        <el-input v-model="params.phone" placeholder="请输入手机号码"></el-input>
      </div>
      <div class="filter-item">
        <span>状态: </span>
        <el-select @change="getList" v-model="params.statu" placeholder="请选择">
          <el-option value="all" label="全部"></el-option>
          <el-option v-for="(item,index) in sendStatusList" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <div class="table-wrap" v-loading="tableLoading" element-loading-text="拼命加载中">
      <el-table :data="tableData" border :height="tableHeight" class="table">
        <el-table-column width="180" prop="sendTime" label="发送时间" align="center"></el-table-column>
        <el-table-column width="140" prop="sendPhone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="sendText" label="短信内容" align="center"></el-table-column>
        <el-table-column width="120" prop="sendStatus" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ sendStatusList[scope.row.sendStatus] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :total="Number(pageTotal)" :page-count="Number(pageCount)" :current-page.sync="params.page" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <ul class="message-detail">
        <li>
          <span>状态</span>
          <span>成功</span>
        </li>
        <li>
          <span>手机号</span>
          <span>13888888888</span>
        </li>
        <li>
          <span>发送时间</span>
          <span>2018-04-8 12:13:15</span>
        </li>
        <li>
          <span>发送内容：</span>
          <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/utils/mixin'
import filters from '@/utils/filters'
export default {
  mixins: [mixin],
  created(){
    this.getList();
  },
  data(){
    return{
      sendStatusList: {'0' : '成功','1' : '失败'},
      dialogVisible: false,
      tableData: [],
      tableHeight: window.innerHeight - 280,
      dateRange: [],
      pageCount: '',
      pageTotal: '',
      params: {
        startDate: '',
        endDate: '',
        page: 1,
        pageSize: 20,
      },
    }
  },
  methods: {
    selectDate(){
      if(this.dateRange && this.dateRange.length > 0){
        this.params.startDate = this.dateRange[0];
        this.params.endDate = this.dateRange[1];
      }else{
        this.params.startDate = "";
        this.params.endDate = "";
      }
      this.getList();
    },
    getList(){
      this.tableLoading = true;
      this.$http.post('web/sms/get/sendRecord',this.filterParams(this.params)).then(res => {
        setTimeout(()=>{
          this.tableLoading = false;
        },200);
        this.pageCount = res.data.data.pageAll;
        this.pageTotal = res.data.data.countAll;
        this.tableData = res.data.data.list;
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
.message-detail{
  li{
    display: flex;
    margin-bottom: 10px;
    >span:first-child{
      width: 100px;
      flex-shrink: 0;
    }
  }
}
</style>