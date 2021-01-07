export default [
  {
    path: '/auction_session',
    name: '拍卖专场',
    component: () => import('@/components/mall2/auction/price-reduction/auction-session.vue'),
    meta: {
      title: '拍卖专场',
      keepAlive: false
    }
  },
  {
    path: '/my_auction',
    name: '我的竞拍',
    component: () => import('@/components/mall2/auction/price-reduction/my-auction.vue'),
    meta: {
      title: '我的竞拍',
      keepAlive: false
    }
  },
  {
    path: '/auction_order_detail/:id',
    name: '订单详情',
    component: () => import('@/components/mall2/auction/price-reduction/order-detail.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/auction_fill_order',
    name: '填写订单',
    component: () => import('@/components/mall2/auction/price-reduction/auction-order.vue'),
    meta: {
      title: '填写订单',
      keepAlive: false
    }
  },
  {
    path: '/auction_transaction_record',
    name: '成交记录',
    component: () => import('@/components/mall2/auction/price-reduction/auction-transaction-record.vue'),
    meta: {
      title: '成交记录',
      keepAlive: false
    }
  },
]
