
<template>
  <div class="electronicBilling">
    <van-swipe style="height: 100%;" vertical :show-indicators='false' :loop='false'>
      <van-swipe-item>
        <div class="one">
          <div class="information">
            <div class="information-top">
              <span class="information-top-img"><img :src="wxUserData.headimgurl" alt=""></span>
              <span class="information-top-name">{{wxUserData.nickname}}</span>
              <span>{{phone(wxUserData.phone || '')}}</span>
            </div>
          </div>
          <div class="exhibition">
            <p>本年度油滴账户累计加油</p>
            <div class="exhibition-top">
              <div class="exhibition-top-box">
                <span class="exhibition-top-img"><img src="./image/加油次数.png" alt=""></span>
                <span class="exhibition-top-name"><i>{{parseInt(youdiReportData.refuelCount || 0)}}</i> 笔</span>
                <span>加油次数</span>
              </div>
              <div class="exhibition-top-box">
                <span class="exhibition-top-img"><img src="./image/加油升数.png" alt=""></span>
                <span class="exhibition-top-name"><i>{{parseInt(youdiReportData.oilLiter || 0)}}</i> 升</span>
                <span>加油升数</span>
              </div>
              <div class="exhibition-top-box">
                <span class="exhibition-top-img"><img src="./image/加油金额.png" alt=""></span>
                <span class="exhibition-top-name"><i>{{parseInt(youdiReportData.amount || 0)}}</i> 元</span>
                <span>加油金额</span>
              </div>
            </div>
            <hr size=1 style="color: #dfe0df;border-style:dashed ;width:100%">
            <div class="exhibition-middle">
              <span>超越 <i>{{parseInt(((Number(this.youdiReportData.refuelTotal || 0) - Number(this.youdiReportData.refuelId || 0)) / Number(this.youdiReportData.refuelTotal || 1))*100)}}</i> %的用户</span>
              <span>荣获称号 <em>{{refuelTotalText((((Number(this.youdiReportData.refuelTotal || 0) - Number(this.youdiReportData.refuelId || 0)) / Number(this.youdiReportData.refuelTotal || 1)))*100)}}</em> </span>
            </div>
            <hr size=1 style="color: #dfe0df;border-style:dashed ;width:100%">
            <div class="exhibition-lower">
              <div class="lowerChart">
                <div id="chartId" style="width:100%;height:100%;margin: 0 auto;"/>
              </div>
              <div class="lowerText">
                <div class="lower-left wx">
                  <div>
                    <span class="dian"></span>
                    <span>微&nbsp;&nbsp;&nbsp;信</span>
                  </div>
                  <span><i>{{parseInt(youdiReportData.wxAmount || 0)}}</i> 元</span>
                </div>
                <div class="lower-left jyk">
                  <div>
                    <span class="dian"></span>
                    <span>加油卡</span>
                  </div>
                  <span> <i>{{parseInt(youdiReportData.cardAmount || 0)}}</i> 元</span>
                </div>
                <div class="lower-left xj">
                  <div>
                    <span class="dian"></span>
                    <span>现&nbsp;&nbsp;&nbsp;金</span>
                  </div>
                  <span> <i>{{parseInt(youdiReportData.codeAmount || 0)}}</i> 元</span>
                </div>
              </div>
            </div>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="two">
          <div class="time-box">
            <hr size=1 class="line">
            <span>您最早的一次加油</span>
            <span>{{youdiReportData.minTimeDay || `0000-00-00`}}</span>
            <span v-if="youdiReportData.minTimeMinute && youdiReportData.minTimeMinute[0]">
              <i v-for="(item,index) in youdiReportData.minTimeMinute" :key="index" :class="{'tite':item==':'}">{{item}}</i>
              <!-- <i class="tite">AM</i> -->
            </span>
            <span v-else>
              <i v-for="(item,index) in minTimeMinute" :key="index" :class="{'tite':item==':'}">{{item}}</i>
              <!-- <i class="tite">AM</i> -->
            </span>
            <span>天再早，总有人在你前进的道路上为你加油。</span>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="three">
          <div class="time-box">
            <hr size=1 class="line">
            <span>您最晚的一次加油</span>
            <span>{{youdiReportData.maxTimeDay || `0000-00-00`}}</span>
            <span v-if="youdiReportData.maxTimeMinute && youdiReportData.maxTimeMinute[0]">
              <i v-for="(item,index) in youdiReportData.maxTimeMinute" :key="index" :class="{'tite':item==':'}">{{item}}</i>
            </span>
            <span v-else>
              <i v-for="(item,index) in minTimeMinute" :key="index" :class="{'tite':item==':'}">{{item}}</i>
            </span>
            <span>无论多晚，总有一盏灯为你照亮回家的路。</span>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="four">
          <div class="gasStation">
            <p>本年度油滴账户累计加油</p>
            <div class="gasStation-list" v-for="(item,index) in youdiReportData.ouMapArr" :key="index">
              <div class="gasStation-list-item">
                <div class="item-left">
                  <span class="itemImg"><img src="./image/加油站图标.png" alt=""></span>
                  <span class="temtiter">{{item.ouName}}</span>
                </div>
                <span class="titer">{{item.ouNameNumber}} 次</span>
              </div>
              <div class="gasStation-list-progress">
                <van-progress :show-pivot='false' color="linear-gradient(to right, #53ebc4, #29e0e8)" :percentage="item.ouNameNumber"/>
              </div>
            </div>
            <div class="gasStation-list text">
              今年您在中国石化河北公司一共跑过&nbsp;<span>{{youdiReportData.ouNameMap.ouNameCount || 0}}</span>&nbsp;个加油站
            </div>
            <hr v-if="youdiReportData.oilMapArr.length" size=1 style="color: #dfe0df;border-style:dashed ;width:100%">
            <p class='titer' v-if="youdiReportData.oilMapArr.length">您常加的油品</p>
            <div class="gasStation-circle" v-if="youdiReportData.oilMapArr.length">
              <div class="circle-item" v-for="(item,index) in youdiReportData.oilMapArr" :key="index">
                <van-circle v-model="item.oilNameNumber" :rate="item.oilNameNumber" layer-color='#dfe0df' :color='item.color' :stroke-width="70"/>
                <p color='#ff5601'>{{item.oilName}}</p>
              </div>
            </div>
            <span class="text" v-if="youdiReportData.oilMapArr.length">
              感谢您对中国石化品牌的信赖，我们将为您提供高品质油品服务，与您一起为美好生活加油。
            </span>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="five">
          <div class="mapList">
            <div class="zjk">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('张家口')?'蓝色':'灰色'}/张家口.png`)" alt="">
            </div>
            <div class="bd">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('保定')?'蓝色':'灰色'}/保定.png`)" alt="">
            </div>
            <div class="cd">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('承德')?'蓝色':'灰色'}/承德.png`)" alt="">
            </div>
            <div class="ts">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('唐山')?'蓝色':'灰色'}/唐山.png`)" alt="">
            </div>
            <div class="qhd">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('秦皇岛')?'蓝色':'灰色'}/秦皇岛.png`)" alt="">
            </div>
            <div class="sjz">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('石家庄')?'蓝色':'灰色'}/石家庄.png`)" alt="">
            </div>
            <div class="xt">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('邢台')?'蓝色':'灰色'}/邢台.png`)" alt="">
            </div>
            <div class="hd">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('邯郸')?'蓝色':'灰色'}/邯郸.png`)" alt="">
            </div>
            <div class="hs">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('衡水')?'蓝色':'灰色'}/衡水.png`)" alt="">
            </div>
             <div class="cz">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('沧州')?'蓝色':'灰色'}/沧州.png`)" alt="">
            </div>
            <div class="lf">
              <img :src="require(`./image/${youdiReportData.cityMapArr.includes('廊坊')?'蓝色':'灰色'}/廊坊.png`)" alt="">
            </div>
          </div>
          <div class="mapListDaata">
            <p>本年度油滴账户累计加油</p>
            <div class='mapListDaata-top'>
              <span class="itemImg"><img src="./image/加油站图标.png" alt=""></span>
              <span class="temtiter">{{youdiReportData.cityMapArr.join(', ')}}</span>
            </div>
            <span class="text">我们见证了您一年来的奔波，向奋斗者致敬。美好生活是奋斗出来的，加油！</span>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="six">
          <div class="exhibition">
            <div class="exhibition-list">
              <p>本年度通用油滴</p>
              <div class="exhibition-box flex">
                <div class="box-top">
                  <div class="top-item">
                    <span class="item-img"><img src="./image/获取油滴次数.png" alt=""></span>
                    <span class="item-num"><i>{{youdiReportData.youdiCount || 0}}</i> 笔</span>
                    <span class="item-text">通用油滴</span>
                  </div>
                  <div class="top-item">
                    <span class="item-img"><img src="./image/油滴价值.png" alt=""></span>
                    <span class="item-num"><i>{{parseInt(youdiReportData.youdiAddAmount || 0)}}</i> 元</span>
                    <span class="item-text">油滴价值</span>
                  </div>
                  <div class="top-item">
                    <span class="item-img"><img src="./image/消费油滴.png" alt=""></span>
                    <span class="item-num"><i>{{parseInt(youdiReportData.youdiConsumeAmount || 0)}}</i> 元</span>
                    <span class="item-text">消费油滴</span>
                  </div>
                </div>
                <div class="box-bom">
                  <span>感谢您成为油滴会员，油滴为您省钱</span>
                  <span class="bfb">超越 <i>{{parseInt(((Number(this.youdiReportData.youdiTotal || 0) - Number(this.youdiReportData.youdiId || 0)) / Number(this.youdiReportData.youdiTotal || 1))*100)}}</i> % 用户 </span>
                </div> 
              </div>
            </div>
            <hr size=1 style="color: #dfe0df;border-style:dashed ;width:100%">
            <div class="exhibition-list">
              <p>本年度专用油滴</p>
              <div class="exhibition-box">
                <div class="box-top">
                  <div class="top-item">
                    <span class="item-img"><img src="./image/获取油滴次数.png" alt=""></span>
                    <span class="item-num"><i>{{youdiReportData.couponNum || 0}}</i> 笔</span>
                    <span class="item-text">专用油滴</span>
                  </div>
                  <div class="top-item">
                    <span class="item-img"><img src="./image/油滴价值.png" alt=""></span>
                    <span class="item-num"><i>{{parseInt(youdiReportData.couponFacevalue || 0)}}</i> 元</span>
                    <span class="item-text">油滴价值</span>
                  </div>
                  <div class="top-item">
                    <span class="item-img"><img src="./image/消费油滴01.png" alt=""></span>
                    <span class="item-num"><i>{{parseInt(youdiReportData.couponUseFacevalue || 0)}}</i> 元</span>
                    <span class="item-text">消费油滴</span>
                  </div>
                </div>
                <div class="box-bom">
                  <span>甄选易捷好货，油滴购物就是省钱！</span>
                </div> 
              </div>
            </div>
            <hr size=1 style="color: #dfe0df;border-style:dashed ;width:100%;">
            <div class="exhibition-list">
              <p>本年度加油卡充值</p>
              <div class="exhibition-box flex">
                <div class="box-top">
                  <div class="top-item">
                    <span class="item-img"><img src="./image/获取油滴次数.png" alt=""></span>
                    <span class="item-num"><i>{{youdiReportData.rechargeNumber || 0}}</i> 笔</span>
                    <span class="item-text">充值次数</span>
                  </div>
                  <div class="top-item">
                    <span class="item-img"><img src="./image/充值总金额.png" alt=""></span>
                    <span class="item-num"><i>{{parseInt(youdiReportData.rechargeAmount || 0)}}</i> 元</span>
                    <span class="item-text">充值总金额</span>
                  </div>
                </div>
                <div class="box-bom">
                  <span class="bom">获得游戏机会 <i>{{youdiReportData.gameNumber || 0}}</i> 次，抽奖获得油滴 <i>{{youdiReportData.gameYoudiAddAmount || 0}}</i></span>
                  <span>充值抽油滴活动，最高奖 3999 个油滴，等你抽！</span>
                </div> 
              </div>
            </div>
          </div>
          <div class="icon">
            <img src="./image/箭头.png" alt="">
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="seven">
          <div class="seven-img">
            <img src="./image/编组 24.png" alt="">
          </div>
          <div class="seven-QRcode" v-if="isShare">
            <div class="QRcode">
              <canvas class="qrcode" id="qrcode"></canvas>
            </div>
            <span>识别二维码，查看我的 ‘油滴账单‘</span>
          </div>
          <div class="seven-btn" @click="shareBtn" v-if="isShare">
            <span>查看我的年度账单</span>
          </div>
          <div class="seven-chupin"> 中国石化河北石油荣誉出品 </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="wx-show">
        <van-popup v-model="showWxTips">
          <div class="jt">
            <img src="./image/img3.png" alt="">
          </div>
          <div class="wx-tips-show">
            <div class="wx-tips-content">
              <div class="text1">1.点击右上角</div>
              <div class="text2">
                2.点击
                <span class="img"><img src="./image/img1.png" alt=""></span>
                发送给朋友
              </div>
            </div>
          </div>
        </van-popup>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import mixin from "./mixin";
