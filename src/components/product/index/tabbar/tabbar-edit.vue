<template>
  <EditLayout title="编辑区--底部导航">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3">导航类型</Col>
      <Col span="20">
        <Select v-model="tabbarData.tabbarType" @on-change="tabbarTypeChaged">
          <Option value="bottom">底部导航</Option>
          <Option value="top">顶部导航</Option>
        </Select>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3">导航数量</Col>
      <Col span="20">
        <Select v-model="itemNum" @on-change="itemNumSelected">
          <Option v-for="(item, index) in itemList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3">页面标题</Col>
      <Col span="20">
        <Input v-model="tabbarData.title" placeholder="请输入页面标题"></Input>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="3">标题颜色</Col>
      <Col span="20">
        <ColorPicker v-model="tabbarData.titleColor" recommend/>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
      <Col span="3">按钮样式</Col>
      <Col span="20">
        <Select v-model="tabbarData.layoutType" @on-change="itemStyleSelected">
          <Option v-for="(item, index) in imgStyleList" :value="item.code" :key="index">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <div class="bai-block" v-for="(item, index) in tabbarData.moduleList">
      <div class="image-div" style="margin-top: 15px;" @click="imgEvent(1, index)">
        <img :src="item.imgUrl1"/>
        <span>默认图片</span>
        <p class="tip-p tip-p-1">点击更换</p>
      </div>
      <div class="image-div" style="margin-top: 15px;" @click="imgEvent(2, index)">
        <img :src="item.imgUrl2"/>
        <span>选中图片</span>
        <p class="tip-p tip-p-1">点击更换</p>
      </div>
      <div>
        <div class="right-label">标题：</div>
        <Input v-model="item.title" placeholder="请输入按钮标题" style="width: 200px"></Input>
      </div>
      <div style="margin-top: 8px;">
        <div class="right-label">链接页面：</div>
        <div style="color: #2d8cf0;font-size: 14px;" class="right-label" @click="editLink(index)" v-if="refreshLink">{{getLinkMsg(item)}}</div>
      </div>
      <div style="margin-top: 8px;">
        <Checkbox :disabled="item.default" v-model="item.default" @on-change="defaultChanged(index)">设为默认</Checkbox>
      </div>
      <div style="margin-top: 8px;padding-left:140px">
      <Checkbox v-model="item.cornerMark">是否显示角标</Checkbox>
      </div>
      <div v-if="item.cornerMark" style="margin-top: 8px;padding-left:140px">
        <a @click.prevent="editMarkLink(index); setCornerMarkDialog()" href="">{{getMarkMsg(item)}}</a>
      </div>
    </div>
    <div class="bg-div">
      <div class="bg-label">背景图片</div>
      <div class="input-div" @click="selectBgImg">
        <div class="clear-div" v-if="tabbarData.bgImgUrl != ''">
          <img src="static/images/design/X.png" @click.stop="removeBgImg">
        </div>
        <img v-if="tabbarData.bgImgUrl != ''" :src="tabbarData.bgImgUrl"/>
        <p class="good-tip" v-if="tabbarData.bgImgUrl == ''">建议图片尺寸750*100</p>
        <p class="tip-p">{{tabbarData.bgImgUrl == '' ? '点击上传背景图片' : '点击更换背景图片(750*100)'}}</p>
      </div>
    </div>
  </EditLayout>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import BgEdit from '../base/bg-edit';
  import Bus from '../bus';

  export default {
    name: 'tabbar-edit',
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters([
        'tabbarData'
      ])
    },
    data() {
      return {
        itemNum: '3',
        itemList: [{
          label: '两个导航按钮',
          value: '2'
        }, {
          label: '三个导航按钮',
          value: '3'
        },{
          label: '四个导航按钮',
          value: '4'
        },{
          label: '五个导航按钮',
          value: '5'
        }],
        // styleNum: 'img_word',
        imgStyleList: [{
          label: '图片加文字',
          code: 'img_word'
        },{
          label: '图片50',
          code: 'img_50'
        },{
          label: '图片60',
          code: 'img_60'
        },{
          label: '纯文字',
          code: 'word'
        }],
        selectedIndex: 0,
        refreshLink: true
      }
    },
    methods: {
      tabbarTypeChaged: function () {
        if (this.tabbarData.tabbarType == 'top') {
          this.tabbarData.layoutType = 'word'
          this.imgStyleList = [{
            label: '纯文字',
            code: 'word'
          }]
        } else {
          this.tabbarData.layoutType = 'img_word'
          this.imgStyleList = [{
            label: '图片加文字',
            code: 'img_word'
          },{
            label: '图片50',
            code: 'img_50'
          },{
            label: '图片60',
            code: 'img_60'
          }]
        }
      },
      defaultChanged: function (index) {
        for (let i = 0; i < this.tabbarData.moduleList.length; i++) {
          let module = this.tabbarData.moduleList[i]
          module.default = false
        }
        let module = this.tabbarData.moduleList[index]
        module.default = true
      },
      getLinkMsg: function(item) {
        let str = '请选择链接页面';
        if (item.link && item.link.name && item.link.name != '') {
          str = item.link.name;
        } else if (item.link && item.link.url && item.link.url != '') {
          str = item.link.url;
        }
        if (item.link && item.link.mustLogined) {
          str += '__需要登录'
        }
        if (item.link && item.link.renderNav) {
          str += '__需要原生导航'
        }
        return str;
      },
      getMarkMsg: function(item) {
        if (!item.link.markUrl) {
          return "请选择数量接口";
        } else {
          return item.link.markUrl;
        }
      },
      imgEvent: function (type, index) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            let module = this.tabbarData.moduleList[index]
            if (type == 1) {
              module.imgUrl1 = item.url
            } else {
              module.imgUrl2 = item.url
            }
          }
        });
      },
      editMarkLink: function(index) {
        Bus.$emit('showLinkCenter', {
          linkSelType: '0',
          linkData: this.tabbarData.moduleList[index].link,
          callback: item => {
            let _module = this.tabbarData.moduleList[index];
            _module.link = item;
          }
        });
      },
      // 选择要跳转的页面
      editLink: function(index) {
        // this.editLinkIndex = index;
        Bus.$emit('showLinkCenter', {
          linkSelType: '0',
          linkData: this.tabbarData.moduleList[index].link,
          callback: item => {
            if (item) {
              let module = this.tabbarData.moduleList[index];
              module.link = item;
              this.$emit('linkEdited', index);
              this.refreshLink = false
              this.$nextTick(() => {
                console.log('ddddd', this.tabbarData.moduleList)
                this.refreshLink = true
              })
            }
          }
        });
      },
      setCornerMarkDialog: function() {
        this.setMarkDialog(true);
      },
      removeBgImg: function () {
        this.tabbarData.bgImgUrl = ''
      },
      itemNumSelected: function (value) {
        if (this.tabbarData.moduleList.length == value) {
          return ;
        }
        let arr = []
        let oldBi = this.tabbarData.moduleList.length-1
        for (let i = 0; i < value; i++) {
           if (oldBi >= i) {
             arr.push(this.tabbarData.moduleList[i])
           } else {
             let item = {
               imgUrl1: 'static/images/tabbar/default.png',
               imgUrl2: 'static/images/tabbar/default.png',
               title: '标题',
               cornerMark: false,
               link: {
                  cornerMarkUrl: ''
               }
             }
             arr.push(item)
           }
        }
        this.tabbarData.moduleList = arr;
      },
      itemStyleSelected: function (value) {
        this.tabbarData.layoutType = value
      },
      selectBgImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.tabbarData.bgImgUrl = item.url;
          }
        });
      },
      ...mapMutations({
        setMarkDialog: "setMarkDialog"
      })
    },
    created() {
      this.itemNum = this.tabbarData.moduleList.length + ''
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bg-div {
    margin 10px 0px;
    padding-top 10px;
    border-top 1px solid #c9caca
    text-align center;
    .bg-label {
      float left;
      margin 8px 3% 3px;
    }
    .input-div {
      overflow hidden
      width 340px;
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
