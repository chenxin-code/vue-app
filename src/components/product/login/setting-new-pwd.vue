<template>
	<div class="setting-new-pwd login-about full-view">
		<div class="full-form">
			<form class="form">
				<div class="cells">
					<div class="cell cell-line">
						<div class="cell__hd">
							输入密码
						</div>
						<div class="cell__bd">
							<input type="password" placeholder="请输入密码" v-model.trim="userPwd">
						</div>
					</div>
					<div class="cell cell-line">
						<div class="cell__hd">
							再次输入
						</div>
						<div class="cell__bd">
							<input type="password" placeholder="请输入密码" v-model.trim="userPwdAgain">
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="btn-box">
			<div class="btn" @click="setPassword">
				修改成功
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
			userPwd: '',
			userPwdAgain: '',
			phone: '',
			smsVerifyCode: '',
		};
	},
	created() {
		this.phone = this.$route.query.phone;
		this.smsVerifyCode = this.$route.query.smsVerifyCode;
	},
	methods: {
		setPassword: function() {
      if (this.userPwd === '') {
				Toast({
					message: '请输入密码',
					position: 'bottom',
					duration: 2000,
				});
				return;
			}
			if (this.userPwd !== this.userPwdAgain) {
				Toast({
					message: '两次输入的密码不一致',
					position: 'bottom',
					duration: 2000,
				});
				return;
			}
			if (!this.$util.checkPassWord(this.userPwd)) {

				return;
			}
			this.$Loading.open();
			let url = '/app/json/user/forgetPwd';

			let _this = this;
			this.$http.post(url, {
        phone: this.phone,
        userPwd: this.userPwd,
        smsVerifyCode: this.smsVerifyCode,
      }).then(
				res => {
					console.log(res);

          _this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
            _this.$bridgefunc.customGo(-2);
            Toast({
              message: '修改密码成功',
              position: 'bottom',
              duration: 2000,
            });
//            _this.$bridgefunc.customPush({
//							path: '/login',
//              isnativetop:'1'
//						});
					} else {
						Toast({
							message: data.info ? data.info :'修改密码失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
          _this.$Loading.close();
					Toast({
						message: '修改密码失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
	},
};
</script>
