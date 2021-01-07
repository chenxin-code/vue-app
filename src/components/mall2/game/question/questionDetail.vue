<template>
  <div id="body">
    <nav-top @backEvent="$router.go(-1)" title="问卷调查">
      <div @click="sharegoods" class="shareBox" v-if="!shareView">
        <div>
          <i class="icon iconfont mall-fenxiang"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="top" v-for="(item, index) in answerList" :key="index">
          <div class="singleList" v-if="item.kindId === 1">
            <span class="theme_bg_red">单选</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <van-radio-group v-model="item.result">
                <van-radio
                  disabled
                  v-for="(optionItem, index) in item.options"
                  :key="index"
                  :name="optionsObj[index]"
                >{{optionsObj[index]}} 、{{optionItem.lable}}</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="singleList multipleList" v-if="item.kindId === 2">
            <span class="theme_bg_red">多选</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <van-checkbox-group v-model="item.result">
                <van-checkbox
                  disabled
                  checked-color="#25aff8"
                  v-for="(optionItem, index) in item.options"
                  :key="index"
                  :name="optionsObj[index]"
                >{{optionsObj[index]}} 、{{optionItem.lable}}</van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 5">
            <span class="theme_bg_red">问答</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <textarea
                disabled
                class="textType"
                :maxlength="item.limitMax"
                v-model="item.result"
                style="min-height: 90px;"
              ></textarea>
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 7">
            <span class="theme_bg_red">文本</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <input disabled class="textType" :maxlength="item.limitMax" v-model="item.result" />
            </div>
          </div>
          <div class="singleList score" v-if="item.kindId === 6">
            <span class="theme_bg_red">打分</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <div class="evaluteBox">
                <van-rate
                  v-if="item.styleType === 1"
                  v-model="item.result"
                  void-color="#c7c7c7"
                  disabled-color="#25aff8"
                  disabled
                />
                <van-rate
                  v-if="item.styleType === 2"
                  v-model="item.result"
                  void-color="#c7c7c7"
                  icon="like"
                  disabled-color="#25aff8"
                  void-icon="like-o"
                  disabled
                />
                <van-rate
                  v-if="item.styleType === 3"
                  v-model="item.result"
                  void-color="#c7c7c7"
                  icon="static/image/microShop/xiaoicon.png"
                  disabled-color="#25aff8"
                  void-icon="smile-o"
                  disabled
                />
                <p>{{item.evaluate}}</p>
              </div>
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 4">
            <span class="theme_bg_red">下拉</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <div class="xiala">
                <span>{{item.result || '请选择'}}</span>
                <span class="icon iconfont mall-xiala"></span>
              </div>
              <van-action-sheet
                v-model="item.show"
                :actions="item.options"
                @select="onSelect($event,item)"
              />
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 3">
            <span class="theme_bg_red">图片</span>
            <div class="divObj">
              <div class="titleHead">
                <span>{{index+1}}、</span>
                <span v-html="item.title"></span>
              </div>
              <div class="pics" v-for="(optionItem, index) in item.options" :key="index">
                <div>
                  <span>{{optionsObj[index]}}、</span>
                  <img :src="optionItem.imgUrl" alt />
                </div>
                <div>
                  <van-radio-group v-model="item.result">
                    <van-radio
                      checked-color="#25aff8"
                      :name="optionsObj[index]"
                      disabled
                    >{{optionItem.lable}}</van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
