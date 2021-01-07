<template>
  <div class='service'>
    <div class="left">
      <h2><img class='eq-img' :src="item.equityPic" alt="">{{item.equityName}}{{item.number | eqTime}}</h2>
      <p v-if='item.type == 1' class='time'>有效期：{{item.equityEndTime | momentTime}}</p>
      <p v-else-if='item.type == 3' class='time'>使用时间：{{item.useTime | momentTime }}</p>
      <p v-else-if='item.type == 2' class='time'>过期时间：{{item.equityEndTime | momentTime }}</p>
    </div>
    <div class="right">
      
      <p v-if='item.type==1' class='use' @click='useEq(item)'>立即使用</p>
      <p v-else-if='item.type == 3' class='use' @click='viewDetail(item)'>使用详情</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
  export default {
    props:{
      item:{
        type: Object,
        default:()=>{}
      }
    },
    methods:{
      useEq(item){
        window.localStorage.setItem('eqItem',JSON.stringify(item))
        this.$router.push({
          path:'/rights_introduce'
        })
      },
      viewDetail(item) {
        let obj = {
          path:'/service_detail',
          query:{
            id: item.id,
            equityType: item.equityType
          }
        }
        this.$router.push(obj)
      }
      
    },
    filters:{
      momentTime(val) {
        if(val == 1) {
          return '永久有效'
        }
        return moment(val).format("YYYY-MM-DD")
      },
      eqTime(val) {
        if(Number(val) >= 1) {
          return val + '次'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.service{
  padding: 10px;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.3);
  border-radius: 4px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  h2{
    font-size: 16px;
    margin-bottom:15px;
    color:#333333;
    position relative
    padding-left: 4px;
    .eq-img{
      width 24px;
      height 24px;
      vertical-align: middle;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
  .time{
    font-size: 12px;
    color:#999999;
  }
  .right{
    display: flex;
    align-items: center;
    .use{
      background-color #D52E40;
      color: #fff;
      padding: 1px 8px;
      border-radius: 15px;
    }
  }
}
</style>