<!--
 * @Description: 这是账单明细页面
 * @Date: 2021-06-10 17:25:46
 * @Author: shuimei
 * @LastEditTime: 2021-06-18 14:15:49
-->
<template>
  <div class="bill-detail">
    <van-sticky :offset-top="offsetTop">
      <nav-top
        leftTitle="账单明细"
        rightTitle="发票查询"
        @backEvent="backEvent"
        @navToPage="navToPage"
      ></nav-top>
    </van-sticky>
    <div class="warpper">
      <div class="summary">
        <div class="house-title">{{ results.spaceFullName }}</div>
        <div class="pay-total">
          <div class="text">待缴纳总金额：</div>
          <div class="money">
            <span class="currency-symbol">￥</span
            >{{ isFinishBill ? '0.00' : results.totalPayableAmount }}
          </div>
        </div>
      </div>
      <div class="bill-list">
        <div class="title">
          <div class="text">
            <i class="icon"></i>
            <span>您的专属账单</span>
          </div>
          <div class="operation">
            <van-dropdown-menu :overlay="false">
              <van-dropdown-item
                v-model="billValue"
                :options="typeOption"
                @change="onChangeBillType"
              />
            </van-dropdown-menu>
          </div>
        </div>

        <div class="content" :class="results.length === 0 ? 'empty' : ''">
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
          <div
            class="list"
            v-for="(item, index) in results.records"
            :key="index"
          >
            <van-checkbox
              v-show="!isFinishBill"
              :name="index"
              v-model="item.shopCheck"
              @click="checkShop(item, index, isMonthPay)"
              checked-color="#ee0a24"
              ref="checkShop"
              >{{ item.quarterTitle }}</van-checkbox
            >
            <div class="title-hd" v-show="isFinishBill">
              {{ item.quarterTitle }}
            </div>
            <div class="item" v-for="(detail, i) in item.quarterList" :key="i">
              <div class="check-operation" v-show="!isFinishBill">
                <van-checkbox
                  v-model="detail.checked"
                  v-show="isMonthPay"
                  @click="checkSingle(item, detail, i)"
                  ref="checkboxGroup"
                  checked-color="#ee0a24"
                ></van-checkbox>
              </div>
              <div class="item-box" :class="{ 'finish-item': isFinishBill }">
                <div class="detail-title">
                  <div class="month-text">
                    <span class="num">{{ detail.month }}</span>
                    <span>{{ detail.monthTitle }}</span>
                  </div>
                  <div class="status">
                    <!-- 样式：支付中：红色 待支付：黑色-->
                    <span class="pay-status">{{ detail.monthBillStatus }}</span>
                    <span class="pay-money"
                      >￥{{ detail.monthPayableAmount }}</span
                    >
                  </div>
                </div>
                <div
                  class="detail-item"
                  v-for="(monthDetail, k) in detail.monthList"
                  :key="k"
                  @click="goToDetail(monthDetail)"
                >
                  <span class="detail-name"
                    >{{ monthDetail.showInfo }}<i></i
                  ></span>
                  <span class="detail-money"
                    >￥{{ monthDetail.payableAmount }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <Empty
            v-show="showEmpty"
            :description="
              isFinishBill ? '暂无账单' : '恭喜您，账单已经全部缴清啦!'
            "
          ></Empty>
          <!-- </van-pull-refresh> -->
        </div>
      </div>
    </div>
    <pay-div
      ref="payDiv"
      :checkData="checkData"
      @checkEvent="checkPayDiv"
      @mergePay="mergePay"
      :mergeAmount="mergeAmount"
      :total="payTotal"
      v-show="!isFinishBill"
    ></pay-div>
  </div>
</template>

<script>
import navTop from "@/components/order/components/common/nav-top";
import payDiv from "@/components/order/components/pay-div/detailPay-div";
import Empty from "./components/empty/empty.vue";
import navToMicroApplication from "@zkty-team/x-engine-module-router";
import yjzdbill from "@zkty-team/x-engine-module-yjzdbill";
import { DropdownMenu, DropdownItem } from "vant";
import { Toast } from "vant";
import { BigNumber } from "bignumber.js";
export default {
  data() {
    return {
      offsetTop: "0rem",
      billValue: 0,
      typeOption: [
        { text: "待支付", value: 0 },
        { text: "已完成", value: 1 }
      ],
      // quarterChecked: false, //季度账单全选
      itemChecked: true, //月份
      isLoading: false, //下拉刷新
      isFinishBill: false,
      isMonthPay: false, //是否为月度支付账单
      // checkAllItem: false, //全部选中
      total: 0, //选中的月度数量
      totalShop: 0, //全选的月度数量
      shopLength: 0, //季度数量
      checkData: new Set(),
      mergeAmount: 0, //合计选中的账单总金额
      payTotal: 0,
      query: this.$route.query,
      results: [],
      showEmpty: false
    };
  },
  components: {
    navTop,
    payDiv,
    Empty,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  created() {
    if (this.query.billDetailType == "1") {
      this.isFinishBill = true;
      this.billValue = 1;
    } else {
      this.isFinishBill = false;
      this.billValue = 0;
    }
    // this.getBillDetail();
  },
  activated() {
    this.getBillDetail();
  },
  computed: {
    quarterChecked: {
      get() {
        let res = JSON.parse(JSON.stringify(this.records));
        console.log(`quarterChecked get`, res);
        //单个数据全部选定时,全选也就被选定了,单个数据有一个没被选定,那么全选也就不会被选定
        return res.every(ele => ele.checked);
      },
      set(val) {
        console.log(`quarterChecked set`, val);
        let res = JSON.parse(JSON.stringify(this.records));
        //val反应全选是否被选中时,全选中返回true;相反,返回false
        res.forEach(ele => {
          //选定全选后,单个数据根据全选情况而变化(全部被选中或全部没被选择)
          ele.checked = val;
        });
        this.records = res;
        console.log(`this.records`, this.records);
      }
    }
  },
  methods: {
    toast() {
      Toast.loading({
        duration: 0,
        type: "loading",
        message: "加载中...",
        forbidClick: true
      });
    },
    getBillDetail() {
      this.showEmpty = false;
      this.toast();
      let propertyObj = {
        airDefenseNo: this.query.airDefenseNo,
        memberId: this.$store.state.userInfo.phone,
        status: this.isFinishBill ? 90 : 10, //账单状态 10-待支付 90-成功
        type: 2, //type 1、列表 2、详情
        pageNo: this.isFinishBill ? 1 : ""
      };

      let url = "/times/charge-bff/order-center/api-c/v1/getList";
      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.results = this.isFinishBill ? data.finish[0] : data.notpay[0];
            if (this.results.length === 0) {
              this.showEmpty = true;
            } else {
              /**
               * managementFeeCycle: 1为月底账单，3为季度账单
               */
              this.isMonthPay =
                this.results.managementFeeCycle == "3" ? true : false;
            }
            Toast.clear(); //请求成功，清除loading
          } else {
            this.results = [];
            // this.showEmpty = true;
            Toast({ duration: 800, message: res.data.message }); //提示错误信息
          }
          this.$forceUpdate();
        })
        .catch(err => {
          // Toast({ duration: 800, message: "请求失败，请重新加载" });
        });
    },
    //点击选中整个季度账单
    checkShop(item, index, type) {
      console.log(`checkShop`, item, type);
      item.shopCheck ? this.shopTrue(item) : this.shopFalse(item);
    },
    //点击单个商品
    checkSingle(item, itemIn) {
      console.log(`checkSingle item`, item);
      console.log(`checkSingle itemIn`, itemIn);
      itemIn.checked
        ? this.checkTrue(item, itemIn)
        : this.checkFalse(item, itemIn);
    },
    // 点击为true
    checkTrue(item) {
      console.log(`checkTrue item`, item);
      this.checkData.add(item);
      let _this = this;
      item.checked = true;
      this.$refs.payDiv.isShow = true; //隐藏全选按钮
      _this.payTotal = this.checkData.size;

      //计算所有选中账单的总金额
      let mergeList = Array.from(this.checkData);
      console.log(`mergeList`, mergeList);
      let num = mergeList.reduce((total, e) => {
        return BigNumber(total).plus(e.monthPayableAmount);
      }, 0);
      this.mergeAmount = num;

      //如果账单列表全部选中，则底部支付的全选按钮也要勾选上
      if (this.$refs.checkShop.length === mergeList.length) {
        this.$refs.payDiv.isChecked = true;
      }
      console.log(`this.$refs.checkShop`, this.$refs.checkShop);

      _this.$forceUpdate();
    },
    // 点击为false
    checkFalse(item, itemIn) {
      this.checkData.delete(itemIn); // 删除数据中取消选中的数据
      let _this = this;
      itemIn.checked = false; // 将月份账单选中状态改为false
      _this.payTotal = this.checkData.size;

      //计算所有选中账单的总金额
      let mergeList = Array.from(this.checkData);
      let num = mergeList.reduce((total, e) => {
        return BigNumber(total).plus(e.monthPayableAmount);
      }, 0);
      this.mergeAmount = num;

      //取消勾选时，底部全选按钮也要取消勾选
      this.$refs.payDiv.isChecked = false;

      //当没有选中任何账单时，隐藏按钮
      if (_this.payTotal === 0) {
        this.$refs.payDiv.isShow = false; //隐藏全选按钮
      }
      _this.$forceUpdate();
    },
    //单个季度账单全选
    shopTrue(item) {
      console.log(`shopTrue`, item);
      let _this = this;
      item.quarterList.forEach((itemIn, index) => {
        _this.checkTrue(itemIn, index);
      });
    },
    //单个季度账单反选
    shopFalse(item) {
      console.log(`shopFalse`, item);
      let _this = this;
      item.quarterList.forEach(itemIn => {
        // 同上
        // if (itemIn.checked === true) {
        _this.checkFalse(item, itemIn);
        // }
      });
    },
    checkPayDiv(data) {
      if (data.checked) {
        //如果勾选上底部全选按钮，则所有账单都要勾选
        this.$refs.checkShop.filter((item, index) => {
          item.checked = true;
        });
        //底部支付组件的合计金额等于整个房间或者车位的待缴纳的总金额
        this.mergeAmount = this.results.totalPayableAmount;
      } else {
        //如果取消勾选上底部全选按钮，则所有账单都要取消勾选
        this.$refs.checkShop.filter((item, index) => {
          item.checked = false;
        });
        //底部支付组件的合计金额等于0
        this.mergeAmount = 0;
      }
    },
    backEvent() {
      this.$router.go(-1);
    },
    navToPage() {
      console.log(`跳转到发票查询页面`);
      //跳转发票查询微应用
      navToMicroApplication.openTargetRouter({
        type: "microapp",
        uri: "com.times.microapp.AppcInvoice", // 微应用包名
        path: "/", // 微应用具体路由
        hideNavbar: true
      });
    },
    //下拉刷新
    onRefresh() {
      // this.isLoading = false;
    },
    //切换账单类型
    onChangeBillType(type) {
      this.isFinishBill = type ? true : false;
      this.getBillDetail();
    },
    checkEvent(event, data) {
      data.checked = event;
      this.$emit("checkEvent", data);
    },
    //合并支付
    mergePay() {
      let payInfoList = Array.from(this.checkData);
      console.log(`合并支付`, payInfoList);
      if (payInfoList.length == 0) {
        this.$toast("请选择账单");
      } else {
        //请求账单中心发起支付
      }
    },
    //查看详情
    goToDetail(item) {
      console.log(`goToDetail`, item);
      this.$router.push({
        path: "/billCenter/detail",
        query: {
          buildings: this.results.spaceFullName,
          businessCreateTime: item.businessCreateTime, //创建时间
          houseNo: item.houseNo, //房号
          showInfo: item.showInfo, //商品说明
          showInfoExt: item.showInfoExt,
          proprietorName: item.proprietorName, //业主名称
          payableAmount: item.payableAmount, //应收金额
          realAmount: item.realAmount, //实付金额
          platMerCstNo: item.platMerCstNo, //商户单号
          tradeMerCstNo: item.tradeMerCstNo, //交易单号
          airDefenseNo: item.airDefenseNo,
          status: item.status, // 账单状态 10待支付， 60-支付中，70-交易失败，80-交易关闭，90-支付成功，100-已撤销"
          recStartTime: item.businessParams.recStartTime, //收费周期-开始时间
          recEndTime: item.businessParams.recEndTime, //收费周期-结束时间
          chargeYear: item.businessParams.chargeYear //缴纳月份
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.bill-detail {
  .warpper {
    height: 100%;
    .summary {
      background-image: url('./img/bill-detail-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      box-shadow: 0px 16px 25px -11px #fa5b6c;
      margin: 10px 11px;

      border-radius: 12px;
      .house-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 22px;
        padding: 16px 16px 10px 16px;
      }
      .pay-total {
        display: flex;
        padding: 0 16px 25px 16px;
        .text {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 20px;
        }
        .money {
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 28px;
          right: 32px;
          position: absolute;
          span {
            font-size: 20px;
          }
        }
      }
    }
    .bill-list {
      height: 100%;
      margin-top: 45px;
      .title {
        display: inline-flex;
        .icon {
          display: inline-block;
          width: 15px;
          height: 17px;
          background: url('./img/bill-title-icon.png') no-repeat;
          background-size: 100%;
          position: relative;
          top: 3px;
        }
        .text {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
          margin-left: 11px;
          span::after {
            content: "";
            height: 10px;
            width: 50%;
            background: linear-gradient(270deg, #FFFFFF 0%, #FFE3E5 100%);
            border-radius: 5px;
            position: absolute;
            z-index: -1;
            left: 0;
            margin-top: 14px;
            margin-left: 12px;
          }
        }
        .operation {
          right: 16px;
          position: absolute;
          display: inline-flex;
          /deep/ .van-dropdown-menu {
            width: 82px;
            .van-dropdown-item {
              left: auto;
              right: 16px;
            }
          }
          /deep/.van-dropdown-menu__bar {
            height: 29px;
            background: #F9F9F9;
            border-radius: 12px;
            border: 1px solid #EEEEEE;
            box-shadow: 0 0px 0px #EEEEEE;
            padding-right: 16px;
            .van-dropdown-menu__title {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #888888;
              line-height: 20px;
            }
            &.van-dropdown-menu__bar--opened {
              border-radius: 12px 12px 0 0;
            }
          }
          /deep/.van-dropdown-menu__title::after {
            background: url('./img/bill-down-icon.png') no-repeat;
            background-size: 100%;
            width: 20px;
            height: 20px;
            border: none;
            transform: none;
            opacity: 1;
            top: 5px;
             right: -16px;
          }
          /deep/.van-dropdown-menu__title--down::after {
            margin-top: -5px;
            transform: rotate(180deg) !important;
          }
          /deep/.van-dropdown-item--down {
            width: 82px;
            .van-dropdown-item__content {
              background: #FFFFFF;
              border-radius: 0px 0px 14px 14px;
              border: 1px solid #EEEEEE;
              .van-dropdown-item__option {
                border-bottom:1px solid #EEEEEE
              }
              .van-cell {
                padding: 4px 18px;
                .van-cell__title {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #888888;
                  line-height: 20px;
                }
              }
            }
            .van-cell__value {
              display: none;
            }
          }
        }
      }
      .content {
        margin-top: 15px;
        padding-bottom: 320px;
        background: #F9F9F9;
        border-radius: 12px;
        overflow-y: scroll;
        height: 100%;
        &.empty{
          padding-bottom: 0
        }
        .list {
          padding: 17px 11px;
          .title-hd {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #444444;
            line-height: 16px;
          }
          .item {
            width: 100%;
            display: inline-flex;
            margin-top: 21px;
            .item-box {
              width:100%;
              background: #FFFFFF;
              border-radius: 12px;
              margin-left: 7px;
              padding-bottom: 16px;
              &.finish-item {
                margin-left: 0;
              }
              .detail-title {
                width: 100%;
                margin-bottom: 7px;
                border-bottom: 0.026667rem solid #F1F1F1;
                .month-text {
                  z-index: 0;
                  margin-left: 16px;
                  position: relative;
                  span {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #E8374A;
                    line-height: 33px;
                  }
                  .num {
                    font-size: 24px;
                    &::after {
                      content: "";
                      height: 10px;
                      width: 35%;
                      background: linear-gradient(270deg, #FFFFFF 0%, #FFE3E5 100%);
                      border-radius: 5px;
                      position: absolute;
                      z-index: -1;
                      left: -4px;
                      margin-top: 21px;
                    }
                  }

                }

                .status {
                  margin-top: -26px;
                  position: relative;
                  float: right;
                  margin-right: 16px;
                  span {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #E8374A;
                    line-height: 20px;
                  }
                  .pay-money {
                    font-size: 16px;
                    color: #121212;
                  }
                }
              }
              .detail-item {
                margin: 0 16px;
                span {
                  font-size: 13px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #8D8D8D;
                  line-height: 26px;
                }
                i {
                  background-image : url('./img/check-bill-icon.png');
                  background-size: 100%;
                  position: relative;
                  display: inline-block;
                  width: 17px;
                  height: 17px;
                  margin-left: 4px;
                  top: 4px;
                }
                .detail-money {
                  float: right;
                }
              }
            }
          }
        }
        /deep/.van-checkbox {
          .van-checkbox__label {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #444444;
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>
