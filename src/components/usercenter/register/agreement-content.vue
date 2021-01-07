/**Created by steven on 2019/1/11.*/

<template>
  <div class="agreement-content">
    <div class="content" v-html="agreementContent">
    </div>
  </div>
</template>

<script>

  export default {
    name: "agreement-content",
    components: {},
    props: ['value', 'noloading'],
    data () {
      return {
        agreementContent: '',
      }
    },
    methods: {
      getAgreement: function () {
        if (this.noloading != 'true') {
          this.$Loading.open();
        }
        let url;
        let paramsData;
        if(this.value == 18){
            url = '/app/json/news/getNewsList';
            paramsData = {values:52};
        }else{
            url = '/app/json/news/getList';
            paramsData = {
              token: this.$store.state.login.token,
              value: this.value
            };
        }
        this.$http.post(url, paramsData).then(
          res => {
            if (this.noloading != 'true') {
              this.$Loading.close();
            }
            let data = res.data;
            let arr = data.data;
            if (arr && arr != '') {
              let item = arr[0];
              this.agreementContent = item.content;
            } else {
              console.log('协议内容为空')
              // this.$Toast('协议内容为空');
            }
          },
          error => {
            if (this.noloading != 'true') {
              this.$Loading.close();
            }
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    mounted(){

      this.getAgreement();
    },
    created () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .agreement-content {
    overflow hidden
    .content {
      width 100%
      p {
        font-size: 13px !important
      }
    }

  }
</style>
