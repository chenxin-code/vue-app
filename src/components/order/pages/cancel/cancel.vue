<template>
  <div class="cancel">
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
        <div
          v-for="(item, index) in currentOrderList"
          :key="index"
          class="scroll"
        >
          <OrderItem
            :dataList="item.dataList"
            :params="item.params"
            :billType="item.billType"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            pageType="cancel"
            :orderMode="item.orderMode"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
export default {
  name: "cancel",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      currentPage: 0,
      totalPage: 0,
      queryBadge: {},
      page: 0,
      showEmpty: false,
      currentOrderList: [],
      tabs: {
        text: "已取消",
        tag: "7",
        type: ["200018"]
      }
    };
  },
  components: {
    OrderItem,
    Empty
  },
  created() {
    this.onLoad();
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
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      // "orderType":"200017","orderTypeList":["200017"],"state":"9","page":{"index":1,"pageSize":10}
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: page, pageSize: 30 }
      };
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then(res => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (
            page < res.data.data.page.totalPages ||
            page == res.data.data.page.totalPages
          ) {
            if (res.data.data.page.totalPages == page) {
              this.finished = true;
            }
            if (res.data.status == 0) {
              var indexList = res.data.data.orderList; //将请求到的内容赋值给一个变量
              this.orderList = this.orderList.concat(indexList);
              if (this.orderList.length > 0) {
                this.orderList.forEach(item => {
                  item["billType"] = 11;
                  item.itemAbstractList.forEach(tab => {
                    tab["billType"] = 11;
                  });
                });
                this.initData();
              } else {
                this.currentOrderList = [];
              }
              this.page = res.data.data.page.totalPages; //将总页数赋值给this
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
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: page, pageSize: 10 }
      };
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then(res => {
          if (res.data.status == 0) {
            this.orderList = res.data.data.orderList;
            if (this.orderList.length > 0) {
              this.orderList.forEach(item => {
                item["billType"] = 11;
                item.itemAbstractList.forEach(tab => {
                  tab["billType"] = 11;
                });
              });
              this.initData();
            }
            this.totalPage = res.data.totalPages; //将总页数赋值上去
            this.$toast("刷新成功");
            this.loading = false;
            this.refreshing = false; //刷新成功后将状态关掉
          }
        })
        .catch(res => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          amount: item.realAmount,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderType,
          orderCategory: item.orderCategory,
          orderMode: item.orderMode,
          shoppingOrderId: item.shoppingOrderId,
          bulkOrderType: item.orderType,
          id: item.id,
          tradeNo: item.tradeNo,
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderType,
            orderCategory: item.orderCategory,
            orderStateType: item.orderStateType,
            state: item.state
          },
          billDetailObj: {
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: "7",
            tabIndex: 6,
            awardActivityList: item.awardActivityList
          },
          dataList: item.itemAbstractList.map(sub => {
            return {
              billType: sub.billType,
              billImg: sub.phPictureUrl,
              billName: sub.skuName,
              billAmount: sub.salePrice,
              billNum: sub.number,
              skuId: sub.skuId,
              id: sub.id,
              storeOuCode: item.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType
            };
          })
        };
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
// .scroll {
//   padding-top: 10px;
// }
.cancel{
  height 100%;
  overflow-y auto;
  padding-bottom: 130px;
}
</style>
