<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="qrroot">
      <div class="qrarea">
        <!-- <canvas id='qrimg' class="qrimg">
        </canvas> -->
        <img id='qrimg' class="qrimg"/>
        <!-- <img class="qrimg" src = './userimgs/inviteqr.png' /> -->
        <div class="scantip">
          <img class="scanlinkimg" src="./userimgs/qrsharelink.png"/>
          <div class="qrdestip">微信扫一扫，使用小程序</div>
        </div>
        <div class="shareren">分享人：{{$store.state.userInfo.phone}}</div>
      </div>
      <div class="qrnotice">注：此页面须截屏转发。</div>
    </nav-content>
  </div>
</template>
<script>
  import QRCode from "qrcode";
  import Config from '@/api/config'

  export default {
    data() {
      return {
        userNo: '',
        shareUserCode: "",
      };
    },
    methods: {
      fetchQr() {
        let url = "/app/json/user/queryQrCodeInfo";
        this.$http.post(url, {}).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.myInfo = data.data;
            this.shareUserCode = data.data.qrCodeWithAppDownload;
            this.userNo = data.data.userNo;
            this.getCode();
            // this.toCanvas();
          } else {
            this.$Toast(data.info);
          }
        }, error => {
          // debugger
          this.$Loading.close();
        })
      },
      getCode() {
        let qrcode;
        let longUrl = `${window.location.origin}${Config.shareUrl}?rfrCode=${this.userNo}`
        return new Promise((resolve, reject) => {
          this.$http.post('/app/json/short_address/makeShortAddress', {
            longAddress: longUrl
          }).then(res => {
            if (res.data.status === 0) {
              let url = res.data.data
              this.$http.post('/app/json/we_chat/getwxacode', {
                path: `/pages/common/home/index?path=${encodeURIComponent(url)}`,
                width: 430
              }).then(res => {
                if (res.data.status == 0) {
                  qrcode = 'data:image/png;base64,' + res.data.data;
                  let imgnode = document.getElementById('qrimg');
                  imgnode.src = qrcode;
                  imgnode.onload = () => {
                    resolve();
                  }
                } else {
                  reject();
                  this.$Toast(res.info || '获取小程序码失败')
                }
              }).catch(err => {
                // debugger;
              });
            }
          })
        }).then(res => {

        })
      },
      toCanvas() {
        this.$nextTick(() => {
          let docnode = document.getElementById('qrimg');
          docnode.innerHTML = '';
          QRCode.toCanvas(docnode, this.shareUserCode, err => {
          });
          // let context = docnode.getContext('2d');
          // context.drawImage(docnode,100,100,200,200);
          // context.fillRect(0,0,200,200);
          // document.getElementById('qrimg').appendChild(canvas);
        })
      }
    },
    created() {
      this.fetchQr();
    }
  };
</script>
<style lang="stylus" scoped>
  .qrroot {
    // display:flex;
    // flex-direction:column;
    // align-items:center;
    padding: 20px 20px;

    .qrarea {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 260px;
      border-radius: 10px;
      border-color: #000000;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      padding: 0px 0px;

      .qrimg {
        margin-top: 20px;
        width: 160px !important;
        height: 160px !important;
      }

      .scantip {
        margin-top: 18.5px;
        display: flex;
        align-items: center;

        .scanlinkimg {
          width: 20px;
        }

        .qrdestip {
          margin-left: 2.5px;
          font-size: 16px;
          color: #101010;
          font-weight: 500;
        }
      }

      .shareren {
        margin-top: 8px;
        color: #F02C2D;
        font-size: 13px;
      }
    }

    .qrnotice {
      margin-left: 0px;
      margin-top: 10px;
      color: #F02C2D;
    }

  }
</style>
