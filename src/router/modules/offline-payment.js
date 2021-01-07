export default [
  {
    path: '/offline_payment/payment_type',
    name: 'payment_type',
    component: () => import('@/views/offline-payment/client/payment-type'),
    meta: {
      title: '支付类型',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/oil_pay',
    name: 'oil_pay',
    component: () => import('@/views/offline-payment/client/oil-pay'),
    meta: {
      title: '加油支付',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/confirm_bill',
    name: 'confirm_bill',
    component: () => import('@/views/offline-payment/client/confirm-bill'),
    meta: {
      title: '确认账单',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/payment_voucher',
    name: 'payment_voucher',
    component: () => import('@/views/offline-payment/client/payment-voucher'),
    meta: {
      title: '加油支付凭证',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/bill_details',
    name: 'bill_details',
    component: () => import('@/views/offline-payment/client/bill-details'),
    meta: {
      title: '确认账单',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/goods_pay',
    name: 'bill_details',
    component: () => import('@/views/offline-payment/client/goods-pay'),
    meta: {
      title: '商品支付',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/offline_payment_record',
    name: 'offline_payment_record',
    component: () => import('@/views/offline-payment/employees/offline-payment-record'),
    meta: {
      title: '离线支付记录',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/oil_record_details',
    name: 'oil_record_details',
    component: () => import('@/views/offline-payment/employees/oil-record-details'),
    meta: {
      title: '交易记录详情',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/bill_index',
    name: 'bill_index',
    component: () => import('@/views/offline-payment/client/bill-index'),
    meta: {
      title: '离线支付凭证',
      keepAlive: false
    }
  },
  {
    path: '/offline_payment/pay_success',
    name: 'pay_success',
    component: () => import('@/views/offline-payment/client/pay-success'),
    meta: {
      title: '查看账单',
      keepAlive: false
    }
  },
]
