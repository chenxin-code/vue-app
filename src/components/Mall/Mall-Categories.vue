<template>
	<div class="Mall-Categories">
		<Search :hasBack="hasBack" @on-submit="searchEvent" @go-back="backEvent"></Search>
		<div class="wrapper">
			<div class="sidebar">
				<div class="sidebar-wrapper">
					<div class="sidebar-scroll">
						<div class="categorie" :key="index" :class="{active:index==nowIndex}" v-for="(item,index) in proCateListTwo" @click="toggleTabs(item,index)">
							<span class="single-line"> {{item.name}} </span>
						</div>
					</div>
				</div>
			</div>
			<div class="content">
				<div class="content-wrapper">
					<div class="content-scroll">
						<div class="goods-class" :key="index" v-for="(item,index) in proCateList">
							<div class="goods-title"> {{item.name}} </div>
							<div class="goods-content">
								<div class="goods" :key="index" v-for="(goods,index) in item.rows" @click="pushToMallGoodList(goods)">
									<div class="goods-picture">
										<img class="full-img" :src="goods.phPic">
									</div>
									<div class="goods-name double-line">
										{{goods.name}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'mint-ui';
import Search from '../base/search';

export default {
	name: 'Mall-Categories',
	components: {
		Toast,
		Search,
	},

  props: {
    hasBack: {
      type: Boolean,
      default: true,
    },
  },
	data() {
		return {
			nowIndex: 0, //默认第一个tab为激活状态
			proCateListTwo: [],
			proCateList: [],
		};
	},
	created() {
		this._loadProCateListTwo();
	},
	methods: {
    backEvent:function(){
      this.$bridgefunc.customGo(-1);
    },
		// 切换tab
		toggleTabs: function(item, index) {
			this.nowIndex = index;
			if (item.subList) {
        this.proCateList = item.subList
        return
      }
			this._loadProCateList(item.id);
		},
		// 获取商品分类
		_loadProCateListTwo: function() {
			this.$Loading.open();
			let url = '/app/json/product/loadProCateListTwo';
			let paramsData = {
				token: this.$store.state.login.token,
				proMerCategory: {
					parentCode: '1',
				},
			};
			let _this = this
			this.$http.post(url, paramsData).then(
				res => {
					_this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
            _this.proCateListTwo = data.data.rows;
            if(_this.proCateListTwo && _this.proCateListTwo.length ){
              _this._loadProCateList(this.proCateListTwo[0].id);
            }
					} else {
						Toast({
							message: '获取商品失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
          _this.$Loading.close();
					Toast({
						message: '获取商品失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 获取商品分类子分类
		_loadProCateList: function(id) {
      this.$Loading.open();
			let url = '/app/json/product/loadProCateList';
			let paramsData = {
				token: this.$store.state.login.token,
				proMerCategory: {
					parentCode: id,
				},
			};
			let _this = this
			this.$http.post(url, paramsData).then(
				res => {
          _this.$Loading.close();
					let data = res.data;
					if (data.status == 0) {
						_this.proCateList = data.data.rows;
						let item = this.proCateListTwo[this.nowIndex]
            item.subList = data.data.rows;
					} else {
						Toast({
							message: '获取商品失败',
							position: 'bottom',
							duration: 2000,
						});
					}
				},
				error => {
          _this.$Loading.close();
					Toast({
						message: '获取商品失败',
						position: 'bottom',
						duration: 2000,
					});
				}
			);
		},
		// 跳转至商品列表页面
		pushToMallGoodList: function(item) {
			// this.$router.push({
			// 	path: '/mallgoodlist',
			// 	query: {
			// 		categories: item.id,
			// 		search: '',
			// 	},
			// });
			this.$bridgefunc.customPush({
				path: '/mallgoodlist',
				query: {
					categories: item.id,
					search: '',
				},
			});
		},
		// 搜索商品并跳转至商品列表页面
		searchEvent: function(value) {
			this.$bridgefunc.customPush({
				path: '/mallgoodlist',
				query: {
					categories: '',
					search: value,
				},
			});
		},
	},
  activated() {

  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.Mall-Categories {
	position: absolute;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.wrapper {
	position: relative;
	display: flex;
	flex-direction: row;
	align-content: flex-start;
	flex: 1 1 0%;
	overflow: hidden;
}
.sidebar {
	position: relative;
	display: flex;
	flex-direction: column;
	align-content: flex-start;
	flex-shrink: 0;
	width: 100px;
	overflow: hidden;
	background-color: #f6f6f6;
	.sidebar-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex: 1 1 0%;
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
		.sidebar-scroll {
			position: relative;
			display: block;
			flex-direction: column;
			align-content: flex-start;
			flex-shrink: 0;
		}
	}
	.categorie {
		height: 46px;
		display: flex;
		align-items: center;
		background-color: #f6f6f6;
		span {
			display: flex;
			justify-content: center;
			flex: 1;
			color: $color-text-l;
      font-size: $font-size-medium;
		}
	}
	.categorie.active {
		background-color: #fff;
		span {
			border-left: 5px solid $color-theme-o;
      border-right 5px solid transparent;
			color: $color-text;
			font-size: 15px;
		}
	}
}
.content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-content: flex-start;
	flex: 1 1 0%;
	overflow: hidden;
	.content-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		flex: 1 1 0%;
		overflow-x: hidden;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		.content-scroll {
			position: relative;
			flex-direction: column;
			place-content: flex-start;
			flex: 1 1 0%;
		}
	}
	.goods-class {
		padding: 0 3%;
	}
	.goods-title {
		display: flex;
		font-weight:bold;
		justify-content: flex-start;
		align-items: center;
		height: 40px;
		font-size: $font-size-medium;
		color: $color-text;
	}
	.goods-content {
		// display: flex;
		// flex-wrap: wrap;
		// justify-content: space-between;
		/*box-shadow: 0 0 5px #efefef;*/
		overflow hidden;
		.goods {
			float left;
			width: 30%;
			margin 0px 1.6% 12px;
		}
		.goods-picture {
			margin 10%;
			width: 80%;
			propor-padding: 92.3;
		}
		.goods-name {
			display: flex;
			justify-content: center;
			font-size: $font-size-medium-s;
			margin-top: 5px;
			line-height: 16px;
		}
	}
}
</style>
