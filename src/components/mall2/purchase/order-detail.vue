/**Created by liaoyingchao on 2019-05-05.*/

<template>
  <div class="order-detail">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="content-order">
        <!--待确认-->
        <div class="scroll-div" v-if="detailData.status == '1'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-time theme_font_white"></i>
              <div class="font-weight" v-if="detailData.subStatus==1000">等待确认</div>
              <div class="font-weight" v-if="detailData.subStatus==1001">等待改价</div>
              <div class="right font-weight" v-if="detailData.applyPriceState==1">订单需付款：¥{{$util.toDecimal2(detailData.adjustAmount)}}</div>
              <div class="right font-weight" v-else>订单需付款：¥{{$util.toDecimal2(detailData.amount)}}</div>
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">预下单成功，等待商家确认订单</div>
                <div class="time-div theme_font_tint">{{detailData.createTime}}</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big" v-if="detailData.applyPriceState==1">{{$util.toDecimal2(detailData.adjustAmount)}}</span>
                <span class="big" v-else>{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--待付款-->
        <div class="scroll-div" v-if="detailData.status == '2'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">待付款</div>
              <div class="right font-weight" v-if="detailData.applyPriceState==1">支付金额：¥{{$util.toDecimal2(detailData.adjustAmount)}}</div>
              <div class="right font-weight" v-else>支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">商家已确认订单，等待商家确认收款</div>
                <div class="time-div theme_font_tint">{{detailData.orderConfirmTime}}</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认订单时间</div>
              <div class="value">{{detailData.orderConfirmTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big" v-if="detailData.applyPriceState==1">{{$util.toDecimal2(detailData.adjustAmount)}}</span>
                <span class="big" v-else>{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--待发货-->
        <div class="scroll-div" v-if="detailData.status == '3' && detailData.deliverType == '2'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">开始备货</div>
              <!--<div class="right font-weight">支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>-->
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">商家已确认收款，开始备货</div>
                <div class="time-div theme_font_tint">{{detailData.paidTime}}</div>
                <div class="event-div theme_font_common">商家已确认订单，等待商家确认收款</div>
                <div class="time-div theme_font_tint">{{detailData.orderConfirmTime}}</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认订单时间</div>
              <div class="value">{{detailData.orderConfirmTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big">{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--待提货-->
        <div class="scroll-div" v-if="detailData.status == '3' && detailData.deliverType == '1'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">等待提货</div>
              <!--<div class="right font-weight">支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>-->
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">商家已确认收款，等待提货</div>
                <div class="time-div theme_font_tint">{{detailData.paidTime}}</div>
                <div class="event-div theme_font_common">商家已确认订单，等待商家确认收款</div>
                <div class="time-div theme_font_tint">{{detailData.orderConfirmTime}}</div>
                <div class="event-div theme_font_common">提货码：{{detailData.deliverCheckcode}}</div>
                <div class="time-div">
                  <div class="code-div">
                    <canvas id="codeDiv"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认订单时间</div>
              <div class="value">{{detailData.orderConfirmTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认收款时间</div>
              <div class="value">{{detailData.paidTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big">{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--待收货-->
        <div class="scroll-div" v-if="detailData.status == '4'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">等待收货</div>
              <!--<div class="right font-weight">支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>-->
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">您的订单开始配送，请注意接听电话</div>
                <div class="time-div theme_font_tint">物流公司：{{detailData.logisticsName}}</div>
                <div class="time-div theme_font_tint">物流单号：{{detailData.logisticsNo}}</div>
                <div class="time-div theme_font_tint">发货时间：{{detailData.deliveryTime}}</div>
                <div class="event-div theme_font_common">商家已确认收款，开始备货</div>
                <div class="time-div theme_font_tint">{{detailData.paidTime}}</div>
                <div class="event-div theme_font_common">商家已确认订单，等待商家确认收款</div>
                <div class="time-div theme_font_tint">{{detailData.orderConfirmTime}}</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认订单时间</div>
              <div class="value">{{detailData.orderConfirmTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认收款时间</div>
              <div class="value">{{detailData.paidTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big">{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--已完成-->
        <div class="scroll-div" v-if="detailData.status == '5'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">已完成</div>
              <!--<div class="right font-weight">支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>-->
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">感谢购物，欢迎您再次光临！</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认订单时间</div>
              <div class="value">{{detailData.orderConfirmTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">确认收款时间</div>
              <div class="value">{{detailData.paidTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big">{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--已取消-->
        <div class="scroll-div" v-if="detailData.status == '0'">
          <div class="top-div">
            <div class="order-info theme_font_white">
              <i class="iconfont mall-qian theme_font_white"></i>
              <div class="font-weight">已取消</div>
              <!--<div class="right font-weight">支付金额：¥{{$util.toDecimal2(detailData.amount)}}</div>-->
            </div>
            <img src="static/image/mall2/order-bg.png"/>
          </div>
          <div class="block state-div">
            <div class="row" style="align-items: flex-start;">
              <i class="iconfont mall-dingdan theme_font_common state-i"></i>
              <div class="text-div">
                <div class="event-div theme_font_common">您的订单已取消！</div>
                <div class="time-div theme_font_common">{{detailData.expireTime}}</div>
              </div>
            </div>
          </div>
          <div class="block pro-div">
            <OrderPro :itemData="detailData"></OrderPro>
            <a :href="'tel:'+detailData.creatorName" class="phone theme_font_red_i">
              <i class="iconfont mall-dianhua theme_font_red"></i>
              {{detailData.creatorName}}
            </a>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单编号</div>
              <div class="value">{{detailData.tradeNo}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">下单时间</div>
              <div class="value">{{detailData.submitTime}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系人</div>
              <div class="value">{{detailData.subscOrdReceiver}}</div>
            </div>
            <div class="row">
              <div class="label theme_font_gray">预约联系电话</div>
              <div class="value">{{detailData.subscOrdMobile}}</div>
            </div>
          </div>
          <div class="block localtion">
            <div class="left">
              <img src="./images/local.png">
            </div>
            <div class="right" v-if="detailData.deliverType == '2'">
              <div class="row name theme_font_common">{{detailData.receiver}}&nbsp&nbsp&nbsp{{detailData.mobile}}</div>
              <div class="row address theme_font_tint">收货地址：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName+detailData.address}}</div>
            </div>
            <div class="right" v-if="detailData.deliverType == '1'">
              <div class="row name theme_font_common">{{detailData.pickupName}}</div>
              <div class="row address theme_font_tint">自提点位置：{{detailData.provinceName+detailData.cityName+detailData.countryName+detailData.townName}}</div>
            </div>
          </div>
          <div class="block">
            <div class="row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="value-r theme_font_red">
                ¥
                <span class="big">{{$util.toDecimal2(detailData.amount)}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--底部按钮-->
        <div class="btns" v-if="detailData.status == '1'">
          <div class="row-btn theme_font_common theme_border_gray" @click="cancelOrderEvent">取消订单</div>
        </div>
        <div class="btns" v-if="detailData.status == '4'">
          <div class="row-btn theme_font_common theme_border_gray" v-if="isShowExpress" @click="toLogisticsEvent">查看物流</div>
          <div class="row-btn theme_font_common theme_border_gray" @click="sureOrderEvent">确认收货</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import OrderPro from './base/order-pro'
  import JsBarcode from 'jsbarcode'
  import QRCode from 'qrcode'

  export default {
    name: "order-detail",
    components: {
      OrderPro
    },
    data() {
      return {
        id: '',
        detailData: {},
        brightnessResult: {}
      }
    },
    computed: {
      isShowExpress() {
        return this.$store.state.webtype != 3
      }
    },
    methods: {
      sureOrderEvent: function () {
        let url = '/app/json/app_purchase_order/orderConfirm'
        let paramsData = {
          id: this.id
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$router.go(-1)
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      createCode: function (data) {
        this.$nextTick(() => {
          if (this.detailData.deliverCheckcode != '') {
            console.log(document.getElementById('codeDiv'),'span')
            if(document.getElementById('codeDiv')){
              let barcode = document.getElementById('codeDiv');
              if (this.$store.state.globalConfig.webpos_type == "cloudpos") {
                QRCode.toCanvas(barcode, data.deliverCheckcode || '', {width: 200})
              } else {
                JsBarcode(barcode, this.detailData.deliverCheckcode, {
                  height: 60,
                  displayValue: false
                });
              }
            }

          }
        })
      },
      toLogisticsEvent: function () {

      },
      backEvent: function () {
        this.$router.go(-1)
      },
      getOrderDetail: function () {
        let url = '/app/json/app_purchase_order/orderDetail'
        let paramsData = {
          id: this.id
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data
              // this.getOrderList()
              this.createCode(this.detailData)
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      cancelOrderEvent: function () {
        let url = '/app/json/app_purchase_order/cancelOrder'
        let paramsData = {
          id: this.id
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$router.go(-1)
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getOrderDetail()
      this.$bridgefunc.brightness(1, 0, (result) => {
        this.brightnessResult = result
      })
    },
    destroyed() {
      this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-detail {
    width 100%
    height 100%
    overflow hidden

    .content-order {
      display flex;
      flex-direction: column;
      align-items center;
      height 100%;
    }

    .scroll-div {
      flex 1;
      overflow-y auto;

      .top-div {
        position relative;
        width 100%;
        height 80px;

        .order-info {
          position absolute;
          left 10px;
          right 10px;
          top 18px;
          overflow hidden;
          display flex;
          align-items center;
          font-size 14px;

          i {
            font-size 20px;
            font-weight 600;
            padding-right 4px;
          }

          .right {
            flex 1;
            text-align right;
            font-size 12px;
          }

          .font-weight {
            font-weight 500;
          }
        }

        img {
          width 100%;
          height 100%;
        }
      }

      .code-div {
        overflow hidden;
        #codeDiv {
          width 100%;
        }
      }

      .block {
        margin 8px;
        background-color white;
        box-shadow 0 1px 8px #efefef;
        padding 5px 10px;
        border-radius 8px;

        .row {
          padding 12px 0;
          display flex
          align-items center;

          .label {
            width 90px;
            font-size 13px;
          }

          .value {
            flex 1;
            font-size 12px;
          }

          .value-r {
            flex 1;
            text-align right;
            font-size 12px;

            .big {
              font-size 16px;
              font-weight 500;
            }
          }
        }

        .row:nth-child(n+2) {
          padding-top 0;
        }
      }

      .localtion {
        .left {
          float left;
          padding 12px 5px;
          img {
            width 20px;
            height 20px;
          }
        }
        .right {
          overflow hidden;
          .name {
            font-size 14px;
            font-weight 500;
          }
          .address {
            font-size 12px;
          }
        }
      }

      .state-div {
        position relative;
        z-index 9;
        margin-top -30px;

        .state-i {
          font-size 20px;
          padding-right 5px;
        }

        .text-div {
          .event-div {
            font-size 14px;
            line-height 1.6;
          }

          .time-div {
            font-size 12px;
            line-height 1.6;
          }
        }
      }

      .pro-div {
        position relative;
        z-index 9
        // margin -60px 8px 0;
        padding 12px;

        .phone {
          margin-top 10px;
          padding-top 10px;
          position: relative
          display flex;
          justify-content center;
          align-items center;
          font-size 13px;

          i {
            padding-right 4px;
            font-size 20px;
          }

          &:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            content: '';
            background: #ddd;
            transform: scaleY(0.5);
            -webkit-transform: scaleY(0.5);
            z-index: 10;
          }
        }
      }
    }

    .btns {
      position relative;
      padding 10px 10px;
      width 100%;
      box-shadow 0 -1px 5px #ddd;
      background-color white;
      z-index 1;
      display flex;
      align-items center;
      justify-content flex-end;

      .row-btn {
        margin-left 8px;
        font-size $font-size-medium;
        padding 6px 8px;
        border-radius 16px;
        border-width 0.5px
        border-style solid
      }
    }
  }
</style>
