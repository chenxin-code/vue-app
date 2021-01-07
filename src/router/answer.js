/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  {
    path: '/answer_starts',
    name: 'answer_starts',
    component: () => import('@/components/mall2/game/answer/answer-starts'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/answer',
    name: '每日答题',
    component: () => import('@/components/mall2/game/answer/answer'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/rule',
    name: '规则说明',
    component: () => import('@/components/mall2/game/answer/rule'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/answerlist',
    name: '问券列表',
    component: () => import('@/components/mall2/game/answer/answerlist'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/answerHistory',
    name: '历史问券',
    component: () => import('@/components/mall2/game/answer/answerHistory'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/answerDetail',
    name: '每日答题',
    component: () => import('@/components/mall2/game/answer/answerDetail'),
    meta: {
      keepAlive: false
    }
  }
]
