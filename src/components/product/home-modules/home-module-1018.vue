<template>
  <div class="home-module-1018">
    <div class="item-cells" :style="{'background-image': `url(${items.bgImageUrl})`}">
      <div class="item-cell" v-for="item in items.rows">
        <img class="full-img" :src="item.imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

export default {
	name: 'home-module-1018',
	components: {
		Toast,
	},
	props: ['items'],
	data() {
		return {
		};
	},
	methods: {
		itemEvent: function(item) {
			this.$emit('itemEvent', item);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.home-module-1018 {
  position: relative;
  overflow: hidden;
  .item-cells {
    display: flex;
    flex-wrap: wrap;
    background: repeat-y top left / 100% 50%;
    .item-cell {
      width: 20.37037037%;
      box-sizing: border-box;
      propor-padding: 92.3;
      &:nth-child(4n+1) {
        display: flex;
        width: 38.88888888%;
      }
      .img-box {
        flex: 1;
        text-align: center;
        overflow: hidden;
      }
    }
  }
}
</style>
