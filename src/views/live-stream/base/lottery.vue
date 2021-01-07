/**Created by liaoyingchao on 2020-04-07.*/

<template>
  <div class="lottery-pop mall2">
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <p class="pop-title theme_font_black">抽奖</p>
        <div class="pop-scroll-div">
          <div class="gift-div line_bottom">
            <div class="img-div">
              <img src="../imgs/gift.png"/>
            </div>
            <div class="info">
              <div class="title">{{lotteryData.awardName}}</div>
              <div class="time">即将发放 {{lotteryTimeStr}}</div>
            </div>
            <div class="join">{{lotteryData.partyNumber}}人参与</div>
          </div>
          <div class="gift-info">
            <div class="title">参与条件：</div>
            <div class="time">发送评论“{{lotteryData.password}}”</div>
          </div>
          <div class="join-btn" :class="{joined: canJoin == false}" @click="join">{{canJoin ? '一键参与互动' : '您已参与互动'}}</div>
          <div class="join-tip">点击一键参与互动后，将复制口令并自动为您发送到评论区</div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: "lottery-pop",
    props: ['lotteryData', 'lotteryTimeStr'],
    components: {
    },
    data() {
      return {
        showPop: false,
        canJoin: true
      }
    },
    methods: {
      join: function () {
        if (this.canJoin == false) {
          this.$Toast('您已经参与抽奖，请耐心等待开奖！')
          return ;
        }
        let url = '/app/json/live_broadcast/partake';
        let params = {
          lbId: this.lotteryData.roomId,
          activityId: this.lotteryData.id
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.popClose()
            let key = 'Lottery_Activity_Joined_Id_' + this.lotteryData.id
            sessionStorage.setItem(key, '1')
            this.$Toast('参与成功！')
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('参与失败！')
        });
      },
      popClose: function () {
        this.showPop = false;
        this.$emit('popClose')
      },
    },
    created() {
      this.showPop = true;
      let key = 'Lottery_Activity_Joined_Id_' + this.lotteryData.id
      let v = sessionStorage.getItem(key)
      if (v == '1') {
        this.canJoin = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .lottery-pop {
    overflow hidden
    >>>.pop-bottom {
      height auto;
      .pop-scroll-div {
        padding 0 20px 24px
        .gift-div {
          display flex;
          align-items center;
          padding 10px 0;
          .img-div {
            img {
              width 50px;
              height 50px;
            }
          }
          .info {
            flex 1;
            padding 0 10px;
            .title {
              font-size 18px;
              font-weight 600;
              padding-bottom 12px;
            }
            .time {
              font-size 12px;
              color #FF403E;
              font-weight 600;
            }
          }
          .join {
            font-size 12px;
            color #999;
          }
        }
        .gift-info {
          padding 10px 0;
          .title {
            font-size 16px;
            font-weight 600;
            padding-bottom 8px;
          }
          .time {
            font-size 12px;
            color #999;
          }
        }
        .join-btn {
          font-size 18px;
          font-weight 600;
          text-align center;
          padding 12px;
          color white;
          background-color #FF403E;
          border-radius 20px;
          &.joined {
            background-color #cdcdcd;
          }
        }
        .join-tip {
          text-align center;
          font-size 12px;
          margin-top 10px;
          color #999;
        }
      }
    }
  }
</style>
