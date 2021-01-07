/**Created by liaoyingchao on 2020-06-30.*/

<template>
  <div class="exchange-pop" v-if="visible">
    <div class="pop-cont" @click="clickEvent">
      <img src="./img/pop1.png">
      <div class="text">获得{{exchangeData.amount || 0}}点优客点</div>
      <div class="btn">我知道了</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "exchange-pop",
    components: {},
    data() {
      return {
        visible: false,
        exchangeData: {
          amount: 0
        },
        sureEvent: function () {
          console.log('sure event!')
        }
      }
    },
    methods: {
      open: function () {
        this.visible = true;
      },
      clickEvent: function () {
        this.visible = false
        this.sureEvent()
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchange-pop {
    width 100%
    height 100%
    overflow hidden
    position absolute
    top 0px
    left 0px
    z-index 1000
    background: rgba(0, 0, 0, 0.66);
    .pop-cont {
      position absolute
      top 50%;
      left 50%;
      width 250px;
      margin-left -125px;
      margin-top -160px;
      img {
        width 100%;
      }
      .text {
        position absolute;
        left 0;
        right 0;
        bottom 95px;
        text-align center;
        font-size 16px;
        font-weight 500;
      }
      .btn {
        position absolute;
        left 60px;
        right 60px;
        bottom 40px;

        font-size 16px;
        font-weight 500;
        color white;
        text-align center;
        padding 10px 0;
        border-radius 20px;
        overflow hidden;
        background-color #FD6802
      }
    }
  }
</style>
