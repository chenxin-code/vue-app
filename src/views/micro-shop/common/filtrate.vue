
<template>
  <div class="index">
    <div class="right-div theme_bg_white" @click="clickStop">
      <div class="scroll-div">
        <div class="big-filtrate" v-if="screenArr.length && screenArr[0].profitMin">
          <div class="big-title">按利润</div>
          <div class="items-div">
            <div class="price theme_border_light">
              <input placeholder="输入最低利润" type="number" v-model="params.priceMin">
            </div>
            <div class="price theme_border_light">
              <input placeholder="输入最高利润" type="number" v-model="params.priceMax">
            </div>
          </div>
        </div>
        <div class="big-filtrate">
          <div class="big-title">按价格</div>
          <div class="items-div">
            <div class="price theme_border_light">
              <input placeholder="输入最低价格" type="number" v-model="params.profitMin">
            </div>
            <div class="price theme_border_light">
              <input placeholder="输入最高价格" type="number" v-model="params.profitMax">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-btns">
        <div class="btn" @click="resetData">重置</div>
        <div class="btn theme_font_white theme_standard_bg" @click="sureEvent">确定</div>
      </div>
    </div>
    <div class="other-div" @click="closeEvent"></div>
  </div>
</template>

<script>
const defaultParams = {
  priceMin: "",
  priceMax: "",
  profitMin: "",
  profitMax: ""
};
export default {
  name: "filtrate",
  props: ["category",'screenArr'],
  data() {
    return {
      params: this.$util.deepClone(defaultParams)
    };
  },
  methods: {
    closeEvent() {
      this.$emit("closeEvent");
    },
    clickStop() {
      // console.log("clickStop");
    },
    sureEvent() {
      this.$emit("filtrateEvent", this.params);
    },
    resetData() {
      this.params = this.$util.deepClone(defaultParams);
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.index {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;

  .right-div {
    position: relative;
    float: right;
    width: 80%;
    height: 100%;

    .scroll-div {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 50px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .big-filtrate {
        padding-left: 4px;
        overflow: hidden;

        .big-title {
          margin: 8px 8px 5px;
          font-size: 14px;
        }

        .items-div {
          overflow: hidden;
          margin-bottom: 10px;

          .title {
            padding: 8px;
            font-size: $font-size-medium;
          }

          .price {
            float: left;
            margin-left: 8px;
            margin-right: 10px;
            margin-top: 7px;
            border-width: 0.5px;
            border-style: solid;
            border-radius: 20px;
            font-size: $font-size-medium;

            input {
              height: 26px;
              border: none;
              background: none;
              width: 100px;
              text-align: center;
            }
          }
        }
      }

      .big-filtrate:nth-child(1) {
        margin-top: 28px;
      }
    }

    .bottom-btns {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      height: 50px;
      box-shadow: 0 -2px 2px #efefef;
      display: flex;

      .btn {
        text-align: center;
        line-height: 50px;
        height: 50px;
        flex: 1;
        font-size: 18px;
        font-weight: 500;
      }
    }
  }

  .other-div {
    overflow: hidden;
    height: 100%;
  }
}
</style>
