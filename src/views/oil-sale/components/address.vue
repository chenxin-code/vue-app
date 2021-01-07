<template>
  <div class="address">
    <li class="details-item">
      <div class="left">收货人姓名</div>
      <div class="right">
        <input
          type="text"
          @input.native.capture="receiverInputChange"
          placeholder="请输入收货人姓名"
          v-model="receiver.receiverName">
      </div>
    </li>
    <li class="details-item">
      <div class="left">收货人手机号</div>
      <div class="right">
        <input
          type="tel"
          placeholder="请输入收货人手机号"
          v-model="receiver.mobile">
      </div>
    </li>
    <li class="details-item">
      <div class="left">选择区域</div>
      <div class="right">
        <input
          type="text"
          disabled
          placeholder="请选择区域"
          v-model="receiver.regionText">
      </div>
      <div class="icon" @click.stop="selectRegion">
        <img width="20px" height="20px" src="static/image/mall2/area.png">
      </div>
    </li>
    <li class="details-item">
      <div class="left">详细地址</div>
      <div class="right">
        <input
          type="text"
          placeholder="请输入详细地址"
          v-model="receiver.address">
      </div>
    </li>
    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent"
                  @closeEvent="regionCloseEvent"></RegionSelect>
  </div>
</template>

<script>
  import RegionSelect from '@/components/base/region-select'

  export default {
    data() {
      return {
        showSelect: false,
        initData: {
          title: '请选择地区'
        },
        region: [],
        selectedItems: [],
        // addressId: '',
        // provinceId: '',
        // provinceName: '',
        // cityId: '',
        // cityName: '',
        // countryId: '',
        // countryName: '',
        // townId: '',
        // townName: ''
      }
    },
    props: [
      'receiver'
    ],
    mounted() {

    },
    methods: {
      receiverInputChange(e) {
        let value = e.target.value
        if(value.length > 50){
          value = value.slice(0,50)
          this.$Toast('收货人最大输入50个字')
        }
        this.receiverName = value
      },
      selectRegion() {
        console.log('selectRegion')
        this.showSelect = true;
        this._getRegionData(0)
      },
      selectedItemsEvent(selectedValue) {
        let item = selectedValue.item;
        this.selectedItems = selectedValue.selecteds;
        let addressInfo = {}
        if (this.selectedItems.length > 0) {
          for (let i = 0; i < 4; i++) {
            let item = {
              id: '',
              name: ''
            }
            if (this.selectedItems.length > i) {
              item = this.selectedItems[i]
            }
            if (i == 0) {
              addressInfo.provinceId = item.id
              addressInfo.provinceName = item.name
            } else if (i == 1) {
              addressInfo.cityId = item.id
              addressInfo.cityName = item.name
            } else if (i == 2) {
              addressInfo.countryId = item.id
              addressInfo.countryName = item.name
            } else if (i == 3) {
              addressInfo.townId = item.id
              addressInfo.townName = item.name
            }
          }
          this.$emit('info', addressInfo)
        }
        if (this.selectedItems.length == 4) {
          this.showSelect = false;
          this.region = this.selectedItems;
          this.getRegionText();
          return;
        }
        this._getRegionData(item.id)
      },
      regionCloseEvent() {
        this.showSelect = false;
      },
      _getRegionData (parentId) {
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
          if (data.status == 0) {
            let arr = data.data;
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
          this.$Toast('获取数据失败')
        });
      },
      getRegionText: function () {
        let str = ''
        for (let i = 0; i < this.region.length; i++) {
          str += this.region[i].name
        }
        this.receiver.regionText = str;
        this.$refs.regionselect.reset(null);
      },
    },
    components: {
      RegionSelect
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
  .address {
    padding: 10px 0
  }
</style>
