/**Created by liaoyingchao on 2019-04-13.*/

<template>
  <div class="list">
    <nav-top @backEvent="$router.go(-1)" title="" :bgImg="require('./image/banner1.png')"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="group-top">
          <img src="./image/banner2.png">
          <div class="explains">
            <div class="item" @click="toMyGroup">我的拼团</div>
            <div class="item" @click="showagreement">活动规则</div>
          </div>
        </div>
        <div class="list-content">
<!--          <div class="row">-->
<!--            <div class="type-btn"-->
<!--                 :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"-->
<!--                 @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">-->
<!--              <i class="iconfont theme_font_common icon-size"-->
<!--                 :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"></i>-->
<!--              <span class="theme_font_common"-->
<!--                    :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>-->
<!--            </div>-->
<!--            <div class="space"></div>-->
<!--            <div class="local-div" @click="selectAddressClick()">-->
<!--              <span class="theme_font_gray single-line" v-if="selectedType == 2">{{$store.state.mall2.selectAddress.addressFull}}</span>-->
<!--              <span class="theme_font_gray single-line" v-if="selectedType == 1">{{$store.state.mall2.zitiAddress.storeName}}</span>-->
<!--              <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>-->
<!--            </div>-->
<!--          </div>-->
          <div class="group-list">
            <div class="group-item" v-for="(item, index) in groupList" :key="index" @click="openGroupDetails(item)">
              {{dealItem(item)}}
              <img class="media-object" :src="item.good.gameAwardPic" alt="">
              <div class="media-content">
                <div class="name ">{{item.good.rewardName}}</div>
                <div class="center">
                  <div class="price">
                    <span class="unit">￥</span><span class="main">{{item.dpedData.integer}}.</span><span class="unit">{{item.dpedData.decimals}}</span><span class="num">{{item.groupBuyNumOfPerson}}人团</span>
                  </div>
                  <p class="kaituan" v-if="!isopen(item)">即将开团</p>
                  <p class="kaituan" @click.stop="kaituan(item)" v-else>立即开团</p>
                </div>
                <div class="message">
                  <p>单买价{{item.good.sku.retailPrice}}</p>
                  <p v-if="!isopen(item)">
                    <countdown class="count-down" :endTime="item.startDate_time"></countdown>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import { Dialog } from 'vant';
  import Countdown from "../common/countdown/countdown";

  export default {
    name: "list",
    components: {Countdown},
    data() {
      return {
        listStyle: 1,
        deliveryTypes: [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }
        ,{
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }
        ],
        selectedType: 2,
        groupList:[]
      }
    },
    methods: {
      isopen: function (item) {
        let startDate = item.startDate
        startDate = startDate.replace(/-/g, '/')
        let t = new Date(startDate).getTime()
        let nt = new Date().getTime()
        item.startDate_time = t / 1000;
        if (nt > t) {
          return true;
        }
        return false;
      },
      selectAddressClick: function () {//选择地址

        let path = ''
        if (this.selectedType == 2) {
          path = '/mall2/addresslist';
        } else {
          path = '/mall2/mypickupaddress';
        }
        if (this.$userCenter.checkLogined({path: path}, 0) == false) {
          return;
        }
        this.$router.push({
          path: path,
        })
      },
      selectedTypeEvent: function (tag) {
        this.$store.state.mall2.staticDeliverType = tag
        this.$bridgefunc.vuexStorage()
        this.selectedType = tag;
        // if (tag == 1 && (this.$store.state.mall2.zitiAddress.id == '')) {
          this.backRefresh = true
        //   this.$router.push({
        //     path: '/mall2/mypickupaddress'
        //   })
        // } else {
        //   this.nowPage = 0;
        //   this._loadProList()
        //   this._getCartCount()
        // }
        this.getGroupList();
      },
      getGroupList: function () {
        this.$Loading.open()
        let url = '/app/json/app_fight_group_order/queryAll';
        let params = {
          token: this.$store.state.login.token,
          groupBuyType: 1,
          // deliveryType: this.$store.state.mall2.staticDeliverType,
          deliveryType: 2,//默认配送
          pickupId: this.$store.state.mall2.zitiAddress.id
        };
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.groupList = data.data.orderList;
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },

      dealItem:function(item){
        let amount = item.leaderPrice + ''
        item.dpedData = this.$mallCommon.getPriceData(amount);
        if(item.leaderUserAward && item.leaderUserAward.length){
          item.good = item.leaderUserAward[0];
        }
      },
      kaituan:function(item){
        this.openGroupDetails(item);
        // this.$Loading.open()
        // let url = '/app/json/app_fight_group_order/start';
        // let params = {
        //   mktGroupBuyId: item.mktGroupBuyId,
        //   groupBuyType: 1
        // };
        // this.$http.post(url, params).then(res => {
        //   this.$Loading.close()
        //   let data = res.data;
        //   if (data.status == 0) {
        //   } else {
        //     this.$Toast(data.info)
        //   }
        // }, error => {
        //   this.$Loading.close()
        //   this.$Toast('开团失败')
        // });
      },
      openGroupDetails:function(item){
        console.log(item)
        let product = item.good.sku
        let path = '/groupproduct'
        // if (product.productType == 2){
        //   path = '/mall2/ticketdetail';
        // }
        this.$router.push({
          path: path,
          query: {
            skuId: product.skuId,
            productType: product.productType,
            //isGroup: '1',
            groupId: item.id,
            mktGroupBuyId: item.mktGroupBuyId,
            spuId: product.spuId
          }
        })
      },

      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 20 }).then(res => {
          if (res.status == 0) {
            Dialog.alert({
              title: res.data[0].title,
              message: res.data[0].content
            }).then(() => {
              // on close
            });
          }
        })
      },
      toMyGroup:function () {
        this.$router.push({
          path: '/my_group',
        });
      }
    },
    computed: {
      bg() {
        return require('./image/group_bg_top.png')
      }
    },
    created() {
      if (this.$store.state.globalConfig.delivertype_default == '1') {
        this.deliveryTypes = [{
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }];
      } else if (this.$store.state.globalConfig.delivertype_default == '2') {
        this.deliveryTypes = [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }];
      }
      this.selectedType = this.$store.state.mall2.staticDeliverType;

      this.getGroupList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .list {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      position absolute;
      left 0;
      right 0
      top 0
      bottom 0
      overflow hidden;

      .group-top {
        overflow hidden;
        position relative;

        img {
          display block;
          width 100%;
          height 151px;
        }

        .explains {
          position absolute;
          right 0;
          top 20px;

          .item {
            font-size 14px;
            padding 10px 10px 10px 15px;
            background-color #F0B74F;
            color white;
            border-radius 20px 0 0 20px;
          }

          .item:nth-child(n+2) {
            margin-top 12px;
          }
        }
      }

      .list-content {
        position absolute;
        top 135px;
        bottom 0;
        right 0;
        left 0;
        z-index 10
        background-color white;
        border-radius 15px;

        .row {
          padding 15px 15px 2px;
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

        .group-list {
          position relative
          z-index 10
          // margin-top -30px
          height calc(100% - 40px);
          width 100%
          padding 5px 2px;
          overflow auto
          -webkit-overflow-scrolling touch

          .group-item {
            //box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
            box-shadow 0 1px 8px #ddd;
            padding 11px
            margin 8px
            border-radius 5px
            overflow: hidden
            background-color white

            .media-object {
              width 90px
              height 90px
              float: left
            }

            .media-content {
              overflow: hidden
              padding-left 8px
              position: relative
              .name {
                font-size: 15px
                line-height: 19px
                display: -webkit-box;
                overflow: hidden;
                white-space: normal !important;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .center {
                display flex
                align-items center
                padding-top: 10px
                justify-content space-between

                .price{
                  color: $color-theme-r
                  font-size $font-size-medium-x
                  .unit{
                    font-size $font-size-small
                  }
                  .main{
                    font-weight $font-weight-x
                  }
                  .num{
                    font-size $font-size-small
                    padding 0px 4px
                    border-radius 4px
                    margin-left 4px
                    border 1px solid $color-theme-r
                  }
                }
                .kaituan{
                  background-color $color-theme-r
                  color white
                  padding 6px 8px
                  border-radius 4px
                  font-size $font-size-medium
                }

                .count-down-con {
                  justify-content: flex-start
                }

                .text {
                  flex-shrink 0
                  font-size: 12px
                }
              }

            }

            .message {
              display flex
              align-items center
              justify-content space-between
              padding-top: 10px
            }
          }

        }
      }
    }
  }
</style>
