<template>
    <div>
      <div class="title">请您提出意见，我们将持续改进与提升</div>
      <div class="top" v-for="(item, index) in answerList" :key="index">
        <div class="singleList score" v-if="item.kindId === 6">
          <!--            <span class="theme_bg_red">打分</span>-->
          <div class=" score-con">
            <!--              <div class="divObj score-con">-->
<!--            <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
            <label class="title-con">{{item.title}}</label>
            <div class="evaluteBox">
              <van-rate
                v-if="item.styleType === 1"
                v-model="item.result"
                color="#ffd21e"
                void-icon="star"
                @change="evaluateData(index,$event)"
                :readonly="view==1"
              />
              <van-rate
                v-if="item.styleType === 2"
                v-model="item.result"
                color="#25aff8"
                icon="like"
                void-color="#25aff8"
                void-icon="like-o"
                @change="evaluateData(index,$event)"
                :readonly="view==1"
              />
              <van-rate
                v-if="item.styleType === 3"
                v-model="item.result"
                color="#25aff8"
                icon="static/image/microShop/xiaoicon.png"
                void-color="#25aff8"
                void-icon="smile-o"
                @change="evaluateData(index,$event)"
                :readonly="view==1"
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
<!--            <span class="wall-title">{{item.orderNo}}、{{item.title}} 对其他方面不满意，可描述问题帮加油站改善哦～</span>-->
            <textarea v-if="item.limitMin && !item.limitMax" class="textType" v-model="item.result" :disabled="view==1"
                      style="min-height: 90px;" :placeholder="placeHolder?placeHolder:'对其他方面不满意，可描述问题帮加油站改善哦～'"></textarea>
            <textarea v-if="item.limitMax && !item.limitMin" class="textType" v-model="item.result" :disabled="view==1"
                      style="min-height: 90px;" :placeholder="placeHolder?placeHolder:'对其他方面不满意，可描述问题帮加油站改善哦～'"></textarea>
            <textarea v-if="item.limitMin && item.limitMax" class="textType" v-model="item.result" :disabled="view==1"
                      style="min-height: 90px;" :placeholder="placeHolder?placeHolder:'对其他方面不满意，可描述问题帮加油站改善哦～'"></textarea>
            <textarea v-if="!item.limitMin && !item.limitMax" class="textType" v-model="item.result" :placeholder="placeHolder?placeHolder:'对其他方面不满意，可描述问题帮加油站改善哦～'" :disabled="view==1"
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
      <div class="handler" v-if="view!=1&&answerList.length>0">
        <van-button round type="info"  color="#F02C2D"  class="btn" @click="commit" >提交</van-button>
        <div v-if="hasPrize">
          <p v-if="prize.length>0&&prize[0].prizeType!='20030'">* 完成评价后可获赠{{prize[0].prizeNum}}张{{prize[0].prizeName}}{{prize.length>1?'等':''}}</p>
          <p v-if="prize.length>0&&prize[0].prizeType=='20030'">* 完成评价后可获赠{{prize[0].prizeName}}{{prize[0].prizeNum}}次{{prize.length>1?'等':''}}</p>
        </div>
      </div>
      <van-popup v-model="commitModel" :close-on-click-overlay='false'>
        <div class="modal">
          <p class="title-p"><span>成功提交问券</span><span v-if="showFlag1">恭喜您获得以下奖品</span></p>
          <ul v-if="showFlag1">
            <li v-for="(item,index) in mktAwardList" :key="index">
              <img :src="item.prizeImgUrl?item.prizeImgUrl:'static/image/microShop/icon52x.png'" alt>
              <span>{{item.prizeName}}({{item.prizeNum}})</span>
              <span @click="seeView(item.prizeType,item.prizeCode)">查看</span>
            </li>
          </ul>
          <div class="order" v-if="toEvaluatedNum">
            <div style="margin-top: 10px">您在最近{{limitOrderDayNum}}天内还有{{toEvaluatedNum}}条待评价订单
            </div>

          </div>
        </div>
        <div class="btns">
          <span @click="closeBtn" class="theme_bg_red">{{toEvaluatedNum?'继续评价':'确定'}}</span>
          <!--        <span class="theme_bg_red">-->
          <!--          <router-link to="/coupon_list">查看奖品</router-link>-->
          <!--        </span>-->
        </div>
      </van-popup>
    </div>
