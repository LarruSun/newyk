<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/user.png" alt="">
        <span>会员</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/vip/list')">客户列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">会员详情</span>
      </div>
    </div>
    <div class="vip-info">
      <p class="sub-header">
        <span><i class="el-icon-info"></i>基本信息</span>
        <el-button type="primary" size="mini" plain @click="showModal('updateInfo','编辑基本信息')">编辑信息</el-button>
      </p>
      <ul class="info-item">
        <li>
          <span>名称:</span>
          <span>{{ data.userName }}</span>
        </li>
        <li>
          <span>性别:</span>
          <span>{{ data.sex }}</span>
        </li>
        <li>
          <span>手机号码:</span>
          <span>{{ data.phone }}</span>
        </li>
        <li>
          <span>生日:</span>
          <span>{{ data.birthday }}</span>
        </li>
        <li>
          <span>首次来源:</span>
          <span>{{ `${data.platformName} ( ${data.createDate} )` }}</span>
        </li>
        <li>
          <span>备注：</span>
          <span>{{ data.remark }}</span>
        </li>
      </ul>
      <p class="sub-header">
        <span><i class="el-icon-info"></i>资产信息</span>
        <el-button type="primary" size="mini" plain @click="showModal('integralUpdate','修改积分')">修改积分</el-button>
      </p>
      <ul class="info-item">
        <li>
          <span>余额:</span>
          <span>{{ data.account }}</span>
        </li>
        <li>
          <span>积分:</span>
          <span>{{ data.integral }}</span>
        </li>
        <li>
          <span>会员等级:</span>
          <span>{{ data.cardName }}</span>
        </li>
        <li>
          <span>卡号:</span>
          <span>{{ data.cardNo }}</span>
        </li>
      </ul>
      <p class="sub-header">
        <span><i class="el-icon-info"></i>交易信息</span>
      </p>
      <ul class="info-item">
        <li>
          <span>交易次数:</span>
          <span>{{ data.totalCount }}</span>
        </li>
        <li>
          <span>交易总额:</span>
          <span>{{ (data.totalConsume * 0.01).toFixed(2) }}</span>
        </li>
        <li>
          <span>平均订单金额:</span>
          <span>{{ (data.averageConsume * 0.01).toFixed(2) }}</span>
        </li>
        <li>
          <span>上次交易时间:</span>
          <span>{{ data.consumeTime }}</span>
        </li>
      </ul>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="formData" label-position="left">
        <div v-if="mark == 'updateInfo'">
          <el-form-item label="性别: " label-width="120px">
            <el-radio v-model="sex" label="男">男</el-radio>
            <el-radio v-model="sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="生日: " label-width="120px" prop="birthday">
            <el-date-picker v-model="formData.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注: " label-width="120px">
            <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="formData.remark" style="width:300px"></el-input>
          </el-form-item>
        </div>
        <div v-if="mark == 'integralUpdate'">
          <el-form-item label="积分数额: " label-width="120px">
            <el-select v-model="integralSelect" placeholder="请选择" style="width:100px">
              <el-option label="赠送" value="1"></el-option>
              <el-option label="扣除" value="2"></el-option>
            </el-select>
            <el-input type="number" placeholder="输入积分(只能为整数)" style="width:200px" v-model="formData.total"></el-input>
          </el-form-item>
          <el-form-item label="操作说明: " label-width="120px">
            <el-input type="textarea" :rows="2" placeholder="请输入操作说明" v-model="formData.remark" style="width:300px"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()" :loading="saveLoding">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
    if(this.$route.params.id){
      this.id = this.$route.params.id;
      this.getDetail();
    }
  },
  data(){
    return{
      id:'',
      data: {},
      mark: '',
      dialogVisible: false,
      dialogTitle: '',
      formData: {
        birthday: ''
      },
      sex: '男',
      saveLoding: false,
      integralSelect: '1',
    }
  },
  methods: {
    showModal(mark, title){
      this.formData = {};
      this.mark = mark;
      this.dialogTitle = title;
      this.dialogVisible = true;
      let data = Object.assign({},this.data);
      if(mark == 'updateInfo'){
        this.sex = data.sex;
        this.formData.birthday = data.birthday;
        this.formData.remark = data.remark;
        return
      }
    },
    getDetail(){
      this.$http.post('web/member/getMemberCustomerById',{'id': this.id}).then(res => {
        this.data = res.data.data;
      })
    },
    save(){
      let formData = Object.assign({},this.formData);
      if(this.mark == 'updateInfo'){
        if(!this.formData.birthday) {
          this.yfAlert('请选择生日', 'warning');
          return
        }
        if(!this.formData.remark) {
          this.yfAlert('请输入备注', 'warning');
          return
        }
        formData.id = this.id;
        formData.sex = this.sex;
        this.saveLoding = true;
        this.saveReq('web/member/upCustomerBasicInformation',formData);
      }
      if(this.mark == 'integralUpdate'){
        if(!this.formData.total){
          this.yfAlert('请输入积分', 'warning');
          return
        }
        if(!this.formData.remark){
          this.yfAlert('请输入操作说明', 'warning');
          return
        }
        if(this.integralSelect == '2'){
          formData.total = formData.total * (-1);
        }
        this.saveLoding = true;
        formData.customerId = this.id;
        this.saveReq('web/member/operationIntegral',formData);
      }
    },
    saveReq(url,formData){
      this.$http.post(url,formData).then(res => {
        this.saveLoding = false;
        this.dialogVisible = false;
        this.getDetail();
        this.yfAlert(res.data.message, 'success');
      },(err) => {
        this.yfAlert(res.data.message, 'error');
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
.info-item{
  display: flex;
  flex-wrap: wrap;
  padding: 0 40px;
  &:last-child{
    padding-bottom: 20px;
  }
  >li{
    width: 50%;
    margin-bottom: 15px;
    >span:first-child{
      display: inline-block;
      width: 100px;
    }
  }
}
.el-form-item{
  margin-bottom: 10px;
}
</style>
