<template>
	<EditLayout title="属性编辑 - 魔方">
		<Row type="flex" justify="start" align="middle" class="row-padding">
      <span class="row-label row-label__max">选择模板</span>
    </Row>
		<Row>
			<Col span="24">
			<Row :gutter="10">
				<Col span="6" class="text-right" @click.native="selectTemplate(item,index)" v-for="(item,index) in templateList" :key="index">
				<div class="template-box">
					<img class="template-img" :src="item.img" :class="{active: index+1 == pageCurrentData.type}">
					<p> {{item.name}} </p>
				</div>
				</Col>
			</Row>
			</Col>
		</Row>
		<template v-if="pageCurrentData.type == 8">
			<Row type="flex" justify="center" align="middle">
				<Col span="4" class="text-right">魔方密度</Col>
				<Col span="20">
				<Select v-model="pageCurrentData.customInfo.size" @on-change="cubeClassChange(pageCurrentData.customInfo.size)" style="width:200px">
					<Option :value="4"> 4X4 </Option>
					<Option :value="5"> 5X5 </Option>
					<Option :value="6"> 6X6 </Option>
          <Option :value="7"> 7X7 </Option>
          <Option :value="8"> 8X8 </Option>
          <Option :value="9"> 9X9 </Option>
          <Option :value="10"> 10X10 </Option>
          <Option :value="11"> 11X11 </Option>
          <Option :value="12"> 12X12 </Option>
				</Select>
				</Col>
			</Row>
			<br>
			<Row>
				<Col span="4" class="text-right">布局</Col>
				<Col span="20" class="cube-box">
				<div class="cube-row">
					<div @mouseover="mouseoverCubeItem(item)" @mouseout="mouseoutCubeItem(item)" @click="clickCubeItem(item)" v-for="(item, index) in cubeList" class="cube-item" :class="{'cube-active':item.state}" :style="{width: `${100/pageCurrentData.customInfo.size}%`}">
						<span class="cube-add"> {{item.saveId}} </span>
					</div>
				</div>
				</Col>
			</Row>
			<br>
		</template>
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
		<Row type="flex" justify="start" align="middle" v-if="pageCurrentData.type < 4">
			<Col span="3" class="text-right">图片间隙</Col>
			<Col offset="1" span="19">
			<Slider :max="30" v-model="spaceValue" @on-change="spaceValueChange(spaceValue)"></Slider>
			</Col>
		</Row>
		<div v-for="(item,index) in templateItems" @click="toggleMainMix(index)">
			<Row v-show="toggleMainMixActive == index" class="edit-item margin-bottom">
				<Col span="7" >
				<img @click="selectImg(index)" width="100px" height="100px" :src="item.imgUrl" class="block-img">
				</Col>
				<Col span="17">
				<p>链接：
					<a @click.prevent="editLine(item,index)" href="">{{getLinkMsg(item)}}</a>
				</p>
				<br>
				<p>
					{{item.imgRatio}}
				</p>
				</Col>
			</Row>
			<Row v-show="toggleMainMixActive != index" type="flex" justify="start" align="middle" class="edit-item margin-bottom">
				<Col span="2">
				<img width="25px" height="25px" :src="item.imgUrl" class="block-img">
				</Col>
				<Col span="21">
				<p>
					&nbsp;&nbsp; {{item.imgRatio}}
				</p>
				</Col>
			</Row>
		</div>
		<BgEdit :bgImgSize="bgImgSize"></BgEdit>
	</EditLayout>
</template>

<script>
  import BgEdit from '../base/bg-edit';
import { mapGetters } from 'vuex';
import Bus from '../bus';

