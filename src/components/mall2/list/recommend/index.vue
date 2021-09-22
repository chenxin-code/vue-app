/**Created by liaoyingchao on 2018/11/28.*/

<template>
  <div class="recommend mall2">
    <div class="title">热门商品</div>
    <div class="list-content">
      <CardList @productEvent="productEvent" @addToCart="addToCart" :listData="listData"></CardList>
    </div>
  </div>
</template>

<script>
  import CardList from '../base/card-list'

  export default {
    name: "recommend",
    components: {
      CardList
    },
    data() {
      return {
        deliverType: this.$store.state.mall2.staticDeliverType,
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
      addToCart: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            activityId:this.activityId,
            selfActivityId:item.activityId,
            number: 1
          }],
          deliveryType: item.deliverType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data;
              this.$Toast("添加购物车成功！")
              this.$emit('addCartFinish');
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
      _loadProList: function () {
        this.listData = [];
        this.$Loading.open();
        let url = '/app/json/product/getAppHotProSkuSaleListModel';
        let paramsData = {
          token: this.$store.state.login.token,
          page: 0,
          rows: 20,
          orderByKey: '',
          ascOrDesc: '',
          deliverType: this.deliverType,
          collectType: 1,
          proHotType:2
        };
        if (this.deliverType == 1) {
          //  自提
          let zitiad = this.$store.state.mall2.zitiAddress;
          paramsData.pickUpId = zitiad.id
        } else {
          // //  配送
          // let sad = this.$store.state.mall2.selectAddress;
          // paramsData.area = {
          //   provinceId: sad.provinceId,
          //   cityId: sad.cityId,
          //   countryId: sad.countryId,
          //   townId: sad.townId
          // }
        }
        // 修改为自提也需要这个，虽然不懂，但是接口需要就传了
        let sad = this.$store.state.mall2.selectAddress;
        paramsData.area = {
          provinceId: sad.provinceId,
          cityId: sad.cityId,
          countryId: sad.countryId,
          countyId: sad.countryId,
          townId: sad.townId
        }
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = data.data.list;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          });
      },
    },
    created() {

      this._loadProList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .recommend {
    width 100%
    overflow hidden
    .title {
      padding 12px 0px 8px;
      text-align center;
      font-size 16px;
    }
  }
</style>
