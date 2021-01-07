<template>
  <div id="body">
    <nav-top @backEvent="$router.go(-1)" title="每日答题">
    </nav-top>
    <nav-content>
      <div class="content">
        <div class="box">
          <div class="top">
            <div class="singleList" v-if="listItem.kindId === 1">
              <span class="theme_bg_red">单选</span>
              <div class="divObj">
                <div class="titleHead">
                  <span>{{i+1}}、</span><span v-html="listItem.title"></span>
                </div>
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
                <div class="titleHead">
                  <span>{{i+1}}、</span><span v-html="listItem.title"></span>
                </div>
                <van-checkbox-group v-model="listItem.result">
                  <van-checkbox checked-color="#F80F16" v-for="(optionItem, index) in listItem.options" :key="index" :disabled="prohibit"
                                :name="optionsObj[index]">
                    {{optionsObj[index]}} 、{{optionItem.lable}}
                    <span class="correct" v-if="optionItem.rightResult === true && flag === true">正确答案</span><span
                    v-if="optionItem.rightResult === false && flag === true && listItem.result.indexOf(optionItem.code) >-1 "
                    class="wrong theme_font_red" style="margin-left: 15px">回答错误</span>
                  </van-checkbox>
                </van-checkbox-group>
              </div>
            </div>
            <div class="singleList" v-if="listItem.kindId === 3">
              <span class="theme_bg_red">图片</span>
              <div class="divObj">
                <div class="titleHead">
                  <span>{{i+1}}、</span><span v-html="listItem.title"></span>
                </div>
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
            <span @click="next" v-if="disappear"><button class="theme_bg_red">下一题</button></span>
          </div>
        </div>
        <div class="bottom">
          <div class="head">
            <div class="div1  ">当前得分：<span class="theme_font_red">{{score}}</span>分</div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {mapGetters} from 'vuex'
  import {Toast} from 'vant'
  import {Dialog} from 'vant'

  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        resultList: [],
        listItem: '',
        i: 0,
        flag: true, //正确和错误答案的提示
        prohibit: true, //禁止点击
        score: 0,
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
        actions: [],
        id: '',
        url: '',
        paramsData: ''
      }
    },
    created() {
      let that = this
      that.paramsData = that.$route.query
      console.log(1221,that.paramsData);
    },
    mounted() {
      this.loadData()
    },
    methods: {
      loadData() {
        let that = this
        let params1 = {
          id: that.paramsData.id,
          token: this.$store.state.login.token,
          // userId: '542503'
        }
        that.historydetailData(params1).then(res => {
          console.log(res);
          if (res.data.result === "success") {
            let answerList = JSON.parse(res.data.data.resultJson)
            console.log(answerList);
            console.log(res.data.data.totalScore)
            that.score = res.data.data.totalScore || 0
            console.log(that.score)
            answerList.forEach(function (item) {
              if (
                item.kindId === 1 ||
                item.kindId === 2 ||
                item.kindId === 3 ||
                item.kindId === 4
              ) {
                item.active = 0
                let list = JSON.parse(item.options) || [];
                if(item.kindId === 2){
                  item.right = []
                  // item.result = []
                  item.result = item.result.split(',') //字符串转成数组
                  list.forEach(function (itemOption, indexOption) {
                    itemOption.name = itemOption.lable;
                    itemOption.code = that.optionsObj[indexOption]
                    if (itemOption.rightResult === true) {
                      item.right.push(that.optionsObj[indexOption]) //添加一项正确答案
                    }
                  });
                  console.log(typeof item.right);
                  console.log(typeof item.result);
                  //  aa
                  if (item.right.sort().toString() === item.result.sort().toString()) {
                    item.active = 2
                    // that.score = that.score + item.score
                  } else {
                    item.active = 1
                  }
                  //  aa
                }else{
                  list.forEach(function (itemOption, indexOption) {
                    itemOption.name = itemOption.lable;
                    itemOption.code = that.optionsObj[indexOption]
                    if (itemOption.rightResult === true) {
                      item.right = that.optionsObj[indexOption] //添加一项正确答案
                      // that.score = that.score + item.score
                    }
                  });
                  if (item.result === item.right) {
                    item.active = 2
                    // that.score = that.score + item.score
                  } else {
                    item.active = 1
                  }
                }
                item.options = list;
              }
              if (item.kindId === 2) {
                // item.result = []
              } else if (item.kindId === 6) {
                item.result = Number(item.result) || 0
                // item.right = 0
              } else {
                // item.result = "";
                if (item.kindId === 4) {
                  item.show = false
                }
              }
            });
            that.answerList = answerList;
            console.log('长度',that.answerList.length);
            that.disappearData()
            console.log(99)
            console.log(that.answerList);
            that.listItem = that.answerList[that.i]
            // that.score = that.answerList[that.i].score || 0
            that.flag = true
          } else {
            console.log(res.data.info);
          }
        });
      },
      next() {
        let that = this;
        that.i++
        that.listItem = that.answerList[that.i]
        that.prohibit = true
        that.flag = true
        that.disappearData()
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
      }
    },
    computed: {},
    components: {},
    watch: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #body {
    >>> .van-checkbox__label--disabled {
      color #323233;
    }
    >>> .van-radio__label--disabled {
      color #323233;
    }
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
          border-bottom: 1px solid #dddfdf;
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
                .titleHead {
                  display flex;
                  justify-content flex-start
                }
                span {
                  line-height 24px;
                  display inline-block
                  /*color:#323233;*/
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
            justify-content flex-end
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
        li {
          height 50px;
          line-height 50px;
          border-top 1px solid #dddfdf;
          display: flex;
          justify-content: start;
          font-size 14px;
          img {
            margin-right 24px;
            vertical-align middle;
          }
        }
        li:last-child {
          border-bottom 1px solid #dddfdf
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
  >>> .van-radio__icon--checked .van-icon{
    ///* color: #e5e5e5; */
    background red;
  }
    >>> .van-radio__icon--disabled.van-radio__icon--checked .van-icon{
      color white;
    }
  >>> .van-checkbox__icon--checked .van-icon-success {
    background red;
    color white;
  }
  >>> .van-checkbox__icon--disabled .van-icon {
    border-color: white
  }
  >>> .van-radio__icon--disabled .van-icon {
    border-color white
  }
</style>
