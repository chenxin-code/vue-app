/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  {
    path: '/ticket_starts',
    name: 'ticket_starts',
    component: () => import('@/components/mall2/game/question/ticket-starts'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/subject',
    name: '问券调查',
    component: () => import('@/components/mall2/game/question/subject'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/evaluate',
    name: '吐槽墙',
    component: () => import('@/components/mall2/game/question/evaluate'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/submitEvaluation',
    name: '加油站评价完成',
    component: () => import('@/components/mall2/game/question/sumit'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/rule',
    name: '规则说明',
    component: () => import('@/components/mall2/game/question/rule'),
    meta: {
      keepAlive: false
    }
  },
  {
      path: '/questionlist',
    name: '问券列表',
    component: () => import('@/components/mall2/game/question/questionlist'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/historylist',
    name: '历史问券',
    component: () => import('@/components/mall2/game/question/historyList'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/questionDetail',
    name: '问券调查',
    component: () => import('@/components/mall2/game/question/questionDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oilEvaluate',
    name: '油站服务评价',
    component: () => import('@/components/mall2/game/question/oil-evaluate'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/successEvaluate',
    name: '评价成功',
    component: () => import('@/components/mall2/game/question/success-evaluate'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/debunk',
    name: '吐槽墙',//不用了，和扫码评价一样
    component: () => import('@/components/mall2/game/question/debunk-wall'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/commonEvaluate',
    name: '扫码评价',//以油站服务评价为基础写的 云南评价
    component: () => import('@/components/mall2/game/question/yunnan-evaluate'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/evaluatelist',
    name: '加油订单评价列表',//贵州评价列表
    component: () => import('@/components/mall2/game/question/evaluate-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/evaluatedetail',
    name: '加油订单评价详情',//贵州评价详情
    component: () => import('@/components/mall2/game/question/evaluate-detail'),
    meta: {
      keepAlive: false,
      title:'加油订单评价详情'
    }
  },
]
