<template>
  <div>
    <div class="poster-mask"></div>
    <!-- <van-overlay :show="true"> -->
    <div class="share-main" style="height: 100vh">
      <div
        class="overlay-content"
        v-if="!showResult && !isPoster"
        style="background: #ffffff"
      >
        <img src="./image/guanbi@2x.png" class="close-icon" @click="backPage" />
        <div class="save-pic-text">
          <div class="share-desc">
            <div v-show="!isEditor" style="width: 90%;">
              {{ shareParams.skuName }}
            </div>

            <!-- <van-cell-group style="width: 80%;border: red solid 1px;"> -->
            <van-field
              v-model="shareParams.skuName"
              placeholder=""
              autosize
              type="textarea"
              v-show="isEditor"
              style="width: 90%;"
            />
            <!-- </van-cell-group> -->

            <div @click="isEditor = !isEditor">
              <img
                src="./image/editor.png"
                alt=""
                v-show="!isEditor"
                class="share-editor"
              />
              <div v-show="isEditor">完成</div>
            </div>
          </div>
          <div style="margin: 10px 0 0 1px;">
            【零售价格】: ¥ {{ shareParams.salePrice }}
          </div>
          <div class="share-desc" style="word-break: break-all;">
            【购买链接】: {{ shareParams.link }}
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
        <div class="overlay-content-bottom" v-if="shareParams.estimatedCommission" style="background: #fff1e5;">
          <div class="share-money" @click="savePoster">
            分享后预计可赚 ¥{{ shareParams.estimatedCommission }}
          </div>
          <div class="share-check">佣金可在“分销员中心”里查看</div>
        </div>
      </div>

      <div
        class="overlay-content"
        v-if="!showResult && isPoster"
        :style="
          !isCanvas
            ? ''
            : ''
        "
      >
        <div style="width: 100%;">
          <img
            src="./image/guanbi@2x.png"
            class="close-icon"
            @click="backPage"
            v-if="isCanvas"
          />
        </div>

        <div
          class="default-share-poster"
          ref="poster"
          @click="saveIOS"
          v-if="!isShowPoster && !isCanvas"
          :style="shareParams.estimatedCommission ? '' : { height: '13rem' }"
        >
          <div class="default-poster-header">
            <img
              :src="proUserUrl"
              class="default-poster-header-userImage"
              v-if="proUserUrl"
            />
            <img
              src="./image/default-image.jpeg"
              class="default-poster-header-userImage"
              v-else
            />

            <div class="default-poster-header-right">
              <div class="default-poster-header-right-name">
                {{ shareParams.userName }}
              </div>
              <div class="default-poster-header-right-desc">
                为你挑选了一个好物
              </div>
            </div>
          </div>

          <img src="./image/sanjiaoxing.png" alt="" class="sanjiaoxing-logo" />

          <div class="default-main-poster">
            <img :src="proImgUrl" alt="" class="prouct-main-pic" />

            <div class="default-poster-prize-sale">
              <span class="money-symbol">￥</span>
              <span
                style="font-weight: bold;font-size: 30px;margin-left: 5px;"
                >{{ shareParams.salePrice }}</span
              >
            </div>

            <div class="default-poster-bottom">
              <div
                class="default-poster-bottom-text"
                v-if="shareParams.skuName && shareParams.skuName.length < 17"
              >
                {{ shareParams.skuName }}
              </div>
              <div class="default-poster-bottom-text" v-else>
                {{ shareParams.skuName.substr(0, 16) }}...
              </div>
              <img
                :src="shareParams.qrCode"
                alt=""
                class="default-poster-qrcode"
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
        <div
          class="overlay-content-bottom poster-bottom-span"
          v-if="shareParams.estimatedCommission && isCanvas"
        >
          <div class="poster-bottom-desc">
            <div class="share-money">
              分享后预计可赚 ¥{{ shareParams.estimatedCommission }}
            </div>
            <div class="share-check">佣金可在“分销员中心”里查看</div>
          </div>
        </div>
        <div class="finger" ref="fingerSave" v-if="isCanvas">
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

      <!-- <div class="poster-content" v-if="isCanvas">
        <van-loading size="48px" vertical style="padding: 40px">海报生成中...</van-loading>
      </div> -->
    </div>
    <!-- </van-overlay> -->
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import appCamera from "@zkty-team/x-engine-module-camera";
import html2canvas from "html2canvas";
import { Toast } from "vant";

