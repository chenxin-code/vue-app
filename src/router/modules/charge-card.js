/**
 * Created by DongMj on 2019/3/27.
 */
module.exports = [
    // 充值
  {
    path: '/recharge/recharge-card',
    name: '易捷卡',
    component: () => import('@/views/recharge/recharge-card/index.vue'),
    meta: {
      title: '充值卡',
      keepAlive: true
    }
  },
  {
    path: '/recharge/card-details',
    name: '充值卡详情',
    component: () => import('@/views/recharge/recharge-card/card-details.vue'),
    meta: {
      title: '充值卡详情',
      keepAlive: true
    }
  },
  {
    path: '/recharge/recharge-result',
    name: '充值卡-充值结果',
    component: () => import('@/views/recharge/recharge-card/result.vue'),
    meta: {
      title: '充值结果',
      keepAlive: false
    }
  },
  {
    path: '/recharge/recharge-details',
    name: '充值详情-充值卡',
    component: () => import('@/views/recharge/recharge-card/details.vue'),
    meta: {
      title: '充值详情',
      keepAlive: false
    }
  },
  {
    path: '/recharge/transaction-details',
    name: '交易明细',
    component: () => import('@/views/recharge/transaction-details/transaction-details.vue'),
    meta: {
      title: '交易明细',
      keepAlive: false
    }
  },
  // 计次
  {
    path: '/recharge/recharge-count',
    name: '计次卡',
    component: () => import('@/views/recharge/recharge-count/index.vue'),
    meta: {
      title: '计次卡',
      keepAlive: false
    }
  },
    {
    path: '/recharge/count-card-details',
    name: '计次卡详情',
    component: () => import('@/views/recharge/recharge-count/count-details.vue'),
    meta: {
      title: '计次卡详情',
      keepAlive: false
    }
  },
  {
    path: '/recharge/count-details',
    name: '充值详情-计次卡',
    component: () => import('@/views/recharge/recharge-count/details.vue'),
    meta: {
      title: '充值详情',
      keepAlive: false
    }
  },
  {
    path: '/recharge/count-result',
    name: '计次卡-充值结果',
    component: () => import('@/views/recharge/recharge-count/result.vue'),
    meta: {
      title: '充值结果',
      keepAlive: false
    }
  },
  {
    path: '/recharge/my-card',
    name: '我的卡包',
    component: () => import('@/views/recharge/my-card/index.vue'),
    meta: {
      title: '我的卡包',
      keepAlive: false
    }
  },
]
