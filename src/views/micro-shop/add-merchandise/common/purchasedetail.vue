
<template>
  <div class="detail mall2">
    <div class="detail-content" v-if="loaded">
      <div class="nav-top"
           :style="{top: $store.state.barHeight+ 'px','height': $market.getNavHeight(true)+'px','line-height': $market.getNavHeight(true)+'px'}">
        <div class="nav-back-btn" style="left: 10px;top: 5px;width: 34px; height: 34px; padding: 5px;"
             @click="backEvent">
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/back.png"/>
        </div>
      </div>
      <div class="scroll-div" :style="{top: $store.state.barHeight+'px'}">
        <div class="swiper-div theme_bg_white" @click="showBigImageEvent">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(pic, pidx) in getProductImgs()" :key="pidx">
              <div class="swiper-img-div">
                <img :src="pic"/>
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-index">
            <div class="si-item theme_bg_white_ef"
                 :class="{'cus-index': proImgIndex == idx, theme_bg_red_i: proImgIndex == idx}"
                 v-for="(pic, idx) in getProductImgs()"></div>
          </div>
        </div>
        <div class="pro-info">
          <div class="price theme_font_red">
            <div class="price-item" v-for="(price, idx) in getPrices()">
              <p class="xian" v-if="idx != 0"> ~ </p>
              <p>¥</p>
              <p class="big">{{price.iNum}}.</p>
              <p>{{price.dNum}}</p>
            </div>
          </div>
          <p class="title single-line">{{detailData.showTitle}}</p>
          <p class="theme_font_gray">起购数量：{{detailData.minPurNumber}}</p>
        </div>
        <div class="block-div theme_bg_white">
          <div class="flex-row">
            <div class="theme_font_gray full">采购价格说明</div>
          </div>
          <div class="flex-row" v-for="item in detailData.purPriceRules">
            <div class="theme_font_common full">购买数量 {{item.number}}</div>
            <div class="theme_font_common">售价： </div>
            <div class="theme_font_red"> ¥{{$util.toDecimal2(item.price)}}</div>
          </div>
        </div>
        <div class="block-div theme_bg_white" v-if="deliverType == '2'">
          <div class="flex-row" style="align-items: flex-start;" @click="selectArea">
            <div class="label-min theme_font_gray">送至</div>
            <div class="theme_font_black full address-div" v-if="$store.state.mall2.selectAddress.id == ''">
              请选择配送区域
            </div>
            <div class="theme_font_black full address-div" v-if="$store.state.mall2.selectAddress.id != ''">
              {{$store.state.mall2.selectAddress.addressFull}}
            </div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
        </div>
        <div class="block-div theme_bg_white" v-if="deliverType == '1'">
          <div class="flex-row" style="align-items: flex-start;" @click="selectPickUpAddress">
            <div class="label-middle theme_font_gray">自提点</div>
            <div class="theme_font_black full">{{$store.state.mall2.zitiAddress.storeName}}</div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
        </div>
        <div class="btns-div theme_bg_white">
          <div class="btn-item theme_font_gray" :class="{theme_font_red_i: introductionIndex == 1}"
               @click="introductionSelected(1)">商品介绍
          </div>
          <div class="btn-item theme_font_gray" :class="{theme_font_red_i: introductionIndex == 2}"
               @click="introductionSelected(2)">规格参数
          </div>
          <div class="btn-item theme_font_gray" :class="{theme_font_red_i: introductionIndex == 3}"
               @click="introductionSelected(3)">售后包装
          </div>
        </div>
        <div class="detail-detail">
          <div v-html="introduction1" class="introduction-div" v-if="introductionIndex == 1"></div>
          <div v-html="introduction2" class="introduction-div" v-if="introductionIndex == 2"></div>
          <div v-html="introduction3" class="introduction-div" v-if="introductionIndex == 3"></div>
        </div>
      </div>
    </div>
    <!-- 底部导航 -->
    <div class="bottom-btns" v-if="loaded">
      <div v-if="!Object.keys(objStype).length" class="bottom-box add">
        <div class="addText theme_font_white theme_standard_bg" @click="addMethod" v-if="listData.hidden==0">
          <p class="title">{{'添加'}}</p>
        </div>
        <div class="addText theme_font_white theme_standard_bg" v-else>
          <p class="title">{{'已添加'}}</p>
        </div>
      </div>
      <div v-else class="bottom-box upDown">
        <div v-if='!isRecommend' class="btn" :class="objStype.queryType==1?'theme_standard_font_i':'theme_standard_bg theme_font_white'" @click="upDownMethod"  >
          <span class="iconfont">{{objStype.queryType==1?'下架':'上架'}}</span>
        </div>
        <div v-if="objStype.queryType==1" class="btn theme_font_white theme_standard_bg" @click="upDownShareMethod" >
          <p class="title">分享推广</p>
        </div>
      </div>
    </div>
    <!-- 分享 -->
    <Share v-if="popupShow" :shareObj="shareObj" @setshareData="setshareData"/>
  </div>
