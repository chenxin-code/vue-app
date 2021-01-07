
<template>
  <div class="box">
    <nav-top @backEvent="backEvent" :bgImg="require('./image/bg-1.png')"></nav-top>
    <nav-content>
      <div class="background">
        <div class="background-btn">
          <span @click="rules">活动规则</span>
          <span @click="linkTo">我的砍价</span>
        </div>
      </div>
      <div class="all-content">
        <scroll @scroll="scrollHandler" :hasMore="isCanLoadMore" :pullUpLoad="true" :listenScroll="true" :data="bargainArr" :startY="scrollTopValue" :probeType="2" v-if="bargainArr.length" >
          <div v-if="flag==1">
            <van-tabs v-model="active" swipe-threshold="3">
              <van-tab  v-for="(item,index) in bargainArr" :key="index">
                <template #title>
                  <div class="time">
                    {{item.time.split(" ")[1].slice(0,5)}}
                  </div>
                  <div class="status">
                    {{item.cutActivityType==0?'抢购中':'未开始'}}
                  </div>
                </template>
                <div v-for="(item1,index1) in item.bargainProduct" :key="index1">
                  <group :groupCoupon="item1" @success='success' :type="item" @inventFrend="invent"/>
                </div>
              </van-tab>

              <!--              <van-tab title="">内容 2</van-tab>-->
            </van-tabs>
          </div>
          <div v-else>
            <div v-for="(item,index) in bargainArr" :key="index">
              <group :groupCoupon="item" @success='success' @inventFrend="invent"/>
            </div>
          </div>

        </scroll>
        <div class="no-list" v-if="!bargainArr.length">
          <div class="img-div">
            <img src="./image/拼券.png" />
          </div>
          <div class="tip theme_font_gray">暂无活动，快去发起砍价活动吧~</div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
  import group from "./common/group.vue";
  import Scroll from "@/components/base/scroll/scroll";
  export default {
    name: "group-ticket",
    components: {
      group,
      Scroll
    },
    computed: {},
    data() {
      return {
        shareView:false,
        active:0,
        flag:true,
        scrollTopValue: 0,
        isCanLoadMore: false,
        bargainArr: [],
        params: {
          // page: 1,
          // rows: 10,
          state: 1,
          groupBuyType: 0
        }
      };
    },
    mounted() {
      this.flag=this.$store.state.globalConfig.bargain_page_time
      if(this.flag){
        this._loadProListTwo();
      }else{
        this._loadProList();
      }

    },
    methods: {
      invent(flag){
        this.shareView=true
      },
      backEvent() {
        this.$router.go(-1)
      },
      rules() {
        this.$router.push({
          path: "/bargain/rules"
        });
      },
      linkTo() {
        this.$router.push({
          path: "/bargain/my_bargainList"
        });
      },
      scrollHandler() {},
      success() {
        this._loadProList()
      },
      _loadProList() {
        this.$request.post("/app/json/user_bargain/getBargainProductList").then(res => {
          if (res.status == 0) {
            this.bargainArr = res.data || [];
            console.log(this.bargainArr,'this.bargainArr')
            this.bargainArr.forEach(res=>{
              res.timEnew = this.$util.getDateFromString(res.createTime) + res.lengthTime * 60
            })
            // actState;// 活动商品状态 // 0：未发起，1：进行中。2：砍价结束
          } else {
            this.$Toast(res.info);
          }
        })
      },
      _loadProListTwo() {
        this.$request.post("/app/json/user_bargain/getBargainProductListByTime").then(res => {
          if (res.status == 0) {
            this.bargainArr = res.data || [];
            // if(this.bargainArr.length>3){
            //   this.bargainArr=this.bargainArr.slice(0,3)
            // }
            console.log(this.bargainArr,'this.bargainArr')
            this.bargainArr.forEach(res=>{
              console.log(res.time)
              res.bargainProduct.forEach((value)=>{

                value.timEnew = this.$util.getDateFromString(value.createTime||value.time) + value.lengthTime * 60
              })
            })
            // actState;// 活动商品状态 // 0：未发起，1：进行中。2：砍价结束
          } else {
            this.$Toast(res.info);
          }
        })
      }
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .box {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .background {
      height: 160px;
      display: flex;
      flex-direction: row-reverse;
      background: url('./image/bg-2.png') repeat center center / 100% 100%;

      .background-btn {
        width: 80px;
        height: 56px;
        display: flex;
        margin-top: 10px;
        flex-direction: column-reverse;
        justify-content: space-between;

        span {
          color: #fff;
          width: 100%;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 10px 0 0 10px;
          background-color: rgba(0, 0, 0, 0.13);
        }
      }
    }
    .list-wrapper {
      background: none;
    }

    .all-content {
      height: calc(100% - 120px);
      width: 94%;
      margin: 0 auto;
      margin-top: -43px;
      background-color: #fff;
      border-radius: 10px 10px 0 0;

      .no-list {
        .img-div {
          margin-top: 20px;
          text-align: center;

          img {
            margin-top 40px
            width: 160px;
          }
        }

        .tip {
          margin-top: 10px;
          padding: 10px;
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    height 75px
  }
  /deep/.van-tab__text--ellipsis{
    display block
  }
  .status{
    font-size 18px
    text-align center
    padding 3px
  }
  .time{
    text-align center
    padding 3px
  }
  .van-tab--active .time,.van-tab--active .status{
    color red
  }
  >>> .stateBox {
    z-index: 2001;
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }
  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
  /deep/.van-tab{
    width 30%
  }
</style>
