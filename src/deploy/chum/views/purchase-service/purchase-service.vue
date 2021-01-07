<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" v-if="hasNavTop"></nav-top>
    <nav-content class="container" :style="{top: computedTop() + 'px'}">
      <van-dropdown-menu active-color="#C9A063" class="reset-dropdown">
        <div class="airport-chose" @click.capture="isShowAirportModal = true">{{ airportSelection.airportName }}</div>
        <van-dropdown-item
          :title="selectAirportFloor.text"
          :options="airportFloor"
          @change="changeAirportFloor"/>
        <van-dropdown-item
          v-model="selectService"
          :options="airportService"
          @change="changeAirportService"/>
      </van-dropdown-menu>
      <div class="service-list" ref="serviceList">
        <van-list
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          @load="loadMore">
          <ul class="service-c" v-if="serviceList.length !== 0">
            <li
              v-for="(item, index) in serviceList"
              :key="index"
              class="item"
              @click="serviceClick(item)">
              <div class="top-img" :style="{'background-image': 'url('+ item.mainUrl +')'}"></div>
              <div class="btm-prod">
                <p class="prod-name">{{ item.skuName }}</p>
                <div class="price-c">
                  <span class="current-price">￥{{ dealWithPrice(item.salePrice)[2] }}</span>
                  <span class="old-price" v-if="item.salePrice != item.price">￥{{ dealWithPrice(item.price)[2] }}</span>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </div>
    </nav-content>
    <!-- 机场选择弹窗 -->
    <van-popup
      class="airport-modal"
      v-model="isShowAirportModal"
      position="right">
      <van-tabs
        :border="false"
        color="#C9A063"
        title-active-color="#C9A063"
        class="reset-tabs"
        @change="changeArea">
        <van-tab :name="1" title="境内"></van-tab>
        <van-tab :name="2" title="境外/港澳台"></van-tab>
      </van-tabs>
      <div class="local-airport" @click="choseLocationAirport">
        <img src="../../assets/images/location.png" alt="" class="icon-location">
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
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from 'vant';
import scroll from "@/components/base/scroll/scroll";
import utils from '../../assets/utils/tools'
import cookie from 'js-cookie'

