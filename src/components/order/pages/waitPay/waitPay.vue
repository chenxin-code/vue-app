<template>
  <div
    class="waitPay"
    :class="{
      'wait-pay-x': this.$util.getIsIphoneX_X(),
      'empty-page': showEmpty
    }"
  >
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="refresh-page"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="showEmpty ? '' : '- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        :error-text="errorText"
        :immediate-check="false"
        offset="10"
      >
        <property-bill
          v-show="isLoadPropertyBill"
          pageName="waitPay"
          ref="propertyOrder"
          :isDisAll="isDisAll"
          :isDis="isDis"
          :results="billResults"
          @checkEvent="checkEvent"
        >
          <div v-for="(item, index) in billResults" :key="index" class="scroll">
            <OrderItem2
              @checkEvent="checkEvent"
              ref="order"
              pageName="waitPay"
              :billId="item.billId"
              :billType="item.billType"
              :item="item"
            >
            </OrderItem2>
          </div>
        </property-bill>
        <div
          v-for="(item, index) in currentOrderList"
          :key="item.id + '_' + index"
          class="scroll"
        >
          <OrderItem
            pageType="waitPay"
            :billType="item.billType"
            :dataList="item.dataList"
            :amount="item.amount"
            :submitTime="item.submitTime"
            @checkEvent="checkEvent"
            ref="order"
            :type="item.billType"
            :orderType="item.orderType"
            :payInfo="item.payInfo"
            :params="item.params"
            :orderItem="item"
            :billId="item.billId"
            :billDetailObj="item.billDetailObj"
            :orderStateType="item.orderStateType"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
            :tag="1"
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty"></Empty>
      </van-list>
    </van-pull-refresh>
    <pay-div
      ref="payDiv"
      :checkData="checkData"
      @checkEvent="checkEvent"
      @mergePay="mergePay"
      :mergeAmount="mergeAmount"
      :total="Array.from(this.checkData).length"
    ></pay-div>
    <div class="tanc-message-box" v-if="isShowErrorMsg">
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
import propertyBill from "@/components/order/components/bill-item/bill-item";
import payDiv from "@/components/order/components/pay-div/pay-div";
import OrderItem from "@/components/order/components/order-item/order-item";
import OrderItem2 from "@/components/order/components/order-item2/order-item";
import Empty from "../../components/empty/empty.vue";
import { BigNumber } from "bignumber.js";
import yjzdbill from "@zkty-team/x-engine-module-yjzdbill";
import { Dialog } from "vant";
import _ from "lodash";
import { Toast } from "vant";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
export default {
  name: "waitPay",

  data() {
    return {
      userRoomId: "",
      showDialog: false,
      tipsText: "",
      check: false,
      checkData: new Set(),
      show: false,
      loading: false,
      finished: false,
      error: false,
      errorText: "请求失败，点击重新加载",
      properWorng: false,
      refreshing: false,
      refresh: false,
      orderList: [],
      currentPage: 1,
      totalPage: 0,
      page: 0,
      showEmpty: false,
      currentOrderList: [],
      params: [],
      mergeAmount: 0,
      total: 0,
      pageSize: 5,
      isLoadPropertyBill: false, //是否加载物业缴费账单组件
      isDisAll: false,
      isDis: false,
      isLoad: true,
      billResults: [], //物业缴费数据
      /**
       * 1-物业收费账单
       * 2-月保续费账单
       * 3-停车费账单
       * 4-临时收费账单
       * 5-零售
       * 6-预缴费
       * 7-旅游
       * 8-家政
       * 9-拎包
       * 10-押金
       * 11-新零售
       * 12-美居
       * 13-服务商城
       * 14-维修服务费
       * 15-租售
       */
      reqBillType: "2,3,4,5,6,7,8,9,10,11,13,14",
      isShowErrorMsg: false,
      errorMsg: "",
      finishBillList: []
    };
  },
  components: {
    propertyBill,
    payDiv,
    OrderItem,
    OrderItem2,
    Empty
  },
  created() {
    this.getRoomId();
  },
  mounted() {
    this.onLoad();
  },
  activated() {},
  methods: {
    //获取原生人房
    getRoomId() {
      appLocalstorage
        .get({ key: "LLBUserRoomId", isPublic: true })
        .then(res => {
          if (res.hasOwnProperty("result")) {
            this.userRoomId = res.result;
            console.log(`获取原生人房`, res);
          } else {
            this.userRoomId = "";
          }
        });
    },
    //合并支付
    mergePay() {
      let payInfoList = Array.from(this.checkData);
      let billNo = "";
      let callbackUrl = "";
      console.log("payInfoList", payInfoList);
      let payType = "";
      let projectList = [];
      payInfoList.forEach(e => {
        if (e.billType == 1) {
          payType = "property";
          projectList.push(e.projectId.toString());
        } else {
          payType = "other";
        }
      });
      if (payType == "property") {
        this.toast(); //开启页面loading
        //处理物业账单支付
        let billNo = "";
        let billList = [];
        if (projectList.length > 1) {
          if (!projectList.every(e => e === projectList[0])) {
            Toast.clear(); //关闭页面loading
            this.isShowErrorMsg = true;
            this.errorMsg =
              "尊敬的邻里邦用户，目前仅支持本楼盘的账单支付，其他楼盘账单需切换楼盘进行缴纳，感谢您的理解。";
            //动态修改van-sticky样式，让弹窗铺满整个屏幕
            this.$nextTick(() => {
              this.$parent.$refs.stickyIndex.$el.style.position = "relative";
              this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
            });
            return;
          } else {
            payInfoList.forEach(e => {
              e.billNos.forEach(i => {
                billNo += i + ",";
                billList.push(i.toString());
              });
            });
          }
        } else {
          payInfoList[0].billNos.forEach(e => {
            billNo += e + ",";
            billList.push(e.toString());
          });
        }
        let payInfo = {
          businessCstNo: this.$store.state.userInfo.phone,
          platMerCstNo: payInfoList[0].platMerCstNo,
          tradeMerCstNo: payInfoList[0].tradeMerCstNo
        };
        this.checkedPayStatus(billList, payInfo, billNo, payInfoList);
      } else {
        // 其他账单支付
        if (payInfoList.length == 0) {
          this.$toast("请选择订单");
        } else if (
          payInfoList.length == 1 &&
          payInfoList[0].billType == 11 &&
          payInfoList[0].orderType !== "200001"
        ) {
          billNo = payInfoList[0].payInfo.billNo;
          //团购订单
          callbackUrl = `/app-vue/app/index.html#/group_detail?orderId=${payInfoList[0].billDetailObj.groupBuyId}&mktGroupBuyId=${payInfoList[0].billDetailObj.groupBuyActivityId}&formPaySuccess='1'&ret={ret}`;
          this.enginePay(payInfoList[0].payInfo, billNo, callbackUrl);
        } else if (payInfoList[0].billType == 11) {
          //普通订单
          this.initPayinfo(payInfoList, billNo, "mall");
          console.log("payInfoList", payInfoList);
        } else {
          this.initPayinfo(payInfoList, billNo, "bill");
        }
      }
    },
    initPayinfo(payInfoList, billNo, type) {
      let callbackUrl = "";
      let currentOrderDetails = {
        state: 3,
        orderId: payInfoList[0].orderId,
        orderType: payInfoList[0].orderType,
        // tradeNo: payInfoList[0].payInfo.tradeNo,
        tradeNo: payInfoList[0].payInfo ? payInfoList[0].payInfo.tradeNo : "", //shuimei
        tag: 1,
        // deliverCheckcode: payInfoList[0].payInfo.deliverCheckcode,
        deliverCheckcode: payInfoList[0].payInfo
          ? payInfoList[0].payInfo.deliverCheckcode
          : "", //shuimei
        deviceCode: this.$route.query.deviceCode, //正常流程支付也为空 待保留
        storeOuCode: this.$route.query.storeOuCode, //正常流程支付也为空 待保留
        stationName: this.$route.query.stationName //正常流程支付也为空 待保留
      };
      localStorage.setItem(
        "currentOrderDetails",
        JSON.stringify(currentOrderDetails)
      );
      payInfoList.forEach(e => {
        billNo += e.payInfo.billNo + ",";
      });
      //vipUnitUserCode type  为空  待保留
      if (type == "mall") {
        callbackUrl = `/app-vue/app/index.html#/mall2/paysuccess?selectedIndex=1&isBill=${
          payInfoList[0].billType != 11 ? true : false
        }&orderCategory=${
          payInfoList[0].payInfo.orderCategory
        }&vipUnitUserCode=${this.$route.query.vipUnitUserCode}&type=${
          this.$route.query.type
        }&ret={ret}`;
      } else {
        callbackUrl = `/app-vue/app/index.html#/order/2?time=${Date.now()}`;
      }
      this.enginePay(payInfoList[0].payInfo, billNo, callbackUrl);
    },
    enginePay(payInfo, billNo, callbackUrl) {
      console.log("唤起邻里邦支付平台billNo", payInfo, billNo, callbackUrl);
      window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
        JSON.stringify({
          businessCstNo: payInfo.businessCstNo,
          platMerCstNo: payInfo.platMerCstNo,
          tradeMerCstNo: payInfo.tradeMerCstNo,
          billNo: billNo,
          appScheme: "x-engine-c",
          payType: false
        })
      )}&callback=${encodeURIComponent(location.origin + callbackUrl)}`;
    },

    //获取物业账单列表
    propertyFn() {
      let airDefenseNoStr = this.userRoomId
        ? this.userRoomId
        : this.$store.state.userRoomId;
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","
      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone
          ? this.$store.state.userInfo.phone
          : "",
        status: 10, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageNo: "",
        pageTimes: ""
      };
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://m-center-uat-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      return new Promise((resolve, reject) => {
        this.$http.get(url, { params: propertyObj }).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    },
    //获取电商订单列表
    orderFn() {
      //这里是帮租售在uat加15类型测试的，不上生产环境
      if (this.$store.state.environment == "development") {
        this.reqBillType = "2,3,4,5,6,7,8,9,10,11,13,14,15";
      }
      let obj1 = {
        orderType: "200015",
        orderTypeList: ["200015", "200502"],
        state: "1",
        page: { index: this.currentPage, pageSize: this.pageSize },
        airDefenseNo: this.userRoomId
          ? this.userRoomId
          : this.$store.state.userRoomId,
        billType: this.reqBillType
      };
      return new Promise((resolve, reject) => {
        this.$http
          .post("/app/json/app_shopping_order/findOrderFormList", obj1)
          .then(
            res => {
              resolve(res);
            },
            err => {
              reject(err);
            }
          );
      });
    },
    onLoad() {
      this.loading = true;
      let orderError = false;
      let propertyError = false;
      let promiseArr = "";

      if (this.currentPage > 1 && !this.properWorng) {
        //如果当前页数大于1，那么说明是下滑分页的操作，因为物业账单没有分页，所以此时只需要请求电商订单的接口就好，不需要再请求物业账单接口了
        promiseArr = [this.orderFn()];
      } else {
        promiseArr = [this.propertyFn(), this.orderFn()];
      }

      Promise.allSettled(promiseArr)
        .then(res => {
          let propertyRes = "";
          let orderRes = "";
          if (res.length == 2) {
            //如果是初始化或者是下拉刷新，会请求两个接口，此时res的长度就是2。所以物业账单和电商订单都要根据对应下标拿数据
            propertyRes = res[0];
            orderRes = res[1];
          } else {
            propertyRes = "";
            orderRes = res[0];
          }

          //这里是物业账单接口返回的数据处理逻辑
          if (propertyRes && propertyRes.status === "fulfilled") {
            let results = propertyRes.value.data;
            //接口发送请求成功
            if (results.code === 200) {
              this.billResults = results.data.notpay;
              this.finishBillList = results.data.finish;
              this.billResults.forEach((item, index) => {
                item.totalPrice = item.totalPayableAmount;
                item.billId = item.spaceId;
                item.id = Date.now() + index;
                item.billType = 1;
              });
            } else {
              this.billResults = [];
              this.loading = false;
              this.error = true;
              propertyError = true;
              this.properWorng = true;
            }

            // if (this.billResults.length) {
            //   this.isLoadPropertyBill = true;
            // } else {
            //   //如果没有物业账单数据，则不显示物业账单标题
            //   this.isLoadPropertyBill = false;
            // }
          } else {
            if (propertyRes) {
              this.loading = false;
              this.error = true;
              propertyError = true;
              this.properWorng = true;
            } else {
              this.loading = false;
              //如果propertyRes为空，则说明是翻页操作，此时error要为false，否则会提示物业账单错误信息
              this.error = false;
              propertyError = false;
              this.properWorng = false;
            }
          }

          //这里是电商订单接口返回的数据处理逻辑
          if (orderRes && orderRes.status === "fulfilled") {
            let orderResult = orderRes.value.data;
            let { data } = orderResult;
            // 判断当前页数是否超过总页数或者等于总页数
            let dataPages = 0;
            if (data.pages == 0) {
              dataPages = 1;
            } else {
              dataPages = data.pages;
            }

            if (this.currentPage <= dataPages) {
              //如果当前页数等于接口返回的页数，那么finished为true，否则会一直加载接口
              if (data.pages == this.currentPage) {
                this.finished = true;
              }
              if (orderResult.status == 0) {
                var indexList = data.records; //将请求到的内容赋值给一个变量
                this.orderList =
                  this.currentPage == 1
                    ? indexList
                    : this.orderList.concat(indexList);
                this.page = data.pages; //将总页数赋值给this
                if (this.orderList.length !== 0) {
                  this.initData();
                } else {
                  this.currentOrderList = [];
                  this.finished = true;
                }
                // 加载状态结束
                this.loading = false;
              } else {
                // 加载状态结束
                this.loading = false; //将加载状态关掉
                this.error = true; //大家错误状态
              }
              this.currentPage++;
            } else {
              this.finished = true; //如果超过总页数就显示没有更多内容了
            }
          } else {
            this.loading = false; // 加载状态结束
            this.error = true;
            orderError = true;
          }

          if (propertyError && orderError) {
            this.finished = false;
            this.errorText = "物业账单和订单请求失败，点击重新加载";
            this.$toast("物业账单和订单请求失败，点击重新加载");
            this.isLoadPropertyBill = false;
          } else if (propertyError && !orderError) {
            this.finished = false;
            this.errorText = "物业账单请求失败，点击重新加载";
            this.$toast("物业账单请求失败，点击重新加载");
            this.isLoadPropertyBill = false;
          } else if (!propertyError && orderError) {
            this.finished = false;
            this.errorText = "订单请求失败，点击重新加载";
            this.$toast("订单请求失败，点击重新加载");
            this.isLoadPropertyBill = true;
          } else {
            //人房为空（游客）,隐藏物业缴费组件。应显示empty空页面
            if (
              this.userRoomId == "" &&
              this.billResults.length == 0 &&
              this.finishBillList.length == 0
            ) {
              this.isLoadPropertyBill = false;
            } else {
              this.isLoadPropertyBill = true;
            }

            if (this.$store.state.environment == "development") {
              this.isLoadPropertyBill = true; //本地测试
            }
          }

          //如果物业账单列表和电商订单列表都为空,人房id为空（游客）,并且请求不出错的情况下，则显示空状态
          if (
            this.billResults.length === 0 &&
            this.currentOrderList.length === 0 &&
            !this.error &&
            this.userRoomId == "" &&
            this.finishBillList.length === 0
          ) {
            this.showEmpty = true;
          } else {
            this.showEmpty = false;
          }

          //判断是否为下拉刷新操作，如果是，刷新成功后要将状态关掉
          if (this.refresh && !this.error) {
            this.$toast("刷新成功");
            this.refreshing = false;
          }
        })
        .catch(err => {
          // this.$toast("请求失败，请稍后重试");
          console.log(`onload catch`, err);
        });
    },

    // 下拉刷新时触发
    onRefresh() {
      this.isLoadPropertyBill = false;
      this.checkData = new Set();
      this.mergeAmount = 0; //合计选中的账单总金额
      this.billResults = []; //清空物业账单数据
      this.finishBillList = [];
      this.currentOrderList = []; //清空订单数据
      this.$refs.payDiv.isChecked = false; //取消勾选全选按钮
      this.$refs.payDiv.isShow = false; // 隐藏全选按钮
      if (this.$refs.propertyOrder) {
        this.$refs.propertyOrder.$children[0].checked = false;
        this.$refs.propertyOrder.isDisabled = false;
      }

      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.currentPage = 1;
      this.finished = false; //将没有更多的状态改成false
      // this.refreshing = true;
      this.refreshing = false;
      this.refresh = true;
      this.onLoad();
    },
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          tag: "1",
          amount: item.totalPrice,
          submitTime: item.submitTime,
          orderId: item.shoppingOrderId,
          state: item.state,
          totalPrice: item.totalPrice,
          orderStateType: item.orderStateType,
          billId: item.billId,
          shoppingOrderId: item.shoppingOrderId,
          bulkOrderType: item.orderType,
          id: item.id,
          tradeNo: item.tradeNo,
          orderState: item.orderStateType,
          orderType: item.orderType, //订单类型
          shopOrderNo: item.orderFormItemList[0]
            ? item.orderFormItemList[0].storeOuCode
            : "",
          payInfo: {
            businessCstNo: item.loginUserPhone,
            platMerCstNo: item.platMerCstNo,
            tradeMerCstNo: item.tradeMerCstNo,
            billNo: item.billNo,
            orderId: item.id,
            orderCategory: item.orderCategory,
            orderType: item.orderStateType,
            tradeNo: item.tradeNo,
            deliverCheckcode: item.deliverCheckcode,
            isRefund: item.isRefund
          },
          params: {
            deliverType: item.deliverType,
            orderId: item.shoppingOrderId,
            orderType: item.orderType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state
          },
          billDetailObj: {
            businessCstNo: item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: "1",
            tabIndex: 2,
            awardActivityList: item.awardActivityList,
            isRefund: item.isRefund
          },
          dataList: item.orderFormItemList.map(sub => {
            return {
              billType: item.billType,
              tag: "1",
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              storeOuCode: sub.storeOuCode,
              info: sub.info,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime,
              tradeNo: item.tradeNo,
              orderState: item.orderStateType,
              orderType: item.orderType, //订单类型
              shopOrderNo: sub.storeOuCode,
              tradeNo: item.tradeNo
            };
          })
        };
      });
    },
    checkEvent(data) {
      if (data.billType == 13) {
        /*去服务商城详情页*/
        let token = this.$store.state.ythToken
          ? this.$store.state.ythToken
          : localStorage.getItem("ythToken");
        let path = process.env.VUE_APP_TMASS_APP + "/order/detailPage?";
        let query = `orderState=${data.orderState}&tradeNo=${data.tradeNo}&orderType=${data.orderType}&shopOrderNo=${data.shopOrderNo}&tabShow=true&Authorization=${token}`;
        location.href = path + query;
      } else {
        // 从全选checkbox进来
        if (data.checkAll || data.checkAllBillType1) {
          let refs = this.$refs.order.filter(item => {
            // 找出全选的类型并保存起来
            return item.billType == data.billType;
          });
          console.log(refs);
          let currentOrderList = [];
          if (refs[0] && refs[0].billType == 1) {
            currentOrderList = this.billResults;
          } else {
            currentOrderList = this.currentOrderList;
          }
          console.log(this.currentOrderList, "++++");
          console.log(this.billResults, "----");
          let checkData = currentOrderList.filter(item => {
            return item.billType == data.billType;
          });
          console.log(checkData + "----------");

          if (data.checked) {
            //全部选中
            this.checkData.clear(); //清空checkData
            refs.forEach((item, index) => {
              //保存选中数据并设置每个checkbox选中状态
              this.checkData.add(checkData[index]);
              item.isChecked = true;
            });
            if (refs[0] && refs[0].billType == 1) {
              this.$refs.propertyOrder.isChecked = true;
            }
          } else {
            // 全部取消
            this.checkData.clear(); //清空checkData
            refs.forEach(item => {
              item.isChecked = false; // 设置每个checkbox为没选中状态
            });
            this.$refs.payDiv.isShow = false; //隐藏全选按钮
            this.$refs.propertyOrder.isChecked = false;
          }
          return;
        }
        // 选中或取消当个checkbox
        let refs = this.$refs.order.filter(item => {
          // 找到不能选的checkbox
          return item.billType != data.billType;
        });
        refs.forEach(item => {
          // 并设置不能选择属性
          if (item.billType != data.billType) {
            item.isDisabled = true;
          }
        });
        if (data.billType != 1) {
          this.$refs.propertyOrder.isDisabled = true;
        }

        let checkedTotal = this.$refs.order.length - refs.length; // 计算出所有可以选的checkbox

        if (data.checked) {
          // 选中
          this.checkData.add(data);
          this.$refs.payDiv.billType = data.billType;
          this.$refs.payDiv.isShow = true; // 显示全选按钮
          if (this.checkData.size == checkedTotal) {
            //checkData数量跟可选checkbox数量相等 =>全选
            this.$refs.payDiv.isChecked = true; // 全选按钮变成选中
            if (data.billType == 1) {
              this.$refs.propertyOrder.isChecked = true;
            }
          } else {
            this.$refs.payDiv.isChecked = false; // 全选按钮变成没选中
            if (data.billType == 1) {
              this.$refs.propertyOrder.isChecked = false;
            }
          }
        } else {
          // 取消
          this.checkData.forEach(item => {
            if (data.billType == 1) {
              if (item.id == data.id) {
                this.checkData.delete(item); // 删除数据中取消选中的数据
                this.$refs.payDiv.isChecked = false; // 没有全选，所以全选checkbox变成没选中
                this.$refs.propertyOrder.isChecked = false;
                this.$refs.propertyOrder.isDisabled = false;
              }
            } else {
              if (item.billId == data.billId) {
                this.checkData.delete(item); // 删除数据中取消选中的数据
                this.$refs.payDiv.isChecked = false; // 没有全选，所以全选checkbox变成没选中
              }
            }
          });
          if (this.checkData.size == 0) {
            // 个数为0，全部取消选中
            this.$refs.order.forEach(item => {
              item.isDisabled = false; // 所有checkbox变成可选
            });
            this.$refs.propertyOrder.isDisabled = false;
            this.$refs.payDiv.isShow = false; //隐藏全选
          }
        }
        // console.log(this.checkData)
        let mergeList = Array.from(this.checkData);
        let num = mergeList.reduce((total, e) => {
          return BigNumber(total).plus(e.totalPrice);
        }, 0);
        this.mergeAmount = num;
      }
    },

    //toast
    toast() {
      Toast.loading({
        duration: 0,
        type: "loading",
        message: "加载中...",
        forbidClick: true
      });
    },
    //结算支付时，请求物业系统接口校验账单是否能够支付
    checkedPayStatus(list, payInfo, billNo, payInfoList) {
      let url = "";
      let check = false;
      let checkStatus = [];
      this.$store.state.environment == "development"
        ? (url =
            "http://times-pcs.linli580.com.cn:8888/pcs/bill-center/check-bill")
        : (url = "https://times-pms.linli580.com/pcs/bill-center/check-bill");
      let paramsObj = {
        list: list
      };
      this.$http
        .post(url, JSON.stringify(paramsObj))
        .then(res => {
          if (res.data.code == "0000") {
            // Toast.clear(); //关闭页面loading
            let arr = res.data.data;
            for (let index = 0; index < arr.length; index++) {
              if (arr[index].status == 1 || arr[index].status == 2) {
                check = false;
                checkStatus.push(arr[index].status);
              } else {
                check = true;
              }
            }

            if (_.uniq(checkStatus).includes(2)) {
              Toast.clear(); //关闭页面loading
              this.isShowErrorMsg = true;
              this.errorMsg =
                "尊敬的邻里邦用户，该账单不存在，请重新刷新页面，获取最新账单。";
              //动态修改van-sticky样式，让弹窗铺满整个屏幕
              this.$nextTick(() => {
                this.$parent.$refs.stickyIndex.$el.style.position = "relative";
                this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
              });
            } else if (_.uniq(checkStatus).includes(1)) {
              Toast.clear(); //关闭页面loading
              this.isShowErrorMsg = true;
              this.errorMsg =
                "尊敬的邻里邦用户，该账单信息已经更新，请重新刷新页面，获取最新账单。";
              //动态修改van-sticky样式，让弹窗铺满整个屏幕
              this.$nextTick(() => {
                this.$parent.$refs.stickyIndex.$el.style.position = "relative";
                this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
              });
            } else {
              let payStr = [];
              payInfoList.forEach((item, index) => {
                // isPay=1：支付中；isPay=0：待支付
                payStr.push(item.isPay);
              });
              console.log(`待支付-是否有支付中账单`, payStr);

              if (payStr.includes(1)) {
                Toast.clear(); //关闭页面loading
                this.isShowErrorMsg = true;
                this.errorMsg =
                  "尊敬的邻里邦用户，由于上次账单支付异常中断，为确保您的账户安全，请稍等10分钟后重新支付，感谢您的理解。";
                //动态修改van-sticky样式，让弹窗铺满整个屏幕
                this.$nextTick(() => {
                  this.$parent.$refs.stickyIndex.$el.style.position =
                    "relative";
                  this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
                });
              } else {
                console.log(`提交账单中心参数`, {
                  businessCstNo: payInfo.businessCstNo,
                  platMerCstNo: payInfo.platMerCstNo,
                  tradeMerCstNo: payInfo.tradeMerCstNo,
                  billNo: billNo,
                  appScheme: "x-engine",
                  payType: false
                });

                yjzdbill.YJBillPayment({
                  businessCstNo: payInfo.businessCstNo,
                  platMerCstNo: payInfo.platMerCstNo,
                  tradeMerCstNo: payInfo.tradeMerCstNo,
                  billNo: billNo,
                  appScheme: "x-engine",
                  payType: false,
                  __ret__: res => {
                    console.log(
                      "---------------开始支付提交记录---------------------"
                    );
                    console.log(res);
                    if (res.billRetStatus != "1") {
                      Toast.clear(); //关闭页面loading
                      this.isShowErrorMsg = true;
                      this.errorMsg = res.billRetStatusMessage
                        ? res.billRetStatusMessage
                        : "支付失败";
                      //动态修改van-sticky样式，让弹窗铺满整个屏幕
                      this.$nextTick(() => {
                        this.$parent.$refs.stickyIndex.$el.style.position =
                          "relative";
                        this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
                      });
                    } else {
                      Toast.clear(); //关闭页面loading
                    }
                  }
                });
              }
            }
          }
        })
        .catch(() => {
          console.log(`提交账单中心参数catch`, {
            businessCstNo: payInfo.businessCstNo,
            platMerCstNo: payInfo.platMerCstNo,
            tradeMerCstNo: payInfo.tradeMerCstNo,
            billNo: billNo,
            appScheme: "x-engine",
            payType: false
          });

          yjzdbill.YJBillPayment({
            businessCstNo: payInfo.businessCstNo,
            platMerCstNo: payInfo.platMerCstNo,
            tradeMerCstNo: payInfo.tradeMerCstNo,
            billNo: billNo,
            appScheme: "x-engine",
            payType: false,
            __ret__: res => {
              if (res.billRetStatus != "1") {
                Toast.clear(); //关闭页面loading
                this.isShowErrorMsg = true;
                this.errorMsg = res.billRetStatusMessage
                  ? res.billRetStatusMessage
                  : "支付失败";
                //动态修改van-sticky样式，让弹窗铺满整个屏幕
                this.$nextTick(() => {
                  this.$parent.$refs.stickyIndex.$el.style.position =
                    "relative";
                  this.$parent.$refs.stickyIndex.$el.style.zIndex = 0;
                });
              } else {
                Toast.clear(); //关闭页面loading
              }
            }
          });
        });
    },
    //关闭弹窗
    closeTanC() {
      this.isShowErrorMsg = false;
      //动态修改van-sticky样式
      this.$nextTick(() => {
        this.$parent.$refs.stickyIndex.$el.style.position = "";
        this.$parent.$refs.stickyIndex.$el.style.zIndex = "";
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.waitPay {
  height: 100%;
  overflow-y: auto;
//   padding-bottom: 182px;
padding-bottom: 220px;

  &.wait-pay-x {
    padding-bottom: 220px;
  }

  &.empty-page {
    overflow-y: hidden;
  }

  .refresh-page {
    min-height: 100%;
  }
}

.tipsText {
  padding: 20px;
  font-size: 14px;
  line-height: 20px;
  // text-align: center;
}

.content {
  .scroll:not(:last-child) {
    .content-list {
      margin-bottom: 28px;
      border-bottom: 1px dashed #cccccc;
    }
  }
}

.tanc-message-box {
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
      background-image: url('../../img/tanc-bg.png');
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
      background: linear-gradient(90deg, #E5165A 0%, #FF6094 100%);
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
    background-image: url('../../img/close-icon.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-top: 30px;
    margin-left: calc(50% - 17px);
  }
}
</style>
