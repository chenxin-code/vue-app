<template>
  <div class="product-list-detail">
    <div class="wrapper">
      <div class="scroll">
        <div class="layout-grid good-list">
          <div class="goods" v-for="(item, index) in moduleData.rows" @click="enterNav(item)">
            <div class="goods-picture">
              <div class="img-box">
                <img class="full-img" :src="item.phPicUrl">
                <div class="corner-mark">
                  <img v-if="moduleData.layout.cornerMark == '1'" src="static/images/product-list/icon_gods_hot01.png">
                  <img v-if="moduleData.layout.cornerMark == '2'" src="static/images/product-list/icon_gods_hot02.png">
                  <img v-if="moduleData.layout.cornerMark == '3'" src="static/images/product-list/icon_gods_hot03.png">
                  <img v-if="moduleData.layout.cornerMark == '4'" src="static/images/product-list/icon_gods_hot04.png">
                  <img v-if="moduleData.layout.cornerMark == '5'" src="static/images/product-list/icon_gods_hot05.png">
                  <img v-if="moduleData.layout.cornerMark == '6'" :src="moduleData.layout.selfCornerMarkUrl">
                </div>
              </div>
            </div>
            <div class="goods-name">
              <div>
                <span v-if="moduleData.layout.hasTitle == '1'" v-html="item.showTitle"></span>
              </div>
              <div>
                <span v-if="moduleData.layout.hasPrice == '1'">￥{{item.salePrice}}</span>
                <del v-if="item.showPrice > item.salePrice">￥{{item.showPrice}} </del>
              </div>
            </div>
            <div class="activity-tags" v-if="item.activityTags.length > 0">
              <div class="tag single-line" v-for="text in item.activityTags">{{text}}</div>
            </div>
            <div class="goods-footer">
              <div v-if="moduleData.layout.btnType == '1'" class="icon">
                <img src="static/images/product-list/icon_gods_car01.png">
              </div>
              <div v-if="moduleData.layout.btnType == '2'" class="icon">
                <img src="static/images/product-list/icon_gods_car02.png">
              </div>
              <div v-if="moduleData.layout.btnType == '3'" class="icon">
                <img src="static/images/product-list/icon_gods_car03.png">
              </div>
              <div v-if="moduleData.layout.btnType == '4'" class="icon">
                <img src="static/images/product-list/icon_gods_car04.png">
              </div>
              <div v-if="moduleData.layout.btnType == '5'" class="icon">
                <img src="static/images/product-list/icon_gods_car05.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'product-list-detail',
	props: ['myIndex'],
	computed: {
		moduleData: function() {
			return this.pageData.moduleList[this.myIndex].data;
		},
		...mapGetters(['pageData', 'pageCurrentData']),
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		enterNav: function(nav) {
			this.$market.enterNav(nav);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  overflow-y: auto;
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
  &:after {
    display block
    content: ' ';
    box-sizing: border-box;
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 2px;
    border-bottom: 1px solid $color-line-gray-l;
    color: $color-line-gray-l;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 1;
  }
  .goods-picture {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 7px;
    .img-box {
      width: 125px;
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
    line-height: 16px;
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
  .activity-tags {
    width 100%;
    padding 0 10px 5px;
    display flex;
    align-items top;
    overflow hidden;
    .tag {
      background-color #Fef4fa;
      color #F80F16;
      padding 3px 5px;
      border-radius 3px;
    }
    .tag:nth-child(n+2) {
      margin-left 10px;
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
      .ico-btn-3 {
        border-radius: 14px;
        font-size: 14px;
        line-height: 26px;
        height: 28px;
        padding: 0 13px;
        cursor: pointer;
        color: #fff;
        background-color: #f44;
        border: 1px solid #f44;
      }
      .ico-btn-4 {
        font-size: 14px;
        line-height: 24px;
        height: 26px;
        color: #f44;
        min-width: 48px;
        cursor: pointer;
        border-radius: 2px;
        background-color: #fff;
        border: 1px solid #f44;
        padding: 0 7px;
        color: #f96702;
      }
    }
  }
  .corner-mark {
    position: absolute;
    top: 0;
    right: left;
    width: 36px;
    height: 36px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
