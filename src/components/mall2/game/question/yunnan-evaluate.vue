<template>
  <div id="body">
    <nav-top @backEvent="backEvent" title="扫码评价">
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="oil-content">
          <div class="icon">
            <img src="static/image/mall2/logoItem.png" alt>
          </div>
          <div class="detail">
            <div class="title">{{$route.query.storeName}}</div>
            <!--            <div class="address">-->
            <!--              <van-icon name="location-o"/>-->
            <!--              {{$route.query.address}}-->
            <!--            </div>-->
          </div>
        </div>
        <div class="answer-con worker" v-if="answerList.length>0&&$store.state.globalConfig.questionaire_emp_subject_show=='1'">
          <div class="title-first">员工服务评价</div>
          <div v-if="!finishFlag">
            <div class="work-eva" v-if="selectEmpList.length>0">
              <div v-for="(empor,index) in selectEmpList">
                <div class="emp-top">
                  <div class="left-emp" v-if="empor.empNo">
                    {{`员工编码(${empor.empNo.slice(-2)})`}}
                  </div>
                  <div class="right-emp" @click="deleEmp(index)" v-if="!empor.init">删除</div>
                </div>
                <div class="top" v-for="(item, index) in empor.ques" :key="index">
                  <div class="singleList score" v-if="item.kindId === 8">
                    <!--            <span class="theme_bg_red">打分</span>-->
                    <div class=" score-con">
                      <!--              <div class="divObj score-con">-->
                      <!--                <span>{{item.orderNo}}、{{item.title}}</span>-->
                      <label class="title-con">{{item.title}}</label>
                      <div class="evaluteBox">
                        <van-rate
                          v-if="item.styleType === 1"
                          v-model="item.result"
                          color="#E42F46"
                          void-color="#999999"
                          @change="evaluateData1(item,index,$event,true)"
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
                        <!--                                        <p>{{item.evaluate}}</p>-->
                        <div v-if="!finishFlag">
                          <p>{{item.evaluate.explain}}</p>
                          <div class="select-con" v-if="item.result<=3">
                            <div class="select-item" v-for="(item1,index1) in item.evaluate.reasonArr" :key="index1" @click="selectReason(item1)" :class="{'cheched':item1.cheFlag}">
                              <span>{{item1.reason}}</span>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <p>{{item.evaluate1.explain}}</p>
                          <div class="select-con" v-if="item.result<=3">
                            <div class="select-item" v-for="(item1,index1) in item.evaluate1.reasonArr" :key="index1" @click="selectReason(item1)" :class="{'cheched':item1.cheFlag}">
                              <span>{{item1.reason}}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          <div v-else>
            <div class="work-eva" v-for="(empor,index) in answerList">
              <div v-if="empor.kindId==8">
                <div class="emp-top" >
                  <div class="left-emp" v-if="empor.empNo">
                    {{`员工编码(${empor.empNo.slice(-2)})`}}
                  </div>
                  <!--                  <div class="right-emp" @click="deleEmp(index)" v-if="!empor.init">删除</div>-->
                </div>
                <div class="top">
                  <div class="singleList score" >
                    <!--            <span class="theme_bg_red">打分</span>-->
                    <div class=" score-con">
                      <!--              <div class="divObj score-con">-->
                      <!--                <span>{{item.orderNo}}、{{item.title}}</span>-->
                      <label class="title-con">{{empor.title}}</label>
                      <div class="evaluteBox">
                        <van-rate
                          v-if="empor.styleType === 1"
                          v-model="empor.result"
                          color="#E42F46"
                          void-color="#999999"
                          :disabled="finishFlag"
                        />
                        <van-rate
                          v-if="empor.styleType === 2"
                          v-model="empor.result"
                          color="#25aff8"
                          icon="like"
                          void-color="#25aff8"
                          void-icon="like-o"
                          :disabled="finishFlag"

                        />
                        <van-rate
                          v-if="empor.styleType === 3"
                          v-model="empor.result"
                          color="#25aff8"
                          icon="static/image/microShop/xiaoicon.png"
                          void-color="#25aff8"
                          void-icon="smile-o"
                          :disabled="finishFlag"
                        />
                        <div>
                          <p>{{empor.explain}}</p>
                          <div class="select-con" v-if="empor.result<=3">
                            <div class="select-item" v-for="(item1,index1) in JSON.parse(empor.resultDes)" :key="index1"  :class="{'cheched':true}">
                              <span>{{item1}}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          <div class="title-end" @click="evaluateOther" v-if="!finishFlag&&countFlag">
            <!--            <div class="end-left">您可对其他员工进行评价</div>-->
            <div class="end-left">您可对其他员工进行评价</div>
            <div class="end-right"><van-icon name="arrow" /></div>
          </div>
        </div>
        <div class="text">
          <div class="top" v-for="(item, index) in answerList" :key="index">
            <div class="singleList text-con answer-con" v-if="item.kindId === 7">
              <div class="lin-con"></div>
              <span class="wall-title">{{item.title}}</span>
              <div class="">
                <van-field
                  @input="changeToast(item.result,item.limitMax)"
                  class="text-new"
                  v-model="item.result"
                  rows="2"
                  :disabled="finishFlag"
                  autosize
                  :maxlength="item.limitMax||300"
                  type="textarea"
                  placeholder="我们聆听您的宝贵意见"
                  show-word-limit
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
            <div class="singleList score answer-con" v-if="item.kindId === 6">
              <!--            <span class="theme_bg_red">打分</span>-->
              <div class=" score-con">
                <!--              <div class="divObj score-con">-->
