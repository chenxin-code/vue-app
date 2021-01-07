<template>
    <div class="body">
      <nav-top title="员工薪资" @backEvent="$router.go(-1)"></nav-top>
      <nav-content>
       <div class="head">
         <div class="div1" @click="showStartTime = true"><span>{{time1}}</span><i class="icon iconfont mall-arrow-down"></i></div>
         <div class="div2">
           <img src="static/image/microShop/you.png" alt="">
           <div>
             <p>京藏高速333号加油站</p>
             <p>油站编码：232323</p>
             <p>姓名：  李强</p>
           </div>
         </div>
       </div>
        <div class="contaion1">
          <p>8月业绩</p>
          <div class="publicInvoice">
           <div class="divdetail">
             <div>工资</div>
             <div><span>5000.20</span>元</div>
           </div>
            <div class="divdetail">
              <div>提枪次数</div>
              <div><span>5000.20</span>次</div>
            </div>
            <div class="divdetail">
              <div>加油数量</div>
              <div><span>5000.20</span>L</div>
            </div>
          </div>
        </div>
        <div class="contaion1">
          <p>薪资明细</p>
          <div class="publicInvoice">
          <div class="detailList">
            <div class="divdetail2">
              <div>92升加油量</div>
              <div>100L</div>
            </div>
            <div class="divdetail2">
              <div>92升油薪标准</div>
              <div>3元/L</div>
            </div>
          </div>
            <div class="detailList">
              <div class="divdetail2">
                <div>LNG加气量</div>
                <div>100L</div>
              </div>
              <div class="divdetail2">
                <div>LNG升气标准</div>
                <div>3元/L</div>
              </div>
            </div>
          </div>
        </div>
      </nav-content>
      <van-popup position="bottom" v-model="showStartTime">
        <van-datetime-picker
          v-model="currentDateStart"
          type="year-month"
          @confirm="confirmActivitesTime"
          @cancel="showStartTime = false"
          @change="setColumnValue"
        />
      </van-popup>
    </div>
</template>

<script>
  import api from './api'
  import util from '@/utils/util'
    export default {
        name: "salary",
      mixins: [api],
        data() {
          return {
            showStartTime: false,
            currentDateStart: new Date(),
            time1: '',
          }
        },
      mounted() {
          var d = new Date()
        this.time1 = d.getFullYear() + "年"+ (d.getMonth() + 1) +"月"
      },
      methods: {
        confirmActivitesTime(value) {
          this.showStartTime = false
          let oDate = new Date(this.currentDateStart),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1
          this.time1 = oYear + '年' + this.$util.getzf(oMonth) + '月'
        },
        setColumnValue(index, value) {
          // 获取时间对应列中选中的值
          index = new Date()
        },
      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .head {
    width: 90%;
    margin: 0 auto;
    font-size: 16px;
    padding: 20px 0;
    .div1 {
      width 100%;
      line-height 30px;
      height 30px;
    }
    .div2 {
      display flex;
      justify-content start
      margin-top 10px;
      img {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
      div {
        display: flex;
        flex-direction: column;
        p {
          margin auto 0
          font-size 14px;
        }
        p:nth-child(1) {
          font-size 16px;
          font-weight 600
        }
      }
    }
  }
    .contaion1 {
      p {
        width 95%;
        font-size 16px;
        padding 20px 0
        margin 0 auto
      }
      .publicInvoice {
        box-shadow: #f3f3f3 0px 0px 15px;
        width: 95%;
        margin: 0 auto 10px auto;
        .detailList {
          border-bottom 1px solid #f1f1f1
          width 95%;
          margin 0 auto;
          padding: 10px 0;
        }
        .detailList:last-child {
          border-bottom 0
        }
        .divdetail {
          display flex;
          justify-content space-between;
          width 95%;
          margin 0 auto;
          padding: 10px 0;
          font-size: 14px;
          color #9c9c9c
          span {
            color #f80f16
          }
        }
        .divdetail2 {
          display flex;
          justify-content space-between;
          font-size: 14px;
          color #9c9c9c
          height 25px;
          line-height 25px;
        }
      }
    }


</style>
