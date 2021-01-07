/**Created by dmj on 2018/1/4.*/

<template>
  <div class="membership">
    <nav-top title="会员权益" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="bg-red">
        <img src="static/image/invoice/hyqy.png" class="img" alt="">
      </div>
      <div class="content">
        <div class='card-pk'>
          <div class="swiper-content" :style="{backgroundImage: 'url(' + bgStyle + ')'}">
            <div class="title-tips">
                  <span class="img-title">
                    <img src="./img/tips(1).png" alt="">
                    <span class="title">{{responseRankDetail.name}}(成长值:{{responseRankDetail.point}})</span>
                  </span>
              <span class="jf" @click="openStrategy">成长攻略</span>
            </div>
            <div class="jf-progress">
              <MemberLevel></MemberLevel>
            </div>
            <div class="jf-details">
              <p class="cumulative-jf">成长值<span class="jf-num">{{responseRankDetail.point}}</span></p>
              <p class="need-jf">你距离下个等级还需<span class="jf-num">{{responseRankDetail.remPoint}}</span>成长值</p>
            </div>
          </div>
        </div>
        <div class="jf-history" @click="openJfhistory">
          <div class="my-jf">
              <span class="left">
                <img src="./img/jslc.png" alt="">
                <span class="text">我的成长历程</span>
              </span>
            <span class="right">点击查看</span>
          </div>
        </div>
        <div class="btn-info">
          <p class="title">{{responseRankDetail.name}}专属{{responseRankDetail.number}}大特权</p>
          <ul class="pk-btn">
            <li class="btn-list" @click="openQy(item)" v-for="(item, index) in responseRankDetail.rightList"
                :key="index">
              <div class="btn-show" :class="{'noOPen': item.type == 0}">
                <div class="btn">
                  <img :src=item.imageUrl>
                </div>
                <p class="text">{{item.name}}</p>
                <div class="trapezoid" v-if="item.type == 0">
                  <span class="text" v-if="item.levelName != ''">
                    {{item.levelName}}点亮
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <mt-popup
            v-model="popupVisible"
            position="center"
            class="popup-content"
          >
          </mt-popup>
        </div>
        <div class="ulBox">
          <p>我的权益</p>
          <div class="ul">
            <ul>
              <li v-for="item in myEqupityList" @click="equityDetial(item)"><img :src="item.equityPic" alt=""><div><p class="ul_p">{{(item.equityName).substr(0,4)}}</p></div></li>
            </ul>
          </div>
        </div>
      </div>
    </nav-content>

    <AdPage :pageAdKeywords="'AD_Key_MembershipInterests'"></AdPage>
  </div>
</template>

