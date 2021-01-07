/**Created by liaoyingchao on 2020-05-28.*/

<!--<template>-->
  <!--<div class="esh-top-edit">-->
    <!---->
  <!--</div>-->
<!--</template>-->

<template>
  <EditLayout title="编辑区--e生活顶部组件">
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
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: 'esh-top-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        linkShow: true,
        toggleMainMixActive: 0,
        memberLevels: [],
        editLineIndex: ''
      };
    },
    methods: {

    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;
    img {
      border: 1px solid #dcdddd;
    }
  }
  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
  }
</style>
