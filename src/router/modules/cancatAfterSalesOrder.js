//create by hjc 团购模块

export default [
  {
    path: '/cancatAfterSalesOrder/:id',
    name: '售后订单',
    component: () => import('@/components/cancatAfterSalesOrder/index'),
    meta: {
      keepAlive: true
    }
  },
]
