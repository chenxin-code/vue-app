/**Created by liaoyingchao on 2018/10/26.*/

<template>
  <div class="detail mall2">
    <div ref="detailTop2" class="detail-top"
         :style="{height: ($store.state.barHeight+$market.getNavHeight(true))+ 'px'}">
      <div class="navcontent"
           :style="{top: $store.state.barHeight+ 'px','height': $market.getNavHeight(true)+'px','line-height': $market.getNavHeight(true)+'px'}">
        <div class="nav-back-btn" style="left: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
             @click="backEvent" v-if="$store.state.webtype != 2">
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/back.png"/>
        </div>
        <div class="nav-back-btn" style="right: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
             @click="sharegoods" v-if="$store.state.webtype == 1">
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/fenxiang.png"/>
        </div>
        <div class="nav-back-btn" style="right: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
             @click="showShare" v-if="$store.state.webtype == 3">
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/share.png"/>
        </div>
      </div>
    </div>
    <div ref="detailTop1" class="detail-top" style="visibility: hidden;"
         :style="{height: ($store.state.barHeight+$market.getNavHeight(true))+ 'px'}" v-if="detailShow">
      <nav-top isMust="true" :noBack="$store.state.webtype == 2" :noTitle="true" @backEvent="backEvent">
        <transition name="transition1">
          <div class="detail-tab" style="left: 20%; right: 20%; font-size: 16px;" v-show="proView == 1">
            <div class="btn-div" :style="getSelectedTabStyle(1)" @click="toptabEvent(1)">
              商品
            </div>
            <div class="btn-div" :style="getSelectedTabStyle(2)" @click="toptabEvent(2)">
              详情
            </div>
            <div class="btn-div" :style="getSelectedTabStyle(3)" @click="toptabEvent(3)">
              评价
            </div>
            <div class="btn-div" :style="getSelectedTabStyle(4)" @click="toptabEvent(4)">
              推荐
              <!--<span :class="{theme_border_red_i: toptab == 4, theme_font_red_i: toptab == 4}"></span>-->
            </div>
          </div>
        </transition>
        <transition name="transition2">
          <div style="position: absolute;left: 20%; right: 20%; font-size: 18px;font-weight: 500;text-align: center;"
               v-show="proView == 2">
            图文详情
          </div>
        </transition>
        <div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 12px;"
             v-if="$store.state.webtype == 1" @click="sharegoods">
          <i class="iconfont mall-fenxiang theme_font_common" style="font-size: 20px;"></i>
        </div>
      </nav-top>
    </div>
    <div ref="scrollView" class="scroll-div theme_bg_white" :style="getScrollTop()" v-if="detailShow">
      <swiper class="main-swiper" ref="mySwiper" :options="mainSwiper">
        <swiper-slide :class="{'swiper-no-swiping': proView == 2}">
          <div class="main-swiper" style="position: relative;">
            <transition name="transition1">
              <div class="main-swiper theme_bg_white_f5" style="position: absolute;" v-show="proView == 1">
                <!--<div ref="scrollView1" @scroll="pageSite" @touchend="touchend" class="main-swiper enable-scroll theme_bg_white_f5" style="position: absolute;" v-show="proView == 1">-->
                <pull-to ref="pullTo1"
                         :bottomConfig="{pullText: '', triggerText: '释放显示商品详情', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                         :bottom-load-method="bottomPull" :top-load-method="topPull" :is-bottom-bounce="true"
                         :is-top-bounce="false" :doSiteCallback="true" @pageSite="pullScrollEvent">
                  <div>
                    <div class="swiper-div theme_bg_white">
                      <swiper :options="swiperOption">
                        <swiper-slide v-if="videoUrl != ''">
                          <video-player  class="video-player vjs-custom-skin"
                                         ref="videoPlayer"
                                         :playsinline="true"
                                         :options="playerOptions"
                          ></video-player>
                        </swiper-slide>
                        <swiper-slide v-for="(pic, pidx) in detailData.picUrls" :key="pidx">
                          <div class="swiper-img-div" @click="showBigImageEvent">
                            <img :src="pic"/>
                          </div>
                        </swiper-slide>
                      </swiper>
                      <div class="swiper-index">
                        <div class="si-item theme_bg_white_ef"
                             :class="{'cus-index': proImgIndex == idx, theme_bg_red_i: proImgIndex == idx}"
                             v-for="(d, idx) in arrLen"></div>
                      </div>
                    </div>
                    <div class="base-info theme_bg_white">
                      <div class="seconds-kill" v-if="detailData.mktActivityPriceLevel == 3 || showActivityTime == '1'">
                        <div class="left-div">
                          <div class="sk-row" v-if="showActivityTime != '1'">
                            <div class="price theme_font_white">
                              <span>￥</span>
                              <span class="price-z">{{detailData.dpedData.integer}}</span>
                              <span>.{{detailData.dpedData.decimals}}</span>
                            </div>
                            <div class="progress">
                              <mt-progress :value="detailData.soldNum || 0" :bar-height="16"></mt-progress>
                            </div>
                            <div class="progress-text theme_font_white" v-if="detailData.soldNum < 100">
                              已抢{{detailData.soldNum || 0}}%
                            </div>
                            <div class="progress-text theme_font_white" v-else>
                              已抢光
                            </div>
                          </div>
                          <div class="sk-row" v-else>
                            <div class="price theme_font_white">
                              <PriceOrder :detailColor="'white'" :detailitem="detailData"></PriceOrder>
                            </div>
                          </div>
                          <div class="sk-row">
                            <div class="sk-icon">
                              <i class="iconfont mall-icon-test theme_bg_white theme_font_red"></i>
                              <span class="theme_font_white">秒杀价</span>
                            </div>
                            <div class="o-price theme_font_white line-through" v-if="$store.state.globalConfig.priceShowType == 2">
                              ￥{{$util.toDecimal2(detailData.dpedData.linePrice)}}
                            </div>
                            <div class="o-price theme_font_white" v-else>
                              <span>原价:</span>￥{{$util.toDecimal2(detailData.dpedData.linePrice)}}
                            </div>
                          </div>
                        </div>
                        <div class="right-div theme_bg_light_red">
                          <div class="skr-row theme_font_red">
                            距离结束还剩:
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="$util.getDateFromString(detailData.mktEndDate)"></Countdown>
                          </div>
                        </div>
                      </div>
                      <div class="seconds-kill small" v-else-if="groupId != ''">
                        <div class="left-div">
                          <div class="sk-row">
                            <div class="price theme_font_white">
                              <span>￥</span>
                              <span class="price-z">{{getZhengshu(selectedProduct.groupPrice)}}</span>
                              <span>.{{getXiaoshu(selectedProduct.groupPrice)}}</span>
                            </div>
                            <div class="group-div">
                              {{groupData.groupBuyNumOfPerson}}人团
                            </div>
                          </div>
                          <div class="sk-row">
                            <div class="theme_font_white">
                              <span>单买价:</span>￥{{$util.toDecimal2(detailData.salePrice)}}
                            </div>
                          </div>
                        </div>
                        <div class="right-div theme_bg_light_red">
                          <div class="skr-row theme_font_red">
                            <!--距离结束还剩:-->
                            {{getTimeTitle()}}
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="getCountdownTime()"></Countdown>
                          </div>
                        </div>
                        <!--<div class="right-div theme_bg_light_red">-->
                          <!--<div class="skr-row theme_font_red">-->
                            <!--距离结束还剩:-->
                          <!--</div>-->
                          <!--<div class="skr-row">-->
                            <!--<Countdown :endTime="$util.getDateFromString(groupData.endDate)"></Countdown>-->
                          <!--</div>-->
                        <!--</div>-->
                      </div>
                      <!--<div class="price" v-if="detailData.mktActivityPriceLevel != 3 && showActivityTime != '1' && groupId == ''">-->
                      <div class="price" v-else>
                        <PriceOrder :detailitem="detailData"></PriceOrder>
                        <span class="price-small theme_font_tint left-m-8"
                              v-if="detailData.dpedData.linePrice" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                              <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{$util.toDecimal2($util.toDecimal2(detailData.dpedData.linePrice))}}</span>
                      </div>
                      <div class="row" v-if="noticeIsShow()">
                        <div class="activity-notice">
                          <div class="sk-icon">
                            <i class="iconfont mall-icon-test theme_bg_red theme_font_white"></i>
                            <span class="theme_font_red">{{detailData.noticeActivityDetail.activityType}}价</span>
                          </div>
                          <div class="notice-price theme_font_red">
                            {{getNoticeTime() + ' ' + getNoticePrice()}}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="title theme_font_black" v-html="detailData.showTitle"></div>
                      </div>
                      <!--<div class="row desc">-->
                      <!--<div class="act-item-full theme_bg_red theme_font_white" v-if="detailData.storeType == '0'">自营</div>-->
                      <!--<div class="theme_font_tint desc-text">赖茅传喜53度500ml 香甜味美 佳节送礼首选 超美味特香醇 很好喝的白酒</div>-->
                      <!--</div>-->
                    </div>
                    <div class="block-div theme_bg_white" v-if="productType == 4">
                      <div class="flex-row">
                        <div class="title theme_font_black">套装明细</div>
                      </div>
                      <div class="pro-row" v-for="pro in detailData.packageSkuList">
                        <div class="img-div">
                          <img :src="pro.phMainUrl">
                        </div>
                        <div class="info-div">
                          <div class="title pro-title-height double-line theme_font_black" v-html="pro.showTitle"></div>
                          <div class="feature-names double-line theme_font_tint">{{pro.featureNames}}</div>
                          <div class="price">
                            <span class="font-small theme_font_tint" style="float: right;">x {{pro.skuNum}} {{pro.metric}}</span>
                            <span class="font-small theme_font_red">￥</span>
                            <span class="price-mid theme_font_red full">{{pro.salePrice}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--<div class="block-div theme_bg_white" v-if="singleActivities_2.length > 0 && curSingleActivity != null">-->
                      <!--<div class="flex-row">-->
                        <!--<p class="sl-tag theme_border_red_i theme_font_red">{{curSingleActivity.activityType}}</p>-->
                        <!--<p class="sl-title single-line">{{curSingleActivity.activityTitle}} <span class="theme_standard_font">{{curSingleActivity.points}}积分 + ¥{{$util.toDecimal2(curSingleActivity.activityPrice)}}</span></p>-->
                        <!--<p class="good-salespro-right" v-if="singleActivities_2.length > 1" @click="reviseSingleActivity()">修改</p>-->
                        <!--<p class="good-salespro-right" v-if="singleActivities_2.length == 1" @click="removeSingleActivity()">不参加</p>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="block-div theme_bg_white" v-if="singleActivities_2.length > 0 && curSingleActivity == null">-->
                      <!--<div class="flex-row" v-for="saitem in singleActivities_2">-->
                        <!--<p class="sl-tag theme_standard_bdr_i theme_standard_font">{{saitem.activityType}}</p>-->
                        <!--<p class="sl-title single-line">{{saitem.activityTitle}} <span class="theme_standard_font">{{saitem.points}}积分 + ¥{{$util.toDecimal2(saitem.activityPrice)}}</span></p>-->
                        <!--<p class="good-salespro-right" @click="joinSingleActivity(saitem)">参加</p>-->
                      <!--</div>-->
                    <!--</div>-->
                    <div class="block-div theme_bg_white">
                      <div class="flex-row" @click="couponEvent">
                        <div class="label-middle theme_font_gray">领券</div>
                        <div class="font-small theme_font_tint" v-if="detailData.couponModels == ''">暂无可用优惠券</div>
                        <div class="act-item-full theme_standard_bg theme_font_white"
                             v-if="detailData.couponModels != '' && cidx < 2"
                             v-for="(couponModel, cidx) in detailData.couponModels">{{couponModel.couTypeTitle}}
                        </div>
                        <div class="full"></div>
                        <div>
                          <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                        </div>
                      </div>
                      <div class="flex-row" v-for="(aactivity, aidx) in detailData.activityList"
                           @click="showActivity = true">
                        <div class="label-middle theme_font_gray">{{ aidx == 0 ? '促销' : '' }}</div>
                        <div class="act-item-empty theme_standard_font theme_standard_bdr single-line">{{aactivity.type}}</div>
                        <div class="activity-text theme_font_common full single-line">{{aactivity.title}}</div>
                        <div v-if="aidx == 0">
                          <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                        </div>
                      </div>
                    </div>
                    <div class="block-div theme_bg_white" v-if="groupMembers.length > 0">
                      <div class="flex-row">
                        <div class="group-header" >
                          <div class="yuan" v-for="(gmember, idx) in groupMembers">
                            <img :src="gmember.userAvatar" v-if="gmember.userAvatar">
                            <span class="group-tz" v-if="idx == 0">团长</span>
                          </div>
                          <div class="yuan" v-if="surplusMember != 0">
                            <img src="static/image/mall2/addp.png">
                          </div>
                        </div>
                        <div class="group-info full">
                          <p v-if="surplusMember == 0">已成团</p>
                          <p v-else>还差{{surplusMember}}人成团</p>
                          <p class="font-small theme_font_gray time-row" v-if="surplusMember != 0"><span>剩余：</span><Countdown :endTime="$util.getDateFromString(surplusTime)"></Countdown></p>
                        </div>
                        <div class="group-join theme_standard_bg" @click="joinGroupEvent" v-if="!hasMe && surplusMember != 0">去参团</div>
                        <div class="group-join theme_standard_bg" @click="inviteFriends" v-if="hasMe && surplusMember != 0">邀请好友</div>
                      </div>
                    </div>
                    <div class="block-div theme_bg_white">
                      <div class="flex-row" @click="proSelectEvent">
                        <div class="label-middle theme_font_gray">已选</div>
                        <div class="theme_font_black" style="font-weight: 500;">{{selectedText}}</div>
                        <!--<div class="theme_font_black">1件</div>-->
                        <div class="full"></div>
                        <div>
                          <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                        </div>
                      </div>
                    </div>
                    <div class="block-div no-padding-bottom theme_bg_white" v-if="detailData.productType != 5">
                      <!--<div class="flex-row" @click="selectDeliveryType" v-if="detailData.orginDeliveryType != detailData.deliveryType">-->
                        <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                        <!--<div class="theme_font_black full">-->
                          <!--{{detailData.deliveryType == '1' ? '自提' : '配送'}}-->
                        <!--</div>-->
                        <!--<div>-->
                          <!--<i class="iconfont mall-gengduo more-icon theme_font_tint"></i>-->
                        <!--</div>-->
                      <!--</div>-->
                      <div class="flex-row" style="align-items: flex-start;" @click="selectArea"
                           v-if="detailData.deliveryType == '2'">
                        <div class="label-middle theme_font_gray">送至</div>
                        <div class="theme_font_black full address-div" v-if="$store.state.mall2.selectAddress.id == ''">
                          {{regionText}}
                        </div>
                        <div class="theme_font_black full address-div" v-if="$store.state.mall2.selectAddress.id != ''">
                          {{$store.state.mall2.selectAddress.addressFull}}
                        </div>
                        <div>
                          <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                        </div>
                      </div>
                      <!--<div class="flex-row" v-if="detailData.deliveryType == '2'">-->
                      <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                      <!--<div class="theme_font_black">{{detailData.distriParty}}</div>-->
                      <!--</div>-->
                      <div class="flex-row" v-if="detailData.deliveryType == '1'" @click="selectPickUpAddress">
                        <div class="label-middle theme_font_gray">自提点</div>
                        <div class="theme_font_black">{{$store.state.mall2.zitiAddress.storeName}}</div>
                        <div class="full"></div>
                        <div>
                          <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                        </div>
                      </div>
                      <!--<div class="flex-row" v-if="detailData.deliveryType == '1'">-->
                      <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                      <!--<div class="theme_font_black">上门自提</div>-->
                      <!--</div>-->
                      <div class="color-row theme_bg_dark">
                        <div class="server-item" v-for="server in detailData.saleServices"
                             v-if="parseInt(server.days) > 0">
                          <i class="iconfont mall-dui theme_standard_font icon-font"></i>
                          <span>{{getServerText(server)}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="block-div theme_bg_white" v-if="detailComment.evaluateCount > 0">
                      <div class="flex-row" @click="allCommentEvent">
                        <div class="title theme_font_black" v-if="detailComment.evaluateCount == 0">暂无评价</div>
                        <div class="title theme_font_black" v-if="detailComment.evaluateCount > 0">
                          评价（{{detailComment.evaluateCount}}）
                        </div>
                        <div class="full"></div>
                        <div class="font-small right-margin theme_font_common" v-if="detailComment.evaluateCount > 0">
                          <span>好评率</span>
                          <span class="theme_standard_font">{{detailComment.evaluateGoodRate}}</span>
                        </div>
                        <div>
                          <i class="iconfont mall-gengduojiantou icon-font theme_font_common"></i>
                        </div>
                      </div>
                      <div class="comment-div" v-for="comment in detailComment.evaluateList">
                        <div class="flex-row comment-row theme_font_common">
                          <div class="header-img right-margin">
                            <img
                              :src="comment.userAvtUrl != '' ? comment.userAvtUrl : 'static/image/mall2/header.png'"/>
                          </div>
                          <div class="right-margin full">{{getCommentUserStr(comment)}}</div>
                          <div class="">
                            <i class="iconfont mall-xingxing icon-level theme_font_tint"
                               :class="{theme_standard_font_i: comment.score >= lv}" v-for="lv in 5"></i>
                          </div>
                        </div>
                        <div class="flex-row comment-row theme_font_gray">
                          <div style="line-height: 1.4;">{{comment.evaluateContent}}</div>
                        </div>
                        <div class="imgs" v-if="comment.evaluateImages != ''">
                          <div class="s-img-div" v-for="(pic, idx) in getCommentImgs(comment.evaluateImages)"
                               v-if="idx < 4">
                            <img :src="pic">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="block-div theme_bg_white">
                      <div class="flex-row" @click="toShop">
                        <!--<div class="logo">-->
                        <!--<img src="static/testImg/shop-logo.png"/>-->
                        <!--</div>-->
                        <div class="shop-title"><i
                          class="iconfont mall-dianpu dianpu-icon theme_standard_font"></i>{{detailData.storeOuName}}
                        </div>
                        <div class="act-item-full theme_standard_bg theme_font_white" v-if="detailData.storeType == '0'">自营</div>
                        <div class="full"></div>
                        <div>
                          <i class="iconfont mall-gengduojiantou icon-font"></i>
                        </div>
                      </div>
                      <!--<div class="flex-row">-->
                      <!--<div class="full shop-info">-->
                      <!--<p class="theme_font_common">2000</p>-->
                      <!--<p class="theme_font_gray">关注人数</p>-->
                      <!--</div>-->
                      <!--<div class="full shop-info">-->
                      <!--<p class="theme_font_common">80</p>-->
                      <!--<p class="theme_font_gray">全部商品</p>-->
                      <!--</div>-->
                      <!--</div>-->
                    </div>
                    <div class="block-div theme_bg_white" v-if="detailData.packageList.length > 0">
                      <div class="flex-row">
                        <div class="title theme_font_black">组合套装</div>
                      </div>
                      <div class="recommend-div padding-bottom-8">
                        <div class="pro-div" v-for="item in detailData.packageList" @click="productPickageEvent(item)">
                          {{dataProcessing(item)}}
                          <div class="img-div">
                            <img :src="item.phMainUrl">
                          </div>
                          <div class="title single-line theme_font_black">{{item.skuName}}</div>
                          <div class="price single-line">
                            <span class="font-small theme_font_red">￥</span>
                            <span class="left-no-space price-z theme_font_red">{{item.dpedData.integer}}</span>
                            <span class="left-no-space font-small theme_font_red">.{{item.dpedData.decimals}}</span>
                            <span class="font-small theme_font_tint left-m-8"
                                  v-if="item.dpedData.linePrice" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                              <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{$util.toDecimal2(item.dpedData.linePrice)}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="block-div theme_bg_white" v-if="detailData.recommendSkuList && detailData.recommendSkuList.length > 0">
                      <div class="flex-row">
                        <div class="title theme_font_black">为你推荐</div>
                      </div>
                      <div class="recommend-div">
                        <div class="pro-div" v-for="item in detailData.recommendSkuList" @click="productEvent(item)">
                          {{dataProcessing(item)}}
                          <div class="img-div">
                            <img :src="item.phMainUrl">
                          </div>
                          <div class="title single-line theme_font_black">{{item.skuName}}</div>
                          <div class="price single-line">
                            <PriceOrder :listitem='item'></PriceOrder>
                          </div>
                        </div>
                      </div>
                      <div class="more-btn">
                        <label class="act-item-empty theme_standard_font theme_standard_bdr"
                               @click="moreRecommend">更多推荐</label>
                      </div>
                    </div>
                    <div class="load-next theme_bg_white">
                      <img src="static/image/mall2/load-next.png">
                      <span class="theme_font_tint">上拉加载图文详情</span>
                    </div>
                  </div>
                </pull-to>
              </div>
            </transition>
            <transition name="transition2">
              <div class="main-swiper" style="position: absolute; top: 44px;" v-show="proView == 2">
                <div class="btns-div theme_bg_white">
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 1}"
                       @click="introductionSelected(1)">商品介绍
                  </div>
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 2}"
                       @click="introductionSelected(2)">规格参数
                  </div>
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 3}"
                       @click="introductionSelected(3)">售后包装
                  </div>
                </div>
                <div class="detail-div detail-div-1">
                  <pull-to ref="pullTo2"
                           :topConfig="{pullText: '', triggerText: '释放显示商品介绍', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                           :top-load-method="topPull" :is-bottom-bounce="false" :is-top-bounce="true">
                    <!--<div class="introduction-div">-->
                    <!--<img src="static/testImg/detail.png"/>-->
                    <!--</div>-->
                    <div class="detail-content detail-bottom">
                      <div class="tip" v-if="introductionIndex == 1">
                        <span class="line"></span>
                        <span class="text">商品信息</span>
                        <span class="line"></span>
                      </div>
                      <div v-html="introduction1" class="introduction-div" v-if="introductionIndex == 1"></div>
                      <div v-html="introduction2" class="introduction-div" v-if="introductionIndex == 2"></div>
                      <div v-html="introduction3" class="introduction-div" v-if="introductionIndex == 3"></div>
                    </div>
                  </pull-to>
                </div>
              </div>
            </transition>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative;">
            <div ref="scrollView2" class="main-swiper-scroll-content enable-scroll" style="top: 44px;">
              <div class="detail-div">
                <div class="btns-div theme_bg_white">
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 1}"
                       @click="introductionSelected(1)">商品介绍
                  </div>
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 2}"
                       @click="introductionSelected(2)">规格参数
                  </div>
                  <div class="btn-item theme_font_gray" :class="{theme_standard_font_i: introductionIndex == 3}"
                       @click="introductionSelected(3)">售后包装
                  </div>
                </div>
                <!--<div class="introduction-div">-->
                <!--<img src="static/testImg/detail.png"/>-->
                <!--</div>-->
                <div class="detail-content">
                  <div class="tip" v-if="introductionIndex == 1">
                    <span class="line"></span>
                    <span class="text">商品信息</span>
                    <span class="line"></span>
                  </div>
                  <div v-html="introduction1" class="introduction-div" v-if="introductionIndex == 1"></div>
                  <div v-html="introduction2" class="introduction-div" v-if="introductionIndex == 2"></div>
                  <div v-html="introduction3" class="introduction-div" v-if="introductionIndex == 3"></div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative;">
            <div ref="scrollView3" class="main-swiper-scroll-content enable-scroll" style="top: 44px;">
              <Judgement :skuId="this.skuId" v-show="toptab == 3" v-if="load3"
                         @showBigImgs="showBigImgsEvent"></Judgement>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative;">
            <div ref="scrollView4" class="main-swiper-scroll-content enable-scroll" style="top: 44px;">
              <Recommend :deliveryType="this.deliveryType" :skuId="this.skuId" v-show="toptab == 4"
                         v-if="load4"></Recommend>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="bottom-tip theme_bg_yl theme_standard_font_i" v-if="canSale == false">该商品在该地区暂不支持配送，非常抱歉！</div>
    <div class="bottom-btns" v-if="detailShow">
      <div class="btn full" ref="gouwuche" @click="toCart">
        <p class="cart-num theme_bg_red theme_font_white" v-if="$store.state.mall2.cartNum > 0">
          {{$store.state.mall2.cartNum}}</p>
        <i class="iconfont mall-gouwuche btn-icon theme_font_gray"></i>
        <p class="text">购物车</p>
      </div>
      <div class="btn full" @click="toShop">
        <i class="iconfont mall-dianpu btn-icon theme_font_gray"></i>
        <p class="text">店铺</p>
      </div>
      <div class="btn full" @click="collectEvent">
        <i class="iconfont mall-shoucang btn-icon theme_font_gray" v-if="isCollect == 'false'"></i>
        <!--<i class="iconfont mall-shoucang btn-icon theme_font_red" v-if="isCollect == 'true'"></i>-->
        <transition :name="collectName">
          <img class="btn-img" src="static/image/mall2/collect.png" v-if="isCollect == 'true'">
        </transition>
        <p class="text">收藏</p>
      </div>
      <div class="btn theme_standard_bg theme_font_white" @click="addToCart"
           v-if="stockNum != 0 && canSale == true && detailData.status != '0' && groupId == ''">
        <p class="title">加入购物车</p>
      </div>
      <div class="btn theme_bg_y theme_font_white" @click="buyNowEvent"
           v-if="stockNum != 0 && canSale == true && detailData.status != '0' && groupId == ''">
        <p class="title">立即购买</p>
      </div>
      <!--拼团按钮-->
      <div class="btn theme_bg_y theme_font_white group-btn" @click="buyNowEvent"
           v-if="stockNum != 0 && canSale == true && detailData.status != '0' && groupId != ''">
        <p class="price">
          <span>￥</span>
          <span class="big">{{detailData.dpedData.integer}}</span>
          <span>.{{detailData.dpedData.decimals}}</span>
        </p>
        <p class="big">立即购买</p>
      </div>
      <div class="btn theme_standard_bg theme_font_white group-btn" @click="openGroup"
           v-if="stockNum != 0 && canSale == true && detailData.status != '0' && groupId != '' && isAddGroup == '0'">
        <p class="price">
          <span>￥</span>
          <span class="big">{{getZhengshu(selectedProduct.groupPrice)}}</span>
          <span>.{{getXiaoshu(selectedProduct.groupPrice)}}</span>
        </p>
        <p class="big">立即开团</p>
      </div>
      <div class="btn theme_standard_bg theme_font_white group-btn" @click="joinGroupEvent"
           v-if="stockNum != 0 && canSale == true && detailData.status != '0' && groupId != '' && isAddGroup == '1'">
        <p class="price">
          <span>￥</span>
          <span class="big">{{getZhengshu(selectedProduct.groupPrice)}}</span>
          <span>.{{getXiaoshu(selectedProduct.groupPrice)}}</span>
        </p>
        <p class="big">立即参团</p>
      </div>
      <!--<div class="btn theme_standard_bg theme_font_white" @click="addToCart"-->
           <!--v-if="stockNum != 0 && canSale == true && detailData.status != '0'">-->
        <!--<p class="title">加入购物车</p>-->
      <!--</div>-->
      <!--<div class="btn big-btn theme_bg_y theme_font_white" @click="noStockEvent" v-if="detailData.status">-->
      <!--<p class="title">'商品已下架'</p>-->
      <!--</div>-->
      <div class="btn big-btn theme_bg_y theme_font_white" @click="noStockEvent"
           v-if="stockNum == 0 && canSale == true && detailData.status != '0'">
        <p class="title">商品缺货</p>
      </div>
      <div class="btn big-btn theme_bg_y theme_font_white" @click="canNotSaleEvent"
           v-if="canSale == true && detailData.status == '0'">
        <p class="title">商品已下架</p>
      </div>
      <div class="btn big-btn theme_bg_y theme_font_white" @click="canNotSaleEvent" v-if="canSale == false">
        <p class="title">不在可售区域</p>
      </div>
    </div>
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pro-row">
          <div class="img-div">
            <img :src="detailData.phMainUrl">
          </div>
          <div class="info-div">
            <div class="title theme_font_black" v-html="detailData.showTitle"></div>
            <div class="theme_font_red" v-if="popFlag == 'openGroup'">
              <div class="group-price">
                <span>￥</span>
                <span class="big">{{getZhengshu(selectedProduct.groupPrice)}}</span>
                <span>.{{getXiaoshu(selectedProduct.groupPrice)}}</span>
              </div>
              <div class="group-div">
                {{groupData.groupBuyNumOfPerson}}人团
              </div>
            </div>
            <div class="price" v-else>
              <PriceOrder :listitem="detailData"></PriceOrder>
            </div>
          </div>
        </div>
        <div class="pop-scroll-div">
          <div class="items-div" v-for="(feature, fidx) in detailData.featureList" v-if="featureRefresh && groupId == ''">
            <div class="title theme_font_common">{{feature.featureName}}</div>
            <div class="item theme_font_common theme_bg_white_ef"
                 :class="{'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i': subFeature.selected, 'theme_font_tint_i': getCanSelectWith(fidx, subFeature)}"
                 v-for="subFeature in feature.featureValueList" @click="subFeatureEvent(subFeature, fidx)">
              {{subFeature.featureValue}}
            </div>
          </div>
          <div class="items-div" v-if="groupId != ''">
            <div class="item theme_font_common theme_bg_white_ef" :class="{'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i': groupSku.sku.skuId == skuId}" v-for="groupSku in groupProducts" @click="selectGroupSku(groupSku)">
              {{groupSku.sku.specs}}
            </div>
          </div>
          <div class="count-line">
            <div class="full theme_font_common">购买数量（库存 {{stockNum < 1000 ? stockNum : '充足'}}）</div>
            <!--<Counter v-model="selectedNum" :minValue="minNum" :stepNum="stepNum" :maxValue="maxNum"-->
                     <!--@numChange="numChange"></Counter>-->
            <van-stepper v-model="selectedNum" :min="minNum" :max="maxNum" :step="stepNum" @change="numChange" integer/>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent"
             v-if="popFlag == 'addToCart'">加入购物车
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent"
             v-if="popFlag == 'buyNow'">立即购买
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent"
             v-if="popFlag == 'openGroup'">立即开团
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent"
             v-if="popFlag == 'joinGroup'">立即参团
        </div>
      </div>
    </pop-view>
    <pop-view v-if="showActivity" @closeEvent="showActivity = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">促销</div>
        <div class="pop-scroll-div">
          <div class="activity-div" v-for="(aactivity, aidx) in detailData.activityList"
               @click="activityProducts(aactivity)">
            <div class="act-item-empty theme_border_red theme_font_red">{{aactivity.type}}</div>
            <div class="activity-text theme_font_common full">{{aactivity.title}}</div>
            <i class="iconfont mall-gengduojiantou more-icon theme_font_tint"></i>
          </div>
        </div>
      </div>
    </pop-view>
    <pop-view v-if="showSelectDeliveryType" @closeEvent="showSelectDeliveryType = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">切换配送方式</div>
        <div class="pop-scroll-div">
          <div class="activity-div" @click="changeDelivery('1')">
            <div class="act-item-empty theme_border_red theme_font_red">自提</div>
            <div class="activity-text theme_font_common full">您需要到选中的自提点提货</div>
            <i class="iconfont more-icon" :class="detailData.deliveryType == '1' ? ['mall-xuanzhong', 'theme_font_red'] : ['mall-weixuanzhong', 'theme_font_tint']"></i>
          </div>
          <div class="activity-div" @click="changeDelivery('2')">
            <div class="act-item-empty theme_border_red theme_font_red">配送</div>
            <div class="activity-text theme_font_common full">将会送至您指定的位置</div>
            <i class="iconfont more-icon" :class="detailData.deliveryType == '2' ? ['mall-xuanzhong', 'theme_font_red'] : ['mall-weixuanzhong', theme_font_tint]"></i>
          </div>
        </div>
      </div>
    </pop-view>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent"
                  @closeEvent="regionCloseEvent"></RegionSelect>
    <transition name="bounce" @afterEnter="productImgAfterEnter">
      <img :src="this.detailData.phMainUrl" alt="" class="productImg" v-if="showProductImg">
    </transition>
    <transition @after-enter='afterEnter' @before-enter="beforeEnter">
      <div class="anProductImg" v-if="showAddCartAn">
        <img :src="this.detailData.phMainUrl" alt="">
      </div>
    </transition>
    <BigImage :initIndex="videoUrl != '' ? proImgIndex - 1 : proImgIndex" :picUrls="detailData.picUrls" v-if="showBigImage"
              @closeEvent="closeBigImage"></BigImage>
    <BigImage :picUrls="picUrls" v-if="showPicUrls" @closeEvent="closeBigImage"></BigImage>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
  // import Counter from '@/components/commonui/counter/counter'
  import Judgement from '../detail/judgement/judgement'
  import RegionSelect from '../../base/region-select'
  import Recommend from '../detail/recommend/index'
  import Coupon from '../common/coupon'
  import Address from '../common/address'
  import PickupAddress from '../common/pickup-address'
  import BigImage from '../common/big-image/index'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import Countdown from "../../Vendor/countdown/countdown";
  import PriceOrder from '@/components/commonui/price/price-order'
  import Config from '@/api/config'
  import wxfunc from '@/utils/wxfunc'
  import WechatOP from '@/utils/WechatOP'
  import InitialLoadPickupAny from '@/utils/initialLoadPickupAny.js'
  import SalesPro from '../common/salepro'
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'
  import ShareImage from '../detail/shareImage'
  import appShare from "@zkty-team/x-engine-module-share";

  export default {
    name: "detail",
    components: {
      Countdown,
      // Counter,
      Judgement,
      RegionSelect,
      Recommend,
      PullTo,
      BigImage,
      PriceOrder,
      videoPlayer
    },
    data() {
      let that = this;
      return {
        id: '',
        skuId: '',
        productType: '',
        toptab: 1,
        proImgIndex: 1,
        proView: 1,
        page1ScrollTop: 0,
        deliveryType: 2,
        collectName: '',
        mainSwiper: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed: 200,
          autoplay: false,
          loop: false,
          paginationShow: true,
          initialSlide: 0,
          observer: true,
          observeParents: true,
          scrollbarDraggable: true,
          scrollbarSnapOnRelease: true,
          scrollbarHide: false,
          on: {
            slideChange: function () {
              that.toptab = this.realIndex + 1;
              if (that.toptab == 3) {
                that.load3 = true
              } else if (that.toptab == 4) {
                that.load4 = true
              }
              if (this.realIndex == 0) {
                if (that.page1ScrollTop < 200) {
                  let opacity = that.page1ScrollTop / 200;
                  if (opacity < 0.2) {
                    that.$refs.detailTop2.style.visibility = "visible";
                    that.$refs.detailTop1.style.visibility = 'hidden';
                    that.$refs.detailTop2.style.opacity = 1;
                  } else if (opacity < 1) {
                    that.$refs.detailTop2.style.visibility = "visible";
                    that.$refs.detailTop1.style.visibility = "visible";
                    that.$refs.detailTop2.style.opacity = 1 - opacity;
                    that.$refs.detailTop1.style.opacity = opacity;
                  }
                  return;
                }
                that.$refs.detailTop2.style.visibility = "visible";
                that.$refs.detailTop1.style.visibility = "visible";
                that.$refs.detailTop2.style.opacity = 0
                that.$refs.detailTop1.style.opacity = 1;
              } else {
                that.$refs.detailTop2.style.visibility = "visible";
                that.$refs.detailTop1.style.visibility = "visible";
                that.$refs.detailTop2.style.opacity = 0
                that.$refs.detailTop1.style.opacity = 1;
              }
            },
          }
        },
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed: 500,
          autoplay: {
            delay: 3000,//1秒切换一次
            clickable: true,
            disableOnInteraction: false,
          },
          loop: true,
          paginationShow: true,
          initialSlide: 0,
          observer: true,
          observeParents: true,
          scrollbarDraggable: true,
          scrollbarSnapOnRelease: true,
          scrollbarHide: false,
          on: {
            slideChange: function () {
              that.proImgIndex = this.realIndex
            },
          }
        },
        introductionIndex: 1,
        showPop: false,
        selectedText: '',
        itemSelected: 1,
        selectedNum: 1,
        stepNum: 1,
        maxNum: 1,
        minNum: 1,
        stockNum: 1,
        detailData: {},
        detailShow: false,
        popFlag: 'addToCart',
        detailComment: {},
        commentListShow: false,
        selectedAddress: '',
        showSelect: false,
        regionText: '请选择配送区域',
        region: [],
        initData: {
          title: '请选择地区'
        },
        recommendListShow: false,
        showActivity: false,
        myFeatures: [],
        introduction1: '',
        introduction2: '',
        introduction3: '',
        isCollect: 'false',
        scrollTopValue2: 0,
        scrollTopValue3: 0,
        scrollTopValue4: 0,
        scrollTopValue5: 0,
        load3: false,
        load4: false,
        //加入购物车的时候  显示图片动画
        showProductImg: false,
        // 抛物线动画
        showAddCartAn: false,
        // address 历史保存
        addressies: [],
        backLoadStock: false,
        showBigImage: false,
        picUrls: [],
        showPicUrls: false,
        lastPath: '',
        featureRefresh: true,
        canSale: true,
        //匹配出来的address
        matchAddress: null,
        // 活动剩余库存
        mktStockNum: -1,
        // 活动id 秒杀的时候才有
        activityId: '',
        // 等级为2的单品活动
        singleActivities_2: [],
        curSingleActivity: null,
        showSelectDeliveryType: false,
        videoUrl: '',
        playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: true, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '1:1', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: ""
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: true,
            fullscreenToggle: true  //全屏按钮
          }
        },
        arrLen: 0,
        showActivityTime: '0',
        groupId: '',
        groupData: {},
        groupProducts: [],
        selectedProduct: {},
        spuId: '',
        mktGroupBuyId: '',
        groupMembers: [],
        surplusMember: 1,
        surplusTime: '',
        hasMe: false,
        joinOrderId: '',
        orderId: '',
        isAddGroup: '0',
        shareView: false
      }
    },
    methods: {
      getCountdownTime: function () {
        let nowT = this.$store.state.severTime.currentTime
        let startT = this.$util.getDateFromString(this.groupData.startDate)
        if (nowT < startT) {
          return startT

        }
        let endT = this.$util.getDateFromString(this.groupData.endDate)
        if (nowT < endT) {
          return endT
        }
        return endT
      },
      getTimeTitle: function () {
        let nowT = this.$store.state.severTime.currentTime
        let startT = this.$util.getDateFromString(this.groupData.startDate)
        if (nowT < startT) {
          return '距离开始还剩:'
        }
        let endT = this.$util.getDateFromString(this.groupData.endDate)
        if (nowT < endT) {
          return '距离结束还剩:'
        }
        return '活动已结束'
      },
      showShare() {
        // 打开弹框
        if (Object.keys(this.detailData).length > 0) {
          ShareImage.show({
            proData: this.detailData || {}
          })
        }
      },
      inviteFriends: function () {
        this.sharegoods(this.orderId)
      },
      selectGroupSku: function (groupSku) {
        this.selectedProduct = groupSku
        this.id = ''
        this.myFeatures = [];
        this.skuId = this.selectedProduct.sku.skuId
        this._getProductDetail();
      },
      changeDelivery: function (type) {
        this.showSelectDeliveryType = false
        this.$store.state.mall2.staticDeliverType = type
        this.$bridgefunc.vuexStorage()
        this.deliveryType =  this.$store.state.mall2.staticDeliverType
        //微信类型
        if (this.$store.state.webtype == 2) {
          this.getWechatDatas();
        } else {
          this.getDatas();
        }
      },
      selectDeliveryType: function () {
        this.showSelectDeliveryType = true
      },
      removeSingleActivity: function () {
        this.activityId = '-2'
        this._getProductDetail()
      },
      reviseSingleActivity: function () {
        let listData = [];

        for (let i = 0; i < this.singleActivities_2.length; i++) {
          let item = this.singleActivities_2[i];
          listData.push({
            mktActivityId: item.activityId,
            title: item.activityTitle + ' ' + item.points + '积分+¥' + this.$util.toDecimal2(item.activityPrice),
            checked: item.activityId == this.curSingleActivity.activityId
          })
        }
        listData.push({
          mktActivityId: '-2',
          title: '不参加兑换活动',
          checked: false
        })
        SalesPro.open({
          listData: listData,
          sureFunc: (item1) => {
            this.activityId = item1.mktActivityId
            this._getProductDetail()
          }
        });
      },
      joinSingleActivity: function (saitem) {
        this.activityId = saitem.activityId
        this._getProductDetail();
      },
      noticeIsShow: function () {
        if (this.detailData.noticeActivityDetail && this.detailData.noticeActivityDetail != '' && this.detailData.noticeActivityDetail.activityPrice && this.detailData.noticeActivityDetail.activityPrice != '') {
          let flag = new Date(this.detailData.noticeActivityDetail.startTime.replace(/\-/g, '/')).getTime() > this.$store.state.severTime.currentTime * 1000
          return flag
        }
        return false
      },
      getNoticeTime: function () {
        let time = this.detailData.noticeActivityDetail.startTime.replace(/\-/g, '/')
        var oDate = new Date(time),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMinute = oDate.getMinutes(),

          oTime = this.$util.getzf(oMonth) + '月' + this.$util.getzf(oDay) + '日' + this.$util.getzf(oHour) + ':' + this.$util.getzf(oMinute);//最后拼接时间
        return oTime;
      },
      getNoticePrice: function () {
        let price = this.detailData.noticeActivityDetail.activityPrice
        let activityType = this.detailData.noticeActivityDetail.activityType
        return activityType + '价￥' + this.$util.toDecimal2(price)
      },
      getScrollTop: function () {
        return 'top: ' + this.$store.state.barHeight + 'px;';
      },
      canNotSaleEvent: function () {
        this.$Toast('当前区域不可售')
      },
      noStockEvent: function () {
        // if (this.detailData.mktActivityPriceLevel == 3) {
        //   this.$Toast('秒杀商品已抢光！')
        //   return;
        // }
        this.$Toast('当前地区没有库存！')
      },
      descartesInList: function (descartes, kyList) {
        let ican = false
        for (let i = 0; i < kyList.length; i++) {
          let kyStr = kyList[i]
          let arr = kyStr.split(',')
          if (descartes.length == arr.length) {
            for (let j = 0; j < arr.length; j++) {
              let s1 = descartes[j]
              if (s1 == '*') {
                ican = true
                continue;
              }
              let s2 = arr[j]
              if (s1 == s2) {
                ican = true
              } else {
                ican = false
                break
              }
            }
            if (ican) {
              return false
            }
          }
        }
        return true
      },
      getCanSelectWith: function (fidx, subFeature) {
        if (subFeature.selected) {
          return false
        }
        let kyList = this.detailData.kyList
        let featureList = this.detailData.featureList
        let descartes = []
        for (let i = 0; i < featureList.length; i++) {
          if (i == fidx) {
            descartes.push(subFeature.featureValueId)
            continue;
          }
          let item = featureList[i]
          let hasSelected = false
          for (let j = 0; j < item.featureValueList.length; j++) {
            let subItem = item.featureValueList[j]
            if (subItem.selected) {
              hasSelected = true
              descartes.push(subItem.featureValueId)
              break;
            }
          }
          if (!hasSelected) {
            descartes.push('*')
          }
        }
        return this.descartesInList(descartes, kyList)
      },
      productPickageEvent: function (product) {
        // this.$Toast('开发中')
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2) {
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: product.id,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType
          }
        })
      },
      getSelectedTabStyle: function (idx) {
        if (idx == this.toptab) {
          return {fontWeight: '600', fontSize: '18px'}
        } else {

        }
      },
      showBigImgsEvent: function (arr) {
        this.picUrls = arr
        this.showPicUrls = true
      },
      getCommentImgs: function (imgsStr) {
        if (imgsStr != '') {
          return imgsStr.split(',')
        }
        return []
      },
      closeBigImage: function () {
        this.showBigImage = false
        this.showPicUrls = false
      },
      showBigImageEvent: function () {
        this.showBigImage = true
      },
      productEvent: function (product) {
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2) {
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: product.id,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType,
          }
        })
      },
      productImgAfterEnter: function (el) {
        this.showProductImg = false
        this.showAddCartAn = true
      },
      beforeEnter(el) {
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el) {
        let elBottom = el.getBoundingClientRect().bottom;
        let elLeft = el.children[0].getBoundingClientRect().left
        let gwcLeft = this.$refs.gouwuche.getBoundingClientRect().left;
        let gwcBottom = this.$refs.gouwuche.getBoundingClientRect().top;
        el.style.transform = `translate3d(0,${gwcBottom - elBottom}px,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
        el.children[0].style.transform = `translate3d(${gwcLeft - elLeft}px,0,0)`;
        el.children[0].style.transition = 'transform .55s linear';
        el.children[0].style.opacity = 1;

        // el.addEventListener('transitionend', () => {
        this.showAddCartAn = false
        // })
        // el.addEventListener('webkitAnimationEnd', () => {
        //   this.showAddCartAn = false
        // })
      },
      _setDefaultPickupAddress: function (id) {
        let url = '/app/json/user_address/addDefaultAddress';
        let params1 = {
          token: this.$store.state.login.token,
          selfId: id
        }
        this.$http.post(url, params1).then(res => {
        }, error => {
        });
      },
      selectPickUpAddress: function () {
        PickupAddress.open({
          initData: {
            selectedId: this.$store.state.mall2.zitiAddress.id,
            token: this.$store.state.login.token,
            posx: this.$store.state.currentLocation.posx,
            posy: this.$store.state.currentLocation.posy,
            skuIds: [this.detailData.skuId],
            tags: this.groupData.storeInfo.pickupStoreOuCode
          },
          addressEvent: (selected) => {
            PickupAddress.close()
            if (selected) {
              this.$store.state.mall2.zitiAddress = selected;
              this.$bridgefunc.vuexStorage()
              // 切换自提点，刷新整个详情
              this._getProductDetail();
              this._setDefaultPickupAddress(selected.id);
            }
          },
          otherAddressEvent: () => {
            this.backLoadStock = true
            let path = '/mall2/selfliftingsite';
            let arr = [this.detailData.skuId]
            this.$router.push({
              path: path,
              query: {
                skuIds: JSON.stringify(arr),
                tags: this.groupData.storeInfo.pickupStoreOuCode
              }
            })
            PickupAddress.close()
          }
        })
      },
      touchend: function () {
        let mySite = this.$refs.scrollView1.scrollTop
        let maxSize = this.$refs.scrollView1.scrollHeight - this.$refs.scrollView1.offsetHeight
        console.log(mySite, maxSize)
        if (mySite > maxSize + 50) {
          this.proView = 2;
        }
      },
      pageSite: function () {
        let mySite = this.$refs.scrollView1.scrollTop
        this.pullScrollEvent(mySite)
      },
      pullScrollEvent: function (scrollTop) {
        if (this.proView == 1) {
          this.page1ScrollTop = scrollTop
          if (scrollTop < 200) {
            let opacity = scrollTop / 200;
            if (opacity < 0.5) {
              this.$refs.detailTop2.style.visibility = "visible";
              this.$refs.detailTop1.style.visibility = 'hidden';
              this.$refs.detailTop2.style.opacity = 1;
            } else if (opacity < 1) {
              this.$refs.detailTop2.style.visibility = "visible";
              this.$refs.detailTop1.style.visibility = "visible";
              this.$refs.detailTop2.style.opacity = 1 - opacity;
              this.$refs.detailTop1.style.opacity = opacity;
            }
            return;
          }
          this.$refs.detailTop2.style.visibility = "visible";
          this.$refs.detailTop1.style.visibility = "visible";
          this.$refs.detailTop2.style.opacity = 0
          this.$refs.detailTop1.style.opacity = 1;
        } else {
          this.scrollTopValue2 = scrollTop
        }
      },
      getCommentUserStr: function (comment) {
        if (comment.userName != '') {
          return comment.userName;
        }
        let phone = comment.userPhone + ''
        if (phone.length == 11) {
          let a = phone.split('')
          a.splice(1, 9, '*********')
          return a.join('')
        }
        return '未知用户'
      },
      bottomPull: function (loaded) {
        loaded('done')
        this.proView = 2;
      },
      topPull: function (loaded) {
        loaded('done')
        this.proView = 1;
      },
      toCart: function () {
        // this.$store.state.isSpecialPush = true;
        let pushData = {
          path: '/mall2/cart'
        };
        if (this.$store.state.login.token == '' && this.$store.state.webtype == 2) {
          this.bindWechat(pushData);
          return;
        }
        this.$router.push(pushData)
      },
      // 去店铺
      toShop: function () {
        // this.$store.state.isSpecialPush = true;
        this.$router.push({
          path: '/mall2/shop',
          query: {
            storeOuCode: this.detailData.storeOuCode,
            lastPath: this.$route.path,
          }
        })
      },
      getZhengshu: function (price) {
        price = Math.ceil(price * 100) / 100.0
        let price2 = this.$util.toDecimal2(price)
        let arr = price2.split('.')
        if (arr.length == 2) {
          return arr[0]
        }
        return '0'
      },
      getXiaoshu: function (price) {
        price = Math.ceil(price * 100) / 100.0
        let price2 = this.$util.toDecimal2(price)
        let arr = price2.split('.')
        if (arr.length == 2) {
          return arr[1]
        }
        return '00'
      },
      backEvent: function () {
        if (this.proView == 2) {
          this.proView = 1;
          return;
        }
        if (this.$store.state.webtype == 2|| this.$store.state.webtype == 3) {
          if(window.history.length === 1){
            console.log('push  common')
            this.$router.replace('/common')
          } else {
            console.log("go-1")
            this.$router.go(-1);
          }
        } else {
          this.$router.go(-1);
          this.$keepaliveHelper.deleteCache(this);
        }
      },
      activityProducts: function (activity) {
        this.showActivity = false;
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'activity',
            activity: activity.id,
            delivertype: this.deliveryType,
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            lastPath: this.$route.path,
          }
        })
      },
      couponProducts: function (coupon) {
        console.log(coupon)
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'coupon',
            coupon: coupon.couTypeCode,
            couThresholdAmount: coupon.couThresholdAmount,
            couFaceValue: coupon.couFaceValue,
            skuId: this.detailData.skuId,
            lastPath: this.$route.path,
            storeOuCode: this.detailData.storeOuCode,
            endTime: this.$util.getDateFromString(coupon.validEndDate)
          }
        })
      },
      couponEvent: function () {
        if (this.detailData.couponInList == '') {
          this.$Toast('当前商品没有可领优惠券！')
          return
        }
        Coupon.open({
          initData: {
            listData: this.detailData.couponInList,
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            type: 'receive',
            categoryId: this.detailData.categoryId,
            token: this.$store.state.login.token
          },
          selectedCoupon: (coupon) => {
            console.log(coupon)
            Coupon.close();
          },
          getedCoupon: (coupon) => {
            for (let i = 0; i < this.detailData.couponInList.length; i++) {
              let item = this.detailData.couponInList[i]
              if (item.couTypeNo == coupon.couTypeNo) {
                if (coupon.validEndDate == '') {
                  coupon.validEndDate = (new Date()).getTime() + 30 * 24 * 60 * 60 * 1000
                }
                this.detailData.couponInList.splice(i, 1, coupon)
                break;
              }
            }
          },
          couponProducts: (coupon) => {
            this.couponProducts(coupon);
            Coupon.close();
          },
        })
      },
      moreRecommend: function () {
        this.recommendListShow = true;
        this.toptabEvent(4);
      },
      getServerText: function (server) {
        if (server.key == 1) {
          return server.days + '天换货'
        } else if (server.key == 2) {
          return server.days + '天退货'
        } else if (server.key == 3) {
          return server.days + '天维修'
        }
      },
      joinGroupEvent: function () {
        this.popFlag = 'joinGroup'
        this.showPop = true;
      },
      proSelectEvent: function () {
        this.popFlag = 'openGroup'
        if (this.isAddGroup == '1') {
          this.popFlag = 'joinGroup'
        }
        this.showPop = true;
      },
      subFeatureEvent: function (subFeature, fidx) {
        if (this.getCanSelectWith(fidx, subFeature)) {
          this.$Toast('当前规格组合没有商品!')
          return
        }
        if (subFeature.selected) {
          subFeature.selected = false;
          this.featureRefresh = false
          this.$nextTick(() => {
            this.featureRefresh = true
          })
          return;
        }
        let feature = this.detailData.featureList[fidx]
        for (let i = 0; i < feature.featureValueList.length; i++) {
          let item = feature.featureValueList[i]
          item.selected = false;
        }
        subFeature.selected = true;
        this.generateSelectedText()
        if (this.myFeatures.length == this.detailData.featureList.length) {
          // 表示选完整了
          this._getProductDetail();
        }
      },
      numChange: function () {
        this.generateSelectedText()
      },
      generateSelectedText: function () {
        this.selectedText = ''
        this.myFeatures = [];
        for (let i = 0; i < this.detailData.featureList.length; i++) {
          let item = this.detailData.featureList[i]
          for (let j = 0; j < item.featureValueList.length; j++) {
            let subItem = item.featureValueList[j]
            if (subItem.selected) {
              this.selectedText += subItem.featureValue + '，'
              this.myFeatures.push(subItem.featureValueId)
              break;
            }
          }
        }
        this.selectedText += this.selectedNum + (this.detailData.metric ? this.detailData.metric : '件')
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
      },
      // 获取当前库存
      _getCustomStock: function () {
        if (this.deliveryType == 2 && (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == undefined) && (this.$store.state.mall2.selectAddress.provinceId == '' || this.$store.state.mall2.selectAddress.provinceId == undefined)) {
          //配送下没有地址就不去  取库存了
          return;
        }
        if (this.deliveryType == 1 && (this.$store.state.mall2.zitiAddress.id == '' || this.$store.state.mall2.zitiAddress.id == undefined)) {
          // 自提并且没有自提点id
          return;
        }
        let url = '/app/json/app_stock/querySkuStockByApp';
        let paramsData = {
          token: this.$store.state.login.token,
          productList: [{skuId: this.detailData.skuId}],
          areaAddress: {
            province: this.$store.state.mall2.selectAddress.provinceId,
            city: this.$store.state.mall2.selectAddress.cityId,
            area: this.$store.state.mall2.selectAddress.countryId,
            town: this.$store.state.mall2.selectAddress.townId
          },
          deliverType: this.deliveryType,
          selfPickStore: this.$store.state.mall2.zitiAddress.id,
          storeCode: this.detailData.storeOuCode
        };
        this.$Loading.open()
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.canSale = true
              let productList = data.data.productList
              if (productList.length > 0) {
                this.stockNum = productList[0].stockCurrentNumber
                if (this.mktStockNum != -1) {
                  // 活动库存，小于当前库存，取活动库存当库存
                  this.stockNum = this.mktStockNum < this.stockNum ? this.mktStockNum : this.stockNum
                }
                this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
                if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                  if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                    this.maxNum = this.detailData.discountGoodsCntPerOrder
                  }
                }
                this.maxNum = this.maxNum > this.stockNum ? this.stockNum : this.maxNum
              }
            } else {
              if (data.errorCode == 2201) {
                // 不在可售区域
                this.canSale = false
              } else {
                this.$Toast(data.info);
              }
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      selectArea: function () {
        // if (this.$store.state.mall2.selectAddress.id > 0) {
        Address.open({
          initData: {
            selectedId: this.$store.state.mall2.selectAddress.id,
            token: this.$store.state.login.token
          },
          addressEvent: (selected, saddress) => {
            this.matchAddress = saddress;
            this.$store.state.mall2.selectAddress = selected;
            this.$bridgefunc.vuexStorage()
            this._getCustomStock();
            Address.close()
          }
        })
        // } else {
        //   //选择省市区
        //   this.showSelect = !this.showSelect;
        //   this._getRegionData(0);
        // }
      },
      selectedItemsEvent: function (selectedValue) {
        let item = selectedValue.item;
        this.selectedItems = selectedValue.selecteds;
        if (this.selectedItems.length == 4) {
          this.showSelect = false;
          this.region = this.selectedItems;
          this.getRegionText();
          return;
        }
        this._getRegionData(item.id)
      },
      regionCloseEvent: function () {
        this.showSelect = false;
      },
      _getRegionData: function (parentId) {
        this.$Loading.open()
        // console.log(parentId)
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            let arr = data.data;
            console.log(arr)
            if (arr.length > 0) {
              this.$nextTick(function () {
                console.log(this.$refs.regionselect)
                this.$refs.regionselect.pushCustomOptions(arr);
              })
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取失败', error);
          this.$Toast('获取数据失败')
        });
      },
      getRegionText: function () {
        let str = ''
        let address = {
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          countryId: '',
          countryName: '',
          townId: '',
          townName: ''
        }
        address.id = '-1';
        for (let i = 0; i < this.region.length; i++) {
          let item = this.region[i]
          str += item.name
          if (i == 0) {
            address.provinceId = item.id
            address.provinceName = item.name
          } else if (i == 1) {
            address.cityId = item.id
            address.cityName = item.name
          } else if (i == 2) {
            address.countryId = item.id
            address.countryName = item.name
          } else if (i == 3) {
            address.townId = item.id
            address.townName = item.name
          }
        }
        address.addressFull = address.provinceName + address.cityName + address.countryName + address.townName
        this.$store.state.mall2.selectAddress = address
        this.$bridgefunc.vuexStorage()
        this._getCustomStock();
        this.regionText = str;
        this.$refs.regionselect.reset(null);
      },
      allCommentEvent: function () {
        this.commentListShow = true;
        this.toptabEvent(3);
      },
      toptabEvent: function (idx) {
        this.toptab = idx
        if (this.toptab == 3) {
          this.load3 = true
        } else if (this.toptab == 4) {
          this.load4 = true
        }
        console.log(this.$refs.mySwiper)
        this.$refs.mySwiper.swiper.slideTo(idx - 1)
        // this.commentListShow = false;
        // this.recommendListShow = false;
        // if (idx == 3) {
        //   this.commentListShow = true;
        // } else if (idx == 4) {
        //   this.recommendListShow = true;
        // }
      },
      introductionSelected: function (idx) {
        this.introductionIndex = idx
      },
      addToCart: function () {
        if (this.$store.state.login.token == '' && this.$store.state.webtype == 2) {
          this.bindWechat();
          return;
        }
        this.popFlag = 'addToCart'
        this.showPop = true;
        // this._addToCart();
      },
      openGroup: function () {

        if (this.deliveryType == 2) {
          // 配送
          if (this.$store.state.mall2.selectAddress.id == '') {
            this.$Toast("请选择配送区域")
            return;
          }
        } else {
          // 自提
          if (this.$store.state.mall2.zitiAddress.id == '') {
            this.$Toast("请选择自提点")
            return;
          }
        }

        let leaderUserAward = this.groupData.leaderUserAward
        this.groupProducts = []
        for (let i = 0; i < leaderUserAward.length; i++) {
          let item = leaderUserAward[i]
          this.groupProducts.push(item)
          if (item.sku.skuId == this.skuId) {
            this.selectedProduct = item
          }
        }

        this.popFlag = 'openGroup'
        this.showPop = true;
      },
      buyNowEvent: function () {

        if (this.detailData.mktActivityPriceLevel == 3 && this.detailData.soldNum >= 100) {
          this.$Toast('该商品已抢光，将会使用原价购买！')
        }

        if (this.$store.state.login.token == '' && this.$store.state.webtype == 2) {
          this.bindWechat();
          return;
        }
        if (this.deliveryType == 2) {
          // 配送
          if (this.$store.state.mall2.selectAddress.id == '') {
            this.$Toast("请选择配送区域")
            return;
          }
        } else {
          // 自提
          if (this.$store.state.mall2.zitiAddress.id == '') {
            this.$Toast("请选择自提点")
            return;
          }
        }
        this.popFlag = 'buyNow'
        this.showPop = true;
        // this._buyNow()
      },
      popClose: function () {
        this.showPop = false;
      },
      popSureEvent: function () {
        if (this.popFlag == 'addToCart') {
          this._addToCart()
        } else if (this.popFlag == 'buyNow') {
          this._buyNow()
        } else if (this.popFlag == 'openGroup') {
          // this._buyNow()
          this._openGroup()
        } else if (this.popFlag == 'joinGroup') {
          // this._buyNow()
          this._joinGroup()
        }
        this.showPop = false;
      },
      // 请求详情信息
      _getProductDetail: function () {
        this.$Loading.open();
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          token: this.$store.state.login.token,
          productType: this.productType,
          skuId: this.skuId,
          featureValueIds: this.myFeatures,
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy,
          deliverType: this.deliveryType,
          activityId:this.activityId
        };

        /**
         * 这里利用了耦合性写了一部分代码，特做此标记
         * 后台首页直接配置某个商品详情的时候，详情路径必定为 '/mall2/detail/1000'
         * 这里判断 '/mall2/detail/1000' 这个路径时，不传 deliverType ， 传 secondDeliveType ，
         * 将配送方式交给商品来处理，如果商品仅支持自提 那返回自提，如果商品只支持配送 那返回配送 ，如果都支持 ，返回 secondDeliveType 的值
         */
        if (this.$route.path == '/mall2/detail/1000') {
          paramsData.deliverType = ''
          paramsData.secondDeliveType = this.deliveryType
        }


        if (this.id && this.id != '') {
          paramsData.id = this.id;
        } else {
          paramsData.storeOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : '';
          paramsData.pickupStoreOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : '';
        }
        if (this.activityId != '') {
          paramsData.activityId = this.activityId
        }
        if (paramsData.deliverType == 1 || paramsData.deliverType == '') {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
          paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode ? this.$store.state.mall2.zitiAddress.storeCode : this.$route.query.storeOuCode ? this.$route.query.storeOuCode : '';
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data;
              if (this.detailData.remainNum === 0) {
                this.$Toast('活动商品库存已售空，需原价购买！')
              }
              let skuId = this.detailData.skuId;
              let deliveryType = this.detailData.deliveryType;
              this.deliveryType = deliveryType;
              this.$store.state.mall2.staticDeliverType = deliveryType;
              if (deliveryType == 1) {
                InitialLoadPickupAny.checkIsInitialLoad((address) => {
                  if (address) {
                    this._getProductDetail();
                  }
                });
              }
              if (skuId && deliveryType) {
                this.$mallCommon.pushBrowsingHistory(skuId, deliveryType)
              }
              if (this.selectedNum < this.detailData.saleNumBegin) {
                this.selectedNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              }
              this.stepNum = this.detailData.saleNumStep != '' ? this.detailData.saleNumStep : 1
              this.minNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
              if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                  this.maxNum = this.detailData.discountGoodsCntPerOrder
                  console.log(this.maxNum)
                }
              }
              this.mktStockNum = this.detailData.mktStockNum != '' ? this.detailData.mktStockNum : -1
              for (let i = 0; i < this.detailData.featureList.length; i++) {
                let item = this.detailData.featureList[i]
                for (let j = 0; j < item.featureValueList.length; j++) {
                  let subItem = item.featureValueList[j]
                  for (let k = 0; k < this.detailData.myFeatureValueList.length; k++) {
                    let selectedItem = this.detailData.myFeatureValueList[k]
                    if (subItem.featureValueId == selectedItem.featureValueId) {
                      subItem.selected = true;
                      break;
                    }
                  }
                }
              }
              this.generateSelectedText();
              // 处理单品活动
              this.singleActivities_2 = []
              this.curSingleActivity = null
              let cActivity = this.detailData.activityDetail
              if (cActivity && cActivity.activityPriceLevel == 2) {
                this.singleActivities_2.push(cActivity)
                this.curSingleActivity = cActivity
              }
              let skuAList = this.detailData.skuActivityList
              for (let i = 0; i < skuAList.length; i++) {
                let saitem = skuAList[i]
                if (saitem.activityId == cActivity.activityId) {
                  continue ;
                }
                if (saitem.activityPriceLevel == 2) {
                  this.singleActivities_2.push(saitem)
                }
              }
              // 全局价格处理
              let dpedData = this.$mallCommon.priceFromItem(this.detailData)
              this.detailData.dpedData = dpedData;
              this.introduction1 = this.detailData.proSkuMediaModel.mobileDetail
              this.introduction2 = this.detailData.proSkuMediaModel.mobileParam
              this.introduction3 = this.detailData.afterHelp
              this.id = this.detailData.id
              if (this.skuId != this.detailData.skuId) {
                this.skuId = this.detailData.skuId
                this.load3 = false
                this._getDetailComment(this.skuId)
              }
              this.detailShow = true;
              this._getCustomStock();
              this._getCollectState();
              // 视频
              this.arrLen = this.detailData.picUrls.length
              let vurl = this.detailData.proSkuMediaModel.videoUrl
              // vurl = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
              if (vurl && vurl != undefined && vurl != '') {
                this.arrLen ++;
                this.videoUrl = vurl
                this.playerOptions.sources[0].src = vurl
                this.swiperOption.autoplay = false
                this.swiperOption.loop = false
                this.proImgIndex = 0
              }
              this.$userCenter._getCartCount();

              if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
                this.setWxShareArgs()
              }
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
      // 获取详情的评价
      _getDetailComment: function (skuId) {
        // evaluate/loadSkuDetailTwoEvaluate
        let url = '/app/json/evaluate/loadSkuDetailTwoEvaluate';
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: skuId
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.detailComment = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 添加商品到购物车
      _addToCart: function () {

        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: this.activityId
          }],
          deliveryType: this.detailData.deliveryType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // this.$Toast("添加购物车成功！")
              this.$store.state.mall2.cartNum = data.data;
              this.showPop = false;
              this.showProductImg = true;
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
      // 立即开团
      _openGroup: function () {
        if (this.stockNum < this.selectedNum) {
          this.$Toast('当前商品库存不足！')
          return;
        }
        let paramsData = {
          token: this.$store.state.login.token,
          mktGroupBuyId: this.groupData.mktGroupBuyId,
          groupBuyType: '1',
          skuId: this.skuId,
          storeOuCode: this.detailData.storeOuCode,
          number: this.selectedNum,
          deliveryType: this.detailData.deliveryType,
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$store.state.mall2.zitiAddress.id,
          userAddressId: ''
        };

        this.$router.push({
          name: '团购下订单',
          params: {
            type: '1', // 1 开团； 2 参团
            paramsData: JSON.stringify(paramsData),
            mktGroupBuyId: this.groupData.mktGroupBuyId,
            orderId: this.groupData.id,
            skuId:this.skuId,
            productType:this.productType,
            groupId:this.groupId,
          }
          // path: 'groupplaceorder',
          // query: {
          //   paramsData: JSON.stringify(paramsData),
          //   // settleData: JSON.stringify(data.data)
          // }
        })
      },
      // 参团
      _joinGroup: function () {
        if (this.stockNum < this.selectedNum) {
          this.$Toast('当前商品库存不足！')
          return;
        }
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: this.joinOrderId,
          mktGroupBuyId: this.groupData.mktGroupBuyId,
          groupBuyType: '1',
          skuId: this.skuId,
          storeOuCode: this.detailData.storeOuCode,
          number: this.selectedNum,
          deliveryType: this.detailData.deliveryType,
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$store.state.mall2.zitiAddress.id,
          userAddressId: ''
        };

        this.$router.push({
          name: '团购下订单',
          params: {
            type: '2', // 1 开团； 2 参团
            paramsData: JSON.stringify(paramsData),
            mktGroupBuyId: this.groupData.mktGroupBuyId,
            orderId: this.joinOrderId,
            skuId:this.skuId,
            productType:this.productType,
            groupId:this.groupId,
          }
          // path: 'groupplaceorder',
          // query: {
          //   type: '2', // 1 开团； 2 参团
          //   paramsData: JSON.stringify(paramsData),
          //   mktGroupBuyId: this.groupData.mktGroupBuyId,
          //   orderId: this.groupId
          //   // settleData: JSON.stringify(data.data)
          // }
        })
      },
      // 立即购买
      _buyNow: function () {

        if (this.stockNum < this.selectedNum) {
          this.$Toast('当前商品库存不足！')
          return;
        }
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: this.activityId,
            checked: '1'
          }],
          deliveryType: this.detailData.deliveryType,
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$store.state.mall2.zitiAddress.id,
          userAddressId: ''
        };
        if (this.deliveryType == 2) {
          if (this.$store.state.mall2.selectAddress.id > 0) {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          }
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let params = {
                res: data.data,
                paramsData: paramsData,
                deliveryType: this.detailData.deliveryType
              };
              if (!(this.$store.state.mall2.selectAddress.id > 0) && this.detailData.deliveryType == 2) {
                if (this.matchAddress) {
                  this.$store.state.mall2.selectAddress = this.matchAddress;
                  this.$bridgefunc.vuexStorage(() => {
                  })
                } else {
                  params.noMatch = true;
                }
              }
              // this.$router.push({
              //   name: '填写订单',
              //   params: params
              // })
              // this.$mallCommon.isExistCanNotAttendActivity(data.data.occur);
              if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
                this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                  this.$router.push({
                    name: '填写订单',
                    params: params
                  })
                }).catch(action => {
                });
              } else {
                this.$router.push({
                  name: '填写订单',
                  params: params
                })
              }
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
      // 获取是否收藏
      _getCollectState: function () {
        if (this.$store.state.login.token == '') {
          return;
        }
        let url = '/app/json/user_pro_collect/checkUserHasCollectPro';
        let paramsData = {
          token: this.$store.state.login.token,
          productId: this.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.isCollect = data.data
              this.$nextTick(() => {
                this.collectName = 'collectName'
              })
            } else {
              this.$Toast(data.info);
              this.collectName = 'collectName'
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 添加收藏或者取消收藏
      collectEvent: function () {
        if (this.$store.state.login.token == '' && this.$store.state.webtype == 2) {
          this.bindWechat();
          return;
        }

        let url = '/app/json/user_pro_collect/addOrCancelUserProCollect';
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.id,
          skuId: this.detailData.skuId,
          deliveryType: this.detailData.deliveryType,
          storeOuCode: this.detailData.storeOuCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              if (this.isCollect == 'false') {
                this.isCollect = 'true'
              } else {
                this.isCollect = 'false'
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      setWxShareArgs: function () {
        let shareData = {};
        shareData.title = this.detailData.skuName;
        shareData.sharetext = this.groupData.groupBuyName;
        shareData.imageurl = this.groupData.leaderUserAward[0].gameAwardPic;

        if (this.$store.state.webtype == 2) {
          shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + '/group_detail?orderId=' + this.orderId || this.groupData.id;
          shareData.detailurl += '&mktGroupBuyId=' + this.groupData.mktGroupBuyId
          shareData.detailurl += '&spuId=' + this.groupData.spuId
          if (this.$store.state.login.token && this.$store.state.login.token != '') {
            shareData.detailurl = shareData.detailurl + '&recommend=' + this.$store.state.userInfo.userId
            shareData.detailurl = shareData.detailurl + '&recommendPhone=' + this.$store.state.login.phone
          }

          wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
              wxfunc.wxSetShareData(shareData);
            } else {
              console.log('签名失败');
            }
          });
        } else if (this.$store.state.webtype == 3) {
          // let path = wxfunc.wxmpPath(this.$route)
          shareData.detailurl = Config.shareUrl + '/group_detail?orderId=' + this.orderId;
          shareData.detailurl += '&mktGroupBuyId=' + this.groupDetail.mktGroupBuyId
          shareData.detailurl += '&spuId=' + this.groupDetail.spuId
          if (this.$store.state.login.token && this.$store.state.login.token != '') {
            shareData.detailurl = shareData.detailurl + '&recommend=' + this.$store.state.userInfo.userId
            shareData.detailurl = shareData.detailurl + '&recommendPhone=' + this.$store.state.login.phone
          }

          let shareData = {
            title: shareData.title,
            path: shareData.detailurl,
            imageUrl: shareData.imageurl,
            rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
          }
          wx.miniProgram.postMessage({ data: JSON.stringify(shareData) });
        }
      },
      sharegoods: function (orderId) { //分享
        if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
          this.shareView = true
          return ;
        }
        if (!orderId) {
          orderId = this.groupData.id
        }

        let shareData = {};
        //
        shareData.title = this.detailData.skuName;
        shareData.sharetext = this.groupData.groupBuyName;
        shareData.imageurl = this.groupData.leaderUserAward[0].gameAwardPic;
        // shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + '/group_detail?orderId=' + orderId;
        // shareData.detailurl += '&mktGroupBuyId=' + this.groupData.mktGroupBuyId
        // shareData.detailurl += '&spuId=' + this.groupData.spuId
        // console.log(shareData.imageurl)
        // console.log(orderId)
        // console.log(appShare)
        // console.log(appShare.shareForOpenWXMiniProgram)
        // this.$bridgefunc.wechatShare(shareData);
        appShare.shareForOpenWXMiniProgram({
          userName: "gh_28d617271c97",
          path: `pages/common/home/index?redirect=${encodeURIComponent(
            `/app-vue/app/index.html#/groupproduct?skuId=${this.$route.query.skuId}&productType=${this.$route.query.productType}&groupId=${this.$route.query.groupId}&mktGroupBuyId=${this.$route.query.mktGroupBuyId}&spuId=${this.$route.query.spuId}`
          )}`,
          title: shareData.title,
          desc: shareData.sharetext,
          link: "https://www.baidu.com",
          imageurl: shareData.imageurl,
          miniProgramType:0,
          __event__: (res) => {},
        }).then((res) => {
          // document.getElementById("debug_text").innerText = res;
          console.log("shareThenRes----------", JSON.stringify(res));
        }).catch(err => {
          consloe.log(err)
        })
      },
      getDatas: function () {
        this._getProductDetail();
        if (this.$store.state.login.token != '') {
          this._getDetailComment(this.skuId);
        }
      },
      //这里先判断是否有地理位置  没有地理位置需要获取签名  然后获取坐标 转地理位置 存储位置
      getWechatDatas: function () {
        //1自提 2配送
        if (this.deliveryType == 1) {
          //自提地址不存在的情况 直接根据storeid 获取自提点
          if (this.$store.state.mall2.zitiAddress.id == undefined || this.$store.state.mall2.zitiAddress.id == '') {
            this.getSysStoreById();
          } else {
            this.getDatas();
          }
        } else {
          //配送地址不存在的情况  如果有token 就去请求历史保存  没有  则去签名定位
          if (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == 'undefined') {
            if (this.$store.state.login.token && this.$store.state.login.token.length) {
              this.$userCenter._getUserLocalhistory(() => {
                if (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == 'undefined') {
                  this.getWechatSignature();
                } else {
                  this.getDatas();
                }
              })
            } else {
              this.getWechatSignature();
            }
          } else {
            this.getDatas();
          }
        }
      },
      //根据自提点的id去得到自提点
      getSysStoreById: function () {
        this.$Loading.open();
        let url = '/app/json/user_address/getSysStoreById';
        let idStr = this.$route.query.storeID;
        let paramsData = {
          id: idStr
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.zitiAddress = data.data;
              this.getDatas();
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

      getWechatSignature: function () {
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            wxfunc.wxGetLocation((location) => {
              //
              this.$mallCommon.addressAnalysis((res) => {
                this.getDatas();
              }, location);

            });
          } else {
            console.log('签名失败');
            this.getDatas();
          }

        });
      },
      bindWechat: function (pushData) {
        if (pushData) {
          this.$store.state.pushData.pushData = pushData
          this.$store.state.pushData.pushType = 0
          this.$store.state.indexData.selectedIndex = ''
          this.$bridgefunc.vuexStorage(() => {
          })
        }
        this.$util.wechatBind();

      },
      getGroupDetail: function () {
        this.$Loading.open();
        let url = '/app/json/app_fight_group_order/detail';
        let paramsData = {
          orderId: this.orderId ? this.orderId : this.groupId
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.groupData = data.data;

              let leaderUserAward = this.groupData.leaderUserAward
              this.groupProducts = []
              for (let i = 0; i < leaderUserAward.length; i++) {
                let item = leaderUserAward[i]
                this.groupProducts.push(item)
                if (item.sku.skuId == this.skuId) {
                  this.selectedProduct = item
                }
              }

              //微信类型
              if (this.$store.state.webtype == 2) {
                this.getWechatDatas();
              } else {
                this.getDatas();
              }
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
      getMyGroup: function () {
        this.$Loading.open();
        let url = '/app/json/app_fight_group_order/queryRelation';
        let paramsData = {
          groupBuyType: 1,
          mktGroupBuyId: this.mktGroupBuyId,
          spuId: this.spuId,
          orderId: this.orderId ? this.orderId : ''
          // state: 1
        };
        console.log('this.spuId--this.spuId',this.spuId);
        console.log('this.$route.query.spuId',this.$route.query.spuId);
        console.log("paramsData--paramsData--paramsData",paramsData);
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.groupMembers = []
              let orderList = data.data.orderList
              if (orderList.length > 0) {
                let orderItemList = orderList[0].orderItemList
                this.joinOrderId = orderList[0].id
                for (let i = 0; i < orderItemList.length; i++) {
                  if (i < 3) {
                    this.groupMembers.push(orderItemList[i])
                  }
                  if (orderItemList[i].userId == this.$store.state.userInfo.userId) {
                    this.hasMe = true;
                    this.orderId = this.joinOrderId;
                  } else {
                    this.orderId = ''
                  }
                }

                this.surplusMember = orderList[0].groupBuyNumOfPerson - orderList[0].currentNumOfPerson
                let endTime = orderList[0].endTime
                this.surplusTime = endTime
              //   let surplust = endTime / 1000 - this.$store.state.severTime.currentTime
              //   if (surplust > 0) {
              //     let surplusH = Math.floor(surplust / 3600)
              //     let surplusM = Math.floor(surplust % 3600 / 60)
              //     let surplusS = Math.floor(surplust % 3600 % 60)
              //     this.surplusTime = surplusH+':'+surplusM+':'+surplusS
              //   } else {
              //     this.surplusTime = '0:0:0'
              //   }
              }
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
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
      this.id = this.$route.query.id ? this.$route.query.id : ''
      this.skuId = this.$route.query.skuId ? this.$route.query.skuId : ''
      // this.deliveryType = this.$route.query.deliveryType ? this.$route.query.deliveryType : '2'
      this.deliveryType =  this.$store.state.mall2.staticDeliverType
      if (this.$route.query.deliverType) {
        this.deliveryType = this.$route.query.deliverType
      }
      this.productType = this.$route.query.productType ? this.$route.query.productType : ''
      this.activityId = this.$route.query.activityId ? this.$route.query.activityId : ''
      this.showActivityTime = this.$route.query.showActivityTime ? this.$route.query.showActivityTime : '0'

      this.groupId = this.$route.query.groupId ? this.$route.query.groupId : ''
      this.orderId = this.$route.query.orderId ? this.$route.query.orderId : ''
      this.mktGroupBuyId = this.$route.query.mktGroupBuyId ? this.$route.query.mktGroupBuyId : ''
      this.spuId = this.$route.query.spuId ? this.$route.query.spuId : ''
      this.isAddGroup = this.$route.query.isAddGroup ? this.$route.query.isAddGroup : '0'

      // 拼团，先请求，拼团详情，然后请求详情数据
      if (this.groupId != '') {
        this.getGroupDetail()
        this.getMyGroup();
        return ;
      }

      if (this.id == '' && this.skuId == '') {
        return;
      }

      //微信类型
      if (this.$store.state.webtype == 2) {
        this.getWechatDatas();
      } else {
        this.getDatas();
      }
    },
    activated() {
      if (this.scrollTopValue3 != 0) {
        this.$refs.scrollView2.scrollTop = this.scrollTopValue3
      }
      if (this.scrollTopValue4 != 0) {
        this.$refs.scrollView3.scrollTop = this.scrollTopValue4
      }
      if (this.scrollTopValue5 != 0) {
        this.$refs.scrollView4.scrollTop = this.scrollTopValue5
      }
      if (this.scrollTopValue2 != 0) {
        this.$refs.pullTo2.setScrollTopValue(this.scrollTopValue2)
      }
      if (this.page1ScrollTop != 0) {
        this.$refs.pullTo1.setScrollTopValue(this.page1ScrollTop)
      }
      // 选自提点的时候，回来需要刷新库存
      if (this.backLoadStock) {
        this._getCustomStock();
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      } else if (this.lastPath == '' && to.path == '/common') {
        this.$keepaliveHelper.deleteCache(this)
      } else {
        if (this.$refs.scrollView2) {
          this.scrollTopValue3 = this.$refs.scrollView2.scrollTop
        }
        if (this.$refs.scrollView3)
          this.scrollTopValue4 = this.$refs.scrollView3.scrollTop
        if (this.$refs.scrollView4)
          this.scrollTopValue5 = this.$refs.scrollView4.scrollTop
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .detail {
    position relative;
    width 100%
    height 100%
    overflow hidden

    .sl-tag {
      font-size $font-size-small
      padding 2px 6px
      border-radius 8px
      border-width 0.5px
      border-style solid
    }
    .sl-title {
      flex 1
      margin-left 4px
      font-size $font-size-small
      span {
        margin-left 10px;
      }
    }
    .good-salespro-right {
      margin -10px;
      font-size $font-size-small
      padding 12px 16px
    }

    .productImg {
      position: absolute;
      z-index: 1001;
      left 147.5px
      width: 80px;
      height: 80px;
      border-radius: 40px;
      top: 120px;
    }

    .anProductImg {
      position: absolute;
      z-index: 1001;
      left 0px
      width 100%
      top: 160px;
      overflow hidden
      text-align center

      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
    }

    .detail-top {
      position absolute;
      top 0px;
      width 100%;
      overflow hidden
      font-size 0px;
      z-index 6;

      .navcontent {
        position: absolute;
        width 100%
        bottom 0px
        left 0px

        .nav-back-btn {
          position absolute;
          z-index 10;
          overflow hidden;
        }

        .right-btn {
          position absolute;
        }
      }
    }

    .detail-tab {
      position absolute;
      overflow hidden;
      display flex;
      align-items center;
      top 0px;
      bottom 0px;

      .btn-div {
        flex 1;
        text-align center;

        span {
          border-bottom-width 2px;
          border-style solid;
          border-color transparent;
        }
      }
    }

    .enable-scroll {
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
    }

    .scroll-div {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 50px;
      overflow hidden;

      .pro-title-height {
        height 34px;
      }

      .group-header {
        display flex;
        align-items center;
        .yuan {
          border 1px solid white;
          background-color #efefef;
          width 40px;
          height 40px;
          border-radius 20px;
          overflow hidden;
          position relative;
          img {
            display block;
            width 100%;
            height 100%;
          }
          .group-tz {
            position absolute;
            bottom 0;
            left 5px;
            right 5px;
            text-align center;
            font-size 10px;
            border-radius 10px;
            background-color red;
            color white;
          }
        }
        .yuan:nth-child(n+2) {
          margin-left -8px;
        }
      }
      .group-info {
        padding 0 10px;
        .time-row {
          display flex;
          align-items center;
          padding-top 6px;
        }
      }
      .group-join {
        padding 8px 12px;
        font-size 14px;
        color white;
        border-radius 20px;
      }

      .load-next {
        position relative;
        height 46px;
        padding 15px;
        display flex;
        align-items center
        justify-content center;

        img {
          width 16px;
          height 16px;
          margin-right 10px;
        }

        span {
          font-size 16px;
        }
      }

      .main-swiper {
        width 100%;
        height 100%;

        .main-swiper-scroll-content {
          position absolute;
          bottom 0px;
          left 0px;
          right 0px;
        }

        .padding-bottom-8 {
          padding-bottom 8px;
        }
      }

      .swiper-div {
        position relative;
        overflow hidden;
        width 100%;
      // height 375px;

        .swiper-arr {
          width 100%;

          img {
            display block;
            width 100%;
          }
        }

        .swiper-img-div {
          img {
            display block;
            width 100%;
            max-height 375px;
          //height 375px;
          }
        }

        .swiper-index {
          position absolute;
          left 0px;
          right 0px;
          bottom 10px;
          z-index 10;
          display flex;
          justify-content center;

          .si-item {
            width 15px;
            height 3px;
            border-radius 2px;
            margin 5px;
          }

          .cus-index {
            width 25px;
          }
        }

      }

      .base-info {
        padding 8px 8px 16px;
      // box-shadow 0 2px 2px #efefef;

        .row {
          padding 8px 8px 0px;
        }

        .price {
          padding 0px 8px;

        }

        .seconds-kill {
          margin -8px -8px 0px;
          height 76px;
          overflow hidden;

          &.small {
            height 70px;

            .right-div {
              padding-top 12px;
            }
          }

          .left-div {
            float left;
            width 240px;
            height 100%;
            background: linear-gradient(90deg, #F8089F, #F80E26);
            padding 8px 0px

            .sk-row {
              padding 4px 8px 4px 16px;
              display flex;
              align-items center;

              .price {
                margin-left -6px;
                font-size 12px;

                span {
                  font-weight 500;
                }

                .price-z {
                  font-size 24px;
                  margin 0 -4px;
                }
              }

              .group-div {
                background-color white;
                color red;
                padding 4px 10px;
                border-radius 15px;
              }

              .progress {
                flex 1;
                padding-left 20px;
                padding-right 10px;

                /deep/ .mt-progress {
                  height 16px;
                  overflow hidden;
                  border-radius 10px;
                }

                /deep/ .mt-progress-runway {
                  background-color: #fff
                  border: 1px solid #fff
                }

                /deep/ .mt-progress-progress {
                  background-color: #f6d916
                  border: none
                }
              }

              .progress-text {
                font-size 12px;
              }

              .sk-icon {
                border-radius 10px;
                border 1px solid #fff;
                overflow hidden;
                padding 3px 0px;

                i {
                  font-size 12px;
                  padding 4px;
                }

                span {
                  font-size 12px;
                  padding 4px;
                }
              }

              .o-price {
                font-size 12px;
                font-weight 500;
                margin-left 10px;
              }
            }
          }

          .right-div {
            overflow hidden;
            height 100%;
            padding-top 15px;

            .skr-row {
              text-align center;
              font-size 13px;
              padding 4px 0;
            }
          }
        }

        .title {
          font-weight 500;
          font-size $font-size-large
          line-height 20px;
        }

        .desc {
          display flex;
          padding-bottom 8px;
          align-items center;
          font-size 12px;

          .desc-text {
            flex 1;
          }
        }
      }

      .detail-div {
        position relative;
        height 100%;
        overflow hidden;

        .detail-content {
          position absolute;
          top 41px;
          bottom 0px;
          left 0px;
          right 0px;
          overflow-x hidden;
          overflow-y auto;
          padding 0 8px 10px;
          &.detail-bottom {
            position static;
            overflow hidden;
            padding-bottom 100px;
          }

          .tip {
            margin 10px;
            font-size 0px;
            display flex;
            align-items center;

            .line {
              flex 1;
              height 1px;
              background-color #ddd;
            }

            .text {
              font-size 10px;
              margin 0 10px;
            }
          }

          .introduction-div {
            margin-top 2px;
            width 100%;

            img {
              width 100%;
            }
          }
        }
      }

      .btns-div {
        display flex;
        padding 12px 0 10px;

        .btn-item {
          flex 1;
          padding 3px;
          font-size $font-size-medium;
          text-align center;
        }

        .btn-item:nth-child(n+2) {
          border-left 1px solid #ddd;
        }
      }

      .comment-div {
        margin 5px 0px;

        .comment-row {
          padding 4px 0px;
        }

        .header-img {
          width 20px;
          height 20px;
          overflow hidden;
          border-radius 10px;

          img {
            width 100%;
            height 100%;
          }
        }

        .icon-level {
          font-size 15px;
        }

        .imgs {
          overflow hidden;
          padding-bottom 12px
          font-size $font-size-medium;

          .s-img-div {
            margin-right 2%;
            float left;
            position relative;
            width 23%
            height 0px;
            padding-bottom 23%;
            overflow hidden;

            img {
              position absolute;
              left 0
              top 0
              width 100%;
              height 100%;
              overflow hidden;
            }
          }

          .s-img-div:nth-child(4n) {
            margin-right 0
          }
        }
      }
    }

    .comment-list {
      z-index 99;
    }

    .bottom-tip {
      position absolute;
      left 0px;
      right 0px;
      bottom 50px;
      z-index 10;
      padding 5px;
      font-size 12px;
      text-align center;
    }

    .bottom-btns {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      box-shadow 0 -2px 2px #efefef;
      z-index 9;
      display flex;

      .btn {
        position relative;
        text-align center;
        padding 6px;

        &.group-btn {
          display flex;
          flex-direction column;
          justify-content center;
          padding 5px 10px;

          .price {
            display flex;
            justify-content center;
            align-items flex-end;
            font-size 12px;
            padding-bottom 5px;

            span {
              font-weight 500;
            }
          }

          .big {
            font-size 16px;
            font-weight 500;
          }
        }

        .cart-num {
          position absolute;
          right 6px;
          top 5px;
          border-radius 12px;
          padding 2px 4px;
          font-size 12px;
          z-index 5;
        }

        .btn-icon {
          font-size 26px;
          position absolute;
          top 6px;
          left 0px;
          right 0px;
          text-align center;
        }

        .btn-img {
          position absolute;
          top 6px;
          left 50%;
          margin-left -13px
          width 26px;
          height 26px;
        }

        .text {
          position absolute;
          left 0px;
          right 0px;
          bottom 6px;
          text-align center;
        // margin-top 3px;
        }

        .title {
          padding 11px 5px;
          font-size 16px;
          font-weight 500;
        }
      }

      .big-btn {
        width 170px;
      }

      .full {
        flex 1;
      }
    }

    .activity-notice {
      /*background-color #07c160*/
      height 20px;
      display flex;
      align-items center;

      .sk-icon {
        border-radius 10px;
        border 0.7px solid #f80f16;
        overflow hidden;
        padding 3px 0px;

        i {
          font-size 10px;
          padding 4px;
        }

        span {
          font-size 10px;
          padding-right 6px;
          padding-left 4px;
        }
      }

      .notice-price {
        font-size 12px;
        font-weight 500;
        margin-left 10px;
      }
    }
  }

  .collectName-enter-active {
    transition: all .2s ease;
  }

  .collectName-leave-active {
    transition: all .2s ease-in;
  }

  .collectName-enter {
    transform: translateY(-500%);
    transform scale(10.0);
  }

  .collectName-leave-to {
    transform: translateY(-500%);
    transform scale(10.0);
  }

  .transition1-enter-active, .transition1-leave-active, .transition2-enter-active, .transition2-leave-active {
    transition: all .5s;
  }

  .transition1-enter, .transition1-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translate3d(0, -100%, 0)
  }

  .transition2-enter, .transition2-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translate3d(0, 100%, 0)
  }

  .bounce-enter-active {
    animation: bounce-in 0.4s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(3);
    }
    25% {
      transform: scale(2.5);
    }
    50% {
      transform: scale(2);
    }
    75% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  >>> .stateBox {
    z-index: 2001;
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }
  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
