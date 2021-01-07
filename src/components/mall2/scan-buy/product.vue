/**Created by liaoyingchao on 2019-05-13.*/

<template>
  <div class="product" v-if="loaded">
    <div class="img-div">
      <img :src="detailData.phMainUrl">
    </div>
    <div class="title single-line">{{detailData.showTitle}}</div>
    <div class="price">
      <PriceOrder :scanProduct="detailData"></PriceOrder>
    </div>
  </div>
</template>

<script>
  import PriceOrder from '@/components/commonui/price/price-order'
  export default {
    name: "product",
    components: {
      PriceOrder
    },
    data() {
      return {
        barCode: '',
        storeoucode: '',
        detailData: {},
        loaded: false,
        historyPros: []
      }
    },
    methods: {
      _getProductDetail: function () {
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          token: this.$store.state.login.token,
          barcode: this.barCode,
          pickupStoreOuCode: this.storeoucode
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.loaded = true
              this.detailData = data.data;
              let dpedData = this.$mallCommon.priceFromItem(this.detailData)
              this.detailData.dpedData = dpedData;

              let skuId = this.detailData.skuId
              let isHas = false
              // 如果重复，数量加1
              for (let i = 0; i < this.historyPros.length; i++) {
                let itm = this.historyPros[i]
                if (itm.skuId == skuId) {
                  isHas = true
                  itm.number += 1;
                  // this.historyPros.splice()
                  break ;
                }
              }

              if (!isHas) {
                this.historyPros.push({
                  skuId: this.detailData.skuId,
                  storeOuCode: this.storeoucode,
                  number: 1,
                  checked: 1
                })
              }
              window.localStorage.setItem('historyPros', JSON.stringify(this.historyPros))
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
    },
    created() {
      let str = window.localStorage.getItem('historyPros')
      if (str && str != undefined && str != '') {
        this.historyPros = JSON.parse(str)
      } else {
        this.historyPros = []
      }
      this.storeoucode = this.$route.query.storeoucode
      this.barCode = this.$route.query.code
      this._getProductDetail()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .product {
    /*width 100%*/
    /*height 100%*/
    padding 15px;
    overflow hidden
    text-align center;

    .img-div {
      display inline-block;

      img {
        display block;
        width 160px;
        height 160px;
      }
    }
    .title {
      font-size 16px;
      font-weight 500;
      padding 10px 0;
    }
  }
</style>
