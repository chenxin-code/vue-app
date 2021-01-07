<template>
  <div>
    <nav-top title="外省卡绑定" @backEvent="backEvent"></nav-top>
    <nav-content>
      <component :is="modalType" @addProCard="addProCard" @goCardlist="goCardlist" :cardListData="cardListData"></component>
    </nav-content>
  </div>
</template>
<script>
  export default {
    components: {
      CardList: () => import('./components/card-list'),
      AddProCard: () => import('./components/add-pro-card')
    },
    data() {
      return {
        modalType: 'CardList',
        cardListData: []
      }
    },
    mounted() {
      this.getCardList()
    },
    methods: {
      backEvent: function () {
        if (this.modalType == 'AddProCard') {
          this.modalType = 'CardList'
        } else {
          this.$router.go(-1)
        }
      },
      getCardList() {
        this.$request.post('/app/json/card/getOtherProvincesCardList').then(res => {
          if (res.status == 0) {
            this.modalType = 'CardList'
            // if (res.data.cardList && res.data.cardList.length) {
            this.cardListData = res.data
            //   this.modalType = 'CardList'
            // } else {
            //   this.modalType = 'AddProCard'
            // }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      addProCard() {
        this.modalType = 'AddProCard'
      },
      goCardlist() {
        this.getCardList()
        this.modalType = 'CardList'
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';


</style>