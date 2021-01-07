/**Created by liaoyingchao on 2019-11-26.*/

<template>
  <Modal class="top-pop" v-model="show" title="河北移动链接参数" @on-ok="sureEvent" :scrollable="true" width="800">
    <Row style="margin-top: 12px;" v-if="show">
      <div class=""> 河北移动链接地址 </div>
      <Input type="text" v-model="source" placeholder="请输入河北移动链接地址" span="18">
      </Input>
    </Row>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "yjjy-args",
    components: {},
    data() {
      return {
        setting: '',
        show: false,
        source: '',
        callback: function () {
          console.log("no callback");
        },
      }
    },
    methods: {
      sureEvent: function () {
        if (this.source == '') {
          this.$Message.error('请输入河北移动链接地址！');
        }
        let d = {
          source: this.source
        }
        this.callback(d);
        this.show = false;

        this.source = ''
        this.callback = function () {
          console.log("no callback");
        };
      }
    },
    created() {
      Bus.$on("showHBYDUrlCenter", busData => {
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .yjjy-args {
    width 100%
    height 100%
    overflow hidden
  }
</style>
