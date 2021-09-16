<template>
  <div class="add-address mall2">
    <nav-top :title="eventType==1?'新建收货人':'编辑收货地址'" @backEvent="backEvent" v-if="!$isWX"></nav-top>
    <nav-content :titleDefault="true">
      <div class="scrolcontent">
        <div class="shadow-con shadow-cell">
          <mt-field class="mt-title border" label="收货人姓名" placeholder="请输入收货人姓名" v-model="receiverName"  @input.native.capture="receiverInputChange"></mt-field>
          <mt-field class="mt-title border" label="手机号" placeholder="请输入手机号码" :state="phoneState"  @input="phoneInputChange" v-model="mobile" type="tel"></mt-field>
          <div @click.stop="selectRegion">
            <mt-field class="mt-title border" label="选择区域" placeholder="请选择区域" v-model="regionText" readonly='readonly'>
              <img width="20px" height="20px" src="static/image/mall2/area.png">
            </mt-field>
          </div>
          <mt-field class="mt-title border" label="详细地址" placeholder="请输入详细地址" v-model="address" @input.native.capture="addressInputChange"></mt-field>
          <div class="default-div">
            <div class="label">设置为默认地址</div>
            <img @click="switchClick" width="45px" height="24px"
                 :src="isDefault?'static/image/mall2/switch-on.png':'static/image/mall2/switch-off.png'"/>
          </div>
          <!--<mt-field class="mt-title " label="设置为默认地址" disabled="disabled" v-model="noneValue">-->
          <!--<img @click="switchClick" width="45px" height="24px"-->
          <!--:src="isDefault?'/static/image/mall2/switch-on.png':'/static/image/mall2/switch-off.png'"/>-->
          <!--</mt-field>-->
        </div>
      </div>
      <div class="bottom-btn theme_bg_red" @click="saveAddressEvent">
        <p class="">保存并使用</p>
      </div>
    </nav-content>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent" @closeEvent="regionCloseEvent"></RegionSelect>
  </div>
</template>

<script>
  import {Field} from 'mint-ui';
  import RegionSelect from '../../base/region-select'

  export default {
    name: 'addAddress',
    components: {
      Field,
      RegionSelect
    },
    data() {
      return {
        phoneState: "",
        eventType: 1, //1新建保存，2编辑
        receiverName: '',
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
      }
    },
    methods: {

      phoneInputChange: function(e) {
        let num = parseInt(e);
        if(!this.$util.checkPhone(num)) {
          this.phoneState = "error";
        } else {
          this.phoneState = "success";
        }
      },

      receiverInputChange: function (e) {
        let value = e.target.value;
        if(value.length>50){
          value=value.slice(0,50)
          this.$Toast('收货人最大输入50个字');
        }
        this.receiverName = value;
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
        if (this.receiverName == '' || this.mobile == '' || this.regionText == '' || this.address == '') {
          this.$Toast('所有填写项都为必填项，请将信息填写完整！')
          return
        } else if (!this.$util.checkPhone(this.mobile)) {
          this.$Toast('请填写正确的手机号码！')
          return
        }else if (this.isEmojiCharacter(this.address)) {
          this.$Toast('详细地址里面不能输入表情符号！')
          return
        }


        let url = ''
        if (this.eventType == 2) {//编辑地址
          url = '/app/json/user_address/updateUserAddress';
        } else {//新建
          url = '/app/json/user_address/addNewUserAddress';
        }
        this.$Loading.open();
        let params1 = {
          addressFull: this.addressFull,
          zipCode: this.zipCode,
          townName: this.townName,
          address: this.address,
          addressType: this.addressType,
          receiverName: this.receiverName,
          mobile: this.mobile,
          townId: this.townId,
          cityId: this.cityId,
          provinceId: this.provinceId,
          countryId: this.countryId,
          isDefault: this.isDefault ? '1' : '0',
          cityName: this.cityName,
          provinceName: this.provinceName,
          countryName: this.countryName,
          id: this.id,
          token: this.$store.state.login.token,
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
        params1.addressFull = params1.provinceName + params1.cityName + params1.countryName + params1.townName + params1.address;
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            // let isSave = this.$route.query.isSave;
            // if(isSave){
              this.$store.state.mall2.selectAddress = data.data
              this.$bridgefunc.vuexStorage();
              this._setDefaultAddress(data.data.id)
            // }
            if (this.$route.query.direct == 'direct') {
              this.$router.go(-1);
              return ;
            }
            if (this.pageType == '0') {
              this.$router.go(-2);
            } else {
              this.$router.go(-1);
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('添加地址失败', error);
          this.$Toast('保存失败')
        });
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
      if(this.$isWX) {
        document.title = this.eventType==1?'新建收货人':'编辑收货地址'
      }
      let defaultProvince = this.$route.query.defaultProvince ? this.$route.query.defaultProvince : '';
      let defaultCity = this.$route.query.defaultCity ? this.$route.query.defaultCity : '';
      if (defaultProvince && defaultCity) {
        this.initData.initAreas = [defaultProvince, defaultCity]
        this.initData.canNotReselect = true
      }
      this.eventType = this.$route.query.type ? this.$route.query.type : 1;
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : '0';
      let addressItem = this.$route.query.addressItem ? JSON.parse(decodeURIComponent(this.$route.query.addressItem)) : '';
      if (addressItem != '') {
        this.zipCode = addressItem.zipCode;
        this.address = addressItem.address;
        this.addressType = addressItem.addressType;
        this.receiverName = addressItem.receiverName;
        this.mobile = addressItem.mobile;
        this.townId = addressItem.townId;
        this.townName = addressItem.townName;
        this.cityName = addressItem.cityName;
        this.cityId = addressItem.cityId;
        this.provinceId = addressItem.provinceId;
        this.provinceName = addressItem.provinceName
        this.countryId = addressItem.countryId;
        this.countryName = addressItem.countryName;
        this.isDefault = addressItem.isDefault == '1' ? true : false;
        this.id = addressItem.id;
        this.addressFull = addressItem.addressFull;
        this.regionText = addressItem.provinceName + addressItem.cityName + addressItem.countryName + addressItem.townName
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
  .add-address {
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
