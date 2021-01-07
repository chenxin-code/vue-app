<template>
  <div class="bottom">
    <div class="ticket_background" v-for="ticket in tickets">
      <img class="ticket_img" :src="ticket.imgurl">
      <div class="ticket_info">
        <!--<input type="text" placeholder="输入框在这" autofocus="autofocus">-->
        <div class="tickettitle">{{ticket.typetitle}}</div>
        <div class="ticketname">{{ticket.typename}}</div>
        <div class="ticketdate">有效期:{{ticket.coustartdate.replace(new
          RegExp('-','g'),'.')}}-{{ticket.couenddate.replace(new RegExp('-','g'),'.')}}
        </div>
      </div>
      <div class="ticket_select" @click="select(ticket)">立即使用</div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'refuel-select-elticket',
    components: {
      Toast
    },
    data() {
      return {
        tickets: [],
      }
    },
    methods: {
      select: function (ticket) {
        let _this = this;
        _this.$store.state.elticket = ticket;
        _this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customGo(-1)
        })
      },
      getTicket: function () {
        this.$Loading.open()
        let url = 'app/json/coupon/unusedcoupons'
        let params1 = {
          phone: this.$store.state.login.phone,
          token: this.$store.state.login.token
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          _this.tickets = data.data;
//          console.log(data)
//          if (data.status == 0) {
//            let arr = [];
//            if (Array.isArray(data.data)) {
//              arr = data.data;
//            }
//            _this.dataList[_this.selected] = arr;
//
//            let tempTabs = _this.tabs;
//            for (let i = 0; i < tempTabs.length; ++i) {
//              let item = tempTabs[i]
//              if (item.id == _this.selected) {
//                if (arr.length) {
//                  item.name = item.originalname + '(' + arr.length + ')';
//                } else {
//                  item.name = item.originalname;
//                }
//                break
//              }
//            }
//            _this.tabs = tempTabs;
//          } else {
//            Toast({
//              message: data.info,
//              position: 'bottom',
//              duration: 2000,
//            });
//          }

        }, error => {
          _this.$Loading.close();
        })
      },
    },
    created() {
      this.getTicket();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    width 100%
    background-color $color-background-lll
    overflow hidden

    .ticket_background {
      padding 10px
      margin 10px 10px
      border-radius 5px
      background #FFFFFF
      display flex
      align-items center

      .ticket_img {
        width 60px
        height 60px

      }
      .ticket_info {
        flex 1
        margin 5px 10px

        .tickettitle {
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          max-width 160px

        }
        .ticketname {
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          max-width 160px

        }
        .ticketdate {
          color $color-text-l
          font-size $font-size-small

        }

      }

      .ticket_select {
        border-radius 20px
        padding 5px 10px
        border 1px solid $color-theme-text-d
        color $color-theme-text-d
        font-size $font-size-small
      }
    }
  }
</style>
