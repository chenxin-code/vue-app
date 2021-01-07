/**Created by liaoyingchao on 2020-04-05.*/

<template>
  <div ref="detail_view" class="detail">
    <div class="back-div" :style="{marginTop: $store.state.barHeight + 'px'}">
      <div class="back-btn line_right" @click="backEvent">
        <i class="iconfont mall-fanhui"></i>
      </div>
      <div class="header-img">
        <img :src="detail.headImg || './imgs/test2.jpg'">
      </div>
      <div class="shop-div">
        <div class="name single-line">{{detail.topic}}</div>
        <div>{{detail.listener}}观看</div>
      </div>
      <div class="btn" v-if="detail.isSubscribe == 0" @click="subscribe">订阅</div>
      <div class="btn cancel" v-else @click="cancelSubscribe">取消订阅</div>
    </div>
    <div class="barrages-div">
      <Barrages ref="Barrages"></Barrages>
    </div>
    <div class="talk-list" ref="TalkList" v-show="playState == 1">
      <div>
        <div class="row">
          <div class="talk-block">
            <span class="name">欢迎来到直播间，平台提倡绿色健康直播，不提倡未成年人进行消费。直播内容和评论严禁出现违法违规、低俗色情、吸烟酗酒等内容，若有违反，将视情节严重程度对作者账号进行禁播、永久禁播或封停账号处理。在直播过程中如主播以陪玩、送礼物等方式诱导打赏、私下交易的，请谨慎判断，以防人身或财产损失。</span>
          </div>
        </div>
        <div class="row" v-for="talk in talkList">
          <div class="talk-block" v-if="talk.type == 20">
            <img class="tz" src="./imgs/tz.png"/>
            <span style="color: #E4905F;">{{talk.content}}</span>
          </div>
          <div class="talk-block" v-else>
            <span class="name" v-if="talk.nickName">{{talk.nickName}} </span>
            <span>{{talk.content}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lottery" v-show="surplusLotteryTime > 0 && playState == 1" @click="showLottery = true">
      <div class="img-div">
        <img src="./imgs/lottery.png"/>
      </div>
      <div class="time">{{lotteryTimeStr}}</div>
    </div>
    <div class="lottery-gift" v-show="showLotteryGift">
      <div>
        <img class="lg-img" src="./imgs/lg-img.png"/>
      </div>
      <div class="time" @click="showLotteryGift = false">
        <img class="lg-close" src="./imgs/lg-close.png"/>
      </div>
    </div>
    <div class="pros-div" v-if="playState == 1">
      <div class="pro-info" @click="popProduct(mainProduct)">
        <div class="pro-pic">
          <img :src="mainProduct.phMainUrl">
        </div>
        <div class="pro-text">
          <div class="pro-name double-line">{{mainProduct.skuName}}</div>
          <div class="pro-price theme_standard_font">¥<span class="big">{{$util.toDecimal2(mainProduct.salePrice)}}</span><span class="line-price">¥{{$util.toDecimal2(mainProduct.marketPrice)}}</span></div>
        </div>
      </div>
      <div class="pros-imgs" v-if="detail.liveRoomProModelList.length > 1">
        <!--<div class="pro-pic" v-for="(pro, idx) in otherProducts" @click="popProduct(pro)">-->
        <!--<img :src="pro.phMainUrl">-->
        <!--</div>-->
        <div class="pro-more" v-if="detail.liveRoomProModelList.length > 1" @click="showProListEvent">
          更多商品
        </div>
      </div>
    </div>
    <div class="flower-div">
      <!--<canvas id="cvs"></canvas>-->
      <Flower ref="Flower"></Flower>
    </div>
    <div class="bottom-div" v-if="playState == 1">
      <div class="bag" @click="showProListEvent">
        <img src="./imgs/bag_1.png">
      </div>
      <div class="talk-click-div" @click="toTalk">
        <div class="text single-line" v-if="detail.isMute == true">已禁言</div>
        <div class="text single-line" v-else>{{talkStr || '说点什么...'}}</div>
        <!--<van-field v-model="talkStr" />-->
      </div>
      <div class="coupon" @click="getCoupon">
        <img src="./imgs/coupon.png">
      </div>
      <div class="jp" @click="toGifts">
        <img src="./imgs/jp.png">
      </div>
      <div class="share" @click="doshare">
        <img src="./imgs/share_1.png">
      </div>
      <div class="dianzan" @click="dolike">
        <div class="number">{{detail.likes}}</div>
        <!--<i class="iconfont mall-shoucang theme_standard_font"></i>-->
        <img src="./imgs/dianzan_1.png">
      </div>
    </div>
    <div class="play-pop" v-if="showPlayBtn == true && playEnded != true" @click="clickPlay">
      <div class="play-pop-body">
        <div class="tip">主播正在直播</div>
        <div class="pro">
          <div class="pro-pic">
            <img :src="mainProduct.phMainUrl">
          </div>
          <div class="pro-text">
            <div class="pro-name double-line">{{mainProduct.skuName}}</div>
            <!--<div class="pro-price theme_standard_font">¥{{mainProduct.salePrice}}</div>-->
          </div>
        </div>
        <div class="play-btn theme_standard_bg">
          进入直播
        </div>
      </div>
    </div>
    <div class="talk-input-div" v-show="showTalkInput">
      <van-field ref="TalkInput" v-model="talkStr" @blur="talkBlur" @keyup.enter.native="sendTalk" placeholder="请输入">
        <template #button>
          <van-button size="small" type="info" :disabled="talkStr == ''" @click="sendTalk">发送</van-button>
        </template>
      </van-field>
    </div>
    <div class="live-stream-video">
      <swiper ref="MySwiper" :options="swiperOption">
        <swiper-slide v-for="(item, index) in list" :key="index">
          <!--<div class="slide-cont" v-if="playIndex+2 > index && playIndex-2 < index">-->
          <div class="slide-cont">
            <div class="video-div">
              <div :id="'video_div_' + index"></div>
            </div>
            <div class="default-img-div" v-if="playIndex != index || playAlready == false">
              <img :src="item.lbImg">
            </div>
            <div class="play-end" v-if="playIndex == index && playEnded == true">
              <div class="tip">当前主播已经直播结束！</div>
              <div class="btns">
                <div class="btn theme_standard_bg" @click="backIndex">去首页</div>
                <div class="btn theme_standard_bg" @click="moreLiveStream(index)">更多直播</div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <ProDetail class="pop-div" v-if="showProDetail" :proItem="proItem" @popClose="showProDetail=false" @buyPush="buyPush" :spCode="detail.spCode" :lbId="detail.lbId" :proSkuDistributionId="proItem.proSkuDistributionId" :microStoreCode="proItem.microStoreCode"></ProDetail>
    <ProList class="pop-div" v-if="showProList" :proList="detail.liveRoomProModelList" @popClose="showProList=false" @buyProduct="popProduct"></ProList>
    <CouponList class="pop-div" v-if="showCouponList" :lbId="detail.lbId" @popClose="showCouponList=false"></CouponList>
    <Lottery class="pop-div" v-if="showLottery" :lotteryTimeStr="lotteryTimeStr" :lotteryData="lotteryData" @popClose="showLottery=false"></Lottery>
    <Gifts class="pop-div" v-if="showGifts" :lbId="detail.lbId" @popClose="showGifts=false"></Gifts>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
  import wxfunc from '@/utils/wxfunc'
  import ProDetail from './base/pro-detail'
  import Barrages from './base/barrages'
  import ProList from './base/pro-list'
  import CouponList from './base/coupon-list'
  import Lottery from './base/lottery'
  import Gifts from './base/gifts'
  import Flower from './base/flower'
  import Config from '@/api/config'
  // import LikeHeart from "./js/flower";

  export default {
    name: "detail",
    components: {
      ProDetail,
      ProList,
      CouponList,
      Flower,
      Lottery,
      Gifts,
      Barrages
    },
    props: ['list'],
    data() {
      let that = this;
      return {
        showLotteryGift: false,
        showGifts: false,
        showLottery: false,
        showPlayBtn: false,
        shareView: false,
        playState: 0,
        showProDetail: false,
        showProList: false,
        showCouponList: false,
        proItem: {},
        //list: [],
        detail: {},
        mainProduct: {},
        otherProducts: [],
        playAlready: false,
        playEnded: false,
        playIndex: -1,
        // myClientWidth: 375,
        // myClientHeight: 667,
        player: null,
        nextPlayer: null,
        prevPlayer: null,
        talkStr: '',
        showTalkInput: false,
        talkList: [],
        swiperOption: {
          direction: 'vertical',
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          allowSlideNext: that.$store.state.webtype != '3' && that.$store.state.webtype != '2',
          allowSlidePrev: that.$store.state.webtype != '3' && that.$store.state.webtype != '2',
          //threshold: 50,
          longSwipesRatio: 0.2,
          speed: 500,
          autoplay: false,
          loop: false,
          paginationShow: true,
          initialSlide: that.playIndex,
          observer: true,
          observeParents: true,
          scrollbarDraggable: true,
          scrollbarSnapOnRelease: true,
          scrollbarHide: false,
          on: {
            // slideNextTransitionEnd: function(){
            //   console.log('slideNextTransitionEnd')
            //   that.playNext()
            // },
            // slidePrevTransitionEnd: function(){
            //   console.log('slidePrevTransitionEnd')
            //   that.playPrev()
            // },
            slideChangeTransitionEnd: function () {
              if (that.playIndex == this.realIndex) {
                // 切换到自己 不刷新
                return;
              }
              that.playCurrent(this.realIndex)
            },
          }
        },
        myTimer: null,
        likeNumber: 0,
        likeTimer: null,
        surplusLotteryTime: 0,
        lotteryTimer: null,
        lotteryTimeStr: '',
        lotteryData: {},
      }
    },
    methods: {
      clickMyOverlay: function () {
        console.log('clickMyOverlay')
      },
      cancelSubscribe: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/liveSubscribe';
        let params = {
          streamerId: this.detail.streamerId,
          isSubscribe: '0',
          roomId: this.detail.lbId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.$Toast('取消订阅成功！')
            this.detail.isSubscribe = '0'
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      subscribe: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/liveSubscribe';
        let params = {
          streamerId: this.detail.streamerId,
          isSubscribe: '1',
          roomId: this.detail.lbId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.$Toast('订阅成功！')
            this.detail.isSubscribe = '1'
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      showProListEvent: function () {

        this.$Loading.open();
        let url = '/app/json/live_broadcast/detail';
        let params = {
          lbId: this.detail.lbId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            // 更新商品信息
            this.detail.liveRoomProModelList = data.data.liveRoomProModelList;
            this.showProList = true
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      toGifts: function () {
        this.showGifts = true
      },
      getCoupon: function () {
        this.showCouponList = true
      },
      playDetail: function (pDetail) {
        // let arr = []
        // arr.push(pDetail)
        // this.list = arr

        this.detail = pDetail;

        // 商品分组 otherProducts mainProduct
        this.prosToGroup()

        this.addTalk(this.detail.liveCommentModelList)
        this.playState = 1
        // 开始轮询
        this.loopGetDetail()

        // 设置分享参数
        this.setWxShareArgs()

        setTimeout(() => {
          this.playCurrent(0, true)
        }, 50)
      },
      clickPlay: function () {
        this.showPlayBtn = false
        this.player.play()
      },
      doshare: function () {
        if (this.$store.state.webtype == '1') {
          this.shareLiveStream()
        } else if (this.$store.state.webtype == '3' || this.$store.state.webtype == '2') {
          this.shareView = true;
        } else {
          this.$Toast('暂未开通！')
        }
      },
      shareLiveStream: function () { //分享
        let shareData = {};
        shareData.title = this.detail.topic;
        shareData.sharetext = this.detail.subTopic;
        shareData.imageurl = this.detail.lbImg;
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + '/live-stream/share';
        if (shareData.detailurl.indexOf('?') != -1) {
          shareData.detailurl += '&playId=' + this.detail.lbId
        } else {
          shareData.detailurl += '?playId=' + this.detail.lbId
        }

        this.$bridgefunc.wechatShare(shareData);
      },
      moreLiveStream: function (index) {
        this.list.splice(index, 1)
        this.$emit('removeIndexItem', index)
        this.backEvent()
      },
      // 返回首页，这里很low但是没bug，切最简单，需要找机会处理
      backIndex: function () {
        if (this.$store.state.webtype == 3) {
          wx.miniProgram.reLaunch({url: `/pages/index/main`})
          return
        }
        let num = this.$router.customRouterData.routerPaths.length - 1
        // for (let i = num; i > 0; i--) {
        this.$router.go(-num);
        // }
        this.$keepaliveHelper.deleteOthers(this)
      },
      buyPush: function () {
        this.stopPlay()
      },
      pushBarrage: function (barrages) {
        if (this.$refs.Barrages) {
          this.$refs.Barrages.addBarrages(barrages)
        }
      },
      createLotteryTimeStr: function () {
        if (this.surplusLotteryTime >= 0) {
          let m = parseInt(this.surplusLotteryTime / 60)
          let s = parseInt(this.surplusLotteryTime % 60)
          if (s > 9) {
            return m + ':' + s
          } else {
            return m + ':0' + s
          }
        }
      },
      getLotteryResult: function (dynamicDetail) {
        // 有延迟 所以 延迟3秒请求 结果
        setTimeout(() => {
          let url = '/app/json/live_broadcast/winPrize';
          let params = {
            lbId: this.detail.lbId,
            activityId: dynamicDetail.lotActivityId
          }

          this.$http.post(url, params).then(res => {
            let data = res.data;
            if (data.status == 0) {
              if (data.data) {
                this.showLotteryGift = true;
              }
            } else {
              this.$Toast(data.info)
            }
          }, error => {
            // this.$Toast('点赞失败')
          });
        }, 5000)
      },
      runLotteryTimer: function (dynamicDetail) {
        if (dynamicDetail.isHasLotActivity) {
          let lotStartTime = this.$util.getDateFromString(dynamicDetail.lotStartTime)
          this.surplusLotteryTime = lotStartTime - this.$store.state.severTime.currentTime
          if (this.lotteryTimer == null && this.surplusLotteryTime > 0) {
            this.lotteryTimeStr = this.createLotteryTimeStr()
            this.lotteryTimer = setInterval(() => {
              this.surplusLotteryTime --
              this.lotteryTimeStr = this.createLotteryTimeStr()
              if (this.surplusLotteryTime <= 0) {
                clearInterval(this.lotteryTimer)
                this.lotteryTimer = null
                this.getLotteryResult(dynamicDetail)
              }
            }, 1000)
          }
        }
      },
      dynamicDetail: function (isFirst = false) {
        let commentId = 0
        if (this.talkList.length > 0) {
          // commentId = this.talkList[this.talkList.length-1].commentId
          for (let i = this.talkList.length - 1; i >= 0; i--) {
            let comment = this.talkList[i]
            if (comment.commentId) {
              commentId = comment.commentId
              break;
            }
          }
        }
        // /app/json/live_broadcast/dynamicDetail
        let url = '/app/json/live_broadcast/dynamicDetail';
        let params = {
          lbId: this.detail.lbId,
          commentId: commentId
        }

        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {
            let dynamicDetail = data.data
            if (dynamicDetail.state == -1) {
              this.$Toast('直播已结束，看看其他主播吧')
              this.playEnded = true
              this.stopPlay()
              return ;
            }
            if (dynamicDetail.likes > this.detail.likes) {
              this.detail.likes = dynamicDetail.likes
              let flowerDom = this.$refs.Flower
              flowerDom.manyFlower()
            }
            this.runLotteryTimer(dynamicDetail)
            this.lotteryData = dynamicDetail.liveRoomLotActivityModel

            this.detail.listener = dynamicDetail.listener
            this.detail.isMute = dynamicDetail.isMute
            let lsarr = []
            let barrages = []
            for (let i = 0; i < dynamicDetail.liveCommentModelList.length; i++) {
              let comment = dynamicDetail.liveCommentModelList[i]
              let isXd = false
              if (comment.content.indexOf('【下单】') == 0) {
                isXd = true
                comment.content = comment.content.substr(4)
              }
              if (!isFirst && isXd) {
                barrages.push(comment)
              }
              lsarr.push(comment)
            }
            this.pushBarrage(barrages)
            this.addTalk(lsarr)
            if (dynamicDetail.liveRoomProModel && dynamicDetail.liveRoomProModel != '') {
              this.mainProduct = dynamicDetail.liveRoomProModel
            } else {
              this.prosToGroup(dynamicDetail.mainPushId)
            }
            this.loopGetDetail()
          } else {
            this.loopGetDetail()
            //this.$Toast(data.info)
          }
        }, error => {
          //this.$Toast('点赞失败')
          this.loopGetDetail()
        });
      },
      loopGetDetail: function () {
        if (this.myTimer) {
          clearTimeout(this.myTimer)
          this.myTimer = null
        }
        this.myTimer = setTimeout(() => {
          this.dynamicDetail()
        }, 2000)
      },
      likeApi: function (num) {
        let url = '/app/json/live_broadcast/like';
        let params = {
          lbId: this.detail.lbId,
          likeNumber: num
        }

        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Toast('点赞失败')
        });
      },
      dolike: function () {
        if (this.likeTimer) {
          clearTimeout(this.likeTimer)
          this.likeTimer = null
        }

        let flowerDom = this.$refs.Flower
        flowerDom.aFlower()

        this.likeNumber++
        this.detail.likes++
        this.likeTimer = setTimeout(() => {
          if (this.likeNumber > 0) {
            this.likeApi(this.likeNumber)
            this.likeNumber = 0
          }
        }, 1000)
      },
      talkBlur: function () {
        setTimeout(() => {
          this.showTalkInput = false;
        }, 200)
      },
      sendTalk: function () {

        if (this.talkStr == '') {
          return;
        }
        let url = '/app/json/live_broadcast/comment';
        let params = {
          lbId: this.detail.lbId,
          content: this.talkStr
        }

        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {

            if (this.$store.state.userInfo.phone) {
              this.addTalk([{
                nickName: this.$store.state.userInfo.nickName || this.$util.dealPhone(this.$store.state.userInfo.phone),
                content: this.talkStr
              }], true)
            } else {
              this.addTalk([{
                nickName: '游客',
                content: this.talkStr
              }], true)
            }

            this.talkStr = ''
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Toast('发送失败')
        });
        this.$refs.TalkInput.blur()
        this.showTalkInput = false;
      },
      toTalk: function () {
        if (this.detail.isMute == true) {
          this.$Toast('您已被禁言！')
          return ;
        }
        this.showTalkInput = true;
        this.$refs.TalkInput.focus()
        this.$nextTick(() => {
          this.$refs.TalkInput.focus()
        })
      },
      popProduct: function (product) {

        this.proItem = product
        this.showProDetail = true
      },
      backEvent: function () {
        this.stopPlay()
        this.$emit('backEvent')
      },
      addTalk: function (arr, sroll = false) {
        if (arr.length == 0) {
          return
        }
        let talkDom = this.$refs.TalkList
        let lsArr = []
        let i = 0;
        if (this.talkList.length > 60) {
          i = 20
        }
        for (; i < this.talkList.length; i++) {
          if (this.talkList[i].commentId) {
            lsArr.push(this.talkList[i])
          }
        }

        this.talkList = lsArr.concat(arr)
        if (!sroll && talkDom.scrollTop + talkDom.clientHeight < talkDom.scrollHeight - 30) {
          // 如果用户正在看历史信息，不滚动了
          return;
        }
        this.$nextTick(() => {
          talkDom.scrollTop = talkDom.scrollHeight;
        })
      },
      getDetailInfo: function () {
        let item = this.list[this.playIndex]

        this.$Loading.open();
        let url = '/app/json/live_broadcast/detail';
        let params = {
          lbId: item.lbId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.detail = data.data;

            // 商品分组 otherProducts mainProduct
            this.prosToGroup()

            this.addTalk(this.detail.liveCommentModelList)
            this.playState = 1
            // 开始轮询
            this.dynamicDetail(true)

            // 设置分享参数
            this.setWxShareArgs()
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      prosToGroup: function (mainPushId = '') {
        // 商品分组 otherProducts mainProduct
        this.mainProduct = {}
        // this.otherProducts = []
        if (this.detail.liveRoomProModelList) {
          for (let i = 0; i < this.detail.liveRoomProModelList.length; i++) {
            let pro = this.detail.liveRoomProModelList[i]
            if (mainPushId) {
              if (pro.id == mainPushId) {
                this.mainProduct = pro
              }
            } else {
              if (pro.mainPush == 1) {
                this.mainProduct = pro
              }
            }
          }
        }
      },
      playCurrent: function (index, notouch = false) {
        this.detail = this.list[index];
        this.talkList = []
        this.stopPlay()
        this.playIndex = index
        this.player = this.initPlayer(this.playIndex)
        if (notouch) {
          this.showPlayBtn = true
        } else {
          this.player.play()
        }
      },
      getVideoStyle: function (item) {
        let width = document.documentElement.clientWidth
        let height = document.documentElement.clientHeight
        let resolution = item.resolution
        let resolutionArr = []
        if (resolution && resolution != '') {
          resolutionArr = resolution.split('*')
        }
        if (resolutionArr && resolutionArr.length == 2) {
          let resolutionW = parseFloat(resolutionArr[0])
          let resolutionH = parseFloat(resolutionArr[1])
          if (resolutionW > 0 && resolutionH > 0) {
            let ratioW = width / resolutionW
            let ratioH = height / resolutionH
            if (ratioW > ratioH) {
              item.fullVideoWidth = width
              item.fullVideoHeight = 'auto'
              // height = parseInt(ratioW * resolutionH)
            } else {
              item.fullVideoWidth = 'auto'
              item.fullVideoHeight = height
              // width = parseInt(ratioH * resolutionW)
            }
          }
        } else {
          item.fullVideoWidth = width
          item.fullVideoHeight = height
        }
        // return 'width: '+width+'px;'+'height: '+height+'px;'
      },
      initPlayer: function (index) {
        this.playEnded = false
        let item = this.list[index]
        this.getVideoStyle(item)
        // 初始化播放器
        let idStr = 'video_div_' + index
        let width = item.fullVideoWidth
        let height = item.fullVideoHeight
        // console.log(width,height)
        let player = new TcPlayer(idStr, {
          "m3u8": item.pullHlsUrl, //请替换成实际可用的播放地址
          "autoplay": true,
          "flash": false,
          "controls": "none",
          "poster": item.lbImg,
          // "width": width,//视频的显示宽度，请尽量使用视频分辨率宽度
          // "height": height,//视频的显示高度，请尽量使用视频分辨率高度
          width: width,
          height: height,
          listener: (msg) => {
            // console.log(msg)
            // this.showPlayBtn = false
            // console.log(msg)
            if (msg.type == 'error') {
              console.error(msg)
              // this.$Toast('直播已结束，看看其他主播吧')
              // this.playEnded = true
            } else if (msg.type == 'loadeddata') {
              setTimeout(() => {
                this.playAlready = true
              }, 200)
              this.getDetailInfo()
            } else if (msg.type == 'resize') {
              // console.log(msg)
              // let dom = document.getElementById(idStr)
              // let videoElArr = dom.getElementsByTagName('video')
              // if (videoElArr && videoElArr.length > 0) {
              //   let dom1 = videoElArr[0]
              //   dom1.setAttribute('width', width)
              //   dom1.setAttribute('height', height)
              // }
            }
          }
        });
        return player
      },
      stopPlay: function () {
        this.playState = 0
        this.playAlready = false
        if (this.myTimer) {
          clearTimeout(this.myTimer)
          this.myTimer = null
        }
        this.surplusLotteryTime = 0
        if (this.lotteryTimer) {
          clearInterval(this.lotteryTimer)
          this.lotteryTimer = null
        }
        if (this.player) {
          this.player.pause()
          this.player.destroy()
          this.player = null
        }
      },
      doPlayIndex: function (idx, noTouch = false) {
        this.$refs.MySwiper.swiper.slideTo(idx, 0, false)
        this.playCurrent(idx, noTouch)
      },
      setWxShareArgs: function () {
        if (this.$store.state.webtype == 2) {
          let shareData = {};
          shareData = {};
          shareData.title = this.detail.topic;
          shareData.sharetext = this.detail.subTopic;
          shareData.imageurl = this.detail.lbImg;
          shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + '/live-stream/share';
          if (shareData.detailurl.indexOf('?') != -1) {
            shareData.detailurl += '&playId=' + this.detail.lbId
          } else {
            shareData.detailurl += '?playId=' + this.detail.lbId
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
          let path = '/live-stream/share'
          if (path.indexOf('?') != -1) {
            path += '&playId=' + this.detail.lbId
          } else {
            path += '?playId=' + this.detail.lbId
          }
          let shareData = {
            title: this.detail.topic,
            path: `${Config.shareUrl}${path}`,
            imageUrl: this.detail.lbImg,
            rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
          }
          console.log('shareData', shareData)
          wx.miniProgram.postMessage({data: JSON.stringify(shareData)});
        }
      },
    },
    created() {
      // let list = this.$route.params.list
      // if (list) {
      //   sessionStorage.setItem('temp_list', JSON.stringify(list))
      // } else {
      //   list = JSON.parse(sessionStorage.getItem('temp_list'))
      // }
      // this.list = list
    },
    mounted() {
      // this.playCurrent(0)
    },
    destroyed() {
      this.stopPlay()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .detail {
    //width 100%
    //height 100%
    overflow hidden
    position absolute;
    left 0;
    right 0;
    top 0;
    bottom 0;
    z-index 9;
    background-color white;

    .play-pop {
      position absolute;
      left 0;
      top 0;
      right 0;
      bottom 0;
      z-index 999;
      display flex;
      justify-content center;
      align-items center;

      .play-pop-body {
        width 260px
        //height 200px;
        background-color white;
        border-radius 10px;
        display flex;
        justify-content center;
        align-items center;
        flex-direction column;
        padding 8px;

        .tip {
          padding 12px;
          font-size 14px;
        }

        .play-btn {
          margin-top 10px;
          margin-bottom 15px;
          width 100px;
          padding 5px 10px;
          border-radius 20px;
          text-align center;
          color white
          font-size 13px;
        }

        .pro {
          display flex;
          justify-content center;
          align-items center;
          flex-direction column;

          .pro-pic {
            img {
              width 100px;
              height 100px;
            }
          }

          .pro-text {
            margin-top 8px;
            flex 1;
            overflow hidden;

            .pro-name {
              padding 0px 15px;
              overflow hidden;
              font-size 12px;
              line-height 16px;
              height 32px;
            }

            .pro-price {
              text-align center;
              padding 4px 30px 0;
              //margin-top 4px;
              font-size 10px;
              overflow hidden;
              .big {
                font-size 14px;
              }
            }
          }
        }
      }
    }

    >>> .stateBox {
      z-index: 2001;
      /*height: 180px;*/
      /*line-height: 180px;*/
      width: 100%;
      text-align: center;
      font-size: 16px;
      color white;
      top 100px;
      right 0;

      img {
        width 80px;
        margin 0 0 15px 160px;
      }

      &.van-popup {
        background transparent;
      }

      >>> .van-overlay {
        background-color rgba(0, 0, 0, 0.6)
      }
    }

    .pop-div {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      top 0;
      z-index 50;
    }

    .back-div {
      position absolute;
      top 8px;
      z-index 100;
      left 10px;
      background-color rgba(0, 0, 0, 0.5)
      display flex;
      align-items center;
      border-radius 30px;
      overflow hidden;

      .back-btn {
        width 50px;
        height 30px;
        line-height 30px;
        text-align center;

        .mall-fanhui {
          font-size 16px;
          color white;
        }
      }

      .header-img {
        margin 8px;

        img {
          width 34px;
          height 34px;
          display block;
          border-radius 18px;
        }
      }

      .shop-div {
        margin-right 12px;
        font-size 12px;
        color white;
        overflow hidden;

        .name {
          max-width 100px;
          font-size 14px;
          font-weight 600;
          padding-bottom 6px;
        }
      }
      .btn {
        font-size 12px;
        border-radius 20px
        padding 8px 12px;
        margin-right 14px;
        background-color #f80f16
        color white
        &.cancel {
          background-color #aaa;
        }
      }
    }

    .flower-div {
      position absolute;
      bottom 60px;
      right 3px;
      width 140px;
      //height 400px;
      z-index 5;
      pointer-events: none;
    }

    .barrages-div {
      position absolute;
      top 100px;
      left 0;
      right 0;
      z-index 9;
      pointer-events: none;
    }

    .talk-list {
      position absolute;
      bottom 130px;
      left 10px;
      width 240px;
      max-height 195px;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      z-index 9;
      border-radius 5px;

      .row {
        margin-top 6px;
        display flex;
        overflow hidden;

        .talk-block {
          border-radius 6px;
          padding 3px 6px;
          background-color rgba(0, 0, 0, 0.2)
          color white;
          font-size 0;
          display flex;
          align-items center;

          span {
            line-height 1.6;
            word-break: break-all;
            font-size 10px;
          }

          .tz {
            margin-right 6px;
            width 14px;
            height 14px;
          }

          .name {
            padding-right 6px;
            color #e6ca32
          }
        }
      }
    }

    .lottery {
      position absolute;
      top 220px;
      right 10px;
      background-color white;
      z-index 9;
      border-radius 5px;
      padding 4px;
      .img-div {
        img {
          display block;
          width 39px;
          height 39px;
        }
      }
      .time {
        margin-top 4px;
        font-size 10px;
        text-align center;
      }
    }

    .lottery-gift {
      position absolute;
      top 50%;
      left 50%;
      margin-top -140px;
      margin-left -80px;
      z-index 10;
      display flex;
      flex-direction column;
      align-items center;
      justify-content center;
      .lg-img {
        display block;
        width 160px;
        height 160px;
      }
      .lg-close {
        display block;
        width 60px;
        height 60px;
      }
    }

    .pros-div {
      position absolute;
      bottom 65px;
      left 10px;
      //width 240px;
      height 55px;
      //overflow-y auto;
      z-index 9;
      border-radius 5px;
      overflow hidden;
      display flex;
      align-items center

      .pro-info {
        //flex 1;
        width 190px;
        overflow hidden;
        display flex;
        align-items center;
        background-color white;

        .pro-text {
          flex 1;
          overflow hidden;

          .pro-name {
            padding 0px 8px;
            overflow hidden;
            font-size 12px;
            line-height 15px;
            height 30px;
          }

          .pro-price {
            padding 4px 8px 0;
            //margin-top 4px;
            font-size 10px;
            overflow hidden;
            .big {
              font-size 14px;
            }
            .line-price {
              margin-left 8px;
              font-size 12px;
              text-decoration: line-through
              color #999;
            }
          }
        }

        .pro-pic {
          width 55px;
          height 55px;
          //border-radius 3px;
          overflow hidden;

          img {
            display block;
            width 100%;
            height 100%;
          }
        }
      }

      .pros-imgs {
        max-width 175px;
        display flex;
        align-items center;

        .pro-pic {
          width 60px;
          height 55px;
          //border-radius 3px;
          overflow hidden;

          img {
            display block;
            width 100%;
            height 100%;
          }
        }

        .pro-more {
          width 50px;
          height 55px;
          font-size 14px;
          line-height 16px;
          color white;
          padding 12px 9px;
          background-color #FF403E;
          text-align center;
        }
      }
    }

    .talk-input-div {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      z-index 19;
      background-color white;
      display flex;
      align-items center;

      >>> .van-cell {
        flex 1;
      }

      .send-btn {
        color #999;
        width 50px;
        font-size 14px;
        height 34px;
        line-height 34px;
        text-align center;

        &.can-send {
          color #1989fa;
        }
      }
    }

    .bottom-div {
      position absolute;
      left 10px;
      right 10px;
      bottom 10px;
      height 50px;
      z-index 9;
      display flex;
      align-items center;

      .bag {
        margin-right 10px;

        img {
          display block;
          width 29px;
          height 32px;
        }
      }

      .talk-click-div {
        //position relative;
        border-bottom 1px solid white;
        flex 1;

        .text {
          line-height 40px;
          font-size 14px;
          color white;
          padding-left 5px;
        }

        .van-cell {
          background-color transparent !important;
          height 40px;
          padding-left 5px;
          font-size 14px;

          >>> .van-field__control {
            color white;
          }
        }
      }

      .coupon {
        padding 0 8px 0 15px;

        img {
          margin-top 16px;
          display block
          width 33px;
          height 33px;
        }
      }

      .jp {
        padding 0 8px 0 8px;

        img {
          margin-top 16px;
          display block
          width 33px;
          height 33px;
        }
      }

      .share {
        padding 0 8px 0 8px;

        img {
          margin-top 16px;
          display block
          width 33px;
          height 33px;
        }
      }

      .dianzan {
        padding 5px 10px 5px 8px;
        text-align center;

        img {
          display block
          width 33px;
          height 33px;
        }

        .number {
          overflow hidden;
          padding 1px 4px;
          border-radius 10px;
          text-align center;
          font-size 12px;
          margin-bottom 2px;
          color white;
          height 14px;
          background-color #FF403E;
        }
      }
    }

    .live-stream-video {
      width 100%
      height 100%

      .swiper-container {
        width 100%
        height 100%

        .slide-cont {
          width 100%
          height 100%
          position relative;

          .video-div {
            width 100%
            height 100%
            display flex;
            align-items center;
            justify-content center;

            >>> .vjs-modal-dialog-content {
              font-size 0;
            }

            >>> .vcp-bigplay {
              width 0;
              height 0;
            }

            >>> .vcp-player {
              width 100%;
              height 100%;
            }

            >>> .vcp-error-tips {
              font-size 0;
            }

            >>> .vcp-poster-pic {
              width 100%;
              height 100%;
            }
          }

          .default-img-div {
            position absolute;
            left 0;
            right 0;
            top 0;
            bottom 0;
            z-index 5;

            &.default-img-div::before {
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              z-index 1;
              //background: rgba(255, 255, 255, .3);
              //filter: blur(20px);
              //margin: -30px;
            }

            img {
              position relative;
              display block;
              width 100%;
              height 100%;
              z-index -1
            }
          }

          .play-end {
            position absolute;
            left 0;
            right 0;
            top 0;
            bottom 0;
            z-index 10;

            .tip {
              margin 150px 40px 0;
              font-size 14px;
              color white;
              text-align center;
            }

            .btns {
              margin-top 30px;
              display flex;
              flex-direction column;
              justify-content center;
              align-items center;

              .btn {
                width 110px;
                margin-bottom 15px;
                font-size 14px;
                padding 6px 15px;
                border-radius 20px;
                text-align center;
                color white;
              }
            }
          }
        }
      }
    }
  }
</style>
