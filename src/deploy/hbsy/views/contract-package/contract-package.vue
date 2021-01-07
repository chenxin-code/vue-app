<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <!-- 先使用v-if隐藏掉了 -->
      <div class="top-desc" v-if="false">
        <img :src="packageInfo.pic" alt="" class="desc-img">
      </div>
      <div class="content">
        <div class="info">
          <p class="title">套餐合约信息</p>
          <div class="text" v-html="packageInfo.desc"></div>
        </div>
      </div>
      <van-button
        color="#F02C2D"
        type="primary"
        class="btm-btn"
        @click="straightwayApprove">立即签约</van-button>
    </nav-content>

    <!-- 无法开通提示框 -->
    <van-popup
      class="prompt-popup"
      v-model="isShowPromptPopup">
      <p class="title">温馨提示</p>
      <p class="prompt-text">抱歉，检测到您的账号存在待激活的油滴，需激活完成后方可开通</p>
      <van-button
        class="reset-btn"
        color="#fff"
        type="primary"
        @click="isShowPromptPopup = false">取消</van-button>
    </van-popup>

    <!-- 合约列表 -->
    <van-popup
      position="bottom"
      class="contract-popup"
      :close-on-click-overlay="false"
      v-model="isShowContractPopup">
      <van-icon
        name="cross"
        class="close-btn"
        @click="isShowContractPopup = false"/>
      <p class="title">合约列表</p>
      <ul class="product-list">
        <li
          class="item"
          v-for="(item, index) in packageInfo.packageRefuelList"
          :key="index"
          @click="choseProd(item)">
          <div class="left-radio">
            <van-icon name="checked" v-if="selectProd.id == item.id" class="select"/>
            <van-icon name="circle" v-else class="unselect"/>
          </div>
          <div class="right-content">
            <div class="top-title">
              <p class="contract-name">{{ item.name }}</p>
              <div class="prod-type" v-if="item.proType == 'EASYCARD'">线上充值</div>
              <div class="prod-type" v-else-if="item.proDetail.deliverType == 1">自提</div>
              <div class="prod-type" v-else-if="item.proDetail.deliverType == 2">配送</div>
              <div class="prod-type" v-else>
                <div class="switch-deliver" @click.stop="changeDeliver(item)">
                  <span :class="{active: item.deliverType == 0}">配送</span>
                  <span :class="{active: item.deliverType == 1}">自提</span>
                </div>
              </div>
            </div>
            <div class="btm-prod-info">
              <div class="left-img">
                <img :src="item.pic" alt="">
              </div>
              <div class="right">
                <p class="name">{{ item.proType == 'EASYCARD' ? item.proDetail.name : item.proDetail.skuName }}</p>
                <div class="price-info">
                  <p class="price">售价：{{ item.proType == 'EASYCARD' ? $util.toDecimal2(item.proDetail.minRechargeAmount) : $util.toDecimal2(item.proDetail.salePrice) }}元</p>
                  <p class="back-price">返利：{{ $util.toDecimal2(item.proDetail.rebate) }}元</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <van-button
        color="#F02C2D"
        type="primary"
        class="btm-btn"
        @click="popupConfirmApprove">立即签约</van-button>
    </van-popup>

    <!-- 无自提地点弹窗 -->
    <van-popup v-model="isShowSetPickupConfirm" class="has-meal-popup">
      <p class="content">当前登录人未维护自提点，不可购买商品！</p>
      <div class="btn-container">
        <van-button
          color="#fff"
          class="cancel-btn"
          @click="isShowSetPickupConfirm = false"
          type="primary">取消</van-button>
        <van-button
          color="#F02C2D"
          class="confirm-btn"
          @click="isShowSetPickupConfirm = false"
          type="primary">现在设置</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowPromptPopup: false,
      isShowContractPopup: false,
      prodList: [],
      selectProd: {
        skuId: NaN
      },
      packageInfo: {},
      isShowSetPickupConfirm: false
    }
  },
  created() {
    if (this.$route.params.packageInfo) {
      let tempPackageInfo = JSON.parse(this.$route.params.packageInfo)

      if (tempPackageInfo.packageRefuelList instanceof Array && tempPackageInfo.packageRefuelList.length > 0) {
        tempPackageInfo.packageRefuelList.forEach(item => {
          if (JSON.parse(item.proDetail) instanceof Array) {
            item.proDetail = JSON.parse(item.proDetail)[0]
          } else {
            item.proDetail = JSON.parse(item.proDetail)
          }
        })
      }

      this.packageInfo = tempPackageInfo
      console.log(JSON.parse(JSON.stringify(this.packageInfo)))
    }
  },
  mounted() {},
  methods: {
    changeDeliver(item) {
      if (item.proDetail.deliverType == 0) {
        item.proDetail.deliverType = 1
      } else {
        item.proDetail.deliverType = 0
      }
    },
    // 选择商品
    choseProd(item) {
      this.selectProd = item
    },
    // 立即签约
    straightwayApprove() {
      // 检查用户是否有待激活油滴
      this.$Loading.open()
      this.$http.post('/app/json/app_package_refuel/canJoinContract', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          // 是否有待激活油滴 或者 已加入群组
          if (data.data.hasWaitAward) {
            // 是
            this.isShowPromptPopup = true
          } else {
            // 否
            this.isShowContractPopup = true
          }
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`canJoinContract err ${err}`)
      })
    },
    // 立即签约-弹窗
    popupConfirmApprove() {
      if (!this.selectProd.id) {
        this.$Toast('请选择合约')
      } else {
        if (this.selectProd.proType == 'EASYCARD') {
          window.localStorage.setItem('packageProDetail', JSON.stringify(this.selectProd.proDetail))
          // 易捷卡
          this.$router.replace({
            path: '/recharge/recharge-card',
            query: {
              isFromPackage: 1,
              packageRefuelId: this.selectProd.id,
              bundleName: this.packageInfo.name,
            }
          })
        } else {
          // 普通商品
          // 检查用户是否维护自提信息
          if (!this.$store.state.mall2.zitiAddress.id) {
            // 否
            this.isShowSetPickupConfirm = true
          } else {
            // 是
            this.$router.replace({
              path: '/fill-order',
              query: {
                productInfo: JSON.stringify(this.selectProd.proDetail),
                packageRefuelId: this.selectProd.id,
                bundleName: this.packageInfo.name,
              }
            })
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .nav-content {
      display flex;
      flex-direction column;
      background-color #F6F6F6;
    }
    .top-desc {
      margin-top 10px;
      .desc-img {
        display block;
        width 100%;
      }
    }
    .content {
      flex 1;
      margin 10px 0;
      overflow-y auto;
      .info {
        width 100%;
        background-color #fff;
        padding 15px 10px;
        .title {
          font-size 15px;
          line-height 21px;
        }
        .text {
          margin-top 10px;
          overflow hidden;
          /deep/ img {
            display block;
            width 100%;
          }
        }
      }
    }
    .btm-btn {
      height 49px;
      .van-button__text {
        font-size 18px;
        font-weight 500;
      }
    }

    .prompt-popup {
      width 280px;
      // height 166px;
      border-radius 6px;
      .title {
        font-size 15px;
        font-weight 500;
        color #333;
        margin-top 21px;
        text-align center;
      }
      .prompt-text {
        font-size 13px;
        line-height 22px;
        margin-top 15px;
        margin-bottom 25px;
        padding 0 16px;
        text-align center;
      }
      .reset-btn {
        width 100%;
        box-shadow 0 0 10px rgba(0, 0, 0, .1)
        .van-button__text {
          font-size 15px;
          color #333;
        }
      }
    }
    .contract-popup {
      height 80%;
      display flex;
      flex-direction column;
      .close-btn {
        position absolute;
        right 10px;
        top 17px;
        font-size 20px;
        font-weight 500;
        color #333;
      }
      .title {
        font-size 15px;
        line-height 21px;
        color #333;
        text-align center;
        font-weight 500;
        padding 14px 0;
      }
      .product-list {
        flex 1;
        overflow-y auto;
        padding 0 10px 10px;
        .item {
          display flex;
          align-items center;
          margin-top 10px;
          .left-radio {
            .unselect,
            .select {
              color #999;
              font-size 20px;
              margin-right 10px;
            }
            .select {
              color #F02C2D;
            }
          }
          .right-content {
            flex 1;
            height: 131px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
            padding 10px;
            .top-title {
              display flex;
              justify-content space-between;
              font-size 15px;
              .switch-deliver {
                background-color #F02C2D;
                height 24px;
                width 80px;
                border-radius 12px;
                display flex;
                align-items center;
                justify-content space-around;
                span {
                  width 46%;
                  font-size 11px;
                  color #fff;
                  text-align center;
                  display block;
                  padding 4px;
                  position relative;
                  border-radius 10px;
                  &.active {
                    color #F02C2D;
                    background-color #fff;
                  }
                }
              }
            }
            .btm-prod-info {
              margin-top 10px;
              display flex;
              .left-img {
                width 75px;
                height 75px;
                overflow hidden;
                border-radius 4px;
                align-self center;
                img {
                  display block;
                  width 100%;
                  height 100%;
                }
              }
              .right {
                flex 1;
                padding-left 5px;
                display flex;
                flex-direction column;
                justify-content space-between;
                color #333
                .name {
                  font-size 14px;
                  line-height 20px;
                  ellipse-2();
                }
                .price,
                .back-price {
                  font-size 12px;
                }
                .back-price {
                  margin-top 8px;
                }
              }
            }
          }
        }
      }
    }
    .has-meal-popup {
      width 280px;
      border-radius 6px;
      .content {
        font-size 13px;
        color #333;
        line-height 22px;
        padding 46px 49px 0;
        text-align center;
      }
      .btn-container {
        display flex;
        box-shadow 0 0 10px #ddd;
        margin-top 25px;
        .confirm-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #fff;
          }
        }
        .cancel-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #333;
          }
        }
      }
    }
  }
</style>