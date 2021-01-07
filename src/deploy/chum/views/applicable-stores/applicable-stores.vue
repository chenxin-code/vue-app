<template>
	<div>
		<nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
			<scroll
        ref="scroll"
        class="stores-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :data="storeList"
        v-if="storeList.length !== 0">
        <ul class="stores-c">
        	<li
        		v-for="(item, index) in storeList"
        		:key="index"
        		class="item">
        		<div class="left">
        			<img :src="item.storePictureUrl" alt="" class="prod-img">
        		</div>		
        		<div class="center">
        			<p class="prod-name">{{ item.storeName }}</p>
							<p class="business-hours">时间：{{ dealwithTime(item) }}</p>
        			<p class="prod-address">{{ item.address }}</p>
        		</div>
        		<div class="right" @click="goToMap(item)">
        			<img src="../../assets/images/icon-navigation.png" alt="" class="icon-nav">
							<span class="prod-distance">{{ $util.toDecimal2(item.distance / 1000) }}km</span>
        		</div>
        	</li>
        </ul>
      </scroll>
    </nav-content>
	</div>
</template>
<script>
import scroll from "@/components/base/scroll/scroll";
export default {
	components: {
		scroll
	},
	data() {
		return {
			hasMore: true,
			storeList: [],
			pageInfo: {
				page: 1,
				rows: 10,
			}
		}
	},
	mounted() {
		this.getApplicableStores();
	},
	methods: {
		loadMore() {
			++this.pageInfo.page;
			this.getApplicableStores();
		},
		// 获取适用门店
		getApplicableStores() {
			this.$STLoading.open();
			this.$http.post('/app/json/app_cou_service/queryCanUseStoreList', {
				skuId: this.$route.query.skuId,
				storeOuCode: this.$route.query.storeOuCode,
				posx: this.$store.state.currentLocation.posx,
				posy: this.$store.state.currentLocation.posy,
				getType: 1,
				...this.pageInfo
			}).then(res => {
				let data = res.data;
				if (data.status == 0) {
					if (data.data instanceof Array) {
						this.storeList.push(...data.data);
					}
					if (this.pageInfo.page >= data.totalPages) {
						this.hasMore = false;  
					}
				} else {
					this.$Toast(data.info);
				}
				this.$STLoading.close();
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
		goToMap(item) {
			this.$bridgefunc.baiduNav(
				{
					startlong: this.$store.state.currentLocation.posx,
					startlat: this.$store.state.currentLocation.posy,
					endlong: item.posx,
					endlat: item.posy,
					type: "nav"
				}
			);
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
	.stores-list {
		padding 0 20px;
		position absolute
		left 0;
		right 0
		top 0;
		bottom 0;
		height auto;
		/deep/ .scroll-content {
	    padding-top: 5px;
	  }
	  .stores-c {
	  	.item {
	  		border-radius 5px;
	  		box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
	  		padding 10px;
	  		display flex;
	  		align-items center;
				margin-top 10px;
				&:first-child {
					margin-top 0
				}
	  		.left {
					.prod-img {
						display block;
						width 75px;
						height 75px;
						// border 1px dashed #ddd;
						border-radius 4px;
					}
	  		}
	  		.center {
					flex 1;
					padding 0 10px;
					display flex;
					flex-direction column;
					justify-content space-around;
					.prod-name {
						font-size 15px;
						font-weight 500;
						line-height 18px;
						ellipse-2();
					}
					.prod-address {
						font-size 13px;
						font-weight 400;
						color #9FA0A0;
						line-height 16px;
						margin-top 7px;
					}
					.business-hours {
						font-size 13px;
						font-weight 400;
						color #9FA0A0;
						margin-top 7px;
					}
	  		}
	  		.right {
					extend-click();
					.icon-nav {
						display block;
						width 20px;
						height 20px;
						margin 0 auto;
					}
					.prod-distance {
						display block;
						font-size 13px;
						color #9FA0A0;
						margin-top 8px;
					}
	  		}
	  	}
	  }
	}
}
</style>