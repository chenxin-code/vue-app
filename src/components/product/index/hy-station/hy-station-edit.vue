/**Created by liaoyingchao on 2019-06-19.*/

<template>
  <EditLayout title="编辑区--海油油站">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3"> 左右留白
      </Col>
      <Col offset="1" span="18">
        <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3"> 上留白
      </Col>
      <Col offset="1" span="18">
        <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.upMargin"></Slider>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3"> 下留白
      </Col>
      <Col offset="1" span="18">
        <Slider :max="20" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";

  export default {
    name: "hy-station-edit",
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData"])
    },
    data() {
      return {

      }
    },
    methods: {

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">

</style>
