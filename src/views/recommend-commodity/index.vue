
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="recommend-list" v-if="loding && recommendArr.length">
        <scroll @scroll="scrollHandler" :hasMore="isCanLoadMore" :pullUpLoad="true" :listenScroll="true" @pullingUp="_loadProList" :data="recommendArr" :startY='scrollTopValue' :probeType="2">
<!--          <div class="list-item">-->
<!--            <div class="item-box">-->
<!--              <span class="item-titer">全部商品</span>-->
<!--              <div class="item-sku">-->
<!--              </div>-->
<!--              <div class="item-btn">-->
<!--                <span @click.stop="shareBtn(item,0,true)">分享码</span>-->
<!--                <span @click.stop="shareBtn(item,1,true)">链接分享</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="list-item" v-for="(item,index) in recommendArr" :key="index">
            <div class="time">
              <span>{{item.createTime}}</span>
            </div>
            <div class="item-box">
              <span class="item-titer">{{item.referralsReason || '全部商品'}}</span>
              <div class="item-sku" @click="recommendationDetails(item)">
                <div class="pros-msg" @click.stop="showProsDetailEvent(item.referralsProSku)">
                  <span>共{{item.referralsProSku.length}}件</span>
                  <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
                </div>
                <div class="img-div" v-for="(imgUrl, imgIdx) in item.referralsProSku" v-if="imgIdx < 3" :key="`imgIdx${imgIdx}`" >
                  <img :src="imgUrl.phMainUrl" />
                </div>
              </div>
              <div class="item-btn">
                <span @click.stop="shareBtn(item,0)">分享码</span>
                <span @click.stop="shareBtn(item,1)">链接分享</span>
              </div>
            </div>
          </div>
        </scroll>
        <div class="recommend-list-btn">
          <span @click="addRecommend">新建推荐</span>
        </div>
      </div>
      <div class="recommend-list-no" v-if="loding && !recommendArr.length">
        <img style="width: 180px;margin: 20px 0px;" src="./img/首页.png" alt="">
        <span class="text">暂无推荐记录，选择商品推荐给好友</span>
        <div class="list-no-btn">
          <span @click="addRecommend">新建推荐</span>
        </div>
      </div>
      <pop-view v-if="showProsDetail" @closeEvent="showProsDetail = false" class="mall2">
        <div class="pop-body">
          <div class="pop-title theme_font_common">商品明细</div>
          <div class="pop-scroll-div">
            <div class="pro-row" v-for="(item,index) in recommendArrNew" :key="`recommendArrNew${index}`">
              <div class="img-div" style="padding: 10px;">
                <img :src="item.phMainUrl"/>
              </div>
              <div class="info-div">
                <div class="title-min theme_font_black">{{item.skuName}}</div>
                <div class="title-min theme_font_gray">
                  <span class="font-small" style="opacity: 0;">{{item.salePrice}}</span>
                </div>
                <div class="price">
                  <span class="font-small">¥ {{item.salePrice}}</span>
                  <span style="float: right;">x 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </pop-view>
    </nav-content>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Config from "@/api/config";
import Scroll from '@/components/base/scroll/scroll'
import PriceOrder from "@/components/commonui/price/price-order";

