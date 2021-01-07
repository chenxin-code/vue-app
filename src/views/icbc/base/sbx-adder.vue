<template>
  <div class="sbx-adder" :class="{disabled}">
    <div class="btn-add" @click="testNumber(value+1)"><van-icon name="plus" /></div>
    <div class="num">
      <input :disabled="disabled" ref="inp" type="text" :value="value" @input="changeNumber($event.target.value)" @blur="testNumber($event.target.value)"/>
    </div>
    <div class="btn-minus" @click="testNumber(value-1)"><i class="icon iconfont mall-jianhao"></i></span></div>
  </div>
</template>

<script>
export default {
  name: "sbx-adder",
  components: {},
  props: {
    value: {
      default: 1,
    },
    max:{
      type:Number,
      default: 999
    },
    disabled:{
      type:Boolean,
      default:false,
    },
  },
  model:{
    prop:'value',
    event:'change'
  },
  methods: {
    changeNumber(val){
      this.$emit('change', val);
    },
    fetchChange(val){
      this.$emit('on-change', val);
    },
    testNumber(val){
      if(this.disabled) return;
      val = Number((val+'').replace(/[^\d]/g,''));
      val<1 ? val = 1 : null;
      val>this.max ? val = this.max : null;
      this.changeNumber(val);
      this.fetchChange(val);
    }
  },
};
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>

.sbx-adder {
  display: flex;

  .btn-add, .btn-minus {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #FF3C55;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #fff;
    font-weight: bold;
  }

  .num {
    width: 30px;

    input {
      width: 100%;
      height: 100%;
      text-align: center;
    }
  }
  
  &.disabled{
    .btn-add, .btn-minus {
      background-color: #ccc;
    }
  }
}
</style>