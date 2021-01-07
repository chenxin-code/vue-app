module.exports = [
  {
    path: '/electronic_card',
    name: '我的电子卡',
    component: ()=> import('@/components/product/electronic-card/electronic-card')
  },
  {
    path: '/electronic_refund',
    name: '申请退款',
    component: ()=> import('@/components/product/electronic-card/electronic-refund')
  },{
    path: '/electronic_refund_result',
    name: '申请退款',
    component: ()=> import('@/components/product/electronic-card/electronic-refund-result')
  },
  {
    path: '/balance_change_details',
    name: '退款明细',
    component: ()=> import('@/components/product/electronic-card/balance-change-details')
  }
]