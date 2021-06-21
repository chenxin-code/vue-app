<!--
 * @Description: 这是账单明细页面
 * @Date: 2021-06-10 17:25:46
 * @Author: shuimei
 * @LastEditTime: 2021-06-21 15:48:33
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
        <div class="house-title">{{ this.$route.query.houseName }}</div>
        <div class="pay-total">
          <div class="text">待缴纳总金额：</div>
          <div class="money" v-if="results.totalPayableAmount">
            <span class="currency-symbol">￥</span
            >{{ isFinishBill ? "0.00" : results.totalPayableAmount }}
          </div>
          <div class="money" v-else><van-loading size="20" /></div>
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
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="showFinishText ? '--没有更多了--' : ''"
            :immediate-check="false"
            :offset="10"
            @load="getBillDetail"
            style="height:100%;width:100%;overflow-y:auto;"
          >
            <div
              class="list"
              v-for="(item, index) in results.records"
              :key="index"
            >
              <div v-show="!isFinishBill">
                <!-- v-if="!isMonthPay" -->
                <van-checkbox
                  v-show="!isMonthPay"
                  :name="index"
                  v-model="item.shopCheck"
                  @click="checkShop(item, index, isMonthPay)"
                  checked-color="#ee0a24"
                  ref="checkShop"
                  >{{ item.quarterTitle }}</van-checkbox
                >
                <!-- v-else -->
                <div class="title-hd" v-show="isMonthPay">
                  {{ item.quarterTitle }}
                </div>
              </div>
              <div class="title-hd" v-show="isFinishBill">
                {{ item.quarterTitle }}
              </div>
              <div
                class="item"
                v-for="(detail, i) in item.quarterList"
                :key="i"
                ref="billItem"
              >
                <div class="check-operation" v-show="!isFinishBill">
                  <van-checkbox
                    v-model="detail.checked"
                    v-show="isMonthPay"
                    @change="checkSingle(item, detail, i)"
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
                      <span
                        class="pay-status"
                        :class="detail.isPay == 1 ? 'paying' : 'need'"
                        v-show="!isFinishBill"
                        >{{ detail.isPay == 1 ? "支付中" : "待支付" }}</span
                      >
                      <span class="pay-status finish" v-show="isFinishBill"
                        >已完成</span
                      >
                      <span class="pay-money" v-show="!isFinishBill"
                        >￥{{ detail.monthPayableAmount }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="detail-item"
                    v-for="(monthDetail, k) in detail.monthList"
                    :key="k"
                    @click="goToDetail(monthDetail, isFinishBill)"
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
          </van-list>
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
      :resultList="results.records"
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
import moment from "moment";
import _ from "lodash";
import { Dialog } from "vant";
import { Loading } from "vant";
export default {
  data() {
    return {
      offsetTop: "0rem",
      billValue: 0,
      typeOption: [
        { text: "待支付", value: 0 },
        { text: "已完成", value: 1 }
      ],
      isLoading: false, //下拉刷新
      isFinishBill: false,
      isMonthPay: false, //是否为月度支付账单
      checkData: new Set(),
      mergeAmount: 0, //合计选中的账单总金额
      payTotal: 0,
      currentPage: 0,
      results: [],
      showEmpty: false,
      loading: false,
      finished: false,
      pageTimes: "",
      showFinishText: false,
      billNosList: [],
      isPaying: false,
      payErrorInfo: {}
    };
  },

  components: {
    navTop,
    payDiv,
    Empty,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Loading.name]: Loading
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === "/billCenter/detail") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },
  created() {
    if (this.$route.query.billDetailType == "1") {
      this.isFinishBill = true;
      this.billValue = 1;
    } else {
      this.isFinishBill = false;
      this.billValue = 0;
    }
    this.getBillDetail();
  },
  activated() {
    console.log(`payErrorInfo`, this.payErrorInfo);
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
      // this.results = [];
      this.showEmpty = false;
      this.loading = true;
      if (this.isFinishBill) {
        this.showFinishText = false;
        this.finished = false;
        let page = this.currentPage;
        page = page + 1;
        this.currentPage = page;
      }

      let propertyObj = {
        airDefenseNo: this.$route.query.airDefenseNo,
        memberId: this.$store.state.userInfo.phone
          ? this.$store.state.userInfo.phone
          : "",
        status: this.isFinishBill ? 90 : 10, //账单状态 10-待支付 90-成功
        type: 2, //type 1、列表 2、详情
        pageNo: !this.isFinishBill ? 1 : this.currentPage,
        pageTimes: this.pageTimes
      };

      // let url = "/times/charge-bff/order-center/api-c/v1/getList";
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "http://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            if (!this.isFinishBill) {
              this.results = this.isFinishBill
                ? data.finish[0]
                : data.notpay[0];
            } else {
              if (this.currentPage === 1) {
                this.results = this.isFinishBill
                  ? data.finish[0]
                  : data.notpay[0];
                this.pageTimes = this.results.pageTimes;
              } else {
                let list = this.isFinishBill
                  ? data.finish[0].records
                  : data.notpay[0].records;
                let re = this.results.records.concat(list);
                this.results.records = re;
              }
            }

            this.loading = false; //清除loading

            if (this.results.length === 0) {
              console.log(`空的this.results`, this.results);
              this.showEmpty = true;
            } else {
              /**
               * managementFeeCycle: 1为月度账单，3为季度账单
               */
              this.isMonthPay =
                this.results.managementFeeCycle == "1" ? true : false; ////
            }

            // 如果是待支付账单，不做分页，只加载一次。所以要将finished 设置成 true
            if (!this.isFinishBill) {
              this.finished = true;
              this.showFinishText = true;
            } else {
              let pageLength = this.pageTimes
                ? _.split(this.pageTimes, ",").length
                : 0;
              if (pageLength && pageLength === this.currentPage) {
                this.finished = true;
                this.showFinishText = true;
              } else {
                this.finished = false;
              }
            }
          } else {
            this.results = [];
            // this.showEmpty = true;
            Toast({ duration: 500, message: res.data.message }); //提示错误信息
          }
          this.$forceUpdate();
        })
        .catch(err => {
          // Toast({ duration: 800, message: "请求失败，请重新加载" });
        });
    },
    //点击选中整个季度账单
    checkShop(item, index, type) {
      item.shopCheck ? this.shopTrue(item) : this.shopFalse(item);
    },
    //点击单个商品
    checkSingle(item, itemIn) {
      // console.log(`checkSingle item`, item);
      // console.log(`checkSingle itemIn`, itemIn);
      itemIn.checked
        ? this.checkTrue(item, itemIn)
        : this.checkFalse(item, itemIn);
    },
    // 点击为true
    checkTrue(item, itemIn) {
      console.log(`checkTrue item`, item);
      console.log(`checkTrue itemIn`, itemIn);
      let _this = this;
      //判断当前是否为月份账单
      if (_this.isMonthPay) {
        //为月度账单时的操作
        _this.checkData.add(itemIn);
        item.checked = true;
        _this.$refs.payDiv.isShow = true; //显示全选按钮
        _this.payTotal = _this.checkData.size;

        let mergeList = Array.from(_this.checkData);

        //先判断季度账单有没有勾选
        if (!item.shopCheck && item.shopCheck != undefined) {
          //如果勾选的月账单总数等于季度账单的总长度，则季度账单按钮要勾选
          if (mergeList.length === item.quarterList.length) {
            item.shopCheck = true;
          }
        }

        //计算所有选中账单的总金额
        let num = mergeList.reduce((total, e) => {
          return BigNumber(total).plus(e.monthPayableAmount);
        }, 0);
        _this.mergeAmount = num;

        //如果账单列表全部选中，则底部支付的全选按钮也要勾选上
        if (_this.$refs.billItem.length === mergeList.length) {
          _this.$refs.payDiv.isChecked = true;
        }
      } else {
        //为季度账单时的操作
        _this.checkData.add(item);
        _this.$refs.payDiv.isShow = true; //显示全选按钮
        _this.payTotal = _this.checkData.size;

        let mergeList = Array.from(_this.checkData);

        console.log(`mergeList checkTrue`, mergeList);
        //计算所有选中账单的总金额
        let testSub = 0;
        let num = mergeList.reduce((total, e) => {
          return BigNumber(total).plus(e.monthPayableAmount);
        }, 0);
        _this.mergeAmount = num;

        //如果账单列表全部选中，则底部支付的全选按钮也要勾选上
        if (_this.$refs.billItem.length === mergeList.length) {
          _this.$refs.payDiv.isChecked = true;
        }
      }
      _this.$forceUpdate();
    },
    // 点击为false
    checkFalse(item, itemIn) {
      console.log(`checkFalse item`, item);
      console.log(`checkFalse itemIn`, itemIn);
      let _this = this;

      if (this.isMonthPay) {
        _this.checkData.delete(itemIn); // 删除数据中取消选中的数据
        itemIn.checked = false; // 将月份账单选中状态改为false
      } else {
        console.log(`checkFalse checkData`, item);
        _this.checkData.delete(itemIn); // 删除数据中取消选中的数据
      }
      item.shopCheck = false; // 将季度账单选中状态改为false
      _this.payTotal = _this.checkData.size;

      //计算所有选中账单的总金额
      let mergeList = Array.from(_this.checkData);
      console.log(`mergeList checkFalse`, mergeList);
      let num = mergeList.reduce((total, e) => {
        return BigNumber(total).plus(e.monthPayableAmount);
      }, 0);
      _this.mergeAmount = num;

      //取消勾选时，底部全选按钮也要取消勾选
      _this.$refs.payDiv.isChecked = false;

      //当没有选中任何账单时，隐藏按钮
      if (_this.payTotal === 0) {
        _this.$refs.payDiv.isShow = false; //隐藏全选按钮
      }
      _this.$forceUpdate();
    },
    //单个季度账单全选
    shopTrue(item) {
      // console.log(`shopTrue`, item);
      let _this = this;
      item.quarterList.forEach((itemIn, index) => {
        _this.checkTrue(itemIn, index);
      });
    },
    //单个季度账单反选
    shopFalse(item) {
      let _this = this;
      item.quarterList.forEach(itemIn => {
        _this.checkFalse(item, itemIn);
      });
    },
    //底部支付组件全选事件
    checkPayDiv(data) {
      if (data.checked) {
        if (this.isMonthPay) {
          // 如果勾选上底部全选按钮，则所有账单都要勾选
          if (this.$refs.checkShop) {
            this.$refs.checkShop.filter((item, index) => {
              item.checked = true;
            });
          }
          if (this.$refs.checkboxGroup) {
            this.$refs.checkboxGroup.filter((item, index) => {
              item.checked = true;
            });
          }
        } else {
          data.forEach(item => {
            item.shopCheck = true;
            item.quarterList.forEach((items, index) => {
              this.checkTrue(items, index);
            });
          });
        }

        //直接拿全部账单号
        this.billNosList = this.results.billNos;

        //底部支付组件的合计金额等于整个房间或者车位的待缴纳的总金额
        this.mergeAmount = this.results.totalPayableAmount;
        console.log(`this.mergeAmount`, this.mergeAmount);
      } else {
        if (this.isMonthPay) {
          if (this.$refs.checkShop) {
            //如果取消勾选上底部全选按钮，则所有账单都要取消勾选
            this.$refs.checkShop.filter((item, index) => {
              item.checked = false;
            });
          }
          if (this.$refs.checkboxGroup) {
            this.$refs.checkboxGroup.filter((item, index) => {
              item.checked = false;
            });
          }
        } else {
          data.forEach(item => {
            item.shopCheck = false;
            item.quarterList.forEach((items, index) => {
              this.checkFalse(items, index);
            });
          });
        }

        //清空选中的账单号
        this.billNosList = [];
        this.checkData = new Set();
        this.$refs.payDiv.isShow = false; //隐藏全选按钮
        //如果不勾选全选，那么底部支付组件的合计金额就可以等于0,合计数量为0
        this.mergeAmount = 0;
        this.payTotal = 0;
      }
    },
    //返回上一级
    backEvent() {
      this.$router.go(-1);
    },
    navToPage() {
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
      this.finished = false;
      this.showFinishText = false;
      // 重新加载数据
      this.getBillDetail();
    },
    //切换账单类型
    onChangeBillType(type) {
      this.$refs.payDiv.isShow = false; //隐藏底部支付全选按钮
      this.isFinishBill = type ? true : false;
      this.isMonthPay = false; //是否为月度支付账单
      this.checkData = new Set();
      this.mergeAmount = 0; //合计选中的账单总金额
      this.payTotal = 0;
      this.results = [];
      this.currentPage = 0;
      this.showFinishText = false;
      this.loading = true;

      this.getBillDetail();
    },
    //合并支付
    mergePay() {
      let payInfoList = Array.from(this.checkData);
      let payData = payInfoList.filter(item => {
        return item.monthList;
      });
      console.log(`payData`, payData);
      let billNos = [];
      payData.forEach((item, index) => {
        item.billNos.forEach(data => {
          billNos.push(data);
        });
      });

      let billNosStr = _.join(billNos, ",");

      if (payInfoList.length == 0) {
        this.$toast("请选择账单");
      } else {
        let payStr = [];
        payData.forEach((item, index) => {
          // isPay=1：支付中；isPay=0：待支付
          payStr.push(item.isPay);
        });
        if (payStr.includes(1)) {
          //支付中的订单不能提交
          Dialog.alert({
            message:
              "尊敬的邻里邦用户，由于上次账单支付异常中断，为确保您的账户安全，请稍等10分钟后重新支付，感谢您的理解。",
            theme: "round-button"
          });
        } else {
          console.log(`提交账单中心参数`, {
            businessCstNo: this.$store.state.userInfo.phone,
            platMerCstNo: payData[0].platMerCstNo,
            tradeMerCstNo: payData[0].tradeMerCstNo,
            billNo: billNosStr,
            appScheme: "x-engine",
            payType: false
          });
          //请求账单中心发起支付
          yjzdbill.YJBillPayment({
            businessCstNo: this.$store.state.userInfo.phone,
            platMerCstNo: payData[0].platMerCstNo,
            tradeMerCstNo: payData[0].tradeMerCstNo,
            billNo: billNosStr,
            appScheme: "x-engine",
            payType: false,
            __ret__: res => {
              console.log(
                "---------------开始支付提交记录---------------------"
              );
              console.log(res);
              if (res.billRetStatus == "1") {
                //支付成功
                this.$router.push({ path: "/order/2?orderPage=false" }); //支付完成返回到待支付页面
              } else {
                this.payErrorInfo = res;
                Dialog.alert({
                  message: res.billRetStatusMessage
                    ? res.billRetStatusMessage
                    : "支付失败",
                  theme: "round-button"
                });
              }
            }
          });
        }
      }
    },

    //查看详情
    goToDetail(item, isFinishBill) {
      console.log(`goToDetail`, item);
      if (isFinishBill) {
        //完成的账单 - 跳到预缴余额的预缴详情页面
        let name = "账单详情"
        let tollDate = moment(item.payTime).format("YYYY-MM-DD");
        let path = `/advancePaymentDetails?type=1&amount=${item.realAmount}&objectName=${this.results.spaceFullName}&customerName=${item.proprietorName}&tollDate=${tollDate}
        &payWay=${item.payType}&tradeMerCstno=${item.tradeMerCstNo}&platMerCstno=${item.platMerCstNo}&projectName=${item.showInfo}&navTitleName=${name}`;

        navToMicroApplication.openTargetRouter({
          type: "microapp",
          uri: "com.times.microapp.AppcPrepay", // 微应用包名
          path: path, // 微应用具体路由
          hideNavbar: false
        });
      } else {
        //待支付
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
      min-height: 95px;
      .house-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 22px;
        padding: 16px 16px 10px 16px;
        min-height: 48px;
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
                  .pay-status {
                    &.finish {
                      color: #8D8D8D;
                    }
                    &.need {
                      color: #121212
                    }
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
