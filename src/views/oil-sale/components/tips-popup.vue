<template>
  <div>
    <div class="icon-info" @click="openPopup">
      <span class="icon">
        <img width="20px" height="20px" src="static/image/mall2/area.png">
      </span>
    </div>
    <van-popup v-model="showOil" position="bottom">
      <van-picker
        show-toolbar
        :title="title"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        columns: [],
        showOil: false // 油库选择弹框
      }
    },
    props: {
      isOpenPopup: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '选择油库'
      }
    },
    mounted() {
    },
    methods: {
      onCancel() {
        // 取消按钮
        this.showOil = false
      },
      onConfirm(value, index) {
        this.showOil = false
        // this.$Toast(`当前值：${value}, 当前索引：${index}`)
        this.$emit('getOilInfo', value)
        this.$emit('getOilNameNum', value)
        this.$emit('getOilCard', value)
      },
      openPopup() {
        // 打开弹框
        if (this.isOpenPopup == true) {
          this.showOil = true
        } else {
          this.showOil = false
        }
      },
      queryPickUpDepot() {
        // 获取自提油库
        this.$request.post('/app/json/app_oil_sale/queryPickUpDepot', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            let arr = res.data
            let columns = []
            arr.map(item => {
              columns.push({text: item.name, code: item.code})
              return columns
            })
            this.columns = columns
            this.$emit('getPickUpDepot', columns)
          } else {
            this.$Toast(res.info ? res.info : '获取自提油库失败')
          }
        })
      },
      appQueryTakeOilCardList() {
        // 获取提油卡号
        this.$request.post('/app/json/app_oil_appoint/appQueryTakeOilCardList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            let arr = res.data
            let columns = []
            arr.map(item => {
              columns.push({text: item.userCard})
              return columns
            })
            this.columns = columns
          } else {
            this.$Toast(res.info ? res.info : '获取提油卡失败')
          }
        }).catch(err => {
          console.log(err)
        })
      },
      appQueryTakeOilNameList() {
        // 获取油品名称
        this.$request.post('/app/json/app_oil_appoint/appQueryTakeOilNameList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            let arr = res.data
            let columns = []
            arr.map(item => {
              columns.push({text: item.oilname})
              return columns
            })
            this.columns = columns
          } else {
            this.$Toast(res.info ? res.info : '获取油品名称失败')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /deep/ .van-popup {
    width: 100% !important
    border-radius 0 !important
  }

  .icon-info {
    position absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    .icon {
      display flex
      align-items center
      height: 100%
      position absolute
      right: 0
      padding-top: 8px
    }
  }
</style>
