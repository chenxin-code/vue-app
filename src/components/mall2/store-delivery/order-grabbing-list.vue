/**Created by liaoyingchao on 2020-07-16.*/

<template>
  <div class="order-grabbing-list">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <van-tabs v-model="active" @change="change">
          <van-tab title="新任务">
          </van-tab>
          <van-tab title="配送中">
          </van-tab>
          <van-tab title="已结束">
          </van-tab>
        </van-tabs>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            class="tab-content"
            v-model="loading"
            :finished="finished"
            @load="onLoad"
          >
            <div v-if="active == 0">
              <div class="item" v-for="item in systemPushOrderList">
                <OrderItem :itemData="item" :type="2" @toMap="toMap(item)" @toDetail="toDetail(item)">
                  <div class="btns-div">
                    <div class="btn-gray line_circle" @click="rejectOrder(item)">取消订单</div>
                    <div class="space btn-red" @click="receiveOrder(item)">确认接单{{countDown(item)}}</div>
                  </div>
                </OrderItem>
              </div>
            </div>
            <div class="item" v-for="item in orderList">
              <OrderItem :itemData="item" :type="1" @toMap="toMap(item)" @toDetail="toDetail(item)" v-if="active != 2">
                <div class="btns-div" v-if="active == 0">
                  <div class="btn-red" @click="grabbingOrder(item)">抢单</div>
                </div>
                <div class="btns-div" v-if="active == 1 && item.state == 1">
                  <div class="btn-red" @click="toDetail(item)">提货码</div>
                  <div class="space btn-red" @click="toPickup(item)"><img src="./img/dh.png">去提货</div>
                </div>
                <div class="btns-div" v-if="active == 1 && item.state == 2">
                  <div class="btn-red" @click="toScan(item)"><img src="./img/scan.png">完成配送</div>
                  <div class="space btn-red" @click="toPickup(item)"><img src="./img/dh.png">去送货</div>
                </div>
              </OrderItem>
              <OrderItemFinish :itemData="item" @toMap="toMap(item)" @toDetail="toDetail(item)" v-if="active == 2"></OrderItemFinish>
            </div>
          </van-list>
          <div class="no-data" v-if="orderList.length == 0">暂无数据</div>
        </van-pull-refresh>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import OrderItem from './base/order-item'
  import OrderItemFinish from './base/order-item-finish'

  export default {
    name: "order-grabbing-list",
    components: {
      OrderItem,
      OrderItemFinish
    },
    data() {
      return {
        active: 0,
        isLoading: false,
        lastPath: '',
        systemPushOrderList: [],
        orderList: [],
        loading: false,
        finished: false
      }
    },
    created() {
      this.lastPath = this.$route.query.lastPath
      this.loadData()
    },
    mounted() {

    },
    methods: {
      toScan: function (item) {
        this.$bridgefunc.scanCode(dic => {
          let code = dic.code;
          this.receiveCheckcode(code, item.id)
        })
      },
      receiveCheckcode: function (code, id) {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/receiveCheckcode';
        let paramsData = {
          id: id,
          checkCode: code
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('确认成功！');
              this.loadData()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      countDown: function (item) {
        return ''
      },
      // 获取可抢订单
      getOhterOrderList: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getMyCanDispatchOrderList';
        let paramsData = {
          page: 1,
          rows: 20
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            this.loading = false
            this.isLoading = false;
            if (data.status == 0) {
              if (data.data.length) {
                this.orderList = this.orderList.concat(data.data)
              }
              if (this.orderList.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.loading = false
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 获取配送中的订单
      getDeliveringOrderList: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getMyOnDeliveringOrder';
        let paramsData = {
          page: 1,
          rows: 20
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            this.loading = false
            this.isLoading = false;
            if (data.status == 0) {
              if (data.data.length) {
                this.orderList = this.orderList.concat(data.data)
              }
              if (this.orderList.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.loading = false
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 获取已完成的订单
      getComplateOrderList: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getMyComplateOrder';
        let paramsData = {
          page: 1,
          rows: 20
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            this.loading = false
            this.isLoading = false;
            if (data.status == 0) {
              if (data.data.length) {
                this.orderList = this.orderList.concat(data.data)
              }
              if (this.orderList.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.loading = false
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 获取系统推送订单
      getSystemPushOrderList: function () {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/getMySystemDispatchOrderList';
        let paramsData = {};
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.systemPushOrderList = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 拒绝接单
      rejectOrder: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/cancelSystemOrder';
        let paramsData = {
          id: item.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.loadData()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      receiveOrder: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/receiveSystemOrder';
        let paramsData = {
          id: item.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('接单成功！');
              this.loadData()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      grabbingOrder: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_staff_dispatch/dispatchMainOrder';
        let paramsData = {
          id: item.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('抢单成功！');
              this.loadData()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      change: function () {
        this.loadData()
      },
      loadData: function () {
        this.systemPushOrderList = []
        this.orderList = []
        if (this.active == 0) {
          // 新任务
          this.getSystemPushOrderList()
          this.getOhterOrderList()
        } else if (this.active == 1) {
          // 配送中
          this.getDeliveringOrderList()
        } else if (this.active == 2) {
          // 已结束
          this.getComplateOrderList()
        }
      },
      onRefresh: function () {
        this.loadData()
      },
      onLoad: function () {
        setTimeout(() => {
          this.loading = false
          this.finished = true
        }, 100)
      },
      toDetail: function (item) {
        if (this.active == 1) {
          this.$router.push({
            path: '/mall2/store-delivery/ordergrabbingdetail',
            query: {
              id: item.id
            }
          })
        } else {
          this.$router.push({
            name: 'storedeliveryordergrabbingdetail',
            params: {
              detail: item
            }
          })
        }
      },
      toPickup: function (item) {
        this.$bridgefunc.getLocation(locationinfo => {
          let longitude = locationinfo ? locationinfo.longitude : "";
          let latitude = locationinfo ? locationinfo.latitude : "";
          this.$bridgefunc.baiduNav({
            startlong: longitude,
            startlat: latitude,
            endlong: item.storePosx,
            endlat: item.storePosy
          })
        });
      },
      toMap: function (item) {
        console.log(item)
        this.$router.push({
          path: '/mall2/store-delivery/routemap',
          query: {
            routeData: JSON.stringify({
              storeOuName: item.storeOuName,
              storePosx: item.storePosx,
              storePosy: item.storePosy,
              address: item.address,
              receiverPosx: item.receiverPosx,
              receiverPosy: item.receiverPosy
            })
          }
        })
      },
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-grabbing-list {
    width 100%
    height 100%
    overflow hidden
    .content {
      width 100%
      height 100%
      overflow hidden;
      display flex;
      flex-direction column;
      >>>.van-tab--active {
        color #ee0a24;
      }
      >>>.van-pull-refresh {
        flex 1;
        overflow-y auto;
      }
      .tab-content {
        .item {
          margin 10px;
          overflow hidden;
          border-radius 5px;
          box-shadow 0 1px 8px #efefef;

          .btns-div {
            margin-top 10px;
            display flex;
            align-items center;
            .space {
              margin-left 10px;
            }
            .btn-gray {
              flex 1;
              text-align center;
              font-size 16px;
              line-height 36px;
              border-radius 20px;
              color #333;
            }
            .btn-red {
              flex 1;
              background-color #F80F16;
              color white;
              text-align center;
              font-size 16px;
              line-height 36px;
              border-radius 20px;
              display flex;
              align-items center;
              justify-content center;
              img {
                width 16px;
                height 16px;
                margin-right 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
