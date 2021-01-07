/**Created by liaoyingchao on 2019/1/18.*/

<template>
  <ProductListEdit :editType="1"></ProductListEdit>
</template>

<script>
  import ProductListEdit from '../product-list/product-list-edit';

  export default {
    name: "product-infinite-edit",
    components: {
      ProductListEdit
    },
    data() {
      return {}
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">

</style>
