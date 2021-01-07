<template>
  <div class="insurance-policy-details">
    <nav-top title="详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="insurance-policy-details-container" >
      <div class="content" v-if="complete">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车牌号：{{orderDetails.licenseNo}}</div>
              <div class="right" v-if="orderDetails.state == 3">已出单</div>
            </div>
          </div>
        </div>
        <div class="title">订单信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">订单号</div>
              <div class="right">{{orderDetails.tradeNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">保单金额</div>
              <div class="right money">￥{{orderDetails.totalAmount}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">订单时间</div>
              <div class="right">{{orderDetails.insureTime}}</div>
            </div>
          </div>
        </div>
        <div class="title">保单详细信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">交强险保费</div>
              <div class="right money">￥{{orderDetails.tclAmount}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">交强险保单号</div>
              <div class="right">{{orderDetails.tclNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">交强险开始时间</div>
              <div class="right">{{orderDetails.tclStartTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">交强险结束时间</div>
              <div class="right">{{orderDetails.tclEndTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">商业险保费</div>
              <div class="right money">￥{{orderDetails.vciAmount}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">商业险保单号</div>
              <div class="right">{{orderDetails.vciNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">商业险开始时间</div>
              <div class="right">{{orderDetails.vciStartTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">商业险结束时间</div>
              <div class="right money">{{orderDetails.vciEndTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车船费</div>
              <div class="right money">￥{{orderDetails.taxAmount}}</div>
            </div>
          </div>
        </div>
        <div class="title">车辆信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">注册登记日期</div>
              <div class="right money">{{orderDetails.registrationTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车辆品牌型号</div>
              <div class="right">{{orderDetails.modelCode}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车架号</div>
              <div class="right">{{orderDetails.frameNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">发动机号</div>
              <div class="right">{{orderDetails.engineNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">是否过户</div>
              <div class="right">{{orderDetails.isTransfer == 1 ? '是' : '否'}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">过户日期</div>
              <div class="right">{{orderDetails.transferTime}}</div>
            </div>
          </div>
        </div>
        <div class="title">车主信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车主姓名</div>
              <div class="right">{{orderDetails.carOwnerName}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">车主身份证号</div>
              <div class="right">{{orderDetails.carOwnerIdNo}}</div>
            </div>
          </div>
        </div>
        <div class="title">被保人信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">被保人姓名</div>
              <div class="right">{{orderDetails.insuredName}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">被保人电话</div>
              <div class="right">{{orderDetails.insuredPhone}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">被保人身份证号</div>
              <div class="right">{{orderDetails.insuredIdNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">被保人地址</div>
              <div class="right">{{orderDetails.insuredAddress}}</div>
            </div>
          </div>
        </div>
        <div class="title">投保人信息</div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">投保人姓名</div>
              <div class="right">{{orderDetails.applicantName}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">投保人电话</div>
              <div class="right">{{orderDetails.applicantPhone}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">投保人身份证号</div>
              <div class="right">{{orderDetails.applicantIdNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">投保人地址</div>
              <div class="right">{{orderDetails.applicantAddress}}</div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        tradeNo: '', // 订单号
        orderDetails: '',
        complete: false
      }
    },
    mounted() {
      this.tradeNo = this.$route.query.tradeNo || ''
      this.details()
    },
    methods: {
      details() {
        // 支付详情
        this.$request.post('/app/json/car_insure/details', {
          tradeNo: this.tradeNo
        }).then(res => {
          if (res.status == 0) {
            this.complete = true
            this.orderDetails = res.data
          } else {
            this.$Toast(res.info || '详情获取失败')
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .insurance-policy-details {
    .insurance-policy-details-container {
      background-color #f6f6f6
      padding: 11px 0
      .content {
        overflow-y auto
        height: 100%
        .title {
          padding: 15px
        }
        .money {
          color: $color-theme-r
        }
      }
    }
  }
</style>
