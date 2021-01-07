<template>
  <div class="recommend-code">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="recom-root">
      <div class="recom-back"></div>
      <div class="code-back">
        <img class="logo-top" :src="logoUrl"/>
        <div class="acount">{{phone}} </div>
           <div class="qrcode-div" @click="downloadImg">
             <div class="qrcode" id="qrcode" ref="qrcode"></div>
           </div>
           <div class="code-value">
             {{qrData.data.qrCode}}
             </div>
           <div class="fold-area" v-show="unfold">
             <div class="line"/>
             <div class="acount-info"><span>会员姓名</span><span>{{realName?realName:'无'}}</span></div>
             <div class="acount-info"><span>会员号</span><span>{{qrData.data.userNo}}</span></div>
             <div class="acount-info"><span>是否员工</span><span>{{empInfo.empNo ? '是' : '否'}}</span></div>
             <div class="acount-info"><span>员工号</span><span>{{empInfo.empNo || '无'}}</span></div>
             <div class="acount-info"><span>所属油站</span><span>{{empInfo.unitName || '无'}}</span></div>
           </div>
           <div class="show-more" v-if="unfold" @click="unfold=false"><img src='./images/fold.png'/>收起</div>
           <div class="show-more" v-else @click="unfold=true"><img src='./images/unfold.png'/>下拉查看会员信息</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import Config from "@/api/config.js";

  export default {
    name: "recommend-code",
    components: {},
    data() {
      return {
        myQrcodeValue: '',
        qrData:'',
        myTimeout: null,
        unfold:false,//是否展开，默认不展开
        empInfo:'',
        logoUrl:this.$store.state.globalConfig.logoUrl,
        phone:this.$util.dealPhone(this.$store.state.userInfo.phone),
        realName:this.$store.state.userInfo.realName

      }
    },
    methods: {
      getRfrCode: function () {
        this.$Loading.open()
        let url = '/app/json/user/getUserRfrCode';
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.qrData = res.data;
            let sss = this.$store.state.globalConfig;
            let aaa = this.$store.state.userInfo;
            this.getMyInfo();
            // if(res.data.data.empNo){
            //     this.getMyInfo();
            // }
            let path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/downloadshare`
            if (path.indexOf('?') > -1) {
              this.myQrcodeValue = path + `&qrCode=${data.data.qrCode}`
            } else {
              this.myQrcodeValue = path + `?qrCode=${data.data.qrCode}`
            }
            this.$nextTick(()=>{this.toCanvas()});
            } else {
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close();
        })
      },
      getMyInfo: function () {
        this.$Loading.open();
        let url = '/app/json/user/getUserEmpByUserId';
        this.$http.post(url, {}).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.empInfo = data.data || {};
            } else {
              this.$Toast(data.info ? data.info : '获取员工信息失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },
      toCanvas:function () {
        let qrDiv = document.getElementById('qrcode');
        qrDiv.innerHTML = ' ';
        let qrcode = new QRCode('qrcode', {
          width: 200,  // 设置宽度
          height: 200, // 设置高度
          text:  this.myQrcodeValue
        })
        let imgElArr = document.getElementById('qrcode').getElementsByTagName('img');
        let imgEl = imgElArr[0];
        imgEl.id = 'qrcodeimg';
        imgEl.style.width = "100%";
        imgEl.style.height = "100%";
      },
      downloadImg: function () {
        this.$messagebox.confirm('是否将二维码保存到相册？', '提示').then(action => {
          let image = document.getElementById("qrcodeimg");
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let base64D = canvas.toDataURL("image/png");
          let arr1 = base64D.split('base64,')
          if (arr1.length == 2) {
            base64D = arr1[1]
          }
          this.$bridgefunc.savePhoto(base64D, (result) => {
            if (result == '1') {
              this.$Toast('保存成功！')
            } else {
              this.$Toast('保存失败！')
            }
          })
        }).catch(action => {
        });
      }
    },
    mounted(){
      this.getRfrCode();
    },
    created() {
      // this.getRfrCode();
      // this.getMyInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .recom-root {
    display flex;
    flex-direction column;
    .recom-back {
      width:100%;
      height:140px;
      background:linear-gradient(-55deg,rgba(172,36,49,1),rgba(229,45,64,1));
      z-index 1;
    }
    .code-back {
      display flex;
      flex-direction column;
      background-color:white;
      margin:-70px 10px 0 10px;
      border-radius:6px;
      box-shadow:0px 0px 20px 0px rgba(0, 0, 0, 0.1);
      min-height:310px;
      z-index: 10;
      .logo-top {
          position absolute;
          top 29px;
          align-self center;
          width 75px;
          height 75px;
          border-radius 75px;
          margin -75px auto 0 atuo;
          z-index 100;
       }
       .acount {
         margin 52px auto 0 auto;
         color #333333;
        }
        .qrcode-div {
            margin-top 24px;
            width 140px;
            height 140px;
            overflow hidden
            margin 24px auto 0 auto;
              .qrcode-a {
                width 100%;
                height 100%;
              }
              .qrcode {
                // margin 15%;
              }
        }
        .code-value {
          color #333333;
          font-size 18px;
          margin 8.5px auto 0 auto;
          flex: 1;
        }
        .show-more {
          display block;
          margin 0 auto 14.5px auto;
          color #666666;
          font-size 13px;
          img {
            width 9.5px;
            margin-right 5px;
          }
        }
        .fold-area {
          .line {
            background-color #DCDDDD;
            margin 20px 15px 15px 15px;
            height:0.7px;

          }
           .acount-info {
              display flex;
              flex-direction row;
              justify-content space-between;
              height 30px;
              color #333333;
              font-size 13px;
              padding 0 15px;
              font-weight 400;
              font-family:PingFang SC;
           }
        }
      }
      // .logo-top {
      //     position absolute;
      //     top 29px;
      //     align-self center;
      //     width 75px;
      //     height 75px;
      //     border-radius 75px;
      //     margin -75px auto 0 atuo;
      //     background-color:yellow;
      //     z-index 100;
      // }
  }

  // .recommend-code {
  //   width 100%
  //   height 100%
  //   overflow hidden
  //   .qrcode-div {
  //     .qrcode-a {
  //       width 100%;
  //     }
  //     .qrcode {
  //       margin 15%;
  //     }
  //   }
  // }
</style>
