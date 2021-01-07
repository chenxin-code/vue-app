<template>
  <div>
    <nav-top @backEvent="$router.go(-1)">
    </nav-top>
    <!-- 内容区域 -->
    <nav-content class="container">
      <div class="have-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore" class="product-list">
          <div v-for="(item, index) in cardList" :key="index" @click="cardClick(item)" class="item" v-if="haveList">
            <img class="pro-img" :src="item.cardFrontPicUrl" alt="">
            <!--          <img v-if="item.cardType == 1" class="pro-img" src="../assets/image/card3.png" alt="">-->
            <div class="card-content">
              <div class="top">
                <span class="card-name">{{ item.cardName }}</span>
                <span class="card-type">{{ item.cardTypeStr }}</span>
              </div>
              <div class="mid-price"><span class="icon">余额：￥</span>{{ item.balance }}</div>
              <div class="btm-content">
                <span class="card-number">卡号：{{ item.cardNo }}</span>
                <span @click.stop="nowUseHandler(item)" v-if="item.termOfType != 2" class="now-use">立即使用</span>
              </div>
              <div class="lose-efficacy" v-if="item.termOfType == 2">
                <img src="../assets/image/icon@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="no-list" v-else>
            <div class="img">
              <img src="../assets/image/p2@2x.png" alt="">
            </div>
            <div class="text">没有可使用的易捷卡</div>
          </div>
        </van-list>
        <!-- 立即使用弹框 -->
        <van-popup class="use-modal" v-model="useModal">
          <div class="top">
            <canvas class="bar-code" id="barcode"></canvas>
            <p class="card-num">{{ modalData.number }}</p>
          </div>
          <div class="partition">
            <div class="line"></div>
          </div>
          <div class="bottom">
            <canvas class="qr-code" id="qrcode"></canvas>
            <p class="title">卡内余额</p>
            <ul class="service-list">
              <li v-for="(item, index) in myInfo.itemList" :key="index" class="item">
                {{ item.skuName }}<span>{{ item.balance }}次</span>
              </li>
            </ul>
          </div>
        </van-popup>
        <!--    扫码后弹框-->
        <van-popup v-model="showInfo" position="bottom">
          <div class="icon-pop">
            <van-icon name="cross" size="20" @click="showInfo = false"/>
          </div>
          <div class="recharge-popup">
            <ul class="serve-list">
              <li class="serve-item">洗车 -1次</li>
              <li class="serve-item">汽车保养 -2次</li>
            </ul>
            <div class="info">
              <div class="details">
                <span class="title">订单号</span>
                <span class="content">123412341</span>
              </div>
              <div class="details">
                <span class="title">消费店铺</span>
                <span class="content">喜擦擦汽车美容</span>
              </div>
              <div class="details">
                <span class="title">扣款时间</span>
                <span class="content">2019-11-11</span>
              </div>
            </div>
          </div>
          <div class="re-btn" @click="queryPay">确认支付</div>
        </van-popup>
        <!--    &lt;!&ndash; 密码输入框 &ndash;&gt;-->
        <!--    <van-popup v-model="showPwd" position="bottom" :style="{ height: '60%' }">-->
        <!--      <div class="icon-pwd">-->
        <!--        <div class="text">虚拟支付密码</div>-->
        <!--        <van-icon name="cross" size="20" @click="showPwd = false"/>-->
        <!--      </div>-->
        <!--      <van-password-input-->
        <!--        :value="value"-->
        <!--        info="请输入虚拟支付密码"-->
        <!--      />-->
        <!--      <van-number-keyboard-->
        <!--        :show="showKeyboard"-->
        <!--        @input="onInput"-->
        <!--        @delete="onDelete"-->
        <!--      />-->
        <!--    </van-popup>-->
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '@/components/base/scroll/scroll.vue'
  import JsBarcode from 'jsbarcode'
  import DigitalPwd from '../../../components/mall2/common/digital-pwd'
  import {mapGetters} from 'vuex'
  import md5String from "../../../utils/md5"
  import Qrcode from 'qrcode'

  export default {
    name: '',
    data() {
      return {
        loading: false,
        finished: false,
        useModal: false,
        page: 0,
        modalData: [],
        cardList: [],
        showInfo: false, // 扫码后的弹框
        value: '',
        showKeyboard: true,
        showPwd: false, // 密码输入框
        cardNo: '', // 卡号
        myInfo: {},
        queryPayStateTimer: null,
        digitalPWD: '',
        payDetais: '', // 支付详情
        haveList: false
      }
    },
    mounted() {
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    activated() {
      if (this.isPwdSet.status == 1) {
        // 设置过支付密码 直接调用支付接口
        this.payQrcodePay(this.isPwdSet.pwd, this.myInfo.qrcode)
        DigitalPwd.close();
      }
    },
    methods: {
      loadMore() {
        // 获取我的卡包列表
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          index: this.page,
          pageSize: 20
        }
        this.$http.post('/app/json/app_user_easy_card/myCardBag', paramsData).then(res => {
          let data = res.data
          console.log(data)
          if (data.status == 0) {
            this.cardList = this.cardList.concat(data.data || [])
            if (this.cardList.length >= data.totalRecords) {
              this.finished = true
            }
            if (data.data.length) {
              this.haveList = true
            } else {
              this.haveList = false
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      onInput(key) {
        this.value = (this.value + key).slice(0, 6)
        if (this.value.length == 6) {
          this.$Toast('调用接口支付！')
        }
      },
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1)
      },
      makePayQrcode() {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金  124：易捷卡
          groupValue: this.cardNo, // 分组值      奖励金用 易捷卡传卡号
          distOuCode: 1, // 发单机构
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.useModal = true // 接口返回以后 二维码弹框
            this.myInfo = data.data;
            this.$nextTick(() => {
              this.toCanvas()
              clearInterval(this.queryPayStateTimer)
              this.queryPayStateTimer = setInterval(() => {
                this.payQrcodeCheck(this.myInfo.qrcode)
              }, 200000)
            })
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
        })
      },
      payQrcodeCheck(qrcode) {
        // 检查预支付二维码状态接口
        this.digitalPWD = ''
        this.$request.post('/app/json/app_pay/payQrcodeCheck', {
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 124：易捷卡
          qrcode: qrcode // 二维码
        }).then(res => {
          if (res.status === 0) {
            this.payDetais = res.data
            if (this.payDetais.payUnit) {  // 支付点数  (如果为空,代表还没有发起支付)
              // 已发起支付
              this.useModal = false // 关闭二维码弹框
              this.showInfo = true // 支付信息弹框
              clearInterval(this.queryPayStateTimer) // 清除定时器
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      queryPay() {
        // 确认支付按钮
        if (this.payDetais.needPayPwd) { // 是否需要支付密码
          // 需要
          if (this.payDetais.payPwdState == '1') { // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
            this.$Toast("支付密码已锁定，请稍后再试！")
            return;
          } else {
            DigitalPwd.open({
              initData: {
                payPwdState: this.payDetais.payPwdState
              },
              toSettingPwd: () => {
                this.$router.push({
                  path: '/usercenter/nosetpwd',
                  query: {
                    isSet: this.payDetais.payPwdState,
                    source: 'rebate'
                  }
                })
                DigitalPwd.close();
              },
              inputFinished: (value) => {
                this.digitalPWD = value
                this.payQrcodePay(this.digitalPWD, qrcode)
                DigitalPwd.close();
              }
            })
          }
        } else {
          // 不需要
          this.payQrcodePay(this.digitalPWD, qrcode)
        }
      },
      payQrcodePay(digitalPWD, qrcode) {
        // 预支付二维码支付接口
        let payPwd = ''
        if (digitalPWD) {
          payPwd = md5String(digitalPWD)
        }
        this.$request.post('/app/json/app_pay/payQrcodePay', {
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 124：易捷卡
          qrcode: qrcode, // 二维码
          PayPwd: payPwd // 支付密码
        }).then(res => {
          if (res.status === 0) {
            this.$Toast("支付成功")
            this.showInfo = false // 关闭支付信息弹框
          } else {
            this.$Toast(res.info)
          }
        })
      },
      toCanvas() {
        JsBarcode('#barcode', this.myInfo.qrcode, {
          height: 65,
          margin: 0,
          displayValue: false
        })
        Qrcode.toCanvas(document.getElementById('qrcode'), this.myInfo.qrcode.toString(), {
          margin: 0,
          width: 170
        })
      },
      nowUseHandler(item) {
        // 立即使用
        console.log(item)
        this.cardNo = item.cardNo
        // if (item.cardType == 551 || (item.cardType == 552 && item.timesCountType == 1)) {
        if (item.cardType == 550001 || (item.cardType == 550002 && item.timesCountType == 1)) {
          // cardType--551充值卡 552 计次卡  timesCountType--1:商城 2：服务卡
          let path = '/mall2/list/' + this.$util.getDataString()
          this.$router.push({
            path: path,
            query: {
              lastPath: this.$route.path,
              easyCardId: item.cardId,
              cardType: item.cardType,
              cardNo: item.cardNo,
              cardName: item.cardName
            }
          })
        // } else if (item.cardType == 552 && item.timesCountType == 2) {
        } else if (item.cardType == 550001 && item.timesCountType == 2) {
          this.makePayQrcode()
        }
      },
      showCode(code) {
        if (/\S{5}/.test(code)) {
          return (code.replace(/\s/g, '').replace(/(.{4})/g, '$1 '))
        } else {
          return code
        }
      },
      cardClick(item) {
        // if (item.cardType == 551) { // 551 552 计次卡
        if (item.cardType == 550001) { // 551 552 计次卡
          this.$router.push({path: '/recharge/card-details', query: {cardDetails: JSON.stringify(item)}})
        } else {
          this.$router.push({path: '/recharge/count-card-details', query: {cardDetails: JSON.stringify(item)}})
        }
      }
    },
    computed: {
      ...mapGetters(['isPwdSet'])
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  .container {
    padding 10px 0
    background-color #f6f6f6
    overflow-y auto !important
    overflow auto !important
    -webkit-overflow-scrolling touch
  }

  .product-list {
    padding 0 15px
    background-color #f6f6f6

    .item {
      width 100%
      border-radius 10px
      overflow hidden
      position relative
      margin-bottom 10px

      .pro-img {
        width 100%
        display block
        height: 150px
      }

      .card-content {
        position absolute
        left 0
        top 0
        right 0
        bottom 0
        padding 20px 15px
        color #fff
        display flex
        justify-content space-between
        align-items left
        flex-direction column

        .top {
          display flex
          justify-content space-between
          width: 100%

          .card-name {
            font-size 18px
            max-width 266px
            ellipse()
          }

          .card-type {
            font-size 14px
          }
        }

        .mid-price {
          margin-top 15px
          font-size 28px
          width: 100%

          .icon {
            font-size 14px
          }
        }

        .btm-content {
          margin-top 10px
          font-size 15px
          display flex
          justify-content space-between
          align-items center
          width: 100%

          .now-use {
            font-size 12px
            padding: 1px 0
            width 70px
            line-height 22px
            text-align center
            background-color rgba(0, 0, 0, .15)
            border-radius 15px
          }
        }

        .lose-efficacy {
          position: absolute;
          right: -16px;
          bottom: -17px

          img {
            width 80px
          }
        }
      }
    }
  }

  .use-modal {
    border-radius 10px
    overflow hidden
    background-color transparent

    .top {
      padding 0 20px
      background-color #fff
      overflow hidden
      padding-top 30px
      position relative
      bottom: -1px

      .bar-code {
        width 280px !important
        height 65px !important
      }

      .card-num {
        text-align center
        font-size 14px
        margin 10px 0
      }
    }

    .bottom {
      padding 0 20px
      background-color #fff
      overflow hidden
      padding-bottom 30px
      position relative
      top: -1px

      .qr-code {
        display block
        width 150px !important
        height 150px !important
        margin 15px auto 0
      }

      .title {
        font-size 16px
        margin-top 20px
      }

      .service-list {
        font-size 14px
        color: $color-text

        .item {
          display flex
          justify-content space-between
          margin-top 10px
        }
      }
    }

    .partition {
      background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkkAAAA8CAYAAABy8C5vAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjA2MjU2ODU4NkFEMTFFOUI2M0FBQkQwQUNFMzAwODAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjA2MjU2ODY4NkFEMTFFOUI2M0FBQkQwQUNFMzAwODAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMDYyNTY4Mzg2QUQxMUU5QjYzQUFCRDBBQ0UzMDA4MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMDYyNTY4NDg2QUQxMUU5QjYzQUFCRDBBQ0UzMDA4MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj3UzhcAAAQfSURBVHja7N29a11lHAfwcy9aIVykQs0Q6Jtiqu2g1Dh0jJSAQ12ktSpkbNVFl7q4FVz8B0QXqQhVipODUGoydjAGHWpJaSW20EE7ZKgFO7T+Hs8R7FCT3DzPfTl8PvDd0nNun9/y5bw8p3M/VAAAPKBrCQAAlCQAACUJAEBJAgDI6JHIY5FeZEdkT2RfZCYyG9lpiQCAFrsRWYwsRVYiq5FbkT8767zctj9yPDIf2W0dAYAWuB45E/kq8svD/qizwR0A0m251yIfRp63tgDAGPo58lHkm8i99f64s8ltkjpVfVXp48iktQYAxsDvkQ8iX0Q2XHw6fe4luT3yWeSodQcARti5yInI2mb/Yb9vt6UTHYu8E7lr/QGAEZP6ybtNX1nr5wCdDF8lmavqe3s98wAARsDtqn6W+vxWDtLJ9Om2Q5ELkQlzAQCG6E7kcOTiVg+UazPJ9ENerdx6AwCGJ/WQIzkKUs6SlHwfec98AIAheT+ykOtguW63/dfZqt6AEgBgUL7O3T9KlKS0PcClyJR5AQADcDNyoOrzLbaHKfGB2/QDT5kXADAgp3IXpKTElaR/jlvVH4o7aG4AQEHLkZlqEztpb1S30A9OP/S0uQEAhZ0uUZCSUleS/i1gVyN7zQ8AKOC3yFPVBj5W22+RKSX94M/NDwAo5MtSBSkpeSUpmY6smCEAUMD+yOVxLUnJtaq+FAYAkMuNyK6SJ+gO4D+xaI4AQGYLpU8wiJL0kzkCAJkttaEkeSYJAMjtShtK0q/mCABkdq0NJWnNHAGAzP4ofYJBvN22LfKXWQIAOTtM6RN0rTEAwHBKUs8yAwCZPd6GkvSEOQIAmT3ZhpJkt20AILen21CS9pkjAJDZdBtK0gvmCABkNtOGkjRrjgBAZi+Pe0l6pvJMEgCQ387Ic+Nckl43QwCgkLdKHrzkjtupgF2N7DVDAKCA1ap+y+1eqSJTyhEFCQAoaE/TN4oodSUpfU9lKXLQ/ACAgn6MvBTJXmhKXUl6Q0ECAAbgxaZ3ZFfiStL2yKXIlLkBAANwM3IgspbzoCWuJH2iIAEAAzTV9I+scpekk5HjZgUADFjqH2/nPGDO221p58vvItvMCQAYgruRVyILo1SSDkUuRCbMBwAYojuRw5GLWz1Qjtttc5HzChIAMAImml4yN+ySlJ5B+jbSMxMAYET0mn5ycisH6fd2W3rN/9PIMXMAAEbYuciJqo/tATZ7JSntpD0fWVGQAIAxcLTpLfNNj8lekrrNSZYjZyKT1hwAGBOTTX9ZbvrMhvrPerfbno282bSv3dYYAGiB601pOhu5/H8l6dGqfsBpR1V/TXe6qj8UNxvZZR0BgJYXpsXID5ErkdXIrcjtVJLuWx8AgAd1LQEAgJIEAKAkAQAoSQAAGf0twABwzsBfh18JcAAAAABJRU5ErkJggg==") no-repeat
      background-size 100% 100%
      height: 30px
      display flex
      justify-content center
      align-items center

      .line {
        border-top: 0.3px solid $color-background-lll
        height: 1px
        width: 80%
      }
    }
  }

  .icon-pop {
    text-align right
    padding: 10px 10px 0 10px
  }

  .icon-pwd {
    padding: 15px
    display flex
    justify-content center
    align-items center

    /deep/ .van-icon {
      position absolute
      right 10px
    }
  }

  .recharge-popup {
    padding: 0 15px 11px 15px
    height: 350px

    .serve-list {
      text-align center
      color: $color-theme-r
      line-height 20px
      font-size: 16px
      padding-bottom: 5px
    }

    .num {
      text-align center
      font-weight bold
      padding: 20px 0

      .text {
        font-weight bold
        font-size 34px
      }
    }

    .info {
      .details {
        padding: 15px 0
        display flex
        justify-content space-between
        align-items center
        font-size 14px
        border-bottom: 0.5px solid #ecebeb

        .title {
          color: $color-text-l
        }
      }

      .pay-label {
        display flex
        align-items center

        .pay-icon {
          width 25px
          margin-right 10px
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }

  .re-btn {
    text-align center
    background: $color-theme-r
    color: #fff
    font-size: 16px
    position fixed
    bottom: 0
    left: 0
    right: 0
    z-index 10
    height 44px
    line-height: 44px
  }

  .no-list {
    text-align center
    padding-top: 50px

    .img {
      padding-bottom: 10px

      img {
        width: 200px
      }
    }

    .text {
      color $color-text-d
    }
  }
</style>
