/**Created by liaoyingchao on 2020-07-07.*/

<template>
  <div class="modify-order-address mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scrolcontent">
        <div class="promptText" v-if="this.$store.state.globalConfig.OrderModification_TextPrompt">{{this.$store.state.globalConfig.OrderModification_TextPrompt}}</div>
        <div class="shadow-con shadow-cell">
          <mt-field class="mt-title border" label="收货人姓名" placeholder="请输入收货人姓名" v-model="receiver"  @input.native.capture="receiverInputChange"></mt-field>
          <mt-field class="mt-title border" label="手机号" placeholder="请输入手机号码" v-model="mobile" type="tel"></mt-field>
          <div @click.stop="selectRegion">
            <mt-field class="mt-title border" label="选择区域" placeholder="请选择区域" v-model="regionText" readonly='readonly'>
              <img width="20px" height="20px" src="static/image/mall2/area.png">
            </mt-field>
          </div>
          <mt-field class="mt-title" label="详细地址" placeholder="请输入详细地址" v-model="address" @input.native.capture="addressInputChange"></mt-field>
          <!--<div class="default-div">-->
            <!--<div class="label">设置为默认地址</div>-->
            <!--<img @click="switchClick" width="45px" height="24px"-->
                 <!--:src="isDefault?'static/image/mall2/switch-on.png':'static/image/mall2/switch-off.png'"/>-->
          <!--</div>-->
          <!--<mt-field class="mt-title " label="设置为默认地址" disabled="disabled" v-model="noneValue">-->
          <!--<img @click="switchClick" width="45px" height="24px"-->
          <!--:src="isDefault?'/static/image/mall2/switch-on.png':'/static/image/mall2/switch-off.png'"/>-->
          <!--</mt-field>-->
        </div>
      </div>
      <div class="bottom-btn theme_bg_red" @click="saveAddressEvent">
        <p class="">使用新地址</p>
      </div>
    </nav-content>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent" @closeEvent="regionCloseEvent"></RegionSelect>
  </div>
</template>

