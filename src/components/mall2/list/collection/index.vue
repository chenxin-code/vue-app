/**Created by liaoyingchao on 2018/11/30.*/

<template>
  <div class="index">
    <nav-top @backEvent="goBack" v-if="!wxenvironment()"></nav-top>
    <div v-if="loaded">
      <div class="no-collection" ref="collection">
        <van-tabs v-model="active" @change="changeTabs" class="van-tab-container">
          <!--            <van-tabs v-model="active" @click="collectionStore(active)">-->

          <van-tab title="收藏的商品">
            <div>
              <div v-if="!isShowCollect">
                <img class="no-collection-img" src="static/image/mall2/collection.png"/>
                <div class="recommend-div">
                  <Recommend></Recommend>
                </div>
              </div>
              <div v-if="isShowCollect">
                <!--<DetailList @productEvent="productEvent" :listData="proList" :hidden-car="true"></DetailList>-->
                <div class="row theme_bg_white" v-for="(item, idx) in proList" @click="productEvent(item)">
                  {{dataProcessing(item)}}
                  <mt-cell-swipe
                    :right="[{content: '取消收藏', style: { padding: '20px 14px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',}, handler: () => collectEvent(item,idx)}]"
                    class="cell-swipe">
                    <div slot="title">
                      <div class="img-div">
                        <img v-lazy="item.phMainUrl">
                      </div>
                      <div class="info-div">
                        <div class="title theme_font_black double-line">{{item.skuName}}</div>
                        <!--<div class="info-row activity">-->
                        <!--<div class="act-item theme_font_red theme_border_red" v-for="(activity, aidx) in item.showActivities" v-if="aidx < 4">{{activity}}</div>-->
                        <!--</div>-->
                        <div class="info-row price">
                          <span class="price-x theme_font_red">￥&nbsp;</span>
                          <span class="left-no-space price-z theme_font_red">{{item.dpedData.integer}}</span>
                          <span class="left-no-space price-z theme_font_red">&nbsp;.{{item.dpedData.decimals}}</span>
                          <span class="font-small theme_font_tint line-through" v-if="item.dpedData.linePrice">￥{{item.dpedData.linePrice}}</span>
                        </div>
                        <!--<div class="info-row num-info">-->
                        <!--<span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>-->
                        <!--<span class="font-small theme_font_tint">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span>-->
                        <!--</div>-->
                      </div>
                    </div>
                  </mt-cell-swipe>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="收藏的微店">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="collectionStore">
              <div>
                <!--                  <div v-if="!isShowshop">-->
                <!--                    <img class="no-collection-img" src="static/image/mall2/collection.png"/>-->
                <!--                  </div>-->
                <div v-for="(item,index) in storeList" :key="index">
                  <ul>
                    <li @click="operation(item)">
                      <p class="top" v-if="item.microStoreAttentionInfo.topFlag == 1">置顶</p>
                      <div class="contain">
                        <div class="div1">
                          <img :src="item.pictureUrl?item.pictureUrl:'/static/image/microShop/head@2x.png'" alt="">
                          <!--                        <span>{{item.storeName}}</span>-->
                          <div class="containDiv">
                            <p class="user">{{item.storeName}}</p>
                            <div class="code">关注店铺：{{item.microStoreAttentionInfo.id}}</div>
                            <div class="count">
                              <p>关注<span>{{item.microStoreAttentionInfo.attentionCount}}</span></p>
                              <p>订单<span>{{item.microStoreAttentionInfo.orderCount}}</span>笔</p>
                              <p>成交额<span>{{item.microStoreAttentionInfo.sellAmount}}</span>元</p>
                            </div>
                          </div>
                        </div>
                        <span class="iconfont mall-gengduo"></span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </van-list>
          </van-tab>
          <van-tab title="收藏的品牌">
            <div class="brand-list-container">
              <van-list
                v-model="isLoading"
                :finished="isFinished"
                finished-text="没有更多了"
                :offset="200"
                @load="getBrandList">
                <van-swipe-cell v-for="(item, index) in brandList" :key="index" class="brand-item">
                  <div class="item" @click.stop="brandClick(item)">
                    <img :src="item.logoUrl" alt="" class="logo">
                    <p class="brand-name">{{ item.brandName }}</p>
                  </div>
                  <template #right>
                    <van-button type="danger" text="取消收藏" class="cancel-collection" @click.stop="cancelCollection(item)"/>
                  </template>
                </van-swipe-cell>
              </van-list>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
    />
    <van-action-sheet
      v-model="show1"
      :actions="actions1"
      @select="onSelect"
    />
  </div>
</template>

