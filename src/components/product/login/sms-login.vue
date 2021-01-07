<template>
	<div class="quickly-login login-about full-view">
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
							<input type="number" pattern="[0-9]*" placeholder="输入验证码" v-model="smsVerifyCode" :disabled="smsInputState">
						</div>
						<div class="cell__ft">
							<count-button @countDown='countOverTime' @click.native.self="getSmsEvent" ref="countBtn"></count-button>
						</div>
					</div>
					<div class="cell cell-line cell_access"  @click="selectCity">
						<div class="cell__hd">
							地区
						</div>
						<div class="cell__bd font-medium">
							{{province}}&nbsp{{city}}
						</div>
						<div class="cell__ft"></div>
					</div>
				</div>
			</form>
		</div>

		<div class="btn-box">
			<div class="btn" @click="loginClick">
				登录
			</div>
		</div>

		<div class="col">
			<div class="col-cell">
				<div class="col-item" @click="goToRegister">账号注册</div>
				<div class="col-item" @click="goToLogin">密码登录</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'mint-ui';
import CountButton from '@/components/commonui/count-button';
import { MP } from '@/utils/map';
import { mapGetters } from 'vuex'

export default {
	components: {
		Toast,
		CountButton,
		imgcode: '',
	},
  computed: {
    ...mapGetters([
      'location',
      'login'
    ]),
  },
	data() {
		return {
			phone: '',
			imgVerifyCode: '',
			smsVerifyCode: '',
			imgcode: '',
			UUID: this.$util.randomString(),
			smsInputState: true,
			overtime: false,
      province: '',
      city: ''
		};
	},
	created() {
		this._getVerifyImg();
    this.phone = this.$store.state.login.phone
    this.getLocation();
	},
  mounted() {
    let _this = this;
    this.$bridgefunc.registePageShow(function () {
      _this.$bridgefunc.vuexRead()
    })
  },

  watch:{
    '$store.state.location.login.city' : function(val, oldVal) {
      this.setCity()
    },
    smsVerifyCode(val) {
      this.smsVerifyCode = this.$util.checkVerifyCodeLenght(this.smsVerifyCode);
    }
  },

	methods: {
    getLocation: function () {
      let _this = this;
      this.$bridgefunc.getLocation(function (locationinfo) {
        _this.province = locationinfo.province;
        _this.city = locationinfo.city;
      })
    },
    setCity:function () {
      this.province = this.$store.state.location.login.province
      this.city = this.$store.state.location.login.city
    },
		// 短信登录
    loginClick: function() {
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
        return false;
      }
			if (this.overtime === true) {
				Toast({
					message: '短信验证码超时，请重新获取。',
					position: 'bottom',
					duration: 2000,
				});
				return false;
			}
      if (this.province == '' ||  this.city == '') {
        Toast({
          message: '请填写省市',
          position: 'bottom',
          duration: 2000,
        });
        return;
      }
      this.$Loading.open();
			let url = '/app/json/login/smsLogin';
			let params = {
        phone: this.phone,
        smsVerifyCode: this.smsVerifyCode,
        city: this.city ? this.city : '',
        province: this.province ? this.province : '',
      };
			let _this = this;
			this.$http.post(url, params).then(
				res => {
          _this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {

            _this.login.phone = _this.phone

            _this.$store.state.indexData.province = _this.province
            _this.$store.state.indexData.city = _this.city

            _this.$userCenter.retsetToIndex(data.data, 2);

					} else {
						Toast({
							message: data.info ? data.info :'登录失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
          _this.$Loading.close();
					Toast({
						message: '登录失败',
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
							message: data.info ? data.info :'图片验证码加载失败',
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
            _this._sendVerifyLoginSms();
					} else {
						Toast({
							message: data.info ? data.info :'图片验证码错误',
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
		// 获取短信登录验证码
		_sendVerifyLoginSms: function() {
      this.$Loading.open('验证码正在发送');
			let url = '/app/json/message/sendVerifyLoginSms';

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
            _this.$refs.countBtn.countDown();
            _this.smsInputState = false;
            _this.overtime = false;
						Toast({
							message: data.info ? data.info :'验证码发送成功',
							position: 'bottom',
							duration: 2000,
						});
					} else {
						Toast({
							message: data.info ? data.info :'验证码发送失败',
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
		// 账号注册
		goToRegister: function() {
			this.$bridgefunc.customPush({
				path: '/register',
        isnativetop:'1'
			});
		},
		// 密码登录
		goToLogin: function() {
			this.$bridgefunc.customPush({
				path: '/login',
        isnativetop:'1'
			});
		},
		// 倒计时按钮计时结束后，设置计时超时状态为true，必须重新获取短信验证码
		countOverTime: function(val) {
			this.overtime = val;
			// 重新获取图片验证码
			this._getVerifyImg();
		},

    selectCity: function () {
      let _this = this
      this.$store.state.location.selectType = '1'
      this.$bridgefunc.vuexStorage(function () {
        _this.$bridgefunc.customPush({
          path: '/cityselector/0',
          isnativetop:'1'
        });
      })
    },
    getSelectCity:function () {
      let _this = this;
      this.$bridgefunc.getItem('SelectCity',function (result) {
        if(result){
          _this.$bridgefunc.removeItem('SelectCity');
          let dict = JSON.parse(result);
          let tempProvinceName = dict['provinceName'];
          let tempCityName = dict['cityName'];
          if(tempProvinceName && tempCityName){
            _this.province = tempProvinceName;
            _this.city = tempCityName;
          }
        }
      })
    }
	},
};
</script>
