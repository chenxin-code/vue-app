<!--
 * @Description: 这是物业缴费子组件
 * @Date: 2021-06-13 17:23:10
 * @Author: shuimei
 * @LastEditTime: 2021-07-19 09:13:30
-->
<template>
  <div class="content-list">
    <div class="title">
      <van-checkbox
        v-model="isChecked"
        :disabled="isDisabled"
        checked-color="#E5165A"
        icon-size="18px"
        @change="checkEvent($event, item)"
      ></van-checkbox>
      <i
        class="icon"
        :class="{
          house: item.type == '1' ? true : false,
          car: item.type == '2' ? true : false,
          finish: pageName !== 'waitPay'
        }"
      ></i>
      <span class="title-name">物业缴费</span>
    </div>
    <div class="hd" @click="checkDetail(pageName, item)">
      <div class="icon" :class="titleIcon(item.type)"></div>
      <div class="detail">
        <div class="project">{{ item.spaceFullName }}</div>
        <div class="total">
          <span>待缴纳总金额</span>
          <span
            >￥{{
              pageName === "waitPay" ? item.totalPayableAmount : "0.00"
            }}</span
          >
        </div>
        <div class="check">
          查账单 <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
    <div class="inline"></div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["pageName", "billId", "item", "billType"],
  data() {
    return {
      isShowPropertyBill: false,
      isDisabled: false,
      isDisabledItem: false,
      isChecked: false,
      activeNames: ["1"],
      isOpen: true,
      query: this.$route.query //获取路由信息
    };
  },
  computed: {
    checkAllBill: {
      //监听checkAllBill的变化
      get() {
        // let res = JSON.parse(JSON.stringify(this.data)).notpay;
        let res = JSON.parse(JSON.stringify(this.results));
        //单个数据全部选定时,全选也就被选定了,单个数据有一个没被选定,那么全选也就不会被选定
        return res.every(ele => ele.checked);
      },
      set(val) {
        let res = JSON.parse(JSON.stringify(this.results));
        //val反应全选是否被选中时,全选中返回true;相反,返回false
        res.forEach(ele => {
          //选定全选后,单个数据根据全选情况而变化(全部被选中或全部没被选择)
          ele.checked = val;
        });
        // this.data.notpay = res;
        // this.results = this.data.notpay;
        this.results = res;
      }
    }
  },
  created() {
    /**
     * 1.从金刚区“物业缴费”icon进入,则物业缴费类型是展开样式。
     * 2.从个人中心“我的订单”进入,则物业缴费类型是展开样式。
     * 3.默认关闭。
     */
    if (this.query.orderPage == "true" || this.query.orderPage == undefined) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  },
  methods: {
    checkEvent(event, data) {
      data.checked = event;
      data.billType = data.billType; //物业缴费账单的billType为1
      this.$emit("checkEvent", data);
    },
    onClickBill(type) {
      this.isOpen = !type;
    },
    titleIcon(e) {
      let iconClass = "";
      if (e == "1") {
        iconClass = "house";
      } else if (e == "2") {
        iconClass = "car";
      } else {
        iconClass = "";
      }
      return iconClass;
    },
    checkDetail(checkDetail, data) {
      let customerRoomId = data.customerRoomId;
      let customerRoomIdStr = _.join(customerRoomId, ",");
      this.$router.push({
        path: "/bill/detail",
        query: {
          billDetailType: checkDetail === "waitPay" ? 0 : 1, //待支付页面传0，完成页面传1
          airDefenseNo: customerRoomIdStr,
          houseName: data.spaceFullName
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
$title-color = #E5165A;
.content-list {
  // margin-bottom: 28px;
  // border-bottom:1px dashed #cccccc;
  padding: 0 14px 0 14px;
  .title {
    display: flex;
    margin-bottom: 16px;
    // padding: 17px 0;
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../img/icon1.png') no-repeat;
      background-size: 20px 20px;
      position: relative;
      margin-left: 10px;
      &.finish {
        margin-left: 0;
      }
      &.house {
        background: url('../../img/icon7.png') no-repeat;
        background-size: 20px 20px;
      }
      &.car {
        background: url('../../img/icon8.png') no-repeat;
        background-size: 20px 20px;
      }
    }
    .title-name {
      font-size: 16px;
      font-family: Helvetica;
      color: #121212;
      line-height: 19px;
      margin-left: 10px;
    }
  }
  .hd {
    display: flex;
    .icon {
      width: 58px;
      height: 58px;
      background: url('../../img/property.png') no-repeat;
      background-size: 100% 100%;
      flex: none;
      &.house {
        background: url('../../img/property.png') no-repeat;
        background-size: 100% 100%;
      }
      &.car {
        background: url('../../img/car.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .detail {
    margin-left: 12px;
    width: 100%;
    .project {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #121212;
      line-height: 22px;
    }
    .total {
      margin-top: 5px;
      span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8D8D8D;
        line-height: 18px;
      }
    }
    .check {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $title-color;
      line-height: 18px;
      // width: 65px;
      // right: 16px;
      // position: absolute;
      width: 100%;
      text-align: right;
      margin-bottom: 16px;
      .arrow-icon {
        top: 1px;
      }
    }
  }
}
// 动画
.isd-enter-active,.isd-leave-active{
  transition: all .6s;
}
.isd-enter,.isd-leave-to{
  opacity: 0;
  transform: translateY(-360px);
}
</style>
