<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="ben-code">
      <div class="local">
        <!--        <van-icon name="location"/>-->
        <!--        {{storeName}}-->
        <!--        <span @click="changeStore">[切换]</span>-->
      </div>
      <div class="qr-con">
        <div class="card-no">
          <label>会员卡号：</label>
          {{radio}}
          <!--          <span @click="changeCard">[切换]</span>-->
        </div>
        <div class="qr-img" @click="refreshQrCode">
          <canvas id="qrcode" class="reset-qrcode"></canvas>
          <span class="static-code">静态码：{{ staticCode }}</span>
          <!--            <img src="../userimgs/inviteqr.png" alt="">-->
          <!--          <img id='qrimg' class="qrimg"/>-->
        </div>
        <div class="source">由{{storeName}}提供服务</div>
        <div class="refresh">{{countdownTime}}秒自动刷新，点击二维码手动刷新</div>
      </div>
      <div class="card-con" v-if="backgroundPic">
        <img :src="backgroundPic" alt />
      </div>
    </nav-content>
    <!-- <van-action-sheet v-model="cardFlag" title="选择会员卡" :round="false">
      <div class="content">
        <van-radio-group v-model="radio">
          <van-cell-group v-for="(item,index) in cardList" :key="index">
            <van-cell
              :title="`${item.equityCardName} (****${item.equityCardCode.slice(-4)})`"
              clickable
              @click="selectCard(item)"
            >
              <template #icon>
                <img src="../userimgs/icon-VIP-card.png" alt class="left-icon" />
              </template>
              <template #right-icon>
                <img class="img-icon" :class="{'checked':radio==item.equityCardCode}" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-action-sheet> -->
  </div>
