
<template>
  <div></div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      text: ''
    };
  },
  mounted() {
    this.$router.replace({
      path: '/carWash/details',
      query: {
        stationOuCode: this.$route.query.stationOuCode,
        deviceCode: this.$route.query.deviceCode,
        washingWay: this.$route.query.washingWay,
        isScanCode: true,
      }
    })
  },
  methods: {}
};
</script>

<style lang="stylus" scoped type="text/stylus">
</style>
