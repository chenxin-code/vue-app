<template>
  <div v-if="showProductInfiinite">
    <div class="product-list" :style="$market.getModuleBgStyle(moduleData)">
      <div class="delivery-types" v-if="moduleData.hasDeliverTabs == true">
        <div class="type-btn"
             :class="{theme_bg_ml_red: $store.state.mall2.staticDeliverType == item.tag, theme_border_red_i: $store.state.mall2.staticDeliverType == item.tag}"
             @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">
          <i class="iconfont theme_font_common icon-size"
             :class="[item.fontclass, {theme_font_red_i: $store.state.mall2.staticDeliverType == item.tag}]"></i>
          <span class="theme_font_common single-line"
                :class="{theme_font_red_i: $store.state.mall2.staticDeliverType == item.tag}">{{item.text}}</span>
        </div>
        <div class="space"></div>
        <div class="local-div" @click="selectAddressClick()">
          <span class="theme_font_gray single-line" v-if="$store.state.mall2.staticDeliverType == 2">{{$store.state.mall2.selectAddress.addressFull}}</span>
          <span class="theme_font_gray single-line" v-if="$store.state.mall2.staticDeliverType == 1 && $store.state.globalConfig.app_home_special_flag != 'cnooc'">{{$store.state.mall2.zitiAddress.storeName}}</span>
          <i class="iconfont mall-dingwei icon-size theme_font_gray" v-if="$store.state.mall2.staticDeliverType == 2 && $store.state.globalConfig.app_home_special_flag == 'cnooc'"></i>
        </div>
      </div>
      <div class="row row-filter top-showdow" v-if="moduleData.hasFilters == true">
        <div class="filter-btn theme_font_black" @click="categoryEvent" v-if="moduleData.useApi != 2">
          <i class="iconfont mall-datubiao filter-size-1 theme_font_black"></i>
          <span>{{cateText}}</span>
        </div>
        <div class="filter-btn theme_font_black" @click="filterEvent(0)">
          <span :class="{theme_standard_font_i: filterType == 0}">综合排序</span>
        </div>
        <div class="filter-btn theme_font_black" @click="filterEvent(1)">
          <span :class="{theme_standard_font_i: filterType == 1 || filterType == 2}">销量</span>
        </div>
        <div class="filter-btn theme_font_black" @click="filterEvent(2)">
          <span :class="{theme_standard_font_i: filterType == 3 || filterType == 4}">价格</span>
          <div v-show="filterType == 3 || filterType == 4">
            <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
               :class="{theme_standard_font_i: filterType == 3}"></i>
            <i class="iconfont mall-xiala arrow-icon theme_font_tint"
               :class="{theme_standard_font_i: filterType == 4}"></i>
          </div>
        </div>
        <div class="filter-btn theme_font_black" @click="superFilter">
          <span>筛选</span>
          <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
        </div>
      </div>
      <div ref="Van_Tabs_Div" v-if="isEnableNewTabStyle()">
        <div v-if="moduleData.useApi == '4'">
          <!--频道组-->
          <van-tabs v-model="active" swipeable sticky :offset-top="getTopHeight()" @change="channelChanged">
            <van-tab v-for="(channel, idx) in moduleData.channels" :title="channel.name" :key="idx">
              <div class="tip theme_bg_yl theme_font_red" v-if="showTip">活动已结束，以下商品将会以原价进行购买</div>
              <div class="no-products" v-if="dataLoaded && moduleData.rows.length == 0">
                <div class="img-div">
                  <img src="static/image/mall2/no-data-img.png">
                </div>
                <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
              </div>
              <ProductListGrid :myIndex="-1" :usePorpData="usePorpData" :propData="propData"
                               v-if="dataLoaded || usePorpData != true" :isRMBEnd="moduleData.useApi == '3' && moduleData.showTabs ? '1' : '0'"></ProductListGrid>
            </van-tab>
          </van-tabs>
        </div>
        <div v-if="moduleData.useApi == '3'">
          <!--3 活动tabs-->
          <van-tabs v-model="active" swipeable sticky :offset-top="getTopHeight()" @change="tabsChanged">
            <van-tab v-for="(tab, idx) in moduleData.showTabs" :title="tab.title" :key="idx">
              <HScroll :dataList="sections" :click="false" v-if="sections.length > 0">
                <div class="section" v-for="(item, idx) in sections" @click="sectionEvent(idx)">
                  <div class="btn line_circle" :class="{'selected': sectionIdx == idx}">{{item.name}}</div>
                </div>
              </HScroll>
              <div class="tip theme_bg_yl theme_font_red" v-if="showTip">活动已结束，以下商品将会以原价进行购买</div>
              <div class="no-products" v-if="dataLoaded && moduleData.rows.length == 0">
                <div class="img-div">
                  <img src="static/image/mall2/no-data-img.png">
                </div>
                <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
              </div>
              <ProductListGrid :myIndex="-1" :usePorpData="usePorpData" :propData="propData"
                               v-if="dataLoaded || usePorpData != true" :isRMBEnd="moduleData.useApi == '3' && moduleData.showTabs ? '1' : '0'"></ProductListGrid>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <div v-else>
        <div class="channels-div" v-if="moduleData.useApi == '4' && moduleData.channels && moduleData.channels.length > 1">
          <div class="channel" :class="{selected: selectedChannel && selectedChannel.id == channel.id}"
               v-for="channel in moduleData.channels" @click="selectChannel(channel)">{{channel.name}}
          </div>
        </div>
        <HScroll :dataList="moduleData.tabs" :click="false" v-if="moduleData.useApi == '3' && moduleData.showTabs">
          <div class="tab" :class="{selected: selectedId == idx}" v-for="(item, idx) in moduleData.tabs"
               @click="selectTabs(item, idx)">
            <div class="tab-cont" :class="{'left-bdr': idx != 0}">
              <div class="title">{{item.title}}</div>
              <div class="line"></div>
            </div>
          </div>
        </HScroll>
        <HScroll :dataList="sections" :click="false" v-if="moduleData.useApi == '3' && moduleData.showTabs && sections.length > 0">
          <div class="section" v-for="(item, idx) in sections" @click="sectionEvent(idx)">
            <div class="btn line_circle" :class="{'selected': sectionIdx == idx}">{{item.name}}</div>
          </div>
        </HScroll>
        <div class="tip theme_bg_yl theme_font_red" v-if="showTip">活动已结束，以下商品将会以原价进行购买</div>
        <div class="no-products" v-if="dataLoaded && moduleData.rows.length == 0">
          <div class="img-div">
            <img src="static/image/mall2/no-data-img.png">
          </div>
          <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
        </div>
        <ProductListGrid :myIndex="-1" :usePorpData="usePorpData" :propData="propData"
                         v-if="dataLoaded || usePorpData != true" :isRMBEnd="moduleData.useApi == '3' && moduleData.showTabs ? '1' : '0'"></ProductListGrid>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductListGrid from '../product-list/product-list-grid';
  import { Sticky } from 'vant';
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import componentApi from '../_js/component-api'

  export default {
    name: 'product-list-infinite',
    components: {
      ProductListGrid,
      HScroll,
      Sticky
    },
    mixins: [componentApi],
    props: ['usePorpData', 'propData', 'scrollSite', 'modulesDomId'],
    data() {
      return {
        active: 0,
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
        selectedChannel: null,
        selectedItem: {},
        selectedId: 0,
        sectionIdx: 0,
        sections: [],
        selectedSection: {},
        totalPros: 0,
        showProductInfiinite: true,
        tabsDom: null,
        tabsParentDom: null,
        outSidleDom: null,
        tabsOffsetTop: 0,
        isAdd: false
      };
    },
    watch: {
      'scrollSite': function (val, oldVal) {
        if (this.tabsDom) {
          if (val > this.tabsOffsetTop) {
            if (this.isAdd == false) {
              this.isAdd = true
              this.tabsDom.style.position = 'absolute'
              this.tabsDom.style.top = '0px'
              this.tabsDom.style.left = '0px'
              this.tabsDom.style.right = '0px'
              this.tabsDom.style.height = (44 * this.$store.state.clientWidth / 375.0) +'px'
              this.outSidleDom.appendChild(this.tabsDom);
            }
            // this.tabsDom.style.top = (val-this.tabsOffsetTop-1) + 'px'
            //this.tabsDom.style.position = 'fixed'
          } else {
            if (this.isAdd == true) {
              this.isAdd = false
              this.tabsDom.style.position = ''
              this.tabsDom.style.top = ''
              this.tabsDom.style.left = ''
              this.tabsDom.style.right = ''
              this.tabsParentDom.appendChild(this.tabsDom);
            }
            // this.tabsDom.style.top = 0 + 'px'
          }
        }
      },
      '$store.state.mall2.zitiAddress.id': function (val, oldVal) {
        this.page = 1;
        this.getProducts()
      },
      '$store.state.mall2.selectAddress.id': function (val, oldVal) {
        this.page = 1;
        this.getProducts()
      }
    },
    methods: {
      getTopHeight: function () {
        let value = this.$market.getBarHeight() + this.$market.getNavHeight()
        return value;
      },
      tabsChanged: function (idx) {
        let tab = this.moduleData.showTabs[idx]
        this.selectTabs(tab, idx)
      },
      channelChanged: function (idx) {
        let channel = this.moduleData.channels[idx]
        this.selectChannel(channel)
      },
      isEnableNewTabStyle: function () {
        if (this.moduleData.enableNewTabStyle) {
          if (this.moduleData.useApi == '4' && this.moduleData.channels && this.moduleData.channels.length > 1) {
            return true;
          } else if (this.moduleData.useApi == '3' && this.moduleData.showTabs) {
            return true
          }
        }
        return false
      },
      getSectionsFromStr: function (str) {
        if (!str || str == '') {
          return []
        }
        let arr = []
        let arr1 = str.split(',')
        for (let i = 0; i < arr1.length; i++) {
          let str1 = arr1[i]
          if (str1 == '*-*') {
            arr.push({
              name: '全部',
              min: '',
              max: ''
            })
          } else {
            let arr2 = str1.split('-')
            if (arr2.length == 2) {
              let str2 = arr2[0]
              let str3 = arr2[1]
              if (str3 == '*') {
                arr.push({
                  name: str2 + '以上',
                  min: str2,
                  max: ''
                })
              } else {
                arr.push({
                  name: str2 + '-' + str3,
                  min: str2,
                  max: str3
                })
              }
            }
          }
        }
        return arr
      },
      selectTabs: function (item, idx) {
        this.selectedId = idx
        this.selectedItem = item
        this.sections = this.getSectionsFromStr(this.selectedItem.sectionStr)
        this.page = 1;
        this.getProducts()
      },
      sectionEvent: function (idx) {
        console.log('sectionEvent', idx)
        this.sectionIdx = idx
        this.selectedSection = this.sections[idx]
        this.page = 1;
        this.getProducts()
      },
      selectChannel: function (channel) {
        this.moduleData.selectedId = channel.id;
        this.selectedChannel = channel
        this.page = 1;
        this.getProducts()
      },
      superFilter: function () {
        // if (this.$store.state.webtype == '-1') {
        //   return
        // }
        // this.$market.filtrateEvent({
        //   category: this.cateData ? this.cateData.id : ''
        // }, (filtrateData) => {
        //
        //   this.filterBrands = []
        //   this.filterFeatureies = []
        //   for (let i = 0; i < filtrateData.brands.length; i++) {
        //     this.filterBrands.push(filtrateData.brands[i].id)
        //   }
        //   for (let i = 0; i < filtrateData.featureies.length; i++) {
        //     this.filterFeatureies.push({
        //       id: filtrateData.featureies[i].id,
        //       featureType: filtrateData.featureies[i].featureType,
        //     })
        //   }
        //   this.maxPrice = filtrateData.maxPrice;
        //   this.minPrice = filtrateData.minPrice;
        //
        //   this.page = 1;
        //   this.getProducts()
        // });
      },
      categoryEvent: function () {
        if (this.$store.state.webtype == '-1') {
          return
        }
        this.$market.showCategories({
          barHeight: this.$store.state.barHeight
        }, (item) => {
          this.cateText = item.name
          this.cateData = {
            clsType: item.clsType,
            id: item.id,
            cateLevel: item.cateLevel
          }
          this.page = 1;
          this.getProducts()
        });
      },
      filterEvent: function (type) {
        if (type == 0) {
          // 综合排序
          this.filterType = 0
        } else if (type == 1) {
          // 销量 点一下降序 点一下取消
          if (this.filterType == 2) {
            this.filterType = 0
          } else {
            this.filterType = 2
          }
        } else if (type == 2) {
          // 价格
          if (this.filterType == 3) {
            this.filterType = 4
          } else {
            this.filterType = 3
          }
        }
        this.page = 1;
        this.getProducts()
      },
      selectAddressClick: function () {
        if (this.$store.state.webtype == '-1') {
          return
        }
        if (this.$store.state.login.token == '') {
          this.$util.toLogin();
          return;
        }
        let path = ''
        if (this.$store.state.mall2.staticDeliverType == 2) {
          path = '/mall2/addresslist';
        } else {
          // 海油需要根据storeOUCode查询商品
          if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
            return false;
          }
          path = '/mall2/mypickupaddress';
        }
        this.$router.push({
          path: path,
        })
      },
      selectedTypeEvent: function (tag) {
        if (this.$store.state.webtype == '-1') {
          return
        }
        if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
          if (tag == '1' && this.$store.state.mall2.zitiAddress.id == '') {
            // 海油逻辑
            this.$Toast('当前店铺没有自提商品！')
            return ;
          } else if (tag == '2' && this.$store.state.mall2.zitiAddress.mchOuCode == '') {
            // 海油逻辑
            this.$Toast('当前店铺没有配送商品！')
            return ;
          }
        }
        this.$store.state.mall2.staticDeliverType = tag
        this.$bridgefunc.vuexStorage()
        if (tag == 1 && (this.$store.state.mall2.zitiAddress.id == '') && (this.$store.state.globalConfig.app_home_special_flag != 'cnooc')) {
          this.$router.push({
            path: '/mall2/mypickupaddress'
          })
        } else {
          this.page = 1;
          this.getProducts()
        }
      },
      loadMore: function () {
        if (this.totalPros <= this.moduleData.rows.length) {
          return ''
        }
        this.page++
        this.getProducts()
      },
      modeleReshow: function () {
        // this.showProductInfiinite = true
        // if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
        //   if (this.$store.state.mall2.zitiAddress.id != '' && this.$store.state.mall2.zitiAddress.mchOuCode != '') {
        //
        //   } else if (this.$store.state.mall2.zitiAddress.id != '' && this.$store.state.mall2.staticDeliverType == '1') {
        //     this.selectedTypeEvent('2')
        //   } else if (this.$store.state.mall2.zitiAddress.mchOuCode != '' && this.$store.state.mall2.staticDeliverType == '2') {
        //     this.selectedTypeEvent('1')
        //   } else {
        //     this.showProductInfiinite = false
        //   }
        //   return ;
        // }
      },
      queryChannelList: function () {
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProChannelList';
        let paramsData = {
          token: this.$store.state.login.token,
          channelGroupId: this.moduleData.productFrom.id,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let channels = data.data.list
              if (channels.length > 0) {
                let channel = channels[0]
                this.moduleData.channels = channels;
                this.moduleData.selectedId = channel.id;
                this.selectedChannel = channel;
                this.getProducts()
              }
            }
          },
          error => {
          }
        );
      },
      getProducts: function () {
        if (this.moduleData.useApi == 2) {
          this._getCurrentDatas()
        } else if (this.moduleData.useApi == 3) {
          this._getCurrentDatas()
        } else if (this.moduleData.useApi == 4) {
          this._getCurrentDatas()
        }
      },
      _getCurrentDatas: function () {
        // if (this.usePorpData) {
        //   this.dataLoaded = true;
        //   return
        // }
        // let url = this.$market.apiBaseURL() + '/app/json/product/getAppDesigneList';
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        // if (this.usePorpData != true) {
        //   url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        // }
        let paramsData = {
          fromFrontPage: '1',
          // deliverType: '2',
          // 品牌筛选
          brandIds: this.filterBrands,
          featureIds: this.filterFeatureies,
          // 价格筛选
          maxPrice: this.maxPrice,
          minPrice: this.minPrice
        };
        if (this.$store.state.webtype == '-1') {
          paramsData.fromFrontPage = ''
        }
        paramsData.page = this.page
        paramsData.rows = 10
        if (this.moduleData.useApi == 2) {
          if (this.moduleData.productFrom.multiple == '2') {
            // 多选分类
            if (this.moduleData.productFrom.backCates) {
              let arr = []
              for (let i = 0; i < this.moduleData.productFrom.backCates.length; i++) {
                arr.push(this.moduleData.productFrom.backCates[i].id)
              }
              paramsData.categoryIdList = JSON.stringify(arr)
            }
          } else {
            let cate = this.moduleData.productFrom.cate;
            paramsData.clsType = cate.clsType
            paramsData.categoryId = cate.id
            paramsData.cateLevel = cate.cateLevel
          }
        } else if (this.moduleData.useApi == 3) {
          let activity = this.moduleData.productFrom.activity;
          paramsData.activityId = activity.activityId
        } else if (this.moduleData.useApi == 4) {
          // let activity = this.moduleData.productFrom.activity;
          // paramsData.activityId = activity.activityId

          // url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
          if (!this.selectedChannel) {
            this.queryChannelList()
            return
          }
          paramsData.categoryId = this.selectedChannel.id
          paramsData.clsType = '4'
        }

        if (this.cateData) {
          paramsData.clsType = this.cateData.clsType
          paramsData.categoryId = this.cateData.id
          paramsData.cateLevel = this.cateData.cateLevel
        }

        paramsData.deliverType = this.$store.state.mall2.staticDeliverType
        if (paramsData.deliverType == 1) { // 自提
          // 海油 在 没有自提id和或者自提 storeCode的情况下 不去请求接口
          if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc' && (!this.$store.state.mall2.zitiAddress.id || !this.$store.state.mall2.zitiAddress.storeCode)) {
            this.dataLoaded = true;
            this.moduleData.rows = [];
            return;
          }

          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
          paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode;
        } else { // 配送
          let sad = this.$store.state.mall2.selectAddress;
          paramsData.area = {
            provinceId: sad.provinceId,
            cityId: sad.cityId,
            countryId: sad.countryId,
            countyId: sad.countryId,
            townId: sad.townId,
          }
          if (this.$store.state.deployType == '4') { // 海油需要根据storeOUCode 和 mchOuCode查询商品
            if (this.$store.state.mall2.zitiAddress.mchOuCode) {
              paramsData.storeOuCode = this.$store.state.mall2.zitiAddress.storeCode;
              paramsData.mchOuCode = this.$store.state.mall2.zitiAddress.mchOuCode;
              // this.dataLoaded = true;
              // this.moduleData.rows = [];
              // return false;
            }
          }
        }
        if (this.filterType == 1) {
          // 销量 升序
          paramsData.orderByKey = '1'
          paramsData.ascOrDesc = '0'
        } else if (this.filterType == 2) {
          // 销量 降序
          paramsData.orderByKey = '1'
          paramsData.ascOrDesc = '1'
        } else if (this.filterType == 3) {
          // 价格 降序
          paramsData.orderByKey = '0'
          paramsData.ascOrDesc = '0'
        } else if (this.filterType == 4) {
          // 价格 升序
          paramsData.orderByKey = '0'
          paramsData.ascOrDesc = '1'
        }

        if (this.moduleData.showTabs && this.moduleData.useApi == 3) {

          let min = this.selectedSection.min
          let max = this.selectedSection.max
          paramsData.startPoints = min
          paramsData.endPoints = max

          let arr = this.selectedItem.cates
          paramsData.categoryIdList = JSON.stringify(arr)

          paramsData.queryType = 'PointsExPro'
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
              this.totalPros = data.data.page.count
              if (this.page == 1) {
                setTimeout(() => {
                  if (this.isEnableNewTabStyle()) {
                    let doms = document.getElementsByClassName('van-tabs__wrap');
                    if (doms && doms.length > 0) {
                      this.tabsParentDom = document.getElementsByClassName('van-sticky')[0];
                      this.tabsDom = doms[0]
                      this.tabsDom.style.zIndex = '1'
                    } else {
                      this.tabsDom = null
                    }
                    // let dom = this.$refs.ProductInfiniteSelf
                    let vanTabsDiv = this.$refs.Van_Tabs_Div
                    // console.log(dom.offsetTop, '~~~', vanTabsDiv.offsetTop)
                    this.tabsOffsetTop = vanTabsDiv.offsetTop
                  }
                }, 50)
                this.moduleData.rows = []
                for (let i = 0; i < list.length; i++) {
                  let item = this.$market.dataProcessing(list[i])
                  this.moduleData.rows.push(item)
                }
                if (this.moduleData.useApi == 3 && this.moduleData.rows.length > 0) {
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
              } else {
                let arr = []
                for (let i = 0; i < list.length; i++) {
                  let item = this.$market.dataProcessing(list[i])
                  arr.push(item)
                }
                this.moduleData.rows = this.moduleData.rows.concat(arr)
              }
              this.testCorerMark(this.moduleData);
              if (this.moduleData.rows.length < this.totalPros) {
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
      testCorerMark(moduleData){
        moduleData.rows.forEach(item=>{
          item.cornerMark ? null : this.$set(item,'cornerMark', 0);
          item.selfCornerMarkUrl ? null : this.$set(item,'selfCornerMarkUrl', '');
        })
      },
      getDateFromString(str) {
        if (str == '' || str == null || str == undefined) {
          return 0
        }
        // 精确到秒
        str = str.replace(/-/g, '/');
        return parseInt((new Date(str)).getTime() / 1000)
      },
      lazyLoadPageData: function () {
        this.getProducts()
      }
    },
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.productInfinite.data;
      }
    },
    mounted() {
      let onlyDeliveryType = this.moduleData.onlyDeliveryType
      if ((this.$store.state.globalConfig && this.$store.state.globalConfig.delivertype_default == '1') || onlyDeliveryType == '1') {
        this.deliveryTypes = [{
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }];
        this.$store.state.mall2.staticDeliverType = '1'
      } else if ((this.$store.state.globalConfig && this.$store.state.globalConfig.delivertype_default == '2') || onlyDeliveryType == '2') {
        this.deliveryTypes = [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }];
        this.$store.state.mall2.staticDeliverType = '2'
      }
      if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
        this.showProductInfiinite = true
        if (this.$store.state.mall2.zitiAddress.id == '' && this.$store.state.mall2.zitiAddress.mchOuCode == '') {
          this.showProductInfiinite = false
        } else if (this.$store.state.mall2.zitiAddress.id == '' && this.$store.state.mall2.staticDeliverType == '1') {
          this.$store.state.mall2.staticDeliverType = '2'
        } else if (this.$store.state.mall2.zitiAddress.mchOuCode == '' && this.$store.state.mall2.staticDeliverType == '2') {
          this.$store.state.mall2.staticDeliverType = '1'
        }
      }
      if (!this.usePorpData) {
        this.moduleData.rows = [];
      }

      if (this.moduleData.showTabs) {
        this.selectedId = 0
        this.selectedItem = this.moduleData.tabs[this.selectedId]
        this.sections = this.getSectionsFromStr(this.selectedItem.sectionStr)
      }
      // this.getProducts()

      this.outSidleDom = window.document.getElementById(this.modulesDomId)
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .product-list {
    width: 100%;
    height: 100%;

    >>>.scroll {
      overflow hidden;
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


    .delivery-types {
      display flex;
      align-items center;
      padding 5px 10px;

      .type-btn {
        font-size $font-size-medium
        padding 4px 10px;
        border-radius 15px;
        border 0.5px solid transparent;
        display flex;
        align-items center;

        .icon-size {
          font-size $font-size-medium
          padding-right 4px;
        }
      }

      .space {
        flex 1;
      }

      .local-div {
        max-width 180px;
        //flex 1;
        /*text-align right;*/
        display flex;
        align-items center;
        justify-content flex-end;
      }
    }

    .row {
      padding 5px 15px;
      display flex;

      .type-btn {
        font-size $font-size-medium
        padding 4px 10px;
        border-radius 15px;
        border 0.6px solid transparent;

        .icon-size {
          font-size $font-size-medium
        }
      }

      .space {
        flex 1;
      }

      .local-div {
        max-width 180px;
        display flex;
        align-items center;
        font-size $font-size-medium-s

        .icon-size {
          font-size $font-size-medium
        }

        span {
          padding 2px;
        }
      }

      &.top-showdow {
        margin-top 3px;
        border-radius 8px;
        box-shadow: 0px -2px 2px #efefef;
        overflow hidden
      }

      &.row-filter {
        justify-content: space-around;
      }

      .filter-btn {
        padding 7px;
        display flex;
        align-items center;
        justify-content: center;

        .arrows {
          display inline;
        }

        .arrow-icon {
          margin-top -4px;
          margin-bottom -4px;
          display block;
          font-size 12px;
        }

        .filter-size {
          font-size 17px;
        }

        .filter-size-1 {
          font-size 14px;
          padding 2px 3px 0px;
        }

        span {
          font-weight 500;
        }
      }
    }

    .tip {
      font-size 12px;
      padding 5px 10px;
    }

    >>>.van-sticky {
      height 44px;
    }

    .channels-div {
      padding 0 10px 5px;
      display:flex;
      overflow-x:auto;
      white-space:nowrap;

      .channel {
        display inline-block;
        padding 10px 5px 5px;
        text-align center;
        min-width 64px;
        font-size 14px;
      }
      .selected {
        font-size 16px;
        font-weight 600;
        position relative;
        color #f80f16;
        &.selected::after {
          content: " ";
          position absolute;
          left 50%;
          bottom 0;
          background-color #f80f16;
          width 40px;
          margin-left -20px;
          height 2px;
          border-radius 1px;
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
