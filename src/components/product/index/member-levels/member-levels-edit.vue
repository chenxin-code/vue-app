/**Created by liaoyingchao on 2019-06-19.*/

<template>
  <EditLayout title="编辑区--会员级别">
    <div class="line_bottom">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4">
          样式类型
        </Col>
        <Col offset="1" span="18">
          <RadioGroup v-model="pageCurrentData.type">
            <Radio label="1">
              <span>类型1</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
    </div>
    <div>
      <!--<Row type="flex" justify="start" align="middle" class="row-padding">-->
        <!--<Col span="3"> 上浮距离-->
        <!--</Col>-->
        <!--<Col offset="1" span="18">-->
          <!--<Slider :max="30" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<Row type="flex" justify="start" align="middle" class="row-padding">-->
        <!--<Col span="3"> 下留白-->
        <!--</Col>-->
        <!--<Col offset="1" span="18">-->
          <!--<Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>-->
        <!--</Col>-->
      <!--</Row>-->
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 左右留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :min="0" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
        </Col>
      </Row>
    </div>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import { mapGetters, mapMutations } from "vuex";
  import Bus from "../bus";

  export default {
    name: "my-card-edit",
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData", "markDialog", "memberLevels"])
    },
    data() {
      return {
        refresh: true
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
  .image-div {
    position relative;
    overflow hidden;
    img {
      display block;
      width 100%;
    }
    .tip {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      padding 8px;
      font-size 13px;
      text-align center;
      background-color rgba(255, 255, 255, 0.3)
    }
  }
  .card-img {
    img {
      display block;
      width 295px;
      height 108px;
    }
  }
</style>
