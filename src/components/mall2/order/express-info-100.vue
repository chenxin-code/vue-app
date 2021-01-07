<template>
  <div class="expressinfo">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content>
      <div class="scroll-order">
        <div>
          <van-steps direction="vertical" :active="0" active-color="red">
            <van-step v-for="(details, index) in expressDetails" :key="index">
              <h3 :class="{black:index == indexPrev}" :inputVal="changeColour(details.context)">
                <div>
                  <span>
                  {{ details.context.substr(0,details.context.indexOf(inputVal)) }}
                </span>
                  <a style="color:#2A70FE" :href="'tel:' + inputVal">{{ inputVal }}</a>
                  <span>{{ details.context.substr(details.context.indexOf(inputVal) + inputVal.length) }}</span>
                </div>
              </h3>
              <p :class="{black:index == indexPrev}">{{ $util.getPayTimemin(details.time) }}</p>
            </van-step>
          </van-steps>
        </div>
        <div class="no-data" v-if="!expressDetails">暂未查询到物流信息</div>
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
        expressDetails: [],
        indexPrev: '0',

        expressNo: '',
        expressName: '',
        expressionCodeList: []
      }
    },
    created() {
      if (this.$route.query.expressNo && this.$route.query.expressName) {
        this.expressNo = this.$route.query.expressNo
        this.expressName = this.$route.query.expressName
        this.getCompanyNumber()
      } else {
        this.$Toast('快递信息有误，请检查订单中是否包含快递信息')
      }
    },
    methods: {
      // 获取快递公司编号
      getCompanyNumber() {
        this.$http.post('/app/json/app_dict/getDictByAlias', {
          alias: "expression_company_code"
        }).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.expressionCodeList = data.data || []
            let exCompany = this.expressionCodeList.find(item => {
              return item.dictValue == this.expressName
            })

            if (exCompany && exCompany.dictKey) {
              this.getExpressionInfo(exCompany.dictKey)
            } else {
              this.$Toast(`查询快递失败，未找到【${this.expressName}】公司的快递`)
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Toast(`getDictByAlias err ${err}`)
        })
      },
      // 调用快递100接口查询快递信息
      getExpressionInfo(code) {
        this.$http.post('/app/json/app_third/query100', {
          com: code,
          num: this.expressNo
        }).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.expressDetails = data.data.data || []
            console.table(JSON.parse(JSON.stringify(this.expressDetails)))
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Toast(`query100 err ${err}`)
        })
      },
      changeColour(data) {
        let suzhi = data.replace(/[^0-9]/ig, "")
        let tel = /^1[3456789]\d{9}$/;
        if (tel.test(suzhi)) {
          this.inputVal = suzhi
        }
        if (!tel.test(suzhi)) {
          this.inputVal = ''
        }
        return data
      },
      turnback: function () {//返回
        this.$router.go(-1);
      }
    }
  }
</script>

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