export default {
	name: 'rubik-edit',
	components: {
		BgEdit,
	},
	data() {
		return {
			spaceValue: 0,
			templateList: [
				{
					name: '1行2个',
					img: 'static/images/rubik/1-1.png',
					id: '',
				},
				{
					name: '1行3个',
					img: 'static/images/rubik/1-2.png',
					id: '',
				},
				{
					name: '1行4个',
					img: 'static/images/rubik/1-3.png',
					id: '',
				},
				{
					name: '2左2右',
					img: 'static/images/rubik/1-4.png',
					id: '',
				},
				{
					name: '1左2右',
					img: 'static/images/rubik/1-5.png',
					id: '',
				},
				{
					name: '1上2下',
					img: 'static/images/rubik/1-6.png',
					id: '',
				},
				{
					name: '1左3右',
					img: 'static/images/rubik/1-7.png',
					id: '',
				},
				{
					name: '自定义',
					img: 'static/images/rubik/1-8.png',
					id: '',
				},
			],
			templateItems: [],
			toggleMainMixActive: '',
			cubeList: [],
			cubeDisabled: true,
			cubeAxisOrigin: {
				x: '',
				y: '',
			},
			saveId: 1,
			bgImgSize: ''
		};
	},
	computed: {
		...mapGetters(['pageData', 'pageCurrentData', 'memberLevels']),
		rows: function() {
			return this.pageCurrentData.rows;
		},
	},
	watch: {
		rows: function(rows) {
			this.setTemplateItems(rows);
		},
    'pageCurrentData.type': function () {
		  if (this.pageCurrentData.type < 4) {

      } else {
        this.pageCurrentData.space = 0
      }
    }
	},
	created() {
		this.spaceValue = this.pageCurrentData.space;
		this.setCubeList();
		this.setTemplateItems(this.pageCurrentData.rows);
		this.bgImgSize = '宽750像素';
	},
	methods: {
		selectTemplate: function(item, index) {
			let templateNum = index + 1;
			this.pageCurrentData.type = templateNum;
			let pageRows = this.pageCurrentData.rows;

			if (templateNum == 1) {
				// 两个模块
				pageRows.splice(2);
				if (pageRows.length < 2) {
					this.addPageRowsTempData(2);
				}
			}
			if (templateNum == 2 || templateNum == 5 || templateNum == 6) {
				// 三个模块
				pageRows.splice(3);
				if (pageRows.length < 3) {
					this.addPageRowsTempData(3);
				}
			}
			if (templateNum == 3 || templateNum == 4 || templateNum == 7) {
				// 四个模块
				pageRows.splice(4);
				if (pageRows.length < 4) {
					this.addPageRowsTempData(4);
				}
			}
			if (templateNum == 8) {
				pageRows.splice(0);
			}
		},
		addPageRowsTempData: function(val) {
			let arrLength = val - this.pageCurrentData.rows.length;
			for (let i = 0; i < arrLength; i++) {
        let pageRowsTempData = {
          imgUrl: 'static/images/defaultImg.png',
          idCode:this.$util.randomString(),
          link: {
            url: '',
            mustLogined: '',
            renderNav: '',
          },
        };
				this.pageCurrentData.rows.push(pageRowsTempData);
			}
		},
		selectImg: function(index) {
			Bus.$emit('showImgCenter', item => {
				this.templateItems[index].imgUrl = item.url;
        this.pageCurrentData.rows = this.templateItems;
				console.log(this.pageCurrentData.rows)
				if (index == 0) {
					let relativeSize = item.imgHeight / item.imgWidth;
					this.pageCurrentData.ratio = relativeSize;
				}
			});
		},
		spaceValueChange: function(val) {
			this.pageCurrentData.space = val;
		},
		toggleMainMix: function(index) {
			this.toggleMainMixActive = index;
		},
		cubeClassChange: function(val) {
			this.pageCurrentData.layouts = [];
			this.pageCurrentData.rows = [];
			this.saveId = 1;
			this.pageCurrentData.customInfo.size = val;
			this.setCubeList();
		},
		setCubeList: function() {
			this.cubeList = [];
			for (let y = 0; y < this.pageCurrentData.customInfo.size; y++) {
				for (let x = 0; x < this.pageCurrentData.customInfo.size; x++) {
					this.cubeList.push({
						state: false,
						saveId: '',
						y: y,
						x: x,
					});
				}
			}
		},
		setCubeListStyle: function(start, end, type) {
			let minX = Math.min(start.x, end.x);
			let maxX = Math.max(start.x, end.x);
			let minY = Math.min(start.y, end.y);
			let maxY = Math.max(start.y, end.y);
			this.cubeList.forEach(item => {
				if (minX <= item.x && item.x <= maxX && minY <= item.y && item.y <= maxY) {
					item.state = true;
					if (type == 'save') {
						item.saveId = this.saveId;
					}
				} else {
					if (item.saveId == '') {
						item.state = false;
					}
				}
			});
			if (type == 'save') {
				this.pageCurrentData.rows.push({
					imgUrl: 'static/images/defaultImg.png',
					link: {
						url: '',
						mustLogined: '',
						renderNav: '',
					},
				});
				this.pageCurrentData.customInfo.layouts.push({
					position_x: minX,
					position_y: minY,
					width: maxX - minX + 1,
					height: maxY - minY + 1,
				});
			}
		},
		clickCubeItem: function(item) {
			if (this.cubeDisabled == true) {
				this.cubeAxisOrigin.x = item.x;
				this.cubeAxisOrigin.y = item.y;
			} else {
				this.setCubeListStyle(this.cubeAxisOrigin, item, 'save');
				this.saveId++;
			}
			this.cubeDisabled = !this.cubeDisabled;
		},
		mouseoverCubeItem: function(item) {
			if (this.cubeDisabled == true || item.state == true) return false;
			this.setCubeListStyle(this.cubeAxisOrigin, item);
		},
		mouseoutCubeItem: function(item) {
			if (this.cubeDisabled == true) return false;
			this.setCubeListStyle(this.cubeAxisOrigin, item);
		},
		getLinkMsg: function(item) {
			let str = '请选择跳转页面链接地址';
			if (item.link && item.link.name && item.link.name != '') {
				str = item.link.name;
			} else if (item.link && item.link.url && item.link.url != '') {
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
			Bus.$emit('showLinkCenter', {
        linkSelType: '0',
        linkData: rowItem.link,
        callback: item => {
          if (item) {
            this.pageCurrentData.rows[index].link = item;
            this.setTemplateItems(this.pageCurrentData.rows);
          }
        }
      });
		},
		copyArr: function(arr) {
			return arr.map(e => {
				if (typeof e === 'object') {
					return this.$assign({}, e);
				} else {
					return e;
				}
			});
		},
		setTemplateItems: function(data) {
			let imgRatio;
			this.templateItems = this.copyArr(data);
			if (
				this.pageCurrentData.type == '1' ||
				this.pageCurrentData.type == '2' ||
				this.pageCurrentData.type == '3'
			) {
				imgRatio = Math.ceil(750 / (this.pageCurrentData.type + 1));
				this.templateItems.forEach(item => {
					item.imgRatio = `宽${imgRatio}像素`;
				});
			}
			if (this.pageCurrentData.type == '4') {
				this.templateItems.forEach(item => {
					item.imgRatio = '375 x 375 像素或同比例';
				});
			}
			if (this.pageCurrentData.type == '5') {
				this.templateItems.forEach((item, index) => {
					switch (index) {
						case 0:
							item.imgRatio = '375 x 750 像素或同比例';
							break;
						case 1:
							item.imgRatio = '375 x 375 像素或同比例';
							break;
						case 2:
							item.imgRatio = '375 x 375 像素或同比例';
							break;
						default:
							break;
					}
				});
			}
			if (this.pageCurrentData.type == '6') {
				this.templateItems.forEach((item, index) => {
					switch (index) {
						case 0:
							item.imgRatio = '750 x 375 像素或同比例';
							break;
						case 1:
							item.imgRatio = '375 x 375 像素或同比例';
							break;
						case 2:
							item.imgRatio = '375 x 375 像素或同比例';
							break;
						default:
							break;
					}
				});
			}
			if (this.pageCurrentData.type == '7') {
				this.templateItems.forEach((item, index) => {
					switch (index) {
						case 0:
							item.imgRatio = '375 x 750 像素或同比例';
							break;
						case 1:
							item.imgRatio = '375 x 375 像素或同比例';
							break;
						case 2:
							item.imgRatio = '188 x 375 像素或同比例';
							break;
						case 3:
							item.imgRatio = '188 x 375 像素或同比例';
							break;
						default:
							break;
					}
				});
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.rubik-edit {
	padding: 0px 10px;
	border: 1px solid gray;
	background-color: white;
	font-size: 14px;
	box-sizing: border-box;
	background-color: #f8f8f8;
}
.template-box {
	position relative
	width: 100%;
	height: 100%;
	text-align: center;
	border: 1px solid #ddd;
	padding: 10px 0 40px;
	margin-bottom: 10px;
	background-color: #fff;
	.template-img {
		width: 90px;
		height: 65px;
	}
	p {
		position absolute
		bottom 0
		left 0
		right 0
		height 30px
		line-height 30px
		text-align center
		border-top: 1px solid #ddd;
	}
}
.text-right {
	// text-align: right;
	padding-right: 5px;
}
.eidt-div .edit-line {
	margin-left: 0;
	width: 100%;
}
.rubik-edit >>>.bg-edit {
	padding: 0 !important;
}
.active {
	border: 1px solid #38f;
}
.cube-box {
	.cube-row {
		overflow: hidden;
		// float: left;
		width: 100%;
		border-left: 1px solid #ddd;
		border-top: 1px solid #ddd;
	}
	.cube-item {
		position: relative;
		float: left;
		// width: 100%;
		border-right: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
		&:after {
			content: '';
			display: block;
			width: 100%;
			padding-top: 100%;
		}
	}
	.cube-add {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		// font-size 20px
		color: #888;
	}
	.cube-active {
		background-color: #e8f7fd;
	}
}
.card {
  background-color: #fff;
  border: 1px dashed #ddd;
  padding: 10px;
}
.row-label__max {
  font-size: 16px;
}
.edit-item {
  padding: 10px;
  border: 1px dashed #dcdddd;
  background-color #fff;
	img {
    border 1px solid #dcdddd
  }
}
</style>