<!--                                <span>{{item.orderNo}}、{{item.title}}</span>-->
                <label class="title-con">{{item.title}}</label>
                <div class="evaluteBox">
                  <van-rate
                    v-if="item.styleType === 1"
                    v-model="item.result"
                    color="#E42F46"
                    void-color="#999999"
                    :disabled="finishFlag"
                    @change="evaluateData(index,$event)"
                  />
                  <van-rate
                    v-if="item.styleType === 2"
                    v-model="item.result"
                    color="#25aff8"
                    icon="like"
                    void-color="#25aff8"
                    void-icon="like-o"
                    :disabled="finishFlag"
                    @change="evaluateData(index,$event)"
                  />
                  <van-rate
                    v-if="item.styleType === 3"
                    v-model="item.result"
                    color="#25aff8"
                    icon="static/image/microShop/xiaoicon.png"
                    void-color="#25aff8"
                    void-icon="smile-o"
                    :disabled="finishFlag"
                    @change="evaluateData(index,$event)"
                  />
                  <div v-if="!finishFlag">
                    <p>{{item.evaluate.explain}}</p>
                    <div class="select-con" v-if="item.result<=3">
                      <div class="select-item" v-for="(item1,index1) in item.evaluate.reasonArr" :key="index1" @click="selectReason(item1)" :class="{'cheched':item1.cheFlag}">
                        <span>{{item1.reason}}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p>{{item.evaluate1.explain}}</p>
                    <div class="select-con" v-if="item.result<=3">
                      <div class="select-item" v-for="(item1,index1) in item.evaluate1.reasonArr" :key="index1"  :class="{'cheched':true}">
                        <span>{{item1}}</span>
                      </div>
                    </div>
                  </div>
                  <!--                  <p>{{item.evaluate.explain}}</p>-->
                  <!--                  <div class="select-con" v-if="item.result<=3">-->
                  <!--                    <div class="select-item" v-for="(item1,index1) in item.evaluate.reasonArr" :key="index1" @click="selectReason(item1)" :class="{'cheched':item1.cheFlag}">-->
                  <!--                      <span>{{item1.reason}}</span>-->

                  <!--                    </div>-->
                  <!--                  </div>-->
                </div>
              </div>
            </div>
            <div class="singleList answer-con" v-if="item.kindId === 1">
              <!--            <span class="theme_bg_red">单选</span>-->
              <div class="divObj">
<!--                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
                <span class="wall-title">{{item.title}}</span>
                <van-radio-group @change="changeResult"
                                 v-model="item.result"
                >
                  <van-radio
                    :disabled="finishFlag"
                    checked-color="#25aff8"
                    v-for="(optionItem, index) in item.options"
                    :key="index"
                    :name="optionsObj[index]"
                  >{{optionsObj[index]}} 、{{optionItem.lable}}
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="singleList che-con multipleList answer-con" v-if="item.kindId === 2">
              <!--            <span class="theme_bg_red">多选</span>-->
              <div class="divObj">
