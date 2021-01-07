<template>
  <div class="scenicdetail">
    <div ref="detailTop2" class="detail-top"
         :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="navcontent"
           :style="{top: this.$store.state.barHeight+ 'px','height': this.$market.getNavHeight()+'px','line-height': this.$market.getNavHeight()+'px'}">
        <div class="nav-back-btn" style="left: 10px;top: 5px;width: 34px; height: 34px;" @click="backEvent">
          <img style="display: block;width: 100%;height: 100%;" src="static/image/mall2/back.png"/>
        </div>
      </div>
    </div>
    <nav-content style="top: 0px" v-if="isShow">
      <div class="scroll-con" ref="ticketdetailscrl">
        <van-swipe :autoplay="2000"  class="top-image" indicator-color="white">
          <van-swipe-item v-for="(url,idx) in detail.picUrls" :key="idx">
            <img :src="url">
          </van-swipe-item>
        </van-swipe>
        <div class="top-title shadow-cell theme_bg_white">
          <div class="left-title ">
            <p class="bigtitlefont">{{detail.showTitle}}</p>
            <p class="describe theme_font_gray">{{detail.storeOuName}}</p>
          </div>
        </div>
        <div class="detail-con">
          <div class="date-list">
            <div class="choosedate" v-for="(item,index) in detail.featureList"
                 @click="chooseDate(item,index)"
                 :class="{'theme_bg_red':chooseIndex==index}">
              <p class="week-con theme_font_gray" :class="{'theme_font_white':chooseIndex==index}">
                {{item.featureName}}</p>
              <P class="day-con theme_font_common" :class="{'theme_font_white':chooseIndex==index}">{{item.curDate}}</P>
            </div>
          </div>
          <div class="shadow-cell flex-con padding-con" v-for="ticket in childList">
            {{dataProcessing(ticket)}}
            <div class="left-ticket">
              <P class="bigtitlefont">{{ticket.featureName}}</P>
              <p class="price">
                <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{ticket.dpedData.integer}}</span><span class="price-x theme_font_red">.{{ticket.dpedData.decimals}}</span>&nbsp&nbsp
                <span class="price-x theme_font_tint" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                              <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{$util.toDecimal2(ticket.dpedData.linePrice)}}</span>
                <span class="theme_font_tint" v-if="ticket.stockNum && ticket.stockNum != ''">&nbsp&nbsp(仅剩{{ticket.stockNum}}张)</span>
              </p>
            </div>
            <div class="right-ticket theme_bg_red theme_font_white" @click="bookClick(ticket)">立即预定</div>
          </div>
          <div class="shadow-cell padding-con">
            <p class="html-title">购票须知</p>
            <div v-html="detail.proSkuMediaModel.mobileParam"></div>
          </div>
          <div class="shadow-cell padding-con">
            <p class="html-title">游玩攻略</p>
            <div style="overflow: hidden;" v-html="detail.proSkuMediaModel.mobileDetail"></div>
          </div>
        </div>
      </div>
    </nav-content>
    <!-- 底部导航 -->
      <div class="bottom-btns" v-if="status">
        <div v-if="!Object.keys(objStype).length" class="bottom-box add">
          <div class="addIco theme_standard_font_i" v-if="listData.hidden==0" @click="addMethod">
            添加
          </div>
          <div class="addText theme_font_white theme_standard_bg" @click="shareMethod">
            <p class="title">分享推广</p>
          </div>
        </div>
        <div v-else class="bottom-box upDown">
          <div
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
  import "@/common/stylus/swiper-1036.styl"
  import Share from "../../common/share.vue";
  import { mapGetters } from "vuex";
  import eventBus from '@/utils/eventBus.js'
  import Config from '@/api/config'
  export default {
    name: 'scenicdetail',
    components: {
      Share
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    data() {
      return {
        status: false,
        isShow: false,
        chooseIndex: 0,
        score: '5.0',
        remark_cou: '12345',
        detail: {},
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed: 500,
          autoplay: {
            delay: 3000,//1秒切换一次
          },
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: false
          },
          paginationShow: true
          // freeMode:true
        },
        childList: [],
        scrollValue: 0,
        objStype: {},
        listData: {},
        popupShow: false,
        shareObj: {
          popupShow: false
        },
        storeOuCode: '',
        deliveryType: '',
        proSkuDistributionId: ''
      }
    },
    methods: {
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = {
          integer: '0',
          decimals: '00',
          linePrice: '0.00'
        }
        let marketPrice = item.marketPrice + '';
        dpedData.linePrice = marketPrice

        let activityPrice = item.salePrice + '';
        let arr = activityPrice.split('.');
        if (arr) {
          if (arr.length == 1) {
            dpedData.integer = arr[0]
            if (dpedData.integer == '') {
              dpedData.integer = '0'
            }
            dpedData.decimals = '00'
          } else if (arr.length == 2) {
            dpedData.integer = arr[0]
            dpedData.decimals = arr[1]
            if (dpedData.decimals.length < 2) {
              dpedData.decimals = dpedData.decimals + '0'
            }
          }
        }
        item.dpedData = dpedData;
        // 展示活动
        // let showActivities = [];
        // for (let i = 0; i < item.activityTypes.length; i++) {
        //   let text = item.activityTypes[i]
        //   if (!~showActivities.indexOf(text)) {
        //     showActivities.push(text)
        //   }
        // }
        // item.showActivities = showActivities;
      },
      chooseDate: function (item, index) {
        console.log('testFunc')
        this.chooseIndex = index;
        this.childList = item.childList;
      },
      bookClick: function (ticket) {//预订
        // this.$router.push('fillorder');

        let saleNumBegin = this.detail.saleNumBegin != '' ? this.detail.saleNumBegin : 1
        let saleNumStep = this.detail.saleNumStep != '' ? this.detail.saleNumStep : 1
        let saleNumMax = this.detail.saleNumMax != '' ? this.detail.saleNumMax : 20
        let stockNum = ticket.stockNum != '' ? ticket.stockNum : 9999


        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: ticket.skuId,
            storeOuCode: this.detail.storeOuCode,
            number: saleNumBegin,
            checked: '1'
          }],
          deliveryType: this.detail.deliveryType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // this.$router.push({
              //   name: '立即下单',
              //   params: {
              //     occur: data.data.occur,
              //     proName: this.detail.showTitle,
              //     saleNumBegin: saleNumBegin,
              //     saleNumStep: saleNumStep,
              //     saleNumMax: saleNumMax,
              //     stockNum: stockNum,
              //   }
              // })
              // this.$mallCommon.isExistCanNotAttendActivity(data.data.occur);
              if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
                this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                  this.$router.push({
                    name: '立即下单',
                    params: {
                      occur: data.data.occur,
                      proName: this.detail.showTitle,
                      saleNumBegin: saleNumBegin,
                      saleNumStep: saleNumStep,
                      saleNumMax: saleNumMax,
                      stockNum: stockNum,
                    }
                  })
                }).catch(action => {
                });
              } else {
                this.$router.push({
                  name: '立即下单',
                  params: {
                    occur: data.data.occur,
                    proName: this.detail.showTitle,
                    saleNumBegin: saleNumBegin,
                    saleNumStep: saleNumStep,
                    saleNumMax: saleNumMax,
                    stockNum: stockNum,
                  }
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
      // _getDateSkuSaleDetail: function (skuId) {
      //   let url = '/app/json/product/getAppDateSkuSaleDetail'
      //   this.$Loading.open();
      //   let params1 = {
      //     token: this.$store.state.login.token,
      //     id: id
      //   }
      //   console.log(params1)

      //   this.$http.post(url, params).then(res => {
      //     this.$Loading.close()
      //     let data = res.data;
      //     if (data.status == 0) {
      //       this.status = true
      //       this.detail = data.data;
      //       if (this.detail.featureList.length) {
      //         let dateArr = this.detail.featureList[0];
      //         if (dateArr.childList.length) {
      //           this.childList = dateArr.childList;
      //         }
      //       }
      //       this.isShow = true;
      //     } else {
      //       this.isShow = false;
      //       this.$Toast(data.info)
      //     }
      //   }, error => {
      //     this.isShow = false;
      //     this.$Loading.close()
      //     console.log('获取门票详情', error);
      //     this.$Toast('获取数据失败')
      //   });
      // },
      _getDateSkuSaleDetail: function (id) {//
        let url = '/app/json/product/getAppProDetail'
        this.$Loading.open();
        let params1 = {
          token: this.$store.state.login.token,
          skuId: id,
          deliverType: this.deliveryType,
          storeOuCode: this.storeOuCode
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.status = true
            this.detail = data.data;
            if (this.detail.featureList.length) {
              let dateArr = this.detail.featureList[0];
              if (dateArr.childList.length) {
                this.childList = dateArr.childList;
              }
            }
            this.isShow = true;
          } else {
            this.isShow = false;
            this.$Toast(data.info)
          }
        }, error => {
          this.isShow = false;
          this.$Loading.close()
          console.log('获取门票详情', error);
          this.$Toast('获取数据失败')
        });
      },
      backEvent: function () {
        this.$router.go(-1)
        this.$keepaliveHelper.deleteCache(this)
      },
      // shareClick:function () {//分享
      //   let shareData = {};
      //   shareData = {};
      //   shareData.title = this.detail.showTitle;
      //   shareData.sharetext = this.detail.skuName;
      //   shareData.imageurl = this.detail.phMainUrl;
      //   shareData.detailurl = `${this.$store.state.globalConfig.wxBaseUrl}${this.$config.shareUrl}${this.$route.fullPath}`;
      //   this.$bridgefunc.wechatShare(shareData);
      // }
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
                } else {
                  this.$Toast(res.data.info);
                }
              });
          })
          .catch(() => {});
      },
      shareMethod() {
        // 添加分享
        let shareData = {}
        shareData.showTitle = this.detail.showTitle;
        shareData.sharetext = this.detail.skuName;
        shareData.picUrls = [this.detail.phMainUrl];
        shareData.id = this.detail.id;
        shareData.skuId = this.detail.skuId;
        shareData.productType = this.detail.productType;
        shareData.deliveryType = this.detail.deliveryType;
        if(this.detail.featureList.length){
          shareData.dpedData = {}
          shareData.dpedData.linePrice = this.detail.featureList[0].childList[0].marketPrice
          shareData.dpedData.featureName = this.detail.featureList[0].childList[0].featureName
        }
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + this.$route.fullPath;
        if (this.detailData.deliveryType == 1) {
          shareData.detailurl = shareData.detailurl + '&storeID=' + this.$store.state.mall2.zitiAddress.id;
        }
        if (this.$store.state.login.token && this.$store.state.login.token != '') {
          shareData.detailurl = shareData.detailurl + '&recommend=' + this.$store.state.userInfo.userId
          shareData.detailurl = shareData.detailurl + '&recommendPhone=' + this.$store.state.login.phone
        }
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
                this.shareObj = Object.assign({}, this.shareObj, shareData);
                this.popupShow = true;
                this.shareObj.popupShow = true;
              } else {
                this.$Toast(res.data.info);
              }
            });
        } else {
          this.shareObj = Object.assign({}, this.shareObj, shareData);
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
        let shareData = {}
        shareData.showTitle = this.detail.showTitle;
        shareData.sharetext = this.detail.skuName;
        shareData.picUrls = [this.detail.phMainUrl];
        shareData.id = this.detail.id;
        shareData.skuId = this.detail.skuId;
        shareData.productType = this.detail.productType;
        shareData.deliveryType = this.detail.deliveryType;
        if(this.detail.featureList.length){
          shareData.dpedData = {}
          shareData.dpedData.linePrice = this.detail.featureList[0].childList[0].marketPrice
          shareData.dpedData.featureName = this.detail.featureList[0].childList[0].featureName
        }
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + this.$route.fullPath;
        if (this.detailData.deliveryType == 1) {
          shareData.detailurl = shareData.detailurl + '&storeID=' + this.$store.state.mall2.zitiAddress.id;
        }
        if (this.$store.state.login.token && this.$store.state.login.token != '') {
          shareData.detailurl = shareData.detailurl + '&recommend=' + this.$store.state.userInfo.userId
          shareData.detailurl = shareData.detailurl + '&recommendPhone=' + this.$store.state.login.phone
        }
        this.shareObj = Object.assign({},{proSkuDistributionId: this.proSkuDistributionId}, this.shareObj, this.detailData);
        this.popupShow = true;
        this.shareObj.popupShow = true;
      },
      setshareData(item) {
        this.popupShow = false;
        this.shareObj = Object.assign({}, item);
      },
    },
    created() {
      this.proSkuDistributionId = this.$route.query.proSkuDistributionId || ''
      console.log(111,this.proSkuDistributionId)
      // this.objStype = this.$route.query.obj ? this.$route.query.obj : {};
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
      // this.listData = this.$route.query.listData ? this.$route.query.listData : {};
      this.storeOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : "";
      this.skuId = this.$route.query.skuId ? this.$route.query.skuId : "";
      this.deliveryType = this.$route.query.deliveryType
      let id = this.$route.query.id
      if (id == null || id == undefined || id == '') {
        return ;
      }
      this._getDateSkuSaleDetail(id)
    },
    activated() {
      // if (this.isShow) {
      //   this.$refs.ticketdetailscrl.scrollTop = this.scrollValue
      // }
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .scenicdetail {
    width 100%
    height 100%
    overflow hidden
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
        .right-btn {
          position absolute;
        }
      }
    }
    .scroll-con {
      left 0px
      top 0px
      width 100%
      height 92%
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      /*background-color #7e8c8d*/
      .top-image {
        width 100%
        height 190px
        margin-bottom -30px
        img {
          width 100%
          height 100%
        }
      }
      .top-title {
        z-index 1
        position relative
        padding 15px 10px
        display flex
        align-items center
        /*background-color magenta*/
        .left-title {
          flex 1
        }
        .describe {
          margin-top 5px
          font-size $font-size-small
        }
        .right-remark {
          text-align center
        }
      }

      .detail-con {
        width 100%
        /*overflow-x auto;*/
        /*overflow-y hidden ;*/
        /*-webkit-overflow-scrolling touch*/
        /*height 120px*/
        /*background-color #007aff*/
        .date-list {
          overflow-x: auto;
          overflow-y hidden;
          margin 12px 8px;
          white-space nowrap;
          .choosedate {
            display inline-block
            padding 8px 5px
            width 80px;
            text-align center
            border-radius: 5px;
            -webkit-border-radius: 5px;
            .week-con {
              font-size $font-size-small
            }
            .day-con {
              margin-top 5px
              font-size $font-size-medium
              font-weight 500;
              //font-weight $font-weight-x
            }
          }
        }
        .flex-con {
          display flex
          align-items center
          .left-ticket {
            flex 1
            /*.session{*/
            //font-size $font-size-medium
            //font-weight $font-weight-x
            //}
            .price {
              margin-top 10px
              font-size $font-size-medium-s
            }
            .big-font {
              font-size $font-size-medium-x
            }
            .price-z {
              font-size 16px;
              font-weight 500;
            }
            .price-x {
              font-size 12px;
              font-weight 500;
            }
          }
          .right-ticket {
            padding 6px 13px
            font-size $font-size-medium
            font-weight $font-weight-x
            border-radius: 18px;
            -webkit-border-radius: 18px;
          }
        }
        .notice-cell {
          display flex
          margin-top 10px
          .left-notice {
            width 65px
          }
          .right-notice {
            flex 1
            margin-left 10px
            p {
              margin-bottom 5px
            }
          }

        }
        .strategy-con {
          margin 13px 0px
        }
      }
    }
    .bigtitlefont {
      font-size $font-size-medium-x
      font-weight 500
    }
    .html-title {
      font-size $font-size-medium-x
      font-weight 500
      padding-bottom 12px;
    }
    .titlefont {
      font-size $font-size-medium-s
    }
    .smallfont {
      font-size $font-size-small
    }
    .padding-con {
      /*margin 10px;*/
      padding 15px 10px
      overflow hidden;
    }

  }
  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    box-shadow: 0 -2px 2px #efefef;
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
        background-color #fff
        width: 100px;
      }

      .addText {
        flex: 1;
      }
    }
  }
</style>
