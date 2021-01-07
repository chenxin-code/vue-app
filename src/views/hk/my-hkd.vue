/**Created by liaoyingchao on 2020-07-03.*/

<template>
  <div class="myhkd">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
        >
          <div class="top-div">
            <div class="white-bg">
              <!--<div class="user-info">-->
                <!--<div class="header-img">-->
                  <!--<img :src="getHeadImg()">-->
                <!--</div>-->
                <!--<div class="info">-->
                  <!--<div class="name-row">-->
                    <!--<div class="name">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName : $store.state.userInfo.userName}}-->
                    <!--</div>-->
                    <!--<div class="pwd" v-if="this.pwdState.payPwdState == '0'" @click="toSettingPwd">设置密码</div>-->
                    <!--<div class="pwd" v-else @click="openPWD">支付密码管理</div>-->
                  <!--</div>-->
                  <!--<div class="">优客点余额：{{getAssetsValue({rewardType: '100'})}}</div>-->
                <!--</div>-->
              <!--</div>-->
              <div class="user-info">
                <!--<div class="header-img">-->
                  <!--<img :src="getHeadImg()">-->
                <!--</div>-->
                <div class="name">
                  优客点余额：<span>{{getAssetsValue({rewardType: '100'})}}</span>
                </div>
                <div class="pwd" v-if="this.pwdState.payPwdState == '0'" @click="toSettingPwd">设置密码</div>
                <div class="pwd" v-else @click="openPWD">支付密码管理</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="tabs">
              <div class="tab" :class="{'tab-bg-1': payTypeCodes == '100'}" @click="tabEvent(100)">
                兑换明细
              </div>
              <div class="tab" :class="{'tab-bg-2': payTypeCodes == '400'}" @click="tabEvent(400)">
                过期明细
              </div>
              <div class="tab" :class="{'tab-bg-3': payTypeCodes == '200,300'}" @click="tabEvent('200,300')">
                使用明细
              </div>
            </div>
            <div class="list-content">
              <div class="tip" v-show="payTypeCodes == '100'">共计兑换过{{acctData.totalAddUnit}}点</div>
              <div class="tip" v-show="payTypeCodes == '400'">共计过期{{acctData.expireBalanceUnit}}点</div>
              <div class="tip" v-show="payTypeCodes == '200,300'">共计使用{{acctData.totalConsumeUnit}}点</div>
              <div>
                <div class="item line_bottom" v-for="item in listData">
                  <div class="info" v-if="payTypeCodes == '100'">
                    <div class="row" >
                      <div class="label">兑换时间</div>
                      <div class="time">{{item.effectiveDate}}</div>
                    </div>
                    <div class="row">
                      <div class="label">有效期</div>
                      <div class="time">{{item.expireDate}}</div>
                    </div>
                  </div>
                  <div class="info" v-if="payTypeCodes == '200,300'">
                    <div class="row" >
                      <div class="label">兑换时间</div>
                      <div class="time">{{item.paidTime}}</div>
                    </div>
                    <div class="row">
                      <div class="label">消费类型</div>
                      <div class="time">{{item.orderTypeName}}</div>
                    </div>
                  </div>
                  <div class="points">
                    <span></span>{{payTypeCodes == '100' ? '+' : ''}}{{item.amountUnit}}<span>点</span>
                  </div>
                </div>
                <div class="no-data" v-if="listData.length == 0">暂无详细数据</div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <!--弹框 选择设置密码-->
      <div class="content-box" :class="{'mask': active}" v-show="showChangePwd">
        <div class="change-pwd-info">
          <div class="change-info-btn theme_font_black_i">
            <div class="pwd" @click="openmMdifyPwd">修改6位数字支付密码</div>
            <div class="pwd forget-pwd" @click="openForgetPwd">忘记6位数字支付密码</div>
          </div>
          <div class="cancel-btn theme_font_red_i" @click="cancelBtn">取消</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "myhkd",
    components: {},
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      return {
        payTypeCodes: '100',
        acctData: {},
        listData: [],
        page: 1,
        loading: true,
        finished: false,
        pwdState: {
          payPwdState: 0
        },
        showChangePwd: false, // 弹框选择设置密码
        active: false,
      }
    },
    methods: {
      openmMdifyPwd() {
        // 打开修改密码页面
        this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 1}}) // 修改支付密码
      },
      openForgetPwd() {
        // 打开忘记支付密码页面
        this.$router.push({path: '/usercenter/forgetPwd'})
      },
      openPWD() {
        if (this.pwdState.payPwdState == 0) {
          // 0未设置支付密码
          this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 0}})
        } else if (this.pwdState.payPwdState == 1) {
          // 1支付密码已锁定
          this.$Toast(`数字密码已被锁定，请您在${this.pwdState.lockDate}后重试`)
        } else if (this.pwdState.payPwdState == 2) {
          // 数字密码
          this.showChangePwd = true
          this.active = true // 遮罩的背景
        }
      },
      cancelBtn() {
        // 弹框取消按钮
        this.showChangePwd = false // 已设置支付密码
        this.active = false // 遮罩的背景
      },
      paPayPwdSate() {
        // 是否设置密码
        this.$http.post('/app/json/user/paPayPwdSate', {}).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.pwdState = data.data
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Toast('请求数据失败，请稍后重试！')
        })
      },
      onLoad: function () {
        this.page++
        this.getHkdList()
      },
      tabEvent: function (code) {
        this.listData = []
        this.page = 1
        this.payTypeCodes = code
        this.getHkdList()
      },
      getHkdList: function () {
        this.$Loading.open();
        let url = '/app/json/acct/getAccountPaymentList'
        let paramsData = {
          page: this.page,
          rows: 20,
          acctType: '8',
          payTypeCodes: this.payTypeCodes
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.loading = false
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = this.listData.concat(data.data)
              if (this.listData.length >= data.totalRecords) {
                this.finished = true
                return;
              }
            } else {
              this.finished = true
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败，请稍后重试！')
          }
        );
      },
      getHkdInfo: function () {
        this.$Loading.open();
        let url = '/app/json/acct/getAccountBaseInfo'
        let paramsData = {
          acctType: '8'
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.acctData = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败，请稍后重试！')
          }
        );
      },
      getAssetsValue: function (item) {

        if (item.rewardType) {
          let rewardList = this.$store.state.mall2.myAssets.rewardList
          for (let i = 0; rewardList && i < rewardList.length; i++) {
            if (rewardList[i].rewardsSurplusOrderType == item.rewardType) {
              return rewardList[i].rewardsSurplus
            }
          }
          return '0'
        }

        return this.$store.state.mall2.myAssets[item.countKey]
      },
      getHeadImg: function () {
        if (this.userInfo.headImg && this.userInfo.headImg.length && this.userInfo.headImg != 'undefined') {
          return this.userInfo.headImg;
        } else {
          //女
          if (this.userInfo.gender == '2') {
            return 'static/image/setting/setting-img.png';
          } else {
            return 'static/image/setting/setting-img-man.png';
          }
        }
      },
      toSettingPwd: function () {
        this.$router.push({
          path: "/usercenter/nosetpwd",
          query: {
            isSet: 0
          }
        });
      },
    },
    created() {
      this.getHkdInfo()
      this.tabEvent('100')
      this.paPayPwdSate()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .myhkd {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      width 100%
      height 100%
      overflow-y auto;
      background-color #efefef;

      .top-div {
        background-color #FD6802
        overflow hidden;

        .white-bg {
          margin 10px 15px 0;
          background-color white;
          border-radius 5px 5px 0 0;
          padding 20px 12px;
          overflow hidden;

          .user-info {
            display flex;
            align-items center;
            justify-content space-between
            .name {
              font-size 14px;
              span {
                font-size 24px;
                font-weight 500;
                color #FD6802;
              }
            }
            .pwd {
              background-color #FCF4E6;
              border-radius 20px 0 0 20px;
              margin-right -12px;
              font-size 14px;
              padding 8px 10px 8px 16px;
            }
          }

          /*.user-info {
            display flex;
            align-items center;

            .header-img {
              img {
                display block;
                width 50px;
                height 50px;
              }
            }

            .info {
              flex 1;
              padding-left 10px;

              .name-row {
                display flex;
                justify-content space-between;

                .name {
                  font-size 18px;
                  font-weight 500;
                }

                .pwd {
                  background-color #FCF4E6;
                  border-radius 20px 0 0 20px;
                  margin-right -12px;
                  font-size 13px;
                  padding 8px 10px 8px 16px;
                }
              }
            }
          }*/
        }
      }

      .list {
        padding 10px 15px 0px;

        .tabs {
          display flex;
          align-items center;

          .tab {
            flex 1;
            text-align center;
            font-size 14px;
            height 40px;
            line-height 40px;
          }

          .tab-bg-1 {
            color #FD6802
            background url("./img/tab1.png") repeat center center / 100% 100%;
          }

          .tab-bg-2 {
            color #FD6802
            background url("./img/tab2.png") repeat center center / 100% 100%;
          }

          .tab-bg-3 {
            color #FD6802
            background url("./img/tab3.png") repeat center center / 100% 100%;
          }
        }

        .list-content {
          overflow hidden;
          background white;
          padding 10px;

          .tip {
            background-color #fcf4e6;
            text-align center;
            color #FD6802
            //margin 0 10px;
            padding 10px;
            font-size 12px;
            border-radius 4px;
          }

          .item {
            overflow hidden;
            display flex;
            align-items center;
            padding 6px 0;

            .info {
              flex 1;

              .row {
                padding 6px 0;
                display flex;
                align-items center;
                font-size 14px;

                .label {
                  width 70px;
                }

                .time {

                }
              }
            }

            .points {
              color #FD6802
              font-size 18px;
              font-weight 500

              span {
                font-size 14px;
              }
            }
          }
        }

        .no-data {
          padding 30px;
          font-size 16px;
          color #999;
        }
      }
    }

    .content-box {
      position absolute
      top 0
      left 0
      right: 0
      bottom 0
      padding: 0 10px

      &.mask {
        background rgba(0, 0, 0, 0.4)
      }

      .change-pwd-info {
        position fixed
        bottom 0
        left: 10px
        right: 10px
        padding-top: 10px
        text-align center
        font-size: 14px

        .change-info-btn, .cancel-btn {
          background: #fff
          margin-bottom: 10px
          border-radius 4px

          .pwd {
            padding: 18px 0
          }

          .forget-pwd {
            border-top: 1px solid #ddd
          }
        }

        .cancel-btn {
          padding: 18px 0
          font-weight bold
        }
      }
    }
  }
</style>
