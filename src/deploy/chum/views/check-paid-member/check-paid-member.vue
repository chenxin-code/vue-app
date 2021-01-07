<template>
  <div></div>
</template>

<script>
  import {Dialog} from 'vant';
  export default {
    name: "check-paid-member",
    data() {
      return {
        behalfInfo: {
          paidMember: 0
        }
      }
    },
    created() {
      this.getBehalf()
    },
    methods: {
      getBehalf() {
        this.$Loading.open()
        this.$http.post('/app/json/user/getUserBehalf', {}).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (!data.paidMember) {
              this.$emit('successHandler')
            } else {
              Dialog.alert({
                title: '提示',
                message: '您还不是付费会员！',
              }).then(() => {
                this.$emit('failHandler')
              });
            }
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`getUserBehalf err ${err}`)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
