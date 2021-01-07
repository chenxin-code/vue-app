<template>
  <div class="body">
    <nav-top title="问卷调查" @backEvent="$router.go(-1)">
      <div class="shareBox">
        <div>
          <i class="icon iconfont mall-fenxiang"></i>
        </div>
      </div>
    </nav-top>
    <nav-content>
        <div class="content">
          问卷共计10题，9道选择题，一个问答题，完成问卷后，可获得商城购物100元优惠券，分享游戏，可得商城10元优惠券
        </div>
      <van-rate
        v-model="result"
        color="#F80F16"
        void-color="#F80F16"
      />
      <div class="answer theme_bg_red" @click="participate">开始答题</div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import subject from '@/components/mall2/game/question/subject'
  import rule from '@/components/mall2/game/question/rule'
  import {mapGetters} from 'vuex'
  import { Toast } from 'vant'
  export default {
    name: '',
    mixins: [api],
    data () {
      return {
        url: '',
        id: '',
        paramsData: {},
        result: ''
      }
    },
    created() {
      let that = this
      that.paramsData = that.$route.params
      console.log(that.paramsData)
    },
    mounted() {
      console.log(111,this.result);
    },
    methods: {
      participate() {
        let that = this
        console.log(222,that.result);
      //   let params = {
      //     id: that.paramsData.paramsId,
      //     token: this.$store.state.login.token,
      //     ouCode:  that.paramsData.ouCode
      //   }
      //   that.participateData(params).then(res => {
      //     console.log(res);
      //     if (res.data.result === 'success') {
      //       that.$router.push({name: 'subject', params: {
      //           subId: that.paramsData.paramsId
      //         }})
      //     } else {
      //       Toast(res.data.info)
      //     }
      //   })
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
    }
  }
</style>
