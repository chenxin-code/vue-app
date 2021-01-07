<template>
  <div class="question-list">
    <nav-top title="问题列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="question-list-con">
      <div class="search-container">
        <Search></Search>
      </div>
      <div class="list">
        <div class="collapse" v-for="(item, index) in list">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item :name="index">
              <div slot="title">
                <img class="img" :src="item.iconUrl" alt="">
                <span class="name">{{item.name}}</span>
              </div>
              <van-cell v-for="item2 in item.questions" :key="item2.id" :title="item2.title" @click="detailHandle(item2.id)"/>
            </van-collapse-item>
          </van-collapse>
        </div>
<!--        <van-panel title="常见问题">-->
<!--          <van-cell v-for="item in list" :key="item.id" :title="item.title" @click="detailHandle(item.id)"/>-->
<!--          <van-cell class="more" title="查看更多问题"  @click="moreHandle"></van-cell>-->
<!--        </van-panel>-->
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Search from './components/search'
  export default {
    name: 'list',
    data() {
      return {
        activeName: 0,
        list: [],
      }
    },
    mounted() {
      this.onLoad()
    },
    methods: {
      detailHandle(id) {
        this.$router.push('/user_center/question_detail?id=' + id)
      },
      onLoad() {
        this.loading = true
        this.page++
        this.$request.post('/app/jqGrid/question/categoryList').then(res => {
          this.pageInitShow = true
          this.loading = false
          if (res.status === 0) {
            this.list = this.list.concat(res.rows || [])
          }
        })
      },
      moreHandle() {

      }
    },
    components: {Search}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .question-list-con {
    display flex
    flex-direction column

    .search-container {
      flex-shrink 0
    }

    .list {
      flex 1
      padding 10px;
      .collapse{
        box-shadow 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 4px;
        & + .collapse{
          margin-top:8px;
        }
        .img{
          width 30px;
          vertical-align middle
        }
        .name{
          display inline-block
          padding-left:6px;
          font-size:16px;
          font-weight:600
          vertical-align middle
        }
      }
      /deep/ .van-collapse-item__content{
        padding 0
      }
    }
  }
</style>
