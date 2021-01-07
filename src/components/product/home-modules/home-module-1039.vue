<template>
  <div class="home-module-1039">
    <div class="item-cells" :style="{'background-image': `url(${items.bgImageUrl})`}">
      <div class="item-cell" v-for="(item, index) in items.rows">
        <img class="full-img" :src="item.imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

export default {
	name: 'home-module-1039',
	components: {
		Toast,
	},
	props: ['items'],
	data() {
		return {};
	},
	methods: {
		itemEvent: function(item) {
			this.$emit('itemEvent', item);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus" >
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.home-module-1039 {
  position: relative;
  overflow: hidden;
  .item-cells {
    position: relative;
    overflow: hidden;
    background: no-repeat top left / 100% 100%;
  }
  .item-cells .item-cell {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    float: left;
    width: 33.33333333%;
    &:first-child {
      propor-padding: 138.88888888;
    }
    &:nth-child(n+2) {
      propor-padding: 69.44444444;
    }
  }
}
</style>
