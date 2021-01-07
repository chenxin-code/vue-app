/**Created by steven on 2019/8/14.*/

<template>
  <div class="expressinfo">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content>
      <div class="scroll-order">
        <!--<div class="order-information">-->
        <!--<div class="freight-billNo">运单号:{{freightBillNo}}</div>-->
        <!--<div class="freight-billNo">国内承运人:{{carrier}}</div>-->
        <!--<div class="freight-billNo">国内承运人电话:{{carrierTel}}</div>-->
        <!--</div>-->
        <!--<div class="logistics-details">-->
        <!--<div>-->
        <!--</div>-->
        <!--</div>-->
        <div>
          <van-steps direction="vertical" :active="0" active-color="red">
            <van-step v-for="(details,index) in logisticsDetails" :key="index">
              <!--<h3 :class="{black:index==indexPrev}">{{changeColour(details.content)}}</h3>-->
              <h3 :class="{black:index==indexPrev}" :inputVal="changeColour(details.content)">
                <div>
                  <span>
                  {{details.content.substr(0,details.content.indexOf(inputVal))}}
                </span>
                  <a style="color:#2A70FE" :href="'tel:' + inputVal">
                    {{inputVal}}
                  </a>
                  <span>
                {{details.content.substr(details.content.indexOf(inputVal)+inputVal.length)}}
                </span>
                </div>

              </h3>
              <p :class="{black:index==indexPrev}">{{$util.getPayTimemin(details.msgTime)}}</p>
              <!--<p :class="{black:index==indexPrev}">{{details.operator}}</p>-->
            </van-step>
          </van-steps>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Step, Steps} from 'vant';
  let inputVal = ''
  export default {
    name: "expressinfo",
    components: {
      Step,
      Steps
    },
    data() {
      return {
        freightBillNo: '',
        carrier: '',
        carrierTel: '',
        logisticsDetails: [],
        colorList: ['primary', 'danger', 'secondary', 'info'],
        indexPrev: '0',
        // inputVal: ''
      }
    },
    methods: {
      changeColour(data) {
        let suzhi = data.replace(/[^0-9]/ig, "")
        let tel = /^1[3456789]\d{9}$/;
        if (tel.test(suzhi)) {
          console.log(suzhi)
          this.inputVal = suzhi
        }
        if (!tel.test(suzhi)) {
          this.inputVal = ''
        }
        return data
      },
      turnback: function () {//返回
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this)
      },
      loadingdata: function () {
        this.logisticsDetails = JSON.parse(decodeURIComponent(this.$route.query.expressinfo));
        return this.logisticsDetails.reverse();
      }
    },
    created() {
      this.loadingdata()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .expressinfo {
    width 100%
    height 100%
    overflow hidden

    .scroll-order {
      position absolute
      top 0px;
      right 0px;
      left 0px;
      bottom 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch

      .order-information {
        padding 15px 0 10px 20px
        background-color #ffffff
        font-size 14px
        overflow hidden

        .freight-billNo {
          padding-bottom 8px
          overflow hidden
        }
      }

      .logistics-details {
        background-color #f7f6f6
        height 70px
        overflow hidden
      }
    }

    .black {
      color black
    }
  }
</style>
