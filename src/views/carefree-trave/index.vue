<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)">
      <div
        class="search-div theme_bg_white_f5"
        style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
      >
        <!--        <div class="didian" @click="viewShow=false"><span>{{diqu}}</span><span class="iconfont mall-arrow-down"></span></div>-->
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
        <form class="search-input" action id="form">
          <input
            id="searchInput"
            class
            type="search"
            placeholder="景点/门票"
            v-model="searchStr"
            @input="monitor"
            @keyup.enter="searchgoods"
          >
        </form>
      </div>
      <!--      <div class="shareBox" @click="sideFiltrateModalShow = true">-->
      <!--        <span class="iconfont mall-shaixuan"></span>-->
      <!--      </div>-->

    </nav-top>
    <nav-content>
      <div v-if="viewShow" class="divBox">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadData">
          <div class="publicInvoice" @click="toDetail(item.id)" v-for="item in listData">
            <div class="publicbox">
              <div class="div1"><img :src="item.image?item.image:'static/image/microShop/lvyou.png'" alt=""></div>
              <!--             <div class="div1" :style="{background:'url('+item.image+') no-repeat center'}"></div>-->
              <div class="div2">
                <div class="div">{{item.title}}</div>
                <div class="div"><span v-if="item.type==2">套票</span><span v-if="item.type==1">普通票</span><span
                  v-if="item.type==3">线路</span><span v-if="item.refund_type == 1">可退票</span><span v-if="buy">随买随用</span>
                </div>
                <div>
                  <div>￥{{item.market_price}}<span>起</span></div>
                  <div>立即预定</div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div v-if="listData.length===0 && loadStart">
          <p class="nullData">暂无可查询数据</p>
        </div>
      </div>
      <div v-if="!viewShow">
        <div class="regionBox">
          <p>当前区域</p>
          <ul>
            <li @click="regionSelect('北京')">分类01</li>
          </ul>
        </div>
        <div class="regionBox">
          <p>区域切换</p>
          <ul>
            <li @click="regionSelect('上海')">城市01</li>
            <li>城市02</li>
            <li>城市03</li>
            <li>城市04</li>
            <li>城市05</li>
            <li>城市06</li>
          </ul>
        </div>
      </div>
    </nav-content>
    <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
      <!--      <div class="divPut1"></div>-->
      <div class="divPut2">
        <ul>
          <li @click="detailData(item)" v-for="(item,index) in isText" :key="index">{{item.goods_name}}</li>
          <li v-if="isText.length===0" style="text-align:center">暂无搜索结果</li>
        </ul>
      </div>
    </div>
    <transition name="filtrate-mask">
      <div class="filtrate-modal-mask" v-show="sideFiltrateModalShow" @click="sideFiltrateModalShow = false"></div>
    </transition>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="box">
          <h2>分类</h2>
          <ul>
            <li>分类01</li>
            <li>分类02</li>
            <li>分类03</li>
            <li>分类04</li>
            <li>分类05</li>
            <li>分类06</li>
          </ul>
        </div>
        <div class="filtrate-btn">
          <div @click="reset">重置</div>
          <div @click="sure">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import api from "./api"

  export default {
    name: "index",
    mixins: [api],
    data() {
      return {
        listData: [],
        viewShow: true,
        diqu: '北京',
        sideFiltrateModalShow: false,
        dropDown: false,
        loadStart: false,
        buy: false,
        id: '',
        loading: false,
        finished: false,
        heightMoney: '',
        lowMoney: '',
        titleView: false, // 避免接口没加载完，极限是空状态
        statusList: [
          {state: '待处理', redData: false, stateNum: 3},
          {state: '已开票', redData: false, stateNum: 1},
          {state: '开票失败', redData: false, stateNum: 2}
        ],
        typeList: [
          {ordertype: '加油订单开票', redData: false, orderNum: 100},
          {ordertype: '商品订单开票', redData: false, orderNum: 200}
        ],
        invoiceStatus: '',
        orderType: '',
        minAmount: '',
        maxAmount: '',
        searchStr: '',
        page: 0,
        keyWord: '',
        isText: [],
        isData: true
      }
    },
    created() {
      // this.loadData()
    },
    mounted() {

    },
    methods: {
      detailData(index) { //查详情
        console.log(index);
        this.searchStr = index.goods_name
        this.dropDown = false
        this.keyWord = index.goods_name
        this.page = 0
        this.listData = []
        this.loadData()
        if (this.listData.length>0) {
          this.isData = true
        } else {
          this.isData = false
        }
      },
       monitor(val) { //下拉搜索内容
        console.log(val);
        let that = this
         that.page = 0
        that.keyWord = val.srcElement.value
        console.log(that.keyWord);
        if (val.srcElement.value) {
          let params = {
            token: this.$store.state.login.token,
            pageThis: that.page,
            pageSize: 10,
            keyWord: that.keyWord
          }
          console.log(params);
          this.$Loading.open();

           that.ticketListData(params).then(res => {
            this.$Loading.close();
            that.isText = res.data.data || []
             that.dropDown = true
          })
        } else {
          this.keyWord = ''
          this.page = 0
          this.listData = []
          this.loadData()
          that.dropDown = false
        }
      },
      searchgoods(data) {
        console.log(data);
        this.keyWord = ''
        this.page = 0
        this.listData = []
        this.loadData()
      },
      regionSelect(data) {
        console.log(1);
        this.viewShow = true
        this.diqu = data
      },
      loadData() {
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          pageThis: that.page,
          pageSize: 10,
          keyWord: that.keyWord,
          cateId: this.$route.query. cateId
        };
        console.log('列表入参',params);
        // this.$Loading.open();

         that.ticketListData(params).then(res => {
          // this.$Loading.close();
          if (res.data.result) {
            that.loadStart = true
            // that.titleView = true
            let data = res.data.data || []
            that.listData = that.listData.concat(data) || []
            if (that.listData.length > 0) {
              that.isData = true
              that.listData.forEach(function (item) {
                let time1 = item.startTime.substring(0, 10)
                let time2 = that.getNowFormatDate()
                if (time1 == time2) {
                  that.buy = true
                }
              })
            } else {
              that.isData = false
            }
            if(that.page>=res.data.totalPages) {
              that.finished = true
            } else {
              that.finished = false
            }
          } else {
            that.finished = true
          }
           that.loading = false
        });
      },
      toDetail(id) {
        console.log(1);
        this.$router.push({
          path: '/carefree_trave/detail',
          query: {
            id: id
          }
        })
      },
      reset() {
        this.typeList.forEach(function (item) {
          item.redData = false
        })
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        this.invoiceStatus = ''
        this.orderType = ''
        this.minAmount = ''
        this.maxAmount = ''
      },
      sure() {
        this.page = 0
        // this.listData = []
        this.loadData()
        this.sideFiltrateModalShow = false
        this.invoiceStatus = ''
        this.orderType = ''
        this.minAmount = ''
        this.maxAmount = ''
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        this.typeList.forEach(function (item) {
          item.redData = false
        })
      },
      statusData(index) {
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        index.redData = true
        this.invoiceStatus = index.stateNum
      },
      typeData(index) {
        this.typeList.forEach(function (item) {
          item.redData = false
        })
        index.redData = true
        this.orderType = index.orderNum
      },
      getNowFormatDate() { //获取当前日期
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  .body {
    background-color: #f6f6f6 !important;
  }

  .divBox {
    margin-top 20px;
  }

  .divPut {
    width 100%;
    display flex;
    justify-content space-between
    position: absolute;
    /*top: 1.2rem;*/
    top 64px;
    bottom 0;
    left: 0;
    right 0
    z-index: 20;
    overflow-y auto

    .divPut1 {
      height 100%;
      width: 2.4rem;
    }

    .divPut2 {
      flex 1
      border-radius 5px;
      box-shadow: #f3f3f3 0 0 0.4rem;
      background white

      ul {
        li {
          background: white;
          border-top: 0.026667rem solid #ebedf0;
          /*color: #f5f5f5;*/
          /*height: 1rem;*/
          line-height 15px;
          padding: 0.3rem 0.4rem;
        }
      }
    }
  }

  .nothing {
    width 100%;
    height 5.8rem;
    padding 0 0.4rem;
    display flex;
    justify-content space-between
    position: absolute;
    top: 1.2rem;
    z-index: 0;
    display none
  }

  /deep/ .nav-top .navcontent .title-div {
    display none
  }

  .int {
    width: 70%;
    margin-left 60px;
    background #efefef
    border-radius: 30px;
  }

  .publicbox {
    display flex;
    /*justify-content space-between*/
    justify-content start
    width 92%;
    margin 0 auto

    .div1 {
      /*width 100px;
      height 100px*/

      img {
        width 100px;
        height 100px
      }
    }

    .div2 {
      display flex;
      flex-direction column
      margin-left 10px;
      flex 1

      div {
        margin auto 0
      }

      .div {
        margin-bottom 10px;
      }

      div:nth-child(1) {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height 22px;
      }

      div:nth-child(2) {
        span {
          padding: 2px 8px;
          border: 1px solid #ff9f5a;
          border-radius: 20px;
          color: #ff9f5a;
          font-size: 12px;
          margin-right 4px;
        }

        span:nth-child(2) {
          border: 1px solid #6fc66d;
          color: #6fc66d;
        }

        span:nth-child(3) {
          border: 1px solid #88a9ff;
          color: #88a9ff;
        }
      }

      div:nth-child(3) {
        display: flex;
        justify-content: space-between;

        div:nth-child(1) {
          color #dcb685

          span:nth-child(1) {
            font-size 12px;
          }

          span:nth-child(2) {
            color #a6a6a6
            font-size 12px;
            margin-left 5px;
            text-decoration: line-through;
          }
        }

        div:nth-child(2) {
          background #dcb685;
          color white;
          padding: 4px 4px;
          border-radius: 5px;
          font-size 14px;
        }
      }
    }

  }

  .regionBox {
    width 92%;
    margin: 20px auto;
    overflow: hidden;

    p {
      font-size 18px;
      margin-bottom 10px;
    }

    li {
      font-size: 14px;
      width: 18%;
      margin-right: 2%;
      float left;
      background white;
      padding: 10px 0;
      text-align: center;
      margin-bottom 15px;
    }
  }

  .shareBox {
    float right;
    display: flex;
    margin-right 10px;
    justify-content: space-around;
    position relative;
    z-index 10

    span {
      font-size 22px;
    }
  }

  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }

  .publicInvoice {
    background white;
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    font-size 16px;
    padding 15px 0
    border-radius 10px;
    margin-bottom 10px;
  }

  .box {
    margin 30px 0 0 30px;
    font-size 14px;


    h2 {
      font-size 18px;
    }

    ul {
      margin-top 30px;

      li {
        padding: 10px 0;
        text-align: center;
        width 30%
        float left;
        margin-right 3%;
        background white
        margin-bottom 15px;
      }
    }
  }

  .filtrate-modal-mask {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index 899
  }

  .filtrate-modal-wrapper {
    position: absolute;
    top: 0;
    left: 15%;
    width: 85%;
    bottom: 0;
    z-index: 900;
    transition: all 0.3s
    background: #f6f6f6

    .filtrate-container {
      width: 100%;
      height: 100%;
      padding 20px 15px;
    }

    .filtrate-btn {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 44px;
      display: flex;
      justify-content space-around
      font-size 16px;

      div {
        width 50%;
        text-align center
        height: 44px;
        line-height 44px
      }

      div:nth-child(1) {
        background #d8d8d8
      }

      div:nth-child(2) {
        color white;
        background #deb98c
      }

      .btn {
        flex-shrink 0
        text-align: center;
        width 40%
        border-radius 30px;

        &.plain {
          color: #333;
        }

        &:after {
          border-radius 60px;
          border-color: #e5e5e5
        }
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  .filtrate-mask-enter-active, .filtrate-mask-leave-active {
    transition: all .3s;
  }

  .filtrate-mask-enter, .filtrate-mask-leave-to {
    opacity 0
  }

  .search-div {
    position: absolute;
    display: flex;
    align-items: center;

    .didian {
      width: 55px;
      border-right: 1px solid #999;
      height: 18px;
      line-height: 18px;
      margin-right: 10px;
      padding-right: 5px;

      span:nth-child(1) {
        display inline-block;
        width 30px;
        font-size 14px;
        color #999
      }
    }

    .icon-font {
      font-size: $font-size-medium;
    }

    .search-input {
      flex: 1;
      margin-left: 10px;
      font-size: $font-size-medium;

      input {
        background: none;
        width: 100%;
        height: 100%;
      }
    }
  }


  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
