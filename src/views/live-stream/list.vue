/**Created by liaoyingchao on 2020-04-03.*/

<template>
  <div class="list">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll">
        <pull-to
          ref="listContent"
          :top-load-method="topRefresh"
          :is-bottom-bounce="false"
          :is-top-bounce="true"
        >
          <div class="list-content">
            <div class="no-list" v-if="loaded && list.length == 0">
              <img src="./imgs/no-list.png">
            </div>
            <div class="item" @click="toSee(idx)" v-for="(item, idx) in list">
              <div class="img-div">
                <img :src="item.lbImg">
                <div class="info-div">
                  <div class="row">
                    <div>{{item.listener || 0}}观看</div>
                    <div class="shoucang">
                      <i class="iconfont mall-shoucang"></i>
                      <span>{{item.likes || 0}}</span>
                    </div>
                  </div>
                  <div class="row bottom-row">
                    <div class="header-img">
                      <img :src="item.headImg">
                    </div>
                    <div class="name single-line">
                      {{item.name || ''}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-info">
                <div class="item-name single-line">{{item.topic}}</div>
                <div class="pro-info">
                  <div class="pro-pic">
                    <img :src="item.phPicUrl">
                  </div>
                  <div class="pro-name single-line">{{item.skuName}}</div>
                  <div class="pro-price">¥{{item.salePrice}}</div>
                </div>
              </div>
            </div>
            <div class="item clear" v-if="list.length % 2 == 1"></div>
          </div>
        </pull-to>
      </div>
    </nav-content>
    <LiveStream ref="LiveStream" v-show="showLiveStream" :list="list" @backEvent="showLiveStream = false" @removeIndexItem="removeIndexItem"></LiveStream>
  </div>
</template>

<script>
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import LiveStream from './detail'

  export default {
    name: "list",
    components: {
      LiveStream,
      PullTo
    },
    data() {
      return {
        showLiveStream: false,
        list: [],
        loaded: false,
        detailData: {},
        backType: ''
        // playId: ''
      }
    },
    methods: {
      // 返回首页，这里很low但是没bug，切最简单，需要找机会处理
      backIndex: function () {
        if (this.$store.state.webtype == 3) {
          wx.miniProgram.reLaunch({url: `/pages/index/main`})
          return
        }
        let num = this.$router.customRouterData.routerPaths.length - 1
        // for (let i = num; i > 0; i--) {
        this.$router.go(-num);
        // }
        this.$keepaliveHelper.deleteOthers(this)
      },
      backEvent: function () {
        if (this.backType == 'backindex') {
          this.backIndex()
        } else {
          this.$router.go(-1)
        }
      },
      removeIndexItem: function (index) {
        this.list.splice(index, 1)
      },
      topRefresh: function (loaded) {
        // loaded('done')
        this.getListData(loaded)
      },
      toSee: function (idx) {
        this.showLiveStream = true
        this.$refs.LiveStream.doPlayIndex(idx)
      },
      getListData: function (loaded = null) {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/list';
        let params = {
          page: {
            index: 1,
            pageSize: 20
          }
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            if (loaded) {
              loaded('done')
            }
            let arr = data.data;
            this.loaded = true
            if (arr.length) {
              this.list = []
              arr.forEach((item, index) => {
                this.list.push(item)
              });
            } else {
              this.list = []
            }
          } else {
            this.$Toast(data.info)
            if (loaded) {
              loaded('done')
            }
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
          if (loaded) {
            loaded('done')
          }
        });
      }
    },
    created() {
      this.backType = this.$route.query.backType || ''
      this.getListData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .list {
    width 100%
    height 100%
    overflow hidden
    position relative;

    .scroll {
      height 100%;
      width 100%;
      //overflow-y auto;
      overflow hidden;
      background-color #efefef;

      .list-content {
        width 100%;
        display flex;
        flex-wrap wrap;
        justify-content space-evenly
        padding-bottom 10px;
        .no-list {
          margin 20px auto;
          //width 250px;
          img {
            width 250px;
          }
        }
        .item {
          background-color white;
          width 172px;
          margin-top 10px;
          //height 200px;
          border-radius 8px;
          overflow hidden;
          &.clear {
            background-color transparent;
          }
          .img-div {
            position relative;
            width 172px;
            height  200px;
            img {
              display block;
              width 100%;
              height  100%;
            }
            .info-div {
              position absolute;
              left 0;
              right 0;
              top 0;
              bottom 0;
              z-index 1;
              .row {
                display flex;
                align-items center;
                justify-content space-between;
                padding 10px 8px;
                color white;
                font-size 12px;
                .name {
                  max-width 110px;
                  font-size 14px;
                }
                .shoucang {
                  display flex;
                  align-items center;
                  justify-content space-between;
                  .mall-shoucang {
                    margin-right 5px;
                    font-size 16px;
                  }
                }
                .header-img {
                  width 30px;
                  height 30px;
                  border-radius 16px;
                  overflow hidden;
                  margin-right 8px;
                }
              }
              .bottom-row {
                position absolute;
                left 0;
                right 0;
                bottom 0;
                padding-bottom 5px;
                justify-content flex-start;
              }
            }
          }
          .item-info {
            padding 8px;
            .item-name {
              font-size 14px;
              font-weight 600;
              padding 0px 0 8px;
            }
            .pro-info {
              .pro-name {
                overflow hidden;
                color #999;
                font-size 12px;
              }
              .pro-price {
                margin-top 6px;
                font-size 12px;
              }
              .pro-pic {
                float right;
                width 30px;
                height 30px;
                border-radius 3px;
                overflow hidden;
                img {
                  display block;
                  width 100%;
                  height 100%;
                }
              }
            }
          }
        }
      }
    }

  }
</style>
