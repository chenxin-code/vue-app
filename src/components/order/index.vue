<template>
  <div>
    <nav-top></nav-top>
    <div class="nav">
      <div class="nav-content">
        <ul>
          <li>
            <span>全部</span>
            <i></i>
          </li>
          <li>
            <span>待支付</span>
            <i></i>
          </li>
          <li>
            <span>待发货</span>
            <i></i>
          </li>
          <li>
            <span>待收货</span>
            <i></i>
          </li>
          <li>
            <span>已完成</span>
            <i></i>
          </li>
          <li>
            <span>已取消</span>
            <i></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import navTop from '@/components/order/nav-top/nav-top'
export default {
  data() {
  },
  components: {
    navTop
  }
}
</script>


<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
.nav {
  .nav-content {
    padding: 0 10px;
  }
  ul {
    display: flex;
    justify-content: space-between;
    li {
      color: #8D8D8D;
      font-size: 14px;
      
      i {
        display: block;
        width: 100%;
        height: 2px;
        background: #000;
        margin-top:10px;
      }
    }
  }

}
</style>