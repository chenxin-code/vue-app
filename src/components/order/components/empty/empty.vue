<template>
  <div class="empty">
    <van-empty class="custom-image" :image="imgUrl" description="暂无订单" />
  </div>
</template>

<script>
export default {
  name: "empty",
  data() {
    return {
      imgUrl: require("../../img/noOrder.png"),
    };
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.empty {
  width: 100%;
  height: 677px;
  background-color: #fff;

  /deep/.van-empty__image {
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
