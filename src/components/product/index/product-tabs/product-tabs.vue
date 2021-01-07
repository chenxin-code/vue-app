<template>
  <div>
    <div class="product-list" :style="$market.getModuleBgStyle(moduleData)">
      <!--<div class="tabs">-->
        <!--<div class="tab" :class="{selected: selectedId == idx}" v-for="(item, idx) in moduleData.tabs"-->
             <!--@click="selectChannel(item, idx)">-->
          <!--<div class="tab-cont" :class="{'left-bdr': idx != 0}">-->
            <!--<div class="title">{{item.title}}</div>-->
            <!--<div class="line"></div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <HScroll :dataList="moduleData.tabs" :click="false">
        <div class="tab" :class="{selected: selectedId == idx}" v-for="(item, idx) in moduleData.tabs"
             @click="selectChannel(item, idx)" :key="idx">
          <div class="tab-cont" :class="{'left-bdr': idx != 0}">
            <div class="title">{{item.title}}</div>
            <div class="line"></div>
          </div>
        </div>
      </HScroll>
      <HScroll :dataList="sections" :click="false">
        <div class="section" v-for="(item, idx) in sections" @click="sectionEvent(idx)" :key="idx">
          <div class="btn line_circle" :class="{'selected': sectionIdx == idx}">{{item.name}}</div>
        </div>
      </HScroll>
      <!--<div class="sections">-->
        <!--<div class="section line_circle" :class="{'selected': sectionIdx == idx}" v-for="(item, idx) in sections" @click="sectionEvent(idx)">{{item.name}}</div>-->
      <!--</div>-->
      <div class="tip theme_bg_yl theme_font_red" v-if="showTip">活动已结束，以下商品将会以原价进行购买</div>
      <div class="no-products" v-if="dataLoaded && moduleData.rows.length == 0">
        <div class="img-div">
          <img src="static/image/mall2/no-data-img.png">
        </div>
        <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
      </div>
      <ProductListGrid :myIndex="myIndex" :usePorpData="usePorpData" :propData="propData"
                        v-if="moduleData.type == '1'"></ProductListGrid>
    </div>
  </div>
</template>

