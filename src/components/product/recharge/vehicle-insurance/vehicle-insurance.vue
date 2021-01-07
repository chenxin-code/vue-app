<template>
  <div class="vehicle-insurance">
    <nav-top title="车辆保险" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="vehicle-insurance-container">
      <div class="title-img">
        <img src="./image/banner@2x.jpg" alt="">
      </div>
      <div class="car-info-inp">
        <div class="table-view">
          <div class="table-view-cell set-height" @click="changeAddress">
            <div class="table-view-cell-text">
              <div class="left">车辆地址</div>
            </div>
            <div class="table-view-cell-arrow special">
              {{province}}<input type="text" v-model="regionText" disabled placeholder="请选择市">
            </div>
          </div>
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">新车未上牌</div>
              <div class="right">
                <van-switch v-model="checkedNewCar" size="18px" active-color="#F80F16" inactive-color="#ddd" />
              </div>
            </div>
          </div>
<!--          <div class="table-view-cell set-height">-->
<!--            <div class="table-view-cell-text">-->
<!--              <div class="left">是否选择我的车辆</div>-->
<!--              <div class="right">-->
<!--                <van-switch v-model="checkedMyCar" @change="checkedMyCarClick" :disabled="checkedNewCar == true ? true : false" size="18px" active-color="#F80F16" inactive-color="#ddd" />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">车牌号</div>
              <div class="right car-num">
<!--                <div class="prefix">{{carNum}}</div>&nbsp;&nbsp;-->
                <input type="text" @input="carInput" v-model="carNumber" :disabled="checkedNewCar == true ? true : false" class="car-input" placeholder="请输入车牌">
              </div>
            </div>
<!--            <div class="table-view-cell-arrow" v-if="checkedNewCar == false && checkedMyCar == true" @click="changeMyCar">选择我的车辆</div>-->
          </div>
          <div class="change-car-pop" v-if="showCarPop">
            <div class="car" v-for="(item, index) in carList" :key="index" @click="changeCar(item)">{{item.plateNum}}</div>
          </div>
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">车主姓名</div>
              <div class="right">
                <input type="text" v-model="carOwnerName" placeholder="请输入车主姓名">
              </div>
            </div>
          </div>
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">车主手机号</div>
              <div class="right">
                <input
                  maxlength="11"
                  type="tel"
                  onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                  placeholder="请输入11位手机号码"
                  autosize
                  @input="/^\d+/.exec(carOwnerPhone) ? /^\d+/.exec(carOwnerPhone)[0] : ''"
                  pattern="[0-9]*"
                  v-model="carOwnerPhone">
              </div>
            </div>
          </div>
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">发动机号</div>
              <div class="right">
                <input type="text" v-model="engineNo" placeholder="非必填">
              </div>
            </div>
          </div>
          <div class="table-view-cell set-height">
            <div class="table-view-cell-text">
              <div class="left">员工推荐码</div>
              <div class="right">
                <input type="text" v-model="referCode" placeholder="非必填">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="insyrance-tips">
        <span class="icon">*&nbsp;</span>您的信息将被严格保密
      </div>
      <div class="re-btn" @click="savePeaceInfo">前往报价</div>
      <van-dialog @confirm="downloadTips = false" confirmButtonText="取消" v-model="downloadTips" title="提示">
       <div class="download-tips">该车主手机号未注册加油湖北APP, 无法进行投保</div>
      </van-dialog>
      <!--          我的车辆弹框-->
<!--      <van-action-sheet v-model="showMyCar" title="我的车辆">-->
<!--        <van-radio-group v-model="radio">-->
<!--          <van-radio checked-color="#f80f16" :name="index" v-for="(item, index) in carList" :key="index" @click="changeCar(item)">-->
<!--            <div class="success-car">-->
<!--              <div class="table-view success-car-table">-->
<!--                <div class="table-view-cell success-car-view-cell">-->
<!--                  <div class="table-view-cell-text success-car-cell-text">-->
<!--                    <div class="left">-->
<!--                      <div class="img">-->
<!--                        <img src="./image/icon5@2x.png" alt="">-->
<!--                      </div>-->
<!--                      <div class="car-info">-->
<!--                        <div class="car-num">{{item.plateNum}}</div>-->
<!--                        <div class="car-style">{{item.brand}}</div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </van-radio>-->
<!--        </van-radio-group>-->
<!--      </van-action-sheet>-->
      <!--      选择地址-->
      <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent"
                    @closeEvent="regionCloseEvent"></RegionSelect>
    </nav-content>
  </div>
