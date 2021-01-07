/**Created by dmj on 2018/1/4.*/

<template>
  <div class="headlines-details">
    <nav-top title="详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scrol-height">
        <div class="headlines-details-show" v-for="(item, index) in headLinesList" :key="index">
          <div class="top">
            <p class="title">
              <span class="title-left">{{item.title}}</span>
              <span class="title-right" v-if="item.subTitle">| {{item.subTitle}}</span>
            </p>
            <p class="time">
              发布时间:
              <span class="time-show">{{item.publishTime.substr(0, 10)}}</span>
            </p>
<!--            <p class="author">-->
<!--              【作者】:-->
<!--              <span class="author-show">{{item.publisher}}</span>-->
<!--            </p>-->
          </div>
          <div class="content">
            <p class="info" v-html="item.content">
            </p>
          </div>
          <!--<div class="footer">-->
            <!--<img :src=item.picTitle alt="">-->
          <!--</div>-->
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {

    },
    data() {
      return {
        id: '',
        headLinesList: []
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.getHeadlinesList()
    },
    methods: {
      getHeadlinesList() {
        // 获取头条信息接口
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.id
        }
        let that = this
        this.$http.post('/app/json/news/details', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.headLinesList = data.data
          }
          this.$nextTick(() => {
            let list = document.querySelectorAll('a')
            if (list) {
              list.forEach(target => {
                target.addEventListener('click', (event) => {
                  let curTarget = event.target
                  while (curTarget.localName != 'a') {
                    console.log(1)
                    curTarget = curTarget.parentNode
                  }
                  console.log(curTarget.href)
                  that.$bridgefunc.customPush({
                    path: curTarget.href,
                    isnativetop: 1
                  })
                  event.preventDefault()
                }, true)
              })
            }
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .scrol-height {
    height 100%
    overflow-y auto
  }
  .headlines-details-show {
    padding: 11px 15px
    .top {
      padding-bottom: 10px
      p {
        margin-bottom: 8px
      }
      .title {
        font-size: 22px
        line-height 28px
        span {
          font-weight bold
        }
      }
      .time, .author {
        font-size: 16px
        color: #8e8e8e
      }
    }
    .content {
      padding-bottom: 35px
      .info {
        line-height 22px
        font-size: 14px
        color: #8e8e8e
        >>> img {
          width: 100%
          vertical-align top
        }
      }
    }
  }
</style>
