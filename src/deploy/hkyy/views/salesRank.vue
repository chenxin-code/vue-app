<template>
  <div>
    <div class="staff-page">
      <div class="card top-box">
        <div class="unit-rank">
          <van-col span="19">
            <span>{{ this.rankObject.unitRank }}</span>
          </van-col>
          <van-col span="5">
            <span @click="timeShow = true">{{ this.month }}<van-icon name="arrow-down" /></span>
          </van-col>
        </div>
        <div class="line"></div>
        <div class="user-info">
          <van-col span="5">
            <img :src="rankObject.avtUrl == null || rankObject.avtUrl == '' ?headImg:rankObject.avtUrl" alt srcset />
          </van-col>
          <van-col span="19" style="padding-top: 8px;" >
            <div style="height: 20px;font-size: 17px;">
              {{ rankObject.realName }}
            </div>
            <div style="font-size: 12px;">
              {{ rankObject.unitName }}
            </div>
          </van-col>
        </div>
        <div class="line"></div>
        <div class="sales-rank" align="center">
          <van-col span="12">
            <div><span style="font-size: 22px;color: white">{{ rankObject.sales }}</span><span style="font-size: 14px;">元</span></div>
            <div>销售金额</div>
          </van-col>
          <div class="icon_next"></div>
          <van-col span="12">
            <div><span style="font-size: 22px;color: white">{{ rankObject.rank }}</span></div>
            <div>当前排名</div>
          </van-col>
        </div>
        <div class="card floot-box">
          <span style="float: left;margin-left: 5%;color: #000000;" @click="pageShow = true">前{{ pageSize }}名<van-icon name="arrow-down" /></span>
          <span style="float: right;margin-right: 5%;color: #000000;">最近更新时间：{{ this.rankObject.lastUpdateTime }}</span>
        </div>
      </div>
      <div class="card comment-box">
        <div class="table-col">
          <div align="left" style="padding-top: 2.5%;">
            <van-col span="4"></van-col>
            <van-col span="10" style="padding-left: 7px;">姓名</van-col>
            <van-col span="7" style="padding-left: 7px;">销售金额</van-col>
            <van-col span="3" style="padding-left: 7px;">排名</van-col>
          </div>
        </div>
        <div style="margin: 5px">
          <div class="li" v-for="(item, i) in rankObject.models" :key="i" style="margin: 0px 0px 5px 0px;">
            <van-row gutter="10">
              <van-col span="4">
                <img :src="item.avtUrl == null || item.avtUrl == '' ?headImg:item.avtUrl" alt srcset />
              </van-col>
              <van-col span="10">
                <van-row gutter="5" style="padding-top: 10px;padding-left: 5px;font-size: 14px;">
                  {{ item.realName }}
                </van-row>
                <van-row gutter="5" style="padding-top: 5px;padding-left: 5px;font-size: 12px;color: #969799e3">
                  {{ item.unitName }}
                </van-row>
              </van-col>
              <van-col span="7" style="padding-top: 15px;font-size: 14px;">
                {{ item.sales }}元
              </van-col>
              <van-col span="3" class="rank-img" style="padding-top: 10px;font-size: 20px;">
                <img v-if="item.rank==1" :src="top1">
                <img v-else-if="item.rank==2" :src="top2">
                <img v-else-if="item.rank==3" :src="top3">
                <div v-else align="center">{{ item.rank }}</div>
              </van-col>
            </van-row>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <van-overlay :show="timeShow || pageShow">
      <div class="wrapper" @click.stop>
        <div v-show="timeShow" style="float: initial;width: 80%;height: 10%;">
          <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            title="选择年月"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            @confirm="confirm"
            @cancel="cancel"
          />
        </div>
        <div v-show="pageShow" style="float: initial;width: 80%;height: 10%;">
          <van-picker
            title="显示人数"
            show-toolbar
            :columns="pageSizeColumns"
            @confirm="onConfirm"
            @cancel="onCancel"
          />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import config from "../../../api/config";
  import top1 from './image/rankImages/top1.png'
  import top2 from './image/rankImages/top2.png'
  import top3 from './image/rankImages/top3.png'
  import background from './image/rankImages/background.png'
  import headImg from './image/rankImages/headImg.png'

  export default {
    name: "salesRank",
    data() {
      return {
        pageSize: 10,
        pageSizeColumns: [10, 20, 30, 40, 50],
        pageShow: false,
        timeShow: false,
        minDate: new Date(new Date().getFullYear(), parseInt(new Date().getMonth())-1, 1),
        maxDate: new Date(2070, 11, 1),
        currentDate: new Date(),
        month: new Date().getFullYear()+'-'+(parseInt(new Date().getMonth())+1),
        top1: top1,
        top2: top2,
        top3: top3,
        headImg: headImg,
        rankObject: {
          realName: 'XXX',
          avtUrl: headImg,
          rank: '1',
          unitRank: '省公司机关排行榜',
          unitName: 'xxx程部',
          sales: '0.00',
          lastUpdateTime: '2020-06-01 00:59:59',
          models: []
        }
      }
    },
    methods: {
      onConfirm(value, index) {
        this.pageSize = value;
        this.pageShow = false;
        this.getSalesRank();
      },
      onCancel() {
        this.pageShow = false;
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`;
        }
        return val;
      },
      cancel(){
        this.timeShow = false;
      },
      confirm(){
        this.month = this.currentDate.getFullYear()+'-'+(parseInt(this.currentDate.getMonth())+1)
        this.timeShow = false;
        this.getSalesRank();
      },
      getSalesRank(){
        let _this = this
        let url = '/platform/json/emp_sales/getSalesRank'
        let parmas = {
          searchMonth: _this.month,
          pageSize: _this.pageSize,
          token:  _this.$store.state.login.token
          // token: 'c:app:CBA83C2F6E264B8FA1D4597BD07C12FD'
        }
        this.$http.post(url, parmas).then(res => {
          console.log("获取排行榜信息！ res:"+res.data)
          if (res.data.status == '0') {
            _this.rankObject = res ? res.data.data : {}
          } else {
            _this.$Toast({
              message: res.data.info || '查询失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          _this.$Toast({
            message: '请求失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      }
    },
    mounted() {
      if (!this.$store.state.login.token) {
        let token = this.$util.getUrlParam(window.location.href, 'token')
        this.$store.commit("setToken", token);
      }
    },
    created() {
      let token = this.$util.getUrlParam(window.location.href, 'token')
      let tokenS = this.$store.state.login.token;
      console.log("进去有created方法 ------> token="+token+"---->tokenS="+tokenS)
      if (token || tokenS) {
        if(!tokenS){
          this.$store.commit("setToken", token);
        }
        console.log(token)
        console.log("获取token成功！")
        this.getSalesRank()
      } else {
        // 路由 参数   redirectRouter代表需要跳转的路由
        let redrectUrl = window.location.origin + window.location.pathname + "#/salesRank"
        let gopageUrl = `${window.location.origin}/app/we_chat/goPage?redirectUrl=${encodeURIComponent(redrectUrl)}`
        window.location.href = gopageUrl
      }
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  // @import '~@/common/stylus/variable.styl'
  .staff-page {
    font-size 14px
    color #666
    background #ffffff

    img{
      display block
      width 55px
      height 55px
      border-radius 50%

    }
    .top-box{
      color #ebeef5eb
      width 100%
      height 210px
      display inline-block
      background-image url("./image/rankImages/background.png")
      background-repeat no-repeat
      background-position center
      background-size contain
      margin: -5px 0 0 0;
      .unit-rank{
        height 10%
        font-size: 17px;
        margin: 14px 0px 10px 10px;
      }
      .user-info{
        height 25%
        font-size: 15px;
        margin: 12px 0px 10px 10px;
      }
      .sales-rank{
        height 30%
        font-size: 15px;
        margin: 12px 0px 10px 10px;
        .icon_next{
          position absolute
          width 1px
          height 8%
          border-right 1px solid #f37478
          left 50%
          top 20%
        }
      }
      .line{
        margin-left 1% !important
        width 98%
        height 1px!important
        background #f56166c9
      }
      .line:after {
        content: '';
        width: 100%;
        height: 0.027778rem;
        background: #f56166c9;
        bottom: 0;
        left: 0;
        position: absolute;
      }

    }
    .comment-box{
      color #1a1a1a
      .table-col{
        margin-top 3%
        width :100%
        height : 30px
        background-color #96979926

      }
      .rank-img{
        img{
          display block
          width 30px
          height 30px
        }
      }
      .line{
        margin-left 18% !important
        width 82%
        height 1px!important
        background #efefef
      }

      .line:after {
        content: '';
        width: 100%;
        height: 0.027778rem;
        background: #efefef;
        bottom: 0;
        left: 0;
        position: absolute;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }
</style>
