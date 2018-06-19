import list from '@/views/storeManagement/list'
import addStore from '@/views/storeManagement/addStore'

export default [
  {
    path: '/storeManagement/list',
    name: '门店列表',
    component: list,
    meta: { 
      parent: 'storeManagement'
    }
  },
  {
    path: '/storeManagement/list/addStore',
    name: '快速建店',
    component: addStore,
    meta: { 
      parent: 'storeManagement'
    }
  }
]