/**Created by steven on 2018/7/27.*/

<template>
  <div class="HomeModule_1099">
    <!--:onload="changeFrameHeight"-->
    <iframe ref="myiframe" id="myiframe" class="myiframe" name="myiframe" :src="linkUrl"  frameborder="0" scrolling="no" border="0" marginwidth="0" marginheight="0" ></iframe>
  </div>
</template>

<script>
import {Toast } from 'mint-ui'

export default {
  name: "HomeModule_1099",
  components: {
    Toast
  },
  props: [
    'items',
  ],
  data () {
    return {
      linkUrl:''
    }
  },
  methods: {

    setIframeHeight:function () {
      let iframe = document.getElementById('myiframe')

      // let jsonData = {url:this.linkUrl};
      // this.$bridgefunc.getPageHeight(jsonData,function (frameHeight) {
      //   Toast({
      //     message: frameHeight,
      //     position: 'bottom',
      //     duration: 2000,
      //   });
      //   iframe.height =  frameHeight;
      // })
      let winWidth =  window.innerWidth;
      let allHeight = 40 + (186/190)*(winWidth/2) +  (112/95)*(winWidth/4)+50
      iframe.height = allHeight;
      return;
      //
      // if (iframe) {
      //   console.log(iframe);
      //
      //
      //   var height = 300;//获取父页面高度减去差值
      //   if(document.all) { //判读ie w3c
      //     iframe.attachEvent("onload", function() { //ie 判断加载
      //       var temph = iframe.contentWindow.document.documentElement.scrollHeight;
      //       iframe.height = temph > 400 ? temph : height;//给与一个界限
      //     });
      //   } else {
      //     iframe.onload = function() { //w3c判断加载
      //       // let doc =  iframe.contentDocument || iframe.contentWindow.document
      //       ifr.contentWindow.document.body.scrollHeight
      //       var temph = iframe.contentWindow.document.body.scrollHeight;
      //       iframe.height = temph > 400 ? temph : height;//给与一个界限
      //     }
      //   }
      //
      //   // var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
      //   // if (iframeWin.document.body) {
      //   //   iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
      //   // }
      // }
    },
  },
  mounted () {
    let rows = this.items.rows;
    if(rows && rows.length){
      let dic = rows[0];
      this.linkUrl = dic['linkUrl'];
    }
    this.$nextTick(function () {
      this.setIframeHeight();
    })
  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.HomeModule_1099 {
  width  100%
  .myiframe{
    width 100%
  }
}
</style>
