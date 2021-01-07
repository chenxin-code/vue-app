/**Created by liaoyingchao on 2020-01-02.*/

<template>
  <div class="user-info">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="row line_bottom">
            <div class="pic">
              <img :src="getHeadImg()"/>
            </div>
            <i class="iconfont mall-gengduojiantou icon-more theme_font_black"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">姓名</div>
            <div class="value">李子琪</div>
          </div>
          <div class="row line_bottom">
            <div class="label">性别</div>
            <div class="value">女</div>
          </div>
          <div class="row line_bottom">
            <div class="label">国籍</div>
            <div class="value">中国</div>
          </div>
          <div class="row line_bottom">
            <div class="label">出生日期</div>
            <div class="value">1990-02-28</div>
          </div>
          <div class="row line_bottom">
            <div class="label">证件号码</div>
            <div class="value">1231231*****23</div>
          </div>
          <div class="row line_bottom">
            <div class="label">护照号码</div>
            <div class="value">12312*****3123123</div>
          </div>
          <div class="row line_bottom">
            <div class="label">手机号码</div>
            <div class="value">132***1231</div>
          </div>
          <div class="row line_bottom">
            <div class="label">电子邮箱</div>
            <div class="value">fff@sunboxsoft.com</div>
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
    name: "user-info",
    components: {},
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      return {}
    },
    methods: {
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
  .user-info {
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
    }
  }
</style>
