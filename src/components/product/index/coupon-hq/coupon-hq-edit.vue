/**Created by liaoyingchao on 2019-09-27.*/

<template>
  <EditLayout title="编辑区--积分换券">
    <Row type="flex" justify="start" class="row-padding">
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
    <Row type="flex" justify="start" class="row-padding">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.productType" @on-change="productTytpeChanged">
          <Radio :label="0">
            <span>普通券类型</span>
          </Radio>
          <Radio :label="513">
            <span>加油金券类型</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row class="row-padding row-bottom-line" v-if="pageCurrentData.styleTempl == 2 || pageCurrentData.styleTempl == 3">
      <img width="100%" src="static/images/hk/style2.jpg" v-if="pageCurrentData.styleTempl == 2">
      <img width="100%" src="static/images/hk/style3.jpg" v-else-if="pageCurrentData.styleTempl == 3">
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 券来源
      </Col>
      <Col offset="1" span="18">
        <a @click.prevent="selectActivity" href="">{{showFromStr}}</a>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 左右留白
      </Col>
      <Col offset="1" span="18">
        <Slider :max="5" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Checkbox class="edit-all-line" v-model="pageCurrentData.showTips">是否在顶部显示剩余虚拟金额</Checkbox>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: "coupon-jfhq-edit",
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        showFromStr: '请选择券来源',
        styleConfig: [],
      }
    },
    created(){
      this.initStyleConfig();
    },
    methods: {
      productTytpeChanged: function () {
        Bus.$emit('CouponHQRefresh')
      },
      styleChanged: function () {

      },
      selectActivity: function () {
        Bus.$emit("showActivityCouCenter", {
          pageType: '',
          isMultiple: false,
          fn: item => {
            if (item) {
              console.log(item);
              this.pageCurrentData.couponFrom = item
              this.showFromStr = item.name
              Bus.$emit('CouponHQRefresh')
            }
          },
        });
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'CouponHQ')
        this.styleConfig = menuItem.styleConfig;
      },
    },
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
