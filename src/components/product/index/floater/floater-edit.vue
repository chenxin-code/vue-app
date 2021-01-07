/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <EditLayout title="编辑区--浮动组件">
    <div class="type">
      <div class="edit-label">类型：</div>
      <RadioGroup v-model="pageCurrentData.type">
        <Radio label="default">默认</Radio>
        <Radio label="none">没有浮动组件</Radio>
      </RadioGroup>
      <span class="edit-line"></span>
    </div>
    <div class="row-padding">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 浮框大小
        </Col>
        <Col offset="1" span="18">
          <Slider :min="5" :max="30" :step="0.5" width="300px" v-model="pageCurrentData.size"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 浮框位置
        </Col>
        <Col offset="1" span="18">
          <Slider :min="0" :max="90" :step="1" width="300px" v-model="pageCurrentData.positionBottom"></Slider>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 显示图片 </div>
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeImg(1)">
            <img :src="pageCurrentData.imgUrl"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 害羞图片 </div>
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeImg(2)">
            <img :src="pageCurrentData.shymgUrl"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 完成图片: </div>
        </Col>
        <Col span="10">
          <div class="image-div" @click="changeImg(3)">
            <img :src="pageCurrentData.finishedImgUrl"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
        <Col span="4">
          <div> 完成类型: </div>
        </Col>
        <Col span="6">
          <Select v-model="pageCurrentData.finishType" style="width:100px">
            <Option v-for="item in finishTypeArr" :value="item.key" :key="item.key">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="row-padding">
        <p>链接：
          <a @click.prevent="editLine" href="" v-if="refresh">{{getLinkMsg(pageCurrentData.link)}}</a>
        </p>
      </Row>

    </div>
  </EditLayout>
</template>

<script>
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: 'floater-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {},
    data() {
      return {
        finishTypeArr: [{
          key: 'Singin',
          label: '当日已签到'
        }],
        linkShow: true,
        toggleMainMixActive: 0,
        memberLevels: [],
        editLineIndex: '',
        refresh: true
      };
    },
    methods: {
      // 选择要跳转的页面
      editLine: function() {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: this.pageCurrentData.link,
          callback: item => {
            if (item) {
              this.pageCurrentData.link = item;
              this.refresh = false
              this.$nextTick(() => {
                this.refresh = true
              })
            }
          }
        });
      },
      getLinkMsg: function(link) {
        let str = "请选择跳转页面链接地址";
        if (link && link.name && link.name != "") {
          str = link.name;
        } else if (link && link.url && link.url != "") {
          str = link.url;
        }
        if (link && link.mustLogined) {
          str += '__需要登录'
        }
        if (link && link.renderNav) {
          str += '__需要原生导航'
        }
        return str;
      },
      changeImg: function (tag) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            if (tag == 1) {
              this.pageCurrentData.imgUrl = item.url;
            } else if (tag == 2) {
              this.pageCurrentData.shymgUrl = item.url;
            } else if (tag == 3) {
              this.pageCurrentData.finishedImgUrl = item.url;
            }
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
    position relative;
    overflow hidden;
    text-align center;
    font-size 0px;
    img {
      height 66px;
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
