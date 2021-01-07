/**
 * Created by LiRui on 2019/6/20.
 */
export default [
  {
    path: '/usercenter/loginbinding',
    name: '注册登录',
    component: () => import('../views/login/wechat-login'),
    meta: {
      title: '注册登录'
    }
  },
  // 加油卡绑定
  {
    path: '/addCard',
    name: '加油卡列表',
    component: () => import('../views/oilCard/oilCardList.vue'),
    meta: {
      title: '加油卡列表'
    }
  },
  {
    path: '/refuelingCard',
    name: '个人卡绑定',
    component: () => import('../views/oilCard/bindPersonCard.vue'),
    meta: {
      title: '个人卡绑定'
    }
  },
  {
    path: '/bindUnitCard',
    name: '单位卡绑定',
    component: () => import('../views/oilCard/bindUnitCard.vue'),
    meta: {
      title: '单位卡绑定'
    }
  },
  {
    path: '/subCardList',
    name: '副卡列表',
    component: () => import('../views/oilCard/subCardList.vue'),
    meta: {
      title: '副卡列表'
    }
  },
  {
    path: '/oilmoneyDistribution',
    name: '油币分配',
    component: () => import('../views/oilCard/oilmoneyDistribution.vue'),
    meta: {
      title: '油币分配'
    }
  },
  {
    path: '/bindCardRecord',
    name: '绑卡申请记录',
    component: () => import('../views/oilCard/bindCardRecord.vue'),
    meta: {
      title: '绑卡申请记录'
    }
  }
]