<script>
  import ProductListGrid from '../product-list/product-list-grid';
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'

  export default {
    name: 'product-tabs',
    components: {
      ProductListGrid,
      HScroll
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      }
    },
    data() {
      return {
        page: 1,
        showTip: false,
        deliveryTypes: [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }, {
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }],
        dataLoaded: false,
        filterType: 0,
        cateText: '全部分类',
        cateData: null,
        filterBrands: [],
        filterFeatureies: [],
        maxPrice: '',
        minPrice: '',
        selectedItem: {},
        selectedId: 0,
        sectionIdx: 0,
        sections: [{
          name: '全部',
          min: '',
          max: ''
        }, {
          name: '0-500',
          min: '0',
          max: '500'
        }, {
          name: '500-1000',
          min: '500',
          max: '1000'
        }, {
          name: '1000-2000',
          min: '1000',
          max: '2000'
        }, {
          name: '2000-5000',
          min: '2000',
          max: '5000'
        },{
          name: '5000-10000',
          min: '5000',
          max: '10000'
        },{
          name: '10000以上',
          min: '10000',
          max: ''
        }],
        selectedSection: {},
        allProducts: []
      };
    },
    methods: {
      sectionEvent: function (idx) {
        this.sectionIdx = idx
        this.selectedSection = this.sections[idx]
        this.screenProducts()
      },
      screenProducts: function () {
        if (this.sectionIdx == 0) {
          this.moduleData.rows = this.allProducts;
          return ;
        }
        let arr = []
        for (let i = 0; i < this.allProducts.length; i++) {
          let item = this.allProducts[i]
          let points = item.points
          let min = this.selectedSection.min
          let max = this.selectedSection.max
          if (min && max) {
            if (points >= min && points <= max) {
              arr.push(item)
            }
          } else if (min) {
            if (points >= min) {
              arr.push(item)
            }
          }
        }
        this.moduleData.rows = arr
      },
      selectChannel: function (item, idx) {
        this.selectedId = idx
        this.selectedItem = item
        this.getProducts()
      },
      getProducts: function () {
        // if (this.moduleData.useApi == 2) {
        //   this._getCurrentDatas()
        // } else if (this.moduleData.useApi == 3) {
        //   this._getCurrentDatas()
        // } else if (this.moduleData.useApi == 4) {
        //   this._getCurrentDatas()
        // }
        this._getCurrentDatas()
      },
      _getCurrentDatas: function () {
        // let url = this.$market.apiBaseURL() + '/app/json/product/getAppDesigneList';
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        // if (this.usePorpData != true) {
        //   url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        // }
        let paramsData = {
          token: this.$store.state.login.token,
          // deliverType: '2',
          // 品牌筛选
          brandIds: this.filterBrands,
          featureIds: this.filterFeatureies,
          // 价格筛选
          maxPrice: this.maxPrice,
          minPrice: this.minPrice
        };
        paramsData.page = 1
        paramsData.rows = 100
        paramsData.rows = this.selectedItem.productFrom.number
        if (this.selectedItem.useApi == 1) {
          let cate = this.selectedItem.productFrom.cate;
          paramsData.clsType = cate.clsType
          paramsData.categoryId = cate.id
          paramsData.cateLevel = cate.cateLevel
        } else if (this.selectedItem.useApi == 2) {
          let activity = this.selectedItem.productFrom.activity;
          paramsData.activityId = activity.activityId
        }

        // if (this.cateData) {
        //   paramsData.clsType = this.cateData.clsType
        //   paramsData.categoryId = this.cateData.id
        //   paramsData.cateLevel = this.cateData.cateLevel
        // }

        paramsData.deliverType = this.$store.state.mall2.staticDeliverType
        if (paramsData.deliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
          paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode;
        } else {
          let sad = this.$store.state.mall2.selectAddress;
          paramsData.area = {
            provinceId: sad.provinceId,
            cityId: sad.cityId,
            countryId: sad.countryId,
            countyId: sad.countryId,
            townId: sad.townId
          }
        }

        if (this.$store.state.webtype != '-1') {
          this.$Loading.open();
        }
        this.$http.post(url, paramsData).then(
          res => {
            if (this.$store.state.webtype != '-1') {
              this.$Loading.close();
            }
            this.dataLoaded = true;
            let data = res.data;
            if (data.status == 0) {
              let list = data.data.list;
              if (this.page == 1) {
                this.moduleData.rows = []
                for (let i = 0; i < list.length; i++) {
                  let item = this.$market.dataProcessing(list[i])
                  this.moduleData.rows.push(item)
                }
                this.allProducts = this.moduleData.rows;
                if (this.selectedItem.useApi == 3 && this.moduleData.rows.length > 0) {
                  let item = this.moduleData.rows[0]
                  let mktEndDate = item.mktEndDate
                  if (mktEndDate && mktEndDate != undefined && mktEndDate != '') {
                    let mktDate = this.getDateFromString(mktEndDate)
                    let nowDate = parseInt((new Date()).getTime() / 1000)
                    if (mktDate == 0 || mktDate < nowDate) {
                      this.showTip = true
                    } else {
                      this.showTip = false
                    }
                  }
                }
                this.sectionEvent(0)
              } else {
                let arr = []
                for (let i = 0; i < list.length; i++) {
                  let item = this.$market.dataProcessing(list[i])
                  arr.push(item)
                }
                this.moduleData.rows = this.moduleData.rows.concat(arr)
              }
              if (list.length >= 10) {
                this.$emit('loadedEvent', true)
              } else {
                this.$emit('loadedEvent', false)
              }
            } else {
              this.page--
              this.$emit('loadedEvent', false)
            }
          },
          error => {
            if (this.$store.state.webtype != '-1') {
              this.$Loading.close();
            }
            this.page--
            this.$emit('loadedEvent', false)
          }
        );
      },
      getDateFromString(str) {
        if (str == '' || str == null || str == undefined) {
          return 0
        }
        // 精确到秒
        str = str.replace(/-/g, '/');
        return parseInt((new Date(str)).getTime() / 1000)
      },
    },
    created() {
      this.moduleData.rows = [];
      let tab = this.moduleData.tabs[0]
      this.selectChannel(tab, 0)
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .product-list {
    width: 100%;
    height: 100%;

    .sections {
      width 100%;
      white-space: nowrap;
      overflow-x:auto;
      overflow-y:hidden;
      font-size 0;
      padding 0 10px;
    }
    .section {
      display inline-block;
      padding 10px 5px;
      .btn {
        font-size 14px;
        border-radius 14px;
        padding 5px 15px;
        padding 5px 15px;
        &.selected {
          background-color #649EF3;
        }
      }
    }

    .tabs {
      width 100%;
      white-space: nowrap;
      overflow-x:auto;
      overflow-y:hidden;
      font-size 0;
    }
    .tab {
      display inline-block;
      .tab-cont {
        padding 6px 15px;
      }
      .left-bdr {
        position relative;
        &.left-bdr:before {
          content: " ";
          position: absolute;
          left 0;
          top: 10px;
          bottom 12px;
          width 1px;
          border-left: 1px solid #ddd;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
      .title {
        font-size 14px;
        padding 4px 0;
        margin 4px 0;
        font-weight 600;
      }

      .line {
        height 2px;
      }

      &.selected {
        .title {
          color #649EF3;
        }

        .line {
          background-color #649EF3;
        }
      }
    }

    .tip {
      font-size 12px;
      padding 5px 10px;
    }

    .channels-div {
      overflow-x auto;
      display flex;
      flex-wrap: nowrap
      align-items center

      .channel {
        padding 10px 5px 5px;
        text-align center;
        flex 1;
        min-width 20%;
        font-size 14px;

        &.selected {
          font-size 16px;
          font-weight 600;
        }
      }
    }

    .no-products {
      .img-div {
        margin-top 20px;
        text-align center;

        img {
          width 160px;
        }
      }

      .tip {
        margin-top 10px;
        padding 10px;
        font-size 12px;
        text-align center;
      }
    }
  }
</style>
