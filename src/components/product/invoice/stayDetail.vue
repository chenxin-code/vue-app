<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="代开发票"></nav-top>
    <nav-content>
      <div class="publicInvoice">
        <van-cell-group>
          <van-field v-model="dingdannNo" disabled label="订单号" placeholder/>
          <van-field v-model="leixing" disabled label="发票类型" placeholder/>
          <van-field v-model="neirong" disabled label="发票内容" placeholder/>
        </van-cell-group>
        <van-radio-group v-model="radio">
          <div>发票抬头</div>
          <van-radio name="1" @click="taitou(4)" checked-color="#f44">个人</van-radio>
          <van-radio name="2" @click="taitou(5)" checked-color="#f44">公司</van-radio>
        </van-radio-group>
        <van-cell-group v-if="company">
          <van-field v-model="gongname" label="公司名称" placeholder="请输入公司名称"/>
          <van-field v-model="shuihao" label="税号" placeholder="请输入税号"/>
        </van-cell-group>
      </div>
      <div class="publicInvoice publicInvoice1" v-if="!company">
        <van-cell-group>
          <van-field v-model="xingming" label="收票人姓名" placeholder="请输入收票人姓名"/>
          <van-field v-model="phone" label="收票人手机号" placeholder="请输入收票人手机号"/>
          <div class="publicInvoiceDiv" @click="areaData">
            <van-field label="收票人地区" v-model="areas" disabled/>
            <span class="img">
              <img src="/static/image/invoice/arrows.png" alt>
            </span>
          </div>
          <van-popup v-model="area" position="bottom">
            <van-area @cancel="cancelArea" @confirm="confirmArea" :area-list="areaList"/>
          </van-popup>
          <van-field v-model="dizhi" label="详细地址" placeholder="请输入详细地址"/>
        </van-cell-group>
      </div>
      <div class="publicInvoice publicInvoice1" v-if="company">
        <van-cell-group>
          <van-field v-model="xingming" label="收票人姓名" placeholder="请输入收票人姓名"/>
          <van-field v-model="phone" label="收票人手机号" placeholder="请输入收票人手机号"/>
          <div class="publicInvoiceDiv" @click="areaData">
            <van-field label="收票人地区" v-model="areas" disabled/>
            <span class="img">
              <img src="/static/image/invoice/arrows.png" alt>
            </span>
          </div>
          <van-popup v-model="area" position="bottom">
            <van-area @cancel="cancelArea" @confirm="confirmArea" :area-list="areaList"/>
          </van-popup>
          <van-field v-model="dizhi" label="详细地址" placeholder="请输入详细地址"/>
        </van-cell-group>
      </div>
      <div class="answer theme_bg_red" @click="commit">提交</div>
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
      dingdannNo: "222",
      leixing: "普通发票",
      neirong: "商品明细",
      radio: "1",
      gongname: "",
      shuihao: "",
      phone: "",
      xingming: "",
      dizhi: "",
      area: false,
      areas: "",
      areaList: areaList,
      company: false,
      paramsData: {}
    };
  },
  created() {
    let that = this
    console.log(1,that.$route.params)
    this.paramsData = that.$route.params
    console.log(2,that.paramsData);
    if (that.paramsData.titleType === 4) {
      that.radio = '4'
      that.company = false;
    } else {
      that.radio = '5'
      that.company = true;
    }
  },
  mounted() {},
  methods: {
    areaData() {
      this.area = true;
    },
    cancelArea() {
      this.area = false;
      console.log("取消");
    },
    confirmArea(val) {
      console.log(val);
      this.areas = val[0].name + "/" + val[1].name + "/" + val[2].name;
      this.area = false;
      console.log("确定");
      console.log(this.areas)
    },
    commit() {
      let that = this
      let params = {
        id: that.paramsData.id,
        orderId: that.paramsData.orderId,
        token: this.$store.state.login.token,
        typeName: that.paramsData.typeName,
        detail: that.paramsData.detail,
        titleType: that.params.titleType,
        radio: that.radio, // 抬头
        gongname: that.gongname,
        shuihao: that.shuihao,
        xingming: that.xingming,
        phone: that.phone,
        areas: that.areas, //收票人地区
        dizhi: that.dizhi
      }

      if(!that.detailObj.radio) {
        Toast({
          message: '请输入抬头',
          duration: 2000,
        });
        return;
      }
      if (that.radio == 5) {
        if(!that.shuihao) {
          Toast({
            message: '请输入税号',
            duration: 2000,
          });
          return;
        }
      }
      if (that.phone === '' || !(/^1(3|4|5|7|8|9)\d{9}$/.test(that.phone))) {
        Toast({
          message: '请输入正确的手机号',
          duration: 2000,
        });
        return;
      }
      that.tijiaoData(params).then(res => {
        if (res.data.result === 'success') {
          Toast.success('提交成功');
        } else {
          Toast(res.data.info)
        }
      })
    },
    taitou(name) {
      let that = this;
      if (name === 4) {
        that.company = false;
      } else if (name === 5) {
        that.company = true;
      }
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

    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
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
    font-size: 18px;
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
