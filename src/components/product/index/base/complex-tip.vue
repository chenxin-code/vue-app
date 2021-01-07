/**Created by liaoyingchao on 2020-10-13.*/

<template>
  <Modal class="top-pop" v-model="show" title="复杂弹窗提示" @on-visible-change="changeModal" @on-ok="sureEvent" width="800">
    <div class="complex-tip">
      <Row type="flex" justify="space-between">
        <Col span="11" class="content">
          <Row type="flex" align="middle" class="row-space">
            <Col span="6">
              关闭按钮
            </Col>
            <Col span="16">
              <RadioGroup v-model="closeStyle">
                <Radio :label="1">
                  <span>无</span>
                </Radio>
                <Radio :label="2">
                  <span>底部</span>
                </Radio>
                <Radio :label="3">
                  <span>右上角</span>
                </Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row type="flex" align="middle" class="row-space">
            <Col span="6">
              背景
            </Col>
            <Col span="16">
              <ColorPicker v-model="bgColor" />
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <Col span="6">
              圆角
            </Col>
            <Col span="16">
              <Slider :max="20" :step="2" v-model="cornerSize"></Slider>
            </Col>
          </Row>
          <div class="line_top row-space">
            <div class="sub-title">底部按钮</div>
            <div class="list">
              <div class="item" v-for="(item, index) in btnsList">
                <Row type="flex" justify="start" align="middle">
                  <Col span="8">名称</Col>
                  <Col span="16">
                    <Input type="text" v-model="item.name" style="width: 100%"></Input>
                  </Col>
                </Row>
                <Row type="flex" justify="start" align="middle">
                  <Col span="8">颜色</Col>
                  <Col span="16">
                    <ColorPicker v-model="item.color" />
                  </Col>
                </Row>
                <Row type="flex" justify="start" align="middle">
                  <Col span="8"> 关闭按钮
                  </Col>
                  <Col span="12">
                    <Checkbox v-model="item.isCloseBtn">是否是关闭按钮</Checkbox>
                  </Col>
                </Row>
                <Row type="flex" justify="start" align="middle" v-if="item.isCloseBtn == false">
                  <Col span="8">链接</Col>
                  <Col span="16">
                    <a @click.prevent="editLine(item,index)">{{getLinkMsg(item)}}</a>
                  </Col>
                </Row>
              </div>
            </div>
            <div class="add-btn" @click="addOneBtn">添加一个按钮</div>
          </div>
        </Col>
        <Col span="11" class="content">
          <div class="row-space">
            <div class="sub-title">内容（自上而下排列）</div>
            <div class="list">
              <div class="item" v-for="(item, index) in contentsList">
                <Row type="flex" justify="start" align="middle">
                  <Col span="8">类型</Col>
                  <Col span="16">
                    <RadioGroup v-model="item.type">
                      <Radio :label="1">
                        <span>文字</span>
                      </Radio>
                      <Radio :label="2">
                        <span>图片</span>
                      </Radio>
                    </RadioGroup>
                  </Col>
                </Row>
                <div v-if="item.type==1">
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">文字</Col>
                    <Col span="16">
                      <Input type="text" v-model="item.text" style="width: 100%"></Input>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">颜色</Col>
                    <Col span="16">
                      <ColorPicker v-model="item.color" />
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">背景颜色</Col>
                    <Col span="16">
                      <ColorPicker v-model="item.bgColor" />
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">对齐方式</Col>
                    <Col span="16">
                      <RadioGroup v-model="item.textAlign">
                        <Radio label="left">
                          <span>左</span>
                        </Radio>
                        <Radio label="center">
                          <span>中</span>
                        </Radio>
                        <Radio label="right">
                          <span>右</span>
                        </Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">字体大小</Col>
                    <Col span="16">
                      <Slider :min="12" :max="30" :step="1" v-model="item.textSize"></Slider>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">上间距</Col>
                    <Col span="16">
                      <Slider :min="0" :max="50" :step="1" v-model="item.upSpace"></Slider>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">下间距</Col>
                    <Col span="16">
                      <Slider :min="0" :max="50" :step="1" v-model="item.downSpace"></Slider>
                    </Col>
                  </Row>
                </div>
                <div v-if="item.type==2">
                  <Row type="flex" justify="start" align="middle">
                    <Col span="8">图片</Col>
                    <Col span="16">
                      <div class="cont-img" @click="selectImg(index)">
                        <img :src="item.imgUrl">
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row type="flex" justify="start" align="middle">
                  <Col span="8">链接</Col>
                  <Col span="16">
                    <a @click.prevent="editLine(item,index)">{{getLinkMsg(item)}}</a>
                  </Col>
                </Row>
              </div>
            </div>
            <div class="add-btn" @click="addOneItem">添加一项内容</div>
          </div>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "../../../../utils/util";

  export default {
    name: "complex-tip",
    components: {},
    data() {
      return {
        show: false,
        cornerSize: 0,
        closeStyle: 1,
        bgColor: '#fff',
        linkData: {},
        btnsList: [],
        contentsList: []
      }
    },
    methods: {
      selectImg: function (index) {
        Bus.$emit("showImgCenter", item => {
          let d = this.contentsList[index]
          d.imgUrl = item.url;
          this.contentsList.splice(index, 1, d)
        });
      },
      // 选择要跳转的页面
      editLine: function (rowItem, index) {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: rowItem.link,
          callback: item => {
            if (item) {
              this.$set(rowItem, 'link', item)
            }
          }
        });
      },
      getLinkMsg: function (item) {
        let str = "请选择链接";
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
      changeModal: function () {

      },
      addOneBtn: function () {
        this.btnsList.push({
          name: '名称',
          color: '#999999',
          isCloseBtn: true,
          link: {}
        })
      },
      addOneItem: function () {
        this.contentsList.push({
          type: 1,
          color: '#333',
          bgColor: ''
        })
      },
      sureEvent: function () {
        this.linkData.complexData = {
          cornerSize: this.cornerSize,
          closeStyle: this.closeStyle,
          btnsList: this.btnsList,
          contentsList: this.contentsList,
          bgColor: this.bgColor,
        }
        let d = deepCopy(this.linkData);
        this.callback(d);
        this.show = false;
        this.linkData = {}
        this.cornerSize = 0
        this.closeStyle = 1
        this.btnsList = []
        this.contentsList = []
        this.bgColor = '#fff'
      }
    },
    created() {
      Bus.$on("showComplexTip", data => {
        this.show = true;
        if (data.linkData && data.linkData != null && data.linkData != undefined && data.linkData.type && data.linkData.type != null && data.linkData.type != undefined && data.linkData.type != '') {
          this.linkData = JSON.parse(JSON.stringify(data.linkData))
        }
        this.callback = data.callback ? data.callback : () => {
          console.log("no callback");
        };
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .complex-tip {
    width 100%
    .content {
      height 450px;
      overflow-y auto;
      .row-space {
        margin-top 10px;
      }
      .sub-title {
        padding 10px 0;
        font-size 14px;
      }
      .list {
        .item {
          margin-bottom 8px;
          border: 1px dashed #ddd;
          padding 8px;
          .cont-img {
            min-height 30px;
            display flex;
            align-items center;
            justify-content center;
            background-color #eee;
            img {
              max-width 100%;
            }
          }
        }
      }
      .add-btn {
        border: 1px dashed #ddd;
        text-align center;
        padding 5px;
      }
    }
  }
</style>
