/**Created by steven on 2019/1/12.*/

<template>
  <div class="list">
    <nav-top @backEvent="backEvent">
      <div v-if="dataList.length > 0" class="right-btn"
           style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="setIsEditting">
        {{isEditing?'完成':'编辑'}}
      </div>
    </nav-top>
    <nav-content>
      <div :class="{'show-btns': isEditing}" class="scroll-div" ref="scrollContainer">
        <div v-for="(item, idx) in dataList" @click="toDetail(item)" :key="idx">
          <mt-cell-swipe :right="[{
                                  content: '删除',
                                  style: { padding: '20px 30px', background: '#F80F16', color: 'white',display: 'flex',alignItems: 'center',},
                                  handler: () => _deleteMsgView(item)
                                }]">
            <div slot="title" style="width: 100%;display: flex;text-align: center;">
              <div class="left-select" v-if="isEditing" @click.stop="selectItem(item, idx)">
                <i v-if="item.selected == true" class="iconfont mall-xuanzhong theme_font_red"></i>
                <i v-if="item.selected != true" class="iconfont mall-weixuanzhong theme_font_tint"></i>
              </div>
              <div class="list-item">
                <div class="line-div">
                  <p class="font-large">{{item.sketch}}</p>
                  <p class="font-small theme_font_tint">{{item.appSendTime}}</p>
                </div>
                <div class="mrgt">
                  <p class="font-small theme_font_tint single-line">{{formatContent(item.content)}}</p>
                </div>
              </div>
            </div>
          </mt-cell-swipe>
        </div>
      </div>
      <div class="bottom-btns" v-if="isEditing">
        <div class="btn" @click="_deleteSelectedMsg">删除选中</div>
        <div class="btn" @click="_deleteAllMsg">全部删除</div>
      </div>
    </nav-content>
    <div class="card" v-show="mesView">
      <van-popup :close-on-click-overlay="false" class="popupCard" v-model="mesView">
        <div class="popupCardText">
          是否删除消息？
        </div>
        <div class="popupCardBtn">
          <span @click="mesView = false">取消</span>
          <span @click="_deleteMsg">删除</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
  import {CellSwipe} from 'mint-ui'

  export default {
    name: "list",
    components: {
      CellSwipe
    },
    data() {
      return {
        isEditing: false,
        dataList: [],
        msgType: '',
        scrollPosition: 0,
        mesView: false, //删除消息弹框
        paramsData: null
      }
    },
    activated() {
      this.$refs.scrollContainer.scrollTop = this.scrollPosition
    },
    methods: {
      formatContent(str) {
        return str.slice(0, str.indexOf('[BUTTON'))
      },
      selectItem: function (item, idx) {
        item.selected = !item.selected;
        this.dataList.splice(idx, 1, item)
      },
      setIsEditting: function () {
        this.isEditing = !this.isEditing
      },
      _deleteSelectedMsg: function () {
        let arr = [];
        for (let i = 0; i < this.dataList.length; i++) {
          let item = this.dataList[i]
          if (item.selected == true) {
            arr.push({
              id: item.id,
              msgType: this.msgType
            })
          }
        }
        if (arr.length > 0) {
          this.paramsData = {
            token: this.$store.state.login.token,
            msgUserModelList: arr
          };
          this.mesView = true
        }
      },
      _deleteAllMsg: function () {
        this.paramsData = {
          token: this.$store.state.login.token,
          msgUserModelList: [{
            msgType: this.msgType
          }]
        };
        this.mesView = true
      },
      _deleteMsgView(item) {
        this.paramsData = {
          token: this.$store.state.login.token,
          msgUserModelList: [{
            id: item.id,
            msgType: this.msgType
          }]
        };
        this.mesView = true
      },
      _deleteMsg: function () {
        this._deleteRequest(this.paramsData)
      },
      _deleteRequest: function (params) {
        let url = '/app/json/message/delAnyMsg';
        this.$Loading.open();
        this.$http.post(url, params).then(
          res => {
            let data = res.data;
            this.$Loading.close();
            if (data.status == 0) {
              this.isEditing = false;
              this.mesView = false
              this.getList();
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      toDetail: function (item) {
        this.$router.push({
          name: '消息详情',
          params: item
        })
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      getList: function () {
        this.$Loading.open();
        let url = '/app/json/message/getUnreadMsgModel';
        let paramsData = {
          token: this.$store.state.login.token,
          msgType: this.msgType
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            this.$Loading.close();
            if (data.status == 0) {
              this.dataList = data.data.msgModels
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path != '/usercenter/msgdetail') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    created() {
      this.msgType = this.$route.query.msgType;
      this.getList();

      this.$nextTick(() => {
        this.$refs.scrollContainer.addEventListener('scroll', (e) => {
          this.scrollPosition = this.$refs.scrollContainer.scrollTop
        })
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/common/stylus/variable.styl"
  .list {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      overflow auto
      -webkit-overflow-scrolling touch

      .left-select {
        padding 24px 10px;
      }

      .list-item {
        flex 1;
        width 100%;
        padding 12px 0px
        border-bottom 1px solid $color-line-gray-l
        color #1a1a1a;

        .line-div {
          width 100%;
          display flex
          justify-content space-between
          align-items center
        }

        .mrgt {
          width 100%;
          margin-top 8px
          display block;
          position relative;
          height 16px;

          p {
            padding 1px 0;
            position absolute;
            display block;
            width 100%;
          }
        }

        .font-large {
          font-size $font-size-large
        }

        .font-small {
          font-size $font-size-small
        }
      }

      &.show-btns {
        bottom 40px;
      }
    }

    .bottom-btns {
      position absolute;
      bottom 0px;
      left 0px;
      right 0px;
      display flex;
      align-items center;
      justify-content space-between;
      background-color #fafafa;
      border-top 0.5px solid #ddd;

      .btn {
        padding 10px;
        line-height 20px;
        color blue;
      }
    }
  }
  .card {
    /deep/ .van-popup {
      width: 76%;
      font-size: 16px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popupCard {
      height: 120px;
      flex-direction: column;
      line-height: 26px;

      .popupCardText {
        margin-bottom 50px
      }

      .popupCardBtn {
        width: 100%;
        color: #000;
        height: 50px;
        display: flex;
        justify-content: center;
        font-size 16px
        position fixed
        bottom: 0

        span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        > :last-child {
          color #fff;
          background-color #f02e2c
        }
      }
    }
  }
</style>
