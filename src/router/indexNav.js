export default {
  index: [
    {
      title: '概况',
      path: '/index/survey',
      icon: require('@/assets/images/survey.png'),
    },
    {
      title: '账户余额',
      path: '/index/balance',
      icon: require('@/assets/images/balance.png'),
    },
  ],
  storeManagement: [
    {
      title: '门店管理',
      icon: require('@/assets/images/storeManagement.png'),
      child: [
        {
          path: '/storeManagement/list',
          name: '门店列表',
        }
      ]
    }
  ],
  vip: [
    {
      title: '会员管理',
      icon: require('@/assets/images/vipManage.png'),
      child: [
        {
          path: '/vip/list',
          name: '客户列表',
        },
        {
          path: '/vip/level',
          name: '会员等级',
        }
      ]
    },
    {
      title: '积分管理',
      icon: require('@/assets/images/integral.png'),
      child: [
        {
          path: '/vip/integralSetting',
          name: '积分设置',
        },
        {
          path: '/vip/integralRecord',
          name: '积分记录',
        }
      ]
    },
    {
      title: '储值管理',
      icon: require('@/assets/images/recharge.png'),
      child: [
        {
          path: '/vip/rechargeSetting',
          name: '储值设置',
        },
        {
          path: '/vip/rechargeRecord',
          name: '储值记录',
        }
      ]
    },
    
  ],
  marketing: [
    {
      title: '营销中心',
      path: '/marketing/center',
      icon: require('@/assets/images/marketing.png'),
    },
  ],
  setting: [
    {
      title: '商家设置',
      icon: require('@/assets/images/merchant.png'),
      child: [
        {
          path: '/setting/merchantApprove',
          name: '商家认证'
        },
        {
          path: '/setting/merchantInfo',
          name: '商家信息'
        }
      ]
    },
    {
      title: '小程序设置',
      icon: require('@/assets/images/miniApp.png'),
      child: [
        {
          path: '/setting/miniAppApprove',
          name: '小程序授权'
        },
        {
          path: '/setting/miniAppIndex',
          name: '小程序主页设置'
        },
        {
          path: '/setting/miniAppTempList',
          name: '小程序模板'
        }
      ]
    },
    {
      title: '短信设置',
      icon: require('@/assets/images/message.png'),
      child: [
        {
          path: '/setting/messageSend',
          name: '发送设置',
        },
        {
          path: '/setting/messagePay',
          name: '短信充值',
        },
        {
          path: '/setting/messageBuy',
          name: '购买记录',
        },
        {
          path: '/setting/messageRecord',
          name: '短信记录',
        },
        {
          path: '/setting/messageTest',
          name: '短信测试',
        },
      ]
    },
  ]
};
