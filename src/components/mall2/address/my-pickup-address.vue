/**Created by liaoyingchao on 2018/12/11.*/

<template>
  <div class="my-pickup-address mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll-div" v-if="myList.length > 0">
        <sitelist :pageType="pageType" :selectedId="$store.state.mall2.zitiAddress.id" :showDistance="true" :site-list="myList" @selectsite="selectItem" @deletePickupAddress="deletePickupAddress" ></sitelist>
      </div>
      <div class="bottom-btn theme_bg_red theme_font_white" @click="addPickupAddress">添加常用自提点</div>
    </nav-content>
  </div>
</template>

<script>
  import Sitelist from './site-lists'

  export default {
    name: "my-pickup-address",
    components: {
      Sitelist
    },
    data() {
      return {
        myList: [],
        reSetPickupAddress: false,
        pageType:0,
        skuIds: [],
        productType: ''
      }
    },
    methods: {
      _setDefaultPickupAddress: function (pAddress) {
        this.reSetPickupAddress = false
        let url = '/app/json/user_address/addDefaultAddress';
        let params1 = {
          token: this.$store.state.login.token,
          selfId: pAddress.id
        }
        this.$store.state.mall2.zitiAddress == pAddress

        this.$http.post(url, params1).then(res => {
        }, error => {
        });
      },
      deletePickupAddress: function (item) {
        if (item.id == this.$store.state.mall2.zitiAddress.id) {
          this.reSetPickupAddress = true
        }
        let url = '/app/json/user_address/deleteUserAddressSelflift';
        let params1 = {
          token: this.$store.state.login.token,
          storeId: item.id
        }

        this.$Loading.open()
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this._getAddressList()
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
        });
      },
      addPickupAddress: function () {
        let path = '/mall2/selfliftingsite';
        let query = {
          productType: this.productType,
          skuIds: JSON.stringify(this.skuIds)
        }
        if (this.isOpenCard) {
          query.isOpenCard = this.isOpenCard
        }
        if (this.pageType == '0') {
          this.$router.replace({
            path: path,
            query: query
          })
        } else {
          this.$router.push({
            path: path,
            query: query
          })
        }
      },
      _setDefaultPickupAddress: function (id) {
        let url = '/app/json/user_address/addDefaultAddress';
        let params1 = {
          token: this.$store.state.login.token,
          selfId: id
        }
        this.$http.post(url, params1).then(res => {
        }, error => {
        });
      },
      selectItem: function (selected) {
        if (this.pageType != 5) {
          if (this.$store.state.mall2.zitiAddress.id == selected.id) {
            this.backEvent();
            return ;
          }
        }
        if (this.pageType == '0' || this.pageType == '5') {
          this.$store.state.mall2.zitiAddress = selected;
          this._setDefaultPickupAddress(selected.id)
          this.$bridgefunc.vuexStorage()
          this.backEvent();
        }
      },
      // 我的自提点
      _getAddressList: function () {//获取我的自提点
        this.$Loading.open();
        let url = '/app/json/user_address/loadUserAddressSelfliftList';
        let params1 = {
          token: this.$store.state.login.token,
          posx:this.$store.state.currentLocation.posx,
          posy:this.$store.state.currentLocation.posy,
          skuIds: this.skuIds
        }
        if (this.isOpenCard) {
          params1.isOpenCard = this.isOpenCard
        }
        if (this.productType == 6) {
          params1.productType = this.productType
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            // 当选中的自提点被删除的时候，重新赋值新的自提点被选中，并且同步到服务器
            if (arr.length > 0) {
              if (this.reSetPickupAddress) {
                this._setDefaultPickupAddress(arr[0]);
              }
            }
            this.myList = arr;
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.skuIds = this.$route.query.skuIds ? JSON.parse(this.$route.query.skuIds): [];
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : '0'
      this.productType = this.$route.query.productType || ''
      this.isOpenCard = this.$route.query.isOpenCard || ''
      this._getAddressList();
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-pickup-address {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 50px;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
    }
    .bottom-btn {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      padding 16px;
      font-size 18px;
      font-weight 500;
      text-align center;
    }
  }
</style>
