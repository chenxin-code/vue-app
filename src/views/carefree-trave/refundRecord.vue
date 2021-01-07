<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="退票记录"></nav-top>
      <nav-content>
        <van-tabs v-model="active">
          <van-tab title="待申请（7）">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">处理中</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>申请时间</p>
                  <p>申请退票张数：2（张）</p>
                  <span>申请售后</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="待处理（2）">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">待申请</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>申请时间</p>
                  <p>申请退票张数：2（张）</p>
                  <span>取消售后</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="已完成（5）">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">已完成</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>申请时间</p>
                  <p>申请退票张数：2（张）</p>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </nav-content>
    </div>
</template>

<script>
    export default {
        name: "refundRecord",
      data() {
        return {
          active: 2
        };
      },
      mounted() {
          this.loadData()
      },
      methods: {
        loadData() {
          let that = this
          let params = {
            token: this.$store.state.login.token,
            itemId: that.$route.query.id
          };

          that.ticketListData(params).then(res => {
            if (res.data.result) {
              that.obj = res.data.data[0] || {}
            }
          });
        },
      }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      padding 20px;
      background white;
      margin: 15px 12px;
      font-size 14px;
      .div1 {
        display flex;
        justify-content space-between
        span {
          font-size 14px;
          margin auto 0
        }
        .state {
          width 75px;
          text-align: right;
        }
        div{
          display flex;
          justify-content space-between
          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }
          span {
            font-size 16px;
            margin auto
            line-height 22px;
          }
        }
      }
      .div2 {
        display flex;
        justify-content start
        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }
        div{
          display flex;
          flex-direction column
          font-size 14px;
          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
          span {
            align-items: end;
            background: #deb98c;
            color: white;
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 6px;
            margin-left: 100px;
            margin-top: 15px;
          }
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: #deb98c !important;
  }
</style>
