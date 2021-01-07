<template>
  <div class="bottom">
    <div class="page-wrap">
      <!--<TabContainer class="page-tabbar-container" v-model="selectedId">-->

        <!--<TabContainerItem id="index">-->
          <!--<Home></Home>-->
        <!--</TabContainerItem>-->
        <!--<TabContainerItem id="refuel">-->
          <!--<RefuelSelectOilGun></RefuelSelectOilGun>-->
        <!--</TabContainerItem>-->
        <!--<TabContainerItem id="mine">-->
          <!--<Mine></Mine>-->
        <!--</TabContainerItem>-->
      <!--</TabContainer>-->
      <div class="page-tabbar-container" >

        <Home v-if="selectedId == 'index'"></Home>
        <RefuelSelectOilGun v-if="selectedId == 'refuel'"></RefuelSelectOilGun>
        <Mine v-if="selectedId == 'mine'"></Mine>
        <Cate v-show="selectedId == 'type'"></Cate>
        <Shop v-show="selectedId == 'shop'"></Shop>


      </div>
    </div>
    <div class="tabbar-div">
      <div class="bg-img-div" v-if="tabbarData.bgImageUrl != undefined && tabbarData.bgImageUrl != ''">
        <img class="full-img" :src="tabbarData.bgImageUrl"/>
      </div>
      <div :style="getTabbarItemWidth()" class="tabbar-item" @click="itemEvent(item)" v-for="(item,idx) in tabbarData.rows">
        <div class="item-img-div">
          <img class="full-img" v-show="item.linkUrl != selectedId" :src="item.imageUrl"/>
          <img class="full-img" v-show="item.linkUrl == selectedId" :src="item.shadeImageUrl"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  import Home from '@/components/product/mainpage/home'
  import RefuelSelectOilGun from '@/components/product/mainpage/refuel-select-oilgun'
  import Mine from '@/components/product/mainpage/mine'
  import Cate from '@/components/Mall/Mall-Categories'
  import Shop from '@/components/Mall/Mall-ShoppingCart'

  import { mapGetters } from 'vuex'
  import Version from '@/utils/DetectVersion'

  export default {
    name: 'tabbar',
    components: {
      Toast,
      Home,
      Mine,
      RefuelSelectOilGun,
      Cate,
      Shop,
    },
    computed: {
      ...mapGetters([
        'location',
      ]),
    },
    data() {
      return {
        tabbarData: {
          bgImageUrl: ''
        },
        selectedId: '',
        province:null,
        cityp:null
      }
    },
    methods: {
      itemEvent: function (item) {
        // console.log('itemEvent', item)
        // document.title = item.title
        this.selectedId = item.linkUrl
      },
      getTabbarItemWidth: function () {
        let columnWidth = 100.00 / (this.tabbarData.rows.length);
        return 'width:'+columnWidth+'%'
      },
      _getdata: function () {
        this.$Loading.open('加载中')
        let url = '/app/home/index';
        let params1 = {
          provinceName: this.$store.state.indexData.province ? this.$store.state.indexData.province : '',
          cityName: this.$store.state.indexData.city ? this.$store.state.indexData.city : '',
          alias: 'foot'
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          // this.homedata = data;
          if (data.status == 0) {
            console.log('获取导航栏', data)
            _this.tabbarData = data.data.modelList[0]
            _this.selectedId = 'index'
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
        })
      }
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.$bridgefunc.vuexRead();
        Version.detectVersion();
      })

    },
    created() {
      let _this = this;
      _this._getdata();
      Version.detectVersion();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    overflow hidden
    .page-wrap {
      position absolute
      top 0px
      bottom 40px
      width 100%
      overflow hidden
      /*overflow-x hidden*/
      /*overflow-y auto*/
      /*-webkit-overflow-scrolling: touch*/
      .page-tabbar-container {
        height 100%
        width 100%
      }
    }
    .tabbar-div {
      position fixed
      bottom 0px
      height 50px
      width 100%
      .bg-img-div {
        position absolute
        width 100%
        height 60px
        margin-top -10px
      }
      .tabbar-item {
        position relative
        float left
        width 20%
        height 100%
        text-align center
        .item-img-div {
          position absolute
          width 60px
          height 60px
          left 50%
          margin-top -10px
          margin-left -30px
          .img {
            width 100%
            height 100%
          }
        }
        .big-img {
          width 60px
          height 60px
          margin-top -10px
          margin-left -30px
        }
      }
    }
  }
  .mint-tab-container-wrap {
    height 100%
  }
</style>
