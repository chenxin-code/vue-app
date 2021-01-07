<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="修改店铺名称"></nav-top>
    <nav-content>
      <div class="name">
        <div>
          <input type="text" v-model="typeNum" maxlength="10">
          <i class="icon iconfont mall-guanbi" @click="deleteData"></i>
        </div>
        <p>{{typeNum.length}}/10</p>
      </div>
      <div class="answer theme_bg_red" @click="commit">保存</div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
  import {mapGetters} from "vuex";
  import store from "../../../vuex/store";

  export default {
    name: "modifyname",
    mixins: [api],
    data() {
      return {
        typeNum: '',
        id: '',
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      this.typeNum = this.getPutaggregate.storeName
    },
    methods: {
      deleteData() {
        this.typeNum = ''
      },
      commit() {
        let that = this
        console.log(that.getPutaggregate.id);
        let params = {
          token: this.$store.state.login.token,
          id: that.getPutaggregate.id,
          storeName: that.typeNum,
          pictureUrl: '',
          backgroundImgUrl: '',
          storeProfile: ''
        }

        that.modifyafterData(params).then(res => {
          if (res.data.result === 'success') {
            this.getPutaggregate.storeName = that.typeNum
            store.commit('putaggregate', this.getPutaggregate)
            this.$router.go(-1)
          } else {
            Toast(res.data.info)
          }
        })
      }
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

      div {
        width 90%;
        margin 12px auto 20px auto;
        padding 10px 0;
        border-radius 6px;
        background #f6f6f6
        display flex;
        justify-content space-between

        input {
          background #f6f6f6
          font-size 16px;
          text-indent 6px;
          width 300px;
        }

        .iconfont {
          width 18px;
          height 18px;
          margin-right 10px;
          font-size 20px;
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
  }
</style>
