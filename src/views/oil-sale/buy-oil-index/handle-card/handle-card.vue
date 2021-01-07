<template>
  <div class="handle-card">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="handle-card-container">
      <div class="top-show">
        <div class="img-wrapper">
          <img class="img" src="../../assets/image/bill.png" alt="">
        </div>
        <div class="text">
          <div class="info">订单编号：{{details.cardErpOrderId}}</div>
          <div class="info">油品名称：{{details.oilname || details.oilName}}</div>
        </div>
      </div>
      <div>
        <div class="title">持卡人信息</div>
        <div class="base-card">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">持卡人姓名</div>
                <div class="right">
                  <input type="text" placeholder="请输入办卡人姓名" v-model="user.cardUserName">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">持卡人身份证号</div>
                <div class="right">
                  <input type="text" placeholder="请输入身份证号" v-model="user.cardIdentifyId">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">持卡人手机号</div>
                <div class="right">
                  <input type="text" placeholder="请输入办卡人手机号" v-model="user.cardUserPhone">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">油品数量</div>
        <div class="base-card">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">卡内油品数量(t)</div>
                <div class="right">
                  <input type="text" placeholder="请输入提油卡卡内油品数量" v-model="user.num || user.cardOilScale">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!source">
        <div class="title">经办人信息</div>
        <div class="base-card">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">经办人手机号</div>
                <div class="right">
                  <input type="text" placeholder="请输入经办人手机号" v-model="details.userPhone">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!source">
        <div class="title">办卡审核</div>
        <div class="base-card">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">申请办卡时间</div>
                <div class="right">
                  <input type="text" placeholder="请输入时间" v-model="details.applyTime">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">审核状态</div>
                <div class="right">
                  <input type="text" placeholder="请输入状态" v-model="applyState">
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="currentIndex == 1">
              <div class="table-view-cell-text">
                <div class="left">开票员名称</div>
                <div class="right">
                  <input type="text" v-model="details.examineName">
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="currentIndex == 1 || currentIndex == 2">
              <div class="table-view-cell-text">
                <div class="left">{{currentIndex == 1 ? '验证时间' : '取消时间'}}</div>
                <div class="right">
                  <input type="text" v-model="details.examineTime">
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="currentIndex == 2">
              <div class="table-view-cell-text">
                <div class="left">取消人手机号</div>
                <div class="right">
                  <input type="text" v-model="details.userPhone">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bill-btn" v-if="!currentIndex && currentIndex != 0" @click="handleBtn">
        <div class="btn-show">{{source == 'handle' ? '提交办理' : '取消申请'}}</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        source: '', // 来源
        currentIndex: '', // 0待验证 1验证成功 2已取消
        title: '',
        details: '',
        applyState: '', // 0待验证 1审核通过 2已取消 3成功
        user: {},
        info: ''
      }
    },
    mounted() {
      this.source = this.$route.query.source
      if (this.$route.query.details) {
        this.details = JSON.parse(this.$route.query.details)
        console.log(this.details)
        this.user = this.details
      }
      if (this.$route.query.info) {
        this.info = JSON.parse(this.$route.query.info)
        console.log(this.info)
      }
      if (this.details.applyState === 0) {
        this.applyState = '待验证'
      } else if (this.details.applyState == 1) {
        this.applyState = '审核通过'
      } else if (this.details.applyState == 2) {
        this.applyState = '已取消'
      } else if (this.details.applyState == 3) {
        this.applyState = '办卡成功'
      }
      this.currentIndex = this.$route.query.currentIndex
      console.log(this.currentIndex)
      if (this.source == 'handle') {
        this.title = '提油卡办理'
      } else {
        this.title = '办卡详情'
      }
    },
    methods: {
      handleBtn() {
        if (this.source == 'handle') {
          // 提交办理
          if (!this.user.cardUserName) {
            this.$toast('请输入持卡人姓名')
          } else if (!this.user.cardIdentifyId) {
            this.$toast('请输入持卡人身份证号')
          } else if (!this.user.cardUserPhone) {
            this.$toast('请输入持卡人手机号')
          } else if (!this.user.num) {
            this.$toast('请输入卡内油品数量')
          } else if (this.user.num > this.details.num) {
            this.$toast('卡内油品数量不能超过订单总量(总量数值)')
          } else {
            this.applyErpOilCard()
          }
        } else {
          // 取消申请
          this.cancelApplyOilCard()
        }
      },
      applyErpOilCard() {
        // 提交办理
        this.$request.post('/app/json/app_oil_appoint/applyErpOilCard', {
          cardUserName: this.user.cardUserName, // 持卡人姓名
          cardIdentifyId: this.user.cardIdentifyId, // 持卡人身份证号
          cardUserPhone: this.user.cardUserPhone, // 持卡人电话
          cardOilScale: this.user.num, // 购油量
          oilName: this.details.oilname, // 购油名称
          erpOrderId: this.details.oilcode, // erp订单号
          vipUnitName: this.info.departname, // 单位客户名称
          taxCode: this.info.taxCode, // 单位客户税务编码
          vipUnitCode: this.info.departcode // 单位客户编码
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('申请成功')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info ? res.info : '预约失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      cancelApplyOilCard() {
        this.$request.post('/app/json/app_oil_appoint/cancelApplyOilCard', {
          id: this.details.id
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('取消成功')
            eventBus.$emit('getErpOilCardListByUserId')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info ? res.info : '取消失败')
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .handle-card {
    .handle-card-container {
      padding: 11px 15px 60px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      height: 100%

      .top-show {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        display flex
        justify-content left
        padding: 11px 15px

        .img-wrapper {
          padding-right 10px

          .img {
            width 50px
          }
        }

        .text {
          display flex
          justify-content space-between
          flex-direction column
          padding: 3px 0
        }
      }

      .base-card {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 5px

        .table-view-cell-text {
          justify-content left

          .left {
            width: 120px
          }

          .right {
            flex: 1

            input {
              width: 100%
            }
          }
        }
      }

      .title {
        padding: 10px 0
      }

      .bill-btn {
        text-align center
        font-size 14px
        display flex
        margin-top: 20px

        .btn-show {
          flex: 1
          border-radius 20px
          background: #009df8
          padding: 13px 0
          color: #fff
          font-weight bold

          & + .btn-show {
            margin-left: 10px
          }
        }
      }
    }
  }
</style>
