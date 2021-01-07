
<template>
  <div class="popup">
    <van-popup title="提示" v-model="cancellation" class="popupCard" :close-on-click-overlay="false">
      <div class="popupText">
        <p>提示</p>
        <div class="content">
           <span>{{cancellationText}}</span>
        </div>
      </div>
      <div class="popupBtn">
        <span @click="cancellation=false">关闭</span>
        <span @click="cancellation=false">确定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: "popup",
    components: {},
    data() {
      return {
        cancellation: true,
        cancellationText: ''
      }
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
.popup {
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popupCard {
    height: 180px;
    flex-direction: column;
    line-height: 26px;

    .popupText {
      height 130px
      padding 20px
      display: flex;
      flex-direction: column;
      align-items: center;
      .content {
        height 100px
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      p {
        color #000
        font-size 16px
      }
    }

    .popupBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 16px

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:last-child {
        color #fff;
        background-color #f02e2c
      }
    }
  }
}
</style>
