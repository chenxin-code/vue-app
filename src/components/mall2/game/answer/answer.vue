<template>
  <div id="body">
    <nav-top @backEvent="backEvent" title="每日答题">
      <div class="shareBox" v-if="shareView">
        <div @click="sharegoods">
          <i class="icon iconfont mall-fenxiang"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="box">
          <!--<div class="top" v-for="(item,index) in answerList" :key="index">-->
          <div class="top">
            <div class="singleList" v-if="listItem.kindId === 1">
              <span class="theme_bg_red">单选</span>
              <div class="divObj">
                <span>{{listItem.orderNo}}、{{listItem.title}}</span>
                <van-radio-group v-model="listItem.result">
                  <van-radio :disabled="prohibit" checked-color="#F80F16"
                             v-for="(optionItem, index) in listItem.options" :key="index"
                             :name="optionsObj[index]">
                    {{optionsObj[index]}} 、{{optionItem.lable}}
                    <span class="correct" v-if="optionItem.rightResult === true && flag === true">正确答案</span><span
                    v-if="optionItem.rightResult === false && flag === true && listItem.result === optionItem.code"
                    class="wrong theme_font_red">回答错误</span>
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="singleList multipleList" v-if="listItem.kindId === 2">
              <span class="theme_bg_red">多选</span>
              <div class="divObj">
                <span>{{listItem.orderNo}}、{{listItem.title}}</span>
                <van-checkbox-group v-model="listItem.result">
                  <van-checkbox checked-color="#F80F16" v-for="(optionItem, index) in listItem.options" :key="index"
                                :name="optionsObj[index]">
                    {{optionsObj[index]}} 、{{optionItem.lable}}
                    <span class="correct" v-if="optionItem.rightResult === true && flag === true">正确答案</span><span
                    v-if="optionItem.rightResult === false && flag === true && listItem.result.indexOf(optionItem.code) >-1 "
                    class="wrong theme_font_red" style="margin-left: 15px">回答错误</span>
                  </van-checkbox>
                </van-checkbox-group>
              </div>
            </div>
            <div class="singleList" v-if="listItem.kindId === 5">
              <span class="theme_bg_red">问答</span>
              <div class="divObj">
                <span>{{listItem.orderNo}}、{{listItem.title}}</span>
                <textarea class="textType" :maxlength="listItem.limitMax" v-model="listItem.result"
                          style="min-height: 90px;"></textarea>
              </div>
            </div>
            <div class="singleList score" v-if="listItem.kindId === 6">
              <span class="theme_bg_red">打分</span>
              <div class="divObj">
                <span>{{listItem.orderNo}}、{{listItem.title}}</span>
                <van-rate
                  v-if="listItem.styleType === 1"
                  v-model="listItem.result"
                  color="#F80F16"
                  void-color="#F80F16"
                />
                <van-rate
                  v-if="listItem.styleType === 2"
                  v-model="listItem.result"
                  color="#F80F16"
                  icon="like"
                  void-color="#F80F16"
                  void-icon="like-o"
                />
                <van-rate
                  v-if="listItem.styleType === 3"
                  v-model="listItem.result"
                  color="#F80F16"
                  icon="static/image/microShop/xiaoicon.png"
                  void-color="#F80F16"
                  void-icon="smile-o"
                />
              </div>
            </div>
            <!--<div class="singleList" v-if="listItem.kindId === 4">-->
            <!--<span class="theme_bg_red">下拉</span>-->
            <!--<div class="divObj">-->
            <!--<span>{{listItem.orderNo}}、{{listItem.title}}</span>-->
            <!--<div class="xiala" @click="select1(listItem)">-->
            <!--<span>{{listItem.result || '请选择'}}</span>-->
            <!--<span class="icon iconfont mall-xiala"></span>-->
            <!--</div>-->
            <!--<span class="correct">正确答案</span><span class="wrong theme_font_red">回答错误</span>-->
            <!--<van-action-sheet v-model="listItem.show" :actions="listItem.options"-->
            <!--@select="onSelect($event,listItem)"/>-->
            <!--&lt;!&ndash;<van-action-sheet v-model="show" :actions="actions" @select="onSelect" />&ndash;&gt;-->
            <!--</div>-->
            <!--</div>-->
            <div class="singleList" v-if="listItem.kindId === 3">
              <span class="theme_bg_red">图片</span>
              <div class="divObj">
                <span>{{listItem.orderNo}}、{{listItem.title}}</span>
                <div class="pics" v-for="(optionItem, index) in listItem.options" :key="index">
                  <div class="picsDiv">
                    <span>{{optionsObj[index]}}、</span>
                    <img :src="optionItem.imgUrl" alt>
                  </div>
                  <div>
                    <van-radio-group
                      v-model="listItem.result"
                    >
                      <van-radio :disabled="prohibit"
                                 checked-color="#F80F16"
                                 :name="optionsObj[index]"
                      >{{optionItem.lable}}
                        <span class="correct" v-if="optionItem.rightResult === true && flag === true">正确答案</span><span
                          v-if="optionItem.rightResult === false && flag === true && listItem.result === optionItem.code"
                          class="wrong theme_font_red">回答错误</span>
                      </van-radio>
                    </van-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn">
            <!--<span class="theme_bg_red" @click="confirm">确认</span>-->
            <span class="theme_bg_red" @click="confirm">
              <button :class="{grays:prohibit,theme_bg_red:!prohibit}" :disabled='prohibit'>确认</button>
            </span>
            <span @click="next" v-if="disappear"><button :class="{grays:!prohibit,theme_bg_red:prohibit}"
                                                         :disabled='!prohibit'>下一题</button></span>
          </div>
        </div>
        <div class="bottom">
          <div class="head">
            <div class="div1">当前得分：<span class="theme_font_red">{{subjectValue}}</span>分</div>
            <div class="div2">{{i+1}}/{{answerList.length}}</div>
          </div>
          <div class="result">
            <p class="result-p">题目</p>
            <ul>
              <li :class="{red:item.active==1,green:item.active==2}" v-for="(item, index) in answerList" :key="index">
                {{index+1}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav-content>
    <!--提交成功弹出层-->
    <van-popup v-model="commitModel">
      <div class="modal">
        <p class="title-p">恭喜您成功提交问券，您获得{{subjectValue}}分，奖励如下</p>
        <ul>
          <li v-for="(item,index) in mktAwardList" :key="index">
            <img :src="item.prizeImgUrl" alt>
            <span>{{item.prizeName}}{{item.prizeNum}}</span>
          </li>
        </ul>
      </div>
      <div class="btns">
        <span @click="closeBtn">确定</span>
        <span class="theme_bg_red"><router-link to="/mall2/win_record">查看奖品</router-link></span>
      </div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {mapGetters} from 'vuex'
  import {Toast} from 'vant'
  import {Dialog} from 'vant'
  import Config from '@/api/config'

  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        resultList: [],
        listItem: '',
        i: 0,
        flag: false, //正确和错误答案的提示
        prohibit: false, //禁止点击
        subjectValue: 0,
        numList: [],
        disappear: true,
        type: {
          1: 'green',
          2: 'red'
        },
        answerList: [],
        optionsObj: {
          //选项前面的ABCD
          "0": "A",
          "1": "B",
          "2": "C",
          "3": "D",
          "4": "E",
          "5": "F",
          "6": "G",
          "7": "H",
          "8": "I"
        },
        radio: "B",
        list: ["a", "b", "c", "d"],
        result: ["a", "b"],
        value: 3,
        show: false,
        commitModel: false,
        actions: [],
        mktAwardList: [],
        id: '',
        url: '',
        paramsData: {},
        shareTitle: '',
        shareContent: '',
        shareImgUrl: '',
        shareurl: '',
        shareUserid: '',
        shareView: true
      }
    },
    created() {
      let that = this
      that.paramsData = that.$route.query
      console.log(that.paramsData)
      if (that.$route.query) {
        that.shareUserid = that.$route.query.shareUserid
      } else {
        that.shareUserid = ''
      }
      console.log(that.$route.query);
      console.log(that.shareUserid);
    },
    mounted() {
      this.loadData()
      this.Intercept()
    },

    methods: {
      loadData() {
        let that = this
        let params1 = {
          id: that.paramsData.subId,
          token: this.$store.state.login.token,
          // userId: '1451990',
          // id: '96',
          // token: 'o::71A992FCED3C498A8B2B37D60CBE2E98'
        }

        that.questionData(params1).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            let answerList = res.data.data.subjectList;
            console.log(answerList);
            let ifShare = JSON.parse(res.data.data.questionShare)
            console.log(ifShare);
            if (ifShare.length == 0) { //判断是否可以分享
              that.shareView = false
            } else {
              that.shareView = true
            }
            // that.userId = res.data.data.userId
            answerList.forEach(function (item, index) {
              if (
                item.kindId === 1 ||
                item.kindId === 2 ||
                item.kindId === 3 ||
                item.kindId === 4
              ) {
                item.active = 0
                let list = JSON.parse(item.options);
                if(item.kindId === 2){
                  item.right = []
                  list.forEach(function (itemOption, indexOption) {
                    itemOption.name = itemOption.lable;
                    itemOption.code = that.optionsObj[indexOption]
                    if (itemOption.rightResult === true) {
                      item.right.push(that.optionsObj[indexOption]) //添加一项正确答案
                    }
                  });
                  console.log(item.right);
                }else{
                  list.forEach(function (itemOption, indexOption) {
                    itemOption.name = itemOption.lable;
                    itemOption.code = that.optionsObj[indexOption]
                    if (itemOption.rightResult === true) {
                      item.right = that.optionsObj[indexOption] //添加一项正确答案
                    }
                  });
                }

                item.options = list;
              }
              if (item.kindId === 2) {
                item.result = []
              } else if (item.kindId === 6) {
                item.result = 0
                item.right = 0
              } else {
                item.result = "";
                if (item.kindId === 4) {
                  item.show = false
                }
              }
            });
            that.answerList = answerList;
            console.log(99)
            console.log(that.answerList);
            that.listItem = that.answerList[that.i]
            // that.subjectValue = that.answerList[that.i].subjectValue || 0
            //分享
            that.shareTitle = res.data.data.shareTitle
            that.shareContent = res.data.data.shareContent
            that.shareImgUrl = res.data.data.shareImgUrl
            // that.shareurl = res.data.data.shareurl
            console.log('hahh',that.shareImgUrl);
          } else {
            console.log(res.data.info);
          }
        });
      },
      next() {
        let that = this;
        that.i++
        that.listItem = that.answerList[that.i]
        that.prohibit = false
        that.flag = false
        that.disappearData()
      },
      closeBtn() {
        this.commitModel = false
        this.$router.go(-1)
      },
      sharegoods: function () { //分享
        let that = this
        let shareData = {
          title: that.shareTitle,
          sharetext: that.shareContent,
          imageurl: that.shareImgUrl,
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/answer?shareUserid=${this.$store.state.userInfo.userId}`
        };
        // shareData.detailurl = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}${this.$route.fullPath}?shareUserid=${this.$store.state.userInfo.userId}`
        console.log(shareData.detailurl);
        this.$bridgefunc.wechatShare(shareData);
      },
      disappearData() {
        let that = this
        console.log(that.i + 1);
        console.log(that.answerList.length);
        if (that.i + 1 >= that.answerList.length) {
          that.disappear = false
        }
      },
      select1(item) {
        item.show = true
      },
      onSelect(event, item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭
        item.result = event.code
        item.show = false
      },
      confirm() {
        let that = this;
        that.flag = true
        that.prohibit = true
        let item = that.answerList[that.i]
        if (item.kindId === 2) {
          if (item.right.sort().toString() === item.result.sort().toString()) {
            item.active = 2
            item.scoreValue = item.subjectValue
            that.subjectValue = that.subjectValue + item.subjectValue
          } else {
            item.active = 1
            item.scoreValue = 0
          }
        } else {
          if (item.result === item.right) {
            item.active = 2
            item.scoreValue = item.subjectValue
            that.subjectValue = that.subjectValue + item.subjectValue
          } else {
            item.active = 1
            item.scoreValue = 0
          }
        }
        let params = {
          kindId: item.kindId,
          configId: item.configId,
          subjectId: item.id,
          kindName: item.kindName,
          options: JSON.stringify(item.options),
          title: item.title,
          result: item.result.toString(),
          orderNo: item.orderNo,
          score: item.scoreValue
        }

        console.log(params.toString());
        params.token = this.$store.state.login.token
        // that.commitData({ resultJson: JSON.stringify(params),token: this.$store.state.login.token,userId: '542503'}).then(res => {
        that.commitData(params).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            if (that.i + 1 >= that.answerList.length) {
              Toast('恭喜您已经答完最后一道题了')
              // that.commitModel = true
              that.prize()
            }
          } else {
            Toast(res.data.info)
          }
        });
      },
      prize() {
        let that = this
        let data = {
          id: that.paramsData.subId,
          token: this.$store.state.login.token,
          shareUserid: that.shareUserid
        };
        that.prizeData(data).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            that.mktAwardList = res.data.data.mktAwardList || []
            if (that.mktAwardList.length>0) {
              that.commitModel = true;
            } else {
              that.commitModel = false;
              that.$router.go(-1)
            }
          } else {
            console.log(res.data.info)
            that.commitModel = false;
            that.$router.go(-1)
          }
        });
      },
      backEvent: function () {
        Dialog.confirm({
          title: '标题',
          message: '问卷尚未答完，确定要离开吗？',
          cancelButtonText: '现在离开',
          confirmButtonText: '继续答题'
        }).then(() => {
          // on confirm
        }).catch(() => {
          // on cancel
          this.$router.go(-1)
        })
      },
      Intercept() {
        let url = this.url || window.location.href
        console.log(url);
        let _url = url.substr(url.indexOf('?'))
        console.log(_url);
        let GETs = _url.slice(1).split('=')
        console.log(GETs[1]);
        this.id = GETs[1]
      }
    },
    computed: {},
    components: {},
    watch: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #body {
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
      }
    }
    .nav-top {
      position fixed
    }
    >>> .nav-content {
      position: absolute;
      top 64px;
      left: 0;
      right: 0;
      overflow auto;
      margin-bottom 70px;
      .content {
        width 96%;
        margin 0 auto
        .box {
          border-bottom: 1px solid #ecf1f1;
          padding-bottom: 30px;
          .top {
            .singleList {
              font-size 16px;
              display flex;
              justify-content flex-start;
              margin-bottom 15px;
              .theme_bg_red {
                color white;
                height 24px;
                width 17%;
                text-align center;
                line-height 24px;
                display inline-block
                border-radius 4px;
                margin-right 12px;
                font-size 12px;
              }
              .divObj {
                width 87%;
                span {
                  line-height 24px;
                  display inline-block
                }
                .van-radio {
                  margin 15px 0;
                  .van-radio__label {
                    .correct {
                      color #00b300
                      margin-left 15px
                    }
                    .wrong {
                      margin-left 15px
                    }
                  }
                }
                .van-checkbox {
                  margin 15px 0;
                }
                .van-rate {
                  margin 15px 0;
                }
                .textType {
                  text-indent: 2em;
                  line-height: 24px;
                  padding: 10px;
                  margin 15px 0;
                  border 0;
                  background #efefef;
                  border-radius 8px;
                  width 90%;
                }
                .xiala {
                  width: 50%;
                  height: 30px;
                  border: 0.5px solid #b9b9b5;
                  margin-top: 15px;
                  display flex;
                  justify-content space-around;
                  span {
                    vertical-align middle
                    line-height 30px;
                  }
                }
                .pics {
                  margin-top 15px;
                  width 100%;
                  .picsDiv {
                    width 100px;
                  }
                  img {
                    width 100%;
                    height 100%
                    margin-bottom 15px;
                    display block;
                  }
                  div {
                    display flex;
                    /*justify-content space-around*/
                    input {
                      margin-top 5px;
                      margin-left 4px;
                    }
                  }
                }
              }
            }
          }
          .btn {
            display flex;
            width 80%
            margin 0 auto
            margin-top 20px;
            justify-content space-between
            span {
              width: 25%;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              color white;
              text-align center;
              button {
                border: 1px solid transparent
                outline none
                width: 100%;
                height: 30px;
                display block
                line-height: 30px;
                font-size: 14px;
                color white;
                text-align center;
              }
            }
          }
        }
        .bottom {
          .head {
            display flex;
            justify-content space-between
            line-height 30px;
            .div1 {
              width 80%
              text-align center
              span {
                font-size 14px
              }
            }
            .div2 {
              width 20%;
              text-align right
            }
          }
          .result {
            width 210px
            margin 0 auto
            .result-p {
              font-size 16px;
              margin 20px 0
            }
            ul {
              width 210px;
              background pink
              li {
                float left;
                width 30px;
                height 30px;
                line-height 30px;
                text-align center;
                margin-right 10px;
                margin-bottom 10px;
                border 1px solid #dddfdf
                border-radius 50%
              }
            }
          }
        }
      }
    }
  }

  .van-field .van-cell__title {
    display none;
  }

  .van-popup {
    width: 80%;
    margin: 0 auto;
    top: 40%;
    overflow-y: hidden;
    border-radius: 6px;
    .btns {
      width 100%;
      display flex;
      justify-content space-between;
      margin-top 20px;
      span {
        display inline-block;
        width 50%;
        height 50px;
        line-height 50px;
        text-align center;
        font-size 16px;
      }
      span:nth-child(2) {
        color white;
        a {
          color white;
          display block
          width 100%;
          height 50px;
          line-height 50px;
          font-size 16px;
          text-align center
        }
      }
    }
    .modal {
      width 90%;
      margin 0 auto
      .title-p {
        width: 60%;
        margin: 30px auto 20px auto;
        text-align: center;
        font-size: 16px;
        line-height 26px;
      }
      ul {
        //height 200px;
        //overflow-y auto;
        li {
          padding 15px 0;
          line-height 22px;
          border-top 1px solid #ecf1f1;
          display: flex;
          justify-content: start;
          font-size 14px;
          img {
            vertical-align middle;
            width: 40px;
            height: 40px;
            /*border-radius: 50%;*/
            margin-right: 24px;
          }
        }
        li:last-child {
          border-bottom 1px solid #ecf1f1
        }
      }
    }
  }

  .green {
    background #00b300
    color white
  }

  .red {
    background #f80f16
    color: white
  }

  .gray {
    background #e8f4fe;
  }

  .grays {
    background: #e5e5e5;
  }

  .correct {
    color #00b300
    margin-left 15px
  }
</style>
