import list from '@/views/vip/list'
import level from '@/views/vip/level'
import integralSetting from '@/views/vip/integralSetting'
import integralRecord from '@/views/vip/integralRecord'
import rechargeSetting from '@/views/vip/rechargeSetting'
import rechargeRecord from '@/views/vip/rechargeRecord'
import detail from '@/views/vip/detail'
import card from '@/views/vip/card'

export default [
  {
    path: '/vip/list',
    name: '客户列表',
    component: list,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/list/detail/:id',
    name: '会员信息',
    component: detail,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/level',
    name: '会员等级',
    component: level,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/level/card',
    name: '新增会员等级',
    component: card,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/integralSetting',
    name: '积分设置',
    component: integralSetting,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/integralRecord',
    name: '积分记录',
    component: integralRecord,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/rechargeSetting',
    name: '储值设置',
    component: rechargeSetting,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/vip/rechargeRecord',
    name: '储值记录',
    component: rechargeRecord,
    meta: { 
      parent: 'vip'
    }
  }
]