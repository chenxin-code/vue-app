<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="选择收货地址"></nav-top>
    <nav-content>
      <div class="input-box">
        <input placeholder="当前商品可选提货地点" />
      </div>
      <div class="pick_up_address">
        <div class="addres_info">
          <img src="https://times-mall-uat.oss-cn-shenzhen.aliyuncs.com/0ed8ff39422447d68f3c16234519df2d.jpg" alt="" />
          <div class="addres_info_detail">
            <div class="colonel_name">奥利给</div>
            <div class="addres">
              提货地址：北京市西城区 五福 玲珑居物业管理中心
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "confirmOrder",
  props: {},
  data() {
    return {}
  },
  created() {},
  methods: {}
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.body {
  width: 100%;
  height: 100%;
  overflow: auto;
  .input-box {
    width: 100%;
    height: 49px;
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    //margin-top: 10px 3%;
    padding: 14.5px 0 14.5px 20px;
    input {
      font-size: 14px;
      font-weight: 400;
      color: #424242;
      line-height: 20px;
      letter-spacing: 1px;
    }
  }
  .pick_up_address {
    //height: 165px;
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 0 5px 10px 5px;
    margin: 10px 3% 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .addres_info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 9.5px;
      img {
        width: 65px;
        height: 65px;
        margin-right: 10px;
        border-radius: 50%;
      }

      .addres_info_detail {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 12px;

        .colonel_name {
          font-size: 14px;
          font-weight: 400;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          margin-bottom: 19.5px;
        }

        .addres {
          font-size: 14px;
          font-weight: 600;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>

