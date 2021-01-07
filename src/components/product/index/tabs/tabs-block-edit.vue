/**Created by liaoyingchao on 2019-06-19.*/

<template>
  <EditLayout title="编辑区--Tabs组建">
    <div>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4">
          样式类型
        </Col>
        <Col offset="1" span="18">
          <RadioGroup v-model="pageCurrentData.type">
            <Radio label="1">
              <span>类型1</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
    </div>
    <div class="line_bottom">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Checkbox v-model="pageCurrentData.sticky">
          <span>自动吸顶</span>
        </Checkbox>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="10"> 选中划线颜色
        </Col>
        <Col span="14">
          <ColorPicker v-model="pageCurrentData.lineColor"/>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="10"> 标题选中态颜色
        </Col>
        <Col span="14">
          <ColorPicker v-model="pageCurrentData.titleActiveColor"/>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="10"> 标题默认态颜色
        </Col>
        <Col span="14">
          <ColorPicker v-model="pageCurrentData.titleInactiveColor"/>
        </Col>
      </Row>
    </div>
    <div>
      <div class="tab-block" v-for="(item, idx) in pageCurrentData.tabs">
        <Row type="flex" align="middle">
          <Col span="24">
            <p> 标题：
              <Input type="text" v-model="item.name" style="width: 200px"></Input>
              <img class="remove-item-img" src="static/images/design/X.png" @click="removeRowItem(idx)">
            </p>
          </Col>
        </Row>
        <br>
        <Row type="flex" align="middle">
          <Col span="16">
            <p> 子页面配置：
              <a @click.prevent="editLine(item,idx)" href="">{{getLinkMsg(item)}}</a>
            </p>
          </Col>
          <Col span="8">
            <Checkbox v-model="item.newPage">
              <span>使用新页面打开链接</span>
            </Checkbox>
          </Col>
        </Row>
      </div>
      <Row @click.native="addTab" class="tab-block">
        <Col span="24"> + 添加一个tab
        </Col>
      </Row>
    </div>
    <div class="line_top">
      <Row class="row-padding">
        <Col span="4"> 右侧按钮图片
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeImg">
            <img :src="pageCurrentData.rightBtnImage"/>
            <p class="tip">点击更换图片</p>
            <div class="close" @click.stop="remove">x</div>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4"> 右侧按钮链接
        </Col>
        <Col span="20">
          <a @click.prevent="editRightLink" href="">{{getLinkMsg({link: pageCurrentData.rightLink})}}</a>
        </Col>
      </Row>
    </div>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";

  export default {
    name: "my-card-edit",
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData"])
    },
    data() {
      return {
        refresh: true
      }
    },
    methods: {
      remove: function () {
        this.pageCurrentData.rightBtnImage = ''
      },
      removeRowItem: function (index) {
        if (this.pageCurrentData.tabs.length < 2) {
          this.$Toast('删除也得有个限度呀，删光了咋显示！')
          return
        }
        this.pageCurrentData.tabs.splice(index, 1)
      },
      addTab: function () {
        this.pageCurrentData.tabs.push({
          name: '示例',
          link: {}
        })
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.rightBtnImage = item.url;
          }
        });
      },
      selectCardImg: function (idx) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData['cardImg_' + idx] = item.url;
            this.refresh = false
            this.$nextTick(() => {
              this.refresh = true
            })
          }
        });
      },
      getLinkMsg: function (item) {
        let str = "请选择子页面链接地址";
        if (item.link && item.link.name && item.link.name != "") {
          str = item.link.name;
        } else if (item.link && item.link.url && item.link.url != "") {
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
      // 选择要跳转的页面
      editRightLink: function () {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: this.pageCurrentData.rightLink,
          callback: item => {
            if (item) {
              this.pageCurrentData.rightLink = item;
              Bus.$emit('tabLinkChanged', {
                index: index
              })
            }
          }
        });
      },
      // 选择要跳转的页面
      editLine: function (rowItem, index) {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: rowItem.link,
          callback: item => {
            if (item) {
              this.pageCurrentData.tabs[index].link = item;
            }
          }
        });
      },
    },
    created() {
      if (!this.pageCurrentData.titleActiveColor) {
        this.pageCurrentData.titleActiveColor = ''
      }
      if (!this.pageCurrentData.titleInactiveColor) {
        this.pageCurrentData.titleInactiveColor = ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .image-div {
    position relative;
    overflow hidden;

    img {
      display block;
      width 100%;
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

  .card-img {
    img {
      display block;
      width 295px;
      height 108px;
    }
  }
  .image-div {
    width 100%;
    min-height 60px;
    text-align center;
    position relative;
    .close {
      position absolute
      padding 10px;
      font-size 14px;
      right 0;
      top 0;
    }
    img {
      display block;
      width 100%;
    }
  }

  .tab-block {
    margin 10px 0;
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;

    .remove-item-img {
      float right;
      width 20px;
      height 20px;
      border-radius 10px;
      overflow hidden;
    }
  }
</style>
