
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <ul class="card" v-if="authentication.length">
        <li class="cardList" v-for="(item,index) in authentication" :key="index" @click="cardListBtn(item)" >
          <div class="mark" v-if="item.industryClusterMember || !item.state" :style="'background-image: url('+`static/image/vocational-certification/${imgBg(item)}.png`+')'">
            <span class="text">{{item.state ? cardListType(item.industryClusterMember.clusterState) : '已关闭'}}</span>
          </div>
          <img class="item-img" v-lazy="item.clusterImgUrl || `static/image/vocational-certification/${item.imgUrl}.png`" alt />
          <p class="item-name">{{item.clusterName}}</p>
        </li>
      </ul>
      <div class="no-list" v-else>
        <img src="static/image/mall2/no-data-img.png">
        <span class="tip theme_font_gray">{{funStatus ? '抱歉没有找到认证信息~' : '正在加载数据...'}}</span>
      </div>
    </nav-content>
    <van-popup v-model="isDelete" class="popupCard">
      <div class="popupCardText">
        <span>群组已解散</span>
      </div>
      <div class="popupCardBtn">
       <span @click="deleteConfirm">删除</span>
      </div>
    </van-popup>
    <van-popup v-model="popupCard" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>{{popupCardText}}</span>
      </div>
      <div class="popupCardBtn">
        <span @click="popupCard=false">取消</span>
        <span @click="popupCard=false">知道了</span>
      </div>
    </van-popup>
    <van-popup v-model="popupCardKa" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>您尚未绑定加油卡，</span>
        <span>需要绑定加油卡后方可参与活动！</span>
      </div>
      <div class="popupCardBtn">
        <span @click="popupCardKa=false">取消</span>
        <span @click="openingCard">立即绑定</span>
      </div>
    </van-popup>
    <van-popup v-model="industry" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>当前身份证信息和驾驶证信息不一致</span>
        <span>请重新提交！</span>
      </div>
      <div class="popupCardBtn">
        <span @click="industry=false">取消</span>
        <span @click="industryBtn">确定</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
