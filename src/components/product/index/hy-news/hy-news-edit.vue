/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <EditLayout title="编辑区--海油资讯组件">
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
    name: 'hy-news-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        linkShow: true,
        toggleMainMixActive: 0,
        memberLevels: [],
      };
    },
    methods: {
      // 添加一个图文导航
      addItemNav: function() {
        this.pageCurrentData.rows.push({
          imgUrl: "@/../static/images/defaultImg.png",
          title: "标题",
          link: {
            url: "",
            mustLogined: "",
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.pageCurrentData.rows.length - 1;
      },
      selectImg: function(index) {
        Bus.$emit("showImgCenter", item => {
          this.pageCurrentData.rows[index].imgUrl = item.url;
          if (index == 0) {
            let relativeSize = item.imgHeight / item.imgWidth;
            this.pageCurrentData.ratio = relativeSize;
          }
        });
      },
      getLinkMsg: function(item) {
        let str = "请选择跳转页面链接地址";
        if (item.link && item.link.name && item.link.name != "") {
          str = item.link.name;
        } else if (item.link && item.link.url && item.link.url != "") {
          str = item.link.url;
        }
        return str;
      },
      removeRowItem: function (index) {
        this.pageCurrentData.rows.splice(index, 1)
      },
      toggleMainMix: function(index) {
        this.toggleMainMixActive = index;
      },
      styleChanged: function () {
        let styleTempl = this.pageCurrentData.styleTempl
        if (styleTempl == 1) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/titleImg.png'
          this.pageCurrentData.bgImgUrl = ''
        } else if (styleTempl == 2) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/youjia_icon.png'
          this.pageCurrentData.bgImgUrl = 'static/images/fuel-prices/youjia_bg.png'
        }
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.titleImg = item.url;
          }
        });
      }
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;
    img {
      border: 1px solid #dcdddd;
    }
  }
  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
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
