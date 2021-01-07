<template>
  <div class="home-module-1038">
    <div class="item-list-scroll" ref="itemList">
      <div class="item" ref="itemBox" v-for="item in items.rows" @click="itemEvent(item)">
        <img class="full-img" :src="item.imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

export default {
	name: 'home-module-1038',
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

<style lang="stylus" scoped type="text/stylus" >
@import '~@/common/stylus/variable.styl';
.home-module-1038 {
  position: relative;
  overflow: hidden;
  .item-list-scroll {
    width: 100%;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    -webkit-overflow-scrolling: touch;
    .item {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      width: 33.33333333vw;
      height: 100px;
    }
  }
}
</style>
