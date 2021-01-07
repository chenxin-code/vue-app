/**Created by liaoyingchao on 2019-08-07.*/

<template>
  <Modal class="top-pop" v-model="show" title="筛选条件" @on-ok="sureEvent" :scrollable="true" width="800">
    <Row type="flex" align="middle">
      <Col span="3">
        限制分类:
      </Col>
      <Col span="20">
        <div @click="selectedCate">
          <i-input class="filter-input" type="text" v-model="cates" style="width: 100%;" disabled placeholder="选择限制分类"/>
        </div>
        <!--<i-input></i-input>-->
      </Col>
    </Row>
    <Row type="flex" align="middle">
      <Col span="3">
        限制品牌:
      </Col>
      <Col span="20">
        <div @click="selectedBrand">
          <i-input class="filter-input" type="text" v-model="brands" style="width: 100%;" disabled placeholder="选择限制品牌"/>
        </div>
        <!--<i-input></i-input>-->
      </Col>
    </Row>
    <Row type="flex" align="middle">
      <Col span="3">
        商品关键字:
      </Col>
      <Col span="20">
        <i-input class="filter-input" type="text" v-model="searchKey" style="width: 100%;" placeholder="搜索关键字" />
        <!--<i-input></i-input>-->
      </Col>
    </Row>
    <Row type="flex" align="middle">
      <Col span="3">
        配送方式:
      </Col>
      <Col span="20">
        <CheckboxGroup class="filter-input" v-model="deliveryType">
          <Checkbox label="1">自提</Checkbox>
          <Checkbox label="2">配送</Checkbox>
        </CheckboxGroup>
      </Col>
    </Row>
    <!--<Row style="margin-top: 12px;" v-if="show">-->
      <!--<Table border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="channelGroups" @on-current-change="currentChange" height="375">-->
      <!--</Table>-->
    <!--</Row>-->
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "filter-center",
    components: {},
    data() {
      return {
        setting: '',
        show: false,
        backData: {
          args: {}
        },
        callback: function () {
          console.log("no callback");
        },
        deliveryType: [],
        searchKey: '',
        cates: '',
        brands: '',

      }
    },
    methods: {
      selectedCate: function () {
        Bus.$emit("showCateCenter", {
          multiple: '2',
          backCates: [],
          fn: item => {
            let arr = []
            this.cates = ''
            if (item.backCates) {
              for (let i = 0; i < item.backCates.length; i++) {
                arr.push(item.backCates[i].id)
                this.cates += item.backCates[i].name + ', '
              }
            }
            this.backData.args.categoryIdList = JSON.stringify(arr);
          }
        });
      },
      selectedBrand: function () {
        Bus.$emit("showBrandCenter", {
          multiple: '2',
          backCates: [],
          fn: item => {
            let arr = []
            this.brands = ''
            if (item.backCates) {
              for (let i = 0; i < item.backCates.length; i++) {
                arr.push(item.backCates[i].id)
                this.brands += item.backCates[i].featureValue + ', '
              }
            }
            this.backData.args.brandIdList = JSON.stringify(arr);
          }
        });
      },
      sureEvent: function () {
        this.backData.args.deliveryType = this.deliveryType
        this.backData.args.searchKey = this.searchKey
        if (this.backData) {
          let d = deepCopy(this.backData);
          this.callback(d);
        } else {
          this.callback(null);
        }
        this.show = false;
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      }
    },
    created() {
      Bus.$on("showFilterCenter", busData => {
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .filter-input {
    padding 10px 0px;
    border-radius 3px;
  }
</style>
