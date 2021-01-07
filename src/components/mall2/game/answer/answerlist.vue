<template>
  <div class="body">
    <nav-top title="每日答题" @backEvent="$router.go(-1)">
      <div class="shareBox">
        <div>
          <router-link to="/answerHistory">
            <i class="icon iconfont mall-dingdan"></i>
          </router-link>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="containDiv">
        <div class="contain" v-if="answerList.length>0">
          <div v-for="(item,index) in answerList">
            <div class="publicInvoice" v-if="item.serviceType == 2">
              <p class="p"><span>{{item.title}}</span><span>未答</span></p>
              <van-cell-group>
                <van-field :value="formatDate(item.createTime)" disabled label="派发时间"/>
                <van-field v-model="item.ouCode" disabled label="订单编号"/>
                <van-field v-model="item.orderType" disabled label="订单类型"/>
                <van-field v-model="validityTime" disabled label="有效期"/>
                <div class="publicInvoiceDiv" @click="detail(item.questionPrize)">
                  <van-field label="问券奖品" disabled/>
                  <span class="img">
              <img src="/static/image/invoice/arrows.png" alt>
            </span>
                </div>
                <van-field v-model="item.remark" disabled label="问券说明" class="neirong"/>
              </van-cell-group>
              <div class="answerd" @click="dati(item)"><a class="theme_bg_red">去答题</a></div>
            </div>
            <div class="publicInvoice" v-if="item.serviceType == 1">
              <p class="p"><span>{{item.title}}</span><span>未答</span></p>
              <van-cell-group>
                <van-field v-model="item.startTime" disabled label="开始时间"/>
                <van-field v-model="item.endTime" disabled label="结束时间"/>
                <div class="publicInvoiceDiv" @click="detail(item.questionPrize)">
                  <van-field label="问券奖品" disabled/>
                  <span class="img">
              <img src="/static/image/invoice/arrows.png" alt>
            </span>
                </div>
                <van-field v-model="item.remark" disabled label="问券说明" class="neirong"/>
              </van-cell-group>
              <div class="answerd" @click="dati(item)"><a class="theme_bg_red">去答题</a></div>
            </div>
          </div>
        </div>
        <div class="contain" v-if="answerList.length==0">
          <span class="emptyState">暂无列表</span>
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
            <p class="pNull"  v-if="jiangList.length==0">暂无奖品</p>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {mapGetters} from 'vuex'
  import { Toast } from 'vant'
  export default {
    name: 'answerList',
    mixins: [api],
    data () {
      return {
        url: '',
        id: '',
        detailData1: false,
        answerList: [],
        createTime: '',
        validityTime: '',
        jiangList:[],
        detailId: '',
        ouCode: ''
      }
    },
    mounted() {
      this.loadData()
      this.Intercept()
    },

    methods: {
      detail(questionPrize) {
        let that = this
        that.detailData1 = true
        if (questionPrize.indexOf('&quot') == -1) {
          let list = JSON.parse(questionPrize) || []
          list.forEach(function(item) {
            that.jiangList = that.jiangList.concat(item.activityPrize)
          })
        } else {
          that.jiangList = []
        }
        // let list = JSON.parse(questionPrize) || []
        // list.forEach(function(item) {
        //   that.jiangList = that.jiangList.concat(item.activityPrize)
        // })
      },
      dati(index) {
        let that = this
        that.detailId = index.id
        that.ouCode = index.ouCode
        console.log(111,index)
        let params = {
          id: that.detailId,
          token: this.$store.state.login.token,
          ouCode: that.ouCode
        }
        console.log(params);

        that.participateData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            that.$router.push({path: '/answer', query: {
                subId: that.detailId
              }})
          } else {
            Toast(res.data.info)
          }
        })
      },
      closeDetail() {
        this.detailData1 = false
      },
      formatDate(a) {
        var date = new Date(a)
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var date = date.getDate();
        return year+"-"+month+"-"+date
      },
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token
        };

        that.listData(params).then(res => {
          if (res.data.result) {
            that.answerList = res.data.data || []
            that.answerList.forEach(function(item) {
              console.log(item.createTime);
              var time = new Date(item.createTime);
              that.formatDate(time)
              that.createTime = that.formatDate(time)
              that.validityTime = item.startTime +'至'+ item.endTime
            })
          }
        });
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
    computed: {

    },
    components: {},
    watch: {

    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    position relative;
    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10
    }
    .containDiv {
      overflow: auto;
      height: 100%;
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
        .publicInvoice {
          box-shadow: #f3f3f3 0px 0px 15px;
          width: 95%;
          margin: 0 auto;
          margin-bottom 15px;
          border-radius 8px;
          >>> .van-cell:not(:last-child)::after {
            right: 0.4rem;
          }

          .p {
            text-align: left;
            line-height: 40px;
            font-size: 16px;
            margin  0 0.4rem;
            display flex;
            justify-content space-between;
            border-bottom: 0.5px solid #f2f2f2;
          }

          .van-cell-group {
            >>> .van-field__control {
              text-align: right;
            }

            >>> .van-field__control:disabled {
              color: #323233;
            }

            .neirong {
              >>> .van-field__control {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }

          .van-radio-group {
            display: flex;
            justify-content: space-between;
            padding: 0.266667rem 0.4rem;
            line-height: 0.64rem;
            font-size: 0.373333rem;
          }

          .publicInvoiceDiv {
            display: flex;
            justify-content: space-between;
            padding-right 0.4rem
            .img {
              width: 10px;
              line-height: 1.2rem;
              img {
                width: 100%;
                vertical-align: middle;
              }
            }
          }
          .answerd {
            height 70px;
            line-height 70px;
            margin  0 0.4rem;
            display flex;
            justify-content flex-end
            border-top: 0.5px solid #f2f2f2;
            a {
              display block;
              padding 0 15px;
              height 30px;
              line-height 30px;
              color white;
              font-size 18px;
              border-radius: 15px;
              margin-top 20px;
            }
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
        padding:20px
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
          li:last-child {
            /*border-bottom: 1px solid #dddfdf;*/
          }
        }
        .divTitle {
          position: absolute;
          top: 160px;
          right: 0.586667rem;
          width: 85%;
          margin: 0 auto;
          /* background: pink; */
          display: flex;
          justify-content: space-between;
          .title-p{
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
  >>> .van-field__label {
    width: 2rem !important
  }
  .pNull {
    width: 100%;
    text-align: center;
    font-size: 16px;
  }
</style>
