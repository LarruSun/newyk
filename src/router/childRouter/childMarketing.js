import center from '@/views/marketing/center'
import coupon from '@/views/marketing/coupon'
import add from '@/views/marketing/addCoupon'
import storeCoupon from '@/views/marketing/storeCoupon'
import vipCoupon from '@/views/marketing/vipCoupon'
import intervalCoupon from '@/views/marketing/intervalCoupon'
import posterpCoupon from '@/views/marketing/posterCoupon'
import putVipCoupon from '@/views/marketing/putVipCoupon'
import putIntervalCoupon from '@/views/marketing/putIntervalCoupon'
import putPosterCoupon from '@/views/marketing/putPosterCoupon'

export default [
  {
    path: '/marketing/center',
    name: '营销中心',
    component: center,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon',
    name: '优惠券',
    component: coupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/add',
    name: '添加优惠券',
    component: add,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/storeCoupon',
    name: '到店领券列表',
    component: storeCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/vipCoupon',
    name: '会员领券列表',
    component: vipCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/integralCoupon',
    name: '积分兑券列表',
    component: intervalCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/posterCoupon',
    name: '海报领券列表',
    component: posterpCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/putVipCoupon',
    name: '会员送券',
    component: putVipCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/putIntervalCoupon',
    name: '积分兑券',
    component: putIntervalCoupon,
    meta: {
      parent: 'marketing'
    }
  },
  {
    path: '/marketing/center/coupon/putPosterCoupon',
    name: '海报领券',
    component: putPosterCoupon,
    meta: {
      parent: 'marketing'
    }
  },
]