<script>
  import {Dialog} from 'vant'
  import {Swipe, SwipeItem, Popup, Toast} from 'mint-ui'
  import MemberLevel from '@/components/commonui/member-level/member-level'
  import AdPage from '@/components/product/index/subpage/adpage'

  export default {
    name: "",
    components: {
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Popup.name]: Popup,
      [Toast.name]: Toast,
      [Dialog.name]: Dialog,
      MemberLevel,
      AdPage
    },
    data() {
      return {
        responseRankDetail: '',
        popupVisible: false,
        show: false,
        bgs: [],
        bgStyle: '',
        myEqupityList:[]
      }
    },
    mounted() {
      this.myEqupity()
      this.bgs = JSON.parse(this.$route.query.bgs)
      this.getMyCardBgImg()
      this.getResponseRankDetail()

    },
    methods: {
      getMyCardBgImg: function () {
        let idx = this.$market.getMemberLevelIndex(this.$store.state.mall2.myAssets.levelNo)
        idx = idx - 1
        let imgUrl = this.bgs[idx]
        this.bgStyle = imgUrl
        console.log(this.bgStyle)
        //return imgUrl
      },
      getResponseRankDetail() {
        // 获取会员权益信息
        let paramsData = {
          token: this.$store.state.login.token,
        }
        this.$http.post('/app/json/user_rights/responseRankDetail', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.responseRankDetail = data.data
          } else {
            // this.$Toast('获取会员权益失败')
          }
        })
      },
      myEqupity(){  // 我的权益列表
        let paramsData = {
          token: this.$store.state.login.token,
        }
        this.$http.post('/app/json/equity_member/queryMyEquity', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.myEqupityList = data.data
          } else {
            this.$Toast('获取我的权益失败')
          }
        })
      },
      equityDetial(item){
        let paramsData = {
          token: this.$store.state.login.token,
          equityType:item.equityType,
          equityId:item.equityId,
          id:item.id,
          type: 8
        }
        this.$http.post('/app/equity_member/queryMyEquityRecord', paramsData).then(res => {
          console.log(res)
          let data = res.data
          if (data.status == 0) {
            var eType = String(data.data.equityType).substr(0,1);
            var equityType = data.data.equityType;
            if(eType == '1' || eType == '2' || eType == '4') {
              this.$router.push({
                path: '/equity/have_equity',
                query: {
                  detail: JSON.stringify(data.data)
                }
              })
            } else if(equityType == '31'){ // 调查问卷
              this.$router.push({
                path: '/equity/question',
                query: {
                  detail: JSON.stringify(data.data)
                }
              })
            } else if(equityType == '32'){  // 游戏
              this.$router.push({
                path: '/equity/game_equity',
                query: {
                  detail: JSON.stringify(data.data)
                }
              })
            } else if(equityType == '33'){  // 优惠券
              this.$router.push({
                path: '/equity/couponList',
                query: {
                  detail: JSON.stringify(data.data)
                }
              })
            } else if(equityType == '51001'){  // 客服约车
                this.$router.push({
                    path: '/equity/car_customer_service',
                    query: {
                        detail: JSON.stringify(data.data)
                    }
                })
            } else if(eType == '5'){  // 第三方权益
              this.$router.push({
                path: '/equity/third_services',
                query: {
                  detail: JSON.stringify(data.data)
                }
              })
            }
          } else {
            this.$Toast('获取我的权益失败')
          }
        })
      },
      openQy(item) {
        Dialog.alert({
          title: item.name,
          message: item.remark ? item.remark : '暂无说明'
        })
      },
      openStrategy() {
        // 打开积分攻略页面
        this.$router.push({
          path: '/mall2/integralstrategy',
          // query: {
          //   id: id
          // }
        })
      },
      openJfhistory() {
        // 打开积分历程页面
        this.$router.push({
          path: '/mall2/integralhistory',
          // query: {
          //   id: id
          // }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .container {

    .bg-red {
      width: 100%
      position: relative

      .img {
        width: 100%
      }
    }

    .content {
      position absolute
      top: 10px
      left: 0
      right: 0
      overflow-y auto
      bottom 0
      -webkit-overflow-scrolling touch

      .card-pk {
        position relative
        padding: 0 15px

        .swiper-content {
          background: url('./img/qybg.png') no-repeat center center / 100% 100%;
          border-radius 10px
          height 200px
          .title-tips {
            display flex
            justify-content space-between
            padding 10px 0 0 10px;

            .img-title {
              img {
                width: 20px
                vertical-align middle
              }

              .title {
                display inline-block
                vertical-align middle
                padding-left: 4px;
                font-weight bold
                color: #443204
                font-size: 16px
              }
            }

            .jf {
              padding: 4px 6px 3px 8px
              background: #83591a
              color: #fffdf9
              border-bottom-left-radius 10px
              border-top-left-radius 10px
            }
          }

          .jf-progress {
            margin 35px 10px 0px
          }

          .jf-details {
            width: 100%
            color: #e8eaf1
            text-align center
            position absolute
            bottom: 0
            left: 50%
            transform translate(-50%, -50%)
            letter-spacing 1px

            .cumulative-jf {
              font-size: 16px
              font-weight bold
              margin-bottom 6px
              color: #98844f

              .jf-num {
                font-size 22px
                color: #ac2431
              }
            }

            .need-jf {
              font-size 14px
              color: #967d3b

              .jf-num {
                color: #ac2431
              }
            }
          }
        }
      }

      .jf-history {
        margin: 10px 0
        color: #1a1a1a
        width: 100%
        padding: 0 15px

        .my-jf {
          border-radius 4px
          height: 50px
          background: url('./img/jfhis.png') 130px -10px no-repeat #f9e3b7
          background-size: 150px 65px;
          padding: 0 10px
          position relative

          .left {
            font-size: 12px

            img {
              width: 20px
              position: absolute
              top: 50%
              left: 10px
              transform translate(0, -50%)
            }

            .text {
              position: absolute
              top: 20px
              left: 35px
            }
          }

          .right {
            position: absolute
            top: 20px
            right: 10px
          }
        }
      }

      .btn-info {
        padding-top: 10px

        .title {
          text-align center
          font-size: 20px
          font-weight bold
          color: #1a1a1a
        }

        .pk-btn {
          display: flex
          flex-wrap wrap
          padding: 0 15px 0 0
          margin-top: 10px

          .btn-list {
            width: 33%
            padding: 0 0 10px 15px

            .btn-show {
              padding: 23px 0px 12px 0
              background: #f1e3c1
              border-radius 6px
              position relative

              .btn {
                background: #fff
                border: 1px solid #ddbe80
                width: 50%
                margin: 0 auto
                padding-bottom: 50%
                border-radius 50%
                position relative

                img {
                  width: 25px
                  height: 20px
                  position absolute
                  top: 50%
                  left: 50%
                  transform translate(-50%, -50%)
                }
              }

              .text {
                margin-top: 10px
                color: #967d3b
                text-align center
                font-weight bold
              }

              .trapezoid {
                background: url("./img/jb.png") no-repeat
                width: 50%
                height: 50%
                position: absolute
                top: 0
                left: 0
                background-size 60px 60px

                .text {
                  width: 100%
                  height: 80%
                  display: inline-block
                  position: absolute
                  top: 3px
                  left: 3px
                  color: #999
                  font-size 10px;
                  transform: scale(0.8) rotate(-44deg)
                }
              }

            }

            .noOPen {
              background: #efefef

              .btn {
                border: 1px solid #e8e5e5
              }
            }
          }
        }
      }
    }
  }
  /deep/ .ulBox {
      padding: 0 10px
      margin-top 25px
      p {
        text-align: center;
        font-size: 0.533333rem;
        font-weight: bold;
        color: #1a1a1a;
      }
      .ul {
        margin 20px 0
        ul {
          display flex
          flex-wrap: wrap;
          border 1px solid #d3a26a
          li {
            text-align center
            padding 10px 0px
            width 25%
            border 1px solid #fff
            img {
              width: 40px;
              height: 40px;
              display: inline-block;
            }
            .ul_p {
              color #d3a26a
              margin 10px 0
              font-size 14px
            }
          }
        }
      }
    }
  /deep/ .active{
    border:1px solid #d3a26a !important;
  }
  /deep/ .van-popup {
    width 80%
    padding 12px
    font-size 16px
    .p1 {
      text-align center;
      height 40px;
      line-height 40px
    }
    li {
      width 33.3% !important
    }
    ul {
      border 0 !important
    }
    .fill {
      color: #7f5723;
      border: 1px solid;
      border-radius: 13px;
      margin: 0 auto;
      margin-top 20px
      display: block;
      height: 25px;
      width: 100px;
      line-height: 25px;
      text-align: center;
      margin-bottom 20px
    }
  }
</style>
