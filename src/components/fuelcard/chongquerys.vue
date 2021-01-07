<template>
  <div id="chongquerys">
    <!-- 头部 -->
    <mt-header :title="title+'查询'">
      <mt-button icon="back" @click="backEvent" slot="left"></mt-button>
    </mt-header>
    <!-- Tips -->
    <!-- <div class="tips" v-if="!$store.state.globalConfig.oilCardQueryTip">
      <p><img class="img" src="static/image/fuelcard/icon_remind.png" alt="">
        <span class="msg">加油卡{{title}}记录查询:当日加油{{title}}记录可在48小时后查询</span>
      </p>
    </div> -->
    <div class="conter">
      <p class="goaddcard jiayoyka">加油卡卡号 <span class="fl-right">{{this.$route.query.cardno}}</span></p>
      <br><br>
      <div class="goaddcard chriqi">
        <p class="" @click="openPicker">{{title}}日期</p>
        <!-- 日期选择 -->
        <ul class="mydate">
          <li @click="openPicker">
            <p class=""><span>{{startDate |zhuan}}</span></p>&nbsp;&nbsp;&nbsp;
            <img src="static/image/fuelcard/bnt_drop-down.png" alt="" width="24px">
          </li>
          <p class="zhi">至</p>
          <li @click="openPickers">
            <p class=""><span>{{endDate | zhuan}}</span></p>&nbsp;&nbsp;&nbsp;
            <img src="static/image/fuelcard/bnt_drop-down.png" alt="" width="24px">
          </li>
        </ul>
        <!-- 选择消费类型 -->
        <!--<div class="chongbottom" v-if="this.$route.query.key===1?false:true">
          <p class="zhiftext">消费类型</p>
          <ul class="mode">
            <li :class="{bordercolor:indexs===index}" v-for="(item,index) in xiaolist" :key="index" @click="tableqie(index)">{{item}}</li>
          </ul>
        </div>-->
      </div>
      <!-- <p class="tipSpecial" v-if="$store.state.globalConfig.oilCardQueryTip">温馨提示：{{$store.state.globalConfig.oilCardQueryTip}}</p> -->
      <p class="tipSpecial" >温馨提示：</p>
      <p class="tipSpecial" v-html="tipsData"></p>

      <p class="btn" @click="chaxun">查询</p>
    </div>
    <mt-datetime-picker ref="picker" :startDate="limitDate" :endDate="endDate" type="date" @confirm="startDateConfirm" v-model="startDate"></mt-datetime-picker>
    <mt-datetime-picker ref="picker2" :startDate="startDate" type="date" @confirm="endDateConfirm" v-model="endDate"></mt-datetime-picker>
  </div>
</template>
<script>
  import {formatDate} from './js/date.js';
  import {Toast} from 'mint-ui';

  let date = new Date()
  let year = date.getFullYear() - 30
  date.setFullYear(year)
  export default {
    filters: {
      zhuan(s) {
        return formatDate(s, 'yyyy-MM-dd')
      }
    },
    data() {
      return {
        title: Number(this.$route.query.key) === 1 ? '充值' : '消费',
        startDate: new Date, //初始起日期
        endDate: new Date, // 结束日期
        limitDate: date,
        xiaolist: ['消费', '圈存'],
        indexs: 0,
        consumetype: '01',
        tipsData: ''
      }
    },
    created() {
      this.title = this.$route.query.key == 1 ? '充值' : '消费'
      const limitDate = this.$store.state.globalConfig.oilCardQueryLimitDate || ''
      if (limitDate) {
        let date = new Date()
        let m = date.getMonth() - limitDate + 1
        date.setMonth(m)
        this.limitDate = date
      }
    },
    computed: {

    },
    mounted(){
      this.getTipsData()
    },
    methods: {
      getTipsData() {
        this.$request.post('/app/json/news/getNewsList', {
          values: 33
        }).then(res => {
          if (res.status === 0) {
            this.tipsData = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info)
          }
        })
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      openPicker() {
        this.$refs.picker.open();
      },
      openPickers() {
        this.$refs.picker2.open();
      },
      //转换时分秒
      startDateConfirm() {
        // console.log(formatDate(this.startDate,'yyyy-MM-dd'))
      },
      endDateConfirm() {
        // console.log(formatDate(this.endDate,'yyyy-MM-dd'))
      },
      chaxun() {
        // console.log(formatDate(this.startDate,'yyyy-MM-dd'),'开始')
        // console.log(formatDate(this.endDate,'yyyy-MM-dd'))
        // let url=  this.$route.query.key===1?'/app/json/card/getCardRechargeRecList':'/app/json/card/getCardConsumeRecList'
        this.$router.push({
          path: '/queryers',
          query: {
            cardno: this.$route.query.cardno,
            beginTime: formatDate(this.startDate, 'yyyyMMdd'),
            endTime: formatDate(this.endDate, 'yyyyMMdd'),
            consumetype: this.consumetype,
            key: this.$route.query.key,
            cardTypeName: this.$route.query.cardTypeName
          }
        })
        console.log(this.consumetype);
      },
      // 切换消费方式
      tableqie(index, item) {
        this.indexs = index; //切换样式
        index === 0 ? this.consumetype : this.consumetype = '02' //切换状态码
      },
    }
  }
