<template>
  <div class="body">
    <nav-top title="活动详情" @backEvent="$router.go(-1)">
      <div class="shareBox">
        <div class="name">
          <router-link :to="{name:'user_center/activities_record'}">参与记录</router-link>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <div class="contain">
        <div>
          <p>{{detailObj.activityTitle}}</p>
        </div>
        <div>
          <p></p>
          <p>{{detailObj.activityThemeTitle}}</p>
          <p>{{detailObj.startDate}}-{{detailObj.endDate}}</p>
        </div>
        <div>
          <p>活动描述：</p>
          <p v-html="detailObj.activityDesc"></p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "activities-detail",
    data() {
      return {
        detailObj: {},
        lastPath: ''
      }
    },
    mounted() {
      this.detailObj = this.$route.query.activityDesc
      this.lastPath = this.$route.query.lastPath
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #app .body {
    background #f6f6f6 !important;

    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10

      .name {
        margin-right 10px;
        font-size 14px;

        a {
          color black
        }
      }
    }

    .contain {
      background white;
      padding 15px

      div {
        margin 20px 0

        p {
          font-size 14px;
          color #6c6c6c
          /*margin 15px 0*/
          line-height 18px;
        }

        p:nth-child(1) {
          font-size 16px;
          color black
        }
      }
    }

    .nav-content {
      overflow-y auto
    }
  }
</style>
