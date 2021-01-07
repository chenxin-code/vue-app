<template>
	<div>
		<nav-top title="洗车券" @backEvent="backEvent">
			洗车券
		</nav-top>
		<nav-content class="coupon-center">
			<ul class="menu-list">
				<li class="menu-item" :class='{active:item.type === currentType}' v-for="(item,index) in menuList" :key="index" @click="subMenuHandler(item.type)">
					<span class="text">
						{{item.name}}&nbsp;({{item.num}})
					</span>
				</li>
			</ul>
			<div class="coupon-list-wrapper" v-show="hasGetData">
				<scroll ref="scroll" class="coupon-list-scroll" :listenScroll="true" :probe-type="3" :hasMore="hasMore" @scroll="scroll" :pullUpLoad="true" @pullingUp="loadMore" :data="couponList" :pullDownRefresh="true" @pullingDown="reset">

					<template v-for="(item,index) in couponList">
						<coupon :key="index" :disabled="disabled" :couponLayoutType="1" :used="currentType === 'getUsedCoupons'" :item="item" :index="index" class="coupon-item"></coupon>
					</template>
				</scroll>
				<div class="no-coupon-wrapper" v-if="!couponList.length">
					<img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
					<p class="title theme_font_tint">没有券？</p>
					<p class="sub-title theme_font_tint">去领券中心看看吧</p>
				</div>
				<div class="tip" v-if="disabled">以上是近期{{currentType == 'getExpiredCoupons' ? '已过期' : '已使用'}}的优惠券</div>
			</div>
		</nav-content>

	</div>
</template>

<script>
import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
import coupon from './base/coupon.vue'
import Scroll from '@/components/base/scroll/scroll'
export default {
	components: { coupon, HorizontalScroll, Scroll },
	data () {
		return {
			couponList: [],
			aysflag: false,
			currentType: 'getUnusedCouponsWithCols',
			menuList: [],
			couponMenuListIndex: 0,
			hasGetData: false, // 获取更多数据
			hasMore: true, // 获取数据loading
			page: 0,
			rows: 10,
			scrollY: 0,
			_scrollY: 0,
			isFirstEnter: true // 判断是否初始化
		}
	},
	beforeRouteLeave (to, from, next) {
		this._scrollY = this.scrollY
		next()
	},
	methods: {
		// 初始化
		pageInit () {
			this.getMenu().then((res) => {
				this.loadMore()
				this.isFirstEnter = false
			})
		},
		activated () {
			if (!this.isFirstEnter) {
				this.backScroll()
			}
		},
		async backScroll () {
			const page = this.page // 缓存page值
			this.rows = page * this.rows // 一次性加载所有数据
			this.page = 0
			this.couponList = []
			await this.getMenu()
			await this.loadMore(true)
			this.$nextTick(() => {
				this.$refs.scroll.scrollTo(0, this._scrollY)
			})
			this.rows = 10 // 还原分页规则
			this.page = page
		},
		scroll (pos) {
			this.scrollY = pos.y
		},
		// 路由返回
		backEvent () {
			this.$router.go(-1)
		},
		// 获取列表标题，和列表数量
		getMenu () {
			return new Promise((resolve, reject) => {
				this.$Loading.open();
				let obj = {
					couTypeCategoryAlias: 'ZYHZM'
				}
				this.$http.post(`/app/json/coupon/getMyCouponCnt`, obj).then(res => {
					let data = res.data
					if (data.status == 0) {
						// 商品列表
						let menuObj = data.data || {}
						let menuList = []
						for (let key in menuObj) {
							let obj = {}
							switch (key) {
								case 'unusednum':
									obj = {
										name: '未使用',
										num: menuObj[key],
										type: 'getUnusedCouponsWithCols',
										sort: 0
									}
									menuList.push(obj)
									break
								case 'usednum':
									obj = {
										name: '使用记录',
										num: menuObj[key],
										type: 'getUsedCoupons',
										sort: 1
									}
									menuList.push(obj)
									break
								case 'expnum':
									obj = {
										name: '已过期',
										num: menuObj[key],
										type: 'getExpiredCoupons',
										sort: 2
									}
									menuList.push(obj)
									break
							}
						}
						menuList = menuList.sort((a, b) => a.sort - b.sort)
						this.menuList = menuList
						resolve()
					}
					this.$Loading.close()
				})
			})
		},
		// 获取数据
		loadMore (isReset) {
			console.log(this.page)
			if (this.aysflag) {
				return
			}
			// 打开全局loading
			this.$Loading.open();
			this.page++
			
			// 防止请求积累-打开开关
			this.aysflag = true;
			let obj = {
				page: this.page,
				rows: this.rows,
				couTypeCategoryAlias: 'ZYHZM'
			}
			this.$http.post(`/app/json/coupon/${this.currentType}`, obj).then(res => {
				let data = res.data
				if (data.status === 0) {

					let couponList = data.data || []
					couponList.map(item => {
						item.dpedData = this.$mallCommon.priceFromItem(item)
						item.linePrice = this.$util.toDecimal2(item.dpedData.linePrice)
						return item
					})
					this.couponList = this.couponList.concat(couponList)
					console.log(this.couponList)
				}
				// 防止请求积累-打开开关
				this.aysflag = false;
				// 加载完成显示数据
				this.hasGetData = true;
				if (isReset) {
					this.$refs.scroll.openPullUp()
				}
				// 关闭全局loading
				this.$Loading.close()
				// 当数据列表内容和返回总数相同时,停止加载
				if (this.couponList.length >= data.totalRecords) {
					this.hasMore = false
				}
			})
		},
		// 切换状态
		subMenuHandler (alias) {
			if (alias === this.currentType) {
				return
			}
			if (this.$refs.scroll) {
				this.$refs.scroll.scrollTo(0, 0)
			}
			this.currentType = alias
			this.reset()
		},
		// 重置
		reset () {
			this.$refs.scroll.closePullUp()
			this.hasMore = true
			this.hasGetData = false
			this.page = 0
			this.couponList = []
			this.loadMore()
		}
	},
	computed: {
		disabled () {
			return this.currentType === 'getUsedCoupons' || this.currentType === 'getExpiredCoupons'
		}
	},
	watch: {
		'$route': {
			handler: function (to, from) {
				// 首次进入初始化
				if (this.isFirstEnter) {
					this.pageInit()
				}
			},
			immediate: true
		},
	},

}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.menu-list {
	overflow: hidden;
	padding: 12px 5px;
	display: flex;
	flex-shrink: 0;

	.menu-item {
		flex: 1;
		text-align: center;
		font-size: 14px;

		.text {
			padding: 5px 8px;
			display: inline-block;
		}

		& + .menu-item {
			padding-left: 15px;
		}

		&.active {
			.text {
				background: #F80F16;
				border-radius: 15px;
				color: #fff;
			}
		}
	}
}

