<template>
  <div class="judgement" v-if="pageShow">
    <div class="options">
      <div class="name theme_font_common theme_bg_white_ef"
           v-for="(el,idx) in commentTabs" @click="clickItem(el,idx)"
           :class="{'border-con  theme_bg_ml_red_i theme_font_red_i':el.selected}">{{el.typeName}}（{{el.count}}）
      </div>
    </div>
    <div class="tip" v-if="comments.length == 0">
      <img src="static/image/mall2/noComment.png"/>
    </div>
    <div class="scroll-con">
      <div class="judgementcell shadow-cell" v-for="(item,index) in comments">
        <div class="mem-info ">
          <div class="left-info">
            <img class="image-con" :src="item.userAvtUrl != '' ? item.userAvtUrl : 'static/image/mall2/header.png'"/>
            <p class="nickname-con theme_font_black">{{getCommentUserStr(item)}}</p>
            <i class="levelimage iconfont mall-huangguan theme_font_red"></i>
            <p class="level-con theme_font_red">{{item.userLevelNo}}</p>
          </div>
          <div class="right-star">
            <i class="levelimage iconfont mall-xingxing theme_font_tint" v-for="index in 5"
               :class="{'theme_font_red':item.score >= index}"></i>
          </div>
        </div>
        <P class="remark-con theme_font_gray">{{item.evaluateContent}}</P>
        <div class="imgs" v-if="item.evaluateImages != ''">
          <div class="s-img-div" v-for="(pic, idx) in getCommentImgs(item.evaluateImages)" @click="showBigImageEvent(item.evaluateImages)">
            <img :src="pic">
          </div>
        </div>
        <div class="reply" v-if="item.evaluateReply != ''">
          <div class="theme_font_common" style="line-height: 1.4;">商家回复：</div>
          <div class="theme_font_common" style="line-height: 1.4; flex: 1;">{{item.evaluateReply}}</div>
        </div>
        <div class="date-con theme_font_gray">
          <p class="left-con">评价日期：{{item.evaluateTime}}</p>
          <div class="like" @click="likeEvent(item)">
            <span>{{item.thumbsUpCount}}</span>
            <i class="levelimage iconfont mall-dianzan theme_font_tint" :class="{'theme_font_red_i': item.hasThumbsUp == 1}"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'judgement',
    props: ['skuId'],
    components: {
    },
    data() {
      return {
        pageShow: false,
        comments: [],
        commentTabs: [],
      }
    },
    methods: {
      showBigImageEvent: function (imgsStr) {
        let picUrls = this.getCommentImgs(imgsStr)
        this.$emit('showBigImgs', picUrls)
      },
      getCommentImgs: function (imgsStr) {
        if (imgsStr != '') {
          return imgsStr.split(',')
        }
        return []
      },
      getCommentUserStr: function (comment) {
        if (comment.userName != '') {
          return comment.userName;
        }
        let phone = comment.userPhone + ''
        if (phone.length == 11) {
          let a=phone.split('')
          a.splice(1,9,'*********')
          return a.join('')
        }
        return '未知用户'
      },
      clickItem: function (el, idx) {
        let arr = []
        for (let i = 0; i < this.commentTabs.length; i++) {
          let item = this.commentTabs[i]
          if (idx == i) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          arr.push(item)
        }
        this.commentTabs = arr;
        this._getComments(el.type)
      },
      // 点赞
      likeEvent: function (item) {
        let url = '/app/json/evaluate/userThumbsUpSkuEvaluate';
        let paramsData = {
          token: this.$store.state.login.token,
          id: item.id,
          hasThumbsUp: item.hasThumbsUp
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              if (item.hasThumbsUp == 1) {
                item.hasThumbsUp = 0
                item.thumbsUpCount -= 1;
              } else {
                item.hasThumbsUp = 1
                item.thumbsUpCount += 1;
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 获取评价列表
      _getComments: function (scoretype) {
        let url = '/app/json/evaluate/loadSkuDetailTwoEvaluateList';
        let paramsData = {
          token: this.$store.state.login.token,
          scoreType: scoretype,
          skuId: this.skuId
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.pageShow = true
              this.comments = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      // 获取评价标签
      _getCommentTabs: function (scoretype) {
        let url = '/app/json/evaluate/loadSkuEvaluateCount';
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: this.skuId
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.commentTabs = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
    },
    created() {
      this._getComments('')
      this._getCommentTabs();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .judgement {
    overflow hidden
    .tip {
      margin-top 50px;
      font-size 30px;
      text-align center;
      img {
        width 40%;
      }
    }
    .options {
      padding 0 10px 10px
      /*height 185px*/
      .name {
        text-align center
        display inline-block
        /*width 22.5%*/
        padding 6px 15px
        margin-top 10px
        margin-right 10px
        border-radius: 15px;
        -webkit-border-radius: 15px;
        font-size $font-size-medium
        border-style: solid;
        border-width: 0.5px
        border-color transparent
      }
      .border-con {
        border: 1px solid #F80F16
      }
    }
    .scroll-con {
      overflow hidden;
      .judgementcell {
        /*background-color #9fa0a0*/
        padding 10px
        .mem-info {
          display flex
          align-items center
          .left-info {
            flex 1
            display flex
            align-items center
            .image-con {
              width 20px
              height 20px
              border-radius: 15px;
              -webkit-border-radius: 15px;
              /*background-color magenta*/
            }

            .nickname-con {
              margin-left 10px
              font-size $font-size-medium-x
            }
            .levelimage {
              margin-left 15px
              font-size 15px;
            }
            .level-con {
              margin-left 5px
              font-size $font-size-small
            }
          }
          .right-star {
            i {
              font-size $font-size-medium-s
            }
          }

        }
        .remark-con {
          font-size $font-size-medium-s
          margin-top 8px
          line-height 18px
          overflow: hidden;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
        .reply {
          padding-top 8px
          font-size $font-size-medium-s;
          display flex;
          align-items flex-start
        }
        .imgs {
          overflow hidden;
          padding-top 8px
          font-size $font-size-medium;
          .s-img-div {
            margin-right 2%
            float left;
            position relative;
            width 32%
            height 0px;
            padding-bottom 32%;
            overflow hidden;
            img {
              position absolute;
              left 0
              top 0
              width 100%;
              height 100%;
              overflow hidden;
            }
          }
          .s-img-div:nth-child(3n) {
            margin-right 0
          }
          .s-img-div:nth-child(n+4) {
            margin-top 7px;
          }
        }
        .date-con {
          margin-top 8px
          font-size $font-size-small-s
          display flex
          align-items center
          .left-con {
            flex 1
          }
          .like {
            font-size $font-size-small-s
            i {
              font-size 18px;
            }
          }
        }
      }
    }
  }

</style>
