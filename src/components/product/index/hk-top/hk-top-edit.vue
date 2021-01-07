/**Created by liaoyingchao on 2020-06-30.*/

<template>
  <div class="hk-top-edit">
    <EditLayout title="编辑区--好客优惠站顶部">
      <Row class="edit-all-line">
        <div class="image-div" @click="changeDefautHeaderImg">
          <img class="header-img" :src="pageCurrentData.headImg ? pageCurrentData.headImg : 'static/images/defaultImg.png'"/>
          <p class="tip">点击更换默认头像</p>
        </div>
      </Row>
      <BgEdit></BgEdit>
    </EditLayout>
  </div>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters} from 'vuex';
  import Bus from '../bus';

  export default {
    name: "hk-top",
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {

      }
    },
    methods: {
      changeDefautHeaderImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.headImg = item.url;
          }
        });
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .hk-top-edit {
    width 100%
    height 100%
    overflow hidden
    .image-div {
      position relative;
      overflow hidden;
      img {
        display block;
        width 100%;
      }
      .header-img {
        margin 0 auto;
        width 100px;
        height 100px;
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
  }
</style>
