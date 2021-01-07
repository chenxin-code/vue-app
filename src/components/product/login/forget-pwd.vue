<template>
	<div class="forget-pwd login-about full-view">
		<div class="full-form">
			<form class="form">
				<div class="cells">
					<div class="cell cell-line">
						<div class="cell__hd">
							手机号
						</div>
						<div class="cell__bd">
							<input type="number" pattern="[0-9]*" placeholder="输入手机号" v-model="phone" oninput="if(value.length>11) value=value.slice(0,11)">
						</div>
					</div>
					<div class="cell cell-line">
						<div class="cell__hd">
							图片校验码
						</div>
						<div class="cell__bd">
							<input type="text" placeholder="输入图片校验码" v-model="imgVerifyCode">
						</div>
						<div class="cell__ft">
							<div class="img-code" v-if="imgcode != ''" @click="_getVerifyImg">
								<img :src="imgcode" class="full-img" />
							</div>
						</div>
					</div>
					<div class="cell cell-line">
						<div class="cell__hd">
							验证码
						</div>
						<div class="cell__bd">
							<input type="number" pattern="[0-9]*" placeholder="输入验证码" v-model="smsVerifyCode" :disabled="smsInputStates">
						</div>
						<div class="cell__ft">
							<count-button @countDown='countOverTime' @click.native.self="getSmsEvent" ref="countBtn"></count-button>
						</div>
					</div>
				</div>
			</form>
		</div>

		<div class="btn-box">
			<div class="btn" @click="goToSettingNewPwd">
				下一步
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'mint-ui';
import CountButton from '@/components/commonui/count-button';
export default {
	components: {
		Toast,
		CountButton,
	},
	data() {
		return {
			phone: '',
			imgVerifyCode: '',
			smsVerifyCode: '',
			imgcode: '',
			UUID: this.$util.randomString(),
			smsInputStates: true,
			overtime: false,
		};
	},
  watch: {
    smsVerifyCode(val) {
      this.smsVerifyCode = this.$util.checkVerifyCodeLenght(this.smsVerifyCode);
    }
  },
	created() {
		this._getVerifyImg();
	},
	methods: {
		goToSettingNewPwd: function() {
      if (this.phone === '' || !this.$util.checkMobile(this.phone)) {
        Toast({
          message: '请输入正确的手机号码',
          position: 'bottom',
          duration: 2000,
        });
        return;
      }

			if (this.imgVerifyCode === '') {
				Toast({
					message: '请输入图片验证码',
					position: 'bottom',
					duration: 2000,
				});
				return false;
			}
      if (this.smsVerifyCode === '') {
        Toast({
          message: '请输入短信验证码',
          position: 'bottom',
          duration: 2000,
        });
        return;
      }
			if (this.overtime === true) {
				Toast({
					message: '短信验证码超时，请重新获取。',
					position: 'bottom',
					duration: 2000,
				});
				return false;
			}
			// 校验短信验证码
			this.$Loading.open();
			let url = '/app/json/user/verifyForgetPwdSms';

			this.$http.post(url, {
        phone: this.phone,
        smsVerifyCode: this.smsVerifyCode,
      }).then(
				res => {
					this.$Loading.close();
					if (res.data.status == 0) {
            this.$bridgefunc.customPush({
              path: '/settingnewpassword',
              isnativetop:'1',
              query: {
                phone: this.phone,
                smsVerifyCode: this.smsVerifyCode,
              },
            });
					} else {
						Toast({
							message: res.data.info ? res.data.info :'短信验证码错误',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
					this.$Loading.close();
					Toast({
						message: '短信验证码错误',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 点击获取短信验证码btn
		getSmsEvent: function() {
      if (this.phone === '' || !this.$util.checkMobile(this.phone)) {
        Toast({
          message: '请输入正确的手机号码',
          position: 'bottom',
          duration: 2000,
        });
        return;
      }
			// 检查是否填写图片验证码
			if (this.imgVerifyCode === '') {
				Toast({
					message: '请填写图片校验码',
					position: 'bottom',
					duration: 2000,
				});
				return false;
			}
			// 检查验证码填写是否正确
			this._verifyImg();
		},
		// 获取图片验证码
		_getVerifyImg: function() {
			this.$Loading.open();
			let url = '/app/json/login/getVerifyImg';

			let _this = this;
			this.$http.post(url, {
        uuid: this.UUID,
      }).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
						this.imgcode = data.data;
					} else {
						Toast({
							message: data.info ? data.info : '图片验证码加载失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
					_this.$Loading.close();
					Toast({
						message: '图片验证码加载失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 验证图片验证码
		_verifyImg: function() {
			this.$Loading.open();
			let url = '/app/json/login/verifyImg';

			let _this = this;
			this.$http.post(url, {
        uuid: this.UUID,
        imgVerifyCode: this.imgVerifyCode,
      }).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					if (data.status == 0 && data.data === true) {
						// 图片验证码填写正确，获取短信验证码
						this._sendVerifyRegSms();

					} else {
						Toast({
							message:data.info ? data.info : '图片验证码错误',
							position: 'bottom',
							duration: 2000,
						});
						this._getVerifyImg();
					}
				},
				error => {
					_this.$Loading.close();
					Toast({
						message: '图片验证码错误',
						position: 'bottom',
						duration: 2000,
					});
					this._getVerifyImg();
				}
			);
		},
		// 获取忘记密码短信验证码
		_sendVerifyRegSms: function() {
			this.$Loading.open('验证码正在发送');
			let url = '/app/json/message/sendVerifyForgetPwdSms';

			let _this = this;
			this.$http.post(url, {
        phone: this.phone,
      }).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
            // button 开始倒计时
            // 设置短信验证码输入框 允许输入
            // 复原短信验证码超时状态为false未超时。
            _this.$refs.countBtn.countDown();
            _this.smsInputStates = false;
            _this.overtime = false;
						Toast({
							message: data.info ? data.info : '验证码发送成功',
							position: 'bottom',
							duration: 2000,
						});
					} else {
						Toast({
							message: data.info ? data.info : '验证码发送失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
					_this.$Loading.close();
					Toast({
						message: '验证码发送失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 倒计时按钮计时结束后，设置计时超时状态为true，必须重新获取短信验证码
		countOverTime: function(val) {
			this.overtime = val;
			// 重新获取图片验证码
			this._getVerifyImg();
		},
	},
};
</script>
