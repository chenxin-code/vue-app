/**Created by liaoyingchao on 2019-06-19.*/

<template>
  <div class="member-card" :style="getBgStyle()" v-if="$store.state.login.token != ''">
    <div class="card-div" :style="getFloatUp()">
      <div class="img-bg">
        <img class="bgimg" :src="moduleData.cardImg" :style="getInfoWidth()">
        <div class="info-div" :style="getInfoWidth()">
          <div class="row">
            <div class="user-name">{{$store.state.userInfo.nickName || getPhoneToName()}}</div>
            <div class="fuel-card-has" v-if="$store.state.mall2.myAssets.cardNum > 0">{{getHideNum()}}</div>
            <div class="fuel-card" :class="hotareaClass({idCode: moduleData.idCode + 'bindCard'})" @click="hotEvent('bindCard');bindCard()" v-else>未绑卡</div>
          </div>
          <div class="row">
            <div class="info" :class="hotareaClass({idCode: moduleData.idCode + 'interestsEvent'})" @click="hotEvent('interestsEvent');interestsEvent()">成长值 | {{$store.state.mall2.myAssets.levSurplusPoints}}</div>
            <!--<div class="info" :class="hotareaClass({idCode: moduleData.idCode + 'youbi'})" @click="hotEvent('youbi');youbi()">{{$store.state.mall2.myAssets.rewardsSurplusName || '油币'}} | {{$store.state.mall2.myAssets.rewardsSurplus || '0'}}</div>-->
            <!--下面是临时处理-->
            <div class="info" :class="hotareaClass({idCode: moduleData.idCode + 'youbi'})" @click="hotEvent('youbi');youbi()">{{ getRewardName({rewardType: '100'}) || '油币'}} | {{ getRewardValue({rewardType: '100'}) || '0'}}</div>
            <div class="info" :class="hotareaClass({idCode: moduleData.idCode + 'ponitdetail'})" @click="hotEvent('ponitdetail');ponitdetail()">积分 | {{$store.state.mall2.myAssets.surplusPoints}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "member-card",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      }
    },
    mixins: [hee],
    data() {
      return {
        linshiyoubigeshu: 0
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getRewardName: function (item) {
        // if (this.$store.state.mall2.myAssets.rewardList && this.$store.state.mall2.myAssets.rewardList.length > 0) {
        //   let item = this.$store.state.mall2.myAssets.rewardList[0]
        //   return item.rewardsSurplusName
        // }
        if (item.rewardType) {
          let rewardList = this.$store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplusName
            }
          }
        }
        return ''
      },
      getRewardValue: function (item) {
        // if (this.$store.state.mall2.myAssets.rewardList && this.$store.state.mall2.myAssets.rewardList.length > 0) {
        //   let item = this.$store.state.mall2.myAssets.rewardList[0]
        //   return item.rewardsSurplus
        // }
        // return ''
        // 
        if (item.rewardType) {
          let rewardList = this.$store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplus
            }
          }
        }

        if (item.countKey) {
          if (this.$store.state.mall2.myAssets[item.countKey]) {
            return this.$store.state.mall2.myAssets[item.countKey]
          }
          if (this.$store.state.mall2.myAssets.accountInfo) {
            return this.$store.state.mall2.myAssets.accountInfo[item.countKey] || '0'
          }
        }

        return '0'
      },
      // 临时 临时处理下，凌晨2点多了，接口还有问题，用这个接口直接获取油币数目
      getyoubigeshu: function () {
        let url = this.$market.apiBaseURL() + '/app/json/acct/getAccountBaseInfo';
        let paramsData = {
          token: this.$store.state.login.token,
          "acctType":8,
          "groupValue":"1"
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.linshiyoubigeshu = data.data.balanceUnit
              // this.$store.state.mall2.myAssets = data.data

              //this.$store.state.userInfo.levelNo = data.data.levelNo
            }
          },
          error => {
          }
        );
      },
      getPhoneToName: function () {
        let phone = this.$store.state.userInfo.phone
        if (this.$store.state.webtype != -1 && this.$util.checkMobile(phone)) {
          return phone.substr(0, 3) + '****' + phone.substr(7, 4)
        }
        return '未登录'
      },
      getHideNum:function(){
        let cards = this.$store.state.mall2.myAssets.cardNos;
        let result = ''
        if (cards && cards.length > 0) {
          result = cards[0]
          if(result.length > 4){
            result = result.substring(result.length - 4,result.length);
            result = '****'+result;
          }
        }
        return result;

      },
      bindCard:function(){
        if(this.$store.state.mall2.myAssets.cardNum <= 0){
          this.$market.customPush({
            path: '/refuelingCard?inway=replace'
          })
        }
      },
      interestsEvent: function () {
        let bgs = [];
        let lArr = this.$store.state.memberLevel
        for (let i = 0; i < lArr.length; i++) {
          let imgUrl = this.moduleData['cardImg_'+i]
          if (imgUrl && imgUrl != null && imgUrl != '') {
            bgs.push(imgUrl)
          } else {
            bgs.push('static/images/mycenter/my-card-bg.png')
          }
        }
        this.$market.customPush({
          path: '/mall2/membershipinterests',
          query: {
            bgs: JSON.stringify(bgs)
          }
        })
      },
      ponitdetail:function(){
        this.$market.customPush({
          path: '/mall2/integralinfo'
        })
      },
      youbi:function(){
        this.$market.customPush({
          path: '/usercenter/rebatebonus'
        })
      },
      getInfoWidth: function () {
        let styleStr = '';
        let width = this.moduleData.width
        if (width > 0) {
          styleStr += "left: " + (30 - width) + '%;' + 'width: ' + (40 + width * 2) + '%;'
        }

        return styleStr;
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
      getFloatUp: function () {
        let styleStr = '';
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'margin-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'margin-bottom: ' + downMargin + '%;'
        }
        return styleStr
      },
      modeleReshow: function () {
        this.getMyAssets();
      },
      getMyAssets: function () {
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let params = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, params).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data

              //this.$store.state.userInfo.levelNo = data.data.levelNo
            }
          },
          error => {
          }
        );
      },
    },
    created() {
      if (this.$store.state.login.token != '') {
        this.getMyAssets()
        // this.getyoubigeshu()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .member-card {
    position relative;
    z-index 10;

    .card-div {
      position relative;
      height 80px;

      .img-bg {
        height 80px;
        width: 160%;
        position: absolute;
        left: -30%;
        top: 0;
        z-index 1
        content: '';
        overflow hidden;
        border-radius: 0 0 50% 50%;
        //box-shadow:inset 0px -8px 8px -8px #999;
        //box-shadow:0px 12px 8px -12px red;

        &.img-bg:after {
          height 80px;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index 2
          content: '';
          overflow hidden;
          border-radius: 0 0 50% 50%;
          box-shadow: inset 0px -8px 8px -8px #666;
        }

        .bgimg {
          position absolute;
          left 30%;
          top 0px;
          width 40%
          height 80px;
          //z-index -1
          //box-shadow:inset 0px -15px 15px -15px blue;
        }

        .info-div {
          position absolute;
          left 30%;
          top 0px;
          width 40%
          height 80px;
          z-index 3;
          padding 15px 20px;

          .row {
            display flex;
            align-items center;
            justify-content space-between;

            .user-name {
              font-size 12px;
              font-weight 600;
              //flex 1;
            }

            .fuel-card {
              padding 6px 25px;
              border-radius 15px;
              background-color #E2CD98;
              color white;
              font-size 12px;
              font-weight 600;
              box-shadow: 0px 1px 3px 1px #CDB88A;
            }
            .fuel-card-has {
              padding 6px 25px;
              color #734D21;
              font-size 12px;
            }

            .info {
              padding 12px 0;
              color #734D21;
              font-size 12px;
            }
          }
        }
      }
    }
  }
</style>
