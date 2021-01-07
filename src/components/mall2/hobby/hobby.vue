<template>
  <div>
    <nav-top title="我的偏好" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="box" v-for="(item,index) in answerList">
        <div class="div2" v-if="item.topicType  == 1">
          <p>{{index+1}}、{{item.title}}（单选）</p>
          <van-radio-group v-model="item.answer">
            <van-radio
              v-for="(optionItem, index) in item.options"
              :key="index"
              :name="optionItem.id"
            >{{optionsObj[index]}} 、{{optionItem.optionContent}}</van-radio>
          </van-radio-group>
        </div>
        <div class="div3" v-if="item.topicType  == 2">
          <p>{{index+1}}、{{item.title}}（多选）</p>
          <van-checkbox-group v-model="item.answer">
            <van-checkbox
              v-for="(optionItem, index) in item.options"
              :key="index"
              :name="optionItem.id"
            >{{optionsObj[index]}} 、{{optionItem.optionContent}}</van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="div3" v-if="item.topicType  == 3" style="display: flex">
          <p>{{index+1}}、{{item.title}}（下拉）</p>
          <div class="xiala" style="margin-left: 5px" @click="select1(item)">
            <span>{{item.name || '请选择'}}</span>
            <span class="icon iconfont mall-xiala"></span>
          </div>
          <van-action-sheet
            v-model="item.show"
            :actions="item.options"
            @select="onSelect($event,item)"
          />
        </div>
        <div class="btnBox">
          <div class="btn" @click="commit">保存</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      answerList: [],
      options: [],
      actions: []
    };
  },
  mounted() {
    this.getList();
    this.getLetter();
  },
  methods: {
    getList() {
      let url = "/app/jqGrid/prefer/getUserPreferSetList";
      let params = {
        token: this.$store.state.login.token
      };
      this.$Loading.open();
      this.$http.post(url, params).then(res => {
        console.log(res);
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data || [];
          arr.forEach(element => {
            if (element.topicType == "2") {
              element.answer = [];
            } else {
              element.answer = "";
            }
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
          console.log(this.answerList);
        } else {
          this.$Toast(data.info);
        }
      });
    },
    getLetter() {
      this.optionsObj = this.generateBig_1();
      console.log(this.optionsObj);
    },
    generateBig_1() {
      //获取26个大写字母
      var str = [];
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i));
      }
      return str;
    },
    select1(item) {
      item.show = true;
    },
    onSelect(event, item) {
      console.log(event, item);
      item.answer = event.id;
      item.name = event.name;
      item.show = false;
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
          this.$router.go(-1);
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
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
}

.div1 {
  text-align: center;
  margin-bottom: 25px;

  .iconfont {
    float: right;
  }
}

.div2 {
  margin-bottom: 24px;
  font-size: 15px;

  p {
    margin-bottom: 12px;
  }

  /deep/ .van-radio {
    margin-bottom: 8px;
  }
}

.div3 {
  font-size: 15px;

  p {
    margin-bottom: 12px;
  }

  /deep/ .van-checkbox {
    margin-bottom: 15px;
  }
}

.btnBox {
  width: 100%;
  text-align: center;
  height: 60px;
  font-size: 14px;
  color: white;
  position: fixed;
  bottom: 0px;
  z-index: 999;
  background: white;
  left: 0;

  .btn {
    width: 80%;
    background: #169bd5;
    border-radius: 8px;
    margin: 9px auto;
    height: 40px;
    line-height: 40px;
  }
}

/deep/ .nav-content {
  overflow-y: auto !important;
}
</style>