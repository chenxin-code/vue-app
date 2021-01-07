<template>
  <div id="oilMoneys">
    <!-- 头部 -->
<!--    <mt-header title="查询结果">
      <mt-button icon="back" slot="left" @click="backEvent"></mt-button>
    </mt-header>-->
    <nav-top title="查询结果" @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="box">
        <p v-if="showArray == 0" class="datanull">暂无数据</p>
        <!--<div class="conter" v-for="(items,index) in arrayData" :key="index" v-if="arrayData.length>0">-->
        <div class="conter" v-if="showArray == 1">
          <div>
            <div class="box-title">
              <p><span>加油卡号：{{cardno}}</span></p>
              <p><span>加油卡类型：{{$route.query.cardTypeName}}</span></p>
              <p><span>{{indexss}}日期：{{beginTime}}至{{endTime}}</span></p>
            </div>
            <div class="boxList">
              <ul>
                <li v-for="item in arrayData">
                  <div>
                    <span class="line"></span>
                  </div>
                  <div>
                    <p>{{item.opetime}}</p>
                    <p>{{indexss}}金额：￥{{item.amount}}</p>
                    <p>{{indexss}}网点：{{item.nodetag}}</p>
                    <p>{{indexss}}油品：{{item.oilname}}</p>
                    <p>{{indexss}}油品升数：{{item.oilLiter}}</p>
                    <p>{{indexss}}充值方式类别: {{item.content}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import { formatDate } from './js/date.js';
  export default {
    filters: {
      zhuan(s){
        return formatDate(s,'yyyy-MM-dd')
      },
      jiami(dateStr) { //监听每月数据的一条数据
        let dateStrs = dateStr.substr(0, 4);
        let dateStrss = dateStr.substr(5, 2);
        let mydate = '';
        let nowdate = formatDate(new Date(), 'yyyy年MM月');
        if (dateStrs + '年' + dateStrss + '月' === nowdate) {
          mydate = '本月';
        } else {
          mydate = dateStrs + '年' + dateStrss + '月';
        }
        return mydate;
      },
      total(items) {
        let totals = 0
        items.map((item, index) => {
          totals = item.amount + totals
        })
        return totals
      }
    },
    data() {
      return {
        indexss: this.$route.query.key == 1 ? '充值' : '消费',
        // list:'',
        arr: [0],
        parameter: this.$route.query,
        arrayData: [],
        currentTime: '',
        cardno: '',
        cardType: '',
        beginTime: '',
        endTime: '',
        showArray: -1,
        cardTypeTxt: {
          '01': '单位单用户',
          '02': '单位多用户',
          '03': '个人单用户',
          '04': '个人多用户'
        }
      }
    },
    created() {
      this.render()
    },
    methods: {
      backEvent: function () {
        // this.$router.push('/addCard')
        this.$router.go(-1)
      },
      render() {
        console.log(this.$route.query.key)
        if (Number(this.$route.query.key) === 2) {
          console.log('=2')
          this.$Loading.open();
          let _this = this;
          let url = '/app/json/card/getCardConsumeRecList';

          this.$http.post(url, {
            cardno: this.parameter.cardno,
            beginTime: this.parameter.beginTime,
            endTime: this.parameter.endTime,
            consumetype: this.parameter.consumetype,
          }).then(
            res => {
              _this.$Loading.close();
              let cardLen = res.data.data.cardRcdDetailList.length
              console.log(cardLen);
              if (res.data && res.data.data && cardLen) {
                _this.showArray = 1
                _this.currentTime = res.data.currentTime
                let list = res.data.data.cardRcdDetailList;
                list.sort((a, b) => (new Date(b.opetime.replace(/-/g,'/'))).getTime() - (new Date(a.opetime.replace(/-/g,'/'))).getTime())
                _this.arrayData = list
                _this.cardno = res.data.data.cardno
                let cardTypes = res.data.data.cardType
                _this.cardType = this.cardTypeTxt[cardTypes]
                // if (cardTypes === '01' || cardTypes === '02') {
                //   _this.cardType= '集团用户卡'
                // } else if (cardTypes === '03' || cardTypes === '04' || cardTypes === '07') {
                //   _this.cardType= '个人单用户卡'
                // }
                _this.beginTime = _this.FormatToDate(this.parameter.beginTime)
                _this.endTime = _this.FormatToDate(this.parameter.endTime)
              } else {
                _this.showArray = 0
              }

            })
        } else if(Number(this.$route.query.key) === 1){
          console.log('!=2')
          // this.$nextTick(function(){
          this.$Loading.open();
          let _this = this;
          let url = '/app/json/card/getCardRechargeRecList';

          this.$http.post(url, {
            cardno: this.parameter.cardno,
            beginTime: this.parameter.beginTime,
            endTime: this.parameter.endTime,
          }).then(
            res => {
              _this.$Loading.close();
              if (res.data && res.data.data && res.data.data.cardRechargeList.length) {
                _this.showArray = 1
                _this.currentTime = res.data.currentTime
                let list = res.data.data.cardRechargeList;
                list.sort((a, b) => (new Date(b.opetime.replace(/-/g,'/'))).getTime() - (new Date(a.opetime.replace(/-/g,'/'))).getTime())
                _this.arrayData = list
                _this.cardno = res.data.data.cardno
                let cardTypes = res.data.data.cardType
                _this.cardType = this.cardTypeTxt[cardTypes]
                // if (cardTypes === '01' || cardTypes === '02') {
                //   _this.cardType= '集团用户卡'
                // } else if (cardTypes === '03' || cardTypes === '04' || cardTypes === '07') {
                //   _this.cardType= '个人单用户卡'
                // }
                _this.beginTime = _this.FormatToDate(this.parameter.beginTime)
                _this.endTime = _this.FormatToDate(this.parameter.endTime)
              } else {
                _this.showArray = 0
              }

              // let dataList = res.data.data;
              // console.log(dataList)
              // this.arr = dataList
              // console.log('旧arr', this.arr)
              // // let arr=[]
              // if (dataList !== [] | dataList !== '') {
              //   // 此处因后台返回字段错误，现为json字符串，需转换成对象格式 (开始)
              //
              //   dataList.map((item, idx) => {
              //     this.arr[idx] = []
              //     item.map((item1, ins) => {
              //       this.arr[idx][ins] = JSON.parse(item1);
              //     })
              //   })
              //   console.log('arr', this.arr)
              //   // 此处因后台返回字段错误，现在为json字符串，需转换成对象格式 (结束)
              // }
            })
          // })

        }
      },
      FormatToDate: function (val) {
        return (val || "").toString().replace(/(\d{4})[-/]?(\d{2})[-/]?(\d{2}).*?$/g, "$1-$2-$3");
      }
  }
  }
</script>

<style scoped>
  .mint-header {
    margin-top: 0.693333rem;
  }

  .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;

  }

  .mintui-back {
    font-size: 28px;
  }

  #oilMoneys {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #efefef;
  }

  .conter {
    /*padding: 10px 10px;*/
  }

  .fl-right {
    float: right;
  }

  .total {
    padding: 0 10px;
  }

  .total p {
    line-height: 50px;
    font-size: 16px;
    color: #666;
    font-weight: 600;
  }