</script>

<style scoped>
  .mint-header {
    margin-top: 0.693333rem;
  }

  #chongquerys {

    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
  }
  .tipSpecial {
    color: rgb(240, 44, 44);
    margin-top: 20px;
    padding: 10px 8px;
    padding-bottom: 0;
    line-height: 20px;
    font-size: 14px;
  }
  .mintui-back {
    font-size: 28px;
  }

  .conter {
    padding: 0 10px;
  }

  .tips {
    background: #fbf8d9;
    color: #e1782e;
    padding: 5px;
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
  }

  .tips img {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }

  .tips span {
    display: inline-block;
    font-size: 12px;
    vertical-align: middle;
    padding-left: 6px;
  }

  .jiayoyka {
    line-height: 30px;
    padding: 8px 10px;
    color: #666;
    font-size: 15px;
    box-shadow: 0 2.5px 5px #eee;
    border-radius: 6px;
  }

  .jiayoyka span {
    color: #333;
  }

  .chriqi {
    padding: 10px 8px;
    font-size: 16px;
    line-height: 24px;
    box-shadow: 0 2.5px 5px #eee;
    border-radius: 6px;
    /* margin-bottom: 46px; */
  }

  .mint-button--danger {
    border-radius: 1rem;
    box-shadow: 0px 3px 4px pink;
    background: rgb(240, 44, 44);
    font-weight: 700;
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
    margin-top: 15px;
  }

  .mydate {
    display: flex;
  }

  .mydate li {
    flex: 1;
    display: flex;
    border: 1px solid #ccc;
    margin: 8px;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
  }

  .mydate li p {
    line-height: 30px;
    font-size: 16px;
    color: #333;
  }

  .zhi {
    /* line-height: 100%;
    height: 100%; */
    align-items: center;
    padding: 0.133333rem 0;
    display: flex;
  }

  /* 支付方式 */
  #chongquerys .chongbottom {
    margin-top: 20px;
  }

  #chongquerys .zhiftext {
    font-size: 15px;
    line-height: 30px;
  }

  #chongquerys .mode {
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

  #chongquerys .mode li {
    flex: 1;
    line-height: 20px;
    padding: 10px 5px;
    margin: 0 5px;
    border: 1px solid #e5e5e5;
    text-align: center;
    border-radius: 8px;
  }
</style>
<style>
  #chongquerys .mintui-back {
    font-size: 28px;
  }

  #chongquerys .mintui-back {
    font-size: 28px;
  }

  #chongquerys .mint-header {
    margin-top: 0.693333rem;
  }

  #chongquerys .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
  }

  #chongquerys .mintui-back {
    font-size: 28px;
  }

  #chongquerys .mint-field-core {
    font-size: 13px;
  }
</style>