.coupon-center {
	display: flex;
	flex-direction: column;

	.coupon-content {
		flex: 1;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.coupon-list-wrapper {
		padding-bottom: 40px;
		display: flex;
		flex-direction: column;
		flex: 1;
		position: relative;
		overflow: hidden;

		.tip {
			padding: 11px 15px;
			text-align: center;
			color: #999999;
			flex-shrink: 0;
		}

		.no-coupon-wrapper {
			position: absolute;
			top: 10%;
			left: 50%;
			transform: translate3d(-50%, 0, 0);
			text-align: center;

			.img {
				width: 90px;
			}

			.title {
				padding-top: 24px;
				font-size: 18px;
				color: #5a5a5a;
			}

			.sub-title {
				padding-top: 15px;
				font-size: 12px;
			}
		}
	}

	.coupon-list-scroll {
		padding: 8px;
		height: 100%;
		/* overflow-x hidden */
		/* -webkit-overflow-scrolling touch */
		flex: 1;

		.coupon-item {
			& + .coupon-item {
				margin-top: 8px;
			}
		}

		.delete {
			width: 65px; /* no */
			text-align: center;
			display: flex;
			align-items: center;
			color: #fff;
			height: 100%;
			justify-content: center;
		}
	}

	.footer-btn {
		background: #fff;
		position: absolute;
		bottom: 0;
		width: 100%;
		left: 0;
		height: 40px;
		font-size: 0;
		display: table;
		box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
		z-index: 10;

		.btn {
			display: table-cell;
			vertical-align: middle;
			padding: 4px 0;
			text-align: center;
			font-size: 14px;
			position: relative;

			& + .btn {
				&:after {
					position: absolute;
					content: '';
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 80%;
					z-index: 1;
					border-left: 1px solid #d5d5d5;
				}
			}
		}
	}

	.no-data {
		padding: 15px;
		text-align: center;
	}
}
</style>