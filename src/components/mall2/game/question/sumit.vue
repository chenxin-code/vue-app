<template>
  <div class="body">
    <nav-top title="评价" @backEvent="$router.go(-1)">
    </nav-top>
    <nav-content>
      <div class="content">
        <div>
          <div class="img-con">
<!--            <div class="img"></div>-->
            <img src="static/image/mall2/submit.png" alt="" >
          </div>
          <p class="p1">评价已提交</p>
          <div class="con" >
            感谢你的评价，我们会积极采纳
          </div>
        </div>
      </div>
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

      }
    },
    created() {

    },
    mounted() {
    },
    methods: {
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
  .con{
    font-size 14px
  }
  .p1{
    font-weight: 500;
    font-size: 24px
    padding 5px
  }
  .img-con{
    width 200px
    height 200px
    margin  0 auto
    /*display flex*/
    /*justify-content center*/
    /*align-items center*/
    img{
      max-width 100%
      max-height 100%
      display block
      margin 0 auto
    }
    .img{
      background url("../../../../../static/image/mall2/submit.png") center center no-repeat
      background-size contain
      width 100px
      height 100px
    }
  }
</style>
