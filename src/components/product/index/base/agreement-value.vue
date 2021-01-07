/**Created by liaoyingchao on 2019-11-26.*/

<template>
  <Modal class="top-pop" v-model="show" title="协议value值" @on-ok="sureEvent" :scrollable="true" width="800">
    <Row style="margin-top: 12px;" v-if="show">
      <div class="" span="4"> 协议value </div>
      <Input type="text" v-model="xyvalue" placeholder="请输入协议value" span="18">
      </Input>
    </Row>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "agreement-value",
    components: {},
    data() {
      return {
        setting: '',
        show: false,
        xyvalue: '',
        callback: function () {
          console.log("no callback");
        },
      }
    },
    methods: {
      sureEvent: function () {
        if (this.source == '') {
          this.$Message.error('请输入协议value！');
        }
        let d = {
          xyvalue: this.xyvalue
        }
        this.callback(d);
        this.show = false;

        this.xyvalue = ''
        this.callback = function () {
          console.log("no callback");
        };
      }
    },
    created() {
      Bus.$on("showAgreementValue", busData => {
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
  .agreement-value {

  }
</style>
