<template>
  <div class="detail mall2">
    <div
      ref="detailTop2"
      class="detail-top"
      :style="{height: ($store.state.barHeight+$market.getNavHeight(true))+ 'px'}">
      <div
        class="navcontent"
        :style="{top: $store.state.barHeight+ 'px','height': $market.getNavHeight(true)+'px','line-height': $market.getNavHeight(true)+'px'}"
      >
        <div
          class="nav-back-btn"
          style="left: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
          @click="backEvent"
          v-if="$store.state.webtype != 2"
        >
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/back.png" />
        </div>
        <div
          class="nav-back-btn"
          style="right: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
          @click="sharegoods"
          v-if="$store.state.webtype == 1"
        >
          <img
            style="display: block;width: 100%;height: 100%;"
            src="static/image/mall2/fenxiang.png"
          />
        </div>
        <div
          class="nav-back-btn"
          style="right: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
          @click="showShare"
          v-if="$store.state.webtype == 3"
        >
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/share.png" />
        </div>
      </div>
    </div>
    <!-- 顶部tab签 -->
    <div
      ref="detailTop1"
      class="detail-top"
      style="visibility: hidden;"
      :style="{height: ($store.state.barHeight+$market.getNavHeight(true))+ 'px'}"
      v-if="detailShow">
      <nav-top
        isMust="true"
        :noBack="$store.state.webtype == 2"
        :noTitle="true"
        @backEvent="backEvent"
      >
        <transition name="transition1">
          <div
            class="detail-tab"
            style="left: 20%; right: 20%; font-size: 16px;"
            v-show="proView == 1"
          >
            <div class="btn-div" :style="getSelectedTabStyle(1)" @click="toptabEvent(1)">商品</div>
            <div class="btn-div" :style="getSelectedTabStyle(2)" @click="toptabEvent(2)">详情</div>
            <div class="btn-div" :style="getSelectedTabStyle(3)" @click="toptabEvent(3)">评价</div>
            <div class="btn-div" :style="getSelectedTabStyle(4)" @click="toptabEvent(4)">推荐</div>
          </div>
        </transition>
        <transition name="transition2">
          <div
            style="position: absolute;left: 20%; right: 20%; font-size: 18px;font-weight: 500;text-align: center;"
            v-show="proView == 2"
          >图文详情</div>
        </transition>
        <div
          class="right-btn"
          style="right: 0px; height: 44px; top: 0px; padding-right: 12px;"
          v-if="$store.state.webtype == 1"
          @click="sharegoods"
        >
          <i class="iconfont mall-fenxiang theme_font_common" style="font-size: 20px;"></i>
        </div>
      </nav-top>
    </div>
    <div
      ref="scrollView"
      class="scroll-div theme_bg_white"
      :style="getScrollTop()"
      v-if="detailShow">
      <swiper class="main-swiper" ref="mySwiper" :options="mainSwiper">
        <swiper-slide :class="{'swiper-no-swiping': proView == 2}">
          <div class="main-swiper" style="position: relative;">
            <transition name="transition1">
              <div
                class="main-swiper theme_bg_white_f5"
                style="position: absolute;"
                v-show="proView == 1">
                <pull-to
                  ref="pullTo1"
                  :bottomConfig="{pullText: '', triggerText: '释放显示商品详情', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                  :bottom-load-method="bottomPull"
                  :top-load-method="topPull"
                  :is-bottom-bounce="true"
                  :is-top-bounce="false"
                  :doSiteCallback="true"
                  @pageSite="pullScrollEvent">
                  <div>
                    <!-- 商品轮播图 -->
                    <div class="swiper-div theme_bg_white">
                      <swiper :options="swiperOption">
                        <swiper-slide v-if="videoUrl != ''">
                          <video-player
                            class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="playerOptions"
                          ></video-player>
                        </swiper-slide>
                        <swiper-slide v-for="(pic, pidx) in detailData.picUrls" :key="pidx">
                          <div class="swiper-img-div" @click="showBigImageEvent">
                            <img :src="pic" />
                          </div>
                        </swiper-slide>
                      </swiper>
                      <div class="swiper-index">
                        <div
                          class="si-item theme_bg_white_ef"
                          :class="{'cus-index': proImgIndex == idx, theme_bg_red_i: proImgIndex == idx}"
                          v-for="(d, idx) in arrLen"
                          :key="idx"
                        ></div>
                      </div>
                    </div>
                    <!-- 商品轮播图end -->
                    
                    <!-- 拍卖状态 -->
                    <div class="auction-state" :class="{ finished: auctionProdInfo.auctionIsOver }">
                      <div class="state-text">{{ auctionProdInfo.auctionState }}</div>
                      <div style="display: inline-block;" v-if="!auctionProdInfo.auctionIsOver">
                        <div class="countdown">
                          <span>{{ auctionProdInfo.countdownTip }}</span>
                          <van-count-down class="reset-countdown" :time="auctionProdInfo.countdownTime" @finish="auctionCountdownFinish">
                            <template v-slot="timeData">
                              <span class="item">{{ dealWithCountHours(timeData) }}</span> :
                              <span class="item">{{ timeData.minutes }}</span> :
                              <span class="item">{{ timeData.seconds }}</span>
                            </template>
                          </van-count-down>
                        </div>
                        <div class="progress-rate">
                          <p class="limit">{{ auctionProdInfo.remainingTip }}{{ auctionProdInfo.auctionCount - auctionProdInfo.saleCount - auctionProdInfo.lockCount }}件</p>
                          <div class="progress-c">
                            <span class="progress-portion" :style="{width: ( (1 - (auctionProdInfo.saleCount / (auctionProdInfo.auctionCount - auctionProdInfo.lockCount))) * 100) + '%'}"></span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="finished-time">结束时间：{{ auctionProdInfo.realityEndTime }}</div>
                    </div>
                    <!-- 拍卖状态end -->

                    <!-- 商品信息 -->
                    <div class="prod-info" :class="{ finished: auctionProdInfo.auctionIsOver }">
                      <p class="name"><span class="tip">降价拍</span>{{ auctionProdInfo.skuName }}</p>
                      <div class="price-c">
                        <div v-if="auctionProdInfo.stateType == 1">
                          <p class="price-name">{{ auctionProdInfo.auctionPriceTip }}</p><p class="price">￥<span class="num">{{ auctionProdInfo.startAuctionPrice }}</span></p>
                        </div>
                        <div v-else>
                          <p class="price-name">{{ auctionProdInfo.auctionPriceTip }}</p><p class="price">￥<span class="num">{{ auctionProdInfo.onSalePrice }}</span></p>
                        </div>
                      </div>
                      <div class="sub-info">
                        <p class="rule" v-if="!auctionProdInfo.auctionIsOver"><img class="tip-icon" src="./imgs/icon-auction.png" alt="">每{{ auctionProdInfo.everyMinute }}分钟降 {{ dealWithPrice(auctionProdInfo.reducePrice)[2] }} 元</p>
                        <p class="rule" v-else><img src="./imgs//icon-auction-f.png" alt="" class="tip-icon">该商品已经结束拍卖</p>
                        <!-- <p class="lookers">当前围观 XX 人</p> -->
                      </div>
                    </div>
                    <!-- 商品信息end -->

                    <!-- 拍卖信息 -->
                    <div class="auction-info">
                      <p class="title">拍卖信息</p>
                      <div class="info-c">
                        <p class="name">拍卖方式：</p>
                        <p class="content">降价拍<i class="iconfont mall-info description" @click="isShowAuctionModal = true"></i></p>
                      </div>
                      <div class="info-c">
                        <p class="name">起拍价：</p>
                        <p class="content">￥ {{ dealWithPrice(auctionProdInfo.startAuctionPrice)[2] }}</p>
                      </div>
                      <div class="info-c">
                        <p class="name">保底价：</p>
                        <p class="content">￥ {{ dealWithPrice(auctionProdInfo.minPrice)[2] }}</p>
                      </div>
                      <div class="info-c">
                        <p class="name">降价幅度：</p>
                        <p class="content">￥ {{ dealWithPrice(auctionProdInfo.reducePrice)[2] }}</p>
                      </div>
                      <div class="info-c">
                        <p class="name">降价周期：</p>
                        <p class="content">{{ auctionProdInfo.everyMinute }} 分钟 / 次</p>
                      </div>
                      <div class="info-c">
                        <p class="name">开始时间：</p>
                        <p class="content">{{ auctionProdInfo.startTime }}</p>
                      </div>
                      <div class="info-c">
                        <p class="name">预计结束时间：</p>
                        <p class="content">{{ auctionProdInfo.endTime }}</p>
                      </div>
                    </div>
                    <!-- 拍卖信息end -->

                    <!-- 成交记录 -->
                    <div class="transaction-record">
                      <div class="top-title">
                        <p class="total-num">成交记录（0）</p>
                        <span class="more-btn" @click="viewTransactionRecord">查看全部<i class="iconfont mall-gengduojiantou icon"></i></span>
                      </div>
                      <ul class="record-list">
                        <li class="item" v-if="transactionRecordInfo.buyerName">
                          <span class="tip">成交</span>
                          <span>￥{{ $util.toDecimal2(transactionRecordInfo.payAmount) }} {{ transactionRecordInfo.buyerName }} 于 {{ transactionRecordInfo.paidTime }} 成交</span>
                        </li>
                        <li class="item" v-else style="font-size: 14px; text-align: center; color: #999;">暂无记录~</li>
                      </ul>
                    </div>
                    <!-- 成交记录end -->

                    <!-- 评价 -->
                    <div
                      class="block-div theme_bg_white"
                      v-if="detailComment && detailComment.evaluateCount > 0">
                      <div class="flex-row" @click="allCommentEvent">
                        <div
                          class="title theme_font_black"
                          v-if="detailComment.evaluateCount == 0"
                        >暂无评价</div>
                        <div
                          class="title theme_font_black"
                          v-if="detailComment.evaluateCount > 0"
                        >评价（{{detailComment.evaluateCount}}）</div>
                        <div class="full"></div>
                        <div
                          class="font-small right-margin theme_font_common"
                          v-if="detailComment.evaluateCount > 0"
                        >
                          <span>好评率</span>
                          <span class="theme_standard_font">{{detailComment.evaluateGoodRate}}</span>
                        </div>
                        <div>
                          <i class="iconfont mall-gengduojiantou icon-font theme_font_common"></i>
                        </div>
                      </div>
                      <div class="comment-div" v-for="(comment, index) in detailComment.evaluateList" :key="index">
                        <div class="flex-row comment-row theme_font_common">
                          <div class="header-img right-margin">
                            <img
                              :src="comment.userAvtUrl != '' ? comment.userAvtUrl : 'static/image/mall2/header.png'"
                            />
                          </div>
                          <div class="right-margin full">{{getCommentUserStr(comment)}}</div>
                          <div class>
                            <i
                              class="iconfont mall-xingxing icon-level theme_font_tint"
                              :class="{theme_standard_font_i: comment.score >= lv}"
                              v-for="lv in 5"
                            ></i>
                          </div>
                        </div>
                        <div class="flex-row comment-row theme_font_gray">
                          <div style="line-height: 1.4;">{{comment.evaluateContent}}</div>
                        </div>
                        <div class="imgs" v-if="comment.evaluateImages != ''">
                          <div
                            class="s-img-div"
                            v-for="(pic, idx) in getCommentImgs(comment.evaluateImages)"
                            v-if="idx < 4"
                          >
                            <img :src="pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 评价end -->
                    
                    <!-- 更多推荐 -->
                    <div
                      class="block-div theme_bg_white"
                      v-if="detailData.recommendSkuList && detailData.recommendSkuList.length > 0 && (!cardType || (cardType && cardType == 551))">
                      <div class="flex-row">
                        <div class="title theme_font_black">为你推荐</div>
                      </div>
                      <div class="recommend-div">
                        <div
                          class="pro-div"
                          v-for="(item, index) in detailData.recommendSkuList"
                          :key="index"
                          @click="productEvent(item)"
                        >
                          {{dataProcessing(item)}}
                          <div class="img-div">
                            <img :src="item.phMainUrl" />
                          </div>
                          <div class="title single-line theme_font_black">{{item.skuName}}</div>
                          <div class="price single-line">
                            <PriceOrder :listitem="item"></PriceOrder>
                          </div>
                        </div>
                      </div>
                      <div class="more-btn">
                        <label
                          class="act-item-empty line_circle theme_standard_font theme_standard_bdr"
                          @click="moreRecommend"
                        >更多推荐</label>
                      </div>
                    </div>
                    <div class="load-next theme_bg_white">
                      <img src="static/image/mall2/load-next.png" />
                      <span class="theme_font_tint">上拉加载图文详情</span>
                    </div>
                  </div>
                </pull-to>
              </div>
            </transition>
            <transition name="transition2">
              <div class="main-swiper" style="position: absolute; top: 44px;" v-show="proView == 2">
                <div class="btns-div theme_bg_white">
                  <div
                    class="btn-item theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 1}"
                    @click="introductionSelected(1)"
                  >商品介绍</div>
                  <div
                    class="btn-item line_left theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 2}"
                    @click="introductionSelected(2)"
                  >规格参数</div>
                  <div
                    class="btn-item line_left theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 3}"
                    @click="introductionSelected(3)"
                  >售后包装</div>
                </div>
                <div class="detail-div detail-div-1">
                  <pull-to
                    ref="pullTo2"
                    :topConfig="{pullText: '', triggerText: '释放显示商品介绍', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                    :top-load-method="topPull"
                    :is-bottom-bounce="false"
                    :is-top-bounce="true"
                  >
                    <div class="detail-content detail-bottom">
                      <div class="tip" v-if="introductionIndex == 1">
                        <span class="line"></span>
                        <span class="text">商品信息</span>
                        <span class="line"></span>
                      </div>
                      <div
                        v-html="introduction1"
                        class="introduction-div"
                        style="padding: 0"
                        id="picMedia"
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
                  </pull-to>
                </div>
              </div>
            </transition>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="main-swiper" style="position: relative;">
            <div
              ref="scrollView2"
              class="main-swiper-scroll-content enable-scroll"
              style="top: 44px;"
            >
              <div class="detail-div">
                <div class="btns-div theme_bg_white">
                  <div
                    class="btn-item theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 1}"
                    @click="introductionSelected(1)"
                  >商品介绍</div>
                  <div
                    class="btn-item theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 2}"
                    @click="introductionSelected(2)"
                  >规格参数</div>
                  <div
                    class="btn-item theme_font_gray"
                    :class="{theme_standard_font_i: introductionIndex == 3}"
                    @click="introductionSelected(3)"
                  >售后包装</div>
                </div>
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
          <div class="main-swiper" style="position: relative;">
            <div
              ref="scrollView3"
              class="main-swiper-scroll-content enable-scroll"
              style="top: 44px;"
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
          <div class="main-swiper" style="position: relative;">
            <div
              ref="scrollView4"
              class="main-swiper-scroll-content enable-scroll"
              style="top: 44px;"
            >
              <Recommend
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

    <!-- 底部购买按钮 -->
    <div class="bottom-btns">
      <!-- <div class="btn full" @click="collectEvent">
        <i class="iconfont mall-shoucang btn-icon theme_font_gray" v-if="isCollect == 'false'"></i>
        <transition :name="collectName">
          <img class="btn-img" src="static/image/mall2/collect.png" v-if="isCollect == 'true'" />
        </transition>
        <p class="text">收藏</p>
      </div> -->
      <div
        class="settlement-btn"
        :class="{'not-start': !(auctionProdInfo.stateType == 2)}"
        @click="buyNowEvent">立即抢拍</div>
    </div>

    <!-- 购买弹窗 -->
    <pop-view v-if="showPop" @closeEvent="popClose" :popHeight="350" class="buy-pop">
      <div class="product-info">
        <img :src="detailData.phMainUrl" alt="" class="prod-img">
        <div class="right">
          <p class="prod-name">{{ detailData.showTitle }}</p>
          <div class="current-price">
            <span>当前价格：</span><span class="price">￥<i class="num">{{ dealWithPrice(auctionProdInfo.onSalePrice)[0] }}</i>.{{ dealWithPrice(auctionProdInfo.onSalePrice)[1] }}</span>
          </div>
        </div>
      </div>
      <div class="purchase-amount" v-if="(auctionSaleInfo.limitType == 1) && (auctionSaleInfo.limitCnt != auctionSaleInfo.saleCount)">
        <div class="top">
          <span class="name">购买数量（库存{{ auctionProdInfo.auctionCount - auctionProdInfo.saleCount - auctionProdInfo.lockCount }}）</span>
          <van-stepper v-model="auctionSaleNum" input-width="30px" button-size="25px" :max="dealwithMaxSale()" />
        </div>
        <p v-if="auctionSaleInfo.limitType == 1" class="tip">每人每场限购{{ auctionSaleInfo.limitCnt }}件，您已成功购买{{ auctionSaleInfo.saleCount }}件</p>
      </div>
      <div v-else-if="(auctionSaleInfo.limitType == 1) && (auctionSaleInfo.limitCnt == auctionSaleInfo.saleCount)" class="cannot-buy">当前竞品每人每场限购{{ auctionSaleInfo.limitCnt }}件，您已达到竞拍上限</div>
      <div v-else class="cannot-buy">当前库存充足</div>
      <div class="pop-submit-btn" :class="{disabled: !availability()}" @click="submitOrders">立即购买</div>
    </pop-view>
    <!-- 购买弹窗end -->

    <transition name="bounce" @afterEnter="productImgAfterEnter">
      <img :src="this.detailData.phMainUrl" alt class="productImg" v-if="showProductImg" />
    </transition>
    <transition @after-enter="afterEnter" @before-enter="beforeEnter">
      <div class="anProductImg" v-if="showAddCartAn">
        <img :src="this.detailData.phMainUrl" alt />
      </div>
    </transition>
    <BigImage
      :initIndex="videoUrl != '' ? proImgIndex - 1 : proImgIndex"
      :picUrls="detailData.picUrls"
      v-if="showBigImage"
      @closeEvent="closeBigImage"></BigImage>
    <BigImage :picUrls="picUrls" v-if="showPicUrls" @closeEvent="closeBigImage"></BigImage>

    <van-popup v-model="isShowAuctionModal" class="auction-desc-modal" :close-on-click-overlay="false">
      <p class="title">降价拍</p>
      <p class="content">降价拍是拍卖的方式之一，开拍后，随着时间的推移，拍品价格将逐渐降低，最低价格为商家设置的保底价，直到拍卖结束或库存为0。</p>
      <div class="close-btn" @click="isShowAuctionModal = false">我知道了</div>
    </van-popup>
  </div>
