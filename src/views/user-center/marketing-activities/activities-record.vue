<template>
    <div class="body">
      <nav-top title="参与记录" @backEvent="$router.go(-1)"></nav-top>
      <nav-content>
        <ul>
          <li class="liBox" v-for="item in list" v-if="list.length>0">
            <div v-for="(item1,index1) in item.mktActivityAwardRecList">
<!--              <p class="p">参与时间：{{item1.createTime}}</p>-->
              <p class="p" v-if="index1 == 0">参与时间：{{item.mktActivityAwardRecList[0].createTime}}</p>
              <div class="div" v-if="item.mktActivityAwardRecList.length>0">
                <div>
                  <span>奖品01</span>
                  <span>{{item1.awardName}}</span>
                  <span>{{item1.awardNum}}</span>
                </div>
                <div class="div" v-if="item.mktActivityAwardRecList.length==0">
                  <p>未得奖品</p>
                </div>
              </div>
            </div>
          </li>
          <p class="tips" v-if="list.length==0">暂无记录</p>
        </ul>
      </nav-content>
    </div>
</template>

<script>
  import api from "./api"
    export default {
        name: "activities-record",
      mixins: [api],
      data() {
          return {
            list: []
          }
      },
      mounted() {
          this.indexHistory()
      },
      methods: {
        indexHistory() {
          let that = this
          let params = {
            token: this.$store.state.login.token
          }

          that.recordData(params).then(res => {
            let data = res.data.data || []
            that.list = data
          })
        },
      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #app .body {
    background #f6f6f6 !important;
    .liBox {
      padding 15px
      margin 15px 0
      background white;
      .p {
        font-size 14px;
        color #6c6c6c
        padding-bottom 15px;
        padding-top 15px;
        border-bottom 1px solid #ebedf0
      }
      .div {
        margin 20px 0 15px 0
        p {
          font-size 16px;
          text-align center
        }
        div {
          margin-bottom: 15px;
          font-size: 16px;
          color: black;
          display: flex;
          text-align center
          justify-content: space-between;
          span {
            flex:1
          }
          span:nth-child(1) {
            text-align left
          }
          span:nth-child(2) {
            text-align center
          }
          span:nth-child(3) {
            text-align right
          }
        }
      }
    }
    .nav-content {
      overflow-y auto
    }
    .tips {
      text-align: center;
      font-size: 16px;
      margin-top: 60px;
    }
  }
</style>
