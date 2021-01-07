/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  {
    path: '/service/ticket_starts',
    name: 'service/ticket_starts',
    component: () => import('@/components/mall2/game/service-question/ticket-starts'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service/subject',
    name: '问券调查',
    component: () => import('@/components/mall2/game/service-question/subject'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service/rule',
    name: '规则说明',
    component: () => import('@/components/mall2/game/service-question/rule'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service/questionlist',
    name: '问券列表',
    component: () => import('@/components/mall2/game/service-question/questionlist'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service/historylist',
    name: '历史问券',
    component: () => import('@/components/mall2/game/service-question/historyList'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service/questionDetail',
    name: '问券调查',
    component: () => import('@/components/mall2/game/service-question/questionDetail'),
    meta: {
      keepAlive: false
    }
  }
]
