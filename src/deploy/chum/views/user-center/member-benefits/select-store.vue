<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="store">
      <van-dropdown-menu active-color="#C9A063" class="reset-dropdown">
        <div class="airport-chose" @click.capture="isShowAirportModal = true">
          <span class="text">{{ airportSelection.airportName }}</span>
        </div>
        <van-dropdown-item
          :title="selectAirportFloor.text"
          :options="airportFloor"
          @change="changeAirportFloor"/>
      </van-dropdown-menu>
      <ul class="stores-c">
        <van-list
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          @load="loadMore">
          <li
            v-for="(item, index) in storeList"
            :key="index"
            class="item">
            <div class="top">
              <div class="left">
                <img :src="item.storePictureUrl" alt="" class="prod-img">
              </div>
              <div class="center">
                <p class="prod-name">{{ item.storeName }}</p>
                <p class="business-hours">时间：{{`${item.openingTime.slice(0,5)}-${item.closingTime.slice(0,5)}`}}</p>
                <p class="prod-address">{{item.addressFull}}</p>
              </div>
              <div class="right" @click="goToMap(item)">
                <img src="../userimgs/banner.png" alt="" class="icon-nav">
                <span class="prod-distance">{{ $util.toDecimal2(item.distance / 1000) }}km</span>
              </div>
            </div>
            <div class="line"></div>
            <div class="bottom">
              <!--<van-button round plain color="#F02C2D" type="info" @click="storeDetail(item)">详情</van-button>-->
              <van-button round plain color="#F02C2D" type="info" @click="useBenefits(item)" class="use">使用权益</van-button>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
    <!-- 机场选择弹窗 -->
    <van-popup
      class="airport-modal"
      v-model="isShowAirportModal"
      position="right">
      <van-tabs
        color="#C9A063"
        title-active-color="#C9A063"
        class="reset-tabs"
        :border="false"
        @change="changeArea">
        <van-tab :name="1" title="境内"></van-tab>
        <van-tab :name="2" title="境外/港澳台"></van-tab>
      </van-tabs>
      <div class="local-airport" @click="choseLocationAirport">
        <img src="../../../assets/images/location.png" alt="" class="icon-location">
        <span class="text">{{ locationAirport.airportName }}<i class="tip">(距您定位最近)</i></span>
      </div>
      <div class="index-bar-container">
        <van-index-bar v-if="JSON.stringify(airpostList) !== '{}'">
          <div v-for="(value, key) in airpostList" :key="key">
            <van-index-anchor :index="key" />
            <van-cell
              :title="item.airportName"
              v-for="(item, index) in value"
              :key="index"
              @click="selectAirport(item)"/>
          </div>
        </van-index-bar>
        <p class="no-result-message" v-else>暂无数据~</p>
      </div>
    </van-popup>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
  </div>
