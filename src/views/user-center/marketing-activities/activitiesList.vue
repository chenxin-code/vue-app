<template>
  <div class="body">
    <nav-top title="活动列表" @backEvent="$router.go(-1)">
      <div class="shareBox">
        <div class="name">
          <router-link :to="{name:'user_center/activities_history'}">历史活动</router-link>
        </div>
      </div>
    </nav-top>
    <nav-content>
      <van-tabs v-model="active" @click="listData(active)">
<!--        <van-tab :title="'进行中('+list.length+')'">-->
        <van-tab :title="'进行中('+list.length+')'?'进行中('+list.length+')':'0'">
          <ul>
            <li class="publicInvoice" v-for="item in list" @click="toDetail(item)" v-if="list.length>0">
              <img :src="item.activityPromotionalPicReal?item.activityPromotionalPicReal:'static/image/microShop/p@2x.png'" alt="">
              <p>{{item.activityTitle}}</p>
              <p>活动结束时间：{{item.endDate}}</p>
            </li>
            <p class="tips" v-if="list.length==0">暂无数据</p>
          </ul>
        </van-tab>
          <van-tab :title="'下期预告('+expectList.length+')'?'下期预告('+expectList.length+')':'0'">
          <ul>
            <li class="publicInvoice" @click="toDetail(item)" v-for="item in expectList" v-if="expectList.length>0">
              <img :src="item.activityPromotionalPicReal?item.activityPromotionalPicReal:'static/image/microShop/p@2x.png'" alt="">
              <p>{{item.activityTitle}}</p>
              <p>活动开始时间：{{item.startDate}}</p>
            </li>
            <p class="tips" v-if="expectList.length==0">暂无数据</p>
          </ul>
        </van-tab>
      </van-tabs>
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
        active: 0,
        list: [],
        expectList: [],
      }
    },
    mounted() {
     // this.listindexData()
      this.yugaoIndex()
      this.loadIndex()
    },
    methods: {
      listData(data) {
        let that = this
        if (data == 0) {
          that.loadIndex()
        } else if (data == 1) {
          that.yugaoIndex()
        }
      },
      // listindexData() {
      //   let that = this
      //   if (that.active == 0) {
      //     that.loadIndex()
      //   } else if (that.active == 1) {
      //     that.yugaoIndex()
      //   }
      // },
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.activelistData(params).then(res => {
          let data = res.data.data || []
          console.log(data);
          that.list = data
        })
      },
      toDetail(paramsData) {
        console.log(paramsData);
        console.log(JSON.stringify(paramsData));
        this.$router.push({
          path: '/user_center/activities_detail',
          query: {
            activityDesc: paramsData
          }
        })
      },
      yugaoIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.yugaolistData(params).then(res => {
          let data = res.data.data || []
          console.log(data);
          that.expectList = data
        })
      },
    },
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
