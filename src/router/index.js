import Vue from 'vue'
import Router from 'vue-router'

import bridgefunc from "../utils/bridgefunc";
import closeAll from "../utils/close";

import userCenter from "@/components/usercenter/js/userCenter";
import wechatOP from '../utils/WechatOP'
import store from "../vuex/store";
import ErrPage from '@/components/Vendor/err-page/index'
import globalConfig from '@/api/global-config'
import config from '@/api/config'
import ProductInit from './../api/productInit'
import utils from "../utils/util";
import wxfunc from '@/utils/wxfunc'
import Cookie from 'js-cookie'
import {
    getUserInfo
} from '../utils/login'
import hbJwx from '../utils/deploy/hbsy/hb-jwx'
import Watchman from '../utils/watchman'

Vue.use(Router);
import routers from './mergeRouter'

import actionStatistics from '../utils/actionStatistics'

import Config from "../api/config";
import Toast from "../components/Vendor/toast";
import {
    assign
} from "lodash";

const router = new Router({
    // mode: 'history',
    routes: routers
});

/**
 * router扩展，各种页面切换动画
 */
// 扩展成员变量
router.customRouterData = {
    transitionName: '',
    routerPaths: []
};

let tiaoshi_Timer = null;
let tiaoshi_Data = {};

// 使用动画之后立即移除
router.afterEach((to, from) => {
    // 河北环境&公众号环境
    if (store.state.deployType == 2 && store.state.webtype == 2) {
        let timeId;
        if (timeId) {
            clearTimeout(timeId)
        }
        timeId = setTimeout(() => {
            hbJwx.hideNonMenu()
        }, 20)
    }

    // 海油隐藏复制链接微信功能按钮
    if (store.state.webtype == 2 && store.state.globalConfig.app_home_special_flag == 'cnooc') {
        wxfunc.hideMeItems([
            'menuItem:copyUrl',
            'menuItem:editTag',
            'menuItem:delete',
            'menuItem:originPage',
            'menuItem:readMode',
            'menuItem:openWithQQBrowser',
            'menuItem:openWithSafari',
            'menuItem:share:email',
            'menuItem:share:brand',
            "menuItem:share:qq",
            "menuItem:share:weiboApp",
            "menuItem:favorite",
            "menuItem:share:facebook",
            "menuItem:share:QZone",
        ])
    }

    setTimeout(() => {
        router.customRouterData.transitionName = ''
    }, 20);

    actionStatistics.routeAction('100000', to.path, to.query);

    let td = {
        from: from.path,
        to: to.path,
        args: to.query,
        pgcode: to.query.pgCode || ''
    };

    if (tiaoshi_Data.to == td.from) {
        actionStatistics.routeAction('180000', tiaoshi_Data.to, tiaoshi_Data.args, tiaoshi_Data.pgcode)
    }

    tiaoshi_Data = JSON.parse(JSON.stringify(td));

    if (tiaoshi_Timer) {
        clearTimeout(tiaoshi_Timer);
        tiaoshi_Timer = null
    }

    tiaoshi_Timer = setTimeout(() => {
        tiaoshi_Data = {}
    }, 3000)
});

router.push = function push(location, onComplete, onAbort) {

    router.addRouterPath(location.path);

    router.customRouterData.transitionName = 'slide_left';


    this.history.push(location, onComplete, onAbort);
};

router.replace = function replace(location, onComplete, onAbort) {

    router.removeLastRouterPath();
    router.addRouterPath(location.path);

    router.customRouterData.transitionName = 'slide_left';

    this.history.replace(location, onComplete, onAbort);
};

router.go = function go(n) {
    if (n > 0) {
        // 禁止使用
        return;
    }
    if (router.customRouterData.routerPaths.length <= 1) {
        bridgefunc.turnBack(-1);
        return;
    }
    router.removeLastRouterPath(-n);

    router.customRouterData.transitionName = 'slide_right';

    this.history.go(n);
};

router.back = function back(path) {

    router.removeLastRouterPath();

    router.customRouterData.transitionName = 'slide_right';

    if (path) {
        const i = this.customRouterData.routerPaths.lastIndexOf(path);
        if (i > -1) {
            this.go(-(this.customRouterData.routerPaths.length - i - 1))
        } else {
            this.go(-1)
        }
    } else {
        this.go(-1)
    }
};

