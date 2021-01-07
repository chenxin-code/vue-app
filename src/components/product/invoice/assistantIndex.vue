<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="发票助手">
      <div class="shareBox">
        <div class="name">
          <router-link :to="{path:'/taitou',query:{type:0}}">添加发票抬头</router-link>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="bodyDiv">
        <div class="contain">
          <router-link to="/taitouList">
            <div class="titleDiv">
              <div>
                <img class="imgpiao" src="static/image/invoice/icon7@2x.png" alt="">
                <span>发票抬头</span>
              </div>
              <div>
                <span>全部抬头（{{taitouNum}}）</span>
                <span class="img iconfont mall-gengduojiantou"></span>
              </div>
            </div>
          </router-link>
          <div class="publicInvoice" v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
            <div class="operation">
              <div class="operationImg">
                <div class="div1" v-if="item.titleType === 4">
                  <img src="static/image/invoice/icon2.png" alt>
                </div>
                <div class="div1" v-if="item.titleType === 5">
                  <img src="static/image/invoice/icon1.png" alt>
                </div>
                <div class="titleContent">
                  <span class="titleMessage">{{item.title}}</span>
                  <span>{{item.orgTaxNo}}</span>
                </div>
              </div>
<!--              <div class="mall-jiantou">-->
<!--                <span v-show="item.showCode" @click="exhibition1Detail(item)"-->
<!--                      class="iconfont mall-gengduojiantou"></span>-->
<!--                <span v-show="!item.showCode" @click="exhibition1(item)" class="iconfont mall-arrow-down"></span>-->
<!--              </div>-->
              <div class="mall-jiantou" v-show="item.showCode" @click="exhibition1Detail(item)">
                <span
                      class="iconfont mall-gengduojiantou"></span>
              </div>
              <div class="mall-jiantou" v-show="!item.showCode" @click="exhibition1(item)">
                <span class="iconfont mall-arrow-down"></span>
              </div>
            </div>
            <div class="maDiv" v-show="item.showCode">
              <div class="ma">
                <canvas class="qrcode" :id="`id_${index}`"></canvas>
                <!--<div class="qrcode" :id="`id_${index}`" ref="codes"></div>-->
              </div>
              <p>商家扫描二维码，快速获取抬头信息</p>
            </div>
          </div>
          <div class="publicInvoice" v-if="listData.length==0">
             <div class="emptyDiv">
               <img src="static/image/invoice/p2@2x.png" alt="">
               <span>暂无抬头信息</span>
             </div>
          </div>
        </div>
        <div class="theme_bg_red add" v-if="$store.state.webtype == 2 || $store.state.globalConfig.addTitleButton == 1">
          <router-link :to="{path:'/taitou',query:{type:0}}">添加抬头</router-link>
        </div>
      </div>
    </nav-content>
    <div class="bottomTab" v-if="$store.state.webtype != 2">
      <router-link to="/historyInvoice">
        <div class="left">
          <div class="img">
            <img src="static/image/invoice/icon5@2x.png" alt="">
          </div>
          <div>
            <span>历史开票</span>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </router-link>
      <router-link to="/invoiceSelfIndex">
        <div class="left">
          <div class="img">
            <img src="static/image/invoice/icon6@2x.png" alt="">
          </div>
          <div>
            <span>自助开票</span>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="bottomTab" v-if="$store.state.webtype == 2 && view == true">
      <router-link to="/historyInvoice">
        <div class="left">
          <div class="img">
            <img src="static/image/invoice/icon5@2x.png" alt="">
          </div>
          <div>
            <span>历史开票</span>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </router-link>
      <router-link to="/invoiceSelfIndex">
        <div class="left">
          <div class="img">
            <img src="static/image/invoice/icon6@2x.png" alt="">
          </div>
          <div>
            <span>自助开票</span>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="bottomTab bottomTab1" v-if="$store.state.webtype == 2 && view == false">
      <router-link to="/historyInvoice" style="width: 100%">
        <div class="left">
          <div class="img">
            <div><img src="static/image/invoice/icon5@2x.png" alt=""></div>
          </div>
          <div class="div">
            <span>历史开票</span>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import QRCode from "qrcode";
  import Config from "@/api/config.js";
  import {Toast} from "vant";

  export default {
    name: "",
    mixins: [api],
    components: {
      QRCode
    },
    data() {
      return {
        qrCode: false,
        listData: [],
        id: "",
        title: "",
        orgTaxNo: "",
        codeNumber: "",
        type: "",
        userId: "",
        titleType: "",
        defaults: '',
        openvView: true,
        taitouNum: '',
        view: true,
      };
    },
    created() {

    },
    mounted() {
      console.log(222,this.$store.state.globalConfig.addTitleButton);
      this.loadData();
      console.log(this.$store.state.globalConfig.isInterfaceDisplay); //自助自助开票是否展示,1不展示，0展示
      let textFace = this.$store.state.globalConfig.isInterfaceDisplay
      if (textFace == '1') {
        this.view = false
      } else {
        this.view = true
      }
    },
    methods: {
      //初始化
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token
        };

        that.riseData(params).then(res => {
          if (res.data.result) {
            that.listData = [];
            let listData = res.data.data;
            that.taitouNum = listData.length || 0
            listData.forEach(function (item, index) {
              item.showCode = false;
              listData[0].showCode = true
              that.$nextTick(() => {
                document.getElementById(`id_${index}`).innerHTML = ""; // 清空二维码
                QRCode.toCanvas(document.getElementById(`id_${index}`), item.codeNumber)
                /* let qrcode = new QRCode(`id_${index}`, {
                   width: 150, // 设置宽度
                   height: 150, // 设置高度
                   text: binaryString
                 });*/
              });
            });
            that.listData = listData;
          }
        });
      },
      exhibition1(index) {
        let that = this;
        that.listData.forEach(function (item) {
          item.showCode = false;
        });
        index.showCode = true;
      },
      exhibition1Detail(index) {
        console.log(index);
        this.$router.push({
          path: "/assistantindex_detail",
          query: {
            id: index.id,
            titleType: index.titleType
          }
        })
      },
      defaultData(index) {
        let that = this;
        that.id = index.id;
        that.defaults = index.defaults;
        console.log(996, that.defaults);
        let params = {
          token: this.$store.state.login.token,
          id: that.id
        };

        that.morenData(params).then(res => {
          if (res.data.result) {
            if (res.data.data === "success") {
              that.defaults = 1;
              Toast.success("已设为默认抬头");
              that.loadData();
            }
          } else {
            Toast(res.data.info);
          }
        });
      }
    }
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

      .name {
        margin-right 10px;
        font-size 14px;

        a {
          color #f80f16
        }
      }
    }

    .bodyDiv {
      overflow: auto;
      height: 100%;

      .contain {
        a {
          color black
        }
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
            width 18px;
            margin-right 5px;
            vertical-align middle
          }
        }

        .publicInvoice {
          box-shadow: #f3f3f3 0px 0px 15px;
          width: 95%;
          margin: 0 auto 10px auto;
          overflow: hidden;
          .emptyDiv {
            text-align center;
            font-size 16px;
            padding: 40px 0;
            img {
              width: 150px;
              display: block;
              margin: 0 auto;
              margin-bottom: 20px;
            }
          }
          .operation {
            width: 95%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            padding: 15px 0px 0 0;
            /*border-bottom: 1px solid #ebedf0;*/

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
                margin-top 7px;
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

              /deep/ .qrcode {
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

    }

    .add {
      width: 80%;
      margin: 20px auto;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      color: white;
      text-align: center;
      font-size: 16px;
      a {
        color: white;
        width 100%;
        display inline-block;
      }
    }
    .bottomTab {
      /*border-top: 1px solid #ebedf0;*/
      position: fixed;
      height: 65px;
      /*padding-top: 6px;*/
      text-align: center;
      bottom: 0;
      width: 100%;
      background: white;
      left: 0;
      a {
        width: 48%;
        height: 100%;
        box-shadow: #eeeeee 0 0 0.4rem;
        border-radius 5px;
        font-size 16px;
        color black
        display: flex;
        position relative;
        float left

        .left {
          width: 100%;
          height 30px
          line-height 30px;
          position absolute
          top 50%;
          margin-top -15px;

          .img {
            width: 30px;
            float left;
            margin-left 25px;

            img {
              width: 100%;
              vertical-align middle
            }
          }
          div:nth-child(2) {
           float right;
            margin-right 25px;
          }
        }
      }
      a:nth-child(1) {
       margin-right 4%
      }
    }

    .bottomTab1 {
      a {
        .left {
          .img {
            width 45%;
            margin-left 0
            div {
              /*width 50%;*/
              width 30px;
              float right
              img {
                width 100%
              }
            }
          }
          div:nth-child(2) {
            width 51%;
            margin-right 0
            text-align left
          }
        }
      }
    }
    /deep/ .nav-content {
      margin-bottom 65px;
    }
  }
</style>
