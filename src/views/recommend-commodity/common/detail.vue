
<template>
  <div class="detail mall2">
    <!-- 回退 -->
    <div
      ref="detailTop2"
      class="detail-top"
      :style="{height: ($store.state.barHeight+$market.getNavHeight(true))+ 'px'}"
    >
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
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/back.png">
        </div>
      </div>
    </div>
    <!-- 商品信息 -->
    <div
      ref="scrollView"
      class="scroll-div theme_bg_white"
      :style="getScrollTop()"
      v-if="detailShow"
    >
      <swiper class="main-swiper" ref="mySwiper" :options="mainSwiper">
        <swiper-slide>
          <div class="main-swiper" style="position: relative;">
            <transition name="transition1">
              <div class="main-swiper theme_bg_white_f5" style="position: absolute;">
                <pull-to
                  ref="pullTo1"
                  :bottomConfig="{pullText: '', triggerText: '释放显示商品详情', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                  :is-bottom-bounce="true"
                  :is-top-bounce="false"
                  :doSiteCallback="true"
                >
                  <div>
                    <!-- 轮播图 -->
                    <div class="swiper-div theme_bg_white">
                      <swiper :options="swiperOption">
                        <swiper-slide v-for="(pic, pidx) in detailData.picUrls" :key="pidx">
                          <div class="swiper-img-div">
                            <img :src="pic">
                          </div>
                        </swiper-slide>
                      </swiper>
                      <div class="swiper-index">
                        <div
                          class="si-item theme_bg_white_ef"
                          :class="{'cus-index': proImgIndex == idx, theme_bg_red_i: proImgIndex == idx}"
                          v-for="(pic, idx) in detailData.picUrls"
                          :key="idx"
                        ></div>
                      </div>
                    </div>
                    <!-- 文字描述 价格 -->
                    <div class="base-info theme_bg_white">
                      <div class="price">
                        <span class="font-small theme_font_red">单价 ￥</span>
                        <span class="price-z theme_font_red" style="argin-left: -4px;">{{getInteger(detailData.salePrice)}}</span>
                        <span class="font-small theme_font_red">.{{getDecimals(detailData.salePrice)}}</span>
                        <!-- &nbsp;&nbsp;
                        <span class="theme_font_red theme_border_red font-small" style="border: 1px solid; font-size 8px; border-radius: 2px">
                          <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                          <span style="padding: 0 1px">¥{{(parseInt(detailData.profit || 0.00 * 100 ) / 100 ).toFixed(2)}}</span>
                        </span> -->
                         <!-- <PriceOrder :detailitem="detailData"></PriceOrder> -->
                        <!-- <span
                          class="theme_standard_font_i"
                        >{{`单价：${detailData.dpedData.linePrice}元`}}</span> &nbsp;&nbsp;&nbsp;&nbsp; -->
                        <!-- <span
                          class="price-x theme_standard_font_i"
                          v-if="profit"
                        >
                          利润：
                          <i>{{`${profit} ${text(detailData.rewardType)}`}}</i>
                        </span> -->
                      </div>
                      <div class="row">
                        <div
                          class="title theme_font_black"
                        >{{detailData.showTitle || detailData.skuName}}</div>
                      </div>
                      <!-- <div class="activity">
                        <div
                          class="act-item theme_standard_font_i single-line"
                          v-for="(activity, aidx) in showActivities"
                          :key="aidx"
                        >{{activity}}</div>
                      </div> -->
                    </div>
                    <!-- 配送方式 -->
                    <div class="block-div theme_bg_white fullType">
                      <div class="label-middle theme_font_gray">配送方式</div>
                      <div
                        class="theme_font_black full"
                      >{{detailData.deliveryType == '1' ? '自提' : '配送'}}</div>
                    </div>
                    <!-- 运费 -->
                    <div class="block-div theme_bg_white fullType">
                      <div class="label-middle theme_font_gray">运费</div>
                      <div
                        class="theme_font_black full"
                      >{{detailData.deliveryType == '1' ? '配送' : '卖家包邮'}}</div>
                      <div class="label-middle theme_font_gray saleNum">累计销售</div>
                      <div class="theme_font_black full">{{detailData.saleNum || 0}}</div>&nbsp;
                      <div class="label-middle theme_font_gray">件</div>
                    </div>
                    <!-- 自提点 -->
                    <div
                      class="block-div theme_bg_white fullTypeZ"
                      v-if="detailData.deliveryType == '1'"
                      @click="selectPickUpAddress"
                    >
                      <div class="label-middle theme_font_gray">自提点</div>
                      <div class="theme_font_black">{{$store.state.mall2.zitiAddress.storeName}}</div>
                      <div>
                        <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                      </div>
                    </div>
                    <!-- 商品介绍 -->
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
                    <div class="detail-div detail-div-1">
                      <!-- <pull-to
                        ref="pullTo2"
                        :topConfig="{pullText: '', triggerText: '释放显示商品介绍', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                        :is-bottom-bounce="false"
                        :is-top-bounce="true"
                      > -->
                        <div class="detail-content detail-bottom">
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
                      <!-- </pull-to> -->
                    </div>
                  </div>
                </pull-to>
              </div>
            </transition>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 底部导航 -->
    <div class="bottom-btns" v-if="detailShow">
      <div v-if="!Object.keys(objStype).length" class="bottom-box add">
        <!-- <div class="addIco theme_standard_font_i" v-if="listData.hidden==0" @click="addMethod">
          添加
        </div>
        <div class="addText theme_font_white theme_standard_bg" @click="shareMethod">
          <p class="title">分享推广</p>
        </div> -->
        <div class="addText theme_font_white theme_standard_bg" @click="addMethod" v-if="listData.hidden==0">
          <p class="title">{{'添加'}}</p>
        </div>
        <div class="addText theme_font_white theme_standard_bg" v-else>
          <p class="title">{{'已添加'}}</p>
        </div>
      </div>
      <div v-else class="bottom-box upDown">
        <div
          v-if='!isRecommend'
          class="btn"
          :class="objStype.queryType==1?'theme_standard_font_i':'theme_standard_bg theme_font_white'"
          @click="upDownMethod"
        >
          <span class="iconfont">{{objStype.queryType==1?'下架':'上架'}}</span>
        </div>
        <div
          v-if="objStype.queryType==1"
          class="btn theme_font_white theme_standard_bg"
          @click="upDownShareMethod"
        >
          <p class="title">分享推广</p>
        </div>
      </div>
    </div>
    <!-- 分享 -->
    <Share v-if="popupShow" :shareObj="shareObj" @setshareData="setshareData"/>
  </div>
