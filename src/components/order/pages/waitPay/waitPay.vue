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
        <div v-for="(item, index) in currentOrderList" :key="index" class="scroll">
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
    ></pay-div>
  </div>
</template>

<script>
import payDiv from "@/components/order/components/pay-div/pay-div";
import OrderItem from "@/components/order/components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
import { BigNumber } from "bignumber.js";
export default {
  name: "waitPay",

  data() {
    return {
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
    };
  },
  components: {
    payDiv,
    OrderItem,
    Empty,
  },
  created() {
    this.onLoad();
  },
  methods: {
    //合并支付
    mergePay() {
      let payInfoList = Array.from(this.checkData);
      let billNo = "";
      let callbackUrl = "";
      if (payInfoList.length == 0) {
        this.$toast("请选择订单");
      } else if (
        payInfoList.length == 1 &&
        payInfoList[0].billType == 11 &&
        payInfoList[0].orderType !== '200001'
      ) {
        billNo = payInfoList[0].payInfo.billNo;
        //团购订单
        callbackUrl = `/app-vue/app/index.html#/group_detail?orderId=${payInfoList[0].billDetailObj.groupBuyId}&mktGroupBuyId=${payInfoList[0].billDetailObj.groupBuyActivityId}&formPaySuccess='1'&ret={ret}`;
        this.enginePay(payInfoList[0].payInfo, billNo, callbackUrl);
        // this.$http
        //   .post("/app/json/app_fight_group_order/queryAll", {
        //     groupBuyType: 1,
        //     deliveryType: 2,
        //     pickupId: this.$store.state.mall2.zitiAddress.id,
        //   })
        //   .then((res) => {
        //     if (res.data.status == 0) {
        //       let mktGroupBuyId = "";
        //       let goodsItem = res.data.data.orderList.filter((e) => {
        //         return (
        //           payInfoList[0].dataList.itemId ==
        //           e.leaderUserAward[0].sku.skuId
        //         );
        //       });
        //       if (goodsItem.length !== 0) {
        //         mktGroupBuyId = goodsItem[0].mktGroupBuyId;
        //       }
        //       callbackUrl = `/app-vue/app/index.html#/group_detail?orderId=${payInfoList[0].orderId}&mktGroupBuyId=${mktGroupBuyId}&formPaySuccess='1'&ret={ret}`;
        //       console.log("------------团购订单-----------------", callbackUrl);
        //       console.log(
        //         "------------payInfo-----------------",
        //         payInfoList[0]
        //       );

        //       this.enginePay(payInfoList[0].payInfo, billNo, callbackUrl);
        //     }
        //   });
      } else {
        //普通订单
        console.log("唤起邻里邦支付平台payInfoList", payInfoList);
        let currentOrderDetails = {
          state: 3,
          orderId: payInfoList[0].orderId,
          orderType: payInfoList[0].orderType,
          tradeNo: payInfoList[0].payInfo.tradeNo,
          tag: 1,
          deliverCheckcode: payInfoList[0].payInfo.deliverCheckcode,
          deviceCode: this.$route.query.deviceCode, //正常流程支付也为空 待保留
          storeOuCode: this.$route.query.storeOuCode, //正常流程支付也为空 待保留
          stationName: this.$route.query.stationName, //正常流程支付也为空 待保留
        };
        localStorage.setItem(
          "currentOrderDetails",
          JSON.stringify(currentOrderDetails)
        );
        payInfoList.forEach((e) => {
          billNo += e.payInfo.billNo + ",";
        });
        //vipUnitUserCode type  为空  待保留
        callbackUrl = `/app-vue/app/index.html#/mall2/paysuccess?selectedIndex=1&isBill=${payInfoList[0].billType != 11?true:false}&orderCategory=${payInfoList[0].payInfo.orderCategory}&vipUnitUserCode=${this.$route.query.vipUnitUserCode}&type=${this.$route.query.type}&ret={ret}`;
        console.log(
          "------------payInfo-----------------",
          payInfoList[0].payInfo
        );
        this.enginePay(payInfoList[0].payInfo, billNo, callbackUrl);
      }
    },
    enginePay(payInfo, billNo, callbackUrl) {
      console.log("唤起邻里邦支付平台billNo", billNo);
      window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
        JSON.stringify({
          businessCstNo: payInfo.businessCstNo,
          platMerCstNo: payInfo.platMerCstNo,
          tradeMerCstNo: payInfo.tradeMerCstNo,
          billNo: billNo,
          appScheme: "x-engine-c",
          payType: false,
        })
      )}&callback=${encodeURIComponent(location.origin + callbackUrl)}`;
    },

    //滚动条与底部距离小于 offset 时触发
    // orderType":"200015","orderTypeList":["200015","200502"],"state":"1"
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
        page: { index: page, pageSize: 10 },
        airDefenseNo:this.$store.state.userRoomId,
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (page < res.data.data.pages || page == res.data.data.pages) {
            if (res.data.data.pages == page) {
              this.finished = true;
            }
            if (res.data.status == 0) {
              var indexList = res.data.data.records; //将请求到的内容赋值给一个变量
              this.orderList = this.orderList.concat(indexList);
              this.page = res.data.data.pages; //将总页数赋值给this
              if (this.orderList.length == 0) {
                this.showEmpty = true;
              } else {
                this.showEmpty = false;
                this.initData();
              }
              // 加载状态结束
              this.loading = false;
            } else {
              this.loading = false; //将加载状态关掉
              this.error = true; //大家错误状态
            }
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        })
        .catch((err) => {
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
      this.loading = false; //将下拉刷新状态改为true开始刷新
      this.currentPage = 0;
      let obj = {
        orderType: "200015",
        orderTypeList: ["200015", "200502"],
        state: "1",
        page: { index: page, pageSize: 10 },
        airDefenseNo:this.$store.state.userRoomId,
      };
      console.log('---------------this.$store.state.userRoomId----------',this.$store.state.userRoomId)
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then((res) => {
          if (res.data.status == 0) {
            this.orderList = res.data.data.records;
            this.totalPage = res.data.data.pages; //将总页数赋值上去
            if (this.orderList.length == 0) {
              this.showEmpty = true;
            } else {
                this.showEmpty = false;
              this.initData();
            }
            this.$toast("刷新成功");
            this.loading = false;
            this.refreshing = false; //刷新成功后将状态关掉
          }
        })
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
    initData() {
      this.currentOrderList = this.orderList.map((item) => {
        return {
          billType: item.billType,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          orderType: item.orderType,
          orderId: item.shoppingOrderId,
          state: item.state,
          totalPrice: item.totalPrice,
          orderStateType:item.orderStateType,
          billId:item.billId,
          payInfo: {
            businessCstNo: item.loginUserPhone,
            platMerCstNo: item.platMerCstNo,
            tradeMerCstNo: item.tradeMerCstNo,
            billNo: item.billNo,
            orderId: item.id,
            orderCategory: item.orderCategory,
            orderType: item.orderType,
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
            state: item.state,
          },
          billDetailObj: {
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
            isRefund: item.isRefund,
          },
          dataList: item.orderFormItemList.map((sub) => {
            return {
              billType: item.billType,
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              storeOuCode: sub.storeOuCode,
              info:sub.info,
              itemTypeName:sub.itemTypeName,
              snapshotTime:sub.snapshotTime,
            };
          }),
        };
      });
    },

    checkEvent(data) {
      // 从全选checkbox进来
      if (data.checkAll) {
        let refs = this.$refs.order.filter((item) => {
          // 找出全选的类型并保存起来
          return item.billType == data.billType;
        });
        let checkData = this.currentOrderList.filter((item) => {
          return (item.billType == data.billType);
        });
        if (data.checked) {
          //全部选中
          this.checkData.clear(); //清空checkData
          refs.forEach((item, index) => {
            //保存选中数据并设置每个checkbox选中状态
            this.checkData.add(checkData[index]);
            item.isChecked = true;
          });
        } else {
          // 全部取消
          this.checkData.clear(); //清空checkData
          refs.forEach((item) => {
            item.isChecked = false; // 设置每个checkbox为没选中状态
          });
          this.$refs.payDiv.isShow = false; //隐藏全选按钮
        }
        return;
      }
      // 选中或取消当个checkbox
      let refs = this.$refs.order.filter((item) => {
        // 找到不能选的checkbox
        return item.billType != data.billType;
      });
      refs.forEach((item) => {
        // 并设置不能选择属性
        if (item.billType != data.billType) {
          item.isDisabled = true;
        }
      });

      let checkedTotal = this.$refs.order.length - refs.length; // 计算出所有可以选的checkbox

      if (data.checked) {
        // 选中
        this.checkData.add(data);
        this.$refs.payDiv.billType = data.billType;
        this.$refs.payDiv.isShow = true; // 显示全选按钮
        if (this.checkData.size == checkedTotal) {
          //checkData数量跟可选checkbox数量相等 =>全选
          this.$refs.payDiv.isChecked = true; // 全选按钮变成选中
        } else {
          this.$refs.payDiv.isChecked = false; // 全选按钮变成没选中
        }
      } else {
        // 取消
        this.checkData.forEach((item) => {
          if (item.billId == data.billId) {
            this.checkData.delete(item); // 删除数据中取消选中的数据
            this.$refs.payDiv.isChecked = false; // 没有全选，所以全选checkbox变成没选中
          }
        });
        if (this.checkData.size == 0) {
          // 个数为0，全部取消选中
          this.$refs.order.forEach((item) => {
            item.isDisabled = false; // 所有checkbox变成可选
          });
          this.$refs.payDiv.isShow = false; //隐藏全选
        }
      }
      // console.log(this.checkData)
      let mergeList = Array.from(this.checkData);
      let num = mergeList.reduce((total,e)=>{
        return BigNumber(total).plus(e.totalPrice)
      },0)
      this.mergeAmount = num;
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
.waitPay {
  padding-bottom: 52px;
}
.scroll {
  padding-top: 10px;
}
</style>