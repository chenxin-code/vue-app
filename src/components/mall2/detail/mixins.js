export default {
  methods: {
    wxenvironment() {
      let ua = window.navigator.userAgent.toLowerCase();
      this.isWX = ua.match(/MicroMessenger/i) == "micromessenger";
    },
    distributionInit() {
      this.distributionMessage();
      this.distributionProduct();
    },
    // 分销员信息
    distributionMessage() {
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://mall-uat-web-linli.timesgroup.cn/distr-service/index/api-c/v1/get/my/info")
        : (url =
            "https://mall-prod-web-linli.timesgroup.cn/distr-service/index/api-c/v1/get/my/info");
      this.$http.get(url).then(
        res => {
          console.log("----distributionMessage------", res);
          // 如果非分销员则走非分销逻辑
          if (res.data.code == 200) {
            this.referrerCode = res.data.data.shareCode;
            this.personShareCode = res.data.data.shareCode;
            this.distributionMessageCode();
          } else {
            this.getCode();
          }
        },
        err => {}
      );
    },
    getCode: function() {
      return new Promise((resolve, reject) => {
        // let rfrCode = this.$store.state.rfrCode || this.$store.state.userInfo.userId
        console.log(
          "-------",
          `/app-vue/app/index.html#/mall2/detail/1000?skuId=${this.skuId}`
        );
        this.$request
          .post("/app/json/short_address/makeShortAddress", {
            // longAddress: `${this.delParams()}&rfrCode=${rfrCode}`
            longAddress: `${encodeURIComponent(
              `/app-vue/app/index.html#/mall2/detail/1000?skuId=${this.skuId}`
            )}`
          })
          .then(res => {
            if (res.status === 0) {
              const shortCode = res.data.substr(res.data.indexOf("/s/"));
              // /app/json/we_chat/getwxacodeunlimit
              console.log("shortCode", shortCode);
              this.$request
                .post("/app/json/wechat_mini_program/createQrCode", {
                  // path: `pages/common/home/index`,
                  // scene: shortCode,
                  // width: 430
                  page: `pages/common/home/index`,
                  scene: shortCode,
                  width: 430,
                  type: "0"
                })
                .then(
                  res => {
                    if (res.status === 0) {
                      this.qrCode =
                        "data:image/png;base64," +
                        res.data.replace(/[\r\n]/g, "");
                      const img = new Image();
                      img.src = this.qrcode;
                      img.onload = () => {
                        resolve();
                      };
                    } else {
                      reject();
                      this.$Toast(res.info || "获取小程序码失败");
                    }
                  },
                  error => {}
                );
            }
          });
      });
    },
    // 分销商品分享码
    distributionMessageCode() {
      let url = "";
      this.$store.state.environment == "development"
        ? (url = `https://mall-uat-web-linli.timesgroup.cn/distr-service/graphics/api/getShareErCode?skuId=${this.skuId}&type=1&shareCode=${this.personShareCode}`)
        : (url = `https://mall-prod-web-linli.timesgroup.cn/distr-service/graphics/api/getShareErCode?skuId=${this.skuId}&type=1&shareCode=${this.personShareCode}`);

      fetchMethod("GET", url).then(res => {
        console.log("----distributionMessageCode--->>-", res);
        this.qrCode = res.data;
      });
    },

    // 商品信息 是否是分销商品
    distributionProduct() {
      let url = "";
      this.$store.state.environment == "development"
        ? (url = `https://mall-uat-web-linli.timesgroup.cn/distr-service/good/api/v1/distr/getShoppingGoodBySkuId?skuId=${this.skuId}`)
        : (url = `https://mall-prod-web-linli.timesgroup.cn/distr-service/good/api/v1/distr/getShoppingGoodBySkuId?skuId=${this.skuId}`);
      fetchMethod("POST", url).then(res => {
        if (res.code == 200 && res.data) {
          this.estimatedCommission = res.data.estimatedCommission; // 预计佣金
          this.isDistributionProduct = true; //是否是分销商品
        }
      });
    }
  }
};