</template>

<script>
import PullTo from "@/components/Vendor/vue-pull-to/vue-pull-to";
import PickupAddress from "@/components/mall2/common/pickup-address";
// import Share from "../../common/share.vue";
import { mapGetters } from "vuex";
import eventBus from '@/utils/eventBus.js'
import PriceOrder from '@/components/commonui/price/price-order'

export default {
  name: "detail",
  components: {
    PullTo,
    PickupAddress,
    // Share,
    PriceOrder
  },
  computed: {
    ...mapGetters(["getPutaggregate"])
  },
  data() {
    let that = this;
    return {
      id: "",
      skuId: "",
      productType: "",
      proImgIndex: 1,
      deliveryType: 2,
      showActivities: ["团购", "领券", "积分兑换"],
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
        scrollbarHide: false
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
      selectedNum: 1,
      stepNum: 1,
      maxNum: 1,
      minNum: 1,
      stockNum: 1,
      detailData: {},
      detailShow: false,
      detailComment: {},
      commentListShow: false,
      selectedAddress: "",
      showSelect: false,
      regionText: "请选择配送区域",
      region: [],
      initData: {
        title: "请选择地区"
      },
      recommendListShow: false,
      myFeatures: [],
      introduction1: "",
      introduction2: "",
      introduction3: "",
      backLoadStock: false,
      picUrls: [],
      lastPath: "",
      // 活动剩余库存
      mktStockNum: -1,
      // 活动id 秒杀的时候才有
      activityId: "",
      // 。。。。。。。。。。。。。。。。。。、
      popupShow: false,
      shareObj: {
        popupShow: false
      },
      objStype: {},
      profit: "",
      listData: {},
      storeOuCode: '',
      isRecommend: 1
    };
  },
  methods: {
    getInteger: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0]
    },
    getDecimals: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1]
    },
    text(rewardType){
      // 3 积分 8 油滴 9 豌豆 12 元
      let text = ''
      if(rewardType == 3){
        text = '积分'
      }else if(rewardType == 8){
        text = '油滴'
      }else if(rewardType == 9){
        text = '豌豆'
      }else if(rewardType == 0){
        text = '元'
      }
      return text
    },
    getScrollTop: function() {
      return "top: " + this.$store.state.barHeight + "px;";
    },
    backEvent: function() {
      this.$router.go(-1);
      // this.$keepaliveHelper.deleteCache(this)
    },
    setshareData(item) {
      this.popupShow = false;
      this.shareObj = Object.assign({}, item);
    },
    introductionSelected: function(idx) {
      this.introductionIndex = idx;
    },
    addMethod() {
      // 添加
      this.$messagebox
        .confirm(`确定要添加该商品到店铺吗!`, "提示")
        .then(action => {
          this.$Loading.open();
          this.$http
            .post("/app/json/app_distribution_order/addProToMicroStore", {
              skuId: this.id,
              storeId: this.getPutaggregate.id
            })
            .then(res => {
              this.$Loading.close();
              if (res.data.status == 0) {
                this.$Toast("添加成功!");
                this.listData.hidden = 1;
                eventBus.$emit('setlistData', this.skuId)
              } else {
                this.$Toast(res.data.info);
              }
            });
        })
        .catch(() => {});
    },
    shareMethod() {
      // 添加分享
      if (this.listData.hidden != '1') {
        this.$Loading.open();
        this.$http
          .post("/app/json/app_distribution_order/addProToMicroStore", {
            skuId: this.skuId,
            storeId: this.getPutaggregate.id
          })
          .then(res => {
            this.$Loading.close();
            if (res.data.status == 0) {
              this.$Toast("添加成功!");
              this.listData.hidden = 1
              eventBus.$emit('setlistData', this.skuId)
              this.shareObj = Object.assign({}, this.shareObj, this.detailData);
              this.popupShow = true;
              this.shareObj.popupShow = true;
            } else {
              this.$Toast(res.data.info);
            }
          });
      } else {
        this.shareObj = Object.assign({}, this.shareObj, this.detailData);
        this.popupShow = true;
        this.shareObj.popupShow = true;
      }
    },
    upDownMethod() {
      // 上下架
      this.$messagebox
        .confirm(
          `确定要${this.objStype.queryType == 1 ? "下架" : "上架"}该商品吗!`,
          "提示"
        )
        .then(action => {
          let status = this.objStype.queryType == 1 ? "0" : "1";
          this.$Loading.open();
          this.$http
            .post("/app/json/app_distribution_order/updateProFromMicroStore", {
              skuId: this.skuId,
              storeId: this.getPutaggregate.id,
              status: status
            })
            .then(res => {
              this.$Loading.close();
              if (res.data.status == 0) {
                this.$Toast(
                  `${this.objStype.queryType == 1 ? "下架" : "上架"}成功!`
                );
                this.objStype.queryType =
                  this.objStype.queryType == 1 ? "0" : "1";
              } else {
                this.$Toast(res.data.info);
              }
            });
        })
        .catch(() => {});
    },
    upDownShareMethod() {
      // 上下架分享
      this.shareObj = Object.assign({}, this.shareObj, this.detailData);
      this.popupShow = true;
      this.shareObj.popupShow = true;
    },
    selectPickUpAddress() {
      PickupAddress.open({
        initData: {
          selectedId: this.$store.state.mall2.zitiAddress.id,
          token: this.$store.state.login.token,
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy,
          skuIds: [this.detailData.id]
        },
        addressEvent: selected => {
          PickupAddress.close();
          if (selected) {
            this.$store.state.mall2.zitiAddress = selected;
            this.$bridgefunc.vuexStorage();
            // 切换自提点，刷新整个详情
            this._getProductDetail();
            // this._setDefaultPickupAddress(selected.id);
          }
        },
        otherAddressEvent: () => {
          this.backLoadStock = true;
          let path = "/mall2/selfliftingsite";
          let arr = [this.detailData.id];
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
    // 请求详情信息
    _getProductDetail: function() {
      this.$Loading.open();
      let url = "/app/json/product/getAppProDetail";
      let paramsData = {
        token: this.$store.state.login.token,
        productType: this.productType,
        skuId: this.id,
        storeOuCode: this.storeOuCode,
        featureValueIds: this.myFeatures,
        lng: this.$store.state.currentLocation.posx,
        lat: this.$store.state.currentLocation.posy,
        deliverType: this.deliveryType
      };
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
      if (this.deliveryType == 1) {
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
            if (this.detailData.remainNum === 0) {
              this.$Toast("活动商品库存已售空，需原价购买！");
            }
            let skuId = this.detailData.skuId;
            let deliveryType = this.$store.state.mall2.staticDeliverType;
            if(this.detailData.deliveryType == 1 || this.detailData.deliveryType == 2){
              deliveryType = this.detailData.deliveryType;
            }
            this.deliveryType = deliveryType;
            // this.$store.state.mall2.staticDeliverType = deliveryType;
            if (deliveryType == 1) {
              // InitialLoadPickupAny.checkIsInitialLoad(address => {
              //   if (address) {
              //     this._getProductDetail();
              //   }
              // });
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

            let skuAList = this.detailData.skuActivityList;
            for (let i = 0; i < skuAList.length; i++) {
              let saitem = skuAList[i];
              if (saitem.activityId == cActivity.activityId) {
                continue;
              }
            }
            // 全局价格处理
            let dpedData = this.$mallCommon.priceFromItem(this.detailData);
            this.detailData.dpedData = dpedData;
            this.introduction1 = this.detailData.proSkuMediaModel.mobileDetail;
            this.introduction2 = this.detailData.proSkuMediaModel.mobileParam;
            this.introduction3 = this.detailData.afterHelp;
            this.id = this.detailData.id;
            if (this.skuId != this.detailData.skuId) {
              // this.skuId = this.detailData.skuId;
              this.load3 = false;
            }
            this.detailShow = true;
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

    getDatas: function() {
      this._getProductDetail();
      if (this.$store.state.login.token != "") {
        this.$userCenter._getCartCount();
      }
    },
    //根据自提点的id去得到自提点
    getSysStoreById: function() {
      this.$Loading.open();
      let url = "/app/json/user_address/getSysStoreById";
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
          console.log("签名失败");
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
      this.$router.push({
        path: "/usercenter/loginbinding",
        query: {
          thirdUserId: this.$store.state.login.thirdUserId,
          code: this.$store.state.login.code,
          regChannel: 4,
          firstLevel: true,
          bindType: 4
        }
      });
    },
    // 获取当前库存
    _getCustomStock: function () {
      if (this.deliveryType == 2 && (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == undefined)) {
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
        //storeCode: this.detailData.storeOuCode
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
    }
  },
  created() {
    this.isRecommend = this.$route.query.isRecommend
    this.profit = this.$route.query.profit ? this.$route.query.profit : "";
    this.storeOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : "";
    this.objStype = this.$route.query.obj ? this.$route.query.obj : {};
    this.listData = this.$route.query.listData
      ? this.$route.query.listData
      : {};
    this.lastPath = this.$route.query.lastPath
      ? this.$route.query.lastPath
      : "";
    this.id = this.$route.query.id ? this.$route.query.id : "";
    this.skuId = this.$route.query.skuId ? this.$route.query.skuId : "";
    this.deliveryType = this.$route.query.deliveryType
    // this.deliveryType = this.$store.state.mall2.staticDeliverType;
    // this.selectedType = this.$store.state.mall2.staticDeliverType;
    this.productType = this.$route.query.productType
      ? this.$route.query.productType
      : "";
    this.activityId = this.$route.query.activityId
      ? this.$route.query.activityId
      : "";
    if (this.id == "" && this.skuId == "") {
      return;
    }
    this.getDatas();
  },
  activated() {
    // 选自提点的时候，回来需要刷新库存
    if (this.backLoadStock) {
      this._getCustomStock();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import "~@/common/stylus/mixin.styl"
// @import "./css/price.styl"

.detail {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

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

    .main-swiper {
      width: 100%;
      height: 100%;

      .block-div {
        margin-left: 0;
        margin-right: 0;
        border-radius: 0;
      }

      .fullType {
        padding: 18px;
        display: flex;
        align-items: center;

        .saleNum {
          margin-left: 20px;
        }

        .full {
          margin-left: 10px;
        }
      }

      .fullTypeZ {
        padding: 18px;
        display: flex;
        justify-content: space-between;
      }

      .main-swiper-scroll-content {
        position: absolute;
        top: 20px;
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
    }

    .base-info {
      padding: 8px 8px 16px;

      .row {
        padding: 8px 8px 0px;

        .title {
          font-weight: 500;
          font-size: $font-size-large;
          line-height: 20px;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .price {
        padding: 0 8px;

        .price-x {
          i {
            font-size: 14px;
            font-style: normal;
          }
        }
      }

      // .activity {
      //   display: flex;
      //   align-items: center;
      //   margin-left: 10px;

      //   .act-item {
      //     padding: 2px 8px;
      //     border-radius: 10px;
      //     border-width: 0.8px;
      //     border-style: solid;
      //     margin-right: 4px;
      //   }
      // }
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
        padding: 0 8px 10px;

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

      .btn-item:nth-child(n+2) {
        border-left: 1px solid #ddd;
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

    // z-index: 9;
    .bottom-box {
      display: flex;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      font-weight: 500;
    }

    .upDown {
      .btn {
        flex: 1;
      }
    }

    .add {
      .addIco {
        width: 100px;
      }

      .addText {
        flex: 1;
      }
    }
  }
}
</style>
