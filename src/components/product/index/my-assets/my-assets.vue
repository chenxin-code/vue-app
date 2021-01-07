/**Created by liaoyingchao on 2018/12/24.*/

<template>
  <div class="my-assets">
    <div v-if="moduleData.styleTempl == '1'" class="style1">
      <div class="content">
        <div class="items-row" v-if="refresh">
          <div class="item" v-for="(item,idx) in orderItems" @click="customPush(item)" :key="idx">
            <!--<img :src="item.img"/>-->
            <div class="number">{{getAssetsValue(item)}}</div>
            <div class="text">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '2'" class="style2">
      <div class="content" :style="getSidesStyle()">
        <!--<div class="title-row">-->
        <!--<div class="title">我的订单</div>-->
        <!--<div class="text">全部订单</div>-->
        <!--<img class="arrow" src="static/images/my-assets/all-order.png"/>-->
        <!--</div>-->
        <div class="items-row" v-if="refresh">
          <div class="item" v-for="(item,idx) in orderItems" @click="customPush(item)" :key="idx">
            <!--<img :src="item.img"/>-->
            <div class="number">{{getAssetsValue(item)}}</div>
            <div class="text">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 样式3 -->
    <div v-if="moduleData.styleTempl == '3'" class="style2">
      <div class="content" :style="getSidesStyle()">
        <!--<div class="title-row">-->
        <!--<div class="title">我的订单</div>-->
        <!--<div class="text">全部订单</div>-->
        <!--<img class="arrow" src="static/images/my-assets/all-order.png"/>-->
        <!--</div>-->
        <div class="items-row" v-if="refresh">
          <div class="item" v-for="(item,idx) in orderItems" @click="customPush(item)" :key="idx">
            <!--<img :src="item.img"/>-->
            <div class="number">{{getAssetsValue(item)}}</div>
            <div class="text">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-div" :style="getBgStyle()"></div>
  </div>
</template>

<script>
  import Bus from '../bus'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'my-assets',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData','pageCurrentData'],
    mixins:[hee],
    data() {
      return {
        orderItems: [],
        refresh: true
      };
    },
    computed: {
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    created() {
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
      this.myAssetsInit()
      this.getMyAssets();

      Bus.$on('myAssetsRefresh', callback => {
        this.myAssetsInit()
      });
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getSidesStyle: function () {
        let styleStr = '';
        // let sidesMargin = this.moduleData.sidesMargin
        // if (sidesMargin > 0) {
        //   styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        // }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }

        return styleStr;
      },
      customPush: function (item) {
        if (item.link.path == '') {
          return ;
        }
        this.$market.customPush(item.link)
      },
      accTypeToName: function (accType, subCode) {
        try {
          return this.$mallCommon.accTypeToName(accType, subCode)
        } catch (e) {
          return ''
        }
      },
      initModuleData(){
        this.$set(this.moduleData,'isShowJYK',true) // 是否显示加油卡
        this.$set(this.moduleData,'isShowDZQ',true) // 是否显示电子券
        this.$set(this.moduleData,'isShowYJ',false) // 是否显示油金
        this.$set(this.moduleData,'isShowJF',true) // 是否显示积分
      },
      sortData: function() {

      },
      myAssetsInit: function () {
        // 初始化数据
        if(this.moduleData.isShowYJ === undefined) this.initModuleData();
        // 按钮排序
        this.sortData();
        this.orderItems = [
          {
            name: '加油卡',
            defaultName: '加油卡',
            countKey: 'cardNum',
            link: {
              path: '/addcard'
            }
          },
          {
            name: '电子券',
            defaultName: '电子券',
            countKey: 'couponNum',
            link: {
              path: this.$store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'
            },
          },
          {
            name: '积分',
            defaultName: '积分',
            countKey: 'surplusPoints',
            link: {
              path: '/mall2/integralinfo'
            },
          },
        ]
        if (this.moduleData.styleTempl == '3') {
          this.orderItems.splice(1, 1, {
            name: '电子券',
            defaultName: '电子券',
            countKey: 'couponNum',
            link: {
              path: this.$store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'
            },
          })
        }
        if (this.moduleData.isShowJF == false) {
          this.orderItems.splice(2, 1)
        }
        if (this.moduleData.isShowYJ) {
          let name,path
          if (this.moduleData.styleTempl == '3') {
            name = this.accTypeToName("Rewards", '100') || '油金'
            path = '/oil-point-history'
          } else {
            name = '油金'
            path = '/usercenter/rebatebonus'
          }
          this.orderItems.splice(2, 0, {
            name: name,
            defaultName: name,
            rewardType: '100',
            link: {
              path
            }
          })
        }
        if (this.moduleData.sortArr) {
          let arr = []
          for (let i = 0; i < this.moduleData.sortArr.length; i++) {
            for (let j = 0; j < this.orderItems.length; j++) {
              if (
                (this.moduleData.sortArr[i].countKey && this.moduleData.sortArr[i].countKey == this.orderItems[j].countKey) ||
                (this.moduleData.sortArr[i].rewardType && this.moduleData.sortArr[i].rewardType === this.orderItems[j].rewardType)
              ) {
                this.orderItems[j].name = this.moduleData.sortArr[i].name;
                arr.push(this.orderItems[j])
                break ;
              }
            }
          }
          this.orderItems = arr;
        }

        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
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
      getBgStyle: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }

        return styleStr;
      },
      modeleReshow: function () {
        this.getMyAssets();
      },
      getMyAssets: function() {
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
            }
          },
          error => {
          }
        );
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .my-assets {
    position relative;
    .bg-div {
      position absolute;
      left 0;
      right 0;
      top -1px;
      bottom -1px;
      z-index 1;
    }
    .style1 {
      position relative;
      z-index 2;
      overflow hidden;
      padding 5px 8px;
      .content {
        box-shadow 0 1px 8px #efefef;
        border-radius 8px;
        padding 8px;
        .title-row {
          padding 8px 0px;
          // border-bottom 0.5px solid #ddd;
          display flex;
          align-items center;
          .title {
            font-size 15px;
            font-weight 500;
            flex 1;
          }
          .text {
            font-size 13px;
            color #666;
          }
          .arrow {
            margin-left 5px;
            height 12px;
          }
        }
        .items-row {
          padding 8px 0px;
          display flex;
          align-items center;
          .item {
            flex 1;
            text-align center;
            font-size 0px;
            img {
              width 23px;
              height 23px;
            }
            .number {
              font-size 16px;
              font-weight 500;
              color #1a1a1a;
            }
            .text {
              margin-top 8px;
              font-size 13px;
              color #333;
            }
          }
        }
      }
    }
    .style2 {
      position relative;
      z-index 2;
      overflow hidden;
      padding 5px 8px;
      .content {
        border-radius 8px;
        /*padding 8px;*/
        .title-row {
          padding 8px 0px;
          // border-bottom 0.5px solid #ddd;
          display flex;
          align-items center;
          .title {
            font-size 15px;
            font-weight 500;
            flex 1;
          }
          .text {
            font-size 13px;
            color #666;
          }
          .arrow {
            margin-left 5px;
            height 12px;
          }
        }
        .items-row {
          display flex;
          align-items center;
          .item {
            flex 1;
            text-align center;
            font-size 0px;
            img {
              width 23px;
              height 23px;
            }
            .number {
              font-size 16px;
              font-weight 500;
              color white;
            }
            .text {
              margin-top 8px;
              font-size 13px;
              color white;
            }
          }
        }
      }
    }
  }
</style>

