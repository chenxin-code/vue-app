<template>
  <div>
    <!-- header -->
    <nav-top :noTitle="true" @backEvent="$router.go(-1)">
      <div class="cart-top">
        <div class="cart-title">
          <span class="title theme_font_black">{{ $store.state.globalConfig.oilPayTitle || '加油支付' }}</span>
        </div>
        <p class="cart-edit" @click="toPayBillList">支付凭证</p>
      </div>
    </nav-top>
    <!-- body -->
    <nav-content class="pay-content">
      <div class="pay-c">
        <template v-if="orderList.length">
          <router-link to="/oil-pay/order-list?enterPage=scan">
            <div class="f-safe">
              您有未支付订单，点击查看
            </div>
          </router-link>
        </template>
        <!-- 当前位置 -->
        <div class="f-safe" v-else>请在安全区域内使用手机</div>
        <div class="current-station" @click='sideFiltrateModalShow = true'>
          <img src="./images/icon_position.png" alt class="position-icon"/>
          <div class="position-text">
            您当前在：
            <span class="station-name">{{ scanResult.stationName }}</span>
          </div>
        </div>
        <!-- 加油金额 -->
        <div class="manual-input">
          <img src="./images/icon_position.png" alt class="amount-icon"/>
          <van-field
            class="input-wrapper"
            label-width="90px"
            v-model="amount"
            type="number" @input="onInput"
            pattern="[0-9]*"
            clearable
            label="加油金额(元)"
            placeholder="请输入加油金额"
          />
        </div>
        <div class="account-list">
          <span
            class="account-item"
            :class="{active: isChoose && item == oilValueResult}"
            @click="accountHandle(item)"
            v-for="(item, index) in accounts"
            :key="index"
          >{{item}}</span>
        </div>
        <!-- 选择油品 -->
        <div class="chose-oil">
          <img src="./images/icon_GasStation.png" alt class="oil-icon"/>
          <span class="title">选择油品</span>
        </div>
        <div class="oil-list">
          <span
            class="oil-item"
            v-for="(item, index) in stationOil"
            :key="index"
            :class="{active: isChooseOil && item.oilName == oilTypeResult.oilName}"
            @click="choseOilType(item)"
          >{{ item.oilName }}</span>
        </div>
      </div>
      <!-- 底部结算 -->
      <div class="settlement">
        <span class="station-name">{{ scanResult.stationName }}</span>
        <div class="choseOil" :disabled="!isAllReady" @click="goPayOrder">选好了</div>
      </div>
      <!-- 油站列表-->
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
              </div>
            </div>
          </div>
        </transition>
    </nav-content>
    <!-- 输入金额虚拟键盘 -->
    <van-number-keyboard
      :maxlength="6"
      @input="onInput"
      extra-key="."
      @delete="onDelete"
      :show="oilValueShow"
      @blur="oilValueShow = false"
    />
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Scroll from '@/components/base/scroll/scroll'
  export default {
    components:{
      Scroll
    },
    data() {
      return {
        scanResult: {},
        oilValueShow: false,
        amount: "",
        oilValueResult: NaN,
        accounts: [100, 200, 300, 500],
        isChoose: false,

        stationOil: [],
        isChooseOil: false,
        oilTypeResult: {},

        isAllReady: false,
        kshopOrgid: '',
        kshopGasoilno: '',
        rfrCode: '',
        source: '', // offline 云南离线支付入口
        finished: false, //油站列表请求
        stationList: [], //油站列表
        sideFiltrateModalShow: false, //是否展示油站列
        stationModel: {}, // 油站code
        longitude: null,
        latitude: null,
        loading: false,
        page: 0
      };
    },
    computed: {
      ...mapGetters({orderList: 'oilPayOrderList'}),
      searchDistance() {
        return this.$store.state.globalConfig.stationDistance || 1000
      }
    },
    watch: {
      oilValueResult: function (newVal) {
        if (!this.oilTypeResult.tankOilNo) {
          this.isAllReady = false;
          return false;
        }
        if (!!Number(newVal)) {
          this.isAllReady = true;
        } else {
          this.isAllReady = false;
        }
      }
    },
    mounted() {
      this.source = this.$route.query.source
      let code = this.$route.query.codeObj
      let requestParams = null;
      // code = '{"orgid":"116002016002","gasoilno":"7"}'
      if (code.indexOf('gasoilno') > -1) {
        let params = JSON.parse(code)
        requestParams = {
          kshopOrgid: params.orgid,
          kshopGasoilno: params.gasoilno
        };
        this.kshopOrgid = params.orgid;
        this.kshopGasoilno = params.gasoilno;
      } else {
        requestParams = {
          rfrCode: code
        };
        this.rfrCode = code
      }
      this.scanCodeInfo(requestParams);

    },
    created() {
      this.queryOrder()
      this.loadData()
    },
    activated() {
      if (this.enter) {
        this.queryOrder()
      }
    },
    methods: {
      // 虚拟键盘-输入金额
      onInput() {
        const dotIndex = this.amount.indexOf('.')
        // 保留两位小数
        if (dotIndex > -1 && (dotIndex + 3) < this.amount.length) {
          this.amount = this.amount.slice(0, dotIndex + 3)
        }

        this.isChoose = false
        this.oilValueResult = Number(this.amount)
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
      // 获取油站列表
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
          // Posx: 106.711074,
          // Posy: 26.567878,
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
      chooseStation(item) {
        this.stationModel = item
        // this.station = this.$util.deepClone(this.stationModel)
        // this.ouCode = this.station.standardCode
        this.sideFiltrateModalShow = false
      
        this.scanCodeInfo({stationOuCode: item.stationCode})
        // this.gunNo = ''
      },
      // 虚拟键盘-删除金额
      onDelete() {
        this.amount = String(this.amount).slice(
          0,
          String(this.amount).length - 1
        );
        this.isChoose = false;
        this.oilValueResult = this.amount;
      },
      // 快捷选择加油金额
      accountHandle(item) {
        this.isChoose = true;
        this.amount = item;
        this.oilValueResult = item;
      },
      // 油品选择
      choseOilType(item) {
        this.isChooseOil = true;
        this.oilTypeResult = item;
      },
      // 扫码信息查询-如果扫码结果为对象则传入对象，如果扫码结果为值则传入值
      scanCodeInfo(requestParams) {
        this.$Loading.open();
        this.$http
          .post("/app/json/refuel_scan_code/getScanCodeInfo", requestParams)
          .then(res => {
            let data = res.data;
            if (data.status == 0) {
              this.scanResult = data.data;
              this.stationOil = data.data.oilList;
              this.oilTypeResult = data.data.oilList[0];
              this.isChooseOil = true;
            } else {
              this.$Toast(data.info);
            }
            this.$Loading.close();
          })
          .catch(err => {
            this.$Loading.close();
            this.$Toast(`getScanCodeInfo err ${err}`);
          });
      },
      // 去订单详情页面
      goPayOrder() {
        if (this.isAllReady) {
          this.$router.push({
            path: "/payOrder",
            query: {
              comeFromPage: 1,
              ouCode: this.scanResult.stationOuCode, // 油站编码
              tankOilName: this.oilTypeResult.oilName, // 油品名称
              tankOilNo: this.oilTypeResult.tankOilNo, // 油罐油品编码
              amount: this.oilValueResult, // 加油金额
              // amount: 0.01, // 加油金额
              oilName: this.scanResult.stationName, // 油站名称
              kshopOrgid: this.kshopOrgid, // 组织机构编码
              kshopGasoilno: this.kshopGasoilno, // 加油码
              rfrCode: this.rfrCode,
              source: this.source
            }
          });
        }
      },
      toPayBillList() {
        // if (this.source && this.source == 'offline') {
        //   this.$router.push({path: "/firmScanOfflineOrder"});
        // } else {
        //   this.$router.push({
        //     path: "/firmScanOrder",
        //   });
        // }
        this.$router.push({
          path: "/firmScanOrder",
          query: {source: this.source}
        });
      },
      queryOrder() {
        this.$request.post('/app/json/refuel_scan_code/queryOrder', {state: 1}).then(res => {
          if (res.status === 0) {
            this.enter = true
            this.$store.state.oilPayOrderList = res.data.orderList
          }
        })
      }
    }
  };
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  .cart-top {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cart-title {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 18px;
        font-weight: 600;
        margin-left 20px;
      }
    }

    .cart-edit {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 14px;
      font-weight: 500;
      padding: 0px 14px;
    }
  }

  .pay-content {
    background-color: #f5f5f5;

    .pay-c {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      padding-bottom: 71px;
    }

    .f-safe {
      padding: 11px 15px;
      background-color: rgba(253, 250, 229, 0.9);
      color: #474747;
      font-size: 12px;
      flex-shrink: 0;
    }

    .current-station {
      background-color: #fff;
      padding: 20px 15px;
      display: flex;
      align-items: center;

      .position-icon {
        width: 16px;
        margin-right: 10px;
      }

      .position-text {
        font-size: 14px;

        .station-name {
          max-width: 245px;
          display: inline-block;
          color: #777;
          vertical-align: middle;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    .manual-input {
      background-color: #fff;
      font-size: 14px;
      margin: 8px 0px 0px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background: #ddd;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
        z-index: 10;
      }

      .amount-icon {
        width: 16px;
        margin-right: 10px;
      }

      .input-wrapper {
        padding: 15px 0;

        &::after {
          display: none;
        }
      }
    }

    .account-list {
      padding: 15px;
      background-color: #FFF;
      display: flex;
      justify-content: space-between;

      .account-item {
        padding: 10px 0;
        float: left;
        width: 22%;
        border: 1px solid rgba(25, 25, 25, 0.08);
        border-radius: 5px;
        text-align: center;

        &.active {
          border-color: #f02c2d;
          color: #f02c2d;
        }
      }
    }

    .chose-oil {
      background-color: #FFF;
      font-size: 14px;
      margin: 8px 0px 0px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background: #ddd;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
        z-index: 10;
      }

      .oil-icon {
        width: 20px;
        margin-right: 10px;
      }

      .title {
        padding: 20px 0px;
      }
    }

    .oil-list {
      padding: 15px;
      background-color: #FFF;
      display: flex;
      // justify-content space-between
      flex-wrap: wrap;

      .oil-item {
        float: left;
        padding: 10px 2px;
        margin: 0 6px;
        width: 22%;
        border: 1px solid rgba(25, 25, 25, 0.08);
        border-radius: 5px;
        text-align: center;
        margin-top: 10px;

        &.active {
          border-color: #f02c2d;
          color: #f02c2d;
        }

        &:nth-child(-n + 4) {
          margin-top: 0;
        }

        &:nth-child(4n + 1) {
          margin-left: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }

    .settlement {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 20px 15px;
      background-color: #FFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background: #ddd;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
        z-index: 10;
      }

      .station-name {
        display: block;
        max-width: 250px;
        line-height: 20px;
        display: -webkit-box;
        overflow: hidden;
        white-space: normal !important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .choseOil {
        font-size: 15px;
        background-color: #f02c2d;
        color: #fff;
        text-align: center;
        padding: 8px 18px;
        border-radius: 50px;
        box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

        &[disabled] {
          opacity: 0.5;
        }
      }
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