<!--                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
                <span class="wall-title">{{item.title}}</span>
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
                  <van-button round type="default" size="small" v-for="(optionItem, index) in item.options" class="btn-con" :class="optionItem.flag?'select':''" @click="selectO(item.options,item,index)" :key="index" :disabled="finishFlag">{{optionItem.lable}}</van-button>
                  <!--                  <Button type="primary" shape="circle" v-for="(optionItem, index) in item.options"> {{optionItem.lable}}</Button>-->
                  <!--                  <span class="checkItem" v-for="(optionItem, index) in item.options">-->
                  <!--                    {{optionItem.lable}}-->
                  <!--                  </span>-->
                </div>
              </div>
            </div>
            <div class="singleList answer-con" v-if="item.kindId === 5">
              <!--            <span class="theme_bg_red">问答</span>-->
              <div class="divObj divObj1">
<!--                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
                <span class="wall-title">{{item.title}}</span>
                <textarea v-if="item.limitMin && !item.limitMax" class="textType" v-model="item.result"
                          style="min-height: 90px;" :placeholder="`请输入最少${item.limitMin}个字`" :disabled="finishFlag"></textarea>
                <textarea v-if="item.limitMax && !item.limitMin" class="textType" v-model="item.result"
                          style="min-height: 90px;" :placeholder="`请输入最多${item.limitMax}个字`" :disabled="finishFlag"></textarea>
                <textarea v-if="item.limitMin && item.limitMax" class="textType" v-model="item.result"
                          style="min-height: 90px;" :placeholder="`请输入${item.limitMin}到${item.limitMax}个字`" :disabled="finishFlag"></textarea>
                <textarea v-if="!item.limitMin && !item.limitMax" class="textType" v-model="item.result"
                          style="min-height: 90px;" :disabled="finishFlag"></textarea>
              </div>
            </div>
            <div class="singleList answer-con" v-if="item.kindId === 4">
              <!--            <span class="theme_bg_red">下拉</span>-->
              <div class="divObj">
<!--                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
                <span class="wall-title">{{item.title}}</span>
                <div class="xiala" @click="select1(item)">
                  <span>{{item.result || '请选择'}}</span>
                  <span class="icon iconfont mall-xiala"></span>
                </div>
                <van-action-sheet id="xialaView" v-model="item.show" :actions="item.options"
                                  @select="onSelect($event,item)" :disabled="finishFlag"/>
                <!--<van-action-sheet v-model="show" :actions="actions" @select="onSelect" />-->
              </div>
            </div>
            <div class="singleList answer-con" v-if="item.kindId === 3">
              <!--            <span class="theme_bg_red">图片</span>-->
              <div class="divObj">
