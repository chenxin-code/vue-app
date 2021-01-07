<template>
  <div id="body">
    <nav-top @backEvent="backEvent" title="加油评价" v-if="!firmdetailSubject">
      <div @click="sharegoods" class="shareBox" v-if="shareView">
        <div>
          <i class="icon iconfont mall-fenxiang"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="top" v-for="(item, index) in answerList" :key="index">
          <div class="singleList" v-if="item.kindId === 1">
            <div class="divObj">
              <span>{{item.title}}</span>
              <van-radio-group
                v-model="item.result"
              >
                <van-radio
                  checked-color="#F80F16"
                  v-for="(optionItem, index) in item.options"
                  :key="index"
                  :name="optionsObj[index]"
                >{{optionsObj[index]}} 、{{optionItem.lable}}
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="singleList multipleList" v-if="item.kindId === 2">
            <div class="divObj">
              <span>{{item.title}}</span>
              <van-checkbox-group
                v-model="item.result"
              >
                <van-checkbox
                  checked-color="#F80F16"
                  v-for="(optionItem, index) in item.options"
                  :key="index"
                  :name="optionsObj[index]"
                >{{optionsObj[index]}} 、{{optionItem.lable}}
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 5">
            <div class="divObj">
              <span>{{item.title}}</span>
              <textarea v-if="item.limitMin && !item.limitMax" class="textType" v-model="item.result"
                        style="min-height: 90px;" :placeholder="`请输入最少${item.limitMin}个字`"></textarea>
              <textarea v-if="item.limitMax && !item.limitMin" class="textType" v-model="item.result"
                        style="min-height: 90px;" :placeholder="`请输入最多${item.limitMax}个字`"></textarea>
              <textarea v-if="item.limitMin && item.limitMax" class="textType" v-model="item.result"
                        style="min-height: 90px;" :placeholder="`请输入${item.limitMin}到${item.limitMax}个字`"></textarea>
              <textarea v-if="!item.limitMin && !item.limitMax" class="textType" v-model="item.result"
                        style="min-height: 90px;"></textarea>
            </div>
          </div>
          <div class="singleList score" v-if="item.kindId === 6">
            <div class="divObj divobjs">
              <span>{{item.title}}</span>
              <div class="evaluteBox">
                <van-rate
                  v-if="item.styleType === 1"
                  v-model="item.result"
                  color="#F80F16"
                  void-color="#F80F16"
                  @change="evaluateData(index,$event)"
                />
                <van-rate
                  v-if="item.styleType === 2"
                  v-model="item.result"
                  color="#F80F16"
                  icon="like"
                  void-color="#F80F16"
                  void-icon="like-o"
                  @change="evaluateData(index,$event)"
                />
                <van-rate
                  v-if="item.styleType === 3"
                  v-model="item.result"
                  color="#F80F16"
                  icon="static/image/microShop/xiaoicon.png"
                  void-color="#F80F16"
                  void-icon="smile-o"
                  @change="evaluateData(index,$event)"
                />
                <p>{{item.evaluate}}</p>
              </div>
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 4">
            <div class="divObj">
              <span>{{item.title}}</span>
              <div class="xiala" @click="select1(item)">
                <span>{{item.result || '请选择'}}</span>
                <span class="icon iconfont mall-xiala"></span>
              </div>
              <van-action-sheet id="xialaView" v-model="item.show" :actions="item.options"
                                @select="onSelect($event,item)"/>
              <!--<van-action-sheet v-model="show" :actions="actions" @select="onSelect" />-->
            </div>
          </div>
          <div class="singleList" v-if="item.kindId === 3">
            <div class="divObj">
              <span>{{item.title}}</span>
              <div class="pics" v-for="(optionItem, index) in item.options" :key="index">
                <div>
                  <span>{{optionsObj[index]}}、</span>
                  <img :src="optionItem.imgUrl" alt>
                </div>
                <div>
                  <van-radio-group
                    v-model="item.result"
                  >
                    <van-radio
                      checked-color="#F80F16"
                      :name="optionsObj[index]"
                    >{{optionItem.lable}}
                    </van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom theme_bg_red" @click="commit" v-if="answerList.length">提交加油评价</div>
        <div class="bottom gray" v-if="commitView && answerList.length">提交加油评价</div>
      </div>
    </nav-content>
    <!--后台配置可选奖品数量弹出层-->
    <van-popup v-model="commitModel1" :close-on-click-overlay='false' v-if="questionPrize.length">
      <div class="modal">
        <p class="title-p">您已完成评价，请从以下奖品列表中选取{{prizeTypeNum}}份奖品领取吧</p>
        <ul>
          <li v-for="(item,index) in questionPrize" :key="index">
            <img :src="item.prizeImgUrl?item.prizeImgUrl:'static/image/microShop/icon52x.png'" alt>
            <span>{{item.prizeName}}{{item.prizeNum}}</span>
            <van-checkbox-group v-model="radioList" :max="prizeTypeNum" @change="selectData">
              <van-checkbox :name="index+1" checked-color="#F80F16"></van-checkbox>
            </van-checkbox-group>
          </li>
        </ul>
      </div>
      <div class="btns">
        <span class="theme_bg_red get" @click="getPrize">领取</span>
      </div>
    </van-popup>
    <!--提交成功弹出层-->
    <van-popup v-model="commitModel" :close-on-click-overlay='false'>
      <div class="modal">
        <p class="title-p">恭喜您成功提交评价，您获得以下奖品</p>
        <ul>
          <li v-for="(item,index) in mktAwardList" :key="index">
            <img :src="item.prizeImgUrl?item.prizeImgUrl:'static/image/microShop/icon52x.png'" alt>
            <span>{{item.prizeName}}{{item.prizeNum}}</span>
            <span @click="seeView(item.prizeType)">查看</span>
          </li>
        </ul>
      </div>
      <div class="btns">
        <span @click="closeBtn">确定</span>
