<template>
<div></div>
</template>

<script type="text/ecmascript-6">
  import Config from '@/api/config'
  import yjConfig from './config'
  export default {
    name: 'redirect',
    data() {
      return {}
    },
    created() {
      window.location.replace(`${yjConfig.yjUrl}/wxweb/extend?actionUrl=${encodeURIComponent(`${Config.shareUrl}/invitation-details?shareId=${this.$route.query.shareId}`)}`,)
    },
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
