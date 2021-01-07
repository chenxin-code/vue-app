<template>
  <EditLayout title="编辑区--我的订单">
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
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/my-order/style1.jpg">
        </Col>
      </Row>
      <Row class="row-padding row-bottom-line" v-if="refresh">
        <Col span="4"> icon设置 </Col>
        <Col span="4">
          <div class="icon-img" @click="setOrderIcon(1)">
            <img :src="pageCurrentData.orderIcon_1 ? pageCurrentData.orderIcon_1 : 'static/images/my-order/order0_1.png'">
            <div class="tip">点击更换</div>
          </div>
        </Col>
        <Col span="4">
          <div class="icon-img" @click="setOrderIcon(2)">
            <img :src="pageCurrentData.orderIcon_2 ? pageCurrentData.orderIcon_2 : 'static/images/my-order/order1_1.png'">
            <div class="tip">点击更换</div>
          </div>
        </Col>
        <Col span="4">
          <div class="icon-img" @click="setOrderIcon(3)">
            <img :src="pageCurrentData.orderIcon_3 ? pageCurrentData.orderIcon_3 : 'static/images/my-order/order2_1.png'">
            <div class="tip">点击更换</div>
          </div>
        </Col>
        <Col span="4">
          <div class="icon-img" @click="setOrderIcon(4)">
            <img :src="pageCurrentData.orderIcon_4 ? pageCurrentData.orderIcon_4 : 'static/images/my-order/order3_1.png'">
            <div class="tip">点击更换</div>
          </div>
        </Col>
        <Col span="4">
          <div class="icon-img" @click="setOrderIcon(5)">
            <img :src="pageCurrentData.orderIcon_5 ? pageCurrentData.orderIcon_5 : 'static/images/my-order/servers_1.png'">
            <div class="tip">点击更换</div>
          </div>
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 2">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/my-order/style2.png">
        </Col>
      </Row>
    </template>
  </EditLayout>
</template>

<script>
  import Bus from '../bus';
  import { mapGetters } from 'vuex';

  export default {
    name: 'auxiliary-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    data() {
      return {
        myCenterStyle: 1,
        refresh: true,
        styleConfig: [],
      };
    },
    created(){
      this.initStyleConfig();
    },
    methods: {
      setOrderIcon: function (idx) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            let key = 'orderIcon_' + idx
            this.pageCurrentData[key] = item.url;
            this.refresh = false
            this.$nextTick(() => {
              this.refresh = true
            })
            Bus.$emit('refreshOrderItems')
          }
        });
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'MyOrder')
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
  .icon-img {
    width 100%;
    padding 10px;
    position relative;
    img {
      display block;
      width 54px;
      height 54px;
    }
    .tip {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      text-align center;
      padding 5px 0;
      background-color rgba(0, 0, 0, 0.5)
      color white;
      font-size 12px;
    }
  }
</style>
