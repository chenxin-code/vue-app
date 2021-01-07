<template>
  <div class="bottom">
    <div class="top_cell" @click="uploadpic">
      <div class="head">
        <img ref="headerimg" class="icon_con" :src="getHeadImg(userInfo.headImg)">
      </div>
      <div class="title_con font-medium">
        <p>修改头像</p>
      </div>
      <div class="right_con">
        <img class="arrow_con" src="../../../assets/more.png">
      </div>
      <!--<input class="full-img imginput" ref="uploadimg" @change="headchange()" name="file" type="file"-->
             <!--accept="image/*">-->
    </div>
    <div class="bottomcells">
      <div class="cells_con" v-for="(item, index) in items" @click="changeinfo(item)">
        <div class="lefttitle_con font-medium">{{item.title}}</div>
        <div class="rightsub_con">
          <img v-if="canChange(item)" class="cellarrow_con" src="../../../assets/more.png">
          <div class="subtitle_con font-medium-l single-line">{{item.info}}</div>
        </div>
      </div>
    </div>
    <button class="loginout font-medium-x" @click="loginOut">退出登录</button>
    <div class="cropper-div" v-if="showCropper">
      <vueCropper
        ref="cropper"
        :img="example3.img"
        :autoCrop="example3.autoCrop"
        :autoCropWidth="example3.autoCropWidth"
        :autoCropHeight="example3.autoCropHeight"
        :fixedBox="example3.fixedBox"
        :canMove="example3.canMove"
        :canMoveBox="example3.canMoveBox"
      ></vueCropper>
      <div class="cropper-btn-div">
        <div class="cropper-btn" @click="cancel()">取消</div>
        <div class="cropper-btn cropper-r" @click="cutImg()">选取</div>
      </div>
    </div>
    <div class="choosephoto" v-show="showChoosePhoto"  @click.stop="bottomOp(2)">
      <div class="oparea">
        <p class="phitem bottom-line" @click.stop="bottomOp(0)">拍照</p>
        <p class="phitem bottom-line" @click.stop="bottomOp(1)">从相册中选择</p>
        <p class="phitem" @click.stop="bottomOp(2)">取消</p>
      </div>
    </div>
  </div>
</template>

