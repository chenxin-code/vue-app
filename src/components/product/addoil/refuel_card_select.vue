/**Created by Pan on 2018/11/9.*/

<template>
  <div class="refuel_card_select_background">
    <div class="paytype_style" @click="select(index,card)" v-for="(card,index) in cardList">
      <div class="hint_style">
        <div>加油卡支付（{{card.cityName}}）</div>
        <div class="hint_text">{{card.cardNo}}&nbsp;&nbsp;余额¥ {{card.totalBalance}}</div>
      </div>
      <img class="img-full" src="static/image/refuel/checked.png" v-if="selectIndex==index">
      <img class="img-full" src="static/image/refuel/unchecked.png" v-else="selectIndex==index">
    </div>
  </div>
</template>

<script>

  export default {
    name: "refuel_card_select",
    components: {},
    data() {
      return {
        selectIndex: -1,
        cardList: [],
      }
    },
    methods: {
      select: function (index, item) {//点击选择加油卡
        this.selectIndex = index;
        this.$store.state.card = item;
        let _this = this;
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customGo(-1);
        })

      },
      getCardList: function () {
        this.$Loading.open();
        let url = '/app/json/card/getUserCardList';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
        }
        let _this = this;
        this.$http.post(url, params1).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            console.log("12345789222")
            if (data.status == 0) {
              _this.cardList = data.data;
              _this.cardInfo = _this.cardList[0];
              this.$emit('putCardInfo', _this.cardInfo)
              console.log('加油卡列表：', data.data);
            } else {
              Toast({
                message: data.info ? data.info : '获取加油卡列表失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '获取加油卡列表失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );

      },
    },
    created() {
      this.getCardList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .refuel_card_select_background {
    width 100%
    height 100%
    overflow hidden
    background-color $color-background-lll

    .paytype_style {
      padding-top 0px
      font-size $font-size-medium
      border-bottom solid 1px $color-line-gray-l
      padding 10px
      border-radius 0
      display flex
      align-items center
      background-color white

      .hint_style {
        flex 1
      }
      .hint_text {
        color $color-text-d
      }
      img {
        width 15px
        height 15px
        margin-right 10px
      }
      .img_style {
        width 20px
        height 20px
        margin-right 10px
      }
      .otherpaytype {
        width 100%
        text-align center

      }
    }
  }
</style>
