<template>
  <div class="content">
    <div class="info">
      <div class="message" v-show='show'>
        {{message}}
      </div>
      <div class="success" v-show='!show'>
        <div class="success_con">恭喜您验证手机号成功！</div>
        <div class="timemessage font-small-l">
          {{count}}s之后自动跳转到首页
        </div>
        <button class="backHomeButton" @click="jumpHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {

    name: 'Template',
    components: {
      Toast
    },
    data() {
      return {
        count: 5,
        timer: null,
        message: ''
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      begainGo () {
        if (!this.timer) {
          let maxCount = this.count
          this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= maxCount) {
                this.count--
              } else {
                clearInterval(this.timer)
                this.timer = null
                this.jumpHome();
              }
        }, 1000)
        }
      },
      jumpHome:function () {
        this.$bridgefunc.customGo(-2);
      }
    },
    created() {
      this.begainGo()
      this.message = this.$route.query.message?this.$route.query.message:'';
    },
    computed: {
      show () {
        return (this.message.length !== 0)
      }
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .content{
    background-color: #f0f0f0;
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    .info{
      text-align: center;
      .message{
        color: $color-theme-o;
        font-size: 18px;
      }
      .success_con{
        color: $color-theme-o;
        font-size: 18px;
      }
      .backHomeButton{
        font-size:14px;
        height: 25px;
        width: 100px;
        border-radius: 5px;
        color: white;
        background-color: $color-theme-btn-l;
        border: none;

      }

    }
  }

</style>
