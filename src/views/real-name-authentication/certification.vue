<template>
  <div class="certification">
    <nav-top title="认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="certification-container">
      <div class="table-view" v-if="complete">
        <div class="table-view-cell item" v-if="checkStatus.checkIdentify == 1" @click="openRealName">
          <div class="table-view-cell-text info">
            <div class="left">实名认证</div>
            <div class="right" v-if="identifyInfo != '' && identifyInfo.isValid == 1 && identifyInfo.examineState == 1">
              <div class="name">{{identifyInfo.name}}</div>
              <div class="id-card">{{dealNum(identifyInfo.idcardNum)}}</div>
            </div>
            <div class="state-tips" v-if="identifyInfo.examineState == 2">审核中</div>
          </div>
          <div class="table-view-cell-arrow status"
               v-if="identifyInfo == '' || (identifyInfo.isValid == '' && identifyInfo.examineState == '')">未认证
          </div>
          <div class="table-view-cell-arrow status" v-if="identifyInfo.examineState == 3">审核未通过</div>
        </div>
        <div class="table-view-cell item" v-if="checkStatus.checkDriving == 1" @click="openDriving">
          <div class="table-view-cell-text info">
            <div class="left">驾驶认证</div>
            <div class="state-tips" v-if="driverInfo != '' && driverInfo.status == 1 && driverInfo.examineState == 1">
              已认证
            </div>
            <div class="state-tips" v-else-if="driverInfo.examineState == 2">审核中</div>
          </div>
          <div class="table-view-cell-arrow status" v-if="driverInfo == ''">未认证</div>
          <div class="table-view-cell-arrow status" v-if="driverInfo.examineState == 3">审核未通过</div>
        </div>
        <div class="table-view-cell item" v-if="checkStatus.checkVehicle == 1" @click="openVehicle">
          <div class="table-view-cell-text info">车辆认证</div>
          <div class="table-view-cell-arrow status" v-if="isValid == 1">已认证</div>
          <div class="table-view-cell-arrow status" v-else-if="isValid == 2">审核中</div>
          <div class="table-view-cell-arrow status" v-else-if="isValid == 3">审核未通过</div>
          <div class="table-view-cell-arrow status" v-else>未认证</div>
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
        showInfo: true,
        complete: false,
        identifyInfo: '', // 身份认证信息
        driverInfo: '', // 驾驶证认证信息
        isValid: '', // 车辆是否认证
        checkStatus: '' // 配置
      }
    },
    mounted() {
      this.__init() // 初始化
    },
    methods: {
      __init() {
        let p1 = this.checkIdentify() // 查看身份信息(是否验证)接口
        let p2 = this.checkDriverInfo() // 驾驶证详情(是否通过验证)接口
        let p3 = this.getVehicleListByUserId() // 根据用户ID查询车辆列表接口
        let p4 = this.checkcertificate() // 获取首页配置接口
        Promise.all([p2, p1, p3, p4]).then(() => {
          this.complete = true
        })
      },
      checkcertificate() {
        /**
         * 1.
         * 获取首页配置接口 1 是需要认证,需要看到,其他就是不需要
         * checkDriving  checkIdentify  checkVehicle
         * 2.
         * blackCertification // 后台审核各个证件0：不审核，1：后台人工审核，2：调用接口审核
         * blackCheckDriving // 驾驶证认证验证身份证
         * blackCheckVehicle // 车辆行驶证认证验证身份证
         * 3.
         * examineState // 审核状态 0未审核 1审核成功 2审核中 3审核失败
         * isValid // 是否认证（0：未认证 1：已认证
         * 只有examineState为1 的时候isValid一定是1  其他examineState的状态isValid都是0  或者空  车辆认证没有isValid
         */
        this.$request.post('/app/json/user/checkcertificate').then(res => {
          if (res.status === 0) {
            this.checkStatus = res.data
            this.setIdentifyState(this.$assign({}, this.identifyState, {
              blackCheckVehicle: this.checkStatus.blackCheckVehicle,
              blackCheckDriving: this.checkStatus.blackCheckDriving
            }))
            this.$bridgefunc.vuexStorage()
            console.log(this.checkStatus)
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      checkIdentify() {
        // 查看身份信息(是否验证)接口
        this.$request.post('/app/json/user/checkIdentify').then(res => {
          if (res.status === 0) {
            this.identifyInfo = res.data
            this.setIdentifyState(this.$assign({}, this.identifyState, {idState: this.identifyInfo.isValid}))
            this.$bridgefunc.vuexStorage()
          } else {
            this.$Toast(res.info ? res.info : '获取身份信息失败')
          }
        })
      },
      checkDriverInfo() {
        // 驾驶证详情(是否通过验证)接口
        this.$request.post('/app/json/user/checkDriverInfo').then(res => {
          if (res.status === 0) {
            this.driverInfo = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取驾驶证信息失败')
          }
        })
      },
      getVehicleListByUserId() {
        // 根据用户ID查询车辆列表接口 只要列表有一个是认证就是认证
        this.$request.post('/app/json/user/getVehicleListByUserId').then(res => {
          if (res.status === 0) {
            let list = res.data ? res.data : []
            this.isValid = ''
            for (let i = 0; i < list.length; i++) {
              let item = list[i]
              if (item.isValid == 1) { // 已认证
                this.isValid = item.isValid
                break
              } else if (item.examineState == 2) { // 审核中
                this.isValid = item.examineState
                break
              } else if (item.examineState == 3) { // 审核未通过
                this.isValid = item.examineState
              }
            }
          } else {
            this.$Toast(res.info ? res.info : '获取车辆信息失败')
          }
        })
      },
      dealNum(num) {
        // 处理卡号
        if (num.length == 18) {
          num = num.split('')
          num.splice(2, 14, '**************')
          return num.join('')
        } else if (num.length == 15) {
          num = num.split('')
          num.splice(2, 11, '***********')
          return num.join('')
        }
      },
      openRealName() {
        // 打开实名认证
        if (this.identifyInfo.examineState == 3) { // 审核未通过
          this.$router.push({
            path: '/audit-results',
            query: {
              examineMsg: this.identifyInfo.examineMsg,
              id: this.identifyInfo.id,
              source: 'identify',
              num: this.driverInfo.driveCode,
              name: this.driverInfo.name
            }
          })
        } else if (this.identifyInfo == '' || (this.identifyInfo.isValid == '' && this.identifyInfo.examineState == '')) { // 未审核
          this.$router.push({path: '/real-name-authentication', query: {num: this.driverInfo.driveCode}})
        }
      },
      openDriving() {
        // 打开驾驶认证
        if (this.checkStatus.blackCheckDriving == 1 && this.identifyInfo.isValid != 1) {
          this.$Toast('请先完成实名认证！')
        } else if (this.driverInfo.examineState == 3) { // 审核未通过
          this.$router.push({
            path: '/audit-results',
            query: {
              examineMsg: this.driverInfo.examineMsg,
              id: this.driverInfo.id,
              source: 'driver',
              num: this.identifyInfo.idcardNum,
              name: this.identifyInfo.name
            }
          })
        } else if (this.driverInfo == '') { // 未审核
          this.$router.push({path: '/driving-certification', query: {num: this.identifyInfo.idcardNum}})
        }
      },
      openVehicle() {
        // 打开车辆认证
        this.$router.push({path: '/vehicle-certification'})
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
  .certification {
    background-color: #f8f8f8 !important

    .item {
      margin-top: 8px
      font-size 14px

      .info {
        height: 30px
      }

      .right {
        height: 100%
        color: $color-text-d
        text-align right
        font-size: 12px
        display flex
        justify-content space-between
        align-items right
        flex-direction column
      }

      .state-tips {
        display flex
        justify-content center
        align-items center
        font-size: 12px
        color: $color-text-d
      }

      .status {
        color: $color-text-d
        font-size: 12px
      }
    }

    .special {
    }
  }
</style>
