<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="线下活动"></nav-top>
    <nav-content>
      <div class="box" v-for="(item,index) in activityList" :key="index">
        <img :src="item.activityPic ? item.activityPic : 'static/image/microShop/up.png'" alt="">
        <div class="div1">
          <div class="active">
            <p>活动名称：{{item.activityName}}</p>
            <div>
              <span>{{item.activityStartTime}}</span>
              <span>报名人数：{{item.attendNumber}}</span>
            </div>
          </div>
          <div class="sign">
            <span @click="detail(item.id)">快来报名</span>
<!--            <span>报名已结束</span>-->
          </div>
        </div>
      </div>
      <div v-show="titleView">
        <p class="nullData" v-show="activityList.length==0">暂无活动</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        activityList: [],
        titleView: false,
      }
    },
    created() {
      let params = {
        token: this.$store.state.login.token
      }
      this.$http.post('/app/json/app_under_line_activity/underLineActivity', params).then(res => {
        console.log(res);
        if (res.data.result == 'success') {
          this.titleView = true
          this.activityList = res.data.data || []
        }
      })
    },
    methods: {
      detail(id) {
        this.$router.push({
          path: '/offline_activities/sign_up',
          query: {
            id: id
          }
        })
      },
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .box {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 1px 2px 1px rgba(197, 197, 197, 0.3);
      margin 0 5px 20px 5px
      img {
        width 100%
      }

      .div1 {
        display flex
        justify-content space-between
        width 94%
        margin 15px auto

        .active {
          p {
            font-size: 16px;
            margin-bottom: 7px;
          }

          div {
            font-size: 14px;
            color: #a5a5a5;
          }
        }

        .sign {
          margin auto 0

          span {
            color: #ef2b2c;
            border: 1px solid #ef2b2c;
            padding: 5px 9px;
            border-radius: 13px;
          }
        }
      }

    }
  }

  /deep/ .nav-content {
    overflow-y: auto;
  }
  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }
</style>
