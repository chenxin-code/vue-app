<template>
  <!-- navbar -->
  <div class="navbar">
    <van-sticky>
      <van-nav-bar :title="title" @click-left="navBack">
        <template #left>
          <van-icon
            name="arrow-left"
            class="arrow_left"
            color="#000000"
            size="0.471467rem"
          />
        </template>
      </van-nav-bar>
    </van-sticky>
  </div>
</template>
<script>
export default {
  name: "navbar",
  props: ["title", "backUrl"],
  data() {
    return {};
  },
  methods: {
    navBack() {
      if (this.backUrl) {
        this.$router.push(this.backUrl);
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
<style  lang="stylus" scoped type="text/stylus">

.navbar {
  width: 100%;
  height: 44px;
}

/deep/.van-nav-bar__left {
  padding-right: 41px;
}
/deep/.van-nav-bar__content{
  height: 44px;
}

.van-nav-bar__title .van-ellipsis {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 22.5px;
}
</style>