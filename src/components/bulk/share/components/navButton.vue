<template>
  <div class="bulk_nav_components">
    <div :class="showMore?'tans tans-open':'tans tans-closed'">
        <div v-for="item in navConfig" :key="item.label" class="nav_item" @click="linkTo(item)">
            <img :src="getImg(item.img)" width="20px"/>
            <div v-if="item.label" class="nav_title">{{item.label}}</div>
       </div>
    </div>
    <div class="nav_item" @click="changeShow">
      <img :src="showMore?getImg('down'):getImg('menu')" width="20px"/>
      <div v-show="!showMore" class="nav_title">导航</div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
        navConfig:[
            {label:"首页",img:"home",path:"/common"},
            {label:"订单",img:"order",path:"/mall2/orderlist?selectedIndex=0"}
        ],
        showMore:false
    };
  },
  methods: {
    getImg(name){
      return require(`../images/icon_${name}.png`)
    },
    changeShow(){
      this.showMore=!this.showMore
    },
    linkTo(item){
      if(item.label=='首页'){
         wx.miniProgram.reLaunch({ url: `/pages/common/home/index` });
      }else{
         this.$router.push({
          path: '/mall2/orderlist',
          query: {
              selectedIndex: 0
          }
        })
      }
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
.bulk_nav_components{
    position fixed;
    bottom 200px;
    left 12px;
    width: 45px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
    opacity: 0.9;
    border-radius: 23px;  
    .tans{
        transition: height 0.3s ease; 
        overflow hidden;
        .nav_item{
          margin-top 4px
        }
    }
    .tans-open{
       height 100px
    }
    .tans-closed{
       height 0
    }

    .nav_item{
        width 45px;
        height 45px;
        display flex;
        align-items center;
        justify-content center;
        flex-direction column
    }
    .nav_title{
        height: 10px;
        font-size: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
    }
}
</style>
