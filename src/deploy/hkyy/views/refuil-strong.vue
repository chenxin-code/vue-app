<template>
  <div class="station">
    <div class="top-back">
      <div class="top-div">
        <div class="left-textdiv" @click="goHistory">
          <div class="allNumber">累计参与次数：{{ listNumber.length }}</div>
          <div class="allNumber">累计优惠金额：{{ allNumber }}元</div>
        </div>
        <img class="right-img" src="./image/recode.png" @click="goHistory"/>
      </div>
    </div>
    <div class="station-bottom back-border-notcomplete" v-if="!isUsed">
      <div class="bottom-top">
        <span
          :class="{ slected: slectedIndex == index }"
          @click="changeSearchType(index)"
          v-for="(item, index) of searchTypeList"
        >{{ item.title }}</span
        >
      </div>
      <div class="station-list" v-if="list && list.length">
        <div
          class="station-item"
          v-for="(item, index) in list"
          @click="manyStation(item, index)"
        >
          <div class="station-content">
            <img src="./image/come.png" class="item-left" alt=""/>
            <div class="item-center">
              <p class="station-name">{{ item.stationName }}</p>
              <p class="distance center-item">
                <img src="./image/distance.png" alt=""/>
                <span>距离您{{ item.distance }}m</span>
              </p>
              <p class="time center-item">
                <img src="./image/time.png" alt=""/>
                <span>{{ item.activityTimeDesc }}</span>
              </p>
              <p class="reduceDetail center-item">
                <img src="./image/jian.png" alt=""/>
                <span>{{ counpdesc(item) }}</span>
              </p>
            </div>
            <div class="item-right">
              <img src="./image/navigation.png" alt=""/>
              <span>惠加油</span>
            </div>
          </div>
        </div>
      </div>
      <div class="none-station" v-if="list && !list.length">
        <img src="./image/notice.png"/>
        <div>10公里内没有好客油油活动油站</div>
      </div>
    </div>
    <div class="isUsed" v-else>
      你今天已享受好客油油优惠，不要贪心呦！请明天再来
    </div>
  </div>
</template>

