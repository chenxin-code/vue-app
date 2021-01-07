/**Created by dmj on 2018/1/3.*/

<template>
  <div class="headlines">
    <nav-top :title="$store.state.globalConfig.newsTitle || '小石头条'" @backEvent="$router.go(-1)">
      <div class="life-pay" @click="selectArea">
        {{address.name ? address.name : this.$store.state.indexData.city}}
      </div>
    </nav-top>
    <nav-content v-if="headLinesList">
      <div class="scrol-height">
        <div class="headlines-list">
          <ul class="headlines-list-info">
            <li class="headlines-info">
              <div class="list-info">
                <ul class="info">
                  <li class="img-text" @click="openHeadlinesDetails(item)" v-for="(item, index) in headLinesList"
                      :key="index">
                    <div class="info-content">
                      <div class="text">
                        <div class="top">
                          <p class="title">{{item.title}}&nbsp;{{item.subTitle}}</p>
                          <p class="text-info double-line" v-html="getSimpleText(item.content)"></p>
                        </div>
                        <div class="tips">
                          <span class="time">发表时间:{{item.publishTime.substr(0, 10)}}</span>
                        </div>
                        <p class="read" v-if="item.readCount != ''">阅读量:{{item.readCount}}</p>
                      </div>
                    </div>
                    <div class="img-show">
                      <img class="img" :src=item.picTitle alt="">
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
        </div>
      </div>
      <!--地址选择弹框-->
      <address-choose ref="address" @setAddressEvent="setAddressEvent"></address-choose>

      <van-popup v-model="showArea" position="bottom" :overlay="true">
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import AddressChoose from '@/components/base/address-choose/address-choose'

  export default {
    name: "",
    components: {
      AddressChoose
    },
    data() {
      return {
        headLinesList: [],
        showSpacing: true,
        length: '',
        showArea: false, // 地址选择弹框
        list: '', // 所选地址
        address: '', // 首地址
        hasMore: true,
      }
    },
    mounted() {
      // this.getHeadlinesList()
      this.defaultList()
      console.log(this.$store.state.globalConfig)
    },
    methods: {
      getSimpleText: function(html){
        let re1 = new RegExp("<.+?>","g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        let msg = html.replace(re1,'');//执行替换成空字符
        return msg;
      },
      setAddressEvent(addr) {
        this.address = addr.value
        this.list = addr.list
        this.getHeadlinesList()
      },
      defaultList() {
        // 默认地址查询头条信息接口
        this.$Loading.open()
        console.log(this.list[this.list.length-1])
        let areaInfo = this.list[this.list.length-1] || []
        let paramsData = {
          token: this.$store.state.login.token,
          provinceName: this.$store.state.indexData.province,	// 省名称
          cityName: this.$store.state.indexData.city	// 市名称
        }
        this.$http.post('/app/json/news/defaultList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.headLinesList = data.data
          }
          this.$nextTick(() => {
            let list = document.querySelectorAll('a')
            if (list) {
              list.forEach(target => {
                target.addEventListener('click', (event) => {
                  event.preventDefault()
                })
              })
            }
          })
          this.hasMore = false
          this.$Loading.close()
        })
      },
      getHeadlinesList() {
        // 获取头条信息接口
        this.$Loading.open()
        let areaInfo = this.list[this.list.length-1] || []
        let paramsData = {
          token: this.$store.state.login.token,
          level: areaInfo.level, // (0:全国 ,1：省 ,2：市 ， 3：县 ，4：区)
          areaId: areaInfo.id, // 选择的城市的id
          parentId: areaInfo.parentId, // parentid
        }
        this.$http.post('/app/json/news/list', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.headLinesList = data.data
          }
          this.hasMore = false
          this.$Loading.close()
        })
      },
      openHeadlinesDetails(item) {
        if (item.isThird === 1) {
          // isThird 是否是第三方页面 1：是 0：否
          // thirdPageUrl第三方页面的url
          this.$bridgefunc.newPage({
            weburl: item.thirdPageUrl,
            isnativetop: 1
          })
        } else {
          this.$router.push({
            path: '/mall2/headlinesdetails',
            query: {
              id: item.id
            }
          })
        }
      },
      selectArea() {
        // 查询区域名称
        this.$refs.address.initAddress()
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .life-pay {
    font-size: 16px
    color: $color-theme-r
    text-align right
    margin-right: 15px
  }

  .scrol-height {
    /*width 100%*/
    height 100%
    overflow-y auto
  }

  .headlines {
    .headlines-list-info {
      .headlines-info {
        margin-bottom 10px
        /*border-bottom: 10px solid #eae9e9*/
        .list-info {
          background: #fff
          padding: 15px 11px
          .img-text {
            display: flex
            margin-bottom 10px
            border-radius 4px
            padding: 11px
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
            .info-content {
              width: 70%
              padding-right: 10px
              .text {
                height: 100%
                display: flex
                justify-content: space-between
                align-items: left
                flex-direction: column
              }
              .title {
                margin-bottom 6px
                font-weight bold
                font-size 15px
                line-height: 17px
              }
              .text-info {
                font-size 14px
                line-height 20px
                margin-bottom 6px
                color: #1a1a1a
                word-wrap: break-word
                word-break: break-all
                overflow: hidden;
                height 36px;
                /deep/ img {
                  display: none
                }
              }
              .tips {
                color: #ccc
                font-size 12px
                padding-bottom: 5px
              }
              .read {
                color: #ccc
                font-size 12px
              }
            }
            .img-show {
              width: 30%
              height: 98px
              img {
                width: 100%
                height: 100%
                vertical-align top
              }
            }
          }
        }
      }
    }
  }
  .no-data {
    padding: 15px;
    text-align: center;
  }
</style>

