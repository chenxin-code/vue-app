<!-- 我的佣金 -->
<template>
  <div class="column commission">
    <van-sticky style="width: 100%">
      <div class="banner" :style="style">
        <van-nav-bar
          :left-arrow="false"
          safe-area-inset-top
          @click-left="$router.go(-1)"
          :border="false"
        >
          <template #left>
            <van-icon name="arrow-left" color="#fff" />
          </template>
          <template #title>
            <div class="navTitle">我的佣金</div>
          </template>
        </van-nav-bar>
      </div>
    </van-sticky>
    <div class="column container">
      <div class="column center content">
        <div class="column center account">
          <div class="row center">
            <img class="lineimg" :src="lineleft" />
            <span class="account-title">可提现佣金</span>
            <img class="lineimg" :src="lineright" />
          </div>
          <div class="account-money">
            <span class="moneyIcon">￥</span><span>500.00</span>
          </div>
        </div>
        <div>
          <van-button
            class="recordbutton"
            type="default"
            size="small"
            @click="withdrawal"
            >提现到邻里钱包</van-button
          >
        </div>
        <div class="row center record" @click="record">
          提现记录<van-icon name="arrow" color="#FF393E" />
        </div>
      </div>
      <div class="flex column settlement">
        <div class="row list listTitle">
          <div class="flex row center">结算日期</div>
          <div class="flex row center">结算金额</div>
        </div>
        <div class="innerBox">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="到底啦~"
            @load="onLoad"
            error-text="请求失败，点击重新加载"
          >
            <div class="row list" v-for="item in list" :key="item">
              <div class="flex row center">2021-06-21 12:00:00</div>
              <div class="flex row center">
                {{ utils.toDecimal2(30) }}
                <img class="listimg" :src="moneyIcon" alt="" />
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>

    <van-dialog
      class="dialog-mask row center"
      v-model="dialogshow"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <div class="dialog-mask-content column center">
        <div class="moneyimg">
          <img
            :src="
              require('../../../../static/image/bulk/commission/moneyimg.png')
            "
            class="img"
          />
        </div>
        <div class="withdrawimg">
          <img
            :src="
              require('../../../../static/image/bulk/commission/withdraw.png')
            "
            class="img"
          />
        </div>
        <div class="column center">
          <van-checkbox-group
            v-model="result"
            ref="checkboxGroup"
            @change="checkgrounp"
          >
            <van-cell-group>
              <van-cell
                class="vancell row center"
                v-for="(item, index) in resultData"
                clickable
                :key="item.value"
                @click="toggle(index, item.value)"
              >
                <van-checkbox
                  :name="item.value"
                  checked-color="#E81F24"
                  ref="checkboxes"
                  >{{ item.label }}</van-checkbox
                >
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <van-cell class="row start checkAll">
            <van-radio-group v-model="radio">
              <van-radio name="1" checked-color="#E81F24" @click="checkAll"
                >全选</van-radio
              >
            </van-radio-group>
          </van-cell>
        </div>
        <div>
          <van-button class="vanbtn" round type="info" @click="close"
            >取消</van-button
          >
          <van-button class="vanbtn btnright" round type="info" @click="confirm"
            >确认提现</van-button
          >
        </div>
      </div>
      <div class="row center" @click="close">
        <div class="dialog-mask-closeimg">
          <img
            :src="
              require('../../../../static/image/bulk/commission/btn_close.png')
            "
            class="img"
          />
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from "vant";
import utils from "@/utils/util";
export default {
  data() {
    return {
      style: {
        background:
          "url('../../../../static/image/bulk/commission/commissionBanner.png') center center / 100% 100% no-repeat",
      },
      lineleft: require("../../../../static/image/bulk/commission/lineleft.png"),
      lineright: require("../../../../static/image/bulk/commission/lineright.png"),
      moneyIcon: require("../../../../static/image/bulk/commission/moneyIcon.png"),
      account: utils.toDecimal2(100),
      result: [],
      resultData: [
        { label: `零售：￥${utils.toDecimal2(100)}`, value: 1 },
        { label: `家政：￥${utils.toDecimal2(200)}`, value: 2 },
        { label: `旅游：￥${utils.toDecimal2(300)}`, value: 3 },
      ],
      dialogshow: false,
      radio: "",
      loading: false,
      finished: false,
      list: [],
      utils: utils,
    };
  },
  components: {
    Dialog,
  },

  computed: {},
  creat() {},
  mounted() {
    console.log(utils.toDecimal2(100), "保留两位小数");
  },

  methods: {
    onLoad() {
      this.loading = true;
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }
        for (let i = 0; i < 5; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    /*提现弹窗*/
    withdrawal() {
      this.dialogshow = true;
    },
    /*提现确认按钮*/
    confirm() {
      this.record();
      Dialog.close();
    },
    close() {
      this.dialogshow = false;
    },
    /*单选*/
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    /*单选与全选的切换*/
    checkgrounp(e) {
      if (e.length == 3) {
        this.radio = "1";
      } else {
        this.radio = "";
      }
    },
    /*全选*/
    checkAll(e) {
      this.radio = "1";
      this.$refs.checkboxGroup.toggleAll(true);
    },
    /*提现记录*/
    record() {
      this.$router.push({
        // path: "/withdrawalrecord",
        name: "提现记录",
        params: {
          resouce: "",
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
.row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.start {
  justify-content: start;
}

.center {
  justify-content: center;
}

.flex {
  flex: 1;
}

.commission {
  width: 100%;
  height: 100%;
}

.banner {
  width: 100%;
  height: 173px;
}

.van-nav-bar {
  background-color: transparent;

  .navTitle {
    color: #fff;
  }
}

.container {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  margin-top: -80px;

  .content {
    width: 100%;
    background: #fff;
    border-radius: 20px 20px;
    padding: 20px 0;
    font-size: 14px;
    font-family: PingFang SC;

    .account {
      .lineimg {
        width: 30px;
        height: 1.5px;
      }

      &-title {
        font-size: 14px;
        color: #999;
      }

      &-money {
        font-size: 24px;
        color: #333;
        font-weight: blod;
        margin: 20px 0;

        .moneyIcon {
          font-size: 20px;
        }
      }
    }

    .recordbutton {
      width: 179px;
      height: 38px;
      color: #fff;
      background: linear-gradient(90deg, #FF393E 0%, #FF2060 100%);
      border-radius: 19px;
    }

    .record {
      font-size: 12px;
      color: #FF393E;
      margin-top: 20px;
    }
  }

  .settlement {
    width: 100%;
    border-radius: 20px 20px 0 0;
    background: #fff;
    margin-top: 15px;

    .innerBox {
      width: 100%;
      height: calc(100vh - 430px);
      overflow-y: auto;
    }

    .list {
      height: 48px;
      color: #333;

      .listimg {
        width: 18px;
        height: 18px;
        margin-left: 5px;
      }
    }

    .listTitle {
      color: #FF393E;
      border-bottom: 1px solid #eee;
      width: 100%;
    }
  }
}

.img {
  width: 100%;
  height: 100%;
}

.dialog-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  margin-top: 60px;

  &-content {
    background: #fff;
    border-radius: 20px;
    width: 300px;
    padding: 0px 40px 25px 40px;

    .moneyimg {
      width: 86px;
      height: 69px;
      margin-top: -40px;
    }

    .withdrawimg {
      width: 212px;
      height: 25px;
      margin: 15px 0 30px 0;
    }

    .vanbtn {
      width: 100px;
      height: 38px;
      background: #FFFFFF;
      border: 1px solid #FF393E;
      border-radius: 20px;
      color: #FF393E;
      margin-top: 30px;
    }

    .btnright {
      background: linear-gradient(90deg, #FF393E 0%, #FF2060 100%);
      color: #fff;
      margin-left: 15px;
    }
  }

  &-closeimg {
    width: 32px;
    height: 32px;
    margin-top: 40px;
  }
}
</style>