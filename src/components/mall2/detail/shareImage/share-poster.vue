<template>
  <div>
    <div class="poster-mask"></div>
    <!-- <van-overlay :show="true"> -->
      <div class="share-main" style="height: 100vh">
        <div class="overlay-content" v-if="!showResult && !isPoster">
          <img
            src="./image/guanbi@2x.png"
            class="close-icon"
            @click="backPage"
          />
          <div class="save-pic-text">
            <div class="share-desc">
              {{ shareParams.skuName }}
            </div>
            <div class="share-desc" style="word-break: break-all;">
              购买链接: {{ shareParams.link }}
            </div>

            <div class="share-picture">
              <img
                class="share-image"
                v-for="(item, index) in shareParams.picUrls"
                :key="index"
                :src="item"
              />
            </div>
            <div class="save-btn" @click="saveData">保存图文</div>
          </div>
          <div class="overlay-content-bottom">
            <div class="share-money" @click="savePoster">
              分享后预计可赚 ¥{{ shareParams.estimatedCommission }}
            </div>
            <div class="share-check">佣金可在“分销员中心”里查看</div>
          </div>
        </div>


        <div class="overlay-content" v-if="!showResult && isPoster">
          <img
            src="./image/guanbi@2x.png"
            class="close-icon"
            @click="backPage"
          />

          <div v-if="!isShowPoster && !isCanvas" ref="poster" @click="saveIOS">
            <img :src="proImgUrl" class="main-poster" />
            <div class="poster-user-message">
              <div>
                <img :src="proUserUrl" class="user-image" v-if="proUserUrl" />
                <img
                  src="./image/default-image.jpeg"
                  class="user-image"
                  v-else
                />
              </div>
              <div class="poster-user-right">
                <div class="poster-user-name">{{ shareParams.userName }}</div>
                <div class="poster-user-text">为你挑选了一个好物</div>
              </div>
            </div>
            <div class="poster-product-message">
              <div class="poster-product-message-left">
                <div class="poster-product-prize">
                  ¥ {{ shareParams.salePrice }}
                </div>
                <div class="poster-product-desc">{{ shareParams.skuName }}</div>
              </div>
              <div class="poster-product-message-right">
                <img
                  :src="shareParams.qrCode"
                  style="width:60px;height: 60px;"
                />
              </div>
            </div>
          </div>
          <img
            :src="canvasData"
            alt=""
            v-if="isCanvas"
            style="width: 100%"
            ref="posterPicture"
            @click="saveIOS"
          />
          <div class="overlay-content-bottom">
            <div class="share-money">
              分享后预计可赚 ¥{{ shareParams.estimatedCommission }}
            </div>
            <div class="share-check">佣金可在“分销员中心”里查看</div>
          </div>
          <div class="finger" ref="fingerSave">
            <img class="finger-image" src="./image/finger.png" />
            <div class="finger-save-text">长按图片保存到相册</div>
          </div>
        </div>

        <div class="overlay-result" v-if="showResult">
          <div class="overlay-block">文案/链接已复制</div>
          <div style="text-align: center;">图片已保存到相册</div>
          <div class="result-line"></div>
          <div class="overlay-btn" @click="backPage">我知道了</div>
        </div>
      </div>
    <!-- </van-overlay> -->
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import appCamera from "@zkty-team/x-engine-module-camera";
import html2canvas from "html2canvas";

