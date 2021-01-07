<template>
  <div class="bottom" @scroll.stop="" @click="dismiss">
    <div class="content">
      <div class="content-item" v-if="pageData.payModes">
        <div class="item-title">支付方式：</div>
        <div class="item-detail">
        <span :class="(index === paySlected) ? 'slected-span' : 'span'" v-for="(item, index) of pageData.payModes"
              :key="index" @click.stop="payModeSlected(index)">{{item.channelInfo}}</span>
        </div>
      </div>
      <div class="content-bottom">
        <span class="left-span" @click="bottomClick('0')">取消</span>
        <span class="right-span" @click="bottomClick('1')">确定</span>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: '',
    props: ['pageData'],
    components: {},
    data() {
      return {
        paySlected: 0,
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      payModeSlected(index) {
        this.paySlected = index
      },
      bottomClick (tag) {
        if (tag == '0') {
          this.dismiss()
        } else {
          console.log('test', this.pageData.payModes[this.paySlected])
          this.$emit('heightSlect', this.pageData.payModes[this.paySlected])
        }
      },
      dismiss () {
        this.$emit('dismiss')
      }
    },
    created() {
      console.log('data', this.pageData)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/stylus" lang="stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    position fixed
    /*top 64px*/
    left 0
    right 0
    bottom 0
    background-color: rgba(0, 0, 0, 0.6)
    /*display flex*/
    .content {
      height 60%
      background white
      position relative
      .content-item {
        .item-title {
          /*margin-top 10px*/
          /*margin-left 10px*/
          padding 10px
        }
        .item-detail {
          display flex
          /*flex-wrap wrap*/
          align-content space-between
          text-align center
          align-items center
          /*margin-top 10px*/
          .span {
            width 20%
            margin 0 2.5%
            border-radius 5px
            border solid 1px black
            padding 5px 0
          }
          .slected-span {
            width 20%
            margin 0 2.5%
            border solid 1px $color-theme-btn-d
            color $color-theme-btn-d
            border-radius 5px
            padding 5px 0
          }
        }
      }
      .content-bottom {
        position absolute
        bottom 0
        left 0
        right 0
        text-align center
        display flex
        .left-span {
          width 50%
          padding 10px 0
          color white
          background $color-line-gray-l
        }
        .right-span {
          padding 10px 0
          width 50%
          background $color-theme-btn-d
          color white
        }
      }
    }
  }
</style>
