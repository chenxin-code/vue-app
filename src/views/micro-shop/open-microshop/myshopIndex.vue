<template>
  <div class="body" id="body">
    <div
      class="head"
      ref="elements"
      :class="[(this.profitObj.integralWay!=3 && this.profitObj.oilWay!=8 && this.profitObj.peasWay!=9 && this.profitObj.moneyWay!=0 && $store.state.globalConfig.microshop_index != 1 && getPutaggregate.empFlag == 1)?'isActive':'head']"
      :style="'background-image: url('+`${getPutaggregate.backgroundImgUrl || 'static/image/microShop/up.png'}`+')'"
    >
      <nav-top @backEvent="backEvent" title="我的微店"></nav-top>
      <div class="containerTop" v-if="($store.state.globalConfig.microshop_index == 1 && getPutaggregate.empFlag == 1) || getPutaggregate.empFlag != 1">
        <!-- 字典  A、员工 empFlag == 1  B、vue_config_microshop_index == 1 -->
        <div class="container" ref="element">
          <div class="div">
            <div class="div1" @click="toRenovation">
              <img :src="getPutaggregate.pictureUrl?getPutaggregate.pictureUrl:$store.state.globalConfig.microshop_headurl" alt/>
              <span class="span">{{getPutaggregate.storeName?getPutaggregate.storeName:'我的小店'}}</span>
            </div>
            <div class="div2" @click="mallDetail">
              <img src="static/image/microShop/ma.png" alt />
              <span>店铺码</span>
            </div>
          </div>
          <div class="grayDiv" v-if="prizeList.length>0">
            <div v-for="(item,index) in prizeList" :key="index" class="prizeDiv">
              <router-link :to="{name:'micro_sho/profit',params:{type: item.value}}">
                <div>
                  <p class="p1" v-if="item.value == '3'">{{allIntegralAccounted}}</p>
                  <p class="p1" v-if="item.value == '8'">{{allOilAccounted}}</p>
                  <p class="p1" v-if="item.value == '9'">{{allPeasAccounted}}</p>
                  <p class="p2" v-if="item.value != '0'">{{item.name}}</p>
                </div>
              </router-link>
              <router-link :to="{name:'micro_sho/cash_shop'}" v-if="item.value == '0'">
                <div>
                  <p class="p1">{{allMoneyAccounted}}</p>
                  <p class="p2">{{item.name}}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- 接口  A、员工 empFlag == 1  B、vue_config_microshop_index == 0    -->
      <div class="containerTop" v-if="$store.state.globalConfig.microshop_index != 1 && getPutaggregate.empFlag == 1">
        <div class="container">
          <div class="div">
            <div class="div1" @click="toRenovation">
              <img :src="getPutaggregate.pictureUrl?getPutaggregate.pictureUrl:$store.state.globalConfig.microshop_headurl" alt/>
              <span class="span">{{getPutaggregate.storeName?getPutaggregate.storeName:'我的小店'}}</span>
            </div>
            <div class="div2" @click="mallDetail">
              <img src="static/image/microShop/ma.png" alt />
              <span>店铺码</span>
            </div>
          </div>
          <div class="grayDiv" v-if="prizeView">
              <div class="prizeDiv" v-if="profitObj.integralWay == 3">
                <router-link :to="{name:'micro_sho/profit',params:{type: profitObj.integralWay}}">
                  <div>
                    <p class="p1">{{allIntegralAccounted}}</p>
                    <p class="p2">收益积分</p>
                  </div>
                </router-link>
              </div>
            <div class="prizeDiv" v-if="profitObj.oilWay == 8">
              <router-link :to="{name:'micro_sho/profit',params:{type: profitObj.oilWay}}">
                <div>
                  <p class="p1">{{allOilAccounted}}</p>
                  <p class="p2">收益油滴</p>
                </div>
              </router-link>
            </div>
            <div class="prizeDiv" v-if="profitObj.peasWay == 9">
              <router-link :to="{name:'micro_sho/profit',params:{type: profitObj.peasWay}}">
                <div>
                  <p class="p1">{{allPeasAccounted}}</p>
                  <p class="p2">收益豌豆</p>
                </div>
              </router-link>
            </div>
              <div class="prizeDiv" v-if="profitObj.moneyWay == 0">
                <router-link :to="{name:'micro_sho/profit',params:{type: profitObj.moneyWay}}" v-if="profitObj.moneyWay == 0">
                  <div>
                    <p class="p1">{{allMoneyAccounted}}</p>
                    <p class="p2">收益金额</p>
                  </div>
                </router-link>
              </div>
            </div>
        </div>
