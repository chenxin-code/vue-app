<template>
  <EditLayout title="编辑区--秒杀活动">
    <Row type="flex" justify="start" class="row-padding" v-if="styleConfig.length">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.styleTempl">
          <template v-for="conf in styleConfig">
            <Radio :label="conf.label" v-if="conf.show">
              <span>{{conf.text}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="pageCurrentData.styleTempl == 1">
      <Row class="row-padding">
        <Col span="24" class="card">
          <img src="static/images/seconds-kill/style1.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 2">
      <Row class="row-padding">
        <Col span="24" class="card">
          <img src="static/images/seconds-kill/style2.jpg">
        </Col>
      </Row>
    </template>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="6">
        指定配送方式
      </Col>
      <Col span="16">
        <RadioGroup v-model="pageCurrentData.onlyDeliveryType" @on-change="onlyDeliveryTypeChanged">
          <Radio :label="0">
            <span>都支持</span>
          </Radio>
          <Radio :label="1">
            <span>仅支持自提</span>
          </Radio>
          <Radio :label="2">
            <span>仅支持配送</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from '../base/bg-edit';
  import { mapGetters } from 'vuex';

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
      onlyDeliveryTypeChanged: function () {

      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'SecondsKill')
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
</style>
