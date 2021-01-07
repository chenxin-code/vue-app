/**Created by liaoyingchao on 2019-04-30.*/

<template>
  <div class="submit-finished">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="order-info">
          <div class="finished-icon">
            <i class="iconfont mall-xuanzhong theme_font_red"></i>
          </div>
          <div class="text theme_font_common">您已下单成功</div>
          <div class="btn theme_bg_red theme_font_white" @click="checkOrders">查看订单</div>
          <div class="text-btn theme_font_gray" v-if="phone != ''">客服电话：<a :href="'tel:' + phone" class="theme_font_gray">{{phone}}</a></div>
        </div>
        <div class="other-pros" v-if="listData.length > 0">
          <div class="title theme_font_common">其他推荐</div>
          <ListComponent :listData="listData"></ListComponent>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import ListComponent from './base/list-component'

  export default {
    name: "submit-finished",
    components: {
      ListComponent
    },
    data() {
      return {
        phone: '',
        listData: []
      }
    },
    methods: {
      checkOrders: function () {
        this.$router.replace({
          path: '/mall2/purchaseorderlist'
        })
      },
      getListData: function () {
        let url = '/app/json/pro_sku_purchase/queryPurchaseList'
        let paramsData = {
          deliverType: this.$store.state.mall2.staticDeliverType,
          pickupId: this.$store.state.mall2.zitiAddress.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            // this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            // this.$Loading.close();
            // this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      let carts = this.$store.state.microSho.groupbuyingCarts
      let cartsNew = []
      carts.forEach((element,index) => {
        if (!element.checked) {
          cartsNew.push(element)
        }
      })
      this.$store.state.microSho.groupbuyingCarts = cartsNew
      this.phone = this.$route.query.customerPhone || '010-62669197'
      this.getListData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .submit-finished {
    width 100%
    height 100%
    background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
    overflow hidden;

    .scroll-div {
      width 100%
      height 100%
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .order-info {
        text-align center;
        .finished-icon {
          margin-top 20px;
          i {
            font-size 60px;
          }
        }
        .text {
          margin-top 10px;
          font-size 14px;
        }
        .btn {
          margin-top 12px;
          display inline-block;
          width 70%;
          padding 12px;
          font-size 16px;
          font-weight 500;
          border-radius 30px;
        }
        .text-btn {
          padding 10px;
        }
      }
      .other-pros {
        .title {
          margin-top 15px;
          text-align center;
          font-size 16px;
        }
      }
    }
  }
</style>
