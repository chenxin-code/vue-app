/**Created by steven on 2018/6/12.*/
<template>
  <div class="Mall-GoodDetail">
    <div v-show="!has_goods" id="goods_is_null">
      <!--<img class="btn-img" src="../../../static/image/mall/null_goods.png"/>-->
      <p>商品已下架</p>
      <p @click="backEvent()">返回</p>
    </div>
    <nav-top @backEvent="backEvent" :noTitle="true" v-show="has_goods">
      <div class="detail-tab">
        <div class="tab-item" :class="{selected: item.id == tabSelected}" v-for="item in tabs"
             @click="tabEvent(item.id)" :style="getTabStyle()" v-bind:key="item.id">{{item.name}}
        </div>
      </div>
    </nav-top>
    <div ref="detailScrollDiv" class="detail-scroll"
         :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}" v-show="has_goods">
      <div ref="proImgsDiv" class="pro-imgs" v-if="detailImgs.length > 0">
        <swiper ref="mySwiper" :options="swiperOption">
          <swiper-slide v-for="(ad,index) in detailImgs" :key="index">
            <div class="swiper-arr"><img :src="ad.picUrl"/></div>
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination font-medium">
          <span class="big-num">{{ proImgIndex }}</span>
          <span>/</span>
          <span>{{ detailImgs.length }}</span>
        </div>
      </div>
      <div class="white-div top-line div-top-margin" v-if="hasData">
        <p class="row-p pro-title">{{detailProduct.skuName}}</p>
        <p class="row-p">
          <span class="theme-color">￥</span>
          <span class="theme-color sale-price">{{ $util.toDecimal2(detailProduct.salePrice) }}</span>
          <span class="cost-price">{{ getShowPrice(detailProduct.showPrice) }}</span>
        </p>
      </div>
      <div class="white-div font-medium div-top-margin" v-if="hasData">
        <p class="row-p" @click="popShowEvent">
          <span class="row-label">已选</span>
          <span class="row-value">{{ selectedData.num }}件</span>
          <img class="btn-img" src="../../../static/image/mall/more.png"/>
        </p>
      </div>
      <div class="white-div font-medium div-top-margin" v-if="hasData">
        <p class="row-p" @click="areaEvent">
          <span class="row-label">送至</span>
          <img class="loc-img" src="../../../static/image/mall/loc.png"/>
          <span class="row-place single-line">{{ orderPlace.id ? orderPlace.provinceName + orderPlace.cityName + orderPlace.countryName + orderPlace.townName + orderPlace.address : '请选择地址' }}</span>
          <span class="now-pro">{{stockNum > 0 ? '现货' : '无货'}}</span>
          <img class="btn-img" src="../../../static/image/mall/more.png"/>
        </p>
        <p class="row-p" style="margin-top: 12px;">
          <span class="row-label">服务</span>
          <span class="row-value single-line">由 {{detailProduct.storeName}} 提供服务</span>
        </p>
      </div>
      <div class="server-div" v-if="hasData">
        <div>
          <div class="server-item font-small-l" v-if="detailProduct.disMode==1">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>快递运输</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.disMode==2">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>电子码</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.disMode==3">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>上门自提</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.disMode==4">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>公益捐赠</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.disMode==5">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/><span>第三方配送</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.enableChange!==0">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>{{detailProduct.changeDays}}天无理由换货</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.enableReturn!==0">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>{{detailProduct.returnDays}}天无理由退货</span>
          </div>
          <div class="server-item font-small-l" v-if="detailProduct.enableRepair!==0">
            <img class="server-img" src="../../../static/image/mall/server-2.png"/> <span>{{detailProduct.repairDays}}天免费维修</span>
          </div>
        </div>
      </div>
      <div ref="introductionDiv" class="btns-div" v-if="hasData">
        <div class="btn-item" :class="{selected: introductionIndex == 1}" style="float: left;"
             @click="introductionSelected(1)">商品介绍
        </div>
        <div class="btn-item" :class="{selected: introductionIndex == 2}" @click="introductionSelected(2)">规格参数</div>
        <div class="btn-item" :class="{selected: introductionIndex == 3}" style="float: right;"
             @click="introductionSelected(3)">售后包装
        </div>
      </div>
      <div class="btns-div float" v-if="showDetailTab"
           :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
        <div class="btn-item" :class="{selected: introductionIndex == 1}" style="float: left;"
             @click="introductionSelected(1)">商品介绍
        </div>
        <div class="btn-item" :class="{selected: introductionIndex == 2}" @click="introductionSelected(2)">规格参数</div>
        <div class="btn-item" :class="{selected: introductionIndex == 3}" style="float: right;"
             @click="introductionSelected(3)">售后包装
        </div>
      </div>
      <div v-html="detailProduct.mobileDetail" class="introduction-div" v-show="introductionIndex == 1"
           v-if="hasData"></div>
      <div v-html="detailProduct.mobileParam" class="introduction-div" v-show="introductionIndex == 2"
           v-if="hasData"></div>
      <div v-html="detailProduct.salePackage" class="introduction-div" v-show="introductionIndex == 3"
           v-if="hasData"></div>
    </div>
    <div class="bottom-btns" v-if="hasData" v-show="has_goods">
      <div class="btn-div" @click="toShoppingCart">
        <span class="cart-num" v-if="cartNum > 0">{{cartNum}}</span>
        <img src="../../../static/image/mall/bottom-car.png"/>
      </div>
      <div class="btn-div" @click="collectEvent">
        <img
          :src="isCollect ? '../../../static/image/mall/bottom-coll-2.png' : '../../../static/image/mall/bottom-coll-1.png'"/>
      </div>
      <div class="btn-div add-car" @click="addToCart">加入购物车</div>
      <div class="btn-div buy-now" @click="placeOrder">立即购买</div>
    </div>
    <div class="pop-select" v-show="showPop" v-if="hasData">
      <div class="other-div" @click="closePop"></div>
      <div class="pop-content">
        <div class="pop-close-btn" @click="closePop">
          <img src="../../../static/image/mall/close.png"/>
        </div>
        <div class="pro-info">
          <div class="pro-img">
            <img :src="detailProduct.phPicUrl"/>
          </div>
          <div class="pro-info">
            <p>{{detailProduct.skuName}}</p>
            <p style="margin: 5px 0;">
              <span class="theme-color">￥</span>
              <span class="theme-color sale-price">{{ $util.toDecimal2(detailProduct.salePrice) }}</span>
              <span class="cost-price">{{ getShowPrice(detailProduct.costPrice) }}</span>
            </p>
            <p>已选："{{ selectedData.num }}件"</p>
          </div>
        </div>
        <div class="select-row font-medium">
          <!--选择商品规格暂时注释掉div class="items-body">
            <div class="item-btn" v-for="(item, index) in detailProductAttrs"
                 :class="sukIndex === index ? 'sku-item sku-active' : 'sku-item'">
              <span @click="selectSku(item.skuId,index)">{{item.featureName}}:{{item.featureValue}}</span>
            </div>
          </div-->
          <span>数量</span>
          <span class="surplus">剩余</span>
          <span class="theme-color">{{stockNum}}</span>
          <span>件</span>
          <img @click="addEvent" class="num-btn-img" src="../../../static/image/mall/nu_add.png"/>
          <span class="num">{{selectedData.num}}</span>
          <img @click="minusEvent" class="num-btn-img" src="../../../static/image/mall/nu_re.png"/>
        </div>
      </div>
      <div class="pop-btns">
        <div class="btn-div add-car" @click="addToCart">加入购物车</div>
        <div class="btn-div buy-now" @click="placeOrder">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {mapGetters} from 'vuex'

  export default {
    name: "Mall-GoodDetail",
    components: {
      Toast,
      swiper,
      swiperSlide
    },
    computed: {
      ...mapGetters([
        'orderPlace'
      ]),
    },
    data() {
      let that = this;
      return {
        has_goods: true,
        productId: '',
        storeOuCode: '',
        tabs: [{
          id: 1,
          name: '宝贝',
        }, {
          id: 3,
          name: '详情',
        }],
        showDetailTab: false,
        tabSelected: 1,
        proImgIndex: 1,
        scrollY: 0,
        stockNum: 99,
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed: 500,
          autoplay: {
            delay: 3000,//1秒切换一次
            clickable: true
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
              that.proImgIndex = this.realIndex + 1
            },
          }
        },
        hasData: false,
        detailProduct: {},
        detailImgs: [],
        //renderServices: [],
        shareInfo: {},
        isCollect: 0,
        selectedData: {
          num: 1
        },
        introductionIndex: 1,
        sukIndex: 1,
        showPop: false,
        cartNum: 0,
        from: ''
      }
    },
    methods: {
      getTabStyle: function () {
        let style = 'height:' + this.$market.getNavHeight() + 'px;line-height:' + this.$market.getNavHeight() + 'px;';
        return style
      },
      toShoppingCart: function () {
        this.$bridgefunc.customPush({
          path: '/mallshoppingcart'
        })
      },
      addToCart: function () {
        if (this.from == 'cart') {
          this.$bridgefunc.customGo(-1)
          return;
        }
        // if (this.stockNum <= 0) {
        //   this.$Toast('当前商品库存不足，请稍等一会儿尝试！')
        //   return;
        // }
        this.$Loading.open()
        let url = '/app/json/ord_cart/addCart';
        let params1 = {
          token: this.$store.state.login.token,
          skuId: this.detailProduct.skuId,
          number: this.selectedData.num,
          price: this.detailProduct.salePrice
        };
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close()
          let data = res.data;
          //console.log(data);
          if (data.status == 0) {
            _this.cartNum++
            _this.$Toast('加入购物车成功')
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1);
      },
      tabEvent: function (id) {
        this.tabSelected = id;
        if (id == 1) {
          this.$refs.detailScrollDiv.scrollTop = 0;
          this.showDetailTab = false
          // this.detailScroll.scrollToElement(this.$refs.proImgsDiv)
        } else {
          console.log(this.$refs.introductionDiv.offsetTop)
          this.$refs.detailScrollDiv.scrollTop = this.$refs.introductionDiv.offsetTop;
          // this.detailScroll.scrollToElement(this.$refs.introductionDiv)
        }
      },
      // 选中要筛选的规格,这里应该是规格ID但是接口没有设计，为了避免购物车页面错误这里暂时使用sukid
      selectSku: function (skuId, index) {
        this.detailProduct.skuId = skuId;
        this.sukIndex = index;
        console.log("skuId:" + skuId);
      },
      collectEvent: function () {
        if (!this.isCollect) {
          this.$Loading.open()
          let url = '/app/json/user_pro_collect/save';
          let params1 = {
            token: this.$store.state.login.token,
            collect: {
              productId: this.detailProduct.skuId,
              skuName: this.detailProduct.skuName
            }
          };
          let _this = this
          this.$http.post(url, params1).then(res => {
            _this.$Loading.close()
            this.$Toast("加入收藏")
            let data = res.data;
            console.log(data);
            if (data.status == 0) {
              this.isCollect = true;
            } else {
              this.$Toast(data.info)
            }
          }, error => {
            _this.$Loading.close()
            console.log('获取失败', error);
            _this.$Toast('获取数据失败')
          });
        } else {
          this.$Loading.open()
          let url = '/app/json/user_pro_collect/delete';
          let params1 = {
            token: this.$store.state.login.token,
            collect: {
              productId: this.detailProduct.id,
              skuName: this.detailProduct.proSkuName
            }
          };
          let _this = this
          this.$http.post(url, params1).then(res => {
            _this.$Loading.close()
            this.$Toast("取消收藏")
            let data = res.data;
            console.log(data);
            if (data.status == 0) {
              this.isCollect = false;
            } else {
              _this.$Toast(data.info)
            }
          }, error => {
            _this.$Loading.close()
            console.log('获取失败', error);
            _this.$Toast('获取数据失败')
          });
        }
      },
      areaEvent: function () {
        this.$bridgefunc.customPush({
          path: '/malladdress',
          query: {}
        })
      },
      getShowPrice: function (showPrice) {
        if (showPrice && showPrice > this.detailProduct.salePrice) {
          return this.$util.toDecimal2(showPrice)
        }
      },
      introductionSelected: function (index) {
        this.introductionIndex = index;
      },
      addEvent: function () {
        if (this.selectedData.num >= this.stockNum) {
          this.$Toast('您购买数量不能超过最大库存！')
          return;
        }
        this.selectedData.num++;
      },
      minusEvent: function () {
        if (this.selectedData.num > 1) {
          this.selectedData.num--
        }
      },
      closePop: function () {
        this.showPop = false
      },
      popShowEvent: function () {
        this.showPop = true;
      },
      getDetail: function () {
        this.$Loading.open()
        let url = '/app/json/product/detail';
        console.log(this.$store.state.login.token)
        let params1 = {
          token: this.$store.state.login.token,
          proSkuSale: {
            skuId: this.productId,
            storeOuCode: this.storeOuCode
          }
        };
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            _this.getDetailFinished(data.data)
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      getDetailFinished: function (detailData) {
        this.detailImgs = detailData.pictureList;
        this.detailProduct = detailData.product;
        this.detailProductAttrs = detailData.productAttrs;

        let d_detail = this.detailProduct.mobileDetail
        //this.detailProduct.mobileDetail = this.removeWidthAndHeight(d_detail)

        this.shareInfo = detailData.shareInfo;
        this.isCollect = detailData.isCollect;
        let addresInfo = this.detailProduct.addresInfo
        this.$store.state.orderPlace = addresInfo
        this.stockNum = detailData.stockStateId
        this.has_goods = detailData.skuStatus == 0 ? true : false
        // this.getProductStock()
        this.$bridgefunc.vuexStorage()
        let renderService = this.detailProduct.renderService;
        //this.renderServices = renderService.split('|');
        this.hasData = true;
      },
      removeWidthAndHeight: function (str) {
        pcDetailstr = str.replace(/width=+(\s*[^ ]*)|height=+(\s*[^ ]*)/g, "");
        return str
      },
      getDefaultAddress: function () {
        this.$Loading.open()
        let url = '/app/json/user_address/list';
        let params1 = {
          token: this.$store.state.login.token,
          condition: {}
        };
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            let items = data.data
            if (items.length == 0) {
              return;
            }
            _this.$store.state.orderPlace = items[0]
            for (let i = 0; i < items.length; i++) {
              let item = items[i]
              if (item.isDefault == 1) {
                _this.$store.state.orderPlace = item
                break;
              }
            }
            _this.getProductStock()
            console.log(_this.$store.state.orderPlace)
            _this.$bridgefunc.vuexStorage()
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      getCartNum: function () {
        let url = '/app/json/ord_cart/queryCartCount';
        let params1 = {
          token: this.$store.state.login.token
        };
        let _this = this
        this.$http.post(url, params1).then(res => {
          // _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            _this.cartNum = data.data
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          // _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      getProductStock: function () {
        if (!this.detailProduct.skuCode || this.detailProduct.skuCode == '') {
          return;
        }
        var proSkuSale_temp = ""
        //判断默认地址
        if (!this.orderPlace.id || this.orderPlace.id == '') {
          //如果没有默认地址的话就通过百度API取一个地址
          //isNeedAll = true;
          let _this = this;
          this.$bridgefunc.getLocation(function (locationinfo) {
            _this.provinceName = locationinfo.province
            _this.cityName = locationinfo.city;
            _this.district = locationinfo.district;
          }, true)

          proSkuSale_temp = {
            skuCode: this.detailProduct.skuCode,
            storeOuCode: this.storeOuCode,
            provinceName: this.provinceName,
            countryName: this.cityName,		//注意！接口中的countryName是城市名称的意思
            cityName: this.district			//注意！接口中的cityName居然是地区名称
          };
          console.log("没有默认地址，自动适配结果：省份：" + this.provinceName + "；城市：" + this.cityName + "；地区：" + this.district);
        } else {
          proSkuSale_temp = {
            skuCode: this.detailProduct.skuCode,
            storeOuCode: this.storeOuCode
          };
          console.log("设置默认地址");
        }
        let url = '/app/json/product/getStockStateByArea';
        let params1 = {
          token: this.$store.state.login.token,
          proSkuSale: proSkuSale_temp,
          addressId: this.orderPlace.id
        };
        // this.$Loading.open()
        /*let url = '/app/json/product/getStockStateByArea';
        let params1 = {
          token: this.$store.state.login.token,
          proSkuSale: {
            skuCode: this.detailProduct.skuCode,
            storeOuCode: this.storeOuCode
          },
          addressId: this.orderPlace.id
        };*/
        let _this = this
        this.$http.post(url, params1).then(res => {
          // _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            _this.stockNum = data.data.stockNum
            if (_this.stockNum == 0) {
              _this.selectedData.num = 0
            }
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          // _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      placeOrder: function () {
        if (this.stockNum <= 0) {
          this.$Toast('当前商品库存不足，请稍等一会儿尝试！')
          return;
        }
        this.$Loading.open()
        let url = '/app/json/ord_cart/startSettle';
        let params1 = {
          token: this.$store.state.login.token,
          totalAmount: this.detailProduct.salePrice * this.selectedData.num,
          addressId: this.orderPlace.id,
          skuId: this.detailProduct.skuId,
          groupAttr: 'storeName',
          number: this.selectedData.num
        };
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            let orderData = data.data.resultDataTwo
            let proData = orderData
            let pros = []
            for (let key in proData) {
              let arr = proData[key]
              for (let i = 0; i < arr.length; i++) {
                pros.push(arr[i])
              }
            }
            _this.$store.state._products = pros
            _this.$bridgefunc.vuexStorage(function () {
              _this.$bridgefunc.customPush({
                path: '/mallorderform',
                query: {
                  type: 'single'
                }
              })
            })
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
      handleScroll: function () {
        let scrollTop = this.$refs.detailScrollDiv.pageYOffset || this.$refs.detailScrollDiv.scrollTop || this.$refs.detailScrollDiv.scrollTop
        if (scrollTop >= this.$refs.introductionDiv.offsetTop) {
          this.tabSelected = 3;
          this.showDetailTab = true
        } else {
          this.showDetailTab = false
          this.tabSelected = 1;
        }
      }
    },
    created() {
      this.from = this.$route.query.from ? this.$route.query.from : ''
      this.productId = this.$route.query.skuId ? this.$route.query.skuId : ''
      this.storeOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : ''
      this.getDetail()
      // this.getDefaultAddress()
      this.getCartNum()
    },
    mounted() {
      this.$refs.detailScrollDiv.addEventListener('scroll', this.handleScroll)
      this.$bridgefunc.registePageShow(() => {
        this.$bridgefunc.vuexRead(() => {
          this.getCartNum()
          this.getProductStock()
        })
      })
    },
    activated() {
      this.$refs.detailScrollDiv.scrollTop = this.scrollY;
    },
    beforeRouteLeave(to, from, next) {
      // to.meta.keepAlive = false;
      if (to.path == '/malladdress' || to.path == '/mallshoppingcart') {
        let scrollTop = this.$refs.detailScrollDiv.pageYOffset || this.$refs.detailScrollDiv.scrollTop || this.$refs.detailScrollDiv.scrollTop
        this.scrollY = scrollTop;
        from.meta.keepAlive = true;
        to.meta.keepAlive = false;
      } else {
        this.scrollY = 0;
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .Mall-GoodDetail {
    position relative
    width 100%;
    height 100%;
    background-color $color-background-lll
    .detail-tab {
      text-align center;
      .tab-item {
        display inline-block;
        width 50px;
        font-size $font-size-medium-x
        font-weight $font-weight-x
        color white
        text-align center;
      }
      .selected {
        border-bottom 3px solid white
      }
    }
    .detail-scroll {
      position absolute
      bottom 50px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      .pro-imgs {
        position relative
        width 100%;
        height 0px;
        padding-bottom 100%;
        background-color white
        .swiper-container {
          position absolute
          left 0px;
          right 0px;
          top 0px;
          bottom 0px;
          .swiper-arr {
            height: 100%;
            width: 100%;
            img {
              height: 100%;
              width: 100%;
            }
          }
        }
        .swiper-pagination {
          position absolute;
          top -37px;
          right 10px;
          margin-top 100%;
          padding 3px 10px;
          border-radius 14px;
          background-color $color-background-ll
          color white
          .big-num {
            font-size $font-size-medium-x
          }
        }
      }
      .white-div {
        padding 3%;
        background-color white
        .row-p {
          position relative;
          padding 4px 0px;
          .btn-img {
            float right;
            width 25px;
            height 25px;
            margin-top: -2px;
          }
          .loc-img {
            position absolute;
            /*display inline-block;*/
            /*margin-top 3px;*/
            left 40px;
            width 18px;
            height 18px;
          }
          .row-place {
            position absolute;
            left 60px;
            right 40px;
          }
          .now-pro {
            position absolute;
            left 40px;
            top 22px;
            font-size $font-size-small
            color $color-theme-text-d
          }
        }
        .pro-title {
          font-size 15px;
          color $color-text
        }
        .row-label {
          color $color-text-l
        }
        .row-value {
          position absolute;
          left 40px;
          right 0px;
          display inline-block;
          /*margin-left 10px;*/
        }
      }
      .div-top-margin {
        margin-top 8px;
      }
      .top-line {
        border-top 1px solid $color-line-gray-l
      }
      .server-div {
        padding 3%;
        overflow hidden;
        .server-item {
          padding 0px 12px;
          float left;
          /*width 25%;*/
          img, span {
            display inline-block
            vertical-align middle
          }
          .server-img {
            width 12px;
            height 12px;
          }
        }
      }
      .btns-div {
        text-align center;
        overflow hidden;
        .btn-item {
          display inline-block;
          width 33%;
          height 48px;
          line-height 48px;
          font-size $font-size-medium-x
          background-color white;
        }
        .selected {
          color $color-theme-text-d
        }
      }
      .float {
        position fixed;
        left 0px;
        right 0px;
        z-index 99
        background-color $color-background-lll
      }
    }
    .cost-price {
      font-size $font-size-small
      color $color-text-l
      text-decoration: line-through;
    }
    .sale-price {
      display inline-block
      margin-left -6px;
      padding-right 8px;
      font-size $font-size-large
    }
    .theme-color {
      color $color-theme-text-d
    }
    .btn-div {
      position relative;
      float left;
      width 20%;
      height 50px;
      color white
      line-height 50px;
      text-align center;
      font-size $font-size-medium-x;
    }
    .bottom-btns {
      position fixed;
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      background-color white
      img {
        width 50px;
        height 50px;
      }
      .cart-num {
        position absolute;
        left 50%;
        top 50%;
        margin-left 5px;
        margin-top -25px;
        height 16px;
        line-height 16px;
        padding 0px 5px;
        color white
        border-radius 8px;
        border 1px solid white
        font-size 10px
        background-color $color-theme-text-d
      }
      .add-car {
        width 30%;
        background-color $color-theme-btn-l
      }
      .buy-now {
        width 30%;
        background-color $color-theme-text-d
      }
    }
    .pop-select {
      position fixed
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      z-index 10;
      background-color rgba(0, 0, 0, 0.3)
      .other-div {
        position absolute
        top 0px;
        bottom 350px;
        left 0px;
        right 0px;
      }
      .pop-content {
        position absolute
        bottom 50px;
        left 0px;
        right 0px;
        /*height 300px;去掉商品规格*/
        height 170px;
        background-color white;
        .pop-close-btn {
          position absolute;
          top 5px;
          right 5px;
          width 40px;
          height 40px;
          padding 10px;
          img {
            width 20px;
            height 20px;
          }
        }
        .pro-info {
          padding 3%;
          /*height 90px;*/
          overflow hidden
          .pro-img {
            float left;
            width 90px;
            height 90px;
            img {
              width 100%;
              height 100%;
            }
          }
          .pro-info {
            font-size $font-size-medium;
            overflow hidden;
          }
        }
        .select-row {
          padding 5px 3%;
          span, img {
            display inline-block;
            vertical-align middle;
          }
          .surplus {
            margin-left 10px;
          }
          .num-btn-img {
            margin-top -10px;
            padding 10px;
            width 40px;
            height 40px;
            float right;
          }
          .num {
            float right;
            padding 0px 10px;
            margin 0px -10px;
          }
        }
      }
      .pop-btns {
        position absolute;
        bottom 0px;
        left 0px;
        right 0px;
        height 50px;
        .add-car {
          width 50%;
          background-color $color-theme-btn-l
        }
        .buy-now {
          width 50%;
          background-color $color-theme-r
        }
      }
    }
  }

  .sku-active {
    color: #fff !important;
    background-color: $color-theme-o !important;
  }

  .sku-item {
    height: 34px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #f6f6f6;
    border-radius: 34px;
    -webkit-transform: scaleX(0.9);
    transform: scaleX(0.9);
    margin-bottom: 4px;
    color: #a0a0a0;
  }

  .introduction-div {
    color: #A0A0A0;
    background-color: #FFFFFF;
    padding: 5px 10px;
    line-height: 24px;
    border-top: 1px solid #EEEEEE;
  }

  #goods_is_null {
    text-align: center;
    padding-top: 20px
    p {
      padding-top: 20px
      color: $color-theme-text-l
    }
    img {
      width: 150px
    }

  }

</style>
