<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="发票抬头"></nav-top>
    <nav-content>
      <div @click="close" id="apply">
        <div class="publicInvoice">
          <van-radio-group class="radioBtn" v-model="typeObj.titleType">
            <div class="radioBtnDiv">
              <van-radio :name="4" checked-color="#f44">个人/非企业单位</van-radio>
              <van-radio :name="5" checked-color="#f44">企业</van-radio>
            </div>
          </van-radio-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 4">
          <van-cell-group style="position: relative">
            <van-field @input="monitor" class="paragraph" label="发票抬头" placeholder="请输入发票抬头"
                       v-model.trim="paramsPersonData.title"/>
            <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
              <div class="divPut1"></div>
              <div class="divPut2">
                <ul>
                  <li @click="detailData(item)" v-for="(item,index) in isText" v-if="dropDown">{{item.title}}</li>
                </ul>
              </div>
            </div>
          </van-cell-group>
          <van-cell-group>
            <van-field label="邮箱" placeholder="输入邮箱" v-model.trim="paramsPersonData.userEmail"/>
            <van-field label="手机号" placeholder="输入手机号" type="number" v-model.trim="paramsPersonData.userPhone"/>
          </van-cell-group>
          <van-cell-group v-if="this.$route.params.fromPage != 'history'">
            <div class="taiBtn">
              <span>设置默认抬头</span>
              <van-switch active-color="#f44" size="24px" v-model="paramsPersonData.defaults"/>
            </div>
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5">
          <van-cell-group style="position: relative">
            <van-field @input="monitor" class="paragraph" label="发票抬头" placeholder="请输入发票抬头"
                       v-model.trim="paramsData.title"/>
            <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
              <div class="divPut1"></div>
              <div class="divPut2">
                <ul>
                  <li @click="detailData(item)" v-for="(item,index) in isText" v-if="dropDown">{{item.title}}</li>
                </ul>
              </div>
            </div>
            <van-cell-group>
              <van-field label="税号" placeholder="请输入税号" v-model="paramsData.orgTaxNo"/>
              <van-field label="邮箱" placeholder="输入邮箱" v-model.trim="paramsData.userEmail"/>
              <van-field label="手机号" placeholder="输入手机号" type="tel" v-model.trim="paramsData.userPhone"/>
            </van-cell-group>
            <!--<van-field v-model="paramsData.title" label="发票抬头" placeholder="请输入发票抬头"/>-->
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5">
          <van-cell-group>
            <div class="openBox">
              <div class="openBox1">
                <span>更多信息</span>
                <span>开户行和账号等（非必填）</span>
              </div>
              <div @click="openView = !openView">
                <span class="span">{{openView?'展开': '收起'}}</span>
              </div>
            </div>
            <div v-if="!openView">
              <van-field label="地址" placeholder="请输入地址" v-model="paramsData.companyAddress"/>
              <van-field label="电话" v-model.trim="paramsData.telephone"/>
              <van-field label="开户行" placeholder="请输入开户行" v-model="paramsData.openingBank"/>
              <van-field label="账户" placeholder="请输入账户" v-model="paramsData.bankAccount"/>
            </div>
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5 && this.$route.params.fromPage != 'history'">
          <van-cell-group>
            <div class="taiBtn">
              <span>设置默认抬头</span>
              <van-switch active-color="#f44" size="24px" v-model="paramsData.defaults"/>
            </div>
          </van-cell-group>
        </div>
        <div @click="exportInvoice" class="publicInvoice" v-if="$store.state.webtype == 2">
          <van-cell-group>
            <div class="taiBtn">
              <span>选择微信发票抬头</span>
              <span class="img iconfont mall-gengduojiantou"></span>
            </div>
          </van-cell-group>
        </div>
        <div @click="commit" class="answer theme_bg_red">{{this.$route.params.fromPage != 'history'?'保存':'提交'}}</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Config from "@/api/config";
  import wxfunc from '@/utils/wxfunc'
  import api from "./api";
  import {Toast} from 'vant'

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        result: [],
        list: [],
        radio: "",
        checked: false,
        companyAddress: "",
        userEmail: "",
        orgTaxNo: "",
        idDetail: '',
        title: '',
        openView: true,
        openingBank: '',
        userPhone: '',
        bankAccount: '',
        people: '',
        opentext: '展开',
        typeObj: {
          titleType: 5
        },
        paramsPersonData: {
          titleType: 4
        },
        paramsData: {
          titleType: 5
        },
        open: '',
        dropDown: false,
        detailObj: {},
        isText: [],
        titleId: '',
        type: '',
        userInvoiceHeadModels: [],
        userId: ''
      };
    },
    created() {
      let that = this
      that.titleId = that.$route.query.id ? that.$route.query.id : that.$route.params.userInvoiceHeadId
      that.type = that.$route.query.type ? that.$route.query.type : that.$route.params.type
      that.userId = that.$store.state.userInfo.userId
      console.log(that.userId);
      if (that.type == 1) {
        that.typeObj.titleType = 4
        that.loadData()
      } else {
        that.typeObj.titleType = 5
      }
      // //键盘弹起
      if ((/Android/gi).test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
          if (document.activeElement.tagName == 'INPUT' ||
            document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
              document.activeElement.scrollIntoViewIfNeeded()
            }, 0)
          }
        })
      }
    },
    mounted() {

    },
    methods: {
      exportInvoice() {
        let that = this
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            wxfunc.wxinvoice((res) => {
              let titleObj = JSON.parse(res.choose_invoice_title_info) || {}
              console.log(typeof titleObj.type);
              that.typeObj.titleType = Number(titleObj.type) //0是单位，1是个人
              if (that.typeObj.titleType == 1) {
                // that.paramsPersonData = titleObj
                that.typeObj.titleType = 4
                that.paramsPersonData.titleType = 4
                that.paramsPersonData.title = titleObj.title
                that.paramsPersonData.orgTaxNo = titleObj.taxNumber
              } else if (that.typeObj.titleType == 0) {
                // that.paramsData = titleObj
                that.typeObj.titleType = 5
                that.paramsData.titleType = 5
                that.paramsData.title = titleObj.title
                that.paramsData.orgTaxNo = titleObj.taxNumber
                that.paramsData.companyAddress = titleObj.companyAddress
                that.paramsData.telephone = titleObj.telephone
                that.paramsData.openingBank = titleObj.bankName
                that.paramsData.bankAccount = titleObj.bankAccount
              }
            })
          } else {
            console.log('签名失败');
          }
        });
      },
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          id: this.titleId
        };
        that.soudetailData(params).then(res => {
          if (res.data.result) {
            res.data.data.defaults = res.data.data.defaults == 1 ? true : false
            console.log(typeof res.data.data.titleType);
            that.typeObj.titleType = res.data.data.titleType
            if (that.typeObj.titleType == 4) {
              that.paramsPersonData = res.data.data
            } else if (that.typeObj.titleType == 5) {
              that.paramsData = res.data.data
            }
          }
        });
      },
      close() {
        this.dropDown = false
      },
      monitor(val) { //下拉搜索内容
        console.log(val);
        let that = this
        let params = {
          token: this.$store.state.login.token,
          title: val
        }

        that.souData(params).then(res => {
          if (res.data.data.length > 0) {
            that.isText = res.data.data
            that.dropDown = true
          } else {
            that.dropDown = false
          }
        })
        if (!val) {
          if (that.typeObj.titleType == 4) {
            that.paramsPersonData = {}
          } else if (that.typeObj.titleType == 5) {
            that.paramsData = {}
          }
        }
      },
      detailData(index) { //查详情
        let that = this
        if (index.titleType == 4) {
          that.typeObj.titleType = 4
          that.paramsData = {}
          that.paramsPersonData = index
        } else if (index.titleType == 5) {
          that.typeObj.titleType = 5
          that.paramsPersonData = {}
          that.paramsData = index
        }
      },
      commit() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }
        if (that.typeObj.titleType == 4) {
          that.paramsPersonData.titleType = 4
          Object.assign(params, that.paramsPersonData)
        } else if (that.typeObj.titleType == 5) {
          that.paramsData.titleType = 5
          Object.assign(params, that.paramsData)
        }
        params.defaults = params.defaults ? 1 : 0
        if (!params.title) {
          Toast({
            message: '请输入发票抬头',
            duration: 2000,
          });
          return;
        }
        if (params.titleType == 5) {
          if (!params.orgTaxNo) {
            Toast({
              message: '请输入税号',
              duration: 2000,
            });
            return;
          }
        }
        if (!params.userEmail && !params.userPhone) {
          Toast({
            message: '请输入邮箱或者手机号',
            duration: 2000,
          });
          return;
        }

        if (params.userPhone && !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(params.userPhone))) {
          Toast({
            message: '请输入正确的手机号',
            duration: 2000,
          });
          return;
        }
        var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (params.userEmail && !re.test(params.userEmail)) {
          Toast({
            message: '请输入正确的邮箱',
            duration: 2000,
          });
          return;
        }
        if (params.titleType == 5) {
          var re1 = /^0\d{2,3}-\d{7,8}$/
          if (params.telephone && !(/^0\d{2,3}-\d{7,8}$/.test(params.telephone) || /^1(3|4|5|7|8|9)\d{9}$/.test(params.telephone))) {
            Toast({
              message: '请输入正确的电话号',
              duration: 2000,
            });
            return;
          }
        }
        if (this.$route.params.fromPage == 'history') {
          let that = this
          console.log(params)
          console.log(this.$route.params)
          let query = Object.assign(
            {
              title: params.title,
              orgTaxNo: params.orgTaxNo,
              companyAddress: params.companyAddress,
              openingBank: params.openingBank,
              bankAccount: params.bankAccount,
              phone: params.userPhone,
              titleEmail: params.userEmail,
              mobile: params.telephone,
              titleType: params.titleType,
              token: this.$store.state.login.token
            }, this.$route.params)
          delete query.type
          delete query.fromPage
          console.log(query)
          this.$Loading.open()
          that.refundData(query).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              that.userInvoiceHeadId = {}
              Toast.success('退票成功');
              that.loadData()
            } else {
              Toast(res.data.info)
            }
          });
          that.$router.go(-1)
        } else {
          this.$Loading.open()
          that.commitData(params).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              Toast.success('保存成功');
              if (this.$route.query.fromPage === 'recharge') {
                if (that.type == 0) { //新建
                  that.$router.go(-1)
                } else {
                  that.$router.go(-2)
                }
              } else {
                if (that.type == 0) { //新建
                  that.$router.go(-1)
                } else {
                  that.$router.go(-3)
                }
              }
              // if (that.type == 1) { //编辑
              //   that.$router.push({
              //     name: 'assistantindex_detail',
              //     params: {
              //       id: that.titleId,
              //       titleType: that.paramsData.radio
              //     }
              //   })
              // } else if (that.type == 0) { //新建
              //   that.$router.go(-1)
              // }
            } else {
              Toast(res.data.info)
            }
          })
        }
      },
      back() {
        let that = this
        console.log(that.type);
        that.$router.go(-1)
      },
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .body {
    .publicInvoice {
      box-shadow: #f3f3f3 0px 0px 15px;
      width: 95%;
      margin: 0 auto 10px auto;

      >>> .van-cell:not(:last-child)::after {
        right: 0.4rem;
      }

      .openBox {
        display: flex;
        justify-content: space-between;
        margin: 0 0.4rem;
        padding: 0.266667rem 0;
        box-sizing: border-box;
        color: #323233;
        font-size: 0.373333rem;
        line-height: 0.64rem;
        border-bottom: 0.026667rem solid #ebedf0;

        .openBox1 {
          span:nth-child(2) {
            font-size: 12px;
            margin-left: 6px;
            color #323233
          }
        }

        .span {
          color #f80f16
          padding 0 14px;
        }
      }

      .taiBtn {
        line-height: 0.64rem;
        padding: 0.266667rem 0.4rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.373333rem;
      }

      .radioBtn {
        .radioBtnDiv {
          width: 80%;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
        }
      }

      .van-cell-group {
        /deep/ .van-field__control {
          text-align: right;
        }

        /deep/ .van-field__control:disabled {
          color: #323233;
        }
      }

      .van-radio-group {
        display: flex;
        justify-content: space-between;
        padding: 0.266667rem 0.4rem;
        line-height: 0.64rem;
        font-size: 0.373333rem;
      }

      .publicInvoiceDiv {
        display: flex;
        justify-content: space-between;

        .img {
          width: 10px;
          vertical-align: middle;
          line-height: 1.2rem;

          img {
            width: 100%;
          }
        }
      }
    }

    .answer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      font-size: 18px;

      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }

    .divPut {
      width 100%;
      height 5.8rem;
      padding 0 0.4rem;
      display flex;
      justify-content space-between
      position: absolute;
      top: 1.2rem;
      z-index: 20;

      .divPut1 {
        height 100%;
        width: 2.4rem;
      }

      .divPut2 {
        flex 1
        height 100%;
        border-radius 5px;
        overflow-y: auto;
        box-shadow: #f3f3f3 0 0 0.4rem;
        background white

        ul {
          li {
            background: white;
            border-top: 0.026667rem solid #ebedf0;
            /*color: #f5f5f5;*/
            height: 1rem;
            padding: 0.3rem 0.4rem;
          }
        }
      }
    }

    .nothing {
      width 100%;
      height 5.8rem;
      padding 0 0.4rem;
      display flex;
      justify-content space-between
      position: absolute;
      top: 1.2rem;
      z-index: 0;
    }

  }

  /deep/ .nav-content {
    overflow-y auto !important;
    margin-bottom 95px;
  }

  .btns {
    display flex;
    height 40px;
    line-height 40px;
    text-align center;
    margin-top 20px;
    font-size 14px;
    justify-content space-between

    span {
      box-shadow: #f3f3f3 0px 0px 15px;
      width 50%;
    }

    span:nth-child(2) {
      color #f80f16
    }
  }

  .van-checkbox {
    display: flex;
    justify-content: center;
    font-size: 14px;
  }

  .focusState {
    position: absolute;
  }
</style>
