<template>
	<div>
		<nav-top @backEvent="$router.go(-1)" :noBack="noBack"></nav-top>
    <nav-content class="container">
    	<van-tabs
    		v-model="activeTab"
    		color="#C9A063"
    		title-active-color="#C9A063"
    		@click="changeTabs">
			  <van-tab title="未使用"></van-tab>
			  <van-tab title="已使用"></van-tab>
			  <van-tab title="已过期"></van-tab>
			</van-tabs>
			<div class="exchange-container" v-if="activeTab == 0">
				<input class="enter-input" type="text" placeholder="输入兑换码兑换电子券" v-model="dynamicCode">
				<van-button class="exchange-btn" type="primary" color="#F02C2D" @click="exchangeHandler">兑换</van-button>
			</div>
			<scroll
        ref="scroll"
        class="coupon-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :data="couponList">
        <ul class="coupon-c" v-if="couponList.length !== 0">
          <li
            v-for="(item, index) in couponList"
            :key="index"
            class="item"
            @click="couponClick(item)">
            <!-- 可用的券 -->
            <div class="coupon-c" v-if="item.state != 0">
            	<div class="left">
	            	<p class="name">{{ item.couTypeTitle }}</p>
	            	<p class="scope">适用：{{ dealwithStore(item.storeModelList) }}</p>
	            	<p class="expiration-date">有效期：{{ formatData(item.validStartDate) + '至' + formatData(item.validEndDate) }}</p>
	            </div>
	            <div class="right">
								<div class="top-around"></div>
								<div class="top-around-cover"></div>
								<div class="bottom-around"></div>
								<div class="bottom-around-cover"></div>
	            	<p class="price">￥{{ dealWithPrice(item.couFaceValue)[2] }}</p>
	            	<span class="tip-btn">去使用</span>
	            </div>
            </div>
            <!-- 不可用的券 -->
            <div class="coupon-c" v-else>
            	<div class="left">
	            	<p class="name">{{ item.couTypeTitle }}</p>
	            	<p class="scope">有效期：{{ formatData(item.validStartDate) + '至' + formatData(item.validEndDate) }}</p>
	            	<p class="coupon-price">￥{{ dealWithPrice(item.couFaceValue)[2] }}</p>
	            </div>
	            <div class="right">
								<div class="top-around"></div>
								<div class="top-around-cover"></div>
								<div class="bottom-around"></div>
								<div class="bottom-around-cover"></div>
	            	<!-- <div class="state-tips">已使用</div> -->
	            </div>
            </div>
          </li>
        </ul>
				<p v-else class="no-result-message">暂无数据~</p>
      </scroll>
    </nav-content>
	</div>
