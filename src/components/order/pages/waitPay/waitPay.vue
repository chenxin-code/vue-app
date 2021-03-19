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
        <div v-for="(item, index) in currentOrderList" :key="index">
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
          ></OrderItem>
        </div>
      </van-list>
    </van-pull-refresh>
    <Empty v-show="showEmpty"></Empty>
    <pay-div
      ref="payDiv"
      :checkData="checkData"
      @checkEvent="checkEvent"
      @mergePay="mergePay"
    ></pay-div>
  </div>
</template>

<script>
import payDiv from "@/components/order/components/pay-div/pay-div";
import OrderItem from "@/components/order/components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";

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
      params: []
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
    mergePay(){
      console.log(this.checkData)
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
        orderType: "200015",
        orderTypeList: ["200015", "200502"],
        state: "1",
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
        if (item.billType != 12) {
          return {
            billType: item.billType,
            amount: item.totalPrice,
            submitTime: item.submitTime,
            orderType: item.orderType,
            orderId: item.orderId,
            state: item.state,
            payInfo: {
              businessCstNo: item.businessCstNo,
              platMerCstNo: item.platMerCstNo,
              tradeMerCstNo: item.tradeMerCstNo,
              billNo: item.billNo,
              orderId: item.orderId,
              orderCategory: item.orderCategory,
              orderType: item.orderType,
              tradeNo: item.tradeNo,
              deliverCheckcode: item.deliverCheckcode,
            },
            params: {
              deliverType: item.deliverType,
              orderId: item.orderId,
              orderType: item.orderType,
              orderCategory: item.orderCategory,
              orderCanEvaluate: item.orderCanEvaluate,
            },
            dataList: item.orderFormItemList.map((sub) => {
              return {
                billType: item.billType,
                billImg: sub.iconUrl,
                billName: sub.name,
                billAmount: sub.unitPrice,
                billNum: sub.quantity,
              };
            })
          };
        }
      });
      this.currentOrderList.forEach(item => {
        this.params.deliverType = item.deliverType
        this.params.orderId = item.orderId
        this.params.orderType = item.orderType
        this.params.orderCategory = item.orderCategory
        this.params.state = item.state
      })
    },

    checkEvent(data) {
      // 从全选checkbox进来
      if (data.checkAll) {
        let refs = this.$refs.order.filter((item) => {
          // 找出全选的类型并保存起来
          return item.orderType == data.orderType;
        });
        if (data.checked) {
          //全部选中
          refs.forEach((item) => {
            //保存选中数据并设置每个checkbox选中状态
            this.checkData.add(data);
            item.isChecked = true;
          });
        } else {
          // 全部取消
          this.checkData.clear(); //清空checkData
          refs.forEach((item) => {
            item.isChecked = false; // 设置每个checkbox为没选中状态
            this.$refs.payDiv.isShow = false; //隐藏全选按钮
          });
        }
        return;
      }

      // 选中或取消当个checkbox
      let refs = this.$refs.order.filter((item) => {
        // 找到不能选的checkbox
        return item.orderType !== data.orderType;
      });
      refs.forEach((item) => {
        // 并设置不能选择属性
        if (item.orderType !== data.orderType) {
          item.isDisabled = true;
        }
      });

      let checkedTotal = this.$refs.order.length - refs.length; // 计算出所有可以选的checkbox

      if (data.checked) {
        // 选中
        this.checkData.add(data);
        this.$refs.payDiv.type = data.orderType;
        this.$refs.payDiv.isShow = true; // 显示全选按钮
        if (this.checkData.size == checkedTotal) {
          //checkData数量跟可选checkbox数量相等 =>全选
          this.$refs.payDiv.isChecked = true; // 全选按钮变成选中
        }
      } else {
        // 取消
        this.checkData.forEach((item) => {
          if (item.orderId == data.orderId) {
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
      console.log(this.checkData);
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
.waitPay {
  padding-bottom: 52px;
}
</style>