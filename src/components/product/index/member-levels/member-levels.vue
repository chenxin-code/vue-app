/**Created by liaoyingchao on 2020-01-08.*/

<template>
  <div class="member-levels" :class="{'div-zm':deployType == 5}" :style="getBgStyle()">
    <!-- deployType:5 中免 -->
    <template v-if="deployType == 5">
      <div class="member-level-div" :style="getFloatUp()" @click="toMemberLevel">
        <!--<div class="tip">{{$t("loginRegisterLang.nextLevel")}} {{getNextDistance()}} {{$t("loginRegisterLang.metaDistance")}}-->
        <!--</div>-->
        <div class="tip" v-if="$store.state.mall2.myAssets.levelEndDate && $store.state.mall2.myAssets.levelNo != '0001'">
          <span>{{$t("loginRegisterLang.levalEffectDate")}}</span>
          <span>{{$store.state.mall2.myAssets.levelEndDate}}</span>
        </div>
        <MemberLevel :type="'zm'"></MemberLevel>
        <div class="tip1" v-if="$store.state.language == 'en_US' && nextLevelName">{{$t("loginRegisterLang.nextLevelTip1")}} {{nextLevelName}} {{$t("loginRegisterLang.nextLevelTip2")}} {{nextLevelValue}} RMB</div>
        <div class="tip1" v-else-if="nextLevelName">{{$t("loginRegisterLang.nextLevelTip1")}} {{nextLevelValue}} {{$t("loginRegisterLang.nextLevelTip2")}} {{nextLevelName}}</div>
        <!--<div class="tip1">{{$t("loginRegisterLang.nextLevel")}} {{getNextDistance()}} {{$t("loginRegisterLang.metaDistance")}}-->
        <!--</div>-->
      </div>
    </template>
    <template v-else>
      <div class="member-level-div" :class="hotareaClass({idCode: moduleData.idCode})" :style="getFloatUp()" @click="hotEvent();toMemberLevel()">
        <MemberLevel :type="'zm'"></MemberLevel>
        <div class="tip">距离下一级别还有<span class="point">{{getNextDistance()}}</span>元距离</div>
      </div>
    </template>
  </div>
</template>

<script>
  import MemberLevel from '@/components/commonui/member-level/member-level'
  import hee from "../_js/hotarea-extend-event";
  import {mapState} from 'vuex';
  
  export default {
    name: "member-levels",
    components: {
      MemberLevel
    },
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    computed: {
      ...mapState(['deployType']),
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
    watch: {
      '$store.state.mall2.myAssets': function (val, oldVal) {
        this.getNextDistance()
      }
    },
    mixins: [hee],
    data() {
      return {
        nextLevelValue: 0,
        nextLevelName: ''
      }
    },
    methods: {
      toMemberLevel: function () {
        if(this.deployType == 5){ // 中免
          this.$market.customPush({
            path: '/memberlevel'
          })
        }
      },
      getNextDistance: function () {
        let levSurplusPoints = this.$store.state.mall2.myAssets.levSurplusPoints
        let lArr = this.$store.state.memberLevel || []
        let level = this.$store.state.mall2.myAssets.levelNo
        this.nextLevelValue = 0 // 中免
        for (let i = 0; i < lArr.length; i++) {
          if (level == lArr[i].rankCode) {
            if (i == lArr.length - 1) {
              return ''
            }
            let pointAmount = lArr[i+1].pointAmount
            if(this.deployType == 5){ // 中免
              this.nextLevelValue = Math.floor(pointAmount - levSurplusPoints)
              this.nextLevelName = lArr[i+1].name
              return ;
            }else{
              return pointAmount - levSurplusPoints;
            }
          }
        }
        return '0'
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
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        return styleStr
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
              this.getNextDistance()
              //this.$store.state.userInfo.levelNo = data.data.levelNo
            }
          },
          error => {
          }
        );
      },
      getUserRank: function () {
        let url = "/app/json/user_rights/getUserRank";
        this.$http.post(url, {}).then(
          res => {
            let data = res.data;
            if (data.status == 0 && data.data != '' && data.data.length > 0) {
              this.$store.state.memberLevel = data.data;
            }
          },
          error => {}
        );
      },
    },
    created() {
      if(this.deployType == 5){ // 中免
        this.getUserRank()
        if (this.$store.state.login.token != '') {
          this.getMyAssets()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .member-levels {
    width 100%
    height 100%
    overflow hidden
    .tip {
      margin-top 5px;
      font-size 14px;
      color #666;
      text-align center;
      .point {
        font-size 16px;
        color black;
      }
    }
    &.div-zm{
      .member-level-div {
        overflow hidden;
      }
      .tip {
        padding-top 1px;
        margin-bottom 7px;
        font-size 12px;
        color #666;
        text-align center;
        .point {
          font-size 15px;
          color black;
          font-weight 600;
        }
      }
      .tip1 {
        margin-top 11px;
        padding-top 1px;
        font-size 12px;
        color #666;
        text-align center;
        .point {
          font-size 15px;
          color black;
          font-weight 600;
        }
      }
    }
  }
</style>