<!--        <div>-->
<!--          <p class="profits">累积微店收益</p>-->
<!--          <img class="qrcodeImg" @click="mallDetail" v-if="$store.state.globalConfig.microshop_index != 1" src="static/images/mycenter/qrcode.png" alt />-->
<!--        </div>-->
<!--        <router-link-->
<!--          :to="{name:'micro_sho/profit',params:{type: profitObj.integralWay}}"-->
<!--          v-if="profitObj.integralWay == 3"-->
<!--        >-->
<!--          <div>-->
<!--            <p>收益积分</p>-->
<!--            <p>-->
<!--              <span>{{profitObj.integralAccounted+profitObj.integralUnaccounted}}</span>积分-->
<!--              <span class="iconfont mall-gengduojiantou"></span>-->
<!--            </p>-->
<!--          </div>-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          :to="{name:'micro_sho/profit',params:{type: profitObj.oilWay}}"-->
<!--          v-if="profitObj.oilWay == 8"-->
<!--        >-->
<!--          <div>-->
<!--            <p>收益油滴</p>-->
<!--            <p>-->
<!--              <span>{{profitObj.oilAccounted+profitObj.oilUnaccounted}}</span>升-->
<!--              <span class="iconfont mall-gengduojiantou"></span>-->
<!--            </p>-->
<!--          </div>-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          :to="{name:'micro_sho/profit',params:{type: profitObj.peasWay}}"-->
<!--          v-if="profitObj.peasWay == 9"-->
<!--        >-->
<!--          <div>-->
<!--            <p>收益豌豆</p>-->
<!--            <p>-->
<!--              <span>{{profitObj.peasAccounted+profitObj.peasUnaccounted}}</span>个-->
<!--              <span class="iconfont mall-gengduojiantou"></span>-->
<!--            </p>-->
<!--          </div>-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          :to="{name:'micro_sho/profit',params:{type: profitObj.moneyWay}}"-->
<!--          v-if="profitObj.moneyWay == 0"-->
<!--        >-->
<!--          <div>-->
<!--            <p>收益金额</p>-->
<!--            <p>-->
<!--              <span>{{profitObj.moneyAccounted+profitObj.moneyUnacc ounted ? profitObj.moneyAccounted+profitObj.moneyUnaccounted : 0}}</span>元-->
<!--              <span class="iconfont mall-gengduojiantou"></span>-->
<!--            </p>-->
<!--          </div>-->
<!--        </router-link>-->
      </div>
    </div>
    <nav-content :style="navcontentStyleObj">
      <div ref="menuItem" class="menuItem" :style="contentStyleObj">
        <div class="enter">
          <div class="enterBox">
            <div @click="enterDetail('1')">
              <img src="static/image/microShop/icon32x.png" alt />
              <p>添加商品</p>
            </div>
            <div @click="enterDetail('2')">
              <img src="static/image/microShop/icon42x.png" alt />
              <p>商品管理</p>
            </div>
            <div @click="enterDetail('3')">
              <img src="static/image/microShop/icon52x.png" alt />
              <p>订单管理</p>
            </div>
            <div @click="enterDetail('4')">
              <img src="static/image/microShop/icon62x.png" alt />
              <p>店铺装修</p>
            </div>
            <div @click="enterDetail('5')" v-if="$store.state.globalConfig.microshop_groupbuying_exhibition == 1">
              <img src="static/image/microShop/add.png" alt />
              <p>新增团购商品</p>
            </div>
            <div @click="enterDetail('6')" v-if="$store.state.globalConfig.microshop_groupbuying_exhibition == 1">
              <img src="static/image/microShop/guanli.png" alt />
              <p>团购商品管理</p>
            </div>
            <div @click="enterDetail('7')" v-if="$store.state.globalConfig.microshop_sku_isquery == 1">
              <img src="static/image/microShop/shop.png" alt />
              <p>商品查询</p>
            </div>
          </div>
        </div>
        <div class="enterBoxList" v-if="$store.state.globalConfig.microshop_index != 1">
          <h2>月度收益排名</h2>
          <van-tabs v-model="title" @click="changeData">
            <van-tab :title="'积分'" v-if="profitObj.integralWay == 3">
              <div class="enterBoxListTitle">
                <span>姓名</span>
                <span>部门</span>
                <span>收益</span>
              </div>
              <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
              <ul v-if="rankingList.length>0">
                <li v-for="(item,index) in rankingList" v-if="index<5">
                  <div class="div1">
                    <p>
                      <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt />
                      <img class="img1" src="static/image/microShop/head@2x.png" v-else alt />
                      <span>
                        <img  v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt/>
                        <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt/>
                        <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt/>
                        <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt/>
                        <span class="num">第{{index+1}}名</span>
                      </span>
                    </p>
                    <span>{{item.employeeName}}</span>
                  </div>
                  <div>{{item.departmentName}}</div>
                  <div class="div3">{{item.rewardAccounted}}</div>
                </li>
              </ul>
              <router-link to="/micro_sho/profitlist" v-if="rankingList.length>0">
                <div class="more">查看更多</div>
              </router-link>
            </van-tab>
            <van-tab :title="'油滴'" v-if="profitObj.oilWay == 8">
              <div class="enterBoxListTitle">
                <span>姓名</span>
                <span>部门</span>
                <span>收益</span>
              </div>
              <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
              <ul v-if="rankingList.length>0">
                <li v-for="(item,index) in rankingList" v-if="index<5">
                  <div class="div1">
                    <p>
                      <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt />
                      <img class="img1" src="/static/image/microShop/head@2x.png" v-else alt />
                      <span>
                        <img v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt/>
                        <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt/>
                        <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt/>
                        <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt/>
                        <span class="num">第{{index+1}}名</span>
                      </span>
                    </p>
                    <span>{{item.employeeName}}</span>
                  </div>
                  <div>{{item.departmentName}}</div>
                  <div class="div3">{{item.rewardAccounted}}</div>
                </li>
              </ul>
              <router-link to="/micro_sho/profitlist" v-if="rankingList.length>0">
                <div class="more">查看更多</div>
              </router-link>
            </van-tab>
            <van-tab :title="'豌豆'" v-if="profitObj.peasWay == 9">
              <div class="enterBoxListTitle">
                <span>姓名</span>
                <span>部门</span>
                <span>收益</span>
              </div>
              <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
              <ul v-if="rankingList.length>0">
                <li v-for="(item,index) in rankingList" v-if="index<5">
                  <div class="div1">
                    <p>
                      <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt />
                      <img class="img1" src="static/image/microShop/head@2x.png" v-else alt />
                      <span>
                        <img v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt/>
                        <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt/>
                        <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt
                        />
                        <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt/>
                        <span class="num">第{{index+1}}名</span>
                      </span>
                    </p>
                    <span>{{item.employeeName}}</span>
                  </div>
                  <div>{{item.departmentName}}</div>
                  <div class="div3">{{item.rewardAccounted}}</div>
                </li>
              </ul>
              <router-link to="/micro_sho/profitlist" v-if="rankingList.length>0">
                <div class="more">查看更多</div>
              </router-link>
            </van-tab>
            <van-tab :title="'收益金额'" v-if="profitObj.moneyWay == 12">
              <div class="enterBoxListTitle">
                <span>姓名</span>
                <span>部门</span>
                <span>收益</span>
              </div>
              <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
              <ul v-if="rankingList.length>0">
                <li v-for="(item,index) in rankingList" v-if="index<5">
                  <div class="div1">
                    <p>
                      <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt />
                      <img class="img1" src="static/image/microShop/head@2x.png" v-else alt />
                      <span>
                        <img v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt/>
                        <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt/>
                        <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt/>
                        <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt/>
                        <span class="num">第{{index+1}}名</span>
                      </span>
                    </p>
                    <span>{{item.employeeName}}</span>
                  </div>
                  <div>{{item.departmentName}}</div>
                  <div class="div3">{{item.rewardAccounted}}</div>
                </li>
              </ul>
              <router-link to="/micro_sho/profitlist" v-if="rankingList.length>0">
                <div class="more">查看更多</div>
              </router-link>
            </van-tab>
          </van-tabs>
        </div>
        <div
          class="enterBoxList enterBoxListSku"
          v-if="$store.state.globalConfig.microshop_index == 1"
          id="skuList"
        >
          <div class="main">
            <div class="row-text">
              <div>
                <div
                  class="type-btn"
                  :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"
                  @click="selectedTypeEvent(item.tag)"
                  v-for="(item,index) in deliveryTypes"
                  :key="index"
                >
                  <i
                    class="iconfont theme_font_common icon-size"
                    :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"
                  ></i>
                  <span
                    class="theme_font_common"
                    :class="{theme_standard_font_i: selectedType == item.tag}"
                  >{{item.text}}</span>
                </div>
              </div>
              <div class="type-btn" @click="isRecommendBtn" v-if="getPutaggregate.empFlag == 1">
                <van-icon
                  :name="isRecommend ? 'arrow-up':'arrow-down'"
                  style="margin-right: 4px;margin-top: -3px;vertical-align:middle;"
                />
                <span>{{recommendText}}</span>
              </div>
            </div>
            <div class="screen">
              <div
                v-for="(screenItem,screenIndex) in screenArr"
                :key="screenIndex"
                class="btn"
                :class="{theme_standard_font_i: screenType == screenItem.type}"
                @click="screenBtn(screenItem)"
              >{{`${screenItem.name}（${screenItem.number}）`}}</div>
            </div>
            <list
              ref="list"
              @productEvent="productEvent"
              @addshare="addshareBtn"
              @listData="listData"
              @upperShelf="upperShelf"
              @deleteShare="deleteShare"
              :params="params"
              :styleObj="styleObj"
            ></list>
          </div>
        </div>
      </div>
    </nav-content>
    <!-- 分享 -->
    <Share
      v-if="popupShow"
      :shareObj="shareObj"
      @setshareData="setshareData"
      @qRcodeStstus="qRcodeStstus"
    />
    <van-action-sheet v-model="isRecommend" :actions="actions" @select="onSelect" />
    <van-action-sheet
      v-model="isThreePoints"
      :actions="threePointsArr"
      @select="onSelectPoints"
    />
  </div>
