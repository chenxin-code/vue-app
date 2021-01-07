<template>
	<div class="Mall-GoodList">
		<Search :isTool="true" :value="proSkuSale.keyword" @toogleLayout="toogleLayout" @on-submit="searchEvent" @go-back="backEvent" ></Search>
		<div  class="tool">
			<div class="item" @click="priceSort">
				<div class="text">价格</div>
				<div class="icon">
					<img class="full-img" v-if="priceSortType == ''" src="@/../static/image/mall/screen1-1.png">
					<img class="full-img" v-if="priceSortType == 'ASC'" src="@/../static/image/mall/screen1-2.png">
					<img class="full-img" v-if="priceSortType == 'DESC'" src="@/../static/image/mall/screen1-3.png">
				</div>
			</div>
			<div class="item" @click="saleNumSort">
				<div class="text">销量</div>
				<div class="icon">
					<img class="full-img" v-if="saleNumSortType == ''" src="@/../static/image/mall/screen1-1.png">
					<img class="full-img" v-if="saleNumSortType == 'ASC'" src="@/../static/image/mall/screen1-2.png">
					<img class="full-img" v-if="saleNumSortType == 'DESC'" src="@/../static/image/mall/screen1-3.png">
				</div>
			</div>
			<div class="item" @click="openFilterSidebarPop">
				<div class="text">筛选</div>
				<div class="icon">
					<img class="full-img" src="@/../static/image/mall/screen3-1.png">
				</div>
			</div>
			<div v-if="filterSidebarPop" @click.self="closeFilterSidebarPop" class="sidebar-popover-wrapper">
				<div class="sidebar-popover">
					<div class="sidebar-body">
						<div class="items">
							<div class="items-title">
								<span>分类</span>
								<span class="more-title">全部分类</span>
							</div>
						</div>
						<div class="items">
							<div class="items-title">
								<span>价格</span>
							</div>
							<div class="price-ui">
								<div class="btn">
									<input type="number" placeholder="最低价" @keypress="keypressPrice(priceStart, $event)" v-model="priceStart" min="0" max="999999999" />
								</div>
								<div class="line"> —— </div>
								<div class="btn">
									<input type="number" placeholder="最高价" @keypress="keypressPrice(priceEnd, $event)" v-model="priceEnd" min="0" max="999999999" />
								</div>
							</div>
						</div>
						<div class="items">
							<div class="items-title">
								<span>品牌</span>
							</div>
							<div class="items-body">
								<div class="item-btn" :class="{'brand-active': brandId.indexOf(item.id) != -1}" v-for="item in brandList" @click="selectBrand(item)">{{item.brandName}}</div>
							</div>
						</div>
						<div class="items" v-for="(item_group , group_name ) in sidebar_category">
							<div class="items-title">
								<span>{{group_name}}</span>
							</div>
							<div class="items-body">
								<div class="item-btn" :class="{'brand-active': category_Id.indexOf(item.id) != -1}" v-for="item in item_group" @click="selectCategory(item)">{{item.value}}</div>
							</div>
						</div>
					</div>
					<div class="sidebar-footer">
						<div class="item-btn" @click="resetFilter">重置</div>
						<div class="item-btn" @click="filterSidebarSetting">确定</div>
					</div>
				</div>
			</div>
		</div>
    <div class="layout" ref="tool" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight()+50)+ 'px'}">
      <LayoutGrid v-if="goodsLayout == 'grid'" :listData="viewData" :scrollDisabled='scrollDisabled' @loadMore="loadMore" @itemEvent="itemEvent"></LayoutGrid>
      <LayoutList v-if="goodsLayout == 'list'" :listData="viewData" :scrollDisabled='scrollDisabled' @loadMore="loadMore" @itemEvent="itemEvent"></LayoutList>
    </div>

	</div>
</template>

<script>
import {Toast } from 'mint-ui';
import Search from '../base/search';
import LayoutGrid from '../base/layout-grid';
import LayoutList from '../base/layout-list';

