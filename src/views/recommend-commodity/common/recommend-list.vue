/**Created by liaoyingchao on 2020-04-17.*/

<template>
  <div class="recommend-list">
    <div class="nav-top" :style="{height: (this.$store.state.barHeight+$market.getNavHeight(false))+ 'px'}" v-if="$store.state.webtype != '2'">
      <div class="title-div theme_font_white">{{$route.meta.title}}</div>
      <div class="nav-back-btn"  @click="$router.go(-1)">
        <i class="iconfont mall-fanhui theme_font_white" style="margin-left: 10px; font-size: 20px;"></i>
      </div>
    </div>
    <div class="recommend-content" v-show="loaded">
      <div class="top-div">
        <div :style="{height: (this.$store.state.barHeight+$market.getNavHeight(false))+ 'px'}" v-if="$store.state.webtype != '2'">
        </div>
        <div class="bg-img">
          <img src="../img/guang.png">
        </div>
        <div class="download-div">
          <div class="tip-div">{{recommendData.referralsReason}}</div>
          <div class="qrcode-div">
            <canvas id="downloadqrcode"></canvas>
          </div>
          <div class="text-tip">扫码下载APP</div>
        </div>
      </div>
      <div class="list-div">
        <div class="header-img">
          <img src="../img/listup.png">
          <div class="location" @click="changeAddress">
            <i class="iconfont mall-dingwei icon-size"></i>
            <p class="single-line" v-if="selectedType == 2">送至：{{$store.state.mall2.selectAddress.addressFull}}</p>
            <p class="single-line" v-if="selectedType == 1">自提点：{{$store.state.mall2.zitiAddress.storeName}}</p>
            <i class="iconfont mall-gengduojiantou icon-size"></i>
          </div>
        </div>
        <div class="list-content">
          <div class="tip" v-if="listData.length == 0">当前自提点暂无商品，请切换自提点</div>
          <div class="row" :class="{line_top:idx != 0}" v-for="(item, idx) in listData">
            {{dataProcessing(item)}}
            <div class="select-div" @click="setCartSel(idx)">
              <i class="iconfont font-large" :class="getXZClass(item.selected)"></i>
            </div>
            <div class="img-div" @click="toDetail(item)">
              <img v-lazy="item.phMainUrl">
            </div>
            <div class="info-div">
              <div class="pro-title double-line" v-html="getSkuNameStr(item)" @click="toDetail(item)"></div>
              <div class="price-row">
                <PriceOrder :listitem="item"></PriceOrder>
                <van-stepper v-model="item.number" :min="item.saleNumBegin ? item.saleNumBegin : 1" :step="item.saleNumStep ? item.saleNumStep : 1" :max="item.stockNum" integer/>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-img">
          <img src="../img/listdown.png">
        </div>
        <div class="bottom-btn theme_font_red" @click="submit">
          提交订单
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import Config from '@/api/config'
  import PriceOrder from  '@/components/commonui/price/price-order'
  import Address from '@/components/mall2/common/address'
  import PickupAddress from '@/components/mall2/common/pickup-address'

  export default {
    name: "recommend-list",
    components: {
      PriceOrder
    },
    data() {
      return {
        myInfo: '',
        recommendData: {},
        selectedType: '2',
        skuIds: [],
        listData: [],
        qrCode: '',
        userNo: '',
        loaded: false
      }
    },
    watch: {
      '$store.state.mall2.zitiAddress.id': function (val, oldVal) {
        if (this.selectedType == 1) {
          //  自提
          let zitiad = this.$store.state.mall2.zitiAddress;
          if (zitiad.id != '') {
            this.getRecommendData()
          }
        }
      }
    },
    methods: {
      toDetail: function (item) {
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (item.productType == 2) {
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: item.id,
            skuId: item.skuId,
            productType: item.productType,
            recommendCommodity: true
          }
        })
      },
      submit: function () {
        let carts = []
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i]
          if (item.selected == true) {
            carts.push({
              skuId: item.skuId,
              storeOuCode: item.storeOuCode,
              deliverType: this.selectedType,
              number: item.number,
              checked: 1
            })
          }
        }
        if (carts.length == 0) {
          this.$Toast('请选择要提交的商品！')
          return ;
        }
        this.$router.push({
          path: '/mall2/placeorder',
          query: {
            carts: JSON.stringify(carts),
            deliveryType: this.selectedType,
            recommendPhone: this.recommendData.userId
          }
        })
      },
      changeAddress: function () {
        if (this.selectedType == '1') {
          // 自提点
          PickupAddress.open({
            initData: {
              selectedId: this.$store.state.mall2.zitiAddress.id,
              token: this.$store.state.login.token,
              posx: this.$store.state.currentLocation.posx,
              posy: this.$store.state.currentLocation.posy,
              skuIds: this.skuIds
            },
            addressEvent: (selected) => {
              PickupAddress.close()
              if (selected) {
                this.$store.state.mall2.zitiAddress = selected;
                this.$bridgefunc.vuexStorage()
                // 切换自提点，刷新列表
                this.getRecommendData()
                this.$userCenter._setDefaultPickupAddress(selected.id);
              }
            },
            otherAddressEvent: () => {
              let path = '/mall2/selfliftingsite';
              this.$router.push({
                path: path,
                query: {
                  skuIds: JSON.stringify(this.skuIds)
                }
              })
              PickupAddress.close()
            }
          })
        } else if (this.selectedType == '2') {
          // 配送点
          Address.open({
            initData: {
              selectedId: this.$store.state.mall2.selectAddress.id,
              token: this.$store.state.login.token
            },
            addressEvent: (selected) => {
              this.$store.state.mall2.selectAddress = selected;
              this.$bridgefunc.vuexStorage()
              this.getRecommendData()
              Address.close()
            }
          })
        }
      },
      setCartSel: function (idx) {
        let item = this.listData[idx]
        if (item.stockNum == 0) {
          this.$Toast('商品库存不足！')
          return;
        }
        item.selected = !item.selected
        this.listData.splice(idx, 1, item)
      },
      getXZClass: function (checked) {
        if (checked) {
          return 'mall-xuanzhong theme_standard_font'
        } else {
          return 'mall-weixuanzhong theme_font_gray'
        }
      },
      getSkuNameStr: function (item) {
        let skuName = item.skuName
        // if (item.interfaceType == '2') {
        //   skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">京东</span>` + skuName
        // } else if (item.interfaceType == '1') {
        //   skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">有路</span>` + skuName
        // }
        return skuName
      },
      // 获取商品列表
      loadProList: function (list) {
        this.loaded = true
        let arr = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          item.number = item.saleNumBegin ? item.saleNumBegin : 1
          arr.push(item)
        }
        this.listData = arr;

        // this.$Loading.open();
        // let url = '/app/json/product/getAppProSearchList';
        //
        // let paramsData = {
        //   deliverType: this.selectedType,
        //   skuIds: this.skuIds
        // };
        //
        // if (this.selectedType == 1) {
        //   //  自提
        //   let zitiad = this.$store.state.mall2.zitiAddress;
        //   if (zitiad.id == '') {
        //     // 自提点不存在，暂时不获取数据
        //     return ;
        //   }
        //   paramsData.pickUpId = zitiad.id
        // } else {
        //   // //  配送
        //   let sad = this.$store.state.mall2.selectAddress;
        //   paramsData.area = {
        //     provinceId: sad.provinceId,
        //     cityId: sad.cityId,
        //     countryId: sad.countryId,
        //     townId: sad.townId
        //   }
        // }
        //
        // this.$http.post(url, paramsData).then(res => {
        //     this.$Loading.close();
        //     let data = res.data;
        //     if (data.status == 0) {
        //       this.loaded = true
        //       this.listData = data.data.list;
        //     } else {
        //       this.$Toast(data.info);
        //     }
        //   },
        //   error => {
        //     this.$Loading.close();
        //     this.$Toast('请求数据失败！')
        //   }
        // );
      },
      getRecommendData: function () {
        this.$Loading.open();
        let url = '/app/json/app_employee/getReferralsRecordByQrCode';
        let paramsData = {
          qrCode: this.qrCode,
        };

        let zitiad = this.$store.state.mall2.zitiAddress;
        if (zitiad.id == '') {
          // 自提点不存在，暂时不获取数据
          return ;
        }
        paramsData.pickUpId = zitiad.id

        let sad = this.$store.state.mall2.selectAddress;
        paramsData.area = {
          provinceId: sad.provinceId,
          cityId: sad.cityId,
          countryId: sad.countryId,
          townId: sad.townId
        }

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.recommendData = data.data

              this.selectedType = this.recommendData.deliverType
              this.$store.state.mall2.staticDeliverType = this.selectedType
              this.getUserRfrCode()

              // let path = `${location.origin}${Config.shareUrl}/usercenter/downloadshare`
              // QRCode.toCanvas(document.getElementById("downloadqrcode"),path,{ width: 150})
              
              // this.skuIds = []
              // for (let i = 0; i < this.recommendData.proSkuList.length; i++) {
              //   let pro = this.recommendData.proSkuList[i]
              //   this.skuIds.push(pro.skuId)
              // }
              this.loadProList(this.recommendData.list)
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      getUserRfrCode: function () {
        this.$nextTick(() => {
          let path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/preregistration`;
          QRCode.toCanvas(document.getElementById("downloadqrcode"),path+`?qrCode=${this.userNo || ''}`,{ width: 150})
        })
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
      },
    },
    created() {
      this.qrCode = this.$route.query.shareCode
      this.userNo = this.$route.query.userNo
      if (this.$route.query.userNo) {
        sessionStorage.setItem('USER_NO', this.$route.query.userNo || '')
      }
      this.getRecommendData()
    },
    mounted() {

    },
    beforeRouteLeave(to, from, next) {
      if (to.name != '登录' && to.name != '填写订单' && to.name != '商品详情') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .recommend-list {
    width 100%
    height 100%
    position relative;
    background: linear-gradient(#E35F4C, #E35F4C, #E3764E);

    .nav-top {
      position absolute;
      left 0;
      right 0;
      top 0;
      z-index 9;
      .title-div {
        position absolute;
        left 50px;
        right 50px;
        bottom 0px;
        font-weight $font-weight-x
        font-size $font-size-large;
        height 100%
        display flex;
        align-items center;
        justify-content center;
      }

      .nav-back-btn {
        position absolute;
        top 0px
        left 0px;
        bottom 0px;
        width 50px;
        z-index 10;
        display flex;
        align-items center;
        //background url("../static/image/mall/nav-back.png")
      }
    }

    .recommend-content {
      width 100%
      height 100%
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;

      .top-div {
        //background-color #E35F4C;
        overflow hidden;
        position relative;
        .bg-img {
          position absolute;
          z-index 1
          left 0;
          right 0;
          top 0;
          bottom 0;
          img {
            display block;
            width 100%;
            height 100%;
          }
        }
        .download-div {
          .tip-div {
            margin 5px 10px 16px;
            border-radius 8px;
            background-color rgba(255, 255, 255, 0.3)
            color white;
            font-size 12px;
            line-height 16px;
            overflow hidden;
            padding 8px;
            text-indent 2em;
          }
          .qrcode-div {
            overflow hidden;
            display flex;
            justify-content center;
            canvas {
              border-radius 8px;
              overflow hidden;
            }
          }
          .text-tip {
            font-size 13px;
            text-align center;
            padding 10px 20px 16px;
            color white;
          }
        }
      }
      .list-div {
        //min-height calc(100% - 300px);
        overflow hidden;
        .header-img {
          position relative;
          img {
            display block;
            width 100%;
          }
          .location {
            position absolute;
            left 8px;
            right 8px;
            top 0px;
            padding 15px 8px;
            font-size 12px;
            color white;
            display flex;
            align-items center;
            p {
              flex 1;
              font-size 13px;
            }
            i {
              padding 0 5px;
              font-size 16px;
            }
          }
        }
        .list-content {
          width 335px;
          margin -5px auto;
          background-color #FFFBF3;
          overflow hidden;
          .tip {
            font-size 12px;
            text-align center;
            padding 20px;
            color #999;
            line-height 16px;
          }
          .row {
            display flex;
            align-items center;
            margin 0px 8px;
            padding 5px 0;
            overflow hidden;
            .select-div {
              padding 10px 5px 10px 0px;
            }
            .img-div {
              img {
                display block;
                width 60px;
                height 60px;
              }
            }

            .info-div {
              flex 1;
              padding 0 0 0 5px;
              overflow hidden;
              .pro-title {
                width 100%;
                line-height 16px;
                font-size 12px;
                height 32px;
              }
              .price-row {
                margin-top 5px;
                display flex;
                align-items center;
                justify-content space-between;
              }
            }
          }
        }
        .bottom-img {
          img {
            display block;
            width 100%;
          }
        }
        .bottom-btn {
          margin 20px auto 15px;
          background-color #F6DB93
          width 200px;
          height 44px;
          line-height 44px;
          font-size 16px;
          font-weight 600;
          border-radius 25px;
          text-align center;
        }
      }
    }
  }
</style>
