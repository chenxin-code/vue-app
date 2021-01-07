<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="维修售后"></nav-top>
      <nav-content>
        <div class="box">
          <div class="div2">
            <img src="static/image/microShop/icon_entrance ticket.png" alt="">
            <div>
              <p>{{$route.query.name}}</p>
              <p>购买数量：{{$route.query.buyTicketsNumber}}（张）</p>
            </div>
          </div>
        </div>
        <div class="box box1">
          <p class="p">售后选择</p>
          <div class="div"><span>售后类型</span><span>申请退货</span></div>
          <div class="div divs"><span>售后数量</span><div class="num"><span @click="less">-</span><input type="text" placeholder="1" v-model="nums"><span @click="add">+</span></div></div>
        </div>
        <div class="box div3">
          <p>申请备注</p>
          <textarea name="" v-model="remark" id="" cols="20" rows="5" placeholder="请输入申请理由..."></textarea>
        </div>
        <div class="answer" @click="commit">立即申请</div>
      </nav-content>
    </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
    export default {
        name: "applyDetail",
      mixins: [api],
      data() {
        return {
          nums: 0,
          remark: '',
        }
      },
      methods: {
        commit() {
          let that = this
          let params = {
            token: this.$store.state.login.token,
            mainOrderId: that.$route.query.id1,
            number: that.nums,
            remark: that.remark
          };

          this.$Loading.open()
          that.afterapplyData(params).then(res => {
            console.log(res);
            this.$Loading.close()
            if (res.data.result) {
              Toast('申请成功')
              that.$router.go(-1)
            } else {
              Toast(res.data.info)
            }
          });
        },
        less() {
          if (this.nums>0) {
            this.nums --
          } else {
            this.nums = 0
          }
        },
        add() {
          this.nums ++
        },
      }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      padding 20px;
      background white;
      font-size 14px;
      .div2 {
        display flex;
        justify-content start
        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }
        div{
          display flex;
          flex-direction column
          font-size 14px;
          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 20px;
          }
          span {
            align-items: end;
            background: #deb98c;
            color: white;
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 6px;
            margin-left: 100px;
            margin-top: 15px;
          }
        }
      }
    }
    .box1 {
      p {
        font-size 16px;
      }
      .div {
        display flex;
        justify-content space-between
        font-size 14px;
        span:nth-child(2) {
          font-size 12px;
        }
        .num {
          input {
            width: 60px;
            background: #efefef;
            text-align: center;
            border-radius: 6px;
            padding: 7px 0;
            margin: 0 10px;
          }
          span {
            background: #666666;
            height: 25px;
            width: 25px;
            display: inline-block;
            border-radius: 50%;
            text-align: center;
            color: white;
            font-size: 24px;
          }
        }
      }
      .divs {
        span {
          margin: auto 0;
        }
      }
      div:nth-child(2) {
        margin: 12px 0 7px 0;
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
        text-indent: 1em;
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
