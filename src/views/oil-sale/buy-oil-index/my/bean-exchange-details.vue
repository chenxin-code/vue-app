<template>
  <div class="buy-oil-order-details">
    <nav-top title="订单详情" @backEvent="$router.go(-1)"></nav-top>
    <!-- 普通订单 -->
    <nav-content class="buy-oil-order-content" v-if="complete">
      <div class="order-status theme_bg_blue_i">
        <div class="title">{{stateInfo}}</div>
      </div>
      <div class="oil-order-details">
        <div class="user-info">
          <div class="name">
            <div class="left">{{details.receiver}}</div>
            <div class="right">{{details.mobile}}</div>
          </div>
          <div class="name">
            <div class="left">收货地址</div>
            <div class="right">{{details.provinceName + details.cityName + details.countryName + details.townName + details.address}}</div>
          </div>
        </div>
        <div class="oil-sale-container">
          <div class="buy-bill">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="bill-item">
                    <div class="img-wrapper">
                      <img class="img" src="../../assets/image/bill.png" alt>
                    </div>
                    <div class="center-text">
                      <div class="title">
                        1234
                        <van-tag plain type="danger">
                          <span>1234</span>
                        </van-tag>
                      </div>
                      <div class="tips info">￥<span class="now-price">1234</span>/t</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <ul class="details-list">
                    <li class="details-item">
                      <div class="left">业务类型</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                    <li class="details-item">
                      <div class="left">订单编号</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                    <li class="details-item">
                      <div class="left">购油数量</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                    <li class="details-item">
                      <div class="left">下单时间</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                    <li class="details-item">
                      <div class="left">确认时间</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                    <li class="details-item">
                      <div class="left">完成时间</div>
                      <div class="right">
                        <input type="text" disabled>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import TipsPopup from "../../components/tips-popup"
  import QRCode from "qrcode"

  export default {
    data() {
      return {
        beanItem: '', // 详情
        details: '',
        complete: false,
        stateInfo: '', // 订单状态 1提交 2确认 3提货完成 4取消
      }
    },
    mounted() {
      this.beanItem = JSON.parse(this.$route.query.beanItem)
      this.detail()
      this.dealWith()
    },
    methods: {
      detail() {
        this.$request.post('/app/json/app_shopping_order/detail', {
          orderId: this.beanItem.id,
          orderType: this.beanItem.orderType
        }).then(res => {
          this.complete = true
          if (res.status === 0) {
            this.details = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      /** 订单状态state
       * 1 未支付 3 已支付 7 已废弃 8 已失效 17 待备货 18 已备货 12 支付后取消 16 待发货 4 待收货 9 已完成 6 拒收
       * 16 待发货   4 待收货 待提货  9 已完成
       */
      dealWith() {
        if (this.details.state == 16) {
          this.stateInfo = "等待商家发货！"
        } else if (this.details.state == 4) {
          this.stateInfo = "商家已发货!"
        } else if (this.details.state == 9) {
          this.stateInfo = "订单已完成!"
        }
      }
    },
    components: {
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '../../assets/stylus/oil-sale-base.styl'

  .buy-oil-order-content {
    overflow-y: auto !important
    -webkit-overflow-scrolling: touch
  }

  .order-status {
    padding: 11px 15px
    height: 100px
    color: #fff

    .title {
      font-size: 16px
    }
  }

  .oil-order-details {
    position: absolute
    top: 60px
    left: 15px
    right: 15px
    padding-bottom: 10px

    .user-info {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      background: #fff
      border-radius: 4px
      padding: 11px 15px
      line-height: 24px
      font-size: 14px
      color: $color-text
      margin-bottom: 10px

      .name {
        display: flex

        .left {
          width: 20%
        }
      }
    }

    .oil-sale-container {
      #quxiaoBtn {
        width: 100%
        text-align: right

        .van-button {
          margin: 20px 20px
        }
      }
    }
  }

  .qr-cord {
    .right {
      text-align center

      .qrcode {
        margin: -20px 0
      }
    }

    .qr-code-num {
      text-align center
      padding-top: 10px
    }
  }
</style>
