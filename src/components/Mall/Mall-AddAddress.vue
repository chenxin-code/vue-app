/**Created by steven on 2018/6/12.*/

<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="Mall-EditAddress">
    <nav-top @backEvent="backEvent">
    </nav-top>

    <ul class="addressInfo" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <li class="infoItem">
        <span class="itemLeft">收货人</span>
        <div class="item-right">
          <input type="text" class="editText" placeholder="输入姓名" v-model="name">
        </div>
      </li>
      <li class="infoItem">
        <span class="itemLeft">手机号码</span>
        <div class="item-right">
          <input type="text" class="editText" placeholder="输入手机号码" v-model="phoneNum">
        </div>
      </li>
      <li class="infoItem">
        <span class="itemLeft">选择区域</span>
        <div class="item-right" @click="selectRegion">
          <input readonly="readonly" type="text" class="editText" placeholder="选择区域" v-model="regionText">
        </div>
      </li>
      <li class="infoItem">
        <span class="itemLeft">详细地址</span>
        <div class="item-right">
          <input type="text" class="editText" placeholder="街道、楼牌号等" v-model="address">
        </div>
      </li>
      <li class="infoItem">
        <span class="itemLeft">邮政编码</span>
        <div class="item-right">
          <input type="text" class="editText" placeholder="输入邮政编码（选填）" v-model="zipCode">
        </div>
      </li>
      <li class="infoItem">
        <span class="itemLeft">设置默认地址</span>
        <i class="chose" v-bind:class="{ 'unchose' : isDefault != '1', 'chosed': isDefault == '1'}" @click="toggle()"></i>
      </li>
    </ul>
    <div class="btns">
      <span class="btn" @click="submitAddress">保存并使用</span>
    </div>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent" @closeEvent="regionCloseEvent"></RegionSelect>
  </div>
</template>

<script>
  import RegionSelect from '../base/region-select'

