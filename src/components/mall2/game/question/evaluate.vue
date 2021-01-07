<template>
  <div id="body">
    <nav-top @backEvent="backEvent" title="吐槽墙">
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="oil-content">
          <div class="icon">
            <img src="static/image/mall2/logoItem.png" alt>
          </div>
          <div class="detail">
            <div class="title">{{$route.query.storeName}}</div>
            <div class="address"><van-icon name="location-o" />{{$route.query.address}}</div>
          </div>
        </div>
        <div class="answer-con">
          <div class="top" v-for="(item, index) in answerList" :key="index">
            <div class="singleList score" v-if="item.kindId === 6">
              <!--            <span class="theme_bg_red">打分</span>-->
              <div class=" score-con">
                <!--              <div class="divObj score-con">-->
                                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
<!--                <label class="title-con">{{item.title}}</label>-->
                <div class="evaluteBox">
                <van-rate
                  v-if="item.styleType === 1"
                  v-model="item.result"
                  color="#25aff8"
                  void-color="#25aff8"
                  @change="evaluateData(index,$event)"
                />
                <van-rate
                  v-if="item.styleType === 2"
                  v-model="item.result"
                  color="#25aff8"
                  icon="like"
                  void-color="#25aff8"
                  void-icon="like-o"
                  @change="evaluateData(index,$event)"
                />
                <van-rate
                  v-if="item.styleType === 3"
                  v-model="item.result"
                  color="#25aff8"
                  icon="static/image/microShop/xiaoicon.png"
                  void-color="#25aff8"
                  void-icon="smile-o"
                  @change="evaluateData(index,$event)"
                />
                <p>{{item.evaluate}}</p>
              </div>
              </div>
            </div>
            <div class="singleList" v-if="item.kindId === 1">
              <!--            <span class="theme_bg_red">单选</span>-->
              <div class="divObj">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
                <van-radio-group @change="changeResult"
                                 v-model="item.result"
                >
                  <van-radio
                    checked-color="#25aff8"
                    v-for="(optionItem, index) in item.options"
                    :key="index"
                    :name="optionsObj[index]"
                  >{{optionsObj[index]}} 、{{optionItem.lable}}
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="singleList che-con multipleList" v-if="item.kindId === 2">
              <!--            <span class="theme_bg_red">多选</span>-->
              <div class=" ">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
<!--                <van-checkbox-group-->
<!--                  v-model="item.result"-->
<!--                >-->
<!--                  <van-checkbox-->
<!--                    checked-color="#25aff8"-->
<!--                    v-for="(optionItem, index) in item.options"-->
<!--                    :key="index"-->
<!--                    :name="optionsObj[index]"-->
<!--                  >{{optionsObj[index]}} 、{{optionItem.lable}}-->
<!--                  </van-checkbox>-->
<!--                </van-checkbox-group>-->
                <div class="checkItem-con">
                  <van-button round type="default" size="small" v-for="(optionItem, index) in item.options" class="btn-con" :class="optionItem.flag?'select':''" @click="selectO(item.options,item,index)" :key="index">{{optionItem.lable}}</van-button>
<!--                  <Button type="primary" shape="circle" v-for="(optionItem, index) in item.options"> {{optionItem.lable}}</Button>-->
<!--                  <span class="checkItem" v-for="(optionItem, index) in item.options">-->
<!--                    {{optionItem.lable}}-->
<!--                  </span>-->
                </div>
              </div>
            </div>
            <div class="singleList" v-if="item.kindId === 5">
              <!--            <span class="theme_bg_red">问答</span>-->
              <div class="divObj divObj1">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
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
            <div class="singleList text-con" v-if="item.kindId === 7">
              <div class="lin-con"></div>
              <!--            <span class="theme_bg_red">文本</span>-->
              <!--              <div class="divObj">-->
              <div class="">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
                <van-field
                  v-model="item.result"
                  rows="2"
                  autosize
                  :maxlength="item.limitMax||100"
                  type="textarea"
                  placeholder="亲，您对加油站的评价，是我们更好服务的动力哦！"
                  show-word-limit
                  style="width: 100%;background: white;border:1px solid #ccc;border-radius:8px"
                />
<!--                <textarea v-model="item.result" :maxlength="item.limitMax" show-word-limit type="textarea"  :placeholder="`请输入最多${item.limitMax}个字`" style="width: 100%;background: white" ></textarea>-->

                <!--                <span>{{item.orderNo}}、{{item.title}}</span>-->
