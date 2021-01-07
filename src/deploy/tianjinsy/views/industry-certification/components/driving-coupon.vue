<template>
  <div>
    <van-popup v-model="show" position="bottom" round closeable @click-close-icon="closeHandle" :style="{ height: '50%' }"
               :close-on-click-overlay="false">
      <div class="coupon-content">
        <div class="coupon-title">
          {{couponTitle}}
        </div>
        <van-radio-group v-model="result" :max="1">
          <van-radio class="coupon-item" v-for="(item, index) in couponList" :key="item.dictKey" :name="item.dictKey">
            {{item.dictValue}}
          </van-radio>
        </van-radio-group>
        
        <span class="coupon-btn" @click="couponBtnHandle">确定</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
  export default {
    props: {
      couponList: {
        type: Array,
        required: true,
        default() {
          return []
        }
      },
      couponTitle: String,
    },
    data() {
      return {
        show: true,
        result: ''
      }
    },
    mounted() {
    },
    methods: {
      closeHandle() {
        this.$parent.closeCoupon()
      },
      couponBtnHandle() {
        if (this.result || this.result == 0) {
          let dictkeyName = ''
          this.couponList.forEach(item => {
            if (item.dictKey == this.result) {
              dictkeyName = item.dictValue
            }
          })
          this.$emit('couponDataHandle', {dictKey: this.result, dictValue: dictkeyName})
        }
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .coupon-content {
    padding 15px;
    position relative;
    height 100%;
    
    .coupon-title {
      font-size: 16px;
      margin-bottom: 10px;
    }
    
    .coupon-item {
      margin-bottom 8px;
    }
    
    .coupon-btn {
      position absolute;
      height 40px;
      left 0;
      right 0;
      bottom 0;
      text-align center;
      font-size 16px;
      background red;
      line-height: 40px;
      color: #fff;
    }
  }
</style>