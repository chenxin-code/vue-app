/**Created by liaoyingchao on 2020-01-16.*/

<template>
  <div class="exchange-detail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="cou-wai">
          <!--<coupon :couponData="detail" :buttonType="-1" :showCover="false" :isExchanged="true"></coupon>-->
          <coupon :couponLayoutType="1" :disabled="false"
                  :used="true"
                  :item="detail"
                  class="coupon-item"></coupon>
        </div>
        <div class="card" v-if="detail.exchagneType == 1">
          <div class="row line_bottom">
            <div class="label">兑换信息
</div>
          </div>
          <div class="row line_bottom">
            <div class="label">兑换时间
</div>
            <div class="value">{{detail.createTime}}</div>
          </div>
          <div class="row" :class="{'line_bottom': exchagneType == 2}">
            <div class="label">当前状态
</div>
            <div class="value">{{detail.postState || '已使用'}}</div>
          </div>
          <div class="row line_bottom" v-if="detail.exchagneType == 2">
            <div class="label">物流公司
</div>
            <div class="value">{{detail.deliveryInfo.name || '暂无信息'}}</div>
          </div>
          <div class="row" v-if="detail.exchagneType == 2">
            <div class="label">物流单号
</div>
            <div class="value">{{detail.deliveryInfo.number || '暂无信息'}}</div>
          </div>
        </div>
        <div class="card" v-if="detail.exchagneType == 2">
          <div class="row line_bottom">
            <div class="label">兑换信息
</div>
          </div>
          <div class="address line_bottom">
            <div class="name">
              <span>{{address.receiverName}}</span>
              <span>{{$util.dealPhone(address.mobile)}}</span>
            </div>
            <div class="full-address">{{address.addressFull}}</div>
          </div>
          <div class="row line_bottom">
            <div class="label">兑换时间
</div>
            <div class="value">{{detail.createTime}}</div>
          </div>
          <div class="row line_bottom">
            <div class="label">当前状态
</div>
            <div class="value">{{detail.postState}}</div>
          </div>
          <div class="row line_bottom">
            <div class="label">物流公司
</div>
            <div class="value">{{detail.deliveryInfo.name || '暂无信息'}}</div>
          </div>
          <div class="row" @click="copyHandler">
            <div class="label">物流单号
</div>
            <div class="value">{{detail.deliveryInfo.number || '暂无信息'}} <p class="copy-btn theme_standard_font  line_radius theme_standard_bdr_i" v-if="detail.deliveryInfo.number">复制</p></div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import coupon from './base/coupon'
  // import Clipboard from '@/views/recharge/assets/utils/copy.js'
  // import couponJs from './js/index'

  export default {
    name: "exchange-detail",
    components: {
      coupon
    },
    data() {
      return {
        detail: {},
        address: {}
      }
    },
    methods: {
      // 复制
      copyHandler() {
        if (this.detail.deliveryInfo != '') {
          Clipboard(this.detail.deliveryInfo.number + '', (isCopy) => {
            if (isCopy) {
              this.$Toast('复制成功！')
            } else {
              this.$Toast('复制失败！')
            }
          })
        }
      },
      async initDeliveryInfo() {
        if (this.detail.deliveryInfo != '') {
          let dic = JSON.parse(this.detail.deliveryInfo)
          this.detail.deliveryInfo = {}
          let nameStr = await couponJs.getExpressCompanyName(dic.name)
          dic.name = nameStr
          this.detail.deliveryInfo = dic
        }
      }
    },
    created() {
      this.detail = this.$route.params.detail ? JSON.parse(this.$route.params.detail) : {}
      this.address = this.detail.addessInfo ? JSON.parse(this.detail.addessInfo) : {}
      this.initDeliveryInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchange-detail {
    width 100%
    height 100%
    overflow hidden
    .content {
      height 100%;
      background-color #f6f6f6;
      .cou-wai {
        padding 20px 20px 0;
      }
      .card {
        margin 15px 20px;
        padding 2px 10px;
        border-radius 5px;
        background-color white
        .row {
          padding 17px 0;
          display flex;
          align-items center;
          .label {
            font-size 16px;
            font-weight 600;
            flex 1;
          }
          .value {
            font-size 15px;
            color #999;
            display flex;
            align-items center;
            .copy-btn {
              font-size 14px;
              padding 5px 8px;
              margin -4px 0px -4px 8px;
            }
          }
        }
        .address {
          padding 14px 0 12px;
          .name {
            font-size 15px;
            span {
              margin-right 15px;
              font-weight 600;
            }
          }
          .full-address {
            padding-top 10px;
            line-height 1.6;
            font-size 13px;
            color #999;
          }
        }
      }
    }
  }
</style>
