/**Created by liaoyingchao on 2018/11/6.*/

<template>
  <div class="index mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="block-div">
          <div class="pro-div">
            <div class="pro-img">
              <img :src="phPictureUrl" />
            </div>
            <div class="pro-info">
              <div class="row">
                <div class="pro-title theme_font_common">{{skuName}}</div>
              </div>
              <div class="row">
                <div class="shop-com theme_font_common">商家评价</div>
              </div>
              <div class="row">
                <i
                  class="iconfont mall-xingxing icon-level theme_font_tint"
                  :class="{theme_font_red_i: commentScore >= lv}"
                  v-for="lv in 5"
                  @click="commentScoreEvent(lv)"
                ></i>
              </div>
            </div>
          </div>
          <MixInput
            :text.sync="commentText"
            :imageUrls.sync="commentImages"
            placeholder="请输入您的评语"
            maxNumber="100"
          ></MixInput>
        </div>
        <div class="block-div">
          <div class="flex-row">
            <div class="name full">物流服务评价</div>
            <div class="font-small theme_font_tint">满意请给5星</div>
          </div>
          <div class="flex-row">
            <div class="full theme_font_common">快递包装</div>
            <div class="theme_font_tint">
              <i
                class="iconfont mall-xingxing icon-font theme_font_tint"
                :class="{theme_font_red_i: packageScore >= lv}"
                v-for="lv in 5"
                @click="packageScoreEvent(lv)"
              ></i>
            </div>
          </div>
          <div class="flex-row">
            <div class="full theme_font_common">送货速度</div>
            <div class="theme_font_tint">
              <i
                class="iconfont mall-xingxing icon-font theme_font_tint"
                :class="{theme_font_red_i: speedScore >= lv}"
                v-for="lv in 5"
                @click="speedScoreEvent(lv)"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-btns theme_bg_red theme_font_white" @click="submitEvent">提交</div>
    </nav-content>
  </div>
</template>

<script>
import MixInput from '@/components/commonui/mix-input/index'

export default {
  name: 'index',
  components: {
    MixInput
  },
  data() {
    return {
      commentScore: 0,
      speedScore: 0,
      packageScore: 0,
      commentText: '',
      commentImages: [],
      skuId: '',
      orderId: '',
      phPictureUrl: '',
      skuName: ''
    }
  },
  methods: {
    commentScoreEvent: function(lv) {
      this.commentScore = lv
    },
    packageScoreEvent: function(lv) {
      this.packageScore = lv
    },
    speedScoreEvent: function(lv) {
      this.speedScore = lv
    },
    submitEvent: function() {
      if (this.commentText == '') {
        this.$Toast('请填写你的评语')
        return
      } else if (
        this.commentScore == 0 ||
        this.packageScore == 0 ||
        this.speedScore == 0
      ) {
        this.$Toast('请给出您的评分')
        return
      }
      let url = '/app/json/evaluate/addProSkuEvaluate'
      let paramsData = {
        token: this.$store.state.login.token,
        orderId: this.orderId,
        skuId: this.skuId,
        scoreDeliverySpeed: this.speedScore,
        scorePackage: this.packageScore,
        score: this.commentScore,
        evaluateContent: this.commentText,
        imagesList: this.commentImages
      }
      this.$Loading.open()
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            // this.$Toast('感谢您的评价！')
            this.$Toast('评价成功，后台审核后将在评论区显示')
            if (this.$route.query.lastPath == '/mall2/orderlist') {
              this.$store.state.mall2.order.backIndex = 3
            }
            this.$router.go(-1)
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    }
  },
  created() {
    console.log(this.$route.query)
    this.skuId = this.$route.query.skuId
    this.orderId = this.$route.query.orderId
    this.phPictureUrl = this.$route.query.phPictureUrl
    this.skuName = this.$route.query.skuName
    console.log('this.skuId:', this.skuId, ' this.orderId:', this.orderId)
  },
  activated() {},
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.index {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .scroll-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 50px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .pro-div {
      padding: 12px 0;
      overflow: hidden;

      .pro-img {
        float: left;
        width: 90px;
        height: 90px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .pro-info {
        overflow: hidden;

        .row {
          padding: 8px 8px 0;

          .pro-title {
            font-size: 16px;
          }

          .shop-com {
            padding-top: 10px;
            font-size: 14px;
          }

          .icon-level {
            font-size: 18px;
          }
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
    line-height: 50px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
}
</style>