</template>
<script>
    import {Toast} from "vant";
    import api from './api'
    export default {
      props:['answerList','prize','view','form','evaluateType','randomId'],
        name: "",
        mixins:[api],
        components: {},
        data() {
            return {
              // randomId:null,
              commitModel:false,
              showFlag1:false,
              // commitModel: false,
              mktAwardList: [],
              // prize:{},
              hasPrize:null,
              toEvaluatedNum:null,
              limitOrderDayNum:null,
              // placeHolder:null
            }
        },
      computed:{
        placeHolder(){
          let result=null
          if(this.answerList.length>0){
            this.answerList.forEach((value,index)=>{
              if(value.kindId==5){
                console.log(value)
                result=JSON.parse(this.answerList[index].options)[0].placeHolder
              }
            })
          }
          return result
        }
      },
        methods: {
          seeView(params,code) {
            console.log(params);
            let path = ''
            if (params == '20030') { //游戏机会(中奖记录)
              // path = '/mall2/win_record'
              this.$market.enterGamesFunc({gameTypeCode:code},true)
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
                // type: 'subject'
              }
            })
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
              paramsResult.evaluate = '满意'
            } else if (paramsResult.result == 5) {
              paramsResult.evaluate = '非常满意'
            }
          },
          closeBtn(){
            if(this.toEvaluatedNum>0){
              this.commitModel=true
              this.$router.push({
                path:'/evaluatelist'
              })
            }else{
              this.commitModel=false
            }
          },
          commit() {
            // if(this.twoFlag){
            //   this.$Toast('问卷已提交')
            //   return
            // }
            if(this.$route.query.storeName&&this.form.refuelAmount==''){
              this.$Toast('请输入金额！')
              return
            }else{
              this.sub()
            }


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
                orderNo: that.evaluateType==0?item.orderNo:that.randomId
                ,
                result: item.result?item.result.toString():''
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
            let par=Object.assign({
              resultJson: JSON.stringify(params),
              // token: this.$store.state.login.token,
              // id: that.paramsData.subId,
              id: this.$route.query.id,
              // 如果线下this.evaluateType==1 可以多次答题传随机字符串，否则传订单号
              orderId: this.$route.query.storeName?that.randomId:that.$route.query.orderId,
              refuelOrderId: that.$route.query.refuelOrderId,
              channel:that.$route.query.channel?that.$route.query.channel:'',
              channelName:that.$route.query.channelName?that.$route.query.channelName:''
              // createTime:
            },this.form)
            that.commitData(par).then(res => {
              that.$Loading.close();
              console.log(666)
              if (res.data.result === "success") {
                Toast('提交成功')
                let data = {
                  // id: that.paramsData.subId,
                  id: that.$route.query.id,
                  // token: this.$store.state.login.token,
                  // shareUserid: that.shareUserid||'',
                  orderId: that.evaluateType==0?that.$route.query.orderId:that.randomId,
                };
                that.$Loading.open();
                that.prizeData(data).then(res => {
                  that.$Loading.close();
                  if (res.data.result === "success") {
                    that.mktAwardList = res.data.data.mktAwardList || []
                    if (that.mktAwardList.length > 0) {
                      this.showFlag1=true
                      // that.commitModel = true;
                    } else {
                      this.showFlag1=false
                      // that.commitModel = false;
                      // that.$router.go(-1)
                      // that.$router.push({
                      //   path: '/submitEvaluation'
                      // })
                    }
                    this.getEvaluateOrder()

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
          // 获取未评价订单
          getEvaluateOrder: function (flag) {
            if (this.$store.state.login.token == '') {
              return;
            }
            let paramsData = {
              token: this.$store.state.login.token,
            };
            let url='/app/json/questionaire/getLatestAppraise'
            this.$http.post(url, paramsData).then(
              res => {
                let data = res.data;
                console.log(data)
                if (data.status == 0) {
                  // this.evaluateObj=data.data
                  this.limitOrderDayNum=data.data.limitOrderDayNum
                  this.toEvaluatedNum=data.data.toEvaluatedNum
                  if(!flag){
                    if(this.toEvaluatedNum>0||this.showFlag1==true){
                      this.commitModel=true
                    }else{
                      this.commitModel=false
                    }
                  }

                  this.hasPrize=data.data.hasPrize
                  // this.prize=JSON.parse(data.data.questionPrize)
                  // if(this.toEvaluatedNum){
                  //   this.evaluateShow=true;
                  // }else{
                  //   this.evaluateShow=false;
                  // }
                  // this.$store.state.mall2.myAssets = data.data
                  // this.$store.state.userInfo.levelNo = data.data.levelNo
                }else{
                  this.$Toast('请求数据出错，请稍后重试!')
                }
              },
              error => {
              }
            );
          },
        },
      created(){
        // let obj={}
        console.log(this.answerList)
        //按钮下的奖励
        this.getEvaluateOrder(true)

        // let obj=this.answerList[0].
        // this.answerList.forEach((value,index)=>{
        //  =JSON.parse(value.options)
        //   this.placeholder=
        // })
        // this.randomId=Math.random().toString(36).substr(2)
        // console.log(this)
      }

    }
</script>

<style lang="stylus" scoped>
  .score-con {
    width 100% !important
    display flex;
    justify-content flex-start
    align-items: flex-start
    margin-top 10px
    margin-bottom 10px
   label {
     width 80px
     margin-right 10px
     font-size: 13px;
     font-family: PingFangSC-Regular, PingFang SC;
     font-weight: 400;
     color: rgba(51, 51, 51, 1);
     line-height: 21px;
   }
    .evaluteBox {
      display flex;
      justify-content start;

      p {
        margin: auto 15px;
        color: #807d7d;
      }
    }

  }
  .divObj1{
    width 100%!important
    padding 0 10px
  }
  .textType{
    display block
    width 100%
    height: 60px;
    background: #F6F6F6;
    border-radius: 6px;
    padding 10px
    border none
  }
  .title{

    /*width: 84px;*/
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    margin-top 8px
    margin-bottom: 8px;
  }
  .handler{
    display flex
    flex-direction column
    justify-content center
    align-items center
    .btn{
      width 90px
      height 30px
      margin-top 20px
      margin-bottom 10px
    }
    p{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #F02C2D;
      line-height: 17px;
    }
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
      .order{
        margin 5px 5px
      }
    }
  }

</style>
