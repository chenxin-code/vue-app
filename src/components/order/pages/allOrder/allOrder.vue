<template>
  <div class="allOrder">
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
        <div v-for="(item, index) in currentOrderList" :key="index">
          <OrderItem
            pageType="allOrder"
            :billType="item.billType"
            :dataList="item.dataList"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :params="item.params"
            :billId="item.billId"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            :payInfo="item.payInfo"
          ></OrderItem>
        </div>
      </van-list>
    </van-pull-refresh>
    <Empty v-show="showEmpty"></Empty>
  </div>
</template>

<script>
import OrderItem from "@/components/order/components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";

export default {
  name: "allOrder",
  data() {
    return {
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
    };
  },
  components: {
    OrderItem,
    Empty,
  },
  created() {
    this.onLoad();
  },
  methods: {
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        page: { index: page, pageSize: 10 },
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
                this.initData();
              }
              setTimeout(() => {
                // 加载状态结束
                this.loading = false;
              }, 1000);
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
      let obj = {
        page: { index: page, pageSize: 10 },
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then((res) => {
          if (res.data.status == 0) {
            this.orderList = res.data.data.records;
            this.totalPage = res.data.data.pages; //将总页数赋值上去
            if (this.orderList.length == 0) {
              this.showEmpty = true;
            } else {
              this.initData();
            }
            setTimeout(() => {
              this.$toast("刷新成功");
              this.loading = false;
              this.refreshing = false; //刷新成功后将状态关掉
            }, 1000); //1秒后关闭
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
            billId: item.billId,
            amount: item.totalPrice,
            submitTime: item.submitTime,
            orderType: item.orderStateType,
            params: {
              deliverType: item.deliverType,
              orderId: item.orderId,
              orderType: item.orderStateType,
              orderCategory: item.orderCategory,
              orderCanEvaluate: item.orderCanEvaluate,
            },
            billDetailObj: {
              groupBuyActivityId: item.groupBuyActivityId,
              groupBuyId: item.groupBuyId,
              payMode: item.payMode,
              tradeNo: item.tradeNo,
              shoppingOrderId: item.shoppingOrderId,
              orderPayType: item.orderPayType,
              id: item.id,
              tag: this.getTag(item.state, item.orderStateType),
              tabIndex: 0,
              awardActivityList: item.awardActivityList,
            },
            payInfo: {
              businessCstNo: item.loginUserPhone,
              platMerCstNo: item.platMerCstNo,
              tradeMerCstNo: item.tradeMerCstNo,
              billNo: item.billNo,
              orderId: item.shoppingOrderId,
              orderCategory: item.orderCategory,
              orderType: item.orderType,
              tradeNo: item.tradeNo,
              deliverCheckcode: item.deliverCheckcode,
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
              };
            }),
          };
      });
    },
    getTag(state, type) {
      if (state == 1 && type == '200015') {
        // 待支付
        return '1'
      } else if (state == 17 && type == '200017') {
        // 待发货
        return '16'
      } else if ( state == 4 && type == '200017') {
        // 待收货
        return '4'
      } else if (state == 9 && type == '200017') {
        // 已完成
        return '9'
      } else if (state == 7 && type == '200018') {
        // 已取消
        return '7'
      }
    }
  },
};
</script>


<style lang="stylus" scoped type="text/stylus"></style>