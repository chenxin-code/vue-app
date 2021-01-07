<template>
  <div class="hy-top" :style="getModuleBg()">
    <div class="top-container">
      <div class="user-info">
        <div class="avator">
          <img v-if="userInfo.avtUrl" :src="userInfo.avtUrl" alt />
          <img v-else src="static/images/hy-top/avatar.png" alt />
        </div>
        <div class="name-container">
          <p class="nickname">HI, {{ userInfo.realName }}</p>
          <div class="btn-c">
            <div
              class="left"
              :class="hotareaClass({idCode: moduleData.idCode + 'benefitsClick_1'})"
              @click="hotEvent('benefitsClick_1');benefitsClick()"
            >成长值 {{ this.processNum(userInfo.levelPoints) }}</div>
            <div class="right" :class="hotareaClass({idCode: moduleData.idCode + 'goStar'})" @click="hotEvent('goStar');goStar()">海星值 {{ this.processNum(userInfo.starts) }}</div>
          </div>
        </div>
        <div class="member-code" :class="hotareaClass({idCode: moduleData.idCode + 'toCode'})" @click="hotEvent('toCode');toCode()">
          <img src="static/images/hy-top/icon-mem-code.png" alt class="icon-mem-code" />
          <p class="text">会员码</p>
        </div>
      </div>

      <div :class="hotareaClass({idCode: moduleData.idCode + 'benefitsClick_2'})" @click="hotEvent('benefitsClick_2');benefitsClick()" class="schedule-container">
        <p class="sch-title">{{ userInfo.leveName }}</p>
        <span class="my-rights">会员成长值</span>
        <div class="my-progress">
          <div
            v-for="(item, index) in breakPoint"
            :key="index"
            class="breakpoint"
            :class="{active: item.__isAchieve}"
          >
            <div class="info-item">
              <p class="name">{{ item.name }}</p>
              <div class="break-icon">
                <img :src="item.activeIconUrl" alt v-if="item.__isAchieve" />
                <img :src="item.iconUrl" alt v-else />
              </div>
              <span class="num">{{item.pointAmount}}</span>
            </div>
            <div class="progress-whole" v-if="!((breakPoint.length - 1) == index)">
              <div
                class="progress-portion"
                :style="{width: (item.__isFull) ? '100%' : computedProgressWidth(item)}"
              >
                <span class="progress-point" v-if="item.__isAchieve && !item.__isFull"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'hy-top',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        userInfo: {},
        breakPoint: ''
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
      }
    },
    created() {
      this.initUserInfo()
    },
    mounted() {
      // let stationInfo = ''
      // if (this.$route.query.selectStationInfo) {
      //   stationInfo = JSON.parse(this.$route.query.selectStationInfo)
      // }
      // if (stationInfo.stationName) {
      //   this.stationName = stationInfo.stationName
      // } else {
      //   this.stationName = this.$store.state.indexData.station.stationName
      // }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      // 计算进度
      computedProgressWidth(item) {
        if (item.__isAchieve) {
          let result =
            ((this.userInfo.levelPoints - item.__interval.range[0]) /
              item.__interval.difference) *
            100;
          return result.toFixed(2) + "%";
        } else {
          return "0%";
        }
      },
      // 处理数值
      processNum(num, point) {
        point = point || 1;
        let numStr = "0";
        if (num != null && num !== undefined) {
          numStr = num.toString();
        }
        // 十万以内直接返回
        if (numStr.length < 6) {
          return numStr;
        } else if (numStr.length > 8) {
          // 大于8位数是亿
          let decimal = numStr.substring(
            numStr.length - 8,
            numStr.length - 8 + point
          );
          return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿";
        } else if (numStr.length > 5) {
          // 大于6位数是十万 (以10W分割 10W以下全部显示)
          let decimal = numStr.substring(
            numStr.length - 4,
            numStr.length - 4 + point
          );
          return parseFloat(parseInt(num / 10000) + "." + decimal) + "万";
        }
      },
      // 会员权益点击
      benefitsClick: function () {
        window.localStorage["breakPoint"] = JSON.stringify(this.breakPoint);
        let url = window.location.origin + '/site/app/index.html#/member-benefits'
        this.$market.enterNav({
          link: {
            type: '3',
            url: url,
            args: {
              levelPoints: this.userInfo.levelPoints,
              leveName: encodeURIComponent(this.userInfo.leveName),
              configId: this.userInfo.configId,
              nextLevelDisparity: this.userInfo.nextLevelDisparity
            }
          }
        });
      },
      goStar: function () {
        let url = window.location.origin + '/site/app/index.html#/my-star'
        this.$market.enterNav({
          link: {
            type: '3',
            url: url,
            args: {
              userCode: this.userInfo.userCode
            }
          }
        });
      },
      toCode: function () {
        let url = window.location.origin + '/site/app/index.html#/pay-member'
        this.$market.enterNav({
          link: {
            type: '3',
            url: url
          }
        });
      },
      initUserRank(levelPoint) {
        let url = this.$market.apiBaseURL() + '/app/json/user_rights/getUserRank';
        let paramsData = {};
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.breakPoint = data.data;
            for (let i = 0; i < this.breakPoint.length; i++) {
              // 处理图标
              this.breakPoint[i].iconUrl = require("./images/member-level-active-" + i + ".png");
              this.breakPoint[i].activeIconUrl = require("./images/member-level-" + i + ".png");
              // 判断当前等级区间
              if (levelPoint >= this.breakPoint[i].pointAmount) {
                // 已经达到该等级
                this.breakPoint[i].__isAchieve = true;
                if (this.breakPoint[i + 1]) {
                  if (levelPoint >= this.breakPoint[i + 1].pointAmount) {
                    // 是否超过该等级
                    this.breakPoint[i].__isFull = true;
                  } else {
                    this.breakPoint[i].__isFull = false;
                  }
                }
              } else {
                this.breakPoint[i].__isAchieve = false;
              }
              // 整理区间
              if (this.breakPoint[i] && this.breakPoint[i + 1]) {
                this.breakPoint[i].__interval = {
                  intervalIndex: i,
                  range: [
                    this.breakPoint[i].pointAmount,
                    this.breakPoint[i + 1].pointAmount
                  ],
                  difference:
                    this.breakPoint[i + 1].pointAmount -
                    this.breakPoint[i].pointAmount
                };
              } else {
                this.breakPoint[i].__interval = null;
              }
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
        })
      },
      initUserInfo() {
        let url = this.$market.apiBaseURL() + '/app/json/user_info/loadUserIndexInfo';
        let paramsData = {};
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.userInfo = data.data;
            // this.qrcodeData.mainTitle = data.data.realName;
            // 头像
            let avtUrl = this.userInfo.avtUrl;
            if (avtUrl) {
              avtUrl.startsWith("http")
                ? (this.userInfo.avtUrl = avtUrl)
                : (this.userInfo.avtUrl = `http://${window.location.host}/download?uploadFile.id=${imgUrl}`);
            }
            this.initUserRank(data.data.levelPoints);
          } else {
            // this.$message.notifyErr(data.info);
          }
        }, error => {
        })
      },
      selectStation: function () {
        this.$market.selectStation();
      },
      toSignIn: function () {
        this.$market.enterNav(this.moduleData)
      },
      getModuleBg: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        return styleStr
      }
    }
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  // 不换行
  .top-container {
    background: url('./images/benefits_bottom.png') no-repeat center;
    background-size: 100% auto;
    background-position-y: top;
    padding: 0 15px;
    min-height: 170px;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;

    .user-info {
      position: relative;
      margin: 40px 0 10px;

      .right-btn {
        text-align: right;
        float: right;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        img {
          width: 20px;
          margin-left: 15px;
        }
      }

      .avator {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        vertical-align: middle;

        img {
          display: block;
          width: 100%;
        }
      }

      .name-container {
        position: absolute;
        left: 0;
        top: 0;
        padding-left: 70px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .nickname {
          max-width: 150px;
          ellipse();
          color: #fff;
          font-size: 17px;
          vertical-align: middle;
        }

        .btn-c {
          margin-top: 12px;
          display: flex;

          .left, .right {
            font-size: 12px;
            padding: 0 8px;
            height: 19px;
            line-height: 19px;
            color: #fff;
            border: 1px solid #fff;
            border-radius: 9px;
            background-color: rgba(255, 255, 255, 0.3);

            .icon-points, .icon-star {
              display: inline-block;
              width: 12px;
              vertical-align: middle;
            }
          }

          .left {
            margin-right: 10px;
          }
        }
      }

      .member-code {
        position: absolute;
        right: 15px;
        top: 0;

        .icon-mem-code {
          display: block;
          width: 40px;
          margin: 5px auto 0;
        }

        .text {
          color: #fff;
          font-size: 14px;
          text-align: center;
          margin-top: 5px;
        }
      }
    }

    .mid-content {
      background-color: #068ED0;
      opacity: 0.8;
      padding: 18px 0;
      border-radius: 5px;
      box-shadow: 0 0 2px #068ED0;
      display: flex;
      color: #fff;
      text-align: center;
      margin-top: 40px;

      .left, .right {
        flex: 1;

        .title {
          .icon {
            width: 15px;
            vertical-align: middle;
          }

          .text {
            font-size: 13px;
            display: inline-block;
            vertical-align: middle;
          }
        }

        .num {
          font-size: 15px;
          font-weight: 700;
          margin-top: 10px;
        }
      }
    }

    .schedule-container {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
      font-size: 13px;
      color: #068ED0;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 10px #999;
      margin: 30px 0 15px;
      width: 100%;

      .sch-title {
        height: 35px;
        line-height: 35px;
        padding-left: 10px;
        margin: 0;
        font-size: 15px;
      }

      .my-rights {
        display: block;
        color: #fff;
        font-size: 12px;
        line-height: 20px;
        padding: 0 10px;
        color-gradient();
        position: absolute;
        right: 0;
        top: 10px;
        border-radius: 20px 0 0 20px;
        background-color: #068ED0;
      }
    }
  }
  .schedule-container {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    font-size: 13px;
    color: #068ED0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px #999;
    margin: 30px 0 15px;
    width: 100%;

    .sch-title {
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      margin: 0;
      font-size: 15px;
    }

    .my-rights {
      display: block;
      color: #fff;
      font-size: 12px;
      line-height: 20px;
      padding: 0 10px;
      color-gradient();
      position: absolute;
      right: 0;
      top: 10px;
      border-radius: 20px 0 0 20px;
      background-color: #068ED0;
    }
  }
  // 进度条样式
  .my-progress {
    width: 100%;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    .breakpoint {
      font-size: 12px;
      flex-grow: 1;
      display: flex;
      align-items: center;

      &:last-child {
        flex-grow: 0;
      }

      .info-item {
        position: relative;
        z-index: 10;

        .name {
          margin: 0;
          white-space: nowrap;
          text-align: center;
        }

        .break-icon {
          width: 35px;
          height: 35px;
          margin: 5px auto;
          border: 1px solid #068ED0;
          border-radius: 50%;
          background-color: #fff;
          position: relative;

          img {
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .num {
          display: block;
          text-align: center;
        }
      }

      .progress-whole {
        height: 3px;
        background-color: #ddd;
        flex-grow: 1;

        .progress-portion {
          height: 3px;
          background-color: #068ED0;
          position: relative;

          .progress-point {
            position: absolute;
            right: -4px;
            top: -3px;
            width: 8px;
            height: 8px;
            border: 1px solid #068ED0;
            border-radius: 50%;
            background-color: #fff;
            z-index: 2;

            &::before {
              content: '';
              display: block;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: #068ED0;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }

    .breakpoint.active {
      .break-icon {
        background-color: #068ED0;
      }
    }
  }

</style>