</template>

<script>
import api from "./api";
import list from "../common/list";
import Share from "../common/share.vue";
import { mapGetters } from "vuex";
export default {
  name: "shopIndex",
  mixins: [api],
  data() {
    return {
      active: 0,
      contentStyleObj: {
        "margin-top": "0px"
      },
      navcontentStyleObj: {
        top: "0px"
      },
      allIntegralAccounted: '',
      allOilAccounted: '',
      allPeasAccounted: '',
      allMoneyAccounted: '',
      type: "", //1是金额，2是积分,3是油滴，4是豌豆
      typeList: "",
      prizeList: [],
      profitObj: {},
      hasToSign: false,
      rewardType: "",
      rankingList: [],
      id: "",
      title: "",
      prizeView: false,
      is: true, //河南定制
      actions: [
        {
          name: "全部商品",
          value: ""
        },
        {
          name: "自主商品",
          value: "2"
        },
        {
          name: "推荐商品",
          value: "1"
        }
      ],
      itemAddshare: {},
      isThreePoints: false,
      threePointsArr: [],
      threePointsArrQB: [
        {
          name: '商品分享',
          value: '1'
        }
      ],
      threePointsArrZD: [
        {
          name: '商品下架',
          value: '0'
        },
        {
          name: '商品置顶',
          value: '2'
        },
      ],
      threePointsArrQZD: [
        {
          name: '商品下架',
          value: '0'
        },
        {
          name: '取消置顶',
          value: '2'
        }
      ],
      deliveryTypes: [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2"
        },
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1"
        }
      ],
      screenArr: [
        { name: "出售中", number: "0", type: 1 },
        { name: "已下架", number: "0", type: 2 },
        { name: "无效商品", number: "0", type: 0 }
      ],
      params: {
        page: 1,
        rows: "",
        queryTypeRecommend: "",
        deliverType: this.$store.state.mall2.staticDeliverType, // 配送方式 2快递运输 1上门自提 12都支持
        queryType: "1" // 查询类型 1 出售中 2 已下架 0 无效商品
      },
      styleObj: {
        listStyle: false,
        rowStyle: 3,
        isObject: 1,
        isHeight: "76",
        url: "/app/json/app_distribution_order/getProList"
      },
      isType: "",
      selectedType: this.$store.state.mall2.staticDeliverType,
      screenType: "1",
      showView: true,
      popupShow: false,
      shareObj: {
        popupShow: false,
        codeShow: false,
        deliveryType: this.$store.state.mall2.staticDeliverType
      },
      objData: {},
      isRecommend: false,
      recommendText: "全部商品",
      codeStstus: false
    };
  },
  mounted() {
    console.log(111,this.$store.state.globalConfig.microshop_groupbuying_exhibition,this.getPutaggregate); //默认为0不展示，为1展示
    if ((this.$store.state.globalConfig.microshop_index == 1 && this.getPutaggregate.empFlag == 1) || this.getPutaggregate.empFlag != 1) {
      this.loadgetReward();
    }
    this.loadIndex();
    // this.rankingIndex()
    console.log(this.getPutaggregate);
    if (this.$store.state.globalConfig.delivertype_default == "1") {
      this.deliveryTypes = [
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1"
        }
      ];
    } else if (this.$store.state.globalConfig.delivertype_default == "2") {
      this.deliveryTypes = [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2"
        }
      ];
    }
    // this.params.deliverType = this.$store.state.mall2.staticDeliverType;
    // this.selectedType = this.$store.state.mall2.staticDeliverType;
    // this.screenType = this.$store.state.microSho.screenType || '1';
    // this.params.queryType = this.$store.state.microSho.screenType || '1';
    this.backUUID = this.$util.randomString();
    this.listenAndriodBack();
    this.$bridgefunc.enterForegroundCallBack(() => {
      if (this.hasToSign) {
        this.checkSignResult();
      }
    });
  },
  components: {
    list,
    Share
  },
  computed: {
    ...mapGetters(["getPutaggregate", "userInfo"]),
    bg() {
      return require("../../../../static/image/microShop/up.png");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.codeStstus) {
      this.shareObj.codeShow = false;
    } else {
      if (this.popupShow) {
        this.popupShow = false;
      } else {
        next();
      }
    }
  },
  methods: {
    getInteger: function(price) {
      let str = this.$util.toDecimal2(price);
      let arr = str.split(".");
      return arr[0];
    },
    getDecimals: function(price) {
      let str = this.$util.toDecimal2(price);
      let arr = str.split(".");
      return arr[1];
    },
    enterDetail(data) {
      let path = "";
      let groupFlag = 0
      if (data == 1) {
        path = "/micro_sho/add_merchandise";
      } else if (data == 2) {
        path = "/micro_sho/commodity_management";
      } else if (data == 3) {
        path = "/micro_sho/order_management";
      } else if (data == 4) {
        path = "/micro_sho/renovation";
      } else if (data == 5) {
        path = "/micro_sho/add_merchandise";
        groupFlag = 1;
      } else if (data == 6) {
        path = "/micro_sho/commodity_management";
        groupFlag = 1;
      } else if (data == 7) {
        path = "/micro_sho/commodity_query";
      }
      this.$router.push({
        path: path,
        query: {
          groupFlag: groupFlag
        }
      });
    },
    loadIndex() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.profitData(params).then(res => {
        if (res.data.result === "success") {
          let data = res.data.data || {};
          that.profitObj = data;
          console.log(typeof that.profitObj.moneyAccounted);
          that.allIntegralAccounted = (Number(that.profitObj.integralAccounted) + Number(that.profitObj.integralUnaccounted)).toFixed() || 0,
          that.allOilAccounted = (Number(that.profitObj.oilAccounted) + Number(that.profitObj.oilUnaccounted)).toFixed() || 0,
          that.allPeasAccounted = (Number(that.profitObj.peasAccounted) + Number(that.profitObj.peasUnaccounted)).toFixed() || 0,
          that.allMoneyAccounted = (Number(that.profitObj.moneyAccounted) + Number(that.profitObj.moneyUnaccounted)).toFixed(2) || 0
          that.rankingIndex();
          if ((this.$store.state.globalConfig.microshop_index == 1 && this.getPutaggregate.empFlag == 1) || this.getPutaggregate.empFlag != 1) {
          } else {
            this.$nextTick(() => {
              if (this.profitObj.integralWay != 3 && this.profitObj.oilWay != 8 && this.profitObj.peasWay != 9 && this.profitObj.moneyWay != 0) {
                // this.navcontentStyleObj.top = "0px" + " " + "!important";
                this.navcontentStyleObj.top = "64px" + " " + "!important";
              } else {
                let height = that.$refs.elements.offsetHeight;
                console.log(height);
                that.contentStyleObj["margin-top"] = height + "px";
                that.prizeView = true
                that.navcontentStyleObj.top = "64px" + " " + "!important";
              }
            });

            // if (this.profitObj.integralWay != 3 && this.profitObj.oilWay != 8 && this.profitObj.peasWay != 9 && this.profitObj.moneyWay != 0) {
            //   this.contentStyleObj["margin-top"] = "200px";
            //   this.navcontentStyleObj.top = "0px" + " " + "!important";
            // } else {
            //   this.$nextTick(() => {
            //     let height = this.$refs.element.offsetHeight;
            //     this.contentStyleObj["margin-top"] = height + "px";
            //     this.navcontentStyleObj.top = "64px" + " " + "!important";
            //   });
            // }
          }
        }
      });
    },
    toRenovation() {
      this.$router.push({
        path: "/micro_sho/renovation"
      });
    },
    loadgetReward() {
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        queryType: "1",
        thirdFlag: "2"
      };
      that.getRewardData(params).then(res => {
        if (res.data.result === "success") {
          let data = res.data.data || [];
          that.prizeList = data;
          that.prizeList.forEach(item => {
            that.allIntegralAccounted = (Number(item.integralAccounted) + Number(item.integralUnaccounted)).toFixed(),
            that.allOilAccounted = (Number(item.oilAccounted) + Number(item.oilUnaccounted)).toFixed(),
            that.allPeasAccounted = (Number(item.peasAccounted) + Number(item.peasUnaccounted)).toFixed(),
            that.allMoneyAccounted = (Number(item.moneyAccounted) + Number(item.moneyUnaccounted)).toFixed(2)
          })

          this.$nextTick(() => {
            let height = this.$refs.element.offsetHeight;
            this.contentStyleObj["margin-top"] = height + "px";
            if (this.prizeList.length > 0) {
              this.navcontentStyleObj.top = "64px" + " " + "!important";
            } else {
              // this.navcontentStyleObj.top = "0px" + " " + "!important";
              this.navcontentStyleObj.top = "64px" + " " + "!important";
            }
          });
        }
      });
    },
    listenAndriodBack() {
      this.$bridgefunc.registeBridge("phonebridge", res => {
        let obj = JSON.parse(res);
        if (obj.type == this.backUUID) {
          this.backEvent();
        }
      });
    },
    checkSignResult: function() {
      // do check
      this.hasToSign = false;
    },
    backEvent() {
      if (this.$route.query.lastPath == "authentication") {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    },
    rankingIndex() {
      let that = this;
      if (that.profitObj.integralWay == 3) {
        that.rewardType = 3;
      } else if (that.profitObj.oilWay == 8) {
        that.rewardType = 8;
      } else if (that.profitObj.peasWay == 9) {
        that.rewardType = 9;
      } else if (that.profitObj.moneyWay == 12) {
        that.rewardType = 12;
      }
      let params = {
        token: this.$store.state.login.token,
        rewardType: that.rewardType
      };

      that.monthData(params).then(res => {
        if (res.data.result === "success") {
          let data = res.data.data || [];
          that.rankingList = data;
        }
      });
    },
    mallDetail() {
      let that = this;
      that.$router.push({
        path: "/micro_sho/microshopqrcode",
        query: {
          profitObj: JSON.stringify(that.profitObj)
        }
      });
    },
    changeData(index, title) {
      let that = this;
      that.rankingList = [];
      if (title == "积分") {
        that.rewardType = 3;
      } else if (title == "油滴") {
        that.rewardType = 8;
      } else if (title == "豌豆") {
        that.rewardType = 9;
      } else if (title == "收益金额") {
        that.rewardType = 12;
      }
      let params = {
        token: this.$store.state.login.token,
        rewardType: that.rewardType
      };

      that.monthData(params).then(res => {
        if (res.data.result === "success") {
          let data = res.data.data || [];
          that.rankingList = data;
        }
      });
    },
    qRcodeStstus(status) {
      this.codeStstus = status;
      console.log(1, this.codeStstus);
    },
    selectedTypeEvent(tag) {
      console.log(tag);
      this.selectedType = tag;
      this.shareObj.deliveryType = tag;
      this.$store.state.mall2.staticDeliverType = tag;
      if (this.selectedType == 2) {
        this.showView = true;
      } else {
        this.showView = false;
      }
      this.params.deliverType = tag;
      this.screenType = 1;
      this.params.queryType = "1";
    },
    screenBtn(item) {
      this.screenType = item.type;
      this.params.queryType = item.type;
      this.$store.state.microSho.screenType = item.type;
    },
    listData(item) {
      let obj = item.data || {};
      this.$set(this.screenArr[2], "number", obj.numsForInvalid);
      this.$set(this.screenArr[0], "number", obj.numsForSale);
      this.$set(this.screenArr[1], "number", obj.numsForSoldOut);
    },
    setshareData(item) {
      this.popupShow = false;
      this.shareObj = Object.assign({}, item);
    },
    upperShelf(item) {
      this.$messagebox.confirm("确定上架？", "提示").then(action => {
        this.$Loading.open();
        let url = "/app/json/app_distribution_order/updateProFromMicroStore";
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: item.skuId,
          storeId: this.getPutaggregate.id,
          status: "1"
        };
        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$Toast("上架成功！");
            this.$refs.list._loadProList(true);
          } else {
            this.$Toast(data.info);
          }
        });
      });
    },
    deleteShare(item) {
      this.$messagebox
        .confirm("该商品已经停止分销，是否要删除？", "提示")
        .then(action => {
          this.$Loading.open();
          let url = "/app/json/app_distribution_order/removeProFromMicroStore";
          let paramsData = {
            token: this.$store.state.login.token,
            storeId: this.getPutaggregate.id,
            proSkuDistributionId: item.proSkuDistributionId,
            skuId: item.skuId
          };
          this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast("删除成功！");
              this.$refs.list._loadProList(true);
            } else {
              this.$Toast(data.info);
            }
          });
        })
        .catch(() => {});
    },
    productEvent(product) {
      if (this.screenType == 0) {
        return;
      }
      let path = "/micro_sho/detail/" + this.$util.getDataString();
      this.$router.push({
        path: path,
        query: {
          id: product.skuId,
          skuId: product.skuId,
          lastPath: this.$route.path,
          deliveryType: this.$store.state.mall2.staticDeliverType,
          productType: product.productType,
          isRecommend: product.isRecommend,
          proSkuDistributionId: product.proSkuDistributionId,
          obj: {
            queryType: this.screenType
          }
        }
      });
    },
    // addshare(item) {
    //   this.shareObj = Object.assign({}, this.shareObj, item, {
    //     phMainUrl: item.mainMobilePicUrl,
    //     showTitle: item.skuName,
    //     dpedData: {
    //       linePrice: item.salePrice
    //     }
    //   });
    //   this.popupShow = true;
    //   this.shareObj.popupShow = true;
    // },
    addshareBtn(item) {
        this.isThreePoints = true
        this.itemAddshare = item
        if (item.isRecommend) {
            this.threePointsArr = [...this.threePointsArrQB, ...[{
                name: '取消',
                value: '-1'
            }]]
        } else {
            if (item.topFlag) {
                this.threePointsArr = [...this.threePointsArrQB, ...this.threePointsArrQZD, ...[{
                    name: '取消',
                    value: '-1'
                }]]
            } else {
                this.threePointsArr = [...this.threePointsArrQB, ...this.threePointsArrZD, ...[{
                    name: '取消',
                    value: '-1'
                }]]
            }
        }
    },
    onSelectPoints(item) {
        if (item.value == 0) {
            this.upDownMethod()
        } else if (item.value == 1) {
            this.shareObj = Object.assign({}, this.shareObj, this.itemAddshare, {
                phMainUrl: this.itemAddshare.mainMobilePicUrl,
                showTitle: this.itemAddshare.skuName,
                dpedData:{
                    linePrice: this.itemAddshare.salePrice
                }
            });
            this.popupShow = true;
            this.shareObj.popupShow = true;
        } else if (item.value == 2) {
            this.microStoreProTop()
        }
        this.isThreePoints = false
    },
    microStoreProTop() {
        this.$messagebox.confirm(`确定要操作该商品吗!`,"提示").then(action => {
            this.$Loading.open();
            this.$http.post("/app/json/app_distribution_order/microStoreProTop", {
                // id: this.itemAddshare.id,
                id: this.itemAddshare.microStoreProId
            }).then(res => {
                this.$Loading.close();
                if (res.data.status == 0) {
                    this.$Toast(`操作成功!`);
                    this.$refs.list._loadProList(this.params);
                } else {
                    this.$Toast(res.data.info);
                }
            });
        })
    },
    upDownMethod() {
        this.$messagebox.confirm(`确定要下架该商品吗!`,"提示").then(action => {
            this.$Loading.open();
            this.$http.post("/app/json/app_distribution_order/updateProFromMicroStore", {
                skuId: this.itemAddshare.skuId,
                storeId: this.getPutaggregate.id,
                status: 0
            }).then(res => {
                this.$Loading.close();
                if (res.data.status == 0) {
                    this.$Toast(`下架成功!`);
                    this.$refs.list._loadProList(this.params);
                } else {
                    this.$Toast(res.data.info);
                }
            });
        })
    },
    isRecommendBtn() {
      this.isRecommend = true;
    },
    onSelect(item) {
      this.recommendText = item.name;
      this.isRecommend = false;
      this.params.queryTypeRecommend = item.value;
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // position: absolute;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  // z-index: 50;
  /deep/ .nav-content {
    overflow-y: auto;
  }

  .navContent {
    margin-top: 164px !important;
  }

  .active {
    margin-top: 84px !important;
  }

  .head {
    // height: 180px;
    position: absolute;
    width: 100%;
    background-position: 50% 50%;
    background-size: 100% 100%;
    z-index: 5;
  }

  .isActive {
    height: 200px;
    position: absolute;
    width: 100%;
    background-position: 50% 50%;
    background-size: 100% 100%;
    z-index: 5;
  }

  .shareBox {
    float: right;
    display: flex;
    margin-right: 10px;
    justify-content: space-around;
    position: relative;
    z-index: 10;
    margin-top: 8px;

    div {
      width: 20px;

      img {
        width: 100%;
      }
    }
  }

  .container {
    width: 100%;
    background-position: 50% 50%;
    // background: url("../../../../static/image/microShop/down.png") no-repeat center;
    overflow: hidden;
    background-size: 100% 100%;

    .div {
      padding: 0 0 0 10px;
      display: flex;
      justify-content: space-between;
      color: white;
      margin: 15px 0;

      div {
        display: flex;

        span {
          margin: auto 7px;
        }

        .span {
          font-size: 15px;
          color black
        }
      }

      .div1 {
        img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
        }
      }

      .div2 {
        background: #f5d5d8;
        height: 32px;
        padding: 0 5px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        color: black;
        margin: auto 0;

        img {
          width: 20px;
          height: 20px;
          margin: auto 5px;
        }
      }
    }

    .grayDiv {
      width: 96%;
      display: flex;
      margin: 0 auto;
      padding: 20px 15px;
      color: white;
      background: #34332f;
      opacity: 0.9;
      justify-content: space-between;
      border-top-left-radius: 13px;
      border-top-right-radius: 13px;

      .prizeDiv {
        margin: auto;
      }

      span {
        width: 1px;
        height: 30px;
        background: #fff;
        margin: auto 5px;
      }

      a {
        margin: auto;

        div {
          text-align: center;
          color: white;

          .p1 {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
          }

          .p2 {
            font-size: 15px;
          }
        }
      }
    }
  }

  .containerTop {
    width: 100%;
    background-position: 50% 50%;
    // background: url("../../../../static/image/microShop/down.png") no-repeat center;
    overflow: hidden;
    background-size: 100% 100%;
    font-size: 18px;
    margin-top: 72px;
   .qrcodeImg {
     width: 24px;
     margin: auto 10px;
   }
    .profits {
      margin auto 0
    }
    div {
      // display flex;
      // justify-content space-between
      color: white;

      // padding: 0 15px;
      // margin: 20px 0;
      span {
        font-size: 15px;
        color: white;
        margin: auto 10px;
      }

      .iconfont {
        margin-left: 5px;
      }

      div:nth-child(1) {
        font-size: 18px;

        img {
          border-radius: 50%;
        }
      }

      div:nth-child(2) {
        font-size: 16px;
        border-top-left-radius: 13px;
        // height: 30px;
        margin: 0 auto;
        padding: 7px 0;

        img {
          width: 15px;
          height: 15px;
          margin: auto 0;
        }

        span {
          color: black;
        }
      }

      div:nth-child(3) {
        font-size: 16px;
        color: #ece3e5;
      }
    }
  }

  #containerTop {
    width: 100%;
    background-position: 50% 50%;
    // background: url("../../../../static/image/microShop/down.png") no-repeat center;
    overflow: hidden;
    background-size: 100% 100%;
    font-size: 18px;
    margin-top: 64px;

    div {
      display: flex;
      justify-content: space-between;
      color: blach;
      padding: 0 15px;
      margin: 20px 0;

      span {
        font-size: 15px;
        color: white;
        margin: auto 10px;
      }

      .iconfont {
        margin-left: 5px;
        color: white;
      }

      div:nth-child(1) {
        font-size: 18px;

        img {
          border-radius: 50%;
        }
      }

      div:nth-child(2) {
        font-size: 16px;
        padding: 0 5px;
        border-top-left-radius: 13px;
        height: 30px;
        margin: 0 auto;
        padding: 7px 0;

        img {
          width: 15px;
          height: 15px;
          margin: auto 0;
        }

        span {
          color: black;
        }
      }

      div:nth-child(3) {
        font-size: 16px;
        color: #ece3e5;
      }
    }
  }

  .enter {
    background-color: #f6f6f6 !important;
    padding: 10px 0;
    width: 100%;

    .enterBox::-webkit-scrollbar {
      display: none;
    }

    .enterBox {
      padding: 20px 0;
      display: flex;
      background: white;
      text-align: center;
      z-index: 100;
      padding: 10px 0;
      white-space: nowrap;
      overflow-y: auto;

      div {
        width: 49%;
        margin-left: 3%;
        background: #fff;
        padding: 0 12px;
        display: inline-block;
      }

      img {
        height: 40px;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: black;
      }
    }
  }
}

