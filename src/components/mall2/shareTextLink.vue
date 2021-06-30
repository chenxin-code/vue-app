<template>
  <div class="shareTextLink">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <div class="title">
      <span class="ornament"></span>
      <div>编辑文案</div>
    </div>
    <div class="copyText">
      <van-field
        v-model="message"
        :autosize="{ minHeight: 89 }"
        type="textarea"
      />
    </div>
    <div class="footer">
      <div class="footerBtn">
        <img src="static/image/mall2/shareLinkBtn.png" alt="" />
        <div>复制文案分享</div>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
export default {
  name: "shareTextLink",
  data() {
    return {};
  },
};
</script>
 
<style scoped lang="stylus" rel="stylesheet/stylus">
.router_class {
  background-color: #F4F4F4 !important;
}

/deep/.van-field {
  padding: 0;
}

/deep/.van-field__control {
  background-color: #FFF9F9;
  border-radius: 12px;
}

.shareTextLink {
  width: 100%;
  height: 100%;
  background-color: #F4F4F4;

  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 64px;
    padding: 18px 12px 18px 15px;

    .ornament {
      width: 4px;
      height: 12px;
      background: #E3352A;
      border-radius: 2px;
      margin-right: 7px;
    }

    div {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 30px;
    }
  }

  .copyText {
    width: 93.6%;
    height: 214px;
    background: #FFFFFF;
    border-radius: 12px;
    margin: 0 auto;
    padding: 12px;
  }

  .footer {
    width: 100%;
    height: 102px;
    background: #FFFFFF;
    opacity: 0.5;
    border-radius: 12px 12px 0px 0px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .footerBtn {
      width: 86.4%;
      height: 48px;
      background: #E3352A;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 19px;
        height: 19px;
        display: block;
        margin-right: 11px;
      }

      div {
        font-size: 15px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 30px;
      }
    }
  }
}
</style>