/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  //Refuel路径begin
  {
    path: '/refuelinfo',
    name: '选择加油信息',
    component: () => import('@/components/product/addoil/refuel-info'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refuelorder',
    name: '支付订单',
    component: () => import('@/components/product/addoil/refuel-order'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/selectelticket',
    name: '我的电子券',
    component: () => import('@/components/product/addoil/refuel-select-elticket'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refuelorderdetail',
    name: '支付结果',
    component: () => import('@/components/product/addoil/refuel-order-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refuelstationlist',
    name: '附近加油站',
    component: () => import('@/components/product/addoil/refuel-station-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oilrecord',
    name: '加油记录',
    component: () => import('@/components/product/addoil/oil-record'),
    meta: {
      keepAlive: false
    }
  },
  // {
  //   path: '/oilrecord',
  //   name: '加油记录',
  //   component: () => import('@/components/product/addoil/oil-record2'),
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  //Refuel路径end
  {
    path: '/oilrecorddetail',
    name: '加油详情',
    component: () => import('@/components/product/addoil/oil-record-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refuelcardselect',
    name: '加油订单支付',
    component: () => import('@/components/product/addoil/refuel_card_select'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/RefuelSelectOilGun',
    name: '加油',
    component: () => import('@/components/product/mainpage/refuel-select-oilgun'),
    meta: {
      keepAlive: false
    }
  },
]
