<template>
  <!-- navbar -->
  <div class="navbar">
    <van-sticky>
      <van-nav-bar :title="title" @click-left="$router.go(-1)">
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
  props: ["title"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.navbar {
  width: 100%;
}
.van-nav-bar__title .van-ellipsis {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 22.5px;
}
</style>