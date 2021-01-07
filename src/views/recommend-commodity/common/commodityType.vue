
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="commodityType">
        <span class="text">请选择商品类型</span>
        <van-radio-group class="radio" v-model="deliverType" direction="horizontal" icon-size='16px'>
          <van-radio :name="item.tag" v-for="(item,index) in deliverTypeArr" :key="index">{{item.text}}</van-radio>
          <!-- <van-radio name="2">配送</van-radio> -->
        </van-radio-group>
        <div class="list-no-btn" v-if="deliverType == 1 || deliverType == 2">
          <span @click="toLink">下一步</span>
        </div>
        <div class="list-no-btn" v-if="deliverType == 3">
          <span @click="setQrcode(1)" style="border-top-right-radius: 0;border-bottom-right-radius: 0">生成推荐码</span>
          <span @click="setQrcode(0)" style="background-color: rgb(239, 127, 125);border-top-left-radius: 0;border-bottom-left-radius: 0">生成推荐链接</span>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Config from "@/api/config";

export default {
  name: "commodityType",
  data() {
    return {
      deliverType: '',
      deliverTypeArr: [{
          text: "全部商品",
          fontclass: "mall-ziti",
          tag: 3
      },{
        text: "自提",
        fontclass: "mall-ziti",
        tag: 1
      },{
        text: "配送",
        fontclass: "mall-peisong",
        tag: 2
      }]
    };
  },
  computed: {
    ...mapState(["globalConfig","mall2"])
  },
  mounted() {
    if (this.globalConfig.delivertype_default == "1") {
      this.deliverTypeArr = [
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: 1
        }
      ];
    } else if (this.globalConfig.delivertype_default == "2") {
      this.deliverTypeArr = [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: 2
        }
      ];
    }
    console.log(`this.mall2.staticDeliverType`,this.mall2.staticDeliverType)
    this.deliverType = Number(this.mall2.staticDeliverType)
    // this.$store.state.mall2.staticDeliverType = 2
  },
  beforeDestroy() {},
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    toLink() {
      if (this.deliverType) {
        this.$store.state.mall2.staticDeliverType = this.deliverType
        this.$router.push({ path: '/recommend-commodity/categories'})
      } else {
        this.$Toast('请选择商品类型');
      }
      // console.log(this.mall2.staticDeliverType)
      // this.params.deliverType = this.$store.state.mall2.staticDeliverType;
      // this.$router.push({ path: '/recommend-commodity/commodityType'})
    },
    setQrcode(status) {
      this.$Loading.open()
      let url = '/app/json/user/getUserRfrCode';
      let params1 = {
          token: this.$store.state.login.token,
      }
      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          if(status) {
            this.$router.push({
              path: '/recommend-commodity/qrcode',
              query: { qrcode: data.data.userNo || '', type: 'all'}
            })
        } else {
          let shareData = {};
          shareData.title = '推荐商品'
          shareData.sharetext = '推荐全部商品'
          shareData.imageurl = ''
          shareData.detailurl = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/mall2/categories?userNo=${data.data.userNo}`;
          this.$bridgefunc.wechatShare(shareData);
          console.log(shareData)
        }
      } else {
        this.$Toast(data.info);
        }
    }, error => {
        this.$Loading.close();
      })
    }
  },
  components: {}
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

/deep/ .nav-content {
  // background-color #f6f6f6
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .commodityType {
    margin-top: 18%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .text{
      font-size 16px
    }
    .radio {
      margin 40px 0
    }
    .list-no-btn {
      width: 80%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
        border-radius: 30px;
        background-color: #f02e2c;
      }
    }
  }
}
</style>
