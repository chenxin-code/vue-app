/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="esh-jfhq-edit">
    <EditLayout title="编辑区--e生活积分换券">
      <BgEdit></BgEdit>
    </EditLayout>
  </div>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: "esh-jfhq-edit",
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
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
  .esh-jfhq-edit {
    width 100%
    height 100%
    overflow hidden
  }
</style>
