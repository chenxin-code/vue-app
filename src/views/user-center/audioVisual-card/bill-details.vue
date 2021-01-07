<template>
  <div class="bill-details-index">
    <nav-top title="账单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-content">
      <div class="bill-details-top">
        <div class="bill-name">
          <img src="./assets/image/icon5@2x.png" alt>
          <p>爱奇艺钻石会员月卡</p>
        </div>
        <p class="bill-price">-99.99</p>
        <p class="bill-state">交易成功</p>
      </div>
      <div class="bill-details-bottom">
        <ul>
          <li>
            <p class="detail-title">激活码</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">密码</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">有效期</p>
            <p class="detail-content">123123</p>
          </li>
          <hr>
          <li>
            <p class="detail-title">订单号</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">付款方式</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">接收手机号</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">账单类型</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">充值时间</p>
            <p class="detail-content">123123</p>
          </li>
          <li>
            <p class="detail-title">商家订单号</p>
            <p class="detail-content">123123</p>
          </li>
        </ul>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.bill-details-content {
  .bill-details-top {
    text-align: center;

    .bill-name {
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        margin-left: 10px;
        display: inline-block;
      }
    }

    .bill-price {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
    }

    .bill-state {
      color: #999999;
    }
  }

  .bill-details-bottom {
    padding: 20px;
    margin-top: 30px;

    hr {
      background: #D7D7D7;
      margin: 10px 0;
      border: none;
      height: 1px;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 30px;

      .detail-title {
        color: #A1A1A1;
      }
    }
  }
}
</style>
