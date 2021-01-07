<template>
  <div class="recharge-grid">
    <div class="grid-list">
      <!--      视频充值 : 充值类型-->
      <div class="grid-item" :class="['col-' + col]" v-for="(item, index) in list" :key="index"
           @click="change(item, index)" v-if="!kingType && !kingTypeItem && item.businessType == 10">
        <div class="grid-item-content active video-type" :class="{change: changeItem == index}">
          <div class="title">{{item.featureValue}}</div>
        </div>
      </div>
      <!--      话费 、流量充值 、视频充值 : 充值面额-->
      <div class="grid-item" :class="['col-' + col]" v-for="(item, index) in list" :key="index"
           @click="change(item, index)" v-if="kingType || !kingType && kingTypeItem">
        <div class="grid-item-content" :class="{active: item.status == 1, change: changeItem == index && item.status == 1, height: isSetHeight == '1'}">
          <div class="title">{{getValue(item)}}</div>
          <div class="sub-title" v-if="kingType">售价:{{item.activityPrice}}元</div>
          <div class="sub-title" v-if="!kingType && kingTypeItem">{{item.activityPrice}}元</div>
          <div class="sub-title activity-price" v-if="!kingType && kingTypeItem && item.activityPrice < item.salePrice">{{item.activityPrice < item.salePrice ? item.salePrice : ''}}元</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "recharge-grid",
    props: {
      col: {
        type: Number,
        default: 3
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },
      status: {
        type: Boolean,
        default() {
          return false
        }
      },
      kingType: {
        type: Boolean,
        default() {
          return true
        }
      },
      kingTypeItem: {
        type: Boolean,
        default() {
          return true
        }
      }
    },
    data() {
      return {
        changeItem: -1,
        isSetHeight: ''
      }
    },
    computed: {
      currentIndex: function () {
        return this.status
      }
    },
    mounted() {
      if (!this.kingType && !this.kingTypeItem) {
        this.changeItem = 0
      }
    },
    methods: {
      change(item, index) {
        this.$emit('change', item)
        this.$emit('changeActivity', index)
        this.changeItem = index
      },
      showFlow(item) {
        return item.split(' ')[1]
      },
      getValue(item) {
        if (item.activityPrice > item.salePrice) {
          this.isSetHeight = '1'
        }
        if (item.skuFeatures && item.skuFeatures.length) {
          if (!this.kingType && this.kingTypeItem) {
            // 视频充值:充值面额
            let featureValue = ''
            item.skuFeatures.forEach(item2 => {
              if (item2.businessType != 10) {
                featureValue = item2.featureValue
              }
            })
            return featureValue
          } else {
            return item.skuFeatures[0].featureValue
          }
        } else {
          return '- -'
        }
      }
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .recharge-grid {
    .grid-list {
      overflow: hidden

      .grid-item {
        float: left
        padding-left: 11px;
        padding-bottom: 10px;

        &.col-3 {
          width 33.33%

          &:nth-of-type(3n-2) {
            padding-left: 0
          }
        }

        &.col-4 {
          width 25%

          &:nth-of-type(4n-3) {
            padding-left: 0
          }
        }
      }

      .grid-item-content {
        padding 11px 6px; /*no*/
        position: relative
        border-radius 5px
        text-align: center
        overflow hidden
        display flex
        align-items center
        justify-content center
        flex-direction column
        line-height 22px
        border: 1px solid rgba(181, 181, 181, 0.38);

        &.active {
          color: $color
          border-color rgba(60, 157, 243, 0.38);
        }

        &.change::before {
          content ''
          position absolute
          right -17px
          bottom -17px
          border 15px solid transparent
          border-left-color $color
          transform rotate(45deg)
        }
        &.height {
          height: 75px
        }

        .title {
          font-size: 15px;
        }

        .sub-title {
          font-size: 10px;
        }
        .activity-price {
          color: $color-text-d
          text-decoration line-through
        }
      }
      .video-type {
        height: 50px
        line-height 20px
        padding: 0 2px
        display flex
        justify-content center
        align-items center
      }
    }
  }
</style>