<!--                <span class="wall-title">{{item.orderNo}}、{{item.title}}</span>-->
                <span class="wall-title">{{item.title}}</span>
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
                        :disabled="finishFlag"
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
        <div class="bot">
          <div class="phone" @click="servece" v-if="phone"><a :href="'tel:' + phone" >一键客服</a></div>
          <div class="bottom theme_bg_red" :class="{gray:answerList.length==0}" @click="commit" v-if="!finishFlag">提交评价</div>
        </div>
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
            <span @click="seeView(item.prizeType,item.prizeCode)">查看</span>
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
    <van-dialog v-model="workerFlag" title="员工编号" show-cancel-button class="work-con" round="true" @confirm="confirmEmp">
      <div class="content-emp">
        <div class="person-con">
          <div class="work-item" v-for="(item,index) in workerList" @click="selectOne(item,index)" :class="{'check-emp':item.empNo==empIndex}">
            <!--          <div class="work-name">{{item.realName}}</div>-->
            <div class="work-code">{{item.empNo.slice(-2)}}</div>
          </div>
          <!--         <div  class="work-item" v-show="workerList.length%4!=0" v-for="(item1,index1) in 4-workerList.length%4" :key="index1+'.'"></div>-->
        </div>
        <div class="quest" v-if="indexItem!=null">
          <div class="top" v-for="(item, index) in workerList[indexItem].ques" :key="index">
            <div class="singleList score" v-if="item.kindId === 8">
              <!--            <span class="theme_bg_red">打分</span>-->
              <div class=" score-con">
                <!--              <div class="divObj score-con">-->
                <!--                <span>{{item.orderNo}}、{{item.title}}</span>-->
                <label class="title-con">{{item.title}}</label>
                <div class="evaluteBox">
                  <van-rate
                    v-if="item.styleType === 1"
                    v-model="item.result"
                    color="#E42F46"
                    void-color="#999999"
                    @change="evaluateData1(item,index,$event,false)"
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
                  <!--                  <p>{{item.evaluate}}</p>-->
                  <p>{{item.evaluate.explain}}</p>
                  <div class="select-con" v-if="item.result<=3">
                    <div class="select-item" v-for="(item1,index1) in item.evaluate.reasonArr" :key="index1" @click="selectReason(item1)" :class="{'cheched':item1.cheFlag}">
                      <span>{{item1.reason}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eva">

        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import api from "./api";
  import {mapGetters} from "vuex";
  import rule from "@/components/mall2/game/question/rule";
  import {List, Toast} from 'vant'
  import {Dialog,Icon} from 'vant'
  import Config from '@/api/config'

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        indexItem:null,
        empIndex:null,
        selectEmpList:[],
        selectEmp:{},
        workerList:[
        ],
        workerFlag:false,
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
        details: '',// 问卷信息
        token: null,
        phone:null,
        finishFlag:false,
      };
    },
    created() {
      console.log(this.$store.state.globalConfig,'globalConfig')
      // 是否显示员工评价
      console.log(this.$store.state.globalConfig.questionaire_emp_subject_show,'globalConfig')
      // console.log(this.$util.getCookie('token'),"$utils")
      // this.token=this.$util.getCookie('token')
      let that = this
      that.paramsData = that.$route.query
      if (that.$route.query) {
        that.shareUserid = that.$route.query.shareUserid
      } else {
        that.shareUserid = ''
      }

      // this.$market.enterGamesFunc({gameTypeCode:23},true)

    },
    mounted() {
      let id
      if (this.$route.query.questionaireId) {
        id = this.$route.query.questionaireId
      } else {
        id = this.paramsData.subId || this.paramsData.id
      }
      let params = {
        id: id,
        orderId:this.$route.query.orderId,
        // token: this.$store.state.login.token,
        ouCode: this.$route.query.ouCode,
      }
      this.participateData(params).then(res => {
        this.$Loading.close();
        console.log(res);
        if (res.data.result === 'success') {
          this.loadData();
        } else {
          this.loadDataDetail()
          // Toast(res.data.info)
        }
      })
      // this.loadData();
      this.Intercept()
      this.getLetter()
      this.getEmp()
      this.getPhone()
      // this.seeView('20030','DZP000029')

    },
    methods: {
      loadDataDetail() {
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
              } else if (item.kindId === 6||item.kindId === 8) {
                item.result = Number(item.result) || 0;
                // if (item.result == 1) {
                //   item.evaluate = "非常差";
                // } else if (item.result == 2) {
                //   // item.evaluate = "差";
                //   item.evaluate = "差";
                // } else if (item.result == 3) {
                //   item.evaluate = "一般";
                // } else if (item.result == 4) {
                //   item.evaluate = "好";
                // } else if (item.result == 5) {
                //   item.evaluate = "非常好";
                // }
                // that.$set(item,'evaluate1',{})

                item.evaluate1={}
                item.evaluate1.explain=item.evaluate
                item.evaluate1.reasonArr=JSON.parse(item.resultDes)
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
            that.finishFlag=true
            that.$forceUpdate()
          } else {
          }
        });
      },
      changeToast(value,limit){
        console.log(value,limit)
        if(limit){
          if(value.length>=limit){
            this.$Toast('已超出最大字数')
          }
        }else{
          if(value.length>=300){
            this.$Toast('已超出最大字数')
          }
        }

      },
      servece(){
        //原生打电话功能//this.phone
      },
      //默认油站服务员工
      getSingleEmp(){
        this.$http.post('/app/json/questionaire/getUserEmpByEmpNo',{empNo:this.$route.query.empNo}).then((res)=>{
          if (res.data.status === 0) {
            console.log(res.data,'res')
            let questList=JSON.parse(JSON.stringify(this.answerList))
            if(res.data.data!=''){
              this.selectEmpList.push(Object.assign(res.data.data,{
                ques:questList,
                init:true
              }))
            }else{
              this.selectEmpList.push(Object.assign({},{
                ques:questList,
                init:true
              }))
            }

          } else {
            this.$Toast(res.data.info)
          }
        })
      },
      getPhone(){
        this.$http.post('/app/json/station/getStationByOuCode',{ouCode:this.$route.query.ouCode}).then((res)=>{
          if (res.data.status === 0) {
            console.log(res.data,'res')
            this.phone=res.data.data.linkPhone
          } else {
            this.$Toast(res.data.info)
          }
        })
      },
      deleEmp(index){
        this.selectEmpList.splice(index,1)
      },
      confirmEmp(){
        if(this.empIndex){
          // this.workerList[this.indexItem].resultDes=''
          this.selectEmpList=this.selectEmpList.filter((value,index)=>{
            return value.empNo!=this.workerList[this.indexItem].empNo

          })
          // console.log(num)
          //防止重复评价
          // this.selectEmpList.splice(num,1)
          this.selectEmpList.push(this.workerList[this.indexItem])
        }
      },
      selectOne(item,index){
        this.indexItem=index
        this.empIndex=item.empNo
        let questList=JSON.parse(JSON.stringify(this.answerList))
        // this.workerList[this.indexItem].ques=questList
        this.$set(this.workerList[this.indexItem],'ques',questList)

      },
      getEmp(){
        this.$http.post('/app/json/questionaire/getUserEmpList',{ouCode:this.$route.query.ouCode}).then((res)=>{
          if (res.data.status === 0) {
            console.log(res.data,'res')
            this.workerList=res.data.data
            //去掉默认员工
            if(this.workerList!=''){
              this.workerList= this.workerList.filter(value=>{
                return value.empNo!=this.$route.query.empNo
              })
            }else{
              this.workerList=[]
            }

          } else {
            this.$Toast(res.data.info)
          }
        })
      },
      selectReason(item){
        this.$set(item,'cheFlag',!item.cheFlag)
      },
      evaluateOther(){
        if(this.answerList.length==0){
          this.$Toast('该问卷已答完题！')
          return
        }
        this.indexItem=null
        this.empIndex=null
        this.workerFlag=true

      },
      changeResult(data) {
      },
      evaluateData1(item,params,num,flag){
        // item.result=num
        // this.$set(item,'result',num)
        console.log(item,params,num,'item')
        if(this.indexItem==null&&flag==false){
          this.$Toast('请选择员工')
          return
        }
        // let questList=JSON.parse(JSON.stringify(this.answerList))
        // let paramsResult = questList[params]
        // paramsResult.work=this.workerList[this.indexItem]
        // console.log(paramsResult,params,num)
        let list=JSON.parse(item.selectJson)
        list.forEach(value=>{
          if(value.fraction==num){
            item.evaluate=value
          }
        })
        item.evaluate.reasonArr.forEach((value,index)=>{
          this.$set(item.evaluate.reasonArr[index],'cheFlag',false)
        })
        // this.workerList[this.indexItem].ques=questList
        console.log( this.workerList,'this.workerList')
        // this.evaResult=paramsResult
      },
      evaluateData(params, num) {
        let paramsResult = this.answerList[params]
        console.log(paramsResult,params,num)
        let list=JSON.parse(paramsResult.selectJson)
        list.forEach(value=>{
          if(value.fraction==num){
            paramsResult.evaluate=value
          }
        })
        paramsResult.evaluate.reasonArr.forEach((value,index)=>{
          this.$set(paramsResult.evaluate.reasonArr[index],'cheFlag',false)
        })
        // if (paramsResult.result == 1) {
        //   paramsResult.evaluate = '非常差'
        // } else if (paramsResult.result == 2) {
        //   paramsResult.evaluate = '差'
        // } else if (paramsResult.result == 3) {
        //   paramsResult.evaluate = '一般'
        // } else if (paramsResult.result == 4) {
        //   paramsResult.evaluate = '好'
        // } else if (paramsResult.result == 5) {
        //   paramsResult.evaluate = '非常好'
        // }
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
      seeView(params,code) {
        console.log(params);
        let path = ''
        if (params == '20030') { //游戏机会(中奖记录)
          // path = '/mall2/win_record'
          // let url=window.location.href;
          // url.replace()
          //跳游戏
          // code='ZJD000108'
          // window.location.href=""
          this.$market.enterGamesFunc({gameTypeCode:code},true)
          return
        } else if (params == '20010') { //enterGamesFunc返利红包
          path = '/usercenter/rebatebonus'
        } else if (params == '20020') { //积分
          path = '/mall2/integralinfo'
        } else if (params == '20001') { //优惠券
          path = this.$store.state.globalConfig.questionaire_prize_coupon_list || '/coupon_list'
          if (path.indexOf('uhuitong.com') != -1) {
            console.log(path,'path')
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
        let ouCode = ""
        if (that.$route.query.questionaireId) {
          id = that.$route.query.questionaireId
        } else {
          id = that.paramsData.subId || that.paramsData.id
        }
        ouCode = that.$route.query.ouCode
        let params1 = {
          id: id,
          // token: this.$store.state.login.token,
          ouCode: ouCode
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
              } else if (item.kindId === 6||item.kindId === 8) {
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
            that.answerList.forEach((value, index, arr) => {
              if (value.kindId == 2) {
                value.options.forEach((value1, index1, arr1) => {
                  that.$set(that.answerList[index].options[index1], "flag", false)
                })
              }
            })
            //分享
            that.shareTitle = res.data.data.shareTitle
            that.shareContent = res.data.data.shareContent
            that.shareImgUrl = res.data.data.shareImgUrl
            if(this.$route.query.empNo){
              this.getSingleEmp()
            }else{
              let questList=JSON.parse(JSON.stringify(this.answerList))
              this.selectEmpList.push(Object.assign({},{
                ques:questList,
                init:true
              }))
            }

          } else {
            console.log(res.data.info);
          }
        });
      },
      select1(item) {
        if(!this.finishFlag){
          item.show = true
        }

      },
      commit() {
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
        let throttle = true
        let params = [];
        let empList=[]
        that.answerList.forEach(function (item) {
          console.log(item)
          item.resultDes=[]
          if(item.kindId==6){
            if(item.result==3||item.result==2||item.result==1){
              if(item.evaluate.reasonArr.length>0){
                item.evaluate.reasonArr.forEach(val=>{
                  if(val.cheFlag){
                    item.resultDes.push(val.reason)
                  }
                })
              }
            }

          }

          if(item.kindId!=8){
            params.push({
              mustAnswer:item.mustAnswer,
              kindId: item.kindId,
              configId: item.configId,
              subjectId: item.id,
              kindName: item.kindName,
              options: item.options,
              // options: item.result,
              title: item.title,
              styleType: item.styleType,
              orderNo: item.orderNo,
              // result: item.result.toString(),
              result: item.kindId==7?(item.result):(item.result||5),
              // resultDes:JSON.stringify(item.resultDes)
              resultDes:item.resultDes
              // result: JSON.stringify(item.result)
            });
          }

        });

        this.selectEmpList.forEach((value,index)=>{
          console.log(value,'value')
          value.ques.forEach((value1,index1)=>{
            if(value1.kindId==8){
              if(value1.evaluate.reasonArr){
                value1.resultDes=[]
                value1.evaluate.reasonArr.forEach((value2)=>{
                  if(value2.cheFlag){
                    value1.resultDes.push(value2.reason)
                  }
                })
              }
              empList.push({
                mustAnswer:value1.mustAnswer,
                empNo:value.empNo,
                empName:value.realName,
                kindId: value1.kindId,
                configId: value1.configId,
                subjectId: value1.id,
                kindName: value1.kindName,
                options: value1.options,
                // options: item.result,
                title: value1.title,
                styleType: value1.styleType,
                orderNo: value1.orderNo,
                result: value1.result||5,
                // result: value1.result.toString(),
                // resultDes:JSON.stringify(value1.resultDes)
                resultDes:value1.resultDes
              })
            }
          })


        })
        params.push(...empList)
        params.forEach(function (item) {
          if (item.mustAnswer == 1 && item.result == '') {
            throttle = false
          }
        })
        if (!throttle) {
          Toast('您还有必答题尚未答完，请先答完必答题！');
          // Toast('第'+(index+1)+'题是必答题');
          return;
        }
        // console.log(params, "params")
        // let throttle = true
        // that.answerList.forEach(function (item) {
        //   if (item.mustAnswer == 1 && item.result == '') {
        //     throttle = false
        //   }
        // })
        // if (!throttle) {
        //   Toast('您还有必答题尚未答完，请先答完必答题！');
        //   // Toast('第'+(index+1)+'题是必答题');
        //   return;
        // }
        let numLimit = true
        that.answerList.forEach(function (item, index) {
          if (item.kindId == 5) {
            if (item.limitMin && !item.limitMax) {
              if (item.result.length < item.limitMin) {
                // that.tip = '第' + (index + 1) + '题简答题最少输入' + item.limitMin + '个字'
                that.tip = '简答题最少输入' + item.limitMin + '个字'
                numLimit = false
              }
            }
            if (item.limitMax && !item.limitMin) {
              if (item.result.length > item.limitMax) {
                that.tip = '简答题最多输入' + item.limitMax + '个字'
                numLimit = false
              }
            }
            if (item.limitMin && item.limitMax) {
              if ((item.result.length >= item.limitMin) && (item.result.length <= item.limitMax)) {
                numLimit = true
              } else {
                that.tip = '简答题字数限制在' + item.limitMin + '至' + item.limitMax + '之间'
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
        // return
        that.commitData({
          resultJson: JSON.stringify(params),
          // token: this.$store.state.login.token,
          // id: that.paramsData.subId,
          id: that.paramsData.id,
          orderId: that.paramsData.orderId,
          ouCode: that.paramsData.ouCode,
          channel:that.$route.query.channel?that.$route.query.channel:'',
          channelName:that.$route.query.channelName?that.$route.query.channelName:''
        }).then(res => {
          that.$Loading.close();
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
                  window.location.reload()
                }
              } else {
                that.commitModel = false;
                // that.$router.go(-1)
                window.location.reload()
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
      selectO(list, item, indexInit) {
        var indexCurrent = null
        console.log(list, item, indexInit)
        this.answerList.forEach((value, index, arr) => {
          if (value.id == item.id) {
            console.log(value, "value")
            indexCurrent = index
            value.options.forEach((value1, index1, arr1) => {
              console.log(value1, "value1")
              if (list[indexInit].name == value1.name) {
                console.log(this.answerList[index].options[index1])
                this.$set(this.answerList[index].options[index1], "flag", !this.answerList[index].options[index1].flag)
              }
            })
          }
        })
        this.answerList[indexCurrent].result = [];
        this.answerList[indexCurrent].options.forEach((value, index, arr) => {
          if (value.flag) {
            // this.answerList[indexCurrent].result.push(value)
            this.answerList[indexCurrent].result.push(this.optionsObj[index])
          }
        })

      },
    },
    computed: {
      countFlag: function () {
        if(Number(this.$store.state.globalConfig.questionaire_emp_select_num)-(this.selectEmpList.length-1)>0){
          return true
        }else{
          return false
        }
      }
    },
    components: {
      [Icon.name]: Icon,
      [Dialog.name]: Dialog,
    },
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #body {
    .evaluteBox {
      display flex;
      justify-content start;
      flex-direction column

      p {
        font-size:11px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(144,144,144,1);
        line-height:21px;
        margin-top 5px
        margin-bottom 5px
      }
      .select-con{
        display flex
        justify-content flex-start
        flex-wrap wrap
        .select-item{
          height:25px;
          background:rgba(242,242,242,1);
          border-radius:20px;
          margin-right 5px
          padding 2px 10px
          display flex
          justify-content center
          align-items center
          border:1px solid transparent
          flex-wrap wrap
          margin-top 5px
          span{
            display block
            font-size:11px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:#333333
            line-height:21px;
          }
        }
        .cheched.select-item{
          background:rgba(228,47,70,0.1);
          border-radius:20px;
          border:1px solid rgba(228,47,70,1);
          span{
            display block
            font-size:11px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(228,47,70,1);
            line-height:21px;
          }
        }
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
      /*margin-bottom: 70px;*/
      background: #f5f5f5

      .content {
        /*width: 96%;*/
        margin: 0 auto;
        background: rgba(245, 245, 245, 1);
        padding-top 0.1px

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
              width: 100%;

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
                margin: 15px auto;
                border: 0;
                background: #efefef;
                border-radius: 8px;
                width: 96%;
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
          /*position: fixed;*/
          /*bottom: 0;*/
          /*left: 0;*/
          /*right 0*/
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
      background transparent

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

  .oil-content {
    /*height:70px;*/
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin 10px 12px
    padding 10px
    display flex
    justify-content flex-start
    /*height:80px*/

    .icon {
      /*width:25%*/

      img {
        width: 48px;
        height: 48px;
        background: rgba(245, 245, 245, 1);
        border-radius: 5px;
        border: 1px solid rgba(221, 221, 221, 1);
      }
    }

    .detail {
      margin-left 10px
      display flex
      justify-content center
      align-items center
      /*width:75%*/

      .title {
        /*width:60%*/
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
        /*margin-bottom 9px*/
      }

      .address {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 17px;
      }
    }
  }

  .answer-con {
    margin 10px 12px
    padding 20px 16px
    background white
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }

  .score-con {
    /*width 100% !important*/
    display flex;
    justify-content flex-start
    align-items: flex-start
    margin-top 5px
    margin-bottom 5px

    label {
      /*margin-right 40px*/
      /*max-width  80px*/
      width 80px
      margin-right 10px
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;
    }
  }

  .lin-con {
    height 1px
    margin: 0 14px
    backgroud: #DDDDDD
  }

  .text-con {
    /*width 100%*/
    display block !important
  }

  .checkItem-con {

    /*display flex;*/
    /*justify-content space-between*/

    .checkItem {
      height: 30px;
      background: rgba(242, 242, 242, 1);
      border-radius: 20px;
      padding 5px 13px
      color #333333
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;
    }
  }

  .btn-con {
    margin-right 10px
    height 30px
    margin-bottom 10px
  }

  .che-con {
    /*width: 100% !important*/
  }

  .select {
    background: rgba(228, 47, 70, 0.1);
    border-radius: 20px;
    border: 1px solid rgba(228, 47, 70, 1);

    .van-button__text {
      color: #E42F46
    }
  }

  .che-con {
    margin-top 10px
    margin-bottom 10px
  }

  textarea {
    border 1px solid #ccc
    line-height: 24px;
    padding: 10px;
    margin: 15px 0;
    /*border: 0;*/
    background: #efefef;
    border-radius: 8px;
  }

  .theme_bg_red {
    border-radius 10px
    background #E42F46
  }
  .nav-content{
    background: #f5f5f5;
  }
  .bot{
    height: 72px;
    background: #f5f5f5;
    /*position: fixed;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    .phone{
      font-size:15px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(144,144,144,1);
      line-height:21px;
      margin 0 auto
      margin-bottom 15px
      text-align center
    }
  }
  .title-first{
    font-size:13px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:19px;
    padding-bottom 15px
    margin-bottom 15px
    border-bottom .5px solid #DDDDDD
  }
  .title-end{
    font-size:13px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:19px;
    padding-top 15px
    /*margin-bottom 15px*/
    border-top .5px solid #DDDDDD
    display flex
    justify-content space-between
    align-items center
  }
  .text-new{
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 8px 0px rgba(0,0,0,0.1);
    border-radius:5px;
    margin 10px 12px
  }
  .van-cell{
    width initial
  }
  .work-con{
    /*margin 93px 33px*/
    width 310px
    padding 15px
  }
  .person-con{
    display flex
    justify-content flex-start
    flex-wrap wrap
    .work-item{
      width:65px;
      height:45px;
      background:rgba(242,242,242,1);
      border-radius:5px;
      padding 5px 12px
      margin-bottom 5px
      margin-top 5px
      margin-left 5px
      display flex
      justify-content center
      align-items center
      .work-name{
        text-align center
        font-size:13px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:18px;
      }
      .work-code{
        text-align center
        font-size:13px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        line-height:18px;
        color:#909090
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .check-emp{
      background:rgba(228,47,70,0.1);
      border-radius:5px;
      border:1px solid rgba(228,47,70,1);
      .work-name{
        color: #E42F46
      }
      .work-code{
        color: #E42F46
      }
    }
  }
  .content-emp{
    max-height 400px
    overflow-y scroll
  }
  .quest{
    padding-top 30px
    padding-bottom 30px
    border-top 1px solid #dddddd
    border-bottom 1px solid #dddddd
  }
  /deep/.work-con .van-button{
    width:130px;
    height:40px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    border:1px solid rgba(228,47,70,1);
    margin-top 15px
    display: flex;
    justify-content: center;
    align-items: center;
    flex initial
    width 125px
    .van-button__text{
      /*line-height 40px*/
      color:#E42F46
    }
  }
  /deep/ .work-con .van-dialog__confirm{
    width:135px;
    height:40px;
    background:rgba(228,47,70,1);
    border-radius:20px;
    .van-button__text{
      /*line-height 40px*/
      color:white
    }
  }
  /deep/.van-dialog__footer--buttons{
    justify-content space-between
    padding 2px
  }
  .emp-top{
    display flex
    justify-content space-between
    .left-emp{
      font-size:13px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:19px;
    }
    .right-emp{
      font-size:13px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(228,47,70,1);
      line-height:19px;
    }
  }
  /deep/.van-rate__item:not(:last-child){
    margin-right 10px
  }
  .title-con{
    width 68px
  }
  /deep/.van-popup--center{
    border-radius 10px!important
  }
  /deep/.van-dialog__footer{
    justify-content space-between
  }
</style>
