<template>
  <div class="container">
		<div class="content-c">
			<!-- 顶部轮播图，返回导航 -->
			<div class="swiper-container">
				<div class="back-btn" @click="$router.go(-1)">
					<i class="iconfont mall-fanhui"></i>
				</div>
				<swiper :options="swiperOption" style="height: 200px;">
					<swiper-slide v-for="(item, index) in imageList" :key="index">
						<div class="swiper-item" @click="showBigImageEvent">
							<img :src="item" class="prod-img" />
						</div>
					</swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
			<!-- 服务信息&价格 -->
			<div class="service-info">
				<p class="ser-name">{{ productInfoData.skuName }}</p>
				<div class="price-c">
					<!-- <span class="current-price">¥{{ dealWithPrice($route.query.salePrice)[2] }}</span>
					<span class="old-price">¥{{ dealWithPrice($route.query.price)[2] }}</span> -->
					<span class="current-price">¥{{ dealWithPrice(productInfoData.activityPrice)[2] }}</span>
					<span class="old-price" v-if="productInfoData.activityPrice != productInfoData.salePrice">¥{{ dealWithPrice(productInfoData.salePrice)[2] }}</span>
				</div>
			</div>
			<!-- 门店信息 -->
			<div class="public-block store-info" v-if="entryType == 0">
				<div class="top-info" @click="goToApplicableStores">
					<p class="title">适用门店</p>
					<p class="match-num">共{{ storeInfoData.allStoreNum }}家<i class="iconfont mall-gengduojiantou arrow-icon"></i></p>
				</div>
				<div class="bottom-info" @click="goToMap">
					<div class="airport-info">
						<p class="name">{{ storeInfoData.storeName }}</p>
						<p class="time">时间：{{ dealwithTime() }}</p>
						<p class="address">{{ storeInfoData.address }}</p>
					</div>
					<div class="navigation-info">
						<img src="../../assets/images/icon-navigation.png" alt="" class="icon-nav">
						<span class="nav-text">{{ $util.toDecimal2(storeInfoData.distance / 1000) }}km</span>
					</div>
				</div>
			</div>
			<!-- 门店设施 -->
			<div class="public-block store-facilities" v-if="facilitiesList.length > 0">
				<p class="title">门店设施</p>
				<ul class="facilities-list">
					<li class="item" v-for="(item, index) in facilitiesList" :key="index">
						<div class="icon">
							<img :src="item.facilityIconUrl" alt="">
						</div>
						<span class="name">{{ item.facilityName }}</span>
					</li>
				</ul>
			</div>
			<!-- 产品介绍 -->
			<div class="public-block prod-info">
				<p class="title">产品介绍</p>
				<div class="prod-content" v-html="productInfoData.proSkuMediaModel.mobileDetail"></div>
			</div>
		</div>
		<!-- 底部按钮 -->
		<div class="chum-public-btn bottom-btn">
      <van-button
        round
        block
        type="info"
        @click="isShowBuyModal = true"
        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)">立即购买</van-button>
    </div>
    <!-- 购买弹窗 -->
    <van-popup
    	position="bottom"
    	closeable
    	class="buy-modal"
    	v-model="isShowBuyModal">
    	<div class="prod-info">
    		<img :src="productInfoData.phMainUrl" alt="" class="prod-img">
    		<div class="right">
    			<p class="name">{{ productInfoData.skuName }}</p>
    			<div class="price">
    				<span class="current-price">¥{{ dealWithPrice(productInfoData.activityPrice)[2] }}</span>
    				<span class="old-price" v-if="productInfoData.activityPrice != productInfoData.salePrice">¥{{ dealWithPrice(productInfoData.salePrice)[2] }}</span>
    			</div>
    		</div>
    	</div>
    	<div class="specification">
    		<div class="speci-c" v-for="(item, index) in productInfoData.featureList" :key="index">
    			<p class="title">{{ item.featureName }}</p>
	    		<ul class="speci-list">
	    			<li
	    				class="item"
	    				v-for="(item2, index2) in item.featureValueList"
	    				:key="index2"
	    				@click="choseFeature(item2, index)"
	    				:class="{active: item2.isSelect}">{{ item2.featureValue }}</li>
	    		</ul>
    		</div>
    	</div>
    	<div class="purchase-quantity">
    		<p class="title">购买数量（库存{{ inventory }}）</p>
    		<van-stepper
    			v-model="purchaseNum"
    			:min="1"
    			integer
    			class="reset-setpper"
    			:max="inventory"/>
    	</div>
    	<div class="chum-public-btn modal-submit-btn">
	      <van-button
	        round
	        block
	        type="info"
	        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
					@click="confirm">立即购买</van-button>
	    </div>
    </van-popup>
  </div>
