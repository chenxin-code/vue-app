/**Created by liaoyingchao on 2019-11-26.*/

<template>
  <Modal class="top-pop" v-model="show" title="河北移动链接参数" @on-ok="sureEvent" :scrollable="true" width="800">
    <Row style="margin-top: 12px;">
      <Col span="6">
        <div class=""> 跳转scheme </div>
      </Col>
      <Col span="18">
        <Input type="text" v-model="jumpScheme" placeholder="请输入跳转scheme">
        </Input>
      </Col>
    </Row>
    <Row style="margin-top: 12px;">
      <Col span="6">
        <div class=""> 跳转链接地址 </div>
      </Col>
      <Col span="18">
        <Input type="text" v-model="jumpUrl" placeholder="请输入跳转链接地址">
        </Input>
      </Col>
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
        jumpScheme: '',
        jumpUrl: '',
        callback: function () {
          console.log("no callback");
        },
      }
    },
    methods: {
      sureEvent: function () {
        if (this.jumpScheme == '' || this.jumpUrl == '') {
          this.$Message.error('请输入完整信息！');
        }
        let d = {
          jumpUrl: this.jumpUrl,
          jumpScheme: this.jumpScheme,
        }
        this.callback(d);
        this.show = false;

        this.jumpScheme = ''
        this.jumpUrl = ''
        this.callback = function () {
          console.log("no callback");
        };
      }
    },
    created() {
      Bus.$on("showJumpAppCenter", busData => {
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
