<template>
  <Modal v-model="show" title="链接中心" @on-ok="sureEvent" @on-visible-change="changeModal" :scrollable="true" width="800">
    <Row type="flex" justify="start" class="padding-bottom row-bottom-line">
      <Col span="24">
        <span class="row-label">链接类型</span>
        <RadioGroup v-model="linkData.type" @on-change="pageTypeChanged" v-if="clientType == 'BIGSCREEN'">
          <Radio label="101">大屏功能页面</Radio>
          <Radio label="102">大屏配置页面</Radio>
        </RadioGroup>
        <RadioGroup v-model="linkData.type" @on-change="pageTypeChanged" v-else>
          <template v-if="linkSelType == '0'">
            <Radio label="1">配置页面</Radio>
            <Radio label="2">功能页面</Radio>
            <Radio label="8">游戏</Radio>
            <Radio label="3">第三方页面</Radio>
            <Radio label="5">原生功能</Radio>
            <Radio label="6">其他系统对接</Radio>
            <Radio label="9">小程序跳转</Radio>
            <Radio label="10">特定功能</Radio>
            <Radio label="11">掌厅功能</Radio>
            <Radio label="99">未开通提示</Radio>
          </template>
          <Radio v-show="linkSelType == '1'" label="4">角标链接列表</Radio>
          <Radio v-show="linkSelType == '2'" label="7">配置区域页面</Radio>
          <Radio v-show="linkSelType == '3'" label="1">配置页面</Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding" v-if="linkSelType != '3'">
      <Col span="14">
        <!--<template v-if="linkData.type == '1' || linkData.type == '5' || linkData.type == '6' || linkData.type == '7'">-->
        <!--<Checkbox v-model="linkData.mustLogined">需要登录才能进入</Checkbox>-->
        <!--<Checkbox v-model="linkData.renderNav" disabled>需要源生渲染导航</Checkbox>-->
        <!--</template>-->
        <!--<template v-if="linkData.type == '2'">-->
        <!--<Checkbox v-model="linkData.mustLogined">需要登录才能进入</Checkbox>-->
        <!--<Checkbox v-model="linkData.renderNav">需要源生渲染导航</Checkbox>-->
        <!--</template>-->
        <!--<template v-if="linkData.type == '3'">-->
        <!--<Checkbox v-model="linkData.mustLogined" disabled>需要登录才能进入</Checkbox>-->
        <!--<Checkbox v-model="linkData.renderNav" disabled>需要源生渲染导航</Checkbox>-->
        <!--</template>-->
        <template>
          <Checkbox v-model="linkData.mustLogined">需要登录才能进入</Checkbox>
          <Checkbox v-model="linkData.renderNav">需要源生渲染导航</Checkbox>
          <Checkbox v-model="linkData.openByExternal">使用外部浏览器打开</Checkbox>
          <Checkbox v-model="linkData.useOldProtocal" v-if="linkData.type == '3'">使用老协</Checkbox>
          <Checkbox v-model="linkData.disTrust" v-if="linkData.type == '3'">不信任(默认信任)</Checkbox>
          <RadioGroup v-model="linkData.authorizationType" v-if="linkData.disTrust">
            <Radio label="0">不需要任何信息</Radio>
            <Radio label="youtu">友途授权页面</Radio>
          </RadioGroup>
        </template>
      </Col>
      <Col span="10">
        <Row type="flex" justify="end">
          <Form ref="formInline" :model="formInline" inline>
            <FormItem prop="user" class="no-margin">
              <Input type="text" v-model="formInline.name" placeholder="" @on-keydown.enter="search(formInline.name)">
              </Input>
            </FormItem>
            <FormItem class="no-margin">
              <Button type="primary" @click="search(formInline.name)">查询</Button>
            </FormItem>
          </Form>
        </Row>
      </Col>

    </Row>
    <!-- <div v-if="linkData.type == 3">
      <Row class="row-padding">请输入页面链接</Row>
      <Input v-model="linkData.url" placeholder="请输入您要打开的页面链接路径" style="width: 240px"></Input>
    </div> -->
    <!-- 1 配置页面 -->
    <template v-if="linkData.type == 1 && show">
      <Table border highlight-row ref="currentRowTable" :columns="pageColumns" :data="pageList"
             @on-current-change="pageSelected" height="290">
      </Table>
      <!-- <Row type="flex" justify="center" class="row-padding no-padding-bottom">
				<Page :total="200"></Page>
			</Row> -->
    </template>
    <!-- 2 固有功能 -->
    <template v-if="linkData.type == 2 && show">
      <Table border highlight-row ref="currentRowTable" :columns="funcColumns" :data="funcList"
             @on-current-change="pageSelected" height="290">
      </Table>
      <div style="color: red;padding: 5px 0;">功能页面已改成内置在程序内，如果需要增加，直接联系开发组，功能页面菜单废弃了！功能页面菜单废弃了！功能页面菜单废弃了！</div>
    </template>
    <!-- 3 第三方链接 -->
    <template v-if="linkData.type == 3 && show">
      <Table border highlight-row ref="currentRowTable" :columns="thirdListColumns" :data="thirdUrlList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--<div class="row" v-if="linkData.argsType == 'productdetail'">-->
    <!--<div class="edit-label">请选择商品</div>-->
    <!--<div class="edit-label product-select" @click="selectProduct">{{ myName != '' ? myName : '请选择商品' }}</div>-->
    <!--</div>-->
    <!-- 4 App获取角标连接列表 -->
    <template v-if="linkData.type == 4 && show">
      <Table border highlight-row ref="currentRowTable" :columns="markListColumns" :data="markList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--原生功能-->
    <template v-if="linkData.type == 5 && show">
      <Table border highlight-row ref="currentRowTable" :columns="thirdFuncColumns" :data="thirdFuncList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--易捷海购-->
    <template v-if="linkData.type == 6 && show">
      <Table border highlight-row ref="currentRowTable" :columns="dynamicFuncColumns" :data="dynamicFuncList"
             @on-current-change="pageSelected" height="290">
      </Table>
      <div class="other-link">
        <div class="tit">其他链接</div>
        <Input type="text" v-model="otherHGlink" placeholder="如果上面没有你要的链接，请自行维护">
        </Input>
      </div>
    </template>
    <!--配置的区域页面-->
    <template v-if="linkData.type == 7 && show">
      <Table border highlight-row ref="currentRowTable" :columns="pageColumns" :data="subPageList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--游戏-->
    <template v-if="linkData.type == 8 && show">
      <Table border highlight-row ref="currentRowTable" :columns="gamesColumns" :data="gamesList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--小程序跳转-->
    <template v-if="linkData.type == 9 && show">
      <RadioGroup v-model="xcxLinkType">
        <Radio label="1">自填连接（跳转小程序自带页面）</Radio>
        <Radio label="2">小程序跳转第三方小程序或APP跳转小程序</Radio>
      </RadioGroup>
      <div class="other-link" v-if="xcxLinkType == '1'">
        <div class="tit">小程序链接</div>
        <Input type="text" v-model="otherXCXlink" placeholder="如果上面没有你要的链接，请自行维护">
        </Input>
      </div>
      <div class="other-link" v-if="xcxLinkType == '2'">
        <div class="tit">小程序链接</div>
        <div class="tit2">/pages/openMp/main</div>
        <Input type="text" v-model="otherXCXId" placeholder="跳转小程序appId(APP跳转小程序请填写原始ID)"></Input>
        <Input type="text" v-model="otherXCXPath" placeholder="目标小程序路径"></Input>
      </div>
    </template>
    <!-- 特定扫码购功能 -->
    <template v-if="linkData.type == 10 && show">
      <Table border highlight-row ref="currentRowTable" :columns="thirdFuncColumns" :data="scanFuncList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!-- 掌厅功能选择 -->
    <template v-if="linkData.type == 11 && show">
      <Table border highlight-row ref="currentRowTable" :columns="ztFuncColumns" :data="ztFuncs" @on-current-change="pageSelected" height="290">
      </Table>
      <div style="color: red;padding: 5px 0;">"掌厅功能"已不再维护，建议不要使用这种方式配置了，可以直接在当前页面配置对应的链接！</div>
    </template>
    <template v-if="linkData.type == 99 && show">
      <div>
        <div class="other-link">
          <div class="tit">未开通提示语</div>
          <Input type="text" v-model="tipStr" placeholder="未开通提示语，不填提示默认提示"></Input>
        </div>
        <div class="complex-tip" @click="complexTip">复杂的弹窗提示</div>
      </div>
    </template>
    <!--下面是大屏的页面-->
    <template v-if="linkData.type == '101' && show">
      <Table border highlight-row ref="currentRowTable" :columns="bsGNColumns" :data="bsGNList"
             @on-current-change="pageSelected" height="290">
      </Table>
      <!-- <Row type="flex" justify="center" class="row-padding no-padding-bottom">
				<Page :total="200"></Page>
			</Row> -->
    </template>
    <template v-if="linkData.type == '102' && show">
      <Table border highlight-row ref="currentRowTable" :columns="bsPZColumns" :data="bsPZList"
             @on-current-change="pageSelected" height="290">
      </Table>
    </template>
    <!--<div class="row" v-if="linkData.argsType == 'productdetail'">-->
    <!--<div class="edit-label">请选择商品</div>-->
    <!--<div class="edit-label product-select" @click="selectProduct">{{ myName != '' ? myName : '请选择商品' }}</div>-->
    <!--</div>-->
    <div slot="footer">
      <Col span="2">
        <Button type="warning" @click="clearLink">清除链接</Button>
      </Col>
      <Button @click="show = false">取消</Button>
      <Button type="primary" @click="sureEvent">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import linkCenter from "@/utils/linkCenter";
  import {deepCopy} from "@/utils/util";
  import {mapGetters, mapMutations} from "vuex";

  export default {
    name: "link-center",
    components: {},
    props: ['clientType'],
    data() {
      return {
        images: [],
        selectedIdx: "-1",
        callback: function () {
          console.log("no callback");
        },
        show: false,
        refresh: true,
        sPageInfo: "",
        linkSelType: '0', // 0 普通的（包含 配置页面、功能页面、第三方页面、原生功能、动态第三方页面  1 角标链接列表  2 配置区域列表
        linkData: {
          type: "1",
          label: "",
          pgCode: "",
          url: "",
          name: "",
          argsType: "",
          mustLogined: false,
          renderNav: false,
          markUrl: ""
        },
        dynamicFuncList: [
          {
            label: '今日特价',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/activity.html?ac=rsXRkPx4GYT7l8OD&source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '美妆个护',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/activity.html?ac=fXLuIz3SUJPC2o0p&source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '时尚箱包',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/gallery-291.html?source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '奶粉尿裤',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/activity.html?ac=TGOBItBHJnahikW2&source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '食品保健',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/activity.html?ac=cLfXNqbNG2itzN2S&source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '品质生活',
            baseUrl: 'https://www.ejoy365hk.com/index.php/wap/activity.html?ac=26XgKNGZ38T1FeH1&source=Slg=',
            args: {},
            url: '/app/json/home/getEjoyLoginUrl',
          }, {
            label: '易旅行',
            baseUrl: 'https://member-test.yjylx.com/hbshRedirect.do',
            args: {
              sysTag: 'elvyo'
            },
            url: '/app/json/home/getExoLoginUrl',
          }],
        dynamicFuncColumns: [
          {
            title: "名称",
            key: "label"
          },
          {
            title: "base链接",
            key: "baseUrl"
          },
          {
            title: "api",
            key: "url"
          }
        ],
        thirdFuncList: [{
          label: '客服中心',
          code: 'chatservice'
        }, {
          label: '易捷汽服',
          code: 'yijieqifu'
        }, {
          label: '一键加油',
          code: 'yijianjiayou',
          argsType: 'yijianjiayou'
        }, {
          label: '油惠通我的积分',
          code: '200018'
        }, {
          label: '油惠通加油记录',
          code: '200019'
        }, {
          label: '油惠通邀请好友',
          code: '200021'
        }, {
          label: '油惠通关于我们',
          code: '200005'
        }, {
          label: '油惠通会员资料（新增）',
          code: '200030'
        }, {
          label: '油惠通加油卡',
          code: '100004'
        }, {
          label: '油惠通积分荟',
          code: '100008'
        }],
        thirdFuncColumns: [
          {
            title: "名称",
            key: "label"
          },
          {
            title: "key",
            key: "code"
          },
          {
            title: "argsType",
            key: "argsType"
          }
        ],
        ztFuncColumns: [
          {
            title: "名称",
            key: "urlName"
          },
          {
            title: "code",
            key: "funcCode"
          },
          {
            title: "funcUrl",
            key: "funcUrl"
          }
        ],
        scanFuncList: [
          {
            label: '扫码加油',
            code: 'saomajiayou',
            argsType: ''
          },
          {
            label: '离线支付',
            code: 'offlinepay',
            argsType: ''
          },
          {
            label: '会员卡加入ios卡包',
            code: 'addioscardbag',
            argsType: ''
          },
          {
            label: '会员卡加入微信卡包',
            code: 'addwxcardbag',
            argsType: ''
          },
          {
            label: '扫一扫',
            code: 'showScan',
            argsType: ''
          },
          {
            label: '商品按钮事件',
            code: 'productBtnEvent',
            argsType: ''
          },
          {
            label: '跳转到第三方APP',
            code: 'tothirdapp',
            argsType: 'tothirdapp'
          }
        ],
        myName: "",
        urlList: [],
        formInline: {
          name: ""
        },
        pageColumns: [
          {
            title: "名称",
            key: "label"
          },
          {
            title: "创建时间",
            key: "createTime"
          },
          {
            title: "修改时间",
            key: "modifyTime"
          }
        ],
        funcColumns: [
          {
            title: "名称",
            key: "label"
          },
          {
            title: "链接",
            key: "url"
          },
          {
            title: "code(支持底部导航)",
            key: "code"
          },
          {
            title: "需要参数支持",
            key: "argsType"
          }
        ],
        thirdListColumns: [
          {
            title: "名称",
            key: "name"
          },
          {
            title: "链接",
            key: "url"
          }
        ],
        gamesColumns: [
          {
            title: "类型",
            key: "game_selector_type"
          },
          {
            title: "名称",
            key: "name"
          },
          {
            title: "alias",
            key: "alias"
          },
          {
            title: "gameAwardRuleCategoryId",
            key: "gameAwardRuleCategoryId"
          }
        ],
        markListColumns: [
          {
            title: "链接名称",
            key: "urlName"
          },
          {
            title: "链接地址",
            key: "url"
          }
        ],
        bsGNColumns: [
          {
            title: "名称",
            key: "label"
          },
          {
            title: "链接",
            key: "url"
          },
          {
            title: "code(支持底部导航)",
            key: "code"
          },
          {
            title: "需要参数支持",
            key: "argsType"
          }
        ],
        bsPZColumns: [
          {
            title: "id",
            key: "id"
          },
          {
            title: "name",
            key: "name"
          },
          {
            title: "修改时间",
            key: "modifyTime"
          },
          {
            title: "屏幕高*宽",
            key: "heightAndWidth"
          }
        ],
        funcList: [],
        thirdUrlList: [],
        pageList: [],
        subPageList: [],
        gamesList: [],
        bsGNList: [],
        bsPZList: [],
        ztFuncs: [],
        otherHGlink: '',
        otherXCXlink: '',
        otherXCXId: '',
        xcxLinkType: '1',
        otherXCXPath: '',
        tipStr: ''
      };
    },
    computed: {
      ...mapGetters(["markDialog"])
    },
    methods: {
      complexTip: function () {
        this.linkData.name = '复杂弹窗提示'
        let d = deepCopy(this.linkData);
        Bus.$emit('showComplexTip', {
          linkData: d,
          callback: this.callback
        })
        this.linkData = {
          type: "1",
          label: "",
          pgCode: "",
          url: "",
          name: "",
          argsType: "",
          mustLogined: false,
          renderNav: false,
          markUrl: ""
        }
        this.show = false;
        this.callback = function () {
          console.log("no callback");
        };
      },
      clearLink: function () {
        this.linkData = {
          type: "1",
          label: "",
          pgCode: "",
          url: "",
          name: "",
          argsType: "",
          mustLogined: false,
          renderNav: false,
          markUrl: ""
        }
        let d = deepCopy(this.linkData);
        this.callback(d);
        this.show = false;
        this.callback = function () {
          console.log("no callback");
        };
      },
      changeModal: function (params) {
        // if (params) {
        //   if (this.markDialog) {
        //     this.linkData.type = "4";
        //   } else {
        //     this.linkData.type = "1";
        //   }
        // } else if (!params) {
        //   this.setMarkDialog(false);
        // }
      },
      selectProduct: function () {
      },
      pageTypeChanged: function (value) {
        if (value == '11') {
          this.$Toast('"掌厅功能"已不再维护，建议不要使用这种方式配置了，可以直接在当前页面配置对应的链接！')
        }
        this.linkData = {
          type: value,
          pgCode: "",
          mustLogined: false,
          renderNav: false
        };
        this.sPageInfo = "";
        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
      pageSelected: function (data) {
        this.otherHGlink = ''
        this.otherXCXlink = ''
        this.linkData.name = data.label ? data.label : "";
        this.linkData.url = data.url;
        this.linkData.pgCode = data.pgCode ? data.pgCode : "";
        this.linkData.argsType = data.argsType ? data.argsType : "";
        this.linkData.code = data.code ? data.code : "";
        this.linkData.baseUrl = data.baseUrl ? data.baseUrl : "";
        if (this.linkData.type == "4") {
          this.linkData.url = "";
          this.linkData.markUrl = data.url;
        } else if (this.linkData.type == '8') {
          this.linkData.name = data.name
          this.linkData.gameType = data.gameType
          if (data.game_selector_type == '游戏') {
            this.linkData.gameTypeCode = data.gameTypeCode
            this.linkData.gameTypeCategoryId = ''
          } else {
            this.linkData.gameTypeCode = ''
            this.linkData.gameTypeCategoryId = data.id
          }
        } else if (this.linkData.type == '6') {
          this.linkData.args = data.args
        } else if (this.linkData.type == '11') {
          this.linkData.code = data.funcCode ? data.funcCode : "";
          this.linkData.name = data.urlName ? data.urlName : "";
        } else if (this.linkData.type == '102') {
          this.linkData.pgCode = data.code ? data.code : "";
          this.linkData.name = data.name ? data.name : "";
        }
      },
      sureEvent: function () {
        if (this.linkData.argsType == "productdetail") {
          Bus.$emit("showProductCenter", {
            type: "radio",
            deliveryTypeSelecter: '1',
            title: "商品中心",
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.skuName;
                this.linkData.args = {
                  id: item.id,
                  skuId: item.skuId,
                  deliveryType: item.deliverType,
                  productType: item.productType
                };
                // 用户指定配送方式
                if (item.shareDeliveryType == '1') {
                  this.linkData.args.shareDeliveryType = item.shareDeliveryType
                  this.linkData.name += "-自提"
                } else if (item.shareDeliveryType == '2') {
                  this.linkData.args.shareDeliveryType = item.shareDeliveryType
                  this.linkData.name += "-配送"
                }
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            }
          });
        } else if (this.linkData.argsType == "productlist_cate") {
          Bus.$emit("showCateCenter", {
            fn: item => {
              this.linkData.name = this.linkData.name + "-" + item.name;
              this.linkData.args = {
                category: item.cate.id,
                cateLevel: item.cate.cateLevel,
                clsType: item.cate.clsType,
                categoryName: item.cate.name
              };
              let d = deepCopy(this.linkData);
              this.callback(d);
              this.show = false;
              this.callback = function () {
                console.log("no callback");
              };
            }
          });
        } else if (this.linkData.argsType == "productlist_catelist") {
          Bus.$emit("showCateCenter", {
            multiple: '2',
            backCates: [],
            fn: item => {
              let arr = []
              if (item.backCates) {
                for (let i = 0; i < item.backCates.length; i++) {
                  arr.push(item.backCates[i].id)
                }
              }
              this.linkData.name = this.linkData.name + "-" + item.name;
              this.linkData.args = {
                categoryIdList: JSON.stringify(arr)
              };
              let d = deepCopy(this.linkData);
              this.callback(d);
              this.show = false;
              this.callback = function () {
                console.log("no callback");
              };
            }
          });
        } else if (this.linkData.argsType == "productlist_activity") {
          Bus.$emit('showActivityCenter', {
            pageType: this.editType ? 'productInfinite' : '',
            isMultiple: false,
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.name;
                this.linkData.args = {
                  pageType: 'activity',
                  activity: item.activity.activityId,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "productlist_channel") {
          Bus.$emit('showChannelCenter', {
            pageType: '',
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.name;
                this.linkData.args = {
                  dataType: 'channel',
                  channelGroupId: item.id,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "productlist_filter") {
          Bus.$emit('showFilterCenter', {
            pageType: '',
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name;
                this.linkData.args = item.args;
                this.linkData.args.dataType = 'filter'
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "bspro_activity") {
          Bus.$emit('showBSProActivityCenter', {
            pageType: '',
            isMultiple: false,
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.name;
                this.linkData.args = {
                  pageType: 'activity',
                  activityId: item.activity.id,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "shop_oucode") {
          Bus.$emit('showShopCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.storeName;
                this.linkData.args = {
                  storeOuCode: item.storeCode,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "shop_samecity_oucode") {
          Bus.$emit('showShopCenterSamecity', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.storeName;
                this.linkData.args = {
                  storeOuCode: item.storeCode,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "news_detail") {
          Bus.$emit('showNewsCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.title;
                this.linkData.args = {
                  id: item.id,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "yijianjiayou") {
          Bus.$emit('showYJJYCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.source;
                this.linkData.args = {
                  source: item.source,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "tothirdapp") {
          Bus.$emit('showJumpAppCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.source;
                this.linkData.args = {
                  jumpScheme: item.jumpScheme,
                  url: item.jumpUrl,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "agreement_value") {
          Bus.$emit('showAgreementValue', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.xyvalue;
                this.linkData.args = {
                  value: item.xyvalue,
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "vocational_certification_args") {
          Bus.$emit('showVocationCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.clusterName;
                this.linkData.args = {
                  id: item.id
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "coupon_activity") {
          Bus.$emit('showActivityCouCenter', {
            fn: item => {
              if (item) {
                this.linkData.name = this.linkData.name + "-" + item.activity.activityName;
                this.linkData.args = {
                  id: item.activity.activityId
                };
                let d = deepCopy(this.linkData);
                this.callback(d);
                this.show = false;
                this.callback = function () {
                  console.log("no callback");
                };
              }
            },
          });
        } else if (this.linkData.argsType == "coupon_coutypecode") {
          Bus.$emit('showActivityCouCenter', {
            fn: item => {
              if (item) {
                let activityId = item.activity.activityId
                let activityName = item.activity.activityName
                Bus.$emit('showActivityCouList', {
                  activityId: activityId,
                  fn: item => {
                    if (item) {
                      this.linkData.name = this.linkData.name + "-" + activityName  + "-" + item.name ;
                      this.linkData.args = {
                        activityId: activityId,
                        couTypeCode: item.coupon.couTypeCode
                      };
                      let d = deepCopy(this.linkData);
                      this.callback(d);
                      this.show = false;
                      this.callback = function () {
                        console.log("no callback");
                      };
                    }
                  },
                });
              }
            },
          });
        } else {
          if (this.linkData.type == '6' && this.otherHGlink != '') {
            // this.otherHGlink = ''
            this.linkData.name = '其他易捷海购页面'
            this.linkData.baseUrl = this.otherHGlink
            this.linkData.url = '/app/json/home/getEjoyLoginUrl'
          } else if (this.linkData.type == '99') {
            if (this.xcxLinkType == '1') {
              this.linkData.name = '暂未开通-' + this.tipStr
              this.linkData.tipStr = this.tipStr
            }
          } else if (this.linkData.type == '9') {
            if (this.xcxLinkType == '1' && this.otherXCXlink != '') {
              this.linkData.name = '用户输入的链接'
              this.linkData.url = this.otherXCXlink
            } else if (this.xcxLinkType == '2' && this.otherXCXId != '') {
              Bus.$emit('showImgCenter', item => {
                if (item) {
                  this.linkData.name = '用户输入的链接'
                  this.linkData.wxPath = this.otherXCXPath
                  this.linkData.wxAppId = this.otherXCXId
                  this.linkData.url = '/pages/openMp/main?xcxId=' + encodeURIComponent(this.otherXCXId) + '&imgUrl=' + encodeURIComponent(item.url) + '&path=' + encodeURIComponent(this.otherXCXPath);
                  let d = deepCopy(this.linkData);
                  this.callback(d);
                  this.show = false;
                  this.callback = function () {
                    console.log("no callback");
                  }
                }
              });
              return
            }
          }
          delete this.linkData.args;
          let d = deepCopy(this.linkData);
          this.callback(d);
          this.show = false;
          this.linkData = {
            type: "1",
            label: "",
            pgCode: "",
            url: "",
            name: "",
            argsType: "",
            mustLogined: false,
            renderNav: false,
            markUrl: "",
            baseUrl: ''
          }
          this.callback = function () {
            console.log("no callback");
          };
        }
      },
      // 查询
      search: function (name) {
        if (this.linkData.type == 1) {
          this._vueGetPageList("1", name);
        } else if (this.linkData.type == 2) {
          this._vueGetFuncList("1", name);
        } else if (this.linkData.type == 11) {
          this._ztFuncs("1", name);
        } else {
          this.$Message.info("数量太少，就不支持搜索了！");
        }
        // if (this.linkData.type == 2) {
        //   this._vueGetFuncList("1", name);
        // }
        // if (this.linkData.type == 3) {
        //   this._vueGetThirdUrlList("1", name);
        // }
      },
      // app 查询页面
      _vueGetPageList: function (pageNum = "1", name) {
        this.$Spin.show();
        let url = "/system/json/app_page_conf/vueGetPageList";
        let paramsData = {
          token: this.$store.state.login.token,
          // ouCode: '',
          name: name,
          // pageIndex: pageNum,
          // pageSize: 10,
          // appType: '2',
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.status == 0 && data.data.length > 0) {
              this.pageList = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // app 区域配置页面
      _vueGetDivPageList: function (pageNum = "1", name) {
        this.$Spin.show();
        let url = "/system/json/app_page_conf/vueGetPageList";
        let paramsData = {
          token: this.$store.state.login.token,
          name: name,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.status == 0 && data.data.length > 0) {
              this.subPageList = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // 大屏配置页面
      _vueGetBSPageList: function (pageNum = "1", name) {
        this.$Spin.show();
        let url = "/system/jqGrid/app_page_conf/getAppPushPageList?appLayoutPage.appType=3";
        let paramsData = {
          token: this.$store.state.login.token
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.status == 0 && data.data.length > 0) {
              this.bsPZList = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // app查询固有功能
      _vueGetFuncList: function (pageNum = "1", name) {
        this.funcList = linkCenter.getFunctionLinks()
        if (name) {
          let arr = [];
          for (let i = 0; i < this.funcList.length; i++) {
            let item = this.funcList[i]
            if (item.label.indexOf(name) != -1 || item.url.indexOf(name) != -1) {
              arr.push(item);
            }
          }
          this.funcList = arr;
        }
        // this.$Spin.show();
        // let url = "/system/json/app_page_conf/vueGetFuncList";
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   ouCode: "",
        //   name: name,
        //   pageIndex: pageNum,
        //   pageSize: 100
        // };
        // this.$http.post(url, params).then(
        //   res => {
        //     this.$Spin.hide();
        //     let data = res.data;
        //     if (data.status == 0) {
        //       this.funcList = data.data;
        //     }
        //   },
        //   error => {
        //     this.$Message.error("网络加载较慢，请稍后重试!");
        //   }
        // );
      },
      // app查询第三方链接
      _vueGetThirdUrlList: function (pageNum = "1", name) {
        this.$Spin.show();
        let url = "/system/json/app_page_conf/vueGetThirdUrlList";
        let paramsData = {
          token: this.$store.state.login.token,
          ouCode: "",
          thirdUrlName: name,
          pageIndex: pageNum,
          pageSize: 100
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.status == 0) {
              this.thirdUrlList = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // App获取角标连接列表
      _vueGetAngleUrlList: function () {
        this.$Spin.show();
        let url = "/system/json/app_page_conf/vueGetAngleUrlList";
        let paramsData = {
          token: this.$store.state.login.token,
          ouCode: ""
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.status == 0) {
              this.markList = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // 游戏获取
      _vueGetGames: function () {
        this.gamesList = []
        let url = "/system/jqGrid/game_manage/getGameTypeCategoryList";
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.gamesList.push({
                name: '签到',
                alias: 'sign_in',
                gameType: 'sign_in',
                game_selector_type: '游戏类型'
              })
              for (let i = 0; i < data.data.length; i++) {
                let item = data.data[i]
                item.game_selector_type = '游戏类型'
                this.gamesList.push(item)
              }
              this._vueGetGames1();
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // 游戏获取
      _vueGetGames1: function () {
        // 任务 9192 【安徽营销平台】，砸金蛋活动修改
        // 后台必须升级才有，否则没法选择对应的活动
        let url = "/system/jqGrid/game_manage/queryGameTypeListByOuCode";
        let paramsData = {
          state: 1,
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0 && data.data) {
              for (let i = 0; i < data.data.length; i++) {
                let item = data.data[i]
                item.game_selector_type = '游戏'
                item.name = item.gameTypeTitle
                this.gamesList.push(item)
              }
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      // 掌厅功能
      _ztFuncs: function (pageNum = "1", name) {
        let url = "/system/json/app_page_conf/getThirdUrlList";
        let paramsData = {
          state: 1,
          token: this.$store.state.login.token,
          channelUrl: 'link-configuration',
          name: name,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.ztFuncs = data.data;
            }
          },
          error => {
            this.$Message.error("网络加载较慢，请稍后重试!");
          }
        );
      },
      ...mapMutations({
        setMarkDialog: "setMarkDialog"
      })
    },
    created() {
      Bus.$on("showLinkCenter", data => {
        this.otherHGlink = ''
        this.otherXCXlink = ''
        this.show = true;
        this.linkSelType = data.linkSelType ? data.linkSelType : '0';
        if (data.linkSelType == '0') {
          this.linkData.type = '1'
        } else if (data.linkSelType == '1') {
          this.linkData.type = '4'
        } else if (data.linkSelType == '2') {
          this.linkData.type = '7'
        } else if (data.linkSelType == '3') {
          this.linkData.type = '1'
        }
        if (this.clientType == 'BIGSCREEN') {
          this.linkData.type = '101'
        }
        if (data.linkData && data.linkData != null && data.linkData != undefined && data.linkData.type && data.linkData.type != null && data.linkData.type != undefined && data.linkData.type != '') {
          this.linkData = JSON.parse(JSON.stringify(data.linkData))
        }
        this.callback = data.callback ? data.callback : () => {
          console.log("no callback");
        };
      });
      // this.urlList = linkCenter.getCustomLinks();
      this._vueGetFuncList();
      this._vueGetPageList();
      this._vueGetThirdUrlList();
      this._vueGetAngleUrlList();
      this._vueGetGames();
      this._vueGetDivPageList();
      this._vueGetBSPageList()
      this._ztFuncs()

      this.bsGNList = linkCenter.getBsGnLinks()
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .link-center {
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    overflow: hidden;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -160px;
      margin-left: -210px;
      height: 320px;
      width: 420px;
      border-radius: 20px;
      padding: 20px;
      background-color: white;

      .title {
        font-size: 18px;
      }

      .row {
        margin: 4px 0px;
      }

      .all-line {
        display: block;
        padding: 4px 12px 0px;
      }

      .edit-label {
        padding: 10px 15px;
        display: inline-block;
        vertical-align: middle;
      }

      .product-select {
        color: blue;
      }

      .images {
        margin-top: 10px;
        height: 490px;
        overflow-x: hidden;
        overflow-y: auto;

        .item-div {
          float: left;
          margin-left: 8px;
          width: 100px;
          height: 130px;

          img {
            width: 100%;
          }

          p {
            text-align: center;
          }
        }

        .action {
          position: relative;
          border: 1px solid red;

          .size {
            position: absolute;
            left: 0px;
            top: 0px;
            font-size: 10px;
            padding: 5px;
          }
        }
      }

      .btns-div {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 20px;
        height: 40px;
        text-align: center;
      }
    }
  }

  .other-link {
    padding 10px;
    display flex;
    align-items center;

    .tit {
      width 120px;
      font-size 12px;
      padding-right 20px;
    }

    .tit2 {
      width 200px;
      font-size 12px;
      padding-right 20px;
    }

    .text {
      flex 1;
    }
  }
  .complex-tip {
    margin-top 20px;
    padding 10px;
    font-size 14px;
    color #2d8cf0;
  }
</style>
