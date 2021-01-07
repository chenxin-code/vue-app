<template>
  <div class="body">
    <nav-top title="核销完成" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="success">
          <img src="static/image/microShop/baojia3.png" alt="">
          <p>恭喜你！券使用完成！</p>
        </div>
        <div class="publicInvoice">
          <ul>
            <li><span>店铺名称</span><span>{{obj.storeOuName}}</span></li>
            <li><span>优惠券名称</span><span>{{obj.couTypeTitle}}</span></li>
            <li><span>抵扣金额</span><span>{{obj.sumCheckAmount}}</span></li>
            <li><span>使用时间</span><span>{{obj.usedTime}}</span></li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'

  export default {
    name: "complete",
    mixins: [api],
    data() {
      return {
        obj: {}
      }
    },
    mounted() {
    this.obj = JSON.parse(this.$route.query.obj)
      console.log(this.obj);
    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .tipDiv {
    /*border-top 1px solid #e5e5e5;*/

    .success {
      padding 30px 0

      img {
        width: 80px;
        margin: 15px auto;
        display: block;
      }

      p {
        text-align center
        font-size 18px;
        font-weight 600
      }
    }

    .publicInvoice {
      border 1px solid #e9e9e9;
      border-radius 8px;
      padding 0 10px;
      /*box-shadow: #f3f3f3 0px 0px 15px;*/
      width: 95%;
      margin: 20px auto 10px auto;
      overflow: hidden;

      li {
        margin 13px 0
        display: flex;
        justify-content: space-between;
        font-size 14px;
      }
    }
  }
  .mall-guanbi {
    float: right;
    margin-right: 10px;
    font-size: 20px;
  }
</style>
