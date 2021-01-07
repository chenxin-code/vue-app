/**Created by liaoyingchao on 2019-06-19.*/

<template>
  <EditLayout title="编辑区--卡车冀家">
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";

  export default {
    name: "card-provincial",
    components: {
      BgEdit
    },
    // pageCurrentData 页面 数据
    computed: {
      ...mapGetters(["pageData", "pageCurrentData"])
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
