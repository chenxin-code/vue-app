<!--
 * @Description: 这是***页面
 * @Date: 2021-06-08 13:57:02
 * @Author: shuimei
 * @LastEditTime: 2021-07-21 17:52:25
-->
<template>
  <div class="empty">
    <van-empty
      class="custom-image"
      :image="imgUrl"
      :description="description"
    />
  </div>
</template>

<script>
export default {
  name: "empty",
  props: {
    description: {
      type: String,
      default: "暂无订单"
    }
  },
  data() {
    return {
      imgUrl: require("../../img/noOrder.png")
    };
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.empty {
  width: 100%;
  // height: 677px;
  height: 100vh;
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
