<template>
  <EditLayout title="编辑区--附件自提点">
    <Row type="flex" justify="start" class="row-padding" v-if="styleConfig.length">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.styleTempl" @on-change="dataChanged">
          <template v-for="conf in styleConfig">
            <Radio :label="conf.label" v-if="conf.show">
              <span>{{conf.text}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="pageCurrentData.styleTempl == 1 || pageCurrentData.styleTempl == 2">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/pickup-address/style1.jpg">
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="5"> 业务类型
        </Col>
        <Col span="16">
          <RadioGroup v-model="pageCurrentData.bsType">
            <Radio label="0">
              <span>所有业务</span>
            </Radio>
            <Radio label="1">
              <span>仅供生鲜业务</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
    </template>
    <template v-else-if="pageCurrentData.styleTempl == 3">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/pickup-address/style2.png">
        </Col>
      </Row>
    </template>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="5"> 模块标题
      </Col>
      <Col span="16">
        <input class="notice-input" placeholder="请输入模块标题" v-model="pageCurrentData.title" />
        <!--<Slider :min="2" :max="10" v-model="pageCurrentData.notice" @on-change="autoplayDelayChange"></Slider>-->
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 显示个数
      </Col>
      <Col span="18">
        <Slider :min="1" :max="20" v-model="pageCurrentData.showNumbers" @on-change="dataChanged"></Slider>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BgEdit from '../base/bg-edit';
  import Bus from "../bus";

  export default {
    name: 'auxiliary-edit',
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
      dataChanged: function () {
        Bus.$emit('refreshPickupAddress')
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'PickupAddress')
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
  .notice-input {
    background-color #efefef;
    width 100%;
    padding 8px;
  }
</style>
