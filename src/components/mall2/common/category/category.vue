<template>
  <div class="mall2 bottom" v-if="visible">
    <AllCategory :barHeight="initData.barHeight" @closeEvent="visible = false" @cateEvent="selectedCateEvent"></AllCategory>
  </div>
</template>

<script>
  import AllCategory from '../../list/category/all-categories'

  export default {
    name: 'category',
    components: {
      AllCategory
    },
    data() {
      return {
        initData: {
          barHeight: 0
        },
        visible: false,
        cateEvent: null
      }
    },
    methods: {
      selectedCateEvent: function (item) {
        this.visible = false
        if (this.cateEvent) {
          this.cateEvent(item)
        }
      }
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden

  }

</style>
