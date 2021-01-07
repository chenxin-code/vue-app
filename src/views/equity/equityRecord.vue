/**游戏权益明细*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益明细"></nav-top>
    <nav-content>
      <van-tabs v-model="active" @change="loadData">
        <van-tab title="派发记录">
          <ul>
            <li v-for="item in list"><div class="divMall"><div>{{item.name}}</div><p class="p1">{{item.useTime}}</p></div><div class="divSH">+{{item.number}}次</div></li>
          </ul>
<!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
        <van-tab title="使用记录">
          <ul>
            <li v-for="item in list">
              <div class="divMall">
                <div>{{item.name}}</div>
                <p class="p1">{{item.useTime}}</p>
              </div>
              <div class="divSH">-{{item.number}}次</div>
            </li>
          </ul>
<!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
        <van-tab title="过期记录">
          <ul>
            <li v-for="item in list"><div class="divMall"><div>{{item.name}}</div><p class="p1">{{item.useTime}}</p></div><div class="divSH">-{{item.number}}次</div></li>
          </ul>
<!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  import {Toast} from 'vant'
  // import api from './api'
  export default {
    name: "afterSale",
    // mixins: [api],
    data() {
      return {
        equityType:'',
        list:[]
      };
    },
    mounted() {
      this.equityType = JSON.parse(this.$route.query.equityType);
      this.loadData(0)
    },
    methods: {
      loadData(type){
        let paramsData = {
          token: this.$store.state.login.token,
          equityType:this.equityType,
          type:type+1
        }
        var url = '';
        if(this.equityType == 31){
          url = 'queryMyEquityQuestionaireDetail'
        }else if(this.equityType == 32){
          url = 'queryMyEquityGameDetail'
        }else if(this.equityType == 51){
          url = 'queryMyEquityThirdServiceDetail'
        }
        this.$http.post('/app/equity_member/'+url, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = data.data
          } else {
            this.$Toast('查看明细失败')
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    ul {
      margin-top 10px
      li {
        border-bottom: 1px solid #d3d3d3;
        padding: 10px 13px;
        display: flex;
        justify-content: space-between;
        font-size 16px
        .divMall {
          margin auto 0
          div {
            width 230px;
            display flex
            justify-content flex-start
            .div2 {
              color #cb020d
            }
          }
        }
        .p1 {
          font-size 14px;
          color #bcb4b4
          margin-top 10px;
        }
        .divSH {
          margin auto 0
        }

      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: #deb98c !important;
  }
  .tips {
    text-align: center;
    font-size: 16px;
    margin-top: 60px;
  }
  /deep/ .nav-content {
    overflow-y auto;
    background white
  }
</style>
