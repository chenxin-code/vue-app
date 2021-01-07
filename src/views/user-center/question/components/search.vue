<template>
  <div class="search-wrapper">
    <van-search v-model="value" show-action placeholder="请输入搜索关键词">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-popup
      v-model="show"
      closeable
      position="top"
      :duration="0"
      get-container=".search-wrapper"
      :style="{ height: '30%' }"
    >
      <div class="list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in list"
            :key="item.id"
            :title="item.title"
            @click="detailHandle(item.id)"
          />
        </van-list>
      </div>
    </van-popup>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'list',
    data() {
      return {
        value: '',
        list: [],
        loading: true,
        finished: false,
        page: 0,
        show: false
      }
    },
    watch: {
      list(val) {
      }
    },
    mounted() {
    },
    methods: {
      onSearch() {
        this.list = []
        this.loading = true
        this.finished = false
        this.show = true
        this.page = 0
        this.onLoad()
      },
      detailHandle(id) {
        this.$router.push('/user_center/question_detail?id=' + id)
      },
      onLoad() {
        this.loading = true
        this.page++
        this.$request.post('/app/jqGrid/question/list', {rows: 20, page: this.page, title: this.value}).then(res => {
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
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .search-wrapper {
    /deep/ .van-overlay, /deep/ .van-popup{
      position: absolute;
      top: 48px;
    }
  }
</style>
