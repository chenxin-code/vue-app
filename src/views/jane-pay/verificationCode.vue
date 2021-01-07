<template>
  <div class="body">
    <nav-top title="加油机验证获取" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt/>
                <span>会员手机号</span>
              </div>
              <div class="center">
                <input type="text" v-model="userInfo.phone" disabled/>
              </div>
            </div>
          </div>
          <div class="table-view-cell" @click="select('1')">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_colour.png" alt/>
                <span>选择车牌</span>
              </div>
              <div class="center right1">
                <mt-field v-model="plateNo" disabled placeholder="请选择车牌号"></mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div class="table-view-cell" @click="select('2')">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon-you.png" alt/>
                <span>选择油站</span>
              </div>
              <div class="center right1">
                <mt-field v-model="station" disabled placeholder="请选择油站"></mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <!--          <div class="table-view-cell">-->
          <!--            <div class="table-view-cell-text">-->
          <!--              <div class="left">-->
          <!--                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt/>-->
          <!--                <span>签约支付方</span>-->
          <!--              </div>-->
          <!--              <div class="center">-->
          <!--                <input type="text" v-model="payModelSub" disabled/>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
         <div class="effective">
           <div>
             <p>*短信验证码{{$store.state.globalConfig.station_countdown}}分钟内有效</p>
           </div>
           <div class="btns">
             <span class="code gray" v-if="!btnView" @click="getCode">获取建行验证码</span>
             <span class="code" v-else> <count-button class="theme_standard_font" @getSmsEvent="getMsgCode" :phone="userInfo.phone" ref="countBtn"></count-button></span>
           </div>
         </div>
        </div>
      </div>
    </nav-content>
    <transition name="filtrate-mask">
      <div class="filtrate-modal-mask" v-show="sideFiltrateModalShow" @click="sideFiltrateModalShow = false"></div>
    </transition>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="model" v-if="show">
<!--          <p class="p">加油机验证获取</p>-->
          <div @click="sideFiltrateModalShow = false">
            <i class="icon iconfont mall-fanhui"></i>
            <span>请选择已签约车牌</span>
          </div>
          <ul v-show="chepaiList.length != 0">
            <li v-for="item in chepaiList" @click="gitPlateNo(item)">{{item.plateNo}}</li>
          </ul>
          <div v-show="chepaiListView">
            <p class="nullData" v-show="chepaiList.length == 0">暂无已签约车牌</p>
          </div>
        </div>
        <div class="model" v-else>
