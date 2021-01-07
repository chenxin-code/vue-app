/**Created by liaoyingchao on 2019-05-13.*/

<template>
  <div class="index">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div>
        <div v-show="storeOuCode == ''">
          <div class="img">
            <img src="./img/saodianpu.png">
          </div>
        </div>
        <div v-show="storeOuCode != ''">
          <div class="img">
            <img src="./img/saoshangpin.png">
          </div>
          <div class="store-name">{{shopDetail.storeName}}</div>
          <div class="store-address">{{shopDetail.address}}</div>
        </div>

        <div class="btn theme_bg_red theme_font_white" v-if="storeOuCode != ''" @click="scanGoods">请扫描商品条码</div>
        <div class="btn theme_bg_red theme_font_white" v-else @click="scanShop">请扫描店铺二维码</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    data() {
      return {
        storeOuCode: '',
        pickupId: '',
        shopDetail: {},
        lastPath: ''
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      scanShop: function () {
        this.$bridgefunc.scanCode((dic) => {
          let code = dic.code
          let result = JSON.parse(code)
          this.storeOuCode = result.storeOuCode
          this.pickupId = result.pickupId
          // this.storeOuCode = this.$util.getUrlParam(code, 'storeOuCode')
          // this.pickupId = this.$util.getUrlParam(code, 'pickupId')
          if (this.storeOuCode == undefined || this.storeOuCode == null || this.storeOuCode == '' || this.pickupId == undefined || this.pickupId == '' || this.pickupId == null) {
            this.$Toast('店铺码错误，店铺码需要包括storeOuCode和pickupId')
            this.storeOuCode = ''
            this.pickupId = ''
          } else if (this.storeOuCode) {
            this._getStoreDetail(this.storeOuCode)
          }
        })
      },
      scanGoods: function () {
        if (this.$store.state.webtype == 1) {
          // let detailUrl = window.location.href.split('#')[0] + '#' + '/mall2/scanbuyproduct?storeoucode=' + this.storeOuCode + '&pickupId=' + this.pickupId
          // let checkouturl = window.location.href.split('#')[0] + '#' + '/mall2/scanbuyplaceorder?storeoucode=' + this.storeOuCode + '&pickupId=' + this.pickupId
          // this.$bridgefunc.scanGoods('扫码购物', '购物袋', '0', detailUrl, checkouturl, this.storeOuCode)
          this.$bridgefunc.scanCode((dic) => {
            let code = dic.code
            this.$router.push({
              path: '/mall2/scanbuywxlist',
              query: {
                code: code,
                storeOuCode: this.storeOuCode,
                pickupId: this.pickupId
              }
            })
          })
        } else {
          this.$bridgefunc.scanCode((dic) => {
            let code = dic.code.split(',')[1]
            this.$router.push({
              path: '/mall2/scanbuywxlist',
              query: {
                code: code,
                storeOuCode: this.storeOuCode,
                pickupId: this.pickupId
              }
            })
          })
        }
      },
      _getStoreDetail(storeOuCode) {
        this.$Loading.open();
        let url = '/app/json/app_store/getStoreDetail';
        let paramsData = {
          token: this.$store.state.login.token,
          storeOuCode: storeOuCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            this.$Loading.close();
            if (data.status == 0) {
              this.shopDetail = data.data || {}
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
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : '';
      this.$bridgefunc.setItem('scanbuy_cart_number', '0')
      window.localStorage.setItem('historyPros', JSON.stringify(this.historyPros))
      window.localStorage.removeItem('historyPros')
    },
    beforeRouteLeave (to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .index {
    width 100%
    height 100%
    overflow hidden

    .img {
      margin-top 40px;
      width 100%;
      height 300px;
      display flex;
      align-items center;
      justify-content center;

      img {
        max-width 300px;
        max-height 300px;
      }
    }

    .btn {
      margin 30px;
      padding 13px;
      font-size 18px;
      font-weight 500;
      border-radius 30px;
      text-align center;
    }

    .store-name {
      text-align: center
      font-size: 15px;
    }

    .store-address {
      text-align: center
      font-size: 12px;
      padding-top: 10px;
      color: #7e8c8d
    }
  }
</style>
