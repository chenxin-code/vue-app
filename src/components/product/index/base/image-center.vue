<template>
	<div>
		<Modal v-model="show" title="图片中心" @on-ok="sureEvent" width="800">
      <div class="image-center">
        <div class="cate-1-div">
          <div class="cate-1-item" v-for="item in groupList" :class="{selected: item.id == selectedCate1.id}" @click="selectCate1(item)" :key="item.id">{{item.groupName}}</div>
        </div>
        <div class="images-content">
          <div class="cate-2-div">
            <div class="cate-2-item" v-for="item in selectedCate1.childList" :class="{selected: item.id == selectedCate2.id}" @click="selectCate2(item)" :key="item.id">{{item.groupName}}</div>
          </div>
          <div class="images-div">
            <div class="item-div float-left" v-for="(item, index) in stuffList" :class="{action: selectedIdx == index}" @click="sureGroupEvent(item, index)">
              <span class="size" v-if="tabName == 'name1' && selectedIdx == index">{{ getImgSize('netic_img_'+index) }}</span>
              <div class="img-div">
                <img :ref="'netic_img_'+index" :src="item.url" />
              </div>
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
			<!--<Tabs v-model="tabName">-->
				<!--<TabPane label="分组" name="name1">-->
					<!--<Row class="row-padding">-->
						<!--<Col span="4">-->
						<!--<div class="my-height">-->
							<!--<Menu theme="light" :active-name="menuActiveName" width="200" @on-select="_vueGetStuffList">-->
								<!--<MenuItem :name="item.stuffGroupCode" v-for="(item, index) in groupList" height="220" :key="item.stuffGroupCode"> {{item.stuffGroupName}}-->
								<!--</MenuItem>-->
							<!--</Menu>-->
						<!--</div>-->
						<!--</Col>-->
						<!--<Col span="20" class="padding-left">-->
						<!--<div class="my-height">-->
							<!--<div class="item-div float-left" v-for="(item, index) in stuffList" :class="{action: selectedIdx == index}" @click="sureGroupEvent(item, index)">-->
								<!--<span class="size" v-if="tabName == 'name1' && selectedIdx == index">{{ getImgSize('netic_img_'+index) }}</span>-->
								<!--<div class="img-div">-->
									<!--<img :ref="'netic_img_'+index" :src="item.url" />-->
								<!--</div>-->
								<!--<p>{{ item.name }}</p>-->
							<!--</div>-->
						<!--</div>-->
						<!--&lt;!&ndash; <Row type="flex" justify="center" class="row-padding no-padding-bottom">-->
							<!--<Page :total="totalCount" @on-change="_getProductList"></Page>-->
						<!--</Row> &ndash;&gt;-->
						<!--</Col>-->
					<!--</Row>-->
				<!--</TabPane>-->
				<!--<TabPane label="图片库" name="name2">-->
					<!--<div class="image-center">-->
						<!--<div class="item-div" v-for="(item, idx) in images" :class="{action: selectedIdx == idx}" @click="selectEvent(idx)">-->
							<!--<span class="size" v-if="tabName == 'name2' && selectedIdx == idx">{{ getImgSize('ic_img_'+idx) }}</span>-->
							<!--<div class="img-div">-->
								<!--<img :ref="'ic_img_'+idx" :src="item.url" />-->
							<!--</div>-->
							<!--<p>{{ item.name }}</p>-->
						<!--</div>-->
					<!--</div>-->
				<!--</TabPane>-->
			<!--</Tabs>-->
		</Modal>
		<!--<Modal v-model="upLoadImgModal" @on-visible-change="handleVisibleChange" width="800" title="我的图片/本地上传" :transition-names="['', '']">-->
			<!--<div style="height:416px">-->
				<!--<Form-->
					<!--ref="formValidate"-->
					<!--:rules="ruleValidate"-->
					<!--:model="saveStuff"-->
					<!--label-position="right"-->
					<!--:label-width="100">-->
					<!--<FormItem label="上传至分组" prop="stuffGroupCode">-->
						<!--<Select v-model="saveStuff.stuffGroupCode" style="width:200px" @on-change="stuffGroupCodeChange">-->
							<!--<Option v-for="(item, index) in groupList" :value="item.stuffGroupCode" :key="index"> {{item.stuffGroupName}} </Option>-->
						<!--</Select>-->
					<!--</FormItem>-->
					<!--<FormItem label="图片名称" prop="name">-->
						<!--<Input v-model="saveStuff.name" placeholder="图片名称" style="width:200px"></Input>-->
					<!--</FormItem>-->
					<!--<FormItem label="本地图片" prop="imageUrl">-->
						<!--<Input v-show="false" v-model="saveStuff.imageUrl" placeholder="图片地址" style="width:200px"></Input>-->
						<!--<Upload-->
							<!--ref="upload"-->
							<!--:data="{'token':$store.state.login.token}"-->
							<!--action="/api/uploadFile"-->
							<!--:max-size="3072"-->
							<!--:format="['jpg','jpeg','png']"-->
							<!--:on-success="handleSuccess"-->
							<!--:on-error="handleError"-->
							<!--:on-exceeded-size="handleMaxSize"-->
							<!--:on-format-error="handleFormatError"-->
							<!--:on-remove="handleRemove"-->
							<!--:before-upload="handleBeforeUpload">-->
							<!--<Button icon="ios-cloud-upload-outline">上传图片</Button>-->
							<!--<br> 仅支持 jpg、 jpeg、 png 3种格式, 大小不超过3.0 MB-->
						<!--</Upload>-->
					<!--</FormItem>-->
				<!--</Form>-->
			<!--</div>-->
			<!--<div slot="footer">-->
				<!--<Button @click="goBack">返回</Button>-->
				<!--<Button :loading="upModalLoading" @click="handleSubmit('formValidate')">确定</Button>-->
			<!--</div>-->
		<!--</Modal>-->
	</div>
