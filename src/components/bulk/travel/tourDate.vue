<template>
  <div>
    <van-nav-bar
      class="nav-bar"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-calendar
      class="calendar"
      title="日历"
      v-model="show"
      :poppable="false"
      :show-confirm="false"
      :show-title="false"
      :max-date="maxDate"
      :formatter="formatter"
      :default-date="defaultDate"
      @confirm="selectDate"
    />

    <div class="bottom-nav">
      <div class="vant-stepper-block" style="margin-top: 15px">
        <div class="left"><span>成人</span>12周岁以上</div>
        <div class="right">
          <van-stepper
            disable-input
            v-model="adultNum"
            integer
            max="99"
            min="1"
          />
        </div>
      </div>

      <div class="divLine-solid"></div>

      <div class="vant-stepper-block">
        <div class="left"><span>儿童</span>2-12周岁（不含）</div>
        <div class="right">
          <van-stepper
            disable-input
            v-model="childrenNum"
            integer
            max="99"
            min="0"
          />
        </div>
      </div>
      <div class="bottom-block" ref="bottombtn">
        <div class="bottom-button" @click="submit">立即预订</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ServiceMall } from "../bulkapi/index.js";
import {
  currencyFormat,
  storages,
  judgeType,
  userAgent,
} from "@/components/bulk/utils/index.js";
export default {
  components: {},
  watch: {
    adultNum(val) {
      console.log("adult", val);
    },
    childrenNum(val) {
      console.log("child", val);
    },
  },
  data() {
    return {
      btnStyle: false,
      date: "",
      show: true,
      title: "选择日期和人数",
      maxDate: new Date(),
      active: "",
      adultNum: 1,
      childrenNum: 0,
      chooseDay: "",
      tourData: [],
      adultObj: [],
      childObj: [],
      adultSelectItem: {},
      childSelectItem: {},
      adultPrice: "",
      childPrice: "",
      defaultDate: new Date(),
    };
  },

  mounted() {
    if (!judgeType()) {
      this.$refs.bottombtn.style.height = "80px";
    }
    this.tourData = storages().get("tourSend");
    this.adultObj = this.tourData.adult;
    this.childObj = this.tourData.child;
    this.maxDate = new Date(this.adultObj[this.adultObj.length - 1].time);
    this.defaultDate = new Date(this.$route.query.chooseTime);
    if (this.$route.query.chooseTime) {
      this.selectDate(this.$route.query.chooseTime);
    }
  },

  methods: {
    selectDate(e) {
      let time = this.exchangeDate(e);
      this.adultSelectItem = {};
      this.childSelectItem = {};
      this.adultPrice = "";
      this.childPrice = "";
      for (var i = 0; i < this.adultObj.length; i++) {
        if (time == this.adultObj[i].time) {
          this.btnStyle = true;
          this.adultSelectItem = this.adultObj[i];
          this.adultPrice = this.adultObj[i].price;
          break;
        }
        this.btnStyle = false;
      }

      this.childObj.map((item, index) => {
        if (time == item.time) {
          this.childSelectItem = item;
          this.childPrice = item.price;
        }
      });
    },

    exchangeDate(date) {
      var d = new Date(date);
      var datetime =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
      return datetime;
    },

    formatDateTime(newDate) {
      newDate = new Date(newDate);
      let Month = newDate.getMonth() + 1;
      Month = Month >= 10 ? Month : "0" + Month;
      let d = newDate.getDate();
      d = d >= 10 ? d : "0" + d;
      return [
        [newDate.getFullYear(), Month, d].join("-"),
        [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(
          ":"
        ),
      ].join(" ");
    },

    exchangeNum(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },

    onClickLeft() {
      this.$router.back();
    },

    submit() {
      if (this.btnStyle) {
        let param = this.$route.query;
        let paramData = JSON.parse(param.paramData);
        let params = storages().get("tourData");
        let spuName = storages().get("spuName");
        params["spuName"] = spuName;
        params["adultNum"] = this.adultNum;
        params["childNum"] = this.childrenNum;
        params["adultPrices"] = Number(this.adultPrice.substr(1));
        params["childPrices"] = Number(this.childPrice.substr(1));
        params["adultObj"] = this.adultSelectItem;
        params["childObj"] = this.childSelectItem;
        console.log(params, "params");
        let {
          activityId,
          headName,
          headPhone,
          businessTypeId,
          groupShareCode,
          communityId,
        } = paramData;
        let { adultObj, childObj } = params;
        let token = this.$store.state.ythToken
          ? this.$store.state.ythToken
          : localStorage.getItem("ythToken");
        let childNum;
        if (params.childNum > 0) {
          childNum = `&childNum=${params.childNum}`;
        }

        token =
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDA4NjkyNSIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTYyMDM5MDg5OTQ4MjY4MSwiZXhwIjoxNjI1NDQ3ODY0LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIl0sImp0aSI6IjNlNzM2YjE4LTQzMmEtNGY1OS04Njk5LWUxMjJkY2ZiMDQwOSIsImNsaWVudF9pZCI6ImFwcF9jIn0.UGhQDskBQJMfooam0Xe8dixTms2fxnGe9wYsKaysO_ipRNEX8OutF0SzyQalvYfINdV2iNzVYsclOHgO9TpA2Q2n4i-fPcCds7m6QC4Wcyi14uLcCdQrnlh01L5hlsJfaiRXwBr7PpCoX1iaY7UtJW9D6eO1nNKM8rQ9BiA2QFd-uPRZPkSF3_S9RCeNBMEDqAJ0nQhApvUUJ3HFmu6hao00FJUnA-0Sdaihpv5d7BbKsUGPg6gV04N5uKOnNzMFSbkFX_SO1oPFM-UDooVFW7MZYrsbhx9e41jTSdENNUWejgo86ywbujHUXHZOlNIEDy1iEjw5pFygaZfuafKlwg";
        let chooseData = `?adultSkuId=${adultObj.skuId}&adultTime=${adultObj.time}&childSkuId=${childObj.skuId}&id=${adultObj.obj.spuId}&spuName=${params.spuName}&adultNum=${params.adultNum}&adultPrices=${params.adultPrices}${childNum}&childPrices=${params.childPrices}`;
        let queryData = `&activityId=${activityId}&groupDistrName=${headName}&groupDistrPhone=${headPhone}&orderChannel=1&businessType=${businessTypeId}&channel=H5&groupDistributionCode =${groupShareCode}&projectCommunityId=${communityId}&token=${token}`;
        /*服务商城的确认订单页面*/
        let URL = ServiceMall + "travel/submitTravel";
        location.href = URL + chooseData + queryData;
      } else {
        this.$toast("请选择有标价的日期");
      }
    },

    formatter(day) {
      const year = day.date.getFullYear();
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      this.adultObj.map((item, index) => {
        if (
          item.time ==
          year + "-" + this.exchangeNum(month) + "-" + this.exchangeNum(date)
        ) {
          day.bottomInfo = item.price;
        }
      });
      return day;
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
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
    width: 321px;
    height: 50px;
    margin-left: 25px;
    border-radius: 10px;
    background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
    text-align: center;
    line-height: 50px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}

.van-calendar__bottom-info {
  color: #e8374a;
}

.bottom-nav {
  position: fixed;
  bottom: 0px;
  z-index: 99;
  background-color: #fff;
  border-top: 1px solid #fafafa;
}

.calendar {
  padding-bottom: 200px;
}
</style>
