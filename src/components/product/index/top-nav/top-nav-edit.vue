<template>
  <EditLayout title="编辑区-顶部导航">
    <div class="type">
      <div class="edit-label">类型：</div>
      <RadioGroup v-model="pageCurrentData.type">
        <Radio label="default">默认的(源生渲染)</Radio>
        <Radio label="custom">自定义</Radio>
        <Radio label="none">没有导航</Radio>
      </RadioGroup>
      <span class="edit-line"></span>
    </div>
    <div class="default-div" v-if="pageCurrentData.type == 'default'">
      <div class="edit-tip">default类型vue不会渲染导航，将由源生app渲染导航，导航样式固定。</div>
      <div class="form-div">
        <div class="edit-label">页面标题:</div>
        <Input v-model="pageCurrentData.title" placeholder="请输入页面标题，为空将显示页面默认标题" style="width: 260px"></Input>
      </div>
      <div class="form-div">
        <div class="edit-label">标题颜色:</div>
        <ColorPicker v-model="pageCurrentData.titleColor" recommend/>
      </div>
    </div>
    <div class="default-div" v-if="pageCurrentData.type == 'custom'">
      <div class="edit-tip">custom类型将由vue渲染上导航，导航样式可配置。</div>
      <div class="form-div">
        <Checkbox v-model="middle" disabled>中间控件</Checkbox>
        <div class="edit-left-space">
          <RadioGroup v-model="pageCurrentData.middelControl">
            <Radio class="edit-all-line" label="search">商品搜索控件</Radio>
            <Radio class="edit-all-line" label="title">页面标题
              <Input v-model="pageCurrentData.title" placeholder="请输入页面标题，为空将显示页面默认标题" style="width: 260px"></Input>
            </Radio>
          </RadioGroup>
        </div>
        <br>
        <div class="form-div">
          <div class="edit-label">标题颜色</div>
          <ColorPicker v-model="pageCurrentData.titleColor" recommend/>
        </div>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowBack">是否显示返回按钮</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowArea" v-if="'1' == areaType">是否显示地区控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowStation" v-if="'2' == areaType">是否显示油站选择控件
        </Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowLoginOut">是否显示退出控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowScan">是否显示扫二维码控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowMsg">是否显示消息控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowUserMessage">是否显示会员信息</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowShare">是否显示分享控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowQrCode">是否显示会员码</Checkbox>
        <RadioGroup v-model="pageCurrentData.memberCodeType" v-if="pageCurrentData.isShowQrCode == true">
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
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowService">是否显示客服控件</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowMore">是否显示更多控件</Checkbox>
        <CheckboxGroup class="edit-all-line" v-if="pageCurrentData.isShowMore" v-model="pageCurrentData.moreContentList">
          <Checkbox label="ydf">油滴付</Checkbox>
          <Checkbox label="dzk">电子卡</Checkbox>
          <Checkbox label="sys">扫一扫</Checkbox>
          <Checkbox label="kfp">开发票</Checkbox>
        </CheckboxGroup>
        <div>
          分享标题 <Input v-model="pageCurrentData.shareTitle" placeholder="请输入分享标题" style="width: 300px;"></Input>
        </div>
        <div>
          分享内容 <Input v-model="pageCurrentData.shareContent" placeholder="请输入分享内容" style="width: 300px;"></Input>
        </div>
        <div>
          分享图片
          <div class="image-div" @click="shareImg">
            <img :src="pageCurrentData.shareImgUrl"/>
            <p class="tip">点击更换图片</p>
          </div>
        </div>
        <!--<Checkbox class="edit-all-line" v-model="pageCurrentData.isShowSignIn">是否显示签到控件</Checkbox>-->
      </div>
      <span class="edit-line"></span>
      <div class="form-div float-div">
        <Checkbox v-model="pageCurrentData.isFloat">是否悬浮</Checkbox>
      </div>
      <div class="form-div">
        <RadioGroup v-model="pageCurrentData.bgStyle" @on-change="styleChanged">
          <Radio class="edit-all-line" label="common">常规风格</Radio>
          <Radio class="edit-all-line" label="white">白色背景</Radio>
        </RadioGroup>
      </div>
      <!--<div v-if="pageCurrentData.middelControl == 'search'" class="hotworld-box">-->
      <!--<div>搜索热词</div>-->
      <!--<Tag v-for="item in hotWordList" :key="item" :name="item" closable @on-close="handleClose">{{item}}</Tag>-->
      <!--<Poptip v-model="addHostWordVisible" placement="right">-->
      <!--<Button icon="ios-plus-empty" type="dashed" size="small">添加标签</Button>-->
      <!--<div class="api" slot="content">-->
      <!--<Input v-model="newHotWord" size="small" placeholder="输入热词" class="small-addinput"></Input>-->
      <!--<Button type="primary" size="small" @click="handleAdd">确定</Button>-->
      <!--</div>-->
      <!--</Poptip>-->
      <!--</div>-->
      <br>
      <div class="form-div">
        <BgEdit :bgImgSize="'750*128'"></BgEdit>
        <Row class="row-padding row-bottom-line" type="flex" align="middle">
          <Col span="4">背景图片2</Col>
          <Col span="20">
            <div class="input-div" @click="selectImg2">
              <div class="clear-div" v-if="pageCurrentData.bgImgUrl2 != ''">
                <img src="static/images/design/X.png" @click.stop="removeBgImg2">
              </div>
              <img v-if="pageCurrentData.bgImgUrl2" :src="pageCurrentData.bgImgUrl2"/>
              <p class="tip-p">{{pageCurrentData.bgImgUrl2 ? '点击上传背景图片' : '点击更换背景图片'}}</p>
            </div>
          </Col>
        </Row>
      </div>
      <Row type="flex" align="middle">
        <Col span="6"> 整个页面背景颜色
        </Col>
        <Col span="18">
          <ColorPicker v-model="pageData.bgColor" @on-change="pageBgChange"/>
        </Col>
      </Row>
    </div>
  </EditLayout>
