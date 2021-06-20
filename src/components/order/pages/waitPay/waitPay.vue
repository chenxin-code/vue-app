<template>
  <div class="waitPay">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="showEmpty ? '' : '- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <property-bill
          pageName="waitPay"
          ref="propertyOrder"
          :isDisAll="isDisAll"
          :isDis="isDis"
          :results="billResults"
          v-show="isLoadPropertyBill"
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
          :key="index"
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
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty && billResults.length === 0"></Empty>
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
    <!-- <van-dialog v-model="showDialog">
      <div class="tipsText">
        {{ tipsText }}
      </div>
    </!-->
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
export default {
  name: "waitPay",

  data() {
    return {
      showDialog: false,
      tipsText: "",
      check: false,
      checkData: new Set(),
      show: false,
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      currentPage: 0,
      totalPage: 0,
      page: 0,
      showEmpty: false,
      currentOrderList: [],
      params: [],
      mergeAmount: 0,
      total: 0,
      isLoadPropertyBill: false, //是否加载物业缴费账单组件
      isDisAll: false,
      isDis: false,
      isLoad: true,
      billResults: [], //物业缴费数据
      reqBillType: "2,3,4,5,6,7,8,9,10,11,14" //账单类型 1-物业收费账单,2-月保续费账单,3-停车费账单,4-临时收费账单,5-零售,6-预缴费,7-旅游,8-家政,9-拎包,10-押金,11-新零售,12-美居,13-服务商城,14-维修服务费
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
    this.initPropert();
    // this.onLoad();
  },
  activated() {
    // this.initPropert();
  },
  watch: {
    currentOrderList: function(newVal, oldVal) {
      if (newVal.length !== 0) {
        this.showEmpty = false;
      } else {
        this.showEmpty = true;
      }
    }
  },
  methods: {
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
        //处理物业账单支付
        let billNo = "";
        let billList = [];
        if (projectList.length > 1) {
          if (!projectList.every(e => e === projectList[0])) {
            // this.showDialog = true;
            this.tipsText =
              "尊敬的邻里邦用户，目前仅支持本楼盘的账单支付，其他楼盘账单需切换楼盘进行缴纳，感谢您的理解。";
            Dialog.alert({
              message: this.tipsText,
              theme: "round-button"
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
        this.checkedPayStatus(billList, payInfo, billNo);
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

    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        orderType: "200015",
        orderTypeList: ["200015", "200502"],
        state: "1",
        page: { index: page, pageSize: 30 },
        airDefenseNo: this.$store.state.userRoomId,
        // airDefenseNo:
        //   "5B348999FEC0415CB63A12D7CEEC0A13|97F3477ABD5F42C695E3945A7DDB059C|801d1908ee804d68b439a33a518a2fc0|754e92fd503c4776a721f1dae97382ad",
        billType: this.reqBillType
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then(res => {
          // 判断当前页数是否超过总页数或者等于总页数
          let dataPages = 0;
          if (res.data.data.pages == 0) {
            dataPages = 1;
          } else {
            dataPages = res.data.data.pages;
          }
          if (page < dataPages || page == dataPages) {
            if (res.data.data.pages == page) {
              this.finished = true;
            }
            if (res.data.status == 0) {
              var indexList = res.data.data.records; //将请求到的内容赋值给一个变量
              this.orderList = this.orderList.concat(indexList);
              this.page = res.data.data.pages; //将总页数赋值给this
              if (this.orderList.length !== 0) {
                this.initData();
              } else {
                this.currentOrderList = [];
              }
              // 加载状态结束
              this.loading = false;
              if (this.billResults.length) {
                this.isLoadPropertyBill = true;
              } else {
                this.isLoadPropertyBill = false;
              }
            } else {
              // 加载状态结束
              this.loading = false; //将加载状态关掉
              if (this.billResults.length) {
                this.isLoadPropertyBill = true;
              } else {
                this.isLoadPropertyBill = false;
              }
              this.error = true; //大家错误状态
            }
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        })
        .catch(err => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;

      let airDefenseNoStr = this.$store.state.userRoomId;
      // let airDefenseNoStr =
      //   "5B348999FEC0415CB63A12D7CEEC0A13|97F3477ABD5F42C695E3945A7DDB059C|801d1908ee804d68b439a33a518a2fc0|754e92fd503c4776a721f1dae97382ad"; //测试
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","

      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone,
        status: 10, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageTimes: "",
        pageNo: ""
      };

      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "http://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "http://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");

      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.billResults = data.notpay;
            this.billResults.forEach(item => {
              item.totalPrice = item.totalPayableAmount;
              item.billId = item.spaceId;
              item.billType = 1;
            });
          } else {
            this.billResults = [];
          }
          this.loading = false;
        })
        .finally(() => {
          let obj = {
            orderType: "200015",
            orderTypeList: ["200015", "200502"],
            state: "1",
            page: { index: page, pageSize: 30 },
            airDefenseNo: this.$store.state.userRoomId,
            // airDefenseNo:
            //   "C14B777F4ED34E249BE379C8E3D69DF6|EC5580D6D7714ED4A3AD78B8A5FA3F37|5681ec5fe0584103ad8c3bbf61f1b862",
            billType: this.reqBillType
          };
          this.$http
            .post("/app/json/app_shopping_order/findOrderFormList", obj)
            .then(res => {
              if (res.data.status == 0) {
                this.orderList = res.data.data.records;
                this.totalPage = res.data.data.pages; //将总页数赋值上去
                if (this.orderList.length !== 0) {
                  this.initData();
                }
                this.$toast("刷新成功");
                this.loading = false;
                this.refreshing = false; //刷新成功后将状态关掉
              }
            })
            .catch(res => {
              this.$toast("网络繁忙,请稍后再试~");
            });
        });
    },
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          orderType: item.orderType,
          orderId: item.shoppingOrderId,
          state: item.state,
          totalPrice: item.totalPrice,
          orderStateType: item.orderStateType,
          billId: item.billId,
          shoppingOrderId: item.shoppingOrderId,
          bulkOrderType: item.orderType,
          id: item.id,
          tradeNo: item.tradeNo,
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
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              storeOuCode: sub.storeOuCode,
              info: sub.info,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime
            };
          })
        };
      });
    },
    checkEvent(data) {
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
          if (item.billId == data.billId) {
            this.checkData.delete(item); // 删除数据中取消选中的数据
            this.$refs.payDiv.isChecked = false; // 没有全选，所以全选checkbox变成没选中
            if (data.billType == 1) {
              this.$refs.propertyOrder.isChecked = false;
              this.$refs.propertyOrder.isDisabled = false;
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
    },

    //物业缴费列表接口
    initPropert() {
      this.loading = true;
      let airDefenseNoStr = this.$store.state.userRoomId;
      // let airDefenseNoStr =
      //   "F1140319BD594B9C9EAD77D119D681D6,B61955EC92E04AD69869D6F5E70BB42C,132db4ee32114c2c987a1cf2dc2e758e,535366e4998743809637d328690d9802,d960b63d954b410f86230bfa23099737,8ce6b5ddc06646e2b7b0cdabe417f9c4"; //测试
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
            "http://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "http://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.billResults = data.notpay;
            this.billResults.forEach(item => {
              item.totalPrice = item.totalPayableAmount;
              item.billId = item.spaceId;
              item.billType = 1;
            });
          } else {
            this.billResults = [];
          }
          this.loading = false;
        })
        .finally(() => {
          this.onLoad();
        });
    },

    //结算支付时，请求物业系统接口校验账单是否能够支付
    checkedPayStatus(list, payInfo, billNo) {
      let url = "";
      let check = false;
      this.$store.state.environment == "development"
        ? (url =
            "http://times-pcs.linli580.com.cn:8888/pcs/bill-center/check-bill")
        : (url = "https://times-pms.linli580.com/pcs/bill-center/check-bill");
      let paramsObj = {
        list: list
      };
      this.$http.post(url, JSON.stringify(paramsObj)).then(res => {
        if (res.data.code == "0000") {
          console.log(`校验账单是否能够支付`, res.data.data);
          let arr = res.data.data;
          for (let index = 0; index < arr.length; index++) {
            if (arr[index].status == 1) {
              check = false;
              break;
            } else {
              check = true;
            }
          }
          console.log(check);
          if (check) {
            // this.enginePay(
            //   payInfo,
            //   billNo,
            //   `/app-vue/app/index.html#/order/2?time=${Date.now()}`
            // );
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
                if (res.billRetStatus === "-1") {
                  //支付失败
                  // this.showDialog = true;
                  this.tipsText = res.billRetStatusMessage;
                  Dialog.alert({
                    message: this.tipsText,
                    theme: "round-button"
                  });
                } else {
                  //支付成功
                  this.$router.push({ path: "/order/2?orderPage=false" }); //支付完成返回到待支付页面
                }
              }
            });
          } else {
            // this.showDialog = true;
            this.tipsText =
              "尊敬的邻里邦用户，由于上次账单支付异常中断，为确保您的账户安全，请稍等10分钟后重新支付，感谢您的理解。";
            Dialog.alert({
              message: this.tipsText,
              theme: "round-button"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.waitPay {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 182px;
}

.tipsText {
  padding: 20px;
  font-size: 14px;
  line-height: 20px;
  // text-align: center;
}
</style>
