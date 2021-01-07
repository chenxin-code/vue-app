<template>
  <div class="bg-edit">
    <Row type="flex" align="middle">
      <Col span="4"> 背景颜色
      </Col>
      <Col span="10">
        <div v-for="(item,index) in defaultColorList" @click="selectColor(item, index)" class="color-picker">
          <div :style="{backgroundColor:item}" class="color-card">
          </div>
        </div>
      </Col>
      <Col span="8">
        <ColorPicker v-model="pageCurrentData.bgColor" />
      </Col>
    </Row>
    <Row class="row-padding row-bottom-line" type="flex" align="middle">
      <Col span="4">背景图片</Col>
      <Col span="20">
        <div class="input-div" @click="selectImg">
          <div class="clear-div" v-if="pageCurrentData.bgImgUrl != ''">
            <img src="static/images/design/X.png" @click.stop="removeBgImg">
          </div>
          <img v-if="pageCurrentData.bgImgUrl != ''" :src="pageCurrentData.bgImgUrl"/>
          <!--<p class="good-tip" v-if="pageCurrentData.bgImgUrl == ''">建议图片尺寸{{bgImgSize}}</p>-->
          <p class="tip-p">{{pageCurrentData.bgImgUrl == '' ? '点击上传背景图片' : '点击更换背景图片'}}</p>
        </div>
      </Col>
    </Row>
    <!--<Row type="flex" justify="start" align="middle" class="row-padding">-->
      <!--<Col span="3"> 截止日期-->
      <!--</Col>-->
      <!--<Col offset="1" span="18">-->
        <!--<DatePicker v-model="pageCurrentData.endDate" type="date" :options="dataOptions" placeholder="结束时间（为空不限制，选中日期零点之后失效）" style="width: 300px"></DatePicker>-->
      <!--</Col>-->
    <!--</Row>-->
    <!--<Row type="flex" align="middle">-->
      <!--<Button type="primary" @click="resetBGC">重置背景色</Button>-->
      <!--&nbsp;&nbsp;-->
      <!--<Button type="primary" @click="reserBGP">重置背景图片</Button>-->
    <!--</Row>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from '../bus';

export default {
	name: 'bg-edit',
	components: {},
	computed: {
		...mapGetters(['pageCurrentData']),
	},
  props: ['bgImgSize'],
	data() {
		return {
      dataOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now();
        }
      },
			color: '',
      defaultColorList: [
        '#F96702',
        '#328967',
        ''
      ],
			activeColor: '',
		};
	},
	methods: {
		testFunc: function() {
			console.log('testFunc');
		},
    removeBgImg: function () {
      this.pageCurrentData.bgImgUrl = '';
      let color = this.pageCurrentData.bgColor
      this.pageCurrentData.bgColor = '';
      this.$nextTick(() => {
        this.pageCurrentData.bgColor = color;
      })
    },
		selectImg: function() {
			Bus.$emit('showImgCenter', item => {
				if (item) {
					this.pageCurrentData.bgImgUrl = item.url;
				}
			});
		},
		selectColor: function(color, index) {
			this.pageCurrentData.bgColor = color;
			this.activeColor = index;
    },
    resetBGC: function() {
			this.pageCurrentData.bgColor = '';
    },
    reserBGP: function() {
      this.pageCurrentData.bgImgUrl = ''
    }
	},
	created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bg-edit {
    border-top 1px solid #c9caca
    padding-top 10px;
    width 100%
    .row {
      height 32px;
      margin-bottom 10px;
      .label {
        float left;
        height 32px;
        line-height 32px;
        font-size 12px;
        margin-right 10px;
      }
    }
    .input-div {
      overflow hidden
      width 330px;
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
.color-picker {
  float left
  height: 32px;
  padding: 6px 7px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  margin-left: 5px;
  .color-card {
    width: 18px;
    height: 18px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
}
</style>