<!--        <span class="theme_bg_red">-->
<!--          <router-link to="/coupon_list">查看奖品</router-link>-->
<!--        </span>-->
      </div>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import {mapGetters} from "vuex";
  import rule from "@/components/mall2/game/question/rule";
  import {Toast} from 'vant'
  import {Dialog} from 'vant'
  import Config from '@/api/config'

  export default {
    name: "",
    mixins: [api],
    props: {
      firmdetailSubject: {
        type: String,
        default: true,
      },
      orderIds: {
        type: String,
      },
      ouCode: {
        type: String
      }
    },
    data() {
      return {
        answerList: [],
        optionsObj: [],
        radioList: [],
        paramsData: {},
        commitView: false,
        radio: "B",
        list: ["a", "b", "c", "d"],
        result: ["a", "b"],
        value: 3,
        show: false,
        commitModel1: false,
        commitModel: false,
        actions: [],
        mktAwardList: [],
        id: '',
        orderId: '',
        url: '',
        shareTitle: '',
        shareContent: '',
        shareImgUrl: '',
        shareurl: '',
        shareUserid: '',
        shareView: true,
        tip: '',
        questionPrize: [],
        prizeTypeNum: 0,
        resultJson: [], //答题
        firmId: '', // 加油凭证 提交问卷 的入参id
      };
    },
    created() {
      let that = this
      console.log(that.$route.query,this.firmdetailSubject)
      if (that.$route.query.type == 'questionlist') {
        console.log('来源：问卷列表');
        that.shareUserid = that.$route.query.shareUserid
        that.paramsData = that.$route.query
        that.paramsData.subId = that.paramsData.id
        that.loadData();
      } else {
        if (this.firmdetailSubject == '加油凭证') {
          console.log('来源：加油凭证');
          that.shareUserid = that.$route.query.shareUserid
          that.paramsData = that.$route.query
          that.paramsData.subId = that.paramsData.id
          that.loadData();
        } else {
          console.log('来源：消息');
          that.shareUserid = ''
          that.paramsData = that.$route.query
          that.paramsData.subId = that.$route.query.id
          that.paramsData.orderId = that.$route.query.orderId
          that.qualifications()
        }
      }
    },
    mounted() {
     this.getLetter()
    },
    methods: {
      seeView(params) {
        console.log(params);
        let path =  ''
        if (params == '20030') { //游戏机会(中奖记录)
          path = '/mall2/win_record'
        } else if (params == '20010') { //返利红包
          path: '/usercenter/rebatebonus'
        } else if (params == '20020') { //积分
          path: '/mall2/integralinfo'
        } else if (params == '20001') { //优惠券
          path: '/coupon_list'
        }
        this.$router.push({
          path: path,
          query: {
            type: 'serviceSubject'
          }
        })
      },
      selectData(index) {
        console.log(index);
        this.radioList = index
        console.log(this.radioList.join());
      },
      generateBig_1() { //获取26个大写字母
        var str = [];
        for (var i = 65; i < 91; i++) {
          str.push(String.fromCharCode(i));
        }
        return str;
      },
      getLetter() {
        this.optionsObj = this.generateBig_1()
        console.log(this.optionsObj);
      },
      getPrize() {
        let that = this
        let data = {
          id: that.paramsData.subId,
          token: this.$store.state.login.token,
          shareUserid: that.shareUserid,
          orderId: that.paramsData.orderId,
          selectTypeNum: that.radioList.join() //用户选择的奖品编码
        };
        that.prizeData(data).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            Toast('领取成功')
            that.commitModel1 = false;
            that.$router.go(-1)
          } else {
            Toast(res.data.info)
            that.commitModel1 = false;
            that.$router.go(-1)
          }
        });
      },
      evaluateData(params, num) {
        let paramsResult = this.answerList[params]
        if (paramsResult.result == 1) {
          paramsResult.evaluate = '非常差'
        } else if (paramsResult.result == 2) {
          paramsResult.evaluate = '差'
        } else if (paramsResult.result == 3) {
          paramsResult.evaluate = '一般'
        } else if (paramsResult.result == 4) {
          paramsResult.evaluate = '好'
        } else if (paramsResult.result == 5) {
          paramsResult.evaluate = '非常好'
        }
      },
      //是否符合答题资格
      qualifications() {
        let that = this
        let params = {
          id: that.paramsData.subId,
          token: this.$store.state.login.token,
          orderId: that.paramsData.orderId
        }
        that.participateData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
           that.loadData()
          } else {
            Toast(res.data.info)
          }
        })
      },
      loadData() {
        let that = this;
        if (this.firmdetailSubject == '加油凭证') {
          let params1 = {
            isDefault: 1,
            token: this.$store.state.login.token
          };
          that.questionUrlData(params1).then(res => {
            if (res.data.result === "success") {
              if (res.data.data.subjectList && res.data.data.subjectList.length > 0) {
                that.questionPrize = JSON.parse(res.data.data.questionPrize) || []
                let limitNum = (res.data.data.prizeTypeNum).toString()
                if (limitNum.length > 0) {
                  that.prizeTypeNum = res.data.data.prizeTypeNum
                } else {
                  that.prizeTypeNum = 0
                }
                let answerList = res.data.data.subjectList;
                that.userId = res.data.data.userId
                that.firmId = res.data.data.id
                let ifShare = res.data.data.questionShare?JSON.parse(res.data.data.questionShare):''
                if (ifShare.length == 0) { //判断是否可以分享
                  that.shareView = false
                } else {
                  that.shareView = true
                }
                answerList.forEach(function (item) {
                  if (
                    item.kindId === 1 ||
                    item.kindId === 2 ||
                    item.kindId === 3 ||
                    item.kindId === 4
                  ) {
                    let list = JSON.parse(item.options);
                    list.forEach(function (itemOption) {
                      itemOption.name = itemOption.lable;
                    });
                    item.options = list;
                  }
                  if (item.kindId === 2) {
                    item.result = []
                  } else if (item.kindId === 6) {
                    item.result = 0
                  } else {
                    item.result = "";
                    if (item.kindId === 4) {
                      item.show = false
                    }
                  }
                });
                answerList.forEach(function (item) {
                  item.evaluate = ''
                  item.tips = ''
                })
                that.answerList = answerList;
                //分享
                that.shareTitle = res.data.data.shareTitle
                that.shareContent = res.data.data.shareContent
                that.shareImgUrl = res.data.data.shareImgUrl
              } else {
                this.answerList = []
                that.commitView = true
              }
            } else {
              console.log(res.data.info);
            }
          });
        } else {
          let params1 = {
            id: that.paramsData.subId,
            token: this.$store.state.login.token
          };
          that.questionData(params1).then(res => {
            if (res.data.result === "success") {
              if (res.data.data.subjectList.length > 0) {
                that.questionPrize = JSON.parse(res.data.data.questionPrize) || []
                let limitNum = (res.data.data.prizeTypeNum).toString()
                if (limitNum.length > 0) {
                  that.prizeTypeNum = res.data.data.prizeTypeNum
                } else {
                  that.prizeTypeNum = 0
                }
                let answerList = res.data.data.subjectList;
                that.userId = res.data.data.userId
                let ifShare = res.data.data.questionShare?JSON.parse(res.data.data.questionShare):''
                if (ifShare.length == 0) { //判断是否可以分享
                  that.shareView = false
                } else {
                  that.shareView = true
                }
                answerList.forEach(function (item) {
                  if (
                    item.kindId === 1 ||
                    item.kindId === 2 ||
                    item.kindId === 3 ||
                    item.kindId === 4
                  ) {
                    let list = JSON.parse(item.options);
                    list.forEach(function (itemOption) {
                      itemOption.name = itemOption.lable;
                    });
                    item.options = list;
                  }
                  if (item.kindId === 2) {
                    item.result = []
                  } else if (item.kindId === 6) {
                    item.result = 0
                  } else {
                    item.result = "";
                    if (item.kindId === 4) {
                      item.show = false
                    }
                  }
                });
                answerList.forEach(function (item) { //打分题后面添加评价,简答题字数检验
                  item.evaluate = ''
                  item.tips = ''
                })
                that.answerList = answerList;
                //分享
                that.shareTitle = res.data.data.shareTitle
                that.shareContent = res.data.data.shareContent
                that.shareImgUrl = res.data.data.shareImgUrl
              } else {
                Toast('题目加载失败')
                that.commitView = true
              }
            } else {
              console.log(res.data.info);
            }
          });
        }
      },
      select1(item) {
        item.show = true
      },
      commit() {
        let that = this;
        let params = [];
        that.answerList.forEach(function (item) {
          params.push({
            kindId: item.kindId,
            configId: item.configId,
            subjectId: item.id,
            kindName: item.kindName,
            options: item.options,
            title: item.title,
            styleType: item.styleType,
            orderNo: item.orderNo,
            result: item.result.toString()
          });
        });

        let throttle = true
        that.answerList.forEach(function (item) {
          if (item.mustAnswer == 1 && item.result == '') {
            throttle = false
          }
        })
        if (!throttle) {
          Toast('您还有必答题尚未答完，请先答完必答题！');
          // Toast('第'+(index+1)+'题是必答题');
          return;
        }
        let numLimit = true
        that.answerList.forEach(function (item, index) {
          if (item.kindId == 5) {
            if (item.limitMin && !item.limitMax) {
              if (item.result.length < item.limitMin) {
                that.tip = '第' + (index + 1) + '题简答题最少输入' + item.limitMin + '个字'
                numLimit = false
              }
            }
            if (item.limitMax && !item.limitMin) {
              if (item.result.length > item.limitMax) {
                that.tip = '第' + (index + 1) + '题简答题最多输入' + item.limitMax + '个字'
                numLimit = false
              }
            }
            if (item.limitMin && item.limitMax) {
              if ((item.result.length >= item.limitMin) && (item.result.length <= item.limitMax)) {
                numLimit = true
              } else {
                that.tip = '第' + (index + 1) + '题简答题字数限制在' + item.limitMin + '至' + item.limitMax + '之间'
                numLimit = false
              }
            }
          }
        })
        if (!numLimit) {
          Toast(that.tip);
          return;
        }
        this.resultJson = params
        if (this.firmdetailSubject == '加油凭证') {
          let paramsDatas = {
            id: that.firmId,
            token: this.$store.state.login.token,
            ouCode: this.ouCode,
            orderId: this.orderIds
          }
          that.participateData(paramsDatas).then(res => {
            console.log(res);
            if (res.data.result === 'success') {
              that.subjectCommit()
            } else {
              Toast(res.data.info)
            }
          })
        } else {
          that.subjectCommit()
        }
      },
      subjectCommit() {
        let that = this
        let params = {
          resultJson: JSON.stringify(this.resultJson),
          token: this.$store.state.login.token
        }
        if (this.firmdetailSubject == '加油凭证') {
          params.ouCode = this.ouCode
          params.orderId = this.orderIds
          params.id = this.firmId
        } else {
          params.id = that.paramsData.subId,
          params.orderId = that.paramsData.orderId
        }
        that.commitData(params).then(res => {
          if (res.data.result === "success") {
            Toast('提交成功')
            if (((that.prizeTypeNum).toString()).length > 0) {
              that.commitModel1 = true
            } else {
              let data = {
                id: that.paramsData.subId,
                token: this.$store.state.login.token,
                shareUserid: that.shareUserid,
                orderId: that.paramsData.orderId,
                selectTypeNum: that.radioList.join() //用户选择的奖品编码
              };
              that.prizeData(data).then(res => {
                if (res.data.result === "success") {
                  that.mktAwardList = res.data.data.mktAwardList || []
                  if (that.mktAwardList.length > 0) {
                    that.commitModel = true;
                  } else {
                    that.commitModel = false;
                    if (this.firmdetailSubject == '加油凭证') {
                    } else {
                      that.$router.go(-1)
                    }
                  }
                  //提交成功，调取详情
                  if (this.firmdetailSubject == '加油凭证') {
                    let params = {
                      firmId: this.firmId,
                      pageView: true
                    }
                    this.$emit(firmData, params);
                  }
                } else {
                  that.commitModel = false;
                  if (this.firmdetailSubject == '加油凭证') {
                  } else {
                    that.$router.go(-1)
                  }
                }
              });
            }
          } else {
            Toast(res.data.info)
          }
        });
      },
      sharegoods: function () { //分享
        let that = this
        let shareData = {
          title: that.shareTitle,
          sharetext: that.shareContent,
          imageurl: that.shareImgUrl,
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/service/subject?shareUserid=${this.$store.state.userInfo.userId}`
        };
        console.log(shareData.detailurl);
        this.$bridgefunc.wechatShare(shareData);
      },
      closeBtn() {
        this.commitModel = false
        this.$router.go(-1)
      },
      backEvent: function () {
        let that = this
        Dialog.confirm({
          message: '问卷尚未答完，确定要离开吗？',
          cancelButtonText: '现在离开',
          confirmButtonText: '继续答题'
        }).then(() => {
          // on confirm
        }).catch(() => {
          // on cancel
          that.$router.go(-1)
        })
      },
      onSelect(event, item) {
        item.result = event.name
        item.show = false
      },
      getUrlParam(name) { //截取当前路径的参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
    },
    computed: {},
    components: {},
    watch: {}
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #body {
    .evaluteBox {
      display flex;
      justify-content start;

      p {
        margin: auto 15px;
        color: #807d7d;
      }
    }

    /deep/ .van-image__img {
      width 20px;
      height auto
    }

    #xialaView {
      top auto;
      width 100%
    }

    .shareBox {
      float: right;
      display: flex;
      margin-right: 10px;
      justify-content: space-around;
      position: relative;
      z-index: 10;
      padding 0 15px;

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
            margin-left 10px;

            .theme_bg_red {
              color: white;
              height: 24px;
              width: 17%;
              text-align: center;
              line-height: 24px;
              display: inline-block;
              border-radius: 4px;
              margin-right: 12px;
              font-size: 12px;
            }

            .divObj {
              width: 87%;

              span {
                line-height: 30px;
                display: inline-block;
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

            .divobjs {
              display flex;
              justify-content start;

              span {
                margin auto 0
                margin-right 6px;
              }

              .evaluteBox {
                margin auto 0
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

        .gray {
          background #e6e8ea
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
      margin-top 20px;

      span {
        display: inline-block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
      }

      .get {
        width: 100%;
        color: white;
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
        width: 80%;
        margin: 30px auto 20px auto;
        text-align: center;
        font-size: 16px;
        line-height: 26px;
      }

      ul {
        li {
          /* height: 50px;
           line-height: 50px;*/
          padding 15px 0;
          line-height 22px;
          border-top: 1px solid #ecf1f1;
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          img {
            width: 40px;
            height: 40px;
            margin-right: 24px;
            vertical-align: middle;
          }
          span:nth-child(2) {
            width 140px;
          }
          span {
            margin auto
          }

          /deep/ .van-checkbox-group {
            margin auto
          }
        }

        li:last-child {
          border-bottom: 1px solid #ecf1f1;
        }
      }
    }
  }

</style>
