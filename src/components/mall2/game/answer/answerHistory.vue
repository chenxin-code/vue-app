<template>
  <div class="body">
    <nav-top title="历史记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="containDiv">
        <div class="contain" v-if="answerList.length>0">
          <div v-for="(item,index) in answerList">
            <div v-if="item.serviceType === 1">
              <p class="time"><span></span>{{item.createTime}}<span></span></p>
              <div class="publicInvoice" @click.stop="answers(item)">
                <div class="them">
                  <p class="p"><span>{{item.title}}</span></p>
                  <div class="prize" @click.stop="detail(item.questionPrize)">
                    <span>查看活动奖品</span>
                    <img src="../../../../../static/image/microShop/arrow.png" alt>
                  </div>
                </div>
                <img class="complete" src="../../../../../static/image/microShop/p1.png" alt="">
<!--                <img class="complete" src="/static/image/invoice/p2.png" alt="">-->
              </div>
            </div>
          </div>
        </div>
        <div v-if="showView">
          <div class="contain" v-if="answerList.length==0">
            <span class="emptyState">暂无历史记录</span>
          </div>
        </div>
      </div>
      <!--明细弹框-->
      <div class="detailModal" v-if="detailData1">
        <div class="detailDiv">
          <div class="divTitle">
            <p class="title-p">问卷奖品</p>
            <div class="closeBtn" @click="closeDetail">
              <img src="static/image/invoice/close-btn.png" alt="">
            </div>
          </div>
          <ul>
            <li v-for="(item,index) in jiangList" :key="index" v-if="jiangList.length>0">
              <img :src="item.prizeImgUrl" alt>
              <span>{{item.prizeName}}</span>
              <span>{{item.prizeNum}}</span>
            </li>
            <p class="pNull" v-if="jiangList.length==0">暂无奖品</p>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {mapGetters} from 'vuex'
  import {Toast} from 'vant'

  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        url: '',
        id: '',
        showView: false,
        detailData1: false,
        answerList: [],
        createTime: '',
        validityTime: '',
        jiangList: [],
        detailId: ''
      }
    },
    mounted() {
      this.loadData()
      this.Intercept()
    },

    methods: {
      detail(questionPrize) {
        this.detailData1 = true
        let list = JSON.parse(questionPrize) || []
        let that = this
        list.forEach(function (item) {
          that.jiangList = that.jiangList.concat(item.activityPrize)
        })
      },
      closeDetail() {
        this.detailData1 = false
      },
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token
        };
        that.historyData(params).then(res => {
          if (res.data.result) {
            this.showView = true
            that.answerList = res.data.data || []
            that.answerList.forEach(function (item) {
              that.validityTime = item.questionStartTime + '至' + item.questionEndTime
            })
          }
        });
      },
      answers(index) {
        let that = this
        that.detailId = index.configId
        that.$router.push({
          path: '/answerDetail',
          query: {
            id: that.detailId
          }
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
  .body {
    position relative;

    .containDiv {
      overflow auto
      height 100%;

      .contain {
        height 100%;
        overflow-y auto;

        .emptyState {
          width: 100%;
          height: 100%;
          background: #f3f3f3;
          display: block;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          line-height: 500px;
        }
        .time {
          font-size: 16px;
          text-align: center;
          padding: 6px;
          display: flex;
          color #616161
          justify-content: center;
          span {
            width: 50px;
            display: inline-block;
            height: 1px;
            margin auto 5px
            background: #616161;
          }
        }
        .publicInvoice {
          box-shadow: #ececec 0px 0px 10px;
          width: 95%;
          margin: 10px auto 15px auto;
          border-radius: 8px;
          padding 10px
          display flex
          justify-content space-between
          .them {
            display flex
            flex-direction column
            .p {
              font-size 16px
              padding 6px 0
              margin auto 0
            }
            .prize {
              display: flex;
              font-size: 15px;
              padding 6px 0
              margin auto 0
              color #656565
              span {
                margin auto 0
              }
              img {
                margin auto 10px
                width 10px
              }
            }
          }
          .complete {
            width 60px
            margin auto 0
          }
        }

      }
    }

    .detailModal {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
      overflow: hidden;
      z-index 99;

      .detailDiv {
        width: 90%;
        margin: 150px auto;
        background white;
        padding: 20px
        font-size 12px;
        line-height 22px;
        border-radius 5px;

        ul {
          margin-top 50px

          li {
            font-size 16px;
            border-top: 1px solid #dddfdf;
            display flex
            padding 15px 0
            line-height 22px;
            justify-content space-between

            img {
              width: 40px;
              height: 40px;
              margin-right: 24px;
              vertical-align: middle;
            }

            span {
              margin auto
            }

            span:nth-child(3) {
              margin-left 20px;
            }
          }
        }

        .divTitle {
          position: absolute;
          top: 160px;
          right: 0.586667rem;
          width: 85%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;

          .title-p {
            width 92%
            text-align center
            font-size: 16px;
            margin auto
          }

          .closeBtn {
            width: 8%;
            border-radius: 50%;
            border: none;

            img {
              width 100%
            }
          }
        }

        .div1 {
          display flex;
          justify-content space-between
          height 1.2rem;
          line-height 1.2rem
          border-bottom 1px solid #ebedf0

          input {
            background transparent;
          }
        }
      }
    }
  }
  .pNull {
    width: 100%;
    text-align: center;
    font-size: 16px;
  }

  /deep/ .van-field__label {
    width auto !important
  }
</style>
