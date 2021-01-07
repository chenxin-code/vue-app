<template>
  <div class="newlyperson mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="field">
        <mt-field class="mt-title border" label="姓名" placeholder="请填写正确的姓名" v-model="name"></mt-field>
        <mt-field class="mt-title border" label="身份证号" placeholder="凭身份证入园，请填写正确" v-model="Idcard"></mt-field>
        <mt-field class="mt-title border" label="手机号码" placeholder="用于接受确认短信" v-model="phone"></mt-field>
      </div>
      <div class="bottom-btn">
        <p class="theme_bg_white" @click="cancelEvent">取消</p>
        <p class="theme_bg_red theme_font_white"  @click="saveEvent">保存</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import { Field } from 'mint-ui';
  import {Indicator, Toast} from 'mint-ui';
  export default {
    name: 'newlyperson',
    components: {
      Field,
      Indicator,
      Toast
    },
    data() {
      return {
        name: '',
        Idcard:'',
        phone:''
      }
    },
    methods: {
      cancelEvent: function () {//取消
        console.log('testFunc')
        this.$router.go(-1)
      },
      saveEvent:function () {//保存
        // if (this.phone === '' || !this.$util.checkMobile(this.phone)) {
        //   Toast({
        //     message: '请输入正确的手机号码',
        //     position: 'bottom',
        //     duration: 2000,
        //   });
        //   return;
        // }
        // if (this.name === '') {
        //   Toast({
        //     message: '请输入正确的姓名',
        //     position: 'bottom',
        //     duration: 2000,
        //   });
        //   return;
        // }
        // if (this.Idcard === '' || this.Idcard.length!=18) {
        //   Toast({
        //     message: '请输入正确的身份证号码',
        //     position: 'bottom',
        //     duration: 2000,
        //   });
        //   return;
        // }
        let people = {
          name: this.name,
          Idcard:this.Idcard,
          phone:this.phone
        }
        this.$store.state.mall2.tripPeopleList.push(people)
        this.$router.go(-1)
      }
    },
    created() {

    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .newlyperson{
    width 100%
    height 100%
    overflow hidden
    .field{
      padding 0px 10px
      .mt-title{
        height 50px
      }
    }
    .bottom-btn{
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;

      p{
        width 50%
        height 100%
        line-height 50px
        text-align center
        float left
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }
    .border{
      border-bottom 1px solid $color-text-lll
    }
  }

</style>
