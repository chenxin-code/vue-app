<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="已开发票"></nav-top>
    <nav-content>
      <div class="publicInvoice">
        <p class="p">{{listData.typeName}}</p>
        <van-cell-group>
          <van-field v-model="listData.title" disabled label="发票抬头" placeholder=''/>
          <van-field v-model="listData.openingBank" disabled label="收款方" placeholder=''/>
          <van-field v-model="listData.amount" disabled label="发票金额" placeholder/>
          <van-field v-model="listData.createTime" disabled label="开票时间" placeholder/>
          <van-field v-model="listData.detail" disabled label="开票内容" class="neirong" placeholder/>
          <div class="publicInvoiceDiv" @click="seeDetail">
            <van-field label="查看发票" disabled/>
            <span class="img">
              <img src="/static/image/invoice/arrows.png" alt>
            </span>
          </div>
        </van-cell-group>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
import api from "./api";
import areaList from "../../../config/area.min.js";
export default {
  name: "stay",
  mixins: [api],
  data() {
    return {
      paramsData: {},
      taitou: "个人",
      shoukuanfang: "xxxxx公司",
      jiner: "119.00",
      shijian: "2019-03-11  12:22:12",
      neirong: "洋河蓝色经典 海之蓝 42度 单瓶装白酒520ml 口感绵"
    };
  },
  mounted() {
    this.loadIndex()
  },
  created() {
    let that = this
    console.log(5,that.$route.params)
    that.paramsData = that.$route.params
  },
  methods: {
    seeDetail() {
      let that = this
      let params = {
        token: this.$store.state.login.token,
        id: that.paramsData.id
      }
      that.chakanData(params).then(res => {
        console.log(1221)
        console.log(res)
      })
    },
    loadIndex() {
      let that = this
      let params = {
        token: this.$store.state.login.token,
        id: that.paramsData.id
      }
      that.detailData(params).then(res => {
        console.log(345)
        console.log(res)
        that.listData = res.data.data
      })
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.body {
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto;

    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }

    .p {
      text-align: center;
      line-height: 60px;
      font-size: 16px;
    }

    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }

      .neirong {
        /deep/ .van-field__control {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .van-radio-group {
      display: flex;
      justify-content: space-between;
      padding: 0.266667rem 0.4rem;
      line-height: 0.64rem;
      font-size: 0.373333rem;
    }

    .publicInvoiceDiv {
      display: flex;
      justify-content: space-between;

      .img {
        width: 10px;
        vertical-align: middle;
        line-height: 1.2rem;

        img {
          width: 100%;
        }
      }
    }
  }

  .publicInvoice1 {
    margin-top: 10px;
  }

  .answer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;

    a {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: white;
      font-size: 18px;
    }
  }
}
</style>
