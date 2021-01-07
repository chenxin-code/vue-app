/**Created by liaoyingchao on 2020-07-11.*/

<template>
  <div class="exchange-coupon-list">
    <nav-top :title="myPageTitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div v-if="layoutType == 1" class="my-balance">
          <div class="icon">
            <img src="../icbc/imgs/jyq-icon-2.png">
          </div>
          <div class="title">{{mTitle}}</div>
          <div class="right-div">
            <div class="number">¥<span>{{couponDetail.totalAmount || '0'}}</span></div>
            <div class="btn" @click="toUse">去使用</div>
          </div>
        </div>
        <div v-if="layoutType == 0" class="my-balance bj" @click="toUse">
          <img src="./img/bj-coupon.png" alt="">
        </div>
        <!--<div v-if="layoutType == 0" class="rule-btn" @click="toRules">使用规则</div>-->
        <!--<SubPage v-if="layoutType == 0" :divKeywords="'HKCouponListDiv'"></SubPage>-->
        <div class="tip">您当前可用的优客点余额为：{{getAssetsValue({rewardType: '100'})}}</div>
        <div class="coupon-content">
          <div class="item" v-for="(item, idx) in listData" :key="idx">
            <img class="bg-img" src="static/images/hk/coupon-bg.png">
            <div class="coup-cont">
              <div class="icon">
                <img :src="item.phMainUrl">
              </div>
              <div class="info">
                <div class="couFaceValue">¥<span>{{item.skuPropValues || 0+'元'}}</span></div>
                <div class="center-info">
                  <div class="title">{{item.shortName}}</div>
                </div>
              </div>
              <div class="right-div">
                <div>兑换价</div>
                <div class="price single-line"><PriceOrder :listitem="item" :isRMBEnd="true"></PriceOrder></div>
                <div class="btn" @click="exchangeEvent(item)">立即兑换</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import SubPage from '@/components/product/index/subpage/subpage'
  import PriceOrder from  '@/components/commonui/price/price-order'

  export default {
    name: "exchange-coupon-list",
    components: {
      PriceOrder,
      SubPage
    },
    data() {
      return {
        activityId: '',
        listData: [],
        layoutType: '0', // 0 北京， 1 广州
        couponDetail: {},
        myPageTitle: '',
        mTitle: '',
      }
    },
    methods: {
      getJYJInfo: function () {

        let url = '/app/json/djljy/router?m=getAccount'
        let paramsData = {
          userId: this.$store.state.userInfo.userId
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.couponDetail = JSON.parse(data.data).walletObj
            } else {
              this.$Toast(data.info)
            }
          }
        ).catch(err => {
          this.$Loading.close();
          this.$Toast("系统运行过程中遇到问题，请稍候再试");
        })
      },
      toUse: function () {
        if (this.layoutType == '1') {
          console.log('去 大家来加油 小程序！')
          this.$market.enterNav({
            link: {
              type: 9,
              url: '/pages/openMp/main?xcxId=' + encodeURIComponent('wx32fe2eb8b2fa221f') + '&imgUrl=' + encodeURIComponent(this.$store.state.globalConfig.appNavMnpImgUrl) + '&path=' + encodeURIComponent('/pages/my-coupon/main')
            }
          })
        } else {
          console.log('去 一键加油 小程序！')
          this.$market.enterNav({
            link: {
              type: 9,
              url: '/pages/openMp/main?xcxId=' + encodeURIComponent('wxbfe24664b9cf5b3b') + '&imgUrl=' + encodeURIComponent(this.$store.state.globalConfig.appNavMnpImgUrlYJJY) + '&path=' + encodeURIComponent('/pages/index/onekeyrefuel/QGOneKeyRefuel')
            }
          })
        }
      },
      getAssetsValue: function (item) {

        if (item.rewardType) {
          let rewardList = this.$store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplus
            }
          }
          return '0'
        }

        return this.$store.state.mall2.myAssets[item.countKey]
      },
      toRules: function () {
        this.$router.push({
          path: '/usercenter/agreement',
          query:{
            value: 80
          }
        })
      },
      exchangeEvent: function (item) {
        this.$market.exchangeCoupon(item)
      },
      getListData: function () {
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          page: 1,
          rows: 10
        };
        paramsData.activityId = this.activityId

        paramsData.productType = '513'

        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let list = data.data.list;
              let arr = []
              for (let i = 0; i < list.length; i++) {
                let newitem = this.$market.dataProcessing(list[i])
                arr.push(newitem)
              }
              this.listData = this.listData.concat(arr)
            }
          },
          error => {
          }
        );
      },
    },
    created() {
      this.layoutType = this.$route.query.layoutType || '0'
      this.activityId = this.$route.query.activity || ''
      this.listData = []
      this.getListData()
      this.getJYJInfo()

      if (this.layoutType == 0) {
        // 北京
        this.myPageTitle = '加油金专区'
        this.mTitle = '我的加油金'
      } else if (this.layoutType == 1) {
        // 广州
        this.myPageTitle = '加油券专区'
        this.mTitle = '我的加油券'
      }

      window.document.title = this.myPageTitle
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchange-coupon-list {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      position relative;
      background-color #efefef;
      width 100%
      height 100%
      overflow-y auto;
      .my-balance {
        display flex;
        align-items center;
        margin 10px;
        background url("./img/bg.png") repeat center center / 100% 100%;
        padding 10px;
        .icon {
          padding-right 10px;
          border-right 1px dotted #ddd;
          img {
            display block;
            width 60px;
            height 60px;
          }
        }
        .title {
          padding 10px;
          flex 1;
          font-size 20px;
        }
        .right-div {
          padding 12px 0px;
          text-align center;
          .number {
            color #FD6802;
            span {
              font-size 20px;
              font-weight 500;
            }
          }
          .btn {
            width 70px;
            font-size 14px;
            color white;
            background-color #FD6802;
            margin 14px auto 0;
            padding 6px 10px;
            border-radius 20px;
          }
        }
        &.bj{
          padding:0;
          img{
            display:block;
            width 100%
          }
        }
      }
      .rule-btn {
        position absolute;
        right 0;
        top 25px;
        z-index 20;
        padding 6px 10px 6px 16px;
        background-color rgba(255, 255, 255, 0.3)
        color white;
        font-size 14px;
        border-radius 20px 0 0 20px;
      }
      .tip {
        margin 10px 0;
        text-align center;
        padding 12px;
        background-color #FCF4E6;
        color #FD6802;
        font-size 14px;
      }
      .coupon-content {
        padding 0 10px;
        .item {
          margin-bottom 10px;
          position relative;
          .bg-img {
            width 100%;
          }
          .coup-cont {
            position absolute;
            left 0;
            right 0;
            top 0;
            bottom 0;
            display flex;
            align-items center;
            .icon {
              margin-left 10px;
              img {
                display block;
                width 80px;
                height 80px;
              }
            }
            .info {
              flex 1;
              padding 0 10px;
              .couFaceValue {
                color #FD6802;
                font-weight 600;
                span {
                  font-size 20px;
                  font-weight 600;
                }
              }
              .center-info {
                margin-top 20px;
                flex 1;
                .title {
                  line-height 20px;
                  font-size 16px;
                  font-weight 600;
                }
              }
            }
            .right-div {
              //background-color rgba(255, 0, 0, 0.3)
              width 80px;
              text-align center;
              font-size 12px;
              .price {
                padding 10px 0;
                color #FD6802;
                font-weight 500;
                font-size 14px;
                >>>.theme_font_red {
                  color #FD6802;
                }
              }
              .btn {
                background-color #FD6802;
                margin 0 5px
                border-radius 20px;
                padding 6px 6px;
                color white;
                font-size 13px;
              }
            }
          }
        }
      }
    }
  }
</style>
