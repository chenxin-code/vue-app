
<template>
  <div class="steps">
    <van-steps :active="activeContent.activeObj.index" active-color="red">
      <van-step v-for="(item,index) in activeContent.steps" :key="index">
        <p>{{item.lable}}</p>
      </van-step>
    </van-steps>
    <van-cell-group>
      <van-field v-model="activeContent.clusterName" label="行业群组:" input-align="right" :readonly='true' border/>
      <van-field v-if="activeContent.activeObj.type !='qualifications'" v-model="activeContent.activeObj.lable" label="证件名称:" input-align="right" :readonly='true' border/>
    </van-cell-group>
    <slot></slot>
    <div class="bottom-btns">
      <!--bug 35797 让如此修改，其实我不懂，有错别喷-->
       <span @click="openingBtn">{{activeContent.activeObj.index == activeContent.steps.length-2?'提交审核':'下一步'}}</span>
      <!--<span @click="openingBtn">提交审核</span>-->
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "steps",
  mixins: [mixin],
  props: {
    activeContent: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    openingBtn() {
      this.$emit("activeBtn", this.activeContent.activeObj);
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.steps {
  width: 100%;
  max-height: calc(100% - 46px);
  overflow-y: auto;
  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 46px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 100%;
      height: 46px;
      color: #fff;
      font-size: 16px;
      display: inline-block;
      background-color: #f02e2c;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
/deep/ .van-steps--horizontal {
  padding 14px 34px
  margin-bottom 10px
}
/deep/ .van-step--finish .van-step__line{
  background-color red
}
/deep/ .van-step--finish .van-step__circle{
  background-color red
}
/deep/ .van-step--horizontal:first-child .van-step__title {
  margin-left -12px
}
/deep/ .van-step--horizontal:last-child .van-step__title {
  margin-right -20px
}
</style>
