/**Created by liaoyingchao on 2019-08-01.*/

<template>
  <EditLayout title="编辑区--电子券提醒">
    <Row type="flex" justify="start" class="row-padding">
      <Col span="4"> 电子券样式
      </Col>
      <Col span="20">
        <RadioGroup v-model="pageCurrentData.styleType">
          <Radio :label="1">
            <span>电子券</span>
          </Radio>
          <Radio :label="2">
            <span>易捷券</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row type="flex" align="middle" class="row-padding">
      <Col span="6"> 文字颜色
      </Col>
      <Col span="8">
        <ColorPicker v-model="pageCurrentData.textColor" />
      </Col>
    </Row>
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
        <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import BgEdit from '../base/bg-edit';

  export default {
    name: "coupons-tag-edit",
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
  .coupons-tag-edit {
    width 100%
    height 100%
    overflow hidden
  }
</style>
