/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="esh-qqjy-edit">
    <EditLayout title="编辑区--e生活抢券加油">
      <Row type="flex" justify="start" class="row-padding">
        <Col span="4"> 模块样式</Col>
        <Col span="20">
          <RadioGroup v-model="pageCurrentData.styleType" @on-change="fetchRefresh">
            <Radio :label="1">
              <span>加油券</span>
            </Radio>
            <Radio :label="2">
              <span>易捷券</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <draggable :list="pageCurrentData.rows" @end="dragEnd">
            <div class="product-icon-box" v-for="(item,index) in pageCurrentData.rows">
              <span @click="deleteProduct(item,index)" class="product-delete">X</span>
              <img :src="item.phMainUrl" width="70px" height="70px">
            </div>
          </draggable>
          <img width="70px" height="70px" @click="selectProduct" src="static/images/addimg.jpg">
        </Col>
      </Row>
      <BgEdit></BgEdit>
    </EditLayout>
  </div>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';
  import draggable from 'vuedraggable';

  export default {
    name: "esh-qqjy-edit",
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      draggable,
      BgEdit
    },
    data() {
      return {}
    },
    methods: {
      dragEnd(e) {

      },
      deleteProduct: function (item, index) {
        this.pageCurrentData.rows.splice(index, 1);
      },
      fetchRefresh(){
        Bus.$emit('refreshESHQQJY',this.pageCurrentData.idCode)
      },
      selectProduct: function () {
        Bus.$emit('showProductCenter', {
          type: 'select',
          fn: products => {
            for (let i = 0; i < products.length; i++) {
              let item = products[i]
              item = this.$market.dataProcessing(item)
              this.pageCurrentData.rows.push(item)
            }
            this.fetchRefresh();
          },
        });
      },
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-qqjy-edit {
    width 100%
    height 100%
    overflow hidden
    .product-icon-box {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 70px;
      height: 70px;
      font-size: 0;
      .product-delete {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #ccc;
        color: #fff;
        text-align: center;
        line-height: 15px;
        font-size: 10px;
      }
    }
  }
</style>
