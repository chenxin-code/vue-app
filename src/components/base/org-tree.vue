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
              <span>{{item.cityOuName}}</span>
            </div>
            <div class="nav-bar-item active" v-show="addressList.length">请选择</div>
            <van-icon class="icon-btn" name="cross" @click="closeAddress"/>
          </div>
        </div>
        <div class="address-list" ref="scroll">
          <div class="address-item" v-for="(item, index) in addressList" :key="index">
<!--            <van-icon size="24px" name="add-o" @click="selectAddress(item)"/>-->
            <span class="text" @click="changeArea(item)">{{item.ouNameNew}}</span>
          </div>
          <div class="address-item" style="color: #b3b3b3;font-size: 10px;display: flex;justify-content: center" v-if="addressList.length">
            <span style="">亲！到底部了哦～</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

  export default {
    name: '',
    data() {
      return {
        navBarItems: [],
        addressList: [],
        cacheArray: [],
        canClick: true,
        isShowAddress: false,
        curOu: {
          ouCode: '',
          ouLevel: -1
        }
      }
    },
    mounted() {
    },
    methods: {
      changeArea(item) {
        this.isShowAddress = false
        this.$emit('setAddressEvent', item)
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
        this.curOu = {
          ouCode: '',
          ouLevel: -1
        }
      },
      navItem(item, index) {
        if (item) {
          let i = this.navBarItems.findIndex(nav => nav.id === item.id)
          this.navBarItems.splice(i, this.navBarItems.length)
          this.cacheArray.splice(i + 1, this.cacheArray.length) // 导航比地址少一个
          this.addressList = this.cacheArray[index]
        }
      },
      // selectAddress(item) {
      //   if (this.canClick) {
      //     this.addressList.forEach(address => {
      //       this.$set(address, 'checked', address.id == item.id)
      //     })
      //     this.navBarItems.push(item)
      //     this.curOu = item
      //     this._getAddressList()
      //   }
      // },
      _getAddressList(ouCode = '', ouLevel = -1) {
        // this.$Loading.open()
        let url = '/app/json/user/getOrganizationTree?is_ds=1'
        let params = {
          ouProp: 12,
          is_ds: 1,
          ouCode: this.curOu.ouCode,
          includeLevel: this.curOu.ouLevel + 1
        }
        this.canClick = false
        this.$request.post(url, params).then(res => {
          if (res.status == 0) {
            let list = res.data.subOrganization || []
            if (list.length) {
              this.cacheArray.push(list)
              this.addressList = this.cacheArray[this.cacheArray.length - 1]
              this.addressList.forEach(item=>{
                item.ouNameNew = item.ouName.split('石油分公司')[0]
              })
            } else {
              this._setAddress()
            }
          } else {
            this.$Toast(res.info);
          }
          this.canClick = true
        })
        // this.$http.post(url, params).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     let list = data.data.subOrganization || []
        //     if (list.length) {
        //       this.cacheArray.push(list)
        //       this.addressList = this.cacheArray[this.cacheArray.length - 1]
        //       this.$refs.scroll.scrollTo(0, 0)
        //     } else {
        //       this._setAddress()
        //     }
        //   }
        //   this.canClick = true
        //   this.$Loading.close()
        // })
      },
      _setAddress: function () {
        // this.$emit('setAddressEvent', this.navBarItems[this.navBarItems.length - 1])
        this.closeAddress()
      }
    },
    components: {}
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
    height: 40%;
    bottom: 0;
    left: 0;
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
      overflow-y auto

      .address-item {
        padding: 11px 15px
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
