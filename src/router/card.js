/**
 * Created by steven on 2018/8/22.
 */
module.exports = [

  //card路径begin
  {
    path: '/minecard',
    name: '我的加油卡',
    component: () => import('@/components/product/mine-card/mine-card'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecardbind',
    name: '加油卡绑定',
    component: () => import('@/components/product/mine-card/mine-card-bind'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecardrecharge',
    name: '加油卡充值',
    component: () => import('@/components/product/mine-card/mine-card-recharge'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecarddemand',
    name: '',
    component: () => import('@/components/product/mine-card/mine-card-demand'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecarddemandresult',
    name: '',
    component: () => import('@/components/product/mine-card/mine-card-demand-result'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecardexpensedemand',
    name: '消费查询',
    component: () => import('@/components/product/mine-card/mine-card-expense-demand'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mine-card-recharge-internet',
    name: '加油卡充值',
    component: () => import('@/components/product/mine-card/mine-card-recharge-internet'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/minecardinfo',
    name: '加油卡列表',
    component: () => import('@/components/product/mine-card/mine-card-info'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/minecardlist',
    name: '加油卡列表',
    component: () => import('@/components/product/mine-card/mine-card-list'),
    meta: {
      keepAlive: false
    },
  },
  //card路径end
  {
    path: '/minecardrechargeresult',
    name: '充值成功',
    component: () => import('@/components/product/mine-card/mine-card-recharge-result'),
    meta: {
      keepAlive: false
    },
  },
]

