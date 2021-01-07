<template>
  <div class="microshop-list">
    <nav-top title="微店列表" @backEvent="$router.go(-1)">
      <!--      <div @click="search" class="search">-->
      <!--        <div>-->
      <!--          <i class="icon iconfont mall-sousuo"></i>-->
      <!--        </div>-->
      <!--      </div>-->
    </nav-top>
    <nav-content class="microshop-list-content">
      <!--      <div>-->
      <!--        <div-->
      <!--          class="microshop-item"-->
      <!--          v-for="(item, index) in microShopList"-->
      <!--          :key="index"-->
      <!--          @click="microShopItemClick(item)"-->
      <!--        >-->
      <!--          <div class="item-title">-->
      <!--            <img :src="item.pictureUrl" alt width="60" height="60" />-->
      <!--            <div class="item-content">-->
      <!--              <h2>{{item.storeName}}</h2>-->
      <!--              <div class="item-introduc">简介: {{item.storeProfile}}</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="searchIcon" @click="search">
        <i class="icon iconfont mall-sousuo"></i>
        <span>微店名称</span>
      </div>
      
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <div v-for="(item,index) in microShopList" :key="index">
          <ul>
            <li @click="microShopItemClick(item)">
              <p class="top" v-if="item.microStoreAttentionInfo.topFlag == 1">置顶</p>
              <div class="contain">
                <div class="div1">
                  <img :src="item.pictureUrl?item.pictureUrl:'/static/image/microShop/head@2x.png'" alt="">
                  <!--                        <span>{{item.storeName}}</span>-->
                  <div class="containDiv">
                    <p class="user">{{item.storeName}}</p>
                    <div class="code">店铺号：{{item.microStoreAttentionInfo.id}}</div>
                    <div class="count">
                      <p>关注<span>{{item.microStoreAttentionInfo.attentionCount}}</span></p>
                      <p>订单<span>{{item.microStoreAttentionInfo.orderCount}}</span>笔</p>
                      <p>成交额<span>{{item.microStoreAttentionInfo.sellAmount}}</span>元</p>
                    </div>
                  </div>
                </div>
                <span class="attentionName" @click.stop="followEvent(item,1)"
                      v-if="item.microStoreAttentionInfo.attentionFlag == 1">已关注</span>
                <span class="attentionName attentionNames" @click.stop="followEvent(item,0)"
                      v-if="item.microStoreAttentionInfo.attentionFlag == 0">关注</span>
              </div>
            </li>
          </ul>
        </div>
      </van-list>
      
