// common路由页
<template>
  <div>
    <div class="mobile-preview" v-if="pageShow">
      <div class="jiankangma" v-if="pageType == 'jiankangma'">
        <div class="back-div" @click="$router.go(-1)">
          <i class="iconfont mall-fanhui theme_font_white" style="margin-left: 10px; font-size: 20px;"></i>
        </div>
        <div class="qrcode-div" @click="$router.go(-1)">
          <img src="static/images/mycenter/qrcode.png">
        </div>
        <div class="user">
          <span v-show="jkmName != ''">{{jkmName}}</span>
        </div>
        <div class="get-coupon" @click="toGetCoupon">消费一码通顾客专享礼遇</div>
      </div>
      <!--<div style="width: 100%;  background: #000;color:#fff;">{{wxQuery}}</div>-->
      <div class="full-div" :class="{'has-top-div': pageType == 'jiankangma'}" v-if="pageData.type == '0'">
        <component ref="Ref_Com_One" :is="'PreviewComponent'" :pageData="pageData" :barHeight="getTopHeight()" @getPageData="getPageData(pgCode,-1)"></component>
      </div>
      <div class="full-div" :class="{'has-top-div': pageType == 'jiankangma'}" v-if="pageData.type == '1'">
        <div class="page-content">
          <div class="full-div" :key="index" v-for="(item, index) in tabbarSubDatas" v-if="item.hasShow && item.data" v-show="index == selectedIndex">
            <component :ref="getComRef(index)" :hasBack="getHasbackEvent(item.code)" :is="getItemCode(item)"
                       :pageData="item.data"
                       :barHeight="getTopHeight()" :commonShow="selectedIndex == index"
                       @getPageData="getPageData(item.pgCode,index)"
                       @tabbarEvent="tabbarChanged"></component>
          </div>
        </div>
        <Tabbar ref="tabbar" @tabbarEvent="tabbarEvent" :usePorpData="true" :propData="pageData"></Tabbar>
      </div>
    </div>
    <IndustryGroup></IndustryGroup>
    <template v-if="$store.state.deployType == '4'">
      <!-- 海油环境 -->
      <AdPage :pageAdKeywords="adPageKey" v-if="adPageKey"></AdPage>
    </template>
    <template v-else-if="pageData">
      <AdPage :pageAdKeywords="adPageKey" v-if="pgCode"></AdPage>
      <AdPage :pageAdKeywords="'AD_Key_Index'" v-else></AdPage>
    </template>
    <BindOilCard></BindOilCard>
    <fassionShare></fassionShare>
    <Hobby v-if="$store.state.login.token != ''"></Hobby>
    <HyActivityModal ref="hyActivity"
                     v-if="$store.state.globalConfig.app_home_special_flag == 'cnooc'"></HyActivityModal>
    <van-dialog confirmButtonColor='#ee0a24' v-if="orderList.length" @confirm="payOrder" v-model="payOrderShow"
                confirmButtonText='去支付' style="border-radius:8px;" show-cancel-button>
      <div style="padding: 40px 0; text-align:center;">
        您有未支付加油订单
      </div>
    </van-dialog>
    <van-popup v-model="evaluateShow"  class="eva-con"  closeable
               close-icon="close">
      <div class="icon-bg">
        小主，您{{limitOrderDayNum}}天内有{{toEvaluatedNum}}笔加油订单还未
        评价哦，帮忙对上次加油服务
        评价一下啦~~
      </div>
      <van-button round type="info"  color="#F02C2D" size="small" class="btn" @click="enterEvaluate">去评价</van-button>
      <div v-if="hasPrize">
        <p v-if="prize.length>0&&prize[0].prizeType!='20030'">* 完成评价后可获赠{{prize[0].prizeNum}}张{{prize[0].prizeName}}{{prize.length>1?'等':''}}</p>
        <p v-if="prize.length>0&&prize[0].prizeType=='20030'">* 完成评价后可获赠{{prize[0].prizeName}}{{prize[0].prizeNum}}次{{prize.length>1?'等':''}}</p>
      </div>
    </van-popup>
    <PopupEvaluation />
  </div>
</template>

