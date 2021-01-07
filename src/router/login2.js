module.exports = [
  {
    path: '/usercenter/codeverify',
    name: '短信验证',
    component: () => import('@/components/usercenter/login/code-verify'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/motionlaunch',
    name: '手势登录',
    component: () => import('@/components/usercenter/login/motion-launch'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/register',
    name: '注册',
    component: () => import('@/components/usercenter/register/index'),
    meta: {
      keepAlive: true
    }

  }, {
    path: '/usercenter/setgesture',
    name: '设置手势密码',
    component: () => import('@/components/usercenter/gesture/setgesture'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/login',
    name: '登录',
    component: () => import('@/components/usercenter/login/index'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/justlogin',
    name: '登录',
    component: () => import('@/components/usercenter/login/just-login'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/setting',
    name: '设置',
    component: () => import('@/components/usercenter/setting/setting'),
    meta: {
      keepAlive: true
    }

  }, {
    path: '/usercenter/aqgl',
    name: '安全管理',
    component: () => import('@/components/usercenter/setting/aqgl'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/device',
    name: '设备管理',
    component: () => import('@/components/usercenter/setting/sbgl'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/choseway',
    name: '选择验证方式',
    component: () => import('@/components/usercenter/setting/chose-way'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/passwordlogin',
    name: '登录密码验证',
    component: () => import('@/components/usercenter/setting/password-login'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/codelogin',
    name: '短信验证',
    component: () => import('@/components/usercenter/setting/code-login'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/updatephone',
    name: '修改手机号',
    component: () => import('@/components/usercenter/setting/update-phone'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/userinfo',
    name: '会员资料',
    component: () => import('@/components/usercenter/setting/user-info'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/updatehead',
    name: '选择图像',
    component: () => import('@/components/usercenter/setting/update-head'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/tygl',
    name: '通用管理',
    component: () => import('@/components/usercenter/setting/tygl'),
    meta: {
      keepAlive: false
    }

  },
  {
    path: '/usercenter/platformQualification',
    name: '平台资质',
    component: () => import('@/components/usercenter/setting/platform-qualification.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/qualificationContent',
    name: '平台资质',
    component: () => import('@/components/usercenter/setting/qualification-content.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/bindwechat',
    name: '微信绑定',
    component: () => import('@/components/usercenter/setting/bind-wechat'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/bindalipay',
    name: '支付宝绑定',
    component: () => import('@/components/usercenter/setting/bind-alipay'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/bindphone',
    name: '绑定',
    component: () => import('@/components/usercenter/setting/bind-phone'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/suggest',
    name: '意见反馈',
    component: () => import('@/components/usercenter/setting/suggest'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/suggestlist',
    name: '历史反馈',
    component: () => import('@/components/usercenter/setting/suggest-list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/aboutus',
    name: '关于我们',
    component: () => import('@/components/usercenter/setting/about-us'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/setpassword',
    name: '设置登录密码',
    component: () => import('@/components/usercenter/setting/set-password'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/updatepassword',
    name: '修改登录密码',
    component: () => import('@/components/usercenter/setting/update-password'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/forgetpassword',
    name: '忘记登录密码',
    component: () => import('@/components/usercenter/setting/forget-password'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/downloadshare',
    name: '下载分享',
    component: () => import('@/components/usercenter/setting/downloadshare'),
    meta: {
      keepAlive: false
    }

  },{
    path: '/usercenter/downloadsharenew',
    name: '下载分享',
    component: () => import('@/components/usercenter/setting/downloadshare-new'),
    meta: {
      keepAlive: false
    }

  }, {
    path: '/usercenter/referralcode',
    name: '我的推荐人',
    component: () => import('@/components/usercenter/setting/referral-code'),
    meta: {
      title: '我的推荐人',
      keepAlive: false
    }
  }, {
    path: '/usercenter/systempermissions',
    name: '系统权限',
    component: () => import('@/components/usercenter/setting/system-permissions'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/minecode',
    name: '我的推荐码',
    component: () => import('@/components/usercenter/setting/mine-code'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/myqrcode',
    name: '我的会员码',
    component: () => import('@/components/usercenter/setting/my-qrcode'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/loginbinding',
    name: '登录绑定',
    component: () => import('@/components/usercenter/login/login-binding.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/loginbindingpw',
    name: '注册绑定',
    component: () => import('@/components/usercenter/login/login-binding-pw.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/usercenter/minehasrecommed',
    name: '我推荐的人',
    component: () => import('@/components/usercenter/setting/mine-has-recommed.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/agreement',
    name: '协议',
    component: () => import('@/components/usercenter/register/agreement.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/agreementcommon',
    name: '',
    component: () => import('@/components/usercenter/agreement/common.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/msgcenterlist',
    name: '消息',
    component: () => import('@/components/usercenter/msgcenter/msg-center-list.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/usercenter/msglist',
    name: '消息',
    component: () => import('@/components/usercenter/msgcenter/msg-list.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/usercenter/msgdetail',
    name: '消息详情',
    component: () => import('@/components/usercenter/msgcenter/msg-detail.vue'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/usercenter/recommendcode',
    name: '我的推荐码',
    component: () => import('@/components/usercenter/setting/recommend-code-new'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/rebatebonus', // 返利红包首页
    name: '石化钱包',
    component: () => import('@/components/usercenter/setting/rebate-bonus/index.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/rebatebonuslist', // 返利红包记录
    name: '石化钱包',
    component: () => import('@/components/usercenter/setting/rebate-bonus/rebate-bonus-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/rebatebonusdetails', // 返利红包详情
    name: '石化钱包',
    component: () => import('@/components/usercenter/setting/rebate-bonus/rebate-bonus-details'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/pay-results', // 返利红包详情
    name: '石化钱包',
    component: () => import('@/components/usercenter/setting/rebate-bonus/pay-results'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/oilbean',
    name: '我的豌豆',
    component: () => import('@/components/usercenter/setting/oil-bean/index.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/rule',
    name: '规则说明',
    component: () => import('@/components/usercenter/setting/oil-bean/rule.vue'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/payset',
    name: '支付设置',
    component: () => import('@/components/usercenter/paymentcenter/payset'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/nosetpwd',
    name: '设置支付密码',
    component: () => import('@/components/usercenter/paymentcenter/paypwdset/nosetpwd'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/forgetPwd',
    name: '忘记支付密码',
    component: () => import('@/components/usercenter/paymentcenter/paypwdset/forgetPwd'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/densityfreeset',
    name: '小额免密',
    component: () => import('@/components/usercenter/paymentcenter/densityfreeset/densityfreeset'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/changefreenum',
    name: '选择免密金额',
    component: () => import('@/components/usercenter/paymentcenter/densityfreeset/changefreenum'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/identityyz',
    name: '身份验证',
    component: () => import('@/components/usercenter/paymentcenter/densityfreeset/identityyz'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/successopenfree',
    name: '身份验证',
    component: () => import('@/components/usercenter/paymentcenter/densityfreeset/successopenfree'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/myprize',
    name: '我的奖品',
    component: () => import('@/components/usercenter/myprize/myprize'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/activitylist',
    name: '活动列表',
    component: () => import('@/components/usercenter/myprize/activitylist'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/activitydetails',
    name: '活动详情',
    component: () => import('@/components/usercenter/myprize/activitydetails'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/thirdlogin',
    name: '幸福石化企业号登录',
    component: () => import('@/components/usercenter/login/third-login'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/usercenter/hx-qrcode',
    name: '易捷会员码',
    component: () => import('@/components/usercenter/setting/hx-qrcode'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/bills',
    name: '月度账单',
    component: () => import('@/components/usercenter/bills/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/usercenter/billdetail',
    name: '月度账单',
    component: () => import('@/components/usercenter/bills/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/loginbindqrcode',
    name: '推荐绑定',
    component: () => import('@/components/usercenter/register/loginbind-qrcode'),
    meta: {
      keepAlive: false
    },
  },{
    path: '/usercenter/preregistration',
    name: '用户预注册',
    component: () => import('@/components/usercenter/register/pre-registration'),
    meta: {
      keepAlive: false
    },
  },{
    path: '/usercenter/gestures-pwd-set',
    name: '手势密码',
    component: () => import('@/components/usercenter/paymentcenter/gestures-pwd-set/index'),
    meta: {
      keepAlive: false
    }
  },{
    path: '/usercenter/setgesture-set',
    name: '设置手势密码',
    component: () => import('@/components/usercenter/paymentcenter/gestures-pwd-set/setgesture-set'),
    meta: {
      keepAlive: false
    }
  },{
    path: '/usercenter/fingerprint-pwd-set',
    name: '指纹密码',
    component: () => import('@/components/usercenter/paymentcenter/fingerprint-pwd-set/index'),
    meta: {
      keepAlive: false
    }
  },{
    path: '/usercenter/face-pwd-set',
    name: '刷脸支付',
    component: () => import('@/components/usercenter/paymentcenter/face-pwd-set/index'),
    meta: {
      keepAlive: false
    }
  },{
    path: '/usercenter/yz-pwd',
    name: '验证密码',
    component: () => import('@/components/usercenter/paymentcenter/yz-pwd/index'),
    meta: {
      keepAlive: false
    }
  },{
    path: '/usercenter/authorizationpage',
    name: '授权页面',
    component: () => import('@/components/usercenter/setting/authorization-page'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/usercenter/activity-strategy',
    name: '活动攻略',
    component: () => import('@/components/usercenter/setting/activity-strategy'),
    meta: {
      keepAlive: false
    }

  },
  {
    path: '/usercenter/canceluser',
    name: '注销账户',
    component: () => import('@/components/usercenter/setting/cancel-user'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/authentication',
    name: '身份验证',
    component: () => import('@/components/usercenter/setting/authentication'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/agreementtip',
    name: '用户协议',
    component: () => import('@/components/usercenter/agreement/tip'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/thirdAccessLogin',
    name: '第三方登陆',
    component: () => import('@/components/usercenter/login/third-access-login'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/task-center',
    name: '任务中心',
    component: () => import('@/components/usercenter/task-center'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/task-center-reocrd',
    name: '任务记录',
    component: () => import('@/components/usercenter/task-center/task-center-reocrd'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/usercenter/yhtredirect',
    name: 'yhtredirect',
    component: () => import('@/components/usercenter/login/yht-redirect.vue'),
    meta: {
      keepAlive: false,
      title: ''
    },
  },
  {
    path: '/link-configuration',
    name: 'link_configuration',
    component: () => import('@/views/link-configuration/index.vue'),
    meta: {
      keepAlive: false,
      title: '  '
    }
  },
  {
    path: '/link-open-bank',
    name: '开放银行快易通',
    component: () => import('@/views/link-configuration/link-open-bank.vue'),
    meta: {
      keepAlive: false
    }
  },
  // {
  //   path: '/usercenter',
  //   name: '',
  //   component: () => import('@/components/usercenter/index'),
  //   children: [{
  //     path: '/',
  //     redirect: 'login'
  //   }, {
  //     path: 'codeverify',
  //     name: '短信验证',
  //     component: () => import('@/components/usercenter/login/code-verify'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'motionlaunch',
  //     name: '手势登录',
  //     component: () => import('@/components/usercenter/login/motion-launch'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'register',
  //     name: '注册',
  //     component: () => import('@/components/usercenter/register/index'),
  //     meta: {
  //       keepAlive: true
  //     }
  //
  //   }, {
  //     path: 'setgesture',
  //     name: '设置手势密码',
  //     component: () => import('@/components/usercenter/gesture/setgesture'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'login',
  //     name: '登录',
  //     component: () => import('@/components/usercenter/login/index'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'setting',
  //     name: '设置',
  //     component: () => import('@/components/usercenter/setting/setting'),
  //     meta: {
  //       keepAlive: true
  //     }
  //
  //   }, {
  //     path: 'aqgl',
  //     name: '安全管理',
  //     component: () => import('@/components/usercenter/setting/aqgl'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'device',
  //     name: '设备管理',
  //     component: () => import('@/components/usercenter/setting/sbgl'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'choseway',
  //     name: '选择验证方式',
  //     component: () => import('@/components/usercenter/setting/chose-way'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'passwordlogin',
  //     name: '登录密码验证',
  //     component: () => import('@/components/usercenter/setting/password-login'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'codelogin',
  //     name: '短信验证',
  //     component: () => import('@/components/usercenter/setting/code-login'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'updatephone',
  //     name: '修改手机号',
  //     component: () => import('@/components/usercenter/setting/update-phone'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'userinfo',
  //     name: '会员资料',
  //     component: () => import('@/components/usercenter/setting/user-info'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'updatehead',
  //     name: '选择图像',
  //     component: () => import('@/components/usercenter/setting/update-head'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'tygl',
  //     name: '通用管理',
  //     component: () => import('@/components/usercenter/setting/tygl'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'bindwechat',
  //     name: '微信绑定',
  //     component: () => import('@/components/usercenter/setting/bind-wechat'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'bindphone',
  //     name: '微信绑定',
  //     component: () => import('@/components/usercenter/setting/bind-phone'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'suggest',
  //     name: '意见反馈',
  //     component: () => import('@/components/usercenter/setting/suggest'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'aboutus',
  //     name: '关于我们',
  //     component: () => import('@/components/usercenter/setting/about-us'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'setpassword',
  //     name: '设置登录密码',
  //     component: () => import('@/components/usercenter/setting/set-password'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'updatepassword',
  //     name: '修改登录密码',
  //     component: () => import('@/components/usercenter/setting/update-password'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'forgetpassword',
  //     name: '忘记登录密码',
  //     component: () => import('@/components/usercenter/setting/forget-password'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'downloadshare',
  //     name: '下载分享',
  //     component: () => import('@/components/usercenter/setting/downloadshare'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'referralcode',
  //     name: '我的推荐人',
  //     component: () => import('@/components/usercenter/setting/referral-code'),
  //     meta: {
  //       keepAlive: false
  //     }
  //
  //   }, {
  //     path: 'minecode',
  //     name: '我的推荐码',
  //     component: () => import('@/components/usercenter/setting/mine-code'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'myqrcode',
  //     name: '我的会员码',
  //     component: () => import('@/components/usercenter/setting/my-qrcode'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'loginbinding',
  //     name: '登录绑定',
  //     component: () => import('@/components/usercenter/login/login-binding.vue'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'loginbindingpw',
  //     name: '注册绑定',
  //     component: () => import('@/components/usercenter/login/login-binding-pw.vue'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'minehasrecommed',
  //     name: '我推荐的人',
  //     component: () => import('@/components/usercenter/setting/mine-has-recommed.vue'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'agreement',
  //     name: '注册协议',
  //     component: () => import('@/components/usercenter/register/agreement.vue'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'msgcenterlist',
  //     name: '消息',
  //     component: () => import('@/components/usercenter/msgcenter/msg-center-list.vue'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'msglist',
  //     name: '消息',
  //     component: () => import('@/components/usercenter/msgcenter/msg-list.vue'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'msgdetail',
  //     name: '消息详情',
  //     component: () => import('@/components/usercenter/msgcenter/msg-detail.vue'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'recommendcode',
  //     name: '我的推荐码',
  //     component: () => import('@/components/usercenter/setting/recommend-code'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'rebatebonus',
  //     name: '返利红包',
  //     component: () => import('@/components/usercenter/setting/rebate-bonus/index.vue'),
  //     meta: {
  //       keepAlive: true
  //     }
  //   }, {
  //     path: 'rebatebonusdetails',
  //     name: '返利红包',
  //     component: () => import('@/components/usercenter/setting/rebate-bonus/rebate-bonus-list'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'oilbean',
  //     name: '我的油豆',
  //     component: () => import('@/components/usercenter/setting/oil-bean/index.vue'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'payset',
  //     name: '支付设置',
  //     component: () => import('@/components/usercenter/paymentcenter'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'nosetpwd',
  //     name: '设置支付密码',
  //     component: () => import('@/components/usercenter/paymentcenter/payset/paypwdset/nosetpwd'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'forgetPwd',
  //     name: '忘记支付密码',
  //     component: () => import('@/components/usercenter/paymentcenter/payset/paypwdset/forgetPwd'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'densityfreeset',
  //     name: '小额免密',
  //     component: () => import('@/components/usercenter/paymentcenter/payset/densityfreeset/densityfreeset'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }, {
  //     path: 'changefreenum',
  //     name: '选择免密金额',
  //     component: () => import('@/components/usercenter/paymentcenter/payset/densityfreeset/changefreenum'),
  //     meta: {
  //       keepAlive: false
  //     }
  //   }]
  // }
]
