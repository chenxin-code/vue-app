/**Created by liaoyingchao on 2019-10-12.*/

<template>
  <EditLayout title="编辑区-顶部导航">
    <div class="type">
      <div class="edit-label">类型：</div>
      <RadioGroup v-model="pageCurrentData.type">
        <Radio label="default">默认的</Radio>
        <Radio label="custom">自定义</Radio>
        <Radio label="none">没有导航</Radio>
      </RadioGroup>
      <span class="edit-line"></span>
    </div>
    <div class="default-div" v-if="pageCurrentData.type == 'default'">
      <div class="edit-tip">default类型将由vue渲染上导航，导航样式可配置。</div>
      <div class="form-div">
        <div class="edit-label">页面标题:</div>
        <Input v-model="pageCurrentData.title" placeholder="请输入页面标题，为空将显示页面默认标题" style="width: 260px"></Input>
      </div>
      <div class="form-div">
        <div class="edit-label">标题颜色:</div>
        <ColorPicker v-model="pageCurrentData.titleColor" recommend/>
      </div>
      <br>
      <div class="form-div">
        <BgEdit :bgImgSize="'750*128'"></BgEdit>
      </div>
    </div>
    <div class="default-div" v-if="pageCurrentData.type == 'custom'">
      <div class="edit-tip">custom类型将由vue渲染上导航，导航样式可配置。</div>
      <div class="form-div">
        <div>
          <div class="edit-label">页面标题:</div>
          <Input v-model="pageCurrentData.title" placeholder="请输入页面标题，为空将显示页面默认标题" style="width: 260px"></Input>
        </div>
        <br>
        <div>
          <div class="edit-label">标题颜色</div>
          <ColorPicker v-model="pageCurrentData.titleColor" recommend/>
        </div>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowTitle">是否显示标题</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowBack">是否显示返回按钮</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowStationName">是否显示油站名称</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowSetting">是否显示设置按钮</Checkbox>
        <Checkbox class="edit-all-line" v-model="pageCurrentData.isShowVersion">是否显示版本信息</Checkbox>
      </div>
      <!--<span class="edit-line"></span>-->
      <!--<div class="form-div float-div">-->
        <!--<Checkbox v-model="pageCurrentData.isFloat">是否悬浮</Checkbox>-->
      <!--</div>-->
      <!--<div class="form-div">-->
        <!--<RadioGroup v-model="pageCurrentData.bgStyle" @on-change="styleChanged">-->
          <!--<Radio class="edit-all-line" label="common">常规风格</Radio>-->
          <!--<Radio class="edit-all-line" label="white">白色背景</Radio>-->
        <!--</RadioGroup>-->
      <!--</div>-->
      <br>
      <div class="form-div">
        <BgEdit :bgImgSize="'750*128'"></BgEdit>
      </div>
    </div>
  </EditLayout>
</template>

<script>
  import BgEdit from '../base/bg-edit';
  import {mapGetters} from 'vuex';
  import Bus from "../bus";

  export default {
    name: "bs-header-edit",
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
      shareImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.shareImgUrl = item.url;
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
  .bs-header-edit {
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
  }
</style>
