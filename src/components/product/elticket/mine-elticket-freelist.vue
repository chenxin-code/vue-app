/**Created by steven on 2018/4/25.*/

<template>
  <div class="ticketbot-freelist" v-if="data">
    <div class="freelist-bg">
      <div class="details-top">
        <div class="details-img">
          <img :src="data.imgurl"/>
        </div>
        <div class="description">
          <p class="item-title">{{data.typetitle}}</p>
          <p class="item-name">{{data.typename}}</p>
          <p class="item-name">{{data.biztypecode}}</p>
          <p class="item-time">{{data.coustartdate}}至{{data.couenddate}}</p>
        </div>
      </div>
      <div class="code">
        <p class="title">券编码:{{data.checkcode}}</p>
        <div class="bar-code">
          <canvas id="barcode"></canvas>
        </div>
        <p class="number">{{data.coucode}}</p>
        <canvas class="qr-code" id="canvas"></canvas>

      </div>
      <div class="details-bottom">
        <p class="title">使用须知</p>
        <p class="user"><span>{{data.usedeclare}}</span></p>
      </div>
    </div>

  </div>
</template>

<script>
import {Toast } from 'mint-ui'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'


export default {
  name: "mine-elticket",
  components: {
    Toast
  },
  data () {
    return {
      data:null,
      voucher:null,
    }
  },
  methods: {
    getListData:function () {
      this.$Loading.open()
      let url = 'app/json/coupon/getUnusedDetail';
      let params1 = {
        phone:this.$store.state.login.phone,
        token:this.$store.state.login.token ? this.$store.state.login.token :'',
        voucher:this.voucher
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close();
        let data = res.data;console.log(data);
        if(data.status == 0){
          _this.data = data.data;
          _this.$nextTick(function () {
            let barcode = document.getElementById('barcode');
            JsBarcode(barcode, data.data.checkcode);
            let canvas = document.getElementById('canvas');
            QRCode.toCanvas(canvas,data.data.checkcode, function (error) {
              if (error) console.error(error);
              console.log('success!');
            })
          })


        }else {
          Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000,
          });
        }

      }, error => {
        _this.$Loading.close();
        console.log('获取我的电子券', error)
      })
    },
  },
  mounted(){

  },
  created () {
    this.voucher = this.$route.query.voucher;
    this.getListData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus" >
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/regularfont.styl'

.ticketbot-freelist {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color $color-background-lll;
  overflow auto
  .freelist-bg{
    padding:0px 1px;
    width:80%;
    margin 10px auto 10px auto;
    background #fd7414;
    border:1px solid #fd7414;
    border-radius:8px 8px 0px 0px;
    -webkit-border-radius:8px 8px 0px 0px;
    .details-top{
      padding:20px 5%;
      overflow:hidden;
      margin-top:10px;
      background: #fff;
      border-bottom:1px dashed $color-theme-text-l;
      .details-img{
        margin-top 7px
        width:27%;
        float:left;
        img{
          display:block;
          width:100%;
        }
       }
      .description{
        width:70%;
        float:right;
        .item-title{
          font-size:$font-size-medium-s;
          color:$color-theme-text-l;
          line-height:18px;
        }
        .item-name{
          font-size:$font-size-medium-s;
          color:$color-theme-text-l;
          line-height:18px;
          -webkit-margin-before: 0em;
          -webkit-margin-after: 0em;
        }
        .item-time{
          background:$color-theme-text-l;
          font-size:$font-size-small;
          border:1px solid $color-theme-text-l;
          border-radius:10px;
          -webkit-border-radius:10px;
          display:inline-block;
          padding:2px 10px;
          color:#fff;

        }
      }
    }
    .code{
      background:#fff;
      border-bottom:1px dashed $color-theme-text-l;
      padding:0px 5%;
      .title{
        font-size:$font-size-medium-s ;
        font-weight $font-weight-x
        color:#000;
        padding 5px 0px;
      }
      .bar-code{
        text-align:center;
        padding 10px 5%;
        canvas{
          display:block;
          width: 100%;
          height:60px;
        }
      }
      .number{
        text-align:center;
        line-height:40px;
        height:40px;
        color: $color-theme-text-l;
      }
      .qr-code{
        margin-left: 50%;
        transform: translate(-50%);
      }

    }
    .details-bottom{
      background:#fff;
      padding 10px 5%;
      .title{
        font-size:$font-size-medium-s;
        font-weight $font-weight-x
        color:#000;
        padding 5px 0px;
      }
      .user{
        color:#7b8467;
        span{
          font-size:$font-size-medium-s;
        }
      }
    }
  }
}
</style>
