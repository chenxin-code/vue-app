export default [
  {
    path: '/smslogin',
    name: 'smslogin',
    component: () => import('../views/login/sms_login'),
    meta: {
      title: '登录',
      keepAlive: false
    }
  },
  {
    path: '/smsregister',
    name: 'smsregister',
    component: () => import('../views/register/sms_register'),
    meta: {
      title: '注册',
      keepAlive: false
    }
  },
  {
    path: '/cardvertify',
    name: 'cardvertify',
    component: () => import('../views/setting/ids/vertifyUserCard'),
    meta: {
      title: '验证证件信息',
      keepAlive: false
    }
  },
  {
    path: '/modifyuserinfo',
    name: 'modifyuserinfo',
    component: () => import('../views/setting/ids/personInfoEdit'),
    meta: {
      title: '完善信息',
      keepAlive: false
    }
  },
  {
    path: '/personinfosure',
    name: 'personinfosure',
    component: () => import('../views/setting/ids/personInfo'),
    meta: {
      title: '个人信息',
      keepAlive: false
    }
  },
  {
    path: '/personcardphoto',
    name: 'personcardphoto',
    component: () => import('../views/setting/ids/personCardPhoto'),
    meta: {
      title: '个人信息',
      keepAlive: false
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/setting/setting'),
    meta: {
      title: '设置',
      keepAlive: false
    }
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('../views/setting/user-info'),
    meta: {
      title: '个人信息',
      keepAlive: false
    }
  },
  {
    path: '/ids',
    name: 'ids',
    component: () => import('../views/setting/ids/index'),
    meta: {
      title: '证件信息',
      keepAlive: false
    }
  },
  {
    path: '/iddetail',
    name: 'iddetail',
    component: () => import('../views/setting/ids/id-detail'),
    meta: {
      title: '证件详情',
      keepAlive: false
    }
  }
]