<script>
  import {Dialog, Toast} from "vant";
  import wxfunc from "@/utils/wxfunc";

  export default {
    name: "huijiayou",
    components: {},
    data() {
      return {
        list: null,
        recode: {
          count: "11",
          amout: "21212"
        },
        slectedIndex: 0,
        searchTypeList: [
          {
            title: "距离最近"
          },
          {
            title: "优惠最多"
          }
        ],
        isUsed: false,
        allNumber: 0, // 节省多少钱
        listNumber: [], // 多少条
        nowlat: "",
        nowlong: ""
      };
    },
    methods: {
      counpdesc(item) {
        let lastStr = "";
        let arrary = item.couTypeVos;
        arrary.forEach(item => {
          if (item.oilNo) {
            lastStr += item.title + "(" + item.oilNo + ")" + ";";
          } else {
            lastStr += item.title + ";";
          }
        });
        return lastStr;
      },
      manyStation(item, index) {
        if (item.distance > 1000) {
          let _this = this;
          Dialog.confirm({
            title: "",
            message: `您与该油站距离较远，是否使用导航？`,
            confirmButtonText: "是",
            cancelButtonText: "否"
          })
            .then(() => {
              // console.log('parseFloat(item.posy)', parseFloat(item.posy))
              console.log("1");
              _this.$bridgefunc.baiduNav({
                startlong: _this.nowlong || '',
                startlat: _this.nowlat || '',
                endlong: parseFloat(item.posx),
                endlat: parseFloat(item.posy),
                type: "nav"
              });
            })
            .catch(() => {
              _this.goPay(item);
            });
        } else {
          this.goPay(item);
        }
      },
      goPay(item) {
        console.dir('跳转前', item)
        this.$bridgefunc.customPush({
          path: "/hkpay",
          query: {
            stationItem: encodeURIComponent(JSON.stringify(item))
          }
        });
      },
      goHistory() {
        this.$bridgefunc.customPush({
          path: "/hkhistory"
        });
      },
      changeSearchType(index) {
        this.slectedIndex = index;
        if (index == 0) {
          this.list.sort(this["arrarySortwithDistance"]);
        } else {
          this.list.sort(this["arrarySortwithFaceValue"]);
        }
      },
      arrarySortwithDistance(a, b) {
        return a.distance - b.distance;
      },
      arrarySortwithFaceValue(a, b) {
        let lastFaceValuea = a.couTypeVos[a.couTypeVos.length - 1];
        let lastFaceValueb = b.couTypeVos[b.couTypeVos.length - 1];
        return lastFaceValueb.facevalue - lastFaceValuea.facevalue;
      },
      // 获取列表
      getList(latitude, longitude) {
        let url = "/platform/json/hzf/getNearbyStations";
        this.$Loading.open();
        // 获取列表接口
        let data = {
          latitude: latitude,
          longitude: longitude,
          token: this.$store.state.login.token || ""
        };
        let _this = this;
        this.$http.get(url, {params: data}).then(
          res => {
            _this.$Loading.close();
            if (res.data.status === 0) {
              let data = res.data.data;
              // let test = {
              //   activityDesc:
              //     "1.本活动仅限在联盟路加油站（127）使用，且每人每天仅限使用一次。<br/>2.本活动不与其他电子券叠加使用，且不参与银联满减、加满赠活动。<br/>3.同一用户当天使用过其他汽油券活动后，不可使用本活动。<br/>4.同一用户当天使用过本活动后，不可使用其他汽油券活动。<br/>5.本活动不可提现，不设找零，且截屏、复制、修改、转发均无效。",
              //   activityId: 1250,
              //   activityTimeDesc: "周四",
              //   activityTimeDetail: "4",
              //   activityTimeType: 2,
              //   address: "石家庄新华区联盟东路1号",
              //   couTypeVos: [],
              //   distance: "0.80",
              //   id: null,
              //   phone: null,
              //   posx: "114.49666109469716",
              //   posy: "38.07806202155429",
              //   stationCode: "VB27",
              //   stationName: "联盟路加油站（127）"
              // };
              // _this.list = [
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test,
              //   test
              // ];
              _this.list = data;
              _this.list.sort(this["arrarySortwithDistance"]);
            } else {
              if (res.data.errorCode == 1001) {
                _this.isUsed = true;
              } else {
                _this.$Toast({
                  message: res.data.info,
                  position: "bottom",
                  duration: 2000
                });
              }
            }
          },
          error => {
            _this.$Loading.close();
            _this.$Toast({
              message: "请求失败",
              position: "bottom",
              duration: 2000
            });
          }
        );
      },
      getLocation() {
        let _this = this;

        this.$bridgefunc.getLocation(locationinfo => {
          console.log("locationinfo", locationinfo);
          let longitude = locationinfo ? locationinfo.longitude : "";
          let latitude = locationinfo ? locationinfo.latitude : "";
          _this.getList(latitude, longitude);
          _this.nowlat = latitude;
          _this.nowlong = longitude;
        });
      },
      // 获取历史记录表
      getAllList() {
        let url = "/platform/json/hzf/getHzfCouUsedRecord";
        let data = {
          // token: this.$store.state.login.token || '',
          isJsonData: true
        };
        this.$http.post(url, data).then(res => {
          let data = res.data;
          if (Number(data.status) === 0) {
            this.allNumber = data.data.totalAmount ? data.data.totalAmount : 0; // 总钱
            this.listNumber = data.data.info ? data.data.info : []; // 列表
          } else {
            // 失败
            this.$Toast(res.data.info);
          }
        });
      },
      refresh() {
      }
    },
    created() {
      // let token = this.getUrlParam("token");
      // this.$store.commit("setToken", token);
      // this.$store.getters.token && this.getLocation();
      // this.$store.getters.token && this.getAllList();
      this.getLocation();
      this.getAllList();
      // this.getList("38.039439", "114.499512");
    },
    mounted() {
      // if (!this.$store.getters.token) {
      //   let token = this.getUrlParam("token");
      //   this.$store.commit("setToken", token);
      // }
    },
    watch: {
      // "$store.getters.token": function() {
      //   this.setShareConfig();
      //   this.getAllList();
      // }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '../stylus/variable.styl';
  @import '../stylus/layout.styl';

  .station {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;

    .top-back {
      height: 100px;

      .top-div {
        height: 120px;
        background: url('./image/top-back.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .left-textdiv {
          color: $color-theme-text-g;
          font-size: $font-size-medium;
          font-weight: $font-weight-xx;
          position: absolute;
          top: 26px;

          span {
            display: block;
            padding: 5px 0;
          }

          .top1 {
            font-size: $font-size-medium-x;
            ont-weight: 1000;
            color: white;
          }

          .allNumber {
            font-size: 18px;
            color: white;
            margin-top: 6px;
          }
        }

        .right-img {
          width: 60px;
          height: 70px;
          position: absolute;
          top: 18px;
          right: 20px;
        }
      }
    }

    .station-bottom {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .bottom-top {
        display: flex;
        padding: 15px 0;
        font-size: $font-size-medium;

        span {
          width: 50%;
          text-align: center;
          color: black;
          padding: 5px 0;
          margin: 0 40px;
        }

        .slected {
          border-bottom: 2px solid $color-theme-text-r;
          color: $color-theme-text-r;
        }
      }

      .station-list {
        flex: 1;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        padding: 10px;

        .station-item {
          width: 100%;
          padding: 5px 0;
          border-bottom: 1px solid $color-theme-line;

          .station-content {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 6px;

            .item-left {
              width: 40px;
              height: 40px;
              align-self: start;
            }

            .item-center {
              flex: 1;
              padding-left: 6px;
              display: flex;
              flex-direction: column;
              font-size: $font-size-medium-s;

              .center-item {
                display: flex;
                align-items: center;
                padding: 5px 0;

                img {
                  width: 12px;
                  height: 12px;
                }

                span {
                  flex: 1;
                  padding-left: 6px;
                  color: $color-theme-text-h;
                }
              }

              .station-list {
                flex: 1;
                overflow: scroll;
                -webkit-overflow-scrolling: touch;
                padding: 10px;

                .station-item {
                  width: 100%;
                  padding: 5px 0;
                  border-bottom: 1px solid $color-theme-line;

                  .station-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-bottom: 6px;

                    .item-left {
                      width: 40px;
                      height: 40px;
                      align-self: start;
                    }

                    .item-center {
                      flex: 1;
                      padding-left: 6px;
                      display: flex;
                      flex-direction: column;
                      font-size: $font-size-medium-s;

                      .center-item {
                        display: flex;
                        align-items: center;
                        padding: 5px 0;

                        img {
                          width: 12px;
                          height: 12px;
                        }

                        span {
                          flex: 1;
                          padding-left: 6px;
                          color: $color-theme-text-h;
                        }
                      }

                      .station-name {
                        font-size: $font-size-medium;
                      }
                    }

                    .item-right {
                      display: flex;
                      flex-direction: column;
                      padding-right: 10px;

                      img {
                        width: 30px;
                        height: 30px;
                      }

                      span {
                        font-size: $font-size-medium-s;
                        padding-top: 10px;
                      }
                    }
                  }
                }
              }
            }

            .item-right {
              display: flex;
              flex-direction: column;
              padding-right: 10px;

              img {
                width: 30px;
                height: 30px;
              }

              span {
                font-size: $font-size-medium-s;
                padding-top: 10px;
              }
            }
          }
        }
      }

      .none-station {
        text-align: center;
        margin-top: 50px;

        img {
          width: 50px;
          height: 50px;
        }

        div {
          padding: 10px;
          color: $color-theme-text-h;
          font-size: $font-size-medium;
        }
      }
    }

    .isUsed {
      margin-top: 150px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme-text-h;
    }
  }
</style>
