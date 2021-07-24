/**Created by liaoyingchao on 2018/10/26.*/

<template>
  <div class="detail mall2">
    <div
      ref="detailTop2"
      class="detail-top"
      :style="{
        height: $store.state.barHeight + $market.getNavHeight(true) + 'px'
      }"
      v-if="proView !== 2"
    >
      <div
        class="navcontent"
        :style="{
          top: $store.state.barHeight + 'px',
          height: $market.getNavHeight(true) + 'px',
          'line-height': $market.getNavHeight(true) + 'px'
        }"
        v-show="proView !== 2"
      >
        <div
          class="nav-back-btn"
          style="left: 4px; top: 5px; width: 75px; height: 44px; padding: 5px"
          @click="backEvent"
          v-if="$store.state.webtype != 2"
        >
          <img
            style="display: block; width: 24px; height: 24px"
            src="static/image/mall2/back.png"
          />
        </div>
        <div
          class="nav-back-btn"
          style="right: 10px; top: 5px; width: 34px; height: 34px; padding: 5px"
          @click="sharegoods"
          v-if="$store.state.webtype == 1"
        >
          <img
            style="display: block; width: 100%; height: 100%"
            src="static/image/mall2/fenxiang.png"
          />
        </div>
        <div
          class="nav-back-btn"
          style="right: 10px; top: 5px; width: 34px; height: 34px; padding: 5px"
          @click="showShare"
          v-if="false"
        >
          <!-- $store.state.webtype == 3 -->
          <img
            style="display: block; width: 100%; height: 100%"
            src="static/image/mall2/share.png"
          />
        </div>
      </div>
    </div>
    <div
      ref="detailTop1"
      class="detail-top"
      style="visibility: hidden"
      :style="{
        height: $store.state.barHeight + $market.getNavHeight(true) + 'px'
      }"
      v-if="detailShow"
      v-show="proView !== 2"
    >
      <nav-top
        isMust="true"
        :noBack="$store.state.webtype == 2"
        :noTitle="true"
        @backEvent="backEvent"
      >
        <transition name="transition1">
          <div
            class="detail-tab"
            style="left: 20%; right: 20%; font-size: 16px"
            v-show="proView == 1"
          >
            <div
              class="btn-div"
              :style="getSelectedTabStyle(1)"
              @click="toptabEvent(1)"
            >
              商品
            </div>
            <div
              class="btn-div"
              :style="getSelectedTabStyle(2)"
              @click="toptabEvent(2)"
            >
              详情
            </div>
            <div
              class="btn-div"
              :style="getSelectedTabStyle(3)"
              @click="toptabEvent(3)"
            >
              评价
            </div>
            <div
              class="btn-div"
              :style="getSelectedTabStyle(4)"
              @click="toptabEvent(4)"
            >
              推荐
              <!--<span :class="{theme_border_red_i: toptab == 4, theme_font_red_i: toptab == 4}"></span>-->
            </div>
          </div>
        </transition>
        <transition name="transition2">
          <div
            style="
              position: absolute;
              left: 20%;
              right: 20%;
              font-size: 18px;
              font-weight: 500;
              text-align: center;
            "
            v-show="proView == 2"
          >
            图文详情
          </div>
        </transition>
        <div
          class="right-btn"
          style="right: 0px; height: 44px; top: 0px; padding-right: 12px"
          v-if="$store.state.webtype == 1"
          @click="sharegoods"
        >
          <i
            class="iconfont mall-fenxiang theme_font_common"
            style="font-size: 20px"
          ></i>
        </div>
      </nav-top>
    </div>
    <!-- :style="getScrollTop()" -->
    <div ref="scrollView" class="scroll-div theme_bg_white" v-if="detailShow">
      <swiper class="main-swiper" ref="mySwiper" :options="mainSwiper">
        <swiper-slide :class="{ 'swiper-no-swiping': proView == 2 }">
          <div class="main-swiper" style="position: relative">
            <transition name="transition1">
              <div
                class="main-swiper theme_bg_white_f5"
                style="position: absolute"
                v-show="proView == 1"
              >
                <!--<div ref="scrollView1" @scroll="pageSite" @touchend="touchend" class="main-swiper enable-scroll theme_bg_white_f5" style="position: absolute;" v-show="proView == 1">-->
                <pull-to
                  ref="pullTo1"
                  :bottomConfig="{
                    pullText: '',
                    triggerText: '释放显示商品详情',
                    loadingText: '加载中...',
                    doneText: '加载完成',
                    failText: '加载失败',
                    loadedStayTime: 400,
                    stayDistance: 40,
                    triggerDistance: 50
                  }"
                  :top-load-method="topPull"
                  :is-bottom-bounce="true"
                  :is-top-bounce="false"
                  :doSiteCallback="true"
                  @pageSite="pullScrollEvent"
                >
                  <div>
                    <div class="swiper-div theme_bg_white">
                      <swiper :options="swiperOption">
                        <swiper-slide v-if="videoUrl != ''">
                          <video-player
                            class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            @ready="playerReadied"
                            :options="playerOptions"
                          ></video-player>
                        </swiper-slide>
                        <swiper-slide
                          v-for="(pic, pidx) in detailData.picUrls"
                          :key="pidx"
                        >
                          <div
                            class="swiper-img-div"
                            @click="showBigImageEvent(pidx)"
                          >
                            <img
                              :src="pic + '?x-oss-process=image/format,jpg'"
                            />
                          </div>
                        </swiper-slide>
                      </swiper>
                      <div class="swiper-index">
                        <div
                          class="si-item theme_bg_white_ef"
                          :class="{
                            'cus-index': proImgIndex == idx,
                            theme_bg_red_i: proImgIndex == idx
                          }"
                          v-for="(d, idx) in arrLen"
                        ></div>
                      </div>
                      <div
                        class="swiper-tip"
                        v-if="detailData.productType == 6"
                      >
                        <div class="pay-time">
                          <span>每日下单时间：</span>
                          <span class="tm"
                            >{{ detailData.dailySaleBegin }}
                          </span>
                          <span>至</span>
                          <span class="tm">{{ detailData.dailySaleEnd }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="base-info theme_bg_white">
                      <!-- 添加到心愿单 -->
                      <div
                        class="add-wish-btn"
                        @click="addWishLish"
                        v-if="
                          $store.state.globalConfig.isEnabledWishOrder == 1 &&
                            detailData.deliveryType == 2
                        "
                      >
                        <img
                          src="../wish-list/images/wish-icon-no.png"
                          alt=""
                          v-if="!detailData.isAddWishOrder"
                        />
                        <img
                          src="../wish-list/images/wish-icon.png"
                          alt=""
                          v-else
                        />
                      </div>
                      <!-- 添加到心愿单end -->

                      <!--秒杀-->
                      <div
                        class="seconds-kill"
                        v-if="
                          detailData.mktActivityPriceLevel == 3 ||
                            (showActivityTime == '1' &&
                              detailData.mktActivityPriceLevel != '')
                        "
                      >
                        <div class="left-div">
                          <div class="sk-row" v-if="showActivityTime != '1'">
                            <div class="price theme_font_white">
                              <span>￥</span>
                              <span class="price-z"
                                >{{ detailData.dpedData.integer }}
                              </span>
                              <span>.{{ detailData.dpedData.decimals }}</span>
                            </div>
                            <!-- <div class="share-img">-->
                            <!--   <img src="../../../../static/image/mall2/share.png" alt="">-->
                            <!-- </div>-->
                            <div class="progress">
                              <mt-progress
                                :value="detailData.soldNum || 0"
                                :bar-height="16"
                              ></mt-progress>
                            </div>
                            <div
                              class="progress-text theme_font_white"
                              v-if="detailData.soldNum < 100"
                            >
                              已抢{{ detailData.soldNum || 0 }}%
                            </div>
                            <div class="progress-text theme_font_white" v-else>
                              已抢光
                            </div>
                          </div>
                          <div class="sk-row" v-else>
                            <div class="price theme_font_white">
                              <PriceOrder
                                :showLevelImg="false"
                                :detailColor="'white'"
                                :detailitem="detailData"
                              ></PriceOrder>
                            </div>
                          </div>
                          <div class="sk-row">
                            <div class="sk-icon">
                              <i
                                class="iconfont mall-icon-test theme_bg_white theme_font_red"
                              ></i>
                              <span class="theme_font_white">秒杀价</span>
                            </div>
                            <div
                              class="o-price theme_font_white"
                              :class="{
                                'line-through':
                                  $store.state.globalConfig.priceShowType == 2
                              }"
                              v-if="
                                detailData.activityPrice < detailData.salePrice
                              "
                            >
                              <span
                                v-if="
                                  $store.state.globalConfig.priceShowType == 1
                                "
                                >原价:</span
                              >￥{{
                                $util.toDecimal2(
                                  $util.toDecimal2(
                                    detailData.dpedData.linePrice
                                  )
                                )
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="right-div theme_bg_light_red">
                          <div class="skr-row theme_font_red">
                            <!--距离结束还剩:-->
                            {{ getTimeTitle() }}
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="getCountdownTime"></Countdown>
                          </div>
                        </div>
                      </div>
                      <!--团购返现-->
                      <div
                        class="seconds-kill tgfx"
                        v-else-if="
                          detailData.mktActivityPriceLevel === 0 && tgfxData
                        "
                      >
                        <div class="left-div">
                          <div class="sk-row">
                            <div class="price theme_font_white">
                              <PriceOrder
                                :showLevelImg="false"
                                :detailColor="'white'"
                                :detailitem="detailData"
                              ></PriceOrder>
                            </div>
                          </div>
                          <div class="sk-row">
                            <div class="theme_font_white">
                              已售{{ tgfxData.totalNumber }}件
                            </div>
                            <div class="tgfx-gz theme_font_white">
                              满{{
                                tgfxData.returnRules[
                                  tgfxData.returnRules.length - 1
                                ].number
                              }}件，返{{
                                tgfxData.returnRules[
                                  tgfxData.returnRules.length - 1
                                ].returnValue
                              }}{{ getFxUnit(tgfxData.returnType) }}；
                            </div>
                          </div>
                        </div>
                        <div class="right-div theme_bg_light_red">
                          <div class="skr-row theme_font_red">
                            <!--距离结束还剩:-->
                            {{ getTimeTitle() }}
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="getCountdownTime"></Countdown>
                          </div>
                        </div>
                      </div>
                      <!--限时特价-->
                      <div
                        class="seconds-kill xstj"
                        v-else-if="detailData.mktActivityPriceLevel === 1"
                      >
                        <div class="left-div">
                          <div class="icon-img">
                            <img src="./img/xstj.png" />
                          </div>
                          <div class="price">
                            <p class="activity-price">
                              活动价：¥
                              <span>{{ detailData.dpedData.integer }} </span>.{{
                                detailData.dpedData.decimals
                              }}
                            </p>
                            <p class="orgin-price">
                              原价：¥{{
                                $util.toDecimal2(detailData.dpedData.linePrice)
                              }}
                            </p>
                          </div>
                        </div>
                        <div class="right-div">
                          <div class="skr-row theme_font_red">
                            <!--距离结束还剩:-->
                            {{ getTimeTitle() }}
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="getCountdownTime"></Countdown>
                          </div>
                        </div>
                      </div>
                      <!--贵州预售-->
                      <div
                        class="seconds-kill ys"
                        v-else-if="
                          detailData.supportPreSale == 1 &&
                            $store.state.globalConfig.presaleType == 2
                        "
                      >
                        <div class="left-div">
                          <div class="theme_font_white">
                            <span class="big-title">预售金额：</span>
                            <PriceOrder
                              :showLevelImg="false"
                              :detailColor="'white'"
                              :detailitem="detailData"
                            ></PriceOrder>
                          </div>
                        </div>
                        <div class="right-div theme_bg_light_red">
                          <div class="skr-row theme_font_red">
                            <!--距离结束还剩:-->
                            {{ getTimeTitle() }}
                          </div>
                          <div class="skr-row">
                            <Countdown :endTime="getCountdownTime"></Countdown>
                          </div>
                        </div>
                      </div>
                      <div class="price" v-else>
                        <PriceOrder :detailitem="detailData"></PriceOrder>
                        <span
                          class="price-small theme_font_tint left-m-8"
                          v-if="
                            detailData.dpedData.linePrice &&
                              detailData.activityPrice < detailData.salePrice
                          "
                          :class="{
                            'line-through':
                              $store.state.globalConfig.priceShowType == 2
                          }"
                        >
                          <span
                            v-if="$store.state.globalConfig.priceShowType == 1"
                            >原价:</span
                          >￥{{
                            $util.toDecimal2(
                              $util.toDecimal2(detailData.dpedData.linePrice)
                            )
                          }}
                        </span>
                      </div>
                      <div
                        class="row"
                        v-if="
                          detailData.packageStartTime && getPackageStartTime()
                        "
                      >
                        <div class="activity-notice">
                          <div class="sk-icon">
                            <i
                              class="iconfont mall-icon-test theme_bg_red theme_font_white"
                            ></i>
                            <span class="theme_font_red">距离售卖</span>
                          </div>
                          <div class="notice-price">
                            <Countdown
                              :endTime="getPackageStartTime()"
                            ></Countdown>
                          </div>
                        </div>
                      </div>
                      <div class="row" v-if="noticeIsShow()">
                        <div class="activity-notice">
                          <div class="sk-icon">
                            <i
                              class="iconfont mall-icon-test theme_bg_red theme_font_white"
                            ></i>
                            <span class="theme_font_red"
                              >{{
                                detailData.noticeActivityDetail.activityType
                              }}预告
                            </span>
                          </div>
                          <div class="notice-price theme_font_red">
                            {{ getNoticeTime() + " " + getNoticePrice() }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="content">
                          <div
                            class="title theme_font_black"
                            v-html="getSkuNameStr(detailData)"
                          ></div>
                          <div class="share_button" @click="onShare">
                            <img
                              src="static/image/mall2/share_icon.png"
                              alt=""
                            />
                            <div>分享</div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="row"
                        v-if="
                          detailData.mktActivityPriceLevel === 0 && tgfxData
                        "
                      >
                        <div class="font-small theme_font_tint">
                          <span v-for="rule in tgfxData.returnRules"
                            >满{{ rule.number }}件，每件返{{ rule.returnValue
                            }}{{ getFxUnit(tgfxData.returnType) }}</span
                          >
                        </div>
                      </div>
                      <div
                        class="row"
                        v-if="
                          detailData.mktActivityPriceLevel === 0 && tgfxData
                        "
                      >
                        <div class="theme_font_black font-small">
                          <span class="theme_font_red">温馨提示：</span>
                          <span>{{ tgfxData.groupBuyCashDesc }}</span>
                        </div>
                      </div>
                    </div>
                    <!--券和优惠活动-->
                    <div
                      class="cou_and_act theme_bg_white"
                      v-if="
                        (!cardType || (cardType && cardType == 551)) &&
                          orderCategory != '1'
                      "
                    >
                      <CouponAndActivity
                        :detailData="detailData"
                        @openEvent="couponEvent"
                      ></CouponAndActivity>
                    </div>
                    <!--<div class="block-div theme_bg_white">-->
                    <!--<div class="flex-row" @click="couponEvent">-->
                    <!--<div class="label-middle theme_font_gray">领券</div>-->
                    <!--&lt;!&ndash;                        <div class="font-small theme_font_tint" v-if="detailData.couponModels == '' && jfhqList == ''">&ndash;&gt;-->
                    <!--<div class="font-small theme_font_tint" v-if="couFlag.length==0 && jfhqList == ''">-->
                    <!--暂无可用优惠券-->
                    <!--</div>-->
                    <!--<div class="act-item-full theme_standard_bg theme_font_white"-->
                    <!--v-if="couFlag.length>0 && cidx < 2"-->
                    <!--v-for="(couponModel, cidx) in couFlag">{{couponModel.couTypeTitle}}-->
                    <!--</div>-->
                    <!--<div class="act-item-full theme_standard_bg theme_font_white"-->
                    <!--v-if="jfhqList != '' && cidx < 2"-->
                    <!--v-for="(couponModel, cidx) in jfhqList">{{couponModel.couTypeTitle}}-->
                    <!--</div>-->
                    <!--<div class="full"></div>-->
                    <!--<div>-->
                    <!--<i class="iconfont mall-gengduo more-icon theme_font_tint"></i>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--<div class="flex-row" v-for="(aactivity, aidx) in detailData.activityList"-->
                    <!--@click="showActivity = true">-->
                    <!--<div class="label-middle theme_font_gray">{{ aidx == 0 ? '促销' : '' }}</div>-->
                    <!--<div class="act-item-empty line_circle theme_standard_font theme_standard_bdr single-line">-->
                    <!--{{aactivity.type}}-->
                    <!--</div>-->
                    <!--<div class="activity-text theme_font_common full single-line">{{aactivity.title}}</div>-->
                    <!--<div v-if="aidx == 0">-->
                    <!--<i class="iconfont mall-gengduo more-icon theme_font_tint"></i>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--商品包信息-->
                    <div
                      class="block-div theme_bg_white"
                      v-if="productType == 4"
                    >
                      <div class="flex-row">
                        <div class="title theme_font_black">套装明细</div>
                      </div>
                      <div
                        class="pro-row"
                        v-for="pro in detailData.packageSkuList"
                      >
                        <div class="img-div">
                          <img :src="pro.phMainUrl" />
                        </div>
                        <div class="info-div">
                          <div
                            class="title pro-title-height double-line theme_font_black"
                            v-html="getSkuNameStr(pro)"
                          ></div>
                          <div
                            class="feature-names double-line theme_font_tint"
                          >
                            {{ pro.featureNames }}
                          </div>
                          <div class="price">
                            <span
                              class="font-small theme_font_tint"
                              style="float: right"
                              >x {{ pro.skuNum }} {{ pro.metric }}</span
                            >
                            <span class="font-small theme_font_red">￥</span>
                            <span class="price-mid theme_font_red full"
                              >{{ pro.salePrice }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--预售信息-->
                    <div
                      class="block-div theme_bg_white"
                      v-if="
                        detailData.supportPreSale == 1 &&
                          $store.state.globalConfig.presaleType == 2
                      "
                    >
                      <div class="flex-row">
                        <div class="theme_font_black">
                          {{ $store.state.globalConfig.presaleDescription }}
                        </div>
                      </div>
                      <div class="flex-row">
                        <div class="theme_font_black">
                          提货时间：{{ detailData.beginPickUpTime }}
                        </div>
                      </div>
                    </div>
                    <!--可参与的单品活动-->
                    <div
                      v-if="
                        singleActivities_2.length > 0 && orderCategory != '1'
                      "
                    >
                      <div
                        class="block-div theme_bg_white"
                        v-if="curSingleActivity != null"
                      >
                        <div class="flex-row">
                          <p
                            class="sl-tag line_circle theme_border_red_i theme_font_red"
                          >
                            {{ curSingleActivity.activityType }}
                          </p>
                          <p class="sl-title single-line">
                            {{ curSingleActivity.activityTitle }}
                            <span class="theme_standard_font"
                              >{{ getActivityStr(curSingleActivity) }} ¥{{
                                $util.toDecimal2(
                                  curSingleActivity.activityPrice
                                )
                              }}
                            </span>
                          </p>
                          <p
                            class="good-salespro-right"
                            v-if="singleActivities_2.length > 1"
                            @click="reviseSingleActivity()"
                          >
                            修改
                          </p>
                          <p
                            class="good-salespro-right"
                            v-if="singleActivities_2.length == 1"
                            @click="removeSingleActivity()"
                          >
                            不参加
                          </p>
                        </div>
                      </div>
                      <div class="block-div theme_bg_white" v-else>
                        <div
                          class="flex-row"
                          v-for="saitem in singleActivities_2"
                        >
                          <p
                            class="sl-tag line_circle theme_standard_bdr_i theme_standard_font"
                          >
                            {{ saitem.activityType }}
                          </p>
                          <p class="sl-title single-line">
                            {{ saitem.activityTitle }}
                            <span class="theme_standard_font"
                              >{{ getActivityPrice(saitem) }} + ¥{{
                                $util.toDecimal2(saitem.activityPrice)
                              }}
                            </span>
                          </p>
                          <p
                            class="good-salespro-right"
                            @click="joinSingleActivity(saitem)"
                          >
                            参加
                          </p>
                        </div>
                      </div>
                    </div>
                    <!--可用券-->
                    <div
                      class="block-div theme_bg_white"
                      v-if="
                        detailData.proCanUseCouList &&
                          detailData.proCanUseCouList.length > 0
                      "
                      @click="kyCouponEvent"
                    >
                      <div class="flex-row">
                        <div class="label-middle theme_font_gray">可用券</div>
                        <div
                          class="act-item-full theme_standard_bg theme_font_white"
                          v-if="cidx < 2"
                          v-for="(couponModel,
                          cidx) in detailData.proCanUseCouList"
                        >
                          {{ couponModel.couTypeTitle }}
                        </div>
                        <div class="full"></div>
                        <div>
                          <i
                            class="iconfont mall-gengduo more-icon theme_font_tint"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <!--已选-->
                    <div class="block-div theme_bg_white">
                      <div class="flex-row" @click="proSelectEvent">
                        <div class="label-middle theme_font_gray">已选</div>
                        <div class="theme_font_black" style="font-weight: 500">
                          {{ selectedText }}
                        </div>
                        <!--<div class="theme_font_black">1件</div>-->
                        <div class="full"></div>
                        <div>
                          <i
                            class="iconfont mall-gengduo more-icon theme_font_tint"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div
                      class="block-div no-padding-bottom theme_bg_white"
                      v-if="detailData.productType != 5"
                    >
                      <!--<div class="flex-row" @click="selectDeliveryType" v-if="detailData.orginDeliveryType != detailData.deliveryType">-->
                      <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                      <!--<div class="theme_font_black full">-->
                      <!--{{detailData.deliveryType == '1' ? '自提' : '配送'}}-->
                      <!--</div>-->
                      <!--<div>-->
                      <!--<i class="iconfont mall-gengduo more-icon theme_font_tint"></i>-->
                      <!--</div>-->
                      <!--</div>-->
                      <div
                        class="flex-row"
                        style="align-items: flex-start"
                        @click="selectArea"
                        v-if="detailData.deliveryType == '2'"
                      >
                        <div class="label-middle theme_font_gray">送至</div>
                        <div
                          class="theme_font_black full address-div defaultStyle"
                          v-if="$store.state.mall2.selectAddress.id == -1"
                        >
                          {{ regionText }}
                        </div>
                        <!-- <div>{{$store.state.mall2.selectAddress}}</div> -->
                        <div
                          class="theme_font_black full address-div"
                          v-if="$store.state.mall2.selectAddress.id != -1"
                        >
                          {{ $store.state.mall2.selectAddress.addressFull }}
                        </div>
                        <div>
                          <i
                            class="iconfont mall-gengduo more-icon theme_font_tint"
                          ></i>
                        </div>
                      </div>
                      <!--<div class="flex-row" v-if="detailData.deliveryType == '2'">-->
                      <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                      <!--<div class="theme_font_black">{{detailData.distriParty}}</div>-->
                      <!--</div>-->
                      <div
                        class="flex-row"
                        v-if="detailData.deliveryType == '1'"
                        @click="selectPickUpAddress"
                      >
                        <div class="label-middle theme_font_gray">自提点</div>
                        <div class="theme_font_black">
                          {{ $store.state.mall2.zitiAddress.storeName }}
                        </div>
                        <div class="full"></div>
                        <div>
                          <i
                            class="iconfont mall-gengduo more-icon theme_font_tint"
                          ></i>
                        </div>
                      </div>
                      <!--<div class="flex-row" v-if="detailData.deliveryType == '1'">-->
                      <!--<div class="label-middle theme_font_gray">配送方式</div>-->
                      <!--<div class="theme_font_black">上门自提</div>-->
                      <!--</div>-->
                      <div
                        class="color-row theme_bg_dark"
                        @click="serversEvent"
                        v-if="
                          $store.state.globalConfig
                            .product_services_show_type != '0' &&
                            detailData.isShowAfterSale != 0
                        "
                      >
                        <div
                          class="server-item"
                          v-for="server in detailData.saleServices"
                          v-if="parseInt(server.days) > 0"
                        >
                          <i
                            class="iconfont mall-dui theme_standard_font icon-font"
                          ></i>
                          <span>{{ getServerText(server) }}</span>
                        </div>
                        <div
                          class="server-item"
                          v-for="server in detailData.serviceInfoJson"
                        >
                          <i
                            class="iconfont mall-dui theme_standard_font icon-font"
                          ></i>
                          <span>{{ server.name }}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="block-div theme_bg_white"
                      v-if="detailComment && detailComment.evaluateCount > 0"
                    >
                      <div class="flex-row" @click="allCommentEvent">
                        <div
                          class="title theme_font_black"
                          v-if="detailComment.evaluateCount == 0"
                        >
                          暂无评价
                        </div>
                        <div
                          class="title theme_font_black"
                          v-if="detailComment.evaluateCount > 0"
                        >
                          评价（{{ detailComment.evaluateCount }}）
                        </div>
                        <div class="full"></div>
                        <div
                          class="font-small right-margin theme_font_common"
                          v-if="detailComment.evaluateCount > 0"
                        >
                          <span>好评率</span>
                          <span class="theme_standard_font"
                            >{{ detailComment.evaluateGoodRate }}
                          </span>
                        </div>
                        <div>
                          <i
                            class="iconfont mall-gengduojiantou icon-font theme_font_common"
                          ></i>
                        </div>
                      </div>
                      <div
                        class="comment-div"
                        v-for="comment in detailComment.evaluateList"
                      >
                        <div class="flex-row comment-row theme_font_common">
                          <div class="header-img right-margin">
                            <img
                              :src="
                                comment.userAvtUrl != ''
                                  ? comment.userAvtUrl
                                  : 'static/image/mall2/header.png'
                              "
                            />
                          </div>
                          <div class="right-margin full">
                            {{ getCommentUserStr(comment) }}
                          </div>
                          <div class="">
                            <i
                              class="iconfont mall-xingxing icon-level theme_font_tint"
                              :class="{
                                theme_standard_font_i: comment.score >= lv
                              }"
                              v-for="lv in 5"
                            ></i>
                          </div>
                        </div>
                        <div class="flex-row comment-row theme_font_gray">
                          <div style="line-height: 1.4">
                            {{ comment.evaluateContent }}
                          </div>
                        </div>
                        <div class="imgs" v-if="comment.evaluateImages != ''">
                          <div
                            class="s-img-div"
                            v-for="(pic, idx) in getCommentImgs(
                              comment.evaluateImages
                            )"
                            v-if="idx < 4"
                          >
                            <img :src="pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="block-div theme_bg_white"
                      v-if="
                        $store.state.globalConfig.proDetailStoreDisabled != 1
                      "
                    >
                      <div class="flex-row" @click="toShop">
                        <!--<div class="logo">-->
                        <!--<img src="static/testImg/shop-logo.png"/>-->
                        <!--</div>-->
                        <div class="shop-title">
                          <i
                            class="iconfont mall-dianpu dianpu-icon theme_standard_font"
                          ></i
                          >{{ detailData.storeOuName }}
                        </div>
                        <div
                          class="act-item-full theme_standard_bg theme_font_white"
                          v-if="detailData.storeType == '0'"
                        >
                          自营
                        </div>
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
                    <div
                      class="block-div theme_bg_white"
                      v-if="detailData.packageList.length > 0"
                    >
                      <div class="flex-row">
                        <div class="title theme_font_black">组合套装</div>
                      </div>
                      <div class="recommend-div padding-bottom-8">
                        <div
                          class="pro-div"
                          v-for="item in detailData.packageList"
                          @click="productPickageEvent(item)"
                        >
                          {{ dataProcessing(item) }}
                          <div class="img-div">
                            <img :src="item.phMainUrl" />
                          </div>
                          <div class="title single-line theme_font_black">
                            {{ item.skuName }}
                          </div>
                          <div class="price single-line">
                            <span class="font-small theme_font_red">￥</span>
                            <span
                              class="left-no-space price-z theme_font_red"
                              >{{ item.dpedData.integer }}</span
                            >
                            <span
                              class="left-no-space font-small theme_font_red"
                              >.{{ item.dpedData.decimals }}</span
                            >
                            <span
                              class="font-small theme_font_tint left-m-8"
                              v-if="
                                item.dpedData.linePrice &&
                                  item.activityPrice < item.salePrice
                              "
                              :class="{
                                'line-through':
                                  $store.state.globalConfig.priceShowType == 2
                              }"
                            >
                              <span
                                v-if="
                                  $store.state.globalConfig.priceShowType == 1
                                "
                                >原价:</span
                              >￥{{ $util.toDecimal2(item.dpedData.linePrice) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="block-div theme_bg_white"
                      v-if="
                        detailData.recommendSkuList &&
                          detailData.recommendSkuList.length > 0 &&
                          (!cardType || (cardType && cardType == 551))
                      "
                    >
                      <div class="flex-row">
                        <div class="title theme_font_black">为你推荐</div>
                      </div>
                      <div class="recommend-div">
                        <div
                          class="pro-div"
                          v-for="item in detailData.recommendSkuList"
                          @click="productEvent(item)"
                        >
                          {{ dataProcessing(item) }}
                          <div class="img-div">
                            <img :src="item.phMainUrl" />
                          </div>
                          <div class="title single-line theme_font_black">
                            {{ item.skuName }}
                          </div>
                          <div class="price single-line">
                            <PriceOrder :listitem="item"></PriceOrder>
                          </div>
                        </div>
                      </div>
                      <div class="more-btn">
                        <label
                          class="act-item-empty line_circle theme_standard_font theme_standard_bdr"
                          @click="moreRecommend"
                          >更多推荐</label
                        >
                      </div>
                    </div>
                    <div
                      v-html="introduction1"
                      class="introduction-div"
                      style="padding: 0"
                      id="picMedia"
                    ></div>
                    <!-- <div class="load-next theme_bg_white" @click="proView = 2">
                      <img src="static/image/mall2/load-next.png" />
                      <span class="theme_font_tint">上拉加载图文详情</span>
                    </div> -->
                  </div>
                </pull-to>
              </div>
            </transition>
            <div class="main-swiper"></div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative">
            <div
              ref="scrollView2"
              class="main-swiper-scroll-content enable-scroll"
              style="top: 64px"
            >
              <div class="detail-div">
                <div class="btns-div theme_bg_white">
                  <div
                    class="btn-item theme_font_gray"
                    :class="{ theme_standard_font_i: introductionIndex == 1 }"
                    @click="introductionSelected(1)"
                  >
                    商品介绍
                  </div>
                  <div
                    class="btn-item theme_font_gray"
                    :class="{ theme_standard_font_i: introductionIndex == 2 }"
                    @click="introductionSelected(2)"
                  >
                    规格参数
                  </div>
                  <div
                    class="btn-item theme_font_gray"
                    :class="{ theme_standard_font_i: introductionIndex == 3 }"
                    @click="introductionSelected(3)"
                    v-if="detailData.isShowAfterSale != 0"
                  >
                    售后包装
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
                  <div
                    v-html="introduction1"
                    class="introduction-div"
                    v-if="introductionIndex == 1"
                  ></div>
                  <div
                    v-html="introduction2"
                    class="introduction-div"
                    v-if="introductionIndex == 2"
                  ></div>
                  <div
                    v-html="introduction3"
                    class="introduction-div"
                    v-if="introductionIndex == 3"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative">
            <div
              ref="scrollView3"
              class="main-swiper-scroll-content enable-scroll"
              style="top: 44px"
            >
              <Judgement
                :skuId="this.skuId"
                v-show="toptab == 3"
                v-if="load3"
                @showBigImgs="showBigImgsEvent"
              ></Judgement>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative">
            <div class="main-swiper-scroll-content" style="top: 44px">
              <Recommend
                ref="scrollView4"
                :deliveryType="this.deliveryType"
                :skuId="this.skuId"
                v-show="toptab == 4"
                v-if="load4"
              ></Recommend>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div
      class="bottom-tip theme_bg_yl theme_standard_font_i"
      v-if="canSale == false"
    >
      该商品在该地区暂不支持购买，非常抱歉！
    </div>
    <div
      class="bottom-tip theme_bg_yl theme_standard_font_i"
      v-else-if="
        detailData.interfaceType == '2' || detailData.interfaceType == '1'
      "
    >
      说明：图片中如显示价格仅做参考，以实际售价为准。
    </div>
    <div
      class="bottom-btns yj-card"
      v-if="productType == 8 || (easyCardId && !recommendCommodity)"
    >
      <div
        class="btn theme_bg_red theme_font_white"
        :class="{
          theme_bg_dark_d_i: canSale == false || detailData.status == 0
        }"
        @click="buyNowEvent"
      >
        <p class="title">立即购买</p>
      </div>
    </div>
    <div
      class="bottom-box"
      v-else-if="!easyCardId && detailShow && !recommendCommodity"
    >
      <div class="bottom-box-btns bottom_btns_padding">
        <div class="btn full" ref="gouwuche" @click="toCart">
          <template
            v-if="
              detailData.supportPreSale == 1 &&
                $store.state.globalConfig.presaleType == 2
            "
          >
            <p
              class="cart-num theme_bg_red theme_font_white"
              v-if="cartNum > 0"
            >
              {{ cartNum }}
            </p>
          </template>
          <template v-else>
            <p
              class="cart-num theme_bg_red theme_font_white"
              v-if="$store.state.mall2.cartNum > 0"
            >
              {{ $store.state.mall2.cartNum }}
            </p>
          </template>
          <!-- <i class="iconfont mall-gouwuche btn-icon theme_font_gray"></i> -->
          <img src="static/image/mall2/cart.png" alt="" class="btn-img" />
          <p class="text">购物车</p>
        </div>
        <div
          class="btn full"
          @click="toShop"
          v-if="$store.state.globalConfig.proDetailStoreDisabled != 1"
        >
          <i class="iconfont mall-dianpu btn-icon theme_font_gray"></i>
          <p class="text">店铺</p>
        </div>
        <div class="btn full" @click="collectEvent">
          <!-- <i
                                                                                                                          class="iconfont mall-shoucang btn-icon theme_font_gray"
                                                                                                                          v-if="isCollect == false"
                                                                                                                        ></i> -->
          <img
            src="static/image/mall2/cancelCollect.png"
            alt=""
            class="btn-img"
            v-show="isCollect == false"
          />
          <!--<i class="iconfont mall-shoucang btn-icon theme_font_red" v-if="isCollect == 'true'"></i>-->
          <!-- <transition :name="collectName">
                                                                                                                          </transition> -->
          <img
            class="btn-img"
            src="static/image/mall2/collect.png"
            v-show="isCollect == true"
          />
          <p class="text">收藏</p>
        </div>
        <div class="btn full" @click="handleCustomer">
          <!-- <i class="iconfont service btn-icon theme_font_gray">
          </i> -->
          <img
            src="static/images/card-provincial/customer_service_black.png"
            alt=""
            class="btn-img"
          />
          <p class="text">客服</p>
        </div>
        <div
          class="btn full"
          @click="songliEvent"
          v-if="
            $store.state.globalConfig.send_gift_enable == '1' &&
              stockNum != 0 &&
              canSale == true &&
              detailData.status != '0' &&
              isPayTime()
          "
        >
          <img class="btn-sl-img" src="./img/sl.png" />
          <p class="text">送礼</p>
        </div>
        <div
          class="btn theme_standard_bg theme_font_white radius"
          @click="addToCart"
          v-if="
            stockNum != 0 &&
              canSale == true &&
              detailData.status != '0' &&
              productType != 511 &&
              (detailData.supportPreSale != '1' ||
                $store.state.globalConfig.presaleType == 2)
          "
        >
          <p class="title">加入购物车</p>
        </div>
        <div
          class="btn theme_bg_y theme_font_white radius"
          @click="buyNowEvent"
          v-if="
            stockNum != 0 &&
              canSale == true &&
              detailData.status != '0' &&
              isPayTime() &&
              detailData.supportPreSale != '1'
          "
        >
          <p class="title">立即购买</p>
        </div>
        <div
          class="btn theme_bg_y theme_font_white radius"
          :class="{ 'big-btn': $store.state.globalConfig.presaleType != 2 }"
          @click="preSaleEvent"
          v-if="
            stockNum != 0 &&
              canSale == true &&
              detailData.status != '0' &&
              isPayTime() &&
              detailData.supportPreSale == '1'
          "
        >
          <p class="title">预购下单</p>
        </div>
        <!--<div class="btn big-btn theme_bg_y theme_font_white" @click="noStockEvent" v-if="detailData.status">-->
        <!--<p class="title">'商品已下架'</p>-->
        <!--</div>-->
        <div
          class="btn big-btn theme_bg_y theme_font_white radius nogoods"
          @click="noStockEvent"
          v-if="stockNum == 0 && canSale == true && detailData.status != '0'"
        >
          <p class="title">商品缺货</p>
        </div>
        <div
          class="btn big-btn theme_bg_y theme_font_white radius nogoods"
          @click="canNotSaleEvent"
          v-if="canSale == true && detailData.status == '0'"
        >
          <p class="title">商品已下架</p>
        </div>
        <div
          class="btn big-btn theme_bg_y theme_font_white radius nogoods"
          @click="canNotSaleEvent"
          v-if="canSale == false"
        >
          <p class="title">不在可售区域</p>
        </div>
      </div>
      <div class="adapter-iphoneX" v-if="this.$util.getIsIphoneX_X()"></div>
    </div>
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pro-row">
          <div class="img-div">
            <img :src="detailData.phMainUrl" />
          </div>
          <div class="info-div">
            <div
              class="title theme_font_black"
              v-html="getSkuNameStr(detailData)"
            ></div>
            <div class="price">
              <PriceOrder :listitem="detailData"></PriceOrder>
            </div>
          </div>
        </div>
        <div class="pop-scroll-div">
          <div
            class="items-div"
            v-for="(feature, fidx) in detailData.featureList"
            v-if="featureRefresh"
          >
            <div class="title theme_font_common">{{ feature.featureName }}</div>
            <div
              class="item theme_font_tint theme_font_common theme_bg_white_ef"
              :class="{
                'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i':
                  subFeature.selected
              }"
              v-for="subFeature in feature.featureValueList"
              @click="subFeatureEvent(subFeature, fidx)"
            >
              {{ subFeature.featureValue }}
            </div>
          </div>
          <div class="count-line">
            <div class="full theme_font_common">
              购买数量
              <span
                v-if="$store.state.globalConfig.detailShowStockNum != 'false'"
                >（库存 {{ stockNum < 1000 ? stockNum : "充足" }}）</span
              >
            </div>
            <!--<Counter v-model="selectedNum" :minValue="minNum" :stepNum="stepNum" :maxValue="maxNum"-->
            <!--@numChange="numChange"></Counter>-->
            <van-stepper
              v-model="selectedNum"
              :min="minNum"
              :max="maxNum"
              :step="stepNum"
              @blur="numChange"
              @change="generateSelectedText"
              integer
            />
          </div>
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_red"
          @click="popSureEvent"
          v-if="
            popFlag == 'addToCart' &&
              stockNum != 0 &&
              canSale == true &&
              detailData.status != '0' &&
              (detailData.supportPreSale != '1' ||
                $store.state.globalConfig.presaleType == 2) &&
              detailData.productType != 8
          "
        >
          加入购物车
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_y"
          @click="noStockEvent"
          v-if="stockNum == 0 && canSale == true && detailData.status != '0'"
        >
          <p class="title">商品缺货</p>
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_y"
          @click="canNotSaleEvent"
          v-if="canSale == true && detailData.status == '0'"
        >
          <p class="title">商品已下架</p>
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_y"
          @click="canNotSaleEvent"
          v-if="canSale == false"
        >
          <p class="title">不在可售区域</p>
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_red"
          @click="popSureEvent"
          v-if="popFlag == 'buyNow'"
        >
          立即购买
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_red"
          @click="popSureEvent"
          v-if="popFlag == 'songli'"
        >
          送礼
        </div>
        <div
          class="bottom-btn theme_font_white theme_bg_red"
          @click="popSureEvent"
          v-if="popFlag == 'preSale'"
        >
          预购下单
        </div>
        <div class="adapter-iphoneX" v-if="this.$util.getIsIphoneX_X()"></div>
      </div>
    </pop-view>
    <pop-view v-if="showActivity" @closeEvent="showActivity = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">促销</div>
        <div class="pop-scroll-div">
          <div
            class="activity-div"
            v-for="(aactivity, aidx) in detailData.activityList"
            @click="activityProducts(aactivity)"
          >
            <div
              class="act-item-empty line_circle theme_border_red theme_font_red"
            >
              {{ aactivity.type }}
            </div>
            <div class="activity-text theme_font_common full">
              {{ aactivity.title }}
            </div>
            <i
              class="iconfont mall-gengduojiantou more-icon theme_font_tint"
            ></i>
          </div>
        </div>
      </div>
    </pop-view>
    <pop-view
      v-if="showSelectDeliveryType"
      @closeEvent="showSelectDeliveryType = false"
    >
      <div class="pop-body">
        <div class="pop-title theme_font_common">切换配送方式</div>
        <div class="pop-scroll-div">
          <div class="activity-div" @click="changeDelivery('1')">
            <div
              class="act-item-empty line_circle theme_border_red theme_font_red"
            >
              自提
            </div>
            <div class="activity-text theme_font_common full">
              您需要到选中的自提点提货
            </div>
            <i
              class="iconfont more-icon"
              :class="
                detailData.deliveryType == '1'
                  ? ['mall-xuanzhong', 'theme_font_red']
                  : ['mall-weixuanzhong', 'theme_font_tint']
              "
            ></i>
          </div>
          <div class="activity-div" @click="changeDelivery('2')">
            <div
              class="act-item-empty line_circle theme_border_red theme_font_red"
            >
              配送
            </div>
            <div class="activity-text theme_font_common full">
              将会送至您指定的位置
            </div>
            <i
              class="iconfont more-icon"
              :class="
                detailData.deliveryType == '2'
                  ? ['mall-xuanzhong', 'theme_font_red']
                  : ['mall-weixuanzhong', theme_font_tint]
              "
            ></i>
          </div>
        </div>
      </div>
    </pop-view>
    <RegionSelect
      v-if="showSelect"
      ref="regionselect"
      :initData="initData"
      @selectedItemsEvent="selectedItemsEvent"
      @closeEvent="regionCloseEvent"
    ></RegionSelect>
    <transition name="bounce" @afterEnter="productImgAfterEnter">
      <img
        :src="this.detailData.phMainUrl"
        alt=""
        class="productImg"
        v-if="showProductImg"
      />
    </transition>
    <transition @after-enter="afterEnter" @before-enter="beforeEnter">
      <div class="anProductImg" v-if="showAddCartAn">
        <img :src="this.detailData.phMainUrl" alt="" />
      </div>
    </transition>
    <BigImage
      :initIndex="videoUrl != '' ? proImgIndex - 1 : proImgIndex"
      :picUrls="detailData.picUrls"
      v-if="showBigImage"
      @closeEvent="closeBigImage"
    ></BigImage>
    <BigImage
      :picUrls="picUrls"
      v-if="showPicUrls"
      @closeEvent="closeBigImage"
    ></BigImage>
    <van-popup
      v-model="showSharePopup"
      round
      position="bottom"
      :style="{ height: '35%' }"
    >
      <div class="share_popup">
        <div class="share_botton">
          <div class="share_botton_item" @click="shareWechatFriends">
            <img src="static/image/mall2/share_wechat.png" alt="" />
            <div>微信好友</div>
          </div>
          <div class="share_botton_item" @click="shareImg">
            <img src="static/image/mall2/share_img.png" alt="" />
            <div>图片分享</div>
          </div>
          <div class="share_botton_item" @click="shareLink">
            <img src="static/image/mall2/share_link.png" alt="" />
            <div>链接分享</div>
          </div>
        </div>
        <div class="cancel" @click="showSharePopup = false">
          取消
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import Counter from '@/components/commonui/counter/counter'
import { mapState, mapGetters, mapMutations } from "vuex";
import Judgement from "./judgement/judgement";
import RegionSelect from "../../base/region-select";
import Recommend from "./recommend/index";
import Coupon from "../common/coupon/index-new";
import ServersDetail from "../common/servers-detail";
import Address from "../common/address";
import PickupAddress from "../common/pickup-address";
import BigImage from "../common/big-image/index";
import PullTo from "@/components/Vendor/vue-pull-to/vue-pull-to";
import Countdown from "../../Vendor/countdown/countdown";
import PriceOrder from "@/components/commonui/price/price-order";
import Config from "@/api/config";
import ShareImage from "./shareImage";
import wxfunc from "@/utils/wxfunc";
import WechatOP from "@/utils/WechatOP";
import InitialLoadPickupAny from "@/utils/initialLoadPickupAny.js";
import SalesPro from "../common/salepro";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import staticDataRequest from "@/utils/staticData/staticDataRequest.js";
import CouponAndActivity from "./base/couponAndActivity";
import dataMergeInterceptor from "@/utils/staticData/dataMergeInterceptor";
import cartEvent from "../../../utils/presale/cart";
import appNav from "@zkty-team/x-engine-module-nav";
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
    videoPlayer,
    CouponAndActivity
  },
  data() {
    let that = this;
    return {
      directWeChatShare: "0",
      backApp: false,
      couFlag: [],
      id: "",
      skuId: "",
      orderCategory: "",
      vipUnitUserCode: "",
      productType: "",
      toptab: 1,
      proImgIndex: 0,
      proView: 1,
      page1ScrollTop: 0,
      deliveryType: 2,
      // collectName: "",
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
          slideChange: function() {
            that.toptab = this.realIndex + 1;
            if (that.toptab == 3) {
              that.load3 = true;
            } else if (that.toptab == 4) {
              that.load4 = true;
            }
            if (this.realIndex == 0) {
              if (that.page1ScrollTop < 200) {
                let opacity = that.page1ScrollTop / 200;
                if (opacity < 0.2) {
                  that.$refs.detailTop2.style.visibility = "visible";
                  that.$refs.detailTop1.style.visibility = "hidden";
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
              that.$refs.detailTop2.style.opacity = 0;
              that.$refs.detailTop1.style.opacity = 1;
            } else {
              that.$refs.detailTop2.style.visibility = "visible";
              that.$refs.detailTop1.style.visibility = "visible";
              that.$refs.detailTop2.style.opacity = 0;
              that.$refs.detailTop1.style.opacity = 1;
            }
          }
        }
      },
      swiperOption: {
        autoHeight: false, //enable auto height
        spaceBetween: 0,
        speed: 500,
        autoplay: {
          delay: 3000, //1秒切换一次
          clickable: true,
          disableOnInteraction: false
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
          slideChange: function() {
            that.proImgIndex = this.realIndex;
          }
        }
      },
      introductionIndex: 1,
      showPop: false,
      selectedText: "",
      itemSelected: 1,
      selectedNum: 1,
      stepNum: 1,
      maxNum: 1,
      minNum: 1,
      stockNum: 1,
      detailData: {},
      detailShow: false,
      popFlag: "addToCart",
      detailComment: null,
      commentListShow: false,
      selectedAddress: "",
      showSelect: false,
      regionText: "请选择配送区域",
      region: [],
      initData: {
        title: "请选择地区"
      },
      recommendListShow: false,
      showActivity: false,
      myFeatures: [],
      introduction1: "",
      introduction2: "",
      introduction3: "",
      isCollect: false,
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
      lastPath: "",
      featureRefresh: true,
      canSale: true,
      //匹配出来的address
      matchAddress: null,
      // 活动剩余库存
      mktStockNum: -1,
      // 活动id 秒杀的时候才有
      activityId: "",
      // 等级为2的单品活动
      singleActivities_2: [],
      curSingleActivity: null,
      showSelectDeliveryType: false,
      videoUrl: "",
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "1:1", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: ""
          }
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true //全屏按钮
        }
      },
      arrLen: 0,
      showActivityTime: "0",
      directWeChatShare: "0",
      cardType: "", // 区分充值卡 计次卡 551充值卡 552 计次卡(只有计次卡不需要推荐和领券，底部只有立即购买按钮)
      easyCardId: "", // 从易捷卡页面过来的才有easyCardI
      recommendCommodity: false, // 从推荐购物传过来的只有 推荐购物有
      jfhqList: [],
      tgfxData: null,
      lastRequestId: "",
      jdSilmilarSkus: [],
      cartNum: 0,
      showSharePopup: false,
      tagList: [],
      categoryList: [],
      scrollTop: 0,
      detailScrollHeight: 0, //第二页滚动总高度
      detailClientHeight: 0, //屏幕高度
      detailScrollTop: 0, //第二页滚动高度
      detailView: 1, //默认第一页，只要进了第二页就永远是第二页，不会再变回第一页
      reachBottom: false, //是否到达底部,
      viewpoint_radio: 0
    };
  },
  computed: {
    ...mapState(["recommendationSku"]),
    getCountdownTime: function() {
      let nowT = this.$store.state.severTime.currentTime;
      // let startT = this.$util.getDateFromString(this.detailData.mktStartDate)
      // let endT = this.$util.getDateFromString(this.detailData.mktEndDate)
      let startT;
      let endT;
      if (this.detailData.supportPreSale == 1) {
        startT = this.$util.getDateFromString(this.detailData.preSaleBeginTime);
        endT = this.$util.getDateFromString(this.detailData.preSaleEndTime);
      } else {
        startT = this.$util.getDateFromString(this.detailData.mktStartDate);
        endT = this.$util.getDateFromString(this.detailData.mktEndDate);
      }
      if (nowT < startT) {
        return startT;
      }
      if (nowT < endT) {
        return endT;
      }
      return endT;
    }
  },
  mounted() {
    this.easyCardId = this.$route.query.easyCardId;
    this.recommendCommodity = this.$route.query.recommendCommodity;
    this.cardType = this.$route.query.cardType;
    window.addEventListener("scroll", this.handleScroll, true); // 监听（绑定）滚轮滚动事件
    console.log("商品详情参数", this.$route.query);
    console.log("商品详情路径", window.location);
  },
  watch: {
    introduction1(val) {
      console.log("---------introduction1---->", val);
    },
    "$store.state.mall2.zitiAddress.id": function(val, oldVal) {
      if (this.deliveryType == 1) {
        this.getDatas();
      }
    },
    proView: function(newVal, oldVal) {
      if (newVal == 2) {
        this.detailView = 2;
        this.$nextTick(() => {
          document.getElementsByClassName("scroll-container")[1].scrollTop = 1;
          this.detailScrollHeight = document.getElementsByClassName(
            "scroll-container"
          )[1].scrollHeight;
          this.detailClientHeight = document.getElementsByClassName(
            "scroll-container"
          )[1].clientHeight;
        });
      }
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
      this.$nextTick(() => {
        if (this.proView == 2) {
          this.detailScrollTop = e.target.scrollTop;
          if (
            this.detailScrollHeight - this.detailScrollTop ==
            this.detailClientHeight
          ) {
            this.reachBottom = true;
            console.log("到底了");
          }
        }

        let viewpoint_radio = 0;
        if (this.detailView == 1) {
          viewpoint_radio = 0;
        } else {
          if (this.reachBottom) {
            viewpoint_radio = 1;
          } else {
            if (this.detailScrollTop == 1 || this.detailScrollTop == 0) {
              viewpoint_radio =
                (this.detailClientHeight /
                  (this.detailScrollHeight - this.detailScrollTop)) *
                  0.5 +
                0.5;
            } else {
              viewpoint_radio =
                (this.detailScrollTop /
                  (this.detailScrollHeight - this.detailClientHeight)) *
                  0.5 +
                0.5;
            }
          }
        }
        this.viewpoint_radio = this.$util.toDecimal2(viewpoint_radio);
        console.log(
          "viewpoint_radio",
          this.viewpoint_radio,
          this.detailScrollHeight,
          this.detailClientHeight
        );
      });
    },
    shareSensors(share_type) {
      this.$sensors.track("goods_share", {
        goods_id: this.skuId,
        goods_name: this.detailData.skuName,
        tag: this.tagList,
        goods_cls1: this.categoryList[0],
        goods_cls2: this.categoryList[1],
        goods_cls3: this.categoryList[2],
        org_price: this.detailData.activityPrice,
        price: this.detailData.salePrice,
        goods_quantity: this.selectedNum,
        store_id: this.detailData.storeOuCode,
        store_name: this.detailData.storeOuName,
        merchant_id: this.detailData.ouCode,
        merchant_name: this.detailData.ouName,
        viewpoint_radio: this.viewpoint_radio,
        share_type: share_type
      });
    },
    onShare() {
      console.log(
        this.detailData.picUrls[0] +
          "?x-oss-process=image/format,jpg/quality,Q_25"
      );
      if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
        this.showShare();
      } else {
        this.showSharePopup = true;
      }
    },
    shareWechatFriends() {
      // let routeQuery = this.$route.query;
      // console.log(routeQuery);
      // let queryStr = "";
      // for(let key in routeQuery){
      //   queryStr+=`${key}=${routeQuery[key]}&`
      // }
      // queryStr=queryStr.substr(0,queryStr.length-1);
      appShare
        .shareForOpenWXMiniProgram({
          // userName: "gh_2a45a4d38d81",
          userName: "gh_28d617271c97",
          path: `pages/common/home/index?redirect=${encodeURIComponent(
            `/app-vue/app/index.html#/mall2/detail/1000?skuId=${this.skuId}`
          )}`,
          title: this.getSkuNameStr(this.detailData),
          desc: this.getSkuNameStr(this.detailData),
          link: window.location.href,
          imageurl:
            this.detailData.picUrls[0] +
            "?x-oss-process=image/format,jpg/quality,Q_10",
          // miniProgramType: process.env.NODE_ENV == "production" ? 2 : 0,
          miniProgramType:
            this.$store.state.environment == "production" ? 0 : 2,
          __event__: res => {}
        })
        .then(res => {
          // document.getElementById("debug_text").innerText = res;
          // alert("shareThenRes----------", JSON.stringify(res));
        });
      this.showSharePopup = false;
      this.shareSensors("微信");
    },
    shareImg() {
      this.showShare();
    },
    shareLink() {
      this.$router.push({
        path: "/mall2/shareTextLink",
        query: {
          price: this.detailData.activityPrice,
          link: window.location.href,
          goodsTitle: this.getSkuNameStr(this.detailData),
          goods_share_data: JSON.stringify({
            goods_id: this.skuId,
            goods_name: this.detailData.skuName,
            tag: this.tagList,
            goods_cls1: this.categoryList[0],
            goods_cls2: this.categoryList[1],
            goods_cls3: this.categoryList[2],
            org_price: this.detailData.activityPrice,
            price: this.detailData.salePrice,
            goods_quantity: this.selectedNum,
            store_id: this.detailData.storeOuCode,
            store_name: this.detailData.storeOuName,
            merchant_id: this.detailData.ouCode,
            merchant_name: this.detailData.ouName,
            viewpoint_radio: this.viewpoint_radio,
            share_type: "文字"
          })
        }
      });
    },
    // 唤起客服
    handleCustomer: function() {
      ysf("config", {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email: "",
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function() {
          // 成功回调
          ysf("open");
        },
        error: function() {
          // 错误回调
          // handle error
        }
      });
    },
    getJdSilmilarSku: function() {
      return;
      if (this.lastRequestId == this.detailData.id) {
        return;
      }
      this.lastRequestId = this.detailData.id;
      this.jdSilmilarSkus = [];
      this.$Loading.open();
      let url = "/app/json/product/getJdSilmilarSku";
      let params = {
        id: this.detailData.id
      };
      this.$http.post(url, params).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.jdSilmilarSkus = data.data;
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("获取数据失败");
        }
      );
    },
    // player is ready
    playerReadied(player) {
      // you can use it to do something...
      // player.[methods]
    },
    serversEvent: function() {
      let serviceInfo = this.detailData.serviceInfo;
      if (serviceInfo != "") {
        let arr = JSON.parse(serviceInfo);
        if (!arr || arr.length == 0) {
          return;
        }
        let ids = [];
        for (let i = 0; i < arr.length; i++) {
          ids.push(arr[i].id);
        }
        let url =
          "/app/json/app_pro_sku_service_detail/getServiceDetailListByIds";
        let params = {
          inIds: JSON.stringify(ids)
        };
        this.$Loading.open();
        this.$http.post(url, params).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let arr = data.data;
              if (arr.length > 0) {
                ServersDetail.open({
                  initData: {
                    list: arr
                  }
                });
              } else {
                this.$Toast("暂无服务说明！");
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      }
    },
    ...mapMutations(["setRecommendationSku"]),
    getFxUnit: function(returnType) {
      if (returnType == 3) {
        return "积分";
      } else {
        return "元";
      }
    },
    isPayTime: function() {
      if (this.detailData.productType == 6) {
        let nowDate = new Date();
        let nt = nowDate.getTime();

        let db = this.detailData.dailySaleBegin;
        let de = this.detailData.dailySaleEnd;
        let dba = db.split(":");
        let db_h = parseInt(dba[0]);
        let db_m = parseInt(dba[1]);
        nowDate.setHours(db_h, db_m, 0, 0);
        let dbt = nowDate.getTime();
        let dea = de.split(":");
        let de_h = parseInt(dea[0]);
        let de_m = parseInt(dea[1]);
        nowDate.setHours(de_h, de_m, 0, 0);
        let det = nowDate.getTime();

        if (nt >= dbt && nt < det) {
          return true;
        }
        return false;
      }
      return true;
    },
    getSkuNameStr: function(item) {
      let skuName = item.showTitle;
      if (item.interfaceType == "2") {
        skuName =
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this
            .$store.state.globalConfig.interface_type_name_1 ||
            "京东"}</span>` + skuName;
      } else if (item.interfaceType == "1") {
        skuName =
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this
            .$store.state.globalConfig.interface_type_name_2 ||
            "有路"}</span>` + skuName;
      }
      return skuName;
    },
    showShare() {
      // 打开弹框
      if (Object.keys(this.detailData).length > 0) {
        ShareImage.show({
          proData: this.detailData || {}
        });
        this.shareSensors("图片");
      }
    },
    getPackageStartTime: function() {
      let nowT = this.$store.state.severTime.currentTime;
      let startT = this.$util.getDateFromString(
        this.detailData.packageStartTime
      );
      if (nowT < startT) {
        return startT;
      }
      return 0;
    },
    getTimeTitle: function() {
      let nowT = this.$store.state.severTime.currentTime;
      let startT;
      let endT;
      if (this.detailData.supportPreSale == 1) {
        startT = this.$util.getDateFromString(this.detailData.preSaleBeginTime);
        endT = this.$util.getDateFromString(this.detailData.preSaleEndTime);
      } else {
        startT = this.$util.getDateFromString(this.detailData.mktStartDate);
        endT = this.$util.getDateFromString(this.detailData.mktEndDate);
      }
      if (nowT < startT) {
        return "距离开始还剩:";
      }
      if (nowT < endT) {
        return "距离结束还剩:";
      }
      return "活动已结束";
    },
    getActivityStr: function(activity) {
      for (let i = 0; i < this.$store.state.globalConfig.acctList.length; i++) {
        let accitem = this.$store.state.globalConfig.acctList[i];
        if (activity[accitem.listKey] && activity[accitem.listKey] != "") {
          return activity[accitem.listKey] + accitem.displayName + "+";
        }
      }
    },
    changeDelivery: function(type) {
      this.showSelectDeliveryType = false;
      this.$store.state.mall2.staticDeliverType = type;
      this.$bridgefunc.vuexStorage();
      this.deliveryType = this.$store.state.mall2.staticDeliverType;
      //微信类型
      if (this.$store.state.webtype == 2) {
        this.getWechatDatas();
      } else {
        this.getDatas();
      }
    },
    selectDeliveryType: function() {
      this.showSelectDeliveryType = true;
    },
    removeSingleActivity: function() {
      this.activityId = "-2";
      this._getProductDetail();
    },
    reviseSingleActivity: function() {
      let listData = [];

      for (let i = 0; i < this.singleActivities_2.length; i++) {
        let item = this.singleActivities_2[i];
        listData.push({
          mktActivityId: item.activityId,
          title:
            item.activityTitle +
            " " +
            this.getActivityPrice(item) +
            this.$util.toDecimal2(item.activityPrice),
          checked: item.activityId == this.curSingleActivity.activityId
        });
      }
      listData.push({
        mktActivityId: "-2",
        title: "不参加兑换活动",
        checked: false
      });
      SalesPro.open({
        listData: listData,
        sureFunc: item1 => {
          this.activityId = item1.mktActivityId;
          this._getProductDetail();
        }
      });
    },
    //获取虚拟价格和单位
    getActivityPrice: function(item) {
      for (let i = 0; i < this.$store.state.globalConfig.acctList.length; i++) {
        let tempItem = this.$store.state.globalConfig.acctList[i];
        let tempPoints = item[tempItem.listKey];
        if (tempPoints && tempPoints != "") {
          return tempPoints + tempItem.displayName;
        }
      }
    },
    joinSingleActivity: function(saitem) {
      this.activityId = saitem.activityId;
      this._getProductDetail();
    },
    noticeIsShow: function() {
      if (
        this.detailData.noticeActivityDetail &&
        this.detailData.noticeActivityDetail != "" &&
        this.detailData.noticeActivityDetail.activityPrice &&
        this.detailData.noticeActivityDetail.activityPrice != ""
      ) {
        let flag =
          new Date(
            this.detailData.noticeActivityDetail.startTime.replace(/\-/g, "/")
          ).getTime() >
          this.$store.state.severTime.currentTime * 1000;
        return flag;
      }
      return false;
    },
    getNoticeTime: function() {
      let time = this.detailData.noticeActivityDetail.startTime.replace(
        /\-/g,
        "/"
      );
      var oDate = new Date(time),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMinute = oDate.getMinutes(),
        oTime =
          this.$util.getzf(oMonth) +
          "月" +
          this.$util.getzf(oDay) +
          "日" +
          this.$util.getzf(oHour) +
          ":" +
          this.$util.getzf(oMinute); //最后拼接时间
      return oTime;
    },
    getNoticePrice: function() {
      let price = this.detailData.noticeActivityDetail.activityPrice;
      let activityType = this.detailData.noticeActivityDetail.activityType;
      return activityType + "价￥" + this.$util.toDecimal2(price);
    },
    getScrollTop: function() {
      let top = "top: " + this.$store.state.barHeight + "px;";
      let bottom = `bottom: ${this.recommendCommodity ? 0 : 50}px`;
      return `${top}${bottom}`;
    },
    canNotSaleEvent: function() {
      this.$Toast("当前区域不可售");
    },
    noStockEvent: function() {
      // if (this.detailData.mktActivityPriceLevel == 3) {
      //   this.$Toast('秒杀商品已抢光！')
      //   return;
      // }
      this.$Toast("当前地区没有库存！");
    },
    descartesInList: function(descartes, kyList) {
      let featureList = this.detailData.featureList;
      if (descartes.length == featureList.length) {
        if (kyList[descartes]) {
          return kyList[descartes];
        } else {
          return false;
        }
      }

      return true;

      // let ican = false
      // for (let i = 0; i < kyList.length; i++) {
      //   let kyStr = kyList[i]
      //   let arr = kyStr.split(',')
      //   if (descartes.length == arr.length) {
      //     for (let j = 0; j < arr.length; j++) {
      //       let s1 = descartes[j]
      //       if (s1 == '*') {
      //         ican = true
      //         continue;
      //       }
      //       let s2 = arr[j]
      //       if (s1 == s2) {
      //         ican = true
      //       } else {
      //         ican = false
      //         break
      //       }
      //     }
      //     if (ican) {
      //       return false
      //     }
      //   }
      // }
      // return true
    },
    getCanSelectWith: function(fidx, subFeature) {
      if (subFeature.selected) {
        return false;
      }
      let kyList = this.detailData.kyList;
      let featureList = this.detailData.featureList;
      let descartes = [];
      for (let i = 0; i < featureList.length; i++) {
        if (i == fidx) {
          descartes.push(subFeature.featureValueId);
          continue;
        }
        let item = featureList[i];
        let hasSelected = false;
        for (let j = 0; j < item.featureValueList.length; j++) {
          let subItem = item.featureValueList[j];
          if (subItem.selected) {
            hasSelected = true;
            descartes.push(subItem.featureValueId);
            break;
          }
        }
        if (!hasSelected) {
          descartes.push("*");
        }
      }
      return this.descartesInList(descartes, kyList);
    },
    productPickageEvent: function(product) {
      // this.$Toast('开发中')
      let path = "/mall2/detail/" + this.$util.getDataString();
      if (product.productType == 2) {
        path = "/mall2/ticketdetail";
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
      });
    },
    getSelectedTabStyle: function(idx) {
      if (idx == this.toptab) {
        return { fontWeight: "600", fontSize: "18px" };
      } else {
      }
    },
    showBigImgsEvent: function(arr) {
      this.picUrls = arr;
      this.showPicUrls = true;
    },
    getCommentImgs: function(imgsStr) {
      if (imgsStr != "") {
        return imgsStr.split(",");
      }
      return [];
    },
    closeBigImage: function() {
      this.showBigImage = false;
      this.showPicUrls = false;
    },
    showBigImageEvent: function(index) {
      this.proImgIndex = index;
      this.showBigImage = true;
    },
    productEvent: function(product) {
      let path = "/mall2/detail/" + this.$util.getDataString();
      if (product.productType == 2) {
        path = "/mall2/ticketdetail";
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
      });
    },
    productImgAfterEnter: function(el) {
      this.showProductImg = false;
      this.showAddCartAn = true;
    },
    beforeEnter(el) {
      el.style.transform = `translate3d(0,0,0)`;
      el.children[0].style.opacity = 0;
    },
    afterEnter(el) {
      let elBottom = el.getBoundingClientRect().bottom;
      let elLeft = el.children[0].getBoundingClientRect().left;
      let gwcLeft = this.$refs.gouwuche.getBoundingClientRect().left;
      let gwcBottom = this.$refs.gouwuche.getBoundingClientRect().top;
      el.style.transform = `translate3d(0,${gwcBottom - elBottom}px,0)`;
      el.style.transition =
        "transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)";
      el.children[0].style.transform = `translate3d(${gwcLeft - elLeft}px,0,0)`;
      el.children[0].style.transition = "transform .55s linear";
      el.children[0].style.opacity = 1;

      // el.addEventListener('transitionend', () => {
      this.showAddCartAn = false;
      // })
      // el.addEventListener('webkitAnimationEnd', () => {
      //   this.showAddCartAn = false
      // })
    },
    _setDefaultPickupAddress: function(id) {
      let url = "/app/json/user_address/addDefaultAddress";
      let params1 = {
        token: this.$store.state.login.token,
        selfId: id
      };
      this.$http.post(url, params1).then(
        res => {},
        error => {}
      );
    },
    selectPickUpAddress: function() {
      if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
        return;
      }
      PickupAddress.open({
        initData: {
          selectedId: this.$store.state.mall2.zitiAddress.id,
          token: this.$store.state.login.token,
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy,
          skuIds: [this.detailData.skuId]
        },
        addressEvent: selected => {
          PickupAddress.close();
          if (selected) {
            this.$store.state.mall2.zitiAddress = selected;
            this.$bridgefunc.vuexStorage();
            // 切换自提点，刷新整个详情
            this._getProductDetail();
            this._setDefaultPickupAddress(selected.id);
          }
        },
        otherAddressEvent: () => {
          this.backLoadStock = true;
          let path = "/mall2/selfliftingsite";
          let arr = [this.detailData.skuId];
          this.$router.push({
            path: path,
            query: {
              skuIds: JSON.stringify(arr)
            }
          });
          PickupAddress.close();
        }
      });
    },
    touchend: function() {
      let mySite = this.$refs.scrollView1.scrollTop;
      let maxSize =
        this.$refs.scrollView1.scrollHeight -
        this.$refs.scrollView1.offsetHeight;
      if (mySite > maxSize + 50) {
        this.proView = 2;
      }
    },
    pageSite: function() {
      let mySite = this.$refs.scrollView1.scrollTop;
      this.pullScrollEvent(mySite);
    },
    pullScrollEvent: function(scrollTop) {
      if (this.proView == 1) {
        this.page1ScrollTop = scrollTop;
        if (scrollTop < 60) {
          let opacity = scrollTop / 60;
          if (opacity < 0.5) {
            this.$refs.detailTop2.style.visibility = "visible";
            this.$refs.detailTop1.style.visibility = "hidden";
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
        this.$refs.detailTop2.style.opacity = 0;
        this.$refs.detailTop1.style.opacity = 1;
      } else {
        this.scrollTopValue2 = scrollTop;
      }
    },
    getCommentUserStr: function(comment) {
      if (comment.userName != "") {
        return comment.userName;
      }
      let phone = comment.userPhone + "";
      if (phone.length == 11) {
        let a = phone.split("");
        a.splice(1, 9, "*********");
        return a.join("");
      }
      return "未知用户";
    },
    bottomPull: function(loaded) {
      loaded("done");
      this.proView = 2;
      this.$nextTick(this.setPicMedia); // 设置京东商品图文大小
    },
    topPull: function(loaded) {
      loaded("done");
      this.proView = 1;
    },
    toCart: function() {
      // this.$store.state.isSpecialPush = true;
      let pushData = {
        path: "/mall2/cart",
        query: {
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        }
      };
      if (
        this.detailData.supportPreSale == 1 &&
        this.$store.state.globalConfig.presaleType == 2
      ) {
        pushData = {
          path: "/mall2/presalecart"
        };
      }
      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat(pushData);
        return;
      }
      this.$router.push(pushData);
      this.$store.state.cartEntrance = "goodsDetail";
    },
    // 去店铺
    toShop: function() {
      // this.$store.state.isSpecialPush = true;
      this.$router.push({
        path: "/mall2/shop",
        query: {
          storeOuCode: this.detailData.storeOuCode,
          lastPath: this.$route.path
        }
      });
    },
    backEvent: function() {
      // if (this.$store.state.webtype == 3 && window.history.length === 1) {
      //   wx.miniProgram.reLaunch({ url: `/pages/common/home/index` });
      // }
      // detailScrollHeight:0,//第二页滚动总高度
      // detailClientHeight:0,//屏幕高度
      // detailScrollTop:0,//第二页滚动高度
      console.log("this.viewpoint_radio", this.viewpoint_radio);
      this.$sensors.track("goods_detail_quit", {
        module_source:
          this.$store.state.inToDetail == "common"
            ? "商城臻选专场"
            : this.$store.state.inToDetail == "list"
            ? "商城商品列表页"
            : "商城搜索列表",
        goods_id: this.skuId,
        goods_name: this.detailData.skuName,
        tag: this.tagList,
        goods_cls1: this.categoryList[0],
        goods_cls2: this.categoryList[1],
        goods_cls3: this.categoryList[2],
        org_price: this.detailData.activityPrice,
        price: this.detailData.salePrice,
        store_id: this.detailData.storeOuCode,
        store_name: this.detailData.storeOuName,
        merchant_id: this.detailData.ouCode,
        merchant_name: this.detailData.ouName,
        viewpoint_radio: this.viewpoint_radio
      });

      if (
        this.$store.state.webtype != "2" ||
        this.$store.state.webtype != "3"
      ) {
        if (this.backApp) {
          appNav.navigatorBack({ url: "0" }).then(res => {
            console.log(res);
          });
          return;
        }
      }
      // if (this.proView == 2) {
      //   this.proView = 1;
      //   return;
      // }
      if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
        if (window.history.length === 1) {
          this.$router.replace("/common");
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this);
      }
    },
    activityProducts: function(activity) {
      this.$store.state.showCategory = false;
      this.showActivity = false;
      let path = "/mall2/list/" + this.$util.getDataString();
      this.$router.push({
        path: path,
        query: {
          pageType: "activity",
          activity: activity.id,
          delivertype: this.deliveryType,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          lastPath: this.$route.path
        }
      });
    },
    couponProducts: function(coupon) {
      let path = "/mall2/list/" + this.$util.getDataString();
      this.$router.push({
        path: path,
        query: {
          pageType: "coupon",
          coupon: coupon.couTypeCode,
          couThresholdAmount: coupon.couThresholdAmount,
          couFaceValue: coupon.couFaceValue,
          skuId: this.detailData.skuId,
          lastPath: this.$route.path,
          storeOuCode: this.detailData.storeOuCode,
          endTime: this.$util.getDateFromString(coupon.validEndDate)
        }
      });
    },
    loadJFHQList: async function() {
      this.$Loading.open();
      let res = await this.getJFHQList();
      this.$Loading.close();
      this.jfhqList = "";
      if (res.data.status == 0) {
        this.jfhqList = res.data.data.list;
      }
    },
    getJFHQList: async function() {
      return this.$http.post("/app/json/product/getProDetailExchangeList", {
        id: this.detailData.skuId,
        brandId: this.detailData.brandId,
        storeOuCode: this.detailData.storeOuCode
      });
    },
    kyCouponEvent: function() {
      Coupon.open({
        initData: {
          type: "show",
          listData: this.detailData.proCanUseCouList
        },
        selectedCoupon: coupon => {
          Coupon.close();
        },
        getedCoupon: coupon => {},
        couponProducts: coupon => {
          this.couponProducts(coupon);
          Coupon.close();
        }
      });
    },
    couponEvent: async function() {
      if (
        this.detailData.couponInList == "" &&
        this.jfhqList == "" &&
        this.detailData.activityList.length == 0
      ) {
        this.$Toast("当前商品没有优化券和活动！");
        return;
      }

      Coupon.open({
        initData: {
          activityList: this.detailData.activityList,
          listData: this.detailData.couponInList,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          type: "receive",
          categoryId: this.detailData.categoryId,
          token: this.$store.state.login.token,
          jfhqData: this.jfhqList
        },
        selectedCoupon: coupon => {
          Coupon.close();
        },
        getedCoupon: coupon => {
          for (let i = 0; i < this.detailData.couponInList.length; i++) {
            let item = this.detailData.couponInList[i];
            if (item.couTypeCode == coupon.couTypeCode) {
              if (coupon.validEndDate == "") {
                coupon.validEndDate =
                  new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
              }
              this.detailData.couponInList.splice(i, 1, coupon);
              break;
            }
          }
        },
        couponProducts: coupon => {
          this.couponProducts(coupon);
          Coupon.close();
        },
        activityProducts: activity => {
          this.activityProducts(activity);
          Coupon.close();
        }
      });
    },
    moreRecommend: function() {
      this.recommendListShow = true;
      this.toptabEvent(4);
    },
    getServerText: function(server) {
      let days = server.days;
      if (days == 1) {
        days = "当";
      }
      if (server.key == 1) {
        return days + "天无理由换货";
      } else if (server.key == 2) {
        return days + "天无理由退货";
      } else if (server.key == 3) {
        return days + "天无理由维修";
      }
    },
    proSelectEvent: function() {
      this.getJdSilmilarSku();
      this.popFlag = "addToCart";
      this.showPop = true;
    },
    subFeatureEvent: function(subFeature, fidx) {
      let skuId = this.getCanSelectWith(fidx, subFeature);
      console.log(skuId);
      if (skuId == false) {
        // this.$Toast("当前规格组合没有商品!");
        return;
      }
      if (subFeature.selected) {
        subFeature.selected = false;
        this.featureRefresh = false;
        this.$nextTick(() => {
          this.featureRefresh = true;
        });
        return;
      }
      let feature = this.detailData.featureList[fidx];
      for (let i = 0; i < feature.featureValueList.length; i++) {
        let item = feature.featureValueList[i];
        item.selected = false;
      }
      subFeature.selected = true;
      this.generateSelectedText();
      if (this.myFeatures.length == this.detailData.featureList.length) {
        this.skuId = skuId;
        // 表示选完整了
        this._getProductDetail();
      }
    },
    numChange: function() {
      let num = this.selectedNum;
      // 如果不是整步幅，取整步幅
      num =
        parseInt((num - this.minNum) / this.stepNum) * this.stepNum +
        this.minNum;
      if (num != this.selectedNum) {
        this.selectedNum = num;
        this.$Toast("输入数量不符合步幅限制，已自动调整");
      }
      this.generateSelectedText();
    },
    generateSelectedText: function() {
      this.selectedText = "";
      this.myFeatures = [];
      for (let i = 0; i < this.detailData.featureList.length; i++) {
        let item = this.detailData.featureList[i];
        for (let j = 0; j < item.featureValueList.length; j++) {
          let subItem = item.featureValueList[j];
          if (subItem.selected) {
            this.selectedText += subItem.featureValue + "，";
            this.myFeatures.push(subItem.featureValueId);
            break;
          }
        }
      }
      this.selectedText +=
        this.selectedNum +
        (this.detailData.metric ? this.detailData.metric : "件");
      console.log("this.detailData.", this.detailData);
    },
    dataProcessing: function(item) {
      // 数据，尤其是价格，需要做初始化处理
      // 全局价格处理
      let dpedData = this.$mallCommon.priceFromItem(item);
      item.dpedData = dpedData;
    },
    // 获取当前库存
    _getCustomStock: function() {
      if (
        this.deliveryType == 2 &&
        (this.$store.state.mall2.selectAddress.id == "" ||
          this.$store.state.mall2.selectAddress.id == undefined) &&
        (this.$store.state.mall2.selectAddress.provinceId == "" ||
          this.$store.state.mall2.selectAddress.provinceId == undefined)
      ) {
        //配送下没有地址就不去  取库存了
        return;
      }
      if (
        this.deliveryType == 1 &&
        (this.$store.state.mall2.zitiAddress.id == "" ||
          this.$store.state.mall2.zitiAddress.id == undefined)
      ) {
        // 自提并且没有自提点id
        return;
      }
      let url = "/app/json/app_stock/querySkuStockByApp";
      let paramsData = {
        token: this.$store.state.login.token,
        productList: [{ skuId: this.detailData.skuId }],
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
      this.$Loading.open();
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.canSale = true;
            let productList = data.data.productList;
            if (productList && productList.length > 0) {
              this.stockNum = productList[0].stockCurrentNumber;
              if (this.mktStockNum != -1) {
                // 活动库存，小于当前库存，取活动库存当库存
                this.stockNum =
                  this.mktStockNum < this.stockNum
                    ? this.mktStockNum
                    : this.stockNum;
              }
              this.maxNum =
                this.detailData.saleNumMax != ""
                  ? this.detailData.saleNumMax
                  : -1;
              if (
                this.detailData.discountGoodsCntPerOrder != undefined &&
                this.detailData.discountGoodsCntPerOrder != ""
              ) {
                if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                  this.maxNum = this.detailData.discountGoodsCntPerOrder;
                }
              }
              this.maxNum =
                this.maxNum > this.stockNum ? this.stockNum : this.maxNum;
            }
          } else {
            if (data.errorCode == 2201) {
              // 不在可售区域
              this.canSale = false;
            } else {
              this.$Toast(data.info);
            }
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    selectArea: function() {
      // if (this.$store.state.mall2.selectAddress.id > 0) {
      Address.open({
        initData: {
          selectedId: this.$store.state.mall2.selectAddress.id,
          token: this.$store.state.login.token
        },
        addressEvent: (selected, saddress) => {
          this.matchAddress = saddress;
          this.$store.state.mall2.selectAddress = selected;
          this.$bridgefunc.vuexStorage();
          this._getCustomStock();
          Address.close();
        }
      });
      // } else {
      //   //选择省市区
      //   this.showSelect = !this.showSelect;
      //   this._getRegionData(0);
      // }
    },
    selectedItemsEvent: function(selectedValue) {
      let item = selectedValue.item;
      this.selectedItems = selectedValue.selecteds;
      if (this.selectedItems.length == 4) {
        this.showSelect = false;
        this.region = this.selectedItems;
        this.getRegionText();
        return;
      }
      this._getRegionData(item.id);
    },
    regionCloseEvent: function() {
      this.showSelect = false;
    },
    _getRegionData: function(parentId) {
      this.$Loading.open();
      let url = "/app/json/area/loadAreaList";
      let params1 = {
        token: this.$store.state.login.token,
        parentId: parentId
      };
      this.$http.post(url, params1).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length > 0) {
              this.$nextTick(function() {
                this.$refs.regionselect.pushCustomOptions(arr);
              });
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("获取数据失败");
        }
      );
    },
    getRegionText: function() {
      let str = "";
      let address = {
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        countryId: "",
        countryName: "",
        townId: "",
        townName: ""
      };
      address.id = "-1";
      for (let i = 0; i < this.region.length; i++) {
        let item = this.region[i];
        str += item.name;
        if (i == 0) {
          address.provinceId = item.id;
          address.provinceName = item.name;
        } else if (i == 1) {
          address.cityId = item.id;
          address.cityName = item.name;
        } else if (i == 2) {
          address.countryId = item.id;
          address.countryName = item.name;
        } else if (i == 3) {
          address.townId = item.id;
          address.townName = item.name;
        }
      }
      address.addressFull =
        address.provinceName +
        address.cityName +
        address.countryName +
        address.townName;
      this.$store.state.mall2.selectAddress = address;
      this.$bridgefunc.vuexStorage();
      this._getCustomStock();
      this.regionText = str;
      this.$refs.regionselect.reset(null);
    },
    allCommentEvent: function() {
      this.commentListShow = true;
      this.toptabEvent(3);
    },
    toptabEvent: function(idx) {
      this.toptab = idx;
      if (this.toptab == 3) {
        this.load3 = true;
      } else if (this.toptab == 4) {
        this.load4 = true;
      }
      this.$refs.mySwiper.swiper.slideTo(idx - 1);
      // this.commentListShow = false;
      // this.recommendListShow = false;
      // if (idx == 3) {
      //   this.commentListShow = true;
      // } else if (idx == 4) {
      //   this.recommendListShow = true;
      // }
    },
    introductionSelected: function(idx) {
      this.introductionIndex = idx;
      this.$nextTick(this.setPicMedia); // 设置京东商品图文大小
    },
    addToCart: function() {
      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat();
        return;
      }
      this.getJdSilmilarSku();
      this.popFlag = "addToCart";
      this.showPop = true;
      // this._addToCart();
    },
    songliEvent: function() {
      if (
        this.detailData.mktActivityPriceLevel == 3 &&
        this.detailData.soldNum >= 100
      ) {
        this.$Toast("该商品已抢光，将会使用原价购买！");
      }

      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat();
        return;
      }
      if (this.deliveryType == 2) {
        // 配送 普通商品和商品包
        if (
          this.detailData.productType == "1" ||
          this.detailData.productType == "4"
        ) {
          if (this.$store.state.mall2.selectAddress.id == "") {
            this.$Toast("请选择配送区域");
            return;
          } else if (
            !this.$store.state.mall2.selectAddress.provinceId ||
            !this.$store.state.mall2.selectAddress.cityId ||
            !this.$store.state.mall2.selectAddress.countryId
          ) {
            this.$Toast("请选择配送区域");
            return;
          }
        }
      } else {
        // 自提
        if (this.$store.state.mall2.zitiAddress.id == "") {
          this.$Toast("请选择自提点");
          return;
        }
      }
      this.getJdSilmilarSku();
      this.popFlag = "songli";
      this.showPop = true;
    },
    preSaleEvent: function() {
      if (
        this.detailData.mktActivityPriceLevel == 3 &&
        this.detailData.soldNum >= 100
      ) {
        this.$Toast("该商品已抢光，将会使用原价购买！");
      }
      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat();
        return;
      }
      if (this.deliveryType == 2) {
        // 配送 普通商品和商品包
        if (
          this.detailData.productType == "1" ||
          this.detailData.productType == "4"
        ) {
          if (this.$store.state.mall2.selectAddress.id == "") {
            this.$Toast("请选择配送区域");
            return;
          } else if (
            !this.$store.state.mall2.selectAddress.provinceId ||
            !this.$store.state.mall2.selectAddress.cityId ||
            !this.$store.state.mall2.selectAddress.countryId
          ) {
            this.$Toast("请选择配送区域");
            return;
          }
        }
      } else {
        // 自提
        if (this.$store.state.mall2.zitiAddress.id == "") {
          this.$Toast("请选择自提点");
          return;
        }
      }
      if (this.productType == 511 || this.productType == 510) {
        // 卡密商品订单界面
        this.$router.push({
          path: "/movie-ticket-order",
          query: {
            skuId: this.detailData.skuId,
            activityId: this.activityId
          }
        });
      } else {
        this.getJdSilmilarSku();
        this.popFlag = "preSale";
        this.showPop = true;
      }
    },
    buyNowEvent: function() {
      if (this.canSale == false) {
        this.$Toast("该商品在该地区暂不支持购买！");
        return;
      } else if (this.detailData.status == 0) {
        this.$Toast("该商品已下架！");
        return;
      }

      if (
        this.detailData.mktActivityPriceLevel == 3 &&
        this.detailData.soldNum >= 100
      ) {
        this.$Toast("该商品已抢光，将会使用原价购买！");
      }

      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat();
        return;
      }
      if (this.deliveryType == 2) {
        // 配送 普通商品和商品包
        if (
          this.detailData.productType == "1" ||
          this.detailData.productType == "4"
        ) {
          if (this.$store.state.mall2.selectAddress.id == "") {
            this.$Toast("请选择配送区域");
            return;
          } else if (
            !this.$store.state.mall2.selectAddress.provinceId ||
            !this.$store.state.mall2.selectAddress.cityId ||
            !this.$store.state.mall2.selectAddress.countryId
          ) {
            // this.$Toast("请选择配送区域");
            this.getJdSilmilarSku();
            this.popFlag = "buyNow";
            this.showPop = true;
            return;
          }
        }
      } else {
        // 自提
        if (this.$store.state.mall2.zitiAddress.id == "") {
          this.$Toast("请选择自提点");
          return;
        }
      }
      if (this.productType == 511 || this.productType == 510) {
        // 卡密商品订单界面
        this.$router.push({
          path: "/movie-ticket-order",
          query: {
            skuId: this.detailData.skuId,
            activityId: this.activityId
          }
        });
      } else {
        this.getJdSilmilarSku();
        this.popFlag = "buyNow";
        this.showPop = true;
        // this._buyNow()
      }
    },
    popClose: function() {
      this.showPop = false;
    },
    popSureEvent: function() {
      if (this.popFlag == "addToCart") {
        this._addToCart();
      } else if (this.popFlag == "buyNow") {
        this._buyNow();
      } else if (this.popFlag == "songli") {
        this._buyNow();
      } else if (this.popFlag == "preSale") {
        this._buyNow();
      }
      this.showPop = false;
    },
    // 请求详情信息
    _getProductDetail: function() {
      this.$Loading.open();

      let storeOuCode = this.$route.query.storeOuCode
        ? this.$route.query.storeOuCode
        : "";
      let pickupStoreOuCode = "";
      let deliverType = this.deliveryType;
      let secondDeliveType = "";
      let activityId = "";
      if (this.activityId != "") {
        activityId = this.activityId;
      }

      /**
       * 这里利用了耦合性写了一部分代码，特做此标记
       * 后台首页直接配置某个商品详情的时候，详情路径必定为 '/mall2/detail/1000'
       * 这里判断 '/mall2/detail/1000' 这个路径时，不传 deliverType ， 传 secondDeliveType ，
       * 将配送方式交给商品来处理，如果商品仅支持自提 那返回自提，如果商品只支持配送 那返回配送 ，如果都支持 ，返回 secondDeliveType 的值
       */
      if (this.$route.path == "/mall2/detail/1000") {
        if (this.$route.query.shareDeliveryType) {
          deliverType = this.deliveryType;
          secondDeliveType = "";
        } else if (!this.detailData.deliveryType) {
          deliverType = "";
          secondDeliveType = this.deliveryType;
        }
      }

      if (deliverType == 1 || deliverType == "") {
        pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode
          ? this.$store.state.mall2.zitiAddress.storeCode
          : this.$route.query.storeOuCode
          ? this.$route.query.storeOuCode
          : "1";
      }

      let url = "/appcontent/js/product/productDetail.js";
      let funcName = "productDetail_" + this.skuId;
      let args = dataMergeInterceptor.getRequestArgs() || [];
      args.push({ skuId: this.skuId });
      args.push({ storeOuCode: storeOuCode });
      args.push({ pickupStoreOuCode: pickupStoreOuCode });
      args.push({ deliverType: deliverType });
      args.push({ secondDeliveType: secondDeliveType });
      args.push({ activityId: activityId });

      staticDataRequest.request(url, funcName, args).then(data => {
        this.$Loading.close();
        if (data.status == 0) {
          this.tgfxData = null;
          this.detailData = data.data;
          // //过期的优惠券去掉
          // if(this.detailData.couponInList.length>0){
          //   this.detailData.couponInList.forEach((value,index)=>{
          //     if(new Date()-new Date(value.validEndDate.replace(/-/g, '/'))>0){
          //
          //     }else{
          //       this.couFlag.push(value)
          //     }
          //   })
          // }
          let serviceInfo = this.detailData.serviceInfo;
          if (serviceInfo) {
            this.detailData.serviceInfoJson = JSON.parse(serviceInfo);
          } else {
            this.detailData.serviceInfoJson = [];
          }

          this.$actionStatistics.detailAction(
            "120000",
            JSON.stringify(args),
            this.detailData.skuId
          );

          // this.loadJFHQList()
          if (this.detailData.remainNum === 0) {
            this.$Toast("活动商品库存已售空，需原价购买！");
          }
          let skuId = this.detailData.skuId;
          // 弥补后台bug
          if (
            this.detailData.orginDeliveryType == "1" ||
            this.detailData.orginDeliveryType == "2"
          ) {
            this.detailData.deliveryType = this.detailData.orginDeliveryType;
          }
          let deliveryType = this.detailData.deliveryType;
          this.deliveryType = deliveryType;
          if (deliveryType == "1" || deliveryType == "2") {
            this.$store.state.mall2.staticDeliverType = deliveryType;
          }
          if (deliveryType == 1) {
            InitialLoadPickupAny.checkIsInitialLoad(address => {
              if (address) {
                this._getProductDetail();
              }
            });
          }
          if (skuId && deliveryType) {
            this.$mallCommon.pushBrowsingHistory(skuId, deliveryType);
          }
          if (this.selectedNum < this.detailData.saleNumBegin) {
            this.selectedNum =
              this.detailData.saleNumBegin != ""
                ? this.detailData.saleNumBegin
                : 1;
          }
          this.stepNum =
            this.detailData.saleNumStep != "" ? this.detailData.saleNumStep : 1;
          this.minNum =
            this.detailData.saleNumBegin != ""
              ? this.detailData.saleNumBegin
              : 1;
          this.maxNum =
            this.detailData.saleNumMax != "" ? this.detailData.saleNumMax : -1;
          if (
            this.detailData.discountGoodsCntPerOrder != undefined &&
            this.detailData.discountGoodsCntPerOrder != ""
          ) {
            if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
              this.maxNum = this.detailData.discountGoodsCntPerOrder;
            }
          }
          this.mktStockNum =
            this.detailData.mktStockNum != ""
              ? this.detailData.mktStockNum
              : -1;
          for (let i = 0; i < this.detailData.featureList.length; i++) {
            let item = this.detailData.featureList[i];
            for (let j = 0; j < item.featureValueList.length; j++) {
              let subItem = item.featureValueList[j];
              for (
                let k = 0;
                k < this.detailData.myFeatureValueList.length;
                k++
              ) {
                let selectedItem = this.detailData.myFeatureValueList[k];
                if (subItem.featureValueId == selectedItem.featureValueId) {
                  subItem.selected = true;
                  break;
                }
              }
            }
          }
          this.generateSelectedText();
          // 处理单品活动
          this.singleActivities_2 = [];
          this.curSingleActivity = null;
          let cActivity = this.detailData.activityDetail;
          if (
            cActivity &&
            (cActivity.activityPriceLevel == 2 ||
              cActivity.activityPriceLevel === 0)
          ) {
            this.singleActivities_2.push(cActivity);
            this.curSingleActivity = cActivity;
          }
          let skuAList = this.detailData.skuActivityList;
          for (let i = 0; i < skuAList.length; i++) {
            let saitem = skuAList[i];
            if (saitem.activityId == cActivity.activityId) {
              continue;
            }
            if (
              saitem.activityPriceLevel == 2 ||
              saitem.activityPriceLevel === 0
            ) {
              this.singleActivities_2.push(saitem);
            }
          }
          // 全局价格处理
          let dpedData = this.$mallCommon.priceFromItem(this.detailData);
          this.detailData.dpedData = dpedData;
          this.introduction1 = this.detailData.proSkuMediaModel.mobileDetail.replace(
            /\<title\>.*\<\/title\>/,
            ""
          );
          // 这里是临时匹配某些京东商品详情，去掉写死的宽高样式
          this.introduction1 = this.$util.removeWidthAndHeight(
            this.introduction1
          );

          this.introduction2 = this.detailData.proSkuMediaModel.mobileParam;
          this.introduction3 = this.detailData.afterHelp;
          this.id = this.detailData.id;
          if (
            this.skuId != this.detailData.skuId ||
            this.detailComment == null
          ) {
            this.skuId = this.detailData.skuId;
            this.load3 = false;
            this.detailComment = this.detailData.proSkuEvaluate;
            // this._getDetailComment(this.skuId)
          }
          this.detailShow = true;
          this.setWxShareArgs();
          // 视频
          this.arrLen = this.detailData.picUrls.length;
          this.playerOptions.poster =
            this.detailData.proSkuMediaModel.mobilePicUrl || "";
          let vurl = this.detailData.proSkuMediaModel.videoUrl;
          if (vurl && vurl != undefined && vurl != "" && vurl != " ") {
            this.arrLen++;
            this.videoUrl = vurl;
            this.playerOptions.sources[0].src = vurl;
            this.swiperOption.autoplay = false;
            this.swiperOption.loop = false;
            this.proImgIndex = 0;
          }
          this._getProductDetailDynamic();
          // this._getCustomStock();
          // this._getCollectState();
          // this.$userCenter._getCartCount();

          // 只有活动级别为2的活动才，参与孙哥的接口，其他的都需要传空
          if (
            this.detailData.mktActivityPriceLevel == "2" ||
            this.detailData.mktActivityPriceLevel === 0
          ) {
            this.activityId = this.detailData.activityId;
          } else {
            this.activityId = "";
          }

          if (this.detailData.mktActivityPriceLevel === 0) {
            this.getTgfxDetail();
          }

          if (
            this.detailData.supportPreSale == 1 &&
            this.$store.state.globalConfig.presaleType == 2
          ) {
            this.cartNum = cartEvent.getCartNum();
          }

          this.detailData.activityList.forEach(e => {
            this.tagList.push(e.title);
          });
          this.categoryList = this.detailData.categoryName.split("_");
          console.log("category", this.detailData.categoryName, this.tagList);
          this.$sensors.track("goods_detail_view", {
            module_source:
              this.$store.state.inToDetail == "common"
                ? "商城臻选专场"
                : this.$store.state.inToDetail == "list"
                ? "商城商品列表页"
                : "商城搜索列表",
            goods_id: this.skuId,
            goods_name: this.detailData.skuName,
            tag: this.tagList,
            goods_cls1: this.categoryList[0],
            goods_cls2: this.categoryList[1],
            goods_cls3: this.categoryList[2],
            org_price: this.detailData.activityPrice,
            price: this.detailData.salePrice,
            store_id: this.detailData.storeOuCode,
            store_name: this.detailData.storeOuName,
            merchant_id: this.detailData.ouCode,
            merchant_name: this.detailData.ouName
          });
        } else {
          this.$Toast(data.info);
        }
      });
    },
    /**
     * 获取详情动态数据
     * @private
     */
    _getProductDetailDynamic: function() {
      let url = "/app/json/product/getProductDetailDynamic";
      let paramsData = {
        skuId: this.skuId,
        storeOuCode: this.detailData.storeOuCode,
        areaAddress: {
          province: this.$store.state.mall2.selectAddress.provinceId,
          city: this.$store.state.mall2.selectAddress.cityId,
          area: this.$store.state.mall2.selectAddress.countryId,
          town: this.$store.state.mall2.selectAddress.townId
        },
        deliverType: this.deliveryType,
        referrerCode: this.$route.query.referrerCode
          ? this.$route.query.referrerCode
          : ""
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            // 购物车数量
            this.$store.state.mall2.cartNum = data.data.cartCount;
            // 是否收藏
            this.isCollect = data.data.isFavorites;
            // this.$nextTick(() => {
            //   this.collectName = "collectName";
            // });
            // 库存
            this.stockNum =
              data.data.skuStock.stockCurrentNumber > 0
                ? data.data.skuStock.stockCurrentNumber
                : 0;
            if (this.mktStockNum != -1) {
              // 活动库存，小于当前库存，取活动库存当库存
              this.stockNum =
                this.mktStockNum < this.stockNum
                  ? this.mktStockNum
                  : this.stockNum;
            }
            this.maxNum =
              this.detailData.saleNumMax != ""
                ? this.detailData.saleNumMax
                : -1;
            if (
              this.detailData.discountGoodsCntPerOrder != undefined &&
              this.detailData.discountGoodsCntPerOrder != ""
            ) {
              if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                this.maxNum = this.detailData.discountGoodsCntPerOrder;
              }
            }
            this.maxNum =
              this.maxNum > this.stockNum ? this.stockNum : this.maxNum;
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Toast("请求数据失败！");
        }
      );
    },
    // 获取详情的评价
    _getDetailComment: function(skuId) {
      // evaluate/loadSkuDetailTwoEvaluate
      let url = "/app/json/evaluate/loadSkuDetailTwoEvaluate";
      let paramsData = {
        token: this.$store.state.login.token,
        skuId: skuId,
        rows: 2,
        page: 1
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            this.detailComment = data.data;
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Toast("请求数据失败！");
        }
      );
    },
    // 添加商品到购物车
    _addToCart: function() {
      if (
        this.detailData.supportPreSale == 1 &&
        this.$store.state.globalConfig.presaleType == 2
      ) {
        cartEvent.addCart([
          {
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: this.activityId
          }
        ]);
        this.cartNum = cartEvent.getCartNum();
        this.showPop = false;
        this.showProductImg = true;
        return;
      }

      this.$Loading.open();
      let url = "/app/json/app_cart/addCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [
          {
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: this.activityId
          }
        ],
        deliveryType: this.detailData.deliveryType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
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

            this.$sensors.track("add_to_shoppingcart", {
              goods_id: this.skuId,
              goods_name: this.detailData.skuName,
              tag: this.tagList,
              goods_cls1: this.categoryList[0],
              goods_cls2: this.categoryList[1],
              goods_cls3: this.categoryList[2],
              org_price: this.detailData.activityPrice,
              price: this.detailData.salePrice,
              goods_quantity: this.selectedNum,
              store_id: this.detailData.storeOuCode,
              store_name: this.detailData.storeOuName,
              merchant_id: this.detailData.ouCode,
              merchant_name: this.detailData.ouName,
              viewpoint_radio: this.viewpoint_radio
            });
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    // 立即购买
    _buyNow: function() {
      if (this.stockNum < this.selectedNum) {
        this.$Toast("当前商品库存不足！");
        return;
      }
      this.$Loading.open();
      let url = "";
      // if (this.popFlag == 'buyNow') {
      //   url = '/app/json/fee_life_order/settle';
      // } else {
      //   url = '/app/json/app_cart/SettleCart';
      // }
      url = "/app/json/app_cart/SettleCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [
          {
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: this.activityId,
            checked: "1"
          }
        ],
        deliveryType: this.detailData.deliveryType,
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id,
        userAddressId: "",
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
        limitWalletCardNo: this.$route.query.cardNo // 易捷卡的卡号（充值卡）
      };
      if (this.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id > 0) {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
        }
      }
      if (
        this.detailData.supportPreSale == 1 &&
        this.$store.state.globalConfig.presaleType == 2
      ) {
        paramsData.cartType = "1";
      }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let params = {
              res: data.data,
              paramsData: paramsData,
              deliveryType: this.detailData.deliveryType,
              easyCardId: this.easyCardId,
              cardType: this.cardType, // 区分充值卡 计次卡
              cardNo: this.$route.query.cardNo, // 卡号 (提交订单页面查询易捷卡支付信息使用)
              skuCode: this.$route.query.skuCode, // 商品编码
              storeOuCode: this.$route.query.storeOuCode, // 店铺编码
              cardName: this.$route.query.cardName // 计次卡名称
            };
            let recommendPhone = this.$route.query.recommendPhone;
            if (
              recommendPhone &&
              recommendPhone != undefined &&
              recommendPhone != ""
            ) {
              params.recommendPhone = recommendPhone;
            }
            if (this.popFlag == "songli") {
              params.buyType = "songli";
            } else if (this.popFlag == "preSale") {
              params.buyType = "preSale";
            }
            if (this.detailData.productType == 8) {
              params.productType = this.detailData.productType;
              params.serveStartTime = this.detailData.serveStartTime;
              params.serveEndTime = this.detailData.serveEndTime;
            }
            if (
              !(this.$store.state.mall2.selectAddress.id > 0) &&
              this.detailData.deliveryType == 2
            ) {
              if (this.matchAddress) {
                this.$store.state.mall2.selectAddress = this.matchAddress;
                this.$bridgefunc.vuexStorage(() => {});
              } else {
                params.noMatch = true;
              }
            }
            if (
              this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) ==
              true
            ) {
              this.$MessageBox
                .confirm(
                  "部分商品不能参加活动</br>将按原价购买，是否继续？",
                  "提示",
                  { confirmButtonText: "确定" }
                )
                .then(action => {
                  this.$router.push({
                    name: "填写订单",
                    params: params
                  });
                })
                .catch(action => {});
            } else {
              this.$router.push({
                name: "填写订单",
                params: params
              });
            }

            this.$sensors.track("buy_now", {
              goods_id: this.skuId,
              goods_name: this.detailData.skuName,
              tag: this.tagList,
              goods_cls1: this.categoryList[0],
              goods_cls2: this.categoryList[1],
              goods_cls3: this.categoryList[2],
              org_price: this.detailData.activityPrice,
              price: this.detailData.salePrice,
              goods_quantity: this.selectedNum,
              store_id: this.detailData.storeOuCode,
              store_name: this.detailData.storeOuName,
              merchant_id: this.detailData.ouCode,
              merchant_name: this.detailData.ouName,
              viewpoint_radio: this.viewpoint_radio
            });
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    // 获取是否收藏
    _getCollectState: function() {
      if (this.$store.state.login.token == "") {
        return;
      }
      let url = "/app/json/user_pro_collect/checkUserHasCollectPro";
      let paramsData = {
        token: this.$store.state.login.token,
        productId: this.id
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            this.isCollect = data.data;
            // this.$nextTick(() => {
            //   this.collectName = "collectName";
            // });
          } else {
            this.$Toast(data.info);
            // this.collectName = "collectName";
          }
        },
        error => {
          this.$Toast("请求数据失败！");
        }
      );
    },
    // 添加收藏或者取消收藏
    collectEvent: function() {
      if (
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat();
        return;
      }

      let url = "/app/json/user_pro_collect/addOrCancelUserProCollect";
      let paramsData = {
        token: this.$store.state.login.token,
        id: this.id,
        skuId: this.detailData.skuId,
        deliveryType: this.detailData.deliveryType,
        storeOuCode: this.detailData.storeOuCode,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            if (this.isCollect == false) {
              this.isCollect = true;

              this.$sensors.track("add_to_favourite", {
                goods_id: this.skuId,
                goods_name: this.detailData.skuName,
                tag: this.tagList,
                goods_cls1: this.categoryList[0],
                goods_cls2: this.categoryList[1],
                goods_cls3: this.categoryList[2],
                org_price: this.detailData.activityPrice,
                price: this.detailData.salePrice,
                goods_quantity: this.selectedNum,
                store_id: this.detailData.storeOuCode,
                store_name: this.detailData.storeOuName,
                merchant_id: this.detailData.ouCode,
                merchant_name: this.detailData.ouName,
                viewpoint_radio: this.viewpoint_radio
              });
            } else {
              this.isCollect = false;
            }
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Toast("请求数据失败！");
        }
      );
    },
    sharegoods: function() {
      //分享
      let shareData = {};
      shareData = {};
      shareData.title = this.detailData.skuName;
      shareData.sharetext = this.detailData.skuName;
      shareData.imageurl = this.detailData.phMainUrl;
      shareData.detailurl =
        this.$store.state.globalConfig.wxBaseUrl +
        Config.shareUrl +
        this.$route.fullPath;
      if (shareData.detailurl.indexOf("shareDeliveryType") == -1) {
        shareData.detailurl =
          shareData.detailurl +
          "&shareDeliveryType=" +
          this.detailData.deliveryType;
      }
      if (shareData.detailurl.indexOf("storeID") == -1) {
        shareData.detailurl =
          shareData.detailurl +
          "&storeID=" +
          this.$store.state.mall2.zitiAddress.id;
      }
      // if (this.detailData.deliveryType == 1) {

      // }
      if (
        this.$store.state.login.token &&
        this.$store.state.login.token != ""
      ) {
        shareData.detailurl =
          shareData.detailurl +
          "&recommend=" +
          this.$store.state.userInfo.userId;
        shareData.detailurl =
          shareData.detailurl +
          "&recommendPhone=" +
          this.$store.state.login.phone;
      }

      this.$bridgefunc.wechatShare(shareData);
    },
    getDatas: function() {
      this._getProductDetail();
      // if (this.$store.state.login.token != '') {
      //   this._getDetailComment(this.skuId);
      // }
    },
    //这里先判断是否有地理位置  没有地理位置需要获取签名  然后获取坐标 转地理位置 存储位置
    getWechatDatas: function() {
      //1自提 2配送
      if (this.deliveryType == 1) {
        //自提地址不存在的情况 直接根据storeid 获取自提点
        if (
          this.$store.state.mall2.zitiAddress.id == undefined ||
          this.$store.state.mall2.zitiAddress.id == ""
        ) {
          this.getSysStoreById();
        } else {
          this.getDatas();
        }
      } else {
        //配送地址不存在的情况  如果有token 就去请求历史保存  没有  则去签名定位
        if (
          this.$store.state.mall2.selectAddress.id == "" ||
          this.$store.state.mall2.selectAddress.id == "undefined"
        ) {
          if (
            this.$store.state.login.token &&
            this.$store.state.login.token.length
          ) {
            this.$userCenter._getUserLocalhistory(() => {
              if (
                this.$store.state.mall2.selectAddress.id == "" ||
                this.$store.state.mall2.selectAddress.id == "undefined"
              ) {
                this.getWechatSignature();
              } else {
                this.getDatas();
              }
            });
          } else {
            this.getWechatSignature();
          }
        } else {
          this.getDatas();
        }
      }
    },
    //根据自提点的id去得到自提点
    getSysStoreById: function() {
      let url = "/app/json/user_address/getSysStoreById";
      let idStr = this.$route.query.storeID || "";
      if (idStr == "") {
        return;
      }
      let paramsData = {
        id: idStr
      };
      this.$Loading.open();
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.zitiAddress = data.data;
            // this.getDatas();
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },

    getWechatSignature: function() {
      wxfunc.getWechatSignature(isSignature => {
        //签名成功
        if (isSignature) {
          wxfunc.wxGetLocation(location => {
            //
            this.$mallCommon.addressAnalysis(res => {
              this.getDatas();
            }, location);
          });
        } else {
          this.getDatas();
        }
      });
    },
    bindWechat: function(pushData) {
      if (pushData) {
        this.$store.state.pushData.pushData = pushData;
        this.$store.state.pushData.pushType = 0;
        this.$store.state.indexData.selectedIndex = "";
        this.$bridgefunc.vuexStorage(() => {});
      }
      this.$util.wechatBind();
    },
    setWxShareArgs: function() {
      let shareData = {};
      shareData = {};
      shareData.title = this.detailData.skuName;
      shareData.sharetext = this.detailData.skuName;
      shareData.imageurl = this.detailData.phMainUrl;
      shareData.detailurl =
        this.$store.state.globalConfig.wxBaseUrl +
        Config.shareUrl +
        this.$route.fullPath;
      if (shareData.detailurl.indexOf("shareDeliveryType") === -1) {
        shareData.detailurl =
          shareData.detailurl +
          "&shareDeliveryType=" +
          this.detailData.deliveryType;
      }
      if (shareData.detailurl.indexOf("storeID") === -1) {
        shareData.detailurl =
          shareData.detailurl +
          "&storeID=" +
          this.$store.state.mall2.zitiAddress.id;
      }
      // if (this.detailData.deliveryType == 1) {
      // }
      if (
        this.$store.state.login.token &&
        this.$store.state.login.token != ""
      ) {
        if (shareData.detailurl.indexOf("recommend") === -1) {
          shareData.detailurl =
            shareData.detailurl +
            "&recommend=" +
            this.$store.state.userInfo.userId;
          shareData.detailurl =
            shareData.detailurl +
            "&recommendPhone=" +
            this.$store.state.login.phone;
        }
      }
      if (this.$store.state.webtype == 2) {
        wxfunc.getWechatSignature(isSignature => {
          //签名成功
          if (isSignature) {
            wxfunc.wxSetShareData(shareData);
          } else {
            this.$Toast("签名失败!");
          }
        });
      } else if (this.$store.state.webtype == 3) {
        // 小程序商品分享 需要传 配送自提等 参数
        const query = this.getUrlParam(shareData.detailurl);
        let rfrCode =
          this.$store.state.rfrCode || this.$store.state.userInfo.userId;
        wxfunc.wxmpShare({
          title: this.detailData.skuName,
          path: `${Config.shareUrl}${wxfunc.wxmpPath({
            query,
            path: this.$route.path
          })}`,
          imageUrl: this.detailData.phMainUrl,
          rfrCode
        });
      }
    },
    setPicMedia() {
      const ssdWrap =
        document.querySelector(".ssd-module-mobile-wrap") ||
        document.querySelector(".ssd-module-wrap");
      if (ssdWrap) {
        const mediaWrap = document.getElementById("picMedia");
        const winW = document.documentElement.scrollWidth;
        const scale = winW / ssdWrap.clientWidth;
        ssdWrap.style.WebkitTransformOrigin = "0 0";
        ssdWrap.style.transformOrigin = "0 0";
        ssdWrap.style.WebkitTransform = `scale(${scale})`;
        ssdWrap.style.transform = `scale(${scale})`;
        mediaWrap.style.height = ssdWrap.clientHeight * scale + "px";
      }
    },
    // 添加心愿单
    addWishLish() {
      this.$Loading.open();
      this.$http
        .post("/app/json/wish_order/addWishOrder", {
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (data.data == 1) {
              this.$Toast("已将宝贝添加至心愿单啦~");
            } else {
              this.$Toast("已将宝贝移除心愿单~");
            }
            this.getDatas();
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    },
    getTgfxDetail: function() {
      this.$http
        .post("/app/json/app_group_buy_cashback/getGroupCashbackDetail", {
          // skuId: this.detailData.skuId,
          skuId: "373754",
          activityId: "3476"
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.tgfxData = data.data;
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    },
    toRecommendation(status) {
      if (this.recommendationSku.skuList.length) {
        this.$router.push({
          path: "/recommend-commodity/newRecommendation",
          query: { status: status }
        });
      } else {
        this.$Toast("请选择推荐商品");
      }
    },
    getUrlParam(url) {
      let _url = url.substr(url.indexOf("?"));
      let GETs = _url.slice(1).split("&");
      let GET = {};
      for (let i = 0; i < GETs.length; i++) {
        let tmp_arr = GETs[i].split("=");
        let key = tmp_arr[0];
        GET[key] = tmp_arr[1];
      }
      return GET;
    }
  },
  created() {
    console.log("created");
    this.backApp = this.$route.query.backApp
      ? this.$route.query.backApp
      : false;
    this.lastPath = this.$route.query.lastPath
      ? this.$route.query.lastPath
      : "";
    this.orderCategory = this.$route.query.orderCategory
      ? this.$route.query.orderCategory
      : "";
    this.vipUnitUserCode = this.$route.query.vipUnitUserCode
      ? this.$route.query.vipUnitUserCode
      : "";
    this.id = this.$route.query.id ? this.$route.query.id : "";
    this.skuId = this.$route.query.skuId ? this.$route.query.skuId : "";
    if (this.$route.query.shareDeliveryType) {
      this.$store.state.mall2.staticDeliverType = this.$route.query.shareDeliveryType;
    }
    this.deliveryType = this.$store.state.mall2.staticDeliverType;
    this.productType = this.$route.query.productType
      ? this.$route.query.productType
      : "";
    this.activityId = this.$route.query.activityId
      ? this.$route.query.activityId
      : "";
    this.showActivityTime = this.$route.query.showActivityTime
      ? this.$route.query.showActivityTime
      : "0";

    this.directWeChatShare = this.$route.query.directWeChatShare
      ? this.$route.query.directWeChatShare
      : "0";

    if (this.id == "" && this.skuId == "") {
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
    if (
      this.detailData.supportPreSale == 1 &&
      this.$store.state.globalConfig.presaleType == 2
    ) {
      this.cartNum = cartEvent.getCartNum();
    }
    if (this.scrollTopValue3 != 0) {
      this.$refs.scrollView2.scrollTop = this.scrollTopValue3;
    }
    if (this.scrollTopValue4 != 0) {
      this.$refs.scrollView3.scrollTop = this.scrollTopValue4;
    }
    if (this.scrollTopValue5 != 0) {
      this.$refs.scrollView4.setScrollSite(this.scrollTopValue5);
    }
    if (this.scrollTopValue2 != 0) {
      this.$refs.pullTo2.setScrollTopValue(this.scrollTopValue2);
    }
    if (this.page1ScrollTop != 0) {
      this.$refs.pullTo1.setScrollTopValue(this.page1ScrollTop);
    }
    // 选自提点的时候，回来需要刷新库存
    if (this.backLoadStock) {
      this._getProductDetail();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == this.lastPath) {
      this.$keepaliveHelper.deleteCache(this);
    } else if (this.lastPath == "" && to.path == "/common") {
      this.$keepaliveHelper.deleteCache(this);
    } else {
      if (this.$refs.scrollView2) {
        this.scrollTopValue3 = this.$refs.scrollView2.scrollTop;
      }
      if (this.$refs.scrollView3)
        this.scrollTopValue4 = this.$refs.scrollView3.scrollTop;
      if (this.$refs.scrollView4)
        this.scrollTopValue5 = this.$refs.scrollView4.getScrollSite();
    }
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.theme_standard_bg{
  width: 102px;
  height: 39px;
  background: linear-gradient(270deg, #FFC360 0%, #FFA500 100%);
  border-radius: 20px;
  display:flex;
  justify-content: center;
  align-items: center;
  
  .title{
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    padding: 0 !important;
    // line-height: 21px;
  }
}
.theme_bg_y{
  width: 102px;
  height: 39px;
  background: linear-gradient(270deg, #FF6094 0%, #E5165A 100%);
  border-radius: 20px;
}
.nogoods{
  width: 214px !important;
  height: 39px;
  background: #F1F1F1;
  border-radius: 20px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8D8D8D;
  line-height: 21px;
}

.btns-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .back_proView {
    width: 75px;
    height: 44px;
    padding-left: 15px;
    display: flex;
    align-items: center;

    img {
      width: 8px;
      height: 14px;
    }
  }

  .btns_flex_item {
    font-size: 15px;
    font-weight: 400;
    color: #666666;
    margin-right: 30px;
    // padding-bottom:5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .line {
      width: 28px;
      height: 3px;
      background: #E54448;
      border-radius: 1px;
      margin-top: 5px;
    }
  }

  .standard {
    font-size: 15px;
    font-weight: 400;
    color: #121212;
    // border-bottom: 3px solid #E54448;
  }
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .share_button {
    padding-right: 7px;
    padding-left: 25px;

    img {
      width: 23px;
      height: 23px;
    }

    div {
      font-size: 11px;
      color: #121212;
      line-height: 10px;
      margin-top: 4px;
      white-space: nowrap;
    }
  }
}

.share_popup {
  width: 100%;
  height: 100%;
  padding: 35px 26px 36px 25px;

  .share_botton {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .share_botton_item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 74px;
        height: 74px;
      }

      div {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }
  }

  .cancel {
    width: 86.4%;
    height: 49px;
    border-radius: 16px;
    border: 1px solid #E5E5E5;
    font-size: 15px;
    font-weight: 500;
    color: #333333;
    line-height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 27px auto 0;
  }
}

.adapter-iphoneX {
  width: 100%;
  height: 34px;
  background-color: #fff;
}

.service {
  img {
    width: 26px;
    height: 26px;
  }
}

.detail {
  .block-div {
    .flex-row {
      .address-div {
        &.defaultStyle {
          color: #ccc;
          line-height: inherit;
        }
      }
    }
  }

  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .cou_and_act {
    position: relative;
    z-index: 1;
    // margin-top -5px;
    padding: 0 16px;
  }

  .sl-tag {
    font-size: $font-size-small;
    padding: 2px 6px;
  }

  .sl-title {
    flex: 1;
    margin-left: 4px;
    font-size: $font-size-small;

    span {
      margin-left: 10px;
    }
  }

  .good-salespro-right {
    margin: -10px;
    font-size: $font-size-small;
    padding: 12px 16px;
  }

  .productImg {
    position: absolute;
    z-index: 1001;
    left: 147.5px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    top: 120px;
  }

  .anProductImg {
    position: absolute;
    z-index: 1001;
    left: 0px;
    width: 100%;
    top: 160px;
    overflow: hidden;
    text-align: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }

  .detail-top {
    position: absolute;
    top: 0px;
    width: 100%;
    overflow: hidden;
    font-size: 0px;
    z-index: 6;

    .navcontent {
      position: absolute;
      width: 100%;
      bottom: 0px;
      left: 0px;

      .nav-back-btn {
        position: absolute;
        z-index: 10;
        overflow: hidden;
      }

      .right-btn {
        position: absolute;
      }
    }
  }

  .detail-tab {
    position: absolute;
    overflow: hidden;
    display: flex;
    align-items: center;
    top: 0px;
    bottom: 0px;

    .btn-div {
      flex: 1;
      text-align: center;

      span {
        border-bottom-width: 2px;
        border-style: solid;
        border-color: transparent;
      }
    }
  }

  .enable-scroll {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .scroll-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 50px;
    overflow: hidden;

    .pro-title-height {
      height: 34px;
    }

    .load-next {
      position: relative;
      height: 46px;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }

      span {
        font-size: 16px;
      }
    }

    .main-swiper {
      width: 100%;
      height: 100%;

      .main-swiper-scroll-content {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }

      .padding-bottom-8 {
        padding-bottom: 8px;
      }
    }

    .swiper-div {
      position: relative;
      overflow: hidden;
      width: 100%;

      // height 375px;
      .swiper-arr {
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }

      .swiper-img-div {
        img {
          display: block;
          width: 100%;
          // max-height: 375px;
          height: 375px;
        }
      }

      .swiper-index {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 10px;
        z-index: 10;
        display: flex;
        justify-content: center;

        .si-item {
          width: 15px;
          height: 3px;
          border-radius: 2px;
          margin: 5px;
        }

        .cus-index {
          width: 25px;
        }
      }

      .swiper-tip {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 0, 0, 0.2);
        z-index: 99;

        .pay-time {
          text-align: center;
          padding: 15px 20px;
          font-size: 15px;

          .tm {
            padding: 0 10px;
          }
        }
      }
    }

    .base-info {
      padding: 12px 8px 16px;
      position: relative;

      .add-wish-btn {
        position: absolute;
        right: 10px;
        top: 8px;
        width: 30px;
        height: 30px;

        img {
          display: block;
          width: 100%;
        }
      }

      .row {
        padding: 10px 8px 0px;
      }

      .price {
        padding: 0px 8px;
      }

      .seconds-kill {
        margin: -12px -8px 0px;
        height: 76px;
        overflow: hidden;

        &.ys {
          height: 62px;

          .left-div {
            display: flex;
            align-items: center;

            .big-title {
              padding-left: 12px;
              font-size: 16px;
            }
          }

          .right-div {
            padding-top: 8px;
          }
        }

        &.tgfx {
          height: 70px;

          .right-div {
            padding-top: 12px;
          }
        }

        &.xstj {
          height: 60px;
          display: flex;
          align-items: center;

          .left-div {
            float: none;
            flex: 1;
            display: flex;
            align-items: center;
            background: none;
            background-color: #ff4838;
            padding-left: 10px;
            padding-right: 20px;

            .icon-img {
              img {
                display: block;
                width: 40px;
                height: 40px;
              }
            }

            .price {
              color: white;

              .activity-price {
                font-size: 15px;
                font-weight: 500;

                span {
                  font-size: 20px;
                  font-weight: 500;
                }
              }

              .orgin-price {
                margin-top: 3px;
                text-decoration: line-through;
                font-size: 12px;
              }
            }
          }

          .right-div {
            position: relative;
            background: url('./img/time-bg.png') center center / 100% 100%;
            margin-left: -15px;
            z-index: 1;
            padding: 5px 6px 5px 12px;
          }
        }

        .left-div {
          float: left;
          width: 240px;
          height: 100%;
          background: linear-gradient(90deg, #F8089F, #F80E26);
          padding: 8px 0px;

          .sk-row {
            padding: 4px 8px 4px 16px;
            display: flex;
            align-items: center;

            .price {
              margin-left: -6px;
              font-size: 12px;
              font-weight: 600;

              .price-z {
                font-size: 24px;
                margin: 0 -4px;
              }
            }

            .tgfx-gz {
              flex: 1;
              text-align: right;
              padding-left: 10px;
            }

            .progress {
              flex: 1;
              padding-left: 20px;
              padding-right: 10px;

              /deep/ .mt-progress {
                height: 16px;
                overflow: hidden;
                border-radius: 10px;
              }

              /deep/ .mt-progress-runway {
                background-color: #fff;
                border: 1px solid #fff;
              }

              /deep/ .mt-progress-progress {
                background-color: #f6d916;
                border: none;
              }
            }

            .progress-text {
              font-size: 12px;
            }

            .sk-icon {
              border-radius: 10px;
              border: 1px solid #fff;
              overflow: hidden;
              padding: 3px 0px;

              i {
                font-size: 12px;
                padding: 4px;
              }

              span {
                font-size: 12px;
                padding: 4px;
              }
            }

            .o-price {
              font-size: 12px;
              font-weight: 500;
              margin-left: 10px;
            }
          }
        }

        .right-div {
          overflow: hidden;
          height: 100%;
          padding-top: 15px;

          .skr-row {
            text-align: center;
            font-size: 13px;
            padding: 4px 0;
          }
        }
      }

      .title {
        font-weight: 500;
        font-size: $font-size-large;
        line-height: 20px;
      }

      .desc {
        display: flex;
        padding-bottom: 8px;
        align-items: center;
        font-size: 12px;

        .desc-text {
          flex: 1;
        }
      }
    }

    .detail-div {
      position: relative;
      height: 100%;
      overflow: hidden;

      .detail-content {
        position: absolute;
        top: 41px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        overflow-x: hidden;
        overflow-y: auto;

        &.detail-bottom {
          position: static;
          overflow: hidden;
          padding-bottom: 100px;
        }

        .tip {
          margin: 10px;
          font-size: 0px;
          display: flex;
          align-items: center;

          .line {
            flex: 1;
            height: 1px;
            background-color: #ddd;
          }

          .text {
            font-size: 10px;
            margin: 0 10px;
          }
        }

        .introduction-div {
          margin-top: 2px;
          width: 100%;
          padding: 0 8px 10px;

          img {
            width: 100%;
          }
        }
      }
    }

    .btns-div {
      display: flex;
      padding: 12px 0 10px;

      .btn-item {
        flex: 1;
        padding: 3px;
        font-size: $font-size-medium;
        text-align: center;
      }

      /* .btn-item:nth-child(n+2) {
         border-left 1px solid #ddd;
         } */
    }

    .comment-div {
      margin: 5px 0px;

      .comment-row {
        padding: 4px 0px;
      }

      .header-img {
        width: 20px;
        height: 20px;
        overflow: hidden;
        border-radius: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .icon-level {
        font-size: 15px;
      }

      .imgs {
        overflow: hidden;
        padding-bottom: 12px;
        font-size: $font-size-medium;

        .s-img-div {
          margin-right: 2%;
          float: left;
          position: relative;
          width: 23%;
          height: 0px;
          padding-bottom: 23%;
          overflow: hidden;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        }

        .s-img-div:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }

  .comment-list {
    z-index: 99;
  }

  .bottom-tip {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 50px;
    z-index: 10;
    padding: 5px;
    font-size: 12px;
    text-align: center;
  }

  .bottom_btns_padding {
    // padding-right 8px;
    .radius {
      border-radius: 27px;
      height: 35px;
      margin-top: 7.5px;
      line-height: 0px;
      margin-right: 8px;
    }
  }

  .bottom-box {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    // height: 84px;
    background-color: white;
    box-shadow: 0 -2px 2px #efefef;
    z-index: 9;

    .adapter-iphoneX {
      width: 100%;
      height: 34px;
      background-color: #fff;
    }

    .bottom-box-btns {
      // position: absolute;
      // left: 0px;
      // right: 0px;
      // bottom: 0px;
      height: 50px;
      background-color: white;
      box-shadow: 0 -2px 2px #efefef;
      z-index: 9;
      display: flex;

      .recommend {
        width: 100%;
        height: 100%;
        display: flex;

        .recommendBtn {
          font-size: 18px;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .btn {
        position: relative;
        text-align: center;
        padding: 6px;

        .cart-num {
          position: absolute;
          // right: 6px;
          left: 61%;
          top: 5px;
          border-radius: 12px;
          padding: 2px 4px;
          font-size: 12px;
          z-index: 5;
        }

        .btn-icon {
          font-size: 26px;
          position: absolute;
          top: 6px;
          left: 0px;
          right: 0px;
          text-align: center;
        }

        .btn-img {
          position: absolute;
          top: 6px;
          left: 50%;
          margin-left: -10px;
          width: 20px;
          height: 20px;
        }

        .btn-sl-img {
          position: absolute;
          top: 6px;
          left: 50%;
          margin-left: -11px;
          width: 22px;
          height: 22px;
        }

        .text {
          position: absolute;
          left: 0px;
          right: 0px;
          bottom: 6px;
          text-align: center;
          // margin-top 3px;
        }

        .title {
          padding: 11px 5px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .big-btn {
        width: 170px;
      }

      .full {
        flex: 1;
      }
    }
  }

  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    background-color: white;
    box-shadow: 0 -2px 2px #efefef;
    z-index: 9;
    display: flex;

    .recommend {
      width: 100%;
      height: 100%;
      display: flex;

      .recommendBtn {
        font-size: 18px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .btn {
      position: relative;
      text-align: center;
      padding: 6px;

      .cart-num {
        position: absolute;
        right: 6px;
        top: 5px;
        border-radius: 12px;
        padding: 2px 4px;
        font-size: 12px;
        z-index: 5;
      }

      .btn-icon {
        font-size: 26px;
        position: absolute;
        top: 6px;
        left: 0px;
        right: 0px;
        text-align: center;
      }

      .btn-img {
        position: absolute;
        top: 6px;
        left: 50%;
        margin-left: -10px;
        width: 20px;
        height: 20px;
      }

      .btn-sl-img {
        position: absolute;
        top: 6px;
        left: 50%;
        margin-left: -11px;
        width: 22px;
        height: 22px;
      }

      .text {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 6px;
        text-align: center;
        // margin-top 3px;
      }

      .title {
        padding: 11px 5px;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .big-btn {
      width: 170px;
    }

    .full {
      flex: 1;
    }
  }

  .yj-card {
    .btn {
      width: 100%;
    }
  }

  .activity-notice {
    /* background-color #07c160 */
    height: 20px;
    display: flex;
    align-items: center;

    .sk-icon {
      border-radius: 10px;
      border: 0.7px solid #f80f16;
      overflow: hidden;
      padding: 3px 0px;

      i {
        font-size: 10px;
        padding: 4px;
      }

      span {
        font-size: 10px;
        padding-right: 6px;
        padding-left: 4px;
      }
    }

    .notice-price {
      font-size: 12px;
      font-weight: 500;
      margin-left: 10px;
    }
  }
}

// .collectName-enter-active {
//   transition: all 0.2s ease;
// }

// .collectName-leave-active {
//   transition: all 0.2s ease-in;
// }

// .collectName-enter {
//   transform: translateY(-500%);
//   transform: scale(10);
// }

// .collectName-leave-to {
//   transform: translateY(-500%);
//   transform: scale(10);
// }

.transition1-enter-active, .transition1-leave-active, .transition2-enter-active, .transition2-leave-active {
  transition: all 0.5s;
}

.transition1-enter, .transition1-leave-to { /* .fade-leave-active below version 2.1.8 */
  transform: translate3d(0, -100%, 0);
}

.transition2-enter, .transition2-leave-to { /* .fade-leave-active below version 2.1.8 */
  transform: translate3d(0, 100%, 0);
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
</style>
