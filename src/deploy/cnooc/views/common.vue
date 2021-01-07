<template>
  <div class="mobile-preview" v-if="pageShow">
    <div class="full-div" v-if="pageData.type == '0'">
      <!-- <div class="notice-bar" v-if="isShowNotice">
        <img src="../../../assets/icon-horn.png" alt class="icon-horn" />
        <div class="notice-bar-wrap" @click="goNotice">海油行会员成长值开启通知</div>
        <img src="../../../assets/icon-close.png" alt class="icon-close" @click="closeNotice" />
      </div>-->
      <component
        :is="'PreviewComponent'"
        :pageData="pageData"
        :barHeight="getTopHeight()"
        @getPageData="getPageData(-1)"
      ></component>
    </div>
    <!-- <div class="full-div" v-if="pageData.type == '1'">
      <div class="page-content">
        <div
          class="full-div"
          v-for="(item, index) in tabbarSubDatas"
          v-if="item.hasShow && item.data"
          v-show="index == selectedIndex">
          <component
            :ref="getComRef(index)"
            :hasBack="getHasbackEvent(item.code)"
            :is="item.code"
            :pageData="item.data"
            :barHeight="getTopHeight()"
            :commonShow="selectedIndex == index"
            @getPageData="getPageData(item.pgCode,index)"></component>
        </div>
      </div>
    </div>-->
    <transition name="fade-overlay">
      <div class="activity-popup" v-if="isShowActModal">
        <div class="activity-modal" :style="{backgroundImage: 'url('+ actModal.backgroundPic +')'}">
          <div class="scroll-c" :style="{ paddingTop: actModal.awardTop + 'px' }">
            <div class="content">
              <div
                class="coupon"
                v-for="(item, index) in actModal.receiveSurveyConfModels"
                :key="index"
                :style="{ backgroundImage: 'url('+ item.awardImgUrl +')'}"
              >
                <div class="left">
                  <div v-if="item.receiveType === 10">
                    <p class="amount">{{ item.couFaceValue }}</p>
                    <p class="award-name">{{ item.awardName }}</p>
                  </div>
                </div>
                <div class="right">
                  <p class="name">{{ item.awardName }}</p>
                  <p class="time">{{ validityPeriod(item) }}</p>
                </div>
                <div class="num">
                  <span class="tip">x</span>
                  {{ item.awardNum ? item.awardNum : 1 }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="receive-btn"
            :style="{backgroundImage: 'url('+ actModal.btnPic +')'}"
            @click="receiveClick(actModal.id)"
          ></div>
          <img
            src="../assets/images/close.png"
            alt
            class="close-btn"
            @click="isShowActModal = false"
          />
        </div>
        <div class="activity-overlay"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import wxfunc from "@/utils/wxfunc";
import { MessageBox } from "mint-ui";
import { MP } from "@/utils/map";
export default {
  name: "index",
  components: {
    PreviewComponent: () =>
      import("@/components/product/index/preview/preview-component")
  },
  data() {
    return {
      pgCode: "",
      pageShow: false,
      pageData: {},
      fullPageData: {},
      tabbarSubDatas: [],
      selectedIndex: -1,
      bdMap: null,

      isShowActModal: false,
      isShowNotice: true,
      actModal: {
        title: ""
      }
    };
  },
  methods: {
    getTopHeight() {
      return this.$store.state.barHeight;
    },
    getPageData(tabbarIndex, queryStationCode) {
      if (tabbarIndex == -1) {
        this.pageShow = false;
      }
      if (!queryStationCode) {
        queryStationCode = this.$store.state.refuelStation.stationCode || '1'
      }
      let params = {
        storeOuCode: queryStationCode,
        accessType: 2,
        appType: 1
      };

      let _this = this;
      this.$STLoading.open();
      this.$http
        .post("/app/json/app_vue_page/vueGetPageData", params)
        .then(res => {
          let data = res.data;
          _this.$STLoading.close();
          if (data.status == 0 && data.data.pageDataJson) {
            if (data.data && data.data.pageDataJson) {
              let fdata = data.data;
              let pdata = JSON.parse(fdata.pageDataJson);

              // 日志打印
              pdata.moduleList.forEach((item, index) => {
                console.log(item.code + "----" + index);
              });
              console.log(pdata);
              // 日志打印end

              _this.fullPageData = fdata;
              _this.pageData = pdata;
              _this.pageShow = true;
              if (pdata.header && pdata.header != undefined) {
                let title = pdata.header.data.title;
                if (title != undefined && title && title != "") {
                  document.title = title;
                }
              }
              if (queryStationCode) {
                this.queryUserConfig(queryStationCode);
              }
            }
          } else {
            _this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$STLoading.close();
          this.$Toast(err);
        });
    },
    // 获取领取调查问券列表
    queryUserConfig(stationCode) {
      this.$STLoading.open();
      let params = {
        receiveChannel: 1, // 1 公众号 2 app
        stationCode: stationCode
        // stationCode: "1001002003001022" // todo
      };
      this.$http
        .post("/app/json/survey/getUserConfigByOuCode", params)
        .then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (data.data.id) {
              this.actModal = data.data;
              setTimeout(() => {
                this.isShowActModal = true;
              }, 1500);
            }
          } else {
            this.$STLoading.close();
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$STLoading.close();
          this.$Toast(err);
        });
    },
    // 领取
    receiveClick(activityId) {
      this.$Loading.open();
      this.$http.post("/app/json/survey/receiveAward", {
        token: this.$store.state.login.token,
        stationCode: this.$store.state.refuelStation.stationCode,
        activityId: activityId
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          if (data.data.mktAwardModelList.length == 0) {
            this.$Toast("领取失败！");
          } else {
            this.$Toast("领取成功！");
            this.isShowActModal = false;
          }
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Loading.close();
        this.$Toast(err);
      });
    },
    // 处理领取电子券时间
    validityPeriod(item) {
      if (item.startTime) {
        return item.startTime + "至" + item.endTime;
      } else if (item.awardDays) {
        return "有效期" + item.awardDays + "天";
      } else {
        return "";
      }
    },
    // 关闭通知
    closeNotice() {
      this.isShowNotice = false;
    },
    // 顶部通知点击
    goNotice() {
      this.$router.push("/notice-bar");
    },
    // 获取定位
    getGeoLocation() {
      wxfunc.getWechatSignature(isSignature => {
        if (isSignature) {
          // 签名成功
          wxfunc.wxGetLocation(location => {
            if (location) {
              let convertor = new BMap.Convertor();
              let pointArr = [];
              pointArr.push(
                new BMap.Point(location.longitude, location.latitude)
              );
              // 真实经纬度转成百度坐标
              convertor.translate(pointArr, 3, 5, translatedPoint => {
                if (translatedPoint.status === 0) {
                  window.localStorage.setItem("geoLng", translatedPoint.points[0].lng);
                  window.localStorage.setItem("geoLat", translatedPoint.points[0].lat);
                }
              });
            }
          });
        } else {
          // 签名失败
          this.$Toast("获取微信权限出错，请联系管理员");
          this.getNearStations(null);
        }
      });
    },
    initBMap() {
      MP().then(BMap => {
        // 在百度地图容器中创建一个地图
        this.bdMap = new BMap.Map("allmap")
        require('@/utils/InfoBox');
        this.getGeoLocation();
      });
    },

    // 获取用户默认油站
    getStation() {
      this.$http
        .post("/app/json/hy_station/getDefaultStation", {})
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$store.commit("setStationInfo", data.data);
            this.getPageData(-1, data.data.stationCode);
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    }
  },
  watch: {},
  activated() {
    // this.getPageData(-1, this.$store.state.refuelStation.stationCode)
  },
  mounted() {
    this.$store.state.clientWidth = document.documentElement.clientWidth;

    console.log(
      "是否在store中存储了油站信息",
      !!this.$store.state.refuelStation.stationCode
    );

    // 是否在store中存储了油站信息
    if (!!this.$store.state.refuelStation.stationCode) {
      // 是 展示页面
      this.getPageData(-1, this.$store.state.refuelStation.stationCode);
    } else {
      // 否 获取用户默认油站
      this.getStation();
    }

    this.initBMap();
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.notice-bar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 40px;
  font-size: 14px;
  padding: 0 16px;
  color: #ed6a0c;
  line-height: 24px;
  background-color: #fffbe8;
  z-index: 9999;
  display: flex;
  align-items: center;

  .icon-horn {
    width: 18px;
    margin-right: 4px;
  }

  .notice-bar-wrap {
    flex: 1;
    height: 24px;
    overflow: hidden;
  }

  .icon-close {
    width: 40px;
    padding: 13px;
    margin-right: -16px;
  }
}

.mobile-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .full-div {
    position: relative;
    width: 100%;
    height: 100%;

    .page-content {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 45px;
    }
  }

  // 模太框遮罩层动画
  .fade-overlay-enter-active, .fade-overlay-leave-active {
    transition: opacity 0.3s;
  }

  .fade-overlay-enter, .fade-overlay-leave-to {
    opacity: 0;
  }

  .activity-popup {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2000;

    .activity-modal {
      background-size: cover;
      position: absolute;
      left: 18px;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0 0 16px 16px;
      z-index: 4000;

      .scroll-c {
        padding: 0 12px 5px;
        overflow-y: hidden;
      }

      .content {
        margin-top: 5px;
        max-height: 298px;
        overflow-y: auto;

        .coupon {
          display: flex;
          background-size: 100% 100%;
          color: #005d9c;
          box-sizing: border-box;
          margin-bottom: 10px;
          height: 90px;
          position: relative;

          .left {
            width: 90px;
            font-size: 35px;
            font-weight: 700;
            text-align: center;
            padding-left: 15px;
            box-sizing: border-box;

            .amount {
              font-weight: 700;
              padding-top: 15px;
            }

            .award-name {
              padding-top: 4px;
              font-size: 13px;
            }
          }

          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 17px;
            line-height: 20px;
            padding: 10px;
            padding-right: 12px;

            .name {
              ellipse-2();
              padding-bottom: 3px;
            }

            .time {
              padding-top: 3px;
              font-size: 13px;
              color: #000;
            }
          }

          .num {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: #000;

            .tip {
              margin-right: 2px;
            }
          }
        }
      }

      .receive-btn {
        height: 50px;
        padding: 0 25px;
        background-size: 100% 100%;
        text-align: center;
        margin: 0 40px 25px;
      }

      .close-btn {
        display: block;
        width: 28px;
        position: absolute;
        left: 50%;
        bottom: -40px;
        transform: translateX(-50%);
      }
    }

    .activity-overlay {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      position: relative;
      z-index: 3999;
    }
  }
}
</style>
