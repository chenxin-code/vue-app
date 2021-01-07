<template>
  <div id="oilMoneyss">
    <!-- 头部 -->
    <mt-header title="加油卡充值">
      <mt-button icon="back" slot="left" @click="backEvent"></mt-button>
    </mt-header>
    <div v-if="pageShow" class="conter">
      <div class="chongtop ">
        <!--<p>个人卡(主) <span class="fl-right" @click="replace">更换&nbsp;&nbsp;</span></p>-->
        <p>个人卡(主)</p>
        <p>卡号 <span class="fl-right">{{cardnumber}}&nbsp;&nbsp;</span></p>
        <p>联系电话 <span class="fl-right">{{cardphone}}&nbsp;&nbsp;</span></p>
      </div>
      <div class="chongbottom">
        <p class="zhiftext">支付方式</p>
        <ul class="mode">
          <li :class="{bordercolor:indexs===index}" v-for="(item,index) in zhilist" :key="index"
              @click="tableqie(index,item)">{{item.text}}
          </li>
        </ul>
        <p class="chongmode">您选择了{{zhifufang}}<br>请点击确定充值</p>
      </div>
      <p @click="renders" class="btn">确定充值</p>
    </div>
    <!-- 选择卡号模态框 -->
    <div class="modal" v-if="pageShow && isshowcard">
      <div class="modal-boxs">
        <router-link to="/addCard">
          <p>请选择充值卡号</p>
        </router-link>
        <ul>
          <li v-for="(item, index) in list " :key="index" @click="choice(item.cardno,index)">{{item.cardno}} <span
            class="fl-right">选择</span> &nbsp;&nbsp;
          </li>
        </ul>
      </div>
    </div>
    <!-- 确定支付模态框 -->
    <div class="modal" v-if="pageShow && isshowcards">
      <div class="modal-boxs">
        <p>主卡卡号&nbsp;&nbsp;&nbsp;&nbsp; {{cardnumber}}</p>
        <p>用户姓名&nbsp;&nbsp;&nbsp;&nbsp;{{cardname}}</p>
        <p>手机号码&nbsp;&nbsp;&nbsp;&nbsp; {{cardphone}}</p>
        <p>支付方式&nbsp;&nbsp;&nbsp;&nbsp; {{zhifufang}}</p>
        <div><span @click="renders">取消</span><span class="fl-right" @click="confirmpayment">确定</span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import logCenter from '@/utils/logCenter'

  export default {
    data() {
      return {
        list: '',
        cardnumber: '', //this.$route.query.usercard,
        cardphone: '',
        cardname: '',
        pageShow: false,
        isshowcard: false,
        isshowcards: false,
        zhifufang: '',
        bordercolor: 'bordercolor',
        indexs: 0,
        zhilist: '',
        zhifudizhi: '',
        // findex:this.$route.query.mindex
      }
    },
    created() {
      this.render();
      //  console.log(this.$route.query)
      // this.rendermode();
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      // 选择卡号弹框显示于隐藏
      replace() {
        this.isshowcard = !this.isshowcard
      },
      // 选择卡号弹框显示于隐藏并传参
      choice(cardid, index) {
        this.isshowcard = !this.isshowcard
        console.log(cardid, index)
        this.cardnumber = this.list[index].cardno
        this.cardphone = this.list[index].reservedphone
        this.cardname = this.list[index].cardholder
      },
      //模态框显示隐藏
      renders() {
        this.isshowcards = !this.isshowcards
      },
      // 切换支付方式
      tableqie(index, item) {

        this.indexs = index;
        this.zhifufang = item.text
        // this.rendermode2();
        // this.zhifudizhi=this.zhilist[index].href
        console.log(this.zhifudizhi)
      },
      render() {
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getCardInfoList';
        this.$http.post(url, {}).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            let data = res.data;
            if (data.status == 0) {
              if (data.data.cardAcctList && data.data.cardAcctList.length > 0) {
                _this.list = res.data.data.cardAcctList;
                _this.cardnumber = res.data.data.cardAcctList[0].cardno; // 卡号
                _this.cardphone = res.data.data.cardAcctList[0].reservedphone;  // 手机号
                _this.cardname = res.data.data.cardAcctList[0].cardholder;  // 姓名
                // console.log(_this.list)
                this.rendermode();
                this.pageShow = true;
              } else {
                this.$router.replace({
                  path: '/refuelingCard',
                  query: {
                    inway: 'replace',
                    lastPath: '/rechargeer'
                  }
                })
                // this.$Toast('没有发现您绑定的加油卡!')
              }
            }
          })
      },
      // 渲染充值方式
      rendermode() {
        console.log(this.cardnumber)
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getAppPayTextList';

        this.$http.post(url, {
          cardno: this.cardnumber,
        }).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            console.log(res.data.data);
            this.zhilist = res.data.data;
            this.zhifufang = res.data.data[0].text; //默认充值方式
            this.zhifudizhi = res.data.data[0].href; //默认充值地址
          })
      },
      rendermode2() {
        console.log(this.indexs)
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getAppPayTextList';

        this.$http.post(url, {
          cardno: this.cardnumber,
        }).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            console.log(res.data.data);
            this.zhilist = res.data.data;
            // this.zhifufang=res.data.data[0].text; //默认充值方式
            this.zhifudizhi = res.data.data[this.indexs].href;
            console.log(this.indexs, this.zhifufang, this.zhifudizhi);
            // window.location.href=this.zhifudizhi
            let logBody = '跳转到银联支付 路径：' + this.zhifudizhi + '<br/>';
            logCenter.addLog(logBody)
            this.$bridgefunc.customPush({
              path: this.zhifudizhi,
              isnativetop: '1',
              superback: 1
            })
          })
      },
      // 确认支付
      confirmpayment() {
        this.rendermode2();
      }
    }
  }
