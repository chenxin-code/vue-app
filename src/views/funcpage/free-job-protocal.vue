<template>
  <div>
    <nav-top class></nav-top>
    <nav-content class="protocol-root">
      <!-- <p class="protocal-title">自由职业者服务协议</p> -->
      <div ref="protocol_content" class="protocol-content">
        <!-- <div class="top-tip">提示条款：</div>
        <div class="protocal-top">欢迎您与我司【广州市时代邻里邦网络科技有限公司】签署本《自由职业者服务协议》（下称”本协议“）。</div>-->
        <div ref="agreementContent" v-html="agreementContent"></div>
        <!-- <div>协议条款：</div>
        <div>根据国家法律有关规定，双方按照平等自愿诚实信用的原则，就</div>-->
      </div>
      <!-- <div>2322232323</div> -->
      <div class="agree-base" :class="{'agree-btn':btnEnable}" @click="agreeToDo">同意协议并确认签署</div>
      <div></div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      agreementContent: "",
      contentH: 0,
      scrollViewH: 0,
      btnEnable:false
    };
  },
  methods: {
    agreement() {
      let url = "/app/json/news/getNewsList";
      let paramsData = { values: 54 };
      this.$http
        .post(url, paramsData)
        .then(res => {
          if (res.data.status == 0) {
            this.agreementContent = res.data.data[0].content;
            this.$nextTick(() => {
                let contentDom = this.$refs.agreementContent;
                this.contentH = contentDom.offsetHeight;
                let scrollDom = this.$refs.protocol_content;
                this.scrollViewH = scrollDom.offsetHeight;
            })
          }
        })
        .catch(err => {});
    },
    agreeToDo(){
      if(this.btnEnable){
        
      }
    }
  },
  created() {},
  mounted() {
    this.agreement();
    let scrollDom = this.$refs.protocol_content;
    scrollDom.onscroll = () => {
      let scrollTop = scrollDom.scrollTop
      if(scrollTop + this.scrollViewH >= this.contentH) {
          this.btnEnable = true;
        }
      };
  }
};
</script>
<style lang="stylus" scoped>
.protocol-root {
  display: flex;
  flex-direction: column;

  .protocal-title {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
  }

  .protocol-content {
    margin-bottom: 50px;
    height: 100%;
    overflow-y: scroll;
    padding: 5px 10px 0px 10px;

    .agreementContent {
      overflow: hidden;
    }

    .protocal-top {
      margin-top: 5px;
      color: #000405;
      line-height: 16px;
    }

    .top-tip {
      font-size: 13px;
      font-weight: 500;
    }
  }
  .agree-base {
    width: 100%;
    height: 50px;
    flex: 1;
    position: absolute;
    background-color:gray;
    bottom: 0px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 17px;
    font-weight: 500;
    z-index: 10;
  }
  .agree-btn {
          background-color: #4DB364;
  }
}
</style>
