<template>
  <div class="shareTextLink">
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
    console.log('this.$route.query', this.$route.query)
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
 