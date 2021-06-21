<!--
 * @Description: 这是物业缴费子组件
 * @Date: 2021-06-13 17:23:10
 * @Author: shuimei
 * @LastEditTime: 2021-06-21 02:27:57
-->
<template>
  <!-- v-if="isShowPropertyBill" -->
  <div class="property-bill" v-if="results">
    <div class="property-box" :class="{ isactive: isOpen }">
      <van-checkbox
        v-show="pageName === 'waitPay'"
        v-model="checkAllBill"
        :disabled="isDisAll"
        checked-color="#f80f16"
        icon-size="18px"
      ></van-checkbox>
      <div
        class="property-title"
        :class="{ finish: pageName !== 'waitPay' }"
        @click="onClickBill(isOpen)"
      >
        您的物业缴费账单
      </div>
      <!-- @click="onClickBill(isOpen)" -->
      <div class="down-up-icon"></div>
    </div>
    <transition name="sub-comments">
      <div class="list" v-show="isOpen">
        <div class="content">
          <div
            class="content-list"
            v-for="(item, index) in results"
            :key="index"
          >
            <div class="title">
              <van-checkbox
                v-show="pageName === 'waitPay'"
                v-model="item.checked"
                :disabled="isDis"
                checked-color="#f80f16"
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
            <div class="hd">
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
                <div class="check" @click="checkDetail(pageName, item)">
                  查账单 <van-icon name="arrow" class="arrow-icon" />
                </div>
              </div>
            </div>
            <div class="inline"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["results", "pageName", "isDisAll", "isDis"],
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
      data.billType = 1; //物业缴费账单的billType为1
      this.$emit("checkEvent", data);
    },
    onClickBill(type) {
      this.isOpen = !type;
      console.log(`this.isOpen`, this.isOpen);
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
.property-bill {
  margin-top: 10px;
  .property-box {
    display: flex;
    height: 40px;
    margin: 0 auto;
    padding: 0 10px;
    width: 95%;
    border-radius: 12px;
    background: url('../../img/bill-bg.png') no-repeat;
    background-size: 100% 100%;
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04), 1px 1px 3px 0px rgba(255, 255, 255, 0.5);
    &.isactive {
      border-radius: 12px 12px 0 0;
      background-color: #ffffff;
    }
    .property-title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #E8374A;
      line-height: 40px;
      margin-left: 25px;
      width: 100%;
      &.finish {
        margin-left: 45px;
      }
    }
    .down-up-icon {
      width: 25px;
      height: 25px;
      background: url('../../img/bill-down-icon.png') no-repeat;
      background-size: 100%;
      position: absolute;
      right: 0;
      margin-right: 20px;
      top: 8px;
    }
    &.isactive {
      .down-up-icon {
        transform: rotate(180deg);
      }

    }
  }
  .list {
    width: 95%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 0px 0px 12px 12px;
    margin: 0 auto;
    .content {
      padding-bottom: 1px;
      padding-top: 17px;
      .content-list {
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
            color: #E8374A;
            line-height: 18px;
            width: 65px;
            right: 16px;
            position: absolute;
            .arrow-icon {
              top: 1px;
            }
          }
        }
      }
      .content-list:not(:last-child) {
        margin-bottom: 28px;
        border-bottom:1px dashed #cccccc;
      }
      .inline {
        margin-top: 28px;
      }
    }
    .line {
      width: 100%;
      height: 5px;
      background: red;
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

  .sub-comments-leave-active,.sub-comments-enter-active {
      transition: max-height 0.5s ;
  }
  .sub-comments-enter,.sub-comments-leave-to {
      max-height:0 ;
      opacity: 0;
  }
  .sub-comments-enter-to,.sub-comments-leave {
      max-height: 500px ;
  }

}
</style>