</style>
<style lang="stylus" scoped type="text/stylus">
  .goaddcard {
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 16px;
  }

  .goaddcard div {
    flex: 4;
  }

  .goaddcard div p:nth-of-type(1) {
    color: #333;
  }

  .goaddcard div p:nth-of-type(2) {
    margin-top: 5px;
    color: #999;
  }

  .goaddcard p {
    flex: 1;
  }

  .list-right {
    display: flex;
    /* text-align: center; */
    color: #f02c2d;
    line-height: 43px;
    position: relative;

  }

  .list-right img {
    margin-top: 6px;
  }

  .datanull {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  /*改*/
  .box {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }

  .box-title {
    background: white;
    border-bottom: 1px solid #efefef;
  }

  .box-title p {
    height: 40px;
    line-height: 40px;
    color: #8f8f8f;
    font-size: 15px;
    border-top: 1px solid #efefef;
  }

  .box-title p span {
    padding-left: 10px;
  }

  .boxList div:nth-child(2){
    margin-left: 10px;
  }
  .boxList li {
    /*height: 120px;*/
    height 120px;
    padding: 0 10px;
    /*padding: 10px 20px;*/
    display: flex;
    justify-content: start;
  }
  .boxList {
    padding: 30px 0;
  }
  .boxList li img {
    /*width: 30px;*/
    height: 30px;
  }
  .boxList li .line {
    display: block;
    background: #e9e9e9;
    width: 1px;
    height: 100%;
    margin-left:10px;
    position: relative
    margin-top:5px;
    &:after{
      content ''
      position: absolute
      top: 0;
      left: 50%;
      transform translateX(-50%)
      z-index 1
      width 8px;
      height 8px;
      background: #e9e9e9
      border-radius 50%
    }
  }
  .boxList div:nth-child(2) p{
    height: 20px;
    line-height: 20px;
    color: #8f8f8f;
    font-size: 12px;
  }
  .boxList div:nth-child(2) p:nth-child(1) {
    color: #ee8505;
    font-size: 15px;
    font-weight: bold;
  }
</style>
<style>
  #oilMoneys .mintui-back {
    font-size: 28px;
  }

  #oilMoneys .mint-header {
    margin-top: 0.693333rem;
  }

  #oilMoneys .mint-header {
    background: #efefef;
    color: #000;
    height: 60px;
    font-size: 20px;
  }
</style>