import api from "./api";
import { mapGetters } from "vuex";
import rule from "@/components/mall2/game/question/rule";
import { Toast } from "vant";
import { Dialog } from "vant";
import Config from "@/api/config";
export default {
  name: "",
  mixins: [api],
  data() {
    return {
      answerList: [],
      i: 0,
      optionsObj: {},
      paramsData: {},
      radio: "B",
      list: ["a", "b", "c", "d"],
      result: ["a", "b"],
      value: 3,
      show: false,
      actions: [],
      mktAwardList: [],
      id: "",
      url: "",
      evaluate: "",
      shareView: true,
      shareTitle: "",
      shareContent: "",
      shareImgUrl: ""
    };
  },
  created() {
    let that = this;
    that.getLetter();
    that.paramsData = that.$route.query;
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      let that = this;
      let params1 = {
        id: that.paramsData.id,
        token: this.$store.state.login.token,
        orderId: that.paramsData.orderId
      };
      that.historydetailData(params1).then(res => {
        if (res.data.result === "success") {
          let answerList = JSON.parse(res.data.data.resultJson)
          console.log(JSON.parse(JSON.stringify(answerList)))
          answerList.forEach(function(item) {
            //打分题后面添加评价
            item.evaluate = "";
          });
          that.userId = res.data.data.userId;
          let ifShare = res.data.data.questionShare
            ? JSON.parse(res.data.data.questionShare)
            : "";
          if (ifShare.length == 0) {
            //判断是否可以分享
            that.shareView = false;
          } else {
            that.shareView = true;
          }
          answerList.forEach(function(item, index) {
            if (
              item.kindId === 1 ||
              item.kindId === 2 ||
              item.kindId === 3 ||
              item.kindId === 4
            ) {
              let list = JSON.parse(item.options) || [];
              list.forEach(function(itemOption) {
                itemOption.name = itemOption.lable;
              });
              item.options = list;
            }
            if (item.kindId === 2) {
              item.result = item.result.split(",");
            } else if (item.kindId === 6) {
              item.result = Number(item.result) || 0;
              if (item.result == 1) {
                item.evaluate = "非常差";
              } else if (item.result == 2) {
                item.evaluate = "差";
              } else if (item.result == 3) {
                item.evaluate = "一般";
              } else if (item.result == 4) {
                item.evaluate = "好";
              } else if (item.result == 5) {
                item.evaluate = "非常好";
              }
            } else {
              // item.result = "";
              if (item.kindId === 4) {
                item.show = false;
              }
            }
          });
          that.answerList = answerList;
          //分享
          that.shareTitle = res.data.data.shareTitle;
          that.shareContent = res.data.data.shareContent;
          that.shareImgUrl = res.data.data.shareImgUrl;
        } else {
        }
      });
    },
    select1(item) {
      item.show = true;
    },
    generateBig_1() {
      //获取26个大写字母
      var str = [];
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i));
      }
      return str;
    },
    getLetter() {
      this.optionsObj = this.generateBig_1();
    },
    onSelect(event, item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      item.result = event.name;
      item.show = false;
    },
    sharegoods: function() {
      //分享
      let that = this;
      let shareData = {
        title: that.shareTitle,
        sharetext: that.shareContent,
        imageurl: that.shareImgUrl,
        detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/questionDetail?shareUserid=${this.$store.state.userInfo.userId}&id=${that.paramsData.id}&orderId=${that.paramsData.orderId}`
      };
      this.$bridgefunc.wechatShare(shareData);
    },
    Intercept() {
      let url = this.url || window.location.href;
      let _url = url.substr(url.indexOf("?"));
      let GETs = _url.slice(1).split("=");
      this.id = GETs[1];
    }
  },
  computed: {},
  components: {},
  watch: {}
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
#body {
  .evaluteBox {
    display: flex;
    justify-content: start;

    p {
      margin: auto 15px;
      color: #807d7d;
    }
  }

  >>> .van-radio__label--disabled {
    color: #323233;
  }

  >>> .van-radio__label--disabled {
    color: #323233;
  }

  >>> .van-radio__icon--checked .van-icon {
    // /* color: #e5e5e5; */
    background: #25aff8;
  }

  >>> .van-radio__icon--disabled.van-radio__icon--checked .van-icon {
    color: white;
  }

  >>> .van-checkbox__icon--checked .van-icon-success {
    background: #25aff8;
    color: white;
  }

  >>> .van-checkbox__icon--disabled .van-icon {
    border-color: white;
  }

  >>> .van-radio__icon--disabled .van-icon {
    border-color: white;
  }

  .shareBox {
    float: right;
    display: flex;
    margin-right: 10px;
    justify-content: space-around;
    position: relative;
    z-index: 10;
    padding: 0 15px;

    .name {
      margin-right: 10px;
      font-size: 14px;
    }
  }

  .nav-top {
    position: fixed;
  }

  >>> .nav-content {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    overflow: auto;
    margin-bottom: 70px;

    .content {
      width: 96%;
      margin: 0 auto;

      .top {
        .singleList {
          font-size: 16px;
          display: flex;
          justify-content: flex-start;
          margin-bottom: 15px;

          .theme_bg_red {
            color: white;
            height: 26px;
            width: 13%;
            text-align: center;
            line-height: 26px;
            display: inline-block;
            /* border-radius: 5px; */
            margin-right: 12px;
            font-size: 12px;
            border-bottom-right-radius: 8px;
            border-top-right-radius: px;
            border-top-left-radius: 11px;
            background-color: #25aff8;
          }

          .divObj {
            width: 87%;

            .titleHead {
              display: flex;
              justify-content: flex-start;
            }

            span {
              line-height: 24px;
              display: inline-block;
              color: #323233;
            }

            .van-radio {
              margin: 15px 0;
            }

            .van-checkbox {
              margin: 15px 0;
            }

            .van-rate {
              margin: 15px 0;
            }

            .textType {
              /* text-indent: 2em; */
              line-height: 24px;
              padding: 10px;
              margin: 15px 0;
              border: 0;
              background: #efefef;
              border-radius: 8px;
              width: 90%;
            }

            .xiala {
              width: 50%;
              height: 30px;
              border: 0.5px solid #b9b9b5;
              margin-top: 15px;
              display: flex;
              justify-content: space-around;

              span {
                vertical-align: middle;
              }
            }

            .pics {
              margin-top: 15px;
              width: 100px;

              img {
                width: 100%;
                height: 100%;
                margin-bottom: 15px;
                display: block;
              }

              div {
                display: flex;
                justify-content: space-around;

                input {
                  display: block;
                  margin: 5px auto 0 auto;
                }
              }
            }
          }
        }
      }

      .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        font-size: 18px;
      }
    }
  }
}

.van-field .van-cell__title {
  display: none;
}

.van-popup {
  width: 80%;
  margin: 0 auto;
  top: 40%;
  overflow-y: hidden;
  border-radius: 6px;

  .btns {
    width: 100%;
    display: flex;
    justify-content: space-between;

    span {
      display: inline-block;
      width: 50%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
    }

    span:nth-child(2) {
      color: white;

      a {
        color: white;
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-align: center;
      }
    }
  }

  .modal {
    width: 90%;
    margin: 0 auto;

    .title-p {
      width: 60%;
      margin: 30px auto 20px auto;
      text-align: center;
      font-size: 16px;
      line-height: 26px;
    }

    ul {
      li {
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #dddfdf;
        display: flex;
        justify-content: space-around;
        font-size: 14px;

        img {
          margin-right: 24px;
          vertical-align: middle;
        }
      }

      li:last-child {
        border-bottom: 1px solid #dddfdf;
      }
    }
  }
}

>>> .van-icon-checked {
  // /* color: #e5e5e5; */
  color: #25aff8;
}

>>> .van-checkbox__icon--checked .van-icon-success {
  background: #25aff8;
  color: white;
}
</style>