</template>
<script>
	import utils from '../../assets/utils/tools'
	import scroll from "@/components/base/scroll/scroll";
	export default {
		mixins: [utils],
		components: {
			scroll
		},
		data() {
			return {
				activeTab: 0,
				hasMore: true,
				dynamicCode: '',
				couponList: [],
				noBack: false,
				pageInfo: {
					page: 1,
					rows: 10,
				}
			}
		},
		mounted() {
			if (this.$route.query.noBack) {
				this.noBack = true
			}
			this.initUnusedList()
		},
		methods: {
			dealwithStore(storeArr) {
				if (storeArr instanceof Array && storeArr.length > 0) {
					if (storeArr.length > 1) {
						return '多家门店'
					} else {
						return storeArr[0].storeName
					}
				}
			},
			formatData(data) {
				if (data) {
					return this.$util.formatDate(new Date(data.replace(/\-/g, '/')), 'yyyy-MM-dd')
				} else {
					return '--'
				}
			},
			// 获取券列表方法
			initUnusedList(url = '/app/json/app_serve_cou/getUnusedCoupons') {
				this.$STLoading.open();
				this.$http.post(url, {
					...this.pageInfo,
					couTypeCategoryAlias: 'FW'
				}).then(res => {
					let data = res.data;
					this.$STLoading.close();
					if (data.status == 0) {
						if (data.data instanceof Array) {
							data.data.forEach(item => {
								if (this.activeTab === 0) {
									item.state = 1
								} else {
									item.state = 0
								}
							});
							this.couponList.push(...data.data);
							if (this.pageInfo.page >= data.totalPages) {
								this.hasMore = false;  
							}
						}
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`getUnusedCoupons err ${err}`);
					this.$STLoading.close();
				})
			},
			// 兑换
			exchangeHandler() {
				if (!this.dynamicCode) {
					this.$Toast('请输入兑换码')
					return false;
				}
				this.$http.post('/app/json/app_serve_cou/offlineSaleServeActivate', {
					dynamicCode: this.dynamicCode
				}).then(res => {
					let data = res.data;
					if (data.status == 0) {
						this.$Toast('兑换成功！');
						this.dynamicCode = '';
						this.couponList = [];
						this.pageInfo = {
							page: 1,
							rows: 10,
						}
						this.initUnusedList();
						this.hasMore = true;
					} else {
						this.$Toast(data.info);
					}
				})
				.catch(err => {
					this.$Toast(`offlineSaleServeActivate err ${err}`);
				})
			},
			changeTabs(name, title) {
				this.couponList = [];
				this.pageInfo = {
					page: 1,
					rows: 10
				}
				switch (name) {
					case 0:
						this.initUnusedList()
						break;
					case 1:
						this.initUnusedList('/app/json/app_serve_cou/getUsedCoupons')
						break;
					case 2:
						this.initUnusedList('/app/json/app_serve_cou/getExpiredCoupons')
						break;
				}
				this.hasMore = true;
			},
			loadMore() {
				++this.pageInfo.page;
				switch (this.activeTab) {
					case 0:
						this.initUnusedList()
						break;
					case 1:
						this.initUnusedList('/app/json/app_serve_cou/getUsedCoupons')
						break;
					case 2:
						this.initUnusedList('/app/json/app_serve_cou/getExpiredCoupons')
						break;
				}
			},
			couponClick(item) {
				if (this.activeTab == 0) {
					this.$router.push({
						path: '/coupon_service_detail',
						query: {
							couNo: item.couNo
						}
					})
				}
			}
		},
		beforeRouteLeave(to, from, next) {
			if (to.path != '/coupon_service_detail') {
				this.$keepaliveHelper.deleteCache(this)
			}
			next()
		},
	}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
	display flex;
	flex-direction column;

}
.exchange-container {
	margin 20px 20px 0;
	display flex;
	
	.enter-input {
		flex 1;
		border 1px solid #ddd;
		border-right none;
		border-radius 5px 0 0 5px;
		font-size 16px;
		padding-left 15px;
		-webkit-appearance: none;
	}
	.exchange-btn {
		border-radius 0 5px 5px 0;
		padding 0 24px;
	}
}
.coupon-list {
	margin-top 5px;
	flex 1;
  padding 0 20px;
  /deep/ .scroll-content {
    padding-top: 5px;
  }
  .item {
  	padding 15px 10px;
  	box-shadow: 0px 0px 2px 2px #F5F5F5;
  	border-radius 5px;
  	margin-top 14px;
  	.coupon-c {
  		display flex;
  	}
  	&:first-child {
  		margin-top 0;
  	}
  	.left {
			flex 1;
			.name {
				font-size 16px;
				font-weight 500;
				ellipse()
				max-width 215px;
			}
			.scope {
				font-size 13px;
				color #9FA0A0;
				margin-top 10px;
			}
			.expiration-date {
				font-size 13px;
				color #9FA0A0;
				margin-top 10px;
			}
			.coupon-price {
				font-size 15px;
				margin-top 10px;
				color $color-theme-r;
				font-weight 700;
			}
  	}
  	.right {
			width 100px;
			position relative;
			display flex;
			flex-direction column;
			justify-content space-between;
			.price {
				font-size 16px;
				color $color-theme-r;
				font-weight 700;
				text-align center;
			}
			.tip-btn {
				display inline-block;
				height 30px;
				line-height 30px;
				border-radius 15px;
				background-color: $color-theme-r;
				color #fff;
				padding 0 15px;
				font-size 14px;
				margin 0 auto;
			}
			.state-tips {
				font-size 13px;
				background-color: #C9A063
				color #fff;
				height 20px;
				line-height 20px;
				position absolute
				right 0
				top 0;
				padding 0 4px;
				&::before {
					content '';
					display block;
					border 10px solid transparent;
					position absolute;
					left -20px;
					top 0;
					border-right-color #C9A063
				}
			}
			.top-around,
			.bottom-around {
				background-color: #fff;
				position absolute;
				left -10px;
				top -25px;
				width 20px;
				height 20px;
				border-radius 50%;
				z-index: 1;
    		box-shadow: inset 0px 0px 2px 2px #F5F5F5;
			}
			.top-around-cover,
			.bottom-around-cover {
				background-color: #FFF
				position absolute;
				left -10px;
				top -27px;
				width 20px;
				height 10px;
				z-index: 2;
			}
			.bottom-around {
				top auto;
				bottom -25px;
			}
			.bottom-around-cover {
				top: auto;
				bottom -27px;
			}
  	}
  }
}
</style>