<template>
  <div class="box">
    <van-popup v-model="showView" @click-overlay="closeBtn">
      <div class="boxModal" ref="elementboxModal">
        <div class="top" ref="top">
          <p>偏好选择</p>
          <span>共需选择{{answerList.length}}题，已选{{itemIndex.index}}题</span>
        </div>
        <div class="contain" :style="height">
            <div class="div2" v-if="itemIndex.topicType == 1">
              <p>{{itemIndex.index}}、{{itemIndex.title}}（单选）</p>
              <van-radio-group v-model="itemIndex.answer">
                <van-radio
                  v-for="(optionItem, index) in itemIndex.options"
                  :key="index"
                  checked-color="#f79596"
                  :name="optionItem.id"
                >{{optionsObj[index]}} 、{{optionItem.optionContent}}</van-radio>
              </van-radio-group>
            </div>
            <div class="div3" v-if="itemIndex.topicType == 2">
              <p>{{itemIndex.index}}、{{itemIndex.title}}（多选）</p>
              <van-checkbox-group v-model="itemIndex.answer">
                <van-checkbox checked-color="#f79596"
                  v-for="(optionItem, index) in itemIndex.options"
                  :key="index"
                  :name="optionItem.id"
                >{{optionsObj[index]}} 、{{optionItem.optionContent}}</van-checkbox>
              </van-checkbox-group>
            </div>
            <div class="div3" v-if="itemIndex.topicType == 3" style="display: flex">
              <p>{{itemIndex.index}}、{{itemIndex.title}}（下拉）</p>
              <div class="xiala" style="margin-left: 20px" @click="select1(itemIndex)">
                <span>{{itemIndex.name || '请选择'}}</span>
                <span class="icon iconfont mall-xiala"></span>
              </div>
              <van-action-sheet
                v-model="itemIndex.show"
                :actions="itemIndex.options"
                @select="onSelect($event,itemIndex)"
              />
            </div>
        </div>
        <div class="bottom" ref="element">
          <div class="tips">
            <p>系统将根据您的偏好为您推荐适合您的优惠活动</p>
            <div class="btn" @click="nextQuestion" v-if="!submitView">下一题</div>
            <div class="btn" @click="commit" v-else>确认提交</div>
          </div>
          <div class="upDiv"></div>
        </div>
      </div>
    </van-popup>
    <div class="closeBtn" @click="closeBtn" v-if="showView">
      <img src="static/images/design/X.png" alt="">
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "hobby",
  data() {
    return {
      showView: false,
      answerList: [],
      options: [],
      i: 0,
      actions: [],
      itemIndex: {},
      index: 1,
      optionsObj: [],
      submitView: false,
      height: {
        height: ''
      }
    };
  },
  mounted() {
    // console.log('hobbyhh',window.localStorage.getItem('hobby'),this.$store.state.globalConfig.isShowMyPrefer);
    if (window.localStorage.getItem('hobby') == 1 && this.$store.state.globalConfig.isShowMyPrefer == 1) {
      this.getLetter()
      this.getList()
    }
  },
  methods: {
    getLetter() {
      this.optionsObj = this.generateBig_1();
    },
    generateBig_1() { //获取26个大写字母
      var str = [];
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i));
      }
      return str;
    },
    closeBtn() {
      this.showView = false
      window.localStorage.setItem('hobby',0)
    },
    getList() {
      let url = "/app/json/prefer/getPreferSetList";
      let params = {
        token: this.$store.state.login.token
      };
      this.$http.post(url, params).then(res => {
        console.log(res);
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data || [];
          arr.forEach(element => {
            if (element.topicType == "2") {
              element.answer = [];
            } else {
              element.answer = "";
            }
            element.index = this.index++
            element.options.forEach(option => {
              if (option.isAnswer == "1") {
                if (element.topicType == "2") {
                  element.answer.push(option.id);
                } else {
                  element.answer = option.id;
                  element.name = option.optionContent;
                }
              }
              option.name = option.optionContent;
            });
            element.show = false;
          });
          this.answerList = arr;
          this.itemIndex = this.answerList[this.i]
          if (this.answerList.length>0) {
            this.showView = true;
            this.$nextTick(() => {
              this.height.height = this.$refs.elementboxModal.offsetHeight - this.$refs.element.offsetHeight - this.$refs.top.offsetHeight - 10 + 'px'
            });
          }
          console.log(this.answerList);
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        console.log(err)
      });
    },
    select1(item) {
      item.show = true;
    },
    onSelect(event, item) {
      item.answer = event.id;
      item.name = event.name;
      item.show = false;
    },
    nextQuestion() {
      if (this.itemIndex.topicType == "2") {
        if (!this.itemIndex.answer.length) {
          this.$Toast('当前题目还未作答！');
          return
        }
      } else {
        if (!this.itemIndex.answer) {
          this.$Toast('当前题目还未作答！');
          return
        }
      }
        this.i++
        this.itemIndex = this.answerList[this.i]
        this.disappearData()
    },
    disappearData() {
      if (this.i + 1 >= this.answerList.length) {
        this.submitView = true
      }
    },
    commit() {
      let url = "/app/json/prefer/updatePreferSet";
      let params = {
        preferSets: []
      };
      this.answerList.forEach(item => {
        let obj = {};
        obj.id = item.id;
        obj.topicType = item.topicType;
        obj.title = item.title;
        obj.options = [];
        item.options.forEach(item1 => {
          var answer =
            typeof item.answer == "number" ? String(item.answer) : item.answer;
          var itemid =
            typeof item1.id == "number" ? String(item1.id) : item1.id;
          if (String(item.answer).indexOf(String(item1.id)) > -1) {
            obj.options.push({
              id: item1.id,
              optionContent: item1.optionContent
            });
          }
        });
        params.preferSets.push(obj);
      });
      console.log(params);
      this.$Loading.open();
      this.$http.post(url, params).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          this.$Toast("保存成功");
          window.localStorage.setItem('hobby',0)
          this.showView = false;
        } else {
          this.$Toast(data.info);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.box {
  font-size: 20px;

  /deep/ .van-popup--center {
    width: 86%;
    /*padding: 20px;*/
    border-radius: 10px;
  }
 .closeBtn {
   position: absolute;
   bottom: 55px;
   width: 20px;
   height: 20px;
   z-index: 2004;
   left: 50%;
   margin-left: -10px;
   img {
     display: block;
     width: 35px;
     height: 35px;
     background-color: rgba(255,255,255,0.3);
     border-radius: 0.533333rem;
   }
 }
  .boxModal {
    height 65vh
    overflow: hidden;
    .top {
      width 100%
      height 120px
      color white
      text-align center;
      display: flex;
      flex-direction column
      justify-content: center;
      
      position: fixed;
      top: 0px;
      left: 0;
      background url("../../../static/image/microShop/shang.png") repeat center center / 100% 100%;
      p {
        margin 0 0 13px 0
      }
      span {
        font-size 16px
      }
    }
    .bottom {
      width 100%
      position: fixed;
      bottom: 0px;
      left: 0;
      .tips {
        p {
          font-size: 14px;
          text-align: center;
          color: #999999;
          margin-bottom 20px
        }
        .btn {
          text-align: center;
          height: 40px;
          line-height: 40px;
          width: 170px;
          font-size: 16px;
          background #f79596
          color: white;
          border-radius:25px;
          margin: 0 auto;
        }
      }
      .upDiv {
        background url("../../../static/image/microShop/xia.png") repeat center center / 100% 100%;
        width 100%
        height 50px
      }
    }
    .contain {
      margin-top 120px
      overflow-y auto
      scrollbar-width: none
      .div2 {
        margin-bottom: 24px;
        font-size: 15px;
        margin-left 10%

        p {
          margin-bottom: 12px;
          line-height 22px
        }

        /deep/ .van-radio {
          margin-bottom: 8px;
        }
      }
      .div1 {
        text-align: center;
        margin-bottom: 25px;
        margin-left 10%

        .iconfont {
          float: right;
        }
      }
      .div3 {
        font-size: 15px;
        margin-left 10%

        p {
          margin-bottom: 12px;
        }

        /deep/ .van-checkbox {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
