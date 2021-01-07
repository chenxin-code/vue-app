<template>
	<div>
		<nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
    	<div class="qrcode-container">
    		<p class="top-title">使用时请出示给收银员</p>
    		<div class="qrcode-c">
    			<canvas class="qr-canvas" id="qrcodeCanvas" @click="initiativeRefresh"></canvas>
					<span class="static-code">静态码：{{ couDetailInfo.staticCheckCode }}</span>
    		</div>
    		<p class="service-company">由{{ couDetailInfo.merOuName }}提供服务</p>
    		<p class="countdown-c">{{ countdownTime }}秒自动刷新，点击二维码手动刷新</p>
    	</div>
    	<div class="card-container" v-if="couDetailInfo.couThirdPic">
    		<img :src="couDetailInfo.couThirdPic" alt="" class="card">
    	</div>
    	<!-- 门店信息 -->
			<div class="store-info">
				<div class="top-info" @click="goToApplicableStores">
					<p class="title">适用门店</p>
					<p class="match-num">共{{ storeInfoData.allStoreNum }}家<i class="iconfont mall-gengduojiantou arrow-icon"></i></p>
				</div>
				<div class="bottom-info">
					<div class="airport-info">
						<p class="name">{{ storeInfoData.storeName }}</p>
						<p class="address">{{ storeInfoData.address }}</p>
						<p class="address">时间：{{ dealwithTime(storeInfoData) }}</p>
					</div>
					<div class="navigation-info" @click="goToMap">
						<img src="../../assets/images/icon-navigation.png" alt="" class="icon-nav">
						<span class="nav-text">{{ $util.toDecimal2(storeInfoData.distance / 1000) }}km</span>
					</div>
				</div>
			</div>
			<!-- 服务券使用说明 -->
			<div class="instructions-for-use" v-html="couDetailInfo.couDesc"></div>
    </nav-content>
	</div>
