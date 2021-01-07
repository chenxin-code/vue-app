<template>
  <div class="flashpayment">
    <!-- header -->
    <nav-top :noTitle="true" :noBack="!hasBack" @backEvent="backEvent">
      <div class="cart-top">
        <div class="cart-title">
          <span class="title theme_font_black">{{$store.state.globalConfig.oilPayTitle|| '加油闪付'}}</span>
        </div>
        <p class="cart-edit" @click="toPayBillList">支付凭证</p>
      </div>
    </nav-top>
    <nav-content class="oil-wrapper">
      <div
        v-if="$store.state.webtype == 2"
        class="other-payment-voucher"
        @click="toPayBillList">支付凭证</div>
      <SubPage :divKeywords="'FlashPaymentDiv'"></SubPage>
      <div class="flash-content">
        <template v-if="orderList.length">
          <router-link to="/oil-pay/order-list">
            <div class="f-safe">
              您有未支付订单，点击查看
            </div>
          </router-link>
        </template>
        <div class="f-safe" v-else>
          请在安全区域内使用手机
        </div>
        <div class="f-come" @click="showPay">
          <div class="f-come-left">
            <div class="fl-wop">
              <span class="icon"></span>
              <p class="name single-line">{{station.stationName}}</p>
              <template v-if="ouCode">
                <p class="distance" v-if="station.distance">距离您<span
                  class="num">{{parseFloat(station.distance / 1000).toFixed(1)}}</span>公里</p>
              </template>
            </div>
          </div>
          <div class="f-come-right" v-if="$route.query.entryType != 2">
            更改油站
          </div>
        </div>
        <div class="manual-input" v-if="$store.state.globalConfig.refuelPayInputVisible == 1">
          <div class="input-wrapper">
            <span class="input-label">加油金额(元)</span>
            <div class="input-content">
              <van-field class="field" type="number" @input="onInput" placeholder="请输入加油金额" clickable pattern="[0-9]*"
                         v-model="oilValue"/>
            </div>
          </div>
          <div class="account-list">
            <span class="account-item" :class="{active: isChoose && item == oilValueResult}"
                  @click="accountHandle(item)" v-for="item in accounts">{{item}}</span>
          </div>
        </div>
        <div class="f-noOil" v-if="!ouCode">
          <img src="./images/img_NoGasStation.png" class='fnoimg' alt="">
          <p v-if="isOpenLocation === 1">附近未查询到可使用{{$store.state.globalConfig.oilPayTitle|| '加油支付'}}油站</p>
          <template v-if="isOpenLocation === 0">
            <p>【请您开启GPS定位附近中国石化加油站】</p>
            <div class="refresh" @click="settingLocation">
              <!--<i class="iconfont mall-shuaxin"></i>-->
              <span class="btn theme_bg_red">去设置</span>
            </div>
          </template>
        </div>
        <div class="f-usecont" v-else="">
          <div class="f-conttitle">
            <p>请选择油枪号<span>(建议与工作人员核对油枪)</span></p>
          </div>
          <div class="f-comnember">
            <ul v-if="oilGunData.length">
              <li v-for="(item,index) in oilGunData" :key="index">
                <div class="oil-gun-info" :class="{changecolor: item.number == gunNo} "
                     @click="showClss(item.number, item.oilName)">
                  <div class="num">{{item.number}}号</div>
                  <div class="name">{{oilNameFormater(item.oilName) }}</div>
                </div>
              </li>
            </ul>
            <p v-show="!hasGun" class="no-gun-data">该油站暂无油枪~</p>
          </div>
        </div>
        <!--油站列表-->
        <transition name="filtrate">
          <div class="filtrate-modal-wrapper" ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
            <div class="filtrate-container">
              <div class="filtrate-tit">
                <i @click="sideFiltrateModalShow = false" class="iconfont mall-fanhui"></i>
                <span class="tit-con">
                  油站列表 <span class="tip">【以下是您周边{{searchDistance/1000}}公里内的油站】</span>
                </span>
              </div>
              <div class="filtrate-content">
                <scroll ref="scroll" class="coupon-list" :hasMore="!finished" :pullUpLoad="true"
                        @pullingUp="getStationList" :data="stationList">
                  <div class="station-cell" @click="chooseStation(item)"
                       :class="{checked: item.stationCode === stationModel.stationCode}"
                       v-for="(item, index) in stationList" :key="index">{{item.stationName}}
                  </div>
                </scroll>
                <!--<van-list :offset="100" :immediate-check="false" v-model="loading" :finished="finished" finished-text="没有更多了" @load="getStationList">-->
                <!---->
                <!--</van-list>-->
              </div>
              <!--<div class="filtrate-btn">-->
              <!--<div class="reset" @click="sideFiltrateModalShow = false">取消</div>-->
              <!--<button class="l-btn u-confirm" @click="confirm">确定</button>-->
              <!--</div>-->
            </div>
          </div>
        </transition>
      </div>
    </nav-content>
    <div class="choseOil" :disabled="!gunNo" @click="pushHistory()" v-if="ouCode">
      选好了
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import Scroll from '@/components/base/scroll/scroll'
  import {mapGetters} from 'vuex'
  import SubPage from '@/components/product/index/subpage/subpage'

  export default {
    props: {
      hasBack: {
        type: Boolean,
        default: true,
      },
      //当有底部导航的时候 是否是当前显示的
      commonShow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        ouCode: '',
        longitude: '',//经度
        latitude: '',//纬度
        oilGunData: [],
        hasGun: false, // 是否有油枪
        gunNo: '',
        tankOilName: '', // 油品名
        stationList: [], // 油站列表
        sideFiltrateModalShow: false, // 油站模态框展示
        loading: false,
        finished: false,
        page: 0,
        station: {
          stationName: '请选择油站'
        }, // 展示的油站
        stationModel: {}, // 油站code
        isOpenLocation: -1, // 1 开启，0 未开启
        accounts: [100, 200, 300, 500],
        oilValueShow: false,
        oilValue: '',
        oilValueResult: '',
        isChoose: false,
        rfrCode: '',
        kshopOrgid: '',
        kshopGasoilno: '',
      };
    },

    components: {
      SubPage,
      Scroll
    },
    created() {
      // 处理扫码加油进入二维码中携带的数据
      let code = this.$route.query.codeObj
      if (code && code.indexOf('gasoilno') > -1) {
        let params = JSON.parse(code)
        this.kshopOrgid = params.orgid
        this.kshopGasoilno = params.gasoilno
        this.rfrCode = params.rfrCode
      } else {
        this.rfrCode = code
      }

      this.longitude = this.$route.query.longitude
      this.latitude = this.$route.query.latitude
      if (this.$route.query.entryType == 2) {
        this.initScanPage();
      } else {
        this.loadData()
      }
      this.queryOrder()
      this.oilShortName = this.$store.state.globalConfig.oilShortName
      // this.ouCode = '33000158'
    },
    activated() {
      this.queryOrder()
    },
    computed: {
      searchDistance() {
        return this.$store.state.globalConfig.stationDistance || 1000
        // return 1000000
      },
      ...mapGetters({orderList: 'oilPayOrderList'})
    },
    filters: {},
    methods: {
      // 扫码进入页面相关逻辑
      initScanPage() {
        this.station = {
          stationName: this.$route.query.stationName,
          stationOuCode: this.$route.query.stationOuCode,
          standardCode: this.$route.query.stationStandardCode
        };
        this.ouCode = this.$route.query.stationStandardCode;
        this.getOilGun();
      },
      onInput(key) {
        const dotIndex = this.oilValue.indexOf('.')
        // 保留两位小数
        if (dotIndex > -1 && (dotIndex + 3) < this.oilValue.length) {
          console.log((dotIndex + 3) < this.oilValue.length)
          this.oilValue = this.oilValue.slice(0, dotIndex + 3)
        }
        this.isChoose = false
        this.oilValueResult = Number(this.oilValue)
      },
      accountHandle(v) {
        this.oilValue = ''
        this.isChoose = true
        this.oilValueResult = this.oilValueResult == v ? '' : v
      },
      loadData() {
        // 检查定位权限
        let _this = this;
        this.$bridgefunc.checkLocationAuth(_this.loadData).then((locationinfo) => {
          _this.isOpenLocation = 1
          if (!this.longitude || !this.latitude) {
            _this.longitude = locationinfo.longitude
            _this.latitude = locationinfo.latitude
          }
          _this.getStationList(true)
        }, () => {
          _this.isOpenLocation = 0
          _this.$Toast('请您开启GPS定位附近中国石化加油站')
        })
      },
      settingLocation() {
        this.$bridgefunc.requestPermissions()
      },
      oilNameFormater(str) {
        let list = []
        let name = ''
        let label = ''
        let map = {
          '92': '汽油',
          '95': '汽油',
          '98': '汽油',
          '0#': '柴油',
          '0号': '柴油'
        }
        if (this.oilShortName) {
          list = this.oilShortName.split(',')
        } else {
          list = ['汽油', '柴油', '天然气']
        }
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (str.includes(item)) {
            name = item
            break
          }
        }
        if (!name) {
          for (let key in map) {
            if (str.includes(key)) {
              name = map[key]
              label = (key.indexOf('#') > -1 || key.indexOf('号') > -1) ? key.substr(0, key.length - 1) : key
              break
            }
          }
        }
        if (str.indexOf('号') > -1) {
          label = `${str.substring(0, str.indexOf('号'))}`
        } else if (str.indexOf('#') > -1) {
          label = `${str.substring(0, str.indexOf('#'))}`
        }
        return`${label}#${name}`
      },
      // 关于nav-top部分
      backEvent: function () {
        this.$router.go(-1)
      },
      toPayBillList() {
        this.$router.push({
          path: '/firmOrder',
          // name: 'chooseBill',
          // query: {
          //   ouCode:this.ouCode,  //油站编码
          //   gunNo:this.gunNo,    //油枪
          //   oilName:this.payres
          // }
        })
      },
      // 关于弹窗部分
      showPay() {
        if (this.$route.query.entryType != 2) {
          if (this.isOpenLocation === 1) {
            this.sideFiltrateModalShow = true;
          } else {
            this.$Toast('请您开启GPS定位附近中国石化加油站')
          }
        }
      },
      // 通过经纬度获取数据,油站列表接口
      getStationList: function (reload) {
        this.$Loading.open();
        this.page++
        this.loading = true
        let _this = this;
        let url = '/app/json/station/getStationList';

        this.$http.post(url, {
          getType: 1,
          Posx: _this.longitude,
          Posy: _this.latitude,
          // Posx: 110.38308843,
          // Posy: 19.991514,
          token: _this.$store.state.login.token,
          distLess: this.searchDistance, // 1KM
          page: this.page,
          index: this.page,
          rows: 20,
          // stationName: '和西一',
          onlineRefuelEnabled: 1 // 启用线上加油站
        }).then(
          res => {
            this.loading = false
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if (reload) {
                this.stationList = []
              }
              this.stationList = this.stationList.concat(data.data || [])
              let nearbyStation = this.stationList[0]
              if (this.page === 1) {
                if (nearbyStation && nearbyStation.distance < 500) { // 500米
                  this.stationModel = this.stationList[0] && this.$util.deepClone(this.stationList[0])
                  this.station = nearbyStation && this.$util.deepClone(nearbyStation)
                  this.ouCode = this.station.standardCode // todo 还原
                  this.getOilGun();
                } else {
                  this.station = {
                    stationName: '请选择油站'
                  }
                }
              }
              if (this.stationList.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.finished = true
              Toast({
                message: data.info ? data.info : '获取附近加油站失败'
              });
            }
          },
          error => {
            this.finished = true
            _this.$Loading.close();
            Toast({
              message: '获取附近加油站失败'
            });
          }
        );
      },
      //关于油枪部分
      showClss(n, tankOilName) {
        this.gunNo = n;
        this.tankOilName = tankOilName
      },
      // 油枪接口
      getOilGun() {
        this.$Loading.open();
        let url = '/app/json/refuel_center/getGunRecord';

        this.$http.post(url, {
          refuelCheckoutRecordModel: {
            ouCode: this.ouCode
            // token:this.$store.state.login.token
          }
        }).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.oilGunData = data.data || []
              this.hasGun = !!this.oilGunData.length
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      chooseStation(item) {
        this.stationModel = item
        this.station = this.$util.deepClone(this.stationModel)
        this.ouCode = this.station.standardCode
        this.sideFiltrateModalShow = false
        this.getOilGun()
        this.gunNo = ''
      },
      confirm() {
        if (this.ouCode) {

        } else {
          this.$Toast('请选择加油站！')
        }
      },
      // 跳转历史订单
      pushHistory() {
        if (this.gunNo) {
          this.$router.push({
            path: '/chooseBill',
            query: {
              ouCode: this.ouCode,  //油站编码
              oilName: this.station.stationName,  //油站名称
              gunNo: this.gunNo,    //油枪
              tankOilName: this.tankOilName,    //油枪
              account: this.oilValueResult, // 选择的金额

              kshopOrgid: this.kshopOrgid || '',
              kshopGasoilno: this.kshopGasoilno || '',
              rfrCode: this.rfrCode || '',
            }
          })
        } else {
          this.$Toast('请选择油枪')
        }
      },
      queryOrder() {
        this.$request.post('/app/json/refuel_center/queryOrder', {state: 1}).then(res => {
          if (res.status === 0) {
            this.$store.state.oilPayOrderList = res.data.orderList
          }
        })
      }
    }
  };
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  .manual-input {
    border-radius 8px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    margin: 8px 10px;
    padding 11px 15px;

    .input-wrapper {
      display flex
      align-items center
      padding-bottom: 15px;

      .input-content {
        flex 1

        .field {
          padding 0 15px;
        }
      }
    }

    .account-list {
      display flex
      justify-content space-between

      .account-item {
        padding 10px 0;
        float left
        width 22%;
        border: 1px solid rgba(25, 25, 25, 0.08)
        border-radius 5px;
        text-align center

        &.active {
          border-color #f02c2d
        }
      }
    }
  }

  .cart-top {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cart-top .cart-title {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-top .cart-title .title {
    font-size: 18px;
    font-weight: 600;
    padding-left: 1rem;
  }

  .cart-top .cart-edit {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 14px;
    font-weight: 500;
    padding: 0px 14px;
  }

  .oil-wrapper {
    padding-bottom: 64px;

    .other-payment-voucher {
      font-size 14px;
      padding 8px 20px;
      text-align right;
    }

    .refresh {
      padding-top: 20px;

      .btn {
        padding 5px 11px;
        color: #fff;
        display inline-block
        border-radius 5px;
      }

      .iconfont {
        font-size: 25px;
        color: #999;
      }
    }
  }

  .flash-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display flex
    flex-direction column
    background-color: #fff;

    .f-safe {
      padding: 11px 15px;
      background-color: rgba(253, 250, 229, 0.9);
      color: #474747;
      font-size: 12px;
      flex-shrink 0
    }
  }

  .flash-content .f-come {
    border-radius 8px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    margin: 8px 10px;
    padding 11px 15px;
    position: relative
    flex-shrink 0
  }

  .flash-content .f-come .f-come-left {
    padding-left: 36px;
    padding-right: 80px;
    position relative

    .name {
      height 16px;
    }

    .icon {
      width 16px;
      height 20px;
      transform translateY(-50%)
      top: 50%
      left: 0
      position: absolute
      background: url("./images/icon_position.png") no-repeat left center
      background-size: 100% 100%
    }
  }

  .flash-content .f-come .f-come-left .fl-wop {
    font-size: 0.4rem;
    color: #333;
  }

  .flash-content .f-come .f-come-left .fl-wop .distance {
    font-size: 0.32rem;
    color: #666;
    padding-top: 10px;

    .num {
      color: #f02c2d
    }
  }

  .flash-content .f-come .f-come-right {
    flex-shrink 0
    font-size: 14px;
    text-align: center;
    background-color: #f02c2d;
    padding: 0.186rem 0.26rem;
    border-radius: 0.4rem;
    color: #fff;
    position: absolute
    top: 50%
    right: 10px;
    transform translateY(-50%)
  }

  .flash-content .f-noOil {
    text-align: center;
    margin-top: 0.7rem;
    flex-shrink 0
  }

  .flash-content .f-noOil .fnoimg {
    width: 40%;
  }

  .flash-content .f-noOil p {
    color: #666;
    font-size: 0.4rem;
  }

  .flash-content .f-usecont {
    flex 1
    border-radius 8px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    margin: 8px 10px;
    padding 11px 15px;
    padding-bottom: 0
    position: relative
  }

  .flash-content .f-usecont .f-conttitle {
    padding: 8px 0;
    padding-bottom: 15px;
    height 40px;
    text-align: left;
    position: absolute
    top: 0;
    width 100%
  }

  .flash-content .f-usecont .f-conttitle p {
    font-size: 0.4rem;
    color: #4c4948;
  }

  .flash-content .f-usecont .f-conttitle p span {
    color: #999;
    font-size: 0.35rem;
  }

  .flash-content .f-comnember {
    position: absolute
    top: 40px;
    left: 0;
    right: 0;
    padding: 0 8px;
    bottom: 0;
    overflow-y auto
    -webkit-overflow-scrolling touch

    .no-gun-data {
      text-align: center
      color: #999
      padding 15px;
    }
  }

  .flash-content .f-comnember ul {
    overflow: hidden;
    margin-left: -0.26rem
  }

  .flash-content .f-comnember ul li {
    float: left;
    width: 33.33%;
    padding-bottom: 0.2rem;
    padding-left: 0.2rem;
    text-align: center;
  }

  .flash-content .f-comnember ul li .oil-gun-info {
    padding: 0 0.2rem;
    border: 1px solid #dcdddd;
    color: #333;
    font-size: 0.4rem;
    border-radius: 7px;
    height: 44px
    display flex
    justify-content center
    align-items center
    flex-direction column
  }

  .flash-content .f-comnember ul li .oil-gun-info span:first-of-type {
    margin-right: 7px;
  }

  .flash-content .f-comnember ul li .oil-gun-info .name {
    font-size: 10px
    padding-top: 3px
  }

  .flash-content .f-comnember ul li .changecolor {
    padding: 0 0.2rem;
    border: 1px solid #f02c2d;
    color: #f02c2d;
    font-size: 0.4rem;
    border-radius: 7px;
  }

  .flash-content .f-comnember ul li .changecolor span:first-of-type {
    margin-right: 7px;
  }

  .flash-content .mint-popup {
    width: 100%;
  }

  .flash-content .mint-popup .picker-toolbar-title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }

  .flash-content .mint-popup .picker-toolbar-title .usi-btn-cancel {
    color: #FF6600;
  }

  .flash-content .mint-popup .picker-toolbar-title .usi-btn-sure {
    color: #FF6600;
  }

  .choseOil {
    background-color: #f02c2d;
    color: #fff;
    text-align: center;
    padding: 0.32rem 0;
    border-radius: 50px;
    position: absolute;
    bottom: 0.53rem;
    left: 10%;
    width: 80%;
    box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

    &[disabled] {
      opacity 0.5
    }
  }

  .filtrate-modal-wrapper {
    position: absolute;
    top: 0;
    left: 10%;
    width: 90%;
    bottom: 0;
    background: #fff;
    z-index: 900;
    transition: all 0.3s
    box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.2);

    .filtrate-container {
      width: 100%;
      height: 100%;
    }

    .filtrate-tit {
      font-weight: normal;
      height 40px
      line-height: 40px;
      padding-left: 5px
      box-shadow: 2px 0 15px 0 rgba(0, 0, 0, 0.1);
      z-index: 9;
      position: relative;
      display flex
      align-items center
      font-size: 14px;
      border-top: 1px solid rgba(220, 220, 220, 0.18);

      .tit-con {
        vertical-align: middle
        display: inline-block
        padding-left: 5px;
      }

      .tip {
        display inline-block
        margin-left: 6px;
        font-size: 12px;
        color: #f02c2d
      }
    }

    .filtrate-content {
      position: absolute;
      top: 40px;
      bottom: 0;
      width: 100%;
      overflow-y: auto
      -webkit-overflow-scrolling touch

      .station-cell {
        padding 15px;
        position: relative

        &.checked:before {
          content: "";
          display: block;
          width: 20px;
          height: 20px;
          position: absolute;
          right: 10px;
          top: 50%;
          transform translateY(-50%)
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTOI4O+Q4O+U4O+M4O+Q4O9QqKuQ6OuM4O+M4O+Q4POQ4O+Q5PDV0FdEAAAAMdFJOUwATzlLwxgYvspbce5OGaEkAAAB7SURBVCjPY2AY5oAtFIsg51EsgjaOmGLsPgaYglKnsejuacAU4z4lgMUad0wxRmzWpJ5E5oVCjJoThiwYowgik4+gWCN0CMQtOYxqgw5QKeOaDahWgJRynEB3DFDpnoXorhE6JHykAMPdOiqHMR0udGYCFi+GJgznZAYA9rcWsb62p8AAAAAASUVORK5CYII=");
          background-size: 20px;
        }

        & + .station-cell {
          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 15px;
            right: 15px;
            height 1px;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            pointer-events: none;
            box-sizing: border-box;
            border: 0 solid #e5e5e5
            border-top-width: 1px
          }
        }
      }

      .no-data {
        text-align: center
        color: #999
      }
    }

    .filtrate-btn {
      bdr-t()
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 44px;
      display: flex;

      .reset, .u-confirm {
        flex: 1;
        width 100%
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        background: #fff;
      }

      .u-confirm {
        background: #f23031;
        color: #fff;
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
