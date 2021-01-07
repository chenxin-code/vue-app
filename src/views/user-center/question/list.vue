<template>
  <div class="question-list">
    <nav-top title="问题列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="question-list-con">
      <div class="search-container">
        <Search></Search>
      </div>
      <div class="list">
        <van-panel title="常见问题">
          <van-cell v-for="item in list" :key="item.id" :title="item.title" @click="detailHandle(item.id)"/>
          <van-cell class="more" title="查看更多问题"  @click="moreHandle"></van-cell>
        </van-panel>
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
        list: [],
        loading: true,
        finished: false,
        page: 0
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
        this.$request.post('/app/jqGrid/question/list', {rows: 10, page: this.page, title: this.value}).then(res => {
          this.pageInitShow = true
          this.loading = false
          if (res.status === 0) {
            this.list = this.list.concat(res.rows || [])
            if (this.list.length >= res.records) {
              this.finished = true
            }
          } else {
            this.finished = true
          }
        })
      },
      moreHandle() {
        this.$router.push('/user_center/question_category')

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
      /deep/ .van-panel{
        box-shadow 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 4px;
        /deep/ .van-panel__header{
          font-size:18px;
          font-weight:600
          color gray
        }
      }
      .more{
        text-align center
        color gray
      }
    }
  }
</style>
