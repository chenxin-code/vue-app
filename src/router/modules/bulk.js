//create by hjc 团购模块

export default [{
        path: '/purchase',
        name: '团购首页',
        component: () =>
            import ('@/components/bulk/purchase/index.vue'),
        meta: {
            title: '团购首页',
            keepAlive: false
        }
    }, {
        path: '/paySuccess',
        name: '支付成功',
        component: () =>
            import ('@/components/bulk/paySuccess/index.vue'),
        meta: {
            title: '支付成功',
            keepAlive: false
        }
    }, {
        path: '/myprofit',
        name: '我的收益',
        component: () =>
            import ('@/components/bulk/myprofit/index.vue'),
        meta: {
            title: '我的收益',
            keepAlive: false
        }
    }, {
        path: '/deliveryAddress',
        name: '收货地址',
        component: () =>
            import ('@/components/bulk/deliveryAddress/index.vue'),
        meta: {
            title: '收货地址',
            keepAlive: false
        }
    }, {
        path: '/bulk',
        name: '活动首页',
        component: () =>
            import ('@/components/bulk/activity/index.vue'),
        meta: {
            title: '活动首页',
            keepAlive: false
        }
    },
    {
        path: '/bulkDetails',
        name: '活动首页',
        component: () =>
            import ('@/components/bulk/activity/details.vue'),
        meta: {
            title: '活动详情',
            keepAlive: false
        }
    },
    {
        path: '/bulk_share',
        name: '微信团购分享',
        component: () =>
            import ('@/components/bulk/share/index.vue'),
        meta: {
            title: '微信团购分享',
            keepAlive: false
        }
    },
    {
        path: '/bulk_share_confirm_order',
        name: '分享确认订单',
        component: () =>
            import ('@/components/bulk/share/confirmOrder/index.vue'),
        meta: {
            title: '分享确认订单',
            keepAlive: false
        }
    },
    {
        path: '/bulk_order_list',
        name: '订单列表',
        component: () =>
            import ('@/components/bulk/orderList/index.vue'),
        meta: {
            title: '订单列表',
            keepAlive: false
        }
    },
    {
        path: '/bulk_order_detail',
        name: '订单详情',
        component: () =>
            import ('@/components/bulk/orderList/orderDetail/index.vue'),
        meta: {
            title: '订单详情',
            keepAlive: false
        }
    },
    {
        path: '/bulk_after_sales',
        name: '售后申请列表',
        component: () =>
            import ('@/components/bulk/afterSales/index.vue'),
        meta: {
            title: '售后申请列表',
            keepAlive: false
        }
    },
    {
        path: '/bulk_after_sales_detail',
        name: '售后申请详情',
        component: () =>
            import ('@/components/bulk/afterSales/afterSalesDetail/index.vue'),
        meta: {
            title: '售后申请详情',
            keepAlive: false
        }
    },
]