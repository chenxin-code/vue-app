/**Created by liaoyingchao on 2019-06-11.*/

<template>
  <EditLayout title="编辑区--加油免单">
    <Row type="flex" justify="start" align="middle" class="row-padding">
      <Col span="4"> 选择活动
      </Col>
      <Col offset="1" span="18">
        <Select v-model="pageCurrentData.activityId" @on-change="activityChanged">
          <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}  （时间：{{item.startTime}}-{{item.endTime}}）</Option>
        </Select>
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
      <Row class="row-padding">
        <Col span="4">
          <div> 顶部图片 </div>
        </Col>
        <Col span="18">
          <div class="image-div" @click="changeImg(1)">
            <img :src="pageCurrentData.topImg"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 中间背景图片 </div>
        </Col>
        <Col span="18">
          <div class="image-div" @click="changeImg(3)">
            <img :src="pageCurrentData.middleBgImg"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row class="row-padding">
        <Col span="4">
          <div> 底部图片 </div>
        </Col>
        <Col span="18">
          <div class="image-div" @click="changeImg(2)">
            <img :src="pageCurrentData.bottomImg"/>
            <p class="tip">点击更换图片</p>
          </div>
        </Col>
      </Row>
      <Row type="flex" align="middle" class="row-padding">
        <Col span="6"> 文字颜色
        </Col>
        <Col span="8">
          <ColorPicker v-model="pageCurrentData.textColor" />
        </Col>
      </Row>
      <Row type="flex" align="middle" class="row-padding">
        <Col span="6"> header背景颜色
        </Col>
        <Col span="8">
          <ColorPicker v-model="pageCurrentData.headerBgColor" />
        </Col>
      </Row>
    <Row type="flex" align="middle" class="row-padding">
      <Col span="6"> 表单文字颜色
      </Col>
      <Col span="8">
        <ColorPicker v-model="pageCurrentData.formTextColor" />
      </Col>
    </Row>
      <!--<BgEdit :bgImgSize="bgImgSize"></BgEdit>-->
  </EditLayout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import BgEdit from "../base/bg-edit";
  import Bus from "../bus";

  export default {
    name: "fuel-free-edit",
    components: {
      BgEdit
    },
    data() {
      return {
        bgImgSize: '750 x *',
        list: [],
        selected: ''
      }
    },
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    methods: {
      activityChanged: function () {
        Bus.$emit('fuelRefresh');
      },
      changeImg: function (tag) {
        Bus.$emit('showImgCenter', item => {
          if (item) {
            if (tag == 1) {
              this.pageCurrentData.topImg = item.url;
            } else if (tag == 2) {
              this.pageCurrentData.bottomImg = item.url;
            } else if (tag == 3) {
              this.pageCurrentData.middleBgImg = item.url;
            }
          }
        });
      },
      getActivityList: function () {
        let url = '/app/jqGrid/app_refuel_free_activity_order/getFreeActivityList';
        this.$http.post(url, {}).then(
          res => {
            let data = res.data;
            if (data.status == '0') {
              this.list = data.data;
              // let acData = data.data;
              // this.periods = acData.periods
              // this.drawRosters = acData.drawRosters
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      this.getActivityList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
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
</style>
