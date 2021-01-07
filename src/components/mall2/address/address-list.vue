/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="address-list">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scrolcontent" ref="addresslistscrl">
        <div class="address-cells shadow-cell" v-for="(list, idx) in lists" @click="selectAddress(list,idx)">
          <mt-cell-swipe :right="[{
                                  content: '删除',
                                  style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
                                  handler: () => _deleteAddress(list,idx)
                                }]" class="my-cell-swipe">

            <div slot="title" style="width: 100%;display: flex;align-items: center">
              <div v-if="list.id == $store.state.mall2.selectAddress.id && pageType == 0" class="left-select">
                <i class="iconfont mall-xuanzhong theme_font_red"></i>
                <!--<i v-if="!list.isDefault" class="iconfont mall-weixuanzhong theme_font_tint"></i>-->
                <!--<img class="image-con"-->
                <!--:src="list.isSelected?'/static/image/mall2/checked.png':'/static/image/mall2/unchecked.png'"/>-->
              </div>
              <div class="right-info">
                <div class="name-phone">
                  <span class="realName theme_font_black left-con">{{list.receiverName}}</span>
                  <span class="tel theme_font_black left-con">{{list.mobile}}</span>
                  <span class="default left-con theme_bg_red" v-if="list.isDefault == 1">默认</span>
                </div>
                <div class="address-edit">
                  <p class="address theme_font_gray">{{list.addressFull}}</p>
                  <div class="edit" @click.stop="editAddress(list)">
                    <i class="iconfont mall-bianji theme_font_gray"></i>
                    <!--<img class="edit-image" src="/static/image/mall2/edit-address.png"/>-->
                  </div>
                </div>
              </div>
            </div>
          </mt-cell-swipe>
        </div>
        <div v-if="cannotUseList.length > 0">
          <div class="cannot-use-address">
            <div class="line line_top"></div>
            <div class="text">不可用地址</div>
            <div class="line line_top"></div>
          </div>
          <div class="address-cells shadow-cell" v-for="(list, idx) in cannotUseList">
            <mt-cell-swipe :right="[{
                                  content: '删除',
                                  style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
                                  handler: () => _deleteAddress(list,idx)
                                }]" class="my-cell-swipe">

              <div slot="title" style="width: 100%;display: flex;align-items: center">
                <div v-if="list.id == $store.state.mall2.selectAddress.id && pageType == 0" class="left-select">
                  <i class="iconfont mall-xuanzhong theme_font_red"></i>
                </div>
                <div class="right-info">
                  <div class="name-phone">
                    <span class="realName theme_font_gray left-con">{{list.receiverName}}</span>
                    <span class="tel theme_font_gray left-con">{{list.mobile}}</span>
                    <span class="default left-con theme_bg_red" v-if="list.isDefault == 1">默认</span>
                  </div>
                  <div class="address-edit">
                    <p class="address theme_font_gray">{{list.addressFull}}</p>
                    <div class="edit" @click.stop="editAddress(list)">
                      <i class="iconfont mall-bianji theme_font_gray"></i>
                      <!--<img class="edit-image" src="/static/image/mall2/edit-address.png"/>-->
                    </div>
                  </div>
                </div>
              </div>
            </mt-cell-swipe>
          </div>
        </div>
      </div>
      <div class="bottom-btn theme_bg_red" @click="addAddressEvent"><p>新建收货地址</p></div>
    </nav-content>
  </div>
</template>

