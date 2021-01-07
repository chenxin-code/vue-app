<template>
  <div class="bind-car">
    <nav-top title="添加车辆" @backEvent="$router.go(-1)">
<!--      <div class="delete-img" @click="deleteVehicle"-->
<!--           v-if="$route.query.vehicleListLength && $route.query.vehicleListLength != 1">删除-->
<!--      </div>-->
    </nav-top>
    <nav-content class="bind-car-container">
      <div class="container">
        <div class="bind-car-content">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">车牌号</div>
                <div class="right">
                  <input type="text" v-model="plateNum" @focus="focus" @touchstart.stop readonly
                         placeholder="请输入车牌号">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="show-info">
          <div class="table-view">
            <div class="table-view-cell special">
              <van-collapse v-model="activeNames">
                <van-collapse-item title="更多车辆信息(选填)" name="1">
                  <div class="table-view content-show">
                    <div class="table-view-cell">
                      <div class="table-view-cell-text">
                        <div class="left">品牌车系</div>
                        <div class="right">
                          <input type="text" placeholder="请输入品牌车系" v-model="brand">
                        </div>
                      </div>
                    </div>
                    <div class="table-view-cell">
                      <div class="table-view-cell-text">
                        <div class="left">车型</div>
                        <div class="right">
                          <input type="text" placeholder="请输入车型" v-model="brandModel">
                        </div>
                      </div>
                    </div>
                    <div class="table-view-cell">
                      <div class="table-view-cell-text">
                        <div class="left">车辆颜色</div>
                        <div class="right">
                          <input type="text" placeholder="请输入颜色" v-model="vehColor">
                        </div>
                      </div>
                    </div>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </div>
        </div>
        <div class="bind-car-content">
          <div class="table-view">
            <div class="table-view-cell vehicle" @click="openCarAuthentication">
              <div class="table-view-cell-text info">
                <div class="left">行驶证</div>
                <div class="right"
                     v-if="vehicleItem && vehicleItem.isValid == 1 && identifyState.imageUrl && vehicleItem.examineState == 1">
                  已认证
                </div>
                <div class="right" v-if="vehicleItem && vehicleItem.examineState == 2">审核中</div>
              </div>
              <div class="table-view-cell-arrow"
                   v-if="(vehicleItem && vehicleItem.isValid != 1 && (vehicleItem.examineState == 0 || vehicleItem.examineState == 3) && identifyState.imageUrl) || (!vehicleItem && identifyState.imageUrl)">
                已保存待提交
              </div>
              <div class="table-view-cell-arrow" v-else-if="!identifyState.ownerName">上传行驶证</div>
            </div>
          </div>
        </div>
        <div class="audit-btn">
          <div class="btn keep" @click="saveBtn">保存</div>
          <div class="btn" @click="bindVehicle"
               v-if="vehicleItem.isValid != 1 && vehicleItem.examineState != 2 && vehicleItem.examineState != 1 && fromTicket == false">保存并提交
          </div>
          <div class="btn" v-else @click="deleteVehicle">删除</div>

        </div>
      </div>
      <van-dialog
        v-model="showDialog"
        show-cancel-button
        @confirm="confirm"
        @cancel="cancel"
        confirmButtonText="保存"
        cancelButtonText="不保存"
      >
        <div class="tips-dialog">当前页面数据是否保存？</div>
      </van-dialog>

    </nav-content>
    <virtual-keyboard :show="show" @input="inputKey" @delete="deleteKey" @blur="show = false"></virtual-keyboard>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {Dialog} from 'vant'
  import VirtualKeyboard from '@/components/base/virtual-keyboard'
  let check = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z0-9]{1}[A-Z0-9]{2,10}[A-Z0-9挂学警港澳]{1}$/
  export default {
    data() {
      return {
        show: false,
        plateNum: '',
        activeNames: [],
        vehicleItem: '', // 列表详情
        brand: '', // 车辆品牌
        brandModel: '', // 车辆品牌型号
        vehColor: '', // 车辆颜色
        showDialog: false, // 弹框提示
        fromTicket: false // 判断 如果是从罚单页面过来 保存并提交按钮 不显示
      }
    },
    mounted() {
      if (this.$route.query.vehicleItem) {
        this.vehicleItem = JSON.parse(this.$route.query.vehicleItem)
      }
      if (this.$route.query.fromTicket) {
        this.fromTicket = this.$route.query.fromTicket
      }
      this.plateNum = this.identifyState.plateNum
      this.brand = this.identifyState.brand
      this.brandModel = this.identifyState.brandModel
      this.vehColor = this.identifyState.vehColor
    },
    methods: {
      focus() {
        this.show = true
        document.activeElement.blur()
      },
      saveBtn() {
        // 保存按钮（添加/编辑）
        if (this.plateNum == '') {
          this.$Toast('请输入车牌号！')
        } else if (this.plateNum.search(check) == -1) {
          this.$Toast('请输入合法车牌号！')
        } else {
          this.showDialog = true
        }
      },
      confirm() {
        // 保存按钮
        if (this.vehicleItem) {
          // 如果有就证明是编辑信息
          this.editVehicle()
        } else {
          // 没有就证明是 添加车辆
          this.saveVehicle()
        }
      },
      cancel() {
        // 不保存按钮
        if (this.$route.query.source == 1) {
          this.$router.go(-2)
        } else {
          this.$router.go(-1)
        }
      },
      bindVehicle() {
        // 保存并提交按钮
        if (this.plateNum == '') {
          this.$Toast('请输入车牌号！')
          return
        } else if (this.plateNum.search(check) == -1) {
          this.$Toast('请输入合法车牌号！')
          return
        } else if (!this.identifyState.imageUrl) {
          this.$Toast('请上传行驶证！')
          return
        }
        this.$request.post('/app/json/user/bindVehicle', {
          plateNum: this.plateNum, // 车牌号
          brand: this.brand, // 车辆品牌
          brandModel: this.brandModel, // 车辆品牌
          vehColor: this.vehColor, // 车辆颜色
          imageUrl: this.identifyState.imageUrl, // 行驶证首页url
          ownerName: this.identifyState.ownerName, // 所有人姓名
          vin: this.identifyState.vin, // 车辆识别代号
          engineNum: this.identifyState.engineNum, // 发动机号
          vehType: this.identifyState.vehType // 车辆类型
        }).then(res => {
          if (res.status === 0) {
            if (this.$route.query.source == 1) {
              this.$router.go(-2)
            } else {
              this.$router.go(-1)
            }
          } else {
            this.$Toast(res.info ? res.info : '提交失败')
          }
        })
      }
      ,
      editVehicle() {
        // 编辑车辆接口---保存按钮
        this.$request.post('/app/json/user/editVehicle', {
          id: this.vehicleItem.id, // 车牌号
          plateNum: this.plateNum, // 车牌号
          brand: this.brand, // 车辆品牌
          brandModel: this.brandModel, // 车辆品牌
          vehColor: this.vehColor, // 车辆颜色
          imageUrl: this.identifyState.imageUrl, // 行驶证首页url
          ownerName: this.identifyState.ownerName, // 所有人姓名
          vin: this.identifyState.vin, // 车辆识别代号
          engineNum: this.identifyState.engineNum, // 发动机号
          vehType: this.identifyState.vehType // 车辆类型
        }).then(res => {
          if (res.status === 0) {
            if (this.$route.query.source == 1) {
              this.$router.go(-2)
            } else {
              this.$router.go(-1)
            }
          } else {
            this.$Toast(res.info ? res.info : '提交失败')
          }
        })
      },
      deleteVehicle() {
        // 删除车辆接口
        Dialog.confirm({
          title: '提示',
          message: '是否删除该车辆?'
        }).then(() => {
          this.$request.post('/app/json/user/deleteVehicle', {
            id: this.vehicleItem.id,
            plateNum: this.plateNum // 车牌号
          }).then(res => {
            if (res.status === 0) {
              if (this.$route.query.source == 1) {
                this.$router.go(-2)
              } else {
                this.$router.go(-1)
              }
            } else {
              this.$Toast(res.info ? res.info : '删除失败')
            }
          })
        }).catch(() => {
        })
      },
      saveVehicle() {
        // 添加车辆接口---保存按钮
        this.$request.post('/app/json/user/saveVehicle', {
          imageUrl: this.identifyState.imageUrl, // 行驶证首页url
          ownerName: this.identifyState.ownerName, // 所有人姓名
          vin: this.identifyState.vin, // 车辆识别代号
          engineNum: this.identifyState.engineNum, // 发动机号
          vehType: this.identifyState.vehType, // 车辆类型
          plateNum: this.plateNum, // 车牌号
          brand: this.brand, // 车辆品牌
          brandModel: this.brandModel, // 车辆品牌
          vehColor: this.vehColor // 车辆颜色
        }).then(res => {
          if (res.status === 0) {
            if (this.$route.query.source == 1) {
              this.$router.go(-2)
            } else {
              this.$router.go(-1)
            }
          } else {
            this.$Toast(res.info ? res.info : '保存失败')
          }
        })
      }
      ,
      openCarAuthentication() {
        // 打开行驶认证
        if (this.identifyState.idState != 1 && this.identifyState.blackCheckVehicle == 1) {
          this.$Toast('请先完成实名认证！')
        } else if (this.plateNum == '') {
          this.$Toast('请输入车牌号！')
        } else if (this.plateNum.search(check) == -1) {
          this.$Toast('请输入合法车牌号！')
        } else if (this.vehicleItem.isValid != 1 && this.vehicleItem.examineState != 2) {
          this.setIdentifyState(this.$assign({}, this.identifyState, {
            plateNum: this.plateNum, // 车牌号
            imageUrl: this.identifyState.imageUrl, // 行驶证首页url
            ownerName: this.identifyState.ownerName, // 所有人姓名
            vin: this.identifyState.vin, // 车辆识别代号
            engineNum: this.identifyState.engineNum, // 发动机号
            vehType: this.identifyState.vehType, // 车辆类型
            brand: this.brand, // 车辆品牌
            brandModel: this.brandModel, // 车辆品牌
            vehColor: this.vehColor // 车辆颜色
          }))
          this.$bridgefunc.vuexStorage()
          this.$router.push({
            path: '/vehicle-authentication',
            query: {plateNum: this.plateNum}
          })
        }
      }
      ,
      inputKey (val) {
        if (this.plateNum.length < 8) {
          this.plateNum = this.plateNum + val
        }
      },
      deleteKey() {
        this.plateNum = this.plateNum.substr(0, this.plateNum.length - 1)
      },
      ...mapMutations(['setIdentifyState'])
    },
    computed: {
      ...mapGetters(['identifyState'])
    },
    components: {
      [Dialog.name]:
      Dialog,
      VirtualKeyboard
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .bind-car {
    background-color: #f8f8f8 !important

    .bind-car-container {
      .container {
        position absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 11px 0
      }

      .bind-car-content {
        padding: 0 15px
        background #fff
        font-size: 14px
      }

      .show-info {
        padding: 0 15px
        background #fff
        font-size: 14px
        margin-bottom: 10px

        .special {
          padding: 0
        }

        /deep/ .van-cell:not(:last-child)::after {
          border: none
        }

        /deep/ .van-cell {
          padding: 15px
        }

        /deep/ .van-collapse-item__content {
          padding: 0
        }

        .content-show {
          .left, .info {
            color: $color-text
          }

          .table-view-cell:after {
            border: none
          }

          .upload-vehicle {
            margin-top: 10px
          }
        }
      }

      .audit-btn {
        position fixed
        bottom: 10px
        left: 10px
        right: 10px
        display flex
        justify-content center
        align-items center

        .btn {
          flex: 1
          background $color-theme-r
          color: #fff
          padding: 13px 15px
          text-align center
          font-size: 16px
          border-radius 20px

          & + .btn {
            margin-left: 10px
          }
        }

        .keep {
          border: 1px solid $color-theme-r
          background #fff
          color: $color-theme-r
        }
      }
    }
  }

  .right {
    flex: 1
    color: $color-text

    input {
      line-height 28px
      width: 100%
      text-align right
    }
  }

  .vehicle {
    line-height 28px

    .table-view-cell-arrow {
      color: $color-text-d
    }

    .right {
      text-align right
    }
  }

  .delete-img {
    font-size: 16px
    color: $color-theme-r
    text-align right
    margin-right: 15px
  }

  /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
    background: #F80F16
    color: #fff
  }

  .tips-dialog {
    text-align center
    padding: 50px 0
  }
</style>