<!--                <input type="text" v-if="item.limitMin && !item.limitMax" class="textType" v-model="item.result"-->
<!--                       :placeholder="`请输入最少${item.limitMin}个字`"/>-->
<!--                <input type="text" v-if="item.limitMax && !item.limitMin" class="textType" v-model="item.result"-->
<!--                       :placeholder="`请输入最多${item.limitMax}个字`"/>-->
<!--                <input type="text" v-if="item.limitMin && item.limitMax" class="textType" v-model="item.result"-->
<!--                       :placeholder="`请输入${item.limitMin}到${item.limitMax}个字`"/>-->
<!--                <input type="text" v-if="!item.limitMin && !item.limitMax" class="textType" v-model="item.result"/>-->
              </div>
            </div>
            <div class="singleList" v-if="item.kindId === 4">
              <!--            <span class="theme_bg_red">下拉</span>-->
              <div class="divObj">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
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
              <!--            <span class="theme_bg_red">图片</span>-->
              <div class="divObj">
                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>
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
                        checked-color="#25aff8"
                        :name="optionsObj[index]"
                      >{{optionItem.lable}}
                      </van-radio>
                    </van-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom theme_bg_red" :class="{gray:answerList.length==0}" @click="commit">提交吐槽</div>
      </div>
    </nav-content>
    <!--提交成功弹出层-->
    <van-popup v-model="commitModel" :close-on-click-overlay='false'>
      <div class="modal">
        <p class="title-p"><span>成功提交问券</span><span>恭喜您获得以下奖品</span></p>
        <ul>
          <li v-for="(item,index) in mktAwardList" :key="index">
            <img :src="item.prizeImgUrl?item.prizeImgUrl:'static/image/microShop/icon52x.png'" alt>
            <span>{{item.prizeName}}{{item.prizeNum}}</span>
            <span @click="seeView(item.prizeType)">查看</span>
          </li>
        </ul>
      </div>
      <div class="btns">
        <span @click="closeBtn" class="theme_bg_red">确定</span>
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
    data() {
      return {
        twoFlag:false,
        randomId:null,
        answerList: [],
        optionsObj: [],
        radioname: '',
        paramsData: {},
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
        shareTitle: '',
        shareContent: '',
        shareImgUrl: '',
        shareurl: '',
        shareUserid: '',
        shareView: true,
        tip: '',
        details: '' ,// 问卷信息
        token:null,
      };
    },
    beforeRouteEnter(to, from, next) {
      console.log(to,from,next)
      if(from.path=="/submitEvaluation"){
        next(vm => {
          vm.twoFlag=true
          console.log(vm.twoFlag);  //vm为vue的实例
          console.log('组件路由钩子beforeRouteEnter的next');
        });

      }else{
        next()
      }
    },
    created() {
      // console.log(this.$util.getCookie('token'),"$utils")
      // this.token=this.$util.getCookie('token')
      let that = this
      that.paramsData = that.$route.query
      if (that.$route.query) {
        that.shareUserid = that.$route.query.shareUserid
      } else {
        that.shareUserid = ''
      }
    },
    mounted() {
      let id
      if (this.$route.query.questionaireId) {
        id = this.$route.query.questionaireId
      } else {
        id = this.paramsData.subId||this.paramsData.id
      }
      this.randomId=Math.random().toString(36).substr(2)
      let params = {
        id: id,
        // token: this.$store.state.login.token,
        ouCode: this.$route.query.ouCode,
        //随机字符串为了多次答题
        orderId: this.randomId
      }
      this.participateData(params).then(res => {
        this.$Loading.close();
        console.log(res);
        if (res.data.result === 'success') {
          this.loadData();
        } else {
          Toast(res.data.info)
        }
      })
      // this.loadData();
      this.Intercept()
      this.getLetter()

    },
    methods: {
      changeResult(data) {
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
      seeView(params) {
        console.log(params);
        let path = ''
        if (params == '20030') { //游戏机会(中奖记录)
          path = '/mall2/win_record'
        } else if (params == '20010') { //返利红包
          path = '/usercenter/rebatebonus'
        } else if (params == '20020') { //积分
          path = '/mall2/integralinfo'
        } else if (params == '20001') { //优惠券
          path = this.$store.state.globalConfig.questionaire_prize_coupon_list || '/coupon_list'
          if (path.indexOf('uhuitong.com') != -1) {
            this.$market.enterNav({
              link: {
                type: '3',
                url: path,
                useOldProtocal: true
              }
            })
            return
          }
        }
        this.$router.push({
          path: path,
          query: {
            type: 'subject'
          }
        })
      },
      loadData() {
        let that = this;
        let id = ''
        let ouCode=""
        if (that.$route.query.questionaireId) {
          id = that.$route.query.questionaireId
        } else {
          id = that.paramsData.subId||that.paramsData.id
        }
        ouCode=that.$route.query.ouCode
        let params1 = {
          id: id,
          // token: this.$store.state.login.token,
          ouCode:ouCode,
          // orderId: this.randomId
        };
        that.questionData(params1).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            this.details = res.data.data
            let answerList = res.data.data.subjectList;
            that.userId = res.data.data.userId
            let ifShare = res.data.data.questionShare ? JSON.parse(res.data.data.questionShare) : ''
            console.log(ifShare);
            if (ifShare.length == 0) { //判断是否可以分享
              that.shareView = false
            } else {
              that.shareView = true
            }
            answerList.forEach(function (item) {
              item.show = false
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
            that.answerList = JSON.parse(JSON.stringify(answerList));
            that.answerList.forEach((value,index,arr)=>{
              if(value.kindId==2){
                value.options.forEach((value1,index1,arr1)=>{
                  that.$set(that.answerList[index].options[index1],"flag",false)
                })
              }
            })
            //分享
            that.shareTitle = res.data.data.shareTitle
            that.shareContent = res.data.data.shareContent
            that.shareImgUrl = res.data.data.shareImgUrl
          } else {
            console.log(res.data.info);
          }
        });
      },
      select1(item) {
        item.show = true
      },
      commit() {
        if(this.twoFlag){
          this.$Toast('问卷已提交')
          return
        }
        if (this.$route.query.questionaireId) {
          // 考评页面 走 提交考评接口
          for (let i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i].result > 100) {
              this.$Toast(`${this.answerList[i].title}不能超过100分`)
              return;
            }
            if (this.answerList[i].result == '') {
              this.$Toast(`请输入${this.answerList[i].title}`)
              return;
            }
          }
          this.submitEvaluateScore()
        } else {
          this.sub()
        }
      },
      submitEvaluateScore() {
        let params = []
        this.answerList.forEach(function (item) {
          params.push({
            subjectId: item.id, // 题目id
            result: item.result.toString() // 结果
          })
        })
        this.$request.post('/app/json/evaluation_center/submitEvaluateScore', {
          empEvaluationMessageId: this.$route.query.id, // 员工信息id
          configId: this.details.id, // 问卷调查id
          surveyResultModels: params
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('提交成功')
            this.$router.go(-2)
          } else {
            this.$Toast(res.info ? res.info : '提交失败')
          }
        })
      },
      sub() {
        let that = this;
        let params = [];
        that.answerList.forEach(function (item) {
          params.push({
            kindId: item.kindId,
            configId: item.configId,
            subjectId: item.id,
            kindName: item.kindName,
            options: item.options,
            // options: item.result,
            title: item.title,
            styleType: item.styleType,
            orderNo: item.orderNo,
            result: item.result.toString()
            // result: JSON.stringify(item.result)
          });
        });
        console.log(params,"params")
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
        that.$Loading.open();
        that.commitData({
          resultJson: JSON.stringify(params),
          // token: this.$store.state.login.token,
          // id: that.paramsData.subId,
          id: that.paramsData.id,
          // orderId: that.paramsData.orderId,
          orderId: this.randomId,
          ouCode:that.paramsData.ouCode,
          channel:that.$route.query.channel?that.$route.query.channel:'',
          channelName:that.$route.query.channelName?that.$route.query.channelName:'',
        }).then(res => {
          that.$Loading.close();
          console.log(666)
          if (res.data.result === "success") {
            Toast('提交成功')
            let data = {
              // id: that.paramsData.subId,
              id: that.paramsData.id,
              // token: this.$store.state.login.token,
              shareUserid: that.shareUserid,
              orderId: that.paramsData.orderId
            };
            that.$Loading.open();
            that.prizeData(data).then(res => {
              that.$Loading.close();
              if (res.data.result === "success") {
                that.mktAwardList = res.data.data.mktAwardList || []
                if (that.mktAwardList.length > 0) {
                  that.commitModel = true;
                } else {
                  that.commitModel = false;
                  // that.$router.go(-1)
                  that.$router.push({
                    path: '/submitEvaluation'
                  })
                }

              } else {
                that.commitModel = false;
                that.$router.go(-1)
              }
            });
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
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/subject?shareUserid=${this.$store.state.userInfo.userId}&id=${that.paramsData.subId}&orderId=${that.paramsData.orderId}`

        };
        this.$bridgefunc.wechatShare(shareData);
      },
      closeBtn() {
        this.commitModel = false
        this.$router.go(-1)
      },
      backEvent: function () {
        let that = this
        Dialog.confirm({
          message: '吐槽尚未保存，确定要离开吗？',
          cancelButtonText: '现在离开',
          confirmButtonText: '继续吐槽'
        }).then(() => {
          // on confirm
        }).catch(() => {
          // on cancel
          that.$router.go(-1)
        })
      },
      onSelect(event, item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭
        item.result = event.name
        item.show = false
      },
      Intercept() {
        let url = this.url || window.location.href
        let _url = url.substr(url.indexOf('?'))
        let GETs = _url.slice(1).split('=')
        this.id = GETs[1]
      },
      selectO(list,item,indexInit){
        var indexCurrent=null
        console.log(list,item,indexInit)
        this.answerList.forEach((value,index,arr)=>{
          if(value.id==item.id){
            console.log(value,"value")
            indexCurrent=index
            value.options.forEach((value1,index1,arr1)=>{
              console.log(value1,"value1")
              if(list[indexInit].name==value1.name){
                console.log(this.answerList[index].options[index1])
                this.$set(this.answerList[index].options[index1],"flag",!this.answerList[index].options[index1].flag)
              }
            })
          }
        })
        this.answerList[indexCurrent].result=[];
        this.answerList[indexCurrent].options.forEach((value,index,arr)=>{
          if(value.flag){
            // this.answerList[indexCurrent].result.push(value)
            this.answerList[indexCurrent].result.push(this.optionsObj[index])
          }
        })

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
      background : #f5f5f5

      .content {
        /*width: 96%;*/
        margin: 0 auto;
        background:rgba(245,245,245,1);
        padding-top 0.1px

        .top {
          .singleList {
            font-size: 16px;
            display: flex;
            justify-content: flex-start;
            /*margin-bottom: 15px;*/

            .theme_bg_red {
              color: white;
              height: 26px;
              width: 13%;
              text-align: center;
              line-height: 26px;
              display: inline-block;
              /*border-radius: 5px;*/
              margin-right: 12px;
              font-size: 12px;
              border-bottom-right-radius: 8px;
              border-top-right-radius: px;
              border-top-left-radius: 11px;
              background-color: #25aff8;
              border-radius 10px
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
                margin: 5px 0;
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
          right 0
          /*width: 100%;*/
          height: 50px;
          line-height: 50px;
          text-align: center;
          color: white;
          font-size: 18px;
          margin 0 13px
          margin-bottom 13px
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
        color white
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

        span {
          display block
        }
      }

      ul {
        li {
          /* height: 50px;
           line-height: 50px;*/
          padding 15px 0;
          line-height 22px;
          border-top: 1px solid #ecf1f1;
          display: flex;
          justify-content: space-around;
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

          span:nth-child(3) {
            background: #fc9;
            padding: 4px 13px;
            border-radius: 9px;
          }

          span {
            margin auto
          }
        }

        li:last-child {
          border-bottom: 1px solid #ecf1f1;
        }
      }
    }
  }

  .theme_sys_base .gray {
    background #e2e0e0;
  }
  .oil-content{
    /*height:70px;*/
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 8px 0px rgba(0,0,0,0.1);
    border-radius:5px;
    margin 10px 12px
    padding 10px
    display flex
    justify-content flex-start
    /*height:80px*/
    .icon{
      /*width:25%*/
      img{
        width:48px;
        height:48px;
        background:rgba(245,245,245,1);
        border-radius:5px;
        border:1px solid rgba(221,221,221,1);
      }
    }
    .detail{
      margin-left 10px
      /*width:75%*/
      .title{
        /*width:60%*/
        font-size:15px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:21px;
        margin-bottom 9px
      }
      .address{
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:17px;
      }
    }
  }
  .answer-con{
    margin 10px 12px
    padding 20px 16px
    background white
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 8px 0px rgba(0,0,0,0.1);
    border-radius:5px;
  }
  .score-con{
    width 100%!important
    display flex;
    justify-content flex-start
    align-items:center
    margin-top 10px
    margin-bottom 10px
    label{
      /*margin-right 40px*/
      width 120px
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:21px;
    }
  }
  .lin-con{
    height 1px
    margin:0 14px
    backgroud:#DDDDDD
  }
  .text-con{
    width 100%
    display block!important
  }
  .checkItem-con{

    /*display flex;*/
    /*justify-content space-between*/
    .checkItem{
      height:30px;
      background:rgba(242,242,242,1);
      border-radius:20px;
      padding 5px 13px
      color #333333
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:21px;
    }
  }
  .btn-con{
    margin-right 10px
    height 30px
    margin-bottom 10px
  }
  .che-con{
    width:100%!important
  }
  .select{
    background:rgba(228,47,70,0.1);
    border-radius:20px;
    border:1px solid rgba(228,47,70,1);
    .van-button__text{
      color:#E42F46
    }
  }
  .che-con{
    /*margin-top 10px*/
    /*margin-bottom 10px*/
  }
  textarea{
    border 1px solid #ccc
    line-height: 24px;
    padding: 10px;
    margin: 5px 0;
    /*border: 0;*/
    background: #efefef;
    border-radius: 8px;
  }
  .theme_bg_red{
    border-radius 10px
    background #E42F46
  }
  .wall-title {
    display block
    padding 8px 0
  }
  .divObj1{
    width 100%!important
  }
  .textType{
    width 100%!important
  }
</style>
