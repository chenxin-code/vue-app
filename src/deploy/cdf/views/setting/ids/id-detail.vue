<template>
  <div class="iddetail">
    <nav-top :title="toptitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="row line_bottom">
            <div class="label">姓名</div>
            <div>张三/znangsan</div>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">证件类型</div>
            <div>身份证</div>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">证件号</div>
            <div>12345***********0978</div>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="row line_bottom">
            <div class="label">有效期</div>
            <div>2009.01.01-2019.01.01</div>
            <i class="iconfont icon-more"></i>
          </div>
        </div>
        <div class="submit theme_standard_bg">返回</div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      toptitle: "证件详情"
    };
  },
  created() {},
  mounted() {},
  methods: {
    idcardDetail() {
      let url = "";
    }
  }
};
</script>
<style lang="stylus" scoped>
.iddetail {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;

    .list {
      flex: 1;
      overflow-y: auto;
      padding: 15px 20px;

      .row {
        display: flex;
        align-items: center;
        padding: 14px 1px;

        .label {
          font-size: 16px;
          font-weight: 600;
          flex: 1;
        }

        .icon-more {
          font-size: 14px;
          color: #101010;
        }
      }
    }

    .submit {
      padding: 17px 0;
      margin: 0px auto 20px auto;
      width: 335px;
      height: 50px;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
    }
  }
}
</style>
