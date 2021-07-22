//create by hjc 团购模块

export default [
  {
    path: '/concatAfterSalesOrder/:id',
    name: '售后订单',
    component: () => import('@/components/concatAfterSalesOrder/index'),
    meta: {
      keepAlive: true
    }
  },
]