export default {
  props: {
    shareParams: {
      type: Object
    }
  },
  data() {
    return {
      isEditor: false,
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
  async mounted() {
    // this.shareParams.estimatedCommission = 10;
    //  await this.formatImgUrl(this.shareParams.picUrls[0], "proImgUrl");
    //   await this.formatImgUrl(this.shareParams.userImage, "proUserUrl");
    if (this.isPoster) {
      if (/data:image/.test(this.shareParams.picUrls[0])) {
        this.proImgUrl = this.shareParams.picUrls[0];
      } else {
        await this.formatImgUrl(this.shareParams.picUrls[0], "proImgUrl");
      }

      if (/data:image/.test(this.shareParams.userImage)) {
        this.proUserUrl = this.shareParams.userImage;
      } else {
        await this.formatImgUrl(this.shareParams.userImage, "proUserUrl");
      }
      console.log('this.$refs.poster.clientHeight', this.$refs.poster.clientHeight);
      Toast.loading({
        message: "正在生成海报中...",
        duration: "toast",
        forbidClick: true
      });
      setTimeout(() => {
        try {
          html2canvas(this.$refs.poster, {
            // height: this.$refs.poster.clientHeight - 4,
            // width: this.$refs.poster.clientWidth - 4
            dpi: window.devicePixelRatio * 2,
            scale: 2
          }).then(canvas => {
            this.canvasData = canvas.toDataURL("image/png");
            this.isCanvas = true;
            console.log("---->canvasData", this.canvasData);
            Toast.clear();
            window.saveImageToAlbum = () => {
              appCamera.saveImageToAlbum({
                type: "base64",
                imageData: this.canvasData
              });
            };
          });
        } catch (err) {
          Toast.clear();
          Toast("生成海报失败，请重试！");
        }
      }, 500);
    }
  },
  methods: {
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

<style lang="less" scoped>
.poster-mask {
  position: fixed;
  top: 0;
  background: black;
  opacity: 0.6;
  width: 100%;
  height: 100vh;
  z-index: 10;
}
.share-main {
  position: fixed;
  top: 0;
  z-index: 11;
  // left: 50%;
  // transform: translateX(-50%);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  z-index: 11;
}

.overlay-content {
  position: relative;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  width: 300px;
  // background: #ffffff;
  border-radius: 6px;
  z-index: 11;
  .close-item {
    width: 100%;
    padding-bottom: 10px;
    margin-left: 15px;
    text-align: right;
  }
  .close-icon {
    position: absolute;
    top: -0.8rem;
    left: 8rem;
    width: 23px;
    height: 23px;
  }
  .default-share-poster {
    background-image: url("./image/poster_bg.png");
    background-repeat: no-repeat;
    background-size: 375px 667px;
    width: 100%;
    height: 520px;
    padding: 15px;
    position: relative;
    left: 5000px;
    // border-top-left-radius 15px
    // border-top-right-radius 15px
    margin-top: -15px;
    .default-poster-header {
      display: flex;
      .default-poster-header-userImage {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .default-poster-header-right {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .default-poster-header-right-name {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #ffffff;
        }
        .default-poster-header-right-desc {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #ffffff;
          opacity: 0.7;
          margin-top: 15px;
        }
      }
    }
    .sanjiaoxing-logo {
      width: 15px;
      height: 10px;
      margin-left: 20px;
      margin-top: 8px;
      margin-bottom: -6px;
    }
    .default-main-poster {
      width: 260px;
      background: #ffffff;
      border-radius: 12px;
      margin: auto;
      .prouct-main-pic {
        width: 230px;
        height: 230px;
        border-radius: 6px;
        margin: 15px;
      }
      .default-poster-prize-sale {
        // display: flex;
        // justify-content: space-space-between;
        color: #e5165a;
        .money-symbol {
          font-size: 16px;
          margin-left: 15px;
        }
      }
      .default-poster-bottom {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
        padding-bottom: 15px;
        .default-poster-bottom-text {
          // margin-left: 17px;
          // width: 180px;
          // font-size: 18px;
          // font-family: PingFang SC;
          // font-weight: bold;
          // color: #333333;
          // line-height: 22px;

          margin-left: 17px;
          width: 160px;
          font-size: 18px;
          font-family: PingFang SC;
          // font-weight: bold;
          color: #333333;
          line-height: 25px;
        }
        .default-poster-qrcode {
          width: 60px;
          height: 60px;
          margin-right: 17px;
        }
      }
    }
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
        color: #3c3f43;
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
        color: #e0483f;
      }

      .poster-product-desc {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3c3f43;
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

  .poster-bottom-span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 15px;
    background: url("./image/poster_bottom.png");
    .poster-bottom-desc {
      background: rgb(255, 241, 229);
      width: 260px;
      margin: 0 auto;
      border-radius: 0 0 12px 12px;
    }
  }
  .overlay-content-bottom {
    // width: 260px;
    // height: 90px;
    // background: #fff1e5;
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
      padding-bottom: 5px;
    }
  }
}

.save-pic-text {
  padding: 10px 15px;
  .share-desc {
    font-size: 13px;
    margin-top: 5px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    .share-editor {
      width: 15px;
      height: 15px;
    }
  }
}

.finger {
  display: flex;
  position: absolute;
  align-items: center;
  width: 300px;
  justify-content: center;
  z-index: 8;
  margin-top: 10px;

  .finger-image {
    width: 28px;
    height: 28px;
  }

  .finger-save-text {
    margin-left: 20px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
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
  background: #ff7900;
  border-radius: 10px;
  font-size: 13px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}

.overlay-result {
  width: 256px;
  background: #ffffff;
  border-radius: 10px;
  // position: relative;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
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
    background: #f6f5f5;
    margin: 10px 0;
  }

  .overlay-btn {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ff7900;
    text-align: center;
    padding-bottom: 10px;
  }
}
</style>
