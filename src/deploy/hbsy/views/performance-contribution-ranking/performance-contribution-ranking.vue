<template>
	<div class="container">
		<div class="top-user-info">
			<img :src="$route.query.userWxUrl" alt="" class="avatar">
			<p class="name">{{ $route.query.userWxName }}</p>
			<p class="phone">{{ $route.query.userPhone }}</p>
			<p class="total-info">{{ $util.toDecimal2($route.query.orderTotalAmount) }}RMB</p>
		</div>
		<ul class="recording" v-if="recordingList.length > 0">
			<li class="item" v-for="(item, index) in recordingList" :key="index">
				<p class="time-title" v-if="item.isShowDate">{{ showMonth }}</p>
				<p class="info border-t padding-top word-break">
					<span class="label">交易单号：</span>
					<span class="content">{{ item.orderNo }}</span>
				</p>
				<p class="info">
					<span class="label">交易类型：</span>
					<span class="content">{{ item.payModeStr }}</span>
				</p>
				<p class="info">
					<span class="label">加油升数：</span>
					<span class="content">{{ $util.toDecimal2(item.oilLiter) }}L</span>
				</p>
				<p class="info">
					<span class="label">实付金额：</span>
					<span class="content">{{ $util.toDecimal2(item.realAmount) }}</span>
				</p>
				<p class="info">
					<span class="label">交易金额：</span>
					<span class="content">{{ $util.toDecimal2(item.amount) }}</span>
				</p>
				<p class="info">
					<span class="label">返利详情：</span>
					<span class="content"><span class="more-btn" @click="toRebateDetail(item)">详情<van-icon name="arrow" class	="more-icon"/></span></span>
				</p>
				<p class="info">
					<span class="label">交易品类：</span>
					<span class="content">{{ item.oilName }}</span>
				</p>
				<p class="info">
					<span class="label">交易时间：</span>
					<span class="content">{{ item.opeTime }}</span>
				</p>
				<p class="info padding-bottom">
					<span class="label">交易站点：</span>
					<span class="content">{{ item.stationOuName }}</span>
				</p>
			</li>
		</ul>
		<p class="no-result" v-else>暂无数据~</p>
	</div>
</template>
<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				recordingList: [],
				showMonth: '',
				queryMonth: '',
			}
		},
		mounted() {
			let momMonth = moment(this.$route.query.calMonth)
			this.showMonth = momMonth.format('YYYY年MM月')
			this.queryMonth = momMonth.format('YYYY-MM-DD') + 'TO' + momMonth.endOf('month').format('YYYY-MM-DD')
			this.initOrderList()
		},
		methods: {
			toRebateDetail(item) {
				this.$router.push({
					path: '/performance-rebate-details',
					query: {
						userId: this.$route.query.userId,
						orderNo: item.orderNo
					}
				})
			},
			initOrderList() {
				this.$Loading.open()
				this.$http.post('/app/json/wechat_qy/queryCustomerOrderList', {
					monthTime: this.queryMonth,
					userId: this.$route.query.userId
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						// data.data = [
						// 	{
						// 		orderNo: '23457689076543241354354',
						// 		payModeStr: '微信',
						// 		oilLiter: 100,
						// 		realAmount: 300,
						// 		oilName: '92号_车用乙醇汽油(E10)(VIA)',
						// 		createTime: '2020-08-08 18:01:23',
						// 		stationOuName: '石家庄槐安加油站',
						// 	}
						// ]
						if (data.data instanceof Array && data.data.length > 0) {
							data.data[0].isShowDate = true
							this.recordingList.push(...data.data)
						}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryCustomerOrderList err ${err}`)
				})
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.word-break {
		word-break break-all;
	}
	.container {
		width 100%;
		height 100%;
		background-color #F2F2F2 !important;
		color #383E44;
		overflow-y auto;
		.top-user-info {
			background-color #fff;
			border-top .5px solid #E5E5E5;
			border-bottom .5px solid #E5E5E5;
			padding 15px;
			margin-top 10px;
			text-align center;
			.avatar {
				display block;
				width 50px;
				height 50px;
				border-radius 50%;
				margin 10px auto 0;
			}
			.name {
				font-size 14px;
				padding-top 10px;
			}
			.phone {
				padding-top 5px;
			}
			.total-info {
				font-size 14px;
				font-weight 500;
				padding-top 10px;
			}
		}
		.recording {
			background-color #fff;
			margin-top 10px;
			margin-bottom 10px;
			border-top .5px solid #E5E5E5;
			border-bottom .5px solid #E5E5E5;
			padding 0 20px;
			.item {
				.time-title {
					font-size 14px;
					font-weight 500;
					color #5076B8;
					padding 10px 0;
				}
				.info {
					font-size 14px;
					padding 5px 0;
					&.border-t {
						border-top .5px solid #E5E5E5;
					}
					&.padding-top {
						padding-top 10px;
					}
					&.padding-bottom {
						padding-bottom 10px;
					}
					.more-btn {
						color #5076B8;
						// padding-left 10px;
						.more-icon {
							vertical-align middle;
						}
					}
					.content {
						line-height 18px;
					}
				}
			}
		}
		.no-result {
			font-size 14px;
			text-align center;
			color #999;
			padding-top 20px;
		}
	}
</style>