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
            <div class="img-box">
              <img class="full-img" :src="item.phPicUrl">
            </div>
          </div>
          <div class="goods-name">
            <div>
              {{item.skuName}}
            </div>
            <div>
              <span>￥{{item.salePrice}}</span>
              <del v-if="item.showPrice > item.salePrice">￥{{item.showPrice}} </del>
            </div>
          </div>
          <div class="goods-footer">
            <div class="icon" v-on:click.stop="addCart(item)">
              <img class="full-img" src="@/../static/image/mall/icon1.png">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { InfiniteScroll, Spinner } from 'mint-ui';

export default {
	name: 'layout-list',
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
	created() {
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  flex: 1 1 0%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.good-list {
  margin-top: 5px;
  .goods:first-child:before {
    display: none;
  }
}
.goods {
  display: flex;
  position: relative;
  background-color: #fff;
  .goods-picture {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 7px;
    .img-box {
      width: 30vw;
      propor-padding: 100;
    }
  }
  .goods-name {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 10px;
    color: $color-text;
    font-size: $font-size-medium;
    line-height 16px
    &:after {
      content: ' ';
      box-sizing: border-box;
      position: relative;
      top: 10px;
      left: 0px;
      right: -10px;
      height: 2px;
      border-bottom: 1px solid $color-line-gray-l;
      color: $color-line-gray-l;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 1;
    }
    div:nth-child(2) {
      margin-top: 10px;
      span {
        color: $color-theme-o;
        font-size: $font-size-medium-x;
      }
      del {
        color: #a0a0a0;
        font-size: $font-size-medium-s;
      }
    }
  }
  .goods-footer {
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    /* display: flex; */
    /* align-items: flex-end; */
    .icon {
      position: relative;
      width: 24px;
      height: 24px;
    }
  }
}
</style>
