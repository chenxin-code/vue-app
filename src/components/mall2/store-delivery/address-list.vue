/**Created by liaoyingchao on 2020-03-12.*/

<template>
  <div class="mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="address-list" v-if="type == '1'">
        <div class="search-div">
          <div class="input-div">
            <i class="iconfont mall-sousuo theme_font_tint"></i>
            <form class="search-form" action="">
              <input style="display: none" type="text" name="keyword"/>
              <input class="search-input" type="search" placeholder="输入城市、小区、写字楼、学校" v-model="searchKey"
                     @keyup.enter="toSearchEvent" @focus="showSearchBtn = true">
            </form>
          </div>
          <div class="btn-div" v-show="showSearchBtn" @click="showSearchBtn = false">取消</div>
        </div>
        <div class="store-list" v-if="businessType == '1' && storeList.length > 0">
          <div class="title">配送至：{{currentLocation.area}}</div>
          <div class="list-content">
            <div class="item" :class="{'selected': item.storeCode == selectedStore.storeCode}" v-for="(item, idx) in imgStoreList" :key="idx" @click="selectStore(item)">
              <div class="tag" v-if="item.storeCode == selectedStore.storeCode">当前</div>
              <div class="store-img">
                <img :src="item.storePictureUrl || $store.state.globalConfig.logoUrl">
              </div>
              <div class="store-title single-line">{{item.storeName}}</div>
            </div>
            <div class="more" @click="showStoreList = true">
              <span>共{{storeList.length}}个门店</span>
              <i class="iconfont mall-gengduojiantou"></i>
            </div>
          </div>
        </div>
        <div class="my-location line_bottom">
          <div class="title">我当前的位置</div>
          <div class="location single-line">
            <div class="loc-adr" @click="selectAddress(location)">
              <i class="iconfont mall-dingwei"></i>
              <span class="single-line">{{location.area}}</span>
            </div>
            <div class="btn" @click="getLoaction">重新定位</div>
          </div>
        </div>
        <div class="list">
          <div class="title">我的收货地址</div>
          <div>
            <div class="item line_bottom" v-for="(item, idx) in listData">
              <mt-cell-swipe :right="[{
              content: '删除',
              style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
              handler: () => _deleteAddress(item, idx)
              }]" class="my-cell-swipe">

                <div slot="title" style="width: 100%;display: flex;align-items: center">
                  <div style="flex: 1" @click="selectAddress(item)">
                    <div class="realName">
                      {{item.area}}
                    </div>
                    <p class="address">
                      <span>{{item.receiverName}}</span>
                      <span>{{item.mobile}}</span>
                    </p>
                  </div>
                  <div class="address-edit">
                    <div class="edit" @click.stop="editAddress(item)">
                      <i class="iconfont mall-bianji theme_font_gray"></i>
                    </div>
                  </div>
                </div>
              </mt-cell-swipe>
            </div>
          </div>
          <div class="no-address" v-if="loaded && listData.length == 0">暂无收货地址！</div>
        </div>
        <div class="bottom-btn theme_bg_red" @click="addAddressEvent"><p>新建收货地址</p></div>
        <div class="search-list" v-show="showSearchBtn">
          <div class="item line_bottom" v-for="item in dataList" @click.stop="selectSearchAddress(item)">
            <div class="name">{{item.name}}</div>
            <div class="address">{{item.province + item.city + item.district}}</div>
          </div>
        </div>
      </div>
      <div class="address-list" v-else-if="type == '2'">
        <div class="list">
          <div>
            <div class="item line_bottom" v-for="(item, idx) in canUseList">
              <mt-cell-swipe :right="[{
              content: '删除',
              style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
              handler: () => _deleteAddress(item, idx)
              }]" class="my-cell-swipe">

                <div slot="title" style="width: 100%;display: flex;align-items: center">
                  <div style="flex: 1" @click="selectAddress(item)">
                    <div class="realName">
                      {{item.area}}
                    </div>
                    <p class="address">
                      <span>{{item.receiverName}}</span>
                      <span>{{item.mobile}}</span>
                    </p>
                  </div>
                  <div class="address-edit">
                    <div class="edit" @click.stop="editAddress(item)">
                      <i class="iconfont mall-bianji theme_font_gray"></i>
                    </div>
                  </div>
                </div>
              </mt-cell-swipe>
            </div>
            <div class="no-address" v-if="loaded && canUseList.length == 0">暂无可用收货地址！</div>
          </div>
          <div class="cannot-use" v-if="canNotUseList.length > 0">
            <div class="title">*以下地址超出配送范围</div>
            <div class="item line_bottom" v-for="(item, idx) in canNotUseList">
              <mt-cell-swipe :right="[{
              content: '删除',
              style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
              handler: () => _deleteAddress(item, idx)
              }]" class="my-cell-swipe">

                <div slot="title" style="width: 100%;display: flex;align-items: center">
                  <div style="flex: 1">
                    <div class="realName">
                      {{item.area}}
                    </div>
                    <p class="address">
                      <span>{{item.receiverName}}</span>
                      <span>{{item.mobile}}</span>
                    </p>
                  </div>
                  <div class="address-edit">
                    <div class="edit" @click.stop="editAddress(item)">
                      <i class="iconfont mall-bianji theme_font_gray"></i>
                    </div>
                  </div>
                </div>
              </mt-cell-swipe>
            </div>
          </div>
        </div>
        <div class="bottom-btn theme_bg_red" @click="addAddressEvent"><p>新建收货地址</p></div>
        <div class="search-list" v-show="showSearchBtn">
          <div class="item line_bottom" v-for="item in dataList" @click.stop="selectSearchAddress(item)">
            <div class="name">{{item.name}}</div>
            <div class="address">{{item.province + item.city + item.district}}</div>
          </div>
        </div>
      </div>
    </nav-content>
    <pop-view v-if="showStoreList" @closeEvent="showStoreList = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">店铺列表</div>
        <div class="pop-scroll-div">
          <div class="store-row line_bottom" v-for="item in storeList" @click="selectStore(item)">
            <div class="store-img">
              <img :src="item.storePictureUrl || $store.state.globalConfig.logoUrl">
            </div>
            <div class="store-info">
              <div class="store-title single-line">{{item.storeName}}</div>
              <div class="store-address single-line">{{item.addressFull}}</div>
            </div>
            <div class="select-div">
              <i class="iconfont mall-xuanzhong theme_font_red" v-if="item.storeCode == selectedStore.storeCode"></i>
              <i class="iconfont mall-weixuanzhong theme_font_gray" v-else></i>
            </div>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import jsonp from 'jsonp'
  import Config from '@/api/config'

  export default {
    name: "address-list",
    components: {},
    data() {
      return {
        searchKey: '',
        showSearchBtn: false,
        listData: [],
        loaded: true,
        location: {},
        storeOuCode: '',
        dataList: [],
        canUseList: [],
        canNotUseList: [],
        type: '',
        businessType: '0', // 0 蜂鸟配送业务； 1 油惠通抢单配送
        storeList: [],
        imgStoreList: [],
        currentLocation: {},
        selectedStore: {},
        showStoreList: false,
      }
    },
    watch: {
      searchKey(curVal, oldVal) {
        this.queryLocation(curVal)
      }
    },
    methods: {
      selectStore: function (item) {
        this.selectedStore = item
        this.currentLocation.selectedStore = this.selectedStore
        localStorage.setItem('Address_List_Seleted', JSON.stringify(this.currentLocation))
        this.$router.go(-1)
      },
      selectSearchAddress: function (location) {
        let locationinfo = {
          province: location.province,
          city: location.city,
          district: location.district,
          longitude: location.location.lng,
          latitude: location.location.lat,
          address: location.address + location.name,
          name: location.name
        }
        if (location.city == location.province) {
          locationinfo.city = location.district
          locationinfo.district = ''
        }
        this.$mallCommon.pureLocationAnalysis((address) => {
          let location = address
          if (this.businessType == '1') {
            this.showSearchBtn = false
            this.currentLocation = location
            this.getStoreListData()
          } else {
            localStorage.setItem('Address_List_Seleted', JSON.stringify(location))
            this.$router.go(-1)
          }
        }, locationinfo);
      },
      queryLocation(curVal) {
        if (curVal) {
          let region = this.$store.state.indexData.province || 131
          let url = 'https://api.map.baidu.com/place/v2/suggestion?query=' + curVal + '&region=' + region + '&output=json&ak=' + Config.mapak;
          jsonp(url, null, (err, data) => {
            if (err) {
              console.error(err.message)
            } else {
              this.dataList = data.result
            }
          })
        } else {
          this.dataList = []
        }
      },
      selectAddress: function (item) {
        if (this.businessType == '1') {
          this.currentLocation = item
          this.getStoreListData()
        } else {
          localStorage.setItem('Address_List_Seleted', JSON.stringify(item))
          this.$router.go(-1)
        }
      },
      _deleteAddress: function (item, idx) {
        this.$Loading.open();
        let url = '/app/json/user_address/deleteUserAddress';
        let paramsData = {
          id: item.id
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('删除成功！');
              this.getListData();
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      editAddress: function (item) {
        this.$router.push({
          path: '/mall2/store-delivery/address-edit',
          query: {
            pageType: '1',
            address: JSON.stringify(item)
          }
        })
      },
      addAddressEvent: function () {
        this.$router.push({
          path: '/mall2/store-delivery/address-edit'
        })
      },
      toSearchEvent: function () {

      },
      getListData: function () {
        this.$Loading.open();
        let url = '/app/json/user_address/getStoreDeliveryUserAddress';
        let paramsData = {
          addresType: '3',
          storeOuCode: this.storeOuCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let arr = data.data;
              if (this.type == 2) {
                let arr1 = []
                let arr2 = []
                for (let i = 0; i < arr.length; i++) {
                  let item = arr[i]
                  if (item.isWithinDelivery == 1) {
                    arr1.push(item)
                  } else {
                    arr2.push(item)
                  }
                }
                this.canUseList = arr1
                this.canNotUseList = arr2
              } else {
                this.listData = arr
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getStoreListData: function () {
        this.$Loading.open();
        let url = '/app/json/store/getNearDistanceStoreList';
        let paramsData = {
          posx: this.currentLocation.posx,
          posy: this.currentLocation.posy,
          page: 1,
          rows: 20
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let arr = data.data;
              this.storeList = arr;
              this.imgStoreList = []
              for (let i = 0; i < arr.length && i < 3; i++) {
                this.imgStoreList.push(arr[i])
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getLoaction: function () {
        this.$bridgefunc.getLocation((locationinfo) => {
          this.$mallCommon.nearAddress((address) => {
            console.log(address)
            this.location = address
            if (this.businessType == '1') {
              this.currentLocation = address
              this.getStoreListData()
            }
          }, locationinfo);
        })
      }
    },
    created() {
      this.type = this.$route.query.type || '1'
      this.businessType = this.$route.query.businessType || '0'
      this.storeOuCode = this.$route.query.storeOuCode || ''
      this.selectedStore = {
        storeCode: this.$route.query.storeCode || '',
        storeName: this.$route.query.storeName || ''
      }
      sessionStorage.removeItem('Address_Map_Seleted')
      this.getLoaction()
      this.getListData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">

  .store-row {
    padding 5px 0;
    display flex;
    align-items center;
    .store-img {
      img {
        display block;
        width 60px;
        height 60px;
      }
    }
    .store-info {
      overflow hidden;
      flex 1;
      padding 0 8px;
      .store-title {
        font-size 14px;
      }
      .store-address {
        margin-top 10px;
        line-height 16px;
        font-size 12px;
        color #999;
      }
    }

    .select-div {
      padding 10px;
      i {
        font-size 20px;
      }
    }
  }

  .address-list {
    width 100%
    height 100%
    overflow hidden
    display flex;
    flex-direction column;
    position relative;

    .search-list {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      top 35px;
      z-index 99;
      background-color white;
      overflow-y auto;

      .item {
        padding 10px;

        .title {
          font-size 14px;
        }

        .address {
          padding-top 8px;
          font-size 12px;
          color #999;
        }
      }
    }

    .search-div {
      margin 5px 10px;
      display flex;
      align-items center;

      .input-div {
        flex 1;
        padding 0 15px;
        border-radius 18px;
        height 32px;
        display flex;
        align-items center;
        background-color #efefef;

        .mall-sousuo {
          font-size 18px;
          padding-right 8px;
        }

        .search-form {
          flex 1;
          height 100%;
          background-color transparent;
        }

        .search-input {
          width 100%;
          height 100%;
          background-color transparent;
        }
      }

      .btn-div {
        padding 6px 10px;
        font-size 14px;
        color #999;

        &.can {
          color blue;
        }
      }
    }

    .store-list {
      padding 10px;
      overflow hidden;

      .title {
        padding 10px 0;
        font-size 15px;
        font-weight 600;
      }

      .list-content {
        display flex;
        align-items center;

        .item {
          position relative;
          margin 5px;
          text-align center;

          &.selected {

            .store-img:before {
              content: "";
              position: absolute;
              top: -50%;
              bottom: -50%;
              left: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              border: solid 1px #F80F16;
              border-radius: 60px;
              box-sizing: border-box;
            }

            .store-title {
              color #F80F16;
            }
          }

          .tag {
            position absolute;
            right 0;
            top -4px;
            z-index 1;
            background-color #F80F16;
            color white;
            font-size 8px;
            padding 2px 6px;
            border-radius 10px;
          }

          .store-img {
            margin 0 auto;
            position relative;
            overflow hidden;
            width 50px;
            height 50px;
            border-radius 30px;
            font-size 0;

            img {
              width 50px;
              height 50px;
            }
          }

          .store-title {
            width 70px;
            margin-top 8px;
            font-size 14px;
          }
        }

        .more {
          padding 15px 0;
          flex 1;
          text-align right;
          font-size 14px;

          i {
            font-size 14px;
          }
        }
      }
    }

    .my-location {
      margin 15px 10px 0px;

      .title {
        font-size 15px;
        font-weight 600;
      }

      .location {
        padding 10px 0 6px;
        display flex;
        align-items center;

        .loc-adr {
          flex 1;
          padding 5px;
          display flex;
          align-items center;
        }

        i {
          font-size 16px;
          color #999;
        }

        span {
          padding 0 3px;
          flex 1;
          font-size 14px;
          color #1a1a1a;
        }

        .btn {
          padding 8px 0px 8px 10px;
          font-size 14px;
          color #F80F16;
        }
      }
    }

    .list {
      flex 1;
      padding 10px;
      overflow-y auto;

      .title {
        padding 10px 0;
        font-size 15px;
        font-weight 600;
      }

      .cannot-use {
        .title {
          padding 15px 0 5px;
        }

        .realName {
          color #999;
        }
      }

      .item {
        padding 1px 0;

        >>> .mint-cell-wrapper {
          padding 0;

          .realName {
            font-size 14px;
            font-weight 600;
            padding 12px 0 8px;
          }

          .address {
            padding-bottom 10px;

            span {
              font-size 12px;
              color #999;
              padding-right 10px;
            }
          }
        }
      }

      .no-address {
        text-align center;
        padding 20px;
        color #999;
      }
    }

    .bottom-btn {
      height 50px;
      display flex
      align-items center
      text-align: center;

      p {
        width 100%
        color: white;
        font-weight 600
        font-size 18px
      }
    }
  }
</style>
