<template>
  <div class="tickets">
    <nav-top :noTitle="true" @backEvent="turnback">
      <div class="search">
        <div class="search-div theme_bg_white_f5"
             style="left: 50px; right: 50px; height: 30px; top: 7px; padding: 0 10px; border-radius: 15px;"
             @click="toSearchEvent">
          <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
          <span class="theme_font_tint" style="font-size: 14px; margin-left: 5px">门票景/点/酒店</span>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="condition">
        <div class="btns-con">
          <div class="left-btn theme_font_common" @click="filterClick('sort')">推荐排序
            <i class="iconfont mall-xiala theme_font_tint" :class="{'theme_font_common_i':filterType==1}"></i>
          </div>
          <div class="right-btn theme_font_common" @click="filterClick('more')">更多筛选
            <i class="iconfont mall-xiala theme_font_tint" :class="{'theme_font_common_i':filterType==1}"></i>
          </div>
        </div>
      </div>
      <div class="scrol" >
        <pull-to
          ref="ticketlistscrl"
          :bottomConfig="{pullText: '', triggerText: isCanLoadMore?'释放更新':'我是有底线的', loadingText: '加载中...', doneText: '加载完成', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: -50}" :isBottomAutoS="true"
          :bottom-load-method="getTicketList"   :is-bottom-bounce="isCanLoadMore">
          <div>
            <div class="cell shadow-cell" v-for="(item,index) in lists" @click="enterdetail(item)">
              {{dataProcessing(item)}}
              <div class="top-image">
                <img class="image-con" :src="item.phMainUrl"/>
                <div class="tip-con">
                  <div class="left-price theme_font_white "><span class="price-x">￥</span><span class="price-z">{{item.dpedData.integer}}</span><span class="price-x">.{{item.dpedData.decimals}}起</span>&nbsp&nbsp
                    <span class="price-x" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                              <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{item.dpedData.linePrice}}</span></div>
                  <P class="right-count theme_font_white ">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</P>
                </div>
              </div>
              <p class="content-con theme_font_gray">{{item.showTitle}}</p>
            </div>
          </div>
        </pull-to>
      </div>
      <div class="filter theme_font_common" v-if="isShowfilter" @click.stop="disappearClick">
        <div class="filter-white">
          <p v-for="(text,index) in sort" v-if="filterType==0" @click.stop="chooseFilter(index)">{{text}}</p>
          <p v-for="(text,index) in more" v-if="filterType==1" @click.stop="chooseFilter(index)">{{text}}</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import Search from '../common/search'

  export default {
    name: 'ticketlist',
    components: {
      PullTo,
      Search
    },
    data() {
      return {
        lists: [],
        isShowfilter: false,
        filterType: 0,
        sort: [
          '综合排序',
          '销量优先',
          '价格排序'
        ],
        more: [
          '门票',
          '酒店',
        ],
        orderByKey: '',
        categoryId: '',
        scrollValue:0,
        nowPage:1,
        isCanLoadMore:true,
        searchproName:'',

      }
    },
    methods: {
      enterdetail: function (item) {
        console.log(item)
        this.$router.push({
          path:'/mall2/ticketdetail',
          query:{
            id:item.id,
          }
        })
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
        // 展示活动
        // let showActivities = [];
        // for (let i = 0; i < item.activityTypes.length; i++) {
        //   let text = item.activityTypes[i]
        //   if (!~showActivities.indexOf(text)) {
        //     showActivities.push(text)
        //   }
        // }
        // item.showActivities = showActivities;
      },
      filterClick: function (type) {//排序筛选
        console.log(type)
        this.isShowfilter = !this.isShowfilter;
        if (type == 'sort') {//排序
          this.filterType = 0;

        } else if (type == 'more') {//更多筛选
          this.filterType = 1;
        }

      },
      chooseFilter: function (index) {
        this.isShowfilter = false;
        if (this.filterType == 0) {
          if (index == 0) {
            this.orderByKey = ''
          } else if (index == 1) {
            this.orderByKey = '1'
          } else if (index == 2) {
            this.orderByKey = '0'
          }
        }else if (this.filterType == 1) {
          if (index == 0) {
            this.categoryId = '5020'
          } else if (index == 1) {
            this.categoryId = '12094'
          }
        }
        this.getTicketList();
      },
      disappearClick:function(){
        console.log('disappearClick')
        this.isShowfilter = false;
      },
      getTicketList: function (loaded) {//获取售后列表

        let page = this.nowPage;
        if(loaded){
          page += 1;
        }
        let url = '/app/json/product/getAppProSearchList';
        this.$Loading.open();

        let params1 = {
          token: this.$store.state.login.token,
          page: page,
          rows: 20,
          orderByKey: this.orderByKey,//根据价格或销量排序 0：价格、1：销量
          featureIds: '',
          brandIds: '',
          deliverType: '',
          activityId: '',
          ascOrDesc: '0',//排序顺序 0：升序、1：降序
          mchOuCode: '',//商户编码
          proName: this.searchproName,//商品名称
          activityType: '',//活动类型
          categoryId: this.categoryId,//商品分类ID 门票 categoryId=5020, 酒店 categoryId=12215
          productType:'2',
          storeOuCode: '',//店铺编码
        }
        if (this.orderByKey == '1') {
          // 销量一定是降序
          params1.ascOrDesc = '1'
        }
        params1.deliverType = this.$store.state.mall2.staticDeliverType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          params1.pickUpId = this.$store.state.mall2.zitiAddress.id;
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {

            //只有请求成功 才赋值
            this.nowPage = page;
            if(this.nowPage > 1){
              this.lists = this.lists.concat(data.data.list);
            }else
            {
              this.lists = data.data.list;
            }
            //小于20条的时候  下拉状态提示
            if(data.data.list.length < 20){
              this.isCanLoadMore = false;
            }

          } else {
            this.$Toast(data.info)
          }
          if(loaded){
            loaded('done');
          }
        }, error => {
          if(loaded){
            loaded('done');
          }
          this.$Loading.close()
          console.log('获取列表', error);
          this.$Toast('获取数据失败')
        });
      },
      turnback:function () {//返回
        this.$router.go(-1);
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
            this.searchproName = searchStr
            this.getTicketList(0)
          }
        })
      },
    },
    created() {
      this.getTicketList();
    },
    activated () {
      this.$refs.ticketlistscrl.setScrollTopValue(this.scrollValue);

    },
    beforeRouteLeave (to, from, next) {
      this.scrollValue = this.$refs.ticketlistscrl.getScrollTopValue()
      if (to.path != '/mall2/ticketdetail') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .tickets {
    width 100%
    height 100%
    overflow hidden
    .condition {
      width 100%
      height 30px
      /*background-color #007aff*/
      font-size $font-size-medium
      display flex
      align-items center
      justify-items center
      .btns-con {
        margin: auto
        .left-btn {
          display inline-block
          i {
            font-size $font-size-medium
          }
        }
        .right-btn {
          margin-left 40px
          display inline-block
          i {
            font-size $font-size-medium
          }
        }
      }
    }
    .scrol {
      position absolute
      top 30px
      left 0px;
      right 0px
      bottom 0px
      overflow hidden;
      -webkit-overflow-scrolling touch
      .cell {
        .top-image {
          position relative
          .image-con {
            display block;
            width 100%
            height 150px
          }
          .tip-con {
            position absolute;
            bottom 0px;
            left 50px;
            right 0px;
            display flex
            align-items center
            // background-color rgba(59, 59, 59, 0.8)
            background: url('../../../../static/image/mall2/ticket-bottom.png') no-repeat center center / 100% 100%;
            height 30px
            font-size $font-size-small
            .left-price {
              flex 1
              margin-left 28px
              .line {
                text-decoration: line-through
              }
              .big-font {
                font-size $font-size-medium-x
                font-weight $font-weight-x
              }
              .price-z {
                font-size 16px;
                font-weight 500;
              }
              .price-x {
                font-size 12px;
                font-weight 500;
              }
            }
            .right-count {
              margin-right 8px
              font-size $font-size-small
            }
          }
        }
        .content-con {
          margin 8px 10px
          font-size $font-size-medium-s
          line-height 15px
          overflow: hidden;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;

        }
      }
    }

    .filter {
      position absolute
      top 30px
      left 0px;
      right 0px
      bottom 0px
      overflow-x hidden;
      z-index 99
      background-color rgba(0, 0, 0, 0.5)
      .filter-white{
        padding 10px 10px 0px 10px
        background-color #fff
        p {
          padding 10px 10px
          font-size $font-size-medium
          border-bottom 0.5px solid #ddd
        }
        p:nth-last-child(1) {
          border-bottom none
        }
      }

    }
  }

</style>
