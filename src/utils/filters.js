const USERSTATE = {
  '0' : '初始商户',
  '1' : '未认证',
  '2' : '审核中',
  '3' : '已认证',
  '4' : '未通过'
}

function getUserState(state) {
  return USERSTATE[state]
}

const ORDERSTATUS = {
  'all' : '全部',
  'MEMBER_DEPOSIT' : '会员充值',
  'MEMBER_DEDUCT' : '会员支付扣款',
}

const DEALSTATUS = {
  'all' : '全部',
  'MEMBER_DEPOSIT' : '会员充值',
  'WAIMAI' : '外卖/退款',
}

const COUPONTYPE = {
  'all' : '全部',
  '1' : '代金券',
  '2' : '折扣券',
}

function getCouponType(status){
  return COUPONTYPE[status]
}

const PUTSTATUS = {
  'all' : '全部',
  '1' : '已投放',
  '2' : '待投放',
}

function getPutStatus(status){
  return PUTSTATUS[status]
}

const COUPONSTATUS = {
  'all' : '全部',
  '1' : '正常',
  '2' : '已失效',
  '3' : '已删除',
}

function getCouponStatus(status){
  return COUPONSTATUS[status]
}

const FOODRANGE = {
  '0' : '所有菜品'
}

function getFoodRange(status){
  return FOODRANGE[status]
}

const STORERANGE = {
  '0' : '全部门店'
}

function getStoreRange(status){
  return STORERANGE[status]
}

const USELIMIT = {
  '1' : '不可与其他优惠同享',
  '2' : '可与其他优惠同享'
}

function getUseLimit(status){
  return USELIMIT[status]
}

const PUTMETHODS = {
  "DAODIANLINGQUAN": "到店领券",
  "HUIYUANSONGQUAN": "会员送券",
  "JIFENDUIQUAN": "积分兑券",
  "HAIBAOLINGQUAN": "海报领券",
  'all' : '全部',
}

function getPutMethods(status){
  return PUTMETHODS[status]
}

const PAYSTATUS = {
  '1': '未支付',
  '2': '已支付',
}

function getPayStatus(status){
  return PAYSTATUS[status]
}

const TRADETYPE = {
  "DEPOSIT": "商家充值",
  "DEDUCT": "商家支付扣款",
  "WITHDRAW": "商家提现扣款",
  "FROZEN": "冻结",
  "UNFROZEN": "解冻结",
  "WAIMAI": "外卖",
  "TUIKUAN": "退款",
  "TANGSHI": "堂食",
  "SMSBUY": "短信购买",
  "SERVICEBUY": "服务购买",
  "MEMBERRECHARGE": "会员充值",
  "Err": "未知",
  "DISANFANGPEISONG": "第三方配送",
  "MEMBER_DEDUCT": "会员支付扣款",
}

function getTradeType(status){
  return TRADETYPE[status]
}

function formartDate(param){
  let date = new Date(param);
  let Y = date.getFullYear() + '-';
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

function formartAmount(param){
  return (param * 0.01).toFixed(2);
}

export default {
  getUserState: getUserState,
  formartDate: formartDate,
  formartAmount: formartAmount,
  ORDERSTATUS: ORDERSTATUS,
  DEALSTATUS: DEALSTATUS,
  COUPONTYPE: COUPONTYPE,
  PUTSTATUS: PUTSTATUS,
  COUPONSTATUS: COUPONSTATUS,
  USELIMIT: USELIMIT,
  PUTMETHODS: PUTMETHODS,
  PAYSTATUS: PAYSTATUS,
  TRADETYPE: TRADETYPE,
  getCouponType: getCouponType,
  getPutStatus: getPutStatus,
  getCouponStatus: getCouponStatus,
  getFoodRange: getFoodRange,
  getStoreRange: getStoreRange,
  getUseLimit: getUseLimit,
  getPutMethods: getPutMethods,
  getPayStatus: getPayStatus,
  getTradeType: getTradeType
};
