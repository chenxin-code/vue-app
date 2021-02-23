<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="选择收货地址"></nav-top>
    <nav-content style="display:flex;flex-direction:column;">
      <div class="input-box">
        当前商品可选提货地点
      </div>
      <div class="pick_up_address" style="flex:1;height:0;overflow:auto;">
        <div class="lay-address" v-for="(item,index) in list" :key="index" style="padding:20px 8px;border-bottom:1px solid #f6f6f6">
          <img src="https://times-mall-uat.oss-cn-shenzhen.aliyuncs.com/0ed8ff39422447d68f3c16234519df2d.jpg" alt="" />
          <div class="addres_info_detail">
            <div class="colonel_name">{{item.teamLeaderName}}</div>
            <div class="addres">提货地点：{{item.cucName}} {{item.cudName}} {{item.cuName}}</div>
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
    return {
      list:[]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      let url = `/app/json/group_buying_head_info/findHeadInfoByList`;
      this.$http.get(url).then(res => {
        if(res.data.status == 0)this.list = res.data.data.records;
      }).catch(e=>{
        console.log(e);
      })
    }
  }
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
    height: 32px;
    font-size 14px
    line-height 20px
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 10px 0;
    padding-left: 10px;
    color #666666
  }
  .pick_up_address {
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    // padding: 2px 5px 10px 5px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position relative
    &::before {
      content: '默认';
      padding: 1px;
      font-size: 12px;
      color: #b52232;
      border: 1px solid #b52232;
      border-radius: 3px;
      position: absolute;
      top: 9.5px;
      right: 15px;
    }
    &::after {
      content: '';
      height: 7px;
      width: 7px;
      border-width: 1.5px 1.5px 0 0;
      border-color: #c8c8cd;
      border-style: solid;
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      margin-top: -5px;
      position: absolute;
      top: 50%;
      right: 15px;
    }
    .lay-address {
      display: flex;
      justify-content: flex-start;
      align-items: center;
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
        padding: 0 70px 0 0;
        .colonel_name {
          font-size: 14px;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .addres {
          font-size: 14px;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>