export default {
  props: {
    shareParams: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isCanvas: false,
      canvasData: "",
      proImgUrl: "",
      proUserUrl: "",
      skuName: "",
      showResult: "",
      isPoster: this.shareParams.type == "poster",
      picUrls: [],
      isShowPoster: false
    };
  },
  async created() {
    await this.formatImgUrl(this.shareParams.picUrls[0], "proImgUrl");
    await this.formatImgUrl(this.shareParams.userImage, "proUserUrl");

    html2canvas(this.$refs.poster).then(canvas => {
      this.canvasData = canvas.toDataURL("image/png");
      this.isCanvas = true;
      // this.getImages("posterPicture");
      // this.getImages("fingerSave");

      window.saveImageToAlbum = () => {
        appCamera.saveImageToAlbum({
          type: "base64",
          imageData: this.canvasData
        });
      };
    });
  },
  methods: {
    getImages(ref) {
      const that = this;
      window.time = 0;
      console.log("--getImages--ref-", ref);
      var objs = this.$refs[ref];
      console.log("--getImages--ref-", objs);
      objs.addEventListener("touchstart", function(e) {
        e.stopPropagation();
        time = setTimeout(function() {
          //这里写需要执行操作的代码
          console.log("--------2000ms");
          if (that.isIOS()) {
            appCamera.saveImageToAlbum({
              type: "base64",
              imageData: that.canvasData
            });
          }
        }, 2000); //这里设置长按响应时间
      });
      objs.addEventListener("touchend", function(e) {
        e.stopPropagation();
        clearTimeout(time);
      });
    },
    saveIOS() {
      if (this.isIOS()) {
        appCamera.saveImageToAlbum({
          type: "base64",
          imageData: this.canvasData
        });
      }
    },
    isIOS() {
      var u = navigator.userAgent;
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    saveData() {
      this.shareParams.picUrls.forEach(item => {
        appCamera.saveImageToAlbum({
          type: "url",
          imageData: item
        });
      });
      const that = this;
      new ClipboardJS(".save-btn", {
        text: function(trigger) {
          return `${that.shareParams.skuName}
购买链接：${that.shareParams.link}
          `;
        }
      });
      this.showResult = true;
    },
    savePoster() {
      //   window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
      //     JSON.stringify({
      //       // businessCstNo, //会员标识
      //       // platMerCstNo, //预下单平台商户号
      //       // tradeMerCstNo, //预下单交易商户号
      //       // billNo, //业务系统订单号
      //       ...tradeParam,
      //       appScheme: "x-engine-c",
      //       payType: false
      //     })
      //   )}&callback=${encodeURIComponent(this.redirectUrl)}`;
      //   xengine.api("com.zkty.jsi.camera", "saveImageToPhotoAlbum", {
      //     type: "url",
      //     imageData: this.proUserUrl
      //   });
      //   appCamera.saveImageToAlbum = () => {
      appCamera.saveImageToAlbum({
        type: "url",
        imageData: this.shareParams.picUrls[0]
      });
      //   };
    },
    backPage() {
      this.$emit("hide");
    },
    formatImgUrl(url, key) {
      return new Promise((resolve, reject) => {
        this.$request
          .post("/app/json/home/getFileBase64", { filePath: url })
          .then(res => {
            if (res.status == 0) {
              if (res.data) {
                this[key] = `data:image/png;base64,${res.data || ""}`;
                resolve();
              } else {
                this.$Toast("getFileBase64 返回为空");
                reject();
              }
            } else {
              this.$Toast(res.info);
            }
          });
      });
    }
  }
};
</script>
<style>
.van-overlay {
  z-index: 999;
}
</style>

<style lang="stylus" scoped type="text/stylus">
  .poster-mask {
    position: fixed;
    top: 0;
    background: black;
    opacity: 0.6;
    width: 100%;
    height: 100vh;
    z-index 10;
  }

  .overlay-content {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background: #ffffff;
    border-radius: 6px;
    z-index: 11;

    .close-icon {
      position: absolute;
      top: -50px;
      left: 300px;
      width: 23px;
      height: 23px;
    }

    .main-poster {
      width: 300px;
      height: 300px;
    }

    .poster-user-message {
      display: flex;
      margin-left: 10px;
      margin-top: 20px;

      .user-image {
        width: 37.5px;
        height: 37.5px;
        border-radius: 50%;
      }

      .poster-user-right {
        margin-left: 10px;

        .poster-user-name {
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #3C3F43;
        }

        .poster-user-text {
          margin-top: 8px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;

        }
      }
    }

    .poster-product-message {
      margin-left: 10px;
      margin-bottom: 10px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;

      .poster-product-message-left {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        width: 65%;

        .poster-product-prize {
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #E0483F;
        }

        .poster-product-desc {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3C3F43;
          margin-top: 10px;
        }
      }

      .poster-product-message-right {
        text-align: center;
        width: 35%;

        .qrcode {
          width: 58px;
          height: 58px;
        }
      }
    }

    .overlay-content-bottom {
      width: 300px;
      height: 63px;
      background: #FFF1E5;
      border-radius: 0px 0px 10px 10px;

      .share-money {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #121212;
        padding: 10px 0;
        text-align: center;
      }

      .share-check {
        text-align: center;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .save-pic-text {
    padding: 10px 15px;
    .share-desc {
        font-size: 13px;
        margin-top 5px;
        line-height: 20px;

    }
  }

  .finger {
    display: flex;
    position: absolute;
    align-items: center;
    bottom: -50px;
    width: 300px;
    justify-content: center;

    .finger-image {
      width: 28px;
      height: 28px;
    }

    .finger-save-text {
      margin-left: 20px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .share-picture {
    display: flex;
    padding: 10px 10px 10px 0;
    height: 90px;
    // width: 250px;
    overflow: scroll;

    .share-image {
      flex: none;
      width: 85px;
      height: 85px;
      padding: 0 7px;
    }
  }

  .save-btn {
    margin: 15px auto;
    width: 86px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    background: #FF7900;
    border-radius: 10px;
    font-size: 13px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
  }

  .overlay-result {
    width: 256px;
    background: #FFFFFF;
    border-radius: 10px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    z-index: 11;

    .overlay-block {
      padding: 15px;
      text-align: center;
    }

    .result-line {
      width: 256px;
      height: 1px;
      background: #F6F5F5;
      margin: 10px 0;
    }

    .overlay-btn {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FF7900;
      text-align: center;
      padding-bottom: 10px;
    }

}
</style>
