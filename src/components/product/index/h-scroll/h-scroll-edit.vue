/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <EditLayout title="编辑区--横滑组件">
    <div class="row-padding">
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
      <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
        <Col span="3"> 图片间距
        </Col>
        <Col offset="1" span="18">
          <Slider :min="0" :max="30" width="300px" v-model="pageCurrentData.space"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
        <Col span="3"> 标题图片
        </Col>
        <Col offset="1" span="18">
        <div class="image-div" @click="changeImg">
          <img :src="pageCurrentData.titleImg"/>
          <p class="tip">标题图片，点击更换</p>
        </div>
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
            <a @click.prevent="editLine(item,index)" href="" v-if="linkShow">{{getLinkMsg(item)}}</a>
          </p>
          <br>
          <p>
            <Checkbox v-model="item.cannotSee">部分人员可见</Checkbox>
          </p>
          <p v-if="item.cannotSee">
            <CheckboxGroup v-model="item.canSeenArr">
              <Checkbox label="empFlag">员工可见</Checkbox>
              <Checkbox :label="member.dictKey" v-for="(member, idx) in memberLevels" :key="idx">{{member.dictValue}}</Checkbox>
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
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: 'h-scroll-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        linkShow: true,
        toggleMainMixActive: 0,
        memberLevels: [],
        editLineIndex: ''
      };
    },
    methods: {
      // 添加一个图文导航
      addItemNav: function() {
        this.pageCurrentData.rows.push({
          imgUrl: "@/../static/images/defaultImg.png",
          title: "标题",
          link: {
            url: "",
            mustLogined: "",
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.pageCurrentData.rows.length - 1;
      },
      selectImg: function(index) {
        Bus.$emit("showImgCenter", item => {
          this.pageCurrentData.rows[index].imgUrl = item.url;
          if (index == 0) {
            let relativeSize = item.imgHeight / item.imgWidth;
            this.pageCurrentData.ratio = relativeSize;
          }
        });
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
      removeRowItem: function (index) {
        this.pageCurrentData.rows.splice(index, 1)
      },
      toggleMainMix: function(index) {
        this.toggleMainMixActive = index;
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
      styleChanged: function () {
        let styleTempl = this.pageCurrentData.styleTempl
        if (styleTempl == 1) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/titleImg.png'
          this.pageCurrentData.bgImgUrl = ''
        } else if (styleTempl == 2) {
          this.pageCurrentData.titleImg = 'static/images/fuel-prices/youjia_icon.png'
          this.pageCurrentData.bgImgUrl = 'static/images/fuel-prices/youjia_bg.png'
        }
      },
      changeImg: function () {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            this.pageCurrentData.titleImg = item.url;
          }
        });
      }
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;
    img {
      border: 1px solid #dcdddd;
    }
  }
  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
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
