/**Created by liaoyingchao on 2020-06-17.*/

<template>
  <div class="block-index" ref="blockIndex">
    <SubPage :pgCode="pgCode" v-if="pgCode" @dataLoaded="dataLoaded"></SubPage>
  </div>
</template>

<script>
  import SubPage from '@/components/product/index/subpage/subpage'
  import sinopecBridge from "../../../utils/sinopecapp/bridge";

  export default {
    name: "block-index",
    components: {
      SubPage
    },
    watch: {
      myHeight: function () {
        this.setSize()
      }
    },
    data() {
      return {
        pgCode: '',
        myHeight: 0,
        myWidth: 0,
        times: 6,
      }
    },
    methods: {
      setSize: function () {
        if (this.$store.state.webtype == 7) {
          let wh = {
            width: this.myWidth,
            height: this.myHeight
          }
          sinopecBridge.sinopecapp_loadNative('setWebviewSize', JSON.stringify(wh))
        }
      },
      getSize: function () {
        this.myWidth = this.$refs.blockIndex.clientWidth
        this.myHeight = this.$refs.blockIndex.clientHeight
        this.times --;
        if (this.times <= 0) {
          return ;
        }
        setTimeout(() => {
          this.getSize()
        }, 500)
      },
      dataLoaded: function () {
        setTimeout(() => {
          this.getSize()
        }, 500)
      }
    },
    created() {
      this.$store.state.clientWidth = document.documentElement.clientWidth;
      this.pgCode = this.$route.query.pgCode || ''
      console.log(this.pgCode)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .block-index {
    position static !important;
    overflow hidden
  }
</style>
