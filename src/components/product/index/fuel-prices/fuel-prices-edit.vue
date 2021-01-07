/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <EditLayout title="编辑区--今日油价">
    <Row type="flex" justify="start" class="row-padding" v-if="styleConfig.length">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.styleTempl" @on-change="styleChanged">
          <template v-for="conf in styleConfig">
            <Radio :label="conf.label" v-if="conf.show">
              <span>{{conf.text}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="pageCurrentData.styleTempl == 1 || pageCurrentData.styleTempl == 4 || pageCurrentData.styleTempl == 5">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/fuel-prices/style1.png">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 2">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/fuel-prices/style2.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 3">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/fuel-prices/style3.jpg">
        </Col>
      </Row>
    </template>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="10"> 左右留白
      </Col>
      <Col offset="1" span="18">
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
    name: 'fuel-prices-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        myCenterStyle: 1,
        templateList: [
          {
            name: '默认',
            img: 'static/images/rubik/1-2.png',
            id: '',
          },
        ],
        styleConfig: [],
      };
    },
    created(){
      this.initStyleConfig();
    },
    methods: {
      styleChanged: function () {
        let styleTempl = this.pageCurrentData.styleTempl
        if (styleTempl == 1 || styleTempl == 4 || styleTempl == 5) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/titleImg.png'
          this.pageCurrentData.bgImgUrl = ''
        } else if (styleTempl == 2) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/youjia_icon.png'
          this.pageCurrentData.bgImgUrl = 'static/images/fuel-prices/youjia_bg.png'
        } else if (styleTempl == 3) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/title3.png'
          this.pageCurrentData.bgImgUrl = ''
        }
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.titleImg = item.url;
          }
        });
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'FuelPrices')
        this.styleConfig = menuItem.styleConfig;
      },
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .card {
    background-color: #fff;
    border: 1px dashed #ddd;
    padding: 10px;
    img {
      width 100%;
    }
  }
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
