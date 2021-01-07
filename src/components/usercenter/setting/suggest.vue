/**Created by steven on 2018/12/24.*/

<template>
  <div class="suggest">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="content-div mine-box-shodow">
        <MixInput :text.sync="commentText" :imageUrls.sync="commentImages" placeholder="请详细描述您的问题和意见"></MixInput>
      </div>
      <div class="common-btn theme_bg_red theme_font_white mt100" @click="submit">提交</div>
      <div class="common-btn suggestlist" @click="toSuggestList">反馈历史</div>
    </nav-content>
  </div>
</template>

<script>
  import MixInput from '@/components/commonui/mix-input/index'

  export default {
    name: "suggest",
    components: {
      MixInput
    },
    data() {
      return {
        commentText: '',
        commentImages: [],
        canSubmit: true
      }
    },
    methods: {
      toSuggestList: function () {
        this.$router.push({
          path: '/usercenter/suggestlist'
        })
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      submit: function () {
        if (this.canSubmit == false) {
          return ;
        }
        this.canSubmit = false
        this.$Loading.open();
        let url = '/app/json/app_opinions/addOpinions';
        let paramsData = {
          token: this.$store.state.login.token,
          content: this.commentText,
          picList: this.commentImages

        }

        this.$http.post(url, paramsData).then(res => {
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$MessageBox.alert('意见反馈成功', '提示', {confirmButtonText: '确定'}).then(action => {
                this.canSubmit = true
                this.backEvent();
              });
            } else {
              this.canSubmit = true
              this.$Toast(data.info ? data.info : '登录失败')
            }
            this.$Loading.close();
          },
          err => {
            this.canSubmit = true
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .suggest {
    width 100%
    height 100%
    overflow hidden
    .content-div {
      margin 10px
      padding 10px
    }

    .common-btn {
      margin 10px
      padding 12px;
      font-size 18px;
      border-radius 20px;
      font-weight 500;
      text-align center;
    }
    .suggestlist {
      color #f80f16
      border: 1px solid #f80f16
    }
    .mt100 {
      margin-top: 50px;
    }

  }
</style>
