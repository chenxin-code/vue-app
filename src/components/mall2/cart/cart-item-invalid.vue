/**Created by steven on 2019/1/15.*/

<template>
  <div class="cart-item-invalid">
    <div class="cell-content" >
      <div class="good-content">
        <div class="good-img" >
          <img :src="cartitem.phPictureUrl" alt="" >
        </div>
        <div class="good-detail">
          <div class="good-info">
            <p class="good-name double-line theme_font_gray" >{{cartitem.productName}}</p>
            <p class="size theme_font_gray single-line" >{{cartitem.specs}}</p>
            <p class="size theme_font_red single-line" v-if="cartitem.invalidType == 2">商品不在售卖时间</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: "cart-item-invalid",
  components: {

  },
  props: [
    'cartitem',
  ],
  data () {
    return {
    }
  },
  methods: {


  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
.cart-item-invalid {
  width 100%
  overflow hidden
  .cell-content {
    width 100%
    flex 1;
    padding 10px 10px 10px 15px;
    overflow hidden;
    .good-content{
      display flex
      align-items center
    }
    .good-salespro{
      display flex
      align-items center
      justify-content space-between
      margin-top 10px
      .sl-tag{
        font-size $font-size-small
        padding 2px 6px
        border-radius 8px
        border-width 0.5px
        border-style solid
      }
      .sl-title{
        flex 1
        margin-left 4px
        font-size $font-size-small
      }
      /*.good-salespro-left{
        flex 1
        display flex
        align-items center
      }*/
      .good-salespro-right{
        font-size $font-size-small
        padding 2px 6px
      }


    }

    .good-img {
      width 80px
      height 80px
      position relative
      overflow hidden
      min-width 0
      img {
        width 100%
        height 100%
      }
    }

    .img-samll {
      width 68px
      height 68px
    }
    .good-detail {
      flex 1
      padding-left 12px
      display flex
      min-width 0
      .good-tag {
        font-size $font-size-small
        padding 2px 6px
        border-radius: 20px;
        border: 0.5px solid
      }
      .good-info {
        flex 1
        margin-left 10px
        overflow hidden

        .good-name {
          margin-bottom 6px;
          font-size $font-size-medium
          height 36px;
          line-height 18px;
        }
        .size {
          padding-top 2px;
          padding-bottom 6px
          font-size $font-size-medium-s
        }
        .good-paras {
          display flex
          justify-content space-between
          align-items flex-end
          .paras-left {

            .money-small {
              font-size $font-size-small
            }
            .money-large {
              font-size $font-size-medium-x
            }
          }
          .paras-right {
            .gift-num {
              font-size $font-size-medium-x
            }
          }
        }
      }
    }
  }
  .font-large {
    font-size $font-size-large
  }
}
</style>
