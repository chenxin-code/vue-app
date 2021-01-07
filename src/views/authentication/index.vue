<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" title="团购认证"></nav-top>
    <nav-content>
      <!--去认证-->
      <div v-if="messageView">
        <van-notice-bar :scrollable="false" v-if="params.state == 2" wrapable>
          企业审核认证中，请耐心等待审核结果......
        </van-notice-bar>
        <div class="gray"></div>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>姓名</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入姓名" type="text"
                                         v-model.trim="params.realName"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>手机号</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入手机号" type="text"
                                         v-model.trim="params.userName"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>企业名称</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入企业名称" type="text"
                                         v-model="params.enterpriseName"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>工商税号</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入税号" type="text"
                                         v-model="params.taxNumber"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>所属地市</span>
              </div>
              <div @click="selectRegion" class="item-right">
                <input :readonly="disabled" class="editText" placeholder="选择区域" type="text" v-model="name">
              </div>
              <RegionSelect :initData="initData" @closeEvent="regionCloseEvent" @selectedItemsEvent="selectedItemsEvent"
                            ref="regionselect" v-if="showSelect"></RegionSelect>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>公司详细地址</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入公司详细地址" type="text"
                                         v-model="params.detailAddress"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>开户银行</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入开户银行" type="text"
                                         v-model="params.bankName"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <span>银行卡号</span>
              </div>
              <div class="center"><input :readonly="disabled" placeholder="请输入银行卡号" type="text"
                                         v-model="params.bankNumber"></div>
            </div>
          </div>
          <div class="certificates">
            <p>上传营业执照</p>
            <div class="certificatesItem">
              <div @click="openChangeImgPopup(1)">
                <div class="imgBox">
                  <img :src="params.businessLicense || 'static/image/vocational-certification/gh@2x.png'" alt=""
                       class="backgroundImg">
                  <img alt="" class="tipsImg" src="static/image/vocational-certification/icon1@2x.png"
                       v-if="disabled == false">
                </div>
                <div class="text">
                  <div class='textBox'>
                    <span>上传营业执照</span>
                  </div>
                </div>
              </div>
              <p @click="unboundData" class="unbound" v-if="params.state == 1">解绑企业</p>
            </div>
          </div>
        </div>
        <div @click="popupCardBtn" class="answer theme_bg_red" v-if="!disabled">提交认证</div>
      </div>
      <!--未认证-->
      <div class="div" v-show="notCertified">
        <div class="authenticationFailed">
          <img alt="" class="img" src="static/image/microShop/picture.png">
          <p class="p2 p">检测到您还未进行实名认证，请先前往实名认证吧</p>
        </div>
        <div @click="deCertification" class="answer theme_bg_red">前往个人认证</div>
      </div>
      <!--认证失败-->
      <div class="div" v-show="params.state == 3">
        <div class="authenticationFailed">
          <img alt="" src="static/image/microShop/renzheng.png">
          <p class="p1">很遗憾！企业认证未通过...</p>
          <p class="p2">原因：{{params.examineRemark}}</p>
        </div>
        <div class="grayBtn">
          <p @click="returnAuthentication" class="theme_bg_red p1">重新提交认证</p>
          <p @click="$router.go(-1)" class="theme_bg_red p2">返回</p>
        </div>
      </div>
      <van-action-sheet
        :actions="actions"
        @select="onSelect"
        v-model="showFaceBackImg"
      />
    </nav-content>
    <div class="card" v-show="popupCard">
      <van-popup :close-on-click-overlay="false" class="popupCard" v-model="popupCard">
        <div class="popupCardText">
          <div class="phoneView">
            <span class="span1">手机号</span>
            <input placeholder="请输入手机号" type="text" v-model.trim="params.userName">
            <CountButton :phone="params.userName" @getSmsEvent="getCode" class="send-btn"
                         ref="countBtn"></CountButton>
          </div>
          <div class="phoneView">
            <span class="span1">验证码</span>
            <input placeholder="请输入验证码" type="text" v-model.trim="params.smsVerifyCode"></div>
        </div>
        <div class="popupCardBtn">
          <span @click="popupCard = false">取消</span>
          <span @click="commit">确认提交</span>
        </div>
      </van-popup>
    </div>
    <div class="card" v-show="unboundView">
      <van-popup :close-on-click-overlay="false" class="popupCard" v-model="unboundView">
        <div class="popupCardText">
          <div class="phoneView">
            <span class="span1">手机号</span>
            <input placeholder="请输入手机号" type="text" v-model.trim="params.userName">
            <CountButton :phone="params.userName" @getSmsEvent="getCode" class="send-btn"
                         ref="countBtn"></CountButton>
          </div>
          <div class="phoneView">
            <span class="span1">验证码</span>
            <input placeholder="请输入验证码" type="text" v-model.trim="params.smsVerifyCode"></div>
        </div>
        <div class="popupCardBtn">
          <span @click="unboundView = false">取消</span>
          <span @click="unboundBtns">确认解绑</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
  import RegionSelect from '@/components/base/region-select'
  import Jwx from '@/deploy/hbsy/utils/jwx'
  import CountButton from '@/components/commonui/count-button';

  export default {
    name: "index",
    data() {
      return {
        backUUID: "",
        notCertified: false, //认证失败
        messageView: true, //展示信息部分
        phone: '',
        name: '',
        disabled: true,
        initData: {
          title: '请选择地区'
        },
        frontOfId: '',
        actions: [
          {
            name: '相册',
          },
          {
            name: '拍照'
          },
        ],
        region: [],
        selectedItems: [],
        showSelect: false,
        popupCard: false,
        unboundView: false,
        showFaceBackImg: false, // 选择相机还是拍照弹框
        certificateObj: {},
        params: {
          id: '',
          realName: '',
          userName: '',
          enterpriseName: '',
          taxNumber: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          city: '',
          province: '',
          cityName: '',
          detailAddress: '',
          bankNumber: '',
          businessLicense: '',
          bankName: '',
          smsVerifyCode: ''
        },
      }
    },
    mounted() {
      this.isAuth()
      this.backUUID = this.$util.randomString();
    },
    watch:{
      unboundView:function () {
        if (!this.unboundView){
          this.$bridgefunc.delandriodback(this.backUUID)
        }
      },
      popupCard:function () {
        if (!this.popupCard){
          this.$bridgefunc.delandriodback(this.backUUID)
        }
      }
    },
    methods: {
      /**
       * 获取验证码
       */
      getCode: function (imgVerifyCode, uuid) {
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          token: this.$store.state.login.token,
          phone: this.params.userName,
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              console.log(data)
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      openChangeImgPopup(type) {
        if (this.disabled == false) {
          // 选择相机拍照弹框
          if (this.$store.state.webtype == 1) {
            Jwx.chooseImg().then(res => {
              this.params.businessLicense = res.imgUrl
              this.params.businessLicense = res.imgUrl
              // this.commit()
            })
          } else {
            this.showFaceBackImg = true
          }
        }
      },
      onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭  1 是相册 2 是拍照
        this.showFaceBackImg = false
        if (item.name == '拍照') {
          this.getImg('2')
        } else if (item.name == '相册') {
          this.getImg('1')
        }
      },
      returnAuthentication() { //重新提交认证
        this.messageView = true
      },
      getImg(op) {
        this.$bridgefunc.getPhoto(op, img => {
          this.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          this.params.businessLicense = imgBack
        })
      },
      updateImg(image) {
        let params = {
          base64File: image,
          fileType: 'jpg',
          fileName: 'id-card-img',
          bucketName: 'app_img'
        }
        this.$Loading.open('保存中...')
        this.$http.post('/uploadFile', params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.params.businessLicense = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      //添加安卓物理按键返回键功能
      addFunction(type){
        this.$bridgefunc.andriodaddback(this.backUUID,()=>{
          if (type){
            this.popupCard = false
          }else {
            unboundView = false
          }
        })
      },
      popupCardBtn() {
        this.popupCard = true
        this.addFunction(1)
      },
      deCertification() {
        // window.location.href = window.location.origin + "/app-vue/oildrop/certification"
        this.$bridgefunc.customPush({
          path: window.location.origin + "/app-vue/oildrop/certification",
          isnativetop: "0",
          superback: 1,
          isVuePage: '0'
        });
      },
      selectRegion: function () {
        if (this.disabled == false) {
          this.showSelect = true;
          this.getRegionData(0)
        }
      },
      getRegionData: function (parentId) {
        this.$Loading.open()
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length > 0) {
              this.$nextTick(function () {
                this.$refs.regionselect.pushCustomOptions(arr);
              })
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      regionCloseEvent: function () {
        this.showSelect = false;
      },
      selectedItemsEvent: function (selectedValue) {
        console.log(selectedValue)
        let item = selectedValue.item;
        this.selectedItems = selectedValue.selecteds;
        let addressInfo = {}
        if (this.selectedItems.length > 0) {
          for (let i = 0; i < 4; i++) {
            let item = {
              id: '',
              name: ''
            }
            if (this.selectedItems.length > i) {
              item = this.selectedItems[i]
            }
            if (i == 0) {
              this.params.provinceId = item.id
              this.params.provinceName = item.name
            } else if (i == 1) {
              this.params.cityId = item.id
              this.params.cityName = item.name
            } else if (i == 2) {
              addressInfo.countryId = item.id
              addressInfo.countryName = item.name
            } else if (i == 3) {
              addressInfo.townId = item.id
              addressInfo.townName = item.name
            }
          }
          this.$emit('info', addressInfo)
        }
        if (this.selectedItems.length == 4) {
          this.showSelect = false;
          this.region = this.selectedItems;
          this.getRegionText();
          return;
        }
        this.getRegionData(item.id)
      },
      getRegionText: function () {
        let str = ''
        for (let i = 0; i < this.region.length; i++) {
          str += this.region[i].name
        }
        this.name = str;
        this.$refs.regionselect.reset(null);
      },
      unboundData() { //解绑
        this.unboundView = true
        this.addFunction(0)
      },
      unboundBtns() { //解绑弹框
        let params = {
          token: this.$store.state.login.token,
          id: this.params.id,
          smsVerifyCode: this.params.smsVerifyCode,
          userName: this.params.userName
        }
        this.$request.post('/app/json/user_auth/authEnterpriseUntie', params).then(res => {
          console.log('解绑', res);
          if (res.result == 'success') {
            this.unboundView = false
            this.detail()
            this.$toast('解绑成功')
          } else {
            this.$Toast(res.info)
          }
        })
      },
      isAuth() {
        let that = this
        that.$http.post('/app/json/user_auth/getUserCertificate', {cateType: 1}).then(res => {
          let data = res.data.data
          if (res.data.status == 0) {
            data.page = ''
            for (var k in data) {
              if (data[k]) {
                this.detail()
                console.log('有实名认证')
                return
              }
            }
            that.notCertified = true
            console.log('没有实名认证')
          }
        })
      },
      detail() {
        this.$request.post('/app/json/user_auth/authEnterpriseDetail', {token: this.$store.state.login.token}).then(res => {
          if (res.result == 'success') {
            this.params = res.data || {}
            this.name = (this.params.provinceName && this.params.cityName) ? (this.params.provinceName + this.params.cityName) : ''
            if (!this.params.state) {
              this.disabled = false
              this.messageView = true
            } else if (this.params.state == 1) { //审核成功
              this.disabled = true
              this.messageView = true
            } else if (this.params.state == 3) { //审核失败
              this.name = ''
              this.disabled = false
              this.messageView = false
              this.params = {
                id: '',
                realName: '',
                userName: '',
                enterpriseName: '',
                taxNumber: '',
                provinceId: '',
                provinceName: '',
                cityId: '',
                city: '',
                province: '',
                cityName: '',
                detailAddress: '',
                bankNumber: '',
                businessLicense: '',
                bankName: '',
                smsVerifyCode: ''
              }
            } else if (this.params.state == 2) { //待审核
              this.disabled = true
              this.messageView = true
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      commit() { //提交认证
        this.params.token = this.$store.state.login.token
        this.$request.post('/app/json/user_auth/checkParam', this.params).then(res => { //验证参数接口
          if (res.result == 'success') {
            this.$request.post('/app/json/user_auth/authEnterprise', this.params).then(res => { //提交认证接口
              if (res.result == 'success') {
                this.popupCard = false
                this.detail()
                this.$toast('提交认证成功')
              } else {
                this.$Toast(res.info)
              }
            })
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    components: {
      RegionSelect,
      CountButton,
      photograph: () => import("./photograph.vue")
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .gray {
    background #F6F6F6
    height 15px
  }

  /deep/ .table-view .table-view-cell .table-view-cell-text {
    font-size: 0.373333rem;

    .left {
      width 135px;

      .img1 {
        width 30px;
        vertical-align middle
      }

      /deep/ .mint-field-core {
        font-size: 14px;
        color: #cdcbcc;
      }
    }

    .center {
      input {
        text-align right
      }
    }
  }

  .certificates {
    width 100%
    height 140px

    p {
      padding: 0.293333rem 0.4rem;
    }

    .certificatesItem {
      width 50%
      height 140px
      padding 5px
      display flex
      flex-direction column
      margin: 5px auto;

      .imgBox {
        position relative
        width 100%
        height 100px

        .backgroundImg {
          width 100%
          height 100%
        }

        .tipsImg {
          width 50px
          height 50px
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          margin auto
        }
      }

      .text {
        width 100%
        height 26px
        color #636363
        display flex
        flex-direction column-reverse
        align-items center

        .textBox {
          display flex
          justify-content center
          align-items center

          .question-o {
            font-size 14px
          }
        }
      }
    }
  }

  .answer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 18px;
  }

  .nav-content {
    overflow-y auto
  }

  .card {
    /deep/ .van-popup {
      /*width: 76%;*/
      font-size: 14px;
      color: #8c8c8c;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popupCard {
      /*height: 160px;*/
      flex-direction: column;
      line-height: 26px;

      .popupCardText {
        margin-bottom 50px

        .phoneView {
          display flex;
          margin 16px 10px
          border-bottom: 0.5px solid #e5e5e5
          padding-bottom 5px

          .span1 {
            width 50px
            padding 0 3px
          }

          .span2 {
            width 77px
            padding 3px 3px
            background #f02e2c
            color white
            border-radius 7px
          }

          input {
            text-align center
          }

        }
      }

      .popupCardBtn {
        width: 100%;
        color: #000;
        height: 50px;
        display: flex;
        justify-content: center;
        font-size 16px
        position fixed
        bottom: 0

        span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        > :last-child {
          color #fff;
          background-color #f02e2c
        }
      }
    }
  }

  .unbound {
    color #f02e2c;
    text-align center
  }

  .div {
    background: #f6f6f6;
    overflow: hidden;
    height: 100%;

    .authenticationFailed {
      background white
      text-align center
      padding 10px 0
      margin-top 15px

      img {
        width 80px
      }

      .img {
        width 140px
      }

      .p1 {
        font-size: 17px;
        margin: 15px 0;
        color #323232
      }

      .p2 {
        width 52%
        line-height 22px
        margin 10px auto
        font-size: 14px;
        color #7a7a7a
      }

      .p {
        width 85%
      }
    }

    .grayBtn {
      padding-top: 20px;

      p {
        width: 80%;
        margin: 10px auto;
        color: white;
        text-align: center;
        padding: 12px 0;
        border-radius: 20px;
      }
    }
  }

  /deep/ .base_con {
    width auto
    margin auto 0
  }

  /deep/ .base_con .count-button1 {
    width 77px
    padding 3px 3px
    background #f02e2c
    color white
    border-radius 10px
    text-align center
  }

  /deep/ .item-right {
    padding: 0 0.213333rem;

    input {
      text-align right
    }
  }

  /deep/ .table-view .table-view-cell .table-view-cell-text .center {
    flex 0
  }

</style>
