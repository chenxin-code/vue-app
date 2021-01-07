
<template>
  <div class="mine-has-recommed">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="msg-list" >
        <div class="msg-item" v-for="(msgitem, index) in tab" :key="index">
          <p>会员编号: {{msgitem.userId}}</p>
          <p>手机号码: {{msgitem.phone}}</p>
          <p>注册时间: {{msgitem.regDate}}</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import  Vue from 'vue'
  export default {
    name: "mine-has-recommed",
    components: {},
    data() {
      return {
        tab: [],
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      getListData: function (refererType) {
        this.$Loading.open()
        let url = '/app/json/user/getMyReferUserList';
        let params1 = {
          token: this.$store.state.login.token,
          refererType: refererType,
          page: 1,
          rows:10
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.tab = data.data ? data.data.regUserInfoList : []
          } else {
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close();
          console.log('获取消息列表', error)
        })
      },

    },
    created() {
      let refererType = this.$route.query.refererType 
      this.getListData(refererType);
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .mine-has-recommed {
    width 100%
    height 100%
    overflow hidden
    .msg-list {
      padding 0 10px;
      .msg-item {
        padding 11px 15px;
        border-radius 4px;
        overflow: hidden
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background: #fff;
        p {
          padding: 3px 0
          line-height: 1.428;
        }
        & + .msg-item {
          margin-top: 8px;
        }
      }
    }
  }
</style>