</template>

<script>
  import BgEdit from '../base/bg-edit';
  import {mapGetters} from 'vuex';
  import Bus from "../bus";

  export default {
    name: 'header-edit',
    components: {
      BgEdit,
    },
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    data() {
      return {
        type: 'custom',
        title: '',
        middle: true,
        showSearch: false,
        middle_control: 'title',
        isShowArea: false,
        isShowBack: false,
        isShowScan: false,
        isShowMsg: false,
        hotWordList: ['键盘', '鼠标', '笔记本', '手表', 'suv', '奔驰', '袜子', 'T恤'],
        newHotWord: '',
        addHostWordVisible: false,
        areaType: ''
      };
    },
    methods: {
      removeBgImg2: function () {
        this.pageCurrentData.bgImgUrl2 = '';
      },
      selectImg2: function() {
        console.log(this.pageCurrentData);
        this.pageCurrentData.bgImgUrl2 ? null : this.$set(this.pageCurrentData,'bgImgUrl2','');
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.bgImgUrl2 = item.url;
          }
        });
      },
      pageBgChange: function () {
        Bus.$emit('reloadPageBg');
      },
      shareImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.shareImgUrl2 = item.url;
          }
        });
      },
      styleChanged: function () {
        this.pageCurrentData.type = 'none'
        this.$nextTick(() => {
          this.pageCurrentData.type = 'custom'
        })
      },
      handleAdd() {
        if (this.newHotWord) {
          this.hotWordList.push(this.newHotWord);
        }
        this.addHostWordVisible = false;
        this.newHotWord = '';
      },
      handleClose(event, name) {
        const index = this.hotWordList.indexOf(name);
        this.hotWordList.splice(index, 1);
      },
    },
    created() {
      if (!this.pageCurrentData.shareImgUrl) {
        this.pageCurrentData.shareImgUrl = ''
      }
      this.areaType = areaType()
      if (this.areaType == '2') {
        this.pageCurrentData.isShowArea = false
      } else {
        this.pageCurrentData.isShowStation = false
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .header-edit {
    .hotworld-box {
      padding: 10px 15px;

      .small-addinput {
        width: 150px;
      }
    }
    .image-div {
      position relative;
      overflow hidden;
      text-align center;
      font-size 0px;
      min-height 100px;
      background-color #efefef;
      img {
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
    .input-div {
      overflow hidden
      width 330px;
      height 100px;
      background-color #efefef;
      border-radius 4px;
      position relative;
      text-align center;
      img {
        max-width 100%;
        max-height 100%;
      }
      .clear-div {
        position absolute;
        right 0;
        top 0px;
        font-size 0px;
        z-index 9999;
        width 20px;
        height 20px;
        background-color #fff
        border-radius 10px;
        img {
          width 100%;
          height 100%;
        }
      }
    }
  }
</style>
