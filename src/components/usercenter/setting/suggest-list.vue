/**Created by liaoyingchao on 2019-04-10.*/

<template>
  <div class="suggest-list">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll-div" v-if="isLoaded">
        <div class="suggest" v-for="item in opinions">
          <div class="header">
            <div class="user">
              <img :src="getHeadImg()">
            </div>
            <div class="header-info">
              <p class="user-name"> {{$store.state.userInfo.nickName ? $store.state.userInfo.nickName : $store.state.userInfo.phone}} </p>
              <p class="time theme_font_gray"> {{item.createTime}} </p>
            </div>
          </div>
          <div class="content">
            <div class="text theme_font_black">{{item.content}}</div>
            <div class="images-div" v-if="item.images.length > 0">
              <div class="img-div" v-for="(imgUrl, idx) in item.images">
                <div class="img">
                  <img :src="imgUrl" @click="openImages(item.images, idx)">
                </div>
              </div>
            </div>
          </div>
          <div class="replyContent" v-if="item.replyContent">
            <div class="text theme_font_black">回复：{{item.replyContent}}</div>
            <div class="images-div">
              <div class="img-div">
                <div class="img">
                  <img :src="item.replyPic" @click="openImages([item.replyPic], 0)">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-data" v-if="opinions.length == 0">
          暂无历史反馈
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { ImagePreview } from 'vant';

  Vue.use(ImagePreview);

  export default {
    name: "suggest-list",
    components: {},
    data() {
      return {
        opinions: [],
        isLoaded: false
      }
    },
    methods: {
      openImages: function (images, idx) {
        ImagePreview({
          images: images,
          startPosition: idx,
          onClose() {
            // do something
          }
        });
      },
      getHeadImg:function(){
        if(this.$store.state.userInfo.headImg && this.$store.state.userInfo.headImg.length){
          return this.$store.state.userInfo.headImg;
        }else {
          //女
          if (this.$store.state.userInfo.gender == '2') {
            return 'static/image/setting/setting-img.png';
          }else  {
            return 'static/image/setting/setting-img-man.png';
          }
        }
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      getSuggestList: function () {
        this.$Loading.open();
        let url = '/app/json/app_opinions/getOpinionsList';
        let paramsData = {
          token: this.$store.state.login.token,
        }

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.opinions = []
              let arr = data.data
              for (let i = 0; i < arr.length; i++) {
                let item = arr[i]
                let larr = []
                let str = item.picUrl
                if (str != '') {
                  let arr1 = str.split(',')
                  larr = arr1
                }
                item.images = larr
                this.opinions.push(item)
              }
              this.isLoaded = true;
            } else {
              this.$Toast(data.info ? data.info : '登录失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      }
    },
    created() {
      this.getSuggestList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .suggest-list {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      overflow-y auto;
      height 100%;
      background-color #efefef
      -webkit-overflow-scrolling touch;
      .suggest {
        margin-bottom 8px;
        background-color white;
        overflow hidden;
        .header {
          display flex;
          align-items center;
          padding 10px 20px;
          .user {
            overflow hidden;
            border-radius 20px;
            img {
              display block;
              width 40px;
              height 40px;
            }
          }
          .header-info {
            flex 1;
            padding-left 6px;
            .user-name {
              padding 4px;
              font-size 14px;
            }
            .time {
              padding 3px;
              font-size 12px;
            }
          }
        }
        .content {
          font-size 14px;
          padding 0 15px 8px;
          .text {
            line-height 18px;
          }
          .images-div {
            padding-top 8px;
            overflow hidden;
            .img-div {
              float left;
              position relative;
              height 0px;
              width 33%;
              padding-bottom: 33%;
              overflow hidden;
              .img {
                position absolute;
                left 3px;
                right 3px;
                top 3px;
                bottom 3px;
                background-color #fafafa
                img {
                  display block;
                  width 100%;
                  height 100%;
                }
              }
            }
          }
        }
        .replyContent {
          padding 0 15px 8px;
          font-size 12px;
          color #666;
          .images-div {
            padding-top 8px;
            overflow hidden;
            .img-div {
              float left;
              position relative;
              height 0px;
              width 50%;
              padding-bottom: 50%;
              overflow hidden;
              .img {
                position absolute;
                left 3px;
                right 3px;
                top 3px;
                bottom 3px;
                background-color #fafafa
                img {
                  display block;
                  width 100%;
                  height 100%;
                }
              }
            }
          }
        }
      }
      .no-data {
        padding 50px 20px;
        text-align center;
        font-size 12px;
        color #999;
      }
    }
  }
</style>