export default {
  name: "Mall-ShippingAddress",
  components: {
    RegionSelect
  },
  data() {
    return {
      showSelect: false,
      initData: {
        title: '请选择地区'
      },
      name: '',
      phoneNum: '',
      regionText: '',
      region: [],
      address: '',
      zipCode: '',
      isDefault: '0',
      selectedItems: [],
      addressId: '',
      phone: '',
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      countryId: '',
      countryName: '',
      townId: '',
      townName: '',
      tag: ''
    };
  },
  methods: {
    toggle: function(){
      if (this.isDefault == 1) {
        this.isDefault = '0';
      } else {
        this.isDefault = '1';
      }
    },
    backEvent: function () {
      this.$bridgefunc.customGo(-1)
    },
    regionCloseEvent: function () {
      this.showSelect = false;
    },
    selectRegion: function () {
      this.showSelect = true;
      this.getRegionData(0)
    },
    getRegionText: function () {
      let str = ''
      for (let i = 0; i < this.region.length; i++) {
        str += this.region[i].name
      }
      this.regionText = str;
      this.$refs.regionselect.reset(null);
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
      this.getRegionData(item.id)
    },
    getRegionData: function (parentId) {
      this.$Loading.open()
      // console.log(parentId)
      let url = '/app/json/area/list';
      let params1 = {
        token: this.$store.state.login.token,
        parentId: parentId
      };
      let _this = this
      this.$http.post(url, params).then(res => {
        _this.$Loading.close()
        let data = res.data;
        // console.log(data);
        if (data.status == 0) {
          let arr = data.data;
          console.log(arr)
          if (arr.length > 0) {
            _this.$nextTick(function () {
              console.log(_this.$refs.regionselect)
              _this.$refs.regionselect.pushCustomOptions(arr);
            })
          } else {
            _this.showSelect = false;
            _this.region = _this.selectedItems;
            _this.getRegionText();
          }
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);
        _this.$Toast('获取数据失败')
      });
    },
    submitAddress: function () {
      if (this.name == '' || this.phoneNum == '' || this.regionText == '' || this.address == '') {
        this.$Toast('所有填写项都为必填项，请将信息填写完整！')
        return
      } else if (!this.$util.checkMobile(this.phoneNum)) {
        this.$Toast('请填写正确的手机号码！')
        return
      } else if (this.zipCode && !this.$util.checkAddressCode(this.zipCode)) {
        this.$Toast('请填写正确的邮政编码！')
        return
      }

      this.$Loading.open()
      let url = '/app/json/user_address/save';
      let userAddr = {
        id: this.addressId,
        address: this.address,
        isDefault: this.isDefault,
        receiverName: this.name,
        phone: this.phone,
        mobile: this.phoneNum,
        tag: this.tag,
        provinceId: this.provinceId,
        provinceName: this.provinceName,
        cityId: this.cityId,
        cityName: this.cityName,
        countryId: this.countryId,
        countryName: this.countryName,
        townId: this.townId,
        townName: this.townName,
        zipCode: this.zipCode,
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
            userAddr.provinceId = item.id
            userAddr.provinceName = item.name
          } else if (i == 1) {
            userAddr.cityId = item.id
            userAddr.cityName = item.name
          } else if (i == 2) {
            userAddr.countryId = item.id
            userAddr.countryName = item.name
          } else if (i == 3) {
            userAddr.townId = item.id
            userAddr.townName = item.name
          }
        }
      }
      let params1 = {
        token: this.$store.state.login.token,
        userAddr: userAddr
      };
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        console.log(data);
        if (data.status == 0) {
          _this.$bridgefunc.customGo(-1)
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);
        _this.$Toast('获取数据失败')
      });
    }
  },
  created () {
    let itemStr = this.$route.query.item ? this.$route.query.item : '';
    console.log(itemStr)
    if (itemStr != '') {
      let itemData = JSON.parse(itemStr)
      this.addressId = itemData.id;
      this.name = itemData.receiverName;//this.$route.query.receiverName ? this.$route.query.receiverName : '';
      this.address = itemData.address;//this.$route.query.address ? this.$route.query.address : '';
      this.cityId = itemData.cityId;//this.$route.query.cityId ? this.$route.query.cityId : '';
      this.cityName = itemData.cityName;//this.$route.query.cityName ? this.$route.query.cityName : '';
      this.countryId = itemData.countryId;//this.$route.query.countryId ? this.$route.query.countryId : '';
      this.countryName = itemData.countryName;//this.$route.query.countryName ? this.$route.query.countryName : '';
      this.isDefault = itemData.isDefault ? itemData.isDefault : '0';
      this.phoneNum = itemData.mobile;//this.$route.query.mobile ? this.$route.query.mobile : '';
      this.provinceId = itemData.provinceId;//this.$route.query.provinceId ? this.$route.query.provinceId : '';
      this.provinceName = itemData.provinceName;//this.$route.query.provinceName ? this.$route.query.provinceName : '';
      this.townId = itemData.townId;//this.$route.query.townId ? this.$route.query.townId : '';
      this.townName = itemData.townName;//this.$route.query.townName ? this.$route.query.townName : '';
      this.zipCode = itemData.zipCode;//this.$route.query.zipCode ? this.$route.query.zipCode : '';
      this.regionText = this.provinceName+this.cityName+this.countryName+this.townName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.Mall-EditAddress{
  position relative
  width 100%;
  height 100%;
  background-color:#fff;
  .addressInfo{
    position absolute
    left 0px;
    right 0px;
    bottom 60px;
    overflow-y scroll
    -webkit-overflow-scrolling touch;
    .infoItem{
      padding 0px 3%;
      border-bottom:1px solid $color-line-gray-l;
      overflow:hidden;
      height:50px;
      .itemLeft{
        float:left;
        min-width 70px;
        height:50px;
        line-height:50px;
        font-size:$font-size-medium;
      }
      .item-right {
        overflow hidden;
        height 100%;
      }
      .editText{
        float:left;
        margin-left:3%;
        height:50px;
        line-height:50px;
        padding:5px 3%;
        font-size:$font-size-medium;
        width:100%;
      }
      .chose{
        float:right;
        width:50px;
        height:25px;
        background-size:50px 25px;
        background-position:left center;
        background-repeat:no-repeat;
        margin-top:12px;
      }
      .unchose{
        background-image:url("../../../static/image/mall/select3.png")
      }
      .chosed{
        background-image:url("../../../static/image/mall/select4.png")
      }
    }
  }


  .btns{
    position:fixed;
    width:80%;
    bottom:10px;
    left:10%;
    background:#fe6902;
    height:40px;
    line-height:40px;
    border:1px solid #fe6902;
    border-radius:20px;
    -webkit-border-radius:20px;
    font-size:$font-size-medium-x;
    text-align:center;
    z-index:99;
    .btn{
      height:40px;
      line-height:40px;
      border-color:#fe6902;
      color:#fff;
      font-weight:600;
    }
  }
}
</style>
