<template>

</template>

<script>
  import api from './api'
  export default {
    name: "janeView",
    mixins: [api],
    data() {
      return {
        linkInfo: '',
        id: '',
      }
    },
    mounted() {
      let info = this.$route.query.info
      console.log(5555,info);
      let params = info && JSON.parse(decodeURIComponent(info))
      let that = this

      this.$Loading.open()
      that.nextData(params).then(res => {
        this.$Loading.close()
        console.log(888,res.data.info);
        if (res.data.result == 'success') {
          let text = res.data.data.info || ''
          let textNode = document.createElement('div')
          textNode.innerHTML = text
          document.body.appendChild(textNode)
          document.forms[0].submit()
        } else {
          that.$Toast(res.data.info)
        }
      })
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
