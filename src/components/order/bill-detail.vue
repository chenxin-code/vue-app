<!--
 * @Description: 这是账单明细页面
 * @Date: 2021-06-10 17:25:46
 * @Author: shuimei
 * @LastEditTime: 2021-08-16 14:08:51
-->
<template>
  <div class="bill-detail">
    <van-sticky :offset-top="offsetTop">
      <nav-top
        navLeftName="账单明细"
        navRightName="更多"
        :showPopoverTemp="true"
        @backEvent="backEvent"
      ></nav-top>
    </van-sticky>
    <div class="warpper">
      <div class="summary">
        <div class="house-title">{{ this.$route.query.houseName }}</div>
        <div class="pay-total">
          <div class="text">待缴纳总金额：</div>
          <div class="money" v-if="!isShowNumLoading">
            <span class="currency-symbol">￥</span>{{ totalPayableAmount }}
          </div>
          <div class="money" v-if="isShowNumLoading">
            <van-loading size="20" />
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
                :disabled="isDisabled"
              />
            </van-dropdown-menu>
          </div>
        </div>
        <div class="desc" v-if="this.results.managementFeeCycle === '1'">
          按月度缴费
        </div>
        <div class="desc" v-if="this.results.managementFeeCycle === '3'">
          按季度缴费
        </div>

        <div
          class="content"
          :class="[
            showEmpty ? 'empty' : '',
            !isFinishBill && !showEmpty ? 'not-pay-bill' : ''
          ]"
        >
          <!-- <van-pull-refresh
            v-model="isLoading"
            @refresh="onRefresh"
            class="refresh-page"
          > -->
          <van-list
            class="tab-list-box"
            :class="[
              showEmpty ? 'empty' : '',
              !isFinishBill && !showEmpty ? 'not-pay-bill' : ''
            ]"
            v-model="loading"
            :finished="finished"
            :finished-text="showFinishText ? '- 亲, 没有更多账单了 -' : ''"
            :immediate-check="false"
            :offset="10"
            @load="getBillDetail"
          >
            <div
              class="list"
              v-for="(item, index) in results.records"
              :key="index"
            >
              <div v-show="!isFinishBill">
                <van-checkbox
                  v-show="!isMonthPay"
                  :name="index"
                  v-model="item.shopCheck"
                  @click="checkShop(item, index, isMonthPay)"
                  checked-color="#E5165A"
                  ref="checkShop"
                  >{{ item.quarterTitle }}</van-checkbox
                >
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
                    checked-color="#E5165A"
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
              v-if="showEmpty && loaded"
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
      v-show="isShowPayDiv"
    ></pay-div>

    <div class="tanc-box" v-if="showErrorMsg">
      <div class="content">
        <div class="bg-box"></div>
        <div class="message-box">{{ errorMsg }}</div>
        <div class="btn-box" @click="closeTanC">确认</div>
      </div>
      <div class="close-btn" @click="closeTanC"></div>
    </div>
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
      isShowNumLoading: true,
      isShowPayDiv: false,
      totalPayableAmount: 0,
      checkPcs: false,
      errorMsg: "",
      showErrorMsg: false,
      isDisabled: true,
      loaded: false
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
      //已完成
      this.isFinishBill = true;
      this.billValue = 1;
    } else {
      //待支付
      this.isFinishBill = false;
      this.billValue = 0;
      this.isShowPayDiv = true;
    }
    this.getBillDetail();
  },
  activated() {},
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
      this.loaded = false;
      this.showEmpty = false;
      this.loading = true;
      if (this.isFinishBill) {
        this.showFinishText = false;
        this.finished = false;
        this.currentPage++;
      }

      let propertyObj = {
        airDefenseNo: this.$route.query.airDefenseNo,
        memberId: this.$store.state.userInfo.phone
          ? this.$store.state.userInfo.phone
          : "",
        status: this.isFinishBill ? 90 : 10, //账单状态 10-待支付 90-成功
        type: 2, //type 1、列表 2、详情
        pageNo: !this.isFinishBill ? 1 : this.currentPage,
        pageTimes: this.isFinishBill
          ? this.pageTimes
            ? this.pageTimes
            : ""
          : ""
      };

      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://m-center-uat-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");

      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            if (!this.isFinishBill) {
              //待支付
              if (data.notpay.length && data.notpay[0].records.length) {
                this.results = data.notpay[0];
                this.totalPayableAmount = this.results.totalPayableAmount;
                this.finished = true;
                this.showFinishText = true;
                this.isShowPayDiv = true;
              } else {
                this.results = [];
                this.isShowPayDiv = false; //不显示支付支付组件
              }
            } else {
              this.isShowPayDiv = false;
              this.totalPayableAmount = "0.00"; //已完成待缴金额为0
              //已完成
              if (data.finish.length && data.finish[0].records.length) {
                if (this.currentPage === 1) {
                  this.results = data.finish[0];
                  this.pageTimes = this.results.pageTimes;

                  //如果年份只有一个，则不再第二次请求了
                  if (_.split(this.pageTimes, ",").length === 1) {
                    this.finished = true;
                    this.showFinishText = true;
                  }
                } else {
                  let pageLength = this.pageTimes
                    ? _.split(this.pageTimes, ",").length
                    : 0;
                  if (
                    (pageLength && pageLength === this.currentPage) ||
                    pageLength === 1
                  ) {
                    if (pageLength !== 1) {
                      let list = data.finish[0].records;
                      let re = this.results.records.concat(list);
                      this.results.records = re;
                    }

                    this.finished = true;
                    this.showFinishText = true;
                  } else {
                    let list = data.finish[0].records;
                    let re = this.results.records.concat(list);
                    this.results.records = re;
                    this.finished = false;
                  }
                }
              } else {
                //某些年份没有数据时的处理逻辑
                if (this.currentPage === 1) {
                  this.results = [];
                } else {
                  let list = data.finish[0].records;
                  let re = this.results.records.concat(list);
                  this.results.records = re;
                  if (_.split(this.pageTimes, ",").length == this.currentPage) {
                    this.finished = true;
                    this.showFinishText = true;
                  }
                }
              }
            }
            this.loading = false; //清除loading
            this.isDisabled = false;
            this.isLoading = false;
            if (this.results.length === 0) {
              this.showEmpty = true;
              this.finished = true;
              this.showFinishText = false;
            } else {
              this.showEmpty = false;
              this.isMonthPay =
                this.results.managementFeeCycle == "1" ? true : false; //1为月度账单，3为季度账单
            }
            console.log(`请求了`);
            this.isShowNumLoading = false;
          } else {
            this.results = [];
            // this.showEmpty = true;
            Toast({ duration: 500, message: res.data.message }); //提示错误信息
          }
          this.$forceUpdate();
        })
        .finally(() => {
          this.loaded = true;
        });
    },
    //点击选中整个季度账单
    checkShop(item, index, type) {
      item.shopCheck ? this.shopTrue(item) : this.shopFalse(item);
    },
    //点击单个商品
    checkSingle(item, itemIn) {
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
      this.$refs.payDiv.isShow = false; //隐藏底部支付全选按钮
      this.$refs.payDiv.isChecked = false; //取消勾选全选按钮
      this.checkData = new Set();
      this.mergeAmount = 0; //合计选中的账单总金额
      this.payTotal = 0;
      this.results = [];
      this.showFinishText = false;
      this.loading = true;
      this.isLoading = false;
      this.loaded = false;
      this.isDisabled = true;
      this.finished = false;
      this.isShowNumLoading = true;
      this.currentPage = 0;
      this.isShowPayDiv = false;
      this.pageTimes = "";

      // 重新加载数据
      this.getBillDetail();
    },
    //切换下拉账单类型
    onChangeBillType(type) {
      this.$refs.payDiv.isShow = false; //隐藏底部支付全选按钮
      this.isFinishBill = type ? true : false;
      this.isMonthPay = false; //是否为月度支付账单
      this.checkData = new Set();
      this.mergeAmount = 0; //合计选中的账单总金额
      this.payTotal = 0;
      this.results = [];
      this.showFinishText = false;
      this.loading = true;
      this.isDisabled = true;
      this.finished = false;
      this.loaded = false;
      this.showEmpty = false;
      this.isShowNumLoading = true;
      this.currentPage = 0;
      this.isShowPayDiv = false;
      this.checkPcs = false;

      this.getBillDetail();
    },
    //合并支付
    mergePay() {
      this.toast(); //开启页面loading
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
        Toast.clear(); //关闭页面loading
        this.$toast("请选择账单");
      } else {
        let billNoList = [];
        payData.forEach((payItem, index) => {
          payItem.billNos.forEach(it => {
            billNoList.push(it.toString());
          });
        });

        //请求物业系统接口校验账单是否能够支付
        let checkStatus = [];
        let pcsUrl = "";
        this.$store.state.environment == "development"
          ? (pcsUrl =
              "http://times-pcs.linli580.com.cn:8888/pcs/bill-center/check-bill")
          : (pcsUrl =
              "https://times-pms.linli580.com/pcs/bill-center/check-bill");
        let pcsObj = {
          list: billNoList
        };
        this.$http
          .post(pcsUrl, JSON.stringify(pcsObj))
          .then(res => {
            if (res.data.code == "0000") {
              let arr = res.data.data;
              for (let index = 0; index < arr.length; index++) {
                if (arr[index].status == 1 || arr[index].status == 2) {
                  checkStatus.push(arr[index].status);
                }
              }
              console.log(`详情页checkStatus`, checkStatus);

              if (_.uniq(checkStatus).includes(2)) {
                Toast.clear(); //关闭页面loading
                this.showErrorMsg = true;
                this.errorMsg =
                  "尊敬的邻里邦用户，该账单不存在，请重新刷新页面，获取最新账单。";
              } else if (_.uniq(checkStatus).includes(1)) {
                Toast.clear(); //关闭页面loading
                this.showErrorMsg = true;
                this.errorMsg =
                  "尊敬的邻里邦用户，该账单信息已经更新，请重新刷新页面，获取最新账单。";
              } else {
                let payStr = [];
                payData.forEach((item, index) => {
                  // isPay=1：支付中；isPay=0：待支付
                  payStr.push(item.isPay);
                });
                console.log(`是否支付中账单`, payStr);
                if (payStr.includes(1)) {
                  Toast.clear(); //关闭页面loading
                  this.showErrorMsg = true;
                  this.errorMsg =
                    "尊敬的邻里邦用户，由于上次账单支付异常中断，为确保您的账户安全，请稍等10分钟后重新支付，感谢您的理解。";
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
                        Toast.clear(); //关闭页面loading
                        //支付成功
                        this.$router.push({ path: "/order/2?orderPage=false" }); //支付完成返回到待支付页面
                      } else {
                        Toast.clear(); //关闭页面loading
                        this.showErrorMsg = true;
                        this.errorMsg = res.billRetStatusMessage
                          ? res.billRetStatusMessage
                          : "支付失败";
                      }
                    }
                  });
                }
              }
            }
          })
          .catch(() => {
            console.log(`catch提交账单中心参数`, {
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
                  "---------------catch开始支付提交记录---------------------"
                );
                console.log(res);
                if (res.billRetStatus == "1") {
                  Toast.clear(); //关闭页面loading
                  //支付成功
                  this.$router.push({ path: "/order/2?orderPage=false" }); //支付完成返回到待支付页面
                } else {
                  Toast.clear(); //关闭页面loading
                  this.showErrorMsg = true;
                  this.errorMsg = res.billRetStatusMessage
                    ? res.billRetStatusMessage
                    : "支付失败";
                }
              }
            });
          });
      }
    },
    //查看详情
    goToDetail(item, isFinishBill) {
      console.log(`goToDetail`, item);
      if (isFinishBill) {
        //完成的账单 - 跳到预缴余额的预缴详情页面
        let name = "账单详情";
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
            showInfo: item.showInfo, //商品说明 --- 收费项目
            showInfoExt: item.showInfoExt,
            proprietorName: item.proprietorName, //业主名称
            payableAmount: item.payableAmount, //应收金额
            realAmount: item.realAmount, //实付金额
            platMerCstNo: item.platMerCstNo, //商户单号
            tradeMerCstNo: item.tradeMerCstNo, //交易单号
            airDefenseNo: item.airDefenseNo,
            status: item.status, // 账单状态 10待支付， 60-支付中，70-交易失败，80-交易关闭，90-支付成功，100-已撤销"
            recStartTime: item.businessParams.recStartTime, //收费周期-开始时间 -------费用所属时段
            recEndTime: item.businessParams.recEndTime, //收费周期-结束时间 ----费用所属时段
            chargeYear: item.businessParams.chargeYear, //缴纳月份 --- 费用所属年月
            billNo: item.billNo, //账单编号
            price: item.businessParams.standard
              ? item.businessParams.standard.price
              : "", //单价
            unit: item.businessParams.standard
              ? item.businessParams.standard.unit
              : "" //单位
          }
        });
      }
    },
    //关闭弹窗
    closeTanC() {
      this.showErrorMsg = false;
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

$title-color = #E5165A;
$color = #8D8D8D;

.bill-detail {
  .warpper {
    height: 100%;
    margin-top: 88px;
    .summary {
      background-image: url('./img/bill-detail-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      box-shadow: 0px 16px 25px -11px #fa5b6c;
      margin: 10px 11px;
      border-radius: 12px;
      min-height: 95px;
      background-color: #fb568c

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
          margin-right: 10px;
        }

        .text {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
          margin-left: 11px;

          span::after {
            content: '';
            height: 10px;
            width: 40%;
            background: linear-gradient(270deg, #FFFFFF 0%, $title-color 500%);
            border-radius: 5px;
            position: absolute;
            z-index: -1;
            left: 0;
            margin-top: 12px;
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
                border-bottom: 1px solid #EEEEEE;
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

      .desc {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $color;
        line-height: 18px;
        margin-left: 36px;
        margin-top: 5px;
      }

      .content {
        margin-top: 15px;
        // padding-bottom: 320px;
        background: #F9F9F9;
        border-radius: 12px;
        overflow-y: scroll;
        height: 100%;

        &.empty {
          padding-bottom: 0;
        }

        &.not-pay-bill {
          // padding-bottom: 400px;
        }

        .refresh-page {
          min-height: 100%;

          .tab-list-box {
            max-height: 100vh;
            width: 100%;
            overflow-y: scroll;
            padding-bottom: 320px;

            &.empty {
              padding-bottom: 0;
            }

            &.not-pay-bill {
              padding-bottom: 400px;
            }
          }
        }

        &.not-pay-bill {
          // padding-bottom: 400px;
        }

        .refresh-page {
          min-height: 100%;

          .tab-list-box {
            max-height: 100vh;
            width: 100%;
            overflow-y: scroll;
            padding-bottom: 320px;

            &.empty {
              padding-bottom: 0;
            }

            &.not-pay-bill {
              padding-bottom: 400px;
            }
          }
        }
        .tab-list-box {
          max-height: 100vh;
          width: 100%;
          overflow-y: scroll;
          padding-bottom: 320px;

          &.empty {
            padding-bottom: 0;
          }

          &.not-pay-bill {
            padding-bottom: 400px;
          }
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
              width: 100%;
              background: #FFFFFF;
              border-radius: 12px;
              margin-left: 7px;
              padding-bottom: 16px;
              box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04);

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
                    color: $title-color;
                    line-height: 33px;
                  }

                  .num {
                    font-size: 24px;

                    &::after {
                      content: '';
                      height: 10px;
                      width: 26%;
                      background: linear-gradient(270deg, #FFFFFF 0%, $title-color 400%);
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
                    color: $title-color;
                    line-height: 20px;
                  }

                  .pay-status {
                    &.finish {
                      color: $color;
                    }

                    &.need {
                      color: #121212;
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
                  color: $color;
                  line-height: 26px;
                }

                i {
                  background-image: url('./img/check-bill-icon.png');
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

  .tanc-box {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 51;
    background-color: rgba(18, 18, 18, 0.8);

    .content {
      height: auto;
      width: calc(100% - 84px);
      margin-left: 42px;
      margin-top: 50%;
      background-color: #ffff;
      border-radius: 16px;
      min-height: 215px;
      padding-bottom: 1px;
      text-align: center;

      .bg-box {
        width: 100%;
        height: 70px;
        background-image: url('./img/tanc-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .message-box {
        margin-top: 22px;
        padding: 0 20px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
      }

      .btn-box {
        // width: 100%;
        height: 38px;
        // background: linear-gradient(270deg, #F96B7B 0%, #EF2D30 100%);
        background: linear-gradient(270deg, #E5165A 0%, #FF6094 100%);
        border-radius: 8px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 38px;
        padding: 0 20px;
        text-align: center;
        margin: 28px 20px;
      }
    }

    .close-btn {
      width: 34px;
      height: 34px;
      background-image: url('./img/close-icon.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-top: 30px;
      margin-left: calc(50% - 17px);
    }
  }
}
</style>
