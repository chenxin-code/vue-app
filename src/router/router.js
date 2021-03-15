/**
 * Created by LiRui on 2019/6/24.
 * annotation by LiuYong on 2020/9/27
 * 基础路由
 * @return Array 基础路由
 */
let routerArr = [
  {
    path: '/',
    redirect: '/entrance'
  },
  {
    path: '/entrance',
    redirect: '/common'
  },
];

// create by hjc 团购模块

import bulk from './modules/bulk'

routerArr = routerArr.concat(bulk);


//商城
// import  mallItems from './mall'
// routerArr = routerArr.concat(mallItems);

import mall2Items from './mall2'

routerArr = routerArr.concat(mall2Items);

//登录
// import loginItems from './login'
// routerArr = routerArr.concat(loginItems);

import login2Items from './login2'

routerArr = routerArr.concat(login2Items);

//电子券
import couponItems from './coupon'

routerArr = routerArr.concat(couponItems);


//权益服务
import serviceItems from './service'

routerArr = routerArr.concat(serviceItems);

//调查问券
import questionItems from './question'

routerArr = routerArr.concat(questionItems)

//调查问券-服务类问卷
import serviceQuestionItems from './serviceQuestion'

routerArr = routerArr.concat(serviceQuestionItems)

//每日答题
import answerItems from './answer'

routerArr = routerArr.concat(answerItems)

//充值
import rechargeItems from './modules/recharge'

routerArr = routerArr.concat(rechargeItems)
//充值卡
import chargeCard from './modules/charge-card'

routerArr = routerArr.concat(chargeCard)

//发票
import invoiceItems from './invoice'

routerArr = routerArr.concat(invoiceItems)


// //tabbar相关
// import tabbarItems from './tabbar'
// routerArr = routerArr.concat(tabbarItems);
//
//油站导航
import stationItems from './stationto'

routerArr = routerArr.concat(stationItems);
//
// //卡相关
// import cardItems from './card'
// routerArr = routerArr.concat(cardItems);
//
// //电子券
// import elticketItems from './ticket'
// routerArr = routerArr.concat(elticketItems);
//
//首页msg
import homemsgItems from './home'

routerArr = routerArr.concat(homemsgItems);
//
// //我的
// import mineItems from './mine'
// routerArr = routerArr.concat(mineItems);
//
//加油相关Refuel
import refuelItems from './refuel'

routerArr = routerArr.concat(refuelItems);
//
// 通用配置页面
import commonItems from './common'

routerArr = routerArr.concat(commonItems);
//
//加油卡
import fuelcardItems from './fuelcard'

routerArr = routerArr.concat(fuelcardItems);

//加油闪付
import flashPayment from './flashPayment'

routerArr = routerArr.concat(flashPayment);

// 购油活动
import oilSale from './modules/oil-sale'

routerArr = routerArr.concat(oilSale);

// 微店
import microShop from './modules/micro-shop'

routerArr = routerArr.concat(microShop);

// 团券
import groupTicket from './modules/group-ticket'

routerArr = routerArr.concat(groupTicket);

// 职业认证
import vocationalCertification from './modules/vocational-certification'
routerArr = routerArr.concat(vocationalCertification);

// 职业认证 （新版老版 可去掉）
import industryCertification from './modules/industryCertification'
routerArr = routerArr.concat(industryCertification);

// 会员分销
import memberDistribution from './modules/member-distribution'

routerArr = routerArr.concat(memberDistribution);

// 油贝易贝
import Ebay from './modules/ebay'
routerArr = routerArr.concat(Ebay);

// 先享卡
import enjoyCard from './modules/enjoy-card'
routerArr = routerArr.concat(enjoyCard);

// 先享卡
import electronicCard from './modules/electronic-card'
routerArr = routerArr.concat(electronicCard);

//爱心捐赠
import Donate from './modules/donate-love'
routerArr = routerArr.concat(Donate);

// 营销活动
import userDistribution from './modules/user-center'

routerArr = routerArr.concat(userDistribution);

//逍遥游门票
import traveItems from './modules/carefree-trave'

routerArr = routerArr.concat(traveItems)

// 极简支付
import janepaybution from './modules/jane-pay'

routerArr = routerArr.concat(janepaybution);
// // 罚单
// import trafficTicket from './modules/traffic-ticket'

// routerArr = routerArr.concat(trafficTicket);

// 实名认证
import certification from './modules/certification'

routerArr = routerArr.concat(certification);

// 分享有礼
import shareGift from './modules/share-gift'

routerArr = routerArr.concat(shareGift);

// 员工卡
import employeesCard from './modules/employees-card'

routerArr = routerArr.concat(employeesCard);

// 一户一策 加油套餐
import oilPackage from './modules/oil-package'

routerArr = routerArr.concat(oilPackage);

// 油点拼团
import oilGroup from './modules/oil-group'

routerArr = routerArr.concat(oilGroup);

//团购
import group from './modules/group'

routerArr = routerArr.concat(group);

// 心愿单
import wishList from './modules/wish-list'

routerArr = routerArr.concat(wishList);

// 拍卖
import Auction from './modules/auction'

routerArr = routerArr.concat(Auction);

// 砍价
import bargain from './modules/bargain'

routerArr = routerArr.concat(bargain);

// 团购活动
import groupPurchase from './modules/group-purchase'

routerArr = routerArr.concat(groupPurchase);

// dmp
import dmp from './dmp'

routerArr = routerArr.concat(dmp);

// 直播
import liveStream from './live-stream'

routerArr = routerArr.concat(liveStream);

// icbc
import icbc from './modules/icbc'

routerArr = routerArr.concat(icbc);

// hk
import hk from './modules/hk'

routerArr = routerArr.concat(hk);

// 员工推荐商品
import recommendCommodity from './modules/recommend-commodity'

routerArr = routerArr.concat(recommendCommodity);
// 品牌
import brandManage from './modules/brand-manage'

routerArr = routerArr.concat(brandManage);

// 设备管理
import deviceManagement from './modules/device-management'

routerArr = routerArr.concat(deviceManagement);

// 壁虎保险
import bihu from './modules/bihu'

routerArr = routerArr.concat(bihu);

// 智能洗车店（升级版本）
import carWash from './modules/carWash'

routerArr = routerArr.concat(carWash);

// 加油订单（云南加油app）
import refuelingOrder from './refuelingOrder'

routerArr = routerArr.concat(refuelingOrder);

// 离线支付（云南小程序）
import offlinePayment from './modules/offline-payment'

routerArr = routerArr.concat(offlinePayment);

// 联量薪酬查询
import emolument from './modules/emolument'

routerArr = routerArr.concat(emolument);

// 自提商城
import selfMall from './selfMall'

routerArr = routerArr.concat(selfMall);

// 年度账单
import yearBill from './modules/year-bill'

routerArr = routerArr.concat(yearBill);

// 新order
import order from './order'

routerArr = routerArr.concat(order);

export default routerArr
