<template>
  <div class="bottom">
    <nav-top @backEvent="backEvent" :title="pageType == 3 ? '附件的商铺' : '自提站点'"></nav-top>
    <nav-content>
      <div class="search">
        <div class="loacl-div" @click="selectArea">
          <div class="text theme_font_common">{{regionText}}</div>
          <div class="arrow">
            <i class="iconfont mall-arrow-down theme_font_common"></i>
          </div>
        </div>
        <div class="graybg theme_bg_white_ef">
          <i class="iconfont mall-sousuo theme_font_tint" @click="sraechClick"></i>
          <form class="search-input" action="" id="form1">
            <input style="display: none" type="text" name="keyword"/>
            <input class="search-input" type="search"
                   placeholder="输入您想查找的自提点名称" @keyup.enter="sraechClick" v-model="searchStr">
          </form>
        </div>
      </div>
      <div class="site-list-div">
        <sitelist :selectedId="$store.state.mall2.zitiAddress.id" :showDistance="true" :site-list="siteList1"
                  @selectsite="selectItem" :pageType="pageType"></sitelist>
        <div class="no-stock" v-if="siteList2.length > 0">以下自提点无货</div>
        <sitelist :selectedId="$store.state.mall2.zitiAddress.id" :showDistance="true" :site-list="siteList2"
                  @selectsite="selectItem" :pageType="pageType"></sitelist>
      </div>
    </nav-content>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent"
                  @closeEvent="regionCloseEvent"></RegionSelect>
  </div>
</template>

