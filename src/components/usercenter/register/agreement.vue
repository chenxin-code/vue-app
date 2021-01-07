/**Created by steven on 2019/1/4.*/

<template>
  <div class="agreement theme_bg_white">
    <nav-top :title="topTitle"  @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="content" >
        <AgreementContent :value="value"></AgreementContent>
      </div>
    </nav-content>
  </div>
</template>

<script>
import AgreementContent from './agreement-content'
export default {
  name: "agreement",
  components: {
    AgreementContent
  },
  props: ['propsValue'],
  data () {
    return {
      //3代表注册协议
      value:'',
      topTitle:'协议',
    }
  },
  methods: {
    backEvent:function(){
      if (this.propsValue) {
        this.$emit('backEvent')
        return ;
      }
      this.$router.go(-1);
    },
  },
  created () {
    this.value = this.$route.query.value?this.$route.query.value:3;
    this.topTitle = '协议';
    if (this.propsValue) {
      this.value = this.propsValue
    }
    if (this.$store.state.webtype != 3) {
      if(this.value == 9){
        this.topTitle = '发票须知';
        document.title = '发票须知';
      } else if(this.value == 10){
        this.topTitle = '积分规则';
        document.title = '积分规则';
      } else if(this.value == 11){
        this.topTitle = '积分使用规则';
        document.title = '积分使用规则';
      } else if(this.value == 17){
        this.topTitle = '用户协议';
        document.title = '用户协议';
      } else if(this.value == 18){
        this.topTitle = '捐赠协议';
        document.title = '捐赠协议';
      } else if(this.value == 63){
        this.topTitle = '隐私协议';
        document.title = '隐私协议';
      }  else if(this.value == 65){
        this.topTitle = '使用规则';
        document.title = '使用规则';
      } else if(this.value == 80){
        this.topTitle = '使用规则';
        document.title = '使用规则';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
.agreement {
  position fixed;
  z-index 199;
  width 100%
  height 100%
  overflow hidden
  .content{
    padding 20px 10px
    width 100%
    height 100%
    overflow auto
    -webkit-overflow-scrolling touch
  }
}
</style>
