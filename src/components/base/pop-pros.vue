<template>
  <div class="pop-pros">
    <div class="other-div" @click="close"></div>
    <div class="pros-div">
      <div class="title-div">
        <span>商品清单</span>
        <img @click="close" src="../../../static/image/mall/close.png"/>
        <span class="pro-num">共{{products.length}}件</span>
      </div>
      <div class="pros-list">
        <div class="pro-div" :class="{'no-top-space': idx == 0}" v-for="(item, idx) in products">
          <div class="pro-img">
            <img :src="item.phPictureUrl"/>
          </div>
          <div class="pro-info font-medium-s">
            <p class="pro-name">{{item.productName}}</p>
            <p class="price-info">
              <span class="theme-color">￥</span>
              <span class="theme-color sale-price">{{$util.toDecimal2(item.price)}}</span>
              <!--<span class="cost-price">200</span>-->
              <span class="sale-num">x {{item.number}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pop-pros',
    components: {},
    props: {
      products: {
        type: Array,
        default: [],
      }
    },
    data() {
      return {
        msg: 'msg'
      }
    },
    methods: {
      close: function () {
        this.$emit('closeEvent', '')
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .pop-pros {
    position fixed;
    top 0px;
    left 0px;
    right 0px;
    bottom 0px;
    background-color rgba(0, 0, 0, 0.2)
    overflow hidden
    .other-div {
      position absolute;
      top 0px;
      left 0px;
      right 0px;
      height 180px;
    }
    .pros-div {
      position absolute;
      top 180px;
      bottom 0px;
      left 0px;
      right 0px;
      background-color #fff;
      .title-div {
        width 100%;
        height 44px;
        line-height 44px;
        padding 0px 10px;
        font-size 15px;
        .pro-num {
          float right;
          font-size $font-size-medium-s;
        }
        img {
          padding 10px;
          width 40px;
          height 40px;
          float right;
        }
      }
      .pros-list {
        position absolute
        top 44px;
        bottom 0px;
        left 0px;
        right 0px;
        .pro-div {
          overflow hidden;
          border-bottom 1px solid $color-line-gray-l
          .pro-img {
            float left;
            position relative
            margin 10px;
            height 0px;
            width 25%;
            padding-bottom 25%;
            img {
              position absolute
              width 100%;
              height 100%;
            }
          }
          .pro-info {
            padding-right 4%;
            overflow hidden;
            .pro-name {
              margin-top 15px;
              font-size 15px;
              height 36px;
              overflow:hidden;
              text-overflow:ellipsis;
              display:-webkit-box;
              -webkit-box-orient:vertical;
              -webkit-line-clamp:2;
            }
            .price-info {
              padding-top 10%;
            }
            .pro-size {
              color $color-text-l
            }
            .theme-color {
              color $color-theme-text-d
            }
            .sale-price {
              display inline-block
              margin-left -6px;
              margin-right 5px;
              font-size $font-size-large
            }
            .cost-price {
              color $color-text-l
              text-decoration: line-through;
            }
            .sale-num {
              float right
            }
          }
        }
      }
    }
  }
</style>
