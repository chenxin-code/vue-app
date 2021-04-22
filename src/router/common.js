/**
 * Created by steven on 2018/8/22.
 */

module.exports = [
  //commont路径begin
  {
    path: '/cityselector/:id',
    name: '选择地区',
    component:  () => import('@/components/commonui/cityselector/SelectCity'),
    meta: {
      keepAlive: false
    }
  },
  // 附件加油站
  {
    path: '/nearstation',
    name: '选择油站',
    component:  () => import('@/components/commonui/near-station/near-station'),
    meta: {
      keepAlive: true
    }
  },
  //commont路径end
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/components/test'),
    meta: {
      keepAlive: false
    }
  },
  //新首页
  {
    path: '/common',
    name: '新首页',
    component: () => import('@/components/product/index/common'),
    meta: {
      keepAlive: false
    }
  },
  // 子集配置页面
  {
    path: '/common2/:id',
    name: '首页',
    component: () => import('@/components/product/index/index'),
    meta: {
      keepAlive: true
    }
  },
  // 块级配置页面
  {
    path: '/blockindex',
    name: '页面块',
    component: () => import('@/components/product/index/block-index'),
    meta: {
      keepAlive: true
    }
  },
  // 块级配置页面-根据定位获取
  {
    path: '/blockindexlocation',
    name: '页面块',
    component: () => import('@/components/product/index/block-index-location'),
    meta: {
      keepAlive: true
    }
  },
  // 子集配置页面
  {
    path: '/latestprice',
    name: '今日油价',
    component: () => import('@/components/product/index/function-page/latest-price'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/latestprice2',
    name: '今日油价',
    component: () => import('@/components/product/index/function-page/latest-price-2'),
    meta: {
      keepAlive: false
    }
  },
  // 日志页面
  {
    path: '/logs',
    name: '日志',
    component: () => import('@/components/product/index/log-page'),
    meta: {
      keepAlive: false
    }
  },
  // 九宫格拖动顺序组件
  {
    path: '/imageadmove',
    name: '应用排序',
    component: () => import('@/components/product/index/image-ad-move.vue'),
    meta: {
      keepAlive: false
    }
  },
]
