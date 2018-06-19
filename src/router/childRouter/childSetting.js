import merchantApprove from '@/views/setting/merchantApprove'
import merchantInfo from '@/views/setting/merchantInfo'
import miniAppApprove from '@/views/setting/miniAppApprove'
import miniAppTemplate from '@/views/setting/miniAppTemplate'
import miniAppTempList from '@/views/setting/miniAppTempList'
import miniAppIndex from '@/views/setting/miniAppIndex'
import send from '@/views/setting/messageSend'
import pay from '@/views/setting/messagePay'
import buy from '@/views/setting/messageBuy'
import record from '@/views/setting/messageRecord'
import test from '@/views/setting/messageTest'

export default[
  {
    path: '/setting/merchantApprove',
    name: '商家认证',
    component: merchantApprove,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/merchantInfo',
    name: '商家信息',
    component: merchantInfo,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/miniAppApprove',
    name: '小程序授权',
    component: miniAppApprove,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/miniAppTempList',
    name: '小程序模板列表',
    component: miniAppTempList,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/miniAppIndex',
    name: '小程序主页设置',
    component: miniAppIndex,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/miniAppTempList/edit',
    name: '小程序模板',
    component: miniAppTemplate,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/messageSend',
    name: '发送设置',
    component: send,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/messagePay',
    name: '短信充值',
    component: pay,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/messageBuy',
    name: '短信购买',
    component: buy,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/messageRecord',
    name: '短信记录',
    component: record,
    meta: {
      parent: 'setting'
    }
  },
  {
    path: '/setting/messageTest',
    name: '短信测试',
    component: test,
    meta: {
      parent: 'setting'
    }
  },
]