/**Created by steven on 2018/4/25.*/

<template>
  <div class="ticketbot-freelist" v-if="data">
    <div class="freelist-bg">
      <div class="details-top">
        <div class="cells_con" v-for="(item, index) in items">
          <div class="lefttitle_con font-medium-l">{{item.title}}</div>
          <div class="subtitle_con font-medium single-line">{{item.info}}</div>
        </div>
      </div>
      <div class="code">
        <!--<p class="number">{{data.couNo}}</p>-->
        <div class="bar-code">
          <canvas id="barcode"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Indicator,Toast } from 'mint-ui'
  import JsBarcode from 'jsbarcode'
  import QRCode from 'qrcode'

  export default {
    name: "mine-elticket",
    components: {
      Indicator,
      Toast
    },
    data () {
      return {
        data:null,
        voucher:null,
        items: [],
      }
    },
    methods: {
      getListData:function () {
        this.$Loading.open()
        let url = 'app/json/coupon/getUsedDetail';
        let params1 = {
          phone:this.$store.state.login.phone,
          token:this.$store.state.login.token ? this.$store.state.login.token :'',
          voucher:this.voucher
        }
        console.log('已使用电子券参数:',params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        if(data.status == 0){
          _this.data = data.data;console.log('已使用电子券:',data);
          _this.initlistData();
          _this.$nextTick(function () {
            let barcode = document.getElementById('barcode');
            JsBarcode(barcode, data.data.coucode);
            let canvas = document.getElementById('canvas');
            QRCode.toCanvas(canvas,data.data.coucode, function (error) {
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
      initlistData: function () {
        this.items = [
          {title:'电子券号', info:this.data.coucode?this.data.coucode:'',type:1},
          {title:'面值金额', info:this.data.facevalue?this.data.facevalue:'',type:2},
          {title:'交易单号', info:this.data.tradeno?this.data.tradeno:'',type:4},
          {title:'交易站点', info:this.data.tradeorg?this.data.tradeorg:'',type:5},
          {title:'EPS流水号', info:this.data.epsno?this.data.epsno:'',type:6},
          {title:'交易时间', info:this.data.usedtime?this.data.usedtime:'',type:7},
        ];
      },
    },
    mounted(){

    },
    created () {
      this.voucher = this.$route.query.voucher;
//      this.initPageData();
      this.getListData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/regularfont.styl'

  .ticketbot-freelist {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    background-color $color-background-lll;
  /*overflow auto*/
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
    height: auto;
    /*border-bottom:1px solid #fff;*/
    .cells_con {
      background-color: white;
      width: 100%;
      height: 50px;
      /*.bottom_line {*/
        border-bottom: $color-line-gray-l = #ddd 0.5px solid;
      /*}*/
     .lefttitle_con {
       float: left;
       margin-left: 0%;
       /*width: 85px;*/
       line-height: 50px;
       text-align: left;
     }
     .subtitle_con {
       float: right;
       /*overflow hidden*/
       margin-right: 0%
       line-height: 50px;
       text-align: right;
     }
    }
  }
  .code{
    background:#fff;
    margin-top: 0;
    /*border-bottom:1px dashed $color-theme-text-l;*/
    padding:0px 0%;


  .bar-code{
    text-align:center;
    padding 10px 0%;
  canvas{
    display:block;
    width: 100%;
    height:80px;
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
    font-size:$font-size-medium-x;
    color:#000;
    padding 5px 0px;
  }
  .user{
    color:#7b8467;
  span{
    background:#d8e8bb;
    font-size:$font-size-medium-x;
  }
  }
  }
  }
  }
</style>
