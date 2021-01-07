<template>
  <div class="card-container">
    <div class="top" :style="{'background-image': `url(${cardData.backgroundPic})`}" @click="cardClick">
      <p class="card-name">{{ cardData.equityCardName }}</p>
      <div class="top-b-info">
        <!-- 永久有效（四种状态都适用） -->
        <p class="expiration-date" v-if="cardData.validityType == 1">有效期：永久有效</p>
        <!-- N天内有效（未激活） -->
        <p class="expiration-date" v-else-if="cardData.equityCardState == 2 || cardData.equityCardState == 3 || cardData.equityCardState == 0 && cardData.validityType == 2">自激活之日起：{{ cardData.days }}天内有效</p>
        <!-- 时间段有效（未激活） -->
        <p class="expiration-date" v-else-if="cardData.equityCardState == 2 || cardData.equityCardState == 3 || cardData.equityCardState == 0 && cardData.validityType == 3">有效期：{{ dealWithTime(cardData.activeTime) }}至{{ dealWithTime(cardData.invalidTime) }}</p>
        <!-- 已激活，已过期 -->
        <p class="expiration-date" v-else>有效期至：{{ dealWithTime(cardData.invalidTime) }}</p>
        <p class="card-no">NO.{{ cardData.equityCardCode }}</p>
      </div>
      <span class="tips" v-if="cardData.receiveType == 4">好友赠送</span>
      <img src="../images/icon-expired.png" alt="" class="expired-icon" v-if="cardData.equityCardState == 4">
    </div>
    <div class="bottom" v-if="cardData.equityCardState != 4">
      <!-- 自己的卡&未激活 -->
      <div class="btn-container" v-if="cardData.receiveType != 4 && cardData.equityCardState == 0">
        <van-button class="func-btn" round plain hairline type="default" @click="handsel">赠送</van-button>
        <van-button class="func-btn" round plain hairline type="danger" @click="activation">激活</van-button>
      </div>
      <!-- 赠送的卡&未激活 -->
      <div class="btn-container" v-else-if="cardData.receiveType == 4 && cardData.equityCardState == 0">
        <van-button class="func-btn" round plain hairline type="danger" @click="activation">激活</van-button>
      </div>
      <!-- 生效中（包含自己购买和别人赠送 -->
      <div class="btn-container" v-else-if="cardData.equityCardState == 1">
        <van-button class="func-btn" round plain hairline type="danger" @click="goToUse">去使用</van-button>
      </div>
      <!-- 已赠送（别人未领取） -->
      <div class="btn-container" v-if="cardData.equityCardState == 3">
        <van-button class="func-btn" round plain hairline type="default" @click="cancelGift">取消赠送</van-button>
        <van-button class="func-btn" round plain hairline type="danger" @click="viewLink">查看链接</van-button>
      </div>
      <!-- 已赠送（已被领取） -->
      <div class="btn-container" v-if="cardData.equityCardState == 2">
        <span v-if="cardData.receiver || cardData.receiverPhone">
          领取用户：{{ cardData.receiver }}({{ cardData.receiverPhone }})
        </span>
        <span v-else>
          领取用户：暂无~
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    props: {
      cardData: {
        type: Object,
        required: true,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      dealWithTime(time) {
        if (time) {
          return moment(time).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
      // 赠送
      handsel() {
        this.$emit('resultHandler', 1, this.cardData)
      },
      // 激活
      activation() {
        this.$emit('resultHandler', 2, this.cardData)
      },
      // 去使用
      goToUse() {
        this.$emit('resultHandler', 3, this.cardData)
      },
      // 取消赠送
      cancelGift() {
        this.$emit('resultHandler', 4, this.cardData)
      },
      // 查看链接
      viewLink() {
        this.$emit('resultHandler', 5, this.cardData)
      },
      cardClick() {
        if (this.cardData.equityCardState == 1) {
          this.$emit('resultHandler', 3, this.cardData)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .card-container {
    border-radius 10px;
    box-shadow 0 0 5px #ddd;
    overflow hidden
    height 195px;
    display flex;
    flex-direction column;

    .top {
      padding 15px 10px;
      background-position 0 0;
      background-size cover;
      background-origin border-box;
      position relative
      flex 1
      display flex;
      flex-direction column
      justify-content flex-end

      .card-name {
        font-size 13px;
        font-weight 500;
        line-height 18px;
        padding-bottom 5px;
      }

      .expiration-date {
        font-size 13px;
        line-height 16px;
      }

      .card-no {
        font-size 13px;
        line-height 16px;
        margin-top 5px;
      }

      .tips {
        display block;
        padding 0 20px
        color #fff;
        font-size 13px;
        font-weight 700
        height 26px;
        line-height 26px;
        text-align center;
        background-color: $color-theme-r;
        position absolute
        right 0;
        top 0;
        transform: translate(24px, 10px) rotate(45deg);
      }

      .expired-icon {
        display block;
        width 55px;
        height 55px;
        position absolute
        top 50%;
        right 15px;
        transform translateY(-50%)
      }
    }

    .bottom {
      height 60px;
      padding 0 10px;
      display flex;
      justify-content flex-end;

      .btn-container {
        display flex;
        align-items center;
        font-size 14px;
        font-weight 500
        span {
          font-weight 500;
        }

        .func-btn {
          height 30px;
          line-height 30px;
          width 90px;
          margin-left 10px;

          .van-button__text {
            font-weight 500;
          }
        }
      }
    }
  }
</style>
