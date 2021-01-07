/**Created by steven on 2019/1/12.*/

<template>
  <div class="mag-center-list">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="list-item" v-for="item in dataList" @click="enterList(item)">
          <div class="item-img">
            <img :src="getIcon(item.msgType)" alt="">
          </div>
          <div class="item-content">
            <div class="line-div">
              <p class="font-large">{{item.msgTypeStr}}</p>
              <p class="font-small theme_font_tint">{{item.newMsgTime}}</p>
            </div>
            <div class="line-div-two">
              <p class="font-small theme_font_tint single-line">{{item.newMsgTitle}}</p>
              <p class="num theme_font_white theme_bg_red" v-show="item.msgTypeCnt > 0">{{item.msgTypeCnt}}</p>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    name: "mag-center-list",
    components: {},
    data() {
      return {
        dataList: []
      }
    },

    methods: {
      getIcon: function (msgType) {
        if (msgType == 2001 || msgType == 2002 || msgType == 2003 || msgType == 2004 || msgType == 2005) {
          return 'static/image/setting/msg/' + msgType + '.png';
        } else {
          return 'static/image/setting/msg/' + '2999.png';
        }
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      enterList: function (item) {
        this.$router.push({
          path: '/usercenter/msglist',
          query: {
            msgType: item.msgType
          }
        })
      },

      getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      },
      getMessageNumber: function () {
        if (!this.$store.state.login.token) {
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/message/getUnreadMsgCnt';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.indexData.msgNumber = data.data
              this.$bridgefunc.vuexStorage()
            }
          },
          error => {
          }
        );
      },
      getCenterList: function () {
        this.$Loading.open();
        let url = '/app/json/message/getUnreadMsgTypeCnt';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            this.$Loading.close();
            if (data.status == 0) {
              this.dataList = data.data.msgTypeCntList;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    activated() {
      this.getCenterList();
      this.getMessageNumber();
    },
    created() {

    },
    beforeRouteLeave(to, from, next) {
      if (to.path != '/usercenter/msglist') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .mag-center-list {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      overflow auto
      -webkit-overflow-scrolling touch

      .list-item {
        display flex
        align-items: center;
        padding 10px 0px


        .item-img {
          margin-left 10px
          width 60px
          height 60px
          border-radius 30px

          img {
            width 100%
            height 100%
          }
        }

        .item-content {
          flex 1
          margin-left 10px
          padding 15px 5px 15px 0px
          border-bottom 1px solid $color-line-gray-l
          overflow hidden

          .line-div {
            display flex
            justify-content space-between
            align-items flex-start

          }

          .line-div-two {
            display flex
            justify-content space-between
            align-items center
            margin-top 5px
            min-height $font-size-small
          }


          .font-large {
            font-size $font-size-large
          }

          .font-small {
            font-size $font-size-small
          }

          .num {
            text-align center
            font-size $font-size-small
            min-width 20px
            padding 4px
            border-radius 10px
          }

        }

      }
    }
  }
</style>
