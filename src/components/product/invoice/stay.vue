<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="代开发票"></nav-top>
    <nav-content>
      <div class="commodityLisst" v-for="(item,index) in listData">
        <van-card
          num="1"
          price="219.00"
          :desc="item.detail"
          :title="item.title"
          :thumb="imageURL"
        />
        <div class="botal">
          <p>共3件商品</p>
          <p>需付款：<span>￥219:00</span></p>
        </div>
        <div class="theme_bg_red btnDiv" @click="makeInvoice(item)">前往开票</div>
      </div>
      <!--<div class="answer theme_bg_red"><router-link to='/stayDetail'>前往开票</router-link></div>-->
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'

  export default {
    name: "stay",
    mixins: [api],
    data() {
      return {
        imageURL: '//img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
        listData: []
      }
    },
    mounted() {
     this.loadIndex()
    },
    methods: {
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.daikaiData(params).then(res => {
          console.log(1111111)
          console.log(res)
          that.listData = res.data.data
        })
      },
      makeInvoice(param) {
        let that = this
        that.$router.push({name: 'stayDetail',params: {id: param.id,orderId: param.orderId,typeName: param.typeName,detail: param.detail,titleType: param.titleType}})
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .commodityLisst {
      width 95%;
      margin 0 auto
      box-shadow: #f3f3f3 0px 0px 15px;
      padding 30px 20px 60px 20px;
      .botal {
        display: flex;
        justify-content: flex-end;
        /*border 1px solid*/
        p:nth-child(1) {
          margin-right 20px;
        }
        p {
          span {
            color #f44
            font-size 16px;
            font-weight 700;
            vertical-align: middle;
          }
        }
      }
      .btnDiv {
        padding: 0 15px;
        border-radius: 12px;
        color: #fff;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        display: inline-block;
        float right;
        margin 15px 0
      }
      .van-card {
        background white
        .van-card__price {
          font-size 16px;
        }
      }
      .goInvoice {
        height 25px;
        display block
        line-height 24px;
        text-align center;
        padding 0px 10px;
        background #f44
        color white
        border-radius 4px;
        float right
        margin 10px 0
      }
    }
    .answer {
      position fixed;
      bottom 0;
      left 0;
      width 100%;
      height 50px;
      line-height 50px;
      text-align center;
      color white;
      a {
        display block;
        width 100%;
        height 50px;
        line-height 50px;
        color white;
        font-size 18px;
      }
    }
  }
</style>
