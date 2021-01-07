<template>
  <div :class="{'disabled': item.couUseType !== 1}" class="coupon-detail" v-if="item">
    <!-- 洗车券 -->
    <div v-if="item.couCategory == 10" class="left-xc">
      <div class="num">{{item.couFaceValue}}</div>
      <div class="desc">洗车券</div>
    </div>
    <!-- 满减券 -->
    <div class="left" v-else>
      <div class="num">{{item.couFaceValue}}</div>
      <div class="desc">满{{item.couThresholdAmount}}减{{item.couFaceValue}}</div>
    </div>
    <div class="right">
      <div class="name">{{item.couTypeTitle}}</div>
      <div class="date">{{item.startDate}} 至 {{item.endDate}}</div>
      <div class="cou-type-code">券类型编码：{{ item.couTypeCode }}</div>
      <slot name="bottom">
        <!-- couUseType 0不可用 1可用 2待激活 3 已使用 4 （未使用）已过期 -->
        <img
          class="status-desc"
          v-if="item.couUseType === 0"
          src="../../assets/images/disabled.png"
        />
        <img
          class="status-desc"
          v-else-if="item.couUseType === 2"
          src="../../assets/images/toactivate.png"
        />
        <img
          class="status-desc"
          v-else-if="item.couUseType === 3"
          src="../../assets/images/used.png"
        />
        <img
          class="status-desc"
          v-else-if="item.couUseType === 4"
          src="../../assets/images/expired.png"
        />
        <img class="status-desc" v-else src="../../assets/images/unused.png" />
        <span v-if="item.couponTotal" class="coupon-num">共{{ item.couponTotal }}张</span>
        <span v-if="useType == 0" class="details-text">点击查看详情</span>
      </slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: {
    item: Object,
    useType: Number, // 0 列表 1 详情
  },
  data() {
    return {}
  },
  methods: {},
  computed: {},
  components: {},
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.coupon-detail {
  display: flex;
  padding: 8px;
  background: #fff;
  position: relative;

  &.disabled::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index 2
  }

  .left, .left-xc {
    background: url('./bg.png') no-repeat;
    background-size: 100% 100%;
    width: 80px;
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: $color-sub-theme;
    text-align: center;

    .num {
      font-size: 22px;
    }

    .desc {
      padding-top: 6px;
      font-size: 12px;
    }
  }

  .left-xc {
    background: url('./bg-x.png') no-repeat;
    background-size: 100% 100%;
  }

  .right {
    padding: 0 10px;
    overflow: hidden;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .name {
      font-size: 15px;
      font-weight: 600;
      padding-right: 35px;
      padding-top: 2px;
      ellipse();
    }

    .date {
      font-size: 12px;
    }

    .cou-type-code {
      font-size: 12px;
      color: $color-gray;
      padding-bottom: 12px;
    }

    .tip {
      ellipse();
      font-size: 12px;
      color: $color-gray;
      max-width: 208px;
    }

    .status-desc {
      position: absolute;
      right: 10px;
      top: 5px;
      width: 30px;
    }

    .coupon-num {
      color: $color-theme;
      font-size: 13px;
      font-weight: 700;
      display: block;
      position: absolute;
      right: 7px;
      top: 50%;
    }

    .details-text {
      font-size: 13px;
      color: $color-theme;
      display: block;
      position: absolute;
      right: 5px;
      bottom: 0;
    }
  }
}
</style>