export default {
  mixins: [utils],
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    scroll
  },
  data() {
    return {
      tabType: 1,
      hasNavTop: false,
      // 机场数据
      isShowAirportModal: false,
      airportSelection: {
        airportName: '请选择机场'
      },
      airpostList: {},
      locationAirport: {
        airportName: '暂时无法定位到您的位置'
      },
      // 航站楼数据
      selectAirportFloor: {
        text: '航站楼'
      },
      airportFloor: [
        { text: '全部', value: -1 },
      ],
      // 服务列表数据
      selectService: -1,
      airportService: [
        { text: '全部服务', value: -1 },
      ],

      // 服务券数据
      isLoading: true,
      finished: false,
      serviceList: [],
      pageInfo: {
        page: 0,
        rows: 10
      },

      scrollPosition: 0
    }
  },
  activated() {
    this.$refs.serviceList.scrollTop = this.scrollPosition
  },
  mounted() {
    // 地址栏中包含服务信息
    if (this.$route.query.serviceCategoryCode) {
      this.selectService = String(this.$route.query.serviceCategoryCode)
    }
    this.getAirportList()
    this.initServiceList()
    if (this.$route.query.hasNavTop == 1) {
      this.hasNavTop = true;
    }

    this.$nextTick(() => {
      this.$refs.serviceList.addEventListener('scroll', (e) => {
        this.scrollPosition = this.$refs.serviceList.scrollTop
      })
    })
  },
  computed: {
    isNativeTop() {
      return cookie.get('isnativetop') != 1
    },
    top() {
      return this.isNativeTop ? this.$store.state.barHeight+this.$market.getNavHeight() : 0
    }
  },
  methods: {
    computedTop() {
      if (this.hasNavTop) {
        return this.top;
      } else {
        return 0
      }
    },
    // 获取机场列表数据
    getAirportList(areaType = 1) {
      this.$STLoading.open()
      this.$http.post('/app/json/app_airport_manage/queryAirportInfoHasLetter', {
        areaType
      }).then(res => {
        this.$STLoading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array && data.data.length != 0) {
            // 设置索引机场列表数据
            data.data.forEach(item => {
              this.airpostList[item.letter] = item.airportInfoList
            })
            // 地址栏中包含机场信息
            if (this.$route.query.airportId && this.$route.query.airportLetter) {
              for (let value in this.airpostList) {
                if (value == this.$route.query.airportLetter) {
                  this.airportSelection = this.airpostList[value].find(item => {
                    return item.id == this.$route.query.airportId
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
    // 定位机场点击
    choseLocationAirport() {
      this.airportSelection = this.locationAirport
      this.selectAirportFloor = {
        text: '航站楼'
      };
      this.airportFloor = [
        { text: '全部', value: -1 },
      ];
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
      this.serviceList = [];
      this.isLoading = true
      this.finished = false
      this.loadMore();
    },
    // 获取服务列表
    initServiceList() {
      this.$STLoading.open();
      this.$http.post('/app/json/app_dict/getDictByAlias', {
        alias: 'ServiceCategory'
      }).then(res => {
        let data = res.data;
        this.$STLoading.close();
        if (data.status == 0) {
          if (data.data instanceof Array) {
            data.data.forEach(item => {
              this.airportService.push({
                text: item.dictValue,
                value: item.dictKey                
              });
            });
          }
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`getDictByAlias err ${err}`);
        this.$STLoading.close();
      })
    },
    // 更改航站楼
    changeAirportFloor(value) {
      let result = this.airportFloor.find(item => {
        return item.value == value;
      })
      this.selectAirportFloor = result;
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.serviceList = [];
      this.isLoading = true
      this.finished = false
      this.loadMore();
    },
    // 更改境内/境外
    changeArea(name, title) {
      this.airpostList = {}
      this.tabType = name
      this.getLocationAirport(true)
      this.getAirportList(name)
    },
    // 选择机场
    selectAirport(item) {
      this.airportSelection = item
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
      this.serviceList = [];
      this.isLoading = true
      this.finished = false
      this.loadMore();
    },
    // 更改服务
    changeAirportService(value) {
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.serviceList = [];
      this.isLoading = true
      this.finished = false
      this.loadMore();
    },
    // 获取服务券列表
    loadMore() {
      // 设置默认航站楼
      if (this.airportSelection.terminalJson) {
        this.airportFloor = [
          { text: '全部', value: -1 },
        ]
        JSON.parse(this.airportSelection.terminalJson).forEach(item => {
          this.airportFloor.push({
            text: item.terminalName,
            value: item.id
          })
        })
      }

      this.isLoading = true;
      this.pageInfo.page++;
      this.$STLoading.open();
      this.$http.post('/app/json/app_cou_service/queryCouServicePro', {
        airportCode: this.airportSelection.id,
        terminalCode: this.selectAirportFloor.value == -1 ? '' : this.selectAirportFloor.value,
        serviceCategory: this.selectService == -1 ? '' : this.selectService,
        ...this.pageInfo
      }).then(res => {
        this.isLoading = false;
        this.$STLoading.close();
        let data = res.data;
        if (data.status == 0) {
          if (data.data instanceof Array) {
            this.serviceList.push(...data.data);
            if (this.serviceList.length >= data.totalRecords) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`queryCouServicePro err ${err}`);
        this.$STLoading.close();
      })
    },
    // 服务点击
    serviceClick(item) {
      this.$router.push({
        path: '/service_detail',
        query: {
          skuId: item.skuId,
          price: item.price,
          salePrice: item.salePrice,
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != '/service_detail') {
      this.$keepaliveHelper.deleteCache(this)
    }
    next()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.reset-dropdown {
  bdr-b();
  display flex;
  /deep/ .van-dropdown-menu__bar {
    box-shadow none;
    flex 2
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
  &::after {
    position: absolute;
    top: 50%;
    right: 4px;
    margin-top: -4px;
    border: 3px solid;
    border-color: transparent transparent #dcdee0 #dcdee0;
    transform: rotate(-45deg);
    opacity: .8;
    content: '';
  }
}
.service-list {
  position absolute;
  left 0
  right 0
  top 55px;
  bottom 0;
  padding 0 10px;
  height auto;
  overflow-y: auto;
  // /deep/ .scroll-content {
  //   padding-top: 5px;
  // }
  .service-c {
    overflow hidden;
    .item {
      border-radius 5px;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
      overflow hidden;
      margin-top 10px;
      &:first-child {
        margin-top 0;
      }
      .top-img {
        height 110px;
        overflow hidden;
        background-size cover;
        background-position: center;
      }
      .btm-prod {
        padding 12px 10px;
        .prod-name {
          font-size 15px;
          font-weight 500;
          line-height 18px;
          ellipse-2()
        }
        .price-c {
          margin-top 10px;
          .current-price {
            font-size 16px;
            font-weight 700;
            color $color-theme-r;
          }
          .old-price {
            padding-left 10px;
            font-size 13px;
            color #999;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
.airport-modal {
  width 100%;
  height 100%;
  overflow-y auto;
  .reset-tabs {
    z-index 2;
    /deep/ .van-tabs__wrap::after {
      display none;
    }
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
    top 95px;
    bottom 0;
    overflow-y auto;
  }
}
</style>