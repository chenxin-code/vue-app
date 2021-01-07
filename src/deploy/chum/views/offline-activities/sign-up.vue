<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="线下活动"></nav-top>
    <nav-content>
      <h1>活动名称：{{activiteDetail.activityName}}</h1>
      <p class="time" v-if="activiteDetail.state == false">{{activiteDetail.activityStartTime}}
        报名人数：{{activiteDetail.attendNumber}}</p>
      <p class="contact" v-html="activiteDetail.activityDesc"></p>
      <div class="bottom">
        <div class="singDiv" v-if="activiteDetail.state == false" @click="sign">报名参加</div>
        <div class="singDiv singDivd" v-if="activiteDetail.state == true">
          <span>我已报名</span>
          <span>（{{activiteDetail.contacts}} {{activiteDetail.contactsPhone}}）</span>
        </div>
      </div>
      <van-popup v-model="activiteView" class="activiteView">
        <div class="top">
          <p>线下活动报名</p>
          <img @click="activiteView = false" src="static/image/coupon/close-btn.png" alt>
        </div>
        <div class="middle">
          <div class="div">
            <span>联系人姓名：</span>
              <input class="input" v-model="userInfo.nickName" type="text">
          </div>
          <div class="div">
            <span>联系人电话：</span>
              <input class="input" v-model="userInfo.phone" type="text">
          </div>
        </div>
        <div class="commitBtn">
          <p @click="commitBtn">确定报名</p>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import {Toast} from "vant";
  import {mapGetters} from "vuex";

  export default {
    name: "sign-up",
    data() {
      return {
        activiteDetail: {},
        activiteView: false
      }
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    created() {
      console.log(this.userInfo, this.userInfo.phone);
      let params = {
        token: this.$store.state.login.token,
        id: this.$route.query.id
      }
      this.$http.post('/app/json/app_under_line_activity/underLineActivityDetail', params).then(res => {
        console.log(res);
        if (res.data.result == 'success') {
          this.activiteDetail = res.data.data || {}
        }
      })
    },
    methods: {
      sign() {
        this.activiteView = true
      },
      commitBtn() {
        if (!this.userInfo.nickName) {
          this.$toast('请填写联系人姓名')
          return
        }
        if (!this.userInfo.phone) {
          this.$toast('请填写联系人电话')
          return
        }
        let params = {
          token: this.$store.state.login.token,
          contactsPhone: this.userInfo.phone,
          contacts: this.userInfo.nickName,
          activityId: this.$route.query.id
        }
        this.$http.post('/app/json/app_under_line_activity/attendActivity', params).then(res => {
          if (res.data.result == 'success') {
            this.$toast('报名成功')
            this.activiteView = false
            this.$router.go(-1)
          } else {
            this.$toast(res.data.info);
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  h1 {
    font-size 16px
    font-weight 600
    text-align center
    margin 20px 0 15px 0
  }

  .time {
    margin-right 3%
    text-align right
  }

  .contact {
    line-height: 22px;
    width: 94%;
    font-size: 14px;
    text-indent: 0.5rem;
    margin: 10px auto 0 auto;
  }

  .bottom {
    position: fixed;
    bottom: 0px;
    height 90px
    background white
    width 100%
    z-index: 99;
    display: flex;

    .singDiv {
      width: 96%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #d6b57d;
      font-size: 18px;
      border-radius 32px
      margin auto
      background: -webkit-radial-gradient(#535353 24%, #313131 100%);
    }

    .singDivd {
      background #a0a0a0
      color white
      display: flex;
      flex-direction: column;
      line-height: 0;
      padding 7px

      span {
        margin auto
      }
    }
  }

  .activiteView {
    width: 90%;
    text-align: center;
    font-size: 0.426667rem;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    border-radius: 10px;

    .top {
      width 80%
      margin 0 auto
      display flex
      font-size 18px
      justify-content space-between

      p {
        flex 1
      }

      img {
        height 20px

      }
    }

    .middle {
      font-size 15px
      margin 15px auto 0 auto
      .div {
        display flex
        justify-content center
        margin 15px 0
        span {
          margin auto 0
        }
        .input {
          margin auto 0
          background: #f6f6f6;
          border: 1px solid #f6f6f6;
          border-radius: 17px;
          padding: 10px 0px;
          text-indent: 10px;
        }
      }
    }
    .commitBtn {
      border-top: 1px solid #efefef;
      padding-top 15px
      color #ef2b2c
    }
  }

  /deep/ .nav-content {
    overflow-y: auto;
  }
</style>
