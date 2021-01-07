/**Created by liaoyingchao on 2020-04-07.*/

<template>
  <div class="gifts mall2">
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <p class="pop-title theme_font_black">我的奖品</p>
        <div class="pop-scroll-div">
          <div class="tip" v-if="list.length == 0">暂无奖品</div>
          <div class="gift-div line_bottom" v-for="item in list">
            <div class="img-div">
              <div class="tag" v-if="item.activityType == 100">抽奖活动</div>
              <div class="tag" v-else-if="item.activityType == 101">领券活动</div>
              <img :src="item.awardPic ? item.awardPic : 'static/image/live-stream/gift.png'"/>
            </div>
            <div class="info">
              <div class="title">{{item.awardName}}</div>
              <div class="number">数量：{{item.awardNumber}}</div>
              <div class="time">中奖时间：{{item.createTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: "gifts",
    props: ['lbId'],
    components: {
    },
    data() {
      return {
        showPop: false,
        list: []
      }
    },
    methods: {
      getData: function () {
        let url = '/app/json/live_broadcast/awardRecord';
        let params = {
          lbId: this.lbId
        }

        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.list = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
        });
      },
      popClose: function () {
        this.showPop = false;
        this.$emit('popClose')
      },
    },
    created() {
      this.showPop = true;
      this.getData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .gifts {
    overflow hidden
    >>>.pop-body {
      .pop-scroll-div {
        padding 0 20px 24px
        .tip {
          padding 20px;
          text-align center;
          color #999;
        }
        .gift-div {
          display flex;
          align-items center;
          padding 10px 0;
          .img-div {
            position relative;
            border-radius 5px;
            overflow hidden;
            .tag {
              position absolute;
              left 0;
              top 0;
              padding 4px;
              background-color #FF403E;
              font-size 12px;
              border-radius 2px;
              overflow hidden;
              color white;
            }
            img {
              background-color #efefef;
              display block;
              width 70px;
              height 70px;
            }
          }
          .info {
            flex 1;
            padding 0 10px;
            .title {
              font-size 16px;
              font-weight 600;
              padding-bottom 8px;
            }
            .number {
              font-size 12px;
              color #999;
              padding-bottom 14px;
            }
            .time {
              font-size 12px;
              color #999;
            }
          }
        }
      }
    }
  }
</style>
