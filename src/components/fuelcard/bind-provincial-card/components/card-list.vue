<template>
  <div class="content">
    <div class="card-banner">
      <img src="../../images/banner.png" alt="">
      <div class="go-records" @click="gorecords">
        <p class="banner-txt">绑卡记录</p>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="card-list">
      <div class="card-item" v-for="(item, index) in cardListArr" :key="index">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="top-content">
            <div slot="title" class="item-content-title-news">
              <img src="../../bindCompanyCard/image/logo@2x.png" alt width="40"/>
              <div class="card-info">
                <span>加油卡卡号</span>
                <p class="card-number">{{item.cardNo | jiami}}</p>
              </div>
            </div>
          </div>
          <div class="item-content-nav">
            <div class="item-nav-right">
              <p @click="unbindFun(item)">解绑</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <van-dialog v-model="ismodal" title="温馨提示" show-cancel-button @confirm="confirm">
      <p>是否解绑该加油卡？</p>
    </van-dialog>
    
    <div class="bind-btns">
      <div class="bind-card-btn">
        <p @click="addCard">添加外省卡</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      cardListData: Array
    },
    data() {
      return {
        ismodal: false, // 解绑弹框
        unbindCardno: '',
        cardListArr: []
      }
    },
    mounted() {
      // this.cardListArr = JSON.parse(JSON.stringify(this.cardListData))
      // console.log(this.cardListData, this.cardListArr)
      this.getCardList()
    },
    methods: {
      addCard() {
        this.$emit('addProCard')
      },
      gorecords() {
        this.$router.push('/bind_provincial_card_record')
      },
      getCardList() {
        this.$request.post('/app/json/card/getOtherProvincesCardList').then(res => {
          if (res.status == 0) {
            this.cardListArr = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      unbindFun(item) {
        this.ismodal = true
        this.unbindCardno = item.cardNo
      },
      confirm() {
        this.$request.post('/app/json/card/unBindOtherProvincesCard', {
          cardno: this.unbindCardno
        }).then(res => {
          if (res.status == 0) {
            this.$Toast('解绑成功')
            this.getCardList()
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    filters: {
      jiami(cardNumber) {
        return cardNumber.substr(0, 4) + '****' + cardNumber.substr(-4)
      }
    }
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  .content {
    background: #F7F7F7;
    padding: 10px;
    height: 100%;
    padding-bottom: 190px;
    
    .card-banner {
      position: relative;
      margin: 0 -10px;
      
      img {
        width: 100%
      }
      
      .go-records {
        position: absolute;
        right: 10px;
        bottom: 10px
        display: flex;
        color: #fff;
      }
    }
    
    .card-list {
      margin-top: 15px;
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      
      .card-item {
        margin-bottom: 15px;
        box-shadow: 0px 2px 8px #bfbfbf;
        border-radius: 10px;
        
        .card-bg {
          background-color: #ff001a;
          height: 30px;
          border-radius: 10px;
          width: 100%;
          z-index: 1;
        }
        
        .card-content {
          box-shadow: 1px 3px 5px #f8f8f8;
          background: #fff;
          border-radius: 10px;
          z-index: 2;
          margin-top: -25px;
          padding: 10px 10px 0 10px;
          
          .top-content {
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            
            .item-content-title-news {
              display: flex;
              align-items: flex-end;
              justify-content: flex-start;
              
              .card-info {
                margin-left: 10px;
                display: flex;
                flex-direction column;
                justify-content: space-between;
                flex-wrap: wrap;
                align-content: space-between;
                
                span {
                  line-height: 25px;
                }
                
                .card-number {
                  font-size: 16px;
                }
              }
            }
          }
          
          .item-content-nav {
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 14px;
            
            .item-nav-right {
              text-align: center;
              width: 20%;
              
              p {
                border: 1px solid red;
                border-radius: 20px;
                padding: 4px 0;
                color: red;
              }
            }
          }
        }
      }
    }
    
    .bind-btns {
      position: fixed;
      height: 60px;
      line-height 60px;
      background: #fff;
      bottom: 0;
      left: 0;
      right: 0;
      display flex;
      align-items center;
      
      .bind-card-btn {
        position absolute;
        left 10px;
        right 10px;
        height 40px;
        line-height 40px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        background: #E20000;
        border-radius: 25px;
      }
    }
  }
  
  /deep/ .van-dialog__content {
    padding: 20px;
    text-align: center;
  }
</style>