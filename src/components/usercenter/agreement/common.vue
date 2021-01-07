/**Created by steven on 2019/1/4.*/

<template>
  <div class="agreement theme_bg_white">
    <div class="content" >
      <AgreementContent :value="value" :noloading="'true'"></AgreementContent>
    </div>
  </div>
</template>

<script>
  import AgreementContent from '../register/agreement-content'
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
        topTitle:'注册协议',
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
      this.value = this.$route.query.value
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
