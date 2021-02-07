<template>
  <div class="body">
    <nav-top bstyle="transparent" @backEvent="$router.go(-1)" title="确认订单"></nav-top>
    <div class="user_info">
      <div class="info">
        <span>提货人：</span>
        <input type="text" placeholder="姓名" />
        <input type="text" placeholder="请输入手机号" />
      </div>
      <div class="pick_up_way">
        <span> 提货方式：</span>
        <span>自提</span>
      </div>
    </div>
    <div class="pick_up_address">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
        <div class="change">切换提货地址</div>
      </div>
      <div class="line"></div>
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
    <div class="goods_info">
      <div class="goods_title">
        <div class="goods_title_text">商品信息</div>
        <div class="line"></div>
      </div>
      <div class="goods_item">
        <div class="goods_info_item">
          <img src="https://times-mall-uat.oss-cn-shenzhen.aliyuncs.com/0ed8ff39422447d68f3c16234519df2d.jpg" alt="" />
          <div class="goods_info_detail">
            <div class="goods_name">新鲜的大西瓜500kg/份</div>
            <div class="sell_price">销售价格：¥10.00</div>
            <div class="count_price">
              <div class="bulk_price">团购价格：¥5.00</div>
              <div class="count">共一件</div>
            </div>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="goods_detail">
        <div class="sell_price_statistics">¥10.00</div>
        <div class="bulk_price_statistics">团购价格：¥5.00</div>
      </div>
    </div>
    <div class="remark">
      <span>订单备注：</span>
      <input type="text" />
    </div>
    <div class="pay_now">
      <div class="pay_price">¥10.00</div>
      <div class="pay">立即支付</div>
    </div>
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
  background-color: #F6F6F6;
  background-image:url("./activity/images/bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;
  padding: 10px 3%;
  overflow: auto;
  bottom: 49px !important;

  .line {
    width: 315px;
    height: 1px;
    background-color: #EEEDED;
  }

  .user_info {
    width: 100%;
    height: 70px;
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 70px auto 0;
    padding: 10px 20px;

    .info {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;

      span {
        width: 61.5px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }

      input {
        width: 125.5px;
        border-right: 1px solid #D8D7D7;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
      }

      input:last-child {
        border: none;
      }

      input::-webkit-input-placeholder {
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 20px;
            }
    }

    .pick_up_way {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
      }

      span:last-child {
        font-weight: 400;
        letter-spacing: 1px;
        margin-left: 15px;
      }
    }
  }

  .pick_up_address {
    width: 100%;
    height: 165px;
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 10px 10px 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .addres_title {
      display flex
      .addres_title_text {
        flex 1
        padding-bottom: 9.5px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }
      .change {
        line-height: 20px;
        color: #a9a9a9;
      }
    }

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

  .goods_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 7px 10px 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .goods_title {
      .goods_title_text {
        padding-bottom: 9.5px;
        font-size: 14px;
        font-weight: 700;
        color: #424242;
        line-height: 20px;
      }
    }

    .goods_item {
      padding-top: 9.5px;

      .goods_info_item {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 9.5px;

        img {
          width: 105px;
          height: 105px;
          margin-right: 10px;
        }

        .goods_info_detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 12px;

          .goods_name {
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
            letter-spacing: 1px;
            margin-bottom: 24.5px;
          }

          .sell_price {
            font-size: 13px;
            font-weight: 400;
            color: #666666;
            line-height: 18.5px;
            letter-spacing: 1px;
            margin-bottom: 4px;
            text-decoration: line-through;
          }

          .count_price {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bulk_price {
              font-size: 14px;
              font-weight: 600;
              color: #424242;
              line-height: 20px;
              letter-spacing: 1px;
            }

            .count {
              font-size: 14px;
              font-weight: 400;
              color: #E1DDDD;
              line-height: 20px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }
    .more {
      width: 20px;
      height: 20px;
      margin: 10px auto 0;
    }
    .goods_detail {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .sell_price_statistics {
        font-size: 12px;
        font-weight: 400;
        color: #C3C2C2;
        line-height: 16.5px;
        letter-spacing: 1px;
        text-decoration: line-through;
      }
      .bulk_price_statistics {
        font-size: 14px;
        font-weight: 600;
        color: #E35161;
        line-height: 20px;
        letter-spacing: 1px;
        margin-left: 13.5px;
      }
    }
  }
  .remark {
    width: 100%;
    height: 49px;
    background: #FFFFFF;
    box-shadow: 0px 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    padding: 14.5px 0 14.5px 20px;

    span {
      font-size: 14px;
      font-weight: 700;
      color: #424242;
      line-height: 20px;
      letter-spacing: 1px;
      margin-right: 10px;
    }

    input {
      font-size: 14px;
      font-weight: 400;
      color: #424242;
      line-height: 20px;
      letter-spacing: 1px;
    }
  }

  .pay_now {
    width: 100%;
    height: 49px;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 11px 20px 10.5px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .pay_price {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
      line-height: 22.5px;
      letter-spacing: 1px;
      margin-right: 15px;
    }
    .pay {
      width: 86px;
      height: 27.5px;
      background: #B52232;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 27.5px;
      letter-spacing: 1px;
      text-align: center;
    }
  }
}
</style>

