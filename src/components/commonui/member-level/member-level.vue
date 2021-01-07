/**Created by liaoyingchao on 2019/1/10.*/

<template>
  <div class="member-level" ref="theComponent" v-if="refresh">
    <div class="item" :class="{'own': item.pointAmount <= $store.state.mall2.myAssets.levSurplusPoints}" v-for="(item, idx) in $store.state.memberLevel">
      <div class="name">{{item.name}}</div>
      <div class="img-div">
        <img :src="getLevelImg(item.pointAmount, idx+1)" @click="showEquity(item)">
      </div>
      <div class="points">{{item.pointAmount}}</div>
      <div class="line-div" v-if="idx != 0">
        <div class="line-w" :style="getWlineStyle(item.pointAmount, idx)">
          <div class="show-value" v-if="hasDian(item.pointAmount, idx)">
            <!--<div class="bubble" :style="value_style" ref="bubbleDiv">{{$store.state.mall2.myAssets.levSurplusPoints != '' ? $store.state.mall2.myAssets.levSurplusPoints : '0'}}</div>-->
          </div>
          <img class="dian" src="static/images/mycenter/dian.png" v-if="hasDian(item.pointAmount, idx)">
        </div>
      </div>
    </div>
    <van-popup v-model="show">
      <p class="p1">{{equityName}}会员权益</p>
      <div class="ulBox">
        <div class="ul">
          <ul>
            <li v-for="item in equityList" @click="checkEquity(item)">
              <img :src="item.equityPic" alt="">
              <div>
                <p class="ul_p">{{item.equityName.substr(0,4)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <span class="fill" @click="show=false">关闭</span>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "member-level",
  components: {},
  data() {
    return {
      refresh: true,
      value_style: "",
      show: false,
      equityName: "",
      equityList: []
    };
  },
  methods: {
    showEquity(item) {
      // 其他使用会员等级的地方会触发弹框
      if(this.$route.path != '/mall2/membershipinterests') return
      this.show = true;
      this.equityName = item.name;
      let paramsData = {
        token: this.$store.state.login.token,
        levelNo: item.id
      };
      this.$http
        .post("/app/equity_member/queryLevelEquity", paramsData)
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.equityList = data.data;
          } else {
            this.$Toast("获取会员权益失败");
          }
        });
    },
    checkEquity(item) {
      if (item.type == 1) {
        // 已拥有
        let paramsData = {
          token: this.$store.state.login.token,
          equityType: item.equityType,
          equityId: item.equityId
        };
        this.$http
          .post("/app/equity_member/queryMyEquityRecord", paramsData)
          .then(res => {
            let data = res.data;
            if (data.status == 0) {
              var eType = String(data.data.equityType).substr(0, 1);
              var equityType = data.data.equityType;
              if (eType == "1" || eType == "2" || eType == "4") {
                this.$router.push({
                  path: "/equity/have_equity",
                  query: {
                    detail: JSON.stringify(data.data)
                  }
                });
              } else if (equityType == "31") {
                // 调查问卷
                this.$router.push({
                  path: "/equity/question",
                  query: {
                    detail: JSON.stringify(data.data)
                  }
                });
              } else if (equityType == "32") {
                // 游戏
                this.$router.push({
                  path: "/equity/game_equity",
                  query: {
                    detail: JSON.stringify(data.data)
                  }
                });
              } else if (equityType == "33") {
                // 优惠券
                this.$router.push({
                  path: "/equity/couponList",
                  query: {
                    detail: JSON.stringify(data.data)
                  }
                });
              } else if (eType == "5") {
                // 第三方权益
                this.$router.push({
                  path: "/equity/third_services",
                  query: {
                    detail: JSON.stringify(data.data)
                  }
                });
              }
            } else {
              this.$Toast("获取我的权益失败");
            }
          });
      } else {
        // 未拥有
        this.$router.push({
          path: "/equity/magnification",
          query: {
            equityType: item.equityType
          }
        });
      }
    },
    hasDian: function(pointAmount, idx) {
      if (this.$store.state.mall2.myAssets.levSurplusPoints >= pointAmount) {
        return false;
      } else {
        let lArr = this.$store.state.memberLevel;
        let preItem = lArr[idx - 1];
        if (preItem) {
          if (
            this.$store.state.mall2.myAssets.levSurplusPoints >=
            preItem.pointAmount
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    getWlineStyle: function(pointAmount, idx) {
      if (this.$store.state.mall2.myAssets.levSurplusPoints >= pointAmount) {
        return "width: 100%";
      }
      let lArr = this.$store.state.memberLevel;
      let preItem = lArr[idx - 1];
      if (preItem) {
        let lVelue = pointAmount - preItem.pointAmount;
        let cVelue =
          this.$store.state.mall2.myAssets.levSurplusPoints -
          preItem.pointAmount;
        if (lVelue > 0) {
          let lNum = cVelue / lVelue * 100;
          return "width: " + lNum + "%";
        }
      }
    },
    getLevelImg: function(pointAmount, idx) {
      if (this.$store.state.mall2.myAssets.levSurplusPoints >= pointAmount) {
        return "static/images/mycenter/m_" + idx + "_1.png";
      } else {
        return "static/images/mycenter/m_" + idx + "_0.png";
      }
    },
    refreshStyle: function() {
      let iDoms = this.$refs.bubbleDiv;
      if (iDoms) {
        let iDom = iDoms[0];
        if (iDom) {
          let leftPx = -iDom.offsetWidth / 2;
          this.value_style = "margin-left: " + leftPx + "px;";
          console.log("this.value_style", this.value_style);
        }
      }
    }
  },
  watch: {
    "$store.state.mall2.myAssets.levSurplusPoints": function() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
        // this.refreshStyle()
      });
    }
  },
  mounted() {
    // this.refreshStyle()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.member-level {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;

  .item {
    position: relative;
    z-index: 9;
    flex: 1;
    text-align: center;
    color: #85581B;

    &.own {
      color: black;
    }

    .name {
      font-size: 12px;
    }

    .img-div {
      margin: 5px;
      font-size: 0px;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .line-div {
      position: absolute;
      left: -50%;
      right: 50%;
      margin: 0 16px;
      top: 32px;
      z-index: 1;
      background-color: #D2B578;
      height: 2px;

      .line-w {
        position: relative;
        z-index: 9;
        background-color: white;
        height: 100%;
        width: 0;

        .dian {
          position: absolute;
          right: -4px;
          top: -3px;
          width: 8px;
          height: 8px;
        }

        .show-value {
          float: right;
          width: 0px;
          height: 100%;
          position: relative;
        }

        .bubble {
          background-color: white;
          padding: 2px 4px;
          border-radius: 4px;
          position: absolute;
          min-width: 20px;
          top: 0px;
          left: 0;
          margin-top: -24px;
          font-size: 10px;
          // margin-left -17px;
        }

        .bubble:after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -4px;
          width: 0;
          height: 0;
          border-width: 4px;
          border-style: solid;
          border-color: transparent;
          margin-bottom: 2px;
          border-top-width: 4px;
          border-top-color: currentColor;
          color: white;
        }
      }
    }
  }
}
</style>
