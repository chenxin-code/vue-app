<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="售后维修"></nav-top>
      <nav-content>
        <div class="statusBox">
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>提交成功</span></div>
          <p></p>
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>售后审核</span></div>
          <p></p>
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>审批完成</span></div>
          <p></p>
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>退款完成</span></div>
        </div>
        <div class="bg"></div>
        <div class="box" @click="chuli">
          <div class="div2">
            <img src="static/image/microShop/icon_entrance ticket.png" alt="">
            <div>
              <p>{{detailObj.skuName}}</p>
              <p>购买数量：{{detailObj.payNumber}}（张）</p>
            </div>
          </div>
        </div>
        <div class="box box1">
          <p>售后信息</p>
          <div><span>售后单号</span><span>{{detailObj.returnTradeNo}}</span></div>
          <div><span>售后类型</span><span>申请退票</span></div>
          <div><span>售后数量</span><span>{{detailObj.number}}</span></div>
          <div><span>申请时间</span><span>{{detailObj.createTime}}</span></div>
        </div>
        <div class="box div3">
          <p>申请备注</p>
          <textarea v-model="detailObj.remark" name="" id="" cols="20" rows="5" placeholder="情况有变，临时计划变更！"></textarea>
        </div>
<!--        <div class="answer">取消申请</div>-->
      </nav-content>
    </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
    export default {
        name: "handle",
      mixins: [api],
      data() {
          return {
           detailObj: {}
          }
      },
      mounted() {
        this.loadData()
      },
      methods:{
        loadData() {
          let that = this
          let params = {
            token: this.$store.state.login.token,
            id: that.$route.query.id,
          };

          this.$Loading.open()
          that.afterdetailData(params).then(res => {
            console.log(res);
            this.$Loading.close()
            if (res.data.result) {
              that.detailObj= res.data.data || {}
            } else {
              Toast(res.data.info)
            }
          });
        },
      }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .statusBox {
      background #fbf6f0
      padding 10px 20px;
      display flex;
      justify-content space-between;
      p {
        width: 30px;
        height: 1px;
        background: #deb98c;
        margin: auto;
      }
      div {
        display flex;
        flex-direction column
        img {
          margin: auto;
          width: 30px;
          margin-bottom 5px;
        }
        span {
          margin: auto;
        }
      }
    }
    .bg {
      background #f6f6f6;
      height 15px;
    }
    .box {
      padding 20px;
      background white;
      font-size 14px;
      .div1 {
        display flex;
        justify-content space-between
        span {
          font-size 14px;
          margin auto 0
        }
        div{
          display flex;
          justify-content space-between
          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }
          span {
            font-size 18px;
            margin auto
          }
        }
      }
      .div2 {
        display flex;
        justify-content start
        img {
          width: 60px;
          border-radius: 6px;
          margin: auto 0;
          margin-right: 15px;
        }
        div{
          display flex;
          flex-direction column
          font-size 14px;
          flex 1
          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
          p:nth-child(2) {
            display flex;
            justify-content space-between
          }
        }
      }
      .tuipiao {
        display flex;
        justify-content space-between;
        span {
          font-size 16px;
        }
        div {
          font-size 14px;
        }
      }
      .recordBox {
        display flex;
        justify-content start;
        margin-top 20px
        .div1 {
          display flex;
          flex-direction column;
          font-size 14px;
          margin: auto 0;
          margin-right: 20px;
          p:nth-child(1) {
            margin  10px 0 20px 0
          }
        }
        .div2 {
          width 100px;
          height 100px;
          background pink
          margin auto 0
        }
      }
    }
    .box1 {
      p {
        font-size 16px;
      }
      div {
        display flex;
        justify-content space-between;
        margin-top 10px;
        span:nth-child(2) {
          color #a6a6a6
        }
      }
    }
    .div3 {
      p {
        font-size 16px;
        margin-bottom 8px;
      }

      textarea {
        display: block;
        width: 100%;
        background: #efefef;
        border: 0;
        border-radius: 8px;
        text-indent: 2em;
        line-height: 18px;
        padding 10px
      }
    }
    .answer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      background #deb98c;
      color white
    }
  }

</style>
