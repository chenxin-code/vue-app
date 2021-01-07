<template>
  <div>
    <div class="back-drop" v-show="isShowAddress"></div>
    <transition name="address-choose">
      <div class="address-choose" v-show="isShowAddress" ref="addressChoose">
        <div class="nav-bar-wrapper">
          <div class="nav-bar">
            <div class="nav-bar-item" v-for="(item, index) in navBarItems"
                 :key="index"
                 @click="navItem(item, index)">
              <span>{{item.name}}</span>
            </div>
            <div class="nav-bar-item active" v-show="addressList.length">请选择</div>
            <van-icon class="icon-btn" name="cross" @click="closeAddress"/>
          </div>
        </div>
        <scroll class="address-list" ref="scroll" :click="true" :data="addressList">
          <div class="address-item" v-for="(item, index) in addressList" :key="index">
            <van-icon size="24px" name="add-o" @click="selectAddress(item)" />
            <span class="text" @click="changeArea(item)">{{item.name}}</span>
          </div>
        </scroll>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '@/components/base/scroll/scroll'
  export default {
    name: '',
    data () {
      return {
        navBarItems: [],
        addressList: [],
        cacheArray: [],
        canClick: true,
        isShowAddress: false
      }
    },
    mounted() {
    },
    methods: {
      changeArea(item) {
        this.isShowAddress = false
        let params = {}
        let data = this.navBarItems
        let addressName = ''
        if (data && data.length) {
          data.forEach(function (item, index) {
            addressName += item.name
            switch (index) {
              case 0:
                params.provinceId = item.id
                break
              case 1:
                params.cityId = item.id
                break
              case 2:
                params.countyId = item.id
                break
              case 3:
                params.townId = item.id
                break
            }
          })
        }
        // let address = addressName + item.name
        // console.log(address.slice(2))
        let addressList = JSON.stringify(data)
        let list = JSON.parse(addressList)
        list.push(item)
        this.$emit('setAddressEvent', {value: item, list: list})
      },
      initAddress() {
        this.isShowAddress = true
        this.navBarItems = []
        this.addressList = []
        this.cacheArray = []
        this._getAddressList()
      },
      closeAddress() {
        this.isShowAddress = false
      },
      navItem(item, index) {
        if (item) {
          let i = this.navBarItems.findIndex(nav => nav.id === item.id)
          this.navBarItems.splice(i, this.navBarItems.length)
          this.cacheArray.splice(i + 1, this.cacheArray.length) // 导航比地址少一个
          this.addressList = this.cacheArray[index]
        }
      },
      selectAddress(item) {
        if (this.canClick) {
          this.addressList.forEach(address => {
            this.$set(address, 'checked', address.id == item.id)
          })
          this.navBarItems.push(item)
          this._getAddressList(item.id)
        }
      },
      _getAddressList (parentId = -1) {
        this.$Loading.open()
        let url = '/app/json/area/loadAreaLevel'
        let params = {
          parentId: parentId
        }
        this.canClick = false
        this.$http.post(url, params).then(res => {
          var res = res.data
          if (res.status == 0 && res.data && res.data.length) {
            let list = res.data
            this.cacheArray.push(list)
            this.addressList = this.cacheArray[this.cacheArray.length - 1]
            this.$refs.scroll.scrollTo(0, 0)
          } else {
            this._setAddress()
          }
          this.canClick = true
          this.$Loading.close()
        })
      },
      _setAddress: function () {
        let params = {}
        let data = this.navBarItems
        let addressName = ''
        if (data && data.length) {
          data.forEach(function (item, index) {
            addressName += item.name
            switch (index) {
              case 0:
                params.provinceId = item.id
                break
              case 1:
                params.cityId = item.id
                break
              case 2:
                params.countyId = item.id
                break
              case 3:
                params.townId = item.id
                break
            }
          })
        }
        // this.$emit('setAddressEvent', {value: params, name: addressName, list: data})
        this.closeAddress()
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/mixin.styl"
  .back-drop {
    position: fixed
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6)
    z-index 999
  }

  .address-choose {
    position: fixed
    width: 100%
    height: 70%;
    bottom: 0
    background: #fff
    z-index: 1000
    font-size: 15px
    .nav-bar-wrapper {
    //      bdr-b()
      height: 44px
      line-height: 44px
      overflow: hidden
      padding: 0 15px
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
      position: relative
      .nav-bar-item {
        display: inline-block
        position: relative
        margin-right: 10px
        &.active::before {
          position: absolute
          left: 50%
          bottom: 0
          transform: translateX(-50%)
          content: ''
          width: 100%
          height: 2px
          background: $color-text-price
        }
        &.active {
          color: $color-text-price
        }
      }
      .icon-btn {
        position: absolute
        right: 15px
        color: $color-text-gray
        top: 50%
        transform: translate3d(0, -50%, 0)
        font-size: 18px
      }
    }
    .address-list {
      position: absolute
      width: 100%
      top: 44px
      bottom: 0
      overflow: hidden
      .address-item {
        padding: 6px 15px
        font-size: 14px
        position: relative
        color: #5a5a5a
        display flex
        align-items center
        .text {
          display inline-block
          padding-left: 5px
        }
        /deep/ .van-icon {
          padding-right: 5px
        }
        &:nth-last-child(1) {
          padding-bottom: 11px
        }
      }
    }
    .loading-container {
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }

  .address-choose-enter-active, .address-choose-leave-active {
    transition: all .3s
  }

  .address-choose-enter, .address-choose-leave-to {
    transform: translate3d(0, 100%, 0)
  }
</style>