<script>
  import Sitelist from './site-lists'
  import userCenter from '../../usercenter/js/userCenter'
  import Vue from 'vue'
  import RegionSelect from '../../base/region-select'
  import { Dialog } from 'vant';

  export default {
    name: 'sites',
    components: {
      Sitelist,
      RegionSelect
    },
    data() {
      return {
        searchStr: '',
        isShowSureBtn: false,
        siteList1: [],
        siteList2: [],
        selectedSite: {},
        initData: {
          title: '请选择地区',
          initAreas: [this.$store.state.indexData.province, this.$store.state.indexData.city],
          canNotReselect: true
        },
        showSelect: false,
        regionText: '附近',
        region: [],
        areaData: {
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          countryId: '',
          countryName: '',
          townId: '',
          townName: ''
        },
        pageType: 0,
        skuIds: [],
        tags: [],
        productType: ''
      }
    },
    methods: {
      selectArea: function () {
        this.initData = {
          title: '请选择地区',
          initAreas: [this.$store.state.indexData.province, this.$store.state.indexData.city]
        }
        //选择省市区
        this.showSelect = !this.showSelect;
        if (this.showSelect == true) {
          this._getRegionData(0);
        }
      },
      selectedItemsEvent: function (selectedValue) {
        let item = selectedValue.item;
        this.selectedItems = selectedValue.selecteds;
        if (this.selectedItems.length == 3) {
          this.showSelect = false;
          this.region = this.selectedItems;
          this.getRegionText();
          return;
        }
        this._getRegionData(item.id)
      },
      regionCloseEvent: function () {
        this.showSelect = false;
      },
      _getRegionData: function (parentId) {
        this.$Loading.open()
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length > 0) {
              this.$refs.regionselect.pushCustomOptions(arr);
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取失败', error);
          this.$Toast('获取数据失败')
        });
      },
      getRegionText: function () {
        let str = ''
        let address = {
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          countryId: '',
          countryName: '',
          townId: '',
          townName: ''
        }
        address.id = '-1';
        for (let i = 0; i < this.region.length; i++) {
          let item = this.region[i]
          str = item.name
          if (i == 0) {
            address.provinceId = item.id
            address.provinceName = item.name
          } else if (i == 1) {
            address.cityId = item.id
            address.cityName = item.name
          } else if (i == 2) {
            address.countryId = item.id
            address.countryName = item.name
          } else if (i == 3) {
            address.townId = item.id
            address.townName = item.name
          }
        }
        address.addressFull = address.provinceName + address.cityName + address.countryName + address.townName
        this.areaData = address;
        this._getsitelist();
        this.regionText = str;
        this.$refs.regionselect.reset(null);
      },
      backEvent: function () {
        // if (this.$store.state.mall2.zitiAddress.id == '') {
        //   this.$Toast('请先选择一个自提点！')
        //   return ;
        // }
        this.$router.go(-1)
      },
      sureEvent: function () {
        console.log('testFunc')
      },
      sraechClick: function () {//搜索
        this._getsitelist();
      },
      _getsitelist: function () {//自提站点
        this.$Loading.open();
        let url = '/app/json/user_address/searchSelfliftAddressList';
        if (this.productType == 6) {
          url = '/app/json/store/getStoreList';
        }
        let params1 = {
          storeName: this.searchStr,
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy,
          token: this.$store.state.login.token,
          provinceId: this.areaData.provinceId,
          cityId: this.areaData.cityId,
          countryId: this.areaData.countryId,
          townId: this.areaData.townId,
          page: {
            index: 1,
            pageSize: 50
          },
          skuIds: this.skuIds
        }
        if (this.isOpenCard && this.productType != 6) {
          params1.isOpenCard = this.isOpenCard
        }
        if (this.tags) {
          params1.storeOuCodeList = this.tags
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('自提站点列表:', data);
          if (data.status == 0) {
            let list = data.data
            let list1 = []
            let list2 = []
            for (let i = 0; i < list.length; i++) {
              let item = list[i]
              if (item.hasStock == 1) {
                list1.push(item)
              } else {
                list2.push(item)
              }
            }
            this.siteList1 = list1
            this.siteList2 = list2
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('自提站点', error);
          this.$Toast('获取自提站点失败')
        });
      },
      selectItem: function (item) {//选中

        if (!this.$store.state.addPickupAddressType) {
          Dialog.confirm({
            title: '提示',
            message: '是否自动加入到我的自提点',
            cancelButtonText: '不加入',
            confirmButtonText: '自动加入'
          }).then(() => {
            // on confirm
            this.$store.state.addPickupAddressType = 1;
            this.selectAddress(item)
          }).catch(() => {
            // on cancel
            this.$store.state.addPickupAddressType = 2;
            this.selectAddress(item)
          });
        } else {
          this.selectAddress(item)
        }
      },
      selectAddress: function (item) {
        this.selectedSite = item;
        Vue.set(this.$store.state.mall2, 'zitiAddress', item);
        userCenter._addToMyPickupAddress(item.id)
        userCenter._setDefaultPickupAddress(item.id)
        this.$bridgefunc.vuexStorage()
        if (this.pageType == 3) {
          //  从选择商铺进来的
          this.$store.state.mall2.staticDeliverType = 1;
          let path = '/mall2/list/' + this.$util.getDataString()
          this.$router.push({
            path: path,
            query: {
              lastPath: this.$route.path,
              productType: this.productType
            }
          })
        } else {
          this.backEvent();
        }
      }
    },
    created() {
      this.tags = this.$route.query.tags ? this.$route.query.tags : '';
      this.skuIds = this.$route.query.skuIds ? JSON.parse(this.$route.query.skuIds) : [];
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : 0;
      this.productType = this.$route.query.productType || ''
      this.isOpenCard = this.$route.query.isOpenCard || ''

      if (this.pageType == 3) {
        document.title = '附件的商铺'
      }
      this._getsitelist();
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
  .bottom {
    width 100%
    height 100%
    /*overflow hidden*/
    .search {
      /*position absolute*/
      margin 3px 8px;
      // border-radius 8px;
      padding 8px 8px
      overflow hidden;
      display flex;
      align-items center;
      .loacl-div {
        padding 6px 8px 6px 0px;
        display flex;
        align-items center;
        .text {
          font-size 12px;
        }
        .arrow {
          margin-left 3px;
          font-size 12px;
        }
      }
      .graybg {
        height 30px
        border-radius: 20px;
        -webkit-border-radius: 20px;
        flex 1;
        display flex
        align-items center
        overflow hidden
        //background-color rgb(239,239,239)
        //.sraech-btn{
        //margin-left 20px
        // width 40px
        //height 40px
        //}
        i {
          margin-left 5px;
          padding 7px;
          font-size 16px
        }
        .search-input {
          flex 1
          padding-right 8px;
          height 100%;
          input {
            background none
            border none
            height 100%;
            font-size $font-size-medium
            width 100%;
          }
        }
      }
    }
    .site-list-div {
      position absolute
      top 52px;
      right 0px;
      left 0px;
      bottom 0px;
      overflow-y scroll
      -webkit-overflow-scrolling touch

      .no-stock {
        padding 5px 10px;
        font-size 14px;
        color #666;
      }
    }
    .sitelist1 {
      position absolute
      top 46px;
      right 0px;
      left 0px;
      bottom 0px;
      overflow-y scroll
      -webkit-overflow-scrolling touch
    }

    .bottom-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      display flex
      align-items center
      text-align: center;
      p {
        width 100%
        color: white;
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }
  }

</style>
