/**Created by liaoyingchao on 2020-07-29.*/

<template>
  <div class="new-recommend">
    <div class="recommend-row">
      <div class="title theme_border_red">同店好货</div>
    </div>
    <div class="list">
      <CardList @productEvent="productEvent" :listData="listData"></CardList>
    </div>
  </div>
</template>

<script>
  import CardList from '../../list/base/card-list'

  export default {
    name: "index",
    components: {
      CardList
    },
    props: ['skuId', 'deliveryType'],
    data() {
      return {
        listData: []
      }
    },
    methods: {
      productEvent: function (product) {
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2){
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: product.id,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType,
          }
        })
      },
      _getRecommendData: function () {
        let url = '/app/json/product/getAppHotProSkuSaleListModel';
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: this.skuId,
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy,
          deliverType: this.deliveryType,
          proHotType:1
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.listData = data.data.list;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      this._getRecommendData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .new-recommend {
    overflow hidden;

    .recommend-row {
      background-color white;
      display flex;
      padding 10px 8px 10px;
      margin-top: 20px;
      .title {
        font-size 14px;
        padding-left 6px;
        border-left-width 3px;
        border-left-style solid;
      }
    }
    .list {
      background-color #f5f5f5;
    }
  }
</style>