router.forward = function forward() {
    // 禁止使用
    return;
    router.customRouterData.transitionName = 'slide_left';
    this.go(1);
};

/**
 * 按钮前进后退处理处理
 * 返回：测滑返回，微信返回按钮，web返回按钮，以及android物理返回，android测滑返回
 * 前进：微信上的前进按钮，web前进
 * // 前进这里有个坑，待解决，先忽略
 **/
router.otherEventTransitionName = function otherEventTransitionName(toPath, fromPath) {
    // 没有数据意味着从，其他操作方式得到的路由变化
    if (router.customRouterData.transitionName != '') {
        return;
    }
    // 如果是网页端，有前进后退
    if (store.state.webtype == '0') {
        let toIndex = utils.indexOfStringInArray(toPath, router.customRouterData.routerPaths);
        if (toIndex == -1 || router.customRouterData.routerPaths.length - toIndex != 2) {
            router.addRouterPath(toPath);
            router.customRouterData.transitionName = 'slide_left'
        } else {
            router.removeLastRouterPath();
            router.customRouterData.transitionName = 'slide_right'
        }
    }
    // 如果是app端，只有特殊的后退
    else if (store.state.webtype == '1') {
        if (utils.isIos()) {
            // ios端只有测滑返回，不需要动画
            router.removeLastRouterPath();
            router.customRouterData.transitionName = ''
        } else {
            // adroid端只有按钮返回，需要动画
            router.removeLastRouterPath();
            router.customRouterData.transitionName = 'slide_right'
        }
    }
    // 如果是微信端，有前进后退
    else if (store.state.webtype == '2') {
        let toIndex = utils.indexOfStringInArray(toPath, router.customRouterData.routerPaths);
        if (toIndex == -1 || router.customRouterData.routerPaths.length - toIndex != 2) {
            router.addRouterPath(toPath);
            router.customRouterData.transitionName = 'slide_left'
        } else {
            router.removeLastRouterPath();
            router.customRouterData.transitionName = 'slide_right'
        }
    }
    // 如果是小程序端，只有特殊的后退
    else if (store.state.webtype == '3') {
        if (utils.isIos()) {
            // ios端只有测滑返回，不需要动画
            router.removeLastRouterPath();
            router.customRouterData.transitionName = ''
        } else {
            // adroid端只有按钮返回，需要动画
            router.removeLastRouterPath();
            router.customRouterData.transitionName = 'slide_right'
        }
    }
    // 如果是网页端,和其他可能的时候，有前进后退,
    else {
        let toIndex = utils.indexOfStringInArray(toPath, router.customRouterData.routerPaths);
        if (toIndex == -1 || router.customRouterData.routerPaths.length - toIndex != 2) {
            router.addRouterPath(toPath);
            router.customRouterData.transitionName = 'slide_left'
        } else {
            router.removeLastRouterPath();
            router.customRouterData.transitionName = 'slide_right'
        }
    }
};

router.addRouterPath = function addRouterPath(path) {
    if (path == '/common') {
        router.customRouterData.routerPaths = []
    }
    router.customRouterData.routerPaths.push(path);
    sessionStorage.setItem("customRouterData_routerPaths", JSON.stringify(router.customRouterData.routerPaths));
};

router.removeLastRouterPath = function removeLastRouterPath(n = 1) {
    if (n > 0) {
        for (let i = 0; i < n; i++) {
            router.customRouterData.routerPaths.pop()
        }
        sessionStorage.setItem("customRouterData_routerPaths", JSON.stringify(router.customRouterData.routerPaths));
    }
};

router.initRouterPaths = function initRouterPaths(toPath) {
    // 当存储了 router paths 时候，读取并赋值
    let arrStr = sessionStorage.getItem("customRouterData_routerPaths");
    if (arrStr && arrStr != undefined) {
        let arr = JSON.parse(arrStr);
        if (arr && arr != undefined && arr.constructor === Array) {
            router.customRouterData.routerPaths = arr;
        } else {
            router.customRouterData.routerPaths = [];
            router.addRouterPath(toPath)
        }
    } else {
        router.customRouterData.routerPaths = [];
        router.addRouterPath(toPath)
    }
};
/** router扩展，结束 **/