</script>

<style scoped>
  #oilMoneyss {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .conter {
    padding: 10px 10px;
  }

  .fl-right {
    float: right;
  }

  .chongtop {
    box-shadow: 0 2.5px 5px #eee;
    line-height: 30px;
    padding: 10px 10px;
    border-radius: 6px;
  }

  .chongtop p {
    border-bottom: 1px solid #e5e5e5;
    padding: 6px 0px;
    color: #333;
  }

  .chongtop p span {
    color: #666;
  }

  .chongtop p:nth-child(1) span {
    color: #005aac;
    padding: 4px;
  }

  .modal {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .6)
  }

  .modal-boxs {
    width: 90%;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    padding-top: 30px;
    color: #333;
    border-radius: 10px;
    padding: 10px 30px;
  }

  .modal-boxs p {
    line-height: 30px;
  }

  .modal-boxs div {
    display: flex;
    margin: 5px;
  }

  .modal-boxs div span {
    flex: 1;
    margin: 0 10px;
    text-align: center;
    border: 1px solid #e5e5e5;
    line-height: 34px;
    border-radius: 5px;
  }

  .modal-boxs ul li {
    line-height: 25px;
    padding: 5px;
    border-bottom: 1px solid #e5e5e5;
  }

  .modal-boxs ul li span {
    color: #005aac;
  }

  /* 支付方式 */
  .chongbottom {
    margin-top: 20px;
  }

  .zhiftext {
    font-size: 15px;
    line-height: 30px;
  }

  .mode {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    padding: 10px 0px;
  }

  .bordercolor {
    border: 1px solid rgb(240, 44, 44) !important;
  }

  .mode li {
    flex: 1;
    line-height: 20px;
    padding: 10px 5px;
    margin: 0 5px;
    border: 1px solid #e5e5e5;
    text-align: center;
    border-radius: 8px;
  }

  .chongmode {
    padding: 30px 10px;
    text-align: center;
    line-height: 20px;
    color: rgb(240, 44, 44);
    box-shadow: 0 2.5px 5px #eee;
    margin-top: 5px;
  }

  .btn {
    padding: 10px 0px;
    text-align: center;
    line-height: 20px;
    border-radius: 1rem;
    -webkit-box-shadow: 0 0.08rem 0.106667rem pink;
    box-shadow: 0 0.08rem 0.106667rem pink;
    background: rgb(240, 44, 44);
    color: #fff;
    margin-top: 25px;
  }
</style>
<style>
  #oilMoneyss .mintui-back {
    font-size: 28px;
  }

  #oilMoneyss .mint-header {
    margin-top: 0.693333rem;
  }

  #oilMoneyss .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
  }
</style>
