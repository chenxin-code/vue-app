<template>
  <div class="return-goods-details">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="return-goods-details-container">
      <div class="container">
        <div class="title">
          <div class="left">
            <img src="../../../assets/image/bill.png" alt="">
          </div>
          <div class="right">
            <div class="top">单位名称：{{details.corpName || '--'}}</div>
            <div class="bottom">税务编码：{{details.taxCode || '--'}}</div>
          </div>
        </div>
        <div class="text" v-if="source == 1">退货申请</div>
        <div class="content" v-if="source == 1">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">退货编号</div>
                <div class="right">{{details.id}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">退货发起人</div>
                <div class="right">{{details.refundUserRealName}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">申请时间</div>
                <div class="right">{{details.refundTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="text">商品信息</div>
        <div class="content">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">油品名称</div>
                <div class="right">{{details.matertialName}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">油品数量</div>
                <div class="right">{{details.tonnes}}t</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">购买单价</div>
                <div class="right">{{details.adjustPriceCheckState == 1 ? details.adjustPrice : details.price}}元/t</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">订单总金额</div>
                <div class="right money">￥{{details.amount}}.00元</div>
              </div>
            </div>
          </div>
        </div>
        <div class="text">订单信息</div>
        <div class="content">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">订单编号</div>
                <div class="right">{{details.id}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">下单时间</div>
                <div class="right">{{details.submitTime}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">下单人手机号</div>
                <div class="right">{{details.userPhone}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="text" v-if="source != 0">审批状态</div>
        <div class="content" v-if="source != 0">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">审批状态</div>
                <div class="right" v-if="details.state == 5">申请中</div>
                <div class="right" v-else-if="details.state == 6">已退货</div>
                <div class="right" v-else>拒绝退货</div>
              </div>
            </div>
            <div class="table-view-cell" v-if="source == 2">
              <div class="table-view-cell-text">
                <div class="left">审批时间</div>
                <div class="right">{{details.cancelTime}}</div>
              </div>
            </div>
            <div class="table-view-cell" v-if="source == 2">
              <div class="table-view-cell-text">
                <div class="left">审批人</div>
                <div class="right">{{details.cancelOptName}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="text" v-if="source == 0">申请理由</div>
        <div class="content special" v-if="source == 0">
          <textarea name="" cols="20" rows="5" placeholder="请输入申请理由......" v-model="reason"></textarea>
        </div>
        <div class="re-btn" @click="applyBtn" v-if="source == 0">提交申请</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        source: '',
        title: '',
        details: '',
        reason: ''
      }
    },
    mounted() {
      /**
       * state
       * 5申请中 6已退货 7拒绝退货
       */
      this.source = this.$route.query.source || ''
      if (this.$route.query.details) {
        this.details = JSON.parse(this.$route.query.details)
      }
      if (this.source == 0) {
        this.title = '退货申请'
      } else if (this.source == 1) {
        this.title = '处理中'
      } else {
        this.title = '审批详情'
      }
    },
    methods: {
      applyBtn() {
        if (!this.reason) {
          this.$toast('请输入申请理由')
        } else {
          this.$request.post('/app/json/app_oil_sale/refundApply', {
            id: this.details.id,
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            refundReason: this.reason
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('申请成功')
              eventBus.$emit('getOilSaleOrderList')
              this.$router.go(-1)
            } else {
              this.$Toast(res.info ? res.info : '申请失败')
              eventBus.$emit('getOilSaleOrderList')
              this.$router.go(-1)
            }
          })
        }
        }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .return-goods-details {
    .return-goods-details-container {
      .container {
        padding: 11px 15px 60px 15px
        overflow-y auto
        height 100%
        -webkit-overflow-scrolling touch
      }
      .title {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 11px 15px
        display: flex
        justify-content left
        .left {
          padding-right: 10px
          img {
            width: 60px
          }
        }
        .right {
          padding: 5px 0
          display flex
          justify-content space-between
          flex-direction column
        }
      }
      .text {
        padding: 10px 0
      }
      .content {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 2px
        .left {
          color: $color-text-d
        }
        .money {
          color: $color
        }
        textarea {
          padding: 11px 15px
          border: 0
          width 100%
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          background $color-background-lll
          vertical-align top
        }
      }
      .special {
        padding: 0
      }
    }
  }
  .re-btn {
    text-align center
    background: $color
    color: #fff
    font-size: 16px
    position fixed
    bottom: 0
    left: 0
    right: 0
    z-index 10;
    height 44px;
    line-height: 44px;
  }
</style>
