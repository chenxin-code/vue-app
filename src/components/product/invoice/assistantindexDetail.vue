<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="发票抬头">
      <div class="shareBox" @click="operation">
        <span class="iconfont mall-gengduo"></span>
      </div>
    </nav-top>
    <nav-content>
      <div class="bodyDiv">
        <div class="contain">
          <div class="publicInvoice">
            <div class="maDiv">
              <div class="ma">
                <canvas class="qrcode" id="qrcode"></canvas>
              </div>
              <p>商家扫描二维码，快速获取抬头信息</p>
            </div>
            <div class="operation">
              <div class="operationImg">
                <!--                <div class="div1" v-if="item.titleType === 4">-->
                <!--                  <img src="static/image/invoice/icon2.png" alt>-->
                <!--                </div>-->
                <!--                <div class="div1" v-if="item.titleType === 5">-->
                <!--                  <img src="static/image/invoice/icon1.png" alt>-->
                <!--                </div>-->
                <div class="titleContent">
                  <span class="titleMessage">{{listData.title}}</span>
                  <!--                  <span>{{listData.orgTaxNo}}</span>-->
                </div>
              </div>
              <div class="mall-jiantou" @click="edit">
                <span class="iconfont mall-bianji"></span>
              </div>
            </div>
            <div>
              <van-cell-group>
                <van-field  v-if="!people" v-model="listData.orgTaxNo" label="税号" disabled/>
                <van-field  v-if="!people" v-model="listData.companyAddress" label="地址" disabled/>
                <van-field v-model="listData.telephone" label="电话" disabled/>
                <van-field  v-if="!people" v-model="listData.openingBank" label="开户行" disabled/>
                <van-field  v-if="!people" v-model="listData.bankAccount" label="账号" disabled/>
              </van-cell-group>
            </div>
            <!--            <div class="operation te">-->
            <!--              <div class="teDiv">-->
            <!--                <span v-if="item.defaults === 1" class="theme_bg_red operationSpan">默认</span>-->
            <!--                <span-->
            <!--                  @click="defaultData(item)"-->
            <!--                  v-if="item.defaults === 0"-->
            <!--                  class="operationspan"-->
            <!--                >设为默认抬头</span>-->
            <!--              </div>-->
            <!--              <div class="operationDiv">-->
            <!--                <span @click="edit(item)">编辑</span>-->
            <!--                <span>|</span>-->
            <!--                <span @click="del(item)">删除</span>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        @select="onSelect"
      />
    </nav-content>
    <div v-if="$store.state.webtype == 2" class="btns">
      <div class="theme_bg_red add" @click="del">
        删除
      </div>
      <div class="theme_bg_red add" v-if="defaultView" @click="defaultData">
        设为默认
      </div>
      <div class="gray add" v-if="!defaultView">
        已设为默认
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import QRCode from "qrcode";
  import Config from "@/api/config.js";
  import {Toast} from "vant";
  export default {
    name: "assistantIndexDetail",
    mixins: [api],
    components: {
      QRCode
    },
    data() {
      return {
        qrCode: false,
        listData: {},
        id: "",
        people: true, // false为单位，true为个人
        title: "",
        orgTaxNo: "",
        type: "",
        userId: "",
        titleType: "",
        defaults: '',
        defaultView: true,
        openvView: true,
        show: false,
        actions: [
          { name: '删除' },
          { name: '默认' }
        ],
        paramsData: {
          orgTaxNo: '',
          companyAddress: '',
          userPhone: '',
          openingBank: '',
          bankAccount: ''
        }
      };
    },
    created() {
      this.id = this.$route.query.id
      if (this.$route.query.titleType == 5) {
        this.people = false
      } else {
        this.people = true
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
      //初始化
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          id: that.id
        };

        that.soudetailData(params).then(res => {
          if (res.data.result) {
            that.listData = res.data.data|| {}
            if (that.listData.defaults == 1) {
              that.defaultView = false
            } else {
              that.defaultView = true
            }
            this.$nextTick(() => {
              QRCode.toCanvas(document.getElementById('qrcode'), that.listData.codeNumber, {
                margin: 0,
                width: 120
              })
            })
          }
        });
      },
      onSelect(item) {
        let that = this
        // 点击选项时默认不会关闭菜单，可以手动关闭
        that.show = false;
        if (item.name == '删除') {
          that.del()
        } else if (item.name == '默认') {
          that.defaultData()
        }
      },
      operation() {
        this.show = true
      },
      edit() {
        let that = this;
        that.$router.push({
          path: "/taitou",
          query: {
            id: that.id,
            type: 1,
            defaults: that.listData.defaults,
            fromPage: this.$route.query.fromPage
          }
        });
      },
      del() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          id: that.id
        };

        that.delData(params).then(res => {
          console.log(444444);
          console.log(res);
          if (res.data.result) {
            Toast.success("删除成功");
            that.$router.go(-1); //调一下列表接口
          } else {
            Toast(res.data.info);
          }
        });
      },
      defaultData() {
        let that = this;
        // that.defaults = index.defaults;
        let params = {
          token: this.$store.state.login.token,
          id: that.id
        };

        that.morenData(params).then(res => {
          if (res.data.result) {
            if (res.data.data === "success") {
              that.defaults = 1;
              that.defaultView = false
              Toast.success("已设为默认抬头");
              that.$router.go(-1); //调一下列表接口
            }
          } else {
            Toast(res.data.info);
          }
        });
      }
    },
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10
      span {
        font-size 22px;
      }
    }

    .bodyDiv {
      overflow: auto;
      height: 100%;

      .contain {
        .p {
          line-height: 40px;
          width: 95%;
          margin: 0 auto;
          font-size: 16px;
        }
        .titleDiv {
          display flex;
          justify-content space-between;
          font-size 16px;
          width 90%;
          margin: 0 auto;
          padding: 20px 0;
          .imgpiao {
            width 25px;
            vertical-align middle
          }
        }

        .publicInvoice {
          box-shadow: #f3f3f3 0px 0px 15px;
          width: 95%;
          margin: 0 auto 10px auto;
          overflow: hidden;

          .operation {
            /*width: 95%;*/
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            padding: 15px 0px 0 0;
            /*border-bottom: 1px solid #ebedf0;*/
            padding: 0.266667rem 0.4rem;

            .operationImg {
              line-height: 30px;
              display: flex;
              font-size: 14px;
              justify-content: space-between;
              .img {
                margin-top 7.5px;
              }
              .titleMessage {
                font-size 16px;
              }
              .titleContent {
                display flex
                flex-direction: column;
              }

              .div1 {
                width: 30px;
                margin-right: 15px;
                border-radius: 50%;

                img {
                  width: 100%;
                  /*vertical-align: middle;*/
                }
              }
            }
            .mall-jiantou {
              padding-left 30px;
              span {
                margin-top 3px;
                font-size 22px;
                display inline-block
              }
            }

            .operationSpan {
              padding: 0 15px;
              border-radius: 12px;
              color: #fff;
              line-height: 25px;
              height: 25px;
              font-size: 14px;
              display: inline-block;
            }

            .teDiv {
              line-height: 30px;
            }

            .operationDiv {
              line-height: 30px;
              /*height: 25px;*/
              font-size: 14px;

              span {
                margin: 0 6px;
                font-size 16px;
                color #787878
              }
            }
          }

          .te {
            border-bottom: none;
          }

          .maDiv {
            padding-bottom 10px;
            p {
              text-align: center;
              color: #787878;
              font-size 14px;
              margin-top: 0.3rem;
            }

            .ma {
              width: 150px;
              height: 150px;
              margin: 10px auto 10px auto;

              >>> .qrcode {
                width: 150px !important;
                height: 150px !important;
              }
            }
          }

          /deep/ .van-cell:not(:last-child)::after {
            right: 0.4rem;
          }

          .borDiv:not(:last-child)::after {
            border-bottom: 0;
          }

          .fa {
            /deep/ .van-field__control {
              text-align: right;
            }
          }

          .nei {
            /deep/ .van-field__control {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }

        .answer {
          width: 85%;
          height: 50px;
          margin: 20px auto;
          border-radius: 30px;
          line-height: 50px;
          text-align: center;
          color: white;
          margin-bottom 80px;

          a {
            display: block;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: white;
            font-size: 18px;
          }
        }
      }

      .bottomTab {
        border-top: 1px solid #ebedf0;
        position: fixed;
        height: 65px;
        padding-top: 6px;
        text-align: center;
        bottom: 0;
        width: 100%;
        background: white;
        left: 0;
        display: flex;
        justify-content: space-between;

        a {
          display: inline-block;
          width: 50%;

          .left {
            width: 100%;

            .img {
              width: 30px;
              display: block;
              margin: 0 auto 10px auto;

              img {
                width: 100%;
              }
            }
          }
        }
      }
    }
    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }
    }
  }
    .btns{
      position: fixed;
      bottom: 20px;
      left: 2%;
      width: 96%;
      display: flex;
      justify-content: space-between;
      .add {
        width: 45%;
        height: 50px;
        line-height: 50px;
        border-radius: 15px;
        text-align: center;
        font-size: 0.426667rem;
        display: inline;
        float: left;
        color: white;
      }
      .gray {
       background-color #d0cdcd
      }
    }
</style>
