<template>
  <div class='card'>
    <div class="left">
      <div class="name">
        加油山西小程序
      </div>
      <div class="title">
        {{item.cardTemplateName}}
      </div>
      <div class="time">
       <p v-html='stateText'></p>
      </div>
    </div>
    <div class="right">
      <van-button round type="info" color='rgba(240, 44, 45, 1)' size='small' @click="toDetail(item.id)">查看详情</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      item:{
        type:Object,
        default: ()=>{}
      }
    },
    data() {
      return {

      }
    },
    methods:{
      toDetail(id) {
        let url = {
          path: "/enjoy_card_detail",
          query:{
            id: id
          }
        }
        this.$router.push(url)
      }
    },
    computed:{
      stateText() {
        if(this.item.state == "APPLY") {
          return "先享卡申请中"
        } else if(this.item.state == "ONGOING") {
          return `${this.item.actEffEndTime}前，${this.item.totalObjective}`
        } else if(this.item.state == 'CHECKING') {
          return "约定到期核对中"
        } else if(this.item.state == 'FINISHED') {
          return `${this.item.totalObjective}<span style='color:#F02C2D'>(已完成约定)</span>`
        } else if(this.item.state == 'UNFINISHED') {
          return `${this.item.totalObjective}<span style='color:#F02C2D'>(未完成约定)</span>`
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .card{
    padding: 10px;
    padding-left: 30px;
    border-radius: 4px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    position relative;
    color: #333;
    font-family: PingFangSC-Medium, PingFang SC;
    display: flex;
    justify-content: space-between;
    /deep/ .van-button--small{
      height: 28px !important;
    }
    &::before{
      content:"";
      width 16px;
      height: 16px;
      background: url(../images/store.png)no-repeat;
      background-size: 100% 100%;
      position absolute;
      top: 8px;
      left: 8px;
    }
    
    .title{
      font-size: 14px;
      font-weight: 600;
      line-height: 34px;
    }
    .time{
      color: #999999;
    }
    .right{
      display: flex;
      align-items: center;
    }
  }
</style>