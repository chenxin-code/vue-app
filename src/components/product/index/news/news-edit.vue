/**Created by liaoyingchao on 2019-05-09.*/

<template>
  <EditLayout title="编辑区--新闻组件">
    <Row type="flex" justify="start" class="row-padding">
      <Col span="4">样式</Col>
      <Col span="20">
        <RadioGroup v-model="pageCurrentData.styleType">
          <Radio :label="1">
            <span>滚动</span>
          </Radio>
          <Radio :label="2">
            <span>列表</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row type="flex" justify="start" class="row-padding" v-if="pageCurrentData.styleType != 2">
      <Col span="4">方向</Col>
      <Col span="20">
        <RadioGroup v-model="pageCurrentData.runType" @on-change="styleChanged">
          <Radio :label="1">
            <span>横向</span>
          </Radio>
          <Radio :label="2">
            <span>纵向</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <!--<template v-if="pageCurrentData.styleTempl == 1">-->
      <!--<Row class="row-padding row-bottom-line">-->
        <!--<Col span="24" class="card">-->
          <!--<img src="static/images/fuel-prices/style1.png">-->
        <!--</Col>-->
      <!--</Row>-->
    <!--</template>-->
    <!--<template v-if="pageCurrentData.styleTempl == 2">-->
      <!--<Row class="row-padding row-bottom-line">-->
        <!--<Col span="24" class="card">-->
          <!--<img src="static/images/fuel-prices/style2.jpg">-->
        <!--</Col>-->
      <!--</Row>-->
    <!--</template>-->
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 左右留白
      </Col>
      <Col span="18">
        <Slider :max="5" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
      </Col>
    </Row>
    <Row class="row-padding">
      <div class="image-div" @click="changeImg">
        <img :src="pageCurrentData.titleImg"/>
        <p class="tip">点击更换图片</p>
      </div>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: "news-edit",
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
      styleChanged: function () {
        Bus.$emit('refreshNews')
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.titleImg = item.url;
          }
        });
      }
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
    text-align center;
    font-size 0px;
    img {
      height 66px;
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
</style>
