<template>
	<div class="container">
		<ul class="rebate-list">
			<li class="item" v-for="(item, index) in rebateList" :key="index">
				<p class="title">{{ item.prizeTypeName }}</p>
				<div class="content">
					{{ item.prizeNum }}
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				rebateList: []
			}
		},
		mounted() {
			this.initPrizeDetail()
		},
		methods: {
			initPrizeDetail() {
				this.$Loading.open()
				this.$http.post('/app/json/wechat_qy/getprizeDetail', {
					orderNo: this.$route.query.orderNo,
					userId: this.$route.query.userId
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						// data.data = [
						// 	{
						// 		prizeNum: 100,
						// 		prizeType: '20002',
						// 		prizeTypeName: '通用油滴',
						// 	},
						// 	{
						// 		prizeNum: 100,
						// 		prizeType: '20001',
						// 		prizeTypeName: '易捷油滴',
						// 	},
						// ]
						this.rebateList = data.data || []
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`getprizeDetail err ${err}`)
				})
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.container {
		width 100%;
		height 100%;
		background-color #F2F2F2 !important;
		color #383E44;
		overflow-y auto;
		.rebate-list {
			text-align center;
			margin-bottom 10px;
			.item {
				background-color #fff;
				border-top .5px solid #E5E5E5;
				border-bottom .5px solid #E5E5E5;
				padding 10px 0;
				margin-top 10px;
				.title {
					font-size 14px;
					padding-top 10px;
				}
				.content {
					font-size 21px;
					font-weight 700;
					margin-top 10px;
				}
			}
		}
	}
</style>