<script>
  import Tabbar from './tabbar/tabbar'
  import {mapGetters} from 'vuex'
  import logCenter from '@/utils/logCenter'
  import Config from '@/api/config'
  import AdPage from '@/components/product/index/subpage/adpage'
  import BindOilCard from '@/components/fuelcard/bindOilCard/index'
  import fassionShare from '@/components/fassion-share/index'
  import Hobby from '@/components/hobby/index'
  import eventBus from '@/utils/eventBus.js'
  import HyActivityModal from '@/deploy/cnooc/views/activity-modal/activity-modal.vue'; // 海油活动弹窗
  import Cookie from 'js-cookie'
  import staticDataRequest from "../../../utils/staticData/staticDataRequest";
  import createGuide from '@/components/commonui/exchange-guide/guide-event';
  import appUi from '@zkty-team/x-engine-module-ui'

  export default {
    name: 'index',
    components: {
      IndustryGroup: () => import('@/components/industryGroup/index'),
      Mallshoppingcart: () => import('@/components/mall2/cart/cart'),
      Mallcategories: () => import('@/components/mall2/categories/index'),
      RebateBonus: () => import('@/components/usercenter/setting/rebate-bonus/index'),
      FlashPayment: () => import('@/components/product/flashPayment/flashPayment'),
      Stationto: () => import('@/components/product/stationto/map-stationto'),
      BrandList: () => import('@/views/brand-manage/brand-list.vue'),
      PreviewComponent: () => import('./preview/preview-new'),
      LinkComponent: () => import('./preview/preview-link'),
      WebViewComponent: () => import('./preview/web-view'),
      RefulStrong: () => import('@/deploy/hkyy/views/refuil-strong'),
      PurchaseService: () => import('@/deploy/chum/views/purchase-service/purchase-service.vue'),
      CnoocPayPersonal: () => import('@/deploy/cnooc/views/pay-personal/pay-personal.vue'),
      CnoocCard: () => import('@/deploy/cnooc/views/cnooc-card/cnooc-card.vue'),
      ActivityPage: () => import('@/deploy/cnooc/views/activity-page/index.vue'),
      // RentCar: () => import('@/components/rentcar/rentcar.vue'),
      // BatteryHome: () => import('@/components/battery/battery-home.vue'),
      // Mine: () => import('@/components/mine/mine-homes.vue'),
      Tabbar,
      AdPage,
      BindOilCard,
      fassionShare,
      Hobby,
      HyActivityModal,
      PopupEvaluation: () => import('@/components/product/index/subpage/popup-evaluation'),
    },
    data() {
      return {
        limitOrderDayNum:null,
        toEvaluatedNum:null,
        hasPrize:null,
        prize:{},
        evaluateObj:{},
        evaluateShow:false,
        pgCode: '',
        pageShow: false,
        payOrderShow: true,
        pageData: null,
        fullPageData: {},
        tabbarSubDatas: [],
        selectedIndex: -1,
        pageLoaded: false,
        wxQuery: null,
        indexPage_index: 0,
        pagePosition: 0,
        pageType: '',
        jkmName: '',
        adPageKey: '',
        businessType: '',
      }
    },
    computed: {
      ...mapGetters({orderList: 'oilPayOrderList'})
    },
    activated() {
      this.queryOrder()
    },
    methods: {
      toGetCoupon: function () {
        this.$market.customPush({
          path: '/get_coupon'
        })
      },
      payOrder() {
        this.$router.push('/oil-pay/order-list')
        this.payOrderShow = false;
      },
      queryOrder() {
        if (!this.$store.state.login.token && this.$store.state.login.token != '') {
          this.$request.post('/app/json/refuel_center/queryOrder', {state: 1}).then(res => {
            if (res.status === 0) {
              this.$store.state.oilPayOrderList = res.data.orderList
            }
          })
        }
      },
      getItemCode: function (item) {
        if ('LinkComponent' == item.code) {
          if (item.data.url.indexOf("http") == 0) {
            item.code = 'WebViewComponent'
          }
        }
        if ('2' == item.code) {
          if (item.data.url == '/usercenter/rebatebonus') {
            item.code = 'RebateBonus'
          }
        }

        return item.code;
      },
      tabbarChanged: function (index) {
        this.$refs.tabbar.tabbarEvent(index)
      },
      getHasbackEvent: function (code) {
        // if (code == 'Mallcategories' || code == 'Mallshoppingcart' || code == 'Mallorderlist') {
        //   return false
        // }
        return false
      },
      getComRef: function (index) {
        return 'com' + index
      },
      tabbarEvent: function (index) {
        if (index == -1) {
          return;
        }
        if (index == this.indexPage_index) {
          eventBus.$emit('getCanReceiveAwardListGroupByActivity') // // 判断权益配置为1 走权益流程 详见bindOilCard
        }
        let item = this.tabbarSubDatas[index];
        let pageModule = this.pageData.moduleList[index]
        const name = pageModule.link ? pageModule.link.name : ''
        this.$actionStatistics.commonAction('140003', '', '', '', '', name, this.pageData.pgCode, this.pageData.pgCode, '')
        let link = pageModule.link
        if (this.$store.state.login.token == '') {
          if (link.mustLogined == true || item.code == "Mallshoppingcart") {
            // Mallshoppingcart 购物车 需要登录
            // index == this.tabbarSubDatas.length - 1 固定当做最后一个配置页面是 我的， 我的页面需要登录
            this.$store.state.indexData.selectedIndex = index
            this.$store.state.pushData = {};
            if (this.selectedIndex != '-1') {
              this.tabbarChanged(this.selectedIndex)
            }

            this.$util.toLogin();

            return;
          }
        }
        if (link.type == '3' || link.type == '10' || link.type == '5' || link.type == '9') {
          this.$market.enterNav(pageModule)
          if (this.selectedIndex != '-1') {
            this.tabbarChanged(this.selectedIndex)
          }
          return;
        }
        if (item.code == 'PreviewComponent' && item.data == '') {
          this.getPageData(item.pgCode, index)
        }
        if (item.hasShow && this.selectedIndex != index) {
          this.commonPageShow(index);
        }
        item.hasShow = true
        this.selectedIndex = index;

        this.$nextTick(() => {
          if (this.getComRef(index) && this.$refs[this.getComRef(index)]) {
            //判断是否是配置组件  再去刷新   liqiang
            if (item.code == 'PreviewComponent' && this.$refs[this.getComRef(index)][0]) {
              this.$refs[this.getComRef(index)][0].refresh();
            }
          }
        })
      },
      getTopHeight: function () {
        return this.$store.state.barHeight;
      },
      // 引导模块
      actionGuide: function () {
        const guideData = this.pageData.guideData;
        if(guideData){
          let ver = guideData._v;
          let read = localStorage.getItem(guideData._uid);
          read != ver ? create() : null;
        }
        function create(){
          var vm = createGuide({
            active:{
              stepIdx:0,
              showGuide:true,
              production:true,
            },
            guideData,
            callback: ()=>{
              vm.remove();
            }
          })
        }
      },
      getPageData: function (pgcode, tabbarIndex) {
        console.log('home:::::::::', pgcode, tabbarIndex)
        if (tabbarIndex == -1) {
          // this.fullPageData = fdata;
          // this.pageData = pdata;
          this.pageShow = false;
        }

        let webType = '1'
        if (this.$store.state.webtype == '1') {
          webType = '1'
        } else if (this.$store.state.webtype == '2') {
          webType = '2'
        } else if (this.$store.state.webtype == '3') {
          webType = '3'
        } else if (this.$store.state.webtype == '4') {
          webType = '4'
        } else if (this.$store.state.webtype == '5') {
          webType = '5'
        }
        let businessType = ''
        if (this.businessType) {
          businessType = this.businessType
        }

        let storeOuCode = ''
        if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
          storeOuCode = this.$store.state.refuelStation.stationCode || '1'
        }

        let cityName = this.$store.state.indexData.city ? this.$store.state.indexData.city : ''
        let provinceName = this.$store.state.indexData.province ? this.$store.state.indexData.province : ''

        let url = '/appcontent/js/app_vue_page/vuePageData.js'
        let funcName = 'vuePageData_'
        let args = []
        args.push({appType: 1})
        args.push({webType: webType})
        args.push({accessType: 2})
        if (pgcode) {
          funcName += pgcode
          args.push({pgCode: pgcode})
        } else {

          args.push({storeOuCode: storeOuCode})
          args.push({cityName: cityName})
          args.push({provinceName: provinceName})
          args.push({businessType: businessType})

          let md5Str = this.$util.md5String(webType+storeOuCode+cityName)
          funcName += md5Str
        }

        this.$STLoading.open()
        staticDataRequest.request(url, funcName, args).then(data => {
          this.$STLoading.close()
          if (data.status == 0) {
            this.pageLoaded = true;
            let fdata = data.data.pageData;
            if (!fdata.pageDataJson) {
              this.$toast('首页布局获取失败11')
              return
            }
            let pdata = JSON.parse(fdata.pageDataJson);
            // 日志打印`
            // pdata.moduleList.forEach((item, index) => {
            //   console.log(item.code + "----" + index);
            // });
            // 日志打印end
            pdata = this.interceptor(pdata)
            pdata.pgCode = fdata.pgCode
            if (tabbarIndex == -1) {

              this.fullPageData = fdata;
              this.pageData = pdata;

              if(this.$store.state.deployType == '4'){
                // 海油环境
                this.adPageKey = ''
                this.$nextTick(() => {
                  this.adPageKey = 'AD_Key_Common_' + fdata.pgCode
                })
              } else{
                if(pgcode){
                  this.adPageKey = 'AD_Key_Common_' + fdata.pgCode
                }
              }

              // 引导事件
              this.actionGuide();

              if (pdata.header && pdata.header != undefined) {
                let title = pdata.header.data.title
                if (title != undefined && title && title != '' && this.$store.state.webtype != 3) {
                  document.title = title;
                }
              }
              this.pageShow = true;

              if (this.pageData.type == '1') {
                this.getSubPageDatas()
              }
            } else {
              this.tabbarSubDatas[tabbarIndex].data = null
              this.pageShow = false;
              this.$nextTick(() => {
                this.tabbarSubDatas[tabbarIndex].data = pdata
                this.pageShow = true;
                this.$nextTick(() => {
                  this.$refs.tabbar.tabbarEvent(this.selectedIndex);
                })
              })
            }

            if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
              this.$refs.hyActivity.queryUserConfig()
            }

            // 设置当前tab页
            if (this.$route.query.defaultCurrentTab) {
              this.$nextTick(() => {
                if (this.$refs.tabbar) {
                  this.$refs.tabbar.tabbarEvent(this.$route.query.defaultCurrentTab)
                }
              })
            }
            // todo：console.log('pdata',pdata)
          } else {
            // 如果是请求首页出错，用默认地址，再请求一次
            if (tabbarIndex == -1) {
              let locationinfo = {}
              locationinfo.province = this.$store.state.globalConfig.province
              locationinfo.city = this.$store.state.globalConfig.city
              locationinfo.district = this.$store.state.globalConfig.district
              locationinfo.longitude = this.$store.state.globalConfig.longitude
              locationinfo.latitude = this.$store.state.globalConfig.latitude
              this._setNewLocation(locationinfo);
            } else {
              this.$Toast('请求数据出错，请稍后重试!')
            }
          }
        })
      },
      enterEvaluate(){
          this.$router.push({
            path:'evaluateDetail',
            query:{
              id:this.evaluateObj.id,
              orderId:this.evaluateObj.orderId,
              refuelOrderId:this.evaluateObj.refuelOrderId,
            }
          })
      },
      getSubPageDatas: function () {
        let count = this.pageData.moduleList.length
        let tempArr = [];
        let defaultIndex = -1
        for (let i = 0; i < count; i++) {
          let module = this.pageData.moduleList[i]
          if (module.default == true) {
            defaultIndex = i;
          }
          let link = module.link
          let pdata = {}
          if (link.type == '1') {
            pdata.code = 'PreviewComponent'
            pdata.data = ''
            pdata.pgCode = link.pgCode
          } else if (link.type == '2') {
            pdata.code = link.code
            pdata.data = {
              title: link.label,
              url: link.url
            }
          } else if (link.type == '3') {
            pdata.code = 'LinkComponent'
            pdata.data = {
              title: link.label,
              url: link.url
            }
          }
          pdata.hasShow = false;
          tempArr.push(pdata);
        }
        this.tabbarSubDatas = tempArr;
        console.log("tabbarSubDatas",this.tabbarSubDatas)
        // for (let i = 0; i < this.tabbarSubDatas.length; i++) {
        //   let item = this.tabbarSubDatas[i]
        //   if (item.code == 'PreviewComponent') {
        //     this.getPageData(item.pgCode, i)
        //   }
        // }

        if (this.$store.state.indexData.useSaveIndex == true) {
          this.$store.state.indexData.useSaveIndex = false
          if (this.$store.state.indexData.selectedIndex != '' && this.$store.state.indexData.selectedIndex > -1) {
            defaultIndex = this.$store.state.indexData.selectedIndex;
          }
          this.$store.state.indexData.selectedIndex = ''
          this.$bridgefunc.vuexStorage();
        }

        if (defaultIndex != -1) {
          this.$nextTick(() => {
            this.$refs.tabbar.tabbarEvent(defaultIndex);
          })
        }
      },
      interceptor(pageData) {
        // 处理页面数据，河北的充值页面ios虚拟支付被禁用，需要去掉该模块
        try {
          pageData.moduleList = pageData.moduleList && pageData.moduleList.map(m => {
            if (m.code === 'ImageAd' && m.data.rows) {
              const idx = m.data.rows.findIndex(row => row.link.url === '/phone-bill-recharge')
              if (idx > -1 && this.$util.isIos() && this.$store.state.webtype == 3) {
                m.data.rows.splice(idx, 1)
              }
            }
            return m
          })
        } catch (e) {
          console.log(e)
        }
        return pageData
      },
      getLocation: function () {
        this.$bridgefunc.getLocation((locationinfo, precision) => {
          let logBody = 'locationinfo：' + JSON.stringify(locationinfo) + '<br/>';
          logCenter.addLog('获取定位信息', logBody)

          //城市为空的情况下
          if (!locationinfo.city || locationinfo.city == '') {
            //如果还没有城市要做初始化数据
            if (!this.$store.state.indexData.province || this.$store.state.indexData.province == '') {
              locationinfo.province = this.$store.state.globalConfig.province
              locationinfo.city = this.$store.state.globalConfig.city
              locationinfo.district = this.$store.state.globalConfig.district
              locationinfo.longitude = this.$store.state.globalConfig.longitude
              locationinfo.latitude = this.$store.state.globalConfig.latitude
            } else {
              return;
            }
          }
          this.saveCoordinate(locationinfo);

          if (this.$store.state.globalConfig.onlyProvince_area == '1' && this.getShortName(locationinfo.province) != this.getShortName(this.$store.state.globalConfig.province)) {
            // 如果app仅让在当前省份使用，并且定位不在当前省份直接 使用默认定位信息
            locationinfo.province = this.$store.state.globalConfig.province
            locationinfo.city = this.$store.state.globalConfig.city
            locationinfo.district = this.$store.state.globalConfig.district
            locationinfo.longitude = this.$store.state.globalConfig.longitude
            locationinfo.latitude = this.$store.state.globalConfig.latitude
            if (!this.$store.state.indexData.province || this.$store.state.indexData.province == '') {
              this._setNewLocation(locationinfo);
              this.getPageData(undefined, -1);
            } else {
              this._setNewLocation(locationinfo);
            }
          } else {
            if (!this.$store.state.indexData.province || this.$store.state.indexData.province == '') {
              this._setNewLocation(locationinfo);
              this.getPageData(undefined, -1);
            } else if (this.getShortName(this.$store.state.indexData.city) != this.getShortName(locationinfo.city)) {
              this.$messagebox.confirm('离您最近的城市是' + locationinfo.province + locationinfo.city + locationinfo.district + ',建议你切换到' + locationinfo.province + locationinfo.city, '提示').then(action => {
                this._setNewLocation(locationinfo);
              }).catch(action => {
              });
            } else {
              this._setNewLocation(locationinfo);
            }
          }
        });
      },
      getShortName: function (longname) {
        let shortname = longname;
        if (shortname.indexOf("省") != -1 || shortname.indexOf("市") != -1) {
          shortname = shortname.substring(0, shortname.length - 1);
        }
        return shortname;
      },
      saveCoordinate: function (locationinfo) {


        // let tempLocDic = this.$util.bd_decrypt(locationinfo.longitude, locationinfo.latitude);
        this.$store.state.currentLocation.posx = locationinfo.longitude;
        this.$store.state.currentLocation.posy = locationinfo.latitude;

        this.$bridgefunc.vuexStorage(function () {
        })
      },
      _setNewLocation: function (locationinfo) {
        this.$mallCommon.addressAnalysis((result, address) => {
          this.$store.state.indexData.province = locationinfo.province;
          this.$store.state.indexData.city = locationinfo.city;
          if (result) {
            this.$store.state.indexData.provinceId = address.provinceId;
            this.$store.state.indexData.cityId = address.cityId;
          }
        }, locationinfo);
      },
      commonPageShow: function (i) {
        let comref = this.getComRef(i);
        if (this.$refs[comref]) {
          let arr = this.$refs[comref];
          let el = arr[0];
          if (el.pageShow) {
            let item = this.tabbarSubDatas[this.selectedIndex];
            el.pageShow();
          }
        }
      },
      // 获取未评价订单
      getEvaluateOrder: function () {
        if (this.$store.state.login.token == '') {
          return;
        }
        let paramsData = {
          token: this.$store.state.login.token,
        };
        let url='/app/json/questionaire/getLatestAppraise'
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.evaluateObj=data.data
                this.limitOrderDayNum=data.data.limitOrderDayNum
                this.toEvaluatedNum=data.data.toEvaluatedNum
                this.hasPrize=data.data.hasPrize
              if(data.data){
                this.prize=JSON.parse(data.data.questionPrize)
              }

                if(this.toEvaluatedNum){
                  this.evaluateShow=true;
                }else{
                  this.evaluateShow=false;
                }
              // this.$store.state.mall2.myAssets = data.data
              // this.$store.state.userInfo.levelNo = data.data.levelNo
            }else{
              this.$Toast('请求数据出错，请稍后重试!')
            }
          },
          error => {
          }
        );
      },
      // 获取会员信息
      getMyAssets: function () {
        if (this.$store.state.login.token == '') {
          return;
        }
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
              this.$store.state.userInfo.levelNo = data.data.levelNo
            }
          },
          error => {
          }
        );
      },
      // 获取附件加油站
      getNearStations: function (nowpoint) {
        this.$Loading.open()
        let url = '/app/json/station/getStationList';
        let params1 = {
          posx: '104.08194200',
          posy: '30.64504100',
          page: 1,
          rows: 1,
          // token: this.$store.state.login.token,
          //1百度 2腾讯
          getType: '1'
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0 && data.data.length > 0) {
            let station = data.data[0]
            this.$store.state.indexData.station = station;
            // if (this.$store.state.indexData.station.id != station.id) {
            //   this.$messagebox.confirm('离您最近的加油站是' + station.stationName+ ',建议你切换到' + station.stationName, '提示').then(action => {
            //     this.$store.state.indexData.station = station;
            //   }).catch(action => {
            //   });
            // }
            // this.stations = data.data
            // this.addNewLocations()
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          this.$Loading.close();
        })
      },
      /*
      每天访客
       */
      statViewPerson: async function () {
        var oDate = new Date(),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate();
        let nowDate = oYear + '-' + oMonth + '-' + oDay;//最后拼接时间
        let dbDate = localStorage.getItem('statViewPerson');
        if (dbDate == nowDate) {
          return;
        }
        let url = '/app/json/home/statViewPerson';
        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        let paramsData = {
          appDeviceid: nArgs.deviceId ? nArgs.deviceId : '',
        };
        this.$http.post(url, paramsData).then(res => {
            let data = res.data;
            if (data.status == 0) {
              localStorage.setItem('statViewPerson', nowDate);
            } else {
            }
          },
          err => {

          }
        )
      },
      imageAdRefresh: function () {
        let comref = this.getComRef(this.selectedIndex);
        if (this.$refs[comref]) {
          let arr = this.$refs[comref];
          let el = arr[0];
          if (el.pageShow) {
            let imageAdRefresh = this.tabbarSubDatas[this.selectedIndex];
            el.imageAdRefresh();
          }
        }
      },
      // 海油 | 获取用户默认油站方法
      getStation() {
        this.$http.post("/app/json/hy_station/getDefaultStation", {}).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$store.commit("setStationInfo", data.data);
            this.getStoreInfo(data.data.standardCode);
          } else {
            this.$Toast(data.info);
          }
        }).catch(err => {
          this.$Toast(err);
        });
      },
      cnoocGetLocation() {
        this.$bridgefunc.getLocation((locationinfo, precision) => {
          let logBody = 'locationinfo：' + JSON.stringify(locationinfo) + '<br/>';
          logCenter.addLog('获取定位信息', logBody)

          //城市为空的情况下
          if (!locationinfo.city || locationinfo.city == '') {
            //如果还没有城市要做初始化数据
            if (!this.$store.state.indexData.province || this.$store.state.indexData.province == '') {
              locationinfo.province = this.$store.state.globalConfig.province
              locationinfo.city = this.$store.state.globalConfig.city
              locationinfo.district = this.$store.state.globalConfig.district
              locationinfo.longitude = this.$store.state.globalConfig.longitude
              locationinfo.latitude = this.$store.state.globalConfig.latitude
            } else {
              return;
            }
          }
          this.saveCoordinate(locationinfo);
        })
      },
      getStoreInfo(standardCode) {
        this.$STLoading.open()
        this.$http.post('/app/json/hy_station/getStoreInfo', {
          standardCode
        }).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.zitiAddress.id = data.data.storeId;
            this.$store.state.mall2.zitiAddress.storeCode = data.data.storeCode;
            this.$store.state.mall2.zitiAddress.storeName = data.data.storeName || this.$store.state.refuelStation.stationName;
            this.$store.state.mall2.zitiAddress.mchOuCode = data.data.merchantOuCode;
            if (this.$store.state.mall2.zitiAddress.id && !this.$store.state.mall2.zitiAddress.mchOuCode) {
              this.$store.state.staticDeliverType = '1'
            } else if (this.$store.state.mall2.zitiAddress.mchOuCode && !this.$store.state.mall2.zitiAddress.id) {
              this.$store.state.staticDeliverType = '2'
            }
            this.getPageData(undefined, -1);
          } else {
            this.$Toast(data.info);
          }
          this.$STLoading.close()
        }).catch(err => {
          this.$Toast(`getStoreInfo err ${err}`);
          this.$STLoading.close()
        })
      }
    },
    watch: {
      // // 监听城市变化
      '$store.state.indexData.city': function (val, oldVal) {
        if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
          return;
        } else if (this.$store.state.webtype == '4') {
          return;
        } else if (oldVal == '') {
          return;
        }
        if (this.pgCode != '') {
          this.getPageData(this.pgCode, -1)
        } else {
          this.getPageData(undefined, -1)
        }
        this.$bridgefunc.vuexStorage()
      },
      // 监听油站变化
      // '$store.state.indexData.station.id' : function(val, oldVal) {
      //   if (this.pageLoaded) {
      //     this.getPageData(undefined,-1)
      //   }
      // },
      '$route': {
        handler: function (to) {
          // 小程序登录
          // if (to.query.hasOwnProperty('mp')) {
          //   // 记住的是MD5后的密码
          //   // this.$store.state.login.password = MD5(this.passwords);
          //   this.wxQuery = to.query
          //   const userInfo = JSON.parse(decodeURIComponent(to.query.userInfo))
          //   this.$store.state.login.phone = userInfo.phone;
          //   this.$userCenter.saveLoginData(userInfo);
          // }
        },
        immediate: true
      }
    },
    mounted() {
      setTimeout(() => {
        // 10s 之后再进行这个回调的注册，防止某些初始化数据并未存入 存储区
        this.$bridgefunc.vuexStorage()
        this.$bridgefunc.registePageShow(() => {
          this.$bridgefunc.vuexRead(() => {
            this.commonPageShow(this.selectedIndex);
          })
        });
      }, 10000)
      if (this.$route.query.showRecharge) {
        Cookie.set('isShowRecharge', this.$route.query.showRecharge)
      }
    },
    activated() {
      // 爱心积分特殊处理
      let dStr = sessionStorage.getItem('SAVE_AXJF_Enterprise')
      if (dStr) {
        let d = JSON.parse(dStr)
        sessionStorage.removeItem('SAVE_AXJF_Enterprise')
        for (let i = 0; i < this.$store.state.globalConfig.acctList.length; i++) {
          let item = this.$store.state.globalConfig.acctList[i]
          if (item.acctType == "Enterprise") {
            this.$store.state.globalConfig.acctList.splice(i, 1, d)
            this.$bridgefunc.vuexStorage()
            break;
          }
        }
      }

      this.statViewPerson();

      if (this.$route.query.lastPath == '/imageadmove') {
        this.imageAdRefresh();
      }
      if (this.indexPage_index == this.selectedIndex) {
        eventBus.$emit('getCanReceiveAwardListGroupByActivity') // // 判断权益配置为1 走权益流程 详见bindOilCard
      }

      if (this.pageData && this.pageData.type == '0') {
        if (this.pageShow) {
          let el = this.$refs.Ref_Com_One;
          if (el) {
            if (el.setScrollSite) {
              el.setScrollSite(this.pagePosition)
              el.pageShow();
            }
          }
        }
      } else {
        if (this.pageShow) {
          let comref = this.getComRef(this.selectedIndex);
          if (this.$refs[comref]) {
            let arr = this.$refs[comref];
            let el = arr[0];
            if (el.setScrollSite) {
              el.setScrollSite(this.pagePosition)
              el.pageShow();
            }
          }
        }
      }

      // if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc' && this.pageShow == true) {
      //   this.getPageData(undefined, -1)
      // }
    },
    beforeRouteLeave(to, from, next) {
      // this.markScrollSite = this.scrollSite
      if (this.pageData.type == '0') {
        let el = this.$refs.Ref_Com_One;
        if (el.getScrollSite) {
          this.pagePosition = parseInt(el.getScrollSite())
        }
      } else {
        let comref = this.getComRef(this.selectedIndex);
        if (this.$refs[comref]) {
          let arr = this.$refs[comref];
          let el = arr[0];
          if (el.getScrollSite) {
            this.pagePosition = parseInt(el.getScrollSite())
          }
        }
      }
      next()
    },
    created() {
      console.log('000000000000000', appUi)
      if (this.$store.state.webType !== '3') {
        appUi.showTabbar();
      }
      this.$store.state.clientWidth = document.documentElement.clientWidth;
      this.pgCode = this.$route.query.pgCode ? this.$route.query.pgCode : '';
      this.businessType = this.$route.query.businessType ? this.$route.query.businessType : '';
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : '';
      // sessionStorage.setItem('Other_Common_PageType', this.pageType)
      this.jkmName = this.$route.query.name ? this.$route.query.name : '';
      if (this.pgCode == '') {
        //  创建首页（第一个页面）的时候，走用户信息相关流程
        // this.$userCenter.rootEvents()

        if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') { // 海油单独处理展示首页逻辑
          this.cnoocGetLocation();
          // 否 获取海油 用户默认油站
          this.getStation();
        } else if (this.$store.state.webtype == '4') {
          this._setNewLocation(this.$store.state.globalConfig)
          this.$mallCommon.pureLocationAnalysis((address) => {
            this.$store.state.indexData.provinceId = address.provinceId
            this.$store.state.indexData.cityId = address.cityId
            this.$store.state.indexData.countryId = address.countryId
            this.$store.state.indexData.countryName = address.countryName
            this.getPageData(this.pgCode, -1);
          }, this.$store.state.globalConfig)
        } else {
          if (this.$store.state.indexData.province != '' && this.$store.state.indexData.city != '') {
            this.getPageData(undefined, -1);
            setTimeout(() => {
              this.getLocation();
            }, 500)
          } else {
            this.getLocation();
          }

          if (this.$store.state.indexData.station.id == '') {
            // this.getNearStations()
          }
        }
      } else {
        this.getPageData(this.pgCode, -1);
      }

      this.isFirstShow = true;
      this.getMyAssets();

      this.queryOrder()
      // 贵州查询未评价订单
      if(this.$store.state.globalConfig.appraise_popup_show==1){
            this.getEvaluateOrder()
      }
      setTimeout(() => {
        this.$bridgefunc.removeItem('kAccountTime')
        // 初始化闪验，因为版本号协议是异步调用，所以这里需要延迟调用，因为里面判断了协议版本号。
        if (this.$store.state.globalConfig.canUseShanyan == '1') {
          let iosAppId = this.$store.state.globalConfig.shanyan_IOS_appId
          let androidAppId = this.$store.state.globalConfig.shanyan_Android_appId
          let appLogo = this.$store.state.globalConfig.shanyan_loginLogo
          let appBg = this.$store.state.globalConfig.shanyan_loginBg
          // let isShowWXLoginBtn = this.$store.state.globalConfig.isShowWXLoginBtn
          // let isShowAliLoginBtn = this.$store.state.globalConfig.isShowAliLoginBtn

          this.$bridgefunc.shanyanInit({
            iosAppId: iosAppId, // ios app id
            androidAppId: androidAppId, // android app id
            appLogo: appLogo, // 替换登录页的logo图片
            appBg: appBg, // 替换登录页的背景图片
            isShowWXLoginBtn: '0',
            isShowAliLoginBtn: '0'
            // isShowWXLoginBtn: isShowWXLoginBtn ? isShowWXLoginBtn : '0', // 是否显示微信登录按钮
            // isShowAliLoginBtn: isShowAliLoginBtn ? isShowAliLoginBtn : '0' // 是否显示支付宝登录按钮
          }, res => {
            if (res == '1') {
              console.log('闪验初始化成功！')
              sessionStorage.setItem('shanyanInitResult', '1')
            } else {
              console.log('闪验初始化失败！')
            }
          })
        }
      }, 500)
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mobile-preview {
    position relative;
    width 100%
    height 100%
    overflow hidden

    .test {
      position relative;
      margin-top -100px;

      p {
        padding 12px;
      }
    }

    .jiankangma {
      width 100%;
      height 44px;
      //background-color #282828;
      display flex;
      align-items center;
      overflow hidden;
      background url('../../../../static/images/hn_jkm_top.png') no-repeat center

      .back-div {
        padding 10px 10px 10px 5px;
      }

      .qrcode-div {
        img {
          display block;
          width 20px;
          height 20px;
        }
      }

      .user {
        flex 1;
        font-size 14px;
        padding 10px;
        color white;

        span {
          font-weight 600;
        }
      }

      .get-coupon {
        color white;
        padding 5px 10px;
        border-radius 20px;
        font-weight 600;
        font-size 14px;
      }
    }


    .full-div {
      position relative;
      width 100%;
      height 100%;

      &.has-top-div {
        height calc(100% - 44px);
      }

      .page-content {
        position absolute
        left 0px;
        right 0px;
        top 0px;
        bottom 45px;
      }
    }
  }

  @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
    .page-content {
      box-sizing: content-box;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  .eva-con{
    width 279px
    height 300px
    /*height 50%*/
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /*margin auto 50px*/
    /*.icon-bg{*/
      background url('../../../../static/images/evabg.png') no-repeat top center
      background-size cover
    //}
    .icon-bg{
      margin 10px 38px 20px
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
    p{
      padding 20px
      text-align center
    }
    .btn{
      width 90px
      margin 0 auto
      margin-bottom 10px
    }




  }
  /deep/.eva-con .van-popup__close-icon{
    top: 1px;
    right: 0;
  }
</style>
