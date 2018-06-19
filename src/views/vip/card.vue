<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/user.png" alt="">
        <span>会员</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/vip/level')">会员等级</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">{{ commonTitle }}</span>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-left">
        <div class="card-info">
          <img :src="userInfo.businessLogo" alt="">
          <div>
            <p>{{ userInfo.nickName }}</p>
            <p>{{ formData.name || '暂无' }}</p>
          </div>
        </div>
        <div class="vip-right">
          <div class="vip-right-item">
            <img src="@/assets/images/card-icon-1.png" alt="">
          </div>
          <div class="vip-right-item" v-if="isDiscount">
            <img src="@/assets/images/card-icon-2.png" alt="">
          </div>
          <div class="vip-right-item">
            <img src="@/assets/images/card-icon-3.png" alt="">
          </div>
        </div>
      </div>
      <div class="detail-right">
        <p class="sub-header">
          <span><i class="el-icon-info"></i>会员卡基本信息</span>
        </p>
        <el-form :model="formData" label-position="left" :rules="rules" ref="ruleForm" label-width="150px">
          <el-form-item label="等级名称: " prop="name">
            <el-input placeholder="请输入等级名称" v-model="formData.name"></el-input>
            <p class="form-tips">1~16个字符，支持中英文及数字</p>
          </el-form-item>
          <el-form-item label="会员等级: " prop="level">
            <el-input type="number" placeholder="请输入等级" v-model="formData.level"></el-input>
          </el-form-item>
          <el-form-item label="最低消费: " prop="minConsumeAmount">
            <el-input placeholder="请输入金额" style="width:120px" v-model="formData.minConsumeAmount"></el-input>
            <span class="form-unit">元</span>
            <p class="form-tips">用户的累计消费达到最低消费值就会改变会员等级</p>
          </el-form-item>
          <el-form-item label="会员权益: " prop="discount">
            <el-checkbox :border="true" v-model="isDiscount">会员折扣</el-checkbox>
            <el-input type="number" v-model="formData.discount" style="width:100px;margin-left:20px" :disabled="!isDiscount"></el-input>
            <span class="form-unit">折</span>
          </el-form-item>
          <el-form-item label="使用须知: " prop="remark1">
            <el-input type="textarea" :rows="5" placeholder="使用须知" v-model="formData.remark1" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item style="padding-top:20px">
            <el-button type="primary" @click="save('ruleForm')">确认提交</el-button>
            <el-button @click="reset('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      commonTitle: '新增',
      id: null,
      formData: {},
      isDiscount: true,
      rules: {
        name: [
          { required: true, message: '请输入等级名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        minConsumeAmount: [
          { required: true, message: '请输入最低消费金额', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '请输入等级', trigger: 'blur' },
        ],
        remark1: [
          { required: true, message: '请输入使用须知', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  created() {
    if(this.$route.query.id) {
      this.id = this.$route.query.id;
      this.commonTitle = '编辑';
      this.$http.post('web/member/toEditMemberCard',{memberCardDefinedId: this.id}).then(res => {
        let data = res.data.data.memberCardDefined;
        this.$set(this.formData,'name',data.name);
        this.$set(this.formData,'level',data.level);
        this.$set(this.formData,'minConsumeAmount',Number(data.minConsumeAmount * 0.01));
        this.$set(this.formData,'remark1',data.remark1);
        if(data.discount){
          this.isDiscount = true;
          this.$set(this.formData,'discount',data.discount);
        }
      },(err) => {
        this.yfAlert(err.data.messsage,'error');
      })
    }else {
      this.id = null;
    }
  },
  methods: {
    save(formName){
      this.$refs[formName].validate((vaild) => {
        if(vaild){
          if(this.isDiscount){
            if(!this.formData.discount){
              this.yfAlert('请输入折扣','error');
              return false
            }
            if(this.formData.discount < 0 || this.formData.discount > 10){
              this.yfAlert('折扣在 0 到 10 之间','error');
              return false
            }
          }else {
            this.$delete(this.formData, 'discount');
          }
          let formData = Object.assign({}, this.formData);
          formData.minConsumeAmount = formData.minConsumeAmount * 100;
          if(this.id){
            formData.id = this.id;
          }
          this.$http.post('web/member/editMemberCardDefined',formData).then(res => {
            this.yfAlert(res.data.message,'success');
            setTimeout(() => {
              this.$router.go(-1);
            }, 500);
          }, (err) => {
            this.yfAlert(err.data.messsage,'error');
          })
        }else {
          this.yfAlert('请正确输入表单','error');
          return false
        }
      })
    },
    reset(formName){
      this.formData = {};
      this.isDiscount = true;
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.contain{
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(26,26,26,.1);
  box-sizing: border-box;
}
.detail-info{
  display: flex;
  padding: 20px;
  .detail-left{
    width: 375px;
    height: 667px;
    background: url('../../assets/images/card-bg.png') no-repeat center / 100% 100%;
    .card-info{
      display: flex;
      margin-top: 85px;
      padding: 0 60px 0 25px;
      >img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      >div{
        flex: 1;
        padding: 0 10px;
        p{
          font-size: 18px;
          color: #fff;
          &:last-child{
            display: inline-block;
            color: #E29E28;
            font-size: 12px;
            padding: 1px 5px;
            border: 1px solid #E29E28;
            border-radius: 2px;
            margin-top: 5px;
          }
        }
      }
    }
    .vip-right{
      margin-top: 202px;
      padding: 0 20px;
      display: flex;
      .vip-right-item{
        flex-shrink: 0;
        width: 50px;
        margin-right: 20px;
        >img{
          height: 50px;
        }
      } 
    }
  }
  .detail-right{
    flex: 1;
    padding-left: 100px;
  }
}
.sub-header{
  margin: 0;
}
.el-form{
  padding: 20px;
  .el-form-item{
    margin-bottom: 25px;
  }
  .el-input{
    width: 300px;
  }
  .form-unit{
    font-size: 16px;
    margin-left: 10px;
    color: #606266;
  }
  .form-tips{
    line-height: initial;
    font-size: 13px;
    color: #909399;
    margin-top: 5px;
  }
}
</style>
