import survey from '@/views/index/survey'
import balance from '@/views/index/balance'

export default [
  {
    path: 'survey',
    name: '概况',
    component: survey,
    meta: { 
      parent: 'index'
    }
  },
  {
    path: 'balance',
    name: '账户余额',
    component: balance,
    meta: { 
      parent: 'index'
    }
  }
]