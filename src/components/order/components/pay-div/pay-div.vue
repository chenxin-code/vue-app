<template>
  <div class="pay-box">
    <div class="pay-div">
      <p class="pr" :class="[isShow ? 'pos' : '']">
        合计<span>￥{{ mergeAmount }}</span>
      </p>
      <div>
        <div class="pay-box" v-show="isShow">
          <van-checkbox
            v-model="isChecked"
            checked-color="#f80f16"
            @click="checkEvent($event)"
            icon-size="18px"
          ></van-checkbox>
          <div class="text">
            <p class="p1">全选</p>
            <p class="p2">(仅可全选{{ billTypeName }}类订单)</p>
          </div>
        </div>
      </div>
      <div class="pay">
        <div class="btn" @click="mergePay"><p>去结算</p></div>
      </div>
    </div>
    <div class="adapter-iphoneX" v-if="isX"></div>
  </div>
</template>

<script>
export default {
  props: ["checkData", "mergeAmount"],
  data() {
    return {
      isChecked: false,
      isShow: false,
      billType: "",
    };
  },
  created(){
    if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
      //是iphoneX
      console.log('是iphonex')
      this.isX = true;
    } else {
      //不是iphoneX
      console.log('不是iphonex')
      this.isX = false;
    }
  },
  computed: {
    billTypeName() {
      let billName = "";
      switch (this.billType) {
        case 11:
          billName = "邻里星选";
          break;
        case 1:
          billName = "物业缴费";
          break;
        case 2:
          billName = "月保续费";
          break;
        case 3:
          billName = "临停缴费";
          break;
        case 6:
          billName = "预缴费";
          break;
        case 4:
          billName = "临时缴费";
          break;
        case 7:
          billName = "旅游";
          break;
        case 8:
          billName = "家政";
          break;
        case 9:
          billName = "拎包";
          break;
        case 10:
          billName = "押金";
          break;
        case 12:
          billName = "美居";
          break;
      }
      return billName;
    },
  },
  methods: {
    checkEvent(event) {
      let arr = Array.from(this.checkData);
      if (arr.length == 0) return;
      let data = {};
      data.billType = arr[0].billType;
      data.checked = this.isChecked;
      data.checkAll = true;
      this.$emit("checkEvent", data);
    },
    mergePay() {
      this.$emit("mergePay");
    },
  },
  watch: {
    // billType () {
    //   let billTypeName = "";
    //   switch (this.billType) {
    //     case 11:
    //       billTypeName = "邻里星选";
    //       break;
    //     case 1:
    //       billTypeName = "物业缴费";
    //       break;
    //     case 2:
    //       billTypeName = "月保续费";
    //       break;
    //     case 3:
    //       billTypeName = "临停缴费";
    //       break;
    //     case 6:
    //       billTypeName = "预缴费";
    //       break;
    //     case 4:
    //       billName = "临时缴费";
    //       break;
    //     case 7:
    //       billTypeName = "旅游";
    //       break;
    //     case 8:
    //       billTypeName = "家政";
    //       break;
    //     case 9:
    //       billTypeName = "拎包";
    //       break;
    //     case 10:
    //       billTypeName = "押金";
    //       break;
    //     case 12:
    //       billTypeName = "美居";
    //       break;
    //   }
    //   this.billTypeName = billTypeName;
    // }
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.pay-box{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  .adapter-iphoneX{
    width: 100%;
    height: 34px;
    background-color: #fff;
  }
}
.pay-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 52px;
  line-height: 52px;
  background: #fff;
  padding: 0 14px 0 8px;
  .pr {
    display: flex;
    font-size: 16px;
    font-family: SourceHanSansCN-Normal, SourceHanSansCN;
    font-weight: 400;
    line-height: 52px;
    white-space: nowrap;

    &.pos {
      position: absolute;
      left: 70px;
      top: -10px;
      font-size: 14px;
    }

    p {
      color: #2C2C2C;
    }

    span {
      color: #FD3A3A;
    }
  }

  .pay-box {
    display: flex;

    .text {
      p {
        padding-left: 4px;
      }

      .p1 {
        font-size: 16px;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 16px;
      }

      .p2 {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        white-space: nowrap;
      }
    }
  }

  .pay {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pr {
      display: flex;
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      line-height: 52px;
      white-space: nowrap;

      p {
        color: #2C2C2C;
      }

      span {
        color: #FD3A3A;
      }
    }

    .btn {
      width: 90px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: linear-gradient(270deg, #FD3A3A 0%, #FF755B 100%);
      border-radius: 20px;
      margin-left: 6px;

      p {
        font-weight: 500;
        color: #FFFFFF;
        font-size: 14px;
        position: relative;
        top: -1px;
      }
    }
  }
}
</style>