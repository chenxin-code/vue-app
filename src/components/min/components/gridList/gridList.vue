<template>
  <div class="gridList">
    <div class="grid_box">
      <ul>
        <li
          v-for="(item, index) in gridData.gridList"
          :key="index"
          @click="navTo(item.url)"
        >
          <div class="number" v-if="item.isShowTip">{{ orderCount }}</div>
          <img
            :src="item.icon"
            alt=""
            v-if="item.icon"
            :style="{ width: item.imgWidth, height: item.imgHeight }"
          />
          <div v-else>
            <span class="unit" v-if="item.isShowUnit">￥</span>
            <span class="item_value">{{ item.value }}</span>
          </div>
          <span class="item_title">{{ item.title }}</span>
        </li>
      </ul>
      <div class="line">
        <img :src="require('../../images/line.png')" alt="" />
      </div>
      <div class="end_btn" @click="navTo(gridData.endData.url)">
        <img
          :src="gridData.endData.icon"
          alt=""
          :style="{
            width: gridData.endData.imgWidth,
            height: gridData.endData.imgHeight,
          }"
        />
        <span class="end_title">{{ gridData.endData.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gridList",
  props: ["gridData", "orderCount"],
  data() {
    return {};
  },
  created() {},
  methods: {
    navTo(url) {
      this.$emit("navTo", url);
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
.gridList {
  width: 100%;
  margin-top: 10px;
  background: #F7F7F7;

  .grid_box {
    width: 93.6%;
    height: 84px;
    background: #FFFFFF;
    border-radius: 14px;
    margin: 10px auto 0;
    display: flex;
    justify-content: space-between;
    padding: 0 19.5px 16px 0;
    box-sizing: border-box;

    ul {
      flex: 1;
      display: flex;
      justify-content: space-around;

      li {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: relative;

        img {
          // width: 30px;
          // height: 30px;
        }

        .unit {
          font-size: 13px;
          font-family: Arial;
          font-weight: 400;
          color: #121212;
        }

        .item_value {
          font-size: 23px;
          font-family: Arial;
          font-weight: 400;
          color: #121212;
        }

        .item_title {
          font-size: 12px;
          font-weight: 500;
          color: #121212;
          margin-top: 11px;
        }

        .number {
          width: 22px;
          height: 22px;
          background: #F34248;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 11px;
          font-family: Arial;
          font-weight: 400;
          color: #FFFFFF;
          position: absolute;
          top: 10px;
          left: 20px;
        }
      }
    }

    .line {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;

      img {
        width: 12.5px;
        height: 57px;
      }
    }

    .end_btn {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      margin-left: 10px;

      img {
        // width: 25.5px;
        // height: 20.5px;
      }

      .end_title {
        font-size: 12px;
        font-weight: 500;
        color: #121212;
        margin-top: 9px;
      }
    }
  }
}
</style>