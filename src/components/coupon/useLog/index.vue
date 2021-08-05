<template>
  <div class="exchange-container">
    <div class="exchange-info">
      <van-tabs v-model="active" :sticky="true" type="card" @click="tabChange">
        <van-tab
          :title="tab.label"
          v-for="(tab, index) in tabList"
          :key="`tab${tab.status}`"
        >
          <!-- <zk-empty
            image="coupon"
            v-if="!loading && !list[index].length"
            description="暂无优惠券使用"
          ></zk-empty> -->
          <div class="bangdou-exchange-wrap">
            <div class="bangdou-exchange">
              <div class="bangdou-exchange-body">
                <div class="exchange-body-item">
                  <div
                    class="bangdou-exchange-card"
                    :class="{ 'row-reverse': item.activity === '4014' }"
                    v-for="(item, cIndex) in list[index]"
                    :key="`tab${index}${item.id}`"
                  >
                    <div class="exchange-card-item exchange-card-right">
                      <div class="exchange-card-right-right">
                        <img
                          class="goodsimg"
                          v-if="item.activity !== '4014'"
                          :src="item.image || defaultImg"
                        />
                        <div class="disabled-btn" v-else>
                          已领取
                        </div>
                      </div>

                      <div class="exchange-card-right-left">
                        <div class="card-right-left-top">
                          {{ item.couponTitle }}
                        </div>
                        <div class="card-right-left-middle">
                          {{ getTime(item.validityStartTime) }}-{{
                            getTime(item.validityEndTime)
                          }}
                        </div>
                        <div
                          class="card-right-left-bottom"
                          @click="collapse(`tab${index}couponDesc${cIndex}`)"
                        >
                          使用规则
                          <van-icon
                            name="arrow-down"
                            size="12"
                            class="icon-arrow-down"
                            :ref="`tab${index}couponDesc${cIndex}Icon`"
                          ></van-icon>
                        </div>
                      </div>
                      <div
                        class="card-used"
                        :class="[
                          { 'used-img': item.couponStatus === 40 },
                          { 'expired-img': item.couponStatus === 70 }
                        ]"
                      ></div>
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
                            {{ item.faceAmount | delPoint }}
                          </div>
                        </template>
                      </div>
                      <div class="exchange-card-left-bottom">
                        {{ couponType(item) }}
                      </div>
                    </div>
                    <div
                      class="coupon-desc-wrap"
                      :ref="`tab${index}couponDesc${cIndex}`"
                    >
                      <div
                        class="coupon-desc"
                        :ref="`tab${index}couponDesc${cIndex}Cont`"
                      >
                        <div class="coupon-desc-li" v-html="item.memo"></div>
                        <div class="coupon-desc-num">
                          券编号：{{ item.couTypeCode }}
                        </div>
                      </div>
                    </div>
                    <!-- 已使用图片 -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
const defaultImg = require("../img/coupon-default.png");
export default {
  data() {
    return {
      isActive: true,
      active: 0,
      defaultImg: defaultImg,
      loading: false,
      showNull: false,
      nullMsg: "",
      memberId: "",
      //宠物信息
      petsUpdateList: [],
      busy: false,
      tabList: [
        {
          label: "已使用",
          status: "40"
        },
        {
          label: "已过期",
          status: "70"
        }
      ],
      list: [[], []]
    };
  },
  components: {},
  created() {
    this.getList();
  },
  methods: {
    getTime(time) {
      const date = new Date(+time);
      return moment(date).format("YYYY.MM.DD");
    },
    //切换tab
    tabChange(index) {
      console.log(`切换tab`, index);
    },
    getList() {
      const host = process.env.VUE_APP_CENTER_APP;
      const url = host + "/times/member-bff/coupon/api/v1/coupon-member/list";
      const params = {
        // memberId: this.memberId,
        memberId: "2436937849312908812", //本地测试
        pageIndex: 1,
        businessType: 0,
        pageSize: 10,
        state: 70
      };
      this.$http.get(url, { params: params }).then(res => {
        console.log(`getList`, res);
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.exchange-container {
  // /deep/ .van-sticky {
  //   padding-top: 20px;
  //   background-color: #fff;
  // }
  ::v-deep .van-sticky {
    padding-top: 20px;
    background-color: #fff;
  }
  .exchange-info {
    font-size: 18px;

    ::v-deep .van-tabs__wrap {
      height: 42px;
    }

    ::v-deep .van-tabs__nav--card {
      height: 42px;
      border: none;
      background: #f5f5f7;
      border-radius: 8px;
      overflow: hidden;
    }

    ::v-deep .van-tab {
      height: 42px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
    }

    ::v-deep .van-tabs__nav--card .van-tab.van-tab--active {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #e8374a;
      background-color: #fcecee;
    }

    ::v-deep .van-tabs__nav--card .van-tab {
      border-right: none;
    }

    .exchange-tab-wrap {
      .bangdou-exchange-wrap {
        padding: 20px 16px;

        .bangdou-exchange {
          .bangdou-exchange-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 16px;

            .exchange-header-title {
              font-size: 18px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #290000;
            }

            .exchange-header-seemore {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #121212;
            }
          }

          .bangdou-exchange-body {
            .exchange-body-item {
              margin-bottom: 16px;
              border-radius: 16px;

              .bangdou-exchange-card {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: stretch;
                box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
                border-radius: 12px;
                overflow: hidden;

                // margin-bottom: 16px;
                & + .bangdou-exchange-card {
                  margin-top: 16px;
                }
                .exchange-card-left {
                  width: 101px;
                  height: 106px;
                  background-image: url("../img/gray_right.png");
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

                  .exchange-card-left-btn {
                    width: 68px;
                    height: 22px;
                    background: #ffffff;
                    border-radius: 15px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ff7709;
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

                    .disabled-btn {
                      width: 68px;
                      height: 24px;
                      background: #f5f5f5;
                      border-radius: 15px;
                      color: #d8d8d8;
                      font-size: 12px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 20px;
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
                  margin-top: 4px;
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
              .row-reverse {
                flex-flow: row-reverse;
                flex-wrap: wrap;
                .exchange-card-left {
                  background-image: url("../img/gray_left.png");
                }
                .exchange-card-right .exchange-card-right-left {
                  padding-left: 0;
                }
                .exchange-card-right {
                  flex-flow: row-reverse;
                }
                .card-left-top-num {
                  font-weight: 600;
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
    .card-used {
      width: 49px;
      height: 52px;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 49px 52px;
      &.used-img {
        background-image: url("../img/has_used.png");
      }
      &.expired-img {
        background-image: url("../img/has_expired.png");
      }
    }

    .exchange-main-null {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
    }
  }
}
</style>