</template>

<script>
import Judgement from "./judgement/judgement";
import Recommend from "./recommend/index";
import BigImage from "../../common/big-image/index";
import PullTo from "@/components/Vendor/vue-pull-to/vue-pull-to";
import Countdown from "../../../Vendor/countdown/countdown";
import PriceOrder from "@/components/commonui/price/price-order";
import Config from "@/api/config";
import ShareImage from "./shareImage";
import wxfunc from "@/utils/wxfunc";
import WechatOP from "@/utils/WechatOP";
import InitialLoadPickupAny from "@/utils/initialLoadPickupAny.js";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import { CountDown, Dialog } from 'vant';
import moment from 'moment';

export default {
  name: "detail",
  components: {
    Countdown,
    Judgement,
    Recommend,
    PullTo,
    BigImage,
    PriceOrder,
    videoPlayer,
    [CountDown.name]: CountDown,
  },
  data() {
    let that = this;
    return {
      isShowAuctionModal: false,
      id: "",
      skuId: "",
      // 降价拍详情数据
      auctionProdInfo: {},
      // 降价拍用户购买数量数据
      auctionSaleInfo: {},
      // 降价拍成交记录(一个)
      transactionRecordInfo: {},
      auctionSaleNum: 1,
      orderCategory: "",
      vipUnitUserCode: "",
      productType: "",
      toptab: 1,
      proImgIndex: 1,
      proView: 1,
      page1ScrollTop: 0,
      deliveryType: 2,
      collectName: "",
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
      cardType: "", // 区分充值卡 计次卡 551充值卡 552 计次卡(只有计次卡不需要推荐和领券，底部只有立即购买按钮)
      easyCardId: "", // 从易捷卡页面过来的才有easyCardI
      jfhqList: []
    };
  },
  mounted() {
    this.easyCardId = this.$route.query.easyCardId;
    this.cardType = this.$route.query.cardType;
  },
  created() {
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

    if (this.id == "" && this.skuId == "") {
      return;
    }
    //微信类型
    if (this.$store.state.webtype == 2) {
      this.getWechatDatas();
    } else {
      this.getDatas();
    }
    // 降价拍
    this.initAuctionDetail()
    this.getTransactionRecord()
  },
  activated() {
    if (this.scrollTopValue3 != 0) {
      this.$refs.scrollView2.scrollTop = this.scrollTopValue3;
    }
    if (this.scrollTopValue4 != 0) {
      this.$refs.scrollView3.scrollTop = this.scrollTopValue4;
    }
    if (this.scrollTopValue5 != 0) {
      this.$refs.scrollView4.scrollTop = this.scrollTopValue5;
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
        this.scrollTopValue5 = this.$refs.scrollView4.scrollTop;
    }
    next();
  },
  methods: {
    // 获取降价拍详情
    initAuctionDetail() {
      this.$http.post('/app/json/app_product_auction/getDetail', {
        id: this.$route.query.auctionActivityId
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          /*
            计算降价周期和周期价格--页面中所有根据不同状态展示不同文字的判断都在这里进行，判断大体分为三种。
            data.data.stateType 返回当前活动的基本状态 1 预展中 2 进行中 3 已结束
          */
          // 统计各阶段结束时间和价格
          let auctionStage = [];
          if (data.data.stateType != 3) {
            // 总计倒计时次数（降价次数 + 1）
            let totalCountdown = (data.data.startAuctionPrice - data.data.minPrice) / data.data.reducePrice + 1;
            for (let i = 0; i < totalCountdown; i++) {
              auctionStage.push({
                currentPrice: data.data.startAuctionPrice - i * data.data.reducePrice,
                endTime: moment(data.data.startTime).add((i + 1) * data.data.everyMinute, 'm')
              });
            }
          }
          
          if (data.data.stateType == 1) { // 预展中
            data.data.auctionState = '预展中';
            data.data.auctionPriceTip = '起拍价：';
            data.data.remainingTip = '限量';

            data.data.countdownTime = moment(data.data.startTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
            data.data.countdownTip = '距拍卖开始：';
            // 14410000
          } else if (data.data.stateType == 2) { // 进行中--分为两种状态（1. 价格已经为最低，最后一个降价周期。 2. 正在倒计时降价中）
            data.data.auctionState = '进行中';
            data.data.auctionPriceTip = '当前价：';
            data.data.remainingTip = '仅剩';

            if (data.data.onSalePrice == data.data.minPrice) { // 最后一个降价周期(当前售价和最低售价相同)
              data.data.countdownTime = moment(data.data.endTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
              data.data.countdownTip = '距拍卖结束：';
            } else { // 进行中，正在某一个降价周期中
              for (let j = 0; j < auctionStage.length; j++) {
                if (data.data.onSalePrice == auctionStage[j].currentPrice) {
                  data.data.countdownTime = moment(auctionStage[j].endTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
                }
              }
              data.data.countdownTip = '距下次降价：';
            }
          } else if (data.data.stateType == 3) { // 已结束
            data.data.auctionState = '拍卖已结束';
            data.data.auctionPriceTip = '结束价：';
            data.data.auctionIsOver = true;
          }
          this.auctionProdInfo = data.data;
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(err);
      })
    },
    // 获取成交记录
    getTransactionRecord() {
      this.$Loading.open()
      this.$http.post('/app/json/app_product_auction/getDoneAuctionList', {
        auctionId: this.$route.query.auctionActivityId
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.transactionRecordInfo = data.data[0] || {}
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`getDoneAuctionList err ${err}`)
      })
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
    // 处理倒计时的小时数
    dealWithCountHours(time) {
      let result = 0;
      if (time.days) {
        result = result + time.days * 24;
      }
      if (time.hours) {
        result += time.hours;
      }
      return result;
    },
    // 降价拍倒计时结束
    auctionCountdownFinish() {
      this.initAuctionDetail();
    },
    // 计算最大可卖数量
    dealwithMaxSale() {
      if (this.auctionProdInfo.limitType == 1) { // 限制每人购买数量
        return this.auctionSaleInfo.limitCnt - this.auctionSaleInfo.saleCount;
      } else { // 不限制每人购买量
        return (this.auctionProdInfo.auctionCount - this.auctionProdInfo.saleCount - this.auctionProdInfo.lockCount)
      }
    },
    // 是否可购买
    availability() {
      // 活动是否开始或已经结束
      if (this.auctionProdInfo.stateType == 1 || this.auctionProdInfo.stateType == 3) {
        return false;
      }
      // 售卖数量和限制数量一样
      if (this.auctionSaleInfo.limitType == 1) {
        if (this.auctionSaleInfo.limitCnt == this.auctionSaleInfo.saleCount) {
          return false;
        }
      }
      return true;
    },
    // 立即购买
    buyNowEvent: function() {
      if (this.auctionProdInfo.stateType == 2) {
        // 查询用户当前是否可购买
        this.getSaleNum();
      }
      // this._buyNow()
    },
    // 查询用户购买数量
    getSaleNum() {
      this.$Loading.open();
      this.$http.post('/app/json/app_product_auction/checkUserAuction', {
        auctionId: this.$route.query.auctionActivityId,
        userAddressId: this.$store.state.mall2.selectAddress.id,
        provinceId: this.$store.state.mall2.selectAddress.provinceId,
        provinceName: this.$store.state.mall2.selectAddress.provinceName,
        cityId: this.$store.state.mall2.selectAddress.cityId,
        cityName: this.$store.state.mall2.selectAddress.cityName,
        countryId: this.$store.state.mall2.selectAddress.countryId,
        countryName: this.$store.state.mall2.selectAddress.countryName,
        townId: this.$store.state.mall2.selectAddress.townId,
        townName: this.$store.state.mall2.selectAddress.townName,
        address: this.$store.state.mall2.selectAddress.address,
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.auctionSaleInfo = data.data;
          this.auctionProdInfo.freightAmount = data.data.freightAmount
          this.showPop = true;
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 立即购买
    submitOrders() {
      if (this.availability()) {
        this.auctionProdInfo.auctionSaleNum = this.auctionSaleNum;
        this.$router.push({
          path: '/auction_fill_order',
          query: {
            auctionProdData: JSON.stringify(this.auctionProdInfo)
          }
        })
      }
    },
    // 查看成交记录
    viewTransactionRecord() {
      this.$router.push({
        path: '/auction_transaction_record',
        query: {
          auctionActivityId: this.$route.query.auctionActivityId
        }
      })
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
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` +
          skuName;
      } else if (item.interfaceType == "1") {
        skuName =
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` +
          skuName;
      }
      return skuName;
    },
    showShare() {
      // 打开弹框
      if (Object.keys(this.detailData).length > 0) {
        ShareImage.show({
          proData: this.detailData || {}
        });
      }
    },
    getCountdownTime: function() {
      let nowT = this.$store.state.severTime.currentTime;
      let startT = this.$util.getDateFromString(this.detailData.mktStartDate);
      if (nowT < startT) {
        return startT;
      }
      let endT = this.$util.getDateFromString(this.detailData.mktEndDate);
      if (nowT < endT) {
        return endT;
      }
      return endT;
    },
    getTimeTitle: function() {
      let nowT = this.$store.state.severTime.currentTime;
      let startT = this.$util.getDateFromString(this.detailData.mktStartDate);
      if (nowT < startT) {
        return "距离开始还剩:";
      }
      let endT = this.$util.getDateFromString(this.detailData.mktEndDate);
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
      return "top: " + this.$store.state.barHeight + "px;";
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
      let ican = false;
      for (let i = 0; i < kyList.length; i++) {
        let kyStr = kyList[i];
        let arr = kyStr.split(",");
        if (descartes.length == arr.length) {
          for (let j = 0; j < arr.length; j++) {
            let s1 = descartes[j];
            if (s1 == "*") {
              ican = true;
              continue;
            }
            let s2 = arr[j];
            if (s1 == s2) {
              ican = true;
            } else {
              ican = false;
              break;
            }
          }
          if (ican) {
            return false;
          }
        }
      }
      return true;
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
    showBigImageEvent: function() {
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
        if (scrollTop < 200) {
          let opacity = scrollTop / 200;
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
        this.$store.state.login.token == "" &&
        this.$store.state.webtype == 2
      ) {
        this.bindWechat(pushData);
        return;
      }
      this.$router.push(pushData);
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
      if (this.proView == 2) {
        this.proView = 1;
        return;
      }
      if (this.$store.state.webtype == 3 && window.history.length === 1) {
        wx.miniProgram.reLaunch({ url: `/pages/common/home/index` });
      } else {
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this);
      }
    },
    activityProducts: function(activity) {
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
    moreRecommend: function() {
      this.recommendListShow = true;
      this.toptabEvent(4);
    },
    getServerText: function(server) {
      if (server.key == 1) {
        return server.days + "天换货";
      } else if (server.key == 2) {
        return server.days + "天退货";
      } else if (server.key == 3) {
        return server.days + "天维修";
      }
    },
    proSelectEvent: function() {
      this.popFlag = "addToCart";
      this.showPop = true;
    },
    subFeatureEvent: function(subFeature, fidx) {
      if (this.getCanSelectWith(fidx, subFeature)) {
        this.$Toast("当前规格组合没有商品!");
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
        // 表示选完整了
        this._getProductDetail();
      }
    },
    numChange: function() {
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
            if (productList.length > 0) {
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
      this.popFlag = "addToCart";
      this.showPop = true;
      // this._addToCart();
    },
    popClose: function() {
      this.showPop = false;
    },
    popSureEvent: function() {
      if (this.popFlag == "addToCart") {
        this._addToCart();
      } else if (this.popFlag == "buyNow") {
        this._buyNow();
      }
      this.showPop = false;
    },
    // 请求详情信息
    _getProductDetail: function() {
      this.$Loading.open();
      let url = "/app/json/product/getAppProDetail";
       let paramsData = {
        token: this.$store.state.login.token,
        productType: this.productType,
        skuId: this.skuId,
        featureValueIds: this.myFeatures,
        lng: this.$store.state.currentLocation.posx,
        lat: this.$store.state.currentLocation.posy,
        deliverType: this.deliveryType,
        activityId: this.activityId,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };

      /**
       * 这里利用了耦合性写了一部分代码，特做此标记
       * 后台首页直接配置某个商品详情的时候，详情路径必定为 '/mall2/detail/1000'
       * 这里判断 '/mall2/detail/1000' 这个路径时，不传 deliverType ， 传 secondDeliveType ，
       * 将配送方式交给商品来处理，如果商品仅支持自提 那返回自提，如果商品只支持配送 那返回配送 ，如果都支持 ，返回 secondDeliveType 的值
       */
      if (this.$route.path == "/mall2/detail/1000") {
        if (!this.detailData.deliveryType) {
          paramsData.deliverType = "";
          paramsData.secondDeliveType = this.deliveryType;
        }
      }

      if (this.id && this.id != "") {
        // paramsData.id = this.id;
      } else {
        paramsData.storeOuCode = this.$route.query.storeOuCode
          ? this.$route.query.storeOuCode
          : "";
        paramsData.pickupStoreOuCode = this.$route.query.storeOuCode
          ? this.$route.query.storeOuCode
          : "";
      }
      if (this.activityId != "") {
        paramsData.activityId = this.activityId;
      }
      if (paramsData.deliverType == 1 || paramsData.deliverType == "") {
        paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress
          .storeCode
          ? this.$store.state.mall2.zitiAddress.storeCode
          : this.$route.query.storeOuCode
          ? this.$route.query.storeOuCode
          : "";
      }
       this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.detailData = data.data;

            this.$actionStatistics.detailAction(
              "120000",
              JSON.stringify(paramsData),
              this.detailData.skuId
            );

            this.loadJFHQList();
            if (this.detailData.remainNum === 0) {
              this.$Toast("活动商品库存已售空，需原价购买！");
            }
            let skuId = this.detailData.skuId;
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
              this.detailData.saleNumStep != ""
                ? this.detailData.saleNumStep
                : 1;
            this.minNum =
              this.detailData.saleNumBegin != ""
                ? this.detailData.saleNumBegin
                : 1;
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
            if (cActivity && cActivity.activityPriceLevel == 2) {
              this.singleActivities_2.push(cActivity);
              this.curSingleActivity = cActivity;
            }
            let skuAList = this.detailData.skuActivityList;
            for (let i = 0; i < skuAList.length; i++) {
              let saitem = skuAList[i];
              if (saitem.activityId == cActivity.activityId) {
                continue;
              }
              if (saitem.activityPriceLevel == 2) {
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
              this._getDetailComment(this.skuId);
            }
            this.detailShow = true;
            this._getCustomStock();
            this._getCollectState();
            this.setWxShareArgs();
            // 视频
            this.arrLen = this.detailData.picUrls.length;
            let vurl = this.detailData.proSkuMediaModel.videoUrl;
            // vurl = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
            if (vurl && vurl != undefined && vurl != "" && vurl != " ") {
              this.arrLen++;
              this.videoUrl = vurl;
              this.playerOptions.sources[0].src = vurl;
              this.swiperOption.autoplay = false;
              this.swiperOption.loop = false;
              this.proImgIndex = 0;
            }
            this.$userCenter._getCartCount();

            // 只有活动基本为2的活动才，参与孙哥的接口，其他的都需要传空
            if (this.detailData.mktActivityPriceLevel == "2") {
              this.activityId = this.detailData.activityId;
            } else {
              this.activityId = "";
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
      let url = "/app/json/app_cart/SettleCart";
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
            this.$nextTick(() => {
              this.collectName = "collectName";
            });
          } else {
            this.$Toast(data.info);
            this.collectName = "collectName";
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
      shareData.detailurl =
        shareData.detailurl +
        "&shareDeliveryType=" +
        this.detailData.deliveryType;
      // if (this.detailData.deliveryType == 1) {
      shareData.detailurl =
        shareData.detailurl +
        "&storeID=" +
        this.$store.state.mall2.zitiAddress.id;
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
      if (this.$store.state.login.token != "") {
        this._getDetailComment(this.skuId);
      }
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
      this.$Loading.open();
      let url = "/app/json/user_address/getSysStoreById";
      let idStr = this.$route.query.storeID || "";
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
      if (this.$store.state.webtype == 2) {
        let shareData = {};
        shareData = {};
        shareData.title = this.detailData.skuName;
        shareData.sharetext = this.detailData.skuName;
        shareData.imageurl = this.detailData.phMainUrl;
        shareData.detailurl =
          this.$store.state.globalConfig.wxBaseUrl +
          Config.shareUrl +
          this.$route.fullPath;
        shareData.detailurl =
          shareData.detailurl +
          "&shareDeliveryType=" +
          this.detailData.deliveryType;
        // if (this.detailData.deliveryType == 1) {
        shareData.detailurl =
          shareData.detailurl +
          "&storeID=" +
          this.$store.state.mall2.zitiAddress.id;
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

        wxfunc.getWechatSignature(isSignature => {
          //签名成功
          if (isSignature) {
            wxfunc.wxSetShareData(shareData);
          } else {
          }
        });
      } else if (this.$store.state.webtype == 3) {
        let path = wxfunc.wxmpPath(this.$route);
        let shareData = {
          title: this.detailData.skuName,
          path: `${Config.shareUrl}${path}`,
          imageUrl: this.detailData.phMainUrl,
          rfrCode: this.$store.state.userInfo
            ? this.$store.state.userInfo.userId
            : ""
        };
        wx.miniProgram.postMessage({ data: JSON.stringify(shareData) });
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
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.auction-desc-modal {
  border-radius 5px;
  width 75%;
  .title {
    text-align center;
    font-size 16px;
    padding-top 20px;
  }
  .content {
    font-size 13px;
    line-height 16px;
    padding 10px 20px 0;
    color #383838;
  }
  .close-btn {
    margin-top 15px;
    font-size 14px;
    color #fff;
    text-align center;
    background-color $color-theme-r;
    padding 15px 0;
  }
}

.detail {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  // 购买弹窗
  .buy-pop {
    .product-info {
      padding 15px 10px 10px;
      display flex;
      .prod-img {
        display block;
        width 90px;
        height 98px;
        margin 10px;
      }
      .right {
        flex 1;
        padding 10px;
        display flex;
        flex-direction column;
        justify-content space-around;
        .prod-name {
          font-size 15px;
          line-height 18px;
        }
        .current-price {
          color: $color-text-d
          font-size 12px;
          .price {
            color $color-theme-r;
            font-weight 700;
            .num {
              font-weight 700;
              font-size 20px;
              font-style normal;
            }
          }
        }
      }
    }
    .purchase-amount {
      padding 0 15px;
      .top {
        display flex;
        justify-content space-between
        align-items center;
        .name {
          font-size 15px;
        }
      }
      .tip {
        font-size 13px;
        color $color-text-d
        text-align right;
        padding-top 10px;
      }
    }
    .cannot-buy {
      font-size 16px;
      padding 0 15px;
      color #333;
    }
    .pop-submit-btn {
      position absolute
      left 0;
      right 0;
      bottom 0;
      height 50px;
      line-height 50px;
      text-align center;
      background-color $color-theme-r;
      color #fff;
      font-size 18px;
      font-weight 700
      &.disabled {
        background-color #999999
      }
    }
  }

  // 拍卖
  .auction-state {
    height 60px;
    line-height 60px;
    background-color: #ffeae9
    position relative
    .state-text {
      height 100%;
      background-color: $color-theme-r
      display inline-block;
      font-size 18px;
      color #fff;
      font-weight 700
      padding 0 15px;
    }
    .countdown {
      display inline-block
      color $color-theme-r
      padding-left 8px;
      font-size 13px;
      .reset-countdown {
        display inline-block;
        color $color-theme-r
        font-size 18px;
        .item {
          display: inline-block;
          width: 22px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          background-color: $color-theme-r;
          border-radius 3px;
          padding 1px 0
        }
      }
    }
    .progress-rate {
      font-size 10px;
      color $color-theme-r
      padding 0 15px;
      text-align center;
      position absolute
      right 0
      top 50%;
      transform translateY(-50%);
      .limit {
        line-height 16px;
      }
      .progress-c {
        width 60px;
        height 6px;
        background-color: #fff;
        border-radius 3px;
        margin-top 4px;
        position relative
        overflow hidden;
        .progress-portion {
          display block;
          position absolute;
          left 0;
          top 0;
          height 100%
          background-color: $color-theme-r;
          border-radius 3px;
        }
      }
    }
    
    .finished-time {
      display inline-block
      padding-left 8px;
      font-size 13px;
      color $color-text-d
    }
    &.finished {
      background-color: #dddedd
      .state-text {
        background-color: #b5b5b7
      }
    }
  }
  // 商品信息
  .prod-info {
    background-color: #FFF;
    padding 15px;
    .name {
      font-size 18px;
      line-height 21px;
      ellipse-2()
      .tip {
        display inline-block;
        font-size 11px;
        color #fff;
        background-color: $color-theme-r;
        height 16px;
        line-height 16px;
        border-radius 8px;
        padding 0 5px;
        vertical-align middle;
        margin-right 8px;
      }
    }
    .price-c {
      margin-top 10px;
      font-size 12px;
      .price-name {
        display inline-block;
        color $color-text-d
      }
      .price {
        display inline-block;
        color $color-theme-r
        font-weight 700
        .num {
          font-size 20px;
          font-weight 700;
        }
      }
    }
    .sub-info {
      margin-top 10px;
      display flex;
      justify-content space-between;
      font-size 13px;
      .rule {
        color $color-theme-r
        .tip-icon {
          display inline-block;
          width 14px;
          height 14px;
          vertical-align bottom;
          margin-right 5px;
        }
      }
      .lookers {
        color $color-text-d
      }
    }
    
    &.finished {
      .sub-info {
        .rule {
          color $color-text-d
        }
      }
    }
  }
  // 拍卖信息
  .auction-info {
    background-color: #FFF
    border-radius 8px;
    box-shadow 0 0 5px #efefef;
    padding 15px 10px;
    margin 10px 8px 0;
    .title {
      font-size 17px;
    }
    .info-c {
      margin-top 8px;
      font-size 14px;
      display flex;
      color #323232
      .name {
        display block;
        width 120px;
      }
      .content {
        .description {
          vertical-align middle;
          margin-left 5px;
          font-size 16px;
        }
      }
    }
  }
  // 成交记录
  .transaction-record {
    background-color: #FFF
    border-radius 8px;
    box-shadow 0 0 5px #efefef;
    padding 15px 10px;
    margin 10px 8px 10px;
    .top-title {
      display flex;
      justify-content space-between
      align-items center;
      .total-num {
        font-size 15px;
      }
      .more-btn {
        font-size 12px;
        color #323232;
        .icon {
          font-size 12px;
          display inline-block;
          margin-left 5px;
        }
      }
    }
    .record-list {
      margin-top 10px;
      font-size 13px;
      color #323232
      .tip {
        display inline-block
        height 18px;
        line-height 18px;
        background-color: $color-theme-r;
        padding 0 5px;
        color #fff;
        font-size 12px;
        border-radius 9px;
      }
    }
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
          max-height: 375px;
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

  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    box-shadow: 0 -2px 2px #efefef;
    z-index: 9;
    display: flex;

    .btn {
      position: relative;
      text-align: center;
      padding: 6px;

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
        margin-left: -13px;
        width: 26px;
        height: 26px;
      }

      .text {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 6px;
        text-align: center;
      }

    }

    .full {
      flex: 1;
    }

    .settlement-btn {
      height 50px;
      line-height 50px;
      text-align center;
      width 100%;
      background-color $color-theme-r;
      color #fff;
      font-size 18px;
      font-weight 700
      &.not-start {
        background-color #999999
      }
    }
  }
}
</style>
