/**Created by liaoyingchao on 2019-09-27.*/

<template>
  <EditLayout title="编辑区--领券">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="10"> 左右留白
      </Col>
      <Col offset="1" span="18">
        <Slider :max="5" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: "coupon-lq-edit",
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {}
    },
    methods: {
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupon-jfhq-edit {
    width 100%
    height 100%
    overflow hidden
  }
</style>
