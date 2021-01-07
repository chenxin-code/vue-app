<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="bottom">
    <Navigation v-if="isShowNav" title="加油闪付" hasBack="0"></Navigation>
    <div class="content-div" :style="{top: topHeight + 'px'}">
      <div class="white-block">
        <div class="tip-div">
          <!--<img class="tip-img" src="static/image/refuel/tishi.png"/>-->
          <p class="font-medium-s" style="color: #FFFFFF">警告:加油站请勿下车使用手机！</p>
        </div>
      </div>
      <div class="white-block">
        <div class="padding-div">
          <div class="icon-div">
            <img src="static/image/refuel/refuel01.png"/>
          </div>
          <div class="info-div font-medium">
            <div style="flex: 1;">
              <p style="color: #898989;">当前位置:</p>
              <p class="station-p single-line">{{station.stationName==''?'请选择加油站':station.stationName}}</p>
            </div>
            <div class="btn-div" @click="chagneStation()">更改油站</div>
          </div>
        </div>
      </div>
      <div class="white-block">
        <div class="padding-div guns-div">
          <div class="title-div">
            <div style="flex: 1;">
              <div class="text-div font-medium single-line">请选择您加油使用的油枪</div>
              <div class="hint_style">(建议咨询工作人员)</div>
            </div>
            <img class="icon-div full-img" src="static/image/refuel/refuel02.png"/>
          </div>
        </div>
        <div class="btns-div">
          <div class="item-div" @click="sureEvent(item.text)" v-for="(item,idx) in guns">
            <!--<img class="selected-img" v-if="selectedid == idx" src="@/assets/refuel/selected.png"/>-->
            {{item.text}}号
          </div>
          <div class="item-div" @click="otherClick">
            其他
            <!--<img class="selected-img" v-if="selectedid == guns.length" src="@/assets/refuel/selected.png"/>-->
          </div>
          <!--<div class="item-div" :class="{selected: selectedid == guns.length}">-->
          <!--{{otherGun}}-->
          <!--<input type="number" v-model="otherGunNo" ref="otherguninput" :class="{selected: selectedid == guns.length}"-->
          <!--v-on:blur="inputBlur()" v-on:focus="inputFocus()"/>-->
          <!--<img class="selected-img" v-if="selectedid == guns.length" src="@/assets/refuel/selected.png"/>-->
          <!--</div>-->
        </div>
      </div>
      <!--<div class="sure-div" @click="sureEvent()">确定</div>-->
      <div class="float_div" v-if="showOther">
        <div class="alert_div">
          <div>请输入油枪号</div>
          <input type="number" placeholder="" oninput="if(value.length>2)value=value.slice(0,2)" v-model="otherGun">
          <div class="btns">
            <div class="btn1" @click="cencleClick">取消</div>
            <div class="btn2" @click="sureEvent(otherGun+'')">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {MessageBox, Toast} from 'mint-ui'
  import Navigation from '@/components/base/navigation'

  export default {
    name: 'refuel-select-oilgun',
    components: {
      Toast,
      MessageBox,
      Navigation
    },
    data() {
      return {
        showOther: false,
        otherGun: '',
        guns: [],
        selectedid: -1,
        otherGunNo: '',
        gunNo: '',
        inputting: true,
        station: {},
        longitude: '',//经度
        latitude: '',//纬度
        topHeight: 0,
        isShowNav: true,
      }
    },
    methods: {
      chagneStation: function () {
        this.$bridgefunc.customPush({
          path: '/refuelstationlist',
          isnativetop: '1'
        })
      },
      cencleClick: function () {
        this.showOther = false;
        this.otherGun = 0;
      },
      sureEvent: function (gun) {
        if (!gun || gun == '0' || gun == '00') {
          this.$Toast('枪号输入有误');
          return;
        }
        if (!this.station['stationCode']) {
          Toast({
            message: '请选择油站',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
//        if (this.selectedid == -1 && this.otherGun == '其他') {
//          Toast({
//            message: '请选择油枪',
//            position: 'bottom',
//            duration: 2000,
//          });
//          return;
//        }
//        if (this.selectedid != this.guns.length) {
//          this.gunNo = this.guns[this.selectedid].text
//        } else {
//          this.gunNo = this.otherGun;
//        }
        let _this = this;
        this.$bridgefunc.customPush({
          path: '/refuelinfo',
          isnativetop: '1',
          query: {
            station: encodeURIComponent(JSON.stringify(this.station)),
            gunNo: gun,
          },
        })
        _this.showOther = false;
      },
      inputFocus: function () {
        this.selectedid = this.guns.length
        this.otherGunNo = ''
        this.otherGun = ''
      },
      inputBlur: function () {
        if (this.otherGunNo == '') {
          this.otherGun = '其他'
          this.selectedid = -1
          return
        } else if (this.otherGunNo.indexOf("#") > 0) {
          this.otherGun = this.otherGunNo.replace("#", "");
        }
        this.otherGun = this.otherGunNo + ' #'
        this.otherGunNo = ''
      },
      itemEvent: function (index) {
        this.selectedid = index
        this.sureEvent();
      },
      otherClick: function () {
        this.showOther = true;
      },
      getStationList: function () {
        this.$Loading.open();
        let url = '/app/json/refuel/getStationList';
        let _this = this;

        this.$http.post(url, {
          lng: _this.longitude,
          lat: _this.latitude,
          token: _this.$store.state.login.token,
          pageIndex: '1'
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.station = data.data[0];

            } else {
              Toast({
                message: data.info ? data.info : '获取附近加油站失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '获取附近加油站失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },

      setData: function () {
        if (this.$route.query.station) {
          this.station = JSON.parse(decodeURIComponent(this.$route.query.station));
          this.isShowNav = false;
          this.topHeight = 0;

          let _this = this;
          this.$bridgefunc.registePageShow(function () {
            _this.$bridgefunc.vuexRead()
          })

        } else {
          this.topHeight = this.$store.state.barHeight + this.$market.getNavHeight();
          let _this = this;
          this.$bridgefunc.getLocation(function (locationinfo) {
            _this.longitude = locationinfo.longitude
            _this.latitude = locationinfo.latitude;
            _this.getStationList();
          })
        }
        for (let i = 1; i < 20; i++) {
          this.guns.push({
            id: i,
            text: i
          });
        }
      }
    },

    watch: {
      '$store.state.refuelStation.stationCode': function (val, oldVal) {
        if (this.$store.state.refuelStation.stationCode != '') {
          this.station = this.$util.cloneDeep(this.$store.state.refuelStation);
          if (this.station.stationName.length > 10) {
            this.station.stationName = this.station.stationName.substring(0, 10) + '...'

          }
          for (let key in  this.$store.state.refuelStation) {
            this.$store.state.refuelStation[key] = '';
          }
          this.$bridgefunc.vuexStorage()
        }
      },
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.$bridgefunc.vuexRead();
      })
    },
    created() {
      this.setData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    position relative
    width 100%
    height 100%
    background-color $color-background-lll
    overflow: hidden

    .float_div {
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      overflow hidden
      display flex
      justify-content center
      align-items center
      background-color rgba(0, 0, 0, 0.5)
      .alert_div {
        background-color white
        padding 10px
        border-radius 10px
        border 1px solid $color-line-gray-l
        text-align center
        input {
          margin 10px
          text-align center
          border 1px solid $color-line-gray-l
          padding 8px
        }
        .btns {
          margin-top 10px
          padding-top 10px
          display flex
          align-items center
          border-top 1px solid $color-line-gray-l
          .btn1 {
            flex 1
            border-right 1px solid $color-line-gray-l

          }
          .btn2 {
            flex 1
          }
        }
      }
    }
    .content-div {
      position absolute
      bottom 0
      right 0px;
      left 0px;
      -webkit-overflow-scrolling: touch
      overflow-y: auto
      overflow-x: hidden

      .white-block {
        margin-bottom 10px;
        background-color #fff
        overflow hidden

        .tip-div {
          padding 5px
          text-align center
          background #ff615a

          .tip-img {
            width 22px;
            height 22px;
            vertical-align: text-top
          }

          p {
            display inline-block
            vertical-align: text-top
            color $color-theme-text-d
            padding 2px 5px 0px 5px;
          }
        }

        .padding-div {
          padding 4%

          .icon-div {
            float left
            /*margin 4% 0px 4% 4%*/
            position relative
            width 40px;
            height 40px;
            img {
              height 100%
            }
          }

          .info-div {
            height 40px;
            overflow hidden
            padding-left 10px
            display flex
            align-items center

            .station-p {
              margin-top 4px;
              font-size $font-size-medium-x
              font-weight 500
            }

            .btn-div {
              color $color-theme-text-l
              padding 3px 10px
              border-radius 20px
              border 1px solid $color-theme-text-l
            }
          }

          .title-div {
            overflow hidden
            padding-bottom 12px;
            border-bottom 1px solid $color-line-gray-l
            display flex
            align-items center

            .text-div {
              font-weight 500
            }
            .hint_style {
              color $color-text-l
              font-size $font-size-small
            }
          }
        }

        .btns-div {
          overflow hidden
          padding-bottom 4%
          margin-left 4%

          .item-div {
            position relative
            margin-top 12px;
            float left
            border 1px solid $color-line-gray-l
            border-radius 5px
            width 21%
            margin-right 4%
            padding 8px 0px;
            text-align center
            font-size $font-size-medium

            .selected-img {
              position absolute
              right 0px
              bottom 0px
              height 16px
              width 16px
              overflow hidden
              border-radius 0px 0px 3px 0px
            }

            input {
              position absolute
              width 100%
              left 0px
              /*left 15%*/
              /*height 100%*/
              /*height 44px*/
              border: 0px;
              background: none;
              text-align center
              outline none;
            // font-size $font-size-medium
            // color $color-text
              overflow hidden
              text-align center
            }

            span {
              position absolute
              width 50%
              left 75%
            }
          }

          .selected {
            color $color-theme-text-d
            border-color $color-theme-text-d
          }
        }

        .guns-div {
          padding-bottom 0px
        }

        .text-color-td {
          color $color-theme-text-d
        }
      }

      .sure-div {
        text-align center
        margin 14px 4%;
        color #fff
        background-color $color-theme-text-d
        padding 8px;
        border-radius 20px;
      }
    }
  }
</style>