</template>
<script>
  import { DropdownMenu, DropdownItem } from 'vant';
  export default {
    name: "selectStore",
    components: {
      CheckPaidMember: () => import('../../check-paid-member/check-paid-member'),
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
    },
    data() {
      return {
        storeList: [],
        shopType: 1,
        isLoading: true,
        finished: false,
        isShowAirportModal: false,
        airportSelection: {
          airportName: '请选择机场'
        },
        airpostList: {},
        locationAirport: {
          airportName: '暂时无法定位到您的位置'
        },
        tempSaveAirport: null,
        // 航站楼数据
        selectAirportFloor: {
          text: '航站楼'
        },
        airportFloor: [
          { text: '全部', value: -1 },
        ],
        pageInfo: {
          page: 0,
          rows: 10
        },
        tabType: 1,
      }
    },
    mounted() {
      this.getAirportList()
    },
    methods: {
      // 获取机场列表数据
      getAirportList(areaType = 1) {
        this.$STLoading.open();
        this.$http.post('/app/json/app_airport_manage/queryAirportInfoHasLetter', {
          areaType
        }).then(res => {
          let data = res.data;
          this.$STLoading.close();
          if (data.status == 0) {
            if (data.data instanceof Array && data.data.length != 0) {
              // 设置索引机场列表数据
              data.data.forEach(item => {
                this.airpostList[item.letter] = item.airportInfoList;
              })
              // 地址栏中包含机场信息
              if (this.$route.query.airportId && this.$route.query.airportLetter) {
                for (let value in this.airpostList) {
                  if (value == this.$route.query.airportLetter) {
                    this.airportSelection = this.airpostList[value].find(item => {
                      return item.id == this.$route.query.airportId;
                    })
                  }
                }
                this.loadMore()
                this.getLocationAirport(true)
              } else { // 地址栏中无机场信息
                this.getLocationAirport()
              }
            }
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(`queryAirportInfoHasLetter err ${err}`);
          this.$STLoading.close();
        })
      },
      // 根据经纬度获取附近机场
      getLocationAirport(isDisableGetMore) {
        this.$Loading.open()
        this.$http.post('/app/json/app_airport_manage/queryAirportInfoClosest', {
          areaType: this.tabType
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data) { // 获取最近机场成功
              this.locationAirport = data.data
              JSON.parse(data.data.terminalJson).forEach(item => {
                this.airportFloor.push({
                  text: item.terminalName,
                  value: item.id
                });
              });
              if (!isDisableGetMore) {
                this.airportSelection = data.data || {}
                this.loadMore()
              }
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`queryAirportInfoClosest err ${err}`)
        })
      },
      // 选择机场
      selectAirport(item) {
        this.airportSelection = item;
        this.selectAirportFloor = {
          text: '航站楼'
        };
        this.airportFloor = [
          { text: '全部', value: -1 },
        ];
        // 设置默认航站楼
        JSON.parse(item.terminalJson).forEach(item => {
          this.airportFloor.push({
            text: item.terminalName,
            value: item.id
          });
        });
        this.isShowAirportModal = false;

        this.pageInfo = {
          page: 0,
          rows: 10
        }
        this.storeList = [];
        this.isLoading = true
        this.finished = false
        this.loadMore();
      },
      // 更改航站楼
      changeAirportFloor(value) {
        let result = this.airportFloor.find(item => {
          return item.value == value;
        })
        this.selectAirportFloor = result

        this.pageInfo = {
          page: 0,
          rows: 10
        }
        this.storeList = [];
        this.isLoading = true
        this.finished = false
        this.loadMore();
      },
      // 定位机场点击
      choseLocationAirport() {
        this.airportSelection = this.locationAirport
        this.selectAirportFloor = {
          text: '航站楼'
        }
        this.airportFloor = [
          { text: '全部', value: -1 }
        ]
        // 设置默认航站楼
        JSON.parse(this.locationAirport.terminalJson).forEach(item => {
          this.airportFloor.push({
            text: item.terminalName,
            value: item.id
          });
        });
        this.isShowAirportModal = false;

        this.pageInfo = {
          page: 0,
          rows: 10
        }
        this.storeList = [];
        this.isLoading = true
        this.finished = false
        this.loadMore();
      },
      // 更改境内/境外
      changeArea(name, title) {
        this.tabType = name
        this.airpostList = {}
        this.getLocationAirport(true)
        this.getAirportList(name)
      },
      failHandler() {
        this.$router.go(-1)
      },
      // 去导航
      goToMap(item) {
        this.$bridgefunc.baiduNav(
          {
            startlong: this.$store.state.currentLocation.posx,
            startlat: this.$store.state.currentLocation.posy,
            endlong: item.posx,
            endlat: item.posy,
            type: "nav"
          }
        );
      },
      loadMore() {
        this.isLoading = true;
        this.pageInfo.page++;
        this.$Loading.open();
        this.$http.post('/app/json/equity_card/queryStore', {
          id: this.$route.query.equityId,
          shopType: this.shopType,
          airportCode: this.airportSelection.id,
          terminalCode: this.selectAirportFloor.value == -1 ? '' : this.selectAirportFloor.value,
          ...this.pageInfo
        }).then(res => {
          this.isLoading = false;
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.storeList.push(...data.data);
              if (this.storeList.length >= data.totalRecords) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.$Toast(data.info);
            this.finished = true;
          }
          this.$Loading.close();
        }).catch(err => {
          this.finished = true;
          this.$Toast(err);
          this.$Loading.close();
        })
      },
      storeDetail(item) {
        this.$router.push({
          path: '/benefits/storeDetail',
          query: {
            id: item.id
          }
        })
      },
      useBenefits(item) {
        this.$Loading.open()
        let params = {
          equityMemberId: this.$route.query.id,
          mchCode: item.mchCode
        }
        this.$http.post("/app/json/app_equity_card/equityCodeInfo", params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.useCode(res.data.data, item.mchCode)
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Loading.close()
          this.$Toast(err)
        })
      },
      useCode(item, mchCode){
        this.$router.push({
          path: '/benefits/benefitsCode',
          query: {
           item: JSON.stringify(item),
           mchCode
          }
        })
      }
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
  .store {
    display flex;
    flex-direction column;

  }
  .reset-dropdown {
    bdr-b();
    display flex;
    /deep/ .van-dropdown-menu__bar {
      box-shadow none;
      flex 1
    }
  }
  .airport-chose {
    flex 1;
    align-items: center;
    order -1;
    line-height 50px;
    text-align center;
    color: #323233;
    font-size 15px;
    position relative
    padding 0 8px;
    ellipse();
    .text {
      padding 0 10px;
    }
    &::after {
      position: absolute;
      top: 50%;
      margin-top: -4px;
      border: 3px solid;
      border-color: transparent transparent currentColor currentColor;
      transform: rotate(-45deg);
      opacity: .8;
      content: '';
    }
  }
  .airport-modal {
    width 100%;
    height 100%;
    overflow-y auto;
    .reset-tabs {
      z-index 2;
    }
    .local-airport {
      height 45px;
      display flex;
      align-items center;
      padding 0 15px;
      font-size 14px;
      .icon-location {
        display block;
        width 20px;
        height 20px;
      }
      .text {
        padding-left 5px;
        ellipse();
        .tip {
          font-size 10px;
          color #716f6f;
          font-style normal
          padding-left 5px;
        }
      }
    }
    .index-bar-container {
      position absolute
      left 0;
      right 0
      top 100px;
      bottom 0;
      overflow-y auto;
    }
  }
  /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border none
  }

  .stores-c {
    flex 1;
    margin-top 10px
    overflow-y auto;
    padding-top 5px;

    .item {
      border-radius 5px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 1);
      margin 20px

      &:first-child {
        margin-top 0
      }

      .top {
        display flex;
        align-items center;
        padding 10px
      }

      .left {
        .prod-img {
          display block;
          width 75px;
          height 75px;
          // border 1px dashed #ddd;
          border-radius 4px;
        }
      }

      .center {
        flex 1;
        padding 0 10px;
        display flex;
        flex-direction column;
        justify-content space-around;

        .prod-name {
          font-size 15px;
          font-weight 500;
          line-height 18px;
          ellipse-2();
        }

        .prod-address {
          font-size 13px;
          font-weight 400;
          color #9FA0A0;
          line-height 16px;
          margin-top 7px;
        }

        .business-hours {
          font-size 13px;
          font-weight 400;
          color #9FA0A0;
          margin-top 7px;
        }
      }

      .right {
        extend-click();

        .icon-nav {
          display block;
          width 20px;
          height 20px;
          margin 0 auto;
        }

        .prod-distance {
          display block;
          font-size 13px;
          color #9FA0A0;
          margin-top 8px;
        }
      }

      .van-button {
        width: 80px
        height 30px
        line-height: 20px;
        margin-left 10px

        .van-button__text {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: rgba(240, 44, 45, 1);
          line-height: 20px;
        }
      }

      .bottom {
        padding 10px 10px
        display flex
        justify-content flex-end

      }

      .line {
        display block
        height: 1px;
        background: rgba(220, 221, 221, 1);
        margin 0 10px
      }
    }
  }
  .use {
    width 90px!important
  }

</style>
