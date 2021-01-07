/**Created by liaoyingchao on 2020-01-02.*/

<template>
  <div class="setting">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <!--.mall-gengduojiantou-->
          <div class="row line_bottom">
            <div class="pic">
              <img :src="getHeadImg()"/>
            </div>
            <i class="iconfont mall-gengduojiantou icon-more theme_font_black"></i>
          </div>
          <div class="row line_bottom" @click="myAddress">
            <div class="label">我的地址</div>
            <i class="iconfont mall-gengduojiantou icon-more theme_font_black"></i>
          </div>
          <div class="row line_bottom" @click="myIds">
            <div class="label">我的证件</div>
            <i class="iconfont mall-gengduojiantou icon-more theme_font_black"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">语言</div>
            <div class="value">中文</div>
            <i class="iconfont mall-gengduojiantou icon-more theme_font_black"></i>
          </div>
        </div>
        <div class="btn"></div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "setting",
    components: {},
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      return {

      }
    },
    methods: {
      myAddress: function () {
        this.$router.push({
          path: '/mall2/addresslist',
          query: {
            pageType: '1'
          }
        })
      },
      myIds: function () {
        this.$router.push({
          path: '/ids',
          query: {
            pageType: '1'
          }
        })
      },
      getHeadImg: function () {
        if (this.userInfo.headImg && this.userInfo.headImg.length) {
          return this.userInfo.headImg;
        } else {
          //女
          if (this.userInfo.gender == '2') {
            return 'static/image/setting/setting-img.png';
          }else  {
            return 'static/image/setting/setting-img-man.png';
          }
        }
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .setting {
    width 100%
    height 100%
    overflow hidden
    .content {
      width 100%
      height 100%
      overflow hidden
      display flex;
      flex-flow column;

      .list {
        flex 1;
        overflow-y auto;
        padding 15px 20px;
        .row {
          display flex;
          align-items center;
          padding 14px 1px;
          .pic {
            flex 1;
            img {
              width 60px;
              height 60px;
              border-radius 30px;
              overflow hidden;
            }
          }
          .label {
            font-size 16px;
            flex 1;
            font-weight 600;
          }
          .value {
            font-size 16px;
            padding 0 5px;
          }
          .icon-more {
            font-size 14px;
            color #101010
          }
        }
      }
      .btn {

      }
    }
  }
</style>
