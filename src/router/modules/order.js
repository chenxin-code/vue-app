//create by hjc 团购模块

export default [
  // order 新
  {
    path: '/order',
    name: '我的订单',
    component: () => import('@/components/order/index'),
    meta: {
      keepAlive: false
    },
    redirect: "/order/allOrder",
    children: [{
        path: '/order/allOrder',
        name: '全部',
        component: () =>
          import('@/components/order/allOrder/allOrder.vue'),
        meta: {
          title: '全部',
          keepAlive: false
        }

      },
      {
        path: '/order/waitPay',
        name: '待支付',
        component: () =>
          import('@/components/order/waitPay/waitPay.vue'),
        meta: {
          title: '待支付',
          keepAlive: false
        }

      },
      {
        path: '/order/waitDelivery',
        name: '待发货',
        component: () =>
          import('@/components/order/waitDelivery/waitDelivery.vue'),
        meta: {
          title: '待发货',
          keepAlive: false
        }

      },
      {
        path: '/order/waitTakeDelivery',
        name: '待收货',
        component: () =>
          import('@/components/order/waitTakeDelivery/waitTakeDelivery.vue'),
        meta: {
          title: '待收货',
          keepAlive: false
        }

      },
      {
        path: '/order/finish',
        name: '已完成',
        component: () =>
          import('@/components/order/finish/finish.vue'),
        meta: {
          title: '已完成',
          keepAlive: false
        }

      },
      {
        path: '/order/cancel',
        name: '已取消',
        component: () =>
          import('@/components/order/cancel/cancel.vue'),
        meta: {
          title: '已取消',
          keepAlive: false
        }

      },
    ]
  }
]
