/**Created by liaoyingchao on 2019-06-18.*/

<template>
  <EditLayout title="编辑区--流动封面">
    <div class="line_bottom">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="4">
          翻页类型
        </Col>
        <Col offset="1" span="18">
          <RadioGroup v-model="pageCurrentData.coverType" @on-change="changeCoverType">
            <Radio label="1">
              <span>类型1</span>
            </Radio>
            <Radio label="2">
              <span>类型2</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
    </div>
    <div>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上浮距离
        </Col>
        <Col offset="1" span="18">
          <Slider :max="20" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>
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
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 转角大小
        </Col>
        <Col offset="1" span="18">
          <Slider :max="80" :min="30" :step="5" width="300px" v-model="pageCurrentData.rotate"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 图间距
        </Col>
        <Col offset="1" span="18">
          <Slider :max="40" :min="0" :step="5" width="300px" v-model="pageCurrentData.spaceBetween"></Slider>
        </Col>
      </Row>
    </div>
    <div v-for="(item,index) in pageCurrentData.rows" :key="index" @click="toggleMainMix(index)" class="edit-item margin-bottom">
      <Row v-show="toggleMainMixActive == index" type="flex" align="middle">
        <Col span="7">
          <div class="center-img-div big-height">
            <img @click="selectImg(index)" :src="item.imgUrl" class="big-img">
          </div>
        </Col>
        <Col span="17">
          <p>标题：
            <Input type="text" v-model="item.title" style="width: 150px"></Input>
            <img class="remove-item-img" src="static/images/design/X.png" @click="removeRowItem(index)">
          </p>
          <br>
          <p>链接：
            <a @click.prevent="editLine(item,index)" href="">{{getLinkMsg(item)}}</a>
          </p>
          <br>
          <p>
            <Checkbox v-model="item.cannotSee">部分人员可见</Checkbox>
          </p>
          <p v-if="item.cannotSee">
            <CheckboxGroup v-model="item.canSeenArr">
              <Checkbox label="empFlag">员工可见</Checkbox>
              <Checkbox :label="member.rankCode" v-for="(member, idx) in memberLevels" :key="idx">{{member.name}}</Checkbox>
            </CheckboxGroup>
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
          <a href="" style="float: right; margin-right: 20px" v-if="item.link.label">{{getLinkMsg(item)}}</a>
        </Col>
      </Row>
    </div>
    <Row @click.native="addItemNav" class="edit-item margin-bottom">
      <Col span="24"> + 添加一项数据
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import { mapGetters, mapMutations } from "vuex";
  import Bus from "../bus";

  export default {
    name: "coverflow-edit",
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(["pageData", "pageCurrentData", "markDialog", "memberLevels"])
    },
    data() {
      return {
        toggleMainMixActive: "",
      }
    },
    methods: {
      changeCoverType: function () {
        Bus.$emit("refreshCoverFlow")
      },
      removeRowItem: function (index) {
        this.pageCurrentData.rows.splice(index, 1)
        Bus.$emit("refreshCoverFlow")
      },
      selectImg: function(index) {
        Bus.$emit("showImgCenter", item => {
          this.pageCurrentData.rows[index].imgUrl = item.url;
          if (index == 0) {
            let relativeSize = item.imgHeight / item.imgWidth;
            this.pageCurrentData.ratio = relativeSize;
          }
          Bus.$emit("refreshCoverFlow")
        });
      },
      toggleMainMix: function(index) {
        this.toggleMainMixActive = index;
      },
      // 添加一个图文导航
      addItemNav: function() {
        this.pageCurrentData.rows.push({
          imgUrl: "@/../static/images/defaultImg.png",
          title: "标题",
          link: {
            url: "",
            mustLogined: "",
            idCode:this.$util.randomString(),
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.pageCurrentData.rows.length - 1;
        Bus.$emit("refreshCoverFlow")
        // if (this.toggleMainMixActive == 1) {
        //   Bus.$emit("refreshCoverFlow")
        // }
      },
      getLinkMsg: function(item) {
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
      // 选择要跳转的页面
      editLine: function(rowItem, index) {
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
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coverflow-edit {
    width 100%
    height 100%
    overflow hidden
  }
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