import qrcode from "qrcode";
import Jwx from "../../utils/jwx"
import Config from '@/api/config'
import Cookie from 'js-cookie'
import store from '@/vuex/store'
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');
require('echarts/lib/component/legend');
  
export default {
  name: "electronicBilling",
  mixins: [mixin],
  components: {},
  data() {
    return {
      showWxTips: false,
      isShare: false,
      wxUserData: {},
      minTimeMinute:['00',':','00',':','00'],
      youdiReportData: {
        ouNameMap: {},
        cityMapArr: [],
        oilMapArr: [],
        ouMapArr: []
      }
    }
  },
  created(){
    this.isShare = this.$util.getUrlParam(window.location.href, "isShare") || false;
    if (this.isShare) {
      let token = this.$util.getUrlParam(window.location.href, "token") || '';
      Cookie.set('usertoken', token)
    }
  },
  mounted() {
    if (this.$store.state.webtype == 2) {
      const token = store.state.login.token
        Jwx.share(
        '中国石化河北2019年油滴账单',
        `${location.origin}${Config.shareUrl}/electronic_billing?token=${token}&logintoken=${token}&isShare=true`,
        '',
        '查看年度账单'
      )
    }
    this.$nextTick(() => {
      this.setMyChart(0,0,0)
      this.getQrcode()
      let dom = document.getElementById('qrcode')
      if (dom) {
        dom.style.width = '100%'
        dom.style.height = '100%'
      }
      this.getReportWxUser().then(res=>{
        this.wxUserData = Object.assign({},res)
        // if (res.nickname) {
        //   this.wxUserData = Object.assign({},res)
        // } else {
        //   this.$router.push({
        //     path: '/isFollow',
        //   })
        // }
      })
      this.getYoudiReportByUserId().then(res=>{
        this.youdiReportData = Object.assign({},this.youdiReportData,res)
        this.setMyChart(this.youdiReportData.wxAmount || 0,this.youdiReportData.cardAmount || 0,this.youdiReportData.codeAmount || 0)
        let ouMap = this.youdiReportData.ouNameMap
        let oilMap = this.youdiReportData.oilNameMap
        let cityMap = this.youdiReportData.cityNameMap
        for (const key in ouMap) {
          if (key.charAt(key.length - 1) == 0) {
            if (key == 'ouName0') {
              this.youdiReportData.ouMapArr.push({
                ouName: ouMap['ouName0'],
                ouNameNumber: Number(ouMap['ouNameNumber0']),
                ouNameCount: ouMap['ouNameCount']
              })
            }
          } else if (key.charAt(key.length - 1) == 1) {
            if (key == 'ouName1') {
              this.youdiReportData.ouMapArr.push({
                ouName: ouMap['ouName1'],
                ouNameNumber: Number(ouMap['ouNameNumber1']),
                ouNameCount: ouMap['ouNameCount']
              })
            }
          } else if (key.charAt(key.length - 1) == 2) {
            if (key == 'ouName2') {
              this.youdiReportData.ouMapArr.push({
                ouName: ouMap['ouName2'],
                ouNameNumber: Number(ouMap['ouNameNumber2']),
                ouNameCount: ouMap['ouNameCount']
              })
            }
          }
        }
        this.youdiReportData.ouMapArr = this.youdiReportData.ouMapArr.sort(this.compare('ouNameNumber'))
        for (const key in oilMap) {
          if (key.charAt(key.length - 1) == 0) {
            if (key == 'oilName0') {
              this.youdiReportData.oilMapArr.push({
                color: '#e93d45',
                oilName: oilMap['oilName0'],
                oilNameNumber: Number(oilMap['oilNameNumber0'])
              })
            }
          } else if (key.charAt(key.length - 1) == 1) {
            if (key == 'oilName1') {
              this.youdiReportData.oilMapArr.push({
                color: '#33b05c',
                oilName: oilMap['oilName1'],
                oilNameNumber: Number(oilMap['oilNameNumber1'])
              })
            }
          }
        }
        this.youdiReportData.oilMapArr = this.youdiReportData.oilMapArr.sort(this.compare('oilNameNumber'))
        for (const key in cityMap) {
          if (!key.includes('cityNameNumber')) {
            let str = cityMap[key]
            this.youdiReportData.cityMapArr.push(str.split('石油')[0])
          }
        }
        let minTimeArr = this.youdiReportData.minOpeTime.split(' ')
        let maxTimeArr = this.youdiReportData.maxOpeTime.split(' ')
        if(minTimeArr.length && maxTimeArr.length) {
          this.youdiReportData.minTimeDay = minTimeArr[0]
          let minTimeMinute = (minTimeArr[1] || '').split(':')
          minTimeMinute.splice(1,0,':')
          minTimeMinute.splice(3,0,':')
          this.youdiReportData.minTimeMinute = minTimeMinute
          this.youdiReportData.maxTimeDay = maxTimeArr[0]
          let maxTimeMinute = (maxTimeArr[1] || '').split(':')
          maxTimeMinute.splice(1,0,':')
          maxTimeMinute.splice(3,0,':')
          this.youdiReportData.maxTimeMinute = maxTimeMinute
        }
      })
    });
    this.$nextTick(res=>{
      let tagNameArr = document.getElementById('chartId').getElementsByTagName('*') // 获取父元素
      for (const key in tagNameArr) {
        tagNameArr[key].style.width = '100%'
        tagNameArr[key].style.height= '100%'
      }
    })
  },
  methods: {
    // 30%（含30%）小有名气
    // 大于30%小于等于50% ：  略有小成
    // 大于50%小于等于70% ： 富甲一方
    // 大于70%  ：  富可敌国
    refuelTotalText(refuelTotal) {
      let text = ''
      if (refuelTotal <= 30) {
        text = '小有名气'
      } else if (refuelTotal <= 50) {
         text = '略有小成'
      } else if (refuelTotal <= 70) {
        text = '富甲一方'
      } else if (70 < refuelTotal) {
        text = '富可敌国'
      }
      return text
    },
    compare(prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val2 < val1) {
          return -1;
        } else if (val2 > val1) {
          return 1;
        } else {
          return 0;
        }  
      } 
    },
    getQrcode() {
      let path = `${location.origin}${Config.shareUrl}/redirectEB`
      qrcode.toCanvas(document.getElementById("qrcode"),path,{ width: 200})
    },
    getReportWxUser() {
      return new Promise((resolve, reject) => {
        this.$request.post('/app/json/app_youdi_report_year/getReportWxUser').then(res => {
          if (res.status === 0) {
            resolve(res.data)
          } else {
            this.$Toast(res.info)
          }
        })
      })
    },
    getYoudiReportByUserId() {
      return new Promise((resolve, reject) => {
        this.$request.post('/app/json/app_youdi_report_year/getYoudiReportByUserId').then(res => {
          if (res.status === 0) {
            resolve(res.data)
          } else {
            this.$Toast(res.info)
          }
        })
      })
    },
    setMyChart(a,b,c) {
      var myChart = echarts.init(document.getElementById('chartId'));
      myChart.setOption({
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20,
              data: ['微信', '加油卡', '现金']
            },
            data: [
              {value: a, name: '微信'},
              {value: b, name: '加油卡'},
              {value: c, name: '现金'}
            ],
            itemStyle: {
              normal:{
                color:function(params) {
                var colorList = ['#299bf4', '#f1a100', '#ee6300'];
                  return colorList[params.dataIndex]
                }
              }
            }
        }]
      });
    },
    shareBtn() {
      if (this.$store.state.webtype == 2) {
        if(this.isShare) {
          this.$router.push({
            path: '/redirectEB',
          })
         } else {
          const token = store.state.login.token
           Jwx.share(
            '中国石化河北2019年油滴账单',
            `${location.origin}${Config.shareUrl}/electronic_billing?token=${token}&logintoken=${token}&isShare=true`,
            '',
            '查看年度账单'
          )
          this.showWxTips = true
        }
      } else {
        const token = store.state.login.token
        Jwx.share(
          '中国石化河北2019年油滴账单',
          `${location.origin}${Config.shareUrl}/electronic_billing?token=${token}&logintoken=${token}&isShare=true`,
          '',
          '查看年度账单'
        )
      }
    },
    phone(str) {
      let pat=/(\d{3})\d*(\d{4})/
      return str.replace(pat,'$1****$2');
    }
  },
  beforeDestroy: function() {
    if (this.isShare) {
      Cookie.set('usertoken','', -1)
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.electronicBilling {
  position absolute;
  left 0px;
  right 0px;
  bottom 0px;
  top 0px;
  overflow hidden;
  font-size 12px
  .icon {
    position absolute
    left 46%
    bottom 0
    img {
      width 24px
      height 18px
    }
  }
  .one {
    height 100%
    position relative
    box-shadow: 2px 2px 40px 5px #fbc14d inset;
    .information {
      color #fff
      height 23%
      display flex
      justify-content center
      align-items center
      background: url('./image/矩形.png') repeat center center / 100% 100%;
      z-index 1
      .information-top {
        display flex
        flex-direction column
        justify-content center
        align-items center
        .information-top-img {
          width 70px
          height 70px
          display flex
          justify-content center
          img {
            border-radius 80px
            width 100%
            height 100%
          }
        }
        .information-top-name {
          font-size 16px
          font-weight 500
          margin 8px 0
        }
      }
    }
    .exhibition {
      padding 20px
      margin -6px 12px 0
      height calc(100% - 180px);
      border-radius 10px
      background-color #fff
      box-shadow: 2px 2px 10px #ddd;
      p {
        font-size 16px
        font-weight 500
      }
      .exhibition-top {
        height 30%
        margin 10px 0
        display flex
        justify-content center
        align-items center
        .exhibition-top-box {
          flex 1
          height 100%
          margin 0 4px
          display flex
          flex-direction column
          justify-content center
          align-items center
          .exhibition-top-img {
            width 30px
            height 30px
            border-radius 50px
            display flex
            justify-content center
            img {
              width 100%
              height 100%
            }
          }
          .exhibition-top-name {
            margin 8px 0
            i {
              font-style: normal;
              font-size 20px
            }
          }
        }
      }
      .exhibition-middle {
        height 16%
        margin 14px 24px
        background: url('./image/徽章.png') repeat center center / 100% 100%;
        display flex
        justify-content center
        flex-direction column
        align-items center
        span {
          margin 4px 0
          i {
            font-size 20px
            font-style: normal;
          }
          em {
            color red
            font-style: normal;
          }
          &:last-child {
            font-size 14px
          }
        }
      }
      .exhibition-lower {
        width 100%
        height calc(100% - 64%)
        display flex
        .lowerChart {
          width 50%
          .chartId {
            div,canvas {
              width 100%
              height 100%
            }
          }
        }
        .lowerText {
          width 50%
          font-size 14px
          display flex
          justify-content center
          align-items center
          flex-direction column
          color #535352
          .lower-left {
            margin 6px
            width 100%
            display flex
            justify-content space-between
            align-items center
            i {
              color #333332
              font-style: normal;
              font-size 17px
            }
            .dian {
              width 10px
              height 10px
              display inline-block
              border-radius 10px
            }
          }
          .wx{
            .dian{
              background-color #299bf4
            }
          }
          .jyk {
            .dian {
              background-color #f1a100
            }
          }
          .xj {
            .dian {
              background-color #ee6300
            }
          } 
        }
      }
    }
  }
  .two, .three {
    height 100%
    width 100%
    position relative
    .time-box {
      width 60%
      height 160px
      position absolute
      top 10%
      background-color #fff
      border-radius 0 10px 10px 0
      padding 10px
      font-size 14px
      display flex
      flex-direction column
      justify-content center
      position relative
      span {
        margin 6px
        &:last-child {
          line-height 20px
          color #a7a7a7
        }
        i {
          color #fff
          padding 0px 4px
          font-style: normal
          background-color #000
          border-radius 4px
          font-size 22px
          font-weight 500
          text-align center;
          margin 0 1px;
        }
        .tite{
          font-weight 800
          font-size 12px
          padding 0px 4px 1px
        }
      }
      .line {
        position absolute
        top 48%
        color: #fff
        border-style: solid
        width: 90%
      }
    }
  }
  .two {
    background: url('./image/最早一次加油北京.png') repeat center center / 100% 100%;
  }
  .three {
    background: url('./image/最晚一次加油北京.png') repeat center center / 100% 100%;
    .time-box {
      position absolute
      right 0
      border-radius 10px 0 0 10px
    }
  }
  .four {
    height 100%
    width 100%
    overflow hidden
    position relative
    box-shadow: 2px 2px 40px 5px #fbc14d inset;
    .gasStation {
      font-size 16px
      height calc(100% - 42px);
      margin 12px
      padding 20px
      border-radius 10px
      background-color #fff
      box-shadow: 2px 2px 10px #ddd;
      p {
        font-size 16px
        font-weight 500
      }
      .gasStation-list {
        margin 10px 0
        .gasStation-list-item {
          display flex
          justify-content space-between
          margin-bottom 12px
          .item-left {
            display flex
            justify-content center
            align-items center
            .itemImg {
              display block
              height 20px
              width 20px
              img {
                height 100%
                width 100%
              }
            }
            .temtiter {
              font-size 14px
              margin-left 4px
            }
          }
        }
        .gasStation-list-progress {
          padding-left 24px
          /deep/ .van-progress{
            height 8px
          }
        }
      }
      .text {
        color #8b948d
        font-size: 12px;
        height 26px
        display flex
        justify-content center
        align-items center
        line-height 20px
      }
      .titer {
        margin-top 20px
      }
      .gasStation-circle {
        padding 6% 5%
        display flex
        justify-content center
        align-items center
        justify-content space-between
        /deep/ .van-circle__layer { 
          transform-origin: 50% !important
        }
        .circle-item {
          display flex
          flex-direction column
          justify-content center
          align-items center
          p {
            margin 20px 0 10px
            color #ff5601
            font-size 14px
          }
        }
      }
    }
  }
  .five {
    height 100%
    width 100%
    overflow hidden
    position relative
    padding-bottom 10%
    display flex
    flex-direction column
    justify-content: space-between
    box-shadow: 2px 2px 40px 5px #fbc14d inset;
    .mapList {
      position relative
      img {
        width 100%
        height 100%
      }
      .zjk {
        width 100px
        height 130px
        position absolute
        top 70px
        left 70px
      }
       .bd {
        width 90px
        height 85px
        transform:rotate(6deg);
        position absolute
        top 175px
        left 65px
      }
       .cd {
        width 120px
        height 130px
        position absolute
        top 40px
        left 155px
        transform:rotate(-2deg);
      }
       .ts {
        width 76px
        height 76px
        position absolute
        top 155px
        left 212px
        transform:rotate(-3deg);
      }
      .qhd {
        width 60px
        height 62px
        position absolute
        top 142px
        left 256px
        transform:rotate(-3deg);
      }
      .sjz {
        width 65px
        height 63px
        position absolute
        top 239px
        left 56px
      }
      .xt {
        width 70px
        height 56px
        position absolute
        top 288px
        left 66px
      }
      .hd {
        width 70px
        height 50px
        position absolute
        top 334px
        left 56px
        transform:rotate(-2deg);
      }
      .hs {
        width 56px
        height 58px
        position absolute
        top 261px
        left 113px
        transform:rotate(4deg);
      }
      .cz {
        width 80px
        height 66px
        position absolute
        top 233px
        left 137px
      }
      .lf {
        width 52px
        height 68px
        position absolute
        top 180px
        left 147px
      }
    }
    .mapListDaata {
      height 23%
      margin 6%
      padding 20px
      border-radius 10px
      background-color #fff
      box-shadow: 2px 2px 10px #ddd;
      p {
        font-size 16px
        font-weight 500
      }
      .mapListDaata-top {
        display flex
        align-items center
        justify-content row
        margin 12px 0
        font-size 14px
        .itemImg {
          display inline-block
          height 20px
          width 20px
          img {
            height 100%
            width 100%
          }
        }
        .temtiter {
          margin-left 4px
        }
      }
      .text {
        color #676767
        display inline-block
        margin-left 24px
        line-height 16px
      }
    }
  }
  .six {
    height 100%
    width 100%
    overflow hidden
    position relative
    box-shadow: 2px 2px 40px 5px #fbc14d inset;
    .exhibition {
      padding 4%
      margin 12px
      height calc(100% - 8%);
      border-radius 10px
      background-color #fff
      box-shadow: 2px 2px 10px #ddd;
      display flex
      flex-direction column
      align-items center
      .exhibition-list {
        flex 1
        width 100%
        padding 12px 0
        
        p {
          font-size 16px
          font-weight 500
        }
        .exhibition-box {
          height 100%
          .box-top {
            height 86px
            display flex
            justify-content center
            align-items center
            .top-item {
              flex 1
              height 100%
              padding-top 16px
              display flex
              flex-direction column
              justify-content center
              align-items center
              img {
                width 26px
                height 28px
              }
              .item-num {
                margin 6px 0
                i {
                  font-style: normal;
                  font-size 18px
                }
              }
            }
          }
          .box-bom {
            height calc(100% - 86px);
            display flex
            flex-direction column
            justify-content center
            align-items center
            color #676767
            line-height 20px
            .bom {
              i {
                font-style: normal;
                font-size 20px
              }
            }
            .bfb {
              i {
                  color #ff5601
                  font-style: normal;
                  font-size 20px
                }
            }
          }
        }
      }
    }
  }
  .seven {
    height 100%
    width 100%
    padding 55px
    overflow hidden
    position relative
    box-shadow: 2px 2px 40px 5px #fbc14d inset;
    .seven-img {
      height 46px
      width 100%
      margin-top 20px
      display flex
      justify-content: center
      img {
        height 100%
        width 70%
      }
    }
    .seven-QRcode {
      height 260px;
      width 260px
      display flex
      flex-direction column
      align-items center
      justify-content center
      margin 20px 0
      .QRcode {
        height 200px;
        width 200px;
        border-radius 10px
        background-color #fff
        box-shadow: 2px 2px 10px #ddd;
      }
      span {
        display block
        color #615e60
        margin-top 20px
      }
    }
    .seven-btn {
      margin-top 20px
      width 100%
      height 42px
      color #fff
      font-size 16px
      background: url('./image/生辰年度账单.png') repeat center center / 100% 100%;
      display flex
      align-items center
      justify-content center
    }
    .seven-chupin {
      width 70%
      position absolute
      bottom 40px
      left 0
      right 0
      margin 0 auto
      text-align center
      color #a5a8a5
    }
  }
  .wx-show {
    /deep/ .van-popup--center {
      top: 20%
    }
    /deep/ .van-popup {
      background none
      width 80%
    }
    .jt {
      text-align right
      padding-bottom: 15px
      img {
        width 60px
      }
    }
    .wx-tips-show {
      .wx-tips-content {
        background #fff
        padding: 20px 15px
        border-radius 4px
        .text2 {
          padding-top: 15px
          display flex
          justify-content left
          align-items center
          img {
            width: 20px
          }
        }
      }
    }
  }
}
</style>