export default {
	name: 'Mall-GoodList',
	components: {
		Toast,
		Search,
		LayoutGrid,
		LayoutList,
	},
	data() {
		return {
			// 布局方式 grid / list ,默认grid
			goodsLayout: 'grid',
			// 价格排序 ASC:升序, DESC:降序
			priceSortType: '',
			// 销量排序
			saleNumSortType: '',
			// 是否显示侧边栏筛选界面，默认不显示
			filterSidebarPop: false,
			// 视图数据
			viewData: [],
			// 列表总列数
			totalCount: 0,
			// 品牌列表
			brandList: [],
			// 选中品牌的id
			brandId: [],
			// 侧边栏的分类
			sidebar_category:{
				"category_name":[{
					id: '',		//存取的主id
					value: '',		//属性值
				}]
			},
			//侧栏的分类ID
			category_Id: [],
			// 分页 默认请求第一页一页十条
			page: {
				pageSize: '10',
				index: '1',
			},
			priceStart: '',
			priceEnd: '',
			// sku
			proSkuSale: {
				categoryId: '',
				category_Id: '',
				keyword: '',
				salePriceRange: '',
			},
			// 搜索数据
			// searchValue: '',
		};
	},
	computed: {
		scrollDisabled: function() {
			return this.viewData.length >= this.totalCount && this.totalCount > 0;
		},
	},
	created() {
		let categories = this.$route.query.categories;
		let search = this.$route.query.search;
		this.proSkuSale.categoryId = categories;
		//this.proSkuSale.category_Id = category_Id;
		this.proSkuSale.keyword = search;
	},
	methods: {
		itemEvent: function(eventData) {
			let item = eventData.data;
			let type = eventData.type;
			if (type == 1) {
				this.$bridgefunc.customPush({
					path: '/mallgooddetail',
					query: {
            skuId: item.skuId,
						storeOuCode: item.storeOuCode
					},
				});
			} else if (type == 2) {
				this.addToCart(item);
			}
		},
		addToCart: function(item) {
			this.$Loading.open();
			let url = '/app/json/ord_cart/addCart';
			let params1 = {
				token: this.$store.state.login.token,
				skuId: item.skuId,
				number: 1,
				price: item.salePrice,
			};
			let _this = this;
			this.$http.post(url, params1).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					console.log(data);
					if (data.status == 0) {
						_this.$Toast('加入购物车成功');
					} else {
						_this.$Toast(data.info);
					}
				},
				error => {
					_this.$Loading.close();
					console.log('获取失败', error);
					_this.$Toast('获取数据失败');
				}
			);
		},
		// 切换商品布局方式
		toogleLayout: function() {
			if (this.goodsLayout == 'grid') {
				this.goodsLayout = 'list';
			} else if (this.goodsLayout == 'list') {
				this.goodsLayout = 'grid';
			}
		},
		// 价格升序or降序排序
		priceSort: function() {
			this.saleNumSortType = '';
			if (this.priceSortType == '') {
				this.priceSortType = 'ASC';
			} else if (this.priceSortType == 'ASC') {
				this.priceSortType = 'DESC';
			} else if (this.priceSortType == 'DESC') {
				this.priceSortType = '';
			}
			this.page.index = '1';
			this._getProductList(this.priceSortType == '' ? '' : 'sale_price', this.priceSortType);
		},
		// 销量升序降序排序
		saleNumSort: function() {
			this.priceSortType = '';
			if (this.saleNumSortType == '') {
				this.saleNumSortType = 'ASC';
			} else if (this.saleNumSortType == 'ASC') {
				this.saleNumSortType = 'DESC';
			} else if (this.saleNumSortType == 'DESC') {
				this.saleNumSortType = '';
			}
			this.page.index = '1';
			this._getProductList(this.saleNumSortType == '' ? '' : 'sale_num', this.saleNumSortType);
		},
		// 打开侧边栏筛选界面
		openFilterSidebarPop: function() {
			// 获取品牌
			if (this.brandList.length > 0) {
				this.filterSidebarPop = true;
				return false;
			}
			this.$Loading.open();
			let url = '/app/json/product/loadBrandList';
			let paramsData = {
				token: this.$store.state.login.token,
				proSkuSale: {
					categoryId: this.proSkuSale.categoryId,
					keyword: this.proSkuSale.keyword,
				},
			};
			let _this = this;
			this.$http.post(url, paramsData).then(
				res => {
					let data = res.data.data;
					_this.brandList = res.data.data;
					_this.filterSidebarPop = true;
				},
				error => {
					_this.$Loading.close()
					Toast({
						message: '网络连接失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
			let category_url = '/app/json/product/loadCategoryAttr';
 			let category_paramsData = {
				token: this.$store.state.login.token,
				proSkuSale: {
					categoryId: 145,
				},
			};
 			this.$http.post(category_url, category_paramsData).then(
				res => {
					_this.$Loading.close()
					_this.sidebar_category = res.data.data;
					_this.filterSidebarPop = true;
				},
				error => {
					_this.$Loading.close()
					Toast({
						message: '网络连接失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 选中要筛选的品牌
		selectBrand: function(item) {
			let _index = this.brandId.indexOf(item.id);
			if (_index == -1) {
				this.brandId.push(item.id);
				console.log("选中：品牌"+item.brandName+";ID:"+item.id);
			} else {
				this.brandId.splice(_index, 1);
				console.log("取消：品牌"+item.brandName+";ID:"+item.id);
			}
		},
		// 选中要筛选的分类
		selectCategory: function(item) {
			let _index = this.category_Id.indexOf(item.id);
			if (_index == -1) {
				this.category_Id.push(item.id);
				console.log("选中：分类"+item.value+";ID:"+item.id);
			} else {
				console.log("取消：分类"+item.value+";ID:"+item.id);
			}
		},
		// 价格输入框校验
		keypressPrice: function(val, event) {
			// 只能输入整数
			let patt = /^[0-9]*$/;
			if (!patt.test(event.key)) {
				event.preventDefault();
			}
			// 不能大于九位数
			if (val.length > 8) {
				event.preventDefault();
			}
		},
		// 重置过滤面板
		resetFilter: function() {
			this.brandId = '';
			this.priceStart = '';
			this.priceEnd = '';
			this.proSkuSale.salePriceRange = '';
		},
		// 关闭侧边栏筛选界面
		closeFilterSidebarPop: function() {
			this.filterSidebarPop = false;
		},
		// 筛选侧边栏中的筛选条件
		filterSidebarSetting: function() {
			this.filterSidebarPop = false;
			/*if (this.priceStart == '' && this.priceEnd == '') {
				this.proSkuSale.salePriceRange = '';
			} else if (this.priceStart < this.priceEnd || this.priceStart == this.priceEnd) {
				this.priceStart == '' ? this.priceStart = 0 : this.priceStart;
				this.proSkuSale.salePriceRange = `${this.priceStart}-${this.priceEnd}`;
			} else if (this.priceStart > this.priceEnd) {
				this.priceEnd == '' ? this.priceEnd = 0 : this.priceEnd;
				this.proSkuSale.salePriceRange = `${this.priceEnd}-${this.priceStart}`;
			}*/
			if (this.priceStart == '' && this.priceEnd == '') {
				this.proSkuSale.salePriceRange = '';
			} else if (this.priceStart == '' && this.priceEnd != '') {
				this.proSkuSale.salePriceRange = `0-${this.priceEnd}`;
			} else if (this.priceStart != '' && this.priceEnd == '') {
				this.proSkuSale.salePriceRange = `${this.priceStart}-999999999`;
			} else if (this.priceStart < this.priceEnd || this.priceStart == this.priceEnd) {
				this.proSkuSale.salePriceRange = `${this.priceStart}-${this.priceEnd}`;
			} else if (this.priceStart > this.priceEnd) {
				this.proSkuSale.salePriceRange = `${this.priceEnd}-${this.priceStart}`;
			}
			this.page.index = '1';
			this._getProductList();
		},
		// 上拉加载
		loadMore: function(pageIndex) {
			if (pageIndex < this.page.index) return;
			this._getProductList();
		},
		backEvent: function() {
			this.$bridgefunc.turnBack();
		},
		// 获取商品列表
		_getProductList: function(fieldName = '', sortType = '') {
			this.$Loading.open();
			let url = '/app/json/product/list';
			let paramsData = {
				token: this.$store.state.login.token,
				proSkuSale: {
					categoryId: this.proSkuSale.categoryId,
					brandList: this.brandId,
					salePriceRange: this.proSkuSale.salePriceRange,
					keyword: this.proSkuSale.keyword,
					page: {
						pageSize: this.page.pageSize,
						index: this.page.index,
					},
					sort: {
						fieldName: fieldName,
						sortType: sortType,
					},
					// channelId: '',
				},
			};
			let _this = this;
			this.$http.post(url, paramsData).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
						this.totalCount = data.data.totalCount;
						if (this.page.index == '1') {
							this.viewData = [];
							this.viewData.push(...data.data.rows);
						} else {
							this.viewData.push(...data.data.rows);
						}
						if (data.data.rows.length == 0) {
              _this.$ErrPage.open({
                el:_this.$refs.tool,
                errType: 'NoProducts',
                btnCallBack: function () {
                  _this.backEvent()
                  _this.$ErrPage.close()
                }
              })
							return false;
						}
						this.page.index++;
					} else {
            _this.$ErrPage.open({
              el:_this.$refs.tool,
              errType: 'NetError',
              btnCallBack: function () {
                _this._getProductList()
                _this.$ErrPage.close()
              }
            })


						Toast({
							message: '获取商品失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
          _this.$Loading.close();
          _this.$ErrPage.open({
            el:_this.$refs.tool,
            errType: 'NetError',
            btnCallBack: function () {
              _this._getProductList()
              _this.$ErrPage.close()
            }
          })

					Toast({
						message: '获取商品失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 搜索商品
		searchEvent: function(value) {
			this.proSkuSale.keyword = value;
			this.page.index = '1';
			this._getProductList();
		},
	},
	activated() {},
	beforeRouteLeave(to, from, next) {
		// 设置下一个路由的 meta
		if (to.path == '/mallgooddetail') {
			from.meta.keepAlive = true;
			to.meta.keepAlive = false;
		}
		next();
	},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.Mall-GoodList {
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: #f6f6f6;
}
.layout{
  position absolute
  left 0
  right 0
  bottom 0
}
.tool {
	position: relative;
	display: flex;
	background-color: #fff;
	font-size: 14px;
	bdr-b: '';
	.item {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		height: 50px;
		.icon {
			position: relative;
			width: 10px;
			height: 10px;
			margin-left: 10px;
			transform: translateY(1px);
		}
	}
}

.sidebar-popover-wrapper {
	position: fixed;
	display: flex;
	flex-direction: column;
	top: 0px;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999999;
	.sidebar-popover {
		overflow:auto;
		margin-left: 40px;
		background-color: #f6f6f6;
		height: 100%;
	}
	.sidebar-body {
		display: flex;
		flex-direction: column;
		padding-bottom:50px;
		.items {
			background-color: #fff;
			padding: 3.5vw;
			margin-bottom: 8px;
			.items-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 14px;
				color: #000;
				.more-title {
					color: #a0a0a0;
					font-size: 12px;
				}
			}
			.items-body {
				display: flex;
				flex-wrap: wrap;
				margin-top: 10px;
				min-height:45px
				.item-btn {
					height: 34px;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #f6f6f6;
					border-radius: 34px;
					transform: scaleX(0.9);
					margin-bottom: 4px;
					color: #a0a0a0;
					white-space: nowrap;
					padding: 0 10px;
				}
			}
		}
		.price-ui {
			width: 100%;
			display: flex;
			// justify-content space-between
			justify-content: center;
			margin-top: 10px;
			.btn {
				flex: 1;
				height: 34px;
				border-radius: 34px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #a0a0a0;
				background-color: #f6f6f6;
				overflow: hidden;
				transform: scaleX(0.9);
				input {
					width: 100%;
					height: 100%;
					color: #000;
					z-index: 1000;
					background-color: #f6f6f6;
					text-align: center;
				}
			}
			.line {
				display: flex;
				align-items: center;
				padding: 0 10px;
			}
		}
	}
	.sidebar-footer {
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		left:40px

		&:before {
			content: ' ';
			box-sizing: border-box;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid $color-line-gray-l;
			color: $color-line-gray-l;
			transform-origin: 0 0;
			transform: scaleY(0.5);
			z-index: 5;
		}
		.item-btn {
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
			height: 50px;
			&:nth-child(1) {
				background-color: #fff;
			}
			&:nth-child(2) {
				background-color: $color-theme-o;
				color: #fff;
			}
		}
	}
}
.brand-active {
	color: #fff !important;
	background-color: $color-theme-o !important;
}
</style>
