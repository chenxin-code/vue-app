<template>
  <div class="content">
    
    <div class="add-pro-btn" @click="addProCard">
      <van-icon name="add" size="20" color="#E20000"/>
      <p style="margin-left: 5px;">添加外省卡</p>
    </div>
    
    <div class="add-card-list">
      <div class="card-item" v-for="(item, index) in addcardList" :key="index">
        <div class="left">加油卡卡号：</div>
        <div class="center">
          <input type="text" v-model="item.cardNumber"  placeholder="加油卡卡号"/>
        </div>
        <div class="right">
          <van-icon name="delete" size="18" @click="deleteCard(index)"/>
        </div>
      </div>
    </div>
    
    <van-dialog v-model="ismodal" title="温馨提示">
      <p>是否解绑该加油卡？</p>
    </van-dialog>
    
    <div class="bind-btns">
      <div class="bind-card-btn">
        <p @click="goCardlist">预约</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ismodal: false,
        addcardList: [
          {
            cardNumber: ''
          }
        ]
      }
    },
    mounted() {
    },
    methods: {
      goCardlist() {
        let cardNoList = []
        let flag = true
        this.addcardList.forEach((item, index) => {
          if (item.cardNumber && item.cardNumber.trim().length == 19) {
            cardNoList.push(item.cardNumber)
          } else {
            flag = false
            this.$Toast(`第${index + 1}张加油卡卡号不正确`)
            return
          }
        })
        if (!flag) return
        let params = {
          cardNoList: cardNoList
        }
        console.log(params)
        this.$request.post('/app/json/card/submitOtherProvincesCard', params).then(res => {
          if (res.status == 0) {
            this.$Toast('预约成功')
            this.$emit('goCardlist')
          } else {
            this.$Toast(res.info)
          }
        })
      },
      addProCard() {
        this.addcardList.push({
          cardNumber: ''
        })
      },
      deleteCard(index) {
        this.addcardList.splice(index, 1)
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  .content {
    background: #F7F7F7;
    padding: 10px;
    height: 100%;
    padding-bottom: 120px;
    
    .add-pro-btn {
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      font-size: 16px;
      border-radius: 7px;
      box-shadow: 0 2px 5px #ccc;
    }
    
    .add-card-list {
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 15px;
      
      .card-item {
        height: 60px;
        background: #fff;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        font-size: 16px;
        box-shadow: 0 3px 3px #ccc;
        border-radius: 7px;
        position: relative;
        
        .center {
          flex: 1;
        }
        
        .tips {
          position: absolute;
          bottom: -20px;
          right: 0;
          font-size: 14px;
          color: red;
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