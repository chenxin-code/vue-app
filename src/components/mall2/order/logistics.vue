/**Created by steven on 2019/8/14.*/

<template>
  <div class="logistics-page">
    <nav-top @backEvent="turnback" v-if="!$isWX"></nav-top>
    <nav-content :titleDefault="true">
      <div class="scroll-order">
        <div class="logistics-count">{{expressNo.length}}个包裹已经发出</div>
         <div class="logistics-main">
            <div v-for="item in expressNo" :key="item" class="logistics-item">
          <div class="logistics-name">{{ expressName }}:{{ item }}</div>
          <van-skeleton
            title
            :row="5"
            :loading="!loadingObj[item]"
            :row-width="['100%', '50%', '100%', '60%', '100%']"
          >
            <div v-if="!logisticsObj[item] || !logisticsObj[item].logisticsDetailList" class="tx-c">
              <img src="./img/no-data.png" alt width="65%"/>
              <br/>
              <p class="tx-c" style="margin-top:15px">暂未查询到物流信息</p>
            </div>
            <div v-else>
              <div class="logistics-status">{{ logisticsObj[item].logisticsStatus }}</div>
              <van-steps direction="vertical" :active="0" active-color="#e5165a" :ref="'showPanel_' + item" class="logistics-step">
                <van-step
                  v-for="(details, index) in logisticsObj[item].logisticsDetailList"
                  :key="index"
                >
                  <h3 :class="{ black: index == indexPrev }" >
                    <div v-html="showContent(details.infoSummary)"></div>
                  </h3>
                  <p :class="{ black: index == indexPrev }">
                    {{ $util.getPayTimemin(details.recordTime) }}
                  </p>
                </van-step>
              </van-steps>
               <div class="showMoreBtn" @click="showMore(item)">
                  {{ showMoreObj[item] ? "收起" : "展开" }}
                  <van-icon :name="showMoreObj[item] ? 'arrow-up' : 'arrow-down'"/>
                </div>
            </div>
          </van-skeleton>
        </div>
         </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { Step, Steps } from "vant";
export default {
  name: "logistics",
  components: {
    Step,
    Steps
  },
  data() {
    return {
      queryObj:{},
      expressNo: "", //订单号
      expressName: "",
      loadingObj: {},
      logisticsObj: {},
      showMoreObj: {},
      inputVal:"",
      freightBillNo: "",
      carrier: "",
      carrierTel: "",
      logisticsDetails: [],
      colorList: ["primary", "danger", "secondary", "info"],
      indexPrev: "0"
      // inputVal: ''
    };
  },
  methods: {
    /*展开、收起 按钮切换*/
    showMore(item) {
      this.showMoreObj[item] = !this.showMoreObj[item];
      this.showMoreObj={...this.showMoreObj};
      this.changeHeight(item);      
    },
    /*展开、收起 内容展示*/
    changeHeight(key) {
      let parentDom=this.$refs["showPanel_" + key];
      if( !parentDom || !parentDom.length) return;
      let dom = parentDom[0].$children;
      let display=this.showMoreObj[key]?'block':'none';
      dom.map(child=>{
        if(child.index>=3) child.$el.style.display = display;
      })
    },
    /*内容*/ 
    showContent(str){
      var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
      var phoneNums = str.match(regx);
      if (phoneNums) {
        phoneNums=Array.from(new Set(phoneNums));  
        for (var i = 0; i < phoneNums.length; i++) {
          var temp = phoneNums[i];
          str = str.replaceAll(phoneNums[i], `<a href="#" style="color:#e5165a;">${temp}</a>`);
        }
      }
      return str;
    },
    turnback() {
      this.$router.go(-1);
      this.$keepaliveHelper.deleteCache(this);
    },
    /*获取query的值*/ 
    getQuery(){
      this.queryObj=this.$route.query;
      this.expressNo = this.queryObj.expressNo.split(',') || [];
      try {
        this.expressName=decodeURIComponent(this.queryObj.expressName);
      }
      catch(err){ 
          this.expressName=this.queryObj.expressName
      }
    },
    /*快递--ali订单详情*/
    getExpressInfo_ali(expressNo) {
      let url = "/app/json/logistics_system/queryLogisticsInfo";
      let paramsData = {
        orderType: this.queryObj.orderType,
        orderNo: this.queryObj.orderId,
        logisticsOrderNo: expressNo
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.loadingObj[expressNo] = true;
          if (res.data.status == 0) {
            if (res.data.data) {
              this.logisticsObj[expressNo] = res.data.data;
            }
          }
          this.logisticsObj={...this.logisticsObj};
          this.loadingObj={... this.loadingObj};
        },
        error => {
          this.$Toast("请求数据失败！");
          this.loadingObj[expressNo] = true;
        }
      );
    }
  },
  created() {
    this.getQuery();
    this.expressNo.map(v => {
      this.getExpressInfo_ali(v);
    });
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.logistics-page {
  width 100%
  height 100%
  overflow hidden

  .tx-c{
    text-align center
  }
  .logistics-main{
    padding:0 10px
  }
  .logistics-count{
    color:#e5165a
    background-color rgba(240,54,113,.2);
    padding 8px 15px
    margin-bottom 6px
    font-size 15px
  }
  .logistics-item{
    padding: 12px 10px;
    position relative;
    margin-bottom : 15px;
    background-color #fff
    border-radius 5px

    .logistics-name{
      font-size 14px
      font-weight 500
      position absolute
      right: 10px
      top:14px
    }
    .logistics-status{
      font-size 16px
      font-weight 600
      color #e5165a
      padding-left 13px
      margin-bottom 3px
    }
  }
 
  .showMoreBtn{
    width 100%
    padding 7px
    margin-top 14px
    text-align center
    position relative
    border .5px solid rgba(238,238,238,.5)
    border-radius 4px
  }

  .scroll-order {
    position absolute
    top 0px;
    right 0px;
    left 0px;
    bottom 0px;
    z-index 90
    overflow-x hidden;
    overflow-y auto;
    background-color #F8F8F8 !important
    -webkit-overflow-scrolling touch
  }

  .black {
    color black
  }
}
</style>

<style>
 .logistics-step .van-steps__items>div.van-step:nth-child(n+4){
    display:none
  }
</style>
