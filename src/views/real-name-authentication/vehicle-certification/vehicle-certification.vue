<template>
  <div class="vehicle-certification">
    <nav-top title="车辆认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="vehicle-certification-container" v-if="complete">
      <div class="container" v-if="vehicleList.length == 0">
        <div class="title">
          <div class="left">我的车辆</div>
          <div class="right">添加</div>
        </div>
        <div class="add-car" @click="bindCarNo">
          <div class="img">
            <img src="../image/icon8@2x.png" alt="">
          </div>
          <div class="tips">绑定车辆</div>
        </div>
      </div>
      <div class="container" v-else v-for="(item, index) in vehicleList" :key="index">
        <div class="title" v-if="index == 0" @click="openAddCar">
          <div class="left">我的车辆</div>
          <div class="right active">添加</div>
        </div>
        <div class="success-car" @click="bindCar(item)">
          <div class="table-view success-car-table">
            <div class="table-view-cell success-car-view-cell">
              <div class="table-view-cell-text success-car-cell-text">
                <div class="left">
                  <div class="img">
                    <img src="../image/gh@2x.png" alt="" v-show="haveCar">
                    <img src="../image/icon5@2x.png" alt="" v-show="!haveCar">
                  </div>
                  <div class="car-info">
                    <div class="car-num">{{item.plateNum}}</div>
                    <div class="car-style">{{item.brand ? item.brand : '--'}}</div>
                  </div>
                </div>
                <div class="right" v-if="item.examineState == 1">已认证</div>
              </div>
              <div class="table-view-cell-arrow no-success" v-if="item.examineState == 3">审核未通过</div>
              <div class="table-view-cell-arrow no-success" v-else-if="item.examineState == 2">审核中</div>
              <div class="table-view-cell-arrow no-success" v-else-if="item.examineState == 0">未认证</div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        add: true,
        complete: false,
        haveCar: false,
        vehicleList: [] // 车辆列表
      }
    },
    mounted() {
      this.getVehicleListByUserId()
    },
    methods: {
      getVehicleListByUserId() {
        // 根据用户ID查询车辆列表接口 只要列表有一个是认证就是认证
        this.$request.post('/app/json/user/getVehicleListByUserId').then(res => {
          this.complete = true
          if (res.status === 0) {
            this.vehicleList = res.data ? res.data : []
            let preResult = []
            let sufResult = []
            let list = res.data ? res.data : []
            list.forEach(item => {
              if (item.isValid == 1) {
                sufResult.push(item)
              } else {
                preResult.push(item)
              }
            })
            this.vehicleList = [...sufResult, ...preResult]
          } else {
            this.$Toast(res.info ? res.info : '获取车辆信息失败')
          }
        })
      },
      bindCar(item) {
        // 绑定车辆--有绑定的
        if (item.examineState == 3) {
          this.$router.push({
            path: '/audit-results',
            query: {examineMsg: item.examineMsg, vehicleInfo: JSON.stringify(item), source: 'vehicle'}
          })
        } else {
          this.setIdentifyState(this.$assign({}, this.identifyState, {
            plateNum: item.plateNum, // 车牌号
            imageUrl: item.imageUrl, // 行驶证首页url
            ownerName: item.ownerName, // 所有人姓名
            vin: item.vin, // 车辆识别代号
            engineNum: item.engineNum, // 发动机号
            vehType: item.vehType, // 车辆类型
            brand: item.brand, // 品牌车系
            brandModel: item.brandModel, // 车型
            vehColor: item.vehColor // 车辆颜色
          }))
          this.$bridgefunc.vuexStorage()
          this.$router.push({
            path: '/bind-car',
            query: {vehicleItem: JSON.stringify(item), vehicleListLength: this.vehicleList.length}
          })
        }
      },
      bindCarNo() {
        // 绑定车辆--无绑定的
        this.setIdentifyState(this.$assign({}, this.identifyState, {
          plateNum: '', // 车牌号
          imageUrl: '', // 行驶证首页url
          ownerName: '', // 所有人姓名
          vin: '', // 车辆识别代号
          engineNum: '', // 发动机号
          vehType: '', // 车辆类型
          brand: '', // 品牌车系
          brandModel: '', // 车型
          vehColor: '' // 车辆颜色
        }))
        this.$bridgefunc.vuexStorage()
        this.$router.push({path: '/bind-car'})
      },
      openAddCar() {
        // 添加车辆
        this.setIdentifyState(this.$assign({}, this.identifyState, {
          plateNum: '', // 车牌号
          imageUrl: '', // 行驶证首页url
          ownerName: '', // 所有人姓名
          vin: '', // 车辆识别代号
          engineNum: '', // 发动机号
          vehType: '', // 车辆类型
          brand: '', // 品牌车系
          brandModel: '', // 车型
          vehColor: '' // 车辆颜色
        }))
        this.$bridgefunc.vuexStorage()
        if (this.vehicleList.length != 0) {
          this.$router.push({path: '/bind-car'})
        }
      },
      ...mapMutations(['setIdentifyState'])
    },
    computed: {
      ...mapGetters(['identifyState'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .vehicle-certification {
    background-color: #f8f8f8 !important

    .vehicle-certification-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding: 11px 0

      .container {
        background: #fff
        padding: 11px 15px
        margin-bottom: 10px

        .title {
          display flex
          justify-content space-between
          align-items center
          padding: 5px 0 15px 0
          font-size 14px

          .right {
            color: $color-text-l
          }

          .active {
            color: $color-theme-r
          }
        }

        .add-car {
          height: 110px
          display flex
          justify-content center
          align-items center
          flex-direction column
          border-radius 6px
          background #f6f6f6
          color: $color-text-d
          line-height 24px

          .img {
            img {
              width: 35px
              height: 35px
            }
          }
        }

        .success-car {
          padding: 20px 0
          border-radius 6px
          background #f6f6f6
          color: $color-text
          font-size: 14px

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

        .tips {
          .tips-info {
            padding: 11px 0 0 0

            .left {
              display flex
              justify-content center
              align-items center

              img {
                width: 20px
                height: 20px
                margin-right: 10px
              }
            }
          }

          .special {
            top: 70%
          }
        }
      }
    }
  }
</style>
