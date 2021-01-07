module.exports = [
  //个人卡绑定 旧
  {
    path: '/refuelingCard',
    name: '加油卡绑定',
    component: () => import('@/components/fuelcard/refuelingCard'),
    meta: {
      keepAlive: false
    }
  },
  // 选择加油卡
  {
    path: '/addCard',
    name: '选择加油卡',
    component: () => import('@/components/fuelcard/addCard'),
    meta: {
      keepAlive: false
    }
  },
  // 油币
  {
    path: '/oilMoney',
    name: '油币',
    component: () => import('@/components/fuelcard/oilMoney'),
    meta: {
      keepAlive: false
    }
  },
  // 油币说明
  {
    path: '/explains',
    name: '加油卡油币',
    component: () => import('@/components/fuelcard/explains'),
    meta: {
      keepAlive: false
    }
  },
  // 充值查询
  {
    path: '/chongquerys',
    name: '充值查询',
    component: () => import('@/components/fuelcard/chongquerys'),
    meta: {
      keepAlive: false
    }
  },
  // 查询结果
  {
    path: '/queryers',
    name: '查询结果',
    component: () => import('@/components/fuelcard/queryers'),
    meta: {
      keepAlive: false
    }
  },
  // 加油卡充值
  {
    path: '/recharge',
    name: '加油卡充值',
    component: () => import('@/components/fuelcard/recharge'),
    meta: {
      keepAlive: false
    }
  },
  // 加油卡充值
  {
    path: '/rechargeer',
    name: '加油卡充值二',
    component: () => import('@/components/fuelcard/rechargeer'),
    meta: {
      keepAlive: false
    }
  },
  // 单位加油卡
  {
    path: '/company-card',
    name: '单位卡',
    component: () => import('@/components/fuelcard/bindCompanyCard'),
    meta: {
      title: '单位卡',
      keepAlive: false
    }
  },
  {
    path: '/binding-company-card',
    name: '单位油卡绑定',
    component: () => import('@/components/fuelcard/bindCompanyCard/card-binding'),
    meta: {
      title: '单位油卡绑定',
      keepAlive: false
    }
  },
  {
    path: '/binding-other-provinces',
    name: '绑定外省卡',
    component: () => import('@/components/fuelcard/bindCompanyCard/card-binding/binding-other-provinces'),
    meta: {
      title: '绑定外省卡',
      keepAlive: false
    }
  },
  {
    path: '/binding-companyCard-record',
    name: '绑卡申请记录',
    component: () => import('@/components/fuelcard/bindCompanyCard/binding-card-record'),
    meta: {
      title: '绑卡申请记录',
      keepAlive: false
    }
  },
  {
    path: '/binding-subcard',
    name: '绑定单位副卡',
    component: () => import('@/components/fuelcard/bindCompanyCard/binding-subcard'),
    meta: {
      title: '绑定单位副卡',
      keepAlive: false
    }
  },
  // 个人卡绑定 新
  {
    path: '/bind-oil-card',
    name: '加油卡绑定',
    component: () => import('@/components/fuelcard/bindOilCard/bind-oil-card'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/rights-and-interests',
    name: '权益',
    component: () => import('@/components/fuelcard/bindOilCard/rights-and-interests'),
    meta: {
      keepAlive: false
    }
  },
  // IC卡对账单
  {
    path: '/ICcard',
    name: 'IC卡',
    component: () => import('@/components/fuelcard/ICCard/ICCard'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/send-email',
    name: '发送邮箱',
    component: () => import('@/components/fuelcard/ICCard/send-email'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/history-record',
    name: '历史记录',
    component: () => import('@/components/fuelcard/ICCard/history-record'),
    meta: {
      keepAlive: false
    },
  },
//  卡车冀家-外省卡绑定
  {
    path: '/bind_provincial_card',
    name: '外省卡绑定',
    component: () => import('@/components/fuelcard/bind-provincial-card/bind-provincial-card'),
    meta: {
      keepAlive: false
    },
  },{
    path: '/bind_provincial_card_record',
    name: '外省卡绑定记录',
    component: () => import('@/components/fuelcard/bind-provincial-card/bind-provincial-card-record'),
    meta: {
      keepAlive: false
    },
  },{
    path: '/bind_provincial_record_details',
    name: '外省卡绑定记录',
    component: () => import('@/components/fuelcard/bind-provincial-card/bind-provincial-record-details'),
    meta: {
      keepAlive: false
    },
  },
]
