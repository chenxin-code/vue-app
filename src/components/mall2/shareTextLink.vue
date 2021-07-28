<template>
  <div class="shareTextLink">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <div class="title">
      <span class="ornament"></span>
      <div>编辑文案</div>
    </div>
    <div class="copyText">
      <van-field
        v-model="copyText"
        :autosize="{ minHeight: 89 }"
        type="textarea"
      />
      <div class="price">
        <div class="priceTitle">【售价】：</div>
        <div class="priceNum">{{ price }}元</div>
      </div>
      <div class="link">
        <div class="linkTitle">【链接】：</div>
        <div class="linkText">
          {{ link }}
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footerBtn" @click="copy">
        <img src="static/image/mall2/shareLinkBtn.png" alt="" />
        <div>复制文案分享</div>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
export default {
  name: "shareTextLink",
  data() {
    return {
      copyText: "",
      price: "",
      link: "",
    };
  },
  created() {
    console.log('---this.$route.query- shareTextlink--->>', this.$route.query);
    this.price = this.$route.query.price;
    this.skuId = this.$route.query.skuId;
    // this.link = this.$route.query.link + "&channel=fromApp";
    this.link = this.$route.query.link;
    this.copyText = this.$route.query.goodsTitle;
    this.goods_share_data = JSON.parse(this.$route.query.goods_share_data);
    console.log({...this.goods_share_data})
    if(this.$store.state.environment !== 'production'){
      this.link = `http://m-center-uat-linli.timesgroup.cn:8001/sharingMall?skuId=${this.skuId}&channel=fromApp`
    }else{
      this.link = `http://m-center-prod-linli.timesgroup.cn:8001/sharingMall?skuId=${this.skuId}&channel=fromApp`
    }
  },
  methods: {
    copy() {
      if(this.copyText.length <= 0){
        this.$toast("请输入商品名称");
      }else{
        let text =
          this.copyText +
          `\n\n【售价】：${this.price}元\n\n【链接】：${this.link}`;
        console.log(text);
        new ClipboardJS(".footerBtn", {
          text: function (trigger) {
            return text;
          },
        });
        this.$toast("文案已复制到剪切板");
        this.$sensors.track('goods_share', {...this.goods_share_data}); 
      }
    },
  },
};
</script>
 
<style scoped lang="stylus" rel="stylesheet/stylus">
.router_class {
  background-color: #F4F4F4 !important;
}

/deep/.van-field {
  padding: 0;
}

/deep/.van-field__control {
  background-color: #FFF9F9;
  border-radius: 12px;
  padding: 13px 28px 17px 15px;
}

.shareTextLink {
  width: 100%;
  height: 100%;
  background-color: #F4F4F4;

  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 64px;
    padding: 18px 12px 18px 15px;

    .ornament {
      width: 4px;
      height: 12px;
      background: #E3352A;
      border-radius: 2px;
      margin-right: 7px;
    }

    div {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 30px;
    }
  }

  .copyText {
    width: 93.6%;
    // height: 214px;
    background: #FFFFFF;
    border-radius: 12px;
    margin: 0 auto;
    padding: 12px;

    .price {
      margin: 16px 0 17px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .priceTitle {
        font-size: 14px;
        font-weight: 500;
        color: #666666;
      }

      .priceNum {
        font-size: 14px;
        font-weight: 500;
        color: #121212;
      }
    }

    .link {
      width: 100%;
      height: auto;
      margin: 14px 0 0px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .linkTitle {
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        white-space: nowrap;
      }

      .linkText {
        font-size: 14px;
        font-weight: 500;
        color: #121212;
        height: auto;
        white-space: normal; // 文本超出换行
        // word-wrap: normal; // 只在允许的断字点换行
        word-break: break-all; // 使用浏览器默认的换行规则
      }
    }
  }

  .footer {
    width: 100%;
    height: 102px;
    background: #FFFFFF;
    border-radius: 12px 12px 0px 0px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .footerBtn {
      width: 86.4%;
      height: 48px;
      background: #E3352A;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 19px;
        height: 19px;
        display: block;
        margin-right: 11px;
      }

      div {
        font-size: 15px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 30px;
      }
    }
  }
}
</style>