<template>
  <!-- // created by hjc 售后申请 -->
  <div class="afterApplication">
    <div class="after_sales">
      <div class="after_sales_type">
        <div class="after_sales_title">
          <div>售后类型</div>
          <div>退款</div>
        </div>
        <img
          :src="require('./images/right_icon.png')"
          alt=""
          class="select_icon"
        />
      </div>
      <div class="goods_info">
        <div class="goods_info_title">商品信息</div>
        <div class="goods_item" v-for="(item, index) in 4" :key="index">
          <img :src="require('../share/images/share.png')" alt="" />
          <div class="goods_item_detail">
            <div class="goods_name">新鲜的大西瓜</div>
            <div class="goods_count">
              商品数量：
              <van-stepper
                v-model="value"
                input-width="0.466667rem"
                button-size="0.466667rem"
              />
            </div>
            <div class="goods_price_btn">
              <div class="price">
                <div>商品价格：</div>
                <div>¥5.00</div>
              </div>
              <div class="delet_btn">删除</div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="refund_price">合计退款金额：¥20.00</div>
      </div>
    </div>
    <div class="problem_description">
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="问题描述："
        type="textarea"
        maxlength="50"
        placeholder="请输入问题描述"
        show-word-limit
      />
    </div>
    <van-uploader>
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader>
    <div class="submit_btn">发起售后</div>
  </div>
</template>

<script>
export default {
  name: "afterApplication",
  props: {},
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.afterApplication {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px 10px 20px;
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  letter-spacing: 1px;

  .line {
    width: 100%;
    height: 1px;
    background-color: #EEEDED;
  }

  .after_sales {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 6px 10.5px 10px 10px;

    .after_sales_type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EEEDED;
      padding-bottom: 5.5px;

      .after_sales_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-right: 20px;
        }

        div:last-child {
          color: #000000;
        }
      }

      .select_icon {
        width: 7px;
        height: 12.5px;
      }
    }

    .goods_info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods_info_title {
        padding: 4.5px 0 5px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }

      .goods_item {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 12px;

        img {
          width: 85px;
          height: 85px;
          margin-right: 14.5px;
        }

        .goods_item_detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .goods_name {
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
          }

          .goods_count {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
            margin-top: 13.5px;
          }

          .goods_price_btn {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              display: flex;
              justify-content: space-between;
              align-items: center;

              div {
                font-size: 14px;
                font-weight: 400;
                color: #424242;
                line-height: 20px;
              }

              div:last-child {
                font-weight: 600;
              }
            }

            .delet_btn {
              width: 46px;
              height: 18.5px;
              background: #B52232;
              border-radius: 14px;
              text-align: center;
              line-height: 18.5px;
              font-size: 12px;
              font-weight: 400;
              color: #FFFFFF;
            }
          }
        }
      }

      .refund_price {
        display: flex;
        justify-content: flex-end;
        font-size: 13px;
        font-weight: 600;
        color: #707070;
        line-height: 18.5px;
        padding-top: 9.5px;
      }
    }
  }

  .problem_description {
    width: 100%;
    height: 220px;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    margin-top: 10px;
    padding: 6px 10px 10px;

    .van-cell__title {
      span {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
  }

  .submit_btn {
    width: 307.5px;
    height: 37.5px;
    background: #B52232;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 5px;
    text-align: center;
    line-height: 37.5px;
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
    margin: 10px auto 0;
  }
}
</style>

