/**Created by liaoyingchao on 2019-04-26.*/

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
        <div class="block-div theme_bg_white">
          <div class="flex-row" @click="proSelectEvent">
            <div class="label-min theme_font_gray">已选</div>
            <div class="theme_font_black" style="font-weight: 500;">{{selectedText}}</div>
            <!--<div class="theme_font_black">1件</div>-->
            <div class="full"></div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
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
          <!--<div class="tip" v-if="introductionIndex == 1">-->
            <!--<span class="line"></span>-->
            <!--<span class="text">商品信息</span>-->
            <!--<span class="line"></span>-->
          <!--</div>-->
          <div v-html="introduction1" class="introduction-div" v-if="introductionIndex == 1"></div>
          <div v-html="introduction2" class="introduction-div" v-if="introductionIndex == 2"></div>
          <div v-html="introduction3" class="introduction-div" v-if="introductionIndex == 3"></div>
        </div>
      </div>
      <div class="detail-bottom-btn theme_bg_y" @click="showPop = true">立即购买</div>
    </div>
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pro-row">
          <div class="img-div">
            <img :src="detailData.picMainUrl">
          </div>
          <div class="info-div">
            <div class="title theme_font_black">{{detailData.showTitle}}</div>
            <div class="price theme_font_red">
              <div class="price-item" v-for="(price, idx) in getPrices()">
                <span class="xian" v-if="idx != 0"> ~ </span>
                <span>¥</span>
                <span class="big">{{price.iNum}}.</span>
                <span>{{price.dNum}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pop-scroll-div">
          <div class="block-div theme_bg_white" style="margin: 0; padding: 8px;box-shadow: none;">
            <div class="flex-row">
              <div class="theme_font_gray full">采购价格说明</div>
            </div>
            <div class="flex-row" v-for="item in detailData.purPriceRules">
              <div class="theme_font_common full">购买数量 {{item.number}}</div>
              <div class="theme_font_common">售价： </div>
              <div class="theme_font_red"> ¥{{$util.toDecimal2(item.price)}}</div>
            </div>
          </div>
          <div class="count-line">
            <div class="full theme_font_common">购买数量</div>
            <!--<Counter v-model="selectedNum" :minValue="detailData.minPurNumber" :maxValue="100000"-->
                     <!--@numChange="numChange"></Counter>-->
            <van-stepper v-model="selectedNum" :min="detailData.minPurNumber" :max="100000" @change="numChange" integer/>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent">确定
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import purchase from './js/index'
  // import Counter from '@/components/commonui/counter/counter'
  import Address from '../common/address'
  import PickupAddress from '../common/pickup-address'

  export default {
    name: "detail",
    components: {
      // Counter
    },
    data() {
      let that = this
      return {
        id: '',
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
        showPop: false,
        deliverType: this.$store.state.mall2.staticDeliverType,
      }
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
      numChange: function () {
        this.generateSelectedText()
      },
      popClose: function () {
        this.showPop = false
      },
      popSureEvent: function () {
        let arr = this.detailData.purPriceRules
        let lastNum = this.detailData.minPurNumber;
        let price = this.detailData.minPurPrice
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          let num = item.number
          let prc = item.price
          if (this.selectedNum >= num) {
            if (num > lastNum) {
              lastNum = num
              price = prc
            }
          }
        }
        this.$router.push({
          path: '/mall2/purchaseplace',
          query: {
            id: this.id,
            number: this.selectedNum,
            img: this.detailData.picMainUrl,
            showTitle: this.detailData.showTitle,
            price: price
          }
        })
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      introductionSelected: function (idx) {
        this.introductionIndex = idx
      },
      generateSelectedText: function () {
        this.selectedText = ''
        this.selectedText += this.selectedNum + (this.detailData.metric ? this.detailData.metric : '件')
      },
      proSelectEvent: function () {
        this.showPop = true
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
              this.generateSelectedText()
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
      }
    },
    created() {
      this.id = this.$route.query.id
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
  .detail {
    width 100%
    height 100%
    overflow hidden

    .detail-content {
      width 100%;
      height 100%;
      position relative;

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
      .detail-bottom-btn {
        position absolute;
        bottom 0px;
        left 0;
        right 0;
        height 48px;
        line-height 48px;
        font-weight 500;
        font-size 18px;
        color white;
        text-align center;
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
</style>