import mixin from "./mixin";
export default {
  name: "home",
  mixins: [mixin],
  data() {
    return {
      industry: false,
      isDelete: false,
      popupCard: false,
      popupCardKa: false,
      funStatus: false,
      popupCardText: '',
      authentication: [],
      itemObj: {}
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.post(this.industryClusterUrl, {}).then(res => {
        this.funStatus = true
        let data = res.data;
        if (res.status == 0) {
          this.authentication = data || []
        } else {
          this.$Toast(res.info)
        }
      })
    },
    backEvent() {
      this.$router.go(-1);
    },
    industryBtn() {
      this.$request.post('/app/json/user/industryRecertification', {}).then(res => {
        if (res.status == 0) {
          this.getList()
          this.industry = false
        } else {
          this.$Toast(res.info)
        }
      })
    },
    cardListBtn(item) {
      if(item.state){
        let type = item.industryClusterMember ? item.industryClusterMember.clusterState : null
        if (type == 0) {
          this.$router.push({
            path: "/vocational_certification/feedback",
            query: item
          });
        } else if (type == 1 || type == 2) {
          this.$router.push({
            path: "/vocational_certification/group",
            query: item
          });
        } else if (type == 3) {
          this.popupCard = true
          this.popupCardText = '您被移出群组，无法进行认证!'
        } else if (type == 4) {
          this.popupCard = true
          this.popupCardText = '当前群租已解散，无法进行认证!'
        } else if (type == 5) {
          this.popupCard = true
          this.popupCardText = '正在审核中...'
        } else {
          let cardList = JSON.parse(item.expression).cardList
          if (cardList.includes('IDcard') && cardList.includes('DriverCard')) {
            this.getCheckIdentifyAllDetail().then(res=>{
              // "DriverCard" 驾驶证
               // "IDcard" 身份证
              // "isCertificate":1:已认证，其他未认证,（身份）
              // "isDrinving":1:已认证，其他未认证,（驾驶证）
              // "isVehicle":1:已认证，其他未认证（行驶证或车辆)
              if (res.isCertificate && res.isDrinving) {
                if (res.usercertificate.idcardNum != res.driverInfoModel.driveCode) {
                  this.industry = true
                } else {
                  if (JSON.parse(item.expression).isoilCard == '1') {
                    this.checkBindOilCard().then(res=>{
                      if (res) {
                        this.$router.push({
                          path: "/vocational_certification/authentication",
                          query: item
                        });
                      }
                    })
                  } else {
                    this.itemObj = item
                    this.$router.push({
                      path: "/vocational_certification/authentication",
                      query: item
                    });
                  }
                }
              } else {
                if (JSON.parse(item.expression).isoilCard == '1') {
                  this.checkBindOilCard().then(res=>{
                    if (res) {
                      this.$router.push({
                        path: "/vocational_certification/authentication",
                        query: item
                      });
                    }
                  })
                } else {
                  this.itemObj = item
                  this.$router.push({
                    path: "/vocational_certification/authentication",
                    query: item
                  });
                }
              }
            })
          } else {
            if (JSON.parse(item.expression).isoilCard == '1') {
              this.checkBindOilCard().then(res=>{
                if (res) {
                  this.$router.push({
                    path: "/vocational_certification/authentication",
                    query: item
                  });
                }
              })
            } else {
              this.itemObj = item
              this.$router.push({
                path: "/vocational_certification/authentication",
                query: item
              });
            }
          }
        }
      } else {
        this.$router.push({
          path: "/vocational_certification/details",
          query: item
        });

        // this.popupCard = true
        // this.popupCardText = '群组关闭，暂停申请认证!'
      }
    },
    checkBindOilCard() {
      return new Promise((resolve, reject) => {
        let obj = { phone: this.userInfo.phone };
        this.$request.post(this.checkBindOilCardUrl, obj).then(res => { // 验证是否绑卡
          if (res.status == 0) {
            let status = res.data;
            this.popupCardKa = !status;
            resolve(status)
          } else{
            reject()
            this.$Toast(res.info)
          }
        });
      })
    },
    openingCard() { // 跳转绑卡
      this.$router.push({
        path: "/addCard"
      });
    },
    deleteConfirm(){
      this.isDelete = false
    },
    getCheckIdentifyAllDetail() {
      return new Promise((resolve, reject) => {
        this.$request.post(this.checkIdentifyAllDetail, {}).then(res => {
          if (res.status == 0) {
            let data = res.data
            resolve(data)
          } else {
            this.$Toast(res.info)
          }
        })
      })
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .card {
    width: 100%;
    height: 100%;
    padding: 0 5px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .cardList {
      height: 150px;
      width: calc(50% - 10px);
      float left
      margin 5px
      margin-bottom 0
      text-align: center;
      position: relative;
      border-radius: 6px;

      .item-img {
        width: 100%;
        height: 110px;
        display: block;
        border-radius: 6px;
      }

      .item-name {
        height: 40px;
        line-height: 40px;
        font-size 14px
      }

      .mark {
        height: 60px;
        width: 60px;
        position: absolute;
        top: 0;
        right: 0px;
        background: no-repeat center center;
        background-size: 100% 100%;

        >:first-child {
          color: #fff;
          display: block;
          margin-top: 13px;
          margin-left: 12px;
          transform: rotate(45deg);
        }
        .text {
          font-size 8px
          margin-top 14px
          margin-left 14px
        }
      }
    }
  }
  .no-list {
    height 60%
    width 100%
    display flex
    justify-content center
    align-items center
    flex-direction column
    img {
      width: 150px;
    }
    .tip {
      display block;
      margin-top: 10px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
    }
  }
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 16px

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:last-child {
        color #fff;
        background-color #f02e2c
      }
    }
  }
}
</style>
