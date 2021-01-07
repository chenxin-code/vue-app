/**Created by liaoyingchao on 2020-01-02.*/

<template>
  <div class="index">
    <nav-top :title="toptitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="row line_bottom">
            <div class="label">身份证</div>
            <i class="iconfont mall-gengduojiantou icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">护照</div>
            <i class="iconfont mall-gengduojiantou icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">港澳通行证</div>
            <i class="iconfont mall-gengduojiantou icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">台胞证</div>
            <i class="iconfont mall-gengduojiantou icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">边民证</div>
            <i class="iconfont mall-gengduojiantou icon-more"></i>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    data() {
      return {
        toptitle:"我的证件"
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .index {
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
          .label {
            font-size 16px;
            font-weight 600;
            flex 1;
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