export default {
  name: "recommend-commodity",
  data() {
    return {
      page: 0,
      loding: false,
      showProsDetail: false,
      scrollTopValue: 0,
      isCanLoadMore: true,// 是否可以上拉加载更多
      recommendArr: [],
      recommendArrNew: []
    }
  },
  computed: {
    ...mapState(["globalConfig"])
  },
  activated() {
    // this._loadProList()
  },
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  },
  mounted() {
    this._loadProList()
  },
  beforeDestroy(){},
  methods: {
    backEvent() {
      console.log('this.$route.query',this.$route.query)
      let num = this.$router.customRouterData.routerPaths.length -1
      this.$router.go(-num);
        // this.$keepaliveHelper.deleteOthers(this)
      // if (this.$route.query.lastPath == 'qrcode') {
      //   this.$router.go(-4);
      // } else {
      //   this.$router.go(-1);
      // }
    },
    showProsDetailEvent(arr) {
      this.recommendArrNew = arr;
      this.showProsDetail = true;
    },
    scrollHandler(y){
      this.scrollTopValue = y.y
    },
    _loadProList() {
      this.page++;
      this.$request.post('/app/jqGrid/app_employee/referralsRecord',{page: this.page, rows: 10}).then(res => {
        this.loding = true
        if (res.status == 0) {
          let arr = res.data || []
          arr.forEach(item=>{
            item.referralsProSku = JSON.parse(item.referralsProSku)
          })
          this.recommendArr = this.recommendArr.concat(arr);
          let records = 0
          records = Number(res.records == '' ? 0 : res.records)
          if (this.recommendArr.length >= records) {
            this.isCanLoadMore = false;
          }else{
            // this.$emit("listStatus");
          }
        } else {
          this.$Toast(res.info);
        }

        // this.isCanLoadMore = false;
      });
    },
    addRecommend() {
      this.$router.push({ path: '/recommend-commodity/commodityType'})
    },
    recommendationDetails(item) {
      console.log(item)
      this.$router.push({
        path: '/recommend-commodity/recommendationDetails',
        query: item
      })
    },
    shareBtn(item,status,type) {
      let proSku = item.referralsProSku
      if (status) {
        this.$Loading.open()
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post('/app/json/user/getUserRfrCode', params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let shareData = {};
            shareData = {};
            shareData.title = '推荐商品'
            shareData.sharetext = item.referralsReason
            shareData.imageurl = proSku[0].phMainUrl
            shareData.detailurl = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/recommend-commodity/recomendlist?shareCode=${item.qrCode}&userNo=${data.data.userNo}`;
            this.$bridgefunc.wechatShare(shareData);
            console.log(shareData)
          } else {
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close();
        })
      } else {
        this.$router.push({
          path: '/recommend-commodity/qrcode',
          query: { qrcode: item.qrCode || ''}
        })
      }
    }
  },
  components: {
    Scroll,
    PriceOrder
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

/deep/ .nav-content{
  background-color #f6f6f6
}
.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .recommend-list-no {
    background-color #fff
    height 100%
    padding-top 10%
    display: flex;
    align-items: center;
    flex-direction column;
    .list-no-btn {
      width: 90%;
      height: 40px;
      margin-top 40px;s
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 14px;
        text-align center
        line-height 40px
        border-radius: 30px;
        background-color: #f02e2c;
      }
    }
  }
  .recommend-list {
    // padding-top 10px
    // margin: 10px 0;
    height 100%
    height calc(100% - 50px)
    /deep/ .list-wrapper {
      background none;
    }
    .list-item {
      margin: 10px 0;
      padding-top 10px
      display flex
      justify-content center
      align-items center
      flex-direction column
      .time {
        margin-bottom 10px
        background-color #ffff
        border-radius: 30px;
        span {
          color #999
          padding 6px 20px
          display inline-block
        }
      }
    }
    .item-box {
      width 100%
      padding 0 10px
      background-color #ffff
      .item-titer {
        width 100%
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display inline-block
        padding 10px
      }
      .item-sku {
        width 100%
        border-top 1px solid #eee
        border-bottom 1px solid #eee
        .img-div {
          width 70px
          height 70px
          margin 8px 4px

          display: inline-block;
          img {
            width 100%
            height 100%
            border-radius 6px
          }
        }

        .pros-msg {
          float: right;
          margin-top: 30px;
          font-size: 12px;
          i {
            font-size: 16px;
          }
        }
      }
      .item-btn {
        color #f02e2c
        padding 10px
        display flex
        justify-content flex-end
        span {
          display inline-block
          padding 3px 7px
          border 1px solid #f02e2c
          border-radius 10px
          margin-left 10px
        }
      }
    }
    .recommend-list-btn {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      height: 50px;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        width: 100%
        height: 100%
        color: #fff;
        font-size: 16px;
        // border-radius: 30px;
        display: inline-block;
        background-color: #f02e2c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