<script>
  import {Field} from 'mint-ui';
  import RegionSelect from '../../base/region-select'

  export default {
    name: 'modify-order-address',
    components: {
      Field,
      RegionSelect
    },
    data() {
      return {
        eventType: 1,//1新建保存，2编辑
        receiver: '',
        mobile: '',
        regionText: '',
        address: '',
        isDefault: true,
        showSelect: false,
        initData: {
          title: '请选择地区'
        },
        region: [],
        selectedItems: [],
        addressId: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        countryId: '',
        countryName: '',
        townId: '',
        townName: '',
        zipCode: '',
        areaCode: '',
        id: '',
        addressFull: '',
        addressType: '1',
        pageType: '0', // 0 地址选择页面  1 我的地址页面（有删除，点击不返回） 2 修改订单地址
        orderId: '',
        tradeNo: '',
        orderType: '',
      }
    },
    methods: {

      receiverInputChange: function (e) {

        let value = e.target.value;
        if(value.length>50){
          value=value.slice(0,50)
          this.$Toast('收货人最大输入50个字');
        }
        this.receiver = value;
      },
      addressInputChange: function (e) {
        let value = e.target.value;
        if(value.length>100){
          value=value.slice(0,100)
          this.$Toast('详细地址最大输入100个字');
        }
        this.address = value;
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      switchClick: function () {
        this.isDefault = !this.isDefault
      },
      saveAddressEvent: function () {
        if (this.receiver == '' || this.mobile == '' || this.regionText == '' || this.address == '') {
          this.$Toast('所有填写项都为必填项，请将信息填写完整！')
          return
        } else if (!this.$util.checkMobile(this.mobile)) {
          this.$Toast('请填写正确的手机号码！')
          return
        }else if (this.isEmojiCharacter(this.address)) {
          this.$Toast('详细地址里面不能输入表情符号！')
          return
        }


        let url = '/app/json/app_shopping_order/modifyReceivingAddress'
        this.$Loading.open();
        let params1 = {
          townName: this.townName,
          address: this.address,
          receiver: this.receiver,
          mobile: this.mobile,
          townId: this.townId,
          cityId: this.cityId,
          provinceId: this.provinceId,
          countryId: this.countryId,
          cityName: this.cityName,
          provinceName: this.provinceName,
          countryName: this.countryName,
          orderId: this.orderId,
          tradeNo: this.tradeNo,
          orderType: this.orderType
        }
        if (this.region.length > 0) {
          for (let i = 0; i < 4; i++) {
            let item = {
              id: '',
              name: ''
            }
            if (this.region.length > i) {
              item = this.region[i]
            }
            if (i == 0) {
              params1.provinceId = item.id
              params1.provinceName = item.name
            } else if (i == 1) {
              params1.cityId = item.id
              params1.cityName = item.name
            } else if (i == 2) {
              params1.countryId = item.id
              params1.countryName = item.name
            } else if (i == 3) {
              params1.townId = item.id
              params1.townName = item.name
            }
          }
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.$Toast('修改成功！')
            this.$router.go(-1);
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('保存失败')
        });
      },
      selectRegion: function () {
        console.log('selectRegion')
        this.showSelect = true;
        this._getRegionData(0)
      },
      selectedItemsEvent: function (selectedValue) {
        let item = selectedValue.item;
        this.selectedItems = selectedValue.selecteds;
        if (this.selectedItems.length == 4) {
          this.showSelect = false;
          this.region = this.selectedItems;
          this.getRegionText();
          return;
        }
        this._getRegionData(item.id)
      },
      regionCloseEvent: function () {
        this.showSelect = false;
      },
      _getRegionData: function (parentId) {
        this.$Loading.open()
        // console.log(parentId)
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            let arr = data.data;
            console.log(arr)
            if (arr.length > 0) {
              this.$nextTick(function () {
                this.$refs.regionselect.pushCustomOptions(arr);
              })
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取失败', error);
          this.$Toast('获取数据失败')
        });
      },
      getRegionText: function () {
        let str = ''
        for (let i = 0; i < this.region.length; i++) {
          str += this.region[i].name
        }
        this.regionText = str;
        this.$refs.regionselect.reset(null);
      },

      isEmojiCharacter: function (substring) {
        for (var i = 0; i < substring.length; i++) {
          var hs = substring.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
              var ls = substring.charCodeAt(i + 1);
              var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
              return true;
            }
          } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
              return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
              return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
              return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
              return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
              || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
              || hs == 0x2b50) {
              return true;
            }
          }
        }
      },

    },
    created() {
      this.orderId = this.$route.query.orderId
      this.tradeNo = this.$route.query.tradeNo
      this.orderType = this.$route.query.orderType
      let addressItem = this.$route.query.address ? JSON.parse(decodeURIComponent(this.$route.query.address)) : '';
      if (addressItem != '') {
        this.address = addressItem.address;
        this.receiver = addressItem.receiver;
        this.mobile = addressItem.mobile;
        this.townId = addressItem.townId;
        this.townName = addressItem.townName;
        this.cityName = addressItem.cityName;
        this.cityId = addressItem.cityId;
        this.provinceId = addressItem.provinceId;
        this.provinceName = addressItem.provinceName
        this.countryId = addressItem.countryId;
        this.countryName = addressItem.countryName;
        this.regionText = addressItem.provinceName + addressItem.cityName + addressItem.countryName + addressItem.townName
      }
      let defaultProvince = this.provinceName || '';
      let defaultCity = this.cityName || '';
      let countryName = this.countryName || '';
      if (defaultProvince && defaultCity && countryName) {
        this.initData.canNotReselect = true
        switch (this.$store.state.globalConfig.order_open_modify_all_address) {
          case '1':
            this.initData.canNotReselect = false
            this.initData.initAreas = []
            break;
          case '2':
            this.initData.initAreas = [defaultProvince]
            break;
          case '3':
            this.initData.initAreas = [defaultProvince, defaultCity]
            break;
          case '4':
            this.initData.initAreas = [defaultProvince, defaultCity, countryName]
            break;
          default:
            this.initData.initAreas = [defaultProvince, defaultCity]
        }
      }
    },
    // beforeRouteLeave(to, from, next) {
    //   this.$keepaliveHelper.deleteCache(this)
    //   next()
    // },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .modify-order-address {
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
      -webkit-overflow-scrolling touch
      .promptText{
        background-color #ff0
        color:#f80f16;
        font-size:14px;
        padding:5px 10px;
        margin-bottom:10px;
      }
      .shadow-con {
        .mt-title {
          height 50px
        }
      }
      .default-div {
        display flex;
        align-items center;
        justify-content space-between
        padding 13px 10px;
        .label {
          font-size 14px;
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
    .border {
      border-bottom 1px solid $color-text-lll
    }
    .image-center {
      display flex
      align-items center
      justify-content center;
    }
  }

</style>
