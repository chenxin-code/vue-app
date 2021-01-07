/**Created by liaoyingchao on 2019-09-26.*/

<template>

</template>

<script>
  export default {
    name: "yl-pay",
    components: {},
    data() {
      return {
      }
    },
    methods: {},
    created() {

    },
    mounted() {
      let info = this.$route.query.info
      let url = this.$route.query.url
      let params = info && JSON.parse(decodeURIComponent(info))
      this.$Loading.open()
      this.$http.post(url, params).then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            let text = res.data.data.payInfo || ''
            let textNode = document.createElement('div')
            textNode.innerHTML = text
            document.body.appendChild(textNode)
            document.forms[0].submit()
          } else {
            this.$Toast(res.data.info)
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        }
      );
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .yl-pay {
    width 100%
    height 100%
    overflow hidden
  }
</style>