<!--          <p class="p">加油机验证获取</p>-->
          <div @click="sideFiltrateModalShow = false">
            <i class="icon iconfont mall-fanhui"></i>
            <span>油站列表</span>
            <span></span>
            <span class="distance">以下是您周边{{$store.state.globalConfig.station_distless}}公里内的油站</span>
          </div>
          <ul v-show="stationList.length != 0">
            <li v-for="item in stationList" @click="gitStation(item)">{{item.stationName}}</li>
          </ul>
          <div v-show="stationListView">
            <p class="nullData" v-show="stationList.length == 0">暂无油站</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import CountButton from './count-button';
  // import CountButton from '@/components/commonui/count-button';
  import {mapGetters} from "vuex";
  import api from "./api";

  export default {
    name: "",
    components: {
      CountButton
    },
    mixins: [api],
    data() {
      return {
        plateNo: "", //车牌号
        station: '', // 油站
        payModelSub: '建行', //签约方
        hasToSign: false,
        sideFiltrateModalShow: false,
        show: false,
        chepaiList: [],
        stationList: [],
        stationCode: '',
        btnView: false,
        stationListView: false,
        chepaiListView: false
      };
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    mounted() {
      console.log(this.$store.state.globalConfig.station_countdown);
      this.backUUID = this.$util.randomString();
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToSign) {
          this.checkSignResult();
        }
      });
      this.$http.post('/app/json/user/getSignTagListByUserId', {token: this.$store.state.login.token}).then(res => { //已选车牌号
        let data = res.data
        if (data.status == 0) {
          this.chepaiListView = true
          this.chepaiList = res.data.data || []
        } else {
          this.$Toast(data.info)
        }
      })
      let params = {
        token: this.$store.state.login.token,
        getType: 1, //1 百度经纬度查询 2 腾讯经纬度查询
        distLess: this.$store.state.globalConfig.station_distless, //按千米
        posx: this.$store.state.currentLocation.posx, //x坐标，经度
        posy: this.$store.state.currentLocation.posy //y坐标，纬度
      }
      this.$http.post('/app/json/station/getStationList', params).then(res => { //油站列表
        let data = res.data
        if (data.status == 0) {
          this.stationListView = true
          this.stationList = res.data.data || []
        } else {
          this.$Toast(data.info)
        }
      })
    },
    methods: {
      checkSignResult: function () {
        // do check
        this.hasToSign = false;
      },
      getCode() {
      this.judgebtnView()
      },
      select(params) {
        if (params == 1) {
          this.show = true
        } else {
          this.show = false
        }
        this.sideFiltrateModalShow = true;
      },
      judgebtnView() {
        if (!this.plateNo) {
          this.$Toast('请选择车牌')
          return
        } else if(!this.station) {
          this.$Toast('请选择油站')
          return;
        }
        this.btnView = true
      },
      getMsgCode: function (imgVerifyCode, uuid) {
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/user/sendMessage';
        let paramsData = {
          phone: this.userInfo.phone,
          plateNo: this.plateNo,
          stationId: this.stationCode //油站标准编码
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      gitPlateNo(data) {
        console.log(data);
        this.plateNo = data.plateNo
        this.sideFiltrateModalShow = false
        this.judgebtnView()
      },
      gitStation(data) {
        this.stationCode = data.standardCode //油站标准编码
        this.station = data.stationName //油站名称
        this.sideFiltrateModalShow = false
        this.judgebtnView()
      }
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    font-size: 16px;

    .tipDiv {
      border-top: 1px solid #e5e5e5;

      .carint {
        width: 140px;
      }

      /deep/ .table-view .table-view-cell .table-view-cell-text .left {
        width: 135px;

        .img1 {
          width: 30px;
          vertical-align: middle;
        }

        /deep/ .mint-field-core {
          font-size: 14px;
          color: #cdcbcc;
        }
      }
    }

    /deep/ .mint-field-core {
      background: white;
    }
  }

  /deep/ .van-checkbox {
    justify-content: center;
  }

  /deep/ .mint-cell-wrapper {
    padding: 0;
  }

  /deep/ .iconfont {
    margin-right: 20px !important;
  }

  /deep/ .mint-field-other {
    /* right 4px; */
  }

  input:disabled {
    background-color: white;
  }

  .radioBtn {
    .radioBtnDiv {
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
    }
  }

  #xialaView {
    top: auto;
    width: 100%;
  }

  /deep/ .nav-content {
    overflow-y: auto !important;
  }

  /deep/ .van-radio__label {
    font-size: 12px;
    margin-left: 3px;
  }

  .toast {
    width: 70%;
    background: #000;
    color: white;
    top: 50%;
    position: absolute;
    left: 15%;
    font-size: 14px;
    line-height: 22px;
    text-indent: 0.5rem;
    padding: 6px 10px;
    opacity: 0.7;
  }

  /deep/ .mint-field-other {
    margin-left: 15px;
  }

  /deep/ .van-overlay {
    background-color: transparent !important;
  }
  .filtrate-modal-mask {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index 899
  }

  .filtrate-modal-wrapper {
    position: absolute;
    top: 0;
    left: 15%;
    width: 85%;
    bottom: 0;
    z-index: 900;
    transition: all 0.3s
    background: #fff

    .filtrate-container {
      width: 100%;
      height: 100%;
      padding 20px 15px;
    }

    .filtrate-btn {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 44px;
      display: flex;
      justify-content space-around
      font-size 16px;
      div {
        width 50%;
        text-align center
        height: 44px;
        line-height 44px
      }
      div:nth-child(2) {
        color white;
      }
      .btn {
        flex-shrink 0
        text-align: center;
        width 40%
        border-radius 30px;

        &.plain {
          color: #333;
        }

        &:after {
          border-radius 60px;
          border-color: #e5e5e5
        }
      }
    }
    .model {
      padding: 20px 20px;
      color: #4d4948;
      margin-top 0.8rem
      .iconfont {
        margin-right 0 !important
      }
      .p {
        font-size: 18px;
        margin-bottom: 30px;
      }
      .distance {
        font-size 14px
        color #ff6801
        margin-left 4px
      }
      ul {
        margin 0px 0 25px 25px
        height: 500px;
        font-size: 14px;
        overflow-y: auto;
        li {
          margin 25px 0
        }
      }
    }
  }
    .effective {
      width 100%
      position fixed
      bottom 50px
      text-align center
      font-size 14px
      .btns {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        .code {
          padding: 15px 60px;
          border: 1px solid #ff6801;
          color #ff6801
          border-radius: 22px;
          font-size 16px
          margin auto 5px
        }
        .base_con {
          width auto !important
          margin auto 0
          color #ff6801 !important
        }
        .gray {
          border: 1px solid #cecbcc;
          color #cecbcc
        }
      }
    }
  .base_con {
    font-size 16px
  }
  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }
  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  .filtrate-mask-enter-active, .filtrate-mask-leave-active {
    transition: all .3s;
  }

  .filtrate-mask-enter, .filtrate-mask-leave-to {
    opacity 0
  }
</style>
