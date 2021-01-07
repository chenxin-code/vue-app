/**Created by liaoyingchao on 2020-09-07.*/

<template>
  <EditLayout title="编辑区--自定义购买按钮">
    <div>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 文本内容
        </Col>
        <Col span="20">
          <Input v-model="pageCurrentData.labelText" placeholder="按钮文本内容" style="width: 100%"></Input>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 划线内容
        </Col>
        <Col span="20">
          <Input v-model="pageCurrentData.lineText" placeholder="按钮划线内容，不填不显示" style="width: 100%"></Input>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="6"> 字体颜色
        </Col>
        <Col span="14">
          <ColorPicker v-model="pageCurrentData.labelColor"/>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 按钮背景 </div>
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeImg">
            <img :src="pageCurrentData.btnImage"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 左侧按钮宽度
        </Col>
        <Col offset="1" span="18">
          <Slider :max="50" :step="0.2" width="300px" v-model="pageCurrentData.leftBtnWidth"></Slider>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 左侧按钮背景 </div>
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeLeftImg">
            <img :src="pageCurrentData.leftBtnImg"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4"> 右侧按钮链接
        </Col>
        <Col span="20">
          <a @click.prevent="editLeftLink" href="">{{getLinkMsg({link: pageCurrentData.leftLink})}}</a>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 上浮距离
        </Col>
        <Col offset="1" span="18">
          <Slider :max="100" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 上留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="50" :step="0.2" width="300px" v-model="pageCurrentData.upMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 下留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="50" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 关联商品
        </Col>
        <Col offset="1" span="18">
          <a @click.prevent="selectProduct" href="">{{getMarkMsg}}</a>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 购买须知
        </Col>
        <Col offset="1" span="18">
          <Checkbox v-model="pageCurrentData.showAgreement">显示购买须知</Checkbox>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding" v-show="pageCurrentData.showAgreement">
        <Col span="4"> 购买须知文字
        </Col>
        <Col offset="1" span="18">
          <Input v-model="pageCurrentData.agreementText" placeholder="购买须知文字" style="width: 100%"></Input>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding" v-show="pageCurrentData.showAgreement">
        <Col span="4"> 购买须知内容
        </Col>
        <Col offset="1" span="18">
          <Input v-model="pageCurrentData.agreementValue" placeholder="购买须知value，内容管理配置的协议value" style="width: 100%"></Input>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 底部悬浮
        </Col>
        <Col offset="1" span="18">
          <Checkbox v-model="pageCurrentData.isFloat">是否底部悬浮</Checkbox>
        </Col>
      </Row>
    </div>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";

  export default {
    name: "btn-product-edit",
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData"]),
      getMarkMsg: function () {
        if (this.pageCurrentData.product && this.pageCurrentData.product.showTitle) {
          return this.pageCurrentData.product.showTitle
        } else {
          return '请选择关联商品'
        }
      }
    },
    data() {
      return {

      }
    },
    methods: {
      // 选择要跳转的页面
      editLeftLink: function () {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: this.pageCurrentData.leftLink,
          callback: item => {
            if (item) {
              this.pageCurrentData.leftLink = item;
            }
          }
        });
      },
      getLinkMsg: function (item) {
        let str = "请选择子页面链接地址";
        if (item.link && item.link.name && item.link.name != "") {
          str = item.link.name;
        } else if (item.link && item.link.url && item.link.url != "") {
          str = item.link.url;
        }
        if (item.link && item.link.mustLogined) {
          str += '__需要登录'
        }
        if (item.link && item.link.renderNav) {
          str += '__需要原生导航'
        }
        return str;
      },
      selectProduct: function () {
        Bus.$emit("showProductCenter", {
          type: "radio",
          title: "商品中心",
          fn: item => {
            if (item) {
              console.log(item)
              this.pageCurrentData.product = item
            }
          }
        });
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.btnImage = item.url;
          }
        });
      },
      changeLeftImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.leftBtnImg = item.url;
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
    width 100%;
    text-align center;
    img {
      display block;
      width 100%;
    }
  }
</style>
