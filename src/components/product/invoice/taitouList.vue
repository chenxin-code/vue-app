<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="查看抬头">
      <div class="header-btn"  v-if="fromPage =='recharge'">
        <router-link :to="{path:'/taitou',query:{type:0}}">添加</router-link>
      </div>
    </nav-top>
    <nav-content>
      <div class="publicInvoice" v-for="(item,index) in listData" :key="index">
        <div class="operation" @click="exhibition1Detail(item)">
          <div class="operationImg">
            <div class="div1" v-if="item.titleType === 4">
              <img src="static/image/invoice/icon2.png" alt>
            </div>
            <div class="div1" v-if="item.titleType === 5">
              <img src="static/image/invoice/icon1.png" alt>
            </div>
            <div class="titleContent">
              <span class="titleMessage">{{item.title}}</span>
              <span>{{item.orgTaxNo}}</span>
            </div>
            <span class="theme_bg_red operationSpan" v-if="item.defaults == 1">默认</span>
          </div>
          <div class="mall-jiantou">
            <span v-if="fromPage =='recharge'" class="iconfont mall-bianji" @click.stop="exhibition1Detail(item, 1)"></span>
            <span v-else class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Config from "@/api/config";
  import wxfunc from '@/utils/wxfunc'
  import api from './api'
  import {mapMutations} from 'vuex'

  export default {
    name: "taitouList",
    mixins: [api],
    data() {
      return {
        listData: [],
        fromPage: '' // 页面来源
      }
    },
    created() {
      this.fromPage = this.$route.query.fromPage
    },
    mounted() {
      this.loadData()
    },
    methods: {
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token
        };
        that.riseData(params).then(res => {
          if (res.data.result) {
            that.listData = res.data.data || []
          }
        });
      },
      exhibition1Detail(item, type) {
        console.log(item);
        if (type === 1 || this.fromPage !='recharge') {
          this.$router.push({
            path: "/assistantindex_detail",
            query: {
              id: item.id,
              fromPage: this.$route.query.fromPage
            }
          })
        } else {
          this.setUserInvoice(item)
          this.$bridgefunc.vuexStorage()
          this.$router.back()
        }
      },
      ...mapMutations(['setUserInvoice'])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header-btn{
    font-size: 12px;
    position: absolute;
    right: 15px;
    a{
      color: #000!important
    }
  }
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;
    overflow: hidden;

    .operation {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 15px 0px 0 0;
      /*border-bottom: 1px solid #ebedf0;*/

      .operationImg {
        line-height: 30px;
        display: flex;
        font-size: 14px;
        justify-content: space-between;

        .img {
          margin-top 7.5px;
        }

        .titleMessage {
          font-size 16px;
        }

        .titleContent {
          display flex
          flex-direction: column;
          flex 1
        }

        .div1 {
          width: 30px;
          margin-right: 15px;
          border-radius: 50%;

          img {
            width: 100%;
            /*vertical-align: middle;*/
          }
        }
      }

      .mall-jiantou {
        padding-left 6px;

        span {
          margin-top 8px;
          display inline-block
        }
      }

      .operationSpan {
        padding: 0 15px;
        border-radius: 12px;
        color: #fff;
        line-height: 25px;
        height: 25px;
        font-size: 14px;
        display: inline-block;
      }

      .teDiv {
        line-height: 30px;
      }

      .operationDiv {
        line-height: 30px;
        /*height: 25px;*/
        font-size: 14px;

        span {
          margin: 0 6px;
          font-size 16px;
          color #787878
        }
      }
    }

    .te {
      border-bottom: none;
    }

    .maDiv {
      padding-bottom 10px;

      p {
        text-align: center;
        color: #787878;
        font-size 14px;
        margin-top: 0.3rem;
      }

      .ma {
        width: 150px;
        height: 150px;
        margin: 10px auto 10px auto;

        /deep/ .qrcode {
          width: 150px !important;
          height: 150px !important;
        }
      }
    }

    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }

    .borDiv:not(:last-child)::after {
      border-bottom: 0;
    }

    .fa {
      /deep/ .van-field__control {
        text-align: right;
      }
    }

    .nei {
      /deep/ .van-field__control {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .publicInvoice .operation .operationSpan {
    padding: 0 10px;
    border-radius: 12px;
    color: #fff;
    line-height: 20px;
    height: 20px;
    font-size: 14px;
    display: inline-block;
    margin: 5px 10px;
  }
</style>
