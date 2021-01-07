<template>
	<div class="base_con">
		<div  @click="countDown" class="count-button1"  :disabled="disabled" ref="btnEl" >
			{{content}}
	  </div>
	</div>
</template>

<script>
  import Verify from '@/components/commonui/common-verify/index'

export default {
  props:[
    'phone'
	],
	data() {
		return {
			content: '获取验证码',
			totalTime: 60,
			disabled: false,
			clock: null,
		};
	},
	created () {
    console.log(this.$store.state.globalConfig.station_countdown); //验证码有效时长
    this.totalTime = this.$store.state.globalConfig.station_countdown * 60 || 60
	},
	methods: {
		countDown() {
		  if(!this.disabled){
		    if(!this.phone || this.phone == ''){
          this.$Toast('手机号不能为空');
		      return;
        }
        if(!this.$util.checkMobile(this.phone)){
          this.$Toast('请输入正确的手机号码');
          return;
        }

        Verify.open({
          type: 'login',
          sureFunc: this.imgSureFunc,
          vertifyCancelEvent: () => {
          },
          paras:{
            phone: this.phone
          }
        })
      }
    },

    imgSureFunc:function(imgVerifyCode,uuid){
      this.$emit('getSmsEvent',imgVerifyCode,uuid);
    },
    startTime:function(){
      if(this.disabled){
        return;
      }
      this.disabled = true;
      this.content = `剩余:${this.totalTime}秒`;
      this.clock = window.setInterval(() => {
        this.totalTime--;
        this.content = `剩余:${this.totalTime}秒`;
        if (this.totalTime == 0) {
          this.resetClock();
        }
      }, 1000);
    },
		resetClock:function(){
      this.$emit('countDown', true);
      if(this.clock){
        window.clearInterval(this.clock);
      }
      this.content = '获取验证码';
      // this.totalTime = 60
      this.totalTime = this.$store.state.globalConfig.station_countdown * 60 || 60
      this.disabled = false;
		}
	},
};
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
$color-white = #fff;
.base_con{
	width: 100%;
	height 100%

	font-size: $font-size-small;
	.count-button {
		line-height 34px
		width: 100%;
		height 100%
		border-radius: 4px;
		color: $color-white;
		background-color: $color-theme-main;
		text-align center
	}
	.disabled {
		background-color: $color-text-lightgray ;
	}
	.count-button1{
		width: 100%;
		height 100%
		/*line-height 40px*/
		color: $color-theme-main;
		background-color white
	}
}

</style>
