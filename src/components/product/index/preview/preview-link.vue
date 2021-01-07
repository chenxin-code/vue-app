<template>
  <div class="preview-link">
    <p>{{pageData.title}}</p>
    <p>{{pageData.url}}</p>
  </div>
</template>

<script>
  export default {
    name: 'preview-link',
    components: {},
    props: ['pageData'],
    data() {
      return {
        msg: 'msg'
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .preview-link {
    padding 100px 20px;
    text-align center;
    width 100%
    height 100%
    overflow hidden
    background-color #efefef
    p {
      line-height 20px;
    }
  }
</style>
