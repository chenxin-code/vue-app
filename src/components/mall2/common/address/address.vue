<template>
  <div class="mall2 bottom" v-if="visible">
    <pop-view @closeEvent="visible = false">
      <div class="pop-body">
        <div class="back-div" @click="addressBack" v-if="otherAddress && myList.length > 0">
          <i class="iconfont mall-fanhui theme_font_tint"></i>
        </div>
        <div class="pop-title theme_font_common">配送至</div>
        <transition name="transition1">
          <div class="address-pop-body theme_bg_white" v-show="otherAddress == false">
            <div class="pop-scroll-div">
              <div class="address-row" v-for="item in myList" @click="selectedAddress(item)">
                <div class="icon-div">
                  <i class="iconfont mall-dingwei theme_font_common"
                     :class="{theme_font_red_i: item.id == initData.selectedId}"></i>
                </div>
                <div class="right-div">
                  <div class="text theme_font_common" :class="{theme_font_red_i: item.id == initData.selectedId}">
                    {{item.addressFull}}
                  </div>
                  <div class="gou-div">
                    <i class="iconfont mall-gou1 theme_font_red" v-if="item.id == initData.selectedId"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-btn theme_font_white theme_bg_red" @click="toOtherAddress">
              选择其他地址
            </div>
          </div>
        </transition>
        <transition name="transition2">
          <div class="address-pop-body select-content theme_bg_white" v-show="otherAddress">
            <div class="selected-item font-medium">
              <div class="item-div" v-for="(item, idx) in selectedItems" @click="reSelect(idx)">
                <div class="item-text">{{item.name}}</div>
              </div>
              <div class="item-div">
                <div class="item-text item-selected theme_font_red">请选择</div>
              </div>
            </div>
            <div class="options-div">
              <div class="option" v-for="(item, idx) in cusOptions" @click="selectOption(item, idx)">{{item.name}}</div>
            </div>
          </div>
        </transition>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: 'search',
    components: {},
    data() {
      return {
        initData: {
          selectedId: '',
          token: '',
          addressies: []
        },
        visible: false,
        addressEvent: null,
        otherAddressEvent: null,
        myList: [],
        otherAddress: false,
        selectedIndexs: [],
        selectedItems: [],
        dataCache: [],
        cusOptions: [],
        cusIndex: 0
      }
    },
    methods: {
      // 区域选择
      reSelect: function (index) {
        let num = this.selectedItems.length - index
        this.selectedItems.splice(index, num)
        this.selectedIndexs.splice(index, num)
        let arr = this.dataCache[index]
        this.dataCache.splice((index + 1), num);
        this.cusOptions = arr;
      },
      selectOption: function (item, index) {
        this.cusIndex = index;
        this.selectedItems.push(item)
        this.selectedIndexs.push(index)
        this.cusOptions = [];
        let selectedValue = {
          item: item,
          selecteds: this.selectedItems
        }
        console.log(selectedValue)
        // this.$emit('selectedItemsEvent', selectedValue)
        // this.selectedItems = selectedValue.selecteds;
        if (this.selectedItems.length == 4) {
          // this.showSelect = false;
          // this.region = this.selectedItems;
          // this.getRegionText();
          this.areaSelected()
          return;
        }
        this._getRegionData(item.id)
      },
      _getRegionData: function (parentId) {
        this.$Loading.open()
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.initData.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length > 0) {
              this.pushCustomOptions(arr);
            } else {
              this.areaSelected()
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      areaSelected: function () {
        let str = ''
        let address = {
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          countryId: '',
          countryName: '',
          townId: '',
          townName: ''
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
          let item = this.selectedItems[i]
          str += item.name
          if (i == 0) {
            address.provinceId = item.id
            address.provinceName = item.name
          } else if (i == 1) {
            address.cityId = item.id
            address.cityName = item.name
          } else if (i == 2) {
            address.countryId = item.id
            address.countryName = item.name
          } else if (i == 3) {
            address.townId = item.id
            address.townName = item.name
          }
        }
        address.addressFull = address.provinceName + address.cityName + address.countryName + address.townName
        this.otherAddress = false
        this.reset()
        let tempItem = null;
        for(let j = 0; j < this.myList.length; j++){
          let item = this.myList[j];
          if(item.provinceId == address.provinceId && item.cityId == address.cityId){
            tempItem = item;
            break;
          }
        }
        this.addressEvent(address,tempItem);
      },
      pushCustomOptions: function (options) {
        if (this.selectedIndexs.length == 0) {
          this.selectedIndexs = []
          this.selectedItems = []
          this.dataCache = [];
          this.cusIndex = 0
        }
        this.dataCache.push(options)
        this.cusOptions = options
      },
      reset: function () {
        this.selectedIndexs = []
        this.selectedItems = []
        this.cusIndex = 0

        this.cusOptions = this.dataCache[0]
        this.dataCache = [];
        this.dataCache.push(this.cusOptions)
      },
      // 地址方式切换
      addressBack: function () {
        this.otherAddress = false
      },
      toOtherAddress: function () {
        this.otherAddress = true
        this.reset();
        this._getRegionData(0);
      },
      _setDefaultAddress: function (id) {
        let url = '/app/json/user_address/addDefaultAddress';
        let params1 = {
          token: this.initData.token,
          deliveryId: id
        }

        this.$http.post(url, params1).then(res => {
        }, error => {
        });
      },
      //地址选择
      _getAddressList: function () {//获取地址列表
        if (this.initData.token == '') {
          this.toOtherAddress()
          return ;
        }
        this.$Loading.open();
        let url = '/app/json/user_address/loadUserAddressList';
        let params1 = {
          userId: '',
          token: this.initData.token,
          addressType: '1'//1:快递地址2自提地址
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length) {
              this.myList = arr;
            } else {
              this.toOtherAddress()
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      selectedAddress: function (item) {
        this._setDefaultAddress(item.id)
        this.addressEvent(item)
      },
    },
    mounted() {
      this._getAddressList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden
    .address-pop-body {
      position absolute;
      left 0;
      right 0px;
      bottom 0px;
      top 42px;
      overflow hidden;
      display flex;
      flex-direction column;
    }
    .back-div {
      position absolute;
      left 8px;
      top 8px;
      padding 7px;
      z-index 99;
      i {
        font-size 15px;
      }
    }
    .address-row {
      padding 12px 0px;
      margin-left 8px;
      border-bottom 1px solid #ddd;
      .icon-div {
        float left;
        margin-top 2px;
        margin-right 5px;
        i {
          font-size 14px;
        }
      }
      .right-div {
        overflow hidden;
        display flex;
        align-items center;
        .text {
          flex 1;
          font-size 13px;
          line-height 16px;
        }
        .gou-div {
          width 30px;
          padding 0px 8px;
          i {
            font-size 16px;
          }
        }
      }
    }
    .select-content {
      padding 0 8px;

      .selected-item {
        height 32px;
        padding 0px 10px;
        border-bottom 1px solid $color-line-gray-l
        .item-div {
          display inline-block;
          padding 0px 10px;
          height 32px;
          .item-text {
            height 32px;
            line-height 32px;
          }
          .item-selected {
            border-bottom-width 2px
            border-bottom-style solid
          }
        }
      }
      .options-div {
        position absolute;
        top 32px;
        bottom 0px;
        left 0px;
        right 0px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .option {
          font-size $font-size-medium;
          padding 10px 18px;
        }
        .option:nth-child(1) {
          padding-top 20px;
        }
        .option:nth-last-child(1) {
          padding-bottom 20px;
        }
      }
    }

    .transition1-enter-active, .transition1-leave-active, .transition2-enter-active, .transition2-leave-active {
      transition: all .4s;
    }
    .transition1-enter, .transition1-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      transform: translate3d(-100%, 0, 0)
    }
    .transition2-enter, .transition2-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      transform: translate3d(100%, 0, 0)
    }
  }

</style>