<!--      <div v-for="(item,index) in microShopList" :key="index">-->
<!--        <ul>-->
<!--          <li @click="microShopItemClick(item)">-->
<!--            <p class="top" v-if="item.microStoreAttentionInfo.topFlag == 1">置顶</p>-->
<!--            <div class="contain">-->
<!--              <div class="div1">-->
<!--                <img :src="item.pictureUrl?item.pictureUrl:'/static/image/microShop/head@2x.png'" alt="">-->
<!--                &lt;!&ndash;                        <span>{{item.storeName}}</span>&ndash;&gt;-->
<!--                <div class="containDiv">-->
<!--                  <p class="user">{{item.storeName}}</p>-->
<!--                  <div class="code">店铺号：{{item.microStoreAttentionInfo.id}}</div>-->
<!--                  <div class="count">-->
<!--                    <p>关注<span>{{item.microStoreAttentionInfo.attentionCount}}</span></p>-->
<!--                    <p>订单<span>{{item.microStoreAttentionInfo.orderCount}}</span>笔</p>-->
<!--                    <p>成交额<span>{{item.microStoreAttentionInfo.sellAmount}}</span>元</p>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <span class="attentionName" @click.stop="followEvent(item,1)"-->
<!--                    v-if="item.microStoreAttentionInfo.attentionFlag == 1">已关注</span>-->
<!--              <span class="attentionName attentionNames" @click.stop="followEvent(item,0)"-->
<!--                    v-if="item.microStoreAttentionInfo.attentionFlag == 0">关注</span>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
      <div v-show="microShopView">
        <p class="nullData" v-show="microShopList.length==0">微店列表为空</p>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        microShopList: [],
        cityObj: {
          cityId: '',
          storeName: ''
        },
        loading: false,
        finished: false,
        page: 0,
        microShopView: false
      }
    },
    mounted() {
      if (this.$route.query.cityObj) {
        this.cityObj = this.$route.query.cityObj
      }
      // this.getMicroShopList()
    },
    methods: {
      loadMore() {
        this.page = this.page + 1
        this.$request.post('/app/json/micro_store_front_end/getAllMictoStores', {
          storeName: this.cityObj.storeName,
          cityId: this.cityObj.cityId,
          page: this.page,
          rows: 10,
        }).then(res => {
          if (res.status == 0) {
            this.microShopList = this.microShopList.concat(res.data)
            if (this.microShopList.length >= res.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
          // if (res.status === 0) {
          //   this.microShopView = true
          //   this.microShopList = res.data || []
          // } else {
          //   this.$Toast(res.info)
          // }
        })
      },
      followEvent: function (item, index) {
        let url = '/app/json/micro_store_front_end/addOrCancelMicroStoreCollect';
        let paramsData = {
          token: this.$store.state.login.token,
          storeId: item.microStoreAttentionInfo.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              if (index == 1) {
                this.$Toast('取消关注成功');
              } else if (index == 0) {
                this.$Toast('关注成功');
              }
              this.$Toast('');
              if (item.microStoreAttentionInfo.attentionFlag == 0) {
                item.microStoreAttentionInfo.attentionFlag = 1
              } else {
                item.microStoreAttentionInfo.attentionFlag = 0
              }
              // this.getMicroShopList();
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      microShopItemClick(item) {
        console.log(item)
        // this.$store.state.globalConfig.micro_shop_check_page_type = 2
        if (this.$store.state.globalConfig.micro_shop_check_page_type == '2') {
          this.$router.push({path: '/micro_sho/shop_around1', query: {storeID: item.storeCode, id: item.id}})
        } else {
          this.$router.push({path: '/micro_sho/shop_around', query: {storeID: item.storeCode, id: item.id}})
        }
      },
      search() {
        this.$router.push({
          path: '/micro_sho/search_store_name'
        })
      },
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';

  .microshop-list {
    .microshop-list-content {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background-color: #f4f4f4;

      .microshop-item {
        margin-bottom: 10px;
        background-color: #fff;
        padding: 10px 20px;

        .item-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          img {
            margin-right: 15px;
            border-radius: 70%;
          }

          .item-content {
            h2 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .item-introduc {
              line-height: 18px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
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
      padding: 8px 12px;
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
        width 64px
        background #fe0018
        color white
        height: 25px;
        line-height: 25px;
        text-align center
        border-radius: 12px;
        margin-bottom 10px
      }

      .attentionName {
        margin auto 0
        padding 0px 10px
        height 25px
        line-height 25px
        text-align center
        border-radius: 12px;
        /*color #99ea8*/
        /*border 1px solid #99ea8*/
        color #fc8e93
        border 1px solid #fc8e93
        font-size 13px
      }

      .attentionNames {
        color #fe0018
        border 1px solid #fe0018
      }

      .div1 {
        display flex
        justify-content flex-start
        overflow hidden;
        flex 1;

        .containDiv {
          .user {
            font-size 18px
          }

          .code {
            font-size 14px
            margin 12px 0
          }

          .count {
            font-size 14px
            display flex
            align-items center;

            span {
              color #fe0018
              font-size 14px;
              margin 0 2px;
            }

            p {
              margin-right 8px;
            }
          }
        }
      }

      .iconfont {
        margin auto 0
      }
    }
  }

  .search {
    float: right;
    display: flex;
    margin-right: 10px;
    justify-content: space-around;
    position: relative;
    z-index: 10;
    padding 0 15px;

    .name {
      margin-right: 10px;
      font-size: 14px;
    }
  }

  .searchIcon {
    border: 1px solid #dddddd;
    margin: 8px 12px;
    height: 35px;
    line-height: 35px;
    border-radius: 25px;
    background: white;
    text-align: center;
    font-size: 15px;
    color: #dddddd;
  }

  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }
</style>
