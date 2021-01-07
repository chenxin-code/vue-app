<template>
  <div class="no-apply-card">
    <nav-top title="进度查询" @backEvent="$router.go(-1)" :bg-img="bgImg"></nav-top>
    <nav-content class="no-apply-card-details">
      <div class="no-apply-card-content">
        <div class="progress-container">
          <div class="progress-list">
            <div class="progress-item" :class="{active: index < curProgress}"
                 v-for="(item, index) in progress">
              <div class="circle"></div>
              <div class="text">{{item.text}}</div>
            </div>
          </div>
        </div>
        <div class="no-apply-card-info">
          <div class="speed-of-progress qrcode-info" v-if="applyState == 4 && tradeStyle == '自提'">
            <div class="text">提货条形码</div>
            <div class="qrcode">
              <canvas class="code-img" id="codeDiv"></canvas>
            </div>
          </div>
          <div v-else>
            <div class="speed-of-progress" v-if="user.applyState == 0">
              <div class="info no-approval">
                <span class="text">审批未通过，{{user.applyReason}}</span>
                <span class="time">{{user.approveTime}}</span>
              </div>
            </div>
            <div class="speed-of-progress" v-else>
              <div class="info" v-for="(item, index) in statesList" :key="index">
                <span class="text">{{item.text}}</span>
                <span class="time">{{item.date}}</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="form-cell">
              <label class="form-label">申请单号</label>
              <input class="form-control" type="number" readonly v-model="user.applyNo"/>
            </div>
            <div class="form-cell">
              <label class="form-label">姓名</label>
              <input class="form-control" type="text" readonly v-model="user.applyName"/>
            </div>
            <div class="form-cell">
              <label class="form-label">手机号</label>
              <input class="form-control" type="number" readonly v-model="user.applyPhone"/>
            </div>
            <div class="form-cell">
              <label class="form-label">身份证号</label>
              <input class="form-control" readonly v-model="user.applyIdNo"/>
              <div class="form-suffix">
              </div>
            </div>
            <div class="form-cell">
              <label class="form-label">推荐人</label>
              <input class="form-control" readonly type="text" v-model="user.referee"/>
            </div>
          </div>
          <div class="upload-card">
            <div class="title">上传申请人本人身份证照片</div>
            <div class="upload-img">
              <div class="img">
                <div class="card">
                  <img class="identity-img" :src="user.frontOfId" alt="">
                </div>
                <div class="tips">人像面照</div>
              </div>
              <div class="img">
                <div class="card">
                  <img class="identity-img" :src="user.backOfId" alt="">
                </div>
                <div class="tips">国徽面照</div>
              </div>
            </div>
          </div>
          <div class="table-view trade-style">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">配送方式</div>
                <div class="right">{{tradeStyle}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <div class="self-mention" v-if="tradeStyle == '自提'">
                    <div class="title">
                      自提店铺：<span class="text">{{user.ouName}}</span>
                    </div>
                    <div class="content">
                      地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;：
                      <span class="text">{{user.distriDetailAddr}}</span>
                    </div>
                  </div>
                  <div class="self-mention" v-else-if="tradeStyle == '配送'">
                    <div class="title">
                      <span class="name">{{user.receiver}}&nbsp;&nbsp;</span>
                      <span class="text">{{user.receiverPhone}}</span>
                      <span class="tips" v-if="user.isDefault == 1">默认</span>
                    </div>
                    <div class="content">
                      地址：<span class="text">{{user.distriDetailAddr}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="submit-btn" @click="queryBtn" v-if="tradeStyle == '配送' && user.applyState == 4">确认收货</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import JsBarcode from 'jsbarcode'
  const PROGRESS = [
    {text: '待审核', applyState: 1},
    {text: '待发卡', applyState: 3},
    {text: '待收货', applyState: 4},
    {text: '已完成', applyState: 5},
    {text: '审批未通过', applyState: 0},
    {text: '取消办理', applyState: -1},
  ]
  const STATESLIST= [
    {text: '已申请，待审批', time: 'applyTime', applyState: 1},
    {text: '已审批，等待发卡', time: 'approveTime', applyState: 3},
    {text: '已发卡，待收货', time: 'hairpinTime', applyState: 4},
    {text: '已确认收到加油卡', time: 'deliveryTime', applyState: 5},
    {text: '审批未通过', time: 'approveTime', applyState: 0},
    {text: '取消办理', time: 'cancelTime', applyState: -1},
  ]
  export default {
    name: '',
    data() {
      return {
        user: {},
        statesList: [],
        codeBtnStatus: false,
        countDownFlag: false,
        showTradeStyle: false, // 配送方式弹框
        showFaceImgUrl: '', // 身份证正面
        showBackImgUrl: '', // 身份证背面
        tradeStyle: '配送', // 配送方式回显
        approval: 1, // 审批是否通过
        cardId: '', // 加油卡id
        applyState: '', // 当前状态
        progress: [
          // {text: '已申请'},
        ],
        curProgress: 1,
        auditFail: false,

      }
    },
    created() {
      this.$http.get('/app/json/home/getVueConfig').then(res => {

      })
    },
    mounted() {
      this.user.frontOfId = require('./image/rx@2x.png')
      this.user.backOfId = require('./image/gh@2x.png')
      this.cardId = this.$route.query.cardId
      this.applyCardDetails()
    },
    methods: {
      queryBtn() {
        // 确认收货按钮
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.cardId
        }
        this.$http.post('/app/json/user_apply_card/confirmDelivery', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$Toast('收货成功')
            this.$router.go(-1)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      applyCardDetails() {
        // app办卡详情接口
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.cardId
        }
        this.$http.post('/app/json/user_apply_card/applyCardDetails', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.user = data.data
            const distriMode = data.data.distriMode
            this.tradeStyle = distriMode == 1 ? '配送' : '自提' // distriMode 1 配送 2自提
            const applyState = data.data.applyState
            this.applyState = applyState
            let states = data.data.states || []
            states.forEach(item => {
              let step = STATESLIST.find(step => step.applyState == Number(item))
              if (step) {
                step.date = this.user[step.time]
                this.statesList.push(step)
              }
            })
            const cardList = [5, 0, -1]
            if (!cardList.includes(applyState)) {
              states = [1, 3, 4, 6, 5] // 中间状态补全步骤条
            }
            states.forEach(item => {
              let step = PROGRESS.find(step => step.applyState == Number(item))
              if (step) {
                if (step.applyState == 4) {
                  if (distriMode == 1) {
                    step.text = '待收货'
                  } else {
                    step.text = '待提货'
                  }
                }
                this.progress.push(step)
              }
            })

            this.curProgress = states.indexOf(applyState) + 1
            if (distriMode == 2 && applyState == 4 ) {
              setTimeout(() => {
                let barcode = document.getElementById('codeDiv')
                JsBarcode(barcode, data.data.deliveryCode)
              }, 20)
            }

          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      }
    },
    computed: {
      bgImg() {
        return require('./image/bg_top.png')
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .no-apply-card {
    .no-apply-card-details {
      .no-apply-card-info {
        padding: 11px 15px
      }

      .no-apply-card-content {
        padding-top: 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow-y auto
        -webkit-overflow-scrolling touch

        .speed-of-progress {
          background: #fff
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 6px
          padding: 5px 15px
          margin: 10px 0

          .info {
            padding: 3px 0
            display flex
            justify-content space-between
            align-items center

            .time {
              color: $color-text-l
              flex: 1
              text-align right
            }

            .text {
              flex: 1
              line-height 20px
              color: $color-text-d
            }
          }

          .no-approval {
            .text {
              width: 65%
              line-height 20px
              color: $color-theme-r
            }
          }
        }

        .qrcode-info {
          padding: 11px 15px

          .qrcode {
            text-align center
            padding: 5px 0 0 0

            .code-img {
              width: 80%
            }
          }
        }

        .form-group {
          background: #fff
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 6px
          padding: 0 15px

          .form-cell {
            display flex
            align-items center
            padding 4px 0

            & + .form-cell {
              border-top: 0.5px solid #efecec
            }

            .form-label {
              flex-shrink 0
              width 90px;
              color: $color-text-l
            }

            .form-control {
              text-align right
              flex 1
              background: transparent
              height 34px;
              line-height: 34px;
              width 100%
              color: #222;
              font-size: 12px;
            }

            .division {
              color: $color-theme-r
            }

            .form-suffix {
              flex-shrink 0

              .scan-icon {
                width 20px;
              }
            }
          }
        }

        .upload-card {
          .title {
            padding: 15px 0
          }

          .upload-img {
            display flex
            justify-content space-between
            align-content center

            .img {
              width: 50%
              text-align center

              .card {
                position relative

                .identity-img {
                  width: 95%
                  height: 95px
                }
              }

              .tips {
                padding: 5px 0
                color: $color-text-l
              }
            }
          }
        }

        .trade-style {
          background: #fff
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 6px
          padding: 5px 0
          margin: 10px 0

          .right {
            color: $color-text-l
          }

          .left {
            .self-mention {
              color: $color-text-d

              .title {
                padding: 8px 0

                .name {
                  font-size: 14px
                }

                .tips {
                  background #ff0019
                  color: #fffdef
                  padding: 1px 6px
                  border-radius 25px
                  font-size: 10px
                  margin: 0 10px
                }
              }
            }
          }
        }

        .style-popup {
          padding: 10px 11px 40px 11px
        }
      }
    }

    .progress-container {
      background: url("./image/bg_bottom.png") no-repeat
      background-size: 100% 100%;

      .progress-list {
        padding 20px 15px 40px 20px;
        color: #fff;
        display flex

        .progress-item {
          flex 1;
          text-align: center
          position: relative

          .circle {
            display inline-block
            width 16px;
            height 16px;
            border-radius 50%;
            border 1px solid #fff;
            position: relative
            z-index 2
            background: #c72b3b

            &:before {
              content ''
              width 9px;
              height 9px;
              background: #fff;
              border-radius 50%;
              position: absolute
              top: 50%;
              left: 50%;
              transform translate3d(-50%, -50%, 0)
            }
          }

          & + .progress-item {
            &:after {
              content ''
              width 100%;
              height 1px;
              background: #fff;
              position: absolute
              top: 8px;
              right 50%;
            }
          }

          .text {
            padding-top: 5px;
          }

          &.active {
            .circle {
              background: #fff

              &:before {
                background: #ff0019;
              }
            }
          }
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }

  .submit-btn {
    background-color: #f02c2d;
    color: #fff;
    text-align: center;
    padding: 0.32rem 0;
    border-radius: 50px;
    width: 90%;
    margin: 0 auto
    box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

    &[disabled] {
      opacity 0.5
    }
  }

</style>
