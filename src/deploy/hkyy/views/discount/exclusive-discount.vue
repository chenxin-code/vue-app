<template>
  <div class="ed-page">
    <nav-top title="专属优惠" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="ed-lucky" @click="isExclusiveMemberHandle">
        <div class="phone-top-class" v-if="false">
          <span>期待您的参与，咨询电话</span>
        </div>
        <div class="phone-bottom-class" v-if="false">
          <span>18888888888</span>
        </div>
        <!--<button @click="participateEvent" v-if="showBtn">立即参与</button>-->
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    name: "exclusive-discount",
    components: {},
    data() {
      return {
        showBtn: false
      }
    },
    methods: {
      participateEvent() {
        this.$router.push({
          path: '/hkedinforegister', query: {}
        })
      },

      //检查用户是否在白名单
      inWhiteListHandle() {
        this.$Loading.open();
        let url = '/platform/json/exclusive_member/inWhiteList'
        let params = {
          token: this.$store.state.login.token
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status === 0) {
            if (data.data && data.data === true) {
              //在白名单
              // this.showBtn = true;
              this.participateEvent();
            } else {
              //没有在白名单
              this.$Toast('您暂无资格')
            }
          } else {
            this.$Toast('您暂无资格')
          }
        }).catch(error => {
          this.$Toast('获取白名单异常');
          this.$Loading.close();
        })
      },
      //是不是专属会员
      isExclusiveMemberHandle() {
        this.$Loading.open();
        let url = '/platform/json/exclusive_member/isExclusiveMember'
        let params = {
          token: this.$store.state.login.token
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status === 0) {
            if (data.data && data.data === true) {
              //是专属会员  跳转到优惠详情
              this.$bridgefunc.customPush({
                path: "/hkedstation",
                query: {}
              });
            } else {
              //不是专属会员 验证是不是在白名单
              this.inWhiteListHandle();
            }
          } else {
            this.$Toast(data.info || '获取验证专属会员失败')
          }
        }).catch(error => {
          this.$Toast('获取验证专属会员异常')
          this.$Loading.close();
        })
      }

    },
    created() {
      // this.$store.state.login.token = 'c:app:CBA83C2F6E264B8FA1D4597BD07C12AS'
      // this.isExclusiveMemberHandle();
    },
    mounted() {

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .ed-page {
    width: 100%;
    height: 100%;
    position: relative;
    .ed-lucky {
      width: 100%;
      background-image url("../image/discount_bg_new.jpg")
      background-repeat no-repeat
      background-size 100% 100%
      height: 100%;
      position relative
      background-position center
      display flex
      justify-content center
      .phone-top-class {
        position absolute
        top 35%
        height 35px
        line-height 35px
        text-align center
        width 60%
        border-top-left-radius 10px
        border-top-right-radius 10px
        border-top 3px solid #ffcc3b
        border-left 3px solid #ffcc3b
        border-right 3px solid #ffcc3b
      }
      .phone-bottom-class {
        position absolute
        top 42%
        height 35px
        text-align center
        line-height 35px
        width 60%
        border-bottom-left-radius 10px
        border-bottom-right-radius 10px
        border-bottom 3px solid #ffcc3b
        border-left 3px solid #ffcc3b
        border-right 3px solid #ffcc3b
        span {
          color white
          font-size 25px
          letter-spacing 5px
          display block
        }
      }
      span {
        color white
        font-size 18px
      }
      button {
        position absolute
        top 52%
        width 60%
        background white
        border-radius 20px
        border 0
        height 40px
        color #fb3f19
        font-size $font-size-medium-x
        font-weight bold
      }
    }
  }
</style>