</template>

<script>
  import RegionSelect from '../../../base/region-select'
  export default {
    data() {
      return {
        checkedNewCar: false, // 新车未上牌开关
        // checkedMyCar: false, // 是否选择我的车辆开关
        showMyCar: false, // 我的车辆弹框
        showSelect: false, // 选择地址
        radio: '1', // 我的车辆选择
        carList: [], // 我的车辆列表
        initData: {
          title: '请选择地区'
        },
        region: [],
        selectedItems: [],
        regionText: '',
        skuId: '',
        detailData: {},
        carNumber: '', // 车牌号
        isNewCarNotLicense: 0, // 是否新车未上牌 是：1 否：0
        carOwnerName: '', // 车主姓名
        carOwnerPhone: '', // 车主手机号
        engineNo: '', // 发动机号
        referCode: '', // 推荐码
        province: '',
        showCarPop: false, // 选择车的弹框
        downloadTips: false // 未注册app提示
      }
    },
    mounted() {
      this.province = this.$store.state.globalConfig.peace_vehicle_province
    },
    methods: {
      changeCar(item) {
        // 选择车
        this.showCarPop = false
        if (item) {
          this.carNumber = item.plateNum
          this.carOwnerName = item.ownerName
          this.carOwnerPhone = item.phone
          this.engineNo = item.engineNum
        }
      },
      carInput() {
        // 输入车牌号时 对车辆地址是否选择进行校验
        if (!this.regionText) {
          this.carNumber = ''
          this.$Toast('请选择车辆地址')
        }
        if (this.carNumber) {
          this.getValidVehicleListByUserId(this.carNumber)
        }
      },
      checkedMyCarClick() {
        // 是否选择我的车辆
        if (this.checkedMyCar == false) {
          this.carNumber = ''
          this.carOwnerName = ''
          this.carOwnerPhone = ''
          this.engineNo = ''
        }
      },
      changeMyCar() {
        if (!this.regionText) {
          this.$Toast('请选择车辆地址')
        } else {
          this.getValidVehicleListByUserId()
        }
      },
      // getLicense() {
      //   // 获取车牌号接口
      //   this.$request.post('/app/json/car_insure/getLicense', {
      //     areaId: this.$store.state.mall2.selectAddress.cityId // 城市id
      //   }).then(res => {
      //     if (res.status === 0) {
      //       this.carNum = res.data
      //     } else {
      //       this.$Toast(res.info)
      //     }
      //   })
      // },
      getValidVehicleListByUserId(licenseNo) {
        // 通过用户查询车辆信息
        this.$request.post('/app/json/car_insure/getValidVehicleListByUserId', {
          licenseNo: licenseNo
        }).then(res => {
          if (res.status === 0) {
            this.showCarPop = true
            this.carList = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      savePeaceInfo() {
        // 保存车保信息接口 (前往报价按钮)

        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (!this.regionText) {
          this.$Toast('请选择车辆地址')
        } else if (this.checkedNewCar == false && !this.carNumber) {
          this.$Toast('请输入车牌号')
        } else if (!this.carOwnerName) {
          this.$Toast('请输入车主姓名')
        } else if (!myreg.test(this.carOwnerPhone)) {
          this.carOwnerPhone = ''
          this.$Toast('请输入有效手机号！')
        } else {
          if (this.checkedNewCar == false) {
            this.isNewCarNotLicense = 0
          } else {
            this.isNewCarNotLicense = 1
            this.carNumber = ''
          }
          this.$request.post('/app/json/car_insure/savePeaceInfo', {
            areaId: this.$store.state.mall2.selectAddress.provinceId, // 城市id
            isNewCarNotLicense: this.isNewCarNotLicense, // 是否新车未上牌 是：1 否：0
            licenseNo: this.carNumber, // 车牌号 isNewCarNotLicense是1 车牌号不传 是0 车牌号必传
            carOwnerName: this.carOwnerName, // 车主姓名
            carOwnerPhone: this.carOwnerPhone, // 车主手机号
            engineNo: this.engineNo, // 发动机号
            referCode: this.referCode, // 推荐码
          }).then(res => {
            if (res.status === 0) {
              // window.location.href = res.data
              this.$bridgefunc.customPush({
                path: res.data,
                isnativetop: 1,
                query: {}
              })
            } else {
              this.$Toast(res.info)
            }
          })
        }
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
        if (item.level <= 2) { // 只到市
          this._getRegionData(item.id, item.level)
        }
      },
      getRegionText: function () {
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
        address.id = '-1';
        for (let i = 0; i < this.region.length; i++) {
          let item = this.region[i]
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
        this.$store.state.mall2.selectAddress = address
        this.$bridgefunc.vuexStorage()
        this.regionText = str;

        this.$refs.regionselect.reset(null);
      },
      _getRegionData: function (parentId, level) {
        this.$Loading.open()
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
            if (level == 2) { // 只到市
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
              // this.getLicense(); // 获取车牌号接口
              return
            }
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
      regionCloseEvent: function () {
        this.showSelect = false;
      },
      changeAddress() {
        // 选择地址
        this.showSelect = true
        /**
         * 只选市 省的id是配置出来的 如果没有此配置 就走获取全国地区
         */
        let parentId = this.$store.state.globalConfig.peace_vehicle_address
        if (parentId) {
          this._getRegionData(parentId)
        } else {
          this._getRegionData(0)
        }
      }
    },
    components: {
      RegionSelect
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .vehicle-insurance {
    .vehicle-insurance-container {
      background-color #f6f6f6
      .title-img {
        height: 120px
        img {
          width: 100%
          height: 100%
          vertical-align top
        }
      }
      .car-info-inp {
        margin-top: 10px
        background #fff
        padding: 0 10px
        .car-num {
          display flex
          justify-content center
          align-items center
          .car-input {
            width: 80px
            text-align right
          }
        }
        .right {
          input {
            text-align right
          }
        }
      }
      .insyrance-tips {
        padding: 10px 10px
        color: $color-text-d
        font-size: 12px
        display flex
        justify-content left
        align-items center
        .icon {
          color: $color-theme-r
        }
      }
      .set-height {
        padding: 15px
      }
      .success-car {
        padding: 20px 0
        background #f6f6f6
        color: $color-text
        font-size: 14px
        width 100%
        border-radius 10px
        overflow hidden
        position relative
        margin-bottom 10px

        .success-car-table {
          .success-car-view-cell {
            background #f6f6f6

            .success-car-cell-text {
              .left {
                display flex
                justify-content left
                align-items center

                .img {
                  margin-right: 10px
                  border-radius 50%
                  width: 45px
                  height: 45px
                  overflow hidden

                  img {
                    width: 100%
                    height: 100%
                  }
                }

                .car-info {
                  line-height 22px

                  .car-num {
                    font-size: 16px
                  }

                  .car-style {
                    color: $color-text-l
                  }
                }
              }

              .right {
                color: $color-text-d
              }
            }

            .no-success {
              color: $color-text-d
            }
          }
        }
      }

      /deep/ .van-radio-group {
        padding: 11px 15px
        overflow-y auto
        -webkit-overflow-scrolling touch
      }
      /deep/ .van-radio__label {
        flex: 1
      }
      .active {
        color: $color-text-d
      }
      .re-btn {
        text-align center
        background: $color-theme-r
        color: #fff
        font-size: 16px
        position fixed
        bottom: 0
        left: 0
        right: 0
        z-index 10;
        height 44px;
        line-height:44px;
      }
    }
  }
  input:disabled {
    background #fff
  }
  .change-car-pop {
    display inline-block
    position: absolute;
    right: 30px;
    z-index: 999;
    width: 100px;
    text-align: center;
    background #fff
    border: 1px solid #f7f1f1
    border-radius 4px
    padding: 0 5px
    .car {
      padding: 10px 0
      & + .car {
        border-top: 0.5px solid #f7f1f1
      }
    }
  }
  .special {
    input {
      text-align right
      width: 65px
    }
  }
  .download-tips {
    padding: 25px 20px
    line-height 24px
    text-align center
  }
</style>
