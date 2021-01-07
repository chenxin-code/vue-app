<template>
  <div class="body">
    <nav-top title="每日答题" @backEvent="$router.go(-1)">
      <div class="shareBox">
        <div>
          <i class="icon iconfont mall-fenxiang"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
        <div class="content">
          答题共计10题，9道选择题，一个问答题，完成问卷后，可获得商城购物100元优惠券，分享游戏，可得商城10元优惠券
        </div>
      <div class="answer theme_bg_red" @click="participate">开始答题</div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import answer from '@/components/mall2/game/answer/answer'
  import rule from '@/components/mall2/game/answer/rule'
  import {mapGetters} from 'vuex'
  import { Toast } from 'vant'
  export default {
    name: '',
    mixins: [api],
    data () {
      return {
        url: '',
        id: '',
        paramsData: {}
      }
    },
    created() {
      let that = this
      that.paramsData = that.$route.params
      console.log(that.paramsData)
    },
    mounted() {
      this.Intercept()
    },

    methods: {
      participate() {
        let that = this
        let params = {
          id: that.paramsData.paramsId,
          token: this.$store.state.login.token,
          ouCode: that.paramsData.ouCode
        }

        that.participateData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            that.$router.push({name: 'answer', params: {
                subId: that.paramsData.paramsId
              }})
          } else {
            Toast(res.data.info)
          }
        })
      },
      Intercept() {
        let url = this.url || window.location.href
        console.log(url);
        let _url = url.substr(url.indexOf('?'))
        console.log(_url);
        let GETs = _url.slice(1).split('=')
        console.log(GETs[1]);
        this.id = GETs[1]
      }
    },
    computed: {

    },
    components: {},
    watch: {

    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    position relative;
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
      }
    }
    .content {
      text-align: center;
      line-height: 30px;
      width: 80%;
      margin: 30% auto 0 auto;
      font-size: 18px;
    }
    .answer {
      position fixed;
      bottom 0;
      left 0;
      width 100%;
      height 50px;
      line-height 50px;
      text-align center;
      color white;
      a {
        display block;
        width 100%;
        height 50px;
        line-height 50px;
        color white;
        font-size 18px;
      }
    }
  }
</style>
