<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="修改店铺简介"></nav-top>
    <nav-content>
      <div class="name">
        <div class="div1">
          <van-cell-group>
            <van-field
              label=""
              type="textarea"
              v-model="storeProfile"
              placeholder="请输入简介"
              maxlength="50"
              autosize
            />
          </van-cell-group>
        </div>
        <p>{{storeProfile.length}}/50</p>
      </div>
      <div class="answer theme_bg_red" @click="commit">保存</div>
    </nav-content>
  </div>
</template>

<script>
  import store from "../../../vuex/store";
  import api from './api'
  import { mapGetters } from "vuex";
  export default {
    name: "modifyintroduction",
    mixins:[api],
    data() {
      return {
        storeProfile: '',
        id: '' //id
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      this.storeProfile = this.getPutaggregate.storeProfile
    },
    methods: {
      commit() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          id: that.getPutaggregate.id,
          storeName: '',
          pictureUrl: '',
          backgroundImgUrl: '',
          storeProfile: that.storeProfile
        }

        that.modifyafterData(params).then(res => {
          if (res.data.result === 'success') {
            that.getPutaggregate.storeProfile = that.storeProfile
            store.commit('putaggregate', this.getPutaggregate)
            this.$router.go(-1)
          } else {
            Toast(res.data.info)
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
    .name {
      background white;
      overflow hidden;
      margin-top 10px;
      padding-bottom 12px;
      .div1 {
        width 90%;
        margin 12px auto 20px auto;
        border-radius 6px;
        background #f6f6f6
        display flex;
        justify-content space-between
        /deep/ .van-field__label {
          display none
        }
        /deep/ .van-field__control {
          background #f6f6f6
          font-size 14px;
          height 100px !important;
        }
        img {
          width 15px;
          height 15px;
          margin-right 10px;
        }
        /deep/ .van-cell-group {
          width: 98%;
          margin: 0 auto;
          background #f6f6f6
        }
        /deep/ .van-cell {
          background #f6f6f6
        }
      }
      p {
        margin-top 10px;
        text-align right;
        margin-right 10px;
        font-size 14px;
      }
    }
    .answer {
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      font-size: 18px;

      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }
    /deep/ [class*=van-hairline]::after {
      border 0;
    }
  }
</style>
