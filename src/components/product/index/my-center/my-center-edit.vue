<template>
  <EditLayout title="编辑区--我的">
    <Row type="flex" justify="start" style="padding-top:10px;" v-if="styleConfig.length">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.styleTempl" @on-change="styleChanged">
          <template v-for="conf in styleConfig">
            <Radio :label="conf.label" v-if="conf.show">
              <span>{{conf.text}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="pageCurrentData.styleTempl == 1">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/mycenterstyle1.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 2">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/mycenterstyle2.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 3">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/style3.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 4">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/style4.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 5">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/style5.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 6">
      <div>
        <Row class="row-padding row-bottom-line">
          <Col span="24" class="card">
            <img src="static/images/mycenter/style6.png">
          </Col>
        </Row>
        <Row class="edit-all-line">
          账户类型：
          <RadioGroup v-model="pageCurrentData.assetsType">
            <Radio :label="1">
              <span>柴油豆</span>
            </Radio>
            <Radio :label="2">
              <span>积分</span>
            </Radio>
          </RadioGroup>
        </Row>
      </div>
    </template>
    <template v-if="pageCurrentData.styleTempl == 7">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/style7.jpg">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 8">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/mycenter/style8.png">
        </Col>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 2 || pageCurrentData.styleTempl == 3 || pageCurrentData.styleTempl == 4 || pageCurrentData.styleTempl == 8">
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.isShowYJ" @on-change="myCenterChanged">是否显示油金</Checkbox>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasSettingBtn">是否显示设置</Checkbox>
      </Row>
      <Row class="edit-all-line" v-if="pageCurrentData.styleTempl == 4 || pageCurrentData.styleTempl == 8">
        <Checkbox v-model="pageCurrentData.hasAccountInformation">是否显示账户信息</Checkbox>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasMessageBtn">是否显示信息</Checkbox>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasMemberCode">是否显示会员码</Checkbox>
        <RadioGroup v-model="pageCurrentData.memberCodeType" v-if="pageCurrentData.hasMemberCode == true">
          <Radio :label="1">
            <span>会员码</span>
          </Radio>
          <Radio :label="2">
            <span>员工邀请预注册</span>
          </Radio>
          <Radio :label="3">
            <span>员工邀请注册</span>
          </Radio>
          <Radio :label="4">
            <span>海信会员码</span>
          </Radio>
        </RadioGroup>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasAuthentication">拥有实名认证</Checkbox>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasPaidMember">拥有付费会员标识</Checkbox>
      </Row>
      <Row class="edit-all-line" v-if="pageCurrentData.styleTempl == 2">
        <Checkbox v-model="pageCurrentData.hasInterestsBtn">是否显示会员权益</Checkbox>
      </Row>
      <Row class="edit-all-line" v-if="pageCurrentData.styleTempl == 2">
        <Checkbox v-model="pageCurrentData.hasPaidMemberInterests">是否显示付费会员权益</Checkbox>
      </Row>
      <Row class="edit-all-line" v-if="!pageCurrentData.hasInterestsBtn">
        <Checkbox v-model="pageCurrentData.hasArc">底部圆角</Checkbox>
      </Row>
      <Row class="edit-all-line" type="flex" align="middle">
        <Col span="4"> 顶部背景
        </Col>
        <Col span="10">
          <div v-for="(item,index) in defaultColorList" @click="selectColor(item, index)" class="color-picker">
            <div :style="{backgroundColor:item}" class="color-card">
            </div>
          </div>
        </Col>
        <Col span="8">
          <ColorPicker v-model="showColor"/>
        </Col>
      </Row>
      <Row class="edit-all-line">
        <div class="image-div" @click="changeDefautHeaderImg">
          <img class="header-img" :src="pageCurrentData.headImg ? pageCurrentData.headImg : 'static/images/defaultImg.png'"/>
          <p class="tip">点击更换默认头像</p>
        </div>
      </Row>
      <Row class="edit-all-line">
        <div class="image-div" @click="changeImg">
          <img :src="pageCurrentData.myBgImg"/>
          <p class="tip">点击更换图片</p>
        </div>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 5">
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasSettingBtn">是否显示设置</Checkbox>
      </Row>
      <Row class="edit-all-line">
        <Checkbox v-model="pageCurrentData.hasMessageBtn">是否显示信息</Checkbox>
      </Row>
      <Row class="edit-all-line" type="flex" align="middle">
        <Col span="4"> 顶部背景
        </Col>
        <Col span="10">
          <div v-for="(item,index) in defaultColorList" @click="selectColor(item, index)" class="color-picker">
            <div :style="{backgroundColor:item}" class="color-card">
            </div>
          </div>
        </Col>
        <Col span="8">
          <ColorPicker v-model="showColor"/>
        </Col>
      </Row>
      <Row class="edit-all-line">
        <div class="image-div" @click="changeDefautHeaderImg">
          <img class="header-img" :src="pageCurrentData.headImg ? pageCurrentData.headImg : 'static/images/defaultImg.png'"/>
          <p class="tip">点击更换默认头像</p>
        </div>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 6">
      <Row class="edit-all-line">
        <div class="image-div" @click="changeDefautHeaderImg">
          <img class="header-img" :src="pageCurrentData.headImg ? pageCurrentData.headImg : 'static/images/defaultImg.png'"/>
          <p class="tip">点击更换默认头像</p>
        </div>
      </Row>
    </template>
    <template v-if="(pageCurrentData.styleTempl == 3 || pageCurrentData.styleTempl == 4) && refresh">
      <div class="row-top-line">
        <Row class="row-padding" v-for="(item, idx) in $store.state.memberLevels" :key="idx">
          <Col span="6"> {{item.name}}卡片图片
          </Col>
          <Col span="16">
            <div class="card-img" @click="selectCardImg(idx)">
              <img :src="pageCurrentData['cardImg_'+idx]" v-if="pageCurrentData['cardImg_'+idx]">
              <div v-else>
                <img src="static/images/mycenter/my-card-bg.png" v-if="pageCurrentData.styleTempl == 3">
                <img src="static/images/mycenter/my-card-bg-1.png" v-else>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </template>
  </EditLayout>
</template>

<script>
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: 'auxiliary-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    data() {
      return {
        myCenterStyle: 1,
        defaultColorList: [
          '#CF2B3A',
          '#328967',
          ''
        ],
        showColor: '',
        templateList: [
          {
            name: '默认',
            img: 'static/images/rubik/1-2.png',
            id: '',
          },
        ],
        refresh: true,
        styleConfig: [],
      };
    },
    methods: {
      myCenterChanged: function () {
        Bus.$emit('myCenterAssetsRefresh');
      },
      selectCardImg: function (idx) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData['cardImg_'+idx] = item.url;
            this.refresh = false
            this.$nextTick(() => {
              this.refresh = true
            })
          }
        });
      },
      selectColor: function(color, index) {
        this.pageCurrentData.topBgColor = color;
        this.showColor = color;
      },
      styleChanged: function () {
        let styleTempl = this.pageCurrentData.styleTempl
        if (styleTempl == 2) {
          this.pageCurrentData.myBgImg = 'static/images/mycenter/myBgImg.png'
        } else if (styleTempl == 3) {
          this.pageCurrentData.myBgImg = 'static/images/mycenter/myBgImg-1.png'
          this.pageCurrentData.cardBgImg = 'static/images/mycenter/my-card-bg.png'
        } else if (styleTempl == 4) {
          this.pageCurrentData.myBgImg = 'static/images/mycenter/myBgImg-1.png'
          this.pageCurrentData.cardBgImg = 'static/images/mycenter/my-card-bg-1.png'
        } else if (styleTempl == 8) {
          this.pageCurrentData.myBgImg = 'static/images/mycenter/myBgImg-8.png'
          this.pageCurrentData.cardBgImg = 'static/images/mycenter/my-card-bg-1.png'
        } else if (styleTempl == 7) {
          this.pageCurrentData.myBgImg = 'static/images/mycenter/myBgImg-1.png'
          this.pageCurrentData.cardBgImg = 'static/images/mycenter/my-card-bg-1.png'
        }
      },
      changeDefautHeaderImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.headImg = item.url;
          }
        });
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.myBgImg = item.url;
          }
        });
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'MyCenter')
        this.styleConfig = menuItem.styleConfig;
      },
    },
    created() {
      if (!this.pageCurrentData.topBgColor || this.pageCurrentData.topBgColor == null || this.pageCurrentData.topBgColor == undefined) {
        this.pageCurrentData.topBgColor = '#CF2B3A'
      }
      if (!this.pageCurrentData.memberCodeType || this.pageCurrentData.memberCodeType == null || this.pageCurrentData.memberCodeType == undefined) {
        this.pageCurrentData.memberCodeType = 1
      }
      this.showColor = this.pageCurrentData.topBgColor
      this.initStyleConfig();
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .card {
    background-color: #fff;
    border: 1px dashed #ddd;
    padding: 10px;
    img {
      width 100%;
    }
  }

  .image-div {
    position relative;
    overflow hidden;
    img {
      display block;
      width 100%;
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
  .color-picker {
    float left
    height: 32px;
    padding: 6px 7px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    margin-left: 5px;
    .color-card {
      width: 18px;
      height: 18px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
    }
  }
  .card-img {
    img {
      display block;
      width 295px;
      height 108px;
    }
  }
  .ivu-radio-wrapper{
    margin-bottom:10px;
  }
</style>
