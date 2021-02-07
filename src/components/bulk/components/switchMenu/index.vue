<template>
  <div class="component-switchMenu">
    <div class="menu-item-x" v-for="(item, index) in nav" :key="index" @click="toPage(item,index)">
      <img :src="index == navIndex ? item.src :item.nosrc" alt="" />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'switchMenu',
  data() {
    return {
      navIndex:0,
      nav: [
        {
          name: '营收',
          src: require('./profit.png'),
          nosrc: require('./profitno.png')
        },
        {
          name: '订单',
          src: require('./order.png'),
          nosrc: require('./orderno.png')
        },
        {
          name: '活动',
          src: require('./activity.png'),
          nosrc: require('./activityno.png')
        },
        {
          name: '售后',
          src: require('./saleafter.png'),
          nosrc: require('./saleafterno.png')
        }
      ]
    }
  },
  methods:{
      toPage(item,index){
          this.navIndex = index;
      }
  }
}
</script>
<style>
.component-switchMenu {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding:5px 0;
  height: 70px;
  box-sizing: border-box;
}
.menu-item-x {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color:#666666;
  width:50px;
}
.menu-item-x img {
  width: 30px;
}
.menu-item-x span {
  margin-top:4px;
  font-weight: 200;
  font-size: 14px;
}
</style>