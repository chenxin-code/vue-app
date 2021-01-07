
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
      path: "/industryCertification/certificationStatus",
      query: {
        id: this.$route.query.id,
        replacePage: true
      }
    });
  },
  methods: {}
};
</script>

<style lang="stylus" scoped type="text/stylus">
</style>