</template>
<script>
	import utils from '../../assets/utils/tools'
	export default {
		mixins: [utils],
		data() {
			return {
				isShowBuyModal: false,
				imageList: [],
				swiperOption: {
	        speed: 500,
	        pagination: {
            el: '.swiper-pagination'
          },
	        autoplay: true,
	        loop: true,
	        observer: true,
	        observeParents: true,
	      },
	      specActiveIndex: 0,
	      specificationList: [],
				purchaseNum: 1,
				storeInfoData: {},
				productInfoData: {
					proSkuMediaModel: {}
				},
				inventory: 1, // 库存
				skuId: this.$route.query.skuId,
				facilitiesList: [],
				entryType: 0, // 0 服务券 1 会员卡
			}
		},
		mounted() {
			this.entryType = this.$route.query.entryType || 0
			this.initDetail()
		},
		methods: {
			// 规格选择
			choseFeature(choseFeatureValue, index) {
				let feature = this.productInfoData.featureList[index];
				feature.featureValueList.forEach(item => {
					item.isSelect = false;
				});
				choseFeatureValue.isSelect = true;
				this.$forceUpdate();

				let result = [];
				this.productInfoData.featureList.forEach(item => {
					item.featureValueList.forEach(item2 => {
						if (item2.isSelect) {
							result.push(item2.featureValueId);
						}
					})
				})
				this.initDetail(result);
			},
			// 获取商品详情
			initDetail(featureValueIds = []) {
				this.$STLoading.open();
				this.$http.post('/app/json/product/getAppProDetail', {
					skuId: this.skuId,
					deliverType: 2,
					productType: 5,
					featureValueIds,
				}).then(res => {
					let data = res.data;
					this.$STLoading.close();
					if (data.status == 0) {
						this.productInfoData = data.data;
						this.skuId = data.data.skuId;
						// 处理轮播图
						if (data.data.picUrls instanceof Array) {
							this.imageList = data.data.picUrls;
						}
						// 处理规格
						let allFeatureList = [];
						if (data.data.featureList instanceof Array) {
							data.data.featureList.forEach(item => {
								allFeatureList.push(...item.featureValueList);
							})
						}
						allFeatureList.forEach(item => {
							data.data.myFeatureValueList.forEach(item2 => {
								if (item.featureId == item2.featureId && item.featureValueId == item2.featureValueId) {
									item.isSelect = true;
								}
							})
						})
						// 查询库存
						this.getStockNum();
						if (this.entryType == 0) {
							// 获取适用门店
							this.getApplicableStores()
						}
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`getAppProDetail err ${err}`);
					this.$STLoading.close();
				})
			},
			showBigImageEvent() {
			},
			// 去适用门店列表
			goToApplicableStores() {
				this.$router.push({
					path: '/applicable_stores',
					query: {
						skuId: this.skuId,
						storeOuCode: this.productInfoData.storeOuCode,
					}
				})
			},
			// 立即购买
			confirm() {
				this.$STLoading.open();
				let paramsData = {
					deliveryType: 2,
					carts: [
						{
							skuId: this.skuId,
							storeOuCode: this.productInfoData.storeOuCode,
							number: this.purchaseNum,
							selfActivityId: '',
							checked: 1
						}
					]
				}
				this.$http.post('/app/json/app_cart/SettleCart', paramsData).then(res => {
					let data = res.data;
					if (data.status == 0) {
						this.$router.push({
							name: 'confirm_order',
							params: {
								occurData: data.data.occur[0],
								settleCartData: paramsData,
								skuName: this.productInfoData.skuName,
								salePrice: this.productInfoData.activityPrice,
								phMainUrl: this.productInfoData.phMainUrl,
							}
						})
					} else {
						this.$Toast(data.info);
					}
					this.$STLoading.close();
				}).catch(err => {
					this.$Toast(`SettleCart err ${err}`);
					this.$STLoading.close();
				})
			},
			// 获取适用门店
			getApplicableStores() {
				this.$STLoading.open();
				this.$http.post('/app/json/app_cou_service/queryCanUseStoreList', {
					skuId: this.skuId,
					storeOuCode: this.productInfoData.storeOuCode,
					posx: this.$store.state.currentLocation.posx,
					posy: this.$store.state.currentLocation.posy,
					// posx: 116.372712,
					// posy: 40.105091,
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

							// 获取门店设施
							this.getFacilityList()
						}
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`queryCanUseStoreList err ${err}`);
					this.$STLoading.close();
				})
			},
			getFacilityList() {
				this.$Loading.open()
				this.$http.post('/app/json/app_store/queryFacilityList', {
					storeId: this.storeInfoData.id
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						if (data.data instanceof Array && data.data.length > 0) {
							this.facilitiesList.push(...data.data)
						}
					} else {
						this.$Toast(data.info)
					}
				})
				.catch(err => {
					this.$Loading.close()
					this.$Toast(`queryFacilityList err ${err}`)
				})
			},
			// 去导航
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
			// 查询库存
			getStockNum() {
				this.$http.post('/app/json/app_stock/querySkuStockByApp', {
					productList: [{skuId: this.productInfoData.skuId}],
					deliverType: 2,
					storeCode: this.productInfoData.storeOuCode
				}).then(res => {
					let data = res.data;
					if (data.status == 0) {
						this.inventory = data.data.productList[0].stockCurrentNumber
					} else {
						this.$Toast(data.info);
					}
				}).catch(err => {
					this.$Toast(`querySkuStockByApp err ${err}`);
				})
			},
			// 处理适用门店时间
			dealwithTime() {
				if (this.storeInfoData && this.storeInfoData.openingTime && this.storeInfoData.closingTime) {
					return `${this.storeInfoData.openingTime} - ${this.storeInfoData.closingTime}`
				} else {
					return '暂无 - 暂无'
				}
			}
		}
	}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.public-block {
	margin 0 20px;
	border-radius 5px;
	box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
	padding 12px 10px;
}
.container {
	.content-c {
		position absolute;
		left 0
		right 0
		top 0
		bottom 70px;
		overflow-y auto;
		padding-bottom 10px;
	}
	.swiper-container {
		position relative;
		.back-btn {
			width 25px;
			height 25px;
			line-height 25px;
			text-align center;
			color #fff;
			background: rgba(38,42,63,0.9);
			border-radius 17px;
			position absolute;
			left 20px;
			top 10px;
			z-index 2;
		}
		.swiper-item {
			.prod-img {
				display block;
				width 100%;
				height 200px;
			}
		}
	}
	.service-info {
		margin 10px 20px 0;
		.ser-name {
			font-size 16px;
			font-weight: 500;
			color #101010;
			line-height 20px;
		}
		.price-c {
			margin-top 6px;
			.current-price {
				font-size 16px;
				font-weight 700;
				color $color-theme-r;
			}
			.old-price {
				padding-left 10px;
				font-size 13px;
				color #999;
				text-decoration: line-through;
			}
		}
	}
	.store-info {
		margin-top 26px;
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
				.time {
					font-size 13px;
					color #9FA0A0;
					margin-top 6px;
				}
				.address {
					font-size 13px;
					color #9FA0A0;
					margin-top 6px;
				}
			}
			.navigation-info {
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
				}
			}
		}
	}
	.store-facilities {
		margin-top 10px;
		.title {
			font-size 14px;
			font-weight 400;
			padding-bottom 10px;
			bdr-b();
		}
		.facilities-list {
			display flex;
			flex-wrap wrap;
			.item {
				text-align center;
				width 25%;
				height 60px;
				display flex;
				flex-direction column;
				align-items center;
				padding 4px 0;
				.icon {
					flex 1;
					width 100%;
					display flex;
					flex-direction column;
					justify-content center;
					align-items center;
					overflow hidden;
					img {
						width 38%;
					}
				}
				.name {
					font-size 12px;
					color #8f908f;
					line-height 18px;
					width 100%;
					ellipse();
				}
			}
		}
	}
	.prod-info {
		margin-top 10px;
		.title {
			font-size 14px;
			font-weight 400;
			padding-bottom 10px;
			bdr-b();
		}
		.prod-content {
			margin-top 10px;
			overflow hidden;
			/deep/ img {
				width 100%;
			}
		}
	}

	.bottom-btn {
		position absolute;
		left 0;
		right 0
		bottom 0;
		padding 10px 20px;
		background-color: #FFF;
		box-shadow 0 0 5px #ddd;
	}

	.buy-modal {
		padding 25px 20px 0;
		.prod-info {
			display flex;
			.prod-img {
				display block;
				width 100px;
				height 100px;
				border-radius 5px;
			}
			.right {
				flex 1;
				padding-left 10px;
				display flex;
				flex-direction column;
				justify-content space-around;
				.name {
					font-weight 500;
					font-size 15px;
					line-height 18px;
					ellipse-2();
				}
				.price {
					.current-price {
						font-size 16px;
						font-weight 700;
						color $color-theme-r;
					}
					.old-price {
						font-size 13px;
						color #999;
						text-decoration: line-through;
						padding-left 10px;
					}
				}
			}
		}
		.specification {
			margin-top 30px;
			.title {
				font-size 15px
				font-weight 500;
			}
			.speci-list {
				margin-top 10px;
				.item {
					font-size 14px;
					padding 0 10px;
					height 30px;
					line-height 30px;
					border-radius 15px;
					border 1px solid #ccc;
					display inline-block;
					color #9FA0A0;
					margin-left 10px;
					&:first-child {
						margin-left 0;
					}
					&.active {
						color $color-theme-r;
						border-color $color-theme-r;
					}
				}
			}
		}
		.purchase-quantity {
			display flex;
			justify-content space-between;
			align-items center;
			margin-top 25px;
			.title {
				font-size 15px;
				font-weight 500;
			}
			.reset-setpper {
				display flex;
				align-items center;
				/deep/ .van-stepper__minus,
				/deep/ .van-stepper__plus {
					font-size 15px;
					background-color: #FFF;
					border 1px solid #ddd;
					width 33px;
				}
				/deep/ .van-stepper__input {
					margin 0;
					border-top 1px solid #ddd;
					border-bottom 1px solid #ddd;
					background-color: #FFF;
				}
			}
		}
		.modal-submit-btn {
			margin-top 54px;
			margin-bottom 10px;
		}
	}
}
</style>
