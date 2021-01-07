<template>
  <div class="cart">
    <nav-top :noTitle="true" @backEvent="backEvent">
      <div class="cart-top">
        <div class="cart-title" @click="chooseAddress(deliverType)">
          <span class="title theme_font_black">购物车</span>
          <span class="address theme_font_gray">{{getAddressName()}}</span>
          <i class="iconfont mall-dingwei theme_font_black"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="cart-top" v-if="$store.state.webtype == 2">
        <div class="cart-title" @click="chooseAddress(deliverType)">
          <span class="title theme_font_black">购物车</span>
          <span class="address theme_font_gray">{{getAddressName()}}</span>
          <i class="iconfont mall-dingwei theme_font_black"></i>
        </div>
      </div>
      <div class="row" v-if="$store.state.globalConfig.delivertype_default != '1' && $store.state.globalConfig.delivertype_default != '2'">
        <div class="type-btn" v-for="(item,index) in topArr" :class="{theme_light_bg: deliverType == item.type, theme_standard_bdr_i: deliverType == item.type}"
             @click="deliverTypeEvent(item)">
          <i class="iconfont  theme_font_common icon-size"
             :class="[item.class,{theme_standard_font_i: deliverType == item.type}]"></i>
          <span class="theme_font_common" :class="{theme_standard_font_i: deliverType == item.type}">{{item.name}}</span>
          <span class="theme_font_common" :class="{theme_standard_font_i: deliverType == item.type}" v-if="peisongNum > 0 && item.type == 2">({{peisongNum}})</span>
          <span class="theme_font_common" :class="{theme_standard_font_i: deliverType == item.type}" v-if="zitiNum > 0 && item.type == 1">({{zitiNum}})</span>
        </div>
        <div class="type-btn">
          <!-- <p class="cart-edit theme_font_gray" @click="setEdit">{{isEditing?'完成':'编辑'}}</p> -->
        </div>
      </div>
      <div class="list-content" :class="{notop: $store.state.globalConfig.delivertype_default == '1' || $store.state.globalConfig.delivertype_default == '2'}">
      <CartList v-for="(item,index) in topArr" :ref="getCartRef(item.type)" v-if="item.hasShow" v-show="deliverType == item.type" :deliverType="item.type" :key="index" :isEditing="isEditing" @updateEdit="setEdit">
      </CartList>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import cartJS from './js/cart'
  import CartList from './cart-list'
  import InitialLoadPickupAny from '@/utils/initialLoadPickupAny.js'

  export default {
    name: "cart",
    components: {
      CartList
    },
    props: {
      hasBack: {
        type: Boolean,
        default: false,
      },
      //当有底部导航的时候 是否是当前显示的
      commonShow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        topArr: [],
        deliverType: null,
        isEditing: false,
        peisongNum: 0,
        zitiNum: 0,
        dataIsLoad: false,
        firstZiti: true
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this)
      },
      setEdit: function () {
        this.isEditing = !this.isEditing;
      },
      getAddressName: function () {
        let name = null;

        if (this.deliverType == 2) {
          name ='';
          // name = this.$store.state.mall2.selectAddress.addressFull;
          // if (!name || name == '') {
          //   name = '更改配送地址'
          // }
        } else if (this.deliverType == 1) {
          // name = this.$store.state.mall2.zitiAddress.storeName;
          // if (!name || name == '') {
          //   name = '更改自提地址'
          // }
          name ='';
        }

        return name;
      },
      chooseAddress: function (type) {
        if(type == 2){
          this.$router.push({
            path: '/mall2/addresslist',
          });
        }else {
          this.$router.push({
            path: '/mall2/mypickupaddress',
          })
        }

      },
      deliverTypeEvent: function (item) {
        console.log(item)
        if(item.type == 2){
          this.saveItemSel(item);
          this.getData();
        }else if(item.type == 1){

          if(this.firstZiti == true && (this.$store.state.mall2.zitiAddress.id == undefined  || this.$store.state.mall2.zitiAddress.id == '')){
            this.chooseAddress(item.type);
          }else {
            this.saveItemSel(item);
            this.getData();
          }
          this.firstZiti = false
        }
      },
      saveItemSel:function(item){
        item.hasShow = true;
        this.deliverType = item.type;
        this.$store.state.mall2.staticDeliverType = this.deliverType;
        this.$bridgefunc.vuexStorage()
      },

      pageShow:function(){
        this.getData();
      },
      getData:function(){
        if (this.deliverType == 1) {
          InitialLoadPickupAny.checkIsInitialLoad((address) => {
            if (address) {
              this.getData();
            } else {
              let comref = this.getCartRef(this.deliverType);
              this.$nextTick(()=>{
                if (this.$refs[comref]) {
                  let arr = this.$refs[comref]
                  arr[0].getDataList();
                }
              })
            }
          });
        } else {
          let comref = this.getCartRef(this.deliverType);
          this.$nextTick(()=>{
            if (this.$refs[comref]) {
              let arr = this.$refs[comref]
              arr[0].getDataList();
            }
          })
        }
      },
      getCartRef: function (index) {
        return 'cart' + index
      },
      getItemByType:function (type) {
        for(let i = 0; i < this.topArr.length; i++){
          let item = this.topArr[i];
          if(item.type == type){
            return item;
          }
        }
        return null;
      },
      _getCartCount: function (deliverType) {
        let url = '/app/json/app_cart/getCartCount';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: deliverType,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              // this.$store.state.mall2.cartNum = data.data
              if (deliverType == 1) {
                this.zitiNum = data.data
              } else {
                this.peisongNum = data.data
              }
            } else {
              // this.$Toast(data.info);
            }
          },
          error => {
            // this.$Loading.close();
            // this.$Toast('请求数据失败！')
          }
        );
      },
    },
    activated() {
      if (!this.$route.query.lastPath.includes("/micro_sho/shareDetail") && this.$route.query.lastPath != 'micro_sho/shop_around') {
        // this.$store.state.microSho.carts = []
      }
      // 首页的时候，且不是当前显示tab
      if (this.$route.path == '/common' && !this.commonShow) {
        return;
      }
      if(this.dataIsLoad == true){
        let item = this.getItemByType(this.deliverType);
        this.deliverTypeEvent(item);
      }
    },
    mounted() {
      this.deliverType = this.$store.state.mall2.staticDeliverType;
      let item = this.getItemByType(this.deliverType);
      this.deliverTypeEvent(item);
      setTimeout(() => {
        this.dataIsLoad = true
      }, 500)
    },
    created() {
      this.topArr = cartJS.getTopArr();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .cart {
    position relative;
    width 100%
    height 100%
    overflow hidden
    // .setNavContent{
    //   margin-top -60px
    // }
    .cart-top {
      height 50px
      display flex
      justify-content space-between
      align-items center
      // background-color: #fafafa;
      .cart-title {
        flex 1
        height 100%
        display flex
        align-items center
        justify-content center
        .title {
          font-size $font-size-large
        }
        .address {
          font-size $font-size-small
          margin-left 6px
        }
        i {
          font-size $font-size-large
          margin-left 6px
        }
      }
      .cart-edit {
        display flex
        align-items center
        height 100%
        font-size $font-size-medium
        padding 0px 14px
      }
    }

    .row {
      padding 5px 15px;
      display flex;
      justify-content space-around
      .type-btn {
        min-width 94px;
        text-align center;
        font-size $font-size-medium
        padding 4px 10px;
        border-radius 15px;
        border 0.6px solid transparent;
        .icon-size {
          font-size $font-size-medium
        }
      }
    }

    .list-content {
      position absolute;
      left 0px;
      right 0px;
      top 40px;
      bottom 0px;
      -webkit-overflow-scrolling touch;
      &.notop {
        top 0;
      }
    }
  }
</style>
