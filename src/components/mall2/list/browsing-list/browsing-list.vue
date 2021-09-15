/**Created by liaoyingchao on 2019/1/8.*/

<template>
  <div class="browsing-list mall2">
    <nav-top @backEvent="goBack" :noTitle="wxenvironment() ? true : ''" :showBackBtn="wxenvironment() ? false : true">
      <div class="right-btn edit-btn theme_font_tint" style="right: 0px; line-height: 44px; height: 44px; top: 0px; padding-right: 10px;" v-if="showList.length > 0">
        <span @click="clearAll" v-if="!isEdit">清空</span>
        <span @click="showEdit" v-if="!isEdit">编辑</span>
        <span @click="finishEdit" v-if="isEdit">完成</span>
      </div>
    </nav-top>
    <nav-content>
      <div class="my-content">
        <div class="my-list">
          <div class="item-div" v-for="item in showList">
            <div class="date-div">{{item.m}}月{{item.d}}日</div>
            <DetailList :showEdit="isEdit" @selectedItemEvent="selectedItemEvent" @productEvent="productEvent" @addToCart="addToCart" :listData="item.list"></DetailList>
          </div>
        </div>
        <div class="my-bottoms" v-if="isEdit && showList.length > 0">
          <div class="all-select" @click.stop="slecetAll">
            <i class="iconfont mall-xuanzhong theme_font_red" v-if="isSelectedAll() == true"></i>
            <i class="iconfont mall-weixuanzhong theme_font_gray" v-if="isSelectedAll() == false"></i>
            <span>全选</span>
          </div>
          <div class="delete-btn" @click="deleteEvent">删除</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import DetailList from '../base/detail-list'
  import appNav from '@zkty-team/x-engine-module-nav'
  import appLocalstorage from '@zkty-team/x-engine-module-localstorage'

  export default {
    name: "browsing-list",
    components: {
      DetailList
    },
    data() {
      return {
        browsingHistory: [],
        listData: [],
        showList: [],
        isEdit: false,
        deleteArr: [],
      }
    },
    methods: {
      wxenvironment() {
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
      },
      goBack: function () {
        if (this.$route.query.backApp) {
          appNav.navigatorBack({ url: '0' }).then( res => {
            console.log(res)
          })
        } else {
          this.$router.go(-1)
        }
      },
      deleteEvent: function () {
        let arr = [];
        let sArr = [];
        for (let i = 0; i < this.showList.length; i++) {
          let odItem = this.showList[i];
          let ol = odItem.list;
          odItem.list = [];
          let nItem = {
            y: odItem.y,
            m: odItem.m,
            d: odItem.d,
            list: []
          }
          for (let j = 0; j < ol.length; j++) {
            let oskuD = ol[j]
            if (oskuD.selected != true) {
              odItem.list.push(oskuD)
              nItem.list.push({
                skuId: oskuD.skuId,
                deliverType: oskuD.deliverType,
              })
            }
          }
          if (odItem.list.length > 0) {
            sArr.push(odItem)
            arr.push(nItem)
          }
        }
        this.showList = []
        this.$nextTick(() => {
          this.showList = sArr;
        })
        this.browsingHistory = arr;
        let jsonString = encodeURIComponent(JSON.stringify(this.browsingHistory))
        if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
          this.$bridgefunc.setItem('browsingHistory', jsonString, () => {})
        } else {
          appLocalstorage.set({
            key: 'browsingHistory',
            value: jsonString,
            isPublic: true,
          })
        }
      },
      isSelectedAll: function () {
        for (let i = 0; i < this.showList.length; i++) {
          let odItem = this.showList[i];
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            let oskuD = ol[j]
            if (oskuD.selected != true) {
              return false
            }
          }
        }
        if (this.showList.length > 0) {
          return true
        }
        return false
      },
      slecetAll: function () {
        let selV = true
        if (this.isSelectedAll()) {
          selV = false
        }
        let arr = []
        for (let i = 0; i < this.showList.length; i++) {
          let odItem = this.showList[i];
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            let oskuD = ol[j]
            oskuD.selected = selV
          }
          arr.push(odItem);
        }
        this.showList = []
        this.$nextTick(() => {
          this.showList = arr;
        })
      },
      selectedItemEvent: function (item) {
        for (let i = 0; i < this.showList.length; i++) {
          let odItem = this.showList[i];
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            let oskuD = ol[j]
            if (oskuD.skuId == item.skuId) {
              oskuD.selected = item.selected
              return ;
            }
          }
        }
      },
      finishEdit: function () {
        this.isEdit = false
      },
      showEdit: function () {
        this.isEdit = true
      },
      clearAll: function () {
        this.showList = [];
        this.browsingHistory = [];
        let jsonString = encodeURIComponent(JSON.stringify(this.browsingHistory))
        if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
          this.$bridgefunc.setItem('browsingHistory', jsonString, () => {})
        } else {
          appLocalstorage.set({
            key: 'browsingHistory',
            value: jsonString,
            isPublic: true,
          })
        }
      },
      addToCart: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            deliveryType: item.deliverType,
            number: 1,
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
              this.$store.state.mall2.cartNum = data.data
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
      getSkuItem: function (skuId) {
        let idx = -1
        let backItem = null;
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i]
          if (item.skuId == skuId) {
            idx = i;
            backItem = item;
            break ;
          }
        }
        if (idx > -1) {
          this.listData.splice(idx, 1);
        }
        return backItem
      },
      _loadProList: function (loaded) {
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          fromFrontPage: '1',
          token: this.$store.state.login.token,
          // deliverType: '2',
          skuIds: []
        };
        let skuArr = []
        for (let i = 0; i < this.browsingHistory.length; i++) {
          let odItem = this.browsingHistory[i];
          let ol = odItem.list;
          for (let j = 0; j < ol.length; j++) {
            let oskuD = ol[j]
            skuArr.push(oskuD.skuId)
          }
        }
        if (skuArr.length == 0) {
          return ;
        }
        paramsData.deliverType = this.$store.state.mall2.staticDeliverType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        } else {
          // //  配送
          let sad = this.$store.state.mall2.selectAddress;
          paramsData.area = {
            provinceId: sad.provinceId,
            cityId: sad.cityId,
            countryId: sad.countryId,
            countyId: sad.countryId,
            townId: sad.townId
          }
        }
        paramsData.skuIds = skuArr
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close()
            let data = res.data;
            if (data.status == 0) {
              this.listData = this.listData.concat(data.data.list);
              this.showList = []
              for (let i = 0; i < this.browsingHistory.length; i++) {
                let odItem = this.browsingHistory[i];
                let nItem = {
                  y: odItem.y,
                  m: odItem.m,
                  d: odItem.d,
                  list: []
                }
                let ol = odItem.list;
                for (let j = 0; j < ol.length; j++) {
                  let skuId = ol[j].skuId
                  let npro = this.getSkuItem(skuId);
                  if (npro) {
                    npro.deliverType = ol[j].deliverType
                    nItem.list.push(npro)
                  }
                }
                if (nItem.list.length > 0) {
                  this.showList.push(nItem)
                }
              }
            } else {

            }
          },
          error => {
            this.$Loading.close();
          }
        );
      },
    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
    activated() {
    },
    created() {
      if(this.wxenvironment()) {
        document.title = "我的足迹"
      }
      if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
        this.$bridgefunc.getItem('browsingHistory', (result) => {
          console.log('h5 localstorage', result)
          if (!result || result == '' || result == 'null' || result == undefined) {
            return;
          }
          let jsonString = result;
          let jsonData = JSON.parse(decodeURIComponent(jsonString))
          this.browsingHistory = jsonData
          this._loadProList();
        })
      } else {
        appLocalstorage
        .get({
          key: "browsingHistory",
          isPublic: true,
        })
        .then((result) => {
          let _result = result.result
          if (!_result || _result == '' || _result == 'null' || _result == undefined) {
            return;
          }
          let jsonString = _result;
          let jsonData = JSON.parse(decodeURIComponent(jsonString))
          this.browsingHistory = jsonData
          this._loadProList();
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .browsing-list {
    width 100%
    height 100%
    overflow hidden
    .edit-btn {
      font-size 14px;
      span {
        padding 10px 2px;
      }
    }
    .my-content {
      display flex;
      justify-content space-between;
      flex-direction column;
      height 100%;
      .my-list {
        position relative;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        flex 1;
        background: url('../../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
        .item-div {
          //font-size
          .date-div {
            font-size 24px;
            margin-left 20px;
            padding 12px 0px 10px;
            font-weight 500;
          }
        }
      }
    }
    .my-bottoms {
      position relative;
      z-index 10;
      box-shadow 0 -2px 2px #efefef;
      display flex;
      align-items center;
      .all-select {
        flex 1;
        padding-left 18px;
        i {
          font-size 18px;
        }
        span {
          padding 2px;
          font-size 14px;
        }
      }
      .delete-btn {
        padding 16px 20px;
        font-size 16px;
        font-weight 500;
      }
    }
  }
</style>
