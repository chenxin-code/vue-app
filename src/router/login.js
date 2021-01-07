/**
 * Created by steven on 2018/8/22.
 */
module.exports = [
  //login商城路径begin
  {
    path: '/aliloginbind',
    name: '账号绑定',
    component: () => import('@/components/product/login/ali-login-bind'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/components/product/login/login'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/forgetpassword',
    name: '忘记密码',
    component: () => import('@/components/product/login/forget-pwd.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/components/product/login/register.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/registerali',
    name: '注册',
    component: () => import('@/components/product/login/registerali'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/settingpassword',
    name: '设置密码',
    component: () => import('@/components/product/login/setting-pwd.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/settingnewpassword',
    name: '设置新密码',
    component: () => import('@/components/product/login/setting-new-pwd.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/smsLogin',
    name: '快捷登录',
    component: () => import('@/components/product/login/sms-login.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/forcemodifypass',
    name: '重置密码',
    component: () => import('@/components/product/login/forcemodify-pasword'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/verifyphone',
    name: '验证绑卡手机号',
    component: () => import('@/components/product/login/verifyphone'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/changepassword',
    name: '修改密码',
    component: () => import('@/components/product/login/change-password'),
    meta: {
      keepAlive: false
    }
  },
  //login路径end
  {
    path: '/resultverifyPphone',
    name: '验证绑卡手机号',
    component: () => import('@/components/product/login/result-verifyphone'),
    meta: {
      keepAlive: false
    },
  },
]

