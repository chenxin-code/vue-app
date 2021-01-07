/**Created by LiuYong on 2020-11-03*/

<template>
  <EditLayout title="编辑区--自定义购买按钮">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">
        <div>背景图</div>
      </Col>
      <Col span="20">
        <div class="image-box" @click="changeImage('bgImg')">
          <img :src="pageCurrentData.bgImg"/>
          <p class="image-tip">点击更换图片</p>
        </div>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">按钮高度</Col>
      <Col offset="1" span="18">
        <Slider :min="30" :max="70" :step="1" width="300px" v-model="pageCurrentData.btnHeight"></Slider>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">
        <div>按钮背景</div>
      </Col>
      <Col span="20">
        <div class="image-box" @click="changeImage('btnImage')">
          <img :src="pageCurrentData.btnImage"/>
          <p class="image-tip">点击更换图片</p>
        </div>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">
        <div>已领完背景</div>
      </Col>
      <Col span="20">
        <div class="image-box" @click="changeImage('btnImage')">
          <img :src="pageCurrentData.btnFinishedImage || 'static/images/get-coupon/11.png'"/>
          <p class="image-tip">点击更换图片</p>
        </div>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">悬浮</Col>
      <Col offset="1" span="18">
        <Checkbox v-model="pageCurrentData.isFloat">是否悬浮</Checkbox>
      </Col>
    </Row>
    <Row v-if="pageCurrentData.isFloat" type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">上浮距离</Col>
      <Col offset="1" span="18">
        <Slider :min="-100" :max="100" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4">领取跳转链接</Col>
      <Col offset="1" span="18">
        <a @click.prevent="editLine" href="">{{getLinkMsg}}</a>
      </Col>
    </Row>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";
  import draggable from 'vuedraggable';

  export default {
    name: "btn-product-edit",
    components: {
      BgEdit,
      draggable
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData"]),
      getMarkMsg: function () {
        if (this.pageCurrentData.product && this.pageCurrentData.product.showTitle) {
          return this.pageCurrentData.product.showTitle
        } else {
          return '请选择关联商品'
        }
      },
      getLinkMsg: function () {
        const item = this.pageCurrentData;
        !item.link && (this.$set(item,'link',{}))
        console.log('getLinkMsg');
        console.log(item);
        let str = "请选择跳转页面链接地址";
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
    },
    data() {
      return {
        toggleMainMixActive: "",
      }
    },
    methods: {
      // 选择要跳转的页面
      editLine: function () {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: this.pageCurrentData.link,
          callback: item => {
            console.log('item',item);
            if (item) {
              this.pageCurrentData.link = item;
            }
          }
        });
      },
      changeImage(key){
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData[key] = item.url;
          }
        });
      },
      addItemNav: function () {
        this.pageCurrentData.rows.push({
          imgUrl: "@/../static/images/defaultImg.png",
          title: "标题",
          idCode: this.$util.randomString(),
          cornerMark: false,
          link: {
            url: "",
            mustLogined: "",
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.pageCurrentData.rows.length - 1;
        // if (this.toggleMainMixActive == 1) {
        //
        // }
        Bus.$emit("refreshShowComponent")
      },
      dragEnd(e) {
        Bus.$emit("refreshShowComponent")
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
  .image-box{
    display:flex;
    align-items:center;
    cursor:pointer;
    img{
      height:50px;
      display:block;
      margin-right:10px;
    }
    .image-tip{
      flex-shrink:0;
    }
  }
  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
  }
  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;

    img {
      border: 1px solid #dcdddd;
    }
  }
</style>
