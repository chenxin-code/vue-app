<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="card-info">
        <img :src="cardDetail.backgroundPic" alt="" class="card-img">
        <p class="card-name">{{ cardDetail.equityCardName }}</p>
        <p class="card-adv">{{ cardDetail.advertisingLanguage }}</p>
        <p class="price">￥<span>{{ dealWithPrice(cardDetail.salesPrice)[0] }}</span>.{{
          dealWithPrice(cardDetail.salesPrice)[1] }}
        </p>
        <div class="stepper-container" v-if="isPersonalCard && !isShareOpen">
          <span class="title">选择数量</span>
          <van-stepper
            :integer="true"
            v-model="purchaseNumber"/>
        </div>
      </div>
      <div class="product-info">
        <p class="title">产品介绍</p>
        <div class="content" v-html="cardDetail.instructions">
        </div>
      </div>
      <div class="chum-public-btn btm-btn" v-if="isShareOpen">
        <van-button
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="receiveHandler">一键领取
        </van-button>
      </div>
      <div class="chum-public-btn btm-btn" v-else-if="isPersonalCard">
        <van-button
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="buyNow">立即购买
        </van-button>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import utils from '../../assets/utils/tools'
  import {Dialog} from 'vant';

  export default {
    mixins: [utils],
    data() {
      return {
        isPersonalCard: true,
        isShareOpen: false, // 分享打开
        purchaseNumber: 1,
        cardDetail: {}
      }
    },
    mounted() {
      if (this.$route.query.isShareOpen) {
        this.isShareOpen = true;
      }
      this.getDetail()
    },
    methods: {
      buyNow() {
        this.$Loading.open()
        let params = {
          deliveryType: 2,
          carts: [
            {
              skuId: this.cardDetail.skuId,
              storeOuCode: this.cardDetail.storeOuCode,
              number: this.purchaseNumber,
              selfActivityId: '',
              checked: 1
            }
          ]
        }
        this.$http.post('/app/json/app_cart/SettleCart', params).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$router.push({
              name: 'confirm_order',
              params: {
                occurData: data.data.occur[0] || {},
                settleCartData: params,
                skuName: this.cardDetail.skuName,
                salePrice: this.cardDetail.salesPrice,
                phMainUrl: this.cardDetail.backgroundPic,
                entryType: 3
              }
            })
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        }).catch(err => {
          this.$Toast(`SettleCart err ${err}`);
          this.$Loading.close();
        })
      },
      // 一键领取
      receiveHandler() {
        this.$Loading.open()
        this.$http.post('/app/json/equity_card/giveEquityCard', {
          giveUserId: this.$route.query.userId,
          parentId: this.$route.query.cardId,
          equityCardId: this.$route.query.equityCardId
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            Dialog.confirm({
              title: '标题',
              message: '领取成功！',
              confirmButtonText: '去【我的卡包】',
            })
              .then(() => {
                this.$router.replace({
                  path: '/my_card_case'
                })
              })
              .catch(() => {
                // on cancel
              });
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`giveEquityCard err ${err}`)
        })
      },
      // 获取详情
      getDetail() {
        this.$Loading.open();
        this.$http.post('/app/json/equity_card/equityCardBuyList', {
          cardType: this.$route.query.cardType, // 1 个人卡 2 企业卡
          id: this.$route.query.equityCardId
        }).then(res => {
          this.$Loading.close();
          let data = res.data
          if (data.status == 0) {
            this.cardDetail = data.data[0]
            if (this.cardDetail.cardType == 2) {
              this.isPersonalCard = false
            }
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close();
          this.$Toast(`equityCardDetail err ${err}`)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    overflow auto;
    padding 0 20px 70px;

    .card-info {
      margin-top 5px;
      padding 10px;
      box-shadow 0 0 5px #ddd;
      border-radius 5px;

      .card-img {
        display block;
        width 60%;
        min-height 100px;
        margin 5px auto 0;
        border-radius 5px;
      }

      .card-name {
        font-size 14px;
        font-weight 500;
        margin-top 15px;
        line-height 18px;
      }

      .card-adv {
        font-size 12px;
        margin-top 5px;
        color $color-text-l
        line-height 15px;
        padding-bottom 5px;
      }

      .price {
        color $color-theme-r
        font-weight 700;
        font-size 15px;
        padding-bottom 10px;

        span {
          font-weight 700;
          font-size 20px;
        }
      }

      .stepper-container {
        display flex;
        justify-content space-between;
        align-items center;
        padding-top 10px;
        bdr-t();

        .title {
          font-size 13px;
        }
      }
    }

    .product-info {
      margin-top 10px;
      padding 10px;
      box-shadow 0 0 5px #ddd;
      border-radius 5px;

      .title {
        font-size 15px;
        font-weight 500
        padding 10px 0 15px;
        bdr-b()
        text-align center;
      }

      .content {
        padding 10px 0;
        /deep/ img {
          width 100%;
        }
      }
    }

    .btm-btn {
      background-color: #fff
      padding 10px 20px;
      position fixed;
      bottom 0;
      left 0;
      right 0;
    }
  }
</style>
