<template>
  <EditLayout :title="'编辑区-'+editingItem.name">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 样式：
      </Col>
      <Col span="20">
        <RadioGroup v-model="adData.styleTempl" @on-change="styleChanged">
          <Radio label="1">
            <span>全屏（拉伸）</span>
          </Radio>
          <Radio label="2">
            <span>居中（周边留白）</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 关闭风格：
      </Col>
      <Col span="20">
        <RadioGroup v-model="adData.closeStyle" @on-change="styleChanged">
          <Radio label="1">
            <span>倒计时关闭</span>
          </Radio>
          <Radio label="2">
            <span>右上角</span>
          </Radio>
          <Radio label="3" v-show="adData.styleTempl != 1">
            <span>图片下面</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding" v-show="adData.closeStyle == 1">
      <Col span="4"> 展示时长：
      </Col>
      <Col span="20">
        <Select v-model="adData.showTime">
          <Option :value="2">2秒</Option>
          <Option :value="3">3秒</Option>
          <Option :value="5">5秒</Option>
          <Option :value="8">8秒</Option>
          <Option :value="10">10秒</Option>
          <Option :value="15">15秒</Option>
          <Option :value="30">30秒</Option>
          <Option :value="45">45秒</Option>
          <Option :value="60">60秒</Option>
        </Select>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 展示频率：
      </Col>
      <Col span="20">
        <RadioGroup v-model="adData.showFrequency">
          <Radio label="1">
            <span>一天一次</span>
          </Radio>
          <Radio label="2">
            <span>仅展示一次</span>
          </Radio>
          <Radio label="3">
            <span>每次打开展示（每5分钟展示一次）</span>
          </Radio>
          <Radio label="4">
            <span>每次打开展示（无时间间隔）</span>
          </Radio>
          <!--<Radio label="3" v-show="adData.styleTempl != 1">-->
          <!--<span>图片下面</span>-->
          <!--</Radio>-->
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="editingItem.customKey.type != ''">
      <Row type="flex" justify="start" align="middle" class="row-padding" v-if="editingItem.customKey.type == 'Common'">
        <Col span="6"> 广告弹出页面：
        </Col>
        <Col span="18">
          <a @click.prevent="editCustomKey" href="">{{getCustomKey()}}</a>
        </Col>
      </Row>
    </template>
    <Row v-if="adData.styleTempl == 2" type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 宽度：
      </Col>
      <Col span="19">
        <Slider :min="40" :max="100" v-model="adData.width"></Slider>
      </Col>
    </Row>
    <div v-for="(item,index) in adData.rows" :key="index" @click="toggleMainMix(index)" class="edit-item margin-top">
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
              <Checkbox :label="member.rankCode" v-for="(member, idx) in memberLevels" :key="idx">
                {{member.name}}
              </Checkbox>
            </CheckboxGroup>
          </p>
          <br>
          <p>
            <div style="margin: 10px 0;">部分时间可见：</div>
            <div style="margin-right:10px;">
              <DatePicker :value="item.canSeeTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="默认为所有时间可见" @on-change="changeData" style="width: 100%"/>
            </div>
          </p>
        </Col>
      </Row>
      <Row v-show="toggleMainMixActive != index" type="flex" justify="center" align="middle">
        <template v-if="item.title == '' || item.title == '标题'">
          <Col span="8" offset="1">
            <span v-if="linkShow">{{getLinkMsg(item)}}</span>
          </Col>
          <Col span="14" offset="1">
            <span style="float: right; margin-right: 20px" v-if="linkShow">{{item.canSeeTime | timeShow}}</span>
          </Col>
        </template>
        <template v-else>
          <Col span="2" offset="1">
            <div class="center-img-div small-height">
              <img width="25px" height="25px" :src="item.imgUrl" class="small-img">
            </div>
          </Col>
          <Col span="21"> {{item.title}}
            <span style="float: right; margin-right: 20px" v-if="linkShow">{{item.canSeeTime | timeShow}}</span>
          </Col>
        </template>
      </Row>
    </div>
    <Row @click.native="addItemNav" class="edit-item margin-top">
      <Col span="24"> + 添加一项数据
      </Col>
    </Row>
  </EditLayout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";

  export default {
    name: 'ad-view-edit',
    props: ['editingItem'],
    data() {
      return {
        toggleMainMixActive: 0,
        linkShow: true,
      }
    },
    computed: {
      ...mapGetters(['pageData', 'memberLevels']),
      adData: function () {
        return this.pageData.adData || {};
      },
    },
    components: {},
    filters:{
      timeShow(v){
        if(v && v[0]){
          return `${v[0]} - ${v[1]}`;
        }else{
          return '';
        }
      }
    },
    methods: {
      changeData(date){
        const item = this.adData.rows[this.toggleMainMixActive]
        item.canSeeTime = date;
      },
      removeRowItem: function (index) {
        this.adData.rows.splice(index, 1)
      },
      // 选择要跳转的页面
      editLine: function(rowItem, index) {
        this.editLineIndex = index;
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: rowItem.link,
          callback: item => {
            if (item) {
              this.adData.rows[index].link = item;
            }
          }
        });
      },
      // getMemberLevels: function () {
      //   let url = '/system/json/system_manage/queryDictsByAlias';
      //   let paramsData = {
      //     token: this.$store.state.login.token,
      //     alias: 'UserLevel'
      //   };
      //   this.$http.post(url, params).then(
      //     res => {
      //       let data = res.data;
      //       if (data) {
      //         this.memberLevels = data.data
      //       }
      //     },
      //     error => {
      //       this.$Message.error('网络加载较慢，请稍后重试!');
      //     }
      //   );
      // },
      selectImg: function (index) {
        Bus.$emit("showImgCenter", item => {
          this.adData.rows[index].imgUrl = item.url;
        });
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
      addItemNav: function () {
        this.adData.rows.push({
          imgUrl: "static/images/defaultImg.png",
          title: "标题",
          link: {
            url: "",
            mustLogined: "",
            idCode:this.$util.randomString(),
            renderNav: ""
          }
        });
        this.toggleMainMixActive = this.adData.rows.length - 1;
        if (this.toggleMainMixActive == 1) {
        }
      },
      toggleMainMix: function (index) {
        this.toggleMainMixActive = index;
      },
      styleChanged: function () {
        let styleTempl = this.adData.styleTempl
        console.log(styleTempl)
      },
      editCustomKey: function () {
        Bus.$emit('showLinkCenter', {
          linkSelType: '3',
          linkData: {},
          callback: item => {
            if (item) {
              console.log(item)
              this.editingItem.customKey = {
                type: this.editingItem.customKey.type,
                name: item.name,
                key: item.pgCode
              }
              this.$emit('customKeyBack', {
                type: this.editingItem.customKey.type,
                name: item.name,
                key: item.pgCode
              })
            }
          }
        });
      },
      getCustomKey: function () {
        if (this.editingItem.customKey.name != '') {
          return this.editingItem.customKey.name;
        }
        return '请选择广告弹出页面'
      }
    },
    created() {
      console.log('this.adData',this.adData)
      // this.getMemberLevels()
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'

  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;

    img {
      border: 1px solid #dcdddd;
    }

    &.margin-top {
      margin-top 10px;
    }

    .remove-item-img {
      float right;
      width 20px;
      height 20px;
      border-radius 10px;
      overflow hidden;
    }
  }
</style>
