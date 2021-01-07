<template>
  <div class="mall2 bottom" v-if="visible">
    <SuperFiltrate @closeEvent="visible = false" :category="initData.category" @filtrateEvent="filtrateSureEvent"></SuperFiltrate>
  </div>
</template>

<script>
  import SuperFiltrate from '../../list/filtrate/index'

  export default {
    name: 'filtrate',
    components: {
      SuperFiltrate
    },
    data() {
      return {
        initData: {
          category: '',
          minPrice: '',
          maxPrice: ''
        },
        visible: false,
        filtrateEvent: null
      }
    },
    methods: {
      filtrateSureEvent: function (item) {
        this.visible = false
        console.log(item)
        if (this.filtrateEvent) {
          this.filtrateEvent(item)
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
