<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
    	<van-tabs
    		v-model="active"
    		animated
    		:border="false"
    		title-active-color="#F80F16"
    		class="reset-tabs"
    		@change="changeTabs">
			  <van-tab
			  	v-for="(item, index) in tabs"
			  	:title="item.title"
			  	:key="index"
			  	:info="item.unreadNum"></van-tab>
			</van-tabs>
			<ul class="auction-list">
				<li class="item" :class="{'not-captured': item.auctionStateTips == '未获拍'}" v-for="(item, index) in orderList" :key="index">
					<div class="processing" v-if="item.auctionResult == 1 && (item.state == 1 || item.state == 2)">
						<div class="countdown">订单将在<van-count-down class="reset-countdown" :time="item.countDownTime" format="mm分钟ss秒" />后关闭</div>
						<span class="go-pay" @click="continuePay(item)">去支付</span>
					</div>
					<div class="prod-container">
						<div class="prod-info">
							<div class="left">
								<img :src="item.pic" alt="" class="prod-img">
								<span class="tip">{{ item.auctionStateTips }}</span>
							</div>
							<div class="right">
								<p class="prod-name">{{ item.skuName }}</p>
								<span class="quantity">数量：{{ item.auctionCount }}</span>
							</div>
						</div>
						<div class="purchase-info">
							共{{ item.auctionCount }}件商品 实付款：<span class="price">￥<i class="num">{{ dealWithPrice(Number(item.payAmount) + Number(item.freightAmount))[0] }}</i>.{{ dealWithPrice(Number(item.payAmount) + Number(item.freightAmount))[1] }}</span>
						</div>
					</div>
				</li>
			</ul>
    </nav-content>
  </div>
</template>
<script>
	import { CountDown } from 'vant';
	import moment from 'moment';
	export default {
		components: {
			// 'van-count-down': CountDown,
			[CountDown.name]: CountDown,
		},
		data() {
			return {
				active: 0,
				tabs: [
					{
						title: '全部',
						unreadNum: '',
					},
					{
						title: '参拍中',
						unreadNum: '',
					},
					{
						title: '已获拍',
						unreadNum: '',
					},
					{
						title: '未获拍',
						unreadNum: '',
					},
				],
				orderList: [],
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList(stateType) {
				let params = {}
				if (stateType) {
					params.stateType = stateType
				}
				this.$Loading.open();
				this.$http.post('/app/json/app_product_auction/getMyWinOrder', params).then(res => {
					let data = res.data;
					if (data.status == 0) {
						data.data = data.data || [];
						data.data.forEach(item => {
							if (item.auctionResult == 1) { // 已获拍
								if (item.state == 1 || item.state == 2) { // 待支付
									item.auctionStateTips = '待支付';
								} else { // 已经支付完成
									item.auctionStateTips = '已获拍';
								}
							} else { // 未获拍
								item.auctionStateTips = '未获拍';
							}
							item.countDownTime = moment(item.orderCancleTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
						});
						this.orderList = data.data;
						this.$Loading.close();
					} else {
						this.$toast(data.info);
						this.$Loading.close();
					}
				}).catch(err => {
					this.$toast(err);
					this.$Loading.close();
				})
			},
			// 处理价格整数小数方法
			dealWithPrice(price) {
				price = Number(price);
				if (!price) {
					return [0, 0, `0.00`];
				}
				price = String(price.toFixed(2));
				let decimalNum = price.split('.')[1]; // 小数
				let integerNum = price.split('.')[0]; // 整数
				return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
			},
			changeTabs(key, title) {
				// 清空已获拍 和 未获拍的未读数目
				if (title == '已获拍' || title == '未获拍') {
					this.tabs[key].unreadNum = '';
				}
				this.orderList = [];
				this.getList(key);
			},
			// 继续支付
			continuePay(orderInfo) {
				this.$router.push({
					path: '/mall2/checkstand',
					query: {
						payInfo: JSON.stringify({
							orderType: '200015',
							orderId: orderInfo.orderId,
							shoppingOrderId: orderInfo.shoppingOrderId,
							tradeNo: orderInfo.tradeNo,
							payAmount: orderInfo.payAmount,
							freightAmount: orderInfo.freightAmount,
						}),
						occurOuCode: orderInfo.occurOuCode,
					}
				})
			}
		}
	}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.reset-tabs {
	/deep/ .van-tab__text {
		font-size 15px;
	}
	/deep/ .van-info {
		right -10px;
	}
}
.auction-list {
	position absolute;
	right 0
	left 0;
	bottom 0;
	top 45px;
	overflow-y auto;
	padding 0 10px 10px;
	.item {
		box-shadow 0 0 5px #ddd;
		border-radius 5px;
		margin-top 8px;
		.processing {
			height 40px;
			line-height 40px;
			padding 0 10px;
			background-color: #fbf8d7
			color $color-theme-r;
			display flex;
			justify-content space-between;
			align-items center;
			.countdown {
				font-size 15px;
				.reset-countdown {
					display inline-block;
					color $color-theme-r
					font-size 15px;
				}
			}
			.go-pay {
				display block;
				height 25px;
				line-height 25px;
				padding 0 8px;
				color #fff;
				font-size 14px;
				background-color: $color-theme-r;
				border-radius 17px;
			}
		}
		
		.prod-container {
			padding 12px 10px;
		}
		.stop-time {
			font-size 13px;
			color #333
		}
		.prod-info {
			display flex;
			margin-top 12px;
			.left {
				position relative;
				.prod-img {
					display block;
					width 70px;
					height 70px;
					border 1px dashed #ccc;
				}
				.tip {
					display block;
					height 18px;
					line-height 18px;
					background-color: $color-theme-r;
					font-size 11px;
					color #fff;
					position absolute;
					left 0
					top 0;
					padding 0 5px;
					border-radius 0 9px 9px 0
				}
			}
			.right {
				flex 1;
				display flex;
				flex-direction column;
				justify-content space-around;
				padding 0 10px 0 15px;
				.prod-name {
					font-size 14px;
					line-height 16px;
				}
				.quantity {
					color $color-text-d;
				}
			}
		}
		.purchase-info {
			margin-top 20px;
			text-align right;
			font-size 12px;
			color #333;
			.price {
				color $color-theme-r;
				font-weight 700;
				.num {
					font-size 18px;
					font-style normal;
					font-weight 700;
				}
			}
		}
		
		&.not-captured {
			.prod-info {
				.left {
					.tip {
						background-color: #999;
					}
				}
			}
		}
	}
}
</style>
