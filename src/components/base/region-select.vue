<template>
  <div class="region-select">
    <div class="other-div" @click="close"></div>
    <transition name="pop_transiton">
      <div class="select-content" v-show="popShow">
        <div class="close-btn" @click="close">
          <img src="static/image/mall/close.png"/>
        </div>
        <div class="font-medium-l-x title">{{ initData.title ? initData.title : '请选择区域' }}</div>
        <div class="selected-item font-medium">
          <div class="item-div" v-for="(item, idx) in selectedItems" @click="reSelect(idx)">
            <div class="item-text">{{item.name}}</div>
          </div>
          <div class="item-div" v-if="cusOptions.length > 0">
            <div class="item-text item-selected theme_font_red">请选择</div>
          </div>
        </div>
        <div class="options-div">
          <div class="option" v-for="(item, idx) in cusOptions" @click="selectOption(item, idx)">{{item.name}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      initData: {
        type: Object,
        default: {},
      }
    },
    data() {
      return {
        popShow: false,
        selectedIndexs: [],
        selectedItems: [],
        dataCache: [],
        cusOptions: [],
        cusIndex: 0,
        // 进来之后，如果这里面有值，我们需要默认选中这些值
        initAreas: [],
        myTimeout: null
      }
    },
    methods: {
      close: function () {
        this.popShow = false
        if (this.myTimeout) {
          clearTimeout(this.myTimeout)
          this.myTimeout = null
        }
        this.myTimeout = setTimeout(() => {
          this.$emit('closeEvent', '')
        }, 240)
      },
      reSelect: function (index) {
        // 禁止重选
        if (this.initData.canNotReselect == true) {
          return ;
        }
        
        let num = this.selectedItems.length - index
        console.log(num)
        this.selectedItems.splice(index, num)
        this.selectedIndexs.splice(index, num)
        let arr = this.dataCache[index]
        this.dataCache.splice((index + 1), num);
        this.cusOptions = arr;
      },
      selectOption: function (item, index) {
        this.cusIndex = index;
        this.selectedItems.push(item)
        this.selectedIndexs.push(index)
        this.cusOptions = [];
        let selectedValue = {
          item: item,
          selecteds: this.selectedItems
        }
        this.$emit('selectedItemsEvent', selectedValue)
      },
      pushCustomOptions: function (options) {
        if (this.selectedIndexs.length == 0) {
          this.selectedIndexs = []
          this.selectedItems = []
          this.dataCache = [];
          this.cusIndex = 0
        }
        this.dataCache.push(options)
        this.cusOptions = options

        // 需要选中的数组不为空
        if (this.initAreas && this.initAreas.length > 0) {
          let l1 = this.initAreas.shift()
          let has = false
          for (let i = 0; i < options.length; i++) {
            let item = options[i];
            // 如果跟默认需要选中的城市相等，直接选中
            if (this.$util.areaEqual(l1, item.name)) {
              has = true;
              this.selectOption(item, i);
              break;
            }
          }
          // 没有匹配到，直接停止
          if (has == false) {
            this.initAreas = [];
          }
        }
      },
      reset: function (options) {
        this.selectedIndexs = []
        this.selectedItems = []
        this.cusIndex = 0
        if (options) {
          this.dataCache = [];
          this.dataCache.push(options)
          this.cusOptions = options
        } else {
          this.cusOptions = this.dataCache[0]
          this.dataCache = [];
          this.dataCache.push(this.cusOptions)
        }
      }
    },
    created() {
      try {
        this.initAreas = JSON.parse(JSON.stringify(this.initData.initAreas))
      } catch (e) {
        this.initAreas = []
      }
    },
    mounted() {
      this.popShow = true;
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .region-select {
    position fixed
    top 0px;
    bottom 0px;
    left 0px;
    right 0px;
    z-index 100;
    background-color rgba(0, 0, 0, 0.5)
    overflow hidden

    .other-div {
      position absolute;
      top 0px;
      left 0px;
      right 0px;
      bottom 70vh;
    }

    .select-content {
      position absolute;
      bottom 0px;
      left 0px;
      right 0px;
      height 70vh;
      background-color white
      border-radius 10px 10px 0 0;

      .close-btn {
        position absolute;
        top 0px;
        right 0px;
        width 40px;
        height 40px;
        padding 10px;

        img {
          width 20px;
          height 20px;
        }
      }

      .title {
        text-align center;
        line-height 40px;
        height 40px;
      }

      .selected-item {
        height 32px;
        padding 0px 10px;
        border-bottom 1px solid $color-line-gray-l

        .item-div {
          display inline-block;
          padding 0px 10px;
          height 32px;

          .item-text {
            height 32px;
            line-height 32px;
          }

          .item-selected {
            border-bottom-width 2px
            border-bottom-style solid
          }
        }
      }

      .options-div {
        position absolute;
        top 72px;
        bottom 0px;
        left 0px;
        right 0px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .option {
          font-size $font-size-medium;
          padding 10px 18px;
        }

        .option:nth-child(1) {
          padding-top 20px;
        }

        .option:nth-last-child(1) {
          padding-bottom 20px;
        }
      }
    }
  }
</style>
