<template>
  <div class="error">
    <div class="tips">
      <div>亲，非常抱歉，忙不过来了，</div>
      <div>请您退出后重新登录！</div>
    </div>
  </div>
</template>

<script>
import bridgefunc from '@/utils/bridgefunc.js';
import util from "@/utils/util";
export default {
  name: "error",
  props: {},
  data() {
    return {
      version: "1.0.23",
      isAudit: false,
    };
  },
  created() {
    this.checkVersion();
  },
  methods: {
    checkVersion() {
      this.$http
        .post("/app/json/login/getVersionStatus", { versionNum: "1.0.23" })
        .then((res) => {
          if (res.data.status == 0) {
            this.isAudit = res.data.data.isTrue;
            console.log("this.isAudit", this.isAudit);
            if (this.isAudit) {
              this.$store.state.login.token = '';
              this.$store.state.comeFromPage = '/error';
              bridgefunc.vuexStorage(function () {
                util.toLogin();
                return
              });
            } else {
              if (
                this.$store.state.webtype == 2 ||
                this.$store.state.webtype == 3
              ) {
                this.$nextTick(() => {
                  console.log("wx", wx);
                  wx.miniProgram.navigateTo({
                    url: "/pages/common/home/index",
                  });
                });
              }
            }
          }
        });
    },
  },
};
//
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F9F9F9;
}

.error {
  background: url('./images/error.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position-y: 30%;
  display: flex;
  justify-content: center;
  align-items: center;

  .tips {
    font-size: 16px;
    color: #999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 160px;

    div {
      margin: 0 0 10px;
    }
  }
}
</style>

