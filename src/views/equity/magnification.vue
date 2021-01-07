/**未拥有*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益详情" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="containerTop">
        <div class="card">
          <img src="./imgs/card.png" alt="">
          <div class="wenjuan"><img :src="detail.equityPic" alt="">
            <div>
              <p>{{detail.equityName}}</p>
              <p>{{detail.equityValue}}</p>
            </div>
          </div>
          <div class="youxiao">
            <span>{{detail.Effective}}</span>
            <span>{{detail.levelEquity}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="div">
          <div class="titleDiv">
            <div><img class="img" src="./imgs/huangguan.png" alt="">
              <span>权益介绍</span>
            </div>
            <p class="p">{{detail.equityDes}}</p>
          </div>
        </div>
        <div class="div">
          <div class="titleDiv">
            <div>
              <img class="img" src="./imgs/wen.png" alt="">
              <span>使用指南</span>
            </div>
            <p class="p">{{detail.instructions}}</p>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "magnification",
  data() {
    return {
      detail: {}
    };
  },
  computed: {
    bg() {
      return require("./imgs/bg1.png");
    }
  },
  mounted() {
    var equityType = JSON.parse(this.$route.query.equityType);
    let paramsData = {
      token: this.$store.state.login.token,
      equityType: equityType
    };
    this.$http
      .post("/app/equity_member/queryMyEquityRecord", paramsData)
      .then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.detail = data.data;
          this.eType = String(this.detail.equityType).substr(0, 1);
          var detail = this.detail;
          if (detail.validityType == 1) {
            detail.Effective = "永久有效";
          } else if (detail.validityType == 2) {
            detail.Effective = detail.days + "天内有效";
          } else if (detail.validityType == 3) {
            detail.Effective = detail.endTime + "前有效";
          }
        } else {
          this.$Toast("获取我的权益失败");
        }
      });
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
/deep/ .nav-content {
  overflow-y: auto !important;
}

.containerTop {
  width: 100%;
  height: 100px;
  background-position: 50% 50%;
  background: url('./imgs/bg2.png') no-repeat center;
  overflow: hidden;
  background-size: 100% 100%;

  .card {
    width: 90%;
    position: absolute;
    left: 5%;

    img {
      width: 100%;
    }

    .youxiao {
      position: absolute;
      bottom: 22px;
      width: 80%;
      left: 50%;
      margin-left: -40%;
      color: #896123;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }

    .wenjuan {
      position: absolute;
      top: 20%;
      left: 8%;

      img {
        width: 40px !important;
        float: left;
      }

      div {
        float: left;
        display: flex;
        flex-direction: column;
        height: 40px;
        margin-left: 6px;

        p {
          margin: auto 0;
        }

        p:nth-child(1) {
          font-size: 14px;
        }

        p:nth-child(2) {
          font-size: 14px;
          color: #626763;
        }
      }
    }
  }
}

.box {
  margin: 70px 0 20px 0;
}

.div {
  width: 92%;
  margin: 20px auto;

  .titleDiv {
    div {
      display: flex;

      img {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin: auto 0;
      }

      span {
        font-size: 20px;
        font-weight: 600;
        margin: auto 0;
        margin-left: 15px;
      }
    }

    .p {
      color: #999999;
      font-size: 14px;
      text-indent: 1rem;
      line-height: 20px;
      margin-bottom: 10px;
    }

    .p1 {
      font-size: 15px;
      margin: 7px 0;
    }
  }
}

.ul {
  margin: 20px 0;

  ul {
    display: flex;
    justify-content: space-around;
    border: 1px solid #d3a26a;

    li {
      text-align: center;
      padding: 10px;

      img {
        width: 40px;
        height: 40px;
        display: inline-block;
      }

      .ul_p {
        color: #d3a26a;
        margin: 10px 0;
        font-size: 14px;
      }
    }
  }
}
</style>
