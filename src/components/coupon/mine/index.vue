<template>
  <div>
    <nav-top title="发优惠券" @backEvent="backEvent"></nav-top>
    <div class="coupon-list-page" ref="coupon" :class="{ isWx: isWx }">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="!showEmpty ? '- 亲, 没有更多了 -' : ''"
        @load="getList()"
      >
        <div class="bangdou-exchange-wrap">
          <div class="bangdou-exchange">
            <div class="bangdou-exchange-body">
              <zk-empty
                v-show="!loading && showEmpty"
                image="coupon"
                description="暂无卡券"
              ></zk-empty>
              <div class="exchange-body-item">
                <div
                  class="bangdou-exchange-card"
                  v-for="(item, cindex) in couponList"
                  :key="cindex"
                >
                  <div class="exchange-card-item exchange-card-right">
                    <div class="exchange-card-right-right">
                      <img
                        class="goodsimg"
                        :src="item.image || defaultImg"
                        :onerror="setdefaultAvatar"
                      />
                    </div>

                    <div class="exchange-card-right-left">
                      <div class="card-right-left-top">
                        {{ item.couponTitle }}
                      </div>
                      <div
                        class="card-right-left-middle"
                        v-if="item.validityStartTime && item.validityEndTime"
                      >
                        {{ getTime(item.validityStartTime) }}-{{
                          getTime(item.validityEndTime)
                        }}
                      </div>
                      <div
                        class="card-right-left-bottom"
                        @click="collapse(`couponDesc${cindex}`)"
                      >
                        使用规则
                        <van-icon
                          name="arrow-down"
                          size="12"
                          class="icon-arrow-down"
                          :ref="`couponDesc${cindex}Icon`"
                        ></van-icon>
                      </div>
                    </div>
                    <div class="card-used"></div>
                  </div>
                  <div class="exchange-card-item exchange-card-left">
                    <div class="exchange-card-left-top">
                      <template v-if="item.couponType === 40">
                        <div class="card-left-top-num">
                          {{ +item.discountRatio * 10 }}
                        </div>
                        <span class="coupon-type">折</span>
                      </template>
                      <template v-else>
                        <div class="card-left-top-type">
                          ￥
                        </div>
                        <div class="card-left-top-num">
                          {{ delPoint(item.faceAmount) }}
                        </div>
                      </template>
                    </div>
                    <div class="exchange-card-left-bottom">
                      {{ couponType(item) }}
                    </div>
                    <van-button class="btn-share" @click="useCoupon(item)"
                      >去使用</van-button
                    >
                  </div>
                  <div class="coupon-desc-wrap" :ref="`couponDesc${cindex}`">
                    <div class="coupon-desc" :ref="`couponDesc${cindex}Cont`">
                      <div
                        class="coupon-desc-li"
                        style="white-space: pre-line;"
                        v-html="item.memo"
                      ></div>
                      <div class="coupon-desc-num">
                        券编号：{{ item.couTypeCode }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <div class="exchange-footer">
      <div class="exchange-footer-item" @click="$router.push('/coupon/useLog')">
        使用记录
      </div>
      <div
        class="exchange-footer-item"
        @click="$router.push('/coupon/exchangeCoupon')"
      >
        兑换优惠券
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { Toast } from "vant";
import zkEmpty from "./../comp/zk-empty";

const defaultImg = require("../img/coupon-default.jpg");
export default {
  components: {
    zkEmpty
  },
  data() {
    return {
      memberId:
        process.env.NODE_ENV === "development"
          ? "2331048196588962398"
          : this.$store.state.userInfo.userCode,
      pageIndex: 1,
      defaultImg: defaultImg,
      setdefaultAvatar: 'this.src="' + defaultImg + '"',
      loading: false,
      couponList: [],
      finished: false,
      showEmpty: false,
      isWx: false
    };
  },
  created() {
    if (!this.memberId) {
      this.$http
        .post("/app/json/user/getUserSummary", {
          deliveryType: "2",
          orderCategory: "0"
        })
        .then(res => {
          if (res.data.status == 0) {
            this.memberId = res.data.data.userInfo.userCode;
          }
        });
    }

    //判断是否小程序环境
    if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
      this.isWx = true;
    }
  },
  methods: {
    //返回上一页
    backEvent() {
      this.$router.go(-1);
    },
    getTime(time) {
      const date = new Date(+time);
      return moment(date).format("YYYY.MM.DD");
    },
    couponType(item) {
      //10:代金券 20：满减券 40：折扣券
      if (item.couponType === 10) {
        return `无门槛立减`;
      } else if (item.couponType === 20 || item.couponType === 40) {
        const num = this.delPoint(item.satisfyAmount);
        return `满${num}元可用`;
      }
    },
    delPoint(num) {
      const regexp = /(?:\.0*|(\.\d+?)0+)$/;
      num = `${num}`;
      return num.replace(regexp, "$1");
    },
    //使用规则面板控制
    collapse(ref) {
      this.$nextTick(() => {
        const element = this.$refs[ref][0];
        const height = element.offsetHeight;
        if (height === 0) {
          element.style.display = "block";
          const elemetCont = this.$refs[`${ref}Cont`][0];
          const Contheight = elemetCont.offsetHeight;
          element.style.height = Contheight + "px";
          this.$refs[`${ref}Icon`][0].style.transform = "rotate(-180deg)";
        } else {
          element.style.height = 0;
          const elemetCont = this.$refs[`${ref}Cont`][0];
          const Contheight = elemetCont.offsetHeight;
          this.$refs[`${ref}Icon`][0].style.transform = "rotate(0deg)";
          setTimeout(() => {
            element.style.display = "none";
          }, 300);
        }
      });
    },
    //去使用
    useCoupon(data) {
      if (!data.effective) {
        Toast("该卡券未在使用期限内～");
        return false;
      }
      // 跳转到商城搜索商品列表
      let path = "/mall2/list/" + this.$util.getDataString();
      this.$router.push({
        path: path,
        query: {
          skuIds: data.merchanDises,
          searchFrom: "coupon",
          jumpH5: "h5",
        }
      });
    },
    getList() {
      const host = process.env.VUE_APP_CENTER_APP;
      const url = host + "/times/member-bff/coupon/api/v1/coupon-member/list";
      const params = {
        memberId: this.memberId,
        pageIndex: this.pageIndex,
        businessType: "200001",
        pageSize: 10,
        state: 20
      };
      this.loading = true;
      this.$http
        .get(url, { params: params })
        .then(res => {
          if (res.data.code === 200) {
            this.couponList = this.couponList.concat(res.data.data.records);
            let nowTime = moment(Date.now()).format("YYYYMMDD");
            // 是否在有效期
            this.couponList.map(item => {
              const stareTime = moment(Number(item.validityStartTime)).format(
                "YYYYMMDD"
              );
              const endTime = moment(Number(item.validityEndTime)).format(
                "YYYYMMDD"
              );
              if (nowTime >= stareTime && nowTime <= endTime) {
                item.effective = true;
              } else {
                item.effective = false;
              }
              return item;
            });

            this.loading = false;
            if (this.couponList.length >= res.data.data.total) {
              this.finished = true;
            } else {
              this.pageIndex++;
            }
          } else {
            this.finished = true;
          }
          if (this.couponList.length === 0) {
            this.finished = true;
            this.showEmpty = true;
          }
        })
        .catch(err => {
          this.finished = true;
        });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
$btn-color = #ff7809;
$btn-fontSize = 12px;
.coupon-list-page {
  padding: 68px 0 78px 0;
  overflow-y: scroll;
  height: 100%;
  &.isWx {
    padding: 44px 0 78px 0;
  }

  .refresh-page {
    overflow: visible;
    min-height: 100% !important;

    /deep/ .van-pull-refresh__track {
      min-height: -webkit-fill-available;
    }
  }

  .bangdou-exchange-wrap {
    padding: 20px 16px;

    .bangdou-exchange {
      .bangdou-exchange-body {
        .exchange-body-item {
          border-radius: 16px;

          .bangdou-exchange-card {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: stretch;
            box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.12);
            border-radius: 12px;
            overflow: hidden;

            & + .bangdou-exchange-card {
              margin-top: 16px;
            }

            .exchange-card-left {
              width: 101px;
              height: 106px;
              background-image: url("../img/yellow_card.png");
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 100% 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .exchange-card-left-top {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;
                color: #fff;

                .card-left-top-type {
                  height: 16px;
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #ffffff;
                  line-height: 16px;
                }

                .card-left-top-num {
                  font-size: 18px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #ffffff;
                }
              }

              .exchange-card-left-bottom {
                height: 12px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 12px;

                margin-bottom: 10px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
              }

              .btn-share {
                background: #ffffff;
                border-radius: 15px;
                height: 22px;
                font-size: $btn-fontSize;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: $btn-color;
                line-height: 12px;
                border: 1px solid #ffffff;
              }
            }

            .exchange-card-right {
              position: relative;
              flex: 1;
              // width: 211px;
              height: 106px;
              background-color: #fff;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: stretch;
              padding-left: 12px;

              .exchange-card-right-left {
                padding: 14px 7px 0 0;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                flex: 1;
                padding-left: 12px;
                flex-flow: row wrap;

                .card-right-left-top {
                  font-size: 14px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 700;
                  color: #121212;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  width: 100%;
                }

                .card-right-left-middle {
                  padding-top: 0.16rem;
                  font-size: 0.24rem;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #8d8d8d;
                  align-self: flex-end;
                  line-height: 1;
                  width: 100%;
                  z-index: 2;
                }

                .card-right-left-bottom {
                  padding-top: 0.2rem;
                  padding-bottom: 0.2rem;
                  font-size: 0.2rem;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #bfbfbf;
                  line-height: 1;
                  align-self: flex-end;
                  width: 100%;
                }
              }

              .exchange-card-right-right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;

                .exchange-card-right-right-btn {
                  width: 72px;
                  height: 72px;
                  border-radius: 4px;
                  background-image: url("../img/food.png");
                  background-repeat: no-repeat;
                  background-position: center center;
                  background-size: 100% 100%;
                }
              }
            }

            .icon-arrow-down {
              vertical-align: bottom;
              transition: all 0.3s;
              bottom: -1px;
            }

            .goodsimg {
              width: 72px;
              height: 72px;
              border-radius: 4px;
              overflow: hidden;
            }

            .coupon-desc-wrap {
              width: 100%;
              height: 0;
              display: none;
              overflow: hidden;
              -webkit-transition: height 0.3s ease-in-out;
              transition: height 0.3s ease-in-out;
              will-change: height;
              box-shadow: 0px 0.12rem 0.6rem 0px rgba(71, 77, 96, 0.06);
              // margin-top: 4px;
              background-color: #ffffff;

              .coupon-desc {
                font-size: 12px;
                color: #bfbfbf;
                padding: 10px 16px;
                line-height: 18px;

                &-num {
                  margin-top: 8px;
                }
              }
            }

            .coupon-type {
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              margin-left: 4px;
              align-self: flex-end;
            }
          }

          .bangdou-exchange-rules {
            padding: 16px 12px 16px 16px;

            .bangdou-exchange-rules-item {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #bfbfbf;
            }

            .bangdou-exchange-rules-item:last-child {
              padding-top: 10px;
            }
          }
        }
      }
    }
  }
}

.exchange-footer {
  width: 100%;
  height: 78px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  background: #fafafa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .exchange-footer-item {
    flex: 1;
    height: 14px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #121212;
    line-height: 14px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;

    & + .exchange-footer-item::before {
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 14px;
      background: #d8d8d8;
    }
  }

  .exchange-footer-center {
    width: 1px;
    height: 14px;
    background: #d8d8d8;
  }

  .exchange-footer-right {
    flex: 1;
    height: 14px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #121212;
    line-height: 14px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
