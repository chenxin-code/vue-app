<template>
	<div class="container">
		<div class="block">
			<p class="title">本月统计：</p>
			<div class="content">绩效计算时间截至到本月昨天，当天的数据暂时不能提供；本月的绩效金额显示偶尔会延迟，请耐心等待。</div>
		</div>
		<div class="block">
			<p class="title">历史月份：</p>
			<div class="content">每月初2号统计出上月的精确绩效金额；</div>
		</div>
		<div class="block">
			<p class="title">其他说明：</p>
			<div class="content">
				<p>1.累计绩效统计到上个月，当月的绩效不在范围内；</p>
				<p>2.油滴支付的订单不返利，组合支付的订单只对实付的金额部分返利；</p>
			</div>
		</div>
		<div class="block">
			<p class="spec-title">返利规则</p>
			<ul class="rule-list">
				<li class="item" v-for="(item, index) in ruleList" :key="index">
					<p class="rule-name"><span class="title">油品名称：</span>{{ item.oilName }}</p>
					<p class="rule-detail">
						<span class="title">返利规则：</span>
						<span class="rule-item" v-for="(item2, index2) in item._awardList" :key="index2">{{`加油${item2.oliter ? '升数' : '金额'}${item2.op}${item2.oliter ? item2.oliter : item2.realAmount}${item2.oliter ? '升' : '元'}，返利${item2.awardNum * 100}%`}}</span>
					</p>
					<p class="effective-time"><span class="title">有效时间：</span>{{ item._effectiveDate + ' 至 ' + item._expireDate }}</p>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				ruleList: [],
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			initData() {
				let params = {
					cityNo: 100004,
				}
				if (this.$route.query.calMonth) {
					params.calMonth = this.$route.query.calMonth
				}
				this.$http.post('/app/json/wechat_qy/queryPerformanceJxr', params).then(res => {
					let data = res.data
					if (data.status == 0) {
						if (data.data instanceof Array && data.data.length > 0) {
							data.data.forEach(item => {
								item._awardList = JSON.parse(item.awardList)
								item._effectiveDate = item.effectiveDate.substr(0, 10)
								item._expireDate = item.expireDate.substr(0, 10)
							})
							this.ruleList = data.data
						}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Toast(`queryPerformanceJxr err ${err}`)
				})
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~@/common/stylus/variable.styl';
	@import '~@/common/stylus/mixin.styl';
	
	.container {
		width 100%;
		height 100%;
		background-color #F2F2F2 !important;
		overflow-y auto;
		color #383E44;
		.block {
			padding 13px 20px;
			background-color #fff;
			border-top .5px solid #E5E5E5;
			border-bottom .5px solid #E5E5E5;
			margin-top 10px;
		}
		.title {
			font-size 14px;
			font-weight 500;
		}
		.spec-title {
			font-size 14px;
			font-weight 500;
			color #5076B8;
			padding-bottom 10px;
			border-bottom .5px solid #E5E5E5;
		}
		.content {
			font-size 14px;
			line-height 22px;
			margin-top 5px;
		}
		.rule-list {
			margin-top 5px;
			.item {
				font-size 13px;
				line-height 20px;
				padding 8px 0;
				bdr-b();
				p {
					padding 4px 0;
				}
				.title {
					// color #5076B8;
					font-weight 700;
					font-size 14px;
				}
				.rule-detail {
					.rule-item {
						display block;
					}
				}
			}
		}
	}
</style>