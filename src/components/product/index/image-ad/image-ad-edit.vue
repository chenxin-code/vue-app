<template>
  <EditLayout title="编辑区--图文导航/导航">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <span class="row-label row-label__max">选择模板</span>
    </Row>
    <Row type="flex" justify="space-around" class="row-padding">
      <Col span="5" v-for="(item,index) in layoutList" :key="index" @click.native="selectLayout(item,index)">
        <div class="div-btn" :class="{'teml-active':item.id == pageCurrentData.type}">
          <img :src="`@/../static/images/image-ad/${item.url}.png`" alt="">
          <span> {{item.name}} </span>
        </div>
      </Col>
    </Row>
    <div>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上浮距离
        </Col>
        <Col offset="1" span="18">
          <Slider :max="40" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 左右留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.upMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 下留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
        </Col>
      </Row>
    </div>
    <div v-if="pageCurrentData.type == 'lbt'" class="margin-bottom">
      <!--普天定制需求-->
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 通知公告
        </Col>
        <Col span="18">
          <input class="notice-input" placeholder="请输入通知公告" v-model="pageCurrentData.notice"/>
          <!--<Slider :min="2" :max="10" v-model="pageCurrentData.notice" @on-change="autoplayDelayChange"></Slider>-->
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
        <Col span="3"> 轮播间隔
        </Col>
        <Col span="18">
          <Slider :min="2" :max="10" v-model="pageCurrentData.interval" @on-change="autoplayDelayChange"></Slider>
        </Col>
      </Row>
    </div>
    <div v-if="pageCurrentData.type == 'gndh'" class="margin-bottom">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3">显示行数</Col>
        <Col span="8">
          <Select v-model="pageCurrentData.rowsNum" @on-change="rowsNumChange()">
            <Option value="1"> 一行</Option>
            <Option value="2"> 两行</Option>
            <Option value="3"> 三行</Option>
            <Option value="4"> 四行</Option>
            <Option value="5"> 五行</Option>
            <Option value="6"> 六行</Option>
            <Option value="7"> 七行</Option>
            <Option value="8"> 八行</Option>
            <Option value="9"> 九行</Option>
            <Option value="10"> 十行</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">一行显示</Col>
        <Col span="8">
          <Select v-model="pageCurrentData.columnNum" @on-change="columnNumChange()">
            <Option value="2"> 两个</Option>
            <Option value="3"> 三个</Option>
            <Option value="4"> 四个</Option>
            <Option value="5"> 五个</Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <span class="row-label">图文样式</span>
        <Col span="20">
        <span class="img-text-style" :class="{'teml-active':pageCurrentData.style == 'imgStyle'}"
              @click="moduleStyleChange('imgStyle')">
          <img width="70px" height="70px" src="@/../static/images/image-ad/ctp.png">
        </span>
          <span class="img-text-style" :class="{'teml-active':pageCurrentData.style == 'imgTextStyle'}"
                @click="moduleStyleChange('imgTextStyle')">
          <img width="70px" height="70px" src="@/../static/images/image-ad/tpwz.png">
        </span>
          <span class="img-text-style" :class="{'teml-active':pageCurrentData.style == 'minImgTextStyle'}"
                @click="moduleStyleChange('minImgTextStyle')">
          <img width="70px" height="70px" src="@/../static/images/image-ad/tpxwz.png">
        </span>
        </Col>
      </Row>
    </div>
    <div v-if="pageCurrentData.type == 'yhyg'" class="margin-bottom">
      <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
        <Col span="3"> 图片间隙
        </Col>
        <Col offset="1" span="18">
          <Slider :max="30" width="300px" v-model="pageCurrentData.space"></Slider>
        </Col>
      </Row>
    </div>
    <!--角标样式相关-->
    <div>
      <Row type="flex" justify="start" class="row-padding">
        <Col span="4"> 角标样式
        </Col>
        <Col span="20">
          <RadioGroup v-model="pageCurrentData.cornerStyle">
            <Radio :label="1">
              <span>样式1</span>
            </Radio>
            <Radio :label="2">
              <span>样式2</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 角标距离右边
        </Col>
        <Col offset="1" span="18">
          <Slider :max="100" :step="1" width="300px" v-model="pageCurrentData.cornerMarginRight"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 角标距离顶部
        </Col>
        <Col offset="1" span="18">
          <Slider :max="100" :step="1" width="300px" v-model="pageCurrentData.cornerMarginTop"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4"> 显示情况
        </Col>
        <Col offset="1" span="18">
          <Checkbox v-model="pageCurrentData.zeroIsShow">为0时继续显示</Checkbox>
        </Col>
      </Row>
    </div>
    <div v-if="pageCurrentData.type == 'lbdh'" class="margin-bottom"></div>
    <draggable :list="pageCurrentData.rows" @end="dragEnd">
      <div v-for="(item,index) in pageCurrentData.rows" :key="index" @click="toggleMainMix(index)"
           class="edit-item margin-bottom">
        <Row v-show="toggleMainMixActive == index" type="flex" align="middle">
          <Col span="7">
            <div class="center-img-div big-height" @click="selectImg(index)">
              <img :src="item.imgUrl" class="big-img">
            </div>
          </Col>
          <Col span="17">
            <p>标题：
              <Input type="text" v-model="item.title" style="width: 150px"></Input>
              <img class="remove-item-img" src="static/images/design/X.png" @click="removeRowItem(index)">
            </p>
            <br>
            <p>链接：
              <a @click.prevent="editLine(item,index)" href="" v-if="linkShow">{{getLinkMsg(item)}}</a>
            </p>
            <template
              v-if="pageCurrentData.type == 'gndh' || pageCurrentData.type == 'lbdh' || pageCurrentData.type == 'lbt'">
              <br>
              <p>角标：
                <Checkbox v-model="item.cornerMark" @on-change="refreshCornerMark">是否显示角标</Checkbox>
              </p>
              <p v-if="item.cornerMark">数量接口：
                <Input type="text" v-model="item.cornerMarkUrl" style="width: 200px"></Input>
              </p>
              <p v-if="item.cornerMark">数量取值key：
                <Input type="text" v-model="item.cornerMarkKey" placeholder="基于data的取数规则，如：data.number" style="width: 200px"></Input>
              </p>
              <!--cornerMarkKey 基于data的取数规则-->
            </template>
            <br>
            <p>
              <Checkbox v-model="item.cannotSee">部分人员可见</Checkbox>
            </p>
            <p v-if="item.cannotSee">
              <CheckboxGroup v-model="item.canSeenArr">
                <Checkbox label="empFlag">员工可见</Checkbox>
                <Checkbox :label="member.rankCode" v-for="(member, idx) in memberLevels" :key="idx">{{member.name}}
                </Checkbox>
              </CheckboxGroup>
            </p>
            <p v-if="item.cannotSee">
              <CheckboxGroup v-model="item.canSeenGroups">
                <Checkbox :label="member.id" v-for="(member, idx) in memberGroups" :key="idx">{{member.clusterName}}
                </Checkbox>
              </CheckboxGroup>
            </p>
            <p>
              <div style="margin: 10px 0;">部分时间可见：</div>
              <div style="margin-right:10px;">
                <DatePicker :value="item.seeTime" @on-change="item.seeTime = $event" format="yyyy-MM-dd HH:mm" type="datetimerange" placement="bottom-end" placeholder="默认为所有时间可见" style="width: 100%"/>
              </div>
            </p>
          </Col>
        </Row>
        <Row v-show="toggleMainMixActive != index" type="flex" justify="center" align="middle">
          <Col span="2" offset="1">
            <div class="center-img-div small-height">
              <img width="25px" height="25px" :src="item.imgUrl" class="small-img">
            </div>
          </Col>
          <Col span="21"> {{item.title}}
            <a href="" style="float: right; margin-right: 20px" v-if="item.link && item.link.label">{{getLinkMsg(item)}}</a>
          </Col>
        </Row>
      </div>
    </draggable>
    <Row @click.native="addItemNav" class="edit-item margin-bottom">
      <Col span="24"> + 添加一项数据
      </Col>
    </Row>
    <BgEdit :bgImgSize="bgImgSize"></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import {mapGetters, mapMutations} from "vuex";
  import Bus from "../bus";
  import draggable from 'vuedraggable';

  export default {
    name: "image-ad-edit",
    components: {
      BgEdit,
      draggable
    },
    data() {
      return {
        isModal: false,
        linkShow: true,
        layoutList: [
          {
            url: "lbhb",
            name: "轮播广告",
            id: "lbt"
          },
          {
            url: "tpdh",
            name: "功能导航",
            id: "gndh"
          },
          {
            url: "hzrq",
            name: "一行一个",
            id: "yhyg"
          },
          {
            url: "twlb",
            name: "列表导航",
            id: "lbdh"
          }
        ],
        editLineIndex: "",
        rowsNum: "",
        columnNum: "",
        toggleMainMixActive: "",
        scrollType: "横向滚动",
        bgImgSize: "",
      };
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData", "markDialog", "memberLevels", 'memberGroups'])
    },
    created() {
      if (!this.pageCurrentData.space) {
        this.pageCurrentData.space = 0;
      }
      // console.log(this.pageCurrentData);
      // this.rowsNum = this.pageCurrentData.rowsNum;
      // this.columnNum = this.pageCurrentData.columnNum;
    },
    methods: {
      refreshCornerMark: function () {
        Bus.$emit("refreshShowComponent")
      },
      dragEnd(e) {
        Bus.$emit("refreshShowComponent")
      },
      removeRowItem: function (index) {
        this.pageCurrentData.rows.splice(index, 1)
        Bus.$emit("refreshShowComponent")
      },
      selectImg: function (index) {
        Bus.$emit("showImgCenter", item => {
          this.pageCurrentData.rows[index].imgUrl = item.url;
          if (index == 0) {
            let relativeSize = item.imgHeight / item.imgWidth;
            this.pageCurrentData.ratio = relativeSize;
            // this.$emit("resetSwiper");
          }
          Bus.$emit("refreshShowComponent")
        });
      },
      // 添加一个图文导航
      addItemNav: function () {
        this.pageCurrentData.rows.push({
          imgUrl: "@/../static/images/defaultImg.png",
          title: "标题",
          idCode: this.$util.randomString(),
          cornerMark: false,
          link: {
            url: "",
            mustLogined: "",
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.pageCurrentData.rows.length - 1;
        // if (this.toggleMainMixActive == 1) {
        //
        // }
        Bus.$emit("refreshShowComponent")
      },
      getLinkMsg: function (item) {
        let str = "请选择跳转页面链接地址";
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
      getMarkMsg: function (item) {
        if (!item.link.markUrl) {
          return "请选择数量接口";
        } else {
          return item.link.markUrl;
        }
      },
      // 选择要跳转的页面
      editLine: function (rowItem, index) {
        this.editLineIndex = index;
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: rowItem.link,
          callback: item => {
            if (item) {
              this.pageCurrentData.rows[index].link = item;
            }
          }
        });
      },
      // 选择角标数量
      editLineCorner: function (rowItem, index) {
        this.editLineIndex = index;
        Bus.$emit("showLinkCenter", {
          linkSelType: '1',
          linkData: rowItem.link,
          callback: item => {
            if (item) {
              this.pageCurrentData.rows[index].link = item;
            }
          }
        });
      },
      setCornerMarkDialog: function () {
        this.setMarkDialog(true);
      },
      // 选择布局类型
      selectLayout: function (item, index) {
        this.pageCurrentData.type = item.id;
        if (item.id == "lbt") {
          let h = Math.round(750 * this.pageCurrentData.ratio);
          this.bgImgSize = "750 * " + h;
        }
        if (item.id == "gndh") {
          let w = 750 / this.columnNum;
          let h = Math.round(w * this.pageCurrentData.ratio);
          this.bgImgSize = `${w} * ${h}`;
        }
        if (item.id == "yhyg") {
          let h = Math.round(750 * this.pageCurrentData.ratio);
          this.bgImgSize = "750 * " + h;
        }
        if (item.id == "lbdh") {
          this.bgImgSize = "35 * 35";
        }
        Bus.$emit("refreshShowComponent")
      },
      toggleMainMix: function (index) {
        this.toggleMainMixActive = index;
      },
      // 功能导航选择行数
      rowsNumChange: function (value) {
        Bus.$emit("refreshShowComponent")
      },
      // 功能导航选择一行几个
      columnNumChange: function (value) {
        let w = 750 / this.pageCurrentData.columnNum;
        let h = Math.round(w * this.pageCurrentData.ratio);
        this.bgImgSize = `${w} * ${h}`;
        Bus.$emit("refreshShowComponent")
      },
      // 设置功能导航的样式
      moduleStyleChange: function (value) {
        this.pageCurrentData.style = value;
      },
      // 设置轮播图的自动切换时间间隔
      autoplayDelayChange: function () {
        Bus.$emit("refreshShowComponent")
      },
      ...mapMutations({
        setMarkDialog: "setMarkDialog"
      })
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .image-ad-edit {
    padding: 0px 10px;
    border: 1px solid gray;
    background-color: white;
    font-size: 14px;
    box-sizing: border-box;
  }

  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
  }

  .notice-input {
    background-color #efefef;
    width 100%;
    padding 8px;
  }

  .div-btn {
    padding: 20px 10px;
    position: relative;
    padding: 10px 0 40px;
    border: 1px solid #ddd;
    background-color: #fff;

    img {
      width: 100%;
    }

    span {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-top: 1px solid #ddd;
    }
  }

  .teml-active {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    border: 0;

    span {
      border: 0;
    }
  }

  .model-img {
    width: 20%;
    height: 100px;
  }

  .prop {
    position: absolute;
    left: 400px;
    width: 400px;
    border: 1px solid gray;
    background-color: white;
    font-size: 14px;
    box-sizing: border-box;
    padding: 10px;
  }

  .eidt-div .edit-line {
    margin-left: 0;
    width: 100%;
  }

  .style-box {
    text-align: center;
    width: 100px;
    margin: 10px 10px;
  }

  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;

    img {
      border: 1px solid #dcdddd;
    }
  }

  .row-label__max {
    font-size: 16px;
  }

  .img-text-style {
    display: inline-block;
    font-size: 0;
  }
</style>