</template>

<script>
    import purchase from './js/index'
    import { mapGetters } from "vuex";
    import Share from "../../common/share.vue";
    import Address from "@/components/mall2/common/address"
    import PickupAddress from '@/components/mall2/common/pickup-address'


    export default {
        name: "detail",
        components: { Share },
        data() {
            let that = this
            return {
                id: '',
                objStype: {},
                listData: {},
                popupShow: false,
                shareObj: {
                  groupFlag: 0,
                  popupShow: false
                },
                skuId: '',
                isRecommend: 1,
                detailData: {},
                loaded: false,
                proImgIndex: 0,
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
                selectedNum: 1,
                introductionIndex: 1,
                introduction1: '',
                introduction2: '',
                introduction3: '',
                deliverType: this.$store.state.mall2.staticDeliverType,
            }
        },
        computed: {
          ...mapGetters(["getPutaggregate"])
        },
        methods: {
            selectPickUpAddress: function () {
                PickupAddress.open({
                    initData: {
                        selectedId: this.$store.state.mall2.zitiAddress.id,
                        token: this.$store.state.login.token,
                        posx: this.$store.state.currentLocation.posx,
                        posy: this.$store.state.currentLocation.posy,
                        skuIds: [this.detailData.id]
                    },
                    addressEvent: (selected) => {
                        PickupAddress.close()
                        if (selected) {
                            this.$store.state.mall2.zitiAddress = selected;
                            this.$bridgefunc.vuexStorage()
                            this.$userCenter._setDefaultPickupAddress(selected.id);
                        }
                    },
                    otherAddressEvent: () => {
                        let path = '/mall2/selfliftingsite';
                        let arr = [this.detailData.id]
                        this.$router.push({
                            path: path,
                            query: {
                                skuIds: JSON.stringify(arr)
                            }
                        })
                        PickupAddress.close()
                    }
                })
            },
            selectArea: function () {
                Address.open({
                    initData: {
                        selectedId: this.$store.state.mall2.selectAddress.id,
                        token: this.$store.state.login.token
                    },
                    addressEvent: (selected, saddress) => {
                        this.$store.state.mall2.selectAddress = selected;
                        this.$bridgefunc.vuexStorage()
                        Address.close()
                    }
                })
            },
            backEvent: function () {
                this.$router.go(-1)
            },
            introductionSelected: function (idx) {
                this.introductionIndex = idx
            },
            getPrices: function () {
                return purchase.getPriceShow(this.detailData.purPriceRules)
            },
            getProductImgs: function () {
                let str = this.detailData.picUrlJson
                let arr = str.split(',')
                return arr
            },
            showBigImageEvent: function () {

            },
            getPurchaseDetail: function () {
                let url = '/app/json/pro_sku_purchase/queryPurchaseDetail'
                let paramsData = {
                    id: this.id
                };
                this.$Loading.open()
                this.$http.post(url, paramsData).then(
                    res => {
                        this.$Loading.close();
                        let data = res.data;
                        if (data.status == 0) {
                            this.detailData = data.data
                            this.selectedNum = this.detailData.minPurNumber
                            this.introduction1 = this.detailData.proSkuMedia.mobileDetail
                            this.introduction2 = this.detailData.proSkuMedia.mobileParam
                            this.introduction3 = this.detailData.afterHelp
                            // this.generateSelectedText()
                            this.loaded = true
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
            addMethod() {
                // 添加
                this.$messagebox
                    .confirm(`确定要添加该商品到店铺吗!`, "提示")
                    .then(action => {
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
                                    this.listData.hidden = 1;
                                    eventBus.$emit('setlistData', this.skuId)
                                    let microShoListData = JSON.parse(sessionStorage.getItem('microShoListData'))
                                    microShoListData.hidden = 1
                                    sessionStorage.setItem('microShoListData',JSON.stringify(microShoListData))
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
                this.$messagebox.confirm( `确定要${this.objStype.queryType == 1 ? "下架" : "上架"}该商品吗!`, "提示" ) .then(action => {
                    let status = this.objStype.queryType == 1 ? "0" : "1";
                    this.$Loading.open();
                    console.log(1)
                    this.$http.post("/app/json/app_distribution_order/updateProFromMicroStore", {
                        skuId: this.skuId,
                        storeId: this.getPutaggregate.id,
                        status: status
                      }).then(res => {
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
                }).catch(() => {});
            },
            upDownShareMethod() {
                // 上下架分享
                this.shareObj = Object.assign({},{proSkuDistributionId: this.proSkuDistributionId}, this.shareObj, this.detailData,{deliverType:this.detailData.deliveryType,salePrice: this.detailData.activityPrice});
                this.popupShow = true;
                this.shareObj.popupShow = true;
                this.shareObj.groupFlag = this.$route.query.groupFlag;
            },
            setshareData(item) {
                this.popupShow = false;
                this.shareObj = Object.assign({}, item);
            }
        },
        created() {
            this.id = this.$route.query.id
            this.skuId = this.$route.query.skuId ? this.$route.query.skuId : "";
            // this.objStype = this.$route.query.obj ? this.$route.query.obj : {};
            // this.listData = this.$route.query.listData ? this.$route.query.listData : {};
            if (this.$route.query.obj) {
                if (Object.prototype.toString.call(this.$route.query.obj) == "[object String]") {
                    this.objStype = JSON.parse(sessionStorage.getItem('microShoStype'))
                } else {
                    this.objStype = this.$route.query.obj
                    sessionStorage.setItem('microShoStype', JSON.stringify(this.objStype))
                }
            } else {
                this.objStype = {}
            }
            if (this.$route.query.listData) {
                if (Object.prototype.toString.call(this.$route.query.listData) == "[object String]") {
                    this.listData = JSON.parse(sessionStorage.getItem('microShoListData'))
                } else {
                    this.listData = this.$route.query.listData
                    sessionStorage.setItem('microShoListData', JSON.stringify(this.listData))
                }
            } else {
                this.listData = {}
            }
            this.isRecommend = this.$route.query.isRecommend
            this.getPurchaseDetail()
        },
        beforeRouteLeave (to, from, next) {

            if (to.path == '/mall2/purchaseplace' || to.path == '/mall2/selfliftingsite') {

            } else {
                this.$keepaliveHelper.deleteCache(this)
            }
            next()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  @import "~@/common/stylus/mixin.styl"
  @import "./css/price.styl"
  .detail {
    position: relative;
    width 100%
    height 100%
    overflow hidden

    .detail-content {
      // width 100%;
      // height 100%;
      // position relative;
      .nav-top {
        position absolute;
        left 0;
        right 0;
        z-index 9;
      }

      .scroll-div {
        position absolute;
        top 0px;
        bottom 48px;
        left 0;
        right 0;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .swiper-div {
          position relative;
          width 100%;
          height 375px;

          .swiper-img-div {
            img {
              display block;
              width 100%;
              /*max-height 375px;*/
              height 375px;
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

        .pro-info {
          padding 5px 12px 15px;
          box-shadow 0 0 8px #eee;
          .title {
            padding 8px 0;
            font-size 14px;
            font-weight 500;
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
        .detail-detail {
          .introduction-div {
            margin-top 2px;
            width 100%;

            img {
              width 100%;
            }
          }
        }
      }
    }
    .price {
      font-size 12px;
      display flex;
      align-items center
      font-weight 500;

      .price-item {
        display flex;
        align-items flex-end;
        line-height 1;

        .xian {
          font-size 16px;
          padding 0 2px;
        }

        .big {
          font-size 20px;
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
</style>