</template>
<script>
	// 文档地址：  https://github.com/HerbLuo/qr-code-with-logo
	import QRCode from 'qr-code-with-logo'
	export default {
		data() {
			return {
				couDetailInfo: {
					storeModelList: [{}]
				},
				countdownTime: 30,
				tempCountdownTime: 0,
				interId: null,
				storeInfoData: {},
			}
		},
		mounted() {
			this.getCouDetail();
			this.tempCountdownTime = this.countdownTime;
		},
		beforeRouteLeave(to, from, next) {
			if (this.interId) {
				window.clearInterval(this.interId)
			}
			if (this.roudRobinInterId) {
				window.clearInterval(this.roudRobinInterId)
			}
			next()
		},
		methods: {
			initQrCode(qrCode) {
				QRCode.toCanvas({
					canvas: document.getElementById('qrcodeCanvas'),
					content: qrCode,
					width: 160,
					nodeQrCodeOptions:{
						margin: 0
					},
					// logo: {
					// 	src: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1750544830,2249000494&fm=11&gp=0.jpg',
					// 	logoSize: 0.35,
					// 	borderRadius: 5,
					// }
				})
				this.startCountdown();
			},
			goToApplicableStores() {
				this.$router.push({
					path: '/applicable_stores',
					query: {
						skuId: this.couDetailInfo.skuId,
						storeOuCode: this.couDetailInfo.storeOuCode,
					}
				});
			},
			getCouDetail() {
				this.$STLoading.open();
				this.$http.post('/app/json/app_serve_cou/getMyCouInfo', {
					couNo: this.$route.query.couNo
				}).then(res => {
					this.$STLoading.close();
					let data = res.data;
					if (data.status == 0) {
						this.initQrCode(data.data.dynamicCode);
						this.couDetailInfo = data.data;
						this.getApplicableStores(this.couDetailInfo.skuId, this.couDetailInfo.storeOuCode);
						this.roundRobin(this.couDetailInfo.couNo)
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`getMyCouInfo err ${err}`);
					this.$STLoading.close();
				})
			},
			refreshQrCode() {
				this.$STLoading.open();
				this.$http.post('/app/json/app_serve_cou/refreshDynamicCode', {
					couNo: this.couDetailInfo.couNo
				}).then(res => {
					let data = res.data;
					if (data.status == 0) {
						this.initQrCode(data.data.dynamicCode)
					} else {
						// this.$Toast(data.info);
					}
					this.$STLoading.close();
				})
				.catch(err => {
					this.$Toast(`refreshDynamicCode err ${err}`);
					this.$STLoading.close();
				})
			},
			startCountdown() {
				if (this.interId) {
					window.clearInterval(this.interId)
				} else {
					this.interId = setInterval(() => {
						this.countdownTime--;
						if (this.countdownTime) {
							console.log("计时进行中", this.countdownTime);
						} else {
							window.clearInterval(this.interId);
							this.interId = null;
							this.countdownTime = this.tempCountdownTime;
							this.refreshQrCode();
						}
					}, 1000);
				}
			},
			// 获取店铺信息
			getApplicableStores(skuId, storeOuCode) {
				this.$STLoading.open();
				this.$http.post('/app/json/app_cou_service/queryCanUseStoreList', {
					skuId,
					storeOuCode,
					posx: this.$store.state.currentLocation.posx,
					posy: this.$store.state.currentLocation.posy,
					getType: 1,
					page: 1,
					rows: 1
				}).then(res => {
					let data = res.data;
					this.$STLoading.close();
					if (data.status == 0) {
						if (data.data instanceof Array && data.data[0]) {
							this.storeInfoData = data.data[0];
							this.storeInfoData.allStoreNum = data.totalRecords || 0;
						}
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`queryCanUseStoreList err ${err}`);
					this.$STLoading.close();
				})
			},
			dealwithTime(item) {
				if (item.openingTime && item.closingTime) {
					return `${item.openingTime} - ${item.closingTime}`
				} else {
					return '暂无 - 暂无'
				}
			},
			goToMap() {
				this.$bridgefunc.baiduNav(
					{
						startlong: this.$store.state.currentLocation.posx,
						startlat: this.$store.state.currentLocation.posy,
						endlong: this.storeInfoData.posx,
						endlat: this.storeInfoData.posy,
						type: "nav"
					}
				);
			},
			roundRobin(serveNo) {
				if (this.roudRobinInterId) {
					window.clearInterval(this.roudRobinInterId);
				} else {
					this.roudRobinInterId = setInterval(() => {
						this.$http.post('/app/json/app_serve_cou/queryCouCheckState', {
							serveNo
						}).then(res => {
							// setTimeout(() => {
							// 	this.$router.push({
							// 		path: '/mall2/paysuccess',
							// 		query: {
							// 			entryType: 1,
							// 			tradeTime: res.data.data.tradeTime,
							// 			sumCheckAmount: res.data.data.sumCheckAmount,
							// 			storeName: res.data.data.storeName,
							// 		}
							// 	})
							// }, 4000)
							if (res.data.data.storeCode) {
								window.clearInterval(this.roudRobinInterId);
								this.$router.push({
									path: '/mall2/paysuccess',
									query: {
										entryType: 1,
										tradeTime: res.data.data.tradeTime,
										sumCheckAmount: res.data.data.sumCheckAmount,
										storeName: res.data.data.storeName,
									}
								})
							}
						}).then(err => {
							// err
						})
					}, 1000)
				}
			},
			// 手动刷新二维码
			initiativeRefresh() {
				if (this.interId) {
					window.clearInterval(this.interId)
					this.interId = null;
					this.countdownTime = this.tempCountdownTime;
				}
				this.refreshQrCode();
			}
		}
	}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
	background-color: #C9A063;
	overflow-y auto;
	.qrcode-container {
		margin 15px 20px 0;
		background-color: #FFF
		border-radius 5px;
		text-align center;
		padding-bottom 25px;
		.top-title {
			font-size 18px;
			font-weight 600;
			padding-top 25px;
		}
		.qrcode-c {
			margin-top 20px;
			text-align center;
			.qr-canvas {
				display inline-block;
			}
			.static-code {
				display inline-block;
				font-size 14px;
				margin-top 5px;
			}
		}
		.service-company {
			line-height 18px;
			font-size 16px;
			font-weight 500;
			margin-top 16px;
			padding 0 20px;
		}
		.countdown-c {
			font-size 13px;
			color #9FA0A0;
			margin-top 5px;
		}
	}
	.card-container {
		background-color: #FFF
		border-radius 5px;
		margin 10px 20px 0;
		overflow hidden;
		.card {
			display block;
			width 238px;
			height 150px;
			margin 17px auto;
		}
	}
	.store-info {
		background-color: #FFF
		border-radius 5px;
		margin 10px 20px 0;
		overflow hidden;
		padding 10px 12px;
		.top-info {
			display flex;
			justify-content space-between;
			font-size 14px;
			padding-bottom 10px;
			bdr-b();
			.title {
				font-weight 400;
			}
			.match-num {
				.arrow-icon {
					font-size 12px;
					color #101010;
				}
			}
		}
		.bottom-info {
			display flex;
			justify-content space-between
			align-items center;
			margin-top 10px;
			.airport-info {
				flex 1;
				.name {
					font-size 15px;
					font-weight 500;
					line-height 18px;
				}
				.address {
					font-size 13px;
					color #9FA0A0;
					margin-top 6px;
					line-height 15px;
				}
			}
			.navigation-info {
				min-width 60px;
				.icon-nav {
					display block
					width 20px;
					height 20px;
					margin 0 auto;
				}
				.nav-text {
					display block;
					font-size 13px;
					color #9FA0A0;
					margin-top 4px;
					text-align center;
				}
			}
		}	
	}
	.instructions-for-use {
		background-color: #FFF
		border-radius 5px;
		margin 10px 20px 0;
		overflow hidden;
		padding 10px 12px;
		margin-bottom 20px;
		/deep/ img {
			width 100%;
		}
	}
}
</style>