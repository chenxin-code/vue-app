<template>
  <EditLayout title="编辑属性-商品">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Checkbox v-model="pageCurrentData.hasDeliverTabs" @on-change="hasDeliverTabsEvent">
        <span>显示自提配送切换</span>
      </Checkbox>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Checkbox v-model="pageCurrentData.hasFilters" @on-change="hasDeliverTabsEvent">
        <span>显示筛选条件组</span>
      </Checkbox>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Checkbox v-model="pageCurrentData.enableNewTabStyle">
        <span>多个tab时启用新到tab样式</span>
      </Checkbox>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <span class="row-label row-label__max">商品设置</span>
    </Row>
    <div class="padding-left">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="6">
          指定配送方式
        </Col>
        <Col span="16">
          <RadioGroup v-model="pageCurrentData.onlyDeliveryType" @on-change="onlyDeliveryTypeChanged">
            <Radio :label="0">
              <span>都支持</span>
            </Radio>
            <Radio :label="1">
              <span>仅支持自提</span>
            </Radio>
            <Radio :label="2">
              <span>仅支持配送</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row type="flex" justify="start" class="row-padding">
        <Col span="24">
          <span class="row-label">商品来源</span>
          <RadioGroup v-model="pageCurrentData.useApi" @on-change="useApiChanged">
            <Radio :label="1" v-if="editType != '1'">
              <span>商品</span>
            </Radio>
            <Radio :label="2">
              <span>商品分类</span>
            </Radio>
            <Radio :label="3">
              <span>促销活动</span>
            </Radio>
            <Radio :label="4">
              <span>营销频道组</span>
            </Radio>
            <!--<Radio :label="10">-->
              <!--<span>AI算法集</span>-->
            <!--</Radio>-->
          </RadioGroup>
        </Col>
      </Row>
      <template v-if="pageCurrentData.useApi == 1">
        <Row class="row-padding row-bottom-line">
          <Col span="24" class="card">
            <template v-if="!isDefault">
              <div class="draggable-tip">程序员哥哥呕心沥血，现已支持拖拽排序！！！</div>
              <draggable :list="rows" @end="dragEnd">
                <div class="product-icon-box" v-for="(item,index) in rows" :key="item.skuId">
                  <span @click="deleteProduct(item,index)" class="product-delete">X</span>
                  <img :src="item.phMainUrl" width="70px" height="70px">
                </div>
              </draggable>
            </template>
            <img width="70px" height="70px" @click="selectProduct" src="static/images/addimg.jpg">
          </Col>
        </Row>
      </template>
      <template v-if="pageCurrentData.useApi == 2">
        <div class="row-padding row-bottom-line">
          <div class="card">
            <Row>
              <Col span="24">
                <a @click.prevent="cateEvent" href="">{{pageCurrentData.productFrom.name == '' ? '请选择分类' :
                  pageCurrentData.productFrom.name + ' - 取前' + pageCurrentData.productFrom.number + '个'}}</a>
              </Col>
            </Row>
          </div>
        </div>
      </template>
      <template v-if="pageCurrentData.useApi == 3">
        <div class="row-padding row-bottom-line">
          <div class="card">
            <Row>
              <Col span="24">
                <a @click.prevent="activityEvent" href="">{{pageCurrentData.productFrom.name == '' ? '请选择活动' :
                  pageCurrentData.productFrom.name + ' - 取前' + pageCurrentData.productFrom.number + '个'}}</a>              </Col>
            </Row>
            <Row type="flex" justify="start" align="middle" class="row-padding">
              <Checkbox v-model="pageCurrentData.showTabs" @on-change="showTabsEvent">
                <span>显示tabs</span>
              </Checkbox>
            </Row>
            <div class="row-padding" v-for="(item, idx) in pageCurrentData.tabs">
              <div class="card">
                <Row type="flex" justify="start" align="middle" class="row-padding">
                  <Col span="6">
                    tab标题
                  </Col>
                  <Col span="16">
                    <Input v-model="item.title" placeholder="请输入tab标题" style="width: 260px"></Input>
                  </Col>
                </Row>
                <Row type="flex" justify="start" align="middle" class="row-padding">
                  <Col span="6">
                    筛选积分段
                  </Col>
                  <Col span="16">
                    <Input v-model="item.sectionStr" placeholder="如：*-*，0-499，500-999，1000-*" style="width: 260px"></Input>
                  </Col>
                </Row>
                <Row type="flex" justify="start" class="row-padding">
                  <Col span="6">
                    tab子分类
                  </Col>
                  <Col span="16">
                    <CheckboxGroup v-model="item.cates" @on-change="selectedSubCates">
                      <Checkbox :label="cate.id" v-for="cate in activitySubCates" :key="cate.id">{{cate.name}}</Checkbox>
                    </CheckboxGroup>
                  </Col>
                </Row>
              </div>
            </div>
            <div class="card" @click="addTab" v-if="pageCurrentData.showTabs">
              添加一个tab项
            </div>
          </div>
        </div>
      </template>
      <template v-if="pageCurrentData.useApi == 4">
        <div class="row-padding row-bottom-line">
          <div class="card">
            <Row>
              <Col span="24">
                <a @click.prevent="channelEvent" href="">{{
                  (pageCurrentData.productFrom.name == ''
                    ? '请选择频道组'
                    : pageCurrentData.productFrom.number>0
                    ? pageCurrentData.productFrom.name + (editType=='1' ? ' - 每页'+pageCurrentData.productFrom.number+'个 - 上拉加载更多' : ' - 取前' + pageCurrentData.productFrom.number + '个')
                    : pageCurrentData.productFrom.name)
                }}</a>
                <!--<a @click.prevent="aiEvent" href=""></a>-->
                <!--敬请期待！（如：热门商品，用户喜好，用户关注品牌，用户价格区间）-->
              </Col>
            </Row>
          </div>
        </div>
      </template>
      <Row class="row-padding row-bottom-line">
        <Col span="3"> 列表样式
        </Col>
        <Col span="19">
          <RadioGroup class="radio-list no__margin-bottom" v-model="pageCurrentData.type">
            <Radio label="1">
              <span>大图</span>
            </Radio>
            <!--<Radio label="2">-->
            <!--<span>小图</span>-->
            <!--</Radio>-->
            <Radio label="3" v-if="editType != '1'">
              <span>横滑</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div class="row-padding" v-if="pageCurrentData.type == '3'">
        <Row type="flex" justify="start" align="middle" class="row-padding">
          <Col span="3"> 标题图片
          </Col>
          <Col offset="1" span="18">
            <div class="image-div" @click="changeImg">
              <div class="clear-btn" v-if="pageCurrentData.titleImg != ''" @click.stop="removeProductTitleImg">
                <img src="static/images/design/X.png">
              </div>
              <img :src="pageCurrentData.titleImg"/>
              <p class="tip">标题图片，点击更换</p>
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="row-padding" v-if="pageCurrentData.useApi == 3 && pageCurrentData.type == '3'">
          <Col span="4"> 显示倒计时
          </Col>
          <Col offset="1" span="18">
            <Checkbox class="edit-all-line" v-model="pageCurrentData.showTime">是否显示活动倒计时控件</Checkbox>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="row-padding">
          <Col span="3"> 左右留白
          </Col>
          <Col offset="1" span="18">
            <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.startMargin"></Slider>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="row-padding">
          <Col span="3"> 显示个数
          </Col>
          <Col offset="1" span="18">
            <Slider :min="2" :max="6" :step="0.2" width="300px" v-model="pageCurrentData.itemNumber"></Slider>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle" class="row-padding">
          <Col span="3"> 图片间距
          </Col>
          <Col offset="1" span="18">
            <Slider :min="0" :max="30" width="300px" v-model="pageCurrentData.space"></Slider>
          </Col>
        </Row>
      </div>
      <div v-if="pageCurrentData.type == '1'">
        <Row type="flex" justify="start" align="middle" class="row-padding">
          <Col span="3"> 左右留白
          </Col>
          <Col offset="1" span="18">
            <Slider :max="20" :step="0.2" width="300px" v-model="pageCurrentData.sideMargin"></Slider>
          </Col>
        </Row>
        <Row class="padding-bottom">
          <Col span="24">
            <Checkbox v-model="pageCurrentData.rowThreeProduct">
              <span>一行三个</span>
            </Checkbox>
          </Col>
        </Row>
        <Row class="row-padding no__margin-bottom">
          显示内容
        </Row>
        <Row class="row-padding">
          <Col span="24">
            <Checkbox v-model="hasTitle" @on-change="hasTitleChange" size="small">
              <span>商品名称</span>
            </Checkbox>
          </Col>
        </Row>
        <Row class="padding-bottom">
          <Col span="24">
            <Checkbox v-model="hasPrice" @on-change="hasPriceChange">
              <span>商品价格</span>
            </Checkbox>
          </Col>
        </Row>
        <Row class="padding-bottom">
          <Col span="24">
            <Checkbox v-model="hasBtn" @on-change="hasBtnChange">
              <span>购买按钮</span>
            </Checkbox>
          </Col>
        </Row>
        <Row v-if="hasBtn" class="padding-bottom">
          <Col span="24" class="card">
            <RadioGroup v-model="pageCurrentData.layout.btnType" class="radio-img">
              <Radio label="1">
            <span>
              <img src="static/images/product-list/icon_gods_car01.png" alt="">
            </span>
              </Radio>
              <Radio label="2">
            <span>
              <img src="static/images/product-list/icon_gods_car02.png" alt="">
            </span>
              </Radio>
              <Radio label="3">
            <span>
              <img src="static/images/product-list/icon_gods_car03.png" alt="">
            </span>
              </Radio>
              <Radio label="4">
            <span>
              <img src="static/images/product-list/icon_gods_car04.png" alt="">
            </span>
              </Radio>
              <Radio label="5">
            <span>
              <img src="static/images/product-list/icon_gods_car05.png" alt="">
            </span>
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="padding-bottom">
          <Col span="24">
            <Checkbox v-model="pageCurrentData.hasMark" @on-change="hasMarkChange">
              <span>商品角标</span>
            </Checkbox>
          </Col>
        </Row>
        <Row v-if="pageCurrentData.hasMark" class="padding-bottom">
          <Col span="24" class="card">
            <RadioGroup @on-change="cornerMarkChange" v-model="pageCurrentData.layout.cornerMark" class="radio-img">
              <Radio label="1">
                <span>
                  <img src="static/images/product-list/icon_gods_hot01.png">
                </span>
              </Radio>
              <Radio label="2">
                <span>
                  <img src="static/images/product-list/icon_gods_hot02.png">
                </span>
              </Radio>
              <Radio label="3">
                <span>
                  <img src="static/images/product-list/icon_gods_hot03.png">
                </span>
              </Radio>
              <Radio label="4">
                <span>
                  <img src="static/images/product-list/icon_gods_hot04.png">
                </span>
              </Radio>
              <Radio label="5">
                <span>
                  <img src="static/images/product-list/icon_gods_hot05.png">
                </span>
              </Radio>
              <Radio label="6">
                <span>
                  <img v-if="pageCurrentData.layout.selfCornerMarkUrl == ''" src="static/images/addimg.jpg"
                      @click="selectCornerMarkImg" width="38.4px" height="38.4px">
                  <img v-else :src="pageCurrentData.layout.selfCornerMarkUrl" @click="selectCornerMarkImg" width="38.4px"
                      height="38.4px">
                </span>
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row v-if="pageCurrentData.hasMark" class="padding-bottom">
          <Col span="24">
            <Select
                :value="model20"
                multiple
                filterable
                @on-change="changeMark"
            >
                <Option v-for="(item, index) in rows" :value="item.skuId" :key="index">{{item.showTitle}}</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </div>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from '../bus';
  import BgEdit from '../base/bg-edit';
  import draggable from 'vuedraggable';

  export default {
    name: 'product-list-edit',
    components: {
      draggable,
      BgEdit
    },
    props: ['editType'],
    data() {
      return {
        hasTitle: true,
        hasPrice: true,
        hasBtn: true,
        products: [],
        productDelBtn: '',
        isDefault: false,
        activitySubCates: [],
        hasTestCorerMark:false,
      };
    },
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
      rows: function () {
        return this.pageCurrentData.rows;
      },
      model20(){
        let arr = [];
        this.rows.forEach(item=>{
          if(item.cornerMark>0 && item.cornerMark == this.pageCurrentData.layout.cornerMark){
            arr.push(item.skuId);
          }
        })
        return arr;
      },
    },
    created() {
      this.testRows();
      if (this.editType == '1' && this.pageCurrentData.useApi == '1') {
        this.pageCurrentData.useApi = '2';
      }

      if (this.pageCurrentData.useApi == '3') {
        this._getCurrentDatas(null);
      }
    },
    methods: {
      testRows(){
        setTimeout(()=>{
          if (this.rows && this.rows.length == 0) {
            this.isDefault = true;
            this.creatView()
          }
        },1000)
      },
      changeMark(options){
        let cornerMark = this.pageCurrentData.layout.cornerMark
        this.rows.forEach(item=>{
          if(options.indexOf(item.skuId)>=0){
            item.cornerMark = cornerMark
            if(cornerMark > 5){
              if(!item.selfCornerMarkUrl){
                item.selfCornerMarkUrl = this.pageCurrentData.layout.selfCornerMarkUrl;
              }
            }
          }else if(item.cornerMark == cornerMark){
            item.cornerMark = 0;
            item.selfCornerMarkUrl = '';
          }
        })
      },
      dragEnd(e) {

      },
      addTab: function () {
        this.pageCurrentData.tabs.push({
          title: '名称示例',
          sectionStr: '*-*,0-499,500-1999,2000-*'
        })
      },
      selectedSubCates: function () {

      },
      showTabsEvent: function () {
        if (this.pageCurrentData.showTabs) {
          this.pageCurrentData.tabs = [{
            title: '标题示例',
            sectionStr: '*-*,0-499,500-1999,2000-*'
          }]
        } else {
          this.pageCurrentData.tabs = []
        }
      },
      onlyDeliveryTypeChanged: function () {

      },
      hasDeliverTabsEvent: function (val) {
        // let data = val ? '1' : '0';
        // this.pageCurrentData.hasDeliverTabs = data
      },
      removeProductTitleImg: function () {
        this.pageCurrentData.titleImg = ''
      },
      useApiChanged: function () {
        this.pageCurrentData.productFrom = {
          name: '',
          number: '',
          cate: {},
          activity: {},
        }
      },
      aiEvent: function() {
        this.$Message.info('敬请期待！')
      },
      channelEvent: function () {
        Bus.$emit('showChannelCenter', {
          pageType: this.editType ? 'productInfinite' : '',
          fn: item => {
            if (item) {
              this.pageCurrentData.productFrom = item
              this._getCurrentDatas(null);
            }
          },
        });
      },
      activityEvent: function () {
        Bus.$emit('showActivityCenter', {
          pageType: this.editType ? 'productInfinite' : '',
          isMultiple: this.editType == '1' ? false : true,
          fn: item => {
            if (item) {
              this.pageCurrentData.productFrom = item
              this._getCurrentDatas(null);
            }
          },
        });
      },
      cateEvent: function () {
        Bus.$emit('showCateCenter', {
          pageType: this.editType ? 'productInfinite' : '',
          multiple: '2',
          backCates: this.pageCurrentData.productFrom.backCates,
          fn: item => {
            if (item) {
              this.pageCurrentData.productFrom = item
              this._getCurrentDatas(null);
            }
          },
        });
      },
      queryMktActivityByIdList: function () {
        let url = this.$market.apiBaseURL() + '/app/json/app_market/queryMktActivityByIdList';
        let idList = []
        for (let i = 0; i < this.pageCurrentData.productFrom.activity.length; i++) {
          let item = this.pageCurrentData.productFrom.activity[i]
          idList.push(item.activityId)
        }
        let paramsData = {
          token: this.$store.state.login.token,
          idList: idList.toString(),
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let actList = data.data
              if (actList.length > 0) {
                let activity = actList[0]
                this._getCurrentDatas(activity)
              }
            }
          },
          error => {
          }
        );
      },
      queryChannelList: function () {
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProChannelList';
        let paramsData = {
          token: this.$store.state.login.token,
          channelGroupId: this.pageCurrentData.productFrom.id,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let channels = data.data.list
              if (channels.length > 0) {
                let channel = channels[0]
                this.pageCurrentData.channels = channels;
                this.pageCurrentData.selectedId = channel.id;
                this._getCurrentDatas(channel)
              }
            }
          },
          error => {
          }
        );
      },
      _getCurrentDatas: function (currentData) {
        this.pageCurrentData.rows = []
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppDesigneList';
        if (this.editType == 1) {
          url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        }
        let paramsData = {
          // token: this.$store.state.login.token,
          // deliverType: '2',
          page: 1,
          rows: this.pageCurrentData.productFrom.number
        };
        paramsData.deliverType = this.$store.state.mall2.staticDeliverType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        }
        if (this.pageCurrentData.useApi == 2) {
          const backCates = this.pageCurrentData.productFrom.backCates;
          if (this.pageCurrentData.productFrom.multiple == '2' && backCates && backCates.length>1) {
            // 多选分类
            let categoryIdList = []
            for (let i = 0; i < backCates.length; i++) {
              const backCate = backCates[i]
              categoryIdList.push(backCate.id)
            }
            paramsData.categoryIdList = JSON.stringify(categoryIdList)
          } else {
            let cate = this.pageCurrentData.productFrom.cate;
            paramsData.clsType = cate.clsType
            paramsData.categoryId = cate.id
            paramsData.cateLevel = cate.cateLevel
          }
        } else if (this.pageCurrentData.useApi == 3) {
          if (!currentData) {
            if (this.pageCurrentData.productFrom.activity.length > 1) {
              this.queryMktActivityByIdList()
              return ;
            }
            currentData = this.pageCurrentData.productFrom.activity;
            // 获取活动下商品分类
            this.getActivitySubCates(currentData.activityId)
          }
          paramsData.activityId = currentData.activityId
        } else if (this.pageCurrentData.useApi == 4) {
          if (!currentData) {
            this.queryChannelList()
            return
            // activity = this.pageCurrentData.productFrom.activity;
          }
          paramsData.categoryId = currentData.id
          paramsData.clsType = '4'
        }
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.pageCurrentData.rows = []
              let list = data.data.list;
              for (let i = 0; i < list.length; i++) {
                let item = this.$market.dataProcessing(list[i])
                this.pageCurrentData.rows.push(item)
              }
              // let cateList = data.data.cateList
              // if (cateList) {
              //   let arr = []
              //   for (let i = 0; i < cateList.length; i++) {
              //     let c1 = cateList[i]
              //     for (let j = 0; j < c1.childList.length; j++) {
              //       let c2 = c1.childList[j]
              //       for (let k = 0; k < c2.childList.length; k++) {
              //         let c3 = c2.childList[k]
              //         arr.push(c3)
              //       }
              //     }
              //   }
              //   this.activitySubCates = arr
              // }
            }
          },
          error => {
          }
        );
      },
      getActivitySubCates: function (activityId) {
        let url = this.$market.apiBaseURL() + '/app/json/product/getActivityProCataList';
        let paramsData = {
          activityId: activityId,
          page: 1,
          rows: 99999
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let cateList = data.data.cateList
              if (cateList) {
                let arr = []
                for (let i = 0; i < cateList.length; i++) {
                  let c1 = cateList[i]
                  for (let j = 0; j < c1.childList.length; j++) {
                    let c2 = c1.childList[j]
                    for (let k = 0; k < c2.childList.length; k++) {
                      let c3 = c2.childList[k]
                      arr.push(c3)
                    }
                  }
                }
                this.activitySubCates = arr
              }
            }
          },
          error => {
          }
        );
      },
      getLinkMsg: function () {
        let str = '请选择商品分类'
        return str
      },
      hasTitleChange: function (val) {
        let data = val ? '1' : '0';
        this.pageCurrentData.layout.hasTitle = data;
      },
      hasPriceChange: function (val) {
        let data = val ? '1' : '0';
        this.pageCurrentData.layout.hasPrice = data;
      },
      hasBtnChange: function (val) {
        let data = val ? '1' : '0';
        this.pageCurrentData.layout.btnType = data;
      },
      testCorerMark(){
        this.pageCurrentData.rows.forEach(item=>{
          item.cornerMark ? null : this.$set(item,'cornerMark', 0);
          item.selfCornerMarkUrl ? null : this.$set(item,'selfCornerMarkUrl', '');
        })
        this.testCorerMark = true;
      },
      hasMarkChange: function (val) {
        if(!this.testCorerMark) this.testCorerMark();
        let data = val ? '1' : '0';
        this.pageCurrentData.rows.forEach(row=>{ row.cornerMark = data })
        this.pageCurrentData.layout.cornerMark = data;
      },
      productMouseover: function (item, index) {
        this.productDelBtn = index;
      },
      productMouseout: function (item, index) {
        this.productDelBtn = '';
      },
      deleteProduct: function (item, index) {
        this.pageCurrentData.rows.splice(index, 1);
      },
      selectCornerMarkImg: function () {
        Bus.$emit('showImgCenter', item => {
          this.pageCurrentData.layout.selfCornerMarkUrl = item.url;
        });
      },
      cornerMarkChange: function (val) {
        if (val != 6) {
          this.pageCurrentData.layout.selfCornerMarkUrl = '';
        }
      },
      selectProduct: function () {
        // TODO 添加图片项
        Bus.$emit('showProductCenter', {
          type: 'select',
          fn: products => {
            if (this.isDefault) {
              this.isDefault = false;
              this.pageCurrentData.rows = [];
            }
            for (let i = 0; i < products.length; i++) {
              let item = products[i]
              item = this.$market.dataProcessing(item)
              this.$set(item,'selfCornerMarkUrl',
                this.pageCurrentData.layout.cornerMark>5 ? this.pageCurrentData.layout.selfCornerMarkUrl : ''
              )
              this.$set(item,'cornerMark',this.pageCurrentData.layout.cornerMark)
              this.pageCurrentData.rows.push(item)
            }
          },
        });
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.titleImg = item.url;
          }
        });
      },
      creatView: function () {
        // if (!this.pageCurrentData.useApi) {
        //   this.pageCurrentData.useApi = '1';
        // }
        for (let i = 0; i < 2; i++) {
          this.pageCurrentData.rows.push({
            "categoryNum": "",
            "couTypeTitle": "",
            "spuName": "",
            "couPic": "",
            "couFaceValue": "",
            "couTypeSubTitle": "",
            "activityTypes": "",
            "deliverType": 2,
            "points": "",
            "skuName": "示例skuName",
            "activityPrice": 0.04,
            "couThresholdAmount": "",
            "activityTitles": [],
            "storeName": "示例店铺",
            "id": '',
            "activityTags": "",
            "commentsNum": 0,
            "skuId": '',
            "storeOuCode": "1000612015001001001",
            "productType": 1,
            "dpedData": {"decimals": "04", "linePrice": "0.04", "integer": "0"},
            "couTypeCode": "",
            "salePrice": 0.04,
            "soldNum": "",
            "featureNames": "",
            "salesNum": "",
            "phMainUrl": "static/images/defaultImg.png",
            "metric": "",
            "showTitle": "示例 showTitle",
            "saleNumBegin": 1,
            "skuCode": "1000612102340",
            "skuNum": ""
          });
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .product-list-edit {
    padding: 0px 10px;
    border: 1px solid gray;
    background-color: white;
    font-size: 14px;
    box-sizing: border-box;
    background-color: #f8f8f8;
  }

  .eidt-div .edit-line {
    margin-left: 0;
    width: 100%;
  }

  .rubik-edit >>> .bg-edit {
    padding: 0 !important;
  }

  .radio-list label {
    margin-bottom: 10px;
  }

  .product-icon-box {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    width: 70px;
    height: 70px;
    font-size: 0;
    .product-delete {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: #ccc;
      color: #fff;
      text-align: center;
      line-height: 15px;
      font-size: 10px;
    }
  }

  .card {
    background-color: #fff;
    border: 1px dashed #ddd;
    padding: 10px;
  }

  .row-label__max {
    font-size: 16px;
  }
</style>

<style lang="stylus" type="text/stylus">
  .draggable-tip {
    padding-bottom 10px;
  }

  .radio-img .ivu-radio-wrapper .ivu-radio {
    display: none;
  }

  .radio-img .ivu-radio-wrapper {
    border: 1px solid #dcdddd;
    height 46px
    display flex
    align-items center
    float left
    img {
      transform: scale(0.8);
    }
  }

  .radio-img .ivu-radio-wrapper-checked {
    border: 1px solid #3ea141;
    background-color: #e1f0e1
  }
  .image-div {
    width 100%;
    position relative;
    overflow hidden;
    img {
      background-color #efefef;
      display block;
      width 100%;
      min-height 40px;
    }
    .clear-btn {
      position absolute;
      right 0px;
      top 0px;
      width 20px;
      height 20px;
      img {
        display block;
        width 100%;
        height 100%;
        min-height 0px;
        border-radius 10px;
      }
    }
    .header-img {
      margin 0 auto;
      width 100px;
      height 100px;
    }
    .tip {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      padding 8px;
      font-size 13px;
      text-align center;
      background-color rgba(255, 255, 255, 0.3)
    }
  }
</style>