</template>
<script>
import QRCode from 'qrcode'
import ClipboardJS from 'clipboard'
export default {
  name: 'benefitsCode',
  components: {},
  data() {
    return {
      storeName: null,
      cardFlag: false,
      radio: null,
      cardList: [],
      qrcode: null,
      bg: null,
      equityMemberId: null,
      interId: null,
      countdownTime: 30,
      tempCountdownTime: 0,
      backgroundPic: null,
      code: null,
      staticCode: '',

      // 待检查的二维码编码（最多数量为2个）
      toBeCheckedCodes: [],
      checkInterId: null
    }
  },
  mounted() {
    let queryItem = this.$route.query.item && JSON.parse(this.$route.query.item)

    this.storeName = queryItem.mchName
    this.radio = queryItem.equityCardCode
    this.qrcode = queryItem.qrCode
    this.staticCode = queryItem.staticCode
    this.equityMemberId = queryItem.equityMemberId
    this.backgroundPic = queryItem.backgroundPic
    this.code = queryItem.code

    this.getCardList()

    if (this.qrcode) {
      QRCode.toCanvas(document.getElementById('qrcode'), this.qrcode, {
        width: 160,
        margin: 0
      })

      this.toBeCheckedCodes.push(this.qrcode)

      this.startCheckCodes()
    }

    this.startCountdown()
  },
  methods: {
    getCardList() {
      let params = {
        equityCardState: 1
      }
      this.$Loading.open()
      this.$http
        .post('/app/json/equity_card/myCardBag', params)
        .then(res => {
          let data = res.data
          if (data.status == 0) {
            console.log(res.data)
            this.cardList = res.data.data
            if (res.data.data instanceof Array && res.data.data.length > 0) {
              // this.radio = res.data.data[0].equityCardCode
              // this.bg=res.data.data[0].backgroundPic
            }
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(err)
        })
    },
    // 开始二维码倒计时
    startCountdown() {
      if (this.interId) {
        window.clearInterval(this.interId)
      }
      this.countdownTime = 30
      this.interId = setInterval(() => {
        this.countdownTime--
        if (this.countdownTime) {
          console.log('计时进行中', this.countdownTime)
        } else {
          window.clearInterval(this.interId)
          this.interId = null
          this.countdownTime = this.tempCountdownTime
          this.refreshQrCode()
        }
      }, 1000)
    },
    // 刷新二维码
    refreshQrCode() {
      this.$STLoading.open()
      let params = {
        equityMemberId: this.equityMemberId,
      }
      if (this.$route.query.mchCode) {
        params.mchCode = this.$route.query.mchCode
      }
      this.$http
        .post('/app/json/app_equity_card/equityCodeInfo', params)
        .then(res => {
          let data = res.data
          this.$STLoading.close()
          if (data.status == 0) {
            this.qrcode = data.data.qrCode

            // 将待检查的二维码放入toBeCheckedCodes数组中
            if (this.toBeCheckedCodes.length >= 2) {
              // 始终保持检查二维码为两个
              let tempArr = JSON.parse(JSON.stringify(this.toBeCheckedCodes))
              tempArr.unshift(data.data.qrCode)
              tempArr.length = 2
              this.toBeCheckedCodes = tempArr
            } else {
              this.toBeCheckedCodes.unshift(data.data.qrCode)
            }

            this.initQrCode(this.qrcode)
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Toast(`refreshQrCode err ${err}`)
          this.$STLoading.close()
        })
    },
    initQrCode(qrCode) {
      QRCode.toCanvas(document.getElementById('qrcode'), qrCode, { width: 160, margin: 0 })
      this.startCountdown()
    },
    changeCard() {
      this.cardFlag = true
    },
    changeStore() {
      this.$router.push({
        path: '/benefits/selectStore',
        query: {}
      })
    },
    selectCard(item) {
      this.radio = item.equityCardCode
      let params = {
        id: item.id,
        equityMemberId: this.equityMemberId
      }
      this.$http
        .post('/app/json/app_equity_card/equityCodeInfo', params)
        .then(res => {
          let data = res.data
          if (data.status == 0) {
            QRCode.toCanvas(
              document.getElementById('qrcode'),
              res.data.data.qrCode,
              { width: 160, margin: 0 }
            )
            this.staticCode = res.data.data.staticCode
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Toast(err)
        })
      this.bg = item.backgroundPic
      this.cardFlag = false
    },
    startCheckCodes() {
      if (this.checkInterId) {
        window.clearInterval(this.checkInterId)
      }
      this.checkInterId = setInterval(() => {
        for (let i = 0; i < this.toBeCheckedCodes.length; i++) {
          this.$http.post('/app/json/app_serve_cou/queryCardCheckState', {
            dynamicCode: this.toBeCheckedCodes[i]
          }).then(res => {

            // setTimeout(() => {
            //   this.$router.push({
            //     path: '/mall2/paysuccess',
            //     query: {
            //       entryType: 1,
            //     }
            //   })
            // }, 2000)

            let data = res.data
            if (data.status == 0) {
              if (data.data && data.data.storeName) {
                this.$router.push({
									path: '/mall2/paysuccess',
									query: {
                    entryType: 1,
                    storeName: data.data.storeName,
                    tradeTime: data.data.tradeTime
									}
								})
              }
            }
          })
        }
      }, 3000)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.interId) {
      window.clearInterval(this.interId)
    }
    if (this.checkInterId) {
      window.clearInterval(this.checkInterId)
    }
    next()
  }
}
</script>

<style lang="stylus" scoped>
.ben-code {
  padding: 10px 20px;
  background: rgba(201, 160, 99, 1);

  .local {
    height: 23px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 23px;
  }

  .qr-con {
    /* margin 0 20px */
    /* height 310px */
    background: white;
    padding: 24px 5px;
    border-radius: 5px;
  }

  .card-no {
    height: 23px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(38, 42, 63, 1);
    line-height: 23px;
    text-align: center;
  }

  .qr-img {
    display: flex;
    flex-direction column;
    align-items center;
    // justify-content: center;
    .reset-qrcode {
      margin-top 15px;
      margin-bottom 10px;
    }
    .static-code {
      font-size 13px;
      padding-bottom 10px;
    }
  }

  .source {
    text-align: center;
    margin: 0 auto;
    height: 23px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(16, 16, 16, 1);
    line-height: 23px;
  }

  .refresh {
    text-align: center;
    margin: 5px auto;
    height: 19px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(159, 160, 160, 1);
    line-height: 19px;
  }

  .card-con {
    margin-top: 10px;
    height: 175px;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.img-icon {
  width: 20px;
  height: 20px;
  background: url('../userimgs/unselect.png') center no-repeat;
}

.checked {
  width: 20px;
  height: 20px;
  background: url('../userimgs/select.png') center no-repeat;
  background-size: contain;
}

.left-icon {
  height: 100%;
  width: 24px;
  margin-right: 5px;
}

.qrcode {
  display: block;
  margin: 0 auto;
}

.card-con {
  img {
    width: 237px;
    height: 150px;
    display: block;
    margin: 0 auto;
  }
}
</style>
