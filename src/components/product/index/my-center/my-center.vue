<template>
  <div class="center">
    <div v-if="moduleData.styleTempl == '1'" class="my-center">
      <div class="banner">
        <div class="user">
          <div class="header-profile" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
            <img :src="headImg">
          </div>
        </div>
        <div class="header-info">
          <p class="user-info"> {{userInfo.realName}} </p>
          <p class="user-info"> {{userInfo.phoneNum}} </p>
        </div>
        <div class="more">
          <img src="static/images/icon-more.png" height="20px">
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '2'" class="my-center">
      <div class="card-div"
           :class="{'card-div-small': !moduleData.hasInterestsBtn && !moduleData.hasPaidMemberInterests}">
        <div class="img-bg"
             :class="{'img-bg-corner': moduleData.hasArc && (!moduleData.hasInterestsBtn && !moduleData.hasPaidMemberInterests)}">
          <img :src="moduleData.myBgImg">
        </div>
        <div class="user-info" :style="getTopMarginStyle()">
          <div class="header-div" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
            <img
              :src="headImg">
          </div>
          <div class="info-div">
            <p class="user-name-w">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
              $store.state.userInfo.userName}}</p>
            <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag == '1'">
              {{employeesName}}</p>
            <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag != '1'">会员</p>
            <p class="tag" v-if="moduleData.hasPaidMember">{{$store.state.mall2.myAssets.paidMember == '1' ? 'CHUM付费会员'
              : '普通会员'}}</p>
            <p class="tag" v-for="(itm, idx) in clusterList" :key="idx">{{itm.label}}</p>
          </div>
          <!--<div class="qr-code" :class="hotareaClass({idCode: moduleData.idCode+'showMemberQrcode'})" @click.stop="hotEvent('showMemberQrcode');showMemberQrcode()" v-if="moduleData.hasMemberCode">-->
          <!--<img src="static/images/mycenter/qrcode.png">-->
          <!--&lt;!&ndash;<canvas ref="myQrcode" v-if="usePorpData"></canvas>&ndash;&gt;-->
          <!--</div>-->
        </div>
        <div class="member-div" v-if="moduleData.hasInterestsBtn" :class="hotareaClass({idCode: moduleData.idCode + 'interestsEvent'})" @click="hotEvent('interestsEvent');interestsEvent()">
          <div class="member-img">
            <img src="static/images/mycenter/member.png">
          </div>
          <div class="member-level">{{$store.state.mall2.myAssets.levelNoStr}}
            {{'(成长值：'+$store.state.mall2.myAssets.levSurplusPoints+')'}}
          </div>
          <div class="quanyi">我的权益<i class="iconfont mall-gengduojiantou"></i></div>
        </div>
        <div class="member-div" v-if="moduleData.hasPaidMemberInterests" :class="hotareaClass({idCode: moduleData.idCode + 'paidMemberInterestsEvent'})" @click="hotEvent('paidMemberInterestsEvent');paidMemberInterestsEvent()">
          <div class="member-level">CHUM付费会员 尊享会员权益</div>
          <div class="quanyi" v-if="$store.state.mall2.myAssets.paidMember == '1'">会员权益<i
            class="iconfont mall-gengduojiantou"></i></div>
          <div class="quanyi" v-else>立即开通<i class="iconfont mall-gengduojiantou"></i></div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '3'" class="my-center">
      <div class="card-div-1" :style="getCardHeight(moduleData)"
           :class="{'card-div-small': !moduleData.hasInterestsBtn}">
        <div class="img-bg" :style="getCardHeight(moduleData)"
             :class="{'img-bg-corner': moduleData.hasArc && !moduleData.hasInterestsBtn}">
          <img :src="moduleData.myBgImg">
        </div>
        <div class="my-content">
          <div class="user-info" :style="getTopMarginStyle()">
            <div class="header-div" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
              <img
                :src="headImg">
            </div>
            <div class="info-div">
              <div class="user-name-w vv-class">
                <span>{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName : $store.state.userInfo.userName}} </span>
                <div class="vv-imgs" v-if="$store.state.mall2.myAssets.vvFlag == '1'">
                  <img class="sun" src="static/images/mycenter/sun.png">
                  <img class="stars" src="static/images/mycenter/stars.png">
                </div>
              </div>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag == '1'">
                {{employeesName}}</p>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag != '1'">会员</p>
              <p class="tag" v-for="(itm, idx) in clusterList" :key="idx">{{itm.label}}</p>
            </div>
          </div>
          <div class="member-div all-radius" v-if="moduleData.hasInterestsBtn" :class="hotareaClass({idCode: moduleData.idCode + 'interestsEvent'})" @click="hotEvent('interestsEvent');interestsEvent()">
            <div class="member-div-bg">
              <img :src="getMyCardBgImg()">
            </div>
            <div class="member-row">
              <div class="member-img">
                <img :src="getLevelImg()">
              </div>
              <div class="member-level">{{$store.state.mall2.myAssets.levelNoStr}}
                {{'(成长值：'+$store.state.mall2.myAssets.levSurplusPoints+')'}}
              </div>
              <div class="quanyi">
                <div>我的权益</div>
                <img src="static/images/mycenter/arrow-right.png">
              </div>
            </div>
            <div class="member-level-div">
              <MemberLevel></MemberLevel>
            </div>
          </div>
          <div class="items-row" v-if="refresh">
            <div class="item" :class="{line_left: idx != 0, ...hotareaClass({idCode: moduleData.idCode + item.countKey || '' + item.rewardType || ''}, true)}" v-for="(item, idx) in orderItems" @click="hotToFuncPage(item);toFuncPage(item)" :key="idx">
              <!--<img :src="item.img"/>-->
              <div class="number">{{getAssetsValue(item)}}</div>
              <div class="text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '4'" class="my-center">
      <div class="card-div-1 card-div-2" :style="getCardHeight(moduleData)"
           :class="{'card-div-small': !moduleData.hasInterestsBtn}">
        <div class="img-bg" :style="getCardHeight(moduleData)"
             :class="{'img-bg-corner': moduleData.hasArc && !moduleData.hasInterestsBtn}">
          <img :src="moduleData.myBgImg">
        </div>
        <div class="my-content" :class="{'no-account':moduleData.hasAccountInformation===false}">
          <div class="user-info" :style="getTopMarginStyle()">
            <div class="header-div" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
              <img
                :src="headImg">
            </div>
            <div class="info-div">
              <p class="user-name-w">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
                $store.state.userInfo.userName}}</p>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag == '1'">
                {{employeesName}}</p>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag != '1'">会员</p>
              <p class="tag" v-for="(itm, idx) in clusterList" :key="idx">{{itm.label}}</p>
            </div>
          </div>
          <div class="items-row" v-if="moduleData.hasAccountInformation!==false && refresh">
            <div class="item" :class="{line_left: idx != 0, ...hotareaClass({idCode: moduleData.idCode + item.countKey || '' + item.rewardType || ''}, true)}" v-for="(item, idx) in orderItems" :key="idx"
                 @click="hotToFuncPage(item);toFuncPage(item)">
              <!--<img :src="item.img"/>-->
              <div class="number">{{getAssetsValue(item)}}</div>
              <div class="text">{{item.name}}</div>
            </div>
          </div>
          <div class="member-div" v-if="moduleData.hasInterestsBtn" :class="hotareaClass({idCode: moduleData.idCode + 'interestsEvent'})" @click="hotEvent('interestsEvent');interestsEvent()">
            <div class="member-div-bg ">
              <!--<img :src="moduleData.cardBgImg">-->
              <img :src="getMyCardBgImg()">
            </div>
            <div class="member-row">
              <div class="member-img">
                <img :src="getLevelImg()">
              </div>
              <div class="member-level">{{$store.state.mall2.myAssets.levelNoStr}}
                {{'(成长值：'+$store.state.mall2.myAssets.levSurplusPoints+')'}}
              </div>
              <div class="quanyi">
                <div>我的权益</div>
                <img src="static/images/mycenter/arrow-right.png">
              </div>
            </div>
            <div class="member-level-div">
              <MemberLevel></MemberLevel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '5'" class="my-center">
      <div class="card-div-3">
        <div class="my-content">
          <div class="user-info" :style="getTopMarginStyle()">
            <div class="header-div" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
              <img
                :src="headImg">
            </div>
            <div class="info-div">
              <p class="user-name-w">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
                $store.state.userInfo.userName}}</p>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag == '1'">
                {{employeesName}}</p>
              <p class="tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag != '1'">普通会员</p>
              <p class="tag" v-for="(itm, idx) in clusterList" :key="idx">{{itm.label}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '6'" class="my-center">
      <div class="card-div-4">
        <div class="my-content">
          <div class="bg-img">
            <img src="static/images/mycenter/bg-6.png">
          </div>
          <div class="cont-div">
            <div class="scan-btn" :class="hotareaClass({idCode: moduleData.idCode+'toScan'})" @click="hotEvent('toScan');$market.showScan()"></div>
            <div class="info-div">
              <div class="header" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
                <img :src="headImg">
              </div>
              <div class="name">会员号</div>
            </div>
            <div class="points-row line_bottom">
              <div class="text" v-if="moduleData.assetsType == '2'">可用积分：{{getAssetsValue({countKey: '3'})}}</div>
              <div class="text" v-else>可用柴油豆：{{getAssetsValue({countKey: '21'})}}</div>
              <div class="gz-btn" :class="hotareaClass({idCode: moduleData.idCode + 'toRules'})" @click="hotEvent('toRules');toRules()">使用规则</div>
            </div>
            <div class="btns-row">
              <div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'qrcode'})" @click="hotToFuncPage({countKey:'qrcode'});toFuncPage({link: '/usercenter/myqrcode'})">
                <img src="static/images/mycenter/qrcode-6.png">
                <span>会员二维码</span>
              </div>
              <div class="btn" :class="hotareaClass({idCode: moduleData.idCode + 'cydmx'})" @click="hotToFuncPage({countKey:'cydmx'});assetsDetail()">
                <img src="static/images/mycenter/mx-6.png">
                <span v-if="moduleData.assetsType == '2'">积分明细</span>
                <span v-else>柴油豆明细</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '7'" class="my-center">
      <div class="card-div-5">
        <div class="img-bg"></div>
        <div class="content-div" :style="{paddingTop: (barHeight + 44) + 'px'}">
          <div class="card-bg">
            <div class="member-info">
              <div class="header-img">
                <img :src="headImg">
              </div>
              <div class="ryhy-info">
                <div class="user-name">
                  <span>{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName : $store.state.userInfo.userName}}</span>
                  <img src="./imgs/hy.png">
                </div>
                <div class="progress">
                  <div class="surplus" :style="{width: surplusWidth}"></div>
                  <div class="end-time">{{invalidTime || '1970-01-01'}}过期</div>
                </div>
              </div>
              <div class="ryhy-btn" @click="$Toast('暂缓开通！')">立即续费</div>
            </div>
            <div class="ryhy-assets">
              <div class="item">
                <div class="text">收藏</div>
                <div class="number">{{0}}</div>
              </div>
              <div class="item">
                <div class="text">积分</div>
                <div class="number">{{0}}</div>
              </div>
              <div class="item" :class="hotareaClass({idCode: moduleData.idCode + 'yhq'})" @click="hotToFuncPage({countKey:'yhq'});toFuncPage({link: {path: $store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'}})">
                <div class="text">优惠券</div>
                <div class="number">{{getAssetsValue({countKey: 'couponNum'})}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '8'" class="my-center">
      <div class="card-div-1 style-8" :class=" {'card-div-small': !moduleData.hasInterestsBtn}">
        <div class="img-bg"
             :class="{'img-bg-corner': moduleData.hasArc && !moduleData.hasInterestsBtn}">
          <img :src="moduleData.myBgImg">
        </div>
        <div class="my-content" :class="{'no-account':moduleData.hasAccountInformation===false}">
          <div class="user-info" :style="getTopMarginStyle()">
            <div class="header-div" :class="hotareaClass({idCode: moduleData.idCode + 'changeHeaderImg'})" @click="hotEvent('changeHeaderImg');changeHeaderImg();">
              <img
                :src="headImg">
            </div>
            <div class="info-div">
              <div class="user-name-w">
                <span class="name">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
                $store.state.userInfo.userName}}</span>
                <span class="name-tag" v-if="moduleData.hasAuthentication">{{employeesName}}</span>
              </div>
              <p class="vip-tag" v-if="moduleData.hasAuthentication && $store.state.mall2.myAssets.empFlag != '1'">会员</p>
              <p class="tag" v-for="(itm, idx) in clusterList" :key="idx">{{itm.label}}</p>
            </div>
          </div>
          <div class="items-row" v-if="moduleData.hasAccountInformation!==false && refresh">
            <div class="item" :class="{line_left: idx != 0, ...hotareaClass({idCode: moduleData.idCode + item.countKey || '' + item.rewardType || ''}, true)}" v-for="(item, idx) in orderItems" :key="idx"
                 @click="hotToFuncPage(item);toFuncPage(item)">
              <!--<img :src="item.img"/>-->
              <div class="number">{{getAssetsValue(item)}}</div>
              <div class="text">{{item.name}}</div>
            </div>
          </div>
          <div class="member-div" v-if="moduleData.hasInterestsBtn" :class="hotareaClass({idCode: moduleData.idCode + 'interestsEvent'})" @click="hotEvent('interestsEvent');interestsEvent()">
            <div class="member-div-bg ">
              <!--<img :src="moduleData.cardBgImg">-->
              <img :src="getMyCardBgImg()">
            </div>
            <div class="member-row">
              <div class="member-img">
                <img :src="getLevelImg()">
              </div>
              <div class="member-level">{{$store.state.mall2.myAssets.levelNoStr}}
                {{'(成长值：'+$store.state.mall2.myAssets.levSurplusPoints+')'}}
              </div>
              <div class="quanyi">
                <div>我的权益</div>
                <img src="static/images/mycenter/arrow-right.png">
              </div>
            </div>
            <div class="member-level-div">
              <MemberLevel></MemberLevel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MemberLevel from '@/components/commonui/member-level/member-level'
  import Photo from '@/components/commonui/choosephoto'
  import Bus from '../bus';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'auxiliary',
    components: {
      MemberLevel
    },
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    mixins: [hee],
    data() {
      return {
        orderItems: [],
        refresh: true,
        userInfo: {},
        accountBaseInfo: {}
      };
    },
    watch: {
      'moduleData.styleTempl'(){
        this.myAssetsInit();
      }
    },
    computed: {
      employeesName(){
        let state = this.$store.state;
        return state.globalConfig.employeesName
          ? state.globalConfig.employeesName  // 员工名
          : state.mall2.myAssets.empDepName
          ? '员工('+state.mall2.myAssets.empDepName+')'
          : '员工'
      },
      invalidTime() {
        let cards = this.$store.state.mall2.myAssets.equityCardList
        if (cards && cards.length) {
          let itime = cards[0].invalidTime
          let arr = itime.split(' ')
          if (arr.length == 2) {
            return arr[0]
          }
        }
        return ''
      },
      surplusWidth() {
        let levelEndDate = this.invalidTime
        if (!levelEndDate) {
          return '0'
        }
        let t = this.$util.getDateFromString(levelEndDate) - parseInt((new Date()).getTime() / 1000)
        if (t > 0) {
          let surplus = parseInt(t / (24 * 60 * 60) / 365 * 100)
          return surplus + '%'
        } else {
          return '0'
        }
      },
      headImg() {
        if (this.$store.state.userInfo.headImg && this.$store.state.userInfo.headImg != 'undefined') {
          return this.$store.state.userInfo.headImg
        } else {
          return this.moduleData.headImg
        }
      },
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
      clusterList: function () {
        let arr = []
        if (this.$store.state.mall2.myAssets.clusterList && this.$store.state.mall2.myAssets.clusterList.length > 0) {
          let total = 0
          for (let i = 0; i < this.$store.state.mall2.myAssets.clusterList.length; i++) {
            let itm = this.$store.state.mall2.myAssets.clusterList[i]
            if (itm.isShow == '1') {
              total++
              arr.push(itm)
              if (total == 3) {
                break;
              }
            }
          }
        }
        return arr
      }
    },
    created() {
      if (!this.moduleData.headImg || this.moduleData.headImg == undefined || this.moduleData.headImg == '') {
        this.moduleData.headImg = 'static/images/defaultImg.png'
      }
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
      this.myAssetsInit();
      this.modeleReshow()

      Bus.$on('myCenterAssetsRefresh', res => {
        this.myAssetsInit()
      })
      // if (this.moduleData.styleTempl == '6') {
      //   this.getAccountBaseInfo(21)
      // }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      toRules: function () {
        if (this.moduleData.assetsType == '2') {
          this.$router.push({
            path: '/usercenter/agreement',
            query:{
              value: 11
            }
          })
        } else {
          this.$router.push({
            path: '/usercenter/agreement',
            query:{
              value: 65
            }
          })
        }
      },
      assetsDetail: function () {
        if (this.moduleData.assetsType == '2') {
          this.toFuncPage({link: '/mall2/integralinfo'})
        } else {
          this.toFuncPage({link: '/diesel-rebate'})
        }
      },
      hotToFuncPage: function (item) {
        this.hotEvent(item.countKey || '' + item.rewardType || '')
      },
      toFuncPage: function (item) {
        this.$market.customPush(item.link)
      },
      paidMemberInterestsEvent: function () {
        if (this.$store.state.mall2.myAssets.paidMember == '1') {
          this.$market.customPush({
            path: '/my_interests'
          })
        } else {
          this.$market.customPush({
            path: '/member_card_chum?hasNavTop=1'
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
      getAccountBaseInfo(acctType) {
        // 获取红包金额
        let paramsData = {
          token: this.$store.state.login.token,
          acctType
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data || {}
          if (data.status == 0) {
            this.accountBaseInfo = data.data || {}
          } else {
            this.$Toast(data.info ? data.info : '获取失败')
          }
        })
      },
      myAssetsInit: function () {
        if(this.moduleData.styleTempl == '8'){
          this.orderItems = [{
            name: '积分',
            countKey: 'surplusPoints',
            link: {
              path: '/mall2/integralinfo'
            },
          }, {
            name: '电子券',
            countKey: 'couponNum',
            link: {
              path: this.$store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'
            },
          }]
        }else{
          this.orderItems = [{
            name: '积分',
            countKey: 'surplusPoints',
            link: {
              path: '/mall2/integralinfo'
            },
          }, {
            name: '优惠券',
            countKey: 'couponNum',
            link: {
              path: this.$store.state.globalConfig.couponGroupMode == 1 ? '/coupon_list2' : '/coupon_list'
            },
          }, {
            name: '加油卡',
            countKey: 'cardNum',
            link: {
              path: '/addcard'
            }
          }]
        }
        if (this.moduleData.isShowYJ) {
          this.orderItems.splice(2, 0, {
            name: '油金',
            rewardType: '100',
            link: {
              path: '/usercenter/rebatebonus'
            }
          })
        }

        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
      },
      getMyCardBgImg: function () {
        let idx = this.$market.getMemberLevelIndex(this.$store.state.mall2.myAssets.levelNo)
        idx = idx - 1
        let imgUrl = this.moduleData['cardImg_' + idx]
        console.log(this.moduleData)
        if (imgUrl && imgUrl != null && imgUrl != '') {
          return imgUrl
        }
        if (this.moduleData.styleTempl == '4' || this.moduleData.styleTempl == '8') {
          return 'static/images/mycenter/my-card-bg-1.png'
        } else {
          return 'static/images/mycenter/my-card-bg.png'
        }
      },
      toUserInfo: function () {
        // http://localhost:8080/#/usercenter/userinfo
        this.$market.customPush({
          path: '/usercenter/userinfo'
        })
      },
      linkFunc: function (picUrl, img1) {
        this.modifyHeadImg(picUrl);
      },
      changeHeaderImg: function () {
        if (this.usePorpData == true) {
          Photo.open({
            linkFunc: this.linkFunc,
            token: this.$store.state.login.token,
          });
        }
      },
      modifyHeadImg: function (picUrl) {
        this.$Loading.open();
        let url = '/app/json/user/modifyHeadImg';
        let paramsData = {
          token: this.$store.state.login.token,
          headImg: picUrl
        }

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.userInfo.headImg = picUrl;
              this.$bridgefunc.vuexStorage();
              this.$Toast('修改头像成功');
            } else {
              this.$Toast(data.info ? data.info : '修改失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },
      getCardHeight: function (moduleData) {
        // if (this.barHeight == 20) {
        //   return ''
        // }
        if (moduleData.styleTempl == '4' || this.moduleData.styleTempl == '8') {
          let h = 286 + this.barHeight;
          h *= this.$store.state.clientWidth / 375.0
          return 'height: ' + h + 'px;';
        } else if (moduleData.styleTempl == '3') {
          let h = 286 + this.barHeight;
          h *= this.$store.state.clientWidth / 375.0
          return 'height: ' + h + 'px;';
        }
        return ''
      },
      modeleReshow: function () {
        if (this.moduleData.styleTempl != '1') {
          this.getUserInfo();
        }
        // if (this.moduleData.styleTempl == '3' || this.moduleData.styleTempl == '4') {
          this.getMyAssets();
        // }
      },
      showMemberQrcode: function () {
        this.$market.customPush({
          path: '/usercenter/myqrcode'
        })
      },
      interestsEvent: function () {
        let bgs = [];
        let lArr = this.$store.state.memberLevel
        for (let i = 0; i < lArr.length; i++) {
          let imgUrl = this.moduleData['cardImg_' + i]
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
      getLevelImg: function () {
        let level = this.$market.getMemberLevelIndex(this.$store.state.userInfo.levelNo)
        return 'static/images/mycenter/m_' + level + '.png'
      },
      getTopMarginStyle: function () {
        let styleStr = ''
        if (this.barHeight) {
          styleStr += "marginTop: " + this.barHeight + "px;"
        }
        return styleStr
      },
      getMyAssets: function () {
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
              //this.$store.state.userInfo.levelNo = data.data.levelNo
              this.myAssetsInit()
            }
          },
          error => {
          }
        );
      },
      getUserInfo: function () {
        if (this.$store.state.login.token == '') {
          return;
        }
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserInfo';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.userInfo = data.data;
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
  .my-center {
    .banner {
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .user {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;

        .header-profile {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          text-align: center;
          line-height: 70px;
          border: 1px solid #e6e6e6;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .header-info {
        flex: 1;

        .user-info {
          position relative;
          z-index 9;
          line-height: 25px;
          font-size: 16px;
          color: #7e7e7e;
        }
      }

      .more {
        padding: 0 10px;
      }
    }

    .card-div {
      position relative;
      height 160px;

      .img-bg {
        height 160px;

        img {
          width 100%;
          height 100%;
        }

        &.img-bg-corner {
          width: 200%;
          height: 130px;
          position: absolute;
          left: -50%;
          top: 0;
          z-index 1
          content: '';
          overflow hidden;
          border-radius: 0 0 50% 50%;

          img {
            position absolute;
            left 25%;
            top 0px;
            width 50%
            height 130px;
          }
        }
      }

      .user-info {
        position absolute;
        left 0px;
        right 0px;
        z-index 9;
        top 0px;
        margin-left 12px;
        margin-right 12px;
        padding-top 20px;
        display flex;
        align-items center;

        .header-div {
          position relative;
          overflow hidden;
          width 60px;
          height 60px;
          border-radius 30px;

          img {
            /*position absolute;
            z-index 200;*/
            display block;
            width 100%;
            height 100%;
          }
        }

        .info-div {
          flex 1;
          padding 0px 10px;

          .user-name-w {
            font-size 16px;
            font-weight 500;
            color #fff;
          }

          .tag {
            display inline-block;
            margin-top 10px;
            text-align center;
            min-width 60px;
            font-size 12px;
            font-weight 600;
            padding 2px 15px;
            border-radius 20px;
            background-color #fff;
            color #F63A3C;
          }
        }

        .qr-code {
          margin-top 10px;
          margin-bottom -20px;
          // margin-right 10px;

          img {
            display block;
            width 40px;
          }
        }
      }

      .member-div {
        position relative;
        z-index 1;
        margin-top -40px;
        margin-left 10px;
        margin-right 10px;
        background-color #392726;
        border-radius 10px 10px 0 0;
        //height 40px;
        display flex;
        align-items center;
        padding 10px;
        height 40px;

        .member-img {
          height 20px;

          img {
            display block;
            height 20px;
          }
        }

        .member-level {
          flex 1;
          color #FEE8AE;
          font-size 14px;
        }

        .quanyi {
          color #232423;
          background-color #FEE8AE;
          font-size 12px;
          padding 2px 6px;
          border-radius 20px;
          display flex;
          align-items center;

          i {
            margin-left 3px;
            font-size 12px;
            color white;
          }
        }
      }

      &.card-div-small {
        height 120px;

        .img-bg {
          height 120px;
        }
      }
    }

    .card-div-1 {
      position relative;
      height 286px;

      .img-bg {
        height 286px;

        img {
          width 100%;
          height 100%;
        }
      }

      .my-content {
        width 100%;
        height 100%;
        position absolute;
        left 0px;
        right 0px;
        top 0px;
        bottom 0px;
        z-index 1;

        .user-info {
          position relative;
          z-index 9;
          top 0px;
          margin-left 12px;
          margin-right 12px;
          padding-top 20px;
          display flex;
          align-items center;

          .header-div {
            position relative;
            overflow hidden;
            width 60px;
            height 60px;
            border-radius 30px;

            img {
              /*position absolute;
              z-index 200;*/
              display block;
              width 100%;
              height 100%;
            }
          }

          .info-div {
            flex 1;
            padding 0px 10px;

            .user-name-w {
              font-size 16px;
              font-weight 500;
              color #fff;
            }

            .vv-class {
              display flex;
              align-items center;

              span {
                font-weight 500;
              }

              .vv-imgs {
                padding-left 10px;
                display flex;
                align-items center;

                .sun {
                  width 22px;
                  height 22px;
                }

                .stars {
                  margin-left 1px;
                  width 12px;
                  height 12px;
                }
              }
            }

            .tag {
              display inline-block;
              margin-top 10px;
              text-align center;
              min-width 60px;
              font-size 12px;
              padding 2px 15px;
              border-radius 20px;
              font-weight 600;
              background-color #9B212F;
              color white;
            }
          }

          .qr-code {
            margin-top 10px;
            margin-bottom -20px;
            // margin-right 10px;

            img {
              display block;
              width 40px;
            }
          }
        }

        .member-div {
          position relative;
          z-index 9;
          margin-top 15px;
          margin-left 10px;
          margin-right 10px;
          border-radius 10px 10px 0 0;
          overflow hidden;
          height 130px;
          padding 12px 0;

          &.all-radius {
            border-radius 10px
          }

          .member-div-bg {
            position absolute;
            left 0px;
            right 0px;
            top 0px;
            bottom 0px;
            z-index -1;

            img {
              width 100%;
              height 100%;
              display block;
            }
          }

          .member-row {
            display flex;
            align-items center;
            padding-left 10px;

            .member-img {
              margin-right 4px;
              height 16px;

              img {
                display block;
                height 16px;
              }
            }

            .member-level {
              flex 1;
              color black;
              font-size 14px;
            }

            .quanyi {
              color white;
              background-color #815819;
              font-size 12px;
              padding 3px 2px 3px 10px;
              border-radius 20px 0 0 20px;
              display flex;
              align-items center;

              img {
                width 10px;
              }

              i {
                margin-left 3px;
                font-size 12px;
                color white;
              }
            }
          }

          .member-level-div {
            margin 20px 10px 0px;
          }
        }

        .items-row {
          padding 10px 0px;
          display flex;
          align-items center;

          .item {
            flex 1;
            text-align center;
            font-size 0px;
            position relative;

            img {
              width 23px;
              height 23px;
            }

            .number {
              font-size 18px;
              font-weight 500;
              color white;
            }

            .text {
              margin-top 8px;
              font-size 14px;
              color white;
            }

            /*.line {
              position absolute;
              left 0px;
              width 0.5px;
              top 11px;
              bottom 11px;
            }*/
          }

          /*.item:nth-child(n+2) {
            .line {
              background-color white;
            }
          }*/
        }
        &.no-account{
          .user-info{
            margin-bottom:15px;
          }
        }
      }

      &.card-div-2 {
        height 286px;
        overflow hidden;

        .items-row {
          margin-top 12px;
        }

        .member-div {
          margin-top 5px;
        }
      }
      &.style-8{
        height:170px;
        .img-bg{
          height:170px;
        }
        .my-content{
          .user-info{
            .info-div{
              .user-name-w{
                display:flex;
                align-items:center;
                .name-tag{
                  text-align: center;
                  font-size: 12px;
                  padding: 3px 8px 2px;
                  border-radius: 20px;
                  font-weight: 600;
                  background-color: #fff;
                  color: #E34A44;
                  margin-left:10px
                }
              }
              .vip-tag{
                display:inline-block;
                text-align: center;
                font-size: 12px;
                padding: 3px 8px 2px;
                border-radius: 20px;
                font-weight: 600;
                background-color: #5B121A;
                color: #fff;
                margin-top:10px
              }
            }
          }
        }
      }
    }

    .card-div-3 {
      overflow hidden;

      .user-info {
        position relative;
        z-index 9;
        top 0px;
        margin-left 12px;
        margin-right 12px;
        padding-top 20px;
        display flex;
        align-items center;

        .header-div {
          position relative;
          overflow hidden;
          width 60px;
          height 60px;
          border-radius 30px;

          img {
            /*position absolute;
            z-index 200;*/
            display block;
            width 100%;
            height 100%;
          }
        }

        .info-div {
          flex 1;
          padding 0px 10px;

          .user-name-w {
            font-size 16px;
            font-weight 500;
          }

          .tag {
            display inline-block;
            margin-top 10px;
            text-align center;
            // min-width 60px;
            font-size 12px;
            padding 2px 10px;
            border-radius 20px;
            font-weight 600;
            background-color #F9E9E9;
            color #815C52;
          }
        }

        .qr-code {
          margin-top 10px;
          margin-bottom -20px;
          // margin-right 10px;

          img {
            display block;
            width 40px;
          }
        }
      }
    }

    .card-div-4 {
      .my-content {
        position relative;
        .bg-img {
          img {
            display block;
            width 100%;
          }
        }
        .cont-div {
          position absolute;
          left 0;
          right 0;
          top 0;
          bottom 0;
          z-index 1;
          padding 15px 25px;
          .scan-btn {
            position absolute;
            //background-color rgba(0, 0, 0, 0.3);
            right 6px;
            top 40px;
            height 40px;
            width 100px;
          }
          .info-div {
            display flex;
            align-items center;
            .header {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              overflow: hidden;
              text-align: center;
              line-height: 70px;
              border: 1px solid #e6e6e6;

              img {
                width: 100%;
                height: 100%;
              }
            }
            .name {
              font-weight 500;
              font-size 18px;
              padding-left 10px;
            }
          }
          .points-row {
            display flex;
            align-items center;
            justify-content space-between;
            .text {
              font-size 14px;
              font-weight 500;
            }
            .gz-btn {
              color #367CF6;
              padding 15px 0;
            }
          }
          .btns-row {
            display flex;
            align-items center;
            justify-content space-around;
            .btn {
              display flex;
              align-items center;
              justify-content center;
              padding 12px;
              font-size 12px;
              img {
                height 16px;
                margin-right 8px;
              }
            }
          }
        }
      }
    }
    .card-div-5 {
      position relative;
      //height 300px;
      .img-bg {
        width: 200%;
        height: 180px;
        position: absolute;
        left: -50%;
        top: 0;
        z-index 1
        content: '';
        overflow hidden;
        border-radius: 0 0 50% 50%;
        background-color #29263C;
      }
      .content-div {
        position relative;
        z-index 2;
        .card-bg {
          margin 10px auto;
          background url("./imgs/bg7.png") repeat center center / 100% 100%;
          width 345px;
          padding 20px 15px 15px;
          .member-info {
            display flex;
            align-items flex-start;
            .header-img {
              img {
                display block;
                width 26px;
                height 26px;
              }
            }
            .ryhy-info {
              padding 5px 10px 0;
              flex 1;
              .user-name {
                display flex;
                align-items center;
                color #5C4935;
                span {
                  font-size 18px;
                }
                img {
                  margin-left 8px;
                  display block;
                  height 18px;
                }
              }

              .progress {
                margin-top 10px;
                padding-top 10px;
                position relative;
                float left;
                color #5C4935;
                font-size 12px;
                &:after {
                  content ' '
                  position absolute;
                  left 0;
                  right 0;
                  top 0;
                  background-color #D3B18C;
                  height 3px;
                  z-index 1
                }
                .surplus {
                  content ' '
                  position absolute;
                  left 0;
                  top 0;
                  z-index 2;
                  background-color #5C4935;
                  height 3px;
                }
              }
            }
            .ryhy-btn {
              background-color #5C4935;
              color white;
              border-radius 20px;
              padding 10px 14px;
              margin-top 5px;
              font-size 14px;
            }
          }
          .ryhy-assets {
            margin-top 25px;
            display flex;
            align-items center;
            text-align center;
            color #5C4935;
            .item {
              flex 1;
              .text {
                font-size 16px;
                font-weight 500;
              }
              .number {
                margin-top 6px;
                font-size 18px;
                font-weight 500;
              }
            }
          }
        }
      }
    }
  }
</style>

