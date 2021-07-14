<template>
  <div>
    <van-tabs v-model="active">
      <van-tab
        v-for="(item, index) in monthList"
        :key="index"
        @click="selectMonth(item.value)"
      >
        <div slot="title" class="vant-tab-title">
          <div class="top">{{ item.label }}</div>
          <div class="bottom">
            ¥ {{ item.prize | currencyFormat }}<span>起</span>
          </div>
        </div>
        <div class="divLine-solid"></div>
        <van-calendar
          @confirm="onConfirm"
          v-model="show"
          :poppable="false"
          :show-mark="false"
          :lazy-render="false"
          :show-title="false"
          :formatter="formatter"
          :min-date="minDate"
          :show-confirm="false"
          :max-date="maxDate"
        >
        </van-calendar
      ></van-tab>
    </van-tabs>

    <div class="vant-stepper-block" style="margin-top: 15px">
      <div class="left"><span>成人</span>12周岁以上</div>
      <div class="right">
        <van-stepper disable-input v-model="adultNum" integer max="99" min="0" />
      </div>
    </div>
    <div class="divLine-solid"></div>

    <div class="vant-stepper-block">
      <div class="left"><span>儿童</span>2-12周岁（不含）</div>
      <div class="right">
        <van-stepper disable-input v-model="childrenNum" integer max="99" min="0" />
      </div>
    </div>
    <div class="bottom-block">
      <div class="bottom-button" @click="submit">立即预订</div>
    </div>
  </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";

export default {
  components: {},
  watch: {
    adultNum(val) {
      console.log("adult", val);
    },
    childrenNum(val) {
      console.log("adult", val);
    }
  },
  data() {
    return {
      show: true,
      minDate: new Date(2021, 3, 1),
      maxDate: new Date(2021, 3, 30),
      active: "",
      adultNum: 1,
      childrenNum: 0,
      chooseDay: "",
      monthList: [
        {
          label: "三月",
          value: 3,
          prize: "69999"
        },
        {
          label: "四月",
          value: 4,
          prize: "34354"
        },
        {
          label: "五月",
          value: 5,
          prize: "99999"
        }
      ]
    };
  },
  mounted() {
    this.time = dateFormat.getCurrentDate();
  },
  methods: {
    submit() {},
    formatter(day) {
      // const month = day.date.getMonth() + 1;
      // const date = day.date.getDate();
      console.log("day", dateFormat.getCurrentDate(day.date));

      // if (month === 5) {
      //   if (date === 1) {
      //     day.topInfo = "劳动节";
      //   } else if (date === 4) {
      //     day.topInfo = "青年节";
      //   } else if (date === 11) {
      //     day.text = "今天";
      //     day.bottomInfo = "hehe";
      //   }
      // }

      return day;
    },
    onConfirm(date) {
      // this.date = this.formatDate(date);
      console.log("date", date);
    }
  }
};
</script>

<style lang="less" scoped>
.divLine-solid {
  width: 323px;
  margin-left: 15px;
  height: 1px;
  background: #f0f0f0;
}
.header-month {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  width: 100%;
  height: 60px;
  line-height: 60px;
  div {
    flex: 1;
    text-align: center;
    position: relative;
  }
}
.vant-tab-title {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .bottom {
    color: #e8374a;
    font-size: 12px;
    span {
      color: #666666;
    }
  }
}
.vant-stepper-block {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  background: #ffffff;
  .left {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-left: 15px;
    span {
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #121212;
      margin-right: 15px;
    }
  }
  .right {
    margin-right: 15px;
  }
}
.bottom-block {
  width: 375px;
  height: 98px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  padding-top: 10px;
  .bottom-button {
    border-radius: 10px;
    width: 321px;
    height: 50px;
    margin-left: 25px;
    background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
    text-align: center;
    line-height: 50px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>

<style lang="less"></style>
