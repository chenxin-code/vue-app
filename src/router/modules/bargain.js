export default [
    {
      path: '/bargain/home',
      name: '砍价',
      component: () => import('@/views/bargain'),
      meta: {
        title: '砍价',
        keepAlive: false
      }
    },
    {
      path: '/bargain/prodetail',
      name: '砍价商品详情',
      component: () => import('@/views/bargain/common/pro-detail.vue'),
      meta: {
        title: '砍价商品详情',
        keepAlive: false
      }
    },
    {
      path: '/bargain/bargain_details',
      name: '砍价详情',
      component: () => import('@/views/bargain/common/bargain-details.vue'),
      meta: {
        title: '砍价详情',
        keepAlive: true
      }
    },
    {
      path: '/bargain/my_bargainList',
      name: '我的砍价',
      component: () => import('@/views/bargain/common/my-bargainList.vue'),
      meta: {
        title: '我的砍价',
        keepAlive: false
      }
    },
    {
      path: '/bargain/rules',
      name: '规则说明',
      component: () => import('@/views/bargain/common/rules.vue'),
      meta: {
        title: '规则说明',
        keepAlive: false
      }
    }
  ]