let ISREAD = false;
// 不需要微信授权 不需要定位   分享有礼需要微信授权因为页面加载需要token
let wxAuthExcludePage = ['/icbc', '/usercenter/preregistration', '/usercenter/loginbindqrcode', '/usercenter/downloadshare', '/usercenter/downloadsharenew', '/usercenter/thirdlogin', '/open-invoice', '/invitation-details', '/redirect', '/usercenter/thirdAccessLogin', '/electronic_billing', '/redirectEB', '/isFollow', '/agreement', '/enterprise-group', '/insurance/subscribe', '/contract-enterprise-group'];
let skip = ['/icbc', '/mall2/scanbuyproduct', '/mall2/ylpay', '/mall2/ylpayredirect', '/link-configuration', 'common2'];
// 下面这些里面没法使用globalConfig
let skipAll = ['/usercenter/agreementcommon'];
router.beforeEach((to, from, next) => {
    //记录微信公众号首次进入的路径
    if (!window.initUrl) {
        window.initUrl = window.location.href.split('#')[0];
        if (window.location.href.includes('from=singlemessage' || 'from=groupmessage')) {
            const href = `${window.location.origin + window.location.pathname}#${to.fullPath}`;
            window.location.replace(href);
            return;
        }
    }

    closeAll.close();

    to.query.lastPath = from.path;
    to.query.referrerCode = store.state.referrerCode || "";

    //  已读取
    if (ISREAD) {
        router.otherEventTransitionName(to.path, from.path);
        // 初始化后操作
        afterInitDone();
        next();
    } else {
        // reload的时候，获取当前存储的路由数组
        router.initRouterPaths(to.path);
        // 记录第一次进入的页面路由
        if (!store.state.firstEntryLocationPath) {
            store.state.firstEntryLocationPath = to.path || ''
        }

        // 下面这些里面没法使用globalConfig
        if (skipAll.includes(to.path)) {
            endFunc(next);
            return
        }

        // 读取之后，初始化某些值
        ProductInit.vuexInit(store.state).then(() => {
            // 第一次未读取vuex
            bridgefunc.vuexRead(() => {

                // 读取之后，初始化某些值
                ProductInit.vuexInit(store.state).then(() => {
                    // 登录渠道， 区分同一个服务不同的环境
                    if (to.query.channel) {
                        store.state.channel = to.query.channel
                    }
                    // 全局配置初始化
                    globalConfig.getGlobalConfig().then(async() => {

                        if (skip.includes(to.path) || to.query.skipPermissions == '1') {
                            endFunc(next);
                            return
                        }
                        if (store.state.webtype != 8) {
                            //启动广告
                            userCenter.advertisepageOpen();
                        }
                        // 开启网易易盾反作弊
                        if (store.state.globalConfig.isEnableAntiCheat == 1) {
                            await Watchman.init().catch(error => console.log(error))
                        }
                        // 易盾一键登录
                        if (store.state.globalConfig.can_use_yidun == '1') {
                            await Watchman.yidunLoginInit()
                        }

                        ISREAD = true

                        if (to.redirectedFrom == '/entrance') {
                            // 启动次数
                            actionStatistics.systemAction('160010')
                        }

                        // 记录为一次访问
                        actionStatistics.systemAction('160020');

                        // store.state.mall2.selectAddress = {"id": ''}
                        // store.state.mall2.zitiAddress = {"id": ''}
                        store.state.mall2.pickupAddressChecked = false;

                        if (store.state.globalConfig.delivertype_default == '1') {
                            store.state.mall2.staticDeliverType = '1'
                        } else if (store.state.globalConfig.delivertype_default == '2') {
                            store.state.mall2.staticDeliverType = '2'
                        } else if (store.state.globalConfig.delivertype_default == '12') {
                            if (store.state.mall2.staticDeliverType == null) {
                                store.state.mall2.staticDeliverType = '1'
                            }
                        } else if (store.state.globalConfig.delivertype_default == '21') {
                            if (store.state.mall2.staticDeliverType == null) {
                                store.state.mall2.staticDeliverType = '2'
                            }
                        } else {
                            if (!(store.state.mall2.staticDeliverType == '1' || store.state.mall2.staticDeliverType == '2')) {
                                store.state.mall2.staticDeliverType = '1'
                            }
                            // store.state.mall2.staticDeliverType = '1'
                        }


                        // 通过地址获取推荐人 （eg: 扫小程序码获得的推荐人）
                        if (to.query.rfrCode) {
                            store.state.rfrCode = to.query.rfrCode
                        }
                        // 企业推荐人
                        if (to.query.enterPriseOuCode) {
                            store.state.enterPriseOuCode = to.query.enterPriseOuCode
                        }

                        // 登录渠道，目前平安保险（9）是通过URL传入
                        if (to.query.loginChannel) {
                            store.state.loginChannel = to.query.loginChannel
                        }

                        // console.log('路由守卫获取路由参数信息', to.query);

                        if (store.state.webtype == '3') {

                            // 是否已将小程序添加到 我的小程序 1 是
                            store.state.isAddToFavorites = to.query.isAddToFavorites || '';
                            // wxAuthUserInfo 1 需要授权小程序信息取unionId
                            if (to.query.wxAuthUserInfo == 1 && (!to.query.unionId || to.query.unionId === 'undefined')) {
                                wx.miniProgram.redirectTo({
                                    url: `/packages/func-pages/auth-userinfo/main?redirectUrl=${encodeURIComponent(Config.shareUrl + router.history.current.fullPath)}`
                                })
                            }
                            // 小程序登录
                            wxMnpLogin()
                                // 不是来自原生跳转的webview
                            if (to.query.webview != 1) {
                                window.addEventListener('popstate', function() {
                                    document.title = store.state.globalConfig.wxmnp_title || ''; // 小程序置空
                                })
                            } else {
                                store.state.webview = 1
                            }
                        }

                        if (store.state.webtype == '8') {
                            store.state.etpAgentId = to.query.agentId
                            store.state.etpAppId = to.query.appId
                        }

                        if (to.path == '/blockindex' || to.path == '/blockindexlocation') {
                            // 掌厅首页 进入去掉 token
                            store.state.login.token = ''
                        } else {
                            // 设置token
                            setTokenProcess()
                        }
                        bridgefunc.routerToNeed(() => {
                            // 微信公众号登录
                            wechatLogin()
                        })

                    }).catch(err => {
                        console.log(err)
                    });

                    // 初始化后操作
                    afterInitDone()
                })
            })
        })
    }

    // 结束函数 跳转路由
    function endFunc(next) {
        if (!wxAuthExcludePage.includes(to.path) && to.query.skipPermissions != '1') {
            userCenter.rootEvents();
        }
        if (store.state.webtype != 8) {
            userCenter.getUserRank(); // 获取会员级别信息
        }
        next();
        setTimeout(() => {
            userCenter.reloadEndPush()
        }, 100)
    }

    function deleteShareUserInfo() {
        if (store.state.webtype == '3') {
            // 小程序分享
            wxmpShare()
        } else if (store.state.webtype == '2') {
            // 公众号分享
            wxShare()
        }
    }

    function wxShare() {
        let query = JSON.parse(JSON.stringify(to.query));
        let path = store.state.globalConfig.wxBaseUrl + Config.shareUrl + to.path;
        if (path.indexOf('?') == -1) {
            path += '?'
        }
        for (let key in query) {
            if (key != 'userInfo' && key != 'token') {
                path += `${key}=${query[key]}&`
            }
        }
        path = path.substr(0, path.length - 1)

        let title = window.document.title
        let sharetext = ''
        let detailurl = path
        let imageurl = store.state.globalConfig.logoUrl
        let shareData = {
            title: title, // 分享标题
            sharetext: sharetext, // 分享描述
            detailurl: detailurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imageurl: imageurl // 分享图标
        }
        console.log('shareData', shareData)

        wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
                wxfunc.wxSetShareData(shareData);
            } else {
                console.log('签名失败');
            }
        });
    }

    function wxmpShare() {
        let query = JSON.parse(JSON.stringify(to.query));
        let path = '';
        if (query.hasOwnProperty('userInfo')) { // 分享链接删除用户信息
            delete query.userInfo;
            delete query.token
        }
        for (let key in query) {
            if (key != 'userInfo' && key != 'token') {
                path += `&${key}=${query[key]}`
            }
        }
        path = path ? `${to.path}?${path.substr(1)}` : to.path;
        let rfrCode = store.state.rfrCode || store.state.userInfo.userId
        let shareData = {
            title: to.name,
            path: `${config.shareUrl}${path}`,
            rfrCode
        };
        wx.miniProgram.postMessage({
            data: JSON.stringify(shareData)
        });
    }

    function renameTitle() {
        if (store.state.webtype == '3' && to.query.webview != 1) {
            document.title = store.state.globalConfig.wxmnp_title || ''; // 小程序置空
            return
        }
        if (to.meta.title) {
            document.title = to.meta.title ? to.meta.title : to.name;
        }
        if (to.path === '/mall2/headlines') {
            document.title = store.state.globalConfig.newsTitle || '小石头条'
        }
        if (to.path === '/usercenter/oilbean') {
            document.title = store.state.globalConfig.Employees_wallet || '我的豌豆'
        }
        if (to.path === '/' || to.path === '/entrance' || to.path === '/common') {
            document.title = store.state.globalConfig.indexPageTitle || '首页'
        }
    }

    // 微信公众号登录
    function wechatLogin() {
        //获取code的url  再获取到code  再自动登录  没有token  去绑定
        if (!wxAuthExcludePage.includes(to.path) && store.state.webtype == '2' && !store.state.login.token) {
            if (to.query.thirdUserId) {
                store.state.login.thirdUserId = to.query.thirdUserId;
                window.wechatFirstIn = true; // 避免返回问题
                bridgefunc.vuexStorage();
                endFunc(next);
            } else {
                if (window.location.host.includes('uhuitong.com') > 0) {
                    // 油惠通微信不需要提前拿code
                    endFunc(next);
                } else {
                    wechatOP.goWechat(() => {
                        endFunc(next);
                    })
                }
            }
        } else {
            endFunc(next);
        }
    }

    // 小程序登录
    function wxMnpLogin() {
        if (to.query.hasOwnProperty('debug')) {
            eruda.init()
        }
        // 微信小程登录类型，默认不传是走微信原生授权手机号登录， 1 是走vue项目自带的绑定登录
        store.state.login.wxMnpLoginType = to.query.wxMnpLoginType;
        let userInfo = {
            token: ''
        };

        if (to.query.userInfo) {
            console.log('wx:userInfo', to.query.userInfo);
            if (to.query.userInfo) {
                userInfo = JSON.parse(decodeURIComponent(to.query.userInfo));
                userCenter.saveLoginData(userInfo);
            }
        } else if (to.query.wxmpOpenId) {
            console.log('wxmpOpenId', to.query.wxmpOpenId);
            store.state.login.thirdUserId = to.query.wxmpOpenId
        }
    }

    // token 设置
    function setTokenProcess() {
        // 集成登录
        let usertoken = Cookie.get('usertoken');
        // let isQueryUserInfo = true
        let updataToken = true;
        // 针对油惠通
        if (store.state.deployType == '2') {
            if (usertoken) { // kshop和sunbox token不一样，cookie 获取的 usertoken 可能是kshop的，不能再次调用userinfo接口，否则会覆盖token
                // 增加油惠通逻辑，取用户信息，但是不更换token
                // isQueryUserInfo = false
                updataToken = false
            }
            // 刚刚登录过 cookie里面 usertoken是不能用的
            if (sessionStorage.getItem('just_login_reload') == '1') {
                usertoken = '';
                sessionStorage.removeItem('just_login_reload')
            }
        }

        if (to.query.token && to.query.token.length) {
            usertoken = to.query.token;
        }
        if (to.query.logintoken && to.query.logintoken.length) {
            usertoken = to.query.logintoken;
            console.log('to.query.logintoken', usertoken)
        }
        // 下面是测试的token
        if (config.testToken && config.testToken != '') {
            usertoken = config.testToken
        }

        if (usertoken && usertoken !== 'undefined' && usertoken !== 'null') {
            store.state.login.token = usertoken;
            getUserInfo(updataToken) // 获取用户基本信息
                // if (isQueryUserInfo) {
                //   getUserInfo() // 获取用户基本信息
                // } else {
                //   bridgefunc.vuexStorage()
                // }
        }
    }

    /**
     * 初始化后续操作
     */
    function afterInitDone() {
        // 定制化标题名称
        renameTitle();
        // delete share token
        try {
            deleteShareUserInfo()
        } catch (e) {
            console.error(e)
        }
    }
});


export default router;