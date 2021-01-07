/**
 * Created by steven on 2018/8/22.
 */
module.exports = [
  {
    path: '/stationto',
    name: '加油站导航',
    component: () => import('@/components/product/stationto/map-stationto'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/searchmore',
    name: '搜索',
    component: () => import('@/components/product/stationto/map-searchmore'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oilstationlist',
    name: '',
    component: () => import('@/components/product/stationto/oil-station-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oilstationdetail',
    name: '油站详情',
    component: () => import('@/components/product/stationto/oil-station-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oilstationcorrect',
    name: '油站纠偏',
    component: () => import('@/components/product/stationto/correct'),
    meta: {
      keepAlive: false
    }
  },
]
