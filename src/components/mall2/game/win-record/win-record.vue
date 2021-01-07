<template>
  <div>
    <nav-top @backEvent="backEvent" title="历史中奖纪录">
      <div
        class="right-btn theme_font_gray"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px;font-size: 12px;"
        @click="toHistory"
        v-if="$store.state.globalConfig.kshop_rewardList_url && $store.state.globalConfig.kshop_rewardList_url != undefined"
      >历史记录
      </div>
    </nav-top>
    <nav-content>
      <div class="award-list-container">
        <div class="nav-tab">
          <div class="nav-tab-item" :class="{active: curState === item.awardState}" @click="nav(item.awardState)"
               v-for="(item, index) in navMenu">
            <span class="text">{{item.name}}</span>
          </div>
        </div>
        <div class="award-list-content"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             :infinite-scroll-immediate-check="true"
             infinite-scroll-distance="100">
          <div class="table-view award-item" v-for="(item, index) in prizeList">
            <div class="table-view-cell">
              <div class="pull-left" v-if="item.fromType==3">{{item.awardType==100 ? '抽奖活动' : '领取活动'}}</div>
              <div class="pull-left" v-else>{{item.gameTypeTitle}}</div>
              <div class="pull-right">{{item.createTime}}</div>
            </div>
            <div class="table-view-cell" v-if="item.fromType==3">
              <div class="award-body clearfix">
                <img class="award-img" :src="item.awardPic ? item.awardPic : 'static/image/live-stream/gift.png'"
                     alt="">
                <div class="award-con">
                  <p class="award-name m-ellipsis">{{item.awardName}}
                    <span class="status">{{item.awardStateStr}}</span>
                  </p>
                  <p class="award-num">数量：{{item.awardNum}}</p>
                  <p class="award-address" v-if="item.deliverCheckcode && curState == 5">
                    <span v-if="item.addressInfo">地址：{{JSON.parse(item.addressInfo).addressFull}}</span>
                    <span class="edit-btn" @click="showPickupQrcode(item.deliverCheckcode)" v-if="item.deliverType == 1">提货码</span>
                    <span class="edit-btn" @click="modifyAddress(item)" v-else-if="item.deliverType == 2 && item.addressInfo">修改</span>
                    <span class="edit-btn" @click="modifyAddress(item)" v-else>设置收货地址</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-else>
              <div class="award-body clearfix">
                <img class="award-img" :src="item.awardPic ? item.awardPic : 'static/image/live-stream/gift.png'"
                     alt="">
                <div class="award-con">
                  <p class="award-name m-ellipsis">{{item.awardName}}
                    <span class="status">{{item.awardStateStr}}</span>
                  </p>
                  <p class="award-num">数量：{{item.awardNum}}</p>
                  <p class="award-address">
                    <span v-if="item.addressInfo">地址：{{JSON.parse(item.addressInfo).addressFull}}</span>
                    <span v-if="item.awardState != 10" class="edit-btn"
                          @click="getAddress(item.id, item.deliverType)">{{item.addressInfo ? '修改' : '设置收货地址'}}</span>
                  </p>
                  <div class="qr-code" @click="showQrcode(item.id)"
                       v-if="item.addressInfo && JSON.parse(item.addressInfo).chooseDeliverType == 1">
                    <img class="img" src="@/assets/icons/icon-qr-code.png" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tip-data">
            <div class="has-data" v-show="hasMore">
              正在加载
              <mt-spinner class="icon" :size="22" type="fading-circle"></mt-spinner>
            </div>
            <div class="no-data" v-show="!hasMore">已经到底啦~</div>
          </div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="modelShow" position="bottom">
      <van-picker show-toolbar title="选择提货方式" :columns="columns" @cancel="modelShow = false" @confirm="onConfirm"/>
    </van-popup>
    <van-popup v-model="qrCodeModelShow">
      <canvas class="qrcode" id="qrcode" ref="qrcode"></canvas>
    </van-popup>
    <van-popup class="pickup-pop" v-model="showPickupCode">
      <div class="pickup-div">
        <div class="title">查看提货码</div>
        <div class="code-text">提货码：{{qrcodeStr}}</div>
        <div class="qrcode-div">
          <canvas id="pickupqrcode"></canvas>
        </div>
        <div class="tip">请到任一门店出示此二维码提货</div>
        <div class="btn" @click="showPickupCode = false">知道啦～</div>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {mapGetters} from 'vuex'
  import QRCode from 'qrcode'

  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        showPickupCode: false,
        loading: false,
        hasMore: true,
        page: 0,
        curId: '', // 当前编辑的奖项id
        deliverType: '', // 当前编辑的奖项自提方式
        fromType: '', // 当前奖品获取类型
        prizeList: [],
        navMenu: [{name: '未领取', awardState: 5}, {name: '已领取', awardState: 10}],
        curState: 5,
        modelShow: false,
        columns: [{text: '自提', deliverType: 1}, {text: '配送', deliverType: 2}],
        qrCodeModelShow: false,
        qrcodeStr: ''
      }
    },
    mounted() {
      this.loadMore()
      console.log(this.$route.query.type);
    },

    methods: {
      showPickupQrcode: function (code) {
        this.qrcodeStr = code
        this.showPickupCode = true
        this.$nextTick(() => {
          QRCode.toCanvas(document.getElementById('pickupqrcode'), code + '', { width: 160})
        })
      },
      toHistory: function () {
        this.$Loading.open();
        let redUrl = this.$store.state.globalConfig.kshop_rewardList_url
        let url = '/app/json/login/redirectToKShop';
        let paramsData = {
          redirectUrl: redUrl
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let realUrl = data.data
              this.$bridgefunc.customPush({
                path: realUrl,
                isnativetop: '1'
              }, false)
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
      backEvent() {
        if (this.$route.query.type == 'subject') {
          this.$router.push({
            path: '/questionlist'
          })
        } else if (this.$route.query.type == 'serviceSubject') {
          this.$router.push({
            path: '/service/questionlist'
          })
        } else {
          this.$router.go(-1)
        }
      },
      nav(status) {
        if (this.curState === status) {
          return
        }
        this.curState = status
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.prizeList = []
        this.loadMore()
      },
      loadMore() {
        this.$Loading.open();
        this.page++
        this.loading = true
        let paramsData = {
          awardState: this.curState,
          page: this.page,
          rows: 12,
          token: this.$store.state.login.token
        }
        this.queryGameAwardDist(paramsData).then(res => {
          let data = res.data
          if (data.result == 'success' && data.status == 0) {
            this.prizeList = this.prizeList.concat(data.data)
            if (this.prizeList.length < data.totalRecords) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          }
          this.$Loading.close();
        })
      },
      showQrcode(id) {
        this.qrCodeModelShow = true
        console.log(id)
        this.$nextTick(() => {
          QRCode.toCanvas(document.getElementById('qrcode'), id + '')
        })
      },
      getAddress(id, deliverType, fromType) {
        this.curId = id
        this.deliverType = deliverType
        this.fromType = fromType
        if (deliverType == 1) {
          this.$router.push('/mall2/mypickupaddress?pageType=5')
        } else if (deliverType == 2) {
          this.$router.push('/mall2/addresslist')
        } else if (deliverType == 12) {
          this.modelShow = true
        }
      },
      modifyAddress(item) {
        this.curId = item.id
        this.deliverType = item.deliverType
        this.fromType = item.fromType
        this.$router.push('/mall2/addresslist')
      },
      submitAddress(address) {
        this.$Loading.open();
        address.chooseDeliverType = this.deliverType
        let paramsData = {
          addressInfo: JSON.stringify(address),
          id: this.curId
        }
        let url = '/app/json/app_game/updateRecAwardAddress'
        if (this.fromType == '3') {
          url = '/app/json/live_broadcast/liveAwardAddress'
          paramsData.addressModel = JSON.stringify(address)
        }
        this.$http.post(url, paramsData).then(res => {
          let data = res.data
          if (data.result == 'success' && data.status == 0) {
            let curPrize = this.prizeList.find((item) => item.id == this.curId)
            curPrize.addressInfo = JSON.stringify(address)
            this.$toast('设置成功')
          } else {
            this.$toast(data.info || '设置失败')
          }
          this.$Loading.close();
        })
      },
      onConfirm(value) {
        const deliverType = value.deliverType
        this.deliverType = deliverType
        if (deliverType == 1) {
          this.$router.push('/mall2/mypickupaddress?pageType=5')
        } else if (deliverType == 2) {
          this.$router.push('/mall2/addresslist')
        }
      }
    },
    computed: {
      ...mapGetters(['getSelectAddress', 'getPickAddress'])
    },
    components: {},
    destroyed() {
      this.curId = ''
    },
    watch: {
      getSelectAddress(address) {
        if (this.curId && this.deliverType == 2) {
          this.submitAddress(address)
        }
      },
      getPickAddress(address) {
        if (this.curId && this.deliverType == 1) {
          this.submitAddress(address)
          console.log(address)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .pickup-pop {
    background none
    .pickup-div {
      background: url('../../../../../static/image/live-stream/pickup-code-bg.png') no-repeat center center / 100% 100%;
      width 310px;
      border-radius 5px;
      overflow hidden;
      .title {
        background-color #FF403E;
        color white;
        padding 16px;
        font-size 18px;
        font-weight 600;
        text-align center;
      }
      .code-text {
        text-align center;
        font-size 16px;
        margin-top 25px;
      }
      .qrcode-div {
        width 100%
        height 168px;
        display flex;
        justify-content center;
        align-items center;
      }
      .tip {
        font-size 14px;
        text-align center;
        margin-top 20px;
        color #999;
      }
      .btn {
        padding 15px 15px 22px;
        font-size 18px;
        font-weight 600;
        text-align center;
        color #FF403E;
      }
    }
  }

  .award-list-container {
    height 100%
    background: #fff;
    display flex
    flex-direction column

    .nav-tab {
      flex-shrink 0
      padding: 0 0 15px 0
      display flex

      .nav-tab-item {
        flex 1
        text-align: center

        &.active {
          color: #f62e2e

          .text:after {
            content ''
            position: absolute
            width 100%
            left: 0
            border-bottom 2px solid #f62e2e
            bottom -3px;
          }
        }

        .text {
          padding 6px 0
          display inline-block
          position: relative
        }
      }
    }

    .award-list-content {
      flex 1
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding 8px 10px;
    }

    .award-item {
      border-radius 4px;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      overflow: hidden;
    }

    .table-view-cell:after {
      left: 15px;
      right: 15px;
    }

    .award-body {
      .award-img {
        width 80px;
        height 80px;
        float: left
      }

      .award-con {
        overflow: hidden
        padding-left: 12px;

        .award-name {
          padding-right: 38px;
          position: relative
          line-height 17px;

          .status {
            font-size: 12px;
            color: #999
            position: absolute
            right: 2px;
            top: 0;
            line-height: 17px;
          }
        }

        .award-num {
          font-size: 12px;
          color: #999
          padding 6px 0
        }

        .award-address {
          font-size: 12px;
          color: #999
          padding-right: 38px;
          position: relative
          line-height: 17px;
          min-height: 20px;

          .edit-btn {
            position: absolute
            right: 2px;
            top: 0;
            color: #f62e2e
            line-height: 17px;
          }
        }
      }
    }

    .table-view + .table-view {
      margin-top: 8px;
    }

    .table-view-cell {
      padding: 11px 15px;
      background: #fff;
      position: relative;
      overflow: hidden;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 15px;
        right: 15px;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        pointer-events: none;
        box-sizing: border-box;
        border: 0 solid #e5e5e5
        border-bottom-width: 1px
      }

      &:last-child:after {
        display: none;
      }

      .table-view-cell-text {
        padding-right: 10px;
      }
    }

    .pull-left {
      float: left;
    }

    .pull-right {
      float: right;
    }

    .clearfix:after, .clearfix:before {
      content: '';
      display: table;
    }

    .clearfix:after {
      clear: both;
    }

    .tip-data {
      padding 15px;
      font-size: 14px;
      text-align: center
      color: #999

      .has-data {
        position: relative
        display inline-block

        /deep/ .icon {
          position: absolute
          right 110%;
          top: 50%;
          transform translateY(-50%)
        }
      }
    }

    .qr-code {
      text-align: right
      padding-top: 5px;

      .img {
        width 20px;
      }
    }
  }

  .qrcode {
    width 200px !important;
    height 200px !important;
    display block;
  }
</style>