<script>
  import {Indicator, Toast, CellSwipe} from 'mint-ui'
  import Vue from 'vue'

  export default {
    name: "addresslist",
    components: {
      Indicator,
      Toast,
      CellSwipe
    },
    data() {
      return {
        lists: [],
        scrollValue: 0,
        reSetDefault: false,
        pageType: '0', // 0 地址选择页面  1 我的地址页面（有删除，点击不返回）
        type: '',
        cannotUseList: []
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      reSetDefaultAddress: function (address) {
        this.reSetDefault = false
        this.$store.state.mall2.selectAddress = address;
        this._setDefaultAddress(address.id)
        this.$bridgefunc.vuexStorage()
      },
      _deleteAddress: function (item, idx) {//删除地址
        if (item.id == this.$store.state.mall2.selectAddress.id) {
          this.reSetDefault = true
        }
        this.$Loading.open();
        let url = '/app/json/user_address/deleteUserAddress';
        let params1 = {
          id: item.id,
          token: this.$store.state.login.token,
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('删除地址:', data);
          if (data.status == 0) {
            this._getAddressList()
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('删除地址', error);
          this.$Toast('删除地址失败')
        });
      },
      editAddress: function (item) {
        console.log(item);
        this.$router.push({
          path: '/mall2/addaddress',
          query: {
            addressItem: encodeURIComponent(JSON.stringify(item)),
            type: 2,
            pageType: this.pageType
          }
        });
      },
      addAddressEvent: function () {
        if (this.type == 'citydelivery') {
          let location = sessionStorage.getItem('Address_City_Seleted')
          location = JSON.parse(location)

          this.$router.push({
            path: '/mall2/addaddress',
            query: {
              type: 1,
              pageType: this.pageType,
              defaultCity: location.cityName,
              defaultProvince: location.provinceName
            }
          });
        } else {
          this.$router.push({
            path: '/mall2/addaddress',
            query: {
              type: 1,
              pageType: this.pageType
            }
          });
        }
      },
      selectAddress: function (item, idx) {
        console.log(item)
        if (this.pageType == '0') {
          this.$store.state.mall2.selectAddress = item;
          this._setDefaultAddress(item.id)
          this.$bridgefunc.vuexStorage()
          this.backEvent();
        }
      },
      _setDefaultAddress: function (id) {
        let url = '/app/json/user_address/addDefaultAddress';
        let params1 = {
          token: this.$store.state.login.token,
          deliveryId: id
        }

        this.$http.post(url, params1).then(res => {
        }, error => {
        });
      },
      _getAddressList: function () {//获取地址列表
        this.$Loading.open();
        let url = '/app/json/user_address/loadUserAddressList';
        let params1 = {
          token: this.$store.state.login.token,
          addressType: '1'//1:快递地址2自提地址
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (this.type == 'citydelivery') {
              let location = sessionStorage.getItem('Address_City_Seleted')
              location = JSON.parse(location)
              let arr1 = []
              let arr2 = []
              for (let i = 0; i < arr.length; i++) {
                let adr = arr[i]
                if (adr.cityId == location.cityId) {
                  arr1.push(adr)
                } else {
                  arr2.push(adr)
                }
              }
              if (arr1.length > 0) {
                if (this.reSetDefault == true) {
                  this.reSetDefaultAddress(arr1[0])
                }
              } else {
                this.$store.state.mall2.selectAddress = {id: ''}
                this.$bridgefunc.vuexStorage()
              }
              this.lists = arr1;
              this.cannotUseList = arr2;
            } else {
              // 如果选中的地址被删除，需要重置选中地址
              if (arr.length > 0) {
                if (this.reSetDefault == true) {
                  this.reSetDefaultAddress(arr[0])
                }
              } else {
                this.$store.state.mall2.selectAddress.id = ''
                this.$bridgefunc.vuexStorage()
              }
              this.lists = arr;
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取地址列表', error);
          this.$Toast('获取数据失败')
        });
      },
    },
    // activated () {
    //   // if (this.scrollValue != 0) {
    //   //   this.$refs.addresslistscrl.scrollTop = this.scrollValue
    //   // }
    //   this._getAddressList();
    // },
    // beforeRouteLeave (to, from, next) {
    //   if (to.path == '/mall2/addaddress') {
    //     // this.scrollValue = this.$refs.addresslistscrl.scrollTop
    //   } else {
    //     this.$keepaliveHelper.deleteCache(this)
    //   }
    //   next()
    // },
    created() {
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : '0'
      this.type = this.$route.query.type ? this.$route.query.type : ''
      this._getAddressList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .address-list {
    width 100%
    height 100%
    overflow hidden

    .scrolcontent {
      position absolute
      top 0px;
      right 0px;
      left 0px;
      bottom 50px;
      overflow-y scroll
      -webkit-overflow-scrolling touch;

      .cannot-use-address {
        font-size 12px;
        display flex;
        align-items center;
        justify-content center;
        padding 10px;
        .line {
          height 1px;
          width 30%;
        }
        .text {
          color #999;
          padding 0 10px;
        }
      }

      .address-cells {
        /*margin 10px 16px 16px;*/
        /*border-radius 16px;*/
        /*box-shadow: 0px 6px 6px #efefef;*/
        /*overflow hidden*/

        .my-cell-swipe {
          padding 15px 0px
          //border-bottom 1px solid $color-text-lll

          .left-select {
            padding-right 8px
            //.image-con {
            //  width 36px
            //height 36px
            //}

            i {
              font-size $font-size-large
            }
          }

          .right-info {
            flex 1

            .name-phone {
              /*width 100%*/
              margin-top 5px

              .realName {
                font-size $font-size-medium-x
              }

              .tel {
                margin-left 10px
                font-size $font-size-medium-x
              }

              .default {
                color white
                margin-left: 12px;
                border-radius: 9px;
                -webkit-border-radius: 9px;
                font-size: $font-size-small;
                padding 2px 6px
              }
            }

            .address-edit {
              width 100%
              display flex
              align-items center

              .address {
                flex 1
                padding-top 8px
                font-size $font-size-medium-s
              }

              .edit {
                width 20px
                height 30px
                display flex;
                justify-content center;
                align-items: center;
                //.edit-image{
                // width 30px
                // height 30px
                //}

                i {
                  padding 5px;
                  font-size $font-size-medium-x
                }
              }
            }
          }
        }
      }
    }

    .bottom-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      display flex
      align-items center
      text-align: center;

      p {
        width 100%
        color: white;
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }

    .left-con {
      float left
    }
  }
</style>
