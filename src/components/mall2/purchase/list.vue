/**Created by liaoyingchao on 2019-04-24.*/

<template>
  <div class="list">
    <nav-top @backEvent="$router.go(-1)" :no-title="true">
      <div class="search-div theme_bg_white_f5"
           style="left: 50px; right: 50px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
           @click="toSearchEvent">
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
        <span class="theme_font_tint"
              style="font-size: 14px;margin-left: 10px;">{{searchKey ? searchKey : '搜你想要的商品'}}</span>
      </div>
      <div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px;" @click="categoryEvent">
        <i class="iconfont mall-datubiao theme_font_common" style="font-size: 24px;"></i>
      </div>
    </nav-top>
    <nav-content>
      <div class="delivery-types">
        <div class="type-btn" :class="{theme_bg_ml_red: $store.state.mall2.staticDeliverType == item.tag, theme_border_red_i: $store.state.mall2.staticDeliverType == item.tag}" @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">
          <i class="iconfont theme_font_common icon-size" :class="[item.fontclass, {theme_font_red_i: $store.state.mall2.staticDeliverType == item.tag}]"></i>
          <span class="theme_font_common" :class="{theme_font_red_i: $store.state.mall2.staticDeliverType == item.tag}">{{item.text}}</span>
        </div>
        <div class="local-div" @click="selectAddressClick()">
          <span class="theme_font_gray single-line" v-if="$store.state.mall2.staticDeliverType == 2">{{$store.state.mall2.selectAddress.addressFull}}</span>
          <span class="theme_font_gray single-line" v-if="$store.state.mall2.staticDeliverType == 1">{{$store.state.mall2.zitiAddress.storeName}}</span>
          <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>
        </div>
      </div>
      <div class="list-content">
        <Scroll>
          <ListComponent :listData="listData"></ListComponent>
        </Scroll>
      </div>
    </nav-content>
    <AllCategory :barHeight="$store.state.barHeight" v-show="showAllCategory" @closeEvent="showAllCategory = false" @cateEvent="cateEvent"></AllCategory>
  </div>
</template>

<script>
  import Scroll from '@/components/base/scroll/scroll'
  import ListComponent from './base/list-component'
  import Search from '../common/search'
  import AllCategory from './category/all-categories'

  export default {
    name: "list",
    components: {
      Scroll,
      ListComponent,
      AllCategory
    },
    data() {
      return {
        listData: [],
        searchKey: '',
        selectedId: '',
        showAllCategory: false,
        deliveryTypes: [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }, {
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }],
        nowPage: 0
      }
    },
    methods: {
      selectAddressClick: function () {
        if (this.$store.state.login.token == '') {
          this.$util.toLogin();
          return ;
        }
        let path = ''
        if(this.$store.state.mall2.staticDeliverType == 2){
          path = '/mall2/addresslist';
        }else{
          path = '/mall2/mypickupaddress';
        }
        this.$router.push({
          path: path,
        })
      },
      selectedTypeEvent: function (tag) {
        this.$store.state.mall2.staticDeliverType = tag
        this.$bridgefunc.vuexStorage()
        if (tag == 1 && (this.$store.state.mall2.zitiAddress.id == '')) {
          this.backRefresh = true
          this.$router.push({
            path: '/mall2/mypickupaddress'
          })
        } else {
          this.nowPage = 0;
          this.getListData()
        }
      },
      cateEvent: function (item) {
        console.log(item)
        this.showAllCategory = false
        this.selectedId = item.id
        this.getListData()
      },
      categoryEvent: function () {
        this.showAllCategory = true
      },
      toSearchEvent: function () {
        Search.open({
          initData: {
            barHeight: this.$store.state.barHeight,
            searchHistory: this.$store.state.mall2.searchHistory
          },
          clearSearchHistory: () => {
            this.$store.state.mall2.searchHistory = []
          },
          searchEvent: (searchStr) => {
            Search.close()
            console.log(searchStr)
            this.$mallCommon.pushSearchHistory(searchStr)
            this.searchKey = searchStr
            // this.nowPage = 0;
            this.getListData()
          }
        })
      },
      getListData: function () {
        this.listData = []
        let url = '/app/json/pro_sku_purchase/queryPurchaseList'
        let paramsData = {
          skuName: this.searchKey,
          cls3StaId: this.selectedId,
          deliverType: this.$store.state.mall2.staticDeliverType,
          pickupId: this.$store.state.mall2.zitiAddress.id
        };
        this.$Loading.open()
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      this.getListData()
    },
    activated () {

    },
    beforeRouteLeave (to, from, next) {
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .list {
    width 100%
    height 100%
    overflow hidden

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
      .local-div {
        flex 1;
        /*text-align right;*/
        display flex;
        align-items center;
        justify-content flex-end;
      }
    }

    .list-content {
      position absolute;
      left 0;
      right 0;
      top 40px;
      bottom 0;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
      overflow hidden;
      box-shadow 0 -1px 5px #efefef;
      border-radius 10px 10px 0 0;

      .list-wrapper {
        background none;
      }

      .list-tip {
        padding 4px 12px;

        p {
          display flex;
          align-items center;
          padding 3px 0px;
        }
      }

      .list-pull-to {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .no-list {
        position absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

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
  }
</style>
