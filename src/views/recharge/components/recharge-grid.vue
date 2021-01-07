<template>
  <div class="recharge-grid">
    <div class="grid-list">
      <div class="grid-item" :class="['col-' + col]" v-for="(item, index) in list" :key="index"
           @click="change(item, index)" v-if="item.activityPrice != 1">
        <template v-for="item2 in item.skuFeatures">
          <div class="grid-item-content"
               :class="{active: item2.enabled == 1, change: changeItem == index && item2.enabled == 1}">
            <div class="title">{{item2.featureValue}}</div>
            <div class="sub-title">售价:{{item2.featureName}}</div>
          </div>
        </template>
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
      }
    },
    data() {
      return {
        changeItem: -1
      }
    },
    computed: {
      currentIndex: function () {
        return this.status
      }
    },
    mounted() {
    },
    methods: {
      change(item, index) {
        this.$emit('change', item)
        this.changeItem = index
      },
      changeItemActive() {
        this.changeItem = -1
      },
      showFlow(item) {
        return item.split(' ')[1]
      },
      getValue(item) {
        if (item.skuFeatures && item.skuFeatures.length) {
          return item.skuFeatures[0].featureValue
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
        padding-left: 10px;
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

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(.5);
          transform: scale(.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          pointer-events: none;
          box-sizing: border-box;
          border: 1px solid #939393
          border-radius 10px;
        }

        &.active {
          color: $color

          &:after {
            border-color: $color;
          }
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

        .title {
          font-size: 15px;
        }

        .sub-title {
          font-size: 10px;
          padding-top: 8px;
        }
      }
    }
  }
</style>
