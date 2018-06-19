<template>
  <div class="contain">
    <div class="common-title">
      <div>
        <img src="@/assets/images/marketing.png" alt="">
        <span @click="$router.push('/marketing/center')">营销中心</span>
        <i class="el-icon-arrow-right"></i>
        <span @click="$router.push('/marketing/center/coupon')">优惠券列表</span>
        <i class="el-icon-arrow-right"></i>
        <span class="active-title">制作海报</span>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-left">
        <div class="poster-bg" :style="{'backgroundImage': 'url(' + bgImg + ')'}"></div>
        <p class="poster-title">{{ formData.posterName || '海报'}}</p>
        <div class="poster-coupon-bg">
          <div class="poster-coupon-list">
            <div class="coupon-item" v-for="(item,index) in checkCoupons" :key="index">
              <div v-if="item.couponsType == '1'">¥{{ item.vouchers | formartAmount }}</div>
              <div v-if="item.couponsType == '2'">{{ item.discount + '折' }}</div>
              <div>
                <p>{{ item.couponsType == '1' ? '优惠' : '折扣' }}</p>
                <p>抵扣</p>
              </div>
            </div>
          </div>
          <img :src="qrcode" class="qrcode">
          <div class="store-info">
            <img :src="userInfo.businessLogo" alt="">
            <p>{{ userInfo.nickName }}</p>
          </div>
        </div>
      </div>
      <div class="detail-right">
        <p class="sub-header">
          <span><i class="el-icon-info"></i>海报设置</span>
        </p>
        <el-form :model="formData" label-position="left" :rules="rules" ref="ruleForm" label-width="150px">
          <el-form-item label="海报名称: " prop="posterName">
            <el-input placeholder="请输入海报名称" v-model="formData.posterName"></el-input>
            <p class="form-tips">1~16个字符，支持中英文及数字</p>
          </el-form-item>
          <el-form-item label="封面简介: " prop="introduction">
            <el-input placeholder="请输入封面简介" v-model="formData.introduction"></el-input>
            <p class="form-tips">通过微信分享时，会显示页面简述</p>
          </el-form-item>
          <el-form-item label="海报文案: " prop="copywrite">
            <el-input v-model="formData.copywrite" type="textarea" :rows="4" placeholder="使用须知" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="海报图: ">
            <input-upload :imgUrl="bgImg" @weiUpload="uploadSuccess"></input-upload>
          </el-form-item>
          <el-form-item label="优惠券选择: ">
            <el-button @click="showModal" type="primary" size="small">添加优惠券</el-button>
            <p class="check-coupons" style="padding-top:10px">
              <el-tag @close="removeCoupon(index)" closable="" v-for="(coupon,index) in checkCoupons" :key="index">{{coupon.couponsName}}</el-tag>
            </p>
          </el-form-item>
          <el-form-item>
            <el-button :loading="btnLoading" type="primary" @click="save('ruleForm')">确认提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="优惠券选择(最多选择4张)" :visible.sync="dialogVisible" top="4%" width="60%" :close-on-click-modal="false">
      <p class="check-coupons" v-if="coupons.length > 0">
        <span>已选择: </span>
        <el-tag v-for="(tag,index) in coupons" :key="index">{{tag.couponsName}}</el-tag>
      </p>
      <el-table :row-key="getCouponId" ref="couponsData" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column prop="id" :reserve-selection="true" type="selection" align="center"></el-table-column>
        <el-table-column prop="couponsName" label="名称" align="center"></el-table-column>
        <el-table-column label="券类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponsType | getCouponType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="面额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.couponsType == '1'">¥{{ scope.row.vouchers | formartAmount }}</span>
            <span v-if="scope.row.couponsType == '2'">{{ scope.row.discount + '折' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" width="230">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate + ' 至 ' + scope.row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.putStatu | getPutStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放数/领取数/使用数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.countNum + '/' + scope.row.receiveNum + '/' + scope.row.useNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="券状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.statu | getCouponStatus }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="loadMore" :page-count="Number(pageCount)" :total="Number(pageTotal)" :current-page.sync="params.pageNum" :page-size="params.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCoupons">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import inputUpload from '@/components/inputUpload'
import filters from '@/utils/filters'
import mixin from '@/utils/mixin'
export default {
  mixins: [mixin],
  filters: filters,
  components: {
    inputUpload,
  },
  created(){

  },
  data(){
    return{
      couponId: '',
      tableData: [],
      formData: {},
      rules: {
        posterName: [
          { required: true, message: '请输入海报名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入封面简介', trigger: 'blur' },
        ],
        copywrite: [
          { required: true, message: '请输入海报文案', trigger: 'blur' },
        ],
      },
      bgImg: require('@/assets/images/poster-bg-3.png'),
      bgFileImg: '',
      dialogVisible: false,
      pageTotal: '',
      pageCount: '',
      params:{
        pageNum: 1,
        pageSize: 10,
        statu: 1
      },
      coupons: [],
      checkCoupons: [],
      qrcode: require('@/assets/images/fingerprint.png'),
      btnLoading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  created() {
    if(this.$route.query.id) {
      this.couponId = this.$route.query.id;
      this.getList();
    }
  },
  methods: {
    save(formName){
      this.$refs[formName].validate((vaild) => {
        if(vaild){
          let form = Object.assign({}, this.formData);
          if(this.checkCoupons.length <= 0){
            this.yfAlert('请选择优惠券','warning');
            return
          }else{
            let list = [];
            this.checkCoupons.forEach((item)=>{
              list.push(item.id);
            })
            form.couponIds = list.join(',');
          }
          let formData = new FormData();
          for (let k in form) {
            formData.append(k, form[k]);
          }
          if(!this.bgFileImg){
            formData.append('imageFile',this.bgFileImg,this.bgFileImg.name);
          }
          this.btnLoading = true;
          this.$http.post('web/newcouponWeb/putCouponByPoster',formData,{
            type: 'formData'
          }).then(res => {
            this.btnLoading = false;
            this.yfAlert(res.data.message,'success'); 
            setTimeout(()=> {
              this.$router.push('/marketing/center/coupon/posterCoupon');
            },500)
          },(err) => {
            this.yfAlert(err.data.message,'error');
          })
        }else {
          this.yfAlert('请正确输入表单','error');
          return false
        }
      })
    },
    uploadSuccess(val,url){
      this.bgImg = url;
      this.bgFileImg = val;
    },
    getList(){
      this.$http.post('newcoupon/newcouponSev/get/getCouponListByCondition',this.filterParams(this.params)).then(res => {
        this.tableData = res.data.data.list;
        this.pageCount = res.data.data.pages;
        this.pageTotal = res.data.data.total;
      })
    },
    getCouponId(row){
      return row.id
    },
    handleSelectionChange(rows){
      this.coupons = rows;
    },
    showModal(){
      this.dialogVisible = true;
      this.coupons = [];
      setTimeout(() => {
        this.$refs.couponsData.clearSelection();
      },200)
    },
    removeCoupon(index){
      this.checkCoupons.splice(index,1);
    },
    saveCoupons(){
      if(this.coupons.length + this.checkCoupons.length > 4){
        this.yfAlert('优惠券最多不超过4张','warning');
        return
      }
      this.dialogVisible = false;
      this.checkCoupons = [...this.checkCoupons,...JSON.parse(JSON.stringify(this.coupons))];
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
.detail-info{
  display: flex;
  padding: 20px;
  .detail-left{
    width: 375px;
    height: 667px;
    background: url('../../assets/images/poster-bg-1.png') no-repeat center / 100% 100%;
    box-sizing: border-box;
    position: relative;
    .poster-bg{
      position: absolute;
      width:375px;
      height:603px;
      margin-top: 64px;
      background-size: contain;
    }
    .poster-title{
      margin-top: 34px;
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
    .poster-coupon-bg{
      width: 266px;
      height: 500px;
      margin: 60px auto 0;
      background: url('../../assets/images/poster-bg-2.png') no-repeat center / 100% 100%;
      position: relative;
      z-index: 2;
      .poster-coupon-list{
        width: 200px;
        height: 102px;
        margin: 0 auto;
        padding-top: 50px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        .coupon-item{
          width: 88px;
          height: 41px;
          background: url('../../assets/images/coupon-bg.png') no-repeat center / 100% 100%;
          display: flex;
          margin-bottom: 10px;
          >div:first-child{
            font-size: 12px;
            width: 58px;
            line-height: 41px;
            padding-left: 10px;
            box-sizing: border-box;
          }
          >div:last-child{
            >p{
              margin-top: 2px;
              font-size: 12px;
            }
          }
        }
      }
      .qrcode{
        display: block;
        width: 110px;
        margin: 0 auto;
        padding-top: 50px;
      }
      .store-info{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 33px;
        color: #fff;
        >img{
          width: 25px;
          height: 25px;
          margin-right: 10px;
          border-radius: 50%;
          border: 1px solid #fff;
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
.check-coupons{
  margin-bottom: 10px;
  >span{
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