.enterBoxList {
  // margin 10px auto
  padding: 20px 0 0 0;
  background: white;
  // position: fixed;
  // top: 365px;
  // z-index: 99;
  width: 100%;

  h2 {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 16px;
  }

  .enterBoxListTitle {
    background: #f2f2f4;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    text-align: center;

    span {
      width: 30%;
      font-size: 15px;
    }

    span:nth-child(1) {
      width: 34%;
    }

    span:nth-child(3) {
      width: 26%;
    }
  }

  ul {
    li {
      display: flex;
      justify-content: space-between;
      text-align: center;
      font-size: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f2f2f4;

      div {
        width: 30%;
        margin: auto;
      }

      .div3 {
        width: 26%;
      }

      .div1 {
        display: flex;
        justify-content: space-between;
        width: 34%;

        span {
          margin: auto;
        }

        p {
          padding-left: 10px;

          .img1 {
            width: 40px;
            border-radius: 50%;
          }

          .num {
            color: white;
            margin-top: -15px;
            display: block;
            font-size: 12px;
          }

          .img2 {
            width: 68px;
            margin-top: -10px;
            display: block;
            margin-left: -8px;
          }
        }
      }

      .div3 {
        font-weight: 600;
      }
    }
  }

  .more {
    color: #595959;
    font-size: 14px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
}

.enterBoxListSku {
  padding: 0;
  height: calc(100% - 50px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;

  // position: absolute;
  // z-index: 0;
  // top: 300px;
  .scroll {
    pointer-events: auto;
    min-height: 966px;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}

.nullData {
  text-align: center;
  line-height: 80px;
  font-size: 16px;
}

/deep/ [class*=van-hairline]::after {
  border: 0 !important;
}

.main {
  height: calc(100% - 300px);

  .row-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;

    .type-btn {
      font-size: $font-size-medium;
      padding: 4px 10px;
      border-radius: 15px;
      border: 0.6px solid transparent;
      display: inline-block;

      .icon-size {
        font-size: $font-size-medium;
      }
    }
  }

  .screen {
    display: flex;
    justify-content: space-between;
    padding: 10px 24px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0px -2px 2px #efefef;
    border-radius: 10px;
  }

  /deep/ .row {
    box-shadow: inset 0 0 6px #efefef;
  }

  .skulist {
    // overflow-y: auto
  }
}

/deep/ .theme_bg_white {
  background-color: transparent !important;
}
</style>
