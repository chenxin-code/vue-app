export default {
  data() {
    return {
      lazyLoadedData: false
    }
  },
  props: ['isScrollPage', 'scrollSite'],
  watch: {
    'scrollSite' : function(val, oldVal) {
      if (this.lazyLoadedData) return ;
      if (val + document.documentElement.clientHeight * 1.3 > this.$el.offsetTop) {
        this.lazyLoadedData = true
        if (this.lazyLoadPageData) {
          this.lazyLoadPageData()
        }
      }
    }
  },
  mounted() {
    if (this.isScrollPage) {
      if (this.lazyLoadedData) return ;
      if (document.documentElement.clientHeight * 1.3 > this.$el.offsetTop) {
        this.lazyLoadedData = true
        if (this.lazyLoadPageData) {
          this.lazyLoadPageData()
        }
      }
    } else {
      if (this.lazyLoadPageData) {
        this.lazyLoadPageData()
      }
    }
  }
}
