import home from '@/views/home'
import childIndex from '@/router/childRouter/childIndex'
import childStoreManagement from '@/router/childRouter/childStoreManagement'
import childVIP from '@/router/childRouter/childVIP'
import childMarketing from '@/router/childRouter/childMarketing'
import childSetting from '@/router/childRouter/childSetting'

export default [
  {
    path: '/index',
    name: '首页',
    redirect: '/index/survey',
    component: home,
    children:childIndex,
    meta: { 
      parent: 'index'
    }
  },
  {
    path: '/storeManagement',
    name: '门店',
    redirect: '/storeManagement/list',
    component: home,
    children: childStoreManagement,
    meta: { 
      parent: 'storeManagement'
    }
  },
  {
    path: '/vip',
    name: '会员',
    redirect: '/vip/list',
    component: home,
    children: childVIP,
    meta: { 
      parent: 'vip'
    }
  },
  {
    path: '/marketing',
    name: '营销',
    redirect: '/marketing/center',
    component: home,
    children: childMarketing,
    meta: { 
      parent: 'marketing'
    }
  },
  {
    path: '/setting',
    name: '设置',
    redirect: '/setting/merchantApprove',
    component: home,
    children: childSetting,
    meta: { 
      parent: 'setting'
    }
  },
]