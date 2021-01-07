<template>
  <div class="ad-page">
    <nav-top title="优惠详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="lucky">
        <div class="top">
          <div class="topContent">
            <img src="./image/come.png" class="comeImg" alt=""/>
            <div class="topRight">
              <div class="long">
                <p>{{ stationName }}</p>
                <p class="distance">
                  <img src="./image/address.png" alt=""/><span
                >距离您{{ distance }}m</span
                >
                </p>
              </div>
            </div>
          </div>
          <ul class="active">
            <li
              :class="{ first: index === 0, change: index === number }"
              @click="add(item, index)"
              v-for="(item, index) in list"
            >
              {{ item.title }}
              <p>{{ item.oilNo ? item.oilNo : "" }}</p>
            </li>
          </ul>
        </div>
        <div class="bottom">
          <div class="content">
            <p class="instructions">活动说明：</p>
            <p v-html="activityDesc">{{ activityDesc }}</p>
          </div>
        </div>
        <div :class="{ btn: true, btn2: change }" @click="use">立即使用</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Popup, Dialog, Toast} from "vant";
  import JsBarcode from "jsbarcode";
  import QRCode from "qrcode";

  export default {
    name: "ad-page",
    components: {
      Popup,
      Dialog,
      Toast
    },
    data() {
      return {
        change: true,
        isNo: 0,
        list: [],
        stationName: "xxx加油站", // stationName和distance用后要清空
        distance: "", // 距离
        obj: null, // 展示的油站
        index: "",
        number: 0,
        token: "",
        postData: {},
        theIndex: 0,
        station: null, //缓存station
        sideFiltrateModalShow: false,
        activityDesc: "",
        itemObj: ""
      };
    },
    methods: {
      // 满减
      add(item, index) {
        this.number = index;
        this.itemObj = item;
        this.change = true;
      },
      // 立即使用
      use() {
        if (this.distance > 1000) {
          Dialog.alert({
            title: "",
            message: `当前位置距离${this.stationName}${this.distance}米，请在${this.stationName}1公里内使用`
          });
          return;
        }
        let obj = {
          // token: this.$store.getters.token,
          "hjyCouponReqModel.activityId": this.station.activityId || "",
          // 'hjyCouponReqModel.stationId': this.station.id || '',
          "hjyCouponReqModel.couTypeId": this.itemObj.id || "",
          "hjyCouponReqModel.stationCode": this.station.stationCode || "",
          isJsonData: true
        };
        // 保留油站名称和使用时间和优惠金额，在pay-detail.vue中显示
        let detailInfo = {
          stationName: this.stationName,
          faceValue: this.itemObj.facevalue,
          title: this.itemObj.title,
          oilNo: this.itemObj.oilNo
        };
        this.$bridgefunc.customPush({
          path: "/hkcode",
          query: {
            item: encodeURIComponent(JSON.stringify(obj)),
            detailInfo: encodeURIComponent(JSON.stringify(detailInfo))
          }
        });
      }
    },
    created() {
      console.log('进来了')
      // 上线注释一定要     打开
      let stationItem = JSON.parse(
        decodeURIComponent(this.$route.query.stationItem)
      );
      console.dir(stationItem)
      console.log("stationItem", stationItem);
      this.list = stationItem.couTypeVos;
      this.stationName = stationItem.stationName;
      this.distance = stationItem.distance;
      this.station = stationItem;
      this.activityDesc = stationItem.activityDesc;
      this.itemObj = JSON.parse(
        JSON.stringify(this.list.length ? this.list[0] : "")
      );
      console.log('赋值结束')
    },
    mounted() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .ad-page {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 2%;
    position: relative;

    .lucky {
      width: 100%;
      height: 100%;
    }

    .tomo {
      width: 100%;
      height: 100%;
      text-align: center;
      margin-top: 40%;
      color: #796f6f;
      font-size: 14px;
    }

    .top {
      width: 100%;
      padding: 6px 6px 0 6px;
      border-radius: 6px;
      box-shadow: 0px 0px 1px #e7dbdb;

      .topContent {
        display: flex;
        align-items: center;
        padding-bottom: 6px;

        .comeImg {
          width: 44px;
          height: 44px;
        }
      }

      .topRight {
        flex: 1;
        display: flex;
        margin-left: 6px;
        align-items: center;
        justify-content: space-between;

        .long {
          font-size: 16px;

          p {
            margin-top: 4px;
          }

          .distance {
            font-size: 14px;
            color: #796f6f;

            img {
              height: 18px;
              margin-right: 4px;
            }
          }
        }

        .many {
          background-color: rgb(240, 44, 45);
          padding: 6px 8px;
          font-size: 13px;
          border-radius: 16px;
          color: white;
          text-align: center;
        }
      }

      .active { /* 活动如满100减10 */
        width: 100%;
        display: flex;
        align-items: center;
        border-top: 1px solid #e8e1e1;
        justify-content: space-around;
        padding: 14px 0;

        li {
          border-left: 1px solid #ded2d2;
          width: 33%;
          height: 44px;
          line-height: 20px;
          font-size: 14px;
          text-align: center;

          p {
            font-size: 12px;
            color: #7b6d6d;
          }
        }

        .change {
          border-bottom: 1px solid red;
        }

        .first {
          border-left: none;
        }
      }
    }

    .bottom {
      padding: 6px 2px 6px 2px;
      margin-top: 10px;
      width: 100%;
      height: 60%;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      .content {
        width: 98%;
      }

      p {
        font-size: 12px;
        line-height: 16px;
        margin-top: 10px;
        color: #796f6f;
      }

      .instructions {
        font-size: 16px;
        color: #1d1b1b;
        font-weight: 500;
      }

      .code {
        width: 100%;
        height: 340px;
        text-align: center;
        margin-top: 14px;

        #barcode {
          width: 80%;
          height: 110px;
        }

        #qrcode {
          width: 230px !important;
          height: 230px !important;
        }
      }
    }

    .btn {
      width: 90%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      background-color: #d1c3c3;
      margin: 14px auto;
      box-shadow: 0px 0px 4px #736c6c;
      font-size: 16px;
      color: white;
    }

    .btn2 {
      background-color: rgb(240, 44, 45) !important;
      box-shadow: 0px 0px 4px #f02c2d !important;
    }

    .history {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin: 14px auto;
      font-size: 14px;
      color: #807777;
    }

    .van-popup {
      width: 80%;
      height: 140px;
      border-radius: 6px;
    }

    .alert {
      width: 100%;
      height: 96%;
      padding-top: 4%;
      text-align: center;
      font-size: 16px;

      span {
        color: rgb(240, 44, 45);
        font-size: 22px;
        margin: 0 4px;
      }

      p {
        margin-top: 16px;
        color: #7f7070;
      }

      .btns {
        margin-top: 16px;
        display: flex;
        width: 100%;
        justify-content: space-around;

        .change {
          background-color: rgb(240, 44, 45);
          width: 70px;
          color: white;
          height: 30px;
          line-height: 30px;
          border-radius: 8px;
        }

        .no {
          background-color: #9c9a97;
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
    transition: all 0.3s;
    box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.2);

    .filtrate-container {
      width: 100%;
      height: 100%;
    }

    .top {
      width: 100%;
      padding: 6px 6px 0 6px;
      border-radius: 6px;
      box-shadow: 0px 0px 1px #e7dbdb;
      margin-bottom: 10px;

      .topContent {
        display: flex;
        align-items: center;
        padding-bottom: 6px;

        .comeImg {
          width: 44px;
          height: 44px;
        }
      }

      .topRight {
        flex: 1;
        display: flex;
        margin-left: 6px;
        align-items: center;
        justify-content: space-between;

        .long {
          font-size: 16px;

          p {
            margin-top: 4px;
          }

          .distance {
            font-size: 14px;
            color: #796f6f;

            img {
              height: 18px;
              margin-right: 4px;
            }
          }
        }

        .many {
          background-color: rgb(240, 44, 45);
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 16px;
          color: white;
          text-align: center;
        }

        .now {
          padding: 6px 0px;
          font-size: 13px;
          text-align: center;

          img {
            width: 40px;
            height: 40px;
          }
        }
      }
    }

    .filtrate-tit {
      font-weight: normal;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      box-shadow: 2px 0 15px 0 rgba(0, 0, 0, 0.1);
      z-index: 9;
      position: relative;
      display: flex;
      align-items: center;

      .address-name {
        flex-shrink: 0;
        font-size: 12px;
        text-align: center;
        color: $color-text-gray;
        padding-right: 8px;

        .text {
          vertical-align: middle;
          padding-right: 4px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 64px;
        }

        .arrow-down {
          vertical-align: middle;
        }
      }

      .address-search {
        flex: 1;
        padding-right: 10px;
        position: relative;

        .icon {
          font-size: 14px;
          text-rendering: auto;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: $color-text-gray;
          z-index: 9;
        }

        .search-wrapper {
          background: #f4f4f4;
          border-radius: 18px;
          padding-left: 30px;
          height: 30px;
          font-size: 14px;
          width: 100%;
          position: relative;

          .search {
            background: #f4f4f4;
            padding-right: 10px;
            height: 26px;
            line-height: 26px;
            position: absolute;
            left: 32px;
            transform: translateY(-50%);
            top: 50%;
            border-radius: 0;
            border: none;
            -webkit-appearance: none;
          }
        }
      }
    }

    .filtrate-content {
      position: absolute;
      top: 40px;
      bottom: 44px;
      width: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .filtrate-btn {
      bdr-t();
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 44px;
      display: table;

      .reset, .u-confirm {
        display: table-cell;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        background: #f23031;
        color: #fff;
      }

      .u-confirm {
        background: #f23031;
        color: #fff;
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all 0.3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