<script>
  import Recommend from '../../list/recommend/index'
  import {Toast} from "vant";
  import api from "./api"
  import appNav from '@zkty-team/x-engine-module-nav'

  export default {
    name: "index",
    mixins: [api],
    components: {
      Recommend
    },
    data() {
      return {
        proList: [],
        loaded: false,
        isShowCollect: false,
        isShowshop: true,
        scrollValue: 0,
        active: 0,
        show: false,
        show1: false,
        storeList: [],
        actions: [
          {name: '置顶'},
          {name: '取消收藏'}
        ],
        actions1: [
          {name: '取消置顶'},
          {name: '取消收藏'}
        ],
        page: 0,
        loading: false,
        finished: false,
        topType: '',
        operationId: '',

        isLoading: true,
        isFinished: false,
        queryBrandPage: 0,
        brandList: [],
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
      // 添加收藏或者取消收藏
      collectEvent: function (item) {
        let url = '/app/json/user_pro_collect/addOrCancelUserProCollect';
        let paramsData = {
          token: this.$store.state.login.token,
          id: item.id,
          skuId: item.skuId,
          deliveryType: item.deliveryType,
          storeOuCode: item.storeOuCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this._getCollectionData();
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
        // 展示活动
        // let showActivities = [];
        // if (item.activityTypes) {
        //   for (let i = 0; i < item.activityTypes.length; i++) {
        //     let text = item.activityTypes[i]
        //     if (!~showActivities.indexOf(text)) {
        //       showActivities.push(text)
        //     }
        //   }
        // }
        // item.showActivities = showActivities;
      },
      _getCollectionData: function () {
        this.proList = []
        // let page = 1
        let url = '/app/json/product/loadUserProCollectList'
        let params1 = {
          token: this.$store.state.login.token,
          // page: {
          //   index: page,
          //   pageSize: 10
          // }
        }

        this.$Loading.open()
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.proList = data.data
            if (this.proList.length > 0) {
              this.isShowCollect = true;
            } else {
              this.isShowCollect = false;
            }
            this.loaded = true;
          } else {
            this.$Toast(data.info)
            this.isShowCollect = false;
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
          this.isShowCollect = false;
        });
      },
      productEvent: function (product) {
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2) {
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
      onSelect(item) {
        let that = this
        // 点击选项时默认不会关闭菜单，可以手动关闭
        that.show = false;
        that.show1 = false
        // Toast(item.name);
        if (item.name == '置顶') {
          console.log(11);
          that.upFun()
          console.log(33);
        } else if (item.name == '取消置顶') {
          that.upFun()
        } else if (item.name == '取消收藏') {
          that.collectionFun()
        }
      },
      operation(index) {
        console.log('sortVal值',index);
        let that = this
        that.operationId = index.storeId
        if (index.sortVal == 1) {
          that.show = false
          that.show1 = true
          that.topType = 2
        } else if (index.sortVal == 2) {
          that.show1 = false
          that.show = true
          that.topType = 1
        }
      },
      upFun() {  //置顶
        let that = this
        let params = {
          token: this.$store.state.login.token,
          id: that.operationId,
          topType: that.topType  //1：置顶操作 2：取消置顶操作
        }

        that.upData(params).then(res => {
          console.log(666, res);
          if (res.data.result === 'success') {
            that.finished = false
            that.page = 0
            that.storeList = []
            that.collectionStore()
          }
        })
      },
      collectionFun() {  //取消收藏
        let that = this
        let params = {
          token: this.$store.state.login.token,
          storeId: this.operationId
        }

        that.collectionData(params).then(res => {
          if (res.data.result === 'success') {
            that.finished = false
            that.page = 0
            that.storeList = []
            that.collectionStore()
          }
        })
      },
      collectionStore() { //收藏列表
        let that = this
        // console.log(data);
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          page: that.page,
          rows: 10
        }

        that.loading = true
        that.applyData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data || []
            that.storeList = that.storeList.concat(data) || []
            if (that.page >= res.data.totalPages) {
              that.finished = true
            }
          } else {
            Toast(res.data.info);
          }
          that.loading = false
        })
      },
      getBrandList() {
        this.$Loading.open()
        this.queryBrandPage++;
        this.isLoading = true;
        this.$http.post('/app/json/product/loadUserBrandCollectList', {
          page: this.queryBrandPage,
          rows: 20,
          collectType: 3
        }).then(res => {
          this.isLoading = false;
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.brandList.push(...data.data);
              if (this.brandList.length >= data.totalRecords) {
                this.isFinished = true;
              }
            } else {
              this.isFinished = true;
            }
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close()
        }).catch(err => {
          this.$Toast(`loadUserProCollectList err ${err}`);
          this.$Loading.close()
        })
      },
      cancelCollection(item) {
        console.log(item)
        this.$http.post('/app/json/user_pro_collect/addOrCancelUserProCollect', {
          collectType: 3,
          brandId: item.brandId,
          brandName: item.brandName,
          logoUrl: item.logoUrl,
        }).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('已取消收藏');
              this.isLoading = true;
              this.finished = false;
              this.brandList = [];
              this.getBrandList();
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      brandClick(item) {
        this.$router.push({
          path: '/brand_prod_list',
          query: {
            brandId: item.brandId,
          }
        })
      },
      changeTabs(name) {
        if (name == 2) {
          this.queryBrandPage = 0;
          this.isFinished = false;
          this.isLoading = true;
          this.brandList = [];
          this.getBrandList();
        }
      }
    },
    created() {
      if(this.wxenvironment()) {
        document.title = "我的收藏"
      }
      this.active = this.$route.query.active ? Number(this.$route.query.active) : 0;

    },
    mounted() {
      // this.collectionStore()
    },
    activated() {
      this._getCollectionData()
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    background #f6f6f6 !important;
    width 100%
    height 100%
    overflow hidden

    .no-collection {
      position absolute;
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      /*background: url('../../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;*/

      .no-collection-img {
        display block;
        margin 20px auto;
        width 240px;
      }

      .recommend-div {
        overflow hidden;
      }

      .row {
        margin 5px 8px 8px;
        padding 8px;
        overflow hidden;
        border-radius 6px;

        .img-div {
          float left;
          position relative;
          width 100px;
          height 100px;

          img {
            width 100%;
            height 100%;
          }
        }

        .info-div {
          padding-left 5px;
          overflow hidden;

          .title {
            padding 1px 0;
            margin 5px 0;
            font-size $font-size-medium;
            line-height 16px;
            height 33px;
          }

          .info-row {
            padding 9px 0 5px;

            .font-small {
              font-size 10px;
            }

            .price-z {
              font-size 16px;
              font-weight 500;
            }

            .price-x {
              font-size 12px;
              font-weight 500;
            }

            .left-no-space {
              margin-left -4px;
            }
          }

          .activity {
            display flex;
            align-items center;
            height 22px;
            padding 5px 0 0px;

            .act-item {
              padding 2px 8px;
              font-size 10px;
              border-radius 10px;
              border-width 0.5px
              border-style solid
              margin-right 4px;
            }
          }

          .num-info {
            padding-top 10px;

            .car-size {
              padding 5px;
              margin-top -10px;
              font-size 18px;
            }

            span:nth-child(2) {
              margin-left 10px;
            }
          }
        }
      }
    }
  }

  ul {
    li {
      /* width: 90%; */
      /* margin: 0 auto; */
      background: white;
      padding: 6px 12px;
      margin: 10px 0;

      .contain {
        display: flex;
        justify-content: space-between;
      }
      div {
        font-size 16px;

        img {
          vertical-align middle
          margin-right 10px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
        .containDiv {
          .count {
            display flex
          }
        }
      }
      .top {
        width 60px
        background #fe0018
        color white
        height: 25px;
        line-height: 25px;
        text-align center
        border-radius: 12px;
        margin-bottom 10px
      }
      .div1 {
        display flex
        justify-content flex-start
        .containDiv {
          .code {
            font-size 14px
            margin 7px 0
          }
          .count {
            font-size 14px
            display flex
            span {
              color #fe0018
              margin 0 6px 0 2px
            }
          }
        }
      }

      .iconfont {
        margin auto 0
      }
    }
  }

  .van-tab-container {
    height 100%;
  }
  .brand-list-container {
    position absolute;
    left 10px;
    right 10px;
    bottom 0;
    top 45px;
    overflow-y auto;
    .brand-item {
      .item {
        background-color #fff;
        border-radius 4px;
        box-shadow 0 0 5px #ddd;
        padding 10px;
        margin-top 8px;
        display flex;
        align-items center;
        .logo {
          display block;
          width 45px;
          height 45px;
          border-radius 50%;
          overflow hidden;
        }
        .brand-name {
          font-size 15px;
          padding-left 10px;
        }
      }
      /deep/ .van-swipe-cell__left,
      /deep/ .van-swipe-cell__right {
        display: inline-block;
        width: 90px;
        height: 100%;
        font-size: 15px;
        line-height: 44px;
        color: #fff;
        text-align: center;
      }
      .cancel-collection {
        width 100%;
        height 100%;
        border none;
      }
    }
  }
</style>
