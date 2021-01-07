<template>
  <div class="audit-result">
    <nav-top title="审核结果" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="audit-result-container">
      <div class="audit-info">
        <div class="img">
          <img src="./image/icon3@2x.png" alt="">
        </div>
        <div class="audit-state">审核未通过！</div>
        <div class="result">原因：{{examineMsg}}</div>
      </div>
      <div class="audit-btn" @click="againAudit">
        <div class="btn">重新认证</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        examineMsg: '', // 原因
        source: '', // identify 实名认证  driver 驾驶证 vehicle 车辆 行驶证
        name: '', // 姓名
        num: '', // 身份证号
        vehicleInfo: '' // 行驶证认证信息
      }
    },
    mounted() {
      this.examineMsg = this.$route.query.examineMsg ? this.$route.query.examineMsg : '--'
      this.source = this.$route.query.source
      this.id = this.$route.query.id
      if (this.$route.query.num) {
        this.num = this.$route.query.num
      }
      if (this.$route.query.name) {
        this.name = this.$route.query.name
      }
      if (this.$route.query.vehicleInfo) {
        this.vehicleInfo = JSON.parse(this.$route.query.vehicleInfo)
      }
    },
    methods: {
      againAudit() {
        // 重新认证 -- 判断页面来源
        if (this.source == 'identify') {
          this.$router.push({
            path: '/real-name-authentication',
            query: {num: this.num, name: this.name, id: this.id, source: '1'}
          }) // 1 代表是从审核结果页面过去的
        } else if (this.source == 'driver') {
          this.$router.push({
            path: '/driving-certification',
            query: {num: this.num, name: this.name, id: this.id, source: '1'}
          })
        } else if (this.source == 'vehicle') {
          this.setIdentifyState(this.$assign({}, this.identifyState, {
            plateNum: this.vehicleInfo.plateNum, // 车牌号
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
          this.$router.push({path: '/bind-car', query: {vehicleItem: JSON.stringify(this.vehicleInfo), source: '1'}})
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
  .audit-result {
    background-color: #f8f8f8 !important

    .audit-result-container {
      .audit-info {
        background #fff
        margin: 10px 0
        text-align center
        line-height 24px
        padding: 20px 0
        font-size: 14px

        .img {
          padding-bottom: 10px

          img {
            width: 80px
            height: 80px
          }
        }

        .audit-state {

        }

        .result {
          color: $color-text-d
          font-size: 12px
        }
      }

      .audit-btn {
        position fixed
        bottom: 0
        left: 0
        right: 0

        .btn {
          background $color-theme-r
          color: #fff
          padding: 13px 15px
          text-align center
          font-size: 16px
        }
      }
    }
  }
</style>
