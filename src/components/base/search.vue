<template>
  <div class="search-wrapper" :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
    <div class="search" :style="{height: this.$market.getNavHeight()+ 'px'}">
      <div v-if="hasBack" class="back" @click="back">
        <img src="@/../static/image/mall/nav-back.png">
      </div>
      <div class="search-form">
        <div class="search-icon">
          <img width="20px" height="20px" src="@/../static/image/mall/sousuo.png">
        </div>
        <div class="search-main">
          <form @submit.prevent="onSubmit" action=".">
            <input style="display: none" type="text" name="keyword" />
            <input v-model="currentValue" type="search" class="search-input" :placeholder="placeholder" @focus="onFocus">
          </form>
        </div>
      </div>
      <router-link tag="div" to="/mallshoppingcart">
        <img style="padding: 10px;" width="40px" height="40px" src="@/../static/image/mall/gouwuche.png">
      </router-link>
      <div v-if="isTool" class="tool toggle-layout" @click="toogleLayout">
        <img style="padding: 10px;" v-if="layoutIcon == 'grid'" width="40px" height="40px" src="@/../static/image/mall/datu.png">
        <img style="padding: 10px;" v-if="layoutIcon == 'list'" width="40px" height="40px" src="@/../static/image/mall/liebiao.png">
      </div>
    </div>
  </div>

</template>

<script>
export default {
	props: {
		placeholder: {
			type: String,
			default: '搜索商品',
		},
		isTool: {
			type: Boolean,
			default: false,
		},
    hasBack: {
      type: Boolean,
      default: true,
    },

		value: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			layoutIcon: 'grid',
			currentValue: '',
		};
	},
	created() {
		this.currentValue = this.value;
	},
	watch: {
		value(val) {
			this.currentValue = val;
		},
	},
	methods: {
		// 切换视图
		toogleLayout: function() {
			if (this.layoutIcon == 'grid') {
				this.layoutIcon = 'list';
			} else if (this.layoutIcon == 'list') {
				this.layoutIcon = 'grid';
			}
			this.$emit('toogleLayout');
		},
		// 返回上一页
		back: function() {
			this.$emit('go-back');
		},
		onSubmit: function() {
			this.$emit('on-submit', this.currentValue);
		},
		onFocus: function () {
			this.$emit('on-focus')
		}
	},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.search-wrapper {
  display: flex;
  align-items: flex-end;
  background-color: $color-theme-o;
}
.search {
  display: flex;
  flex: 1;
  align-items: center;
  background-color: $color-theme-o;
  padding: 0 10px;
  .back {
    display: flex;
    align-items: center;
    padding-top 15px;
    padding-bottom 15px;
    padding-right: 4vw;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .search-form {
    display: flex;
    flex: 1;
    align-items: center;
    background-color: #fff;
    border-radius: 50px;
    overflow: hidden;
    padding: 0 3vw;
    .search-icon {
      display: flex;
      align-items: center;
    }
    .search-main {
      flex: 1;
      /*padding-left: 2vw;*/
      input {
        display: flex;
        width: 100%;
        height: 30px;
        font-size: 14px;
      }
    }
  }
  .tool {
    display: flex;
    align-items: center;
    /*padding-left: 2vw;*/
  }
}
</style>

