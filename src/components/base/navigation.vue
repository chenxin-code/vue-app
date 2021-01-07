<template>
  <div class="navigation" :style="getTotalHeight()">
    <div class="navigation-content" :style="{top: this.$store.state.barHeight + 'px'}">
      <div class="back-div" @click="backEvent()" v-if="hasBack == '1'">
        <img class="back-img" src="../../assets/navigation/back.png"/>
      </div>
      <div class="page-title">{{title}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: [
      'title',
      'hasBack'
    ],
    data() {
      return {
      }
    },
    methods: {
      backEvent: function () {
        // console.log('testFunc')
        this.$emit('backEvent', '')
      },
      getTotalHeight:function () {
        return 'height:'+(this.$store.state.barHeight+this.$market.getNavHeight()) + 'px;';
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .navigation {
    position fixed
    top 0px;
    left 0px;
    right 0px;
    background-color $color-theme-o

    .navigation-content {
      position absolute
      bottom 0px;
      left 0px;
      right 0px;

      .back-div {
        float left
        width 44px
        height 44px

        .back-img {
          width 14px;
          height 14px;
          margin-left 10px;
          margin-top 15px;
        }
      }
      .page-title {
        position absolute
        top 50%;
        left 50%;
        margin-left -50px;
        margin-top -12px;
        height 24px;
        width 100px;
        color white
        font-size 20px;
        font-weight 600
        text-align center
      }
    }
  }
</style>
