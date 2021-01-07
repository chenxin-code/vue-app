<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="wrapper">
    <div class="scroll">
      <div class="layout-grid good-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="scrollDisabled"
        infinite-scroll-distance="20"
        infinite-scroll-immediate-check="false">
        <div class="goods" v-for="item in listData" @click="itemEvent(item)">
          <div class="goods-picture">
            <img class="full-img" :src="item.phPicUrl">
          </div>
          <div class="goods-name double-line"> {{item.skuName}} </div>
          <div class="goods-footer">
            <div> ￥{{item.salePrice}} </div>
            <div>
              <del v-if="item.showPrice > item.salePrice">￥{{item.showPrice}} </del>
            </div>
            <div class="icon" v-on:click.stop="addCart(item)">
              <img src="@/../static/image/mall/icon1.png">
            </div>
          </div>
        </div>
        <!-- <div v-if="loading" class="loading">
          <mt-spinner type="snake"></mt-spinner> &nbsp;&nbsp;&nbsp;&nbsp; 加载中……
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll, Spinner } from 'mint-ui';

export default {
	name: 'layout-grid',
	components: {
		InfiniteScroll,
		Spinner,
	},
	props: {
		listData: {
			type: Array,
		},
		scrollDisabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			pageIndex: 1,
		};
  },
  created () {
    this.$emit('loadMore', this.pageIndex);
    this.pageIndex++;
  },
	methods: {
		itemEvent: function(item) {
			this.$emit('itemEvent', { type: 1, data: item });
		},
		addCart: function(item) {
			this.$emit('itemEvent', { type: 2, data: item });
		},
		// 加载更多
		loadMore: function() {
			this.$emit('loadMore', this.pageIndex);
			this.pageIndex++;
		},
	},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  flex: 1 1 0%;
  overflow: hidden;
}
.scroll {
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.good-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 5px;
}
.goods {
  display: flex;
  flex-direction: column;
  width: 49.2vw;
  background-color: #fff;
  margin-bottom: 1.6vw;
  .goods-picture {
    propor-padding: 100;
  }
  .goods-name {
    flex: 1;
    padding: 0 10px;
    color: $color-text;
    font-size: $font-size-medium;
    line-height 16px
    margin-top: 10px;
    margin-bottom: 10px;
    white-space: break-all;
  }
  .goods-footer {
    padding: 5px 2vw 12px;
    display: flex;
    align-items: flex-end;
    div:nth-child(1) {
      color: $color-theme-o;
      font-size: $font-size-medium-x;
    }
    div:nth-child(2) {
      color: #a0a0a0;
      font-size: $font-size-medium-s;
      flex: 1;
      padding-left: 5px;
    }
    .icon {
      position: relative;
      width: 44px;
      height: 44px;
      padding: 20px;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.loading {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}
</style>
