<template>
	<div class="container">
		<nav-top @backEvent="$router.go(-1)"></nav-top>
		<nav-content>
			<p class="show-time" v-if="isShowCountdown"><span class="num">{{ showTime[0] }}</span>月<span class="num">{{ showTime[1] }}</span>日<span class="num">{{ showTime[2] }}</span>时<span class="num">{{ showTime[3] }}</span>分<span class="num">{{ showTime[4] }}</span>秒<span class="num">{{ showTime[5] }}</span></p>
			<p class="store-name">{{ $route.query.stationName }}</p>
			<div class="card-container">
				<p class="pay-amount-title">支付金额</p>
				<p class="pay-amount"><span class="sub">￥</span>{{ $util.toDecimal2(orderDetailInfo.realAmount) }}</p>
			</div>
			<div class="card-container">
				<div class="info-item">
					<p class="label">洗车机编码</p>
					<p class="content">{{ orderDetailInfo.utilityAccount }}</p>
				</div>
				<div class="info-item">
					<p class="label">服务名称</p>
					<p class="content">{{ orderDetailInfo.utilityTypeName }}</p>
				</div>
				<div class="info-item">
					<p class="label">服务编号</p>
					<p class="content">{{ orderDetailInfo.rechargeNo }}</p>
				</div>
				<div class="info-item">
					<p class="label">服务价格</p>
					<p class="content">￥{{ $util.toDecimal2(orderDetailInfo.realAmount) }}</p>
				</div>
			</div>
			<div class="card-container">
				<div class="info-item">
					<p class="label">下单时间</p>
					<p class="content">{{ orderDetailInfo.createTime }}</p>
				</div>
				<div class="info-item">
					<p class="label">优惠金额</p>
					<p class="content">￥{{ $util.toDecimal2(orderDetailInfo.couponAmount) }}</p>
				</div>
			</div>
		</nav-content>
	</div>
</template>
<script>
	import moment from 'moment'

	export default {
		data () {
			return {
				showTime: [],
				orderDetailInfo: {},
				isShowCountdown: true,
			}
		},
		mounted() {
			this.startTime()
			this.initOrderDetail()
			if (this.$route.query.state == 3) {
				if (moment().isAfter(moment(this.$route.query.createTime).add(30, 'm'))) {
					this.isShowCountdown = false
				} else {
					// 30分钟内
					this.isShowCountdown = true
				}
			} else {
				this.isShowCountdown = false
			}
		},
		methods: {
			startTime() {
				this.showTime = moment().format('MM-DD-HH-mm-ss-SS').split('-')
			  window.requestAnimationFrame(this.startTime)
			},
			initOrderDetail() {
				this.$Loading.open()
				this.$http.post('/app/json/app_self_car_order/detail', {
					orderType: this.$route.query.orderType,
					orderId: this.$route.query.orderId,
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						this.orderDetailInfo = data.data || {}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`detail err ${err}`)
				})
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.container {
		.nav-content {
			background-color #F5F5F5;
			display flex;
			flex-direction column;
		}
		.show-time {
			text-align center;
			font-size 15px;
			color #333;
			font-weight 700;
			padding 20px;
			.num {
				display inline-block;
				width 37px;
				height 37px;
				line-height 37px;
				background-color #118820;
				color #fff;
				border-radius 50%;
				text-align center;
				margin 0 3px;
				font-weight 700;
			}
		}
		.store-name {
			font-size 18px;
			font-weight 500;
			text-align center;
		}
		.card-container {
			background-color #fff;
			margin 10px 10px 0;
			border .5px solid #DDDDDD;
			border-radius 5px;
			padding 15px 10px;
		}
		.pay-amount-title {
			font-size 13px;
			font-weight 500;
		}
		.pay-amount {
			font-size 22px;
			text-align center;
			color #ff6844;
			font-weight 500;
			padding 15px 0 20px;
			.sub {
				font-weight 500;
				font-size 14px;
			}
		}
		.info-item {
			font-size 13px;
			display flex;
			justify-content space-between;
			padding 4px 0;
			.label {
				color #979797;
			}
			.content {
				color #4a4a4a;
			}
		}
	}
</style>