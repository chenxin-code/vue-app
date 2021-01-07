<template>
  <div class="mine-bottom">
    <Navigation v-if="navShow" title="我的" hasBack="0"  ></Navigation>
    <div class="mine-scroll" :style="{top: topHeight+'px'}">
      <div :style="" v-for="item in listData">
        <HomeModule_Header v-if="item.isShowMore" :items="item"
                           @moreEvent="moreEvent"></HomeModule_Header>
        <Mine_Lists v-if="item.code == '3002'" :items="item" @itemEvent="itemEvent"></Mine_Lists>
        <Minemodule_UserInfo v-if="item.code == '3001'" @itemEvent="itemEvent"></Minemodule_UserInfo>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import HomeModule_Header from '@/components/product/home-modules/home-module-header'
  import Mine_Lists from '@/components/product/mine-modules/mine-lists.vue'
  import Minemodule_UserInfo from '@/components/product/mine-modules/Minemodule_UserInfo'
  import Navigation from '@/components/base/navigation'

  export default {
    name: 'page-4',
    components: {
      Toast,
      HomeModule_Header,
      Mine_Lists,
      Minemodule_UserInfo,
      Navigation
    },
    props: [
      'items',
    ],
    data() {
      return {
        listData: [],
        province: null,
        cityp: null,
        topHeight:0,
        navShow:false
      }
    },
    methods: {
      moreEvent: function () {
        console.log('moreEvent')
      },
      toOnLine(urlPath) {

        this.$bridgefunc.newPage({
          weburl: urlPath,
          isnativetop: 1
        })
      },
      getOnlineUrl() {//在线客服地址
        this.$Loading.open();
        let url = '/app/json/home/aiClient';
        let _this = this;

        this.$http.post(url, {}).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.toOnLine(data.data);
            }
          },
          error => {
            _this.$Loading.close();
          }
        );
      }
      ,
      itemEvent: function (item) {
        let linkUrl = item.linkUrl
        if (linkUrl == 'online') {//在线客服
          this.getOnlineUrl();
          return;
        }else if(linkUrl == 'clean'){
          this.$Loading.open();
          let _this = this
          this.$bridgefunc.cleanCache(function () {
            _this.$Loading.close();
            _this.$MessageBox.alert('清除缓存成功!','提示');
          })
          return;
        }
        if (linkUrl != '') {
          this.$bridgefunc.newPage({
            weburl: linkUrl,
            isnativetop: item.isNavTop ? item.isNavTop : 1,
            isparameters:item.isParam
          })
        }
      },
      getminedata: function () {
        this.$Loading.open('加载中')
        let url = '/app/home/index';
        let params1 = {
          provinceName: this.$store.state.indexData.province ? this.$store.state.indexData.province : '',
          cityName: this.$store.state.indexData.city ? this.$store.state.indexData.city : '',
          alias: 'mine'
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            console.log('获取我的界面数据', data)
            this.listData = data.data.modelList;
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取我的失败', error)
        })
      },
      getUserInfo: function () {
        this.$Loading.open('加载中')
        let url = '/app/json/user/getUserInfo';
        let token = this.$store.state.login.token
        console.log('tokentokentokentokentoken', token)
        let params1 = {
          token: token,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            console.log('获取用户信息', data)
            _this.$store.state.userInfo = data.data
            // console.log(_this.$store.state.userInfo)
            _this.$bridgefunc.vuexStorage(function () {
              console.log(_this.$store.state.userInfo)
            })
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取用户信息失败', error)
        })
      },

      setIsNeedNav:function () {
        if(this.$route.query.isnativetop){
          this.topHeight = 0;
          this.navShow = false;
        }else {
          this.topHeight = this.$store.state.barHeight+this.$market.getNavHeight();
          this.navShow = true;
        }
      }

    },
    mounted() {
      // let _this = this;
      // this.$bridgefunc.getItem('LoginCity',function (result) {
      //   if(result){
      //     let dict = JSON.parse(result);
      //     let tempProvinceName = dict['provinceName'];
      //     let tempCityName = dict['cityName'];
      //     if(tempProvinceName && tempCityName){
      //       _this.province = tempProvinceName;
      //       _this.city = tempCityName;
      //       _this.getminedata();
      //     }
      //   }
      // })
    },
    created() {
      this.getUserInfo();
      this.getminedata();
      this.setIsNeedNav();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mine-bottom {
    position relative
    height 100%
    overflow hidden

    .mine-scroll {
      position absolute
      bottom 0px;
      right 0px;
      left 0px;
      overflow-x hidden
      overflow-y auto
      background-color $color-background-lll
      -webkit-overflow-scrolling: touch
    }
  }
</style>
