<template>
  <div class="home-module-1061">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl" />
    </div>
    <div class="items">
      <div class="item" v-for="item in items.rows">
        <img class="full-img" :src="item.imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

export default {
	name: 'home-module-1061',
	components: {
		Toast,
	},
	props: ['items'],
	data() {
		return {};
	},
	methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.home-module-1061 {
  position: relative;
  overflow: hidden;

  .background-style {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .items {
    display: flex;
    position: relative;
  }

  .item {
    position: relative;
    box-sizing: border-box;
    propor-padding: 46.296296296;
  }

  .item:last-child {
    position: relative;
    width: 50%;
  }

  .item:nth-child(-n+2) {
    display: flex;
    width: 25%;
  }
}
</style>