</template>

<script>
import Bus from '../bus';
import { deepCopy } from "@/utils/util";
// import ImgCenter from '@/utils/imgCenter.js';

export default {
	name: 'image-center',
	components: {},
	data() {
		return {
			images: [],
			tabName: 'name1',
			ouCode: '',
			selectedIdx: '-1',
			callback: function() {
				console.log('no callback');
			},
			show: false,
			groupList: '',
      selectedCate1: {},
      selectedCate2: {},
			stuffList: [],
			stuffListView: {},
			upLoadImgModal: false,
			saveStuff: {
				imageUrl: '',
				stuffGroupCode: '1000',
				stuffGroupName: '',
        token: this.$store.state.login.token,
				ouCode: '',
				name: '',
			},
			selectImg: '',
			selectSize: {},
			menuActiveName: '',
			activeStuffGroupCode: '',
			upModalLoading: false,
			ruleValidate: {
				stuffGroupCode: [{ required: true, message: '表单不准为空', trigger: 'change' }],
				name: [{ required: true, message: '表单不准为空', trigger: 'change' }],
				imageUrl:[{ required: true, message: '请上传图片', trigger: 'change' }],
			},
		};
	},
	methods: {
		getImgSize: function(imgRef) {
			let imgD = this.$refs[imgRef][0];
			if (!imgD) {
			  return ''
      }
			this.selectSize.imgWidth = imgD.naturalWidth;
			this.selectSize.imgHeight = imgD.naturalHeight;
			return imgD.naturalWidth + ' x ' + imgD.naturalHeight;
		},
    selectCate1: function (item) {
		  this.selectedCate1 = item;
      if (this.selectedCate1.childList.length > 0) {
        this.selectCate2(this.selectedCate1.childList[0])
      }
    },
    selectCate2: function (item) {
      this.selectedCate2 = item;
      this._vueGetStuffList(item.groupCode)
    },
		selectEvent: function(idx) {
			this.selectedIdx = idx;
			this.selectImg = this.images[this.selectedIdx];
		},
		sureGroupEvent: function(item, index) {
			this.selectedIdx = index;
			this.selectImg = item;
		},
		sureEvent: function() {
			this.selectImg.imgWidth = this.selectSize.imgWidth;
			this.selectImg.imgHeight = this.selectSize.imgHeight;
      let d = deepCopy(this.selectImg);
			this.callback(d);
			this.show = false;
			this.callback = function() {
				console.log('no callback');
			};
		},
		stuffGroupCodeChange: function(value) {
			let item = this.groupList.find(item => {
				return item.stuffGroupCode == value;
			});
			this.saveStuff.stuffGroupName = item.stuffGroupName;
		},
		openUpLoadImgModal: function() {
			this.show = false;
			this.upLoadImgModal = true;
		},
		goBack: function() {
			this.show = true;
			this.upLoadImgModal = false;
		},
    // 获取分组
    getAllStuffGroupTree: function() {
      let url = '/system/json/app_stuff_stock/getAllStuffGroupTree';
      let paramsData = {
        token: this.$store.state.login.token,
        ouCode: '',
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0 && data.data.length > 0) {
            this.groupList = data.data;
            if (this.groupList.length > 0) {
              this.selectCate1(this.groupList[0])
            }
            // this.groupList.forEach(item => {
            //   this.stuffListView[item.stuffGroupCode] = false;
            // });
            // this._vueGetStuffList(this.groupList[0].stuffGroupCode);
            // this.$nextTick(() => {
            //   this.menuActiveName = this.groupList[0].stuffGroupCode;
            // });
          }
        },
        error => {
          this.$Message.error('请求数据出错，请稍后重试!');
        }
      );
    },
		// 获取分组
		_vueGetStuffGroupList: function() {
			let url = '/system/json/app_page_conf/vueGetStuffGroupList';
			let paramsData = {
        token: this.$store.state.login.token,
				ouCode: '',
			};
			this.$http.post(url, paramsData).then(
				res => {
					let data = res.data;
					if (data.status == 0 && data.data.length > 0) {
						this.groupList = data.data;
						this.groupList.forEach(item => {
							this.stuffListView[item.stuffGroupCode] = false;
						});
						this._vueGetStuffList(this.groupList[0].stuffGroupCode);
						this.$nextTick(() => {
							this.menuActiveName = this.groupList[0].stuffGroupCode;
						});
					}
				},
				error => {
					this.$Message.error('请求数据出错，请稍后重试!');
				}
			);
		},
		// 获取素材
		_vueGetStuffList: function(stuffGroupCode) {
			let url = '/system/json/app_page_conf/vueGetStuffList';
			let paramsData = {
				token: this.$store.state.login.token,
				ouCode: this.ouCode,
				stuffGroupCode: stuffGroupCode,
				pageIndex: '1',
				pageSize: '300',
			};
			this.$http.post(url, paramsData).then(
				res => {
					let data = res.data;
					if (data.status == 0) {
            this.stuffList = data.data;
            // this.$nextTick(() => {
						// 	this.stuffListView[stuffGroupCode] = data.data;
						// 	this.stuffList = this.stuffListView[stuffGroupCode];
						// });
					}
				},
				error => {
					this.$Message.error('请求数据出错，请稍后重试!');
				}
			);
		},
		// 验证表单
		handleSubmit (name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.$Message.success('Success!');
					this._vueSaveStuff();
				} else {
					this.$Message.error('请按要求填写表单');
				}
			})
		},
		// 保存素材
		_vueSaveStuff: function() {
			this.upModalLoading = true;
			let url = '/system/json/app_page_conf/vueSaveStuff';
			this.saveStuff.token = this.$store.state.login.token,
			this.saveStuff.ouCode = this.ouCode;
			let paramsData = this.saveStuff;
			this.$http.post(url, paramsData).then(
				res => {
					this.upLoadImgModal = false;
					this.show = true;
					this._vueGetStuffList(this.activeStuffGroupCode, true);
				},
				error => {
					this.$Message.error('请求数据出错，请稍后重试!');
				}
			);
		},
		// 上传图片成功
		handleSuccess: function(response, file, fileList) {
			if (response.status == 0) {
				this.saveStuff.imageUrl = response.data;
			} else {
				this.$Message.error(response.info);
			}
		},
		//文件超出指定大小限制
		handleMaxSize: function(file, fileList) {
			this.$Message.error('图片超出指定大小限制');
		},
		// 文件格式不正确
		handleFormatError:function(file) {
			this.$Message.error('不支持类型的文件');
		},
		// 上传失败
		handleError: function(error, file, fileList) {
			this.$Message.error(`上传失败，${file.status}`);
		},
		// 文件列表移除文件
		handleRemove: function(file, fileList) {
			this.saveStuff.imageUrl = "";
		},
		// 上传文件之前
		handleBeforeUpload: function() {
			this.$refs.upload.fileList = [];
		},
		handleVisibleChange: function(params) {
			if (!params) {
				this.saveStuff = {
					imageUrl: '',
					stuffGroupCode: '1000',
					stuffGroupName: '',
          token: this.$store.state.login.token,
					ouCode: '',
					name: '',
				}
				this.$refs.upload.fileList = []
				this.$refs.formValidate.resetFields();
				this.upModalLoading = false;
			}

		}
	},
	created() {
		Bus.$on('showImgCenter', callback => {
			this.show = true;
			this.callback = callback ? callback : function() {
			  console.log('no callback');
			};
		});
		// this.images = ImgCenter.getImgs();
		this.ouCode = this.$route.query.ouCode;
    // this._vueGetStuffGroupList();
    this.getAllStuffGroupTree();
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.image-center {
  .cate-1-div {
    min-height 39px;
    display: flex;
    align-items center;
    white-space: nowrap;
    overflow-x auto;
    padding 0px;
    border-bottom 1px solid #ddd;
    padding-bottom 6px;
    .cate-1-item {
      margin 0 15px;
      padding 3px 0px;
      font-size 14px;
      &.selected {
        font-size 16px;
        color #2d8cf0;
        border-bottom 2px solid #2d8cf0;
      }
    }
  }
  .images-content {
    margin-top 10px;
    height: 360px;
    display flex;
    align-items flex-start;
    .cate-2-div {
      width 120px;
      height 100%;
      overflow-y auto;
      border-right 1px solid #ddd;
      .cate-2-item {
        width 100%;
        padding 10px;
        font-size 12px;
        line-height 1.4;
        &.selected {
          font-size 14px;
          color #2d8cf0;
        }
      }
    }
    .images-div {
      flex 1;
      display: flex;
      flex-wrap wrap;
      overflow-y auto;
      height 100%;
      padding 10px;
    }
    .item-div {
      position: relative;
      margin-right: 15px;
      margin-bottom: 10px;
      padding-bottom: 30px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      width: 100px;
      height: 130px;
      text-align: center;
      .img-div {
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: Center;
      }
      img {
        max-height: 98px;
        max-width: 100%;
      }
      p {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
    .action {
      position: relative;
      border: 1px solid #cdcdcd;
      box-shadow: 0 0 5px #cdcdcd;
      box-sizing: border-box;
      .size {
        position: absolute;
        left: 0px;
        top: 0px;
        font-size: 10px;
        padding: 2px 5px;
        color: white;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 0px 4px 4px 0px;
      }
    }
    .my-height {
      height: 292px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .float-left {
      float: left;
    }
  }
}
/*.item-div {
	position: relative;
	margin-right: 15px;
	margin-bottom: 10px;
	padding-bottom: 30px;
	border: 1px solid transparent;
	border-radius: 4px;
	overflow: hidden;
	background: #fff;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	width: 100px;
	height: 130px;
	text-align: center;
	.img-div {
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: Center;
	}
	img {
		max-height: 98px;
		max-width: 100%;
	}
	p {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
}
.action {
	position: relative;
	border: 1px solid #cdcdcd;
	box-shadow: 0 0 5px #cdcdcd;
	box-sizing: border-box;
	.size {
		position: absolute;
		left: 0px;
		top: 0px;
		font-size: 10px;
		padding: 2px 5px;
		color: white;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 0px 4px 4px 0px;
	}
}
.my-height {
	height: 292px;
	overflow-x: hidden;
	overflow-y: auto;
}
.float-left {
	float: left;
}*/
</style>
