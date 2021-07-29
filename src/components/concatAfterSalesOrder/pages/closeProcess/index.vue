<template>
  <div class="figureOut">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        :error-text="errorText"
        :immediate-check="false"
      >
        <div
          v-for="(item, index) in currentOrderList"
          :key="index"
          class="scroll"
        >
          <AfterSalesItem :orderItem="item" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import AfterSalesItem from "@/components/concatAfterSalesOrder/components/after-sales-item/index";
import format from "../../utils.js";
export default {
  name: "figureOut",
  data() {
    return {
      currentOrderList: [],
      refreshing: false,
      loading: false,
      finished: false,
      error: false,
      currentPage: 1,
      maxPage: 0,
      mallMaxPage: 10,
      serviceMallMaxPage: 10,
      errorText: "",
    };
  },
  components: {
    AfterSalesItem,
  },
  created() {
    // this.getMallOrder();
    // this.getServiceMallOrder();
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      let promiseList = [];

      if (this.currentPage > this.mallMaxPage) {
        promiseList = [this.getServiceMallOrder()];
      } else if (this.currentPage > this.serviceMallMaxPage) {
        promiseList = [this.getMallOrder()];
      } else {
        promiseList = [this.getServiceMallOrder(), this.getMallOrder()];
      }

      console.log("promiseList", promiseList);
      Promise.allSettled(promiseList)
        .then((res) => {
          console.log("resresres", res);
          res.forEach((e) => {
            if (e.status == "fulfilled") {
              this.loading = false;
              this.refreshing = false;
              if (
                /app\/json\/app\_order\_after\_sale\/queryCompletedOrder/.test(
                  e.value.config.url
                )
              ) {
                if (e.value.data.status !== 0) {
                  this.loading = false;
                  this.error = true;
                  this.errorText = "商城售后订单请求失败，点击重新加载~";
                  return;
                }
                let mallOrder = e.value.data.data;
                this.initOrderItemData(mallOrder, "mall");
                this.mallMaxPage = e.value.data.totalPages;
              } else if (
                /times\-center\-trade\/mall\/after\/sale\/list/.test(
                  e.value.config.url
                )
              ) {
                if (e.value.data.code !== 200) {
                  this.loading = false;
                  this.error = true;
                  this.errorText = "服务商城售后订单请求失败，点击重新加载~";
                  return;
                }
                let serviceMallOrder = e.value.data.data.records;
                this.initOrderItemData(serviceMallOrder, "serviceMall");
                this.serviceMallMaxPage = e.value.data.data.pages;
              }
            } else {
              this.loading = false;
              this.error = true;
            }
          });
          this.currentPage++;
          if (this.mallMaxPage >= this.serviceMallMaxPage) {
            this.maxPage = this.mallMaxPage;
          } else {
            this.maxPage = this.serviceMallMaxPage;
          }
          if (this.currentPage > this.maxPage) {
            this.loading = false;
            this.finished = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.error = true;
        });
    },
    onRefresh() {
      this.currentPage = 1;
      this.finished = false; //将没有更多的状态改成false
      this.refreshing = true;
      this.mallMaxPage = 10;
      this.serviceMallMaxPage = 10;
      this.currentOrderList = [];
      this.onLoad();
    },
    getMallOrder() {
      let url = "/app/json/app_order_after_sale/queryCompletedOrder";
      let parmas = {
        page: { index: this.currentPage, pageSize: 30 },
        state: 9,
      };
      return new Promise((resolve, reject) => {
        this.$http.post(url, { ...parmas }).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    getServiceMallOrder() {
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://mall-uat-api-linli.timesgroup.cn:1443/times-center-trade/mall/after/sale/list")
        : (url =
            "https://mall-prod-app-linli.timesgroup.cn:9001/times-center-trade/mall/after/sale/list");
      let parmas = {
        afterSaleStateList: ["REJECT", "CANCEL", "FAIL"],
        afterSaleType: "REFUND",
        pageNum: this.currentPage,
        pageSize: 30,
      };
      return new Promise((resolve, reject) => {
        this.$http.post(url, parmas).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    initOrderItemData(orderList, type) {
      console.log("orderList", orderList);
      console.log("type", type);
      let mallOrderList = [];
      let serviceMallOrderList = [];
      if (orderList.length !== 0) {
        if (type == "mall") {
          mallOrderList = orderList.map((e) => {
            return {
              orderType: "mall",
              orderNo: e.id,
              state: "处理关闭",
              createTime: e.createTime,
              price: e.price,
              goodsItem: e.ordRepairItems.map((i) => {
                return {
                  goodsPic: i.phPictureUrl,
                  goodsName: i.skuName,
                  goodsPrice: i.price,
                  goodsNumber: i.number,
                };
              }),
            };
          });
        } else if (type == "serviceMall") {
          serviceMallOrderList = orderList.map((e) => {
            return {
              orderType: "serviceMall",
              orderNo: e.afterSaleNo,
              state: "处理关闭",
              createTime: e.applyTime,
              price: e.orderPayAmount,
              goodsItem: e.orderItemList.map((i) => {
                return {
                  goodsPic: i.itemImg,
                  goodsName: i.itemName,
                  goodsPrice: i.itemPrice,
                  goodsNumber: i.buyNum,
                };
              }),
            };
          });
        }
        let concatList = mallOrderList.concat(serviceMallOrderList);
        console.log("this.currentOrderList", this.currentOrderList);
        let sortList = this.currentOrderList.concat(concatList);
        this.currentOrderList = sortList.sort(
          format.dateData("createTime", false)
        );
        console.log("concatList", concatList);
        console.log("sortList", sortList);
      }
    },
  },
};
</script>
 
<style lang="stylus" scoped type="text/stylus">
.figureOut {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;
}
</style>