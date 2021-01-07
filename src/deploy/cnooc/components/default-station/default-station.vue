<template>
  <div>
    <div @click="changeStation" class="station-chose">
      <img class="icon" src="./images/position-icon.png" alt />
      <span v-if="stationName">{{ stationName }}</span>
      <span v-else>{{ defaultStation }}</span>
    </div>
    <van-popup v-model="popupVisible" :get-container="getContainer" position="bottom">
      <van-picker
        v-if="getType == 0"
        :columns="slots"
        value-key="stationName"
        @cancel="popupVisible = false"
        @confirm="confirm"
        :show-toolbar="true"
      ></van-picker>
      <van-picker
        v-else
        :columns="slots"
        value-key="ouName"
        @cancel="popupVisible = false"
        @confirm="confirm"
        :show-toolbar="true"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import { Picker, Popup } from 'vant'
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultStationName: {
      type: String,
      required: false,
      default: '',
    },
    // 1获取地市公司||0获取常用站(默认)
    getType: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      popupVisible: false,
      defaultStation: '暂无默认加油加气站',
      changedStation: null,
      slots: [],
    }
  },
  created() {},
  mounted() {
    if (this.getType == 0) {
      this.initStationList()
    } else if (this.getType == 1) {
      this.initSubAccount()
    }
  },
  methods: {
    // 获取常用站
    initStationList() {
      this.$http.post('/app/json/station/findCommonStationList', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            // 抛出常用站列表
            this.$emit('getComUseStationList', data.data)
            data.data.forEach((item, index) => {
              if (item.isDefault == 1) {
                this.defaultStation = item.stationName
                // 抛出默认站信息
                if (this.$store.state.refuelStation.stationName) {
                  // store中有油站
                  this.$emit(
                    'getDefaultStation',
                    this.$store.state.refuelStation
                  )
                } else {
                  this.$emit('getDefaultStation', item)
                }
                // 默认站重排序(解决给slots赋值导致onValuesChange事件自动执行，展示站变化问题)
                data.data.unshift(data.data.splice(index, 1)[0])
                this.slots = data.data
              }
            })
          } else {
            this.$Toast(data.info)
          }
        })
        // .catch(() => {
        //   this.$Toast('加载常用加油加气站列表出错')
        // })
    },
    // 获取地市公司
    initSubAccount() {
      this.$http.post('/app/json/account/listSubAccount', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            this.slots = data.data || []
          }
        })
        .catch(() => {
          this.$Toast('加载地市公司列表出错')
        })
    },
    changeStation() {
      if (!this.disabled) {
        this.popupVisible = true
      }
    },
    confirm(value, index) {
      this.$store.commit('setStationInfo', value)
      this.$emit('getCurrentStation', value)
      this.popupVisible = false
    },
    getContainer() {
      return document.getElementsByTagName('body')[0]
    },
  },
  computed: {
    stationName() {
      if (this.$store.state.refuelStation.stationName) {
        return this.$store.state.refuelStation.stationName
      } else {
        return false
      }
    },
  },
  watch: {},
  components: {
    VanPopup: Popup,
    VanPicker: Picker,
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.station-chose {
  font-size: 15px;
  line-height: 50px;
  margin: 0 15px;
  background: url('./images/chose-station-bg.png') no-repeat;
  background-size: cover;
  border-radius: 5px;
  position: relative;

  .icon {
    width: 15px;
    vertical-align: middle;
    margin-left: 20px;
  }

  span {
    padding-left: 5px;
  }
}
</style>