<script>
  import VueCropper from '../../base/vue-cropper'
  import {Toast} from 'mint-ui'
  import { mapGetters } from 'vuex'

  export default {
    name: 'mine-userInfo',
    components: {
      VueCropper,
      Toast,
    },
    computed: {
      ...mapGetters([
        'userInfo',
      ]),
    },
    data() {
      return {
        msg: 'msg',
        // userInfo: {},
        items: [],
        example3: {},
        showCropper: false,
        showChoosePhoto:false
      }
    },

    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      getHeadImg:function(headImg){
        if(!headImg || headImg == ''){
          return 'static/image/mine/default-user.png'
        }
        return headImg
      },
      uploadpic: function () {//上传图片
        this.showChoosePhoto = !this.showChoosePhoto
      },
      bottomOp:function(op){
        if(op == 0){
          //拍照
          this.getImg('2');
        }
        else if(op == 1){
          //从相册选择
          this.getImg('1');

        }else if(op == 2){
          this.showChoosePhoto = false
        }
      },
      canChange: function (item) {
        if (item.type == 1) {
          return false;
        }else if (item.type == 5) {//手机号
          return false;
        }
        return true;
      },
      changeinfo: function (item) {//修改用户信息
        if (item.type == 1) {
          Toast({
            message: '暂不支持修改用户名',
            position: 'bottom',
            duration: 2000,
          });
          return;
        } else if (item.type == 2) { //姓名
          if(this.$store.state.login.bindCardState == 0){
            Toast({
              message: '已经绑定加油卡,不能修改姓名、证件类型、证件号码',
              position: 'bottom',
              duration: 2000,
            });
            return;
          }else {
            this.$bridgefunc.customPush({
              path: '/mineuserinfoupdatename',
              isnativetop:'1',
              query: {
                realname: this.userInfo.realName,
                userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
              }
            });
          }
        } else if (item.type == 3) {//证件类型
          if(this.$store.state.login.bindCardState == 0){
            Toast({
              message: '已经绑定加油卡,不能修改姓名、证件类型、证件号码',
              position: 'bottom',
              duration: 2000,
            });
            return;
          }else {
            this.$bridgefunc.customPush({
              path: '/mineuserinfoupdatedocuments',
              isnativetop:'1',
              query: {
                idtype: this.userInfo.idType,
                idnumber: this.userInfo.idNumber,
                userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
              }
            });
          }
        } else if (item.type == 4) {//证件号码
          if(this.$store.state.login.bindCardState == 0){
            Toast({
              message: '已经绑定加油卡,不能修改姓名、证件类型、证件号码',
              position: 'bottom',
              duration: 2000,
            });
            return;
          }else {
            this.$bridgefunc.customPush({
              path: '/mineuserinfoupdatedocuments',
              isnativetop:'1',
              query: {
                idtype: this.userInfo.idType,
                idnumber: this.userInfo.idNumber,
                userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
              }
            });
          }
        } else if (item.type == 5) {//手机号
          Toast({
            message: '暂不支持修改手机号',
            position: 'bottom',
            duration: 2000,
          });
          return;
        } else if (item.type == 6) {//邮箱
          this.$bridgefunc.customPush({
            path: '/mineuserInfoupdatemailbox',
            isnativetop:'1',
            query: {
              email:encodeURIComponent(this.userInfo.email),
              userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
            }
          });

        } else if (item.type == 7) {//性别
          this.$bridgefunc.customPush({
            path: '/mineuserInfoupdatesex',
            isnativetop:'1',
            query: {
              gender: this.userInfo.gender,
              userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
            }
          });

        } else if (item.type == 8) {//地区
          let _this = this
          this.$store.state.location.selectType = '3'
          this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customPush({
              path: '/cityselector/0',
              isnativetop:'1',
              query: {
                userInfo:encodeURIComponent(JSON.stringify(_this.userInfo)),
              }
            });
          })
        } else if (item.type == 9) {//详细地址
          this.$bridgefunc.customPush({
            path: '/mineuserinfoupdateaddress',
            isnativetop:'1',
            query: {
              address: encodeURIComponent(this.userInfo.address),
              userInfo:encodeURIComponent(JSON.stringify(this.userInfo))
            }
          });
        }
      },
      getSubtitle: function (index) {
        return 123 * index;
      },
      getGenderStr(gender) {
        if (gender == 0) {
          return '未知';
        } else if (gender == 1) {
          return '男';
        } else if (gender == 2) {
          return '女';
        }
      },
      cancel: function () {
        this.showCropper = false
      },
      cutImg: function () {
        let _this = this
        this.$refs.cropper.getCropData((data) => {
          data = '' + data
          // 去掉前一段格式相关代码
          data = data.substring(23, data.length)
          _this.updateImg(data)
        })
        // setTimeout(function () {
        //   _this.$refs.cropper.clearCrop()
        //   _this.showCropper = false
        // }, 200)
      },
      headchange() {
        let file = this.$refs.uploadimg.files['0'];
        if (!file) {
          return;
        }
        // this.updateImg(file);
        let oReader = new FileReader();
        let _this = this
        oReader.onload = function (e) {
          let srcv = e.target.result;
          // console.log(srcv)
          let width = document.body.clientWidth
          let example = {
            img: srcv,
            autoCrop: true,
            autoCropWidth: width,
            autoCropHeight: width,
            fixedBox: false,
            canMove: true,
            canMoveBox: false
          }
          _this.example3 = example
          _this.showCropper = true
        }
        oReader.readAsDataURL(file);
      },
      loginOut: function () {
        this.$Loading.open('加载中')
        let url = '/app/json/login/logout';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          console.log('退出登录', data)
          if (data.status == '0') {
            // window.localStorage.setItem('token', '')
            _this.$store.state.login.token = '';
            _this.$bridgefunc.vuexStorage(function () {
              _this.resetLogin()
            }, true)
          }
        }, error => {
          _this.$Loading.close();
          console.log('退出登录失败', error)
        })
      },
      resetLogin: function () {
        this.$bridgefunc.resetPage({
          weburl: '/login',
        });
      },

      getImg:function(op){
        let _this = this;
        this.$bridgefunc.getPhoto(op,function (img) {
          _this.showChoosePhoto = false
          _this.updateImg(img);
        })
      },
      updateImg(image) {
        this.$Loading.open('保存中')
        let url = '/uploadFile';
        let token = this.$store.state.login.token
        let params1 = {
          base64File: image,
          fileType: 'jpg',
          fileName: 'header_'+this.userInfo.phone,
          bucketName: 'app_img',
          token: token
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.submitRevise(data.data);
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000
            });
          }
        }, error => {
          _this.$Loading.close();
          Toast({
            message: '上传图片失败',
            position: 'bottom',
            duration: 2000
          })
        });
      },
      submitRevise(headUrl) {
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyHeadImg';
        let token = this.$store.state.login.token
        let params1 = {
          headImg: headUrl,
          token: token,
        }
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          console.log('修改头像', data)
          if (data.status == 0) {
            Toast({
              message: data.info ? data.info :'修改头像成功',
              position: 'bottom',
              duration: 2000,
            });
            _this.$store.state.userInfo.headImg = headUrl
            _this.$bridgefunc.vuexStorage(function () {
              _this.$refs.cropper.clearCrop()
              _this.showCropper = false
            })
          } else {
            Toast({
              message: data.info ? data.info :'修改头像失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('修改头像失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      getUserInfo: function () {
        this.$Loading.open('加载中')
        let url = '/app/json/user/getUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          console.log('获取用户信息', data)
          _this.userInfo = data.data;
          _this.initPageData()
        }, error => {
//          _this.userInfo = {};
//          _this.initPageData()
          _this.$Loading.close();
          console.log('获取用户信息失败', error)
        })
      },
      initPageData: function () {
        this.items = [
          {title:'用户名', info:this.userInfo.userName?this.userInfo.userName:'',type:1},
          {title:'姓名', info:this.userInfo.realName?this.userInfo.realName:'',type:2},
//          {title:'证件类型', info:this.userInfo.idType?this.userInfo.idType:'',type:3},
          {title:'证件号码', info:this.userInfo.idNumber?this.getidNumber(this.userInfo.idNumber):'',type:4},
          {title:'手机号', info:this.userInfo.phone?this.userInfo.phone:'',type:5},
          {title:'邮箱', info:this.userInfo.email?this.userInfo.email:'',type:6},
          {title:'性别', info:this.userInfo.gender?this.getGenderStr(this.userInfo.gender):'',type:7},
          {title:'地区', info:this.userInfo.provinceName?this.userInfo.provinceName + '' + this.userInfo.cityName : '',type:8},
          {title:'详细地址', info:this.userInfo.address?this.userInfo.address:'',type:9},
        ];
      },
      getidNumber: function (number) {

        let str = number.substring(number.length-4,number.length);
        return "**********"+str;
      },

    },
    created() {
      this.initPageData()
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.$bridgefunc.vuexRead(function () {
          _this.initPageData()
        })
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .bottom {
    width: 100%;
    height :100%;
    overflow-x hidden
    overflow-y auto
    background-color: #efefef;
    /*position: absolute;*/
    .top_cell {
      float: left;
      position relative
      width: 100%;
      height: 70px;
      /*line-height: 80px;*/
      background-color: white;
      text-align: center;
      // border-bottom: $color-line-gray-l 0.5px solid;
      .imginput {
        overflow hidden
        position absolute
        opacity: 0;
      }
      .head {
        float: left;
        width: 50px;
        height: 50px;
        overflow: hidden;
        margin-left: 3%;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 50%;
        -webkit-webkit-border-radius: 50%;
        -moz-webkit-border-radius: 50%;
        -ms-webkit-border-radius: 50%;
        -o-webkit-border-radius: 50%;
        -khtml-webkit-border-radius: 50%;
        webkit-border-radius: 50%;
        .icon_con {
          width: 50px;
          height: 50px;
          display: block;
        }
      }

      .title_con {
        float: left;
        margin-left: 10px;
        width: 50%;
        line-height: 70px;
        text-align: left;
      }

      .right_con {
        margin-right: 2%;
        float: right;
        .arrow_con {
          float: right;
          margin-right: 2%;
          margin-top: 25px;
          width: 20px;
          height: 20px;
          /*background-color: #4caf50;*/
        }
      }
    }
    .bottomcells {
      float: left;
      width: 100%;
      margin-top: 10px;
      .cells_con {
        background-color: white;
        width: 100%;
        height: 50px;
        border-bottom: $color-line-gray-l = #ddd 0.5px solid;
        .lefttitle_con {
          float: left;
          margin-left: 3%;
          width: 85px;
          line-height: 50px;
          text-align: left;
        }
        .rightsub_con {
          // margin-right: 1%;
          // width: 60%;
          //float: right;
          overflow hidden
          .subtitle_con {
            //float: right;
            /*margin-right: 15%;*/
            overflow hidden
            margin-right 5%
            line-height: 50px;
            text-align: right;
          }
          .cellarrow_con {
            float: right;
            margin-right: 2%;
            margin-top: 15px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .loginout {
      // float: left;
      margin-left: 5%;
      margin-top: 12px;
      margin-bottom: 10px;
      width: 90%;
      height: 44px;
      border-radius: 5px;
      color: white;
      background-color: $color-theme-btn-l;
      border: none;
    }
    .cropper-div {
      position fixed
      top 0px
      bottom 0px
      left 0px
      right 0px
      overflow hidden
      z-index 2
      .cropper-btn-div {
        position absolute
        bottom 0px
        width 100%
        .cropper-btn {
          margin 0 20px;
          padding 15px
          display: inline-block
          color #00f
          font-weight 400
        }
        .cropper-r {
          float right
        }
      }
    }
  }
  .choosephoto{
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    background-color: rgba(0, 0, 0, 0.4);
    .oparea{
      position absolute
      left 0
      right 0
      bottom 0
      background-color #ffffff
      .phitem{
        height 50px
        line-height 50px
        text-align  center
        font-size $font-size-medium
      }
      .bottom-line{
        border-bottom: 1px solid $color-line-gray-l;
      }
    }
  }
</style>
