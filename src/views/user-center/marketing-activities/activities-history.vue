<template>
  <div class="body">
    <nav-top title="历史活动" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
          <ul>
            <li class="publicInvoice" v-for="item in list" v-if="list.length>0">
              <img :src="item.activityPromotionalPicReal?item.activityPromotionalPicReal:'static/image/microShop/p@2x.png'" alt="">
              <p>{{item.activityTitle}}</p>
              <p>活动时间：{{item.startDate}}-{{item.endDate}}</p>
            </li>
            <p class="tips" v-if="list.length==0">暂无数据</p>
          </ul>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api"
  export default {
    name: "activitiesList",
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

        that.historylistData(params).then(res => {
          let data = res.data.data || []
          console.log(data);
          that.list = data
        })
      },
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #app .body {
    background #f6f6f6 !important;
    ul {
      margin-top 30px;
      .publicInvoice {
        box-shadow: #f3f3f3 0px 0px 15px;
        width: 94%;
        margin: 0 auto 10px auto;
        overflow: hidden;
        background white
        border-radius 10px;
        img {
          width 100%
          height 141px;
        }
        p:nth-child(2) {
          font-size 16px;
          line-height 20px;
          margin-top 20px;
          padding-left 10px;
        }
        p:nth-child(3) {
          font-size 14px;
          color #6c6c6c
          margin 10px auto 15px 10px
        }
      }
      .tips {
        text-align: center;
        font-size: 16px;
        margin-top: 60px;
      }
    }
    .nav-content {
      overflow-y auto
    }
  }
</style>
