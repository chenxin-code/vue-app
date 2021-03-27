<template>
  <div class="finish">
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
            :dataList="item.dataList"
            :params="item.params"
            :billType="item.billType"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            :billId="item.billId"
            pageType="finish"
            :state="item.state"
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
  name: "finish",
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
      index:0,
      showEmpty: false,
      currentOrderList: [],
      tabs: {
        text: "已完成",
        tag: "9",
        type: ["200017"],
      },
    };
  },
  components: {
    OrderItem,
    Empty,
  },
  created() {
    this.onLoad();
  },
  watch:{
    currentOrderList:function(newVal,oldVal){
      if(newVal.length !== 0){
        this.showEmpty = false;
      }else{
        this.showEmpty = true;
      }
    }
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
        orderType: this.tabs.type[0],
        orderTypeList:this.tabs.type,
        // state: this.tabs.tag,
        page: { index: page, pageSize: 10 },
        airDefenseNo:this.$store.state.userRoomId
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          let dataPages = 0;
          if (res.data.data.pages == 0){
            dataPages = 1;
          }else{
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
              } else{
                this.currentOrderList = [];
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
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList:this.tabs.type,
        state: this.tabs.tag,
        page: { index: page, pageSize: 10 },
        airDefenseNo:this.$store.state.userRoomId
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then((res) => {
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
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map((item) => {
        return {
          billType: item.billType,
          billId: item.billId,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderStateType,
          orderCategory: item.orderCategory,
          orderCanEvaluate: item.orderCanEvaluate,
          state:item.state,
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderStateType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state,
          },
            // case 17:
            //   return "支付已完成 · 待发货";
            // case 4:
            //   return "支付已完成 · 待收货";
            // case 9:
            //   return "订单已完成";
            // case 12:
            //   return "订单已取消";
          billDetailObj: {
            businessCstNo:item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: item.state == 17?'16':item.state == 4?'4':item.state == 9?'9':item.state == 12?'7':'9',
            tabIndex: 5,
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
              id: sub.itemId,
              storeOuCode: sub.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType,
              itemTypeName:sub.itemTypeName,
              snapshotTime:sub.snapshotTime,
              info:sub.info,
            };
          }),
        };
      });
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
// .scroll {
//   padding-top: 10px;
// }
.finish{
  height 100%;
  overflow-y auto; 
  padding-bottom: 130px;   
}
</style>