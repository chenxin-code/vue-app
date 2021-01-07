<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="已开发票"></nav-top>
    <nav-content>
      <div v-for="(item,index) in listData">
        <p class="p">{{item.createTime}}</p>
        <div class="publicInvoice" @click='detail(item)'>
          <van-cell-group>
          <van-field v-model="item.title" class='fa' disabled label="发票抬头" placeholder/>
          <van-field v-model="item.amount" class='fa borDiv' disabled label="开票金额" placeholder/>
          <van-field v-model="item.detail" class="fa nei borDiv" disabled label="发票内容" placeholder/>
        </van-cell-group>
        </div>
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
      listData: [],
      taitou: "个人",
      jin: "￥109",
      id: ''
    };
  },
  mounted() {
    this.loadIndex()
  },
  methods: {
    detail(index) {
     let that = this
      that.id = index.id
     that.$router.push({name:'Invoiced',params:{id: that.id}})
    },
    loadIndex() {
      let that = this
      let params = {
        token: this.$store.state.login.token,
        makeOutStatus: '1'
      }

      that.openedData(params).then(res => {
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
  .p {
    width: 95%;
    margin: 0 auto;
    line-height: 40px;
    font-size 14px;
  }

  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;
    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }
    .borDiv:not(:last-child)::after  {
        border-bottom:0
    }
    .fa {
    /deep/ .van-field__control {
        text-align right;
    }
    }
    .nei {
      /deep/ .van-field__control {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
