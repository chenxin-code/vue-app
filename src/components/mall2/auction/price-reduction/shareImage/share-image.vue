<template>
  <div v-if="visible">
    <van-popup style="height: 70%;" v-model="visible" position="bottom">
      <!--  弹框-->
      <div class="share-image">
        <div class="share-image-title" @click="visible = false">
          <div class="text">保存到相册</div>
          <div class="close">
            <van-icon name="cross" color="#898989"/>
          </div>
        </div>
        <div class="content">
          <div class="img">
            <img v-if="imgUrl" :style="{width: picWidth}" ref="pic" @load="loadPic" :src="imgUrl" alt="">
            <div v-else class="loading-wrapper">
              <van-loading type="spinner" class="loading"/>
              <span class="text">图片生成中...</span>
            </div>
          </div>
          <button class="keep-btn">长按图片保存到手机</button>
          <div class="tips">保存图片到手机相册后，将图片分享到您的圈子</div>
        </div>
      </div>
    </van-popup>
    <!--  页面-->
    <div class="share-content" ref="shareContent" id="shareContent">
      <div class="top">{{$store.state.globalConfig.mpName}}</div>
      <div class="share-image-content">
        <div class="title">{{proData.showTitle}}</div>
        <div class="price">￥<span class="num">{{proData.activityPrice}}&nbsp;&nbsp;<span class="sale-price">￥{{proData.salePrice}}<p class="line-t"></p></span></span></div>
        <div class="pro-img">
          <img :src="proData.phMainUrl" @load="loadImage" alt="">
        </div>
        <div class="qrcode">
          <div class="img">
            <img :src="qrcode" alt="">
          </div>
          <div class="text">
            <div class="top-title">{{$store.state.globalConfig.mpName}}</div>
            <div class="bottom-tips">长按识别•去逛逛</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import {Loading, Toast} from 'vant';
  import Config from '@/api/config'
  import wxfunc from '@/utils/wxfunc'
  export default {
    name: 'wxShareImage',
    data() {
      return {
        visible: false,
        proData: {},
        imgUrl: '',
        qrcode: '',
        picWidth: 0
      }
    },
    props: {},
    mounted() {
    },
    methods: {
      loadImage() {
        console.log('load')
        let that = this
        this.getCode().then(() => {
          setTimeout(() => {
            let _canvas = document.querySelector('.share-content');
            console.log(_canvas)
            let w = parseInt(window.getComputedStyle(_canvas).width);
            let h = parseInt(window.getComputedStyle(_canvas).height);
            let canvas = document.createElement("canvas");
            let scale = 1;
            canvas.width = w * scale;
            canvas.height = h * scale;
            canvas.getContext("2d").scale(scale, scale);
            html2canvas(that.$refs.shareContent, {
              useCORS: true,
              // scale: 1,
              canvas: canvas
            }).then(canvas => {
              that.imgUrl = canvas.toDataURL()
            })
          }, 20)
        })
      },
      saveImage() {
        const base64DArr = this.imgUrl.split(',')[1]
        let that = this
        this.$request.post('/app/json/we_chat/uploadTemporaryWxFile', {
          mediaType: 'image',
          mediaBase64: base64DArr,
          fileName: '1',
          fileType: 'png'
        }).then(res => {
          if (res.status === 0) {
            // Toast("上传成功！");
            wxfunc.getWechatSignature((isSignature) => {
              //签名成功
              if (isSignature) {
                wx.downloadImage({
                  serverId: res.data.mediaId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                    Toast("保存成功！");
                  }
                })
              } else {
                Toast('签名失败');
              }
            })
          } else {
            Toast("保存失败！");
          }
        }).catch(err => {
          Toast(err || '上传失败');
        })
        // this.$bridgefunc.savePhoto(base64DArr, result => {
        //   if (result == "1") {
        //     this.visible = false;
        //     this.$Toast("保存成功！");
        //   } else {
        //     this.$Toast("保存失败！");
        //   }
        // });
      },
      getCode: function () {
        return new Promise((resolve, reject) => {
          let rfrCode = this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
          this.$request.post('/app/json/short_address/makeShortAddress', {
            longAddress: `${window.location.href}`
          }).then(res => {
            if (res.status === 0) {
              this.$request.post('/app/json/we_chat/getwxacode', {
                path: `/pages/index/main?path=${encodeURIComponent(res.data)}&userId=${rfrCode}`,
                width: 430
              }).then(res => {
                if (res.status === 0) {
                  this.qrcode = 'data:image/png;base64,' + res.data
                  const img = new Image()
                  img.src = this.qrcode
                  img.onload = () => {
                    resolve()
                  }
                } else {
                  reject()
                  this.$Toast(res.info || '获取小程序码失败')
                }
              }, error => {
              })
            }

          })
        })
      },
      loadPic() {
        this.picWidth = this.$refs.pic.clientHeight / this.$refs.pic.naturalHeight * this.$refs.pic.naturalWidth + 'px'
        console.log('load')
      }
    },
    components: {
      [Loading.name]: Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .share-image {
    position relative
    display flex
    flex-direction column
    height 100%

    .share-image-title {
      background $color-background-lll
      display flex
      justify-content space-between
      align-items center
      padding: 10px 15px
    }

    .content {
      padding: 20px 10px
      text-align center
      display flex
      flex-direction column
      flex 1
      .img {
        flex 1;
        display flex
        justify-content center
        align-items center
        img {
          height 100%
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        }
      }

      .loading-wrapper {
        text-align: center

        .loading {
          display inline-block
        }

        .text {
          color #999
        }
      }

      .keep-btn {
        border-radius 4px
        background #fff
        color: $color-theme-r
        padding: 10px 15px
        font-size: 14px
        margin-top: 5px
        -webkit-appearance: none;
        border: none;
        &[disabled] {
          opacity 0.6
        }
      }

      .tips {
        color: $color-text-d
      }
    }
  }

  .share-content {
    width: 100%
    height: 100%
    background: #fff
    position fixed
    top: 0;
    z-index: 100000;
    display flex
    flex-direction column
    left -1000%

    .top {
      background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAABQCAIAAADJIGexAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGaGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDgtMDJUMDk6NDA6MzUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA4LTAyVDExOjAwOjE2KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA4LTAyVDExOjAwOjE2KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmE1NjMxNmU3LWJkYTktNDk0Ni04MmM2LWY2NjdiYWY4MDIyZCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmU0ZmY3NjhkLWU0MDUtMGE0Yy1iMTZiLTJhZDRlOTUzZTBmOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQ3ZmU0MWQ4LWQxZjctNDI5NS04Y2I5LTNiYjRjMjZmZWJmNyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDdmZTQxZDgtZDFmNy00Mjk1LThjYjktM2JiNGMyNmZlYmY3IiBzdEV2dDp3aGVuPSIyMDE5LTA4LTAyVDA5OjQwOjM1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNTYzMTZlNy1iZGE5LTQ5NDYtODJjNi1mNjY3YmFmODAyMmQiIHN0RXZ0OndoZW49IjIwMTktMDgtMDJUMTE6MDA6MTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuNo3+MAAAtnSURBVHic7d3/dto2GMbxR7aBpM3atdut7f5vYlu7LUT7IwFs6dUPG2wwfD+n5wRkWZgkrZ++krHzf/yhDJfbmNxh7F6j+hc6u+DrZV7a7uYq+pzTIdohP0Lt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") no-repeat
      background-size 100% 100%
      padding: 15px 0 30px 0
      text-align center
      color: #fff
    }

    .share-image-content {
      flex 1
      padding: 15px
      border-top-left-radius 15px
      border-top-right-radius 15px
      background #fff
      display flex
      flex-direction column
      margin-top: -15px;

      .title {
        font-size: 18px
        line-height 24px
      }

      .price {
        color: $color-theme-r
        padding: 10px 0
        display: flex
        align-items center

        .num {
          font-size: 28px
        }
        .sale-price {
          color: $color-text-d
          font-size: 12px
          position relative
          display inline-block
          .line-t{
            position: absolute;
            top: 50%;
            width: 100%;
            background-color: #666;
            height: 1px;
          }
        }
      }

      .pro-img {
        flex 1
        text-align center
        padding: 25px 10px
        display flex
        justify-content center
        align-items: center
        img {
          width  90%
        }
      }

      .qrcode {
        padding: 10px 0
        display flex
        justify-content center
        align-items center

        .img {
          padding-right: 15px

          img {
            width: 120px
          }
        }

        .text {
          line-height 28px

          .top-title {
            font-size: 18px
            font-weight bold
          }

          .bottom-tips {
            color: $color-text-d
          }
        }
      }
    }
  }
</style>
