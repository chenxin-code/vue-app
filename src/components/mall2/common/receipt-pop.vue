<template>
  <div class="receipt mall2">
    <div class="title">
      <div class="bigtitle">发票</div>
      <div class="tiptitle theme_font_gray">发票须知</div>
    </div>
    <div class="scorll-content" >
      <div class="padding-con">
        <div class="subtitle ">发票内容</div>
        <div class="type-name theme_bg_white_ef subtitle theme_font_gray"
             v-for="(type,idx) in receipttype"
             :class="{'border-con  theme_font_red theme_bg_light_red':selectedreceip==idx}" @click="chooseReceiptType(idx)">{{type.title}}</div>
        <div class="theme_font_gray subtitle margin-con ">{{selectedreceip==0?'发票内容将显示详细商品名称与价格':'我司依法开具发票，请您按照税法规定使用发票'}}</div>
      </div>
      <div class="padding-con" v-if="selectedreceip==0">
        <div class="subtitle ">发票抬头</div>
        <div class="type-name theme_bg_white_ef subtitle theme_font_gray"
             v-for="(head,index) in headtype" style="width: 100px"
             :class="{'border-con  theme_font_red theme_bg_light_red':selectedhead==index}" @click="chooseHeadType(index)">{{head.title}}</div>
        <div class="input-con" v-if="selectedhead==1">
          <div class="input-cell">
            <input class="input-info theme_bg_white_ef subtitle" type="number" placeholder="请填写单位名称" v-model="company"/>
          </div>
          <div class="input-cell">
            <input class="input-info theme_bg_white_ef subtitle" type="number" placeholder="请在此填写纳税人识别号" v-model="identifyNumber"/>
          </div>
        </div>
      </div>
      <div class="padding-con" v-if="selectedreceip==1">
        <div class="subtitle ">增票资质</div>
        <div class="checktaker" v-for="subtext in content">
          <p class="left-info content-font theme_font_common">{{subtext.title}}</p>
          <div class="right-con">{{subtext.value}}</div>
        </div>
      </div>
      <div class="padding-con">
        <div class="subtitle">收票人信息</div>
        <div class="checktaker" v-if="selectedreceip==1">
          <p class="left-info content-font theme_font_common">收票人姓名:</p>
          <input  type="text" placeholder="必填" v-model="name"/>
        </div>
        <div class="checktaker">
          <p class="left-info content-font theme_font_common">收票人手机:</p>
          <input  type="text" placeholder="必填" v-model="phone"/>
        </div>
        <div class="checktaker" v-if="selectedreceip==1" @click="selectRegion">
          <p class="left-info content-font theme_font_common">所在地区:</p>
          <input disabled="disabled" type="text" placeholder="请选择地区" v-model="region"/>
          <i class="iconfont mall-gengduo theme_font_common"></i>
        </div>
        <div class="checktaker" v-if="selectedreceip==1">
          <p class="left-info content-font theme_font_common">详细地址:</p>
          <input  type="text" placeholder="请填写详细地址" v-model="address"/>
        </div>
        <div class="checktaker" v-if="selectedreceip==0">
          <p class="left-info content-font theme_font_common">收票人邮箱:</p>
          <input  type="text" placeholder="用来接收电子发票邮箱，可选填" v-model="email"/>
        </div>
      </div>
      <div class="padding-con" v-if="selectedreceip==0">
        <div class="subtitle">发票内容<span class="tip-con theme_font_gray">发票内容选填已根据税法调整，具体以展示为准</span></div>
        <div class="type-name theme_bg_white_ef subtitle theme_font_gray"
             v-for="(goods,ind) in goodsType"
             :class="{'border-con  theme_font_red theme_bg_light_red':selectedGoodsType==ind}" @click="choosegoodsType(ind)">{{goods.title}}</div>
        <div class="theme_font_gray subtitle margin-con ">发票内容将显示详细商品名称与价格</div>
      </div>
    </div>
    <div class="bottom-btn theme_bg_red" @click="sureEvent">
      <p class="">确定</p>
    </div>
  </div>
</template>

<script>
  import {Field} from 'mint-ui';
  export default {
    name: 'receipt',
    components: {},
    data() {
      return {
        selectedreceip:0,
        receipttype: [
          {
            title: '电子普通发票',
            selected: true,
            tag: ''
          },
          {
            title: '增值税专用发票',
            selected: false,
            tag: ''
          },
        ],
        headtype:[
          {
          title: '个人',
          selected: true,
          tag: ''
        },
          {
            title: '单位',
            selected: false,
            tag: ''
          },],
        selectedhead:0,
        goodsType:[
          {
          title: '商品明细',
          selected: true,
          tag: ''
        },
          {
            title: '商品类别',
            selected: false,
            tag: ''
          },],
        selectedGoodsType:0,
        company:'',
        identifyNumber:'',
        name:'',
        phone:'15276354667',
        email:'',
        region:'',
        address:'',
        content:[
          {
            title:'单位名称:',
            value:'北京市庆丰包子',
          },{
            title:'纳税人编号:',
            value:'765345678',
          },{
            title:'注册地址:',
            value:'北京市昌平区北七家镇',
          },{
            title:'注册电话:',
            value:'9785645',
          },{
            title:'开户银行:',
            value:'建设银行',
          },{
            title:'银行账号:',
            value:'2345675234567',
          },
        ],

      }
    },
    methods: {
      chooseReceiptType: function (idx) {
        this.selectedreceip = idx
      },
      chooseHeadType:function(idx){
       this.selectedhead = idx
      },
      choosegoodsType:function(idx){
        this.selectedGoodsType = idx
      },
      sureEvent:function () {//确定

      },
      selectRegion:function () {//选择地区

      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .receipt{
    width 100%
    height 420px
    overflow hidden
    .title{
      display flex
      padding 15px 34px 15px 10px
      .bigtitle{
        flex 1
        font-size $font-size-medium-x
      }
      .tiptitle{
        font-size $font-size-small-s
      }
    }

    .scorll-content{
      position absolute
      top 50px;
      right 0px;
      left 0px;
      bottom 50px;
      padding 0px 10px 10px 10px
      overflow-y scroll
      -webkit-overflow-scrolling touch
      .type-name {
        text-align center
        display inline-block
        padding 8px 10px
        margin-top 10px
        margin-right 10px
        /*margin-bottom 20px*/
        border-radius: 15px;
        -webkit-border-radius: 15px;
        font-size $font-size-medium
      }
      .border-con {
        border: 1px solid #F80F16
      }
      .input-con{
        .input-cell{
          display flex
          align-items center
          height 40px
          width 100%
          padding 5px 0px
          /*background-color magenta*/
          .input-info{
            height 100%
            width 100%
            padding-left 8px
            border-radius:15px;
            -webkit-border-radius:15px;
            font-size font-size $font-size-medium-s
          }
        }

      }

      .checktaker{
        display flex
        align-items center
        margin-top 10px
        .left-info{
          font-size $font-size-small-s
        }
        input{
          flex 1
          margin-left 15px
        }
        .right-con{
          flex 1
          margin-left 15px
        }
        i{
          font-size $font-size-medium
        }

      }
      .tip-con{
        margin-left 15px
        font-size $font-size-small
      }
    }
    .bottom-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      display flex
      align-items center
      text-align: center;
      p {
        width 100%
        color: white;
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }
    .padding-con{
      padding 10px 0px
    }
    .subtitle{
      font-size $font-size-medium-s
    }
    .margin-con {
      margin-top 10px
    }



  }

</style